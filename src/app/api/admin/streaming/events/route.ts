/**
 * Real-time Event Stream API
 * 
 * Provides Server-Sent Events (SSE) stream for real-time event monitoring.
 * Supports event filtering, correlation tracking, and workflow status updates.
 */

import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/server/requireAdmin';
import eventStreamingEngine from '@/lib/streaming/EventStreamingEngine';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    requireAdmin(request);
    
    const url = new URL(request.url);
    const eventTypes = url.searchParams.get('eventTypes')?.split(',').filter(Boolean);
    const organizationId = url.searchParams.get('organizationId');
    const includeMetrics = url.searchParams.get('includeMetrics') === 'true';

    // Set up Server-Sent Events stream
    const encoder = new TextEncoder();
    let isActive = true;
    const subscriptions: string[] = [];

    const stream = new ReadableStream({
      async start(controller) {
        // Send initial connection confirmation
        const initialData = {
          type: 'connection',
          timestamp: Date.now(),
          message: 'Real-time event stream connected',
          filters: {
            eventTypes: eventTypes || ['*'],
            organizationId,
            includeMetrics,
          },
        };

        controller.enqueue(encoder.encode(`data: ${JSON.stringify(initialData)}\n\n`));

        // Subscribe to events
        const subscribedTypes = eventTypes || ['*'];
        for (const eventType of subscribedTypes) {
          if (eventType === '*') {
            // Subscribe to all event types
            const allTypes = ['user.registered', 'payment.completed', 'payment.failed', 
                            'order.created', 'workflow.triggered', 'correlation.matched'];
            for (const type of allTypes) {
              const subId = eventStreamingEngine.subscribe(type, (event) => {
                if (!isActive) return;
                
                try {
                  const streamData = {
                    type: 'event',
                    timestamp: Date.now(),
                    event: event,
                  };

                  controller.enqueue(encoder.encode(`data: ${JSON.stringify(streamData)}\n\n`));
                } catch (error) {
                  console.error('Event streaming error:', error);
                }
              });
              subscriptions.push(subId);
            }
          } else {
            const subId = eventStreamingEngine.subscribe(eventType, (event) => {
              if (!isActive) return;
              
              try {
                const streamData = {
                  type: 'event',
                  timestamp: Date.now(),
                  event: event,
                };

                controller.enqueue(encoder.encode(`data: ${JSON.stringify(streamData)}\n\n`));
              } catch (error) {
                console.error('Event streaming error:', error);
              }
            });
            subscriptions.push(subId);
          }
        }

        // Send periodic metrics updates if requested
        let metricsInterval: NodeJS.Timeout | null = null;
        if (includeMetrics) {
          metricsInterval = setInterval(() => {
            if (!isActive) return;
            
            try {
              const metrics = eventStreamingEngine.getMetrics();
              const metricsData = {
                type: 'metrics',
                timestamp: Date.now(),
                metrics,
              };

              controller.enqueue(encoder.encode(`data: ${JSON.stringify(metricsData)}\n\n`));
            } catch (error) {
              console.error('Metrics streaming error:', error);
            }
          }, 5000); // Every 5 seconds
        }

        // Send periodic heartbeat
        const heartbeatInterval = setInterval(() => {
          if (!isActive) {
            clearInterval(heartbeatInterval);
            if (metricsInterval) clearInterval(metricsInterval);
            return;
          }

          try {
            const heartbeatData = {
              type: 'heartbeat',
              timestamp: Date.now(),
              status: 'alive',
            };

            controller.enqueue(encoder.encode(`data: ${JSON.stringify(heartbeatData)}\n\n`));
          } catch (error) {
            console.error('Heartbeat streaming error:', error);
          }
        }, 30000); // Every 30 seconds

        // Handle stream cleanup
        request.signal.addEventListener('abort', () => {
          isActive = false;
          clearInterval(heartbeatInterval);
          if (metricsInterval) clearInterval(metricsInterval);
          controller.close();
        });
      },

      cancel() {
        isActive = false;
        // Note: In a real implementation, you'd unsubscribe from the event engine here
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control',
      },
    });

  } catch (error) {
    console.error('Event streaming setup error:', error);
    
    if (error instanceof Error && error.message.includes('Admin required')) {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { 
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        error: 'Failed to establish event stream',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}