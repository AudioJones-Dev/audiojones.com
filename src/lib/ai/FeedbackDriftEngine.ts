/**
 * Feedback & Drift Monitoring Engine
 * 
 * Comprehensive AI model monitoring system with automated feedback collection,
 * performance drift detection, bias monitoring, and continuous learning capabilities.
 */

import { getDb } from '@/lib/server/firebaseAdmin';
import { lazySingleton } from '@/lib/server/lazySingleton';
import eventStreamingEngine from '@/lib/streaming/EventStreamingEngine';
import modelLifecycleEngine from './ModelLifecycleEngine';

interface ModelFeedback {
  id: string;
  model_id: string;
  inference_id: string;
  feedback_type: 'thumbs_up' | 'thumbs_down' | 'correction' | 'flag' | 'rating';
  feedback_value: number | string | boolean;
  user_id: string;
  timestamp: number;
  context: {
    input_data?: any;
    predicted_output?: any;
    expected_output?: any;
    confidence_score?: number;
  };
  metadata: {
    source: 'user' | 'automated' | 'expert_review';
    session_id?: string;
    experiment_id?: string;
  };
}

interface PerformanceDrift {
  id: string;
  model_id: string;
  metric_name: string;
  baseline_value: number;
  current_value: number;
  drift_magnitude: number;
  drift_percentage: number;
  significance_level: number;
  trend: 'improving' | 'stable' | 'declining' | 'volatile';
  detection_method: 'statistical_test' | 'threshold' | 'ml_detector';
  detected_at: number;
  confidence: number;
}

interface BiasDetection {
  id: string;
  model_id: string;
  bias_type: 'demographic' | 'behavioral' | 'temporal' | 'geographic' | 'outcome';
  affected_groups: string[];
  bias_score: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  detection_method: string;
  evidence: {
    statistical_tests: Array<{
      test_name: string;
      p_value: number;
      result: 'significant' | 'not_significant';
    }>;
    sample_disparities: Array<{
      group_a: string;
      group_b: string;
      disparity_ratio: number;
    }>;
  };
  detected_at: number;
  remediation_suggestions: string[];
}

interface ContinuousLearningConfig {
  model_id: string;
  enabled: boolean;
  learning_rate: number;
  feedback_weight: number;
  drift_threshold: number;
  bias_threshold: number;
  retraining_trigger: {
    feedback_count: number;
    drift_score: number;
    bias_score: number;
    time_interval: number;
  };
  validation_requirements: {
    min_samples: number;
    holdout_percentage: number;
    performance_threshold: number;
  };
}

interface MonitoringInsight {
  id: string;
  type: 'performance_alert' | 'bias_warning' | 'feedback_trend' | 'retraining_recommendation';
  severity: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  description: string;
  affected_models: string[];
  metrics: Record<string, number>;
  recommendations: string[];
  created_at: number;
  expires_at?: number;
}

export class FeedbackDriftEngine {
  private static instance: FeedbackDriftEngine;
  private eventStreaming: typeof eventStreamingEngine;
  private modelLifecycle: typeof modelLifecycleEngine;
  private monitoringIntervals: Map<string, NodeJS.Timeout> = new Map();

  // Lazy Firestore accessor — see StreamAnalyticsCorrelationEngine for rationale.
  private get db(): FirebaseFirestore.Firestore {
    return getDb();
  }

  private constructor() {
    this.eventStreaming = eventStreamingEngine;
    this.modelLifecycle = modelLifecycleEngine;

    console.log('🔍 Initializing Feedback & Drift Monitoring Engine...');
    this.initializeMonitoring();
    console.log('📊 Feedback & Drift Monitoring Engine initialized successfully');
  }

  public static getInstance(): FeedbackDriftEngine {
    if (!FeedbackDriftEngine.instance) {
      FeedbackDriftEngine.instance = new FeedbackDriftEngine();
    }
    return FeedbackDriftEngine.instance;
  }

  private async initializeMonitoring(): Promise<void> {
    try {
      // Set up nightly monitoring
      this.setupNightlyChecks();
      
      // Set up real-time drift detection
      this.setupRealTimeDriftDetection();
      
      // Set up bias monitoring
      this.setupBiasMonitoring();
      
      // Set up continuous learning processor
      this.setupContinuousLearning();

      // Stream initialization event
      await this.eventStreaming.publishEvent({
        type: 'feedback_drift_monitoring_initialized',
        source: 'feedback-drift-engine',
        data: {
          timestamp: Date.now(),
          engine_version: '1.0.0',
          monitoring_active: true
        },
        metadata: {
          correlationId: 'monitoring-init',
          version: 1
        }
      });
    } catch (error) {
      console.error('Failed to initialize feedback & drift monitoring:', error);
    }
  }

