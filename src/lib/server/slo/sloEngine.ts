/**
 * SLO Computation Engine
 * 
 * Computes SLO burn rates, evaluates violations, and determines
 * credit eligibility based on real-time capacity metrics.
 */

import { getDb } from '@/lib/server/firebaseAdmin';
import { lazySingleton } from '@/lib/server/lazySingleton';
import eventStreamingEngine from '@/lib/streaming/EventStreamingEngine';
import {
  SLODefinition,
  SLOMeasurement,
  SLOBurnRate,
  SLOViolation,
  BillingCredit,
  SLODashboardData,
  SLOConfiguration
} from './types';

class SLOEngine {
  private static instance: SLOEngine;
  private config: SLOConfiguration;
  private defaultSLOs: SLODefinition[];

  private constructor() {
    this.config = {
      global_settings: {
        default_window: 'rolling_24h',
        auto_credit_enabled: true,
        max_monthly_credits: 1000, // $1000 per month
        notification_channels: ['slack', 'email'],
      },
      burn_rate_windows: {
        short: 60, // 1 hour
        long: 360, // 6 hours
      },
      credit_policies: {
        minimum_violation_duration: 15, // 15 minutes
        credit_calculation_method: 'proportional',
        approval_required_above: 100, // $100
      },
    };

    this.defaultSLOs = [
      {
        id: 'api_latency_p95',
        name: 'API Response Time (P95)',
        description: '95th percentile API response time should be under 500ms',
        type: 'latency',
        target: 500, // milliseconds
        window: 'rolling_24h',
        burn_rate_thresholds: {
          alert: 50, // 50% error budget consumed
          critical: 80, // 80% error budget consumed
        },
        credit_policy: {
          enabled: true,
          credit_per_breach: 25,
          max_credits_per_month: 200,
          qualifying_breach_duration: 30,
        },
        measurement: {
          metric_source: 'logs',
          query_config: {
            collection: 'request_logs',
            latency_field: 'response_time_ms',
            percentile: 95,
          },
        },
        enabled: true,
        created_at: Date.now(),
        updated_at: Date.now(),
      },
      {
        id: 'webhook_success_rate',
        name: 'Webhook Delivery Success Rate',
        description: 'Webhook deliveries should succeed 99.5% of the time',
        type: 'availability',
        target: 99.5, // percentage
        window: 'rolling_24h',
        burn_rate_thresholds: {
          alert: 40,
          critical: 70,
        },
        credit_policy: {
          enabled: true,
          credit_per_breach: 50,
          max_credits_per_month: 300,
          qualifying_breach_duration: 20,
        },
        measurement: {
          metric_source: 'firestore',
          query_config: {
            collection: 'webhook_deliveries',
            success_field: 'success',
            timestamp_field: 'delivered_at',
          },
        },
        enabled: true,
        created_at: Date.now(),
        updated_at: Date.now(),
      },
      {
        id: 'system_uptime',
        name: 'System Uptime',
        description: 'System should be available 99.9% of the time',
        type: 'availability',
        target: 99.9, // percentage
        window: 'rolling_30d',
        burn_rate_thresholds: {
          alert: 60,
          critical: 85,
        },
        credit_policy: {
          enabled: true,
          credit_per_breach: 100,
          max_credits_per_month: 500,
          qualifying_breach_duration: 60,
        },
        measurement: {
          metric_source: 'synthetic',
          query_config: {
            endpoint: '/api/public/status',
            check_interval: 300, // 5 minutes
          },
        },
        enabled: true,
        created_at: Date.now(),
        updated_at: Date.now(),
      },
    ];

    console.log('📊 SLO Engine initialized with default SLOs');
  }

  static getInstance(): SLOEngine {
    if (!SLOEngine.instance) {
      SLOEngine.instance = new SLOEngine();
    }
    return SLOEngine.instance;
  }

