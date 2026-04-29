/**
 * SLO Billing Credits Engine
 * Integrates with existing SLO system to automatically apply billing credits
 * when SLOs are violated beyond threshold
 */

import { getDb } from '@/lib/server/firebaseAdmin';
import { computeMultipleSLOBurns } from '@/lib/server/slo';
import { DEFAULT_SLOS } from '@/lib/server/defaultSLOs';
import { FieldValue } from 'firebase-admin/firestore';

export interface SLOCreditRule {
  slo_id: string;
  service: string;
  violation_threshold: number; // SLO percentage below which credits are triggered (e.g., 98.0 for 99% SLO)
  credit_percentage: number; // Percentage of monthly fee to credit (e.g., 10 for 10%)
  max_credits_per_month: number; // Maximum credit amount per month
  enabled: boolean;
  created_at: Date;
}

export interface SLOCreditApplication {
  id: string;
  slo_id: string;
  service: string;
  client_id: string;
  contract_id: string;
  violation_percentage: number; // How far below SLO target
  credit_amount: number;
  credit_percentage: number;
  reason: string;
  applied_at: Date;
  month_year: string; // Format: "2025-11" for grouping
}

export interface SloCreditSummary {
  total_credits_month: number;
  credits_applied: number;
  clients_affected: number;
  violations_detected: number;
  rules_processed: number;
}

export class SLOCreditEngine {
  // Lazy Firestore accessor — see SloEngine for rationale.
  private get db(): FirebaseFirestore.Firestore {
    return getDb();
  }

  /**
   * Get default SLO credit rules
   */
  private getDefaultCreditRules(): SLOCreditRule[] {
    return DEFAULT_SLOS.map(slo => ({
      slo_id: slo.id,
      service: slo.service,
      violation_threshold: slo.target - 1.0, // Credit if 1% below target
      credit_percentage: this.getCreditPercentage(slo.service),
      max_credits_per_month: this.getMaxCredits(slo.service),
      enabled: true,
      created_at: new Date(),
    }));
  }

  /**
   * Get credit percentage based on service criticality
   */
  private getCreditPercentage(service: string): number {
    const creditMap = {
      webhook: 15, // High impact - subscription processing
      billing: 20, // Critical - direct billing impact
      capacity: 10, // Medium impact - performance issues
      system: 5,   // Low impact - admin functionality
    };
    return creditMap[service as keyof typeof creditMap] || 5;
  }

  /**
   * Get maximum monthly credits based on service
   */
  private getMaxCredits(service: string): number {
    const maxMap = {
      webhook: 500,  // $500 max per month
      billing: 1000, // $1000 max per month
      capacity: 300, // $300 max per month
      system: 100,   // $100 max per month
    };
    return maxMap[service as keyof typeof maxMap] || 100;
  }

  /**
   * Initialize default credit rules in Firestore
   */
  async initializeCreditRules(): Promise<void> {
    const defaultRules = this.getDefaultCreditRules();
    
    for (const rule of defaultRules) {
      const ruleRef = this.db.collection('slo_credit_rules').doc(rule.slo_id);
      const existingRule = await ruleRef.get();
      
      if (!existingRule.exists) {
        await ruleRef.set({
          ...rule,
          created_at: FieldValue.serverTimestamp(),
        });
        console.log(`✅ Created SLO credit rule: ${rule.slo_id}`);
      }
    }
  }

  /**
   * Get all active credit rules
   */
  async getCreditRules(): Promise<SLOCreditRule[]> {
    const snapshot = await this.db
      .collection('slo_credit_rules')
      .where('enabled', '==', true)
      .get();

    return snapshot.docs.map(doc => ({
      ...doc.data(),
      created_at: doc.data().created_at?.toDate(),
    })) as SLOCreditRule[];
  }

