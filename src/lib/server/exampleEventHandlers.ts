/**
 * Example Event Handlers for Audio Jones Webhook Consumer
 * 
 * Demonstrates how to handle different event types from the unified event bus.
 * Each handler receives the parsed payload and stores it appropriately.
 * 
 * Usage:
 *   import { handleEvent } from './exampleEventHandlers';
 *   await handleEvent(eventType, payload);
 */

import { getDb } from './legacyAdmin';

export interface EventHandlerContext {
  event_type: string;
  received_at: string;
  source: 'aj_event_bus';
}

/**
 * Handle status change events (operational, degraded, outage, etc.)
 */
async function handleStatusChange(payload: any): Promise<void> {
  const db = getDb();
  
  console.log('[eventHandler] Processing status_change event:', payload);
  
  const record = {
    from: payload.from || 'unknown',
    to: payload.to || 'unknown', 
    changed_at: payload.changed_at || new Date().toISOString(),
    received_at: new Date().toISOString(),
    source: 'aj_event_bus',
    raw_payload: payload
  };

  await db.collection('aj_consumer_status').add(record);
  console.log('[eventHandler] Status change stored successfully');
}

/**
 * Handle capacity alert events (utilization warnings, forecasts, etc.)
 */
async function handleCapacityAlert(payload: any): Promise<void> {
  const db = getDb();
  
  console.log('[eventHandler] Processing capacity_alert event:', payload);
  
  const record = {
    level: payload.level || 'unknown',
    hours: payload.hours || 0,
    mrr: payload.mrr || 0,
    threshold: payload.threshold || 0,
    current_capacity: payload.current_capacity || 0,
    received_at: new Date().toISOString(),
    source: 'aj_event_bus',
    raw_payload: payload
  };

  await db.collection('aj_consumer_capacity').add(record);
  console.log('[eventHandler] Capacity alert stored successfully');
}

/**
 * Handle incident creation events
 */
async function handleIncidentCreated(payload: any): Promise<void> {
  const db = getDb();
  
  console.log('[eventHandler] Processing incident_created event:', payload);
  
  const record = {
    incident_id: payload.id || payload.incident_id || 'unknown',
    title: payload.title || 'Unknown Incident',
    severity: payload.severity || 'unknown',
    status: payload.status || 'active',
    description: payload.description || '',
    created_at: payload.created_at || new Date().toISOString(),
    received_at: new Date().toISOString(),
    source: 'aj_event_bus',
    raw_payload: payload
  };

  await db.collection('aj_consumer_incidents').add(record);
  console.log('[eventHandler] Incident created event stored successfully');
}

/**
 * Handle subscription events (new subscriptions, cancellations, etc.)
 */
async function handleSubscriptionEvent(payload: any): Promise<void> {
  const db = getDb();
  
  console.log('[eventHandler] Processing subscription_event:', payload);
  
  const record = {
    customer_email: payload.customer_email || payload.email || 'unknown',
    event_type: payload.event_type || 'unknown',
    tier: payload.tier || 'unknown',
    timestamp: payload.timestamp || new Date().toISOString(),
    received_at: new Date().toISOString(),
    source: 'aj_event_bus',
    raw_payload: payload
  };

  await db.collection('aj_consumer_subscriptions').add(record);
  console.log('[eventHandler] Subscription event stored successfully');
}

/**
 * Handle unknown/misc events
 */
async function handleMiscEvent(payload: any, eventType: string): Promise<void> {
  const db = getDb();
  
  console.log('[eventHandler] Processing misc event:', eventType, payload);
  
  const record = {
    event_type: eventType,
    received_at: new Date().toISOString(),
    source: 'aj_event_bus',
    raw_payload: payload
  };

  await db.collection('aj_consumer_misc').add(record);
  console.log('[eventHandler] Misc event stored successfully');
}

/**
 * Event handler registry mapping event types to handler functions
 */
export const eventHandlers: Record<string, (payload: any) => Promise<void>> = {
  'status_change': handleStatusChange,
  'capacity_alert': handleCapacityAlert, 
  'incident_created': handleIncidentCreated,
  'subscription_event': handleSubscriptionEvent,
  'whop_subscription_created': handleSubscriptionEvent,
  'whop_subscription_cancelled': handleSubscriptionEvent,
  'whop_subscription_updated': handleSubscriptionEvent,
};

/**
 * Main event handling dispatcher
 * 
 * Routes events to appropriate handlers based on event type.
 * Falls back to misc handler for unknown event types.
 * 
 * @param eventType - The type of event received
 * @param payload - The event payload data
 * @param context - Optional context for debugging/logging
 */
export async function handleEvent(
  eventType: string, 
  payload: any, 
  context?: Partial<EventHandlerContext>
): Promise<void> {
  try {
    const handler = eventHandlers[eventType];
    
    if (handler) {
      await handler(payload);
    } else {
      console.log(`[eventHandler] No specific handler for event type: ${eventType}, using misc handler`);
      await handleMiscEvent(payload, eventType);
    }
    
  } catch (error) {
    console.error(`[eventHandler] Error handling ${eventType} event:`, error);
    
    // Store failed events for debugging
    try {
      const db = getDb();
      await db.collection('aj_consumer_errors').add({
        event_type: eventType,
        error_message: error instanceof Error ? error.message : 'Unknown error',
        error_stack: error instanceof Error ? error.stack : undefined,
        payload,
        context,
        failed_at: new Date().toISOString(),
        source: 'aj_event_bus'
      });
    } catch (storageError) {
      console.error('[eventHandler] Failed to store error event:', storageError);
    }
    
    // Re-throw the error so the consumer can return appropriate HTTP status
    throw error;
  }
}

/**
 * Get supported event types for documentation/validation
 */
export function getSupportedEventTypes(): string[] {
  return Object.keys(eventHandlers);
}

/**
 * Validate if an event type is supported
 */
export function isEventTypeSupported(eventType: string): boolean {
  return eventType in eventHandlers;
}