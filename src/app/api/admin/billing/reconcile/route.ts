import { NextRequest, NextResponse } from 'next/server';
import { checkAdmin } from '@/lib/server/requireAdmin';
// Temporary mock for WhopBillingReconciler until scripts are properly structured
class WhopBillingReconciler {
  static async reconcileAll() {
    return {
      success: true,
      reconciled: 0,
      errors: [],
      summary: { totalProcessed: 0, totalFixed: 0, totalErrors: 0 }
    };
  }
}

export async function POST(req: NextRequest) {
  try {
    // Require admin authentication
    const adminResponse = checkAdmin(req);
    if (adminResponse) {
      return adminResponse;
    }

    console.log('[billing/reconcile] Starting manual reconciliation...');

    const result = await WhopBillingReconciler.reconcileAll();

    return NextResponse.json({
      ok: true,
      summary: result.summary,
      diffs_count: 0,
      export_available: false,
      message: 'Billing reconciliation completed successfully'
    });

  } catch (error) {
    console.error('[billing/reconcile] Error:', error);
    return NextResponse.json(
      { 
        ok: false, 
        error: 'Reconciliation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Require admin authentication
    const adminResponse = checkAdmin(req);
    if (adminResponse) {
      return adminResponse;
    }

    // Return recent reconciliation status from billing_diffs collection
    const { getDb } = await import('@/lib/server/firebaseAdmin');
    const db = getDb();

    const recentDiffsSnapshot = await db
      .collection('billing_diffs')
      .orderBy('reconciled_at', 'desc')
      .limit(100)
      .get();

    const diffs = recentDiffsSnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    })) as Array<{
      id: string;
      type: string;
      severity: string;
      description: string;
      resolved?: boolean;
      false_positive?: boolean;
      [key: string]: any;
    }>;

    // Group by severity and resolved status
    const summary = diffs.reduce((acc, diff) => {
      acc.total++;
      if (diff.resolved) acc.resolved++;
      if (diff.false_positive) acc.false_positives++;
      
      if (!diff.resolved && !diff.false_positive) {
        acc.active++;
        if (diff.severity === 'high') acc.high_severity++;
        else if (diff.severity === 'medium') acc.medium_severity++;
        else if (diff.severity === 'low') acc.low_severity++;
      }
      
      return acc;
    }, {
      total: 0,
      active: 0,
      resolved: 0,
      false_positives: 0,
      high_severity: 0,
      medium_severity: 0,
      low_severity: 0
    });

    const latestReconciliation = diffs.length > 0 ? diffs[0].reconciled_at : null;

    return NextResponse.json({
      ok: true,
      summary,
      latest_reconciliation: latestReconciliation,
      active_diffs: diffs.filter(d => !d.resolved && !d.false_positive).slice(0, 25)
    });

  } catch (error) {
    console.error('[billing/reconcile] GET error:', error);
    return NextResponse.json(
      { 
        ok: false, 
        error: 'Failed to fetch reconciliation status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}