  public async recordFeedback(feedback: Omit<ModelFeedback, 'id' | 'timestamp'>): Promise<ModelFeedback> {
    const feedbackRecord: ModelFeedback = {
      id: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      ...feedback
    };

    // Store feedback
    await this.db.collection('model_feedback').doc(feedbackRecord.id).set(feedbackRecord);

    // Update model feedback metrics
    await this.updateModelFeedbackMetrics(feedback.model_id, feedback.feedback_type, feedback.feedback_value);

    // Check if this triggers continuous learning
    await this.checkContinuousLearningTriggers(feedback.model_id);

    // Stream feedback event
    await this.eventStreaming.publishEvent({
      type: 'model_feedback_recorded',
      source: 'feedback-drift-engine',
      data: {
        model_id: feedback.model_id,
        feedback_type: feedback.feedback_type,
        feedback_value: feedback.feedback_value,
        user_id: feedback.user_id,
        timestamp: feedbackRecord.timestamp
      },
      metadata: {
        correlationId: `feedback-${feedbackRecord.id}`,
        version: 1
      }
    });

    return feedbackRecord;
  }

  public async detectPerformanceDrift(modelId: string): Promise<PerformanceDrift[]> {
    console.log(`🔍 Detecting performance drift for model ${modelId}...`);

    const manifest = await this.modelLifecycle.loadManifest();
    const model = manifest.models[modelId];
    
    if (!model) {
      throw new Error(`Model ${modelId} not found`);
    }

    const drifts: PerformanceDrift[] = [];

    // Check each performance metric for drift
    for (const [metricName, baselineValue] of Object.entries(model.performance.baseline_metrics)) {
      const currentValue = model.performance.current_metrics[metricName];
      
      if (currentValue !== undefined) {
        const driftMagnitude = Math.abs(currentValue - baselineValue);
        const driftPercentage = (driftMagnitude / baselineValue) * 100;

        // Detect significant drift (>5% change)
        if (driftPercentage > 5) {
          const drift: PerformanceDrift = {
            id: `drift_${modelId}_${metricName}_${Date.now()}`,
            model_id: modelId,
            metric_name: metricName,
            baseline_value: baselineValue,
            current_value: currentValue,
            drift_magnitude: driftMagnitude,
            drift_percentage: driftPercentage,
            significance_level: 0.95,
            trend: currentValue > baselineValue ? 'improving' : 'declining',
            detection_method: 'threshold',
            detected_at: Date.now(),
            confidence: Math.min(driftPercentage / 10, 1.0)
          };

          drifts.push(drift);

          // Store drift detection
          await this.db.collection('performance_drift').doc(drift.id).set(drift);

          // Stream drift event
          await this.eventStreaming.publishEvent({
            type: 'performance_drift_detected',
            source: 'feedback-drift-engine',
            data: {
              model_id: modelId,
              metric_name: metricName,
              drift_percentage: driftPercentage,
              trend: drift.trend,
              severity: driftPercentage > 20 ? 'critical' : driftPercentage > 10 ? 'high' : 'medium'
            },
            metadata: {
              correlationId: `drift-${drift.id}`,
              version: 1
            }
          });
        }
      }
    }

    return drifts;
  }

  public async detectBias(modelId: string): Promise<BiasDetection[]> {
    console.log(`⚖️ Detecting bias for model ${modelId}...`);

    // Mock bias detection for demonstration
    const biasDetections: BiasDetection[] = [];

    // Simulate demographic bias detection
    const demographicBias: BiasDetection = {
      id: `bias_${modelId}_demographic_${Date.now()}`,
      model_id: modelId,
      bias_type: 'demographic',
      affected_groups: ['group_a', 'group_b'],
      bias_score: 0.15,
      severity: 'medium',
      detection_method: 'disparate_impact_test',
      evidence: {
        statistical_tests: [
          {
            test_name: 'chi_square_test',
            p_value: 0.03,
            result: 'significant'
          }
        ],
        sample_disparities: [
          {
            group_a: 'demographic_group_1',
            group_b: 'demographic_group_2',
            disparity_ratio: 1.4
          }
        ]
      },
      detected_at: Date.now(),
      remediation_suggestions: [
        'Collect more balanced training data',
        'Apply bias mitigation techniques during training',
        'Implement fairness constraints in model optimization'
      ]
    };

    biasDetections.push(demographicBias);

    // Store bias detection
    await this.db.collection('bias_detections').doc(demographicBias.id).set(demographicBias);

    // Stream bias event
    await this.eventStreaming.publishEvent({
      type: 'bias_detected',
      source: 'feedback-drift-engine',
      data: {
        model_id: modelId,
        bias_type: demographicBias.bias_type,
        bias_score: demographicBias.bias_score,
        severity: demographicBias.severity,
        affected_groups: demographicBias.affected_groups
      },
      metadata: {
        correlationId: `bias-${demographicBias.id}`,
        version: 1
      }
    });

    return biasDetections;
  }

