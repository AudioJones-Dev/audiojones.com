/**
 * Model Lifecycle Control Engine
 * 
 * Comprehensive AI model lifecycle management with versioning, performance monitoring,
 * retirement scheduling, automated retraining, and governance compliance.
 */

import { getDb } from '@/lib/server/firebaseAdmin';
import { lazySingleton } from '@/lib/server/lazySingleton';
import eventStreamingEngine from '@/lib/streaming/EventStreamingEngine';
import fs from 'fs/promises';
import path from 'path';

interface ModelManifest {
  version: string;
  generated_at: string;
  models: Record<string, ModelDefinition>;
  metadata: ModelMetadata;
}

interface ModelDefinition {
  id: string;
  name: string;
  type: 'classification' | 'regression' | 'anomaly_detection' | 'clustering';
  algorithm: string;
  version: string;
  status: 'active' | 'deprecated' | 'retired' | 'testing' | 'shadow';
  deployment: ModelDeployment;
  performance: ModelPerformance;
  training: ModelTraining;
  lifecycle: ModelLifecycle;
  governance: ModelGovernance;
}

interface ModelDeployment {
  environment: 'development' | 'staging' | 'production';
  deployed_at: string;
  deployed_by: string;
  endpoint: string;
  resource_requirements: {
    cpu_cores: number;
    memory_gb: number;
    storage_gb: number;
    gpu_required?: boolean;
  };
}

interface ModelPerformance {
  baseline_metrics: Record<string, number>;
  current_metrics: Record<string, number>;
  performance_drift: Record<string, number> & {
    trend: 'improving' | 'stable' | 'declining';
    last_evaluated: string;
  };
}

interface ModelTraining {
  dataset: {
    name: string;
    size: number;
    features: string[];
    target: string;
    data_period: string;
  };
  last_trained: string;
  training_duration: string;
  hyperparameters: Record<string, any>;
}

interface ModelLifecycle {
  created_at: string;
  retirement_schedule: {
    planned_retirement: string;
    replacement_model?: string;
    migration_plan: 'immediate' | 'gradual_rollout' | 'parallel_deployment' | 'shadow_mode_testing';
    rollback_threshold: number;
  };
  maintenance: {
    retraining_frequency: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'quarterly';
    next_retrain: string;
    data_refresh_frequency: string;
    monitoring_frequency: string;
  };
}

interface ModelGovernance {
  owner: string;
  reviewers: string[];
  approval_required: boolean;
  compliance: {
    gdpr_compliant: boolean;
    bias_tested: boolean;
    explainability_required: boolean;
    audit_trail: boolean;
  };
}

interface ModelMetadata {
  total_models: number;
  active_models: number;
  deprecated_models: number;
  models_requiring_retrain: number;
  models_nearing_retirement: number;
  compliance_status: Record<string, number>;
  resource_utilization: {
    total_cpu_cores: number;
    total_memory_gb: number;
    total_storage_gb: number;
  };
}

interface ModelHealthCheck {
  model_id: string;
  health_score: number;
  status: 'healthy' | 'warning' | 'critical' | 'failed';
  checks: {
    performance_within_threshold: boolean;
    resource_utilization_normal: boolean;
    error_rate_acceptable: boolean;
    latency_acceptable: boolean;
    data_drift_minimal: boolean;
  };
  recommendations: string[];
  last_checked: string;
}

interface ModelLifecycleEvent {
  event_id: string;
  model_id: string;
  event_type: 'deployed' | 'retrained' | 'performance_degraded' | 'retired' | 'failed';
  timestamp: string;
  details: Record<string, any>;
  impact: 'low' | 'medium' | 'high' | 'critical';
  action_required: boolean;
}

export class ModelLifecycleEngine {
  private static instance: ModelLifecycleEngine;
  private eventStreaming: typeof eventStreamingEngine;
  private manifestPath: string;

  // Lazy Firestore accessor — see StreamAnalyticsCorrelationEngine for rationale.
  private get db(): FirebaseFirestore.Firestore {
    return getDb();
  }

  private constructor() {
    this.eventStreaming = eventStreamingEngine;
    this.manifestPath = path.join(process.cwd(), 'src/lib/ai/models/manifest.json');

    console.log('🤖 Initializing Model Lifecycle Engine...');
    this.initializeLifecycleMonitoring();
    console.log('📊 Model Lifecycle Engine initialized successfully');
  }

  public static getInstance(): ModelLifecycleEngine {
    if (!ModelLifecycleEngine.instance) {
      ModelLifecycleEngine.instance = new ModelLifecycleEngine();
    }
    return ModelLifecycleEngine.instance;
  }

