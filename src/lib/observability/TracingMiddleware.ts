/**
 * Tracing Middleware for Automatic Request Instrumentation
 * 
 * Automatically instruments all API routes with observability tracing
 * Provides webhook → database → UI flow visualization
 */

import { NextRequest, NextResponse } from 'next/server';
import openTelemetryManager, { TraceSpan } from './OpenTelemetryManager';

/**
 * Tracing Middleware - Provides automatic instrumentation wrappers
 */
export class TracingMiddleware {
  /**
   * Wrap an API route handler with automatic tracing
   */
  static wrapApiRoute<T extends any[], R>(
    handler: (...args: T) => Promise<R>,
    context: {
      userId?: string;
      organizationId?: string;
      userAgent?: string;
    } = {}
  ) {
    return async (...args: T): Promise<R> => {
      const request = args[0] as NextRequest;
      
      // Extract request context
      const requestContext = await TracingMiddleware.extractRequestContext(request);
      
      return await openTelemetryManager.traceApiRequest(
        request.method,
        new URL(request.url).pathname,
        async (span: TraceSpan) => {
          // Add context to span
          openTelemetryManager.setSpanAttributes(span, {
            'request.user_id': requestContext.userId || context.userId || '',
            'request.organization_id': requestContext.organizationId || context.organizationId || '',
            'request.user_agent': requestContext.userAgent || context.userAgent || '',
            'request.ip_address': requestContext.ipAddress || '',
            'request.session_id': requestContext.sessionId || '',
          });

          // Execute the original handler
          const result = await handler(...args);

          // Extract response information
          if (result instanceof NextResponse) {
            openTelemetryManager.setSpanAttributes(span, {
              'response.status_code': result.status,
              'response.content_length': result.headers.get('content-length') || '',
            });
          }

          return result;
        },
        {
          userId: requestContext.userId || context.userId,
          organizationId: requestContext.organizationId || context.organizationId,
          userAgent: requestContext.userAgent || context.userAgent,
        }
      );
    };
  }

  /**
   * Wrap a webhook handler with automatic tracing
   */
  static wrapWebhookHandler<T extends any[], R>(
    webhookType: string,
    handler: (...args: T) => Promise<R>,
    context: {
      userId?: string;
      organizationId?: string;
    } = {}
  ) {
    return async (...args: T): Promise<R> => {
      const request = args[0] as NextRequest;
      
      return await openTelemetryManager.traceWebhookFlow(
        webhookType,
        async (span: TraceSpan) => {
          // Try to parse webhook payload for context
          try {
            const bodyText = await request.text();
            const payload = JSON.parse(bodyText);
            
            // Add webhook-specific attributes
            openTelemetryManager.setSpanAttributes(span, {
              'webhook.payload.type': payload.type || 'unknown',
              'webhook.payload.id': payload.id || '',
              'webhook.source_ip': request.headers.get('x-forwarded-for') || '',
              'webhook.user_agent': request.headers.get('user-agent') || '',
            });

            // Extract user/org context from payload
            const userId = payload.user?.id || payload.userId;
            const organizationId = payload.organization?.id || payload.organizationId;

            if (userId) openTelemetryManager.setSpanAttributes(span, { 'webhook.user_id': userId });
            if (organizationId) openTelemetryManager.setSpanAttributes(span, { 'webhook.organization_id': organizationId });

          } catch (error) {
            openTelemetryManager.setSpanAttributes(span, { 'webhook.payload.parse_error': (error as Error).message });
          }

          // Create new request with parsed body for handler
          const newRequest = new NextRequest(request.url, {
            method: request.method,
            headers: request.headers,
            body: request.body,
          });

          return await handler(...args);
        },
        {
          userId: context.userId,
          organizationId: context.organizationId,
        }
      );
    };
  }

