/**
 * SLO Engine - Service Level Objective monitoring and automatic credit system
 * Tracks SLOs across multiple dimensions and triggers billing adjustments
 */

import { getDb } from '@/lib/server/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

export interface SloMetric {
  service_id: string;
  client_id: string;
  timestamp: Date;
  metric_type: 'response_time' | 'availability' | 'error_rate' | 'throughput';
  value: number;
  threshold: number;
  success: boolean;
}

export interface SloTarget {
  service_id: string;
  metric_type: string;
  target_percentage: number; // e.g., 99.9
  measurement_window_hours: number; // e.g., 24, 168 (7 days), 720 (30 days)
  credit_percentage: number; // % of monthly fee to credit on breach
  alert_burn_rate: number; // Alert when burn rate exceeds this (e.g., 2.0)
}

export interface SloViolation {
  id: string;
  service_id: string;
  client_id: string;
  slo_target: SloTarget;
  violation_start: Date;
  violation_end?: Date;
  duration_minutes: number;
  credit_amount: number;
  credit_applied: boolean;
  created_at: Date;
}

export interface SloBurnAlert {
  id: string;
  service_id: string;
  client_id: string;
  metric_type: string;
  current_burn_rate: number;
  threshold_burn_rate: number;
  projected_breach_hours: number;
  alert_sent: boolean;
  created_at: Date;
}

export class SloEngine {
  // Lazy Firestore accessor — class-field initializer would otherwise resolve
  // Firebase credentials at module load and break the Next.js build.
  private get db(): FirebaseFirestore.Firestore {
    return getDb();
  }

  /**
   * Record an SLO metric measurement
   */
  async recordMetric(metric: SloMetric): Promise<void> {
    const docRef = this.db.collection('slo_metrics').doc();
    await docRef.set({
      ...metric,
      timestamp: FieldValue.serverTimestamp(),
      created_at: FieldValue.serverTimestamp(),
    });

    // Check for SLO violations after recording metric
    await this.checkSloViolations(metric.service_id, metric.client_id, metric.metric_type);
  }

  /**
   * Batch record multiple metrics (for performance)
   */
  async recordMetricsBatch(metrics: SloMetric[]): Promise<void> {
    const batch = this.db.batch();
    
    metrics.forEach(metric => {
      const docRef = this.db.collection('slo_metrics').doc();
      batch.set(docRef, {
        ...metric,
        timestamp: FieldValue.serverTimestamp(),
        created_at: FieldValue.serverTimestamp(),
      });
    });

    await batch.commit();

    // Check violations for unique service/client/metric combinations
    const uniqueChecks = new Set(
      metrics.map(m => `${m.service_id}:${m.client_id}:${m.metric_type}`)
    );

    for (const check of uniqueChecks) {
      const [service_id, client_id, metric_type] = check.split(':');
      await this.checkSloViolations(service_id, client_id, metric_type);
    }
  }

