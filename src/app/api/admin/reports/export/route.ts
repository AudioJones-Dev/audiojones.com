// src/app/api/admin/reports/export/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getDb } from '@/lib/server/firebaseAdmin';
import { requireAdmin } from "@/lib/server/requireAdmin";

export async function GET(req: NextRequest) {
  try {
    // Admin authentication using shared helper
    requireAdmin(req);

    // Parallel data fetching with null safety
    const [
      customersSnapshot,
      eventsSnapshot,
      alertsSnapshot
    ] = await Promise.all([
      getDb().collection('customers').get(),
      getDb().collection('subscription_events').get(),
      getDb().collection('alerts').get()
    ]);

    // Process data with defensive programming
    const customers = customersSnapshot.docs.map((doc: any) => {
      const data = doc.data();
      return {
        id: doc.id,
        whop_user_id: data.whop_user_id || null,
        email: data.email || null,
        username: data.username || null,
        avatar_image_url: data.avatar_image_url || null,
        created_at: data.created_at || null,
        updated_at: data.updated_at || null,
        subscription_tier: data.subscription_tier || null,
        subscription_status: data.subscription_status || null,
        service_name: data.service_name || null,
        status: data.status || null
      };
    });

    const events = eventsSnapshot.docs.map((doc: any) => {
      const data = doc.data();
      return {
        id: doc.id,
        event_type: data.event_type || null,
        whop_user_id: data.whop_user_id || null,
        customer_email: data.customer_email || null,
        amount: data.amount || null,
        currency: data.currency || null,
        subscription_id: data.subscription_id || null,
        tier: data.tier || null,
        timestamp: data.timestamp || null,
        processed_at: data.processed_at || null,
        billing_sku: data.billing_sku || null,
        service_name: data.service_name || null
      };
    });

    const alerts = alertsSnapshot.docs.map((doc: any) => {
      const data = doc.data();
      return {
        id: doc.id,
        type: data.type || null,
        level: data.level || null,
        message: data.message || null,
        details: data.details || null,
        created_at: data.created_at || null,
        resolved: data.resolved || null,
        resolved_at: data.resolved_at || null
      };
    });

    // Create comprehensive export payload
    const exportData = {
      generated_at: new Date().toISOString(),
      metadata: {
        total_customers: customers.length,
        total_events: events.length,
        total_alerts: alerts.length,
        export_type: 'full_admin_export',
        version: '1.0'
      },
      customers,
      events,
      alerts
    };

    // Return JSON with proper headers
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="audiojones-admin-export-${new Date().toISOString().split('T')[0]}.json"`,
        'Cache-Control': 'no-cache',
      }
    });

  } catch (error) {
    console.error('[admin/reports/export] Error:', error);
    
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