  /**
   * Process SLO violations and apply automatic credits
   */
  async processAutomaticCredits(): Promise<SloCreditSummary> {
    console.log('🔄 Processing automatic SLO credits...');

    // Compute current SLO burn rates
    const sloResults = await computeMultipleSLOBurns(DEFAULT_SLOS);
    
    // Get active credit rules
    const creditRules = await getCreditRules();
    
    let creditsApplied = 0;
    let totalCreditsAmount = 0;
    const clientsAffected = new Set<string>();
    let violationsDetected = 0;

    for (const sloBurn of sloResults) {
      const rule = creditRules.find(r => r.slo_id === sloBurn.sloId);
      if (!rule) continue;

      // Check if SLO is violated beyond threshold
      if (sloBurn.achieved < rule.violation_threshold) {
        violationsDetected++;
        console.log(`🚨 SLO violation detected: ${sloBurn.sloId} (${sloBurn.achieved}% < ${rule.violation_threshold}%)`);

        // Apply credits to all active contracts for this service
        const creditResults = await this.applyCreditForService(sloBurn, rule);
        creditsApplied += creditResults.applications;
        totalCreditsAmount += creditResults.totalAmount;
        creditResults.clientIds.forEach(id => clientsAffected.add(id));
      }
    }

    const summary: SloCreditSummary = {
      total_credits_month: totalCreditsAmount,
      credits_applied: creditsApplied,
      clients_affected: clientsAffected.size,
      violations_detected: violationsDetected,
      rules_processed: creditRules.length,
    };

    console.log(`✅ SLO credit processing complete:`, summary);
    return summary;
  }

  /**
   * Apply credits for a specific service SLO violation
   */
  private async applyCreditForService(
    sloBurn: any,
    rule: SLOCreditRule
  ): Promise<{ applications: number; totalAmount: number; clientIds: string[] }> {
    // Get all active contracts for this service
    const contractsSnapshot = await this.db
      .collection('client_contracts')
      .where('service_id', '==', rule.service)
      .where('active', '==', true)
      .get();

    if (contractsSnapshot.empty) {
      console.log(`ℹ️  No active contracts found for service: ${rule.service}`);
      return { applications: 0, totalAmount: 0, clientIds: [] };
    }

    const currentMonth = new Date().toISOString().substring(0, 7); // "2025-11"
    const clientIds: string[] = [];
    let applications = 0;
    let totalAmount = 0;

    for (const contractDoc of contractsSnapshot.docs) {
      const contract = contractDoc.data();
      const clientId = contract.client_id;
      
      // Check if credit already applied this month for this SLO + client
      const existingCredit = await this.db
        .collection('slo_credit_applications')
        .where('slo_id', '==', rule.slo_id)
        .where('client_id', '==', clientId)
        .where('month_year', '==', currentMonth)
        .limit(1)
        .get();

      if (!existingCredit.empty) {
        console.log(`ℹ️  Credit already applied for ${rule.slo_id} + ${clientId} this month`);
        continue;
      }

      // Check monthly credit limits
      const monthlyCredits = await this.getMonthlyCreditsForClient(clientId, currentMonth);
      if (monthlyCredits >= rule.max_credits_per_month) {
        console.log(`⚠️  Monthly credit limit reached for client ${clientId}`);
        continue;
      }

      // Calculate credit amount
      const monthlyFee = contract.monthly_fee || 0;
      const violationSeverity = Math.max(0, rule.violation_threshold - sloBurn.achieved);
      const creditAmount = Math.min(
        Math.round((monthlyFee * rule.credit_percentage) / 100),
        rule.max_credits_per_month - monthlyCredits
      );

      if (creditAmount <= 0) {
        console.log(`ℹ️  No credit amount calculated for ${clientId}`);
        continue;
      }

      // Apply the credit
      await this.applyCreditToClient({
        slo_id: rule.slo_id,
        service: rule.service,
        client_id: clientId,
        contract_id: contractDoc.id,
        violation_percentage: violationSeverity,
        credit_amount: creditAmount,
        credit_percentage: rule.credit_percentage,
        reason: `Automatic credit for ${rule.slo_id} SLO violation (${sloBurn.achieved.toFixed(2)}% < ${rule.violation_threshold}%)`,
        month_year: currentMonth,
      });

      clientIds.push(clientId);
      applications++;
      totalAmount += creditAmount;

      console.log(`✅ Applied $${creditAmount} credit to ${clientId} for ${rule.slo_id}`);
    }

    return { applications, totalAmount, clientIds };
  }

