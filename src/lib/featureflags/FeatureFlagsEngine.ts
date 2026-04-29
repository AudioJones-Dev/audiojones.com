/**
 * Feature Flags Engine
 * Enterprise-grade feature flag system with dark launches, kill switches, and A/B testing
 */

import { getDb } from '@/lib/server/firebaseAdmin';
import { FieldValue } from "@/lib/legacy-stubs";

interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  key: string; // Unique identifier for code usage
  created_at: Date;
  updated_at: Date;
  created_by: string;
  
  // Flag Configuration
  status: 'active' | 'inactive' | 'archived';
  flag_type: 'boolean' | 'multivariate' | 'rollout' | 'kill_switch';
  
  // Rollout Configuration
  rollout: {
    enabled: boolean;
    percentage: number; // 0-100
    strategy: 'random' | 'user_id' | 'organization' | 'custom';
    ramp_rate?: number; // Percentage increase per hour for gradual rollouts
    max_percentage?: number; // Maximum rollout percentage
  };
  
  // Targeting Rules
  targeting: {
    organizations?: string[]; // Specific organization IDs
    user_segments?: string[]; // User segment identifiers
    user_attributes?: Record<string, any>; // Custom user attribute filters
    geographic?: string[]; // Geographic regions
    device_types?: string[]; // Mobile, desktop, tablet
    custom_rules?: Array<{
      attribute: string;
      operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in';
      value: any;
    }>;
  };
  
  // Variants (for A/B testing)
  variants?: Array<{
    key: string;
    name: string;
    description?: string;
    weight: number; // Percentage allocation (sum should be 100)
    value: any; // The actual feature value/config
  }>;
  
  // Kill Switch Configuration
  kill_switch?: {
    enabled: boolean;
    triggered_at?: Date;
    triggered_by?: string;
    reason?: string;
    auto_trigger_conditions?: Array<{
      metric: string;
      threshold: number;
      operator: 'greater_than' | 'less_than';
    }>;
  };
  
  // Metadata
  metadata: {
    total_evaluations: number;
    last_evaluation: Date;
    enabled_users: number;
    error_rate: number;
    performance_impact: number; // Milliseconds added to response time
  };
  
  // Integration Settings
  integration: {
    requires_restart?: boolean;
    cache_ttl?: number; // Cache time-to-live in seconds
    environments?: string[]; // dev, staging, production
    dependent_flags?: string[]; // Other flags this depends on
  };
}

interface FeatureFlagEvaluation {
  id: string;
  flag_key: string;
  user_id?: string;
  organization_id?: string;
  session_id?: string;
  
  // Evaluation Result
  enabled: boolean;
  variant?: string;
  value: any;
  
  // Context
  evaluation_context: {
    user_attributes?: Record<string, any>;
    request_context?: Record<string, any>;
    timestamp: Date;
  };
  
  // Evaluation Details
  evaluation_reason: 'targeting_match' | 'rollout_percentage' | 'default' | 'kill_switch' | 'error';
  matched_rules?: string[];
  
  // Performance
  evaluation_time_ms: number;
}

interface FeatureFlagMetrics {
  flag_key: string;
  date: string; // YYYY-MM-DD
  
  // Usage Metrics
  total_evaluations: number;
  unique_users: number;
  unique_organizations: number;
  
  // Rollout Metrics
  enabled_percentage: number;
  enabled_users: number;
  disabled_users: number;
  
  // Variant Metrics (for A/B tests)
  variant_distribution?: Record<string, number>;
  
  // Performance Metrics
  avg_evaluation_time_ms: number;
  error_rate: number;
  cache_hit_rate: number;
  
  // Business Metrics
  conversion_events?: number;
  revenue_impact?: number;
}

interface FeatureFlagContext {
  user_id?: string;
  organization_id?: string;
  session_id?: string;
  user_attributes?: Record<string, any>;
  request_context?: Record<string, any>;
}

export class FeatureFlagsEngine {
  private cache = new Map<string, { flag: FeatureFlag; expires: number }>();
  private readonly DEFAULT_CACHE_TTL = 300; // 5 minutes

