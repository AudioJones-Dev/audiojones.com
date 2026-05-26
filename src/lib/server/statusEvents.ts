/**
 * Status Change Events Handler
 * 
 * Handles status transitions by:
 * 1. Comparing previous and new status values
 * 2. Publishing to the unified event bus
 * 3. Event bus handles Firestore logging and webhook delivery
 * 4. Non-blocking operations to prevent API delays
 */

import { getDb } from '@/lib/server/legacyAdmin';
import { publishEvent, SUPPORTED_EVENT_TYPES } from './eventBus';
import { createHmac } from 'crypto';

interface StatusChangeEvent {
  event: 'status_change';
  from: string;
  to: string;
  changed_at: string;
}

interface StatusState {
  status: string;
  updated_at: string;
}

/**
 * Determine event type based on status transition
 */
function determineEventType(prevStatus: string, newStatus: string): string {
  // Base event type
  let eventType = 'status_change';
  
  // More specific event types based on transitions
  if (newStatus === 'operational') {
    eventType = 'status_operational';
  } else if (newStatus === 'degraded') {
    eventType = 'status_degraded';
  } else if (newStatus === 'outage') {
    eventType = 'status_outage';
  }
  
  return eventType;
}

/**
 * Generate HMAC signature for webhook payload
 */
export function generateWebhookSignature(payload: string, secret: string, timestamp?: string): string {
  const ts = timestamp || new Date().toISOString();
  const message = `${ts}.${payload}`;
  const hmac = createHmac('sha256', secret);
  hmac.update(message);
  return `sha256=${hmac.digest('hex')}`;
}

/**
 * Handle status change events
 * @param prevStatus Previous status value
 * @param newStatus New status value
 */
export async function handleStatusChange(
  prevStatus: string,
  newStatus: string
): Promise<void> {
  try {
    // Early return if status unchanged
    if (prevStatus === newStatus) {
      return;
    }

    console.log(`Status change detected: ${prevStatus} → ${newStatus}`);

    const timestamp = new Date().toISOString();
    
    // Determine event type for filtering
    const eventType = determineEventType(prevStatus, newStatus);
    
    // Create event payload
    const eventPayload = {
      from: prevStatus,
      to: newStatus,
      changed_at: timestamp,
    };

    // Publish to event bus (handles Firestore logging and webhook delivery)
    publishEvent(eventType, eventPayload, {
      source: 'status-system',
      transition: `${prevStatus} → ${newStatus}`,
      timestamp
    }).catch((error: any) => {
      console.error('Failed to publish status change event:', error);
    });

    // Also write to legacy status_events collection for backward compatibility
    writeStatusEventToFirestore({
      event: 'status_change',
      from: prevStatus,
      to: newStatus,
      changed_at: timestamp,
    }, `status_${timestamp.replace(/[:.]/g, '-')}`).catch(error => {
      console.error('Failed to write legacy status event:', error);
    });

  } catch (error) {
    console.error('Error in handleStatusChange:', error);
    // Silent failure - never throw to prevent API delays
  }
}

/**
 * Get current cached status from Firestore
 */
export async function getCachedStatus(): Promise<string | null> {
  try {
    const doc = await getDb().collection('status_state').doc('current_status').get();
    
    if (!doc.exists) {
      return null;
    }

    const data = doc.data() as StatusState;
    return data.status || null;

  } catch (error) {
    console.error('Error getting cached status:', error);
    return null;
  }
}

/**
 * Update cached status in Firestore
 */
export async function updateCachedStatus(status: string): Promise<void> {
  try {
    const statusState: StatusState = {
      status,
      updated_at: new Date().toISOString(),
    };

    await getDb().collection('status_state').doc('current_status').set(statusState);

  } catch (error) {
    console.error('Error updating cached status:', error);
    // Silent failure
  }
}

/**
 * Write status event to Firestore (legacy compatibility)
 */
async function writeStatusEventToFirestore(event: StatusChangeEvent, eventId: string): Promise<void> {
  try {
    await getDb().collection('status_events').doc(eventId).set({
      ...event,
      event_id: eventId,
      created_at: new Date().toISOString(),
    });

    console.log(`Legacy status event written to Firestore: ${eventId}`);

  } catch (error) {
    console.error('Firestore write error:', error);
    throw error;
  }
}