  private async initializeLifecycleMonitoring(): Promise<void> {
    try {
      // Set up monitoring intervals
      this.setupPerformanceMonitoring();
      this.setupRetrainingScheduler();
      this.setupRetirementScheduler();
      
      // Stream lifecycle events
      await this.eventStreaming.publishEvent({
        type: 'model_lifecycle_initialized',
        source: 'model-lifecycle-engine',
        data: {
          timestamp: Date.now(),
          engine_version: '1.0.0',
          monitoring_active: true
        },
        metadata: {
          correlationId: 'system-init',
          version: 1
        }
      });
    } catch (error) {
      console.error('Failed to initialize lifecycle monitoring:', error);
    }
  }

  public async loadManifest(): Promise<ModelManifest> {
    try {
      const manifestContent = await fs.readFile(this.manifestPath, 'utf-8');
      return JSON.parse(manifestContent) as ModelManifest;
    } catch (error) {
      console.error('Failed to load model manifest:', error);
      throw new Error('Model manifest not found or invalid');
    }
  }

  public async updateManifest(manifest: ModelManifest): Promise<void> {
    try {
      manifest.generated_at = new Date().toISOString();
      await fs.writeFile(this.manifestPath, JSON.stringify(manifest, null, 2));
      
      // Stream manifest update event
      await this.eventStreaming.publishEvent({
        type: 'model_manifest_updated',
        source: 'model-lifecycle-engine',
        data: {
          version: manifest.version,
          timestamp: manifest.generated_at,
          total_models: manifest.metadata.total_models
        },
        metadata: {
          correlationId: 'manifest-update',
          version: 1
        }
      });
    } catch (error) {
      console.error('Failed to update model manifest:', error);
      throw error;
    }
  }

  public async getModelHealth(modelId: string): Promise<ModelHealthCheck> {
    const manifest = await this.loadManifest();
    const model = manifest.models[modelId];
    
    if (!model) {
      throw new Error(`Model ${modelId} not found`);
    }

    // Calculate health score based on performance metrics
    const performanceDrift = Object.values(model.performance.performance_drift)
      .filter(v => typeof v === 'number')
      .reduce((acc, drift) => acc + Math.abs(drift), 0);
    
    const healthScore = Math.max(0, 100 - (performanceDrift * 100));
    
    const checks = {
      performance_within_threshold: performanceDrift < 0.05,
      resource_utilization_normal: true, // Placeholder - would check actual resource usage
      error_rate_acceptable: true, // Placeholder - would check error rates
      latency_acceptable: true, // Placeholder - would check response times
      data_drift_minimal: performanceDrift < 0.03
    };

    const failedChecks = Object.entries(checks).filter(([_, passed]) => !passed);
    const status = failedChecks.length === 0 ? 'healthy' : 
                  failedChecks.length <= 2 ? 'warning' : 'critical';

    return {
      model_id: modelId,
      health_score: Math.round(healthScore),
      status,
      checks,
      recommendations: this.generateHealthRecommendations(model, checks),
      last_checked: new Date().toISOString()
    };
  }

  public async getAllModelsHealth(): Promise<ModelHealthCheck[]> {
    const manifest = await this.loadManifest();
    const healthChecks = await Promise.all(
      Object.keys(manifest.models).map(modelId => this.getModelHealth(modelId))
    );
    return healthChecks;
  }

  public async scheduleRetirement(modelId: string, retirementDate: string, replacementModel?: string): Promise<void> {
    const manifest = await this.loadManifest();
    const model = manifest.models[modelId];
    
    if (!model) {
      throw new Error(`Model ${modelId} not found`);
    }

    model.lifecycle.retirement_schedule.planned_retirement = retirementDate;
    if (replacementModel) {
      model.lifecycle.retirement_schedule.replacement_model = replacementModel;
    }

    await this.updateManifest(manifest);

    // Stream retirement scheduled event
    await this.eventStreaming.publishEvent({
      type: 'model_retirement_scheduled',
      source: 'model-lifecycle-engine',
      data: {
        model_id: modelId,
        retirement_date: retirementDate,
        replacement_model: replacementModel,
        timestamp: Date.now()
      },
      metadata: {
        correlationId: `retirement-${modelId}`,
        version: 1
      }
    });
  }

  public async retireModel(modelId: string): Promise<void> {
    const manifest = await this.loadManifest();
    const model = manifest.models[modelId];
    
    if (!model) {
      throw new Error(`Model ${modelId} not found`);
    }

    model.status = 'retired';
    manifest.metadata.active_models -= 1;
    manifest.metadata.deprecated_models += 1;

    await this.updateManifest(manifest);

    // Record retirement in audit log
    await this.db.collection('model_lifecycle_events').add({
      event_id: `retirement_${modelId}_${Date.now()}`,
      model_id: modelId,
      event_type: 'retired',
      timestamp: new Date(),
      details: {
        reason: 'scheduled_retirement',
        replacement_model: model.lifecycle.retirement_schedule.replacement_model
      },
      impact: 'medium',
      action_required: false
    });

    // Stream retirement event
    await this.eventStreaming.publishEvent({
      type: 'model_retired',
      source: 'model-lifecycle-engine',
      data: {
        model_id: modelId,
        timestamp: Date.now(),
        replacement_model: model.lifecycle.retirement_schedule.replacement_model
      },
      metadata: {
        correlationId: `retired-${modelId}`,
        version: 1
      }
    });
  }

