import { NextRequest } from 'next/server';
import { getFirestore } from "@/lib/legacy-stubs";
import { getDb } from '@/lib/server/firebaseAdmin';
import { deriveHoursFromPlan, isWithinWindow } from '@/lib/capacity';

/**
 * Public Capacity Management API
 * 
 * Returns current business capacity status based on:
 * - Active client contracts and MRR thresholds
 * - Hour commitments and availability windows
 * - Retainer and podcast client limits
 * 
 * Public endpoint - no authentication required
 */

interface CapacitySettings {
  slots_total: number;
  min_retainers: number;
  min_mrr: number;
  max_hours: number;
  max_podcast_clients: number;
  preopen_window_days: number;
  updated_at: string;
}

interface ClientContract {
  id: string;
  client_id: string;
  plan_tier?: string;
  plan_type?: string;
  monthly_fee?: number;
  hours_committed?: number;
  status: string;
  next_open_date?: string;
  updated_at: string;
}

interface CapacityResponse {
  availability: 'open' | 'limited' | 'full';
  is_full: boolean;
  capacity_metrics: {
    total_mrr: number;
    total_hours: number;
    active_retainers: number;
    active_podcast_clients: number;
    slots_filled: number;
    slots_total: number;
  };
  thresholds: {
    min_mrr: number;
    min_retainers: number;
    max_hours: number;
    max_podcast_clients: number;
  };
  next_open_date?: string;
  timestamp: string;
}

export async function GET(request: NextRequest) {
  try {
    console.log('📊 Checking business capacity status...');
    
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

    console.log(`📋 Found ${contracts.length} active contracts`);

    // Aggregate metrics
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

    // Apply capacity rules
    let availability: 'open' | 'limited' | 'full';
    let isFull = false;

    if (totalMrr < capacitySettings.min_mrr || activeRetainers < capacitySettings.min_retainers) {
      availability = 'open';
    } else if (totalHours >= capacitySettings.max_hours) {
      availability = 'full';
      isFull = true;
    } else {
      availability = 'limited';
    }

    const response: CapacityResponse = {
      availability,
      is_full: isFull,
      capacity_metrics: {
        total_mrr: totalMrr,
        total_hours: totalHours,
        active_retainers: activeRetainers,
        active_podcast_clients: activePodcastClients,
        slots_filled: contracts.length,
        slots_total: capacitySettings.slots_total
      },
      thresholds: {
        min_mrr: capacitySettings.min_mrr,
        min_retainers: capacitySettings.min_retainers,
        max_hours: capacitySettings.max_hours,
        max_podcast_clients: capacitySettings.max_podcast_clients
      },
      next_open_date: earliestOpenDate || undefined,
      timestamp: new Date().toISOString()
    };

    console.log(`✅ Capacity check complete: ${availability} (MRR: $${totalMrr}, Hours: ${totalHours})`);

    return Response.json({
      ok: true,
      ...response
    });

  } catch (error) {
    console.error('❌ Capacity check failed:', error);
    
    return Response.json({
      ok: false,
      error: 'capacity_check_failed',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      // Fallback response for public API
      availability: 'limited',
      is_full: false,
      capacity_metrics: {
        total_mrr: 0,
        total_hours: 0,
        active_retainers: 0,
        active_podcast_clients: 0,
        slots_filled: 0,
        slots_total: 5
      },
      thresholds: {
        min_mrr: 26000,
        min_retainers: 5,
        max_hours: 200,
        max_podcast_clients: 2
      },
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
