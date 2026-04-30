/**
 * Internal Observability Manager
 * 
 * Simplified internal observability system that provides enterprise-grade
 * tracing and monitoring without external OpenTelemetry dependencies.
 * 
 * Features:
 * - Distributed tracing across webhook→DB→UI flows
 * - Performance metrics collection
 * - Firebase-based storage and real-time monitoring
 * - Automatic instrumentation for webhooks, API routes, and DB operations
 * - Memory-efficient batched logging
 * - Enterprise security with organization-level isolation
 */

import { getDb } from '@/lib/server/firebaseAdmin';

// Type definitions for our internal tracing system
export interface TraceSpan {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  operationName: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  status: 'running' | 'success' | 'error';
  attributes: Record<string, string | number | boolean>;
  events: TraceEvent[];
  organizationId?: string;
  userId?: string;
}

export interface TraceEvent {
  timestamp: number;
  name: string;
  attributes: Record<string, any>;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  tags: Record<string, string>;
  organizationId?: string;
}

export interface SystemHealth {
  timestamp: number;
  cpuUsage?: number;
  memoryUsage?: number;
  activeConnections?: number;
  responseTime?: number;
  errorRate?: number;
  throughput?: number;
}

/**
 * Internal Observability Manager
 * 
 * Provides enterprise-grade observability without external dependencies
 */
export class InternalObservabilityManager {
  private isInitialized = false;
  private activeSpans = new Map<string, TraceSpan>();
  private metricsBuffer: PerformanceMetric[] = [];
  private healthBuffer: SystemHealth[] = [];
  private flushInterval: NodeJS.Timeout | null = null;
  
  // Configuration
  private readonly config = {
    bufferSize: 100,
    flushIntervalMs: 10000, // 10 seconds
    maxSpanDuration: 300000, // 5 minutes
    samplingRate: process.env.TRACE_SAMPLING_RATE ? parseFloat(process.env.TRACE_SAMPLING_RATE) : 1.0,
  };

  /**
   * Initialize the observability system
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      console.log('🔍 Initializing Internal Observability System...');

      // Initialize Firebase connection test
      await this.initializeFirebaseTracing();

      // Start metrics flushing
      this.startMetricsFlush();

      // Clean up old data periodically
      this.startCleanupTasks();

      this.isInitialized = true;
      console.log('✅ Internal Observability System initialized successfully');

      // Record initialization metric
      this.recordMetric('system.observability.initialized', 1, 'count', {
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0'
      });

    } catch (error) {
      console.error('❌ Failed to initialize observability system:', error);
      // Don't throw - system should work without observability
    }
  }

  /**
   * Initialize Firebase-specific tracing
   */
  private async initializeFirebaseTracing() {
    try {
      const db = await getDb();
      await db.collection('system_monitoring').doc('observability_init').set({
        initialized_at: new Date(),
        service_name: 'audiojones-platform',
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0',
        status: 'active'
      });

      console.log('✅ Firebase tracing integration initialized');
    } catch (error) {
      console.error('⚠️ Firebase tracing initialization warning:', error);
      // Don't fail initialization if Firebase is unavailable
    }
  }

  /**
   * Start the metrics flushing process
   */
  private startMetricsFlush() {
    this.flushInterval = setInterval(() => {
      this.flushMetrics().catch(error => {
        console.error('Error flushing metrics:', error);
      });
    }, this.config.flushIntervalMs);
  }

  /**
   * Start cleanup tasks for old data
   */
  private startCleanupTasks() {
    // Clean up old traces every hour
    setInterval(() => {
      this.cleanupOldData().catch(error => {
        console.error('Error during cleanup:', error);
      });
    }, 3600000); // 1 hour
  }

