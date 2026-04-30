/**
 * SLO Credits Admin API
 * Manage automatic billing credits based on SLO violations
 * 
 * POST /api/admin/slo/credits - Process automatic credits or manage rules
 * GET /api/admin/slo/credits - View credit dashboard and history
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server/requireAdmin';
import { sloCreditEngine } from '@/lib/slo/SLOCreditEngine';
import { getDb } from '@/lib/server/firebaseAdmin';
import { FieldValue } from "@/lib/legacy-stubs";

export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);

    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'process_credits':
        return await processAutomaticCredits();
      case 'initialize_rules':
        return await initializeCreditRules();
      case 'create_rule':
        return await createCreditRule(data);
      case 'update_rule':
        return await updateCreditRule(data);
      case 'apply_manual_credit':
        return await applyManualCredit(data);
      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: process_credits, initialize_rules, create_rule, update_rule, apply_manual_credit' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('SLO Credits API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message?.includes('Admin') ? 403 : 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const view = searchParams.get('view') || 'dashboard';

    switch (view) {
      case 'dashboard':
        return await getCreditDashboard();
      case 'rules':
        return await getCreditRules();
      case 'applications':
        return await getCreditApplications(searchParams);
      case 'client_credits':
        return await getClientCredits(searchParams);
      default:
        return NextResponse.json(
          { error: 'Invalid view. Use: dashboard, rules, applications, client_credits' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('SLO Credits API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message?.includes('Admin') ? 403 : 500 }
    );
  }
}

async function processAutomaticCredits() {
  console.log('🔄 Manual trigger: Processing automatic SLO credits');
  
  const summary = await sloCreditEngine.processAutomaticCredits();
  
  return NextResponse.json({
    success: true,
    message: 'Automatic credit processing completed',
    summary
  });
}

async function initializeCreditRules() {
  console.log('🔧 Initializing default SLO credit rules');
  
  await sloCreditEngine.initializeCreditRules();
  
  return NextResponse.json({
    success: true,
    message: 'Default SLO credit rules initialized'
  });
}

async function createCreditRule(data: any) {
  const {
    slo_id,
    service,
    violation_threshold,
    credit_percentage,
    max_credits_per_month,
    enabled = true
  } = data;

  if (!slo_id || !service || !violation_threshold || !credit_percentage) {
    return NextResponse.json(
      { error: 'Missing required fields: slo_id, service, violation_threshold, credit_percentage' },
      { status: 400 }
    );
  }

  const db = getDb();
  const rule = {
    slo_id,
    service,
    violation_threshold: parseFloat(violation_threshold),
    credit_percentage: parseFloat(credit_percentage),
    max_credits_per_month: parseInt(max_credits_per_month) || 500,
    enabled: Boolean(enabled),
    created_at: FieldValue.serverTimestamp(),
    updated_at: FieldValue.serverTimestamp(),
  };

  await db.collection('slo_credit_rules').doc(slo_id).set(rule);

  return NextResponse.json({
    success: true,
    message: `Created SLO credit rule: ${slo_id}`,
    rule
  });
}

async function updateCreditRule(data: any) {
  const { slo_id, ...updates } = data;

  if (!slo_id) {
    return NextResponse.json(
      { error: 'Missing required field: slo_id' },
      { status: 400 }
    );
  }

  const db = getDb();
  const ruleRef = db.collection('slo_credit_rules').doc(slo_id);
  const ruleSnapshot = await ruleRef.get();

  if (!ruleSnapshot.exists) {
    return NextResponse.json(
      { error: `SLO credit rule not found: ${slo_id}` },
      { status: 404 }
    );
  }

  const updateData = {
    ...updates,
    updated_at: FieldValue.serverTimestamp(),
  };

  // Convert numeric fields
  if (updates.violation_threshold) updateData.violation_threshold = parseFloat(updates.violation_threshold);
  if (updates.credit_percentage) updateData.credit_percentage = parseFloat(updates.credit_percentage);
  if (updates.max_credits_per_month) updateData.max_credits_per_month = parseInt(updates.max_credits_per_month);
  if (updates.enabled !== undefined) updateData.enabled = Boolean(updates.enabled);

  await ruleRef.update(updateData);

  return NextResponse.json({
    success: true,
    message: `Updated SLO credit rule: ${slo_id}`,
    updates: updateData
  });
}

async function applyManualCredit(data: any) {
  const {
    slo_id,
    service,
    client_id,
    credit_amount,
    reason,
    override_limits = false
  } = data;

  if (!slo_id || !service || !client_id || !credit_amount || !reason) {
    return NextResponse.json(
      { error: 'Missing required fields: slo_id, service, client_id, credit_amount, reason' },
      { status: 400 }
    );
  }

  const db = getDb();
  const currentMonth = new Date().toISOString().substring(0, 7);

  // Get client contract
  const contractSnapshot = await db
    .collection('client_contracts')
    .where('client_id', '==', client_id)
    .where('service_id', '==', service)
    .where('active', '==', true)
    .limit(1)
    .get();

  if (contractSnapshot.empty) {
    return NextResponse.json(
      { error: `No active contract found for client ${client_id} and service ${service}` },
      { status: 404 }
    );
  }

  const contractId = contractSnapshot.docs[0].id;
  const creditAmount = parseFloat(credit_amount);

  // Check limits unless overridden
  if (!override_limits) {
    const monthlyCredits = await getMonthlyCreditsForClient(client_id, currentMonth);
    const rule = await getCreditRule(slo_id);
    
    if (rule && monthlyCredits + creditAmount > rule.max_credits_per_month) {
      return NextResponse.json(
        { error: `Credit would exceed monthly limit (${rule.max_credits_per_month})` },
        { status: 400 }
      );
    }
  }

  // Apply manual credit
  const creditId = `manual_${slo_id}_${client_id}_${currentMonth}_${Date.now()}`;
  
  await db.collection('slo_credit_applications').doc(creditId).set({
    id: creditId,
    slo_id,
    service,
    client_id,
    contract_id: contractId,
    violation_percentage: 0, // Manual credit
    credit_amount: creditAmount,
    credit_percentage: 0, // Manual credit
    reason: `Manual credit: ${reason}`,
    month_year: currentMonth,
    applied_at: FieldValue.serverTimestamp(),
    manual: true,
  });

  // Create billing credit record
  await db.collection('billing_credits').doc(creditId).set({
    client_id,
    service_id: service,
    contract_id: contractId,
    credit_amount: creditAmount,
    credit_type: 'slo_manual',
    reason: `Manual SLO credit: ${reason}`,
    slo_id,
    month_year: currentMonth,
    applied_at: FieldValue.serverTimestamp(),
    created_at: FieldValue.serverTimestamp(),
    manual: true,
  });

  return NextResponse.json({
    success: true,
    message: `Applied manual credit of $${creditAmount} to client ${client_id}`,
    credit_id: creditId
  });
}

async function getCreditDashboard() {
  const dashboardData = await sloCreditEngine.getCreditDashboardData();
  
  return NextResponse.json({
    success: true,
    dashboard: dashboardData
  });
}

async function getCreditRules() {
  const rules = await sloCreditEngine.getCreditRules();
  
  return NextResponse.json({
    success: true,
    rules
  });
}

async function getCreditApplications(searchParams: URLSearchParams) {
  const db = getDb();
  const limit = parseInt(searchParams.get('limit') || '50');
  const client_id = searchParams.get('client_id');
  const service = searchParams.get('service');
  const month_year = searchParams.get('month_year');

  let query = db.collection('slo_credit_applications').orderBy('applied_at', 'desc');

  if (client_id) query = query.where('client_id', '==', client_id);
  if (service) query = query.where('service', '==', service);
  if (month_year) query = query.where('month_year', '==', month_year);

  const snapshot = await query.limit(limit).get();
  
  const applications = snapshot.docs.map((doc: any) => ({
    id: doc.id,
    ...doc.data(),
    applied_at: doc.data().applied_at?.toDate?.()?.toISOString(),
  }));

  return NextResponse.json({
    success: true,
    applications,
    total: snapshot.size
  });
}

async function getClientCredits(searchParams: URLSearchParams) {
  const client_id = searchParams.get('client_id');
  const month_year = searchParams.get('month_year') || new Date().toISOString().substring(0, 7);

  if (!client_id) {
    return NextResponse.json(
      { error: 'client_id parameter required' },
      { status: 400 }
    );
  }

  const db = getDb();
  const snapshot = await db
    .collection('slo_credit_applications')
    .where('client_id', '==', client_id)
    .where('month_year', '==', month_year)
    .orderBy('applied_at', 'desc')
    .get();

  const credits = snapshot.docs.map((doc: any) => ({
    id: doc.id,
    ...doc.data(),
    applied_at: doc.data().applied_at?.toDate?.()?.toISOString(),
  })) as Array<{
    id: string;
    credit_amount: number;
    applied_at: any;
    [key: string]: any;
  }>;

  const total_credits = credits.reduce((sum, credit) => sum + (credit.credit_amount || 0), 0);

  return NextResponse.json({
    success: true,
    client_id,
    month_year,
    total_credits,
    credits_count: credits.length,
    credits
  });
}

// Helper functions
async function getMonthlyCreditsForClient(clientId: string, monthYear: string): Promise<number> {
  const db = getDb();
  const snapshot = await db
    .collection('slo_credit_applications')
    .where('client_id', '==', clientId)
    .where('month_year', '==', monthYear)
    .get();

  return snapshot.docs.reduce((sum: any, doc: any) => sum + (doc.data().credit_amount || 0), 0);
}

async function getCreditRule(sloId: string): Promise<{
  slo_id: string;
  service: string;
  violation_threshold: number;
  credit_percentage: number;
  max_credits_per_month: number;
  enabled: boolean;
  created_at: Date;
  [key: string]: any;
} | null> {
  const db = getDb();
  const snapshot = await db.collection('slo_credit_rules').doc(sloId).get();
  
  if (!snapshot.exists) return null;
  
  return {
    ...snapshot.data(),
    created_at: snapshot.data()?.created_at?.toDate(),
  } as any;
}