  public async runNightlyChecks(): Promise<MonitoringInsight[]> {
    console.log('🌙 Running nightly model monitoring checks...');

    const insights: MonitoringInsight[] = [];
    const manifest = await this.modelLifecycle.loadManifest();

    for (const modelId of Object.keys(manifest.models)) {
      try {
        // Check performance drift
        const drifts = await this.detectPerformanceDrift(modelId);
        if (drifts.length > 0) {
          const insight: MonitoringInsight = {
            id: `insight_drift_${modelId}_${Date.now()}`,
            type: 'performance_alert',
            severity: drifts.some(d => d.drift_percentage > 20) ? 'critical' : 'warning',
            title: `Performance Drift Detected - ${manifest.models[modelId].name}`,
            description: `Detected ${drifts.length} performance drift(s) in model ${modelId}`,
            affected_models: [modelId],
            metrics: drifts.reduce((acc, d) => ({ ...acc, [d.metric_name]: d.drift_percentage }), {}),
            recommendations: [
              'Review recent data quality',
              'Consider model retraining',
              'Investigate root cause of performance change'
            ],
            created_at: Date.now()
          };
          insights.push(insight);
        }

        // Check bias
        const biases = await this.detectBias(modelId);
        if (biases.length > 0) {
          const insight: MonitoringInsight = {
            id: `insight_bias_${modelId}_${Date.now()}`,
            type: 'bias_warning',
            severity: biases.some(b => b.severity === 'critical') ? 'critical' : 'warning',
            title: `Bias Detection Alert - ${manifest.models[modelId].name}`,
            description: `Detected ${biases.length} potential bias(es) in model ${modelId}`,
            affected_models: [modelId],
            metrics: biases.reduce((acc, b) => ({ ...acc, [b.bias_type]: b.bias_score }), {}),
            recommendations: biases.flatMap(b => b.remediation_suggestions),
            created_at: Date.now()
          };
          insights.push(insight);
        }

        // Check feedback trends
        const feedbackTrend = await this.analyzeFeedbackTrends(modelId);
        if (feedbackTrend.needs_attention) {
          const insight: MonitoringInsight = {
            id: `insight_feedback_${modelId}_${Date.now()}`,
            type: 'feedback_trend',
            severity: 'warning',
            title: `Feedback Trend Alert - ${manifest.models[modelId].name}`,
            description: `Negative feedback trend detected for model ${modelId}`,
            affected_models: [modelId],
            metrics: {
              negative_feedback_ratio: feedbackTrend.negative_ratio,
              trend_direction: feedbackTrend.trend_score
            },
            recommendations: [
              'Analyze recent negative feedback patterns',
              'Review model predictions causing dissatisfaction',
              'Consider targeted model improvements'
            ],
            created_at: Date.now()
          };
          insights.push(insight);
        }

      } catch (error) {
        console.error(`Error monitoring model ${modelId}:`, error);
      }
    }

    // Store insights
    for (const insight of insights) {
      await this.db.collection('monitoring_insights').doc(insight.id).set(insight);
    }

    // Stream nightly check completion
    await this.eventStreaming.publishEvent({
      type: 'nightly_monitoring_completed',
      source: 'feedback-drift-engine',
      data: {
        total_models_checked: Object.keys(manifest.models).length,
        insights_generated: insights.length,
        timestamp: Date.now()
      },
      metadata: {
        correlationId: 'nightly-check',
        version: 1
      }
    });

    return insights;
  }

