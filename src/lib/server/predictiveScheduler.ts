/**
 * Predictive Remediation Scheduler
 * 
 * Analyzes capacity trends and creates proactive alerts before thresholds are breached.
 * Evolves the system from reactive to predictive capacity management.
 */

import 'server-only';
import { getDb } from '@/lib/server/firebaseAdmin';
import { enqueueAlertProcessing } from '@/lib/server/alertProcessing';

export interface CapacitySnapshot {
  snapshot_date: string;
  total_hours: number;
  total_mrr: number;
  projects_count: number;
  utilization_percent: number;
  capacity_risk: string;
  created_at: string;
}

export interface CapacitySettings {
  max_hours: number;
  max_projects: number;
  warning_threshold: number;
  critical_threshold: number;
  mrr_target: number;
}

export interface PredictiveForecast {
  current_utilization: number;
  trend_hours_per_day: number;
  trend_mrr_per_day: number;
  projected_3day_utilization: number;
  projected_3day_hours: number;
  projected_3day_mrr: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  days_until_capacity: number | null;
  confidence_score: number;
}

export interface PredictiveScanResult {
  ok: boolean;
  alertsCreated: number;
  forecastSummary: PredictiveForecast;
  scan_timestamp: string;
  snapshots_analyzed: number;
  existing_alerts_skipped: number;
  error?: string;
}

/**
 * Main predictive scanner - analyzes trends and creates proactive alerts
 * 
 * @returns Promise<PredictiveScanResult> - Scan results with alerts created
 */
export async function runPredictiveScan(): Promise<PredictiveScanResult> {
  const scanTimestamp = new Date().toISOString();
  console.log(`🔮 Starting predictive capacity scan at ${scanTimestamp}`);
  
  try {
    // Load capacity settings
    const settings = await loadCapacitySettings();
    if (!settings) {
      throw new Error('Capacity settings not found');
    }

    // Load recent capacity history (last 7 snapshots)
    const snapshots = await loadRecentSnapshots(7);
    if (snapshots.length < 3) {
      console.log('⚠️ Insufficient historical data for trend analysis (need at least 3 snapshots)');
      return {
        ok: true,
        alertsCreated: 0,
        forecastSummary: generateEmptyForecast(),
        scan_timestamp: scanTimestamp,
        snapshots_analyzed: snapshots.length,
        existing_alerts_skipped: 0,
        error: 'Insufficient historical data for trend analysis'
      };
    }

    // Compute trends and 3-day forecast
    const forecast = computePredictiveForecast(snapshots, settings);
    console.log(`📊 Forecast computed:`, {
      current: `${forecast.current_utilization}%`,
      projected: `${forecast.projected_3day_utilization}%`,
      trend: `${forecast.trend_hours_per_day.toFixed(1)} hrs/day`,
      risk: forecast.risk_level
    });

    // Create predictive alerts based on forecast
    const alertsResult = await createPredictiveAlerts(forecast, settings, scanTimestamp);

    // Log scan results to Firestore for audit trail
    await logScanResults({
      ok: true,
      alertsCreated: alertsResult.created,
      forecastSummary: forecast,
      scan_timestamp: scanTimestamp,
      snapshots_analyzed: snapshots.length,
      existing_alerts_skipped: alertsResult.skipped
    });

    console.log(`✅ Predictive scan complete: ${alertsResult.created} alerts created, ${alertsResult.skipped} skipped`);

    return {
      ok: true,
      alertsCreated: alertsResult.created,
      forecastSummary: forecast,
      scan_timestamp: scanTimestamp,
      snapshots_analyzed: snapshots.length,
      existing_alerts_skipped: alertsResult.skipped
    };

  } catch (error) {
    console.error('❌ Predictive scan failed:', error);
    
    const errorResult: PredictiveScanResult = {
      ok: false,
      alertsCreated: 0,
      forecastSummary: generateEmptyForecast(),
      scan_timestamp: scanTimestamp,
      snapshots_analyzed: 0,
      existing_alerts_skipped: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    };

    // Log error for debugging
    await logScanResults(errorResult);
    
    return errorResult;
  }
}

/**
 * Load capacity settings from Firestore
 */
async function loadCapacitySettings(): Promise<CapacitySettings | null> {
  try {
    const doc = await getDb().collection('capacity_settings').doc('current').get();
    
    if (!doc.exists) {
      console.warn('⚠️ No capacity settings found, using defaults');
      return {
        max_hours: 160,
        max_projects: 8,
        warning_threshold: 90,
        critical_threshold: 100,
        mrr_target: 25000
      };
    }

    return doc.data() as CapacitySettings;
  } catch (error) {
    console.error('❌ Failed to load capacity settings:', error);
    return null;
  }
}

