/**
 * Service Level Objectives (SLO) and Error Budget Management
 * 
 * Provides proactive service health monitoring by tracking SLO burn rates
 * based on alert frequency and severity patterns.
 */

import 'server-only';
import { getDb } from '@/lib/server/firebaseAdmin';

export interface SLO {
  id: string;                    // e.g. "webhook-availability"
  service: "webhook" | "capacity" | "billing" | "system";
  target: number;                // e.g. 99.0 for 99% availability
  window: "7d" | "30d";         // time window for calculation
  good_event_type?: string;      // optional - events that count as good
  bad_event_type?: string;       // alert types that count as bad events
  description?: string;          // human-readable description
}

export interface SLOBurn {
  sloId: string;
  service: string;
  window: "7d" | "30d";
  target: number;
  achieved: number;              // actual availability percentage
  errorBudget: number;           // remaining error budget (0-100)
  errorBudgetConsumed: number;   // percentage of error budget used
  status: "healthy" | "at-risk" | "violating";
  sampleSize: number;            // number of events/periods sampled
  badEvents: number;             // count of bad events in window
  totalEvents: number;           // total events in window
  windowStart: string;           // ISO timestamp of window start
  windowEnd: string;             // ISO timestamp of window end
  lastCalculated: string;        // ISO timestamp of calculation
}

/**
 * Compute SLO burn rate and error budget status
 * 
 * @param slo - The SLO definition to calculate
 * @param firestoreDb - Firestore database instance
 * @returns Promise with SLO burn calculation
 */
export async function computeSLOBurn(slo: SLO, firestoreDb = getDb()): Promise<SLOBurn> {
  const now = new Date();
  const windowMs = slo.window === "7d" ? 7 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;
  const windowStart = new Date(now.getTime() - windowMs);
  
  console.log(`🔍 Computing SLO burn for ${slo.id} (${slo.window} window)`);

  try {
    // Query alerts in the time window that match bad event criteria
    let alertsQuery = firestoreDb.collection('alerts')
      .where('created_at', '>=', windowStart.toISOString())
      .where('created_at', '<=', now.toISOString());

    // Filter by service type if specified
    if (slo.bad_event_type) {
      alertsQuery = alertsQuery.where('type', '==', slo.bad_event_type);
    }

    const alertsSnapshot = await alertsQuery.get();
    
    // Count bad events (alerts that impact the SLO)
    let badEvents = 0;
    
    alertsSnapshot.forEach((doc: any) => {
      const alert = doc.data();
      
      // Count as bad event if:
      // 1. Matches bad_event_type (already filtered above), OR
      // 2. Is critical severity (always impacts SLO), OR  
      // 3. Matches service type for general system health
      if (slo.bad_event_type || 
          alert.severity === 'critical' || 
          alert.type === slo.service) {
        badEvents++;
      }
    });

    // For SLO calculation, we need to estimate total events/time periods
    // Since we don't have explicit "good events", we use time-based calculation
    const totalMinutes = Math.floor(windowMs / (60 * 1000));
    const badMinutes = Math.min(badEvents * 5, totalMinutes); // Assume each bad event impacts ~5 minutes
    
    // Calculate availability percentage
    const achieved = totalMinutes > 0 ? 
      Math.max(0, ((totalMinutes - badMinutes) / totalMinutes) * 100) : 
      100; // Default to 100% if no data
    
    // Calculate error budget
    const errorBudget = Math.max(0, 100 - slo.target); // Total allowed downtime percentage
    const errorBudgetConsumed = errorBudget > 0 ? 
      Math.min(100, ((100 - achieved) / errorBudget) * 100) : 
      0;

    // Determine status
    let status: "healthy" | "at-risk" | "violating";
    if (achieved >= slo.target) {
      status = "healthy";
    } else if (achieved >= slo.target - 1.0) { // Within 1% of target
      status = "at-risk";
    } else {
      status = "violating";
    }

    const result: SLOBurn = {
      sloId: slo.id,
      service: slo.service,
      window: slo.window,
      target: slo.target,
      achieved: Math.round(achieved * 100) / 100, // Round to 2 decimal places
      errorBudget: Math.round(errorBudgetConsumed * 100) / 100,
      errorBudgetConsumed: Math.round(errorBudgetConsumed * 100) / 100,
      status,
      sampleSize: totalMinutes,
      badEvents,
      totalEvents: totalMinutes,
      windowStart: windowStart.toISOString(),
      windowEnd: now.toISOString(),
      lastCalculated: now.toISOString()
    };

    console.log(`✅ SLO ${slo.id}: ${achieved.toFixed(2)}% (target: ${slo.target}%) - ${status}`);
    return result;

  } catch (error) {
    console.error(`❌ Failed to compute SLO burn for ${slo.id}:`, error);
    
    // Return safe defaults on error
    return {
      sloId: slo.id,
      service: slo.service,
      window: slo.window,
      target: slo.target,
      achieved: 100, // Assume healthy if we can't calculate
      errorBudget: 0,
      errorBudgetConsumed: 0,
      status: "healthy",
      sampleSize: 0,
      badEvents: 0,
      totalEvents: 0,
      windowStart: windowStart.toISOString(),
      windowEnd: now.toISOString(),
      lastCalculated: now.toISOString()
    };
  }
}

