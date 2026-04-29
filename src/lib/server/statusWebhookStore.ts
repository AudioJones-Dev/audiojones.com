/**
 * Status Webhook Store
 * 
 * Handles webhook delivery reliability with:
 * - Logging all webhook attempts (success/failure)
 * - Queueing failed webhooks for retry
 * - Backoff and retry management
 */

import { getDb } from '@/lib/server/firebaseAdmin';
import { FieldValue } from "@/lib/legacy-stubs";

export interface WebhookDeliveryAttempt {
  event_id: string;
  url: string;
  status: number | null; // HTTP status code, null if network error
  error?: string;
  timestamp: string;
  response_time_ms?: number;
}

export interface WebhookQueueItem {
  event_id: string;
  payload: any;
  url: string;
  reason: string;
  attempts: number;
  max_attempts: number;
  next_run_at: string;
  created_at: string;
  updated_at: string;
}

/**
 * Log a webhook delivery attempt (success or failure)
 */
export async function logWebhookAttempt(
  eventId: string,
  url: string,
  status: number | null,
  error?: string,
  responseTimeMs?: number
): Promise<void> {
  try {
    const attempt: WebhookDeliveryAttempt = {
      event_id: eventId,
      url,
      status,
      error,
      timestamp: new Date().toISOString(),
      response_time_ms: responseTimeMs,
    };

    // Add to deliveries collection (append-only audit log)
    await getDb().collection('status_webhook_deliveries').add(attempt);

    console.log(`Logged webhook attempt: ${eventId} → ${url} (${status || 'error'})`);

  } catch (logError) {
    console.error('Failed to log webhook attempt:', logError);
    // Silent failure - don't break webhook processing
  }
}

/**
 * Queue a webhook for retry after failure
 */
export async function queueWebhookRetry(
  payload: any,
  url: string,
  reason: string,
  eventId?: string
): Promise<void> {
  try {
    const now = new Date();
    const nextRunAt = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes from now

    const queueItem: WebhookQueueItem = {
      event_id: eventId || `retry_${now.toISOString()}`,
      payload,
      url,
      reason,
      attempts: 0,
      max_attempts: 5,
      next_run_at: nextRunAt.toISOString(),
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    };

    // Add to retry queue
    await getDb().collection('status_webhook_queue').add(queueItem);

    console.log(`Queued webhook retry: ${queueItem.event_id} → ${url}`);

  } catch (queueError) {
    console.error('Failed to queue webhook retry:', queueError);
    // Silent failure - don't break webhook processing
  }
}

/**
 * Get pending webhook retries (ready to process)
 */
export async function getPendingWebhookRetries(limit: number = 25): Promise<{
  id: string;
  data: WebhookQueueItem;
}[]> {
  try {
    const now = new Date().toISOString();
    
    const snapshot = await getDb()
      .collection('status_webhook_queue')
      .where('next_run_at', '<=', now)
      .where('attempts', '<', 5) // Max attempts check
      .orderBy('next_run_at', 'asc')
      .limit(limit)
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      data: doc.data() as WebhookQueueItem,
    }));

  } catch (error) {
    console.error('Failed to get pending webhook retries:', error);
    return [];
  }
}

/**
 * Update webhook retry after attempt
 */
export async function updateWebhookRetry(
  docId: string,
  success: boolean,
  error?: string
): Promise<void> {
  try {
    const docRef = getDb().collection('status_webhook_queue').doc(docId);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      console.warn(`Webhook retry doc ${docId} not found`);
      return;
    }

    const data = doc.data() as WebhookQueueItem;

    if (success) {
      // Remove from queue on success
      await docRef.delete();
      console.log(`Webhook retry succeeded, removed from queue: ${docId}`);
    } else {
      // Update attempt count and next run time
      const newAttempts = data.attempts + 1;
      const backoffMinutes = newAttempts * 5; // Linear backoff: 5, 10, 15, 20, 25 minutes
      const nextRunAt = new Date(Date.now() + backoffMinutes * 60 * 1000);

      await docRef.update({
        attempts: newAttempts,
        next_run_at: nextRunAt.toISOString(),
        updated_at: new Date().toISOString(),
        last_error: error,
      });

      console.log(`Webhook retry failed (${newAttempts}/${data.max_attempts}), next run: ${nextRunAt.toISOString()}`);
    }

  } catch (updateError) {
    console.error('Failed to update webhook retry:', updateError);
  }
}

/**
 * Get recent webhook delivery attempts for admin UI
 */
export async function getRecentWebhookDeliveries(limit: number = 50): Promise<WebhookDeliveryAttempt[]> {
  try {
    const snapshot = await getDb()
      .collection('status_webhook_deliveries')
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map(doc => doc.data() as WebhookDeliveryAttempt);

  } catch (error) {
    console.error('Failed to get recent webhook deliveries:', error);
    return [];
  }
}

/**
 * Get webhook queue statistics
 */
export async function getWebhookQueueStats(): Promise<{
  pending: number;
  failed: number;
  total: number;
}> {
  try {
    const [pendingSnapshot, failedSnapshot, totalSnapshot] = await Promise.all([
      getDb().collection('status_webhook_queue')
        .where('attempts', '<', 5)
        .where('next_run_at', '<=', new Date().toISOString())
        .get(),
      getDb().collection('status_webhook_queue')
        .where('attempts', '>=', 5)
        .get(),
      getDb().collection('status_webhook_queue').get(),
    ]);

    return {
      pending: pendingSnapshot.size,
      failed: failedSnapshot.size,
      total: totalSnapshot.size,
    };

  } catch (error) {
    console.error('Failed to get webhook queue stats:', error);
    return { pending: 0, failed: 0, total: 0 };
  }
}

/**
 * Deliver webhook with automatic retry on failure
 * Used by the event bus for reliable delivery
 */
export async function deliverWebhookWithRetry(options: {
  event_id: string;
  url: string;
  payload: any;
  headers: Record<string, string>;
}): Promise<{ success: boolean; error?: string; responseTime?: number }> {
  const startTime = Date.now();
  
  try {
    const response = await fetch(options.url, {
      method: 'POST',
      headers: options.headers,
      body: JSON.stringify(options.payload),
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    const responseTime = Date.now() - startTime;

    if (response.ok) {
      // Log successful delivery
      await logWebhookAttempt(options.event_id, options.url, response.status, undefined, responseTime);
      return { success: true, responseTime };
    } else {
      const errorMsg = `HTTP ${response.status}: ${response.statusText}`;
      
      // Log failed delivery
      await logWebhookAttempt(options.event_id, options.url, response.status, errorMsg, responseTime);
      
      // Queue for retry
      await queueWebhookRetry(options.payload, options.url, errorMsg, options.event_id);
      
      return { success: false, error: errorMsg, responseTime };
    }

  } catch (error) {
    const responseTime = Date.now() - startTime;
    const errorMsg = error instanceof Error ? error.message : 'Network error';
    
    // Log failed delivery
    await logWebhookAttempt(options.event_id, options.url, null, errorMsg, responseTime);
    
    // Queue for retry
    await queueWebhookRetry(options.payload, options.url, errorMsg, options.event_id);
    
    return { success: false, error: errorMsg, responseTime };
  }
}
