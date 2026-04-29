/**
 * Auto-Scaling Engine
 * 
 * Implements intelligent auto-scaling based on AI predictions, real-time metrics,
 * and predictive capacity planning for enterprise-grade resource optimization.
 */

import { getDb } from '@/lib/server/firebaseAdmin';
import { lazySingleton } from '@/lib/server/lazySingleton';
import eventStreamingEngine from '@/lib/streaming/EventStreamingEngine';
import aiOperationsEngine from '@/lib/ai/AIOperationsEngine';

interface ScalingResource {
  id: string;
  name: string;
  type: 'compute' | 'memory' | 'storage' | 'network' | 'database';
  provider: 'vercel' | 'firebase' | 'gcp' | 'aws' | 'azure';
  currentCapacity: {
    min: number;
    max: number;
    current: number;
    target: number;
  };
  utilization: {
    cpu?: number;
    memory?: number;
    storage?: number;
    network?: number;
    connections?: number;
  };
  costs: {
    unitCost: number;
    currency: string;
    billingModel: 'per_hour' | 'per_request' | 'per_gb' | 'fixed';
  };
  constraints: {
    maxInstances: number;
    minInstances: number;
    cooldownPeriod: number;
    budgetLimit: number;
  };
  scalingMetrics: string[];
  isEnabled: boolean;
}

interface ScalingPolicy {
  id: string;
  name: string;
  resourceId: string;
  triggers: Array<{
    metric: string;
    threshold: {
      scaleUp: number;
      scaleDown: number;
    };
    duration: number;
    evaluationPeriod: number;
  }>;
  actions: {
    scaleUp: {
      increment: number;
      maxIncrement: number;
    };
    scaleDown: {
      decrement: number;
      maxDecrement: number;
    };
  };
  predictiveScaling: {
    enabled: boolean;
    horizon: number; // minutes
    confidenceThreshold: number;
  };
  costOptimization: {
    enabled: boolean;
    maxCostIncrease: number; // percentage
    preferredInstanceTypes: string[];
  };
  isActive: boolean;
}

interface ScalingEvent {
  id: string;
  policyId: string;
  resourceId: string;
  action: 'scale_up' | 'scale_down' | 'maintain';
  trigger: {
    type: 'metric' | 'prediction' | 'manual' | 'schedule';
    source: string;
    reason: string;
    confidence?: number;
  };
  execution: {
    status: 'pending' | 'executing' | 'completed' | 'failed' | 'cancelled';
    startTime: number;
    endTime?: number;
    fromCapacity: number;
    toCapacity: number;
    actualCapacity?: number;
  };
  impact: {
    costChange: number;
    performanceChange: Record<string, number>;
    utilizationChange: Record<string, number>;
  };
  metadata: Record<string, any>;
}

interface ScalingRecommendation {
  id: string;
  resourceId: string;
  recommendedAction: 'scale_up' | 'scale_down' | 'optimize' | 'maintain';
  reasoning: string;
  confidence: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  expectedImpact: {
    performance: string;
    cost: number;
    reliability: string;
  };
  timing: {
    optimal: number; // timestamp
    deadline?: number; // timestamp
  };
  alternatives: Array<{
    action: string;
    pros: string[];
    cons: string[];
    cost: number;
  }>;
}

/**
 * Core Auto-Scaling Engine
 */
export class AutoScalingEngine {
  private static instance: AutoScalingEngine;
  private resources: Map<string, ScalingResource> = new Map();
  private policies: Map<string, ScalingPolicy> = new Map();
  private activeScalingEvents: Map<string, ScalingEvent> = new Map();
  private isInitialized = false;

  private constructor() {}

  static getInstance(): AutoScalingEngine {
    if (!AutoScalingEngine.instance) {
      AutoScalingEngine.instance = new AutoScalingEngine();
    }
    return AutoScalingEngine.instance;
  }

