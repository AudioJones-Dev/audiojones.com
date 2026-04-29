/**
 * Feedback & Drift Monitoring API
 * 
 * REST endpoints for model feedback collection, performance drift detection,
 * bias monitoring, and continuous learning management.
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server/requireAdmin';
import feedbackDriftEngine from '@/lib/ai/FeedbackDriftEngine';

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
      
      case 'drift':
        const modelId = url.searchParams.get('model_id');
        return await handleGetDrift(modelId);
      
      case 'bias':
        const modelIdBias = url.searchParams.get('model_id');
        return await handleGetBias(modelIdBias);
      
      case 'nightly_check':
        return await handleRunNightlyCheck();
      
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}. Available: insights, health, drift, bias, nightly_check` },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('❌ Feedback & Drift API error:', error);
    return NextResponse.json(
      { 
        error: 'Feedback & drift monitoring request failed',
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
      case 'record_feedback':
        return await handleRecordFeedback(body);
      
      case 'detect_drift':
        return await handleDetectDrift(body);
      
      case 'detect_bias':
        return await handleDetectBias(body);
      
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}. Available: record_feedback, detect_drift, detect_bias` },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('❌ Feedback & Drift API error:', error);
    return NextResponse.json(
      { 
        error: 'Feedback & drift monitoring operation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

async function handleGetInsights(limit: number): Promise<NextResponse> {
  try {
    console.log('📊 Fetching monitoring insights...');

    const insights = await feedbackDriftEngine.getMonitoringInsights(limit);
    
    return NextResponse.json({
      success: true,
      data: insights,
      total_count: insights.length,
      filter: { limit },
      message: 'Monitoring insights retrieved successfully'
    });

  } catch (error) {
    console.error('Failed to get monitoring insights:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve monitoring insights' },
      { status: 500 }
    );
  }
}

async function handleGetHealth(): Promise<NextResponse> {
  try {
    console.log('🏥 Fetching monitoring health status...');

    const health = feedbackDriftEngine.getMonitoringHealth();
    
    return NextResponse.json({
      success: true,
      data: health,
      message: 'Monitoring health status retrieved successfully'
    });

  } catch (error) {
    console.error('Failed to get monitoring health:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve monitoring health' },
      { status: 500 }
    );
  }
}

async function handleGetDrift(modelId: string | null): Promise<NextResponse> {
  try {
    if (!modelId) {
      return NextResponse.json(
        { error: 'model_id parameter is required' },
        { status: 400 }
      );
    }

    console.log(`🔍 Detecting performance drift for model ${modelId}...`);

    const drifts = await feedbackDriftEngine.detectPerformanceDrift(modelId);
    
    return NextResponse.json({
      success: true,
      data: drifts,
      total_count: drifts.length,
      model_id: modelId,
      message: `Performance drift analysis completed for model ${modelId}`
    });

  } catch (error) {
    console.error('Failed to detect performance drift:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to detect performance drift' },
      { status: 500 }
    );
  }
}

async function handleGetBias(modelId: string | null): Promise<NextResponse> {
  try {
    if (!modelId) {
      return NextResponse.json(
        { error: 'model_id parameter is required' },
        { status: 400 }
      );
    }

    console.log(`⚖️ Detecting bias for model ${modelId}...`);

    const biases = await feedbackDriftEngine.detectBias(modelId);
    
    return NextResponse.json({
      success: true,
      data: biases,
      total_count: biases.length,
      model_id: modelId,
      message: `Bias detection completed for model ${modelId}`
    });

  } catch (error) {
    console.error('Failed to detect bias:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to detect bias' },
      { status: 500 }
    );
  }
}

async function handleRunNightlyCheck(): Promise<NextResponse> {
  try {
    console.log('🌙 Running nightly monitoring checks...');

    const insights = await feedbackDriftEngine.runNightlyChecks();
    
    return NextResponse.json({
      success: true,
      data: {
        insights_generated: insights.length,
        insights: insights,
        checked_at: new Date().toISOString()
      },
      message: `Nightly monitoring check completed - generated ${insights.length} insights`
    });

  } catch (error) {
    console.error('Failed to run nightly check:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to run nightly check' },
      { status: 500 }
    );
  }
}

async function handleRecordFeedback(body: any): Promise<NextResponse> {
  try {
    const { feedback } = body;

    if (!feedback) {
      return NextResponse.json(
        { error: 'feedback data is required' },
        { status: 400 }
      );
    }

    const requiredFields = ['model_id', 'inference_id', 'feedback_type', 'feedback_value', 'user_id'];
    for (const field of requiredFields) {
      if (!feedback[field]) {
        return NextResponse.json(
          { error: `${field} is required in feedback data` },
          { status: 400 }
        );
      }
    }

    console.log(`📝 Recording feedback for model ${feedback.model_id}...`);

    const feedbackRecord = await feedbackDriftEngine.recordFeedback(feedback);
    
    return NextResponse.json({
      success: true,
      data: {
        feedback_id: feedbackRecord.id,
        model_id: feedbackRecord.model_id,
        recorded_at: new Date(feedbackRecord.timestamp).toISOString()
      },
      message: `Feedback recorded successfully for model ${feedback.model_id}`
    });

  } catch (error) {
    console.error('Failed to record feedback:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to record feedback' },
      { status: 500 }
    );
  }
}

async function handleDetectDrift(body: any): Promise<NextResponse> {
  try {
    const { model_id } = body;

    if (!model_id) {
      return NextResponse.json(
        { error: 'model_id is required' },
        { status: 400 }
      );
    }

    console.log(`🔍 Running drift detection for model ${model_id}...`);

    const drifts = await feedbackDriftEngine.detectPerformanceDrift(model_id);
    
    return NextResponse.json({
      success: true,
      data: {
        model_id,
        drifts_detected: drifts.length,
        drifts: drifts,
        analyzed_at: new Date().toISOString()
      },
      message: `Drift detection completed for model ${model_id} - found ${drifts.length} drift(s)`
    });

  } catch (error) {
    console.error('Failed to detect drift:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to detect drift' },
      { status: 500 }
    );
  }
}

async function handleDetectBias(body: any): Promise<NextResponse> {
  try {
    const { model_id } = body;

    if (!model_id) {
      return NextResponse.json(
        { error: 'model_id is required' },
        { status: 400 }
      );
    }

    console.log(`⚖️ Running bias detection for model ${model_id}...`);

    const biases = await feedbackDriftEngine.detectBias(model_id);
    
    return NextResponse.json({
      success: true,
      data: {
        model_id,
        biases_detected: biases.length,
        biases: biases,
        analyzed_at: new Date().toISOString()
      },
      message: `Bias detection completed for model ${model_id} - found ${biases.length} bias(es)`
    });

  } catch (error) {
    console.error('Failed to detect bias:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to detect bias' },
      { status: 500 }
    );
  }
}