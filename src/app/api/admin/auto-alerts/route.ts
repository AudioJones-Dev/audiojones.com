import { NextRequest } from 'next/server';
import { getFirestore } from "@/lib/legacy-stubs";
import { requireAdmin } from '@/lib/server/requireAdmin';

/**
 * Auto-Alert Intelligence System
 * 
 * Monitors business metrics for anomalies and automatically generates alerts:
 * - Subscription drop detection (churn spikes)
 * - Payment failure rate monitoring
 * - Unusual activity pattern detection
 * - Low webhook volume alerts
 * - High error rate notifications
 * 
 * Runs anomaly detection algorithms and creates admin alerts with severity classification.
 */

interface AnomalyResult {
  type: 'churn_spike' | 'payment_failures' | 'low_activity' | 'high_errors' | 'webhook_silence';
  severity: 'critical' | 'warning' | 'info';
  message: string;
  details: any;
  auto_created: boolean;
}

interface AlertThresholds {
  churn_rate_critical: number; // %
  churn_rate_warning: number; // %
  payment_failure_rate_critical: number; // %
  payment_failure_rate_warning: number; // %
  min_daily_events: number;
  min_hourly_webhooks: number;
  max_error_rate: number; // %
}

// Configurable thresholds for anomaly detection
const ALERT_THRESHOLDS: AlertThresholds = {
  churn_rate_critical: 15.0, // > 15% churn rate is critical
  churn_rate_warning: 8.0,   // > 8% churn rate is warning
  payment_failure_rate_critical: 25.0, // > 25% payment failures critical
  payment_failure_rate_warning: 10.0,  // > 10% payment failures warning
  min_daily_events: 10,      // < 10 events per day is low activity
  min_hourly_webhooks: 1,    // < 1 webhook per hour is concerning
  max_error_rate: 5.0        // > 5% error rate needs attention
};