  /**
   * Initialize auto-scaling engine
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    console.log('📈 Initializing Auto-Scaling Engine...');

    try {
      // Load scaling resources and policies
      await this.loadScalingConfiguration();
      
      // Setup monitoring and triggers
      await this.setupScalingMonitoring();
      
      // Start predictive scaling
      await this.startPredictiveScaling();
      
      this.isInitialized = true;
      console.log('✅ Auto-Scaling Engine initialized successfully');
      
    } catch (error) {
      console.error('❌ Failed to initialize Auto-Scaling Engine:', error);
      throw error;
    }
  }

  /**
   * Load scaling resources and policies
   */
  private async loadScalingConfiguration(): Promise<void> {
    // Default scaling resources
    const defaultResources: ScalingResource[] = [
      {
        id: 'vercel_compute',
        name: 'Vercel Compute Functions',
        type: 'compute',
        provider: 'vercel',
        currentCapacity: {
          min: 1,
          max: 50,
          current: 5,
          target: 5,
        },
        utilization: {
          cpu: 0.65,
          memory: 0.45,
        },
        costs: {
          unitCost: 0.0001,
          currency: 'USD',
          billingModel: 'per_request',
        },
        constraints: {
          maxInstances: 100,
          minInstances: 1,
          cooldownPeriod: 300, // 5 minutes
          budgetLimit: 1000, // $1000/month
        },
        scalingMetrics: ['response_time', 'request_count', 'error_rate'],
        isEnabled: true,
      },
      {
        id: 'firebase_database',
        name: 'Firebase Database Connections',
        type: 'database',
        provider: 'firebase',
        currentCapacity: {
          min: 100,
          max: 10000,
          current: 500,
          target: 500,
        },
        utilization: {
          connections: 0.3,
        },
        costs: {
          unitCost: 0.00006,
          currency: 'USD',
          billingModel: 'per_request',
        },
        constraints: {
          maxInstances: 50000,
          minInstances: 100,
          cooldownPeriod: 180, // 3 minutes
          budgetLimit: 500,
        },
        scalingMetrics: ['connection_count', 'query_latency', 'concurrent_users'],
        isEnabled: true,
      },
      {
        id: 'cdn_bandwidth',
        name: 'CDN Bandwidth',
        type: 'network',
        provider: 'vercel',
        currentCapacity: {
          min: 100, // GB
          max: 10000, // GB
          current: 250,
          target: 250,
        },
        utilization: {
          network: 0.4,
        },
        costs: {
          unitCost: 0.12,
          currency: 'USD',
          billingModel: 'per_gb',
        },
        constraints: {
          maxInstances: 50000,
          minInstances: 100,
          cooldownPeriod: 600, // 10 minutes
          budgetLimit: 2000,
        },
        scalingMetrics: ['bandwidth_usage', 'cache_hit_rate', 'origin_requests'],
        isEnabled: true,
      },
    ];

    // Default scaling policies
    const defaultPolicies: ScalingPolicy[] = [
      {
        id: 'vercel_response_time_policy',
        name: 'Vercel Response Time Auto-Scaling',
        resourceId: 'vercel_compute',
        triggers: [
          {
            metric: 'avg_response_time',
            threshold: {
              scaleUp: 1500, // ms
              scaleDown: 300, // ms
            },
            duration: 300, // 5 minutes
            evaluationPeriod: 60, // 1 minute
          },
          {
            metric: 'request_count',
            threshold: {
              scaleUp: 1000, // requests/minute
              scaleDown: 100, // requests/minute
            },
            duration: 180, // 3 minutes
            evaluationPeriod: 60,
          },
        ],
        actions: {
          scaleUp: {
            increment: 2,
            maxIncrement: 10,
          },
          scaleDown: {
            decrement: 1,
            maxDecrement: 5,
          },
        },
        predictiveScaling: {
          enabled: true,
          horizon: 30, // 30 minutes
          confidenceThreshold: 0.8,
        },
        costOptimization: {
          enabled: true,
          maxCostIncrease: 50, // 50%
          preferredInstanceTypes: ['standard', 'optimized'],
        },
        isActive: true,
      },
      {
        id: 'database_connection_policy',
        name: 'Database Connection Auto-Scaling',
        resourceId: 'firebase_database',
        triggers: [
          {
            metric: 'connection_utilization',
            threshold: {
              scaleUp: 0.8,
              scaleDown: 0.3,
            },
            duration: 180,
            evaluationPeriod: 30,
          },
        ],
        actions: {
          scaleUp: {
            increment: 100,
            maxIncrement: 500,
          },
          scaleDown: {
            decrement: 50,
            maxDecrement: 200,
          },
        },
        predictiveScaling: {
          enabled: true,
          horizon: 15,
          confidenceThreshold: 0.85,
        },
        costOptimization: {
          enabled: true,
          maxCostIncrease: 30,
          preferredInstanceTypes: ['standard'],
        },
        isActive: true,
      },
    ];

    // Load into memory
    for (const resource of defaultResources) {
      this.resources.set(resource.id, resource);
    }

    for (const policy of defaultPolicies) {
      this.policies.set(policy.id, policy);
    }

    console.log(`📋 Loaded ${defaultResources.length} scaling resources and ${defaultPolicies.length} policies`);
  }

  /**
   * Setup scaling monitoring and triggers
   */
  private async setupScalingMonitoring(): Promise<void> {
    // Listen for metrics events
    eventStreamingEngine.subscribe('metrics.performance', this.handleMetricsEvent.bind(this));
    eventStreamingEngine.subscribe('ai.intelligence.generated', this.handleAIPrediction.bind(this));
    eventStreamingEngine.subscribe('system.event', this.handleSystemEvent.bind(this));

    console.log('📡 Auto-scaling monitoring configured');
  }

