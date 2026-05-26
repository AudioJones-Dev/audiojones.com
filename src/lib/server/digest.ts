/**
 * Ops Digest Builder
 * 
 * Consolidates SLO status, incidents, and capacity forecasts into a unified digest
 * for operational monitoring and Slack notifications.
 */

import 'server-only';
import { getDb } from '@/lib/server/legacyAdmin';
import { computeMultipleSLOBurns } from '@/lib/server/slo';
import { listIncidents } from '@/lib/server/incidents';

export interface OpsDigestSLO {
  id: string;
  service: string;
  status: 'healthy' | 'at-risk' | 'violating';
  achieved: number;
  target: number;
  window: '7d' | '30d';
  errorBudgetConsumed: number;
}

export interface OpsDigestIncident {
  id: string;
  title: string;
  status: 'open' | 'investigating' | 'monitoring' | 'resolved';
  severity: 'info' | 'warning' | 'critical';
  source: string;
  created_at: string;
  age_hours: number;
}

export interface OpsDigestCapacity {
  status: 'healthy' | 'warning' | 'critical';
  hours_remaining?: number;
  risk_level?: 'low' | 'medium' | 'high';
  next_threshold?: string;
  utilization_pct?: number;
}

export interface OpsDigest {
  generatedAt: string;
  slo: OpsDigestSLO[];
  incidents: OpsDigestIncident[];
  capacity?: OpsDigestCapacity;
  summary: {
    slo_healthy: number;
    slo_at_risk: number;
    slo_violating: number;
    open_incidents: number;
    critical_incidents: number;
    capacity_status: 'healthy' | 'warning' | 'critical';
  };
}

/**
 * Builds a comprehensive ops digest by querying SLO status, incidents, and capacity
 */
