/**
 * SLO Run API - Execute SLO Evaluation and Auto-Credit Issuance
 * 
 * POST /api/admin/slo/run - Run SLO evaluation with automated credit issuance
 * Implements Phase 1.2 reliability enforcement as specified in sprint notes
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server/requireAdmin';
import sloEngine from '@/lib/server/slo/sloEngine';
import eventStreamingEngine from '@/lib/streaming/EventStreamingEngine';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    requireAdmin(req);
    
    const body = await req.json().catch(() => ({}));
    const { organization_id, force_evaluation = false } = body;
    const startTime = Date.now();

    console.log(`🔄 Running SLO evaluation${organization_id ? ` for org: ${organization_id}` : ' (all orgs)'}`);
    
    // Run the comprehensive SLO evaluation
    const results = await sloEngine.evaluateSLOs(organization_id);
    
    const executionTime = Date.now() - startTime;
    const summary = {
      evaluation_id: `eval_${startTime}`,
      started_at: startTime,
      completed_at: Date.now(),
      execution_time_ms: executionTime,
      organization_id,
      results: {
        slos_evaluated: results.burn_rates.length,
        violations_detected: results.violations.length,
        credits_issued: results.credits_issued.length,
        total_credit_amount: results.credits_issued.reduce((sum, c) => sum + c.amount, 0),
      },
      burn_rates: results.burn_rates,
      violations: results.violations,
      credits: results.credits_issued,
    };

    // Create SLO breach alerts for violations
    for (const violation of results.violations) {
      if (violation.severity === 'critical') {
        await eventStreamingEngine.publishEvent({
          type: 'alert.slo_breach',
          source: 'SLOEngine',
          data: {
            alert_type: 'slo_breach',
            severity: 'critical',
            title: `SLO Breach: ${violation.slo_id}`,
            message: `Critical SLO violation detected: ${violation.impact_description}`,
            slo_id: violation.slo_id,
            violation_id: violation.id,
            burn_rate: violation.burn_rate_peak,
            error_budget_consumed: violation.error_budget_consumed,
            organization_id: violation.organization_id,
            credit_issued: violation.credit_issued,
            credit_amount: violation.credit_amount,
          },
          metadata: {
            version: 1,
            correlationId: `slo_breach_${violation.id}`,
            organizationId: violation.organization_id,
          },
        });
      }
    }

    // Send Slack notifications for issued credits
    for (const credit of results.credits_issued) {
      await eventStreamingEngine.publishEvent({
        type: 'notification.credit_issued',
        source: 'SLOEngine',
        data: {
          notification_type: 'credit_issued',
          channel: 'slack',
          credit_id: credit.id,
          organization_id: credit.organization_id,
          amount: credit.amount,
          reason: credit.reason,
          description: credit.description,
          slo_name: credit.metadata?.slo_name,
          issued_at: credit.issued_at,
        },
        metadata: {
          version: 1,
          correlationId: `credit_notification_${credit.id}`,
        },
      });
    }

    // Log execution summary
    console.log(`✅ SLO evaluation completed in ${executionTime}ms:`);
    console.log(`   - SLOs evaluated: ${summary.results.slos_evaluated}`);
    console.log(`   - Violations detected: ${summary.results.violations_detected}`);
    console.log(`   - Credits issued: ${summary.results.credits_issued} ($${summary.results.total_credit_amount})`);
    
    if (results.credits_issued.length > 0) {
      console.log(`💳 Credits issued:`);
      results.credits_issued.forEach(credit => {
        console.log(`   - $${credit.amount} for ${credit.description} (${credit.id})`);
      });
    }

    return NextResponse.json({
      success: true,
      data: summary
    });

  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    
    const executionTime = Date.now() - Date.now();
    console.error('❌ SLO evaluation failed:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'SLO evaluation failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        execution_time_ms: executionTime,
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    requireAdmin(req);
    
    // Get recent evaluation results
    const summary = await sloEngine.getDashboardData();
    
    return NextResponse.json({
      success: true,
      data: {
        dashboard: summary,
        last_evaluation: {
          timestamp: Date.now(),
          status: 'available',
        },
        configuration: sloEngine.getConfiguration(),
      }
    });

  } catch (error) {
    console.error('❌ SLO run status failed:', error);
    return NextResponse.json(
      { error: 'Failed to get SLO run status' },
      { status: 500 }
    );
  }
}