  /**
   * Generate a unique trace ID
   */
  private generateTraceId(): string {
    return `trace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate a unique span ID
   */
  private generateSpanId(): string {
    return `span_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Start a new trace span
   */
  startSpan(
    operationName: string,
    options: {
      parentSpanId?: string;
      traceId?: string;
      attributes?: Record<string, string | number | boolean>;
      userId?: string;
      organizationId?: string;
    } = {}
  ): TraceSpan {
    // Apply sampling
    if (Math.random() > this.config.samplingRate) {
      // Return a no-op span for sampling
      return this.createNoOpSpan(operationName);
    }

    const span: TraceSpan = {
      traceId: options.traceId || this.generateTraceId(),
      spanId: this.generateSpanId(),
      parentSpanId: options.parentSpanId,
      operationName,
      startTime: Date.now(),
      status: 'running',
      attributes: {
        'service.name': 'audiojones-platform',
        'service.version': '1.0.0',
        'environment': process.env.NODE_ENV || 'development',
        ...options.attributes,
      },
      events: [],
      userId: options.userId,
      organizationId: options.organizationId,
    };

    // Store active span
    this.activeSpans.set(span.spanId, span);

    return span;
  }

  /**
   * Create a no-op span for sampling
   */
  private createNoOpSpan(operationName: string): TraceSpan {
    return {
      traceId: 'sampled_out',
      spanId: 'sampled_out',
      operationName,
      startTime: Date.now(),
      status: 'running',
      attributes: {},
      events: [],
    };
  }

  /**
   * Finish a trace span
   */
  finishSpan(span: TraceSpan, status: 'success' | 'error' = 'success', error?: Error) {
    if (span.spanId === 'sampled_out') {
      return; // No-op for sampled out spans
    }

    const endTime = Date.now();
    span.endTime = endTime;
    span.duration = endTime - span.startTime;
    span.status = status;

    if (error) {
      span.attributes['error.message'] = error.message;
      span.attributes['error.name'] = error.name;
      span.attributes['error.stack'] = error.stack || '';
    }

    // Remove from active spans
    this.activeSpans.delete(span.spanId);

    // Store completed span (async, don't wait)
    this.storeSpan(span).catch(error => {
      console.error('Error storing span:', error);
    });
  }

  /**
   * Add an event to a span
   */
  addSpanEvent(span: TraceSpan, name: string, attributes: Record<string, any> = {}) {
    if (span.spanId === 'sampled_out') {
      return; // No-op for sampled out spans
    }

    span.events.push({
      timestamp: Date.now(),
      name,
      attributes,
    });
  }

  /**
   * Set span attributes
   */
  setSpanAttributes(span: TraceSpan, attributes: Record<string, string | number | boolean>) {
    if (span.spanId === 'sampled_out') {
      return; // No-op for sampled out spans
    }

    Object.assign(span.attributes, attributes);
  }

  /**
   * Record a performance metric
   */
  recordMetric(
    name: string,
    value: number,
    unit: string,
    tags: Record<string, string> = {},
    organizationId?: string
  ) {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: Date.now(),
      tags: {
        'service.name': 'audiojones-platform',
        'environment': process.env.NODE_ENV || 'development',
        ...tags,
      },
      organizationId,
    };

    this.metricsBuffer.push(metric);

    // Flush if buffer is full
    if (this.metricsBuffer.length >= this.config.bufferSize) {
      this.flushMetrics().catch(error => {
        console.error('Error flushing metrics buffer:', error);
      });
    }
  }

  /**
   * Record system health metrics
   */
  recordSystemHealth(health: Partial<SystemHealth>) {
    const healthMetric: SystemHealth = {
      timestamp: Date.now(),
      ...health,
    };

    this.healthBuffer.push(healthMetric);

    // Keep only latest health metrics
    if (this.healthBuffer.length > 50) {
      this.healthBuffer = this.healthBuffer.slice(-50);
    }
  }

  /**
   * Store a completed span in Firebase
   */
  private async storeSpan(span: TraceSpan) {
    try {
      const db = await getDb();
      
      // Store in traces collection with organization isolation
      const traceDoc = {
        ...span,
        stored_at: new Date(),
      };

      // Use organization-specific subcollection if available
      if (span.organizationId) {
        await db
          .collection('observability')
          .doc(span.organizationId)
          .collection('traces')
          .doc(span.spanId)
          .set(traceDoc);
      } else {
        await db
          .collection('observability')
          .doc('system')
          .collection('traces')
          .doc(span.spanId)
          .set(traceDoc);
      }

    } catch (error) {
      console.error('Error storing span:', error);
      // Don't throw - tracing should not break the application
    }
  }