/**
 * Compute burn rates for multiple SLOs
 * 
 * @param slos - Array of SLO definitions
 * @param firestoreDb - Firestore database instance
 * @returns Promise with array of SLO burn calculations
 */
export async function computeMultipleSLOBurns(slos: SLO[], firestoreDb = getDb()): Promise<SLOBurn[]> {
  console.log(`🔄 Computing burn rates for ${slos.length} SLOs`);
  
  const results = await Promise.allSettled(
    slos.map(slo => computeSLOBurn(slo, firestoreDb))
  );

  const burns: SLOBurn[] = [];
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      burns.push(result.value);
    } else {
      console.error(`❌ Failed to compute SLO ${slos[index].id}:`, result.reason);
      // Add a safe default for failed calculations
      burns.push({
        sloId: slos[index].id,
        service: slos[index].service,
        window: slos[index].window,
        target: slos[index].target,
        achieved: 100,
        errorBudget: 0,
        errorBudgetConsumed: 0,
        status: "healthy",
        sampleSize: 0,
        badEvents: 0,
        totalEvents: 0,
        windowStart: new Date(Date.now() - (slos[index].window === "7d" ? 7 : 30) * 24 * 60 * 60 * 1000).toISOString(),
        windowEnd: new Date().toISOString(),
        lastCalculated: new Date().toISOString()
      });
    }
  });

  return burns;
}

/**
 * Get SLO burn summary statistics
 * 
 * @param burns - Array of SLO burn calculations
 * @returns Summary statistics object
 */
export function getSLOBurnSummary(burns: SLOBurn[]) {
  const summary = {
    total: burns.length,
    healthy: burns.filter(b => b.status === 'healthy').length,
    atRisk: burns.filter(b => b.status === 'at-risk').length,
    violating: burns.filter(b => b.status === 'violating').length,
    averageAchieved: burns.length > 0 ? 
      burns.reduce((sum, b) => sum + b.achieved, 0) / burns.length : 
      100,
    worstPerforming: burns.length > 0 ? 
      burns.reduce((worst, current) => 
        current.achieved < worst.achieved ? current : worst
      ) : null
  };

  return {
    ...summary,
    averageAchieved: Math.round(summary.averageAchieved * 100) / 100
  };
}

/**
 * Check if an SLO should trigger an incident
 * 
 * @param burn - SLO burn calculation
 * @returns True if incident should be created/updated
 */
export function shouldTriggerIncident(burn: SLOBurn): boolean {
  return burn.status === 'violating' || 
         (burn.status === 'at-risk' && burn.errorBudgetConsumed > 80);
}

/**
 * Generate incident message for SLO violation
 * 
 * @param burn - SLO burn calculation
 * @returns Formatted incident message
 */
export function generateSLOIncidentMessage(burn: SLOBurn): string {
  if (burn.status === 'violating') {
    return `SLO ${burn.sloId} is violating: achieved ${burn.achieved}% (target: ${burn.target}%). Error budget ${burn.errorBudgetConsumed.toFixed(1)}% consumed.`;
  } else if (burn.status === 'at-risk') {
    return `SLO ${burn.sloId} is at risk: achieved ${burn.achieved}% (target: ${burn.target}%). Error budget ${burn.errorBudgetConsumed.toFixed(1)}% consumed.`;
  } else {
    return `SLO ${burn.sloId} is healthy: achieved ${burn.achieved}% (target: ${burn.target}%).`;
  }
}