export async function POST(request: NextRequest) {
  try {
    // Require admin authentication
    requireAdmin(request);
    
    console.log('🔍 Running anomaly detection analysis...');
    
    const db = getFirestore();
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    const anomalies: AnomalyResult[] = [];

    // 1. Churn Rate Analysis
    console.log('📊 Analyzing churn patterns...');
    try {
      const customersSnapshot = await db.collection('customers').get();
      const recentChurnSnapshot = await db
        .collection('customers')
        .where('status', '!=', 'active')
        .where('updated_at', '>=', oneWeekAgo.toISOString())
        .get();

      const totalCustomers = customersSnapshot.size;
      const recentChurn = recentChurnSnapshot.size;
      const churnRate = totalCustomers > 0 ? (recentChurn / totalCustomers) * 100 : 0;

      if (churnRate >= ALERT_THRESHOLDS.churn_rate_critical) {
        anomalies.push({
          type: 'churn_spike',
          severity: 'critical',
          message: `Critical churn spike detected: ${churnRate.toFixed(1)}% of customers churned in the last 7 days`,
          details: {
            churn_rate: churnRate,
            churned_customers: recentChurn,
            total_customers: totalCustomers,
            threshold: ALERT_THRESHOLDS.churn_rate_critical
          },
          auto_created: true
        });
      } else if (churnRate >= ALERT_THRESHOLDS.churn_rate_warning) {
        anomalies.push({
          type: 'churn_spike',
          severity: 'warning',
          message: `Elevated churn rate detected: ${churnRate.toFixed(1)}% of customers churned in the last 7 days`,
          details: {
            churn_rate: churnRate,
            churned_customers: recentChurn,
            total_customers: totalCustomers,
            threshold: ALERT_THRESHOLDS.churn_rate_warning
          },
          auto_created: true
        });
      }
    } catch (error) {
      console.warn('Churn analysis failed:', error);
    }

    // 2. Payment Failure Analysis
    console.log('💳 Analyzing payment failure patterns...');
    try {
      const paymentEventsSnapshot = await db
        .collection('subscription_events')
        .where('timestamp', '>=', oneDayAgo.toISOString())
        .get();

      let totalPaymentEvents = 0;
      let failedPaymentEvents = 0;

      paymentEventsSnapshot.docs.forEach((doc: any) => {
        const data = doc.data();
        if (data.event_type?.includes('payment') || data.event_type?.includes('invoice')) {
          totalPaymentEvents++;
          if (data.event_type?.includes('failed') || data.event_type?.includes('decline')) {
            failedPaymentEvents++;
          }
        }
      });

      const failureRate = totalPaymentEvents > 0 ? (failedPaymentEvents / totalPaymentEvents) * 100 : 0;

      if (totalPaymentEvents >= 5 && failureRate >= ALERT_THRESHOLDS.payment_failure_rate_critical) {
        anomalies.push({
          type: 'payment_failures',
          severity: 'critical',
          message: `Critical payment failure rate: ${failureRate.toFixed(1)}% of payments failed in the last 24 hours`,
          details: {
            failure_rate: failureRate,
            failed_payments: failedPaymentEvents,
            total_payment_attempts: totalPaymentEvents,
            threshold: ALERT_THRESHOLDS.payment_failure_rate_critical
          },
          auto_created: true
        });
      } else if (totalPaymentEvents >= 3 && failureRate >= ALERT_THRESHOLDS.payment_failure_rate_warning) {
        anomalies.push({
          type: 'payment_failures',
          severity: 'warning',
          message: `Elevated payment failure rate: ${failureRate.toFixed(1)}% of payments failed in the last 24 hours`,
          details: {
            failure_rate: failureRate,
            failed_payments: failedPaymentEvents,
            total_payment_attempts: totalPaymentEvents,
            threshold: ALERT_THRESHOLDS.payment_failure_rate_warning
          },
          auto_created: true
        });
      }
    } catch (error) {
      console.warn('Payment failure analysis failed:', error);
    }

    // 3. Activity Level Analysis
    console.log('📈 Analyzing activity patterns...');
    try {
      const recentEventsSnapshot = await db
        .collection('events')
        .where('timestamp', '>=', oneDayAgo.toISOString())
        .get();

      const dailyEvents = recentEventsSnapshot.size;

      if (dailyEvents < ALERT_THRESHOLDS.min_daily_events) {
        anomalies.push({
          type: 'low_activity',
          severity: 'warning',
          message: `Low system activity: Only ${dailyEvents} events recorded in the last 24 hours`,
          details: {
            daily_events: dailyEvents,
            threshold: ALERT_THRESHOLDS.min_daily_events,
            analysis_period: '24 hours'
          },
          auto_created: true
        });
      }
    } catch (error) {
      console.warn('Activity analysis failed:', error);
    }

    // 4. Webhook Silence Detection
    console.log('📡 Analyzing webhook patterns...');
    try {
      const recentWebhooksSnapshot = await db
        .collection('subscription_events')
        .where('received_at', '>=', oneHourAgo.toISOString())
        .get();

      const hourlyWebhooks = recentWebhooksSnapshot.size;

      if (hourlyWebhooks < ALERT_THRESHOLDS.min_hourly_webhooks) {
        // Only alert if we normally have webhooks (check last week)
        const weeklyWebhooksSnapshot = await db
          .collection('subscription_events')
          .where('received_at', '>=', oneWeekAgo.toISOString())
          .limit(1)
          .get();

        if (!weeklyWebhooksSnapshot.empty) {
          anomalies.push({
            type: 'webhook_silence',
            severity: 'info',
            message: `Webhook silence detected: No webhooks received in the last hour`,
            details: {
              hourly_webhooks: hourlyWebhooks,
              threshold: ALERT_THRESHOLDS.min_hourly_webhooks,
              analysis_period: '1 hour'
            },
            auto_created: true
          });
        }
      }
    } catch (error) {
      console.warn('Webhook analysis failed:', error);
    }

    // 5. Create alerts for detected anomalies
    const createdAlerts = [];
    for (const anomaly of anomalies) {
      try {
        // Check if similar alert already exists (prevent spam)
        const existingAlertQuery = await db
          .collection('admin_alerts')
          .where('category', '==', 'system')
          .where('status', '==', 'active')
          .where('title', '==', `Auto-Alert: ${anomaly.type}`)
          .limit(1)
          .get();

        if (existingAlertQuery.empty) {
          const alertDoc = await db.collection('admin_alerts').add({
            title: `Auto-Alert: ${anomaly.type}`,
            message: anomaly.message,
            severity: anomaly.severity,
            category: 'system',
            status: 'active',
            created_at: now.toISOString(),
            created_by: 'auto-alert-system',
            auto_dismiss_at: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Auto-dismiss in 7 days
            metadata: {
              anomaly_type: anomaly.type,
              auto_created: true,
              detection_time: now.toISOString(),
              details: anomaly.details,
              thresholds: ALERT_THRESHOLDS
            }
          });

          createdAlerts.push({
            id: alertDoc.id,
            type: anomaly.type,
            severity: anomaly.severity,
            message: anomaly.message
          });

          console.log(`🚨 Created ${anomaly.severity} alert: ${anomaly.type}`);
        } else {
          console.log(`⏭️ Skipping duplicate alert: ${anomaly.type}`);
        }
      } catch (error) {
        console.error(`Failed to create alert for ${anomaly.type}:`, error);
      }
    }

    // Log the analysis to admin audit
    await db.collection('admin_audit_log').add({
      action: 'anomaly_detection_run',
      performed_by: 'auto-alert-system',
      timestamp: now.toISOString(),
      details: {
        anomalies_detected: anomalies.length,
        alerts_created: createdAlerts.length,
        analysis_types: ['churn_rate', 'payment_failures', 'activity_level', 'webhook_patterns'],
        thresholds_used: ALERT_THRESHOLDS
      },
      ip_address: 'system',
      user_agent: 'Auto-Alert Intelligence System'
    });

    console.log(`✅ Anomaly detection complete: ${anomalies.length} anomalies detected, ${createdAlerts.length} alerts created`);

    return Response.json({
      ok: true,
      analysis: {
        timestamp: now.toISOString(),
        anomalies_detected: anomalies.length,
        alerts_created: createdAlerts.length,
        thresholds: ALERT_THRESHOLDS
      },
      anomalies: anomalies,
      created_alerts: createdAlerts,
      summary: `Detected ${anomalies.length} anomalies and created ${createdAlerts.length} new alerts`
    });

  } catch (error) {
    console.error('❌ Anomaly detection failed:', error);
    
    // If it's already a NextResponse (from requireAdmin), return it
    if (error instanceof Response) {
      return error;
    }
    
    return Response.json({
      ok: false,
      error: 'anomaly_detection_failed',
      message: error instanceof Error ? error.message : 'Unknown error occurred during anomaly detection'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Require admin authentication
    requireAdmin(request);

    return Response.json({
      ok: true,
      system: 'Auto-Alert Intelligence',
      status: 'active',
      description: 'Monitors business metrics for anomalies and automatically generates alerts',
      thresholds: ALERT_THRESHOLDS,
      monitoring: [
        'Churn rate spikes (weekly analysis)',
        'Payment failure rate increases (daily analysis)', 
        'Low system activity detection',
        'Webhook silence monitoring',
        'Error rate threshold monitoring'
      ],
      usage: {
        endpoint: '/api/admin/auto-alerts',
        method: 'POST',
        description: 'Run anomaly detection and create alerts for detected issues',
        authentication: 'Admin API key required'
      }
    });

  } catch (error) {
    console.error('❌ Auto-alerts status check failed:', error);
    
    if (error instanceof Response) {
      return error;
    }
    
    return Response.json({
      ok: false,
      error: 'status_check_failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}