  /**
   * Flush metrics buffer to Firebase
   */
  private async flushMetrics() {
    if (this.metricsBuffer.length === 0 && this.healthBuffer.length === 0) {
      return;
    }

    try {
      const db = await getDb();
      const batch = db.batch();

      // Flush performance metrics
      for (const metric of this.metricsBuffer) {
        const docRef = db
          .collection('observability')
          .doc(metric.organizationId || 'system')
          .collection('metrics')
          .doc();

        batch.set(docRef, {
          ...metric,
          stored_at: new Date(),
        });
      }

      // Flush health metrics
      for (const health of this.healthBuffer) {
        const docRef = db
          .collection('observability')
          .doc('system')
          .collection('health')
          .doc();

        batch.set(docRef, {
          ...health,
          stored_at: new Date(),
        });
      }

      await batch.commit();

      console.log(`📊 Flushed ${this.metricsBuffer.length} metrics and ${this.healthBuffer.length} health records`);

      // Clear buffers
      this.metricsBuffer = [];
      this.healthBuffer = [];

    } catch (error) {
      console.error('Error flushing metrics:', error);
      // Keep metrics in buffer for retry
    }
  }

  /**
   * Clean up old observability data
   */
  private async cleanupOldData() {
    try {
      const db = await getDb();
      const cutoffTime = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

      // Clean up old traces
      const oldTraces = await db
        .collectionGroup('traces')
        .where('stored_at', '<', cutoffTime)
        .limit(100)
        .get();

      const batch = db.batch();
      oldTraces.forEach((doc: any) => {
        batch.delete(doc.ref);
      });

      // Clean up old metrics
      const oldMetrics = await db
        .collectionGroup('metrics')
        .where('stored_at', '<', cutoffTime)
        .limit(100)
        .get();

      oldMetrics.forEach((doc: any) => {
        batch.delete(doc.ref);
      });

      if (oldTraces.size > 0 || oldMetrics.size > 0) {
        await batch.commit();
        console.log(`🧹 Cleaned up ${oldTraces.size} old traces and ${oldMetrics.size} old metrics`);
      }

    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }

  /**
   * Get active spans (for debugging)
   */
  getActiveSpans(): TraceSpan[] {
    return Array.from(this.activeSpans.values());
  }

  /**
   * Get system status
   */
  getSystemStatus() {
    return {
      initialized: this.isInitialized,
      activeSpans: this.activeSpans.size,
      metricsBufferSize: this.metricsBuffer.length,
      healthBufferSize: this.healthBuffer.length,
      samplingRate: this.config.samplingRate,
    };
  }

  /**
   * Shutdown the observability system
   */
  async shutdown() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }

    // Final flush
    await this.flushMetrics();
    