  /**
   * Initialize feature flags system
   */
  async initialize(): Promise<void> {
    console.log('🚩 Initializing Feature Flags Engine...');

    const db = getDb();

    // Create default feature flags for system components
    const defaultFlags: Omit<FeatureFlag, 'id'>[] = [
      {
        name: 'Multi-Tenant Organizations',
        description: 'Enable multi-tenant organization features',
        key: 'multi_tenant_orgs',
        created_at: new Date(),
        updated_at: new Date(),
        created_by: 'system',
        status: 'active',
        flag_type: 'boolean',
        rollout: {
          enabled: true,
          percentage: 100,
          strategy: 'random'
        },
        targeting: {
          organizations: [] // Available to all orgs
        },
        metadata: {
          total_evaluations: 0,
          last_evaluation: new Date(),
          enabled_users: 0,
          error_rate: 0,
          performance_impact: 0
        },
        integration: {
          cache_ttl: 600,
          environments: ['production', 'staging', 'development']
        }
      },
      {
        name: 'Enhanced Analytics Dashboard',
        description: 'Advanced analytics and reporting features',
        key: 'enhanced_analytics',
        created_at: new Date(),
        updated_at: new Date(),
        created_by: 'system',
        status: 'active',
        flag_type: 'rollout',
        rollout: {
          enabled: true,
          percentage: 25,
          strategy: 'organization',
          ramp_rate: 5, // Increase 5% per hour
          max_percentage: 75
        },
        targeting: {
          user_segments: ['enterprise', 'pro']
        },
        metadata: {
          total_evaluations: 0,
          last_evaluation: new Date(),
          enabled_users: 0,
          error_rate: 0,
          performance_impact: 15
        },
        integration: {
          cache_ttl: 300,
          environments: ['production'],
          dependent_flags: ['multi_tenant_orgs']
        }
      },
      {
        name: 'Emergency Kill Switch',
        description: 'Master kill switch for emergency situations',
        key: 'emergency_kill_switch',
        created_at: new Date(),
        updated_at: new Date(),
        created_by: 'system',
        status: 'active',
        flag_type: 'kill_switch',
        rollout: {
          enabled: false,
          percentage: 0,
          strategy: 'random'
        },
        targeting: {},
        kill_switch: {
          enabled: false,
          auto_trigger_conditions: [
            { metric: 'error_rate', threshold: 10, operator: 'greater_than' },
            { metric: 'response_time_p95', threshold: 5000, operator: 'greater_than' }
          ]
        },
        metadata: {
          total_evaluations: 0,
          last_evaluation: new Date(),
          enabled_users: 0,
          error_rate: 0,
          performance_impact: 1
        },
        integration: {
          cache_ttl: 60, // Short cache for kill switches
          environments: ['production', 'staging']
        }
      }
    ];

    // Create default flags
    for (const flagData of defaultFlags) {
      const existingFlag = await db.collection('feature_flags')
        .where('key', '==', flagData.key)
        .limit(1)
        .get();

      if (existingFlag.empty) {
        await db.collection('feature_flags').add(flagData);
        console.log(`✅ Created default feature flag: ${flagData.key}`);
      }
    }

    // Initialize audit logging
    await db.collection('feature_flag_audit_log').add({
      timestamp: new Date(),
      action: 'system_initialized',
      details: 'Feature flags system initialized with default flags',
      user_id: 'system',
      success: true,
      metadata: {
        default_flags_count: defaultFlags.length,
        initialization_complete: true
      }
    });

    console.log('✅ Feature flags system initialized');
  }

  /**
   * Create a new feature flag
   */
  async createFeatureFlag(
    name: string,
    key: string,
    description: string,
    createdBy: string,
    config: {
      flag_type?: FeatureFlag['flag_type'];
      rollout?: Partial<FeatureFlag['rollout']>;
      targeting?: Partial<FeatureFlag['targeting']>;
      variants?: FeatureFlag['variants'];
      integration?: Partial<FeatureFlag['integration']>;
    } = {}
  ): Promise<FeatureFlag> {
    console.log(`🚩 Creating feature flag: ${name} (${key})`);

    const db = getDb();

    // Check if key already exists
    const existingFlag = await db
      .collection('feature_flags')
      .where('key', '==', key)
      .limit(1)
      .get();

    if (!existingFlag.empty) {
      throw new Error(`Feature flag with key '${key}' already exists`);
    }

    const flag: Omit<FeatureFlag, 'id'> = {
      name,
      description,
      key,
      created_at: new Date(),
      updated_at: new Date(),
      created_by: createdBy,
      status: 'inactive', // Start inactive for safety
      flag_type: config.flag_type || 'boolean',
      rollout: {
        enabled: false,
        percentage: 0,
        strategy: 'random',
        ...config.rollout
      },
      targeting: {
        ...config.targeting
      },
      variants: config.variants,
      metadata: {
        total_evaluations: 0,
        last_evaluation: new Date(),
        enabled_users: 0,
        error_rate: 0,
        performance_impact: 0
      },
      integration: {
        cache_ttl: this.DEFAULT_CACHE_TTL,
        environments: ['development'],
        ...config.integration
      }
    };

    // Create flag
    const flagRef = await db.collection('feature_flags').add(flag);

    // Log creation
    await this.logFlagActivity(key, createdBy, 'flag_created', {
      flag_name: name,
      flag_type: flag.flag_type,
      initial_rollout_percentage: flag.rollout.percentage
    });

    const createdFlag: FeatureFlag = {
      id: flagRef.id,
      ...flag
    };

    // Clear cache to force reload
    this.cache.delete(key);

    console.log(`✅ Feature flag created: ${name} (${key})`);
    return createdFlag;
  }

