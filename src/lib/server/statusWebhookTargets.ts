/**
 * Status Webhook Targets Management
 * 
 * Manages webhook targets with:
 * - Per-target secrets and HMAC signing
 * - Event filtering (status_change, status_degraded, etc.)
 * - Active/inactive controls
 * - Target metadata and descriptions
 */

import { getDb } from '@/lib/server/firebaseAdmin';
import { FieldValue } from "@/lib/legacy-stubs";

export interface StatusWebhookTarget {
  id?: string;
  url: string;
  secret?: string;
  events?: string[];
  active: boolean;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateWebhookTargetData {
  url: string;
  secret?: string;
  events?: string[];
  description?: string;
}

export interface UpdateWebhookTargetData {
  url?: string;
  secret?: string;
  events?: string[];
  active?: boolean;
  description?: string;
}

/**
 * Get active webhook targets for a specific event type
 */
export async function getActiveWebhookTargets(eventType: string): Promise<StatusWebhookTarget[]> {
  try {
    const snapshot = await getDb()
      .collection('status_webhook_targets')
      .where('active', '==', true)
      .get();

    const targets: StatusWebhookTarget[] = [];

    for (const doc of snapshot.docs) {
      const data = doc.data() as StatusWebhookTarget;
      
      // If no events specified, target receives all events
      // If events specified, check if this event is included
      if (!data.events || data.events.length === 0 || data.events.includes(eventType)) {
        targets.push({
          ...data,
          id: doc.id,
        });
      }
    }

    console.log(`Found ${targets.length} active webhook targets for event: ${eventType}`);
    return targets;

  } catch (error) {
    console.error('Error getting active webhook targets:', error);
    return [];
  }
}

/**
 * Get all webhook targets (for admin UI)
 */
export async function getAllWebhookTargets(): Promise<StatusWebhookTarget[]> {
  try {
    const snapshot = await getDb()
      .collection('status_webhook_targets')
      .orderBy('created_at', 'desc')
      .get();

    return snapshot.docs.map((doc: any) => ({
      ...doc.data() as StatusWebhookTarget,
      id: doc.id,
    }));

  } catch (error) {
    console.error('Error getting all webhook targets:', error);
    return [];
  }
}

/**
 * Create a new webhook target
 */
export async function createWebhookTarget(data: CreateWebhookTargetData): Promise<string> {
  try {
    const now = new Date().toISOString();
    
    const targetData: Omit<StatusWebhookTarget, 'id'> = {
      url: data.url,
      secret: data.secret,
      events: data.events || [], // Empty array means all events
      active: true,
      description: data.description,
      created_at: now,
      updated_at: now,
    };

    const docRef = await getDb().collection('status_webhook_targets').add(targetData);
    
    console.log(`Created webhook target: ${docRef.id} → ${data.url}`);
    return docRef.id;

  } catch (error) {
    console.error('Error creating webhook target:', error);
    throw error;
  }
}

/**
 * Update an existing webhook target
 */
export async function updateWebhookTarget(
  id: string, 
  data: UpdateWebhookTargetData
): Promise<void> {
  try {
    const updateData: Partial<StatusWebhookTarget> = {
      ...data,
      updated_at: new Date().toISOString(),
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof StatusWebhookTarget] === undefined) {
        delete updateData[key as keyof StatusWebhookTarget];
      }
    });

    await getDb().collection('status_webhook_targets').doc(id).update(updateData);
    
    console.log(`Updated webhook target: ${id}`);

  } catch (error) {
    console.error('Error updating webhook target:', error);
    throw error;
  }
}

/**
 * Get a single webhook target by ID
 */
export async function getWebhookTarget(id: string): Promise<StatusWebhookTarget | null> {
  try {
    const doc = await getDb().collection('status_webhook_targets').doc(id).get();
    
    if (!doc.exists) {
      return null;
    }

    return {
      ...doc.data() as StatusWebhookTarget,
      id: doc.id,
    };

  } catch (error) {
    console.error('Error getting webhook target:', error);
    return null;
  }
}

/**
 * Soft delete a webhook target (set active=false)
 */
export async function deleteWebhookTarget(id: string): Promise<void> {
  try {
    await updateWebhookTarget(id, { active: false });
    console.log(`Soft deleted webhook target: ${id}`);

  } catch (error) {
    console.error('Error deleting webhook target:', error);
    throw error;
  }
}

/**
 * Get webhook target statistics
 */
export async function getWebhookTargetStats(): Promise<{
  total: number;
  active: number;
  inactive: number;
  withSecrets: number;
}> {
  try {
    const snapshot = await getDb().collection('status_webhook_targets').get();
    
    let active = 0;
    let inactive = 0;
    let withSecrets = 0;

    for (const doc of snapshot.docs) {
      const data = doc.data() as StatusWebhookTarget;
      
      if (data.active) {
        active++;
      } else {
        inactive++;
      }
      
      if (data.secret) {
        withSecrets++;
      }
    }

    return {
      total: snapshot.size,
      active,
      inactive,
      withSecrets,
    };

  } catch (error) {
    console.error('Error getting webhook target stats:', error);
    return { total: 0, active: 0, inactive: 0, withSecrets: 0 };
  }
}

/**
 * Validate webhook target data
 */
export function validateWebhookTargetData(data: CreateWebhookTargetData | UpdateWebhookTargetData): string[] {
  const errors: string[] = [];

  if ('url' in data && data.url) {
    try {
      new URL(data.url);
    } catch {
      errors.push('Invalid URL format');
    }
  }

  if ('events' in data && data.events) {
    const validEvents = ['status_change', 'status_degraded', 'status_operational', 'status_outage'];
    const invalidEvents = data.events.filter(event => !validEvents.includes(event));
    
    if (invalidEvents.length > 0) {
      errors.push(`Invalid events: ${invalidEvents.join(', ')}`);
    }
  }

  if ('description' in data && data.description && data.description.length > 500) {
    errors.push('Description must be less than 500 characters');
  }

  return errors;
}
