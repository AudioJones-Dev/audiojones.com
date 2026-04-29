import { NextRequest } from 'next/server';
import { getFirestore, FieldValue } from "@/lib/legacy-stubs";
import { requireAdmin } from '@/lib/server/requireAdmin';

/**
 * System Maintenance API Route
 * 
 * Automated cleanup tasks for system health:
 * - Delete subscription_events older than 90 days
 * - Delete dismissed alerts older than 30 days  
 * - Log maintenance summary in admin_audit_log
 * 
 * This route is designed to be called by:
 * - Scheduled cron jobs (Vercel Cron, GitHub Actions, etc.)
 * - Manual admin triggers
 * - External monitoring systems
 */

interface MaintenanceResult {
  task: string;
  deleted_count: number;
  error?: string;
}

interface MaintenanceSummary {
  started_at: string;
  completed_at: string;
  total_duration_ms: number;
  tasks: MaintenanceResult[];
  total_deleted: number;
  errors: number;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const startTimestamp = new Date().toISOString();
  
  try {
    // Require admin authentication
    requireAdmin(request);
    
    console.log(`🔧 Starting maintenance cleanup initiated by admin`);
    
    // Get Firestore instance
    const db = getFirestore();
    
    const results: MaintenanceResult[] = [];
    let totalDeleted = 0;
    let errorCount = 0;

    // Task 1: Clean up old subscription events (90+ days)
    try {
      console.log('🗑️  Cleaning subscription_events older than 90 days...');
      
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      
      const oldEventsQuery = await db
        .collection('subscription_events')
        .where('received_at', '<', ninetyDaysAgo.toISOString())
        .limit(100) // Process in batches to avoid timeout
        .get();

      if (!oldEventsQuery.empty) {
        const batch = db.batch();
        oldEventsQuery.docs.forEach(doc => {
          batch.delete(doc.ref);
        });
        await batch.commit();
        
        results.push({
          task: 'subscription_events_cleanup',
          deleted_count: oldEventsQuery.size
        });
        totalDeleted += oldEventsQuery.size;
        
        console.log(`✅ Deleted ${oldEventsQuery.size} old subscription events`);
      } else {
        results.push({
          task: 'subscription_events_cleanup',
          deleted_count: 0
        });
        console.log('✅ No old subscription events to delete');
      }
    } catch (error) {
      console.error('❌ Error cleaning subscription_events:', error);
      results.push({
        task: 'subscription_events_cleanup',
        deleted_count: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      errorCount++;
    }

    // Task 2: Clean up old events from main events collection (90+ days)
    try {
      console.log('🗑️  Cleaning events older than 90 days...');
      
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      
      const oldEventsQuery = await db
        .collection('events')
        .where('timestamp', '<', ninetyDaysAgo.toISOString())
        .limit(100) // Process in batches
        .get();

      if (!oldEventsQuery.empty) {
        const batch = db.batch();
        oldEventsQuery.docs.forEach(doc => {
          batch.delete(doc.ref);
        });
        await batch.commit();
        
        results.push({
          task: 'events_cleanup',
          deleted_count: oldEventsQuery.size
        });
        totalDeleted += oldEventsQuery.size;
        
        console.log(`✅ Deleted ${oldEventsQuery.size} old events`);
      } else {
        results.push({
          task: 'events_cleanup',
          deleted_count: 0
        });
        console.log('✅ No old events to delete');
      }
    } catch (error) {
      console.error('❌ Error cleaning events:', error);
      results.push({
        task: 'events_cleanup',
        deleted_count: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      errorCount++;
    }

    // Task 3: Clean up dismissed alerts older than 30 days
    try {
      console.log('🗑️  Cleaning dismissed alerts older than 30 days...');
      
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const oldAlertsQuery = await db
        .collection('alerts')
        .where('dismissed', '==', true)
        .where('dismissed_at', '<', thirtyDaysAgo.toISOString())
        .limit(50) // Smaller batch for alerts
        .get();

      if (!oldAlertsQuery.empty) {
        const batch = db.batch();
        oldAlertsQuery.docs.forEach(doc => {
          batch.delete(doc.ref);
        });
        await batch.commit();
        
        results.push({
          task: 'dismissed_alerts_cleanup',
          deleted_count: oldAlertsQuery.size
        });
        totalDeleted += oldAlertsQuery.size;
        
        console.log(`✅ Deleted ${oldAlertsQuery.size} old dismissed alerts`);
      } else {
        results.push({
          task: 'dismissed_alerts_cleanup',
          deleted_count: 0
        });
        console.log('✅ No old dismissed alerts to delete');
      }
    } catch (error) {
      console.error('❌ Error cleaning dismissed alerts:', error);
      results.push({
        task: 'dismissed_alerts_cleanup',
        deleted_count: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      errorCount++;
    }

    // Calculate final metrics
    const endTime = Date.now();
    const duration = endTime - startTime;
    const completedTimestamp = new Date().toISOString();

    const summary: MaintenanceSummary = {
      started_at: startTimestamp,
      completed_at: completedTimestamp,
      total_duration_ms: duration,
      tasks: results,
      total_deleted: totalDeleted,
      errors: errorCount
    };

    // Log maintenance summary in admin audit log
    try {
      await db.collection('admin_audit_log').add({
        action: 'system_maintenance',
        admin_email: 'system_maintenance', // Could be enhanced to get actual admin ID later
        timestamp: completedTimestamp,
        details: summary,
        metadata: {
          duration_seconds: Math.round(duration / 1000),
          success: errorCount === 0,
          triggered_manually: true // vs cron job
        }
      });
      console.log('✅ Logged maintenance summary to audit log');
    } catch (error) {
      console.error('❌ Failed to log maintenance summary:', error);
      // Don't fail the whole operation if audit logging fails
    }

    console.log(`🎉 Maintenance completed in ${duration}ms. Deleted ${totalDeleted} records with ${errorCount} errors.`);

    return Response.json({
      ok: true,
      message: 'System maintenance completed successfully',
      summary,
      metrics: {
        duration_ms: duration,
        total_deleted: totalDeleted,
        error_count: errorCount,
        success_rate: results.length > 0 ? ((results.length - errorCount) / results.length * 100).toFixed(1) + '%' : '100%'
      }
    });

  } catch (error) {
    console.error('❌ System maintenance failed:', error);
    
    // If it's already a NextResponse (from requireAdmin), return it
    if (error instanceof Response) {
      return error;
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    return Response.json({
      ok: false,
      error: 'maintenance_failed',
      message: error instanceof Error ? error.message : 'Unknown error occurred during maintenance',
      duration_ms: duration
    }, { status: 500 });
  }
}

// GET endpoint for maintenance status/info
export async function GET(request: NextRequest) {
  try {
    // Require admin authentication
    requireAdmin(request);
    
    const db = getFirestore();
    
    // Get last maintenance run from audit log
    const lastMaintenanceQuery = await db
      .collection('admin_audit_log')
      .where('action', '==', 'system_maintenance')
      .orderBy('timestamp', 'desc')
      .limit(1)
      .get();

    let lastMaintenance = null;
    if (!lastMaintenanceQuery.empty) {
      const doc = lastMaintenanceQuery.docs[0];
      lastMaintenance = {
        id: doc.id,
        ...doc.data()
      };
    }

    // Get collection sizes for context
    const collections = ['subscription_events', 'events', 'alerts'];
    const collectionSizes: Record<string, number> = {};
    
    for (const collection of collections) {
      try {
        const snapshot = await db.collection(collection).count().get();
        collectionSizes[collection] = snapshot.data().count;
      } catch (error) {
        console.warn(`Could not get count for ${collection}:`, error);
        collectionSizes[collection] = -1; // Unknown
      }
    }

    return Response.json({
      ok: true,
      last_maintenance: lastMaintenance,
      collection_sizes: collectionSizes,
      maintenance_info: {
        subscription_events_retention: '90 days',
        events_retention: '90 days', 
        dismissed_alerts_retention: '30 days',
        batch_size: '50-100 records per run'
      }
    });

  } catch (error) {
    console.error('Maintenance status error:', error);
    
    // If it's already a NextResponse (from requireAdmin), return it
    if (error instanceof Response) {
      return error;
    }
    
    return Response.json({
      ok: false,
      error: 'internal_server_error'
    }, { status: 500 });
  }
}