import { NextRequest } from 'next/server';
import { getFirestore } from "@/lib/legacy-stubs";
import { requireAdmin } from '@/lib/server/requireAdmin';
import { AdminCustomer, safeDocCast } from '@/types/admin';

/**
 * Admin Analytics Summary API Route
 * 
 * Provides business insights and key metrics:
 * - Total customers and active subscriptions
 * - Recent activity and event counts  
 * - Churn analysis (customers without active subscriptions)
 * - Growth trends and health indicators
 * 
 * Used by admin dashboard for business intelligence.
 */

interface AnalyticsSummary {
  timestamp: string;
  customers: {
    total: number;
    active_subscriptions: number;
    inactive_subscriptions: number;
    churn_rate: number;
  };
  activity: {
    events_last_7_days: number;
    events_last_30_days: number;
    webhooks_last_24_hours: number;
  };
  subscription_tiers: Record<string, number>;
  service_distribution: Record<string, number>;
  health_indicators: {
    recent_signups: number; // last 7 days
    recent_churn: number; // last 7 days  
    average_events_per_customer: number;
  };
}

export async function GET(request: NextRequest) {
  try {
    // Require admin authentication
    requireAdmin(request);
    
    console.log('📊 Generating analytics summary...');
    
    // Get Firestore instance
    const db = getFirestore();
    
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Get all customers
    const customersSnapshot = await db.collection('customers').get();
    const customers = customersSnapshot.docs.map((doc: any) => 
      safeDocCast<AdminCustomer>(doc, {
        status: 'unknown',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        email: 'unknown@example.com'
      })
    );

    console.log(`📈 Found ${customers.length} total customers`);

    // Analyze customer data
    let activeSubscriptions = 0;
    let inactiveSubscriptions = 0;
    let recentSignups = 0;
    let recentChurn = 0;
    const tierDistribution: Record<string, number> = {};
    const serviceDistribution: Record<string, number> = {};

    customers.forEach((customer: any) => {
      // Count active vs inactive (basic heuristic: customers with status 'active')
      if (customer.status === 'active') {
        activeSubscriptions++;
      } else {
        inactiveSubscriptions++;
      }

      // Recent signups (created in last 7 days)
      if (customer.created_at) {
        const createdDate = new Date(customer.created_at);
        if (createdDate >= sevenDaysAgo) {
          recentSignups++;
        }
      }

      // Recent churn (status changed to inactive in last 7 days)
      if (customer.status !== 'active' && customer.updated_at) {
        const updatedDate = new Date(customer.updated_at);
        if (updatedDate >= sevenDaysAgo) {
          recentChurn++;
        }
      }

      // Tier distribution
      const tier = customer.tier_id || 'unknown';
      tierDistribution[tier] = (tierDistribution[tier] || 0) + 1;

      // Service distribution
      const service = customer.service_id || 'unknown';
      serviceDistribution[service] = (serviceDistribution[service] || 0) + 1;
    });

    // Calculate churn rate
    const totalCustomers = customers.length;
    const churnRate = totalCustomers > 0 ? (inactiveSubscriptions / totalCustomers) * 100 : 0;

    // Get event counts for activity analysis
    let eventsLast7Days = 0;
    let eventsLast30Days = 0;
    let webhooksLast24Hours = 0;

    try {
      // Events in last 7 days
      const recentEventsQuery = await db
        .collection('events')
        .where('timestamp', '>=', sevenDaysAgo.toISOString())
        .get();
      eventsLast7Days = recentEventsQuery.size;

      // Events in last 30 days  
      const monthlyEventsQuery = await db
        .collection('events')
        .where('timestamp', '>=', thirtyDaysAgo.toISOString())
        .get();
      eventsLast30Days = monthlyEventsQuery.size;

      // Webhook events in last 24 hours (assuming webhook events have received_at field)
      const webhookEventsQuery = await db
        .collection('subscription_events')
        .where('received_at', '>=', twentyFourHoursAgo.toISOString())
        .get();
      webhooksLast24Hours = webhookEventsQuery.size;

      console.log(`📊 Activity: ${eventsLast7Days} events (7d), ${eventsLast30Days} events (30d), ${webhooksLast24Hours} webhooks (24h)`);
    } catch (error) {
      console.warn('Could not fetch event counts:', error);
      // Continue with 0 values
    }

    // Calculate average events per customer
    const averageEventsPerCustomer = totalCustomers > 0 ? eventsLast30Days / totalCustomers : 0;

    // Build analytics summary
    const summary: AnalyticsSummary = {
      timestamp: now.toISOString(),
      customers: {
        total: totalCustomers,
        active_subscriptions: activeSubscriptions,
        inactive_subscriptions: inactiveSubscriptions,
        churn_rate: Math.round(churnRate * 100) / 100, // Round to 2 decimal places
      },
      activity: {
        events_last_7_days: eventsLast7Days,
        events_last_30_days: eventsLast30Days,
        webhooks_last_24_hours: webhooksLast24Hours,
      },
      subscription_tiers: tierDistribution,
      service_distribution: serviceDistribution,
      health_indicators: {
        recent_signups: recentSignups,
        recent_churn: recentChurn,
        average_events_per_customer: Math.round(averageEventsPerCustomer * 100) / 100,
      },
    };

    console.log('✅ Analytics summary generated successfully');

    return Response.json({
      ok: true,
      analytics: summary,
      metadata: {
        generated_at: now.toISOString(),
        data_sources: ['customers', 'events', 'subscription_events'],
        calculation_notes: {
          churn_rate: 'Calculated as inactive_subscriptions / total_customers * 100',
          active_subscriptions: 'Customers with status = "active"',
          recent_signups: 'Customers created in last 7 days',
          recent_churn: 'Customers updated to inactive status in last 7 days'
        }
      }
    });

  } catch (error) {
    console.error('❌ Analytics generation failed:', error);
    
    // If it's already a NextResponse (from requireAdmin), return it
    if (error instanceof Response) {
      return error;
    }
    
    return Response.json({
      ok: false,
      error: 'analytics_generation_failed',
      message: error instanceof Error ? error.message : 'Unknown error occurred during analytics generation'
    }, { status: 500 });
  }
}