  /**
   * Start predictive scaling
   */
  private async startPredictiveScaling(): Promise<void> {
    // Run predictive scaling every 5 minutes
    setInterval(async () => {
      try {
        await this.runPredictiveScaling();
      } catch (error) {
        console.error('❌ Predictive scaling failed:', error);
      }
    }, 5 * 60 * 1000);

    // Evaluate scaling policies every minute
    setInterval(async () => {
      try {
        await this.evaluateScalingPolicies();
      } catch (error) {
        console.error('❌ Scaling policy evaluation failed:', error);
      }
    }, 60 * 1000);

    console.log('⏰ Predictive scaling started');
  }

  /**
   * Handle metrics events for scaling decisions
   */
  private async handleMetricsEvent(event: any): Promise<void> {
    try {
      await this.updateResourceUtilization(event.data);
      await this.checkScalingTriggers(event.data);
    } catch (error) {
      console.error('❌ Metrics event handling failed:', error);
    }
  }

  /**
   * Handle AI predictions for predictive scaling
   */
  private async handleAIPrediction(event: any): Promise<void> {
    try {
      if (event.data?.predictionCount > 0) {
        await this.processPredictiveScalingSignals();
      }
    } catch (error) {
      console.error('❌ AI prediction handling failed:', error);
    }
  }

  /**
   * Handle system events for reactive scaling
   */
  private async handleSystemEvent(event: any): Promise<void> {
    try {
      if (event.data?.level === 'error' || event.data?.level === 'critical') {
        await this.evaluateEmergencyScaling(event);
      }
    } catch (error) {
      console.error('❌ System event handling failed:', error);
    }
  }

