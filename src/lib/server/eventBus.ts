/**
 * Audio Jones Event Bus
 * 
 * Unified publish/subscribe system for all Audio Jones events.
 * Centralizes event handling, logging, and webhook delivery.
 * 
 * Features:
 * - Writes all events to Firestore collection `aj_event_bus`
 * - Forwards to matching webhook targets with HMAC signing
 * - Returns delivery stats and event IDs
 * - Supports arbitrary event types
 * - Built on existing webhook infrastructure
 */

import { getDb } from './firebaseAdmin';
import { getActiveWebhookTargets } from './statusWebhookTargets';
import { deliverWebhookWithRetry } from './statusWebhookStore';
import { generateWebhookSignature } from './statusEvents';

export interface EventBusEvent {
  event_id: string;
  event_type: string;
  payload: any;
  metadata?: Record<string, any>;
  source?: string;
  created_at: string;
  dispatched_to: number;
  delivery_success: number;
  delivery_failed: number;
}

export interface PublishResult {
  event_id: string;
  dispatched_to: number;
  delivery_attempts: {
    target_id: string;
    url: string;
    success: boolean;
    error?: string;
  }[];
}

export interface EventHandler {
  (payload: any, metadata?: Record<string, any>): Promise<void>;
}

// In-memory event handlers for local subscriptions
const eventHandlers = new Map<string, EventHandler[]>();

/**
 * Publish an event to the event bus
 * 
 * @param type Event type (e.g., 'status_change', 'capacity_alert')
 * @param payload Event payload data
 * @param meta Optional metadata (source, correlation_id, etc.)
 * @returns Promise with event ID and delivery stats
 */