  /**
   * Evaluate a feature flag for a given context
   */
  async evaluateFeatureFlag(
    flagKey: string,
    context: FeatureFlagContext = {}
  ): Promise<{
    enabled: boolean;
    variant?: string;
    value: any;
    reason: string;
    evaluation_time_ms: number;
  }> {
    const startTime = Date.now();

    try {
      // Get flag (with caching)
      const flag = await this.getFeatureFlag(flagKey);
      if (!flag) {
        return {
          enabled: false,
          value: false,
          reason: 'flag_not_found',
          evaluation_time_ms: Date.now() - startTime
        };
      }

      // Check if flag is active
      if (flag.status !== 'active') {
        return {
          enabled: false,
          value: false,
          reason: 'flag_inactive',
          evaluation_time_ms: Date.now() - startTime
        };
      }

      // Check kill switch
      if (flag.kill_switch?.enabled) {
        return {
          enabled: false,
          value: false,
          reason: 'kill_switch_active',
          evaluation_time_ms: Date.now() - startTime
        };
      }

      // Check environment
      const currentEnv = process.env.NODE_ENV || 'development';
      if (flag.integration.environments && 
          !flag.integration.environments.includes(currentEnv)) {
        return {
          enabled: false,
          value: false,
          reason: 'environment_mismatch',
          evaluation_time_ms: Date.now() - startTime
        };
      }

      // Evaluate targeting rules
      const targetingResult = await this.evaluateTargeting(flag, context);
      if (!targetingResult.matches) {
        return {
          enabled: false,
          value: false,
          reason: 'targeting_mismatch',
          evaluation_time_ms: Date.now() - startTime
        };
      }

      // Evaluate rollout percentage
      const rolloutResult = this.evaluateRollout(flag, context);
      if (!rolloutResult.enabled) {
        return {
          enabled: false,
          value: false,
          reason: 'rollout_percentage',
          evaluation_time_ms: Date.now() - startTime
        };
      }

      // Determine variant (for multivariate flags)
      let variant: string | undefined;
      let value: any = true;

      if (flag.flag_type === 'multivariate' && flag.variants) {
        const variantResult = this.selectVariant(flag.variants, context);
        variant = variantResult.key;
        value = variantResult.value;
      }

      // Log evaluation
      const evaluationTime = Date.now() - startTime;
      await this.logEvaluation(flag, context, true, variant, value, 'targeting_match', evaluationTime);

      return {
        enabled: true,
        variant,
        value,
        reason: 'targeting_match',
        evaluation_time_ms: evaluationTime
      };

    } catch (error) {
      console.error(`Feature flag evaluation error for ${flagKey}:`, error);
      
      const evaluationTime = Date.now() - startTime;
      await this.logEvaluation(null, context, false, undefined, false, 'error', evaluationTime);

      return {
        enabled: false,
        value: false,
        reason: 'evaluation_error',
        evaluation_time_ms: evaluationTime
      };
    }
  }

  /**
   * Trigger kill switch for a feature flag
   */
  async triggerKillSwitch(
    flagKey: string,
    triggeredBy: string,
    reason: string
  ): Promise<void> {
    console.log(`🔴 Triggering kill switch for flag: ${flagKey}`);

    const db = getDb();

    // Get flag
    const flagQuery = await db
      .collection('feature_flags')
      .where('key', '==', flagKey)
      .limit(1)
      .get();

    if (flagQuery.empty) {
      throw new Error(`Feature flag ${flagKey} not found`);
    }

    const flagDoc = flagQuery.docs[0];

    // Update kill switch
    await flagDoc.ref.update({
      'kill_switch.enabled': true,
      'kill_switch.triggered_at': new Date(),
      'kill_switch.triggered_by': triggeredBy,
      'kill_switch.reason': reason,
      updated_at: new Date()
    });

    // Clear cache
    this.cache.delete(flagKey);

    // Log kill switch activation
    await this.logFlagActivity(flagKey, triggeredBy, 'kill_switch_activated', {
      reason,
      triggered_at: new Date().toISOString()
    });

    console.log(`✅ Kill switch activated for flag: ${flagKey}`);
  }

