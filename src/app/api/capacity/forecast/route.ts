import { NextRequest } from 'next/server';
import { getDb } from '@/lib/server/firebaseAdmin';
import { deriveHoursFromPlan, isWithinWindow } from '@/lib/capacity';
import { sendAlertNotification } from '@/lib/server/notify';
import { enqueueAlertProcessing } from '@/lib/server/alertProcessing';
import { publishEvent, SUPPORTED_EVENT_TYPES } from '@/lib/server/eventBus';
import type { 
  CapacitySettings, 
  ClientContract, 
  ForecastResponse,
  CapacityAlert
} from '@/types/capacity';

/**
 * Capacity Intelligence & Forecasting API
 * 
 * Provides current capacity analysis with predictive forecasting:
 * - Current utilization metrics (MRR, hours, retainers)
 * - Risk assessment based on capacity thresholds
 * - Projected capacity status and availability dates
 * - Self-monitoring alerts for high-risk situations
 * 
 * Admin endpoint - requires authentication in production
 */

export async function GET(request: NextRequest) {
  try {
    console.log('🔮 Generating capacity forecast...');

    // Get capacity settings from Firestore
    let capacitySettings: CapacitySettings;
    try {
      const settingsDoc = await getDb().collection('capacity_settings').doc('default').get();
      if (!settingsDoc.exists) {
        console.warn('⚠️ Capacity settings not found, using defaults');
        capacitySettings = {
          slots_total: 5,
          min_retainers: 5,
          min_mrr: 26000,
          max_hours: 200,
          max_podcast_clients: 2,
          preopen_window_days: 14,
          updated_at: new Date().toISOString()
        };
      } else {
        capacitySettings = settingsDoc.data() as CapacitySettings;
      }
    } catch (error) {
      console.error('❌ Failed to load capacity settings:', error);
      throw new Error('Failed to load capacity configuration');
    }

    // Get active client contracts
    const activeStatuses = ['active', 'offboarding', 'pending_renewal'];
    const contractsSnapshot = await getDb()
      .collection('client_contracts')
      .where('status', 'in', activeStatuses)
      .get();

    const contracts: ClientContract[] = contractsSnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    } as ClientContract));

    console.log(`📋 Analyzing ${contracts.length} active contracts`);

    // Calculate current utilization metrics
    let totalMrr = 0;
    let totalHours = 0;
    let activeRetainers = 0;
    let activePodcastClients = 0;
    let earliestOpenDate: string | null = null;

    for (const contract of contracts) {
      // Add to MRR
      if (contract.monthly_fee) {
        totalMrr += contract.monthly_fee;
      }

      // Calculate hours
      const hours = contract.hours_committed || deriveHoursFromPlan(contract.plan_tier);
      totalHours += hours;

      // Count by plan type
      if (contract.plan_type === 'retainer') {
        activeRetainers++;
      } else if (contract.plan_type === 'podcast') {
        activePodcastClients++;
      }

      // Check for upcoming openings from offboarding clients
      if (contract.status === 'offboarding' && contract.next_open_date) {
        if (isWithinWindow(contract.next_open_date, capacitySettings.preopen_window_days)) {
          if (!earliestOpenDate || contract.next_open_date < earliestOpenDate) {
            earliestOpenDate = contract.next_open_date;
          }
        }
      }
    }

    // Determine current status using existing capacity logic
    let currentStatus: 'open' | 'limited' | 'full';
    if (totalMrr < capacitySettings.min_mrr || activeRetainers < capacitySettings.min_retainers) {
      currentStatus = 'open';
    } else if (totalHours >= capacitySettings.max_hours) {
      currentStatus = 'full';
    } else {
      currentStatus = 'limited';
    }

    // Calculate risk assessment based on hour utilization
    const hourUtilization = (totalHours / capacitySettings.max_hours) * 100;
    let risk: 'low' | 'medium' | 'high';
    
    if (hourUtilization >= 90) {
      risk = 'high';
    } else if (hourUtilization >= 70) {
      risk = 'medium';
    } else {
      risk = 'low';
    }

    // Simple forecast projections (7-day window)
    // For now, project current values forward (no growth model yet)
    const projectedHours7d = totalHours; // Static for v1
    const projectedMrr7d = totalMrr; // Static for v1
    
    // Project status based on current trajectory
    let projectedStatus = currentStatus;
    if (risk === 'high' && currentStatus !== 'full') {
      projectedStatus = 'full'; // High risk likely leads to full capacity
    }

    const forecast: ForecastResponse = {
      ok: true,
      current: {
        mrr: totalMrr,
        hours: totalHours,
        retainers: activeRetainers,
        status: currentStatus
      },
      forecast: {
        projected_status: projectedStatus,
        projected_open_date: earliestOpenDate,
        projected_hours_in_7d: projectedHours7d,
        projected_mrr_in_7d: projectedMrr7d,
        risk: risk
      },
      meta: {
        generated_at: new Date().toISOString(),
        source: 'capacity-forecast-v1'
      }
    };

    // Self-monitoring: Write alert if risk is high
    if (risk === 'high') {
      try {
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const alertMessage = 'Capacity utilization above 90%';
        
        // Check if alert already exists for today
        const existingAlert = await getDb()
          .collection('alerts')
          .where('type', '==', 'capacity')
          .where('message', '==', alertMessage)
          .where('created_at', '>=', today)
          .where('created_at', '<', today + 'T23:59:59Z')
          .limit(1)
          .get();

        if (existingAlert.empty) {
          const alertData = {
            type: 'capacity',
            severity: 'warning' as const,
            message: alertMessage,
            created_at: new Date().toISOString(),
            source: 'capacity-forecast',
            auto_process: true  // Enable auto-processing for capacity alerts
          };
          
          // Write alert to Firestore
          const alertRef = await getDb().collection('alerts').add(alertData);
          const alertId = alertRef.id;
          console.log('🚨 High capacity risk alert created with auto-processing enabled');
          
          // Send outbound notification
          await sendAlertNotification({
            ...alertData,
            meta: {
              current_hours: totalHours,
              max_hours: capacitySettings.max_hours,
              utilization_percent: Math.round(hourUtilization),
              risk_level: risk
            }
          });
          
          // Publish to event bus
          publishEvent(SUPPORTED_EVENT_TYPES.CAPACITY_ALERT, {
            alert_id: alertId,
            risk_level: risk,
            current_hours: totalHours,
            max_hours: capacitySettings.max_hours,
            utilization_percent: Math.round(hourUtilization),
            message: alertMessage,
            threshold_breached: 'high_capacity'
          }, {
            source: 'capacity-forecast',
            alert_type: 'capacity',
            severity: 'warning'
          }).catch(error => {
            console.error('Failed to publish capacity alert event:', error);
          });
          
          // Enqueue for auto-processing (best effort)
          await enqueueAlertProcessing(alertId);
        } else {
          console.log('🚨 High capacity risk alert already exists for today');
        }
      } catch (alertError) {
        console.error('⚠️ Failed to create capacity alert:', alertError);
        // Don't fail the whole request for alert issues
      }
    }

    console.log(`✅ Forecast complete: ${risk} risk, ${currentStatus} → ${projectedStatus}`);

    return Response.json(forecast);

  } catch (error) {
    console.error('❌ Capacity forecast failed:', error);
    
    const errorResponse: ForecastResponse = {
      ok: false,
      error: 'forecast_generation_failed',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      // Fallback forecast for error cases
      current: {
        mrr: 0,
        hours: 0,
        retainers: 0,
        status: 'limited' as const
      },
      forecast: {
        projected_status: 'limited' as const,
        projected_open_date: null,
        projected_hours_in_7d: 0,
        projected_mrr_in_7d: 0,
        risk: 'medium' as const
      },
      meta: {
        generated_at: new Date().toISOString(),
        source: 'capacity-forecast-v1-error'
      }
    };

    return Response.json(errorResponse, { status: 500 });
  }
}
