/**
 * Event Streaming API
 * 
 * Provides REST API for event publishing, querying, and stream management.
 * Supports real-time event streaming with Server-Sent Events (SSE).
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server/requireAdmin';
import eventStreamingEngine from '@/lib/streaming/EventStreamingEngine';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    requireAdmin(request);
    const adminUserId = 'admin-user';

    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'publish_event':
        {
          const eventId = await eventStreamingEngine.publishEvent({
            type: data.type,
            source: data.source || 'api',
            data: data.data || {},
            metadata: {
              organizationId: data.organizationId,
              correlationId: data.correlationId,
              causationId: data.causationId,
              version: 1,
              ...data.metadata,
            },
            headers: data.headers,
          });

          return NextResponse.json({
            success: true,
            eventId,
            message: 'Event published successfully',
          });
        }

      case 'create_pattern':
        {
          const patternId = await eventStreamingEngine.createEventPattern({
            name: data.name,
            description: data.description,
            conditions: data.conditions,
            timeWindow: data.timeWindow || 300000, // 5 minutes default
            actions: data.actions,
            enabled: data.enabled !== false,
            organizationId: data.organizationId,
          });

          return NextResponse.json({
            success: true,
            patternId,
            message: 'Event pattern created successfully',
          });
        }

      case 'replay_events':
        {
          const replayResult = await eventStreamingEngine.replayEvents({
            startTime: data.startTime,
            endTime: data.endTime,
            eventTypes: data.eventTypes,
            organizationId: data.organizationId,
            dryRun: data.dryRun || false,
          });

          return NextResponse.json({
            success: true,
            result: replayResult,
            message: 'Event replay completed successfully',
          });
        }

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Event streaming API POST error:', error);
    
    if (error instanceof Error && error.message.includes('Admin required')) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to process streaming request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    requireAdmin(request);

    const url = new URL(request.url);
    const action = url.searchParams.get('action') || 'query_events';
    const organizationId = url.searchParams.get('organizationId');

    switch (action) {
      case 'query_events':
        {
          const eventTypes = url.searchParams.get('eventTypes')?.split(',').filter(Boolean);
          const startTime = url.searchParams.get('startTime') ? 
            parseInt(url.searchParams.get('startTime')!) : undefined;
          const endTime = url.searchParams.get('endTime') ? 
            parseInt(url.searchParams.get('endTime')!) : undefined;
          const correlationId = url.searchParams.get('correlationId');
          const limit = url.searchParams.get('limit') ? 
            parseInt(url.searchParams.get('limit')!) : 100;

          const events = await eventStreamingEngine.queryEvents({
            eventTypes,
            startTime,
            endTime,
            organizationId: organizationId || undefined,
            correlationId: correlationId || undefined,
            limit,
          });

          return NextResponse.json({
            events,
            count: events.length,
            query: {
              eventTypes,
              startTime,
              endTime,
              organizationId,
              correlationId,
              limit,
            },
          });
        }

      case 'metrics':
        {
          const metrics = eventStreamingEngine.getMetrics();

          return NextResponse.json({
            metrics,
            timestamp: Date.now(),
            status: 'healthy',
          });
        }

      case 'health':
        {
          const metrics = eventStreamingEngine.getMetrics();
          const isHealthy = metrics.errorRate < 5 && metrics.eventsPerSecond >= 0;

          return NextResponse.json({
            status: isHealthy ? 'healthy' : 'degraded',
            metrics: {
              uptime: metrics.uptime,
              eventsProcessed: metrics.eventsProcessed,
              eventsPerSecond: metrics.eventsPerSecond,
              errorRate: metrics.errorRate,
            },
            timestamp: Date.now(),
          });
        }

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Event streaming API GET error:', error);
    
    if (error instanceof Error && error.message.includes('Admin required')) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to process streaming query',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}