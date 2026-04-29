/**
 * Stream Analytics Correlation API
 * 
 * REST endpoints for stream analytics correlation including event/trace/model mapping,
 * correlation insights, pattern management, and real-time correlation monitoring.
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server/requireAdmin';
import streamAnalyticsCorrelationEngine from '@/lib/analytics/StreamAnalyticsCorrelationEngine';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const url = new URL(request.url);
    const action = url.searchParams.get('action') || 'insights';

    switch (action) {
      case 'insights':
        const limit = parseInt(url.searchParams.get('limit') || '50');
        return await handleGetInsights(limit);
      
      case 'health':
        return await handleGetHealth();
      
      case 'metrics':
        return await handleGetMetrics();
      
      case 'correlations':
        return await handleGetCorrelations();
      
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}. Available: insights, health, metrics, correlations` },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('❌ Stream Correlation API error:', error);
    return NextResponse.json(
      { 
        error: 'Stream correlation request failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);

    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'record_trace':
        return await handleRecordTrace(body);
      
      case 'record_model_inference':
        return await handleRecordModelInference(body);
      
      case 'process_correlations':
        return await handleProcessCorrelations();
      
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}. Available: record_trace, record_model_inference, process_correlations` },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('❌ Stream Correlation API error:', error);
    return NextResponse.json(
      { 
        error: 'Stream correlation operation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

async function handleGetInsights(limit: number): Promise<NextResponse> {
  try {
    console.log('🔗 Fetching correlation insights...');

    const insights = await streamAnalyticsCorrelationEngine.getCorrelationInsights(limit);
    
    return NextResponse.json({
      success: true,
      data: insights,
      total_count: insights.length,
      filter: { limit },
      message: 'Correlation insights retrieved successfully'
    });

  } catch (error) {
    console.error('Failed to get correlation insights:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve correlation insights' },
      { status: 500 }
    );
  }
}

async function handleGetHealth(): Promise<NextResponse> {
  try {
    console.log('🏥 Fetching correlation engine health...');

    const health = await streamAnalyticsCorrelationEngine.getCorrelationHealth();
    
    return NextResponse.json({
      success: true,
      data: health,
      message: 'Stream correlation health check completed'
    });

  } catch (error) {
    console.error('Failed to get correlation health:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve correlation health' },
      { status: 500 }
    );
  }
}

async function handleGetMetrics(): Promise<NextResponse> {
  try {
    console.log('📊 Fetching correlation metrics...');

    const metrics = streamAnalyticsCorrelationEngine.getMetrics();
    
    return NextResponse.json({
      success: true,
      data: metrics,
      message: 'Stream correlation metrics retrieved successfully'
    });

  } catch (error) {
    console.error('Failed to get correlation metrics:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve correlation metrics' },
      { status: 500 }
    );
  }
}

async function handleGetCorrelations(): Promise<NextResponse> {
  try {
    console.log('🔍 Processing and fetching current correlations...');

    const correlations = await streamAnalyticsCorrelationEngine.processCorrelations();
    
    return NextResponse.json({
      success: true,
      data: correlations,
      total_count: correlations.length,
      message: 'Current correlations processed and retrieved'
    });

  } catch (error) {
    console.error('Failed to get correlations:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve correlations' },
      { status: 500 }
    );
  }
}

async function handleRecordTrace(body: any): Promise<NextResponse> {
  try {
    const { trace } = body;

    if (!trace) {
      return NextResponse.json(
        { error: 'trace data is required' },
        { status: 400 }
      );
    }

    console.log(`🔍 Recording trace ${trace.trace_id}...`);

    await streamAnalyticsCorrelationEngine.recordTrace(trace);
    
    return NextResponse.json({
      success: true,
      data: {
        trace_id: trace.trace_id,
        recorded_at: new Date().toISOString()
      },
      message: `Trace ${trace.trace_id} recorded successfully`
    });

  } catch (error) {
    console.error('Failed to record trace:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to record trace' },
      { status: 500 }
    );
  }
}

async function handleRecordModelInference(body: any): Promise<NextResponse> {
  try {
    const { inference } = body;

    if (!inference) {
      return NextResponse.json(
        { error: 'inference data is required' },
        { status: 400 }
      );
    }

    console.log(`🤖 Recording model inference ${inference.inference_id}...`);

    await streamAnalyticsCorrelationEngine.recordModelInference(inference);
    
    return NextResponse.json({
      success: true,
      data: {
        inference_id: inference.inference_id,
        model_id: inference.model_id,
        recorded_at: new Date().toISOString()
      },
      message: `Model inference ${inference.inference_id} recorded successfully`
    });

  } catch (error) {
    console.error('Failed to record model inference:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to record model inference' },
      { status: 500 }
    );
  }
}

async function handleProcessCorrelations(): Promise<NextResponse> {
  try {
    console.log('⚡ Processing correlations manually...');

    const insights = await streamAnalyticsCorrelationEngine.processCorrelations();
    
    return NextResponse.json({
      success: true,
      data: {
        insights_generated: insights.length,
        insights: insights,
        processed_at: new Date().toISOString()
      },
      message: `Processed correlations and generated ${insights.length} insights`
    });

  } catch (error) {
    console.error('Failed to process correlations:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process correlations' },
      { status: 500 }
    );
  }
}