  /**
   * Update feature flag rollout percentage
   */
  async updateRollout(
    flagKey: string,
    percentage: number,
    updatedBy: string
  ): Promise<void> {
    console.log(`🎯 Updating rollout for flag ${flagKey}: ${percentage}%`);

    if (percentage < 0 || percentage > 100) {
      throw new Error('Rollout percentage must be between 0 and 100');
    }

    const db = getDb();

    // Get flag
    const flagQuery = await db
      .collection('feature_flags')
      .where('key', '==', flagKey)
      .limit(1)
      .get();

    if (flagQuery.empty) {
      throw new Error(`Feature flag ${flagKey} not found`);
    }

    const flagDoc = flagQuery.docs[0];
    const currentFlag = flagDoc.data() as FeatureFlag;

    // Update rollout
    await flagDoc.ref.update({
      'rollout.percentage': percentage,
      'rollout.enabled': percentage > 0,
      updated_at: new Date()
    });

    // Clear cache
    this.cache.delete(flagKey);

    // Log rollout update
    await this.logFlagActivity(flagKey, updatedBy, 'rollout_updated', {
      old_percentage: currentFlag.rollout.percentage,
      new_percentage: percentage,
      rollout_enabled: percentage > 0
    });

    console.log(`✅ Rollout updated for flag: ${flagKey}`);
  }