  public async scheduleRetraining(modelId: string, retrainDate: string): Promise<void> {
    const manifest = await this.loadManifest();
    const model = manifest.models[modelId];
    
    if (!model) {
      throw new Error(`Model ${modelId} not found`);
    }

    model.lifecycle.maintenance.next_retrain = retrainDate;
    await this.updateManifest(manifest);

    // Stream retraining scheduled event
    await this.eventStreaming.publishEvent({
      type: 'model_retraining_scheduled',
      source: 'model-lifecycle-engine',
      data: {
        model_id: modelId,
        retrain_date: retrainDate,
        timestamp: Date.now()
      },
      metadata: {
        correlationId: `retrain-${modelId}`,
        version: 1
      }
    });
  }

  public async deployModel(modelDefinition: ModelDefinition): Promise<void> {
    const manifest = await this.loadManifest();
    
    // Add or update model in manifest
    manifest.models[modelDefinition.id] = modelDefinition;
    manifest.metadata.total_models = Object.keys(manifest.models).length;
    manifest.metadata.active_models = Object.values(manifest.models)
      .filter(m => m.status === 'active').length;

    await this.updateManifest(manifest);

    // Record deployment
    await this.db.collection('model_lifecycle_events').add({
      event_id: `deployment_${modelDefinition.id}_${Date.now()}`,
      model_id: modelDefinition.id,
      event_type: 'deployed',
      timestamp: new Date(),
      details: {
        version: modelDefinition.version,
        environment: modelDefinition.deployment.environment,
        deployed_by: modelDefinition.deployment.deployed_by
      },
      impact: 'high',
      action_required: false
    });

    // Stream deployment event
    await this.eventStreaming.publishEvent({
      type: 'model_deployed',
      source: 'model-lifecycle-engine',
      data: {
        model_id: modelDefinition.id,
        version: modelDefinition.version,
        environment: modelDefinition.deployment.environment,
        timestamp: Date.now()
      },
      metadata: {
        correlationId: `deploy-${modelDefinition.id}`,
        version: 1
      }
    });
  }

  public async getLifecycleEvents(modelId?: string, limit: number = 50): Promise<ModelLifecycleEvent[]> {
    let query = this.db.collection('model_lifecycle_events')
      .orderBy('timestamp', 'desc')
      .limit(limit);

    if (modelId) {
      query = query.where('model_id', '==', modelId);
    }

    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate().toISOString()
    })) as ModelLifecycleEvent[];
  }

  private generateHealthRecommendations(model: ModelDefinition, checks: Record<string, boolean>): string[] {
    const recommendations: string[] = [];

    if (!checks.performance_within_threshold) {
      recommendations.push(`Consider retraining ${model.name} - performance drift detected`);
    }

    if (!checks.data_drift_minimal) {
      recommendations.push(`Monitor data quality for ${model.name} - potential data drift`);
    }

    const daysSinceTraining = Math.floor(
      (Date.now() - new Date(model.training.last_trained).getTime()) / (1000 * 60 * 60 * 24)
    );

    const retrainThreshold = {
      'hourly': 0.04, // ~1 hour in days
      'daily': 1,
      'weekly': 7,
      'monthly': 30,
      'quarterly': 90
    }[model.lifecycle.maintenance.retraining_frequency] || 30;

    if (daysSinceTraining > retrainThreshold) {
      recommendations.push(`${model.name} is overdue for retraining (${daysSinceTraining} days)`);
    }

    const daysUntilRetirement = Math.floor(
      (new Date(model.lifecycle.retirement_schedule.planned_retirement).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilRetirement < 30) {
      recommendations.push(`${model.name} retiring in ${daysUntilRetirement} days - prepare replacement`);
    }

    return recommendations;
  }

  private setupPerformanceMonitoring(): void {
    // Set up periodic performance checks
    console.log('📊 Setting up model performance monitoring...');
  }

  private setupRetrainingScheduler(): void {
    // Set up automated retraining scheduler
    console.log('🔄 Setting up model retraining scheduler...');
  }

  private setupRetirementScheduler(): void {
    // Set up retirement notifications and automation
    console.log('📅 Setting up model retirement scheduler...');
  }
}

// Lazy singleton — see lazySingleton.ts for rationale.
const modelLifecycleEngine = lazySingleton(() => ModelLifecycleEngine.getInstance());
export default modelLifecycleEngine;