/**
 * Load recent capacity snapshots for trend analysis
 */
async function loadRecentSnapshots(count: number): Promise<CapacitySnapshot[]> {
  try {
    const query = await getDb()
      .collection('capacity_history')
      .orderBy('created_at', 'desc')
      .limit(count)
      .get();

    const snapshots: CapacitySnapshot[] = [];
    query.forEach((doc: any) => {
      const data = doc.data();
      snapshots.push({
        snapshot_date: data.snapshot_date,
        total_hours: data.total_hours || 0,
        total_mrr: data.total_mrr || 0,
        projects_count: data.projects_count || 0,
        utilization_percent: data.utilization_percent || 0,
        capacity_risk: data.capacity_risk || 'unknown',
        created_at: data.created_at
      });
    });

    // Reverse to get chronological order (oldest first)
    return snapshots.reverse();
  } catch (error) {
    console.error('❌ Failed to load capacity snapshots:', error);
    return [];
  }
}

/**
 * Compute predictive forecast using linear regression on recent data
 */
function computePredictiveForecast(
  snapshots: CapacitySnapshot[], 
  settings: CapacitySettings
): PredictiveForecast {
  console.log(`📈 Computing forecast from ${snapshots.length} snapshots`);
  
  // Calculate time-based trends using linear regression
  const timestamps = snapshots.map(s => new Date(s.created_at).getTime());
  const hours = snapshots.map(s => s.total_hours);
  const mrr = snapshots.map(s => s.total_mrr);
  
  // Compute daily trends (slope of linear regression)
  const hoursPerDay = computeDailyTrend(timestamps, hours);
  const mrrPerDay = computeDailyTrend(timestamps, mrr);
  
  // Current state
  const currentSnapshot = snapshots[snapshots.length - 1];
  const currentUtilization = (currentSnapshot.total_hours / settings.max_hours) * 100;
  
  // Project 3 days forward
  const projectedHours = Math.max(0, currentSnapshot.total_hours + (hoursPerDay * 3));
  const projectedMrr = Math.max(0, currentSnapshot.total_mrr + (mrrPerDay * 3));
  const projectedUtilization = (projectedHours / settings.max_hours) * 100;
  
  // Calculate risk level
  let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
  if (projectedUtilization >= 100) riskLevel = 'critical';
  else if (projectedUtilization >= 90) riskLevel = 'high';
  else if (projectedUtilization >= 75) riskLevel = 'medium';
  
  // Estimate days until capacity breach
  let daysUntilCapacity: number | null = null;
  if (hoursPerDay > 0) {
    const hoursToCapacity = settings.max_hours - currentSnapshot.total_hours;
    daysUntilCapacity = Math.max(0, hoursToCapacity / hoursPerDay);
  }
  
  // Confidence score based on data quality and trend consistency
  const confidenceScore = calculateConfidenceScore(snapshots, hoursPerDay, mrrPerDay);
  
  return {
    current_utilization: Math.round(currentUtilization * 10) / 10,
    trend_hours_per_day: Math.round(hoursPerDay * 10) / 10,
    trend_mrr_per_day: Math.round(mrrPerDay * 10) / 10,
    projected_3day_utilization: Math.round(projectedUtilization * 10) / 10,
    projected_3day_hours: Math.round(projectedHours),
    projected_3day_mrr: Math.round(projectedMrr),
    risk_level: riskLevel,
    days_until_capacity: daysUntilCapacity !== null ? Math.round(daysUntilCapacity * 10) / 10 : null,
    confidence_score: Math.round(confidenceScore * 100) / 100
  };
}

/**
 * Compute daily trend using simple linear regression
 */