  /**
   * Compute SLO burn rate for a given SLO definition
   */
  async computeSLOBurn(sloId: string, windowStart?: number, windowEnd?: number): Promise<SLOBurnRate> {
    const db = getDb();
    const now = Date.now();
    
    // Get SLO definition
    const sloDoc = await db.collection('slo_definitions').doc(sloId).get();
    if (!sloDoc.exists) {
      // Try to find in default SLOs
      const defaultSLO = this.defaultSLOs.find(s => s.id === sloId);
      if (!defaultSLO) {
        throw new Error(`SLO definition not found: ${sloId}`);
      }
    }

    const slo: SLODefinition = sloDoc.exists ? sloDoc.data() as SLODefinition : this.defaultSLOs.find(s => s.id === sloId)!;

    // Calculate window bounds
    if (!windowStart || !windowEnd) {
      const windowMs = this.getWindowDuration(slo.window);
      windowEnd = now;
      windowStart = now - windowMs;
    }

    // Get measurements for the window
    const measurements = await this.getMeasurements(slo, windowStart, windowEnd);
    
    if (measurements.length === 0) {
      return this.createEmptyBurnRate(sloId, windowStart, windowEnd);
    }

    // Calculate burn rate based on SLO type
    let burnRate: SLOBurnRate;
    
    switch (slo.type) {
      case 'latency':
        burnRate = this.calculateLatencyBurnRate(slo, measurements, windowStart, windowEnd);
        break;
      case 'availability':
      case 'error_rate':
        burnRate = this.calculateAvailabilityBurnRate(slo, measurements, windowStart, windowEnd);
        break;
      case 'throughput':
        burnRate = this.calculateThroughputBurnRate(slo, measurements, windowStart, windowEnd);
        break;
      default:
        throw new Error(`Unsupported SLO type: ${slo.type}`);
    }

    // Store burn rate measurement
    await db.collection('slo_burn_rates').doc(`${sloId}_${windowStart}`).set(burnRate);

    return burnRate;
  }

