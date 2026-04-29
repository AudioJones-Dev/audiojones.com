/**
 * Model Lifecycle Control API
 * 
 * REST endpoints for AI model lifecycle management including health monitoring,
 * retirement scheduling, retraining automation, and governance compliance.
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server/requireAdmin';
import modelLifecycleEngine from '@/lib/ai/ModelLifecycleEngine';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const url = new URL(request.url);
    const action = url.searchParams.get('action') || 'manifest';

    switch (action) {
      case 'manifest':
        return await handleGetManifest();
      
      case 'health':
        const modelId = url.searchParams.get('model_id');
        return await handleGetHealth(modelId);
      
      case 'events':
        const modelIdForEvents = url.searchParams.get('model_id');
        const limit = parseInt(url.searchParams.get('limit') || '50');
        return await handleGetEvents(modelIdForEvents, limit);
      
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}. Available: manifest, health, events` },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('❌ Model Lifecycle API error:', error);
    return NextResponse.json(
      { 
        error: 'Model lifecycle request failed',
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
      case 'schedule_retirement':
        return await handleScheduleRetirement(body);
      
      case 'retire_model':
        return await handleRetireModel(body);
      
      case 'schedule_retraining':
        return await handleScheduleRetraining(body);
      
      case 'deploy_model':
        return await handleDeployModel(body);
      
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}. Available: schedule_retirement, retire_model, schedule_retraining, deploy_model` },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('❌ Model Lifecycle API error:', error);
    return NextResponse.json(
      { 
        error: 'Model lifecycle operation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

async function handleGetManifest(): Promise<NextResponse> {
  try {
    console.log('📋 Fetching model manifest...');

    const manifest = await modelLifecycleEngine.loadManifest();
    
    return NextResponse.json({
      success: true,
      data: manifest,
      message: 'Model manifest retrieved successfully'
    });

  } catch (error) {
    console.error('Failed to get manifest:', error);
    return NextResponse.json(
      { error: 'Failed to load model manifest' },
      { status: 500 }
    );
  }
}

async function handleGetHealth(modelId: string | null): Promise<NextResponse> {
  try {
    console.log('🏥 Fetching model health...');

    if (modelId) {
      const health = await modelLifecycleEngine.getModelHealth(modelId);
      return NextResponse.json({
        success: true,
        data: health,
        message: `Health check for model ${modelId} completed`
      });
    } else {
      const allHealth = await modelLifecycleEngine.getAllModelsHealth();
      return NextResponse.json({
        success: true,
        data: allHealth,
        message: 'Health check for all models completed'
      });
    }

  } catch (error) {
    console.error('Failed to get model health:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve model health' },
      { status: 500 }
    );
  }
}

async function handleGetEvents(modelId: string | null, limit: number): Promise<NextResponse> {
  try {
    console.log('📋 Fetching lifecycle events...');

    const events = await modelLifecycleEngine.getLifecycleEvents(modelId || undefined, limit);
    
    return NextResponse.json({
      success: true,
      data: events,
      total_count: events.length,
      filter: { model_id: modelId, limit },
      message: 'Lifecycle events retrieved successfully'
    });

  } catch (error) {
    console.error('Failed to get lifecycle events:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve lifecycle events' },
      { status: 500 }
    );
  }
}

async function handleScheduleRetirement(body: any): Promise<NextResponse> {
  try {
    const { model_id, retirement_date, replacement_model } = body;

    if (!model_id || !retirement_date) {
      return NextResponse.json(
        { error: 'model_id and retirement_date are required' },
        { status: 400 }
      );
    }

    console.log(`📅 Scheduling retirement for model ${model_id}...`);

    await modelLifecycleEngine.scheduleRetirement(model_id, retirement_date, replacement_model);
    
    return NextResponse.json({
      success: true,
      data: {
        model_id,
        retirement_date,
        replacement_model,
        scheduled_at: new Date().toISOString()
      },
      message: `Retirement scheduled for model ${model_id}`
    });

  } catch (error) {
    console.error('Failed to schedule retirement:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to schedule retirement' },
      { status: 500 }
    );
  }
}

async function handleRetireModel(body: any): Promise<NextResponse> {
  try {
    const { model_id } = body;

    if (!model_id) {
      return NextResponse.json(
        { error: 'model_id is required' },
        { status: 400 }
      );
    }

    console.log(`🚫 Retiring model ${model_id}...`);

    await modelLifecycleEngine.retireModel(model_id);
    
    return NextResponse.json({
      success: true,
      data: {
        model_id,
        retired_at: new Date().toISOString()
      },
      message: `Model ${model_id} retired successfully`
    });

  } catch (error) {
    console.error('Failed to retire model:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to retire model' },
      { status: 500 }
    );
  }
}

async function handleScheduleRetraining(body: any): Promise<NextResponse> {
  try {
    const { model_id, retrain_date } = body;

    if (!model_id || !retrain_date) {
      return NextResponse.json(
        { error: 'model_id and retrain_date are required' },
        { status: 400 }
      );
    }

    console.log(`🔄 Scheduling retraining for model ${model_id}...`);

    await modelLifecycleEngine.scheduleRetraining(model_id, retrain_date);
    
    return NextResponse.json({
      success: true,
      data: {
        model_id,
        retrain_date,
        scheduled_at: new Date().toISOString()
      },
      message: `Retraining scheduled for model ${model_id}`
    });

  } catch (error) {
    console.error('Failed to schedule retraining:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to schedule retraining' },
      { status: 500 }
    );
  }
}

async function handleDeployModel(body: any): Promise<NextResponse> {
  try {
    const { model_definition } = body;

    if (!model_definition) {
      return NextResponse.json(
        { error: 'model_definition is required' },
        { status: 400 }
      );
    }

    console.log(`🚀 Deploying model ${model_definition.id}...`);

    await modelLifecycleEngine.deployModel(model_definition);
    
    return NextResponse.json({
      success: true,
      data: {
        model_id: model_definition.id,
        version: model_definition.version,
        environment: model_definition.deployment.environment,
        deployed_at: new Date().toISOString()
      },
      message: `Model ${model_definition.id} deployed successfully`
    });

  } catch (error) {
    console.error('Failed to deploy model:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to deploy model' },
      { status: 500 }
    );
  }
}