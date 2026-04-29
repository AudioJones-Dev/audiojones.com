import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server/requireAdmin';
import openTelemetryManager from '@/lib/observability/OpenTelemetryManager';
import { getDb } from '@/lib/server/firebaseAdmin';

/**
 * Admin API for Observability Metrics
 * GET /api/admin/observability/metrics - System-wide performance metrics
 * GET /api/admin/observability/traces - Distributed trace events
 * GET /api/admin/observability/performance - Custom performance metrics
 * POST /api/admin/observability/traces - Create custom trace
 */

interface SystemMetrics {
  total_requests_24h: number;
  avg_response_time_ms: number;
  error_rate_percent: number;
  active_traces: number;
  webhook_events_24h: number;
  database_operations_24h: number;
  feature_flag_evaluations_24h: number;
  top_operations: Array<{
    name: string;
    count: number;
    avg_duration_ms: number;
    error_rate: number;
  }>;
  recent_errors: Array<{
    timestamp: number;
    operation: string;
    error: string;
    trace_id: string;
  }>;
}

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    await requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint') || 'metrics';

    console.log(`📊 Admin observability request: ${endpoint}`);

    if (endpoint === 'metrics') {
      return await getSystemMetrics();
    } else if (endpoint === 'traces') {
      return await getTraceEvents(searchParams);
    } else if (endpoint === 'performance') {
      return await getPerformanceMetrics(searchParams);
    } else {
      return NextResponse.json({
        success: false,
        error: 'Invalid endpoint'
      }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Observability API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    await requireAdmin(request);

    const body = await request.json();
    const { action } = body;

    console.log(`📊 Admin observability action: ${action}`);

    if (action === 'create_trace') {
      return await createCustomTrace(body);
    } else if (action === 'initialize') {
      return await initializeObservability();
    } else {
      return NextResponse.json({
        success: false,
        error: 'Invalid action'
      }, { status: 400 });
    }

  } catch (error) {
    console.error('❌ Observability API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * Get comprehensive system metrics
 */
async function getSystemMetrics(): Promise<NextResponse> {
  try {
    const db = await getDb();
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    console.log('📈 Calculating system metrics...');

    // Get request metrics
    const requestsSnapshot = await db.collection('performance_metrics')
      .where('name', '==', 'requests_total')
      .where('timestamp', '>=', oneDayAgo.getTime())
      .get();

    const totalRequests = requestsSnapshot.docs.reduce((sum: any, doc: any) => {
      return sum + (doc.data().value || 0);
    }, 0);

    // Get response time metrics
    const responseTimeSnapshot = await db.collection('performance_metrics')
      .where('name', '==', 'request_duration_ms')
      .where('timestamp', '>=', oneDayAgo.getTime())
      .orderBy('timestamp', 'desc')
      .limit(100)
      .get();

    const avgResponseTime = responseTimeSnapshot.docs.length > 0 
      ? responseTimeSnapshot.docs.reduce((sum: any, doc: any) => sum + doc.data().value, 0) / responseTimeSnapshot.docs.length
      : 0;

    // Get error rate
    const errorSnapshot = await db.collection('trace_events')
      .where('status', '==', 'error')
      .where('startTime', '>=', oneDayAgo.getTime())
      .get();

    const successSnapshot = await db.collection('trace_events')
      .where('status', '==', 'success')
      .where('startTime', '>=', oneDayAgo.getTime())
      .get();

    const totalTraces = errorSnapshot.docs.length + successSnapshot.docs.length;
    const errorRate = totalTraces > 0 ? (errorSnapshot.docs.length / totalTraces) * 100 : 0;

    // Get active traces (last 5 minutes)
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    const activeTracesSnapshot = await db.collection('trace_events')
      .where('startTime', '>=', fiveMinutesAgo.getTime())
      .where('endTime', '==', null)
      .get();

    // Get webhook events
    const webhookSnapshot = await db.collection('performance_metrics')
      .where('name', '==', 'webhook_events_total')
      .where('timestamp', '>=', oneDayAgo.getTime())
      .get();

    const webhookEvents = webhookSnapshot.docs.reduce((sum: any, doc: any) => sum + doc.data().value, 0);

    // Get database operations
    const dbOpsSnapshot = await db.collection('performance_metrics')
      .where('name', '==', 'database_operations_total')
      .where('timestamp', '>=', oneDayAgo.getTime())
      .get();

    const databaseOps = dbOpsSnapshot.docs.reduce((sum: any, doc: any) => sum + doc.data().value, 0);

    // Get feature flag evaluations
    const ffSnapshot = await db.collection('performance_metrics')
      .where('name', '==', 'feature_flag_evaluations_total')
      .where('timestamp', '>=', oneDayAgo.getTime())
      .get();

    const featureFlagEvals = ffSnapshot.docs.reduce((sum: any, doc: any) => sum + doc.data().value, 0);

    // Get top operations
    const operationsSnapshot = await db.collection('trace_events')
      .where('startTime', '>=', oneDayAgo.getTime())
      .get();

    const operationStats = new Map<string, { count: number; totalDuration: number; errors: number }>();

    operationsSnapshot.docs.forEach((doc: any) => {
      const data = doc.data();
      const operation = data.operationName;
      const duration = data.duration || 0;
      const isError = data.status === 'error';

      if (!operationStats.has(operation)) {
        operationStats.set(operation, { count: 0, totalDuration: 0, errors: 0 });
      }

      const stats = operationStats.get(operation)!;
      stats.count++;
      stats.totalDuration += duration;
      if (isError) stats.errors++;
    });

    const topOperations = Array.from(operationStats.entries())
      .map(([name, stats]) => ({
        name,
        count: stats.count,
        avg_duration_ms: stats.count > 0 ? stats.totalDuration / stats.count : 0,
        error_rate: stats.count > 0 ? (stats.errors / stats.count) * 100 : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Get recent errors
    const recentErrorsSnapshot = await db.collection('trace_events')
      .where('status', '==', 'error')
      .orderBy('startTime', 'desc')
      .limit(10)
      .get();

    const recentErrors = recentErrorsSnapshot.docs.map((doc: any) => {
      const data = doc.data();
      return {
        timestamp: data.startTime,
        operation: data.operationName,
        error: data.metadata?.error || 'Unknown error',
        trace_id: data.traceId
      };
    });

    const metrics: SystemMetrics = {
      total_requests_24h: totalRequests,
      avg_response_time_ms: avgResponseTime,
      error_rate_percent: errorRate,
      active_traces: activeTracesSnapshot.docs.length,
      webhook_events_24h: webhookEvents,
      database_operations_24h: databaseOps,
      feature_flag_evaluations_24h: featureFlagEvals,
      top_operations: topOperations,
      recent_errors: recentErrors
    };

    console.log(`✅ System metrics calculated: ${totalRequests} requests, ${avgResponseTime.toFixed(1)}ms avg, ${errorRate.toFixed(2)}% errors`);

    return NextResponse.json({
      success: true,
      data: { metrics }
    });

  } catch (error) {
    console.error('❌ Failed to get system metrics:', error);
    throw error;
  }
}

/**
 * Get trace events with filtering
 */
async function getTraceEvents(searchParams: URLSearchParams): Promise<NextResponse> {
  try {
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
    console.error('❌ Failed to get trace events:', error);
    throw error;
  }
}

/**
 * Get custom performance metrics
 */
async function getPerformanceMetrics(searchParams: URLSearchParams): Promise<NextResponse> {
  try {
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
    console.error('❌ Failed to get performance metrics:', error);
    throw error;
  }
}

/**
 * Create custom trace for testing
 */
async function createCustomTrace(body: any): Promise<NextResponse> {
  try {
    const { operationName, duration, status, metadata, userId, organizationId } = body;

    if (!operationName) {
      return NextResponse.json({
        success: false,
        error: 'Operation name is required'
      }, { status: 400 });
    }

    const traceId = `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const spanId = Math.random().toString(36).substr(2, 16);
    const startTime = Date.now();

    const traceEvent = {
      traceId,
      spanId,
      operationName,
      startTime,
      endTime: duration ? startTime + duration : null,
      duration: duration || null,
      status: status || 'success',
      metadata: metadata || {},
      userId: userId || null,
      organizationId: organizationId || null,
      tags: ['custom', 'admin_created']
    };

    const db = await getDb();
    await db.collection('trace_events').add(traceEvent);

    console.log(`✅ Created custom trace: ${operationName} (${traceId})`);

    return NextResponse.json({
      success: true,
      data: { trace: traceEvent }
    });

  } catch (error) {
    console.error('❌ Failed to create custom trace:', error);
    throw error;
  }
}

/**
 * Initialize observability system
 */
async function initializeObservability(): Promise<NextResponse> {
  try {
    console.log('🚀 Initializing observability system...');

    // Initialize OpenTelemetry
    await openTelemetryManager.initialize();

    // Create initial collections in Firebase
    const db = await getDb();
    
    await db.collection('system_monitoring').doc('observability_init').set({
      initialized_at: new Date(),
      version: '1.0.0',
      features: [
        'opentelemetry_tracing',
        'performance_metrics',
        'distributed_traces',
        'custom_metrics',
        'real_time_monitoring'
      ],
      status: 'active'
    });

    console.log('✅ Observability system initialized successfully');

    return NextResponse.json({
      success: true,
      message: 'Observability system initialized successfully'
    });

  } catch (error) {
    console.error('❌ Failed to initialize observability system:', error);
    throw error;
  }
}