export async function buildOpsDigest(): Promise<OpsDigest> {
  const generatedAt = new Date().toISOString();
  console.log('🔍 Building ops digest...');

  let sloData: OpsDigestSLO[] = [];
  let incidentData: OpsDigestIncident[] = [];
  let capacityData: OpsDigestCapacity | undefined;

  // 1. Get SLO status
  try {
    console.log('📊 Fetching SLO data...');
    
    // Import and use default SLOs
    const { DEFAULT_SLOS } = await import('./defaultSLOs');
    const allSLOs = DEFAULT_SLOS;
    
    const sloResults = await computeMultipleSLOBurns(allSLOs);

    sloData = sloResults.map(burn => ({
      id: burn.sloId,
      service: burn.service,
      status: burn.status,
      achieved: burn.achieved,
      target: burn.target,
      window: burn.window,
      errorBudgetConsumed: burn.errorBudgetConsumed
    }));

    console.log(`✅ Retrieved ${sloData.length} SLOs`);
  } catch (error) {
    console.error('❌ Failed to fetch SLO data:', error);
    // Continue with empty SLO data - digest should still work
  }

  // 2. Get recent incidents (last 10, exclude resolved)
  try {
    console.log('🚨 Fetching incident data...');
    const incidents = await listIncidents({
      status: undefined, // Get all statuses initially
      limit: 20 // Get more than we need, then filter
    });

    // Filter and process incidents
    const now = new Date();
    incidentData = incidents
      .filter(incident => incident.status !== 'resolved') // Exclude resolved
      .slice(0, 10) // Take top 10
      .map(incident => {
        const createdAt = new Date(incident.created_at);
        const ageMs = now.getTime() - createdAt.getTime();
        const ageHours = Math.floor(ageMs / (1000 * 60 * 60));

        return {
          id: incident.id || 'unknown',
          title: incident.title,
          status: incident.status,
          severity: incident.severity,
          source: incident.source,
          created_at: incident.created_at,
          age_hours: ageHours
        };
      });

    console.log(`✅ Retrieved ${incidentData.length} open incidents`);
  } catch (error) {
    console.error('❌ Failed to fetch incident data:', error);
    // Continue with empty incident data
  }

  // 3. Get capacity forecast
  try {
    console.log('📈 Fetching capacity data...');
    
    // Query latest capacity scan
    const capacitySnapshot = await getDb()
      .collection('capacity_scans')
      .orderBy('timestamp', 'desc')
      .limit(1)
      .get();

    if (!capacitySnapshot.empty) {
      const latestScan = capacitySnapshot.docs[0].data();
      
      // Query predictive scans for forecast
      const predictiveSnapshot = await getDb()
        .collection('predictive_scans') 
        .orderBy('generated_at', 'desc')
        .limit(1)
        .get();

      let riskLevel: 'low' | 'medium' | 'high' = 'low';
      let hoursRemaining: number | undefined;
      let nextThreshold: string | undefined;

      if (!predictiveSnapshot.empty) {
        const forecast = predictiveSnapshot.docs[0].data();
        
        // Estimate hours remaining based on forecast
        if (forecast.capacity_forecast && forecast.capacity_forecast.length > 0) {
          const nearestThreshold = forecast.capacity_forecast.find((f: any) => 
            f.threshold_pct > (latestScan.utilization_pct || 0)
          );
          
          if (nearestThreshold) {
            hoursRemaining = nearestThreshold.hours_until || undefined;
            nextThreshold = `${nearestThreshold.threshold_pct}%`;
            
            // Determine risk level
            if (hoursRemaining && hoursRemaining < 24) {
              riskLevel = 'high';
            } else if (hoursRemaining && hoursRemaining < 72) {
              riskLevel = 'medium';
            }
          }
        }
      }

      // Determine overall status
      let status: 'healthy' | 'warning' | 'critical' = 'healthy';
      const utilization = latestScan.utilization_pct || 0;
      
      if (utilization > 90 || riskLevel === 'high') {
        status = 'critical';
      } else if (utilization > 75 || riskLevel === 'medium') {
        status = 'warning';
      }

      capacityData = {
        status,
        hours_remaining: hoursRemaining,
        risk_level: riskLevel,
        next_threshold: nextThreshold,
        utilization_pct: utilization
      };

      console.log(`✅ Retrieved capacity data: ${status} (${utilization}% utilization)`);
    } else {
      console.log('⚠️  No capacity data available');
    }
  } catch (error) {
    console.error('❌ Failed to fetch capacity data:', error);
    // Continue without capacity data
  }

  // 4. Generate summary statistics
  const summary = {
    slo_healthy: sloData.filter(s => s.status === 'healthy').length,
    slo_at_risk: sloData.filter(s => s.status === 'at-risk').length,
    slo_violating: sloData.filter(s => s.status === 'violating').length,
    open_incidents: incidentData.length,
    critical_incidents: incidentData.filter(i => i.severity === 'critical').length,
    capacity_status: capacityData?.status || 'healthy'
  };

  const digest: OpsDigest = {
    generatedAt,
    slo: sloData,
    incidents: incidentData,
    capacity: capacityData,
    summary
  };

  console.log('✅ Ops digest built successfully:', {
    slos: sloData.length,
    incidents: incidentData.length,
    capacity: !!capacityData,
    summary
  });

  return digest;
}

/**
 * Get digest generation status from Firestore
 */
export async function getDigestStatus() {
  try {
    const statusDoc = await getDb()
      .collection('ops_digest_status')
      .doc('last')
      .get();

    if (statusDoc.exists) {
      return statusDoc.data();
    }
    
    return null;
  } catch (error) {
    console.error('Failed to get digest status:', error);
    return null;
  }
}

/**
 * Update digest generation status in Firestore
 */
export async function updateDigestStatus(status: {
  sent_at: string;
  success: boolean;
  error?: string;
  digest_summary?: any;
}) {
  try {
    await getDb()
      .collection('ops_digest_status')
      .doc('last')
      .set(status, { merge: true });
      
    console.log('✅ Updated digest status');
  } catch (error) {
    console.error('❌ Failed to update digest status:', error);
  }
}

/**
 * Log digest to Firestore for historical tracking
 */
export async function logDigest(digest: OpsDigest, sent_to: string[]) {
  try {
    const timestamp = digest.generatedAt;
    const logData = {
      ...digest,
      sent_to,
      logged_at: new Date().toISOString()
    };

    await getDb()
      .collection('ops_digests')
      .doc(timestamp.replace(/[:.]/g, '-')) // Firestore-safe doc ID
      .set(logData);
      
    console.log('✅ Logged digest to Firestore');
  } catch (error) {
    console.error('❌ Failed to log digest:', error);
  }
}
