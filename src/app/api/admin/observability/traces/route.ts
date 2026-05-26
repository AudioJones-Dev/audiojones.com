import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server/requireAdmin';
import { getDb } from '@/lib/server/legacyAdmin';

/**
 * Admin API for Distributed Traces
 * GET /api/admin/observability/traces - Get trace events with filtering
 */

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    await requireAdmin(request);

    const { searchParams } = new URL(request.url);
    
    const db = await getDb();
    const now = new Date();

    // Parse filters
    const timeRange = searchParams.get('timeRange') || '1h';
    const status = searchParams.get('status');
    const operation = searchParams.get('operation');
    const userId = searchParams.get('userId');
    const organizationId = searchParams.get('organizationId');
    const limit = parseInt(searchParams.get('limit') || '100');

    // Calculate time range
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

    console.log(`🔍 Getting traces: ${timeRange} range, filters: ${JSON.stringify({ status, operation, userId, organizationId })}`);

    // Build query
    let query = db.collection('trace_events')
      .where('startTime', '>=', startTime.getTime()) as any;

    if (status) {
      query = query.where('status', '==', status);
    }
    if (operation) {
      query = query.where('operationName', '==', operation);
    }
    if (userId) {
      query = query.where('userId', '==', userId);
    }
    if (organizationId) {
      query = query.where('organizationId', '==', organizationId);
    }

    query = query.orderBy('startTime', 'desc').limit(limit);

    const snapshot = await query.get();
    const traces = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log(`✅ Retrieved ${traces.length} traces`);

    return NextResponse.json({
      success: true,
      data: { traces }
    });

  } catch (error) {
    console.error('❌ Traces API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}