  /**
   * Evaluate all SLOs and detect violations
   */
  async evaluateSLOs(organizationId?: string): Promise<{
    burn_rates: SLOBurnRate[];
    violations: SLOViolation[];
    credits_issued: BillingCredit[];
  }> {
    const db = getDb();
    const results = {
      burn_rates: [] as SLOBurnRate[],
      violations: [] as SLOViolation[],
      credits_issued: [] as BillingCredit[],
    };

    // Get all active SLOs
    let slosQuery = db.collection('slo_definitions').where('enabled', '==', true);
    if (organizationId) {
      slosQuery = slosQuery.where('organization_id', '==', organizationId);
    }

    const slosSnapshot = await slosQuery.get();
    const slos = slosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SLODefinition));

    // Add default SLOs if no custom ones exist
    if (slos.length === 0 && !organizationId) {
      slos.push(...this.defaultSLOs);
    }

    // Evaluate each SLO
    for (const slo of slos) {
      try {
        // Compute current burn rate
        const burnRate = await this.computeSLOBurn(slo.id);
        results.burn_rates.push(burnRate);

        // Check for violations
        const violation = await this.checkForViolation(slo, burnRate);
        if (violation) {
          results.violations.push(violation);

          // Issue credit if eligible
          if (this.config.global_settings.auto_credit_enabled && slo.credit_policy.enabled) {
            const credit = await this.issueCreditForViolation(slo, violation);
            if (credit) {
              results.credits_issued.push(credit);
            }
          }
        }
      } catch (error) {
        console.error(`Error evaluating SLO ${slo.id}:`, error);
      }
    }

    // Publish evaluation event
    await eventStreamingEngine.publishEvent({
      type: 'slo.evaluation.completed',
      source: 'SLOEngine',
      data: {
        organization_id: organizationId,
        slos_evaluated: slos.length,
        violations_detected: results.violations.length,
        credits_issued: results.credits_issued.length,
        total_credit_amount: results.credits_issued.reduce((sum, c) => sum + c.amount, 0),
      },
      metadata: {
        version: 1,
      },
    });

    return results;
  }

  private async getMeasurements(slo: SLODefinition, windowStart: number, windowEnd: number): Promise<SLOMeasurement[]> {
    const db = getDb();

    switch (slo.measurement.metric_source) {
      case 'firestore':
        return this.getMeasurementsFromFirestore(slo, windowStart, windowEnd);
      case 'logs':
        return this.getMeasurementsFromLogs(slo, windowStart, windowEnd);
      case 'synthetic':
        return this.getMeasurementsFromSynthetic(slo, windowStart, windowEnd);
      default:
        throw new Error(`Unsupported metric source: ${slo.measurement.metric_source}`);
    }
  }

  private async getMeasurementsFromFirestore(slo: SLODefinition, windowStart: number, windowEnd: number): Promise<SLOMeasurement[]> {
    const db = getDb();
    const config = slo.measurement.query_config;
    
    // Query the specified collection
    const query = db.collection(config.collection)
      .where(config.timestamp_field || 'timestamp', '>=', windowStart)
      .where(config.timestamp_field || 'timestamp', '<=', windowEnd)
      .orderBy(config.timestamp_field || 'timestamp')
      .limit(10000);

    const snapshot = await query.get();
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      const timestamp = data[config.timestamp_field || 'timestamp'];
      
      let value: number;
      let success: boolean;

      if (slo.type === 'availability') {
        success = data[config.success_field] === true;
        value = success ? 100 : 0;
      } else {
        value = data[config.latency_field] || 0;
        success = value <= slo.target;
      }

      return {
        id: doc.id,
        slo_id: slo.id,
        timestamp,
        value,
        success,
        metadata: { source: 'firestore', doc_id: doc.id },
      };
    });
  }

  private async getMeasurementsFromLogs(slo: SLODefinition, windowStart: number, windowEnd: number): Promise<SLOMeasurement[]> {
    // Simulate log-based measurements
    // In real implementation, this would query log aggregation system
    const measurements: SLOMeasurement[] = [];
    const intervalMs = 60000; // 1 minute intervals
    
    for (let time = windowStart; time <= windowEnd; time += intervalMs) {
      // Simulate measurements with some realistic variance
      const baseLatency = 200 + Math.sin(time / 3600000) * 50; // Hourly pattern
      const noise = (Math.random() - 0.5) * 100;
      const value = Math.max(50, baseLatency + noise);
      
      measurements.push({
        id: `log_${time}`,
        slo_id: slo.id,
        timestamp: time,
        value,
        success: value <= slo.target,
        metadata: { source: 'logs', simulated: true },
      });
    }

    return measurements;
  }

  private async getMeasurementsFromSynthetic(slo: SLODefinition, windowStart: number, windowEnd: number): Promise<SLOMeasurement[]> {
    // Simulate synthetic monitoring results
    const measurements: SLOMeasurement[] = [];
    const config = slo.measurement.query_config;
    const intervalMs = (config.check_interval || 300) * 1000; // Convert seconds to ms
    
    for (let time = windowStart; time <= windowEnd; time += intervalMs) {
      // Simulate uptime with occasional failures
      const success = Math.random() > 0.002; // 99.8% success rate
      
      measurements.push({
        id: `synthetic_${time}`,
        slo_id: slo.id,
        timestamp: time,
        value: success ? 100 : 0,
        success,
        metadata: { source: 'synthetic', endpoint: config.endpoint },
      });
    }

    return measurements;
  }

  private calculateLatencyBurnRate(slo: SLODefinition, measurements: SLOMeasurement[], windowStart: number, windowEnd: number): SLOBurnRate {
    const totalRequests = measurements.length;
    const failedRequests = measurements.filter(m => !m.success).length;
    
    // For latency SLOs, error budget is based on percentage of requests exceeding target
    const allowedFailures = totalRequests * (1 - slo.target / 100); // Assuming target is a percentage for this calculation
    const actualFailures = failedRequests;
    
    const errorBudgetConsumed = allowedFailures > 0 ? (actualFailures / allowedFailures) * 100 : 0;
    const burnRate = errorBudgetConsumed; // Simplified burn rate calculation

    return this.createBurnRate(slo.id, windowStart, windowEnd, totalRequests, failedRequests, errorBudgetConsumed, burnRate);
  }

  private calculateAvailabilityBurnRate(slo: SLODefinition, measurements: SLOMeasurement[], windowStart: number, windowEnd: number): SLOBurnRate {
    const totalRequests = measurements.length;
    const successfulRequests = measurements.filter(m => m.success).length;
    const failedRequests = totalRequests - successfulRequests;
    
    const actualAvailability = totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 100;
    const targetAvailability = slo.target;
    
    // Error budget is the difference between 100% and target
    const totalErrorBudget = 100 - targetAvailability;
    const consumedErrorBudget = Math.max(0, targetAvailability - actualAvailability);
    
    const errorBudgetConsumed = totalErrorBudget > 0 ? (consumedErrorBudget / totalErrorBudget) * 100 : 0;
    const burnRate = errorBudgetConsumed;

    return this.createBurnRate(slo.id, windowStart, windowEnd, totalRequests, failedRequests, errorBudgetConsumed, burnRate);
  }

  private calculateThroughputBurnRate(slo: SLODefinition, measurements: SLOMeasurement[], windowStart: number, windowEnd: number): SLOBurnRate {
    const totalRequests = measurements.length;
    const windowDurationHours = (windowEnd - windowStart) / (1000 * 60 * 60);
    const actualThroughput = totalRequests / windowDurationHours;
    
    const failedRequests = actualThroughput < slo.target ? 1 : 0;
    const errorBudgetConsumed = actualThroughput < slo.target ? 100 : 0;

    return this.createBurnRate(slo.id, windowStart, windowEnd, totalRequests, failedRequests, errorBudgetConsumed, errorBudgetConsumed);
  }

  private createBurnRate(sloId: string, windowStart: number, windowEnd: number, totalRequests: number, failedRequests: number, errorBudgetConsumed: number, burnRate: number): SLOBurnRate {
    let status: SLOBurnRate['status'] = 'healthy';
    if (errorBudgetConsumed >= 80) status = 'critical';
    else if (errorBudgetConsumed >= 50) status = 'warning';

    const projection: SLOBurnRate['projection'] = {};
    if (burnRate > 0 && errorBudgetConsumed < 100) {
      const remainingBudget = 100 - errorBudgetConsumed;
      const hoursToExhaustion = remainingBudget / (burnRate / 24); // Assuming 24h burn rate
      projection.budget_exhausted_at = Date.now() + (hoursToExhaustion * 60 * 60 * 1000);
      projection.days_remaining = hoursToExhaustion / 24;
    }

    return {
      slo_id: sloId,
      window_start: windowStart,
      window_end: windowEnd,
      total_requests: totalRequests,
      failed_requests: failedRequests,
      error_budget_consumed: Math.min(100, Math.max(0, errorBudgetConsumed)),
      burn_rate: Math.max(0, burnRate),
      projection,
      status,
      calculated_at: Date.now(),
    };
  }

  private createEmptyBurnRate(sloId: string, windowStart: number, windowEnd: number): SLOBurnRate {
    return {
      slo_id: sloId,
      window_start: windowStart,
      window_end: windowEnd,
      total_requests: 0,
      failed_requests: 0,
      error_budget_consumed: 0,
      burn_rate: 0,
      projection: {},
      status: 'healthy',
      calculated_at: Date.now(),
    };
  }

  private async checkForViolation(slo: SLODefinition, burnRate: SLOBurnRate): Promise<SLOViolation | null> {
    const db = getDb();
    
    // Check if burn rate exceeds thresholds
    let severity: 'warning' | 'critical' | null = null;
    if (burnRate.error_budget_consumed >= slo.burn_rate_thresholds.critical) {
      severity = 'critical';
    } else if (burnRate.error_budget_consumed >= slo.burn_rate_thresholds.alert) {
      severity = 'warning';
    }

    if (!severity) return null;

    // Check if there's already an active violation
    const existingViolationQuery = await db.collection('slo_violations')
      .where('slo_id', '==', slo.id)
      .where('status', '==', 'active')
      .limit(1)
      .get();

    const now = Date.now();

    if (!existingViolationQuery.empty) {
      // Update existing violation
      const violationDoc = existingViolationQuery.docs[0];
      const violation = violationDoc.data() as SLOViolation;
      
      await violationDoc.ref.update({
        burn_rate_peak: Math.max(violation.burn_rate_peak, burnRate.burn_rate),
        error_budget_consumed: burnRate.error_budget_consumed,
        severity: severity === 'critical' ? 'critical' : violation.severity, // Escalate severity if needed
      });

      return { ...violation, severity };
    }

    // Create new violation
    const violation: SLOViolation = {
      id: `violation_${slo.id}_${now}`,
      slo_id: slo.id,
      started_at: now,
      severity,
      burn_rate_peak: burnRate.burn_rate,
      error_budget_consumed: burnRate.error_budget_consumed,
      impact_description: `SLO ${slo.name} is consuming error budget at ${burnRate.burn_rate.toFixed(1)}% rate`,
      credit_issued: false,
      organization_id: slo.organization_id,
      status: 'active',
      created_at: now,
    };

    // Store violation
    await db.collection('slo_violations').doc(violation.id).set(violation);

    // Publish violation event
    await eventStreamingEngine.publishEvent({
      type: 'slo.violation.detected',
      source: 'SLOEngine',
      data: {
        slo_id: slo.id,
        slo_name: slo.name,
        violation_id: violation.id,
        severity,
        burn_rate: burnRate.burn_rate,
        error_budget_consumed: burnRate.error_budget_consumed,
        organization_id: slo.organization_id,
      },
      metadata: {
        version: 1,
        correlationId: `slo_violation_${violation.id}`,
      },
    });

    return violation;
  }

  private async issueCreditForViolation(slo: SLODefinition, violation: SLOViolation): Promise<BillingCredit | null> {
    const db = getDb();

    // Check if violation qualifies for credit
    if (violation.severity === 'warning') return null; // Only issue credits for critical violations
    
    // Check monthly credit limits
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    
    const monthlyCreditsQuery = await db.collection('billing_credits')
      .where('organization_id', '==', slo.organization_id || 'system')
      .where('issued_at', '>=', monthStart.getTime())
      .where('reason', '==', 'slo_breach')
      .get();

    const monthlyCreditsTotal = monthlyCreditsQuery.docs
      .reduce((sum, doc) => sum + (doc.data().amount || 0), 0);

    if (monthlyCreditsTotal >= slo.credit_policy.max_credits_per_month) {
      console.log(`Monthly credit limit reached for SLO ${slo.id}`);
      return null;
    }

    // Calculate credit amount
    let creditAmount = slo.credit_policy.credit_per_breach;
    if (this.config.credit_policies.credit_calculation_method === 'proportional') {
      // Scale credit based on error budget consumed
      const scaleFactor = Math.min(2.0, violation.error_budget_consumed / 100);
      creditAmount = Math.round(creditAmount * scaleFactor);
    }

    // Create credit
    const credit: BillingCredit = {
      id: `credit_${violation.id}_${Date.now()}`,
      organization_id: slo.organization_id || 'system',
      amount: creditAmount,
      reason: 'slo_breach',
      reference_id: violation.id,
      reference_type: 'slo_violation',
      description: `Automated credit for SLO breach: ${slo.name}`,
      issued_at: Date.now(),
      issued_by: 'system',
      status: 'pending',
      metadata: {
        slo_id: slo.id,
        slo_name: slo.name,
        burn_rate: violation.burn_rate_peak,
        error_budget_consumed: violation.error_budget_consumed,
      },
    };

    // Store credit
    await db.collection('billing_credits').doc(credit.id).set(credit);

    // Update violation to mark credit as issued
    await db.collection('slo_violations').doc(violation.id).update({
      credit_issued: true,
      credit_amount: creditAmount,
    });

    // Publish credit issued event
    await eventStreamingEngine.publishEvent({
      type: 'billing.credit.issued',
      source: 'SLOEngine',
      data: {
        credit_id: credit.id,
        organization_id: credit.organization_id,
        amount: credit.amount,
        reason: credit.reason,
        reference_id: credit.reference_id,
        slo_name: slo.name,
      },
      metadata: {
        version: 1,
        correlationId: `credit_${credit.id}`,
      },
    });

    console.log(`💳 Issued credit: $${creditAmount} for SLO violation ${violation.id}`);
    return credit;
  }

  private getWindowDuration(window: SLODefinition['window']): number {
    switch (window) {
      case 'rolling_24h': return 24 * 60 * 60 * 1000;
      case 'rolling_7d': return 7 * 24 * 60 * 60 * 1000;
      case 'rolling_30d': return 30 * 24 * 60 * 60 * 1000;
      case 'calendar_month': {
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        return now.getTime() - monthStart.getTime();
      }
      default: return 24 * 60 * 60 * 1000;
    }
  }

  /**
   * Get dashboard data for SLO overview
   */
  async getDashboardData(organizationId?: string): Promise<SLODashboardData> {
    const db = getDb();
    
    // Get all active SLOs
    let slosQuery = db.collection('slo_definitions').where('enabled', '==', true);
    if (organizationId) {
      slosQuery = slosQuery.where('organization_id', '==', organizationId);
    }

    const slosSnapshot = await slosQuery.get();
    const slos = slosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SLODefinition));

    // Add default SLOs if no custom ones
    if (slos.length === 0 && !organizationId) {
      slos.push(...this.defaultSLOs);
    }

    // Get active violations
    const violationsQuery = await db.collection('slo_violations')
      .where('status', '==', 'active')
      .get();
    const activeViolations = violationsQuery.docs.length;

    // Get monthly credits
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    
    const creditsQuery = await db.collection('billing_credits')
      .where('issued_at', '>=', monthStart.getTime())
      .where('reason', '==', 'slo_breach')
      .get();
    
    const creditsThisMonth = creditsQuery.docs
      .reduce((sum, doc) => sum + (doc.data().amount || 0), 0);

    // Calculate overall health and performance data
    const sloPerformance = await Promise.all(
      slos.map(async (slo) => {
        try {
          const burnRate = await this.computeSLOBurn(slo.id);
          return {
            slo_id: slo.id,
            name: slo.name,
            current_availability: Math.max(0, 100 - burnRate.error_budget_consumed),
            target: slo.target,
            status: burnRate.status,
            burn_rate: burnRate.burn_rate,
            time_to_exhaustion: burnRate.projection.budget_exhausted_at,
          };
        } catch (error) {
          return {
            slo_id: slo.id,
            name: slo.name,
            current_availability: 0,
            target: slo.target,
            status: 'healthy' as const,
            burn_rate: 0,
          };
        }
      })
    );

    // Determine overall health
    let overallHealth: 'healthy' | 'warning' | 'critical' = 'healthy';
    if (sloPerformance.some(s => s.status === 'critical')) {
      overallHealth = 'critical';
    } else if (sloPerformance.some(s => s.status === 'warning')) {
      overallHealth = 'warning';
    }

    // Calculate error budget summary
    const avgErrorBudgetConsumed = sloPerformance.length > 0 
      ? sloPerformance.reduce((sum, s) => sum + (100 - s.current_availability), 0) / sloPerformance.length
      : 0;

    const minRemainingDays = Math.min(
      ...sloPerformance
        .filter(s => s.time_to_exhaustion)
        .map(s => Math.max(0, (s.time_to_exhaustion! - Date.now()) / (24 * 60 * 60 * 1000)))
    );

    return {
      overall_health: overallHealth,
      total_slos: slos.length,
      active_violations: activeViolations,
      credits_issued_this_month: creditsThisMonth,
      error_budget_summary: {
        consumed_percentage: avgErrorBudgetConsumed,
        remaining_days: isFinite(minRemainingDays) ? minRemainingDays : 30,
        burn_rate_trend: 'stable', // Simplified for now
      },
      slo_performance: sloPerformance,
    };
  }

  /**
   * Get configuration
   */
  getConfiguration(): SLOConfiguration {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  async updateConfiguration(updates: Partial<SLOConfiguration>): Promise<void> {
    this.config = { ...this.config, ...updates };
    console.log('🔧 SLO configuration updated');
  }
}

// Lazy singleton — see lazySingleton.ts for rationale.
const sloEngine = lazySingleton(() => {
  console.log('📊 Initializing SLO Engine...');
  const inst = SLOEngine.getInstance();
  console.log('✅ SLO Engine initialized successfully');
  return inst;
});

export default sloEngine;