function computeDailyTrend(timestamps: number[], values: number[]): number {
  if (timestamps.length !== values.length || timestamps.length < 2) {
    return 0;
  }
  
  const n = timestamps.length;
  const sumX = timestamps.reduce((a, b) => a + b, 0);
  const sumY = values.reduce((a, b) => a + b, 0);
  const sumXY = timestamps.reduce((sum, x, i) => sum + x * values[i], 0);
  const sumXX = timestamps.reduce((sum, x) => sum + x * x, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  
  // Convert from milliseconds to days
  return slope * (24 * 60 * 60 * 1000);
}

/**
 * Calculate confidence score based on data consistency
 */
function calculateConfidenceScore(
  snapshots: CapacitySnapshot[], 
  hoursPerDay: number, 
  mrrPerDay: number
): number {
  if (snapshots.length < 3) return 0.3;
  
  // Base confidence from data volume
  let confidence = Math.min(0.7, snapshots.length / 10);
  
  // Boost confidence if trends are consistent
  if (Math.abs(hoursPerDay) < 5) confidence += 0.2; // Stable growth
  if (hoursPerDay > 0 && mrrPerDay > 0) confidence += 0.1; // Positive correlation
  
  return Math.min(1.0, confidence);
}

/**
 * Create predictive alerts based on forecast
 */
async function createPredictiveAlerts(
  forecast: PredictiveForecast,
  settings: CapacitySettings,
  scanTimestamp: string
): Promise<{ created: number; skipped: number }> {
  let created = 0;
  let skipped = 0;
  
  const today = new Date().toISOString().split('T')[0];
  
  // Check for predictive warning (90%+ utilization projected)
  if (forecast.projected_3day_utilization >= 90) {
    const existing = await checkExistingPredictiveAlert('predictive-warning', today);
    
    if (!existing) {
      const alertData = {
        type: 'predictive',
        severity: 'info' as const,
        message: `Predictive analysis: Capacity utilization projected to reach ${forecast.projected_3day_utilization}% in 3 days. Current trend: +${forecast.trend_hours_per_day} hours/day.`,
        created_at: scanTimestamp,
        source: 'predictive-scheduler',
        auto_process: true,
        meta: {
          forecast_type: 'predictive-warning',
          current_utilization: forecast.current_utilization,
          projected_utilization: forecast.projected_3day_utilization,
          trend_hours_per_day: forecast.trend_hours_per_day,
          days_until_capacity: forecast.days_until_capacity,
          confidence_score: forecast.confidence_score,
          scan_timestamp: scanTimestamp
        }
      };
      
      const alertRef = await getDb().collection('alerts').add(alertData);
      await enqueueAlertProcessing(alertRef.id);
      created++;
      console.log(`🟡 Created predictive warning alert: ${alertRef.id}`);
    } else {
      skipped++;
      console.log(`⏭️ Skipped duplicate predictive warning alert for ${today}`);
    }
  }
  
  // Check for predictive critical (100%+ utilization projected)
  if (forecast.projected_3day_utilization >= 100) {
    const existing = await checkExistingPredictiveAlert('predictive-critical', today);
    
    if (!existing) {
      const alertData = {
        type: 'predictive',
        severity: 'warning' as const,
        message: `CRITICAL: Capacity overload projected in 3 days (${forecast.projected_3day_utilization}%). Immediate capacity planning required. Trend: +${forecast.trend_hours_per_day} hours/day.`,
        created_at: scanTimestamp,
        source: 'predictive-scheduler',
        auto_process: true,
        meta: {
          forecast_type: 'predictive-critical',
          current_utilization: forecast.current_utilization,
          projected_utilization: forecast.projected_3day_utilization,
          trend_hours_per_day: forecast.trend_hours_per_day,
          days_until_capacity: forecast.days_until_capacity,
          confidence_score: forecast.confidence_score,
          scan_timestamp: scanTimestamp
        }
      };
      
      const alertRef = await getDb().collection('alerts').add(alertData);
      await enqueueAlertProcessing(alertRef.id);
      created++;
      console.log(`🔴 Created predictive critical alert: ${alertRef.id}`);
    } else {
      skipped++;
      console.log(`⏭️ Skipped duplicate predictive critical alert for ${today}`);
    }
  }
  
  return { created, skipped };
}

/**
 * Check if predictive alert already exists for today (idempotent behavior)
 */
async function checkExistingPredictiveAlert(forecastType: string, date: string): Promise<boolean> {
  try {
    const query = await getDb()
      .collection('alerts')
      .where('type', '==', 'predictive')
      .where('meta.forecast_type', '==', forecastType)
      .where('created_at', '>=', `${date}T00:00:00Z`)
      .where('created_at', '<=', `${date}T23:59:59Z`)
      .limit(1)
      .get();
    
    return !query.empty;
  } catch (error) {
    console.error('❌ Failed to check existing alert:', error);
    return false; // Err on side of creating alert
  }
}

/**
 * Log scan results to Firestore for audit trail
 */
async function logScanResults(result: PredictiveScanResult): Promise<void> {
  try {
    await getDb().collection('predictive_scans').add({
      ...result,
      logged_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Failed to log scan results:', error);
  }
}

/**
 * Generate empty forecast for error cases
 */
function generateEmptyForecast(): PredictiveForecast {
  return {
    current_utilization: 0,
    trend_hours_per_day: 0,
    trend_mrr_per_day: 0,
    projected_3day_utilization: 0,
    projected_3day_hours: 0,
    projected_3day_mrr: 0,
    risk_level: 'low',
    days_until_capacity: null,
    confidence_score: 0
  };
}
