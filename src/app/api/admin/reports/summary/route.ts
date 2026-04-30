// src/app/api/admin/reports/summary/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getDb } from '@/lib/server/firebaseAdmin';
import { requireAdmin } from "@/lib/server/requireAdmin";

export async function GET(req: NextRequest) {
  try {
    // Admin authentication using shared helper
    requireAdmin(req);

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || 'weekly'; // daily, weekly, monthly
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    // Calculate date range
    const now = new Date();
    let dateFrom = new Date();
    
    switch (period) {
      case 'daily':
        dateFrom.setDate(now.getDate() - 7); // Last 7 days
        break;
      case 'weekly':
        dateFrom.setDate(now.getDate() - 30); // Last 30 days
        break;
      case 'monthly':
        dateFrom.setMonth(now.getMonth() - 6); // Last 6 months
        break;
    }

    if (startDate) dateFrom = new Date(startDate);
    const dateTo = endDate ? new Date(endDate) : now;

    // Parallel data fetching
    const [
      customersSnapshot,
      eventsSnapshot,
      pricingSnapshot,
      alertsSnapshot
    ] = await Promise.all([
      getDb().collection('customers').get(),
      getDb().collection('subscription_events')
        .where('timestamp', '>=', dateFrom.toISOString())
        .where('timestamp', '<=', dateTo.toISOString())
        .get(),
      getDb().collection('pricing_skus').get(),
      getDb().collection('alerts')
        .where('created_at', '>=', dateFrom.toISOString())
        .where('created_at', '<=', dateTo.toISOString())
        .get()
    ]);

    // Process customers data
    const customers = customersSnapshot.docs.map((doc: any) => doc.data());
    const activeCustomers = customers.filter((c: any) => c.status && c.status === 'active');
    const pausedCustomers = customers.filter((c: any) => c.status && c.status === 'paused');
    const canceledCustomers = customers.filter((c: any) => c.status && c.status === 'canceled');

    // Process events data
    const events = eventsSnapshot.docs.map((doc: any) => doc.data());
    const eventsByType = events.reduce((acc: any, event: any) => {
      const eventType = event.event_type || 'unknown';
      acc[eventType] = (acc[eventType] || 0) + 1;
      return acc;
    }, {});

    // Process pricing data
    const pricingSkus = pricingSnapshot.docs.map((doc: any) => doc.data());
    const activePricingSkus = pricingSkus.filter((sku: any) => sku.active === true);
    
    // Calculate revenue by SKU (approximate)
    const revenueByService = activeCustomers.reduce((acc: any, customer: any) => {
      const service = customer.service_name || 'unknown';
      acc[service] = (acc[service] || 0) + 1;
      return acc;
    }, {});

    // Process alerts data
    const alerts = alertsSnapshot.docs.map((doc: any) => doc.data());
    const alertsByType = alerts.reduce((acc: any, alert: any) => {
      const alertType = alert.type || 'unknown';
      acc[alertType] = (acc[alertType] || 0) + 1;
      return acc;
    }, {});

    // Calculate churn rate (simplified)
    const totalCustomers = customers.length;
    const churnRate = totalCustomers > 0 ? (canceledCustomers.length / totalCustomers) * 100 : 0;

    // Daily/weekly/monthly grouping
    const eventsTimeline = events.reduce((acc: any, event: any) => {
      if (!event.timestamp) return acc;
      const date = new Date(event.timestamp);
      let groupKey: string;
      
      switch (period) {
        case 'daily':
          groupKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
          break;
        case 'weekly':
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          groupKey = weekStart.toISOString().split('T')[0];
          break;
        case 'monthly':
          groupKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        default:
          groupKey = date.toISOString().split('T')[0];
      }
      
      if (!acc[groupKey]) {
        acc[groupKey] = { total: 0, by_type: {} };
      }
      
      acc[groupKey].total += 1;
      const eventType = event.event_type || 'unknown';
      acc[groupKey].by_type[eventType] = (acc[groupKey].by_type[eventType] || 0) + 1;
      
      return acc;
    }, {});

    const summary = {
      period,
      date_range: {
        from: dateFrom.toISOString(),
        to: dateTo.toISOString()
      },
      customers: {
        total: totalCustomers,
        active: activeCustomers.length,
        paused: pausedCustomers.length,
        canceled: canceledCustomers.length,
        churn_rate: Math.round(churnRate * 100) / 100
      },
      events: {
        total: events.length,
        by_type: eventsByType,
        timeline: eventsTimeline
      },
      pricing: {
        total_skus: pricingSkus.length,
        active_skus: activePricingSkus.length,
        revenue_by_service: revenueByService
      },
      alerts: {
        total: alerts.length,
        by_type: alertsByType
      },
      generated_at: new Date().toISOString()
    };

    return NextResponse.json(summary);

  } catch (error) {
    console.error('[reports/summary] Error:', error);
    
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