  /**
   * Get feature flag metrics
   */
  async getFeatureFlagMetrics(
    flagKey?: string,
    days: number = 7
  ): Promise<FeatureFlagMetrics[]> {
    const db = getDb();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    let query = db.collection('feature_flag_metrics')
      .where('date', '>=', startDate.toISOString().split('T')[0])
      .orderBy('date', 'desc');

    if (flagKey) {
      query = query.where('flag_key', '==', flagKey);
    }

    const metricsSnapshot = await query.get();
    return metricsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data
      } as unknown as FeatureFlagMetrics;
    });
  }

  /**
   * Get all feature flags
   */
  async getAllFeatureFlags(): Promise<FeatureFlag[]> {
    const db = getDb();
    const flagsSnapshot = await db
      .collection('feature_flags')
      .orderBy('created_at', 'desc')
      .get();

    return flagsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FeatureFlag[];
  }

  /**
   * Perform gradual rollout increase
   */
  async performGradualRollout(): Promise<void> {
    console.log('🎯 Performing gradual rollout increases...');

    const db = getDb();

    // Get flags with gradual rollout enabled
    const flagsSnapshot = await db
      .collection('feature_flags')
      .where('status', '==', 'active')
      .where('rollout.enabled', '==', true)
      .get();

    for (const flagDoc of flagsSnapshot.docs) {
      const flag = { id: flagDoc.id, ...flagDoc.data() } as FeatureFlag;

      if (flag.rollout.ramp_rate && flag.rollout.max_percentage) {
        const currentPercentage = flag.rollout.percentage;
        const newPercentage = Math.min(
          currentPercentage + flag.rollout.ramp_rate,
          flag.rollout.max_percentage
        );

        if (newPercentage > currentPercentage) {
          await this.updateRollout(flag.key, newPercentage, 'system-gradual-rollout');
          console.log(`📈 Increased rollout for ${flag.key}: ${currentPercentage}% → ${newPercentage}%`);
        }
      }
    }
  }

  /**
   * Private helper methods
   */

  private async getFeatureFlag(flagKey: string): Promise<FeatureFlag | null> {
    // Check cache first
    const cached = this.cache.get(flagKey);
    if (cached && cached.expires > Date.now()) {
      return cached.flag;
    }

    // Fetch from database
    const db = getDb();
    const flagQuery = await db
      .collection('feature_flags')
      .where('key', '==', flagKey)
      .limit(1)
      .get();

    if (flagQuery.empty) {
      return null;
    }

    const flagDoc = flagQuery.docs[0];
    const flag: FeatureFlag = { id: flagDoc.id, ...flagDoc.data() } as FeatureFlag;

    // Cache the flag
    const ttl = flag.integration.cache_ttl || this.DEFAULT_CACHE_TTL;
    this.cache.set(flagKey, {
      flag,
      expires: Date.now() + (ttl * 1000)
    });

    return flag;
  }

  private async evaluateTargeting(
    flag: FeatureFlag,
    context: FeatureFlagContext
  ): Promise<{ matches: boolean; matchedRules: string[] }> {
    const matchedRules: string[] = [];

    // Organization targeting
    if (flag.targeting.organizations?.length) {
      if (!context.organization_id || 
          !flag.targeting.organizations.includes(context.organization_id)) {
        return { matches: false, matchedRules };
      }
      matchedRules.push('organization_match');
    }

    // User segment targeting
    if (flag.targeting.user_segments?.length) {
      const userSegment = context.user_attributes?.segment;
      if (!userSegment || !flag.targeting.user_segments.includes(userSegment)) {
        return { matches: false, matchedRules };
      }
      matchedRules.push('user_segment_match');
    }

    // Custom rules evaluation
    if (flag.targeting.custom_rules?.length) {
      for (const rule of flag.targeting.custom_rules) {
        const userValue = context.user_attributes?.[rule.attribute];
        const matches = this.evaluateRule(userValue, rule.operator, rule.value);
        if (!matches) {
          return { matches: false, matchedRules };
        }
        matchedRules.push(`custom_rule_${rule.attribute}`);
      }
    }

    return { matches: true, matchedRules };
  }

  private evaluateRollout(
    flag: FeatureFlag,
    context: FeatureFlagContext
  ): { enabled: boolean } {
    if (!flag.rollout.enabled || flag.rollout.percentage === 0) {
      return { enabled: false };
    }

    if (flag.rollout.percentage === 100) {
      return { enabled: true };
    }

    // Generate deterministic hash based on strategy
    let hashInput: string;
    switch (flag.rollout.strategy) {
      case 'user_id':
        hashInput = `${flag.key}:${context.user_id || 'anonymous'}`;
        break;
      case 'organization':
        hashInput = `${flag.key}:${context.organization_id || 'no_org'}`;
        break;
      case 'random':
      default:
        hashInput = `${flag.key}:${context.session_id || Date.now()}`;
        break;
    }

    const hash = this.simpleHash(hashInput);
    const userPercentage = hash % 100;

    return { enabled: userPercentage < flag.rollout.percentage };
  }

  private selectVariant(
    variants: NonNullable<FeatureFlag['variants']>,
    context: FeatureFlagContext
  ): { key: string; value: any } {
    // Use user_id for consistent variant assignment
    const hashInput = `variants:${context.user_id || context.session_id || Date.now()}`;
    const hash = this.simpleHash(hashInput);
    const random = hash % 100;

    let cumulativeWeight = 0;
    for (const variant of variants) {
      cumulativeWeight += variant.weight;
      if (random < cumulativeWeight) {
        return { key: variant.key, value: variant.value };
      }
    }

    // Fallback to first variant
    return { key: variants[0].key, value: variants[0].value };
  }

  private evaluateRule(userValue: any, operator: string, ruleValue: any): boolean {
    switch (operator) {
      case 'equals':
        return userValue === ruleValue;
      case 'contains':
        return String(userValue).includes(String(ruleValue));
      case 'greater_than':
        return Number(userValue) > Number(ruleValue);
      case 'less_than':
        return Number(userValue) < Number(ruleValue);
      case 'in':
        return Array.isArray(ruleValue) && ruleValue.includes(userValue);
      default:
        return false;
    }
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  private async logEvaluation(
    flag: FeatureFlag | null,
    context: FeatureFlagContext,
    enabled: boolean,
    variant: string | undefined,
    value: any,
    reason: string,
    evaluationTimeMs: number
  ): Promise<void> {
    if (!flag) return;

    const db = getDb();

    const evaluation: Omit<FeatureFlagEvaluation, 'id'> = {
      flag_key: flag.key,
      user_id: context.user_id,
      organization_id: context.organization_id,
      session_id: context.session_id,
      enabled,
      variant,
      value,
      evaluation_context: {
        user_attributes: context.user_attributes,
        request_context: context.request_context,
        timestamp: new Date()
      },
      evaluation_reason: reason as any,
      evaluation_time_ms: evaluationTimeMs
    };

    // Log evaluation (async, don't wait)
    db.collection('feature_flag_evaluations').add(evaluation).catch(error => {
      console.error('Failed to log feature flag evaluation:', error);
    });

    // Update flag metadata
    db.collection('feature_flags').doc(flag.id).update({
      'metadata.total_evaluations': FieldValue.increment(1),
      'metadata.last_evaluation': new Date()
    }).catch(error => {
      console.error('Failed to update feature flag metadata:', error);
    });
  }

  private async logFlagActivity(
    flagKey: string,
    userId: string,
    action: string,
    metadata: Record<string, any> = {}
  ): Promise<void> {
    const db = getDb();
    await db.collection('feature_flag_audit_log').add({
      timestamp: new Date(),
      flag_key: flagKey,
      user_id: userId,
      action,
      metadata,
      success: true
    });
  }
}

export const featureFlagsEngine = new FeatureFlagsEngine();