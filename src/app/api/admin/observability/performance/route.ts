import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server/requireAdmin';
import { getDb } from '@/lib/server/legacyAdmin';

/**
 * Admin API for Performance Metrics
 * GET /api/admin/observability/performance - Get custom performance metrics
 */

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    await requireAdmin(request);

    const { searchParams } = new URL(request.url);
    
    const db = await getDb();
    const now = new Date();

    // Parse time range
    const timeRange = searchParams.get('timeRange') || '1h';
    let startTime: Date;

    switch (timeRange) {
      case '1h':
        startTime = new Date(now.getTime() - 60 * 60 * 1000);
        break;
      case '6h':
        startTime = new Date(now.getTime() - 6 * 60 * 60 * 1000);
        break;
      case '24h':
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      default:
        startTime = new Date(now.getTime() - 60 * 60 * 1000);
    }

    console.log(`📈 Getting performance metrics for ${timeRange} range`);

    const snapshot = await db.collection('performance_metrics')
      .where('timestamp', '>=', startTime.getTime())
      .orderBy('timestamp', 'desc')
      .limit(500)
      .get();

    const metrics = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log(`✅ Retrieved ${metrics.length} performance metrics`);

    return NextResponse.json({
      success: true,
      data: { metrics }
    });

  } catch (error) {
    console.error('❌ Performance metrics API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}