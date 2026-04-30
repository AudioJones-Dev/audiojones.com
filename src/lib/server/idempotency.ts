/**
 * Webhook Idempotency Helper for Audio Jones
 * 
 * Prevents duplicate processing when AJ retries the same webhook.
 * Uses Firestore to track processed webhook IDs with configurable TTL.
 * 
 * Usage:
 *   if (await hasSeenWebhook(eventId)) {
 *     return NextResponse.json({ ok: true, duplicate: true });
 *   }
 *   await markWebhookSeen(eventId);
 *   // Process webhook...
 */

import { getDb } from './firebaseAdmin';

const COLLECTION_NAME = 'webhook_idempotency';

export interface IdempotencyRecord {
  seen_at: string;
  expires_at: string;
  event_id: string;
  created_by: string;
}

/**
 * Check if we've already seen this webhook event ID
 * 
 * @param eventId - Unique identifier for the webhook event
 * @returns Promise<boolean> - true if already seen, false if new
 */
export async function hasSeenWebhook(eventId: string): Promise<boolean> {
  if (!eventId || typeof eventId !== 'string') {
    console.warn('[idempotency] Invalid eventId provided:', eventId);
    return false;
  }

  try {
    const db = getDb();
    const doc = await db.collection(COLLECTION_NAME).doc(eventId).get();
    
    if (!doc.exists) {
      return false;
    }

    const data = doc.data() as IdempotencyRecord;
    
    // Check if the record has expired
    const expiresAt = new Date(data.expires_at);
    const now = new Date();
    
    if (now > expiresAt) {
      // Record has expired, clean it up and treat as not seen
      await doc.ref.delete();
      console.log(`[idempotency] Expired record cleaned up for eventId: ${eventId}`);
      return false;
    }
    
    console.log(`[idempotency] Duplicate webhook detected for eventId: ${eventId}`);
    return true;
    
  } catch (error) {
    console.error('[idempotency] Error checking webhook idempotency:', error);
    // On error, assume not seen to prevent blocking webhook processing
    return false;
  }
}

/**
 * Mark a webhook event ID as seen to prevent duplicate processing
 * 
 * @param eventId - Unique identifier for the webhook event
 * @param ttlMinutes - Time to live in minutes (default: 60 minutes)
 */
export async function markWebhookSeen(eventId: string, ttlMinutes: number = 60): Promise<void> {
  if (!eventId || typeof eventId !== 'string') {
    console.warn('[idempotency] Invalid eventId provided for marking:', eventId);
    return;
  }

  if (ttlMinutes <= 0 || ttlMinutes > 10080) { // Max 1 week
    console.warn('[idempotency] Invalid TTL, using default 60 minutes');
    ttlMinutes = 60;
  }

  try {
    const db = getDb();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + (ttlMinutes * 60 * 1000));
    
    const record: IdempotencyRecord = {
      seen_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      event_id: eventId,
      created_by: 'webhook_consumer'
    };
    
    await db.collection(COLLECTION_NAME).doc(eventId).set(record);
    
    console.log(`[idempotency] Marked webhook as seen: ${eventId} (expires: ${expiresAt.toISOString()})`);
    
  } catch (error) {
    console.error('[idempotency] Error marking webhook as seen:', error);
    // Don't throw - webhook processing should continue even if idempotency fails
  }
}

/**
 * Clean up expired idempotency records
 * Useful for periodic cleanup jobs
 * 
 * @param batchSize - Number of records to clean per batch (default: 100)
 * @returns Promise<number> - Number of records cleaned
 */
export async function cleanupExpiredRecords(batchSize: number = 100): Promise<number> {
  try {
    const db = getDb();
    const now = new Date();
    
    const expiredQuery = await db
      .collection(COLLECTION_NAME)
      .where('expires_at', '<', now.toISOString())
      .limit(batchSize)
      .get();
    
    if (expiredQuery.empty) {
      return 0;
    }
    
    const batch = db.batch();
    expiredQuery.docs.forEach((doc: any) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    
    const cleanedCount = expiredQuery.docs.length;
    console.log(`[idempotency] Cleaned up ${cleanedCount} expired records`);
    
    return cleanedCount;
    
  } catch (error) {
    console.error('[idempotency] Error cleaning up expired records:', error);
    return 0;
  }
}

/**
 * Get idempotency statistics for monitoring
 * 
 * @returns Promise with stats about idempotency records
 */
export async function getIdempotencyStats(): Promise<{
  total_records: number;
  expired_records: number;
  active_records: number;
}> {
  try {
    const db = getDb();
    const now = new Date();
    
    // Get all records
    const allRecords = await db.collection(COLLECTION_NAME).get();
    const totalRecords = allRecords.size;
    
    if (totalRecords === 0) {
      return {
        total_records: 0,
        expired_records: 0,
        active_records: 0
      };
    }
    
    let expiredCount = 0;
    let activeCount = 0;
    
    allRecords.docs.forEach((doc: any) => {
      const data = doc.data() as IdempotencyRecord;
      const expiresAt = new Date(data.expires_at);
      
      if (now > expiresAt) {
        expiredCount++;
      } else {
        activeCount++;
      }
    });
    
    return {
      total_records: totalRecords,
      expired_records: expiredCount,
      active_records: activeCount
    };
    
  } catch (error) {
    console.error('[idempotency] Error getting stats:', error);
    return {
      total_records: 0,
      expired_records: 0,
      active_records: 0
    };
  }
}

/**
 * Force mark a specific event ID as unseen (for testing/debugging)
 * 
 * @param eventId - Event ID to remove from idempotency tracking
 */
export async function forceMarkUnseen(eventId: string): Promise<boolean> {
  if (!eventId || typeof eventId !== 'string') {
    return false;
  }
  
  try {
    const db = getDb();
    await db.collection(COLLECTION_NAME).doc(eventId).delete();
    console.log(`[idempotency] Force removed idempotency record for: ${eventId}`);
    return true;
  } catch (error) {
    console.error('[idempotency] Error force removing record:', error);
    return false;
  }
}