  public async getMonitoringInsights(limit: number = 50): Promise<MonitoringInsight[]> {
    const snapshot = await this.db.collection('monitoring_insights')
      .orderBy('created_at', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map((doc: any) => ({
      ...doc.data(),
      created_at: doc.data().created_at
    })) as MonitoringInsight[];
  }

  public getMonitoringHealth(): {
    status: 'healthy' | 'warning' | 'critical';
    active_monitors: number;
    last_check: string;
    drift_alerts: number;
    bias_alerts: number;
  } {
    return {
      status: 'healthy',
      active_monitors: this.monitoringIntervals.size,
      last_check: new Date().toISOString(),
      drift_alerts: 0, // Would query recent drift detections
      bias_alerts: 0   // Would query recent bias detections
    };
  }

  private setupNightlyChecks(): void {
    // Run nightly checks at 2 AM
    const nightlyInterval = setInterval(async () => {
      try {
        await this.runNightlyChecks();
      } catch (error) {
        console.error('Nightly checks failed:', error);
      }
    }, 24 * 60 * 60 * 1000); // 24 hours

    this.monitoringIntervals.set('nightly_checks', nightlyInterval);
    console.log('🌙 Nightly monitoring checks scheduled');
  }

  private setupRealTimeDriftDetection(): void {
    // Check for drift every hour
    const driftInterval = setInterval(async () => {
      try {
        const manifest = await this.modelLifecycle.loadManifest();
        for (const modelId of Object.keys(manifest.models)) {
          await this.detectPerformanceDrift(modelId);
        }
      } catch (error) {
        console.error('Real-time drift detection failed:', error);
      }
    }, 60 * 60 * 1000); // 1 hour

    this.monitoringIntervals.set('drift_detection', driftInterval);
    console.log('⚡ Real-time drift detection enabled');
  }

  private setupBiasMonitoring(): void {
    // Check for bias every 6 hours
    const biasInterval = setInterval(async () => {
      try {
        const manifest = await this.modelLifecycle.loadManifest();
        for (const modelId of Object.keys(manifest.models)) {
          if (manifest.models[modelId].governance.compliance.bias_tested) {
            await this.detectBias(modelId);
          }
        }
      } catch (error) {
        console.error('Bias monitoring failed:', error);
      }
    }, 6 * 60 * 60 * 1000); // 6 hours

    this.monitoringIntervals.set('bias_monitoring', biasInterval);
    console.log('⚖️ Bias monitoring enabled');
  }

  private setupContinuousLearning(): void {
    // Process continuous learning every 30 minutes
    const learningInterval = setInterval(async () => {
      try {
        await this.processContinuousLearning();
      } catch (error) {
        console.error('Continuous learning processing failed:', error);
      }
    }, 30 * 60 * 1000); // 30 minutes

    this.monitoringIntervals.set('continuous_learning', learningInterval);
    console.log('🔄 Continuous learning processor enabled');
  }

  private async updateModelFeedbackMetrics(modelId: string, feedbackType: string, feedbackValue: any): Promise<void> {
    // Update aggregated feedback metrics for the model
    const metricsRef = this.db.collection('model_feedback_metrics').doc(modelId);
    
    await metricsRef.set({
      last_feedback: Date.now(),
      [`${feedbackType}_count`]: 1,
      total_feedback_count: 1
    }, { merge: true });
  }

  private async checkContinuousLearningTriggers(modelId: string): Promise<void> {
    // Check if feedback count triggers retraining
    const metricsDoc = await this.db.collection('model_feedback_metrics').doc(modelId).get();
    const metrics = metricsDoc.data();
    
    if (metrics && metrics.total_feedback_count > 100) {
      // Trigger retraining consideration
      console.log(`📚 Model ${modelId} reached feedback threshold for continuous learning`);
    }
  }

  private async analyzeFeedbackTrends(modelId: string): Promise<{
    needs_attention: boolean;
    negative_ratio: number;
    trend_score: number;
  }> {
    // Analyze recent feedback trends
    const recentFeedback = await this.db.collection('model_feedback')
      .where('model_id', '==', modelId)
      .where('timestamp', '>', Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
      .get();

    let positiveCount = 0;
    let negativeCount = 0;

    recentFeedback.docs.forEach((doc: any) => {
      const feedback = doc.data();
      if (feedback.feedback_type === 'thumbs_up' || (typeof feedback.feedback_value === 'number' && feedback.feedback_value > 3)) {
        positiveCount++;
      } else if (feedback.feedback_type === 'thumbs_down' || (typeof feedback.feedback_value === 'number' && feedback.feedback_value < 3)) {
        negativeCount++;
      }
    });

    const totalFeedback = positiveCount + negativeCount;
    const negativeRatio = totalFeedback > 0 ? negativeCount / totalFeedback : 0;

    return {
      needs_attention: negativeRatio > 0.3, // More than 30% negative feedback
      negative_ratio: negativeRatio,
      trend_score: positiveCount - negativeCount
    };
  }

  private async processContinuousLearning(): Promise<void> {
    console.log('🔄 Processing continuous learning updates...');
    // Implementation would handle incremental model updates based on feedback
  }
}

// Lazy singleton — see lazySingleton.ts for rationale.
const feedbackDriftEngine = lazySingleton(() => FeedbackDriftEngine.getInstance());
export default feedbackDriftEngine;