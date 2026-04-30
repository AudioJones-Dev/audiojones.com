// src/app/api/admin/audit/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getDb } from '@/lib/server/firebaseAdmin';

import { requireAdmin } from "@/lib/server/requireAdmin";

export async function GET(req: NextRequest) {
  try {
    // Admin authentication using shared helper
    requireAdmin(req);

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 500); // Cap at 500
    const action = searchParams.get('action'); // Filter by action type
    const target = searchParams.get('target'); // Filter by target email

    // Build query
    let query = getDb().collection('admin_audit_log')
      .orderBy('created_at', 'desc')
      .limit(limit);

    // Apply filters
    if (action) {
      query = query.where('action', '==', action);
    }
    
    if (target) {
      query = query.where('target_email', '==', target);
    }

    const snapshot = await query.get();
    
    const auditLogs = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    }));

    // Get summary stats
    const statsSnapshot = await getDb().collection('admin_audit_log').get();
    const allLogs = statsSnapshot.docs.map((doc: any) => doc.data());
    
    const actionCounts = allLogs.reduce((acc: any, log: any) => {
      acc[log.action] = (acc[log.action] || 0) + 1;
      return acc;
    }, {});

    const recentActivity = allLogs
      .filter((log: any) => {
        const logDate = new Date(log.created_at);
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return logDate > oneDayAgo;
      })
      .length;

    return NextResponse.json({
      logs: auditLogs,
      stats: {
        total: allLogs.length,
        action_counts: actionCounts,
        recent_24h: recentActivity
      },
      filters: {
        action,
        target,
        limit
      }
    });

  } catch (error) {
    console.error('[audit API] Error:', error);
    
    // If it's already a NextResponse (from requireAdmin), return it
    if (error instanceof NextResponse) {
      return error;
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper function to create audit log entries (used by other admin APIs)
export async function createAuditLog(
  action: string,
  targetEmail: string,
  payload: any,
  actor: string = 'admin'
) {
  try {
    await getDb().collection('admin_audit_log').add({
      action,
      actor,
      target_email: targetEmail,
      payload,
      created_at: new Date().toISOString()
    });

    console.log(`[audit] Logged action: ${action} for ${targetEmail}`);
  } catch (error) {
    console.error('[audit] Failed to create audit log:', error);
    // Don't throw - audit logging should not break the main operation
  }
}