export async function publishEvent(
  type: string,
  payload: any,
  meta?: Record<string, any>
): Promise<PublishResult> {
  const eventId = `aj_event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const timestamp = new Date().toISOString();

  console.log(`📢 Publishing event: ${type} (${eventId})`);

  try {
    // 1. Get active webhook targets that subscribe to this event type
    const targets = await getActiveWebhookTargets(type);
    const matchingTargets = targets; // getActiveWebhookTargets already filters by event type

    console.log(`Found ${matchingTargets.length} matching targets for event type: ${type}`);

    // 2. Prepare the webhook payload
    const webhookPayload = {
      event_id: eventId,
      event_type: type,
      timestamp,
      payload,
      ...(meta && { metadata: meta })
    };

    // 3. Deliver to webhook targets
    const deliveryAttempts: PublishResult['delivery_attempts'] = [];
    let successCount = 0;
    let failureCount = 0;

    for (const target of matchingTargets) {
      try {
        // Generate signature for this target
        const signature = generateWebhookSignature(
          JSON.stringify(webhookPayload),
          target.secret || ''
        );

        // Deliver webhook with retry mechanism
        const deliveryResult = await deliverWebhookWithRetry({
          event_id: eventId,
          url: target.url,
          payload: webhookPayload,
          headers: {
            'Content-Type': 'application/json',
            'X-AJ-Signature': signature,
            'X-AJ-Timestamp': timestamp,
            'X-AJ-Event': type,
            'User-Agent': 'AudioJones-EventBus/1.0'
          }
        });

        if (deliveryResult.success) {
          successCount++;
          deliveryAttempts.push({
            target_id: target.id || 'unknown',
            url: target.url,
            success: true
          });
        } else {
          failureCount++;
          deliveryAttempts.push({
            target_id: target.id || 'unknown',
            url: target.url,
            success: false,
            error: deliveryResult.error
          });
        }

      } catch (error) {
        console.error(`Failed to deliver event ${eventId} to ${target.url}:`, error);
        failureCount++;
        deliveryAttempts.push({
          target_id: target.id || 'unknown',
          url: target.url,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    // 4. Store event in Firestore
    const eventRecord: EventBusEvent = {
      event_id: eventId,
      event_type: type,
      payload,
      metadata: meta,
      source: meta?.source || 'unknown',
      created_at: timestamp,
      dispatched_to: matchingTargets.length,
      delivery_success: successCount,
      delivery_failed: failureCount
    };

    await getDb().collection('aj_event_bus').doc(eventId).set(eventRecord);

    // 5. Trigger local event handlers
    const handlers = eventHandlers.get(type) || [];
    for (const handler of handlers) {
      try {
        await handler(payload, meta);
      } catch (error) {
        console.error(`Local event handler failed for ${type}:`, error);
      }
    }

    console.log(`✅ Event ${eventId} published: ${successCount} success, ${failureCount} failed`);

    return {
      event_id: eventId,
      dispatched_to: matchingTargets.length,
      delivery_attempts: deliveryAttempts
    };

  } catch (error) {
    console.error(`Failed to publish event ${eventId}:`, error);
    
    // Still store the event even if delivery failed
    try {
      const eventRecord: EventBusEvent = {
        event_id: eventId,
        event_type: type,
        payload,
        metadata: { ...meta, error: error instanceof Error ? error.message : 'Unknown error' },
        source: meta?.source || 'unknown',
        created_at: timestamp,
        dispatched_to: 0,
        delivery_success: 0,
        delivery_failed: 0
      };

      await getDb().collection('aj_event_bus').doc(eventId).set(eventRecord);
    } catch (storeError) {
      console.error(`Failed to store failed event ${eventId}:`, storeError);
    }

    throw error;
  }
}

/**
 * Subscribe to events locally (for in-process handlers)
 * 
 * @param type Event type to subscribe to
 * @param handler Function to call when event is published
 */
export function subscribeEvent(type: string, handler: EventHandler): void {
  if (!eventHandlers.has(type)) {
    eventHandlers.set(type, []);
  }
  
  eventHandlers.get(type)!.push(handler);
  console.log(`📬 Subscribed to event type: ${type}`);
}

/**
 * Unsubscribe from events
 * 
 * @param type Event type to unsubscribe from
 * @param handler Handler function to remove
 */
export function unsubscribeEvent(type: string, handler: EventHandler): void {
  const handlers = eventHandlers.get(type);
  if (handlers) {
    const index = handlers.indexOf(handler);
    if (index !== -1) {
      handlers.splice(index, 1);
      console.log(`📭 Unsubscribed from event type: ${type}`);
    }
  }
}

/**
 * Get recent events from the event bus
 * 
 * @param limit Maximum number of events to return
 * @param eventType Optional filter by event type
 * @returns Promise with array of events
 */
export async function getRecentEvents(
  limit: number = 100,
  eventType?: string
): Promise<EventBusEvent[]> {
  try {
    let query = getDb().collection('aj_event_bus')
      .orderBy('created_at', 'desc')
      .limit(limit);

    if (eventType) {
      query = query.where('event_type', '==', eventType);
    }

    const snapshot = await query.get();
    return snapshot.docs.map((doc: any) => doc.data() as EventBusEvent);
    
  } catch (error) {
    console.error('Failed to get recent events:', error);
    return [];
  }
}

/**
 * Get event statistics
 * 
 * @returns Promise with event bus statistics
 */
export async function getEventBusStats(): Promise<{
  total_events: number;
  events_by_type: Record<string, number>;
  delivery_success_rate: number;
  recent_activity: {
    last_24h: number;
    last_7d: number;
  };
}> {
  try {
    // Get all events (we'll need to paginate for large datasets)
    const snapshot = await getDb().collection('aj_event_bus')
      .orderBy('created_at', 'desc')
      .limit(1000)
      .get();

    const events = snapshot.docs.map((doc: any) => doc.data() as EventBusEvent);
    
    // Calculate statistics
    const eventsByType: Record<string, number> = {};
    let totalDeliveries = 0;
    let successfulDeliveries = 0;
    
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    let last24h = 0;
    let last7d = 0;

    for (const event of events) {
      // Count by type
      eventsByType[event.event_type] = (eventsByType[event.event_type] || 0) + 1;
      
      // Delivery stats
      totalDeliveries += event.dispatched_to;
      successfulDeliveries += event.delivery_success;
      
      // Recent activity
      const eventDate = new Date(event.created_at);
      if (eventDate > oneDayAgo) last24h++;
      if (eventDate > sevenDaysAgo) last7d++;
    }

    return {
      total_events: events.length,
      events_by_type: eventsByType,
      delivery_success_rate: totalDeliveries > 0 ? successfulDeliveries / totalDeliveries : 0,
      recent_activity: {
        last_24h: last24h,
        last_7d: last7d
      }
    };

  } catch (error) {
    console.error('Failed to get event bus stats:', error);
    return {
      total_events: 0,
      events_by_type: {},
      delivery_success_rate: 0,
      recent_activity: { last_24h: 0, last_7d: 0 }
    };
  }
}

/**
 * Replay an event to specific target or all targets
 * 
 * @param eventId Event ID to replay
 * @param targetUrl Optional specific target URL (otherwise replays to all matching targets)
 * @returns Promise with replay result
 */
export async function replayEvent(
  eventId: string,
  targetUrl?: string
): Promise<PublishResult> {
  try {
    // Get the original event
    const eventDoc = await getDb().collection('aj_event_bus').doc(eventId).get();
    
    if (!eventDoc.exists) {
      throw new Error(`Event ${eventId} not found`);
    }

    const event = eventDoc.data() as EventBusEvent;
    
    // Republish the event (with replay metadata)
    return await publishEvent(
      event.event_type,
      event.payload,
      {
        ...event.metadata,
        replay: true,
        original_event_id: eventId,
        replay_timestamp: new Date().toISOString(),
        ...(targetUrl && { replay_target: targetUrl })
      }
    );

  } catch (error) {
    console.error(`Failed to replay event ${eventId}:`, error);
    throw error;
  }
}

// Export supported event types for type safety
export const SUPPORTED_EVENT_TYPES = {
  // Status events
  STATUS_CHANGE: 'status_change',
  STATUS_OPERATIONAL: 'status_operational', 
  STATUS_DEGRADED: 'status_degraded',
  STATUS_OUTAGE: 'status_outage',
  
  // Capacity events
  CAPACITY_ALERT: 'capacity_alert',
  CAPACITY_FORECAST: 'capacity_forecast',
  CAPACITY_THRESHOLD: 'capacity_threshold',
  
  // Incident events
  INCIDENT_CREATED: 'incident_created',
  INCIDENT_UPDATED: 'incident_updated',
  INCIDENT_RESOLVED: 'incident_resolved',
  
  // Alert events
  ALERT_TRIGGERED: 'alert_triggered',
  ALERT_RESOLVED: 'alert_resolved',
  
  // System events
  SYSTEM_MAINTENANCE: 'system_maintenance',
  SYSTEM_UPDATE: 'system_update',
  
  // Custom events (for extensibility)
  CUSTOM: 'custom'
} as const;

export type EventType = typeof SUPPORTED_EVENT_TYPES[keyof typeof SUPPORTED_EVENT_TYPES];