  /**
   * Wrap database operations with automatic tracing
   */
  static wrapDatabaseOperation<T>(
    operation: string,
    collection: string,
    dbOperation: () => Promise<T>,
    context: {
      documentId?: string;
      userId?: string;
      organizationId?: string;
    } = {}
  ): Promise<T> {
    return openTelemetryManager.traceDatabaseOperation(
      operation,
      async (span: TraceSpan) => {
        // Add database-specific attributes
        openTelemetryManager.setSpanAttributes(span, {
          'db.firestore.project_id': process.env.GOOGLE_CLOUD_PROJECT || '',
          'db.operation.type': operation,
          'db.collection.name': collection,
        });

        if (context.documentId) {
          openTelemetryManager.setSpanAttributes(span, { 'db.document.id': context.documentId });
        }

        return await dbOperation();
      },
      {
        collection,
        ...context
      }
    );
  }

  /**
   * Record feature flag evaluation
   */
  static recordFeatureFlagEvaluation(
    flagKey: string,
    result: boolean,
    context: {
      userId?: string;
      organizationId?: string;
      evaluationContext?: Record<string, any>;
    } = {}
  ): void {
    openTelemetryManager.traceFeatureFlagEvaluation(flagKey, result, {
      userId: context.userId,
      organizationId: context.organizationId,
      evaluationContext: context.evaluationContext,
    });
  }

  /**
   * Create a manual trace span for custom operations
   */
  static createManualSpan(
    name: string,
    attributes: Record<string, string | number | boolean> = {}
  ): TraceSpan {
    return openTelemetryManager.startSpan(name, { attributes });
  }

  /**
   * Finish a manual trace span
   */
  static finishManualSpan(
    span: TraceSpan,
    status: 'success' | 'error' = 'success',
    error?: Error
  ): void {
    openTelemetryManager.finishSpan(span, status, error);
  }

  /**
   * Add an event to a span
   */
  static addSpanEvent(
    span: TraceSpan,
    name: string,
    attributes: Record<string, any> = {}
  ): void {
    openTelemetryManager.addSpanEvent(span, name, attributes);
  }

  /**
   * Record a performance metric
   */
  static recordPerformanceMetric(
    name: string,
    value: number,
    unit: string,
    tags: Record<string, string> = {},
    organizationId?: string
  ): void {
    openTelemetryManager.recordMetric(name, value, unit, tags, organizationId);
  }

  /**
   * Store a trace in Retired auth (fire and forget)
   */
  static async storeTrace(
    traceData: {
      traceId: string;
      spanId: string;
      operationName: string;
      duration: number;
      status: 'success' | 'error';
      attributes: Record<string, any>;
      events: Array<{ timestamp: number; name: string; attributes: Record<string, any> }>;
    },
    organizationId?: string
  ): Promise<void> {
    try {
      const { getDb } = await import('@/lib/server/legacyAdmin');
      const db = await getDb();
      
      const collection = organizationId 
        ? db.collection('observability').doc(organizationId).collection('traces')
        : db.collection('observability').doc('system').collection('traces');
      
      await collection.doc(traceData.spanId).set({
        ...traceData,
        stored_at: new Date(),
      });
    } catch (error) {
      console.error('Error storing trace:', error);
      // Don't throw - tracing should not break the application
    }
  }

  /**
   * Extract request context from NextRequest
   */
  private static async extractRequestContext(request: NextRequest): Promise<{
    userId?: string;
    organizationId?: string;
    userAgent?: string;
    ipAddress?: string;
    sessionId?: string;
  }> {
    return {
      userAgent: request.headers.get('user-agent') || undefined,
      ipAddress: request.headers.get('x-forwarded-for') || 
                 request.headers.get('x-real-ip') || 
                 undefined,
      sessionId: request.headers.get('x-session-id') || undefined,
      // Note: userId and organizationId would typically come from auth context
      // These would be extracted from JWT tokens or session cookies in a real implementation
    };
  }
}

export default TracingMiddleware;