  /**
   * Get SLO targets for a service
   */
  async getSloTargets(service_id: string): Promise<SloTarget[]> {
    const querySnapshot = await this.db
      .collection('slo_targets')
      .where('service_id', '==', service_id)
      .get();

    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
    })) as SloTarget[];
  }

  /**
   * Calculate current SLO performance for a time window
   */
  async calculateSloPerformance(
    service_id: string,
    client_id: string,
    metric_type: string,
    window_hours: number
  ): Promise<{ success_rate: number; total_measurements: number; burn_rate: number }> {
    const window_start = new Date(Date.now() - (window_hours * 60 * 60 * 1000));
    
    const querySnapshot = await this.db
      .collection('slo_metrics')
      .where('service_id', '==', service_id)
      .where('client_id', '==', client_id)
      .where('metric_type', '==', metric_type)
      .where('timestamp', '>=', window_start)
      .orderBy('timestamp', 'desc')
      .get();

    const measurements = querySnapshot.docs.map(doc => doc.data());
    const total_measurements = measurements.length;
    const successful_measurements = measurements.filter(m => m.success).length;
    
    if (total_measurements === 0) {
      return { success_rate: 100, total_measurements: 0, burn_rate: 0 };
    }

    const success_rate = (successful_measurements / total_measurements) * 100;
    
    // Calculate burn rate (how fast we're consuming error budget)
    // Burn rate = (actual_error_rate / allowed_error_rate)
    const actual_error_rate = 100 - success_rate;
    
    // Get SLO target for burn rate calculation
    const targets = await this.getSloTargets(service_id);
    const target = targets.find(t => t.metric_type === metric_type);
    const allowed_error_rate = target ? (100 - target.target_percentage) : 1;
    
    const burn_rate = allowed_error_rate > 0 ? actual_error_rate / allowed_error_rate : 0;

    return { success_rate, total_measurements, burn_rate };
  }

  /**
   * Check for SLO violations and trigger alerts/credits
   */
  private async checkSloViolations(
    service_id: string,
    client_id: string,
    metric_type: string
  ): Promise<void> {
    const targets = await this.getSloTargets(service_id);
    const relevantTargets = targets.filter(t => t.metric_type === metric_type);

    for (const target of relevantTargets) {
      const performance = await this.calculateSloPerformance(
        service_id,
        client_id,
        metric_type,
        target.measurement_window_hours
      );

      // Check for SLO breach
      if (performance.success_rate < target.target_percentage) {
        await this.handleSloViolation(service_id, client_id, target, performance);
      }

      // Check for burn rate alert
      if (performance.burn_rate > target.alert_burn_rate) {
        await this.handleBurnRateAlert(service_id, client_id, target, performance);
      }
    }
  }

  /**
   * Handle SLO violation - create violation record and apply credit
   */
  private async handleSloViolation(
    service_id: string,
    client_id: string,
    target: SloTarget,
    performance: { success_rate: number; total_measurements: number; burn_rate: number }
  ): Promise<void> {
    // Check if violation already exists and is active
    const existingViolation = await this.db
      .collection('slo_violations')
      .where('service_id', '==', service_id)
      .where('client_id', '==', client_id)
      .where('slo_target.metric_type', '==', target.metric_type)
      .where('violation_end', '==', null)
      .limit(1)
      .get();

    if (!existingViolation.empty) {
      // Violation already active, update duration
      const violationDoc = existingViolation.docs[0];
      const violation = violationDoc.data() as SloViolation;
      const duration_minutes = Math.round(
        (Date.now() - violation.violation_start.getTime()) / (1000 * 60)
      );

      await violationDoc.ref.update({
        duration_minutes,
        updated_at: FieldValue.serverTimestamp(),
      });
      return;
    }

    // Get client contract to calculate credit amount
    const contractDoc = await this.db
      .collection('client_contracts')
      .where('client_id', '==', client_id)
      .where('service_id', '==', service_id)
      .where('active', '==', true)
      .limit(1)
      .get();

    if (contractDoc.empty) {
      console.warn(`No active contract found for client ${client_id}, service ${service_id}`);
      return;
    }

    const contract = contractDoc.docs[0].data();
    const monthly_fee = contract.monthly_fee || 0;
    const credit_amount = Math.round((monthly_fee * target.credit_percentage) / 100);

    // Create violation record
    const violationId = `${service_id}_${client_id}_${target.metric_type}_${Date.now()}`;
    const violation: SloViolation = {
      id: violationId,
      service_id,
      client_id,
      slo_target: target,
      violation_start: new Date(),
      duration_minutes: 0,
      credit_amount,
      credit_applied: false,
      created_at: new Date(),
    };

    await this.db.collection('slo_violations').doc(violationId).set({
      ...violation,
      violation_start: FieldValue.serverTimestamp(),
      created_at: FieldValue.serverTimestamp(),
    });

    // Apply automatic credit
    await this.applyAutomaticCredit(violation, contractDoc.docs[0].id);

    console.log(`SLO violation detected: ${service_id}/${client_id}/${target.metric_type} - Credit applied: $${credit_amount}`);
  }

  /**
   * Handle burn rate alert
   */
  private async handleBurnRateAlert(
    service_id: string,
    client_id: string,
    target: SloTarget,
    performance: { success_rate: number; total_measurements: number; burn_rate: number }
  ): Promise<void> {
    // Check if alert already sent recently (within last hour)
    const recentAlerts = await this.db
      .collection('slo_burn_alerts')
      .where('service_id', '==', service_id)
      .where('client_id', '==', client_id)
      .where('metric_type', '==', target.metric_type)
      .where('created_at', '>=', new Date(Date.now() - 60 * 60 * 1000))
      .get();

    if (!recentAlerts.empty) {
      return; // Alert already sent recently
    }

    // Calculate projected time to breach
    const error_budget_remaining = target.target_percentage - performance.success_rate;
    const projected_breach_hours = error_budget_remaining > 0 
      ? Math.round(error_budget_remaining / (performance.burn_rate * 0.1)) 
      : 0;

    const alertId = `${service_id}_${client_id}_${target.metric_type}_${Date.now()}`;
    const alert: SloBurnAlert = {
      id: alertId,
      service_id,
      client_id,
      metric_type: target.metric_type,
      current_burn_rate: performance.burn_rate,
      threshold_burn_rate: target.alert_burn_rate,
      projected_breach_hours,
      alert_sent: false,
      created_at: new Date(),
    };

    await this.db.collection('slo_burn_alerts').doc(alertId).set({
      ...alert,
      created_at: FieldValue.serverTimestamp(),
    });

    // TODO: Send actual alert via Slack/email
    console.log(`SLO burn rate alert: ${service_id}/${client_id}/${target.metric_type} - Burn rate: ${performance.burn_rate.toFixed(2)}x`);
  }

  /**
   * Apply automatic credit to client account
   */
  private async applyAutomaticCredit(violation: SloViolation, contractId: string): Promise<void> {
    const creditId = `slo_credit_${violation.id}`;
    
    // Create credit record
    await this.db.collection('billing_credits').doc(creditId).set({
      client_id: violation.client_id,
      service_id: violation.service_id,
      contract_id: contractId,
      credit_amount: violation.credit_amount,
      credit_type: 'slo_violation',
      reason: `SLO violation: ${violation.slo_target.metric_type} fell below ${violation.slo_target.target_percentage}%`,
      violation_id: violation.id,
      applied_at: FieldValue.serverTimestamp(),
      created_at: FieldValue.serverTimestamp(),
    });

    // Update violation as credited
    await this.db.collection('slo_violations').doc(violation.id).update({
      credit_applied: true,
      updated_at: FieldValue.serverTimestamp(),
    });
  }

  /**
   * Get SLO dashboard data for admin UI
   */
  async getSLODashboardData(): Promise<{
    active_violations: number;
    total_credits_applied: number;
    burn_alerts_24h: number;
    services_monitored: number;
  }> {
    // Active violations
    const activeViolationsSnapshot = await this.db
      .collection('slo_violations')
      .where('violation_end', '==', null)
      .get();

    // Total credits applied this month
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    
    const creditsSnapshot = await this.db
      .collection('billing_credits')
      .where('credit_type', '==', 'slo_violation')
      .where('applied_at', '>=', monthStart)
      .get();

    const total_credits_applied = creditsSnapshot.docs.reduce(
      (sum, doc) => sum + (doc.data().credit_amount || 0), 
      0
    );

    // Burn alerts in last 24h
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const burnAlertsSnapshot = await this.db
      .collection('slo_burn_alerts')
      .where('created_at', '>=', dayAgo)
      .get();

    // Services monitored
    const targetsSnapshot = await this.db.collection('slo_targets').get();
    const services_monitored = new Set(
      targetsSnapshot.docs.map(doc => doc.data().service_id)
    ).size;

    return {
      active_violations: activeViolationsSnapshot.size,
      total_credits_applied,
      burn_alerts_24h: burnAlertsSnapshot.size,
      services_monitored,
    };
  }
}

export const sloEngine = new SloEngine();