    this.isInitialized = false;
    console.log('🔍 Internal Observability System shutdown complete');
  }

  // High-level tracing methods for common patterns

  /**
   * Trace webhook processing flow
   */
  async traceWebhookFlow<T>(
    webhookType: string,
    operation: (span: TraceSpan) => Promise<T>,
    context: {
      userId?: string;
      organizationId?: string;
      payload?: any;
    } = {}
  ): Promise<T> {
    const span = this.startSpan(`webhook.${webhookType}`, {
      attributes: {
        'webhook.type': webhookType,
        'webhook.source': 'whop',
        'operation.type': 'webhook_processing',
      },
      userId: context.userId,
      organizationId: context.organizationId,
    });

    try {
      // Add payload metadata (without sensitive data)
      if (context.payload) {
        this.setSpanAttributes(span, {
          'webhook.payload.keys': Object.keys(context.payload).join(','),
          'webhook.payload.size': JSON.stringify(context.payload).length,
        });
      }

      this.addSpanEvent(span, 'webhook.processing.started');

      // Execute operation
      const result = await operation(span);

      this.addSpanEvent(span, 'webhook.processing.completed');
      this.finishSpan(span, 'success');

      // Record success metrics
      this.recordMetric('webhook.processed', 1, 'count', {
        type: webhookType,
        status: 'success',
      }, context.organizationId);

      return result;

    } catch (error) {
      this.addSpanEvent(span, 'webhook.processing.error', {
        error: (error as Error).message,
      });
      this.finishSpan(span, 'error', error as Error);

      // Record error metrics
      this.recordMetric('webhook.processed', 1, 'count', {
        type: webhookType,
        status: 'error',
      }, context.organizationId);

      throw error;
    }
  }

  /**
   * Trace database operations
   */
  async traceDatabaseOperation<T>(
    operation: string,
    dbOperation: (span: TraceSpan) => Promise<T>,
    context: {
      collection?: string;
      userId?: string;
      organizationId?: string;
    } = {}
  ): Promise<T> {
    const span = this.startSpan(`db.${operation}`, {
      attributes: {
        'db.operation': operation,
        'db.system': 'firebase',
        'db.collection': context.collection || 'unknown',
        'operation.type': 'database',
      },
      userId: context.userId,
      organizationId: context.organizationId,
    });

    try {
      this.addSpanEvent(span, 'db.operation.started');
      
      const result = await dbOperation(span);
      
      this.addSpanEvent(span, 'db.operation.completed');
      this.finishSpan(span, 'success');

      // Record database metrics
      this.recordMetric('db.operation', 1, 'count', {
        operation,
        collection: context.collection || 'unknown',
        status: 'success',
      }, context.organizationId);

      return result;

    } catch (error) {
      this.addSpanEvent(span, 'db.operation.error', {
        error: (error as Error).message,
      });
      this.finishSpan(span, 'error', error as Error);

      this.recordMetric('db.operation', 1, 'count', {
        operation,
        collection: context.collection || 'unknown',
        status: 'error',
      }, context.organizationId);

      throw error;
    }
  }

  /**
   * Trace API request processing
   */
  async traceApiRequest<T>(
    method: string,
    path: string,
    operation: (span: TraceSpan) => Promise<T>,
    context: {
      userId?: string;
      organizationId?: string;
      userAgent?: string;
    } = {}
  ): Promise<T> {
    const span = this.startSpan(`api.${method.toLowerCase()}.${path.replace(/\//g, '.')}`, {
      attributes: {
        'http.method': method,
        'http.route': path,
        'http.user_agent': context.userAgent || '',
        'operation.type': 'api_request',
      },
      userId: context.userId,
      organizationId: context.organizationId,
    });

    const startTime = Date.now();

    try {
      this.addSpanEvent(span, 'api.request.started');
      
      const result = await operation(span);
      
      const duration = Date.now() - startTime;
      this.addSpanEvent(span, 'api.request.completed', { duration });
      this.setSpanAttributes(span, {
        'http.status_code': 200,
        'operation.duration_ms': duration,
      });
      this.finishSpan(span, 'success');

      // Record API metrics
      this.recordMetric('api.request', 1, 'count', {
        method,
        path,
        status: '200',
      }, context.organizationId);

      this.recordMetric('api.request.duration', duration, 'ms', {
        method,
        path,
      }, context.organizationId);

      return result;

    } catch (error) {
      const duration = Date.now() - startTime;
      this.addSpanEvent(span, 'api.request.error', {
        error: (error as Error).message,
        duration,
      });
      this.setSpanAttributes(span, {
        'http.status_code': 500,
        'operation.duration_ms': duration,
      });
      this.finishSpan(span, 'error', error as Error);

      this.recordMetric('api.request', 1, 'count', {
        method,
        path,
        status: '500',
      }, context.organizationId);

      throw error;
    }
  }

  /**
   * Trace feature flag evaluation
   */
  traceFeatureFlagEvaluation(
    flagKey: string,
    result: boolean,
    context: {
      userId?: string;
      organizationId?: string;
      evaluationContext?: Record<string, any>;
    } = {}
  ) {
    const span = this.startSpan(`feature_flag.${flagKey}`, {
      attributes: {
        'feature_flag.key': flagKey,
        'feature_flag.result': result,
        'feature_flag.context': JSON.stringify(context.evaluationContext || {}),
        'operation.type': 'feature_flag_evaluation',
      },
      userId: context.userId,
      organizationId: context.organizationId,
    });

    this.addSpanEvent(span, 'feature_flag.evaluated', {
      result,
      context: context.evaluationContext,
    });

    this.finishSpan(span, 'success');

    // Record feature flag metrics
    this.recordMetric('feature_flag.evaluation', 1, 'count', {
      flag_key: flagKey,
      result: result ? 'enabled' : 'disabled',
    }, context.organizationId);
  }
}

// Export singleton instance
export const openTelemetryManager = new InternalObservabilityManager();

// Initialize automatically in production
if (process.env.NODE_ENV === 'production' || process.env.ENABLE_TRACING === 'true') {
  openTelemetryManager.initialize().catch(error => {
    console.error('Failed to initialize observability system:', error);
  });
}

export default openTelemetryManager;