  /**
   * Get total credits applied to a client this month
   */
  private async getMonthlyCreditsForClient(clientId: string, monthYear: string): Promise<number> {
    const snapshot = await this.db
      .collection('slo_credit_applications')
      .where('client_id', '==', clientId)
      .where('month_year', '==', monthYear)
      .get();

    return snapshot.docs.reduce((sum, doc) => sum + (doc.data().credit_amount || 0), 0);
  }

  /**
   * Apply credit to a specific client
   */
  private async applyCreditToClient(credit: Omit<SLOCreditApplication, 'id' | 'applied_at'>): Promise<void> {
    const creditId = `${credit.slo_id}_${credit.client_id}_${credit.month_year}_${Date.now()}`;
    
    const creditApplication: SLOCreditApplication = {
      id: creditId,
      ...credit,
      applied_at: new Date(),
    };

    // Save credit application record
    await this.db.collection('slo_credit_applications').doc(creditId).set({
      ...creditApplication,
      applied_at: FieldValue.serverTimestamp(),
    });

    // Also create a billing credit record for integration with billing system
    await this.db.collection('billing_credits').doc(creditId).set({
      client_id: credit.client_id,
      service_id: credit.service,
      contract_id: credit.contract_id,
      credit_amount: credit.credit_amount,
      credit_type: 'slo_violation',
      reason: credit.reason,
      slo_id: credit.slo_id,
      month_year: credit.month_year,
      applied_at: FieldValue.serverTimestamp(),
      created_at: FieldValue.serverTimestamp(),
    });
  }

  /**
   * Get SLO credit dashboard data
   */
  async getCreditDashboardData(): Promise<{
    current_month_credits: number;
    credits_this_week: number;
    total_clients_credited: number;
    active_rules: number;
    recent_applications: any[];
  }> {
    const now = new Date();
    const currentMonth = now.toISOString().substring(0, 7);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Current month credits
    const monthCreditsSnapshot = await this.db
      .collection('slo_credit_applications')
      .where('month_year', '==', currentMonth)
      .get();

    const current_month_credits = monthCreditsSnapshot.docs.reduce(
      (sum, doc) => sum + (doc.data().credit_amount || 0), 
      0
    );

    // Credits this week
    const weekCreditsSnapshot = await this.db
      .collection('slo_credit_applications')
      .where('applied_at', '>=', weekAgo)
      .get();

    const credits_this_week = weekCreditsSnapshot.docs.reduce(
      (sum, doc) => sum + (doc.data().credit_amount || 0), 
      0
    );

    // Total clients credited this month
    const total_clients_credited = new Set(
      monthCreditsSnapshot.docs.map(doc => doc.data().client_id)
    ).size;

    // Active rules
    const rulesSnapshot = await this.db
      .collection('slo_credit_rules')
      .where('enabled', '==', true)
      .get();

    const active_rules = rulesSnapshot.size;

    // Recent applications
    const recentSnapshot = await this.db
      .collection('slo_credit_applications')
      .orderBy('applied_at', 'desc')
      .limit(10)
      .get();

    const recent_applications = recentSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      applied_at: doc.data().applied_at?.toDate?.()?.toISOString(),
    }));

    return {
      current_month_credits,
      credits_this_week,
      total_clients_credited,
      active_rules,
      recent_applications,
    };
  }
}

export const sloCreditEngine = new SLOCreditEngine();

// Helper function for external access
export async function getCreditRules(): Promise<SLOCreditRule[]> {
  return sloCreditEngine.getCreditRules();
}