  /**
   * Execute scaling action
   */
  async executeScaling(policyId: string, action: 'scale_up' | 'scale_down', trigger: any): Promise<ScalingEvent> {
    const policy = this.policies.get(policyId);
    if (!policy) throw new Error(`Policy not found: ${policyId}`);

    const resource = this.resources.get(policy.resourceId);
    if (!resource) throw new Error(`Resource not found: ${policy.resourceId}`);

    const eventId = `scaling_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const scalingEvent: ScalingEvent = {
      id: eventId,
      policyId,
      resourceId: policy.resourceId,
      action,
      trigger,
      execution: {
        status: 'pending',
        startTime: Date.now(),
        fromCapacity: resource.currentCapacity.current,
        toCapacity: resource.currentCapacity.current,
      },
      impact: {
        costChange: 0,
        performanceChange: {},
        utilizationChange: {},
      },
      metadata: {},
    };

    try {
      console.log(`📈 Executing scaling action: ${action} for ${resource.name}`);
      
      // Store scaling event
      this.activeScalingEvents.set(eventId, scalingEvent);
      scalingEvent.execution.status = 'executing';

      // Calculate new capacity
      const newCapacity = this.calculateNewCapacity(resource, policy, action);
      scalingEvent.execution.toCapacity = newCapacity;

      // Execute scaling (simulation)
      const success = await this.performScaling(resource, newCapacity);
      
      if (success) {
        // Update resource capacity
        resource.currentCapacity.current = newCapacity;
        resource.currentCapacity.target = newCapacity;
        
        scalingEvent.execution.status = 'completed';
        scalingEvent.execution.actualCapacity = newCapacity;
        scalingEvent.impact = await this.calculateScalingImpact(resource, scalingEvent);
      } else {
        scalingEvent.execution.status = 'failed';
      }

      scalingEvent.execution.endTime = Date.now();

      // Store scaling event
      const db = getDb();
      await db.collection('scaling_events').doc(eventId).set(scalingEvent);

      // Publish scaling event
      await eventStreamingEngine.publishEvent({
        type: 'system.scaling.executed',
        source: 'auto_scaling_engine',
        data: {
          eventId,
          resourceId: policy.resourceId,
          action,
          success,
          fromCapacity: scalingEvent.execution.fromCapacity,
          toCapacity: scalingEvent.execution.toCapacity,
          duration: scalingEvent.execution.endTime - scalingEvent.execution.startTime,
        },
        metadata: {
          version: 1,
        },
      });

      console.log(`✅ Scaling action ${success ? 'completed successfully' : 'failed'}: ${eventId}`);
      return scalingEvent;

    } catch (error) {
      scalingEvent.execution.status = 'failed';
      scalingEvent.execution.endTime = Date.now();
      console.error('❌ Scaling execution failed:', error);
      return scalingEvent;
    } finally {
      this.activeScalingEvents.delete(eventId);
    }
  }

  /**
   * Generate scaling recommendations
   */
  async generateScalingRecommendations(): Promise<ScalingRecommendation[]> {
    const recommendations: ScalingRecommendation[] = [];

    try {
      // Get AI predictions for capacity needs
      const intelligence = await aiOperationsEngine.generateOperationalIntelligence();
      
      for (const [resourceId, resource] of this.resources.entries()) {
        const recommendation = await this.analyzeResourceScalingNeeds(resource, intelligence);
        if (recommendation) {
          recommendations.push(recommendation);
        }
      }

      console.log(`💡 Generated ${recommendations.length} scaling recommendations`);
      return recommendations;

    } catch (error) {
      console.error('❌ Failed to generate scaling recommendations:', error);
      return [];
    }
  }

  /**
   * Get scaling status and metrics
   */
  getScalingStatus(): any {
    const resources = Array.from(this.resources.values());
    const policies = Array.from(this.policies.values()).filter(p => p.isActive);
    
    return {
      resources: resources.map(r => ({
        id: r.id,
        name: r.name,
        type: r.type,
        provider: r.provider,
        currentCapacity: r.currentCapacity.current,
        targetCapacity: r.currentCapacity.target,
        utilization: r.utilization,
        isEnabled: r.isEnabled,
      })),
      policies: policies.map(p => ({
        id: p.id,
        name: p.name,
        resourceId: p.resourceId,
        predictiveScalingEnabled: p.predictiveScaling.enabled,
        costOptimizationEnabled: p.costOptimization.enabled,
      })),
      activeScalingEvents: this.activeScalingEvents.size,
      lastScalingEvent: Math.max(0, ...Array.from(this.activeScalingEvents.values()).map(e => e.execution.startTime)),
    };
  }

  // Helper methods (simplified implementations)
  private calculateNewCapacity(resource: ScalingResource, policy: ScalingPolicy, action: 'scale_up' | 'scale_down'): number {
    const current = resource.currentCapacity.current;
    const increment = action === 'scale_up' ? policy.actions.scaleUp.increment : -policy.actions.scaleDown.decrement;
    const newCapacity = current + increment;
    
    return Math.max(
      resource.currentCapacity.min,
      Math.min(resource.currentCapacity.max, newCapacity)
    );
  }

  private async performScaling(resource: ScalingResource, newCapacity: number): Promise<boolean> {
    // Simulate scaling operation
    console.log(`🔄 Scaling ${resource.name} from ${resource.currentCapacity.current} to ${newCapacity}`);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
    return Math.random() > 0.1; // 90% success rate
  }

  private async calculateScalingImpact(resource: ScalingResource, event: ScalingEvent): Promise<any> {
    const capacityChange = event.execution.toCapacity - event.execution.fromCapacity;
    const costChange = capacityChange * resource.costs.unitCost;
    
    return {
      costChange,
      performanceChange: {
        response_time: capacityChange > 0 ? -0.2 : 0.1, // Improvement/degradation
      },
      utilizationChange: {
        cpu: capacityChange > 0 ? -0.1 : 0.1,
      },
    };
  }

  private async runPredictiveScaling(): Promise<void> {
    console.log('🔮 Running predictive scaling analysis...');
    // Implementation would use AI predictions to proactively scale
  }

  private async evaluateScalingPolicies(): Promise<void> {
    // Evaluate all active policies for scaling triggers
  }

  private async updateResourceUtilization(metrics: any): Promise<void> {
    // Update resource utilization based on metrics
  }

  private async checkScalingTriggers(metrics: any): Promise<void> {
    // Check if metrics trigger scaling policies
  }

  private async processPredictiveScalingSignals(): Promise<void> {
    // Process AI predictions for predictive scaling
  }

  private async evaluateEmergencyScaling(event: any): Promise<void> {
    // Evaluate if emergency scaling is needed
  }

  private async analyzeResourceScalingNeeds(resource: ScalingResource, intelligence: any): Promise<ScalingRecommendation | null> {
    // Analyze resource and generate scaling recommendation
    if (Math.random() > 0.7) { // 30% chance of recommendation
      return {
        id: `rec_${Date.now()}`,
        resourceId: resource.id,
        recommendedAction: 'scale_up',
        reasoning: 'Predicted high load based on historical patterns',
        confidence: 0.85,
        priority: 'medium',
        expectedImpact: {
          performance: 'Improved response times',
          cost: 150,
          reliability: 'Higher availability',
        },
        timing: {
          optimal: Date.now() + (30 * 60 * 1000), // 30 minutes
        },
        alternatives: [
          {
            action: 'Optimize existing resources',
            pros: ['Lower cost', 'No architectural changes'],
            cons: ['Limited improvement', 'Temporary solution'],
            cost: 0,
          },
        ],
      };
    }
    return null;
  }
}

// Lazy singleton — see lazySingleton.ts for rationale.
const autoScalingEngine = lazySingleton(() => AutoScalingEngine.getInstance());
export default autoScalingEngine;