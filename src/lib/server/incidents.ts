/**
 * Incident Management System
 * 
 * Groups related alerts into incidents with chronological timeline.
 * Provides runbook attachment and status management.
 */

import 'server-only';
import { getDb } from '@/lib/server/firebaseAdmin';
import type { Alert } from '@/lib/server/alertRules';

export interface IncidentTimelineEvent {
  ts: string;
  type: 'alert' | 'action' | 'note' | 'auto';
  message: string;
  meta?: any;
}

export interface Incident {
  id?: string;
  title: string;
  status: 'open' | 'investigating' | 'monitoring' | 'resolved';
  severity: 'info' | 'warning' | 'critical';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  source: string; // e.g. "capacity", "webhook", "billing"
  related_alert_ids: string[];
  timeline: IncidentTimelineEvent[];
  created_at: string;
  updated_at: string;
  runbook_id?: string;
}

export interface Runbook {
  id?: string;
  name: string;
  source: string; // matches incident.source for auto-attachment
  steps: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface IncidentSubscription {
  incident_id: string;
  subscriber: string; // email or slack user id
  channel: "slack" | "email";
  created_at: string;
  created_by?: string; // admin who created the subscription
  active: boolean;
  preferences?: {
    status_changes?: boolean;
    timeline_updates?: boolean;
    resolution_only?: boolean;
  };
}

/**
 * Create a new incident from an alert
 * 
 * @param alert - The alert that triggered the incident
 * @returns Promise with the created incident ID
 */
export async function createIncidentFromAlert(alert: Alert): Promise<string> {
  const now = new Date().toISOString();
  const alertId = alert.id || 'unknown';
  
  // Generate incident title based on alert
  const title = generateIncidentTitle(alert);
  
  // Create initial timeline event
  const initialEvent: IncidentTimelineEvent = {
    ts: now,
    type: 'alert',
    message: alert.message || 'Alert received',
    meta: {
      alert_id: alertId,
      alert_type: alert.type,
      alert_severity: alert.severity,
      source: alert.source
    }
  };

  // Map alert severity to incident severity
  const mapSeverity = (alertSeverity: string): 'info' | 'warning' | 'critical' => {
    switch (alertSeverity) {
      case 'critical': return 'critical';
      case 'error': return 'critical'; // Map error to critical
      case 'warning': return 'warning';
      case 'info':
      default:
        return 'info';
    }
  };

  const incident: Omit<Incident, 'id'> = {
    title,
    status: 'open',
    severity: mapSeverity(alert.severity || 'info'),
    source: alert.source || alert.type || 'system',
    related_alert_ids: [alertId],
    timeline: [initialEvent],
    created_at: now,
    updated_at: now
  };

  console.log(`🚨 Creating new incident for alert ${alertId}:`, {
    title: incident.title,
    source: incident.source,
    severity: incident.severity
  });

  try {
    // Save to Firestore
    const docRef = await getDb().collection('incidents').add(incident);
    const incidentId = docRef.id;

    // Try to attach runbook if available
    await attachRunbookIfExists(incidentId, incident.source);

    console.log(`✅ Incident created successfully: ${incidentId}`);
    return incidentId;
    
  } catch (error) {
    console.error('❌ Failed to create incident:', error);
    throw new Error(`Failed to create incident: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Append an event to an incident's timeline
 * 
 * @param incidentId - The incident to update
 * @param event - The timeline event to add
 * @param notifySubscribers - Whether to notify subscribers (default: true)
 */
export async function appendIncidentEvent(
  incidentId: string, 
  event: Omit<IncidentTimelineEvent, 'ts'>,
  notifySubscribers: boolean = true
): Promise<void> {
  const now = new Date().toISOString();
  const fullEvent: IncidentTimelineEvent = {
    ...event,
    ts: now
  };

  try {
    const incidentRef = getDb().collection('incidents').doc(incidentId);
    const incidentDoc = await incidentRef.get();
    
    if (!incidentDoc.exists) {
      console.warn(`⚠️ Incident ${incidentId} not found, cannot append event`);
      return;
    }

    const incident = { id: incidentDoc.id, ...incidentDoc.data() } as Incident;
    let timeline = incident.timeline || [];
    
    // Add new event
    timeline.push(fullEvent);
    
    // Cap timeline at 50 entries (keep most recent)
    if (timeline.length > 50) {
      timeline = timeline.slice(-50);
    }

    // Update incident with new timeline and updated_at
    await incidentRef.update({
      timeline,
      updated_at: now
    });

    console.log(`📝 Event appended to incident ${incidentId}:`, {
      type: event.type,
      message: event.message?.substring(0, 100)
    });

    // Notify subscribers if enabled and this is a user-facing update
    if (notifySubscribers && (event.type === 'note' || event.type === 'action')) {
      try {
        const updatedIncident = {
          ...incident,
          timeline,
          updated_at: now
        };

        const notificationResults = await notifyIncidentSubscribers(incidentId, {
          incident: updatedIncident,
          change_type: 'timeline_update',
          timeline_entry: fullEvent,
          triggered_by: event.meta?.actor || 'system'
        });

        console.log(`📧 Timeline update notifications: ${notificationResults.sent} sent, ${notificationResults.failed} failed, ${notificationResults.skipped} skipped`);
        
        if (notificationResults.errors.length > 0) {
          console.error(`❌ Timeline notification errors:`, notificationResults.errors);
        }
      } catch (notificationError) {
        console.error(`❌ Failed to send timeline notifications for incident ${incidentId}:`, notificationError);
        // Don't throw - timeline update should succeed even if notifications fail
      }
    }

  } catch (error) {
    console.error(`❌ Failed to append event to incident ${incidentId}:`, error);
    // Don't throw - this is often called in background processing
  }
}

/**
 * Find the most recent open incident for a given source
 * 
 * @param source - The incident source to search for
 * @returns Promise with the incident document or null if none found
 */
export async function findOpenIncidentBySource(source: string): Promise<Incident | null> {
  try {
    const query = getDb().collection('incidents')
      .where('source', '==', source)
      .where('status', '!=', 'resolved')
      .orderBy('status')
      .orderBy('created_at', 'desc')
      .limit(1);

    const snapshot = await query.get();
    
    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    } as Incident;

  } catch (error) {
    console.error(`❌ Failed to find open incident for source ${source}:`, error);
    return null;
  }
}

/**
 * Attach a runbook to an incident if one exists for the source
 * 
 * @param incidentId - The incident to update
 * @param source - The source to match against runbooks
 */
export async function attachRunbookIfExists(incidentId: string, source: string): Promise<void> {
  try {
    const runbookQuery = getDb().collection('runbooks')
      .where('source', '==', source)
      .where('active', '==', true)
      .limit(1);

    const runbookSnapshot = await runbookQuery.get();
    
    if (!runbookSnapshot.empty) {
      const runbookDoc = runbookSnapshot.docs[0];
      const runbookId = runbookDoc.id;
      const runbookData = runbookDoc.data() as Runbook;

      // Update incident with runbook_id
      await getDb().collection('incidents').doc(incidentId).update({
        runbook_id: runbookId,
        updated_at: new Date().toISOString()
      });

      // Add timeline event about runbook attachment
      await appendIncidentEvent(incidentId, {
        type: 'auto',
        message: `Runbook attached: ${runbookData.name}`,
        meta: {
          runbook_id: runbookId,
          runbook_name: runbookData.name,
          steps_count: runbookData.steps.length
        }
      });

      console.log(`📚 Runbook ${runbookId} attached to incident ${incidentId}`);
    }

  } catch (error) {
    console.error(`❌ Failed to attach runbook to incident ${incidentId}:`, error);
    // Don't throw - this is optional functionality
  }
}

/**
 * Update incident status and log the change
 * 
 * @param incidentId - The incident to update
 * @param newStatus - The new status
 * @param actor - Who made the change (e.g., "admin", "system")
 * @param notifySubscribers - Whether to notify subscribers (default: true)
 */
export async function updateIncidentStatus(
  incidentId: string, 
  newStatus: Incident['status'],
  actor: string = 'system',
  notifySubscribers: boolean = true
): Promise<void> {
  const now = new Date().toISOString();

  try {
    // Get current incident to capture previous state
    const incidentRef = getDb().collection('incidents').doc(incidentId);
    const incidentDoc = await incidentRef.get();
    
    if (!incidentDoc.exists) {
      throw new Error(`Incident ${incidentId} not found`);
    }

    const currentIncident = { id: incidentDoc.id, ...incidentDoc.data() } as Incident;
    const previousStatus = currentIncident.status;

    // Skip if status is already the same
    if (previousStatus === newStatus) {
      console.log(`⏭️ Incident ${incidentId} already has status ${newStatus}, skipping update`);
      return;
    }

    // Update the incident
    await incidentRef.update({
      status: newStatus,
      updated_at: now
    });

    // Get updated incident for notifications
    const updatedIncident = {
      ...currentIncident,
      status: newStatus,
      updated_at: now
    };

    // Log the status change in timeline
    await appendIncidentEvent(incidentId, {
      type: 'action',
      message: `Status changed to ${newStatus}`,
      meta: {
        actor,
        previous_status: previousStatus,
        new_status: newStatus
      }
    });

    console.log(`🔄 Incident ${incidentId} status updated from ${previousStatus} to ${newStatus} by ${actor}`);

    // Notify subscribers if enabled
    if (notifySubscribers) {
      try {
        const notificationResults = await notifyIncidentSubscribers(incidentId, {
          incident: updatedIncident,
          change_type: 'status_change',
          previous_value: previousStatus,
          new_value: newStatus,
          triggered_by: actor
        });

        console.log(`� Status change notifications: ${notificationResults.sent} sent, ${notificationResults.failed} failed, ${notificationResults.skipped} skipped`);
        
        if (notificationResults.errors.length > 0) {
          console.error(`❌ Notification errors:`, notificationResults.errors);
        }
      } catch (notificationError) {
        console.error(`❌ Failed to send status change notifications for incident ${incidentId}:`, notificationError);
        // Don't throw - incident update should succeed even if notifications fail
      }
    }

  } catch (error) {
    console.error(`❌ Failed to update incident ${incidentId} status:`, error);
    throw error;
  }
}

/**
 * Get incident with related alerts populated
 * 
 * @param incidentId - The incident to fetch
 * @returns Promise with incident and related alerts
 */
export async function getIncidentWithAlerts(incidentId: string): Promise<{
  incident: Incident;
  alerts: Alert[];
} | null> {
  try {
    const incidentDoc = await getDb().collection('incidents').doc(incidentId).get();
    
    if (!incidentDoc.exists) {
      return null;
    }

    const incident = {
      id: incidentDoc.id,
      ...incidentDoc.data()
    } as Incident;

    // Fetch related alerts
    const alerts: Alert[] = [];
    
    if (incident.related_alert_ids.length > 0) {
      // Batch fetch alerts (Firestore supports up to 10 in a single `in` query)
      const alertIds = incident.related_alert_ids.slice(0, 10); // Limit for safety
      
      if (alertIds.length > 0) {
        const alertsQuery = getDb().collection('alerts').where('__name__', 'in', alertIds);
        const alertsSnapshot = await alertsQuery.get();
        
        alertsSnapshot.forEach((doc: any) => {
          alerts.push({
            id: doc.id,
            ...doc.data()
          } as Alert);
        });
      }
    }

    return { incident, alerts };

  } catch (error) {
    console.error(`❌ Failed to get incident ${incidentId} with alerts:`, error);
    return null;
  }
}

/**
 * List incidents with optional filtering
 * 
 * @param options - Query options
 * @returns Promise with incidents array
 */
export async function listIncidents(options: {
  status?: Incident['status'];
  source?: string;
  limit?: number;
} = {}): Promise<Incident[]> {
  try {
    let query = getDb().collection('incidents').orderBy('updated_at', 'desc');

    if (options.status) {
      query = query.where('status', '==', options.status);
    }

    if (options.source) {
      query = query.where('source', '==', options.source);
    }

    if (options.limit) {
      query = query.limit(options.limit);
    } else {
      query = query.limit(50); // Default limit
    }

    const snapshot = await query.get();
    
    return snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    })) as Incident[];

  } catch (error) {
    console.error('❌ Failed to list incidents:', error);
    return [];
  }
}

/**
 * Generate a human-readable incident title from an alert
 */
function generateIncidentTitle(alert: Alert): string {
  const source = alert.source || alert.type || 'system';
  const severity = alert.severity || 'unknown';
  
  // Generate title based on alert type and severity
  if (alert.type === 'capacity') {
    if (severity === 'critical') {
      return `Critical Capacity Issue - ${source}`;
    } else if (severity === 'warning') {
      return `Capacity Warning - ${source}`;
    } else {
      return `Capacity Alert - ${source}`;
    }
  } else if (alert.type === 'webhook') {
    return `Webhook ${severity} - ${source}`;
  } else if (alert.type === 'billing') {
    return `Billing Issue - ${source}`;
  } else if (alert.type === 'predictive') {
    return `Predictive Alert - ${source}`;
  } else {
    return `${alert.type || 'System'} ${severity} - ${source}`;
  }
}

/**
 * Add a subscription to an incident
 * 
 * @param incidentId - The incident to subscribe to
 * @param subscriber - Email or Slack user ID of subscriber
 * @param options - Subscription options
 */
export async function addIncidentSubscription(
  incidentId: string,
  subscriber: string,
  options: {
    channel?: "slack" | "email";
    created_by?: string;
    preferences?: IncidentSubscription['preferences'];
  } = {}
): Promise<string> {
  const now = new Date().toISOString();
  
  const subscription: Omit<IncidentSubscription, 'id'> = {
    incident_id: incidentId,
    subscriber,
    channel: options.channel || "slack",
    created_at: now,
    created_by: options.created_by,
    active: true,
    preferences: options.preferences || {
      status_changes: true,
      timeline_updates: true,
      resolution_only: false
    }
  };

  try {
    // Use composite key approach for deduplication
    const subscriptionId = `${incidentId}_${subscriber.replace(/[^a-zA-Z0-9]/g, '_')}`;
    
    const subscriptionRef = getDb()
      .collection('incident_subscriptions')
      .doc(subscriptionId);

    // Check if subscription already exists
    const existingDoc = await subscriptionRef.get();
    
    if (existingDoc.exists) {
      const existingData = existingDoc.data() as IncidentSubscription;
      if (existingData.active) {
        console.log(`📧 Subscription already exists for ${subscriber} on incident ${incidentId}`);
        return subscriptionId;
      } else {
        // Reactivate existing subscription
        await subscriptionRef.update({
          active: true,
          created_at: now,
          created_by: options.created_by,
          preferences: subscription.preferences
        });
        console.log(`📧 Reactivated subscription for ${subscriber} on incident ${incidentId}`);
        return subscriptionId;
      }
    }

    // Create new subscription
    await subscriptionRef.set(subscription);

    // Add timeline event to incident
    await appendIncidentEvent(incidentId, {
      type: 'note',
      message: `${subscriber} subscribed to incident updates`,
      meta: {
        subscriber,
        channel: subscription.channel,
        created_by: options.created_by
      }
    });

    console.log(`✅ Subscription created for ${subscriber} on incident ${incidentId}`);
    return subscriptionId;

  } catch (error) {
    console.error(`❌ Failed to create subscription for ${subscriber} on incident ${incidentId}:`, error);
    throw new Error(`Failed to create subscription: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Remove or deactivate a subscription to an incident
 * 
 * @param incidentId - The incident to unsubscribe from
 * @param subscriber - Email or Slack user ID of subscriber
 */
export async function removeIncidentSubscription(
  incidentId: string,
  subscriber: string
): Promise<void> {
  const subscriptionId = `${incidentId}_${subscriber.replace(/[^a-zA-Z0-9]/g, '_')}`;
  
  try {
    const subscriptionRef = getDb()
      .collection('incident_subscriptions')
      .doc(subscriptionId);

    const doc = await subscriptionRef.get();
    
    if (!doc.exists) {
      console.log(`⚠️ No subscription found for ${subscriber} on incident ${incidentId}`);
      return;
    }

    // Deactivate rather than delete (for audit trail)
    await subscriptionRef.update({
      active: false,
      unsubscribed_at: new Date().toISOString()
    });

    // Add timeline event to incident
    await appendIncidentEvent(incidentId, {
      type: 'note',
      message: `${subscriber} unsubscribed from incident updates`,
      meta: {
        subscriber,
        action: 'unsubscribed'
      }
    });

    console.log(`✅ Subscription removed for ${subscriber} on incident ${incidentId}`);

  } catch (error) {
    console.error(`❌ Failed to remove subscription for ${subscriber} on incident ${incidentId}:`, error);
    throw new Error(`Failed to remove subscription: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get all active subscribers for an incident
 * 
 * @param incidentId - The incident to get subscribers for
 * @returns Promise with array of active subscriptions
 */
export async function getIncidentSubscribers(incidentId: string): Promise<IncidentSubscription[]> {
  try {
    const query = getDb()
      .collection('incident_subscriptions')
      .where('incident_id', '==', incidentId)
      .where('active', '==', true);

    const snapshot = await query.get();
    
    return snapshot.docs.map((doc: any) => doc.data() as IncidentSubscription);

  } catch (error) {
    console.error(`❌ Failed to get subscribers for incident ${incidentId}:`, error);
    return [];
  }
}

/**
 * Check if a user is subscribed to an incident
 * 
 * @param incidentId - The incident to check
 * @param subscriber - Email or Slack user ID to check
 * @returns Promise with subscription or null if not subscribed
 */
export async function getIncidentSubscription(
  incidentId: string,
  subscriber: string
): Promise<IncidentSubscription | null> {
  const subscriptionId = `${incidentId}_${subscriber.replace(/[^a-zA-Z0-9]/g, '_')}`;
  
  try {
    const doc = await getDb()
      .collection('incident_subscriptions')
      .doc(subscriptionId)
      .get();

    if (!doc.exists) {
      return null;
    }

    const data = doc.data() as IncidentSubscription;
    
    if (!data.active) {
      return null;
    }

    return data;

  } catch (error) {
    console.error(`❌ Failed to get subscription for ${subscriber} on incident ${incidentId}:`, error);
    return null;
  }
}

/**
 * Get all incidents a user is subscribed to
 * 
 * @param subscriber - Email or Slack user ID
 * @returns Promise with array of subscriptions
 */
export async function getUserIncidentSubscriptions(subscriber: string): Promise<IncidentSubscription[]> {
  try {
    const query = getDb()
      .collection('incident_subscriptions')
      .where('subscriber', '==', subscriber)
      .where('active', '==', true)
      .orderBy('created_at', 'desc');

    const snapshot = await query.get();
    
    return snapshot.docs.map((doc: any) => doc.data() as IncidentSubscription);

  } catch (error) {
    console.error(`❌ Failed to get subscriptions for user ${subscriber}:`, error);
    return [];
  }
}

// ============================================================================
// NOTIFICATION SYSTEM
// ============================================================================

export interface IncidentNotificationData {
  incident: Incident;
  change_type: 'status_change' | 'timeline_update' | 'priority_change' | 'assignment_change';
  previous_value?: string;
  new_value?: string;
  timeline_entry?: IncidentTimelineEvent;
  triggered_by?: string;
}

/**
 * Format incident notification for Slack
 */
export function formatIncidentNotificationForSlack(data: IncidentNotificationData): {
  text: string;
  blocks: any[];
} {
  const { incident, change_type, previous_value, new_value, timeline_entry, triggered_by } = data;
  
  // Status emoji mapping
  const statusEmojis = {
    'investigating': '🔍',
    'identified': '🎯', 
    'monitoring': '👀',
    'resolved': '✅',
    'cancelled': '❌'
  };

  // Priority emoji mapping
  const priorityEmojis = {
    'critical': '🚨',
    'high': '⚠️',
    'medium': '📢',
    'low': '💬'
  };

  const incidentEmoji = statusEmojis[incident.status as keyof typeof statusEmojis] || '📋';
  const priorityEmoji = priorityEmojis[incident.priority as keyof typeof priorityEmojis] || '📢';

  let changeText = '';
  const changeFields = [];

  switch (change_type) {
    case 'status_change':
      changeText = `Status changed from *${previous_value}* to *${new_value}*`;
      changeFields.push({
        type: "mrkdwn",
        text: `*Previous Status:*\n${previous_value}`
      }, {
        type: "mrkdwn", 
        text: `*New Status:*\n${new_value}`
      });
      break;

    case 'priority_change':
      changeText = `Priority changed from *${previous_value}* to *${new_value}*`;
      changeFields.push({
        type: "mrkdwn",
        text: `*Previous Priority:*\n${previous_value}`
      }, {
        type: "mrkdwn",
        text: `*New Priority:*\n${new_value}`
      });
      break;

    case 'assignment_change':
      changeText = `Assignment changed from *${previous_value || 'Unassigned'}* to *${new_value || 'Unassigned'}*`;
      changeFields.push({
        type: "mrkdwn",
        text: `*Previous Assignee:*\n${previous_value || 'Unassigned'}`
      }, {
        type: "mrkdwn",
        text: `*New Assignee:*\n${new_value || 'Unassigned'}`
      });
      break;

    case 'timeline_update':
      changeText = `New timeline entry added`;
      if (timeline_entry) {
        changeFields.push({
          type: "mrkdwn",
          text: `*Update Type:*\n${timeline_entry.type}`
        }, {
          type: "mrkdwn",
          text: `*Message:*\n${timeline_entry.message}`
        });
      }
      break;

    default:
      changeText = 'Incident updated';
  }

  const text = `${incidentEmoji} *${incident.title}* - ${changeText}`;

  const blocks = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: `${incidentEmoji} Incident Update`,
        emoji: true
      }
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*${incident.title}*\n${changeText}`
      },
      accessory: {
        type: "button",
        text: {
          type: "plain_text",
          text: "View Incident",
          emoji: true
        },
        url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://audiojones.com'}/portal/admin/incidents/${incident.id}`,
        action_id: "view_incident"
      }
    },
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*Status:*\n${incident.status}`
        },
        {
          type: "mrkdwn", 
          text: `*Priority:*\n${priorityEmoji} ${incident.priority}`
        },
        {
          type: "mrkdwn",
          text: `*ID:*\n${incident.id}`
        },
        {
          type: "mrkdwn",
          text: `*Created:*\n<!date^${Math.floor(new Date(incident.created_at).getTime() / 1000)}^{date_short_pretty} at {time}|${new Date(incident.created_at).toLocaleString()}>`
        }
      ]
    }
  ];

  // Add change-specific fields if available
  if (changeFields.length > 0) {
    blocks.push({
      type: "section",
      fields: changeFields
    });
  }

  // Add context footer
  blocks.push({
    type: "context",
    elements: [
      {
        type: "mrkdwn",
        text: triggered_by ? `Updated by ${triggered_by} • <!date^${Math.floor(Date.now() / 1000)}^{date_short_pretty} at {time}|just now>` : `Updated <!date^${Math.floor(Date.now() / 1000)}^{date_short_pretty} at {time}|just now>`
      }
    ]
  } as any); // Slack block types can be complex

  return {
    text,
    blocks
  };
}

// Notification debouncing cache
const notificationCache = new Map<string, { timestamp: number; hash: string }>();
const DEBOUNCE_WINDOW_MS = 30000; // 30 seconds
const MAX_NOTIFICATIONS_PER_HOUR = 20;
const NOTIFICATION_RATE_CACHE = new Map<string, { count: number; resetTime: number }>();

// Periodic cleanup to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  const cutoffTime = now - (DEBOUNCE_WINDOW_MS * 2);
  
  // Clean notification cache
  for (const [hash, entry] of notificationCache.entries()) {
    if (entry.timestamp < cutoffTime) {
      notificationCache.delete(hash);
    }
  }
  
  // Clean rate limit cache
  for (const [subscriber, entry] of NOTIFICATION_RATE_CACHE.entries()) {
    if (now > entry.resetTime) {
      NOTIFICATION_RATE_CACHE.delete(subscriber);
    }
  }
  
  if (notificationCache.size > 0 || NOTIFICATION_RATE_CACHE.size > 0) {
    console.log(`🧹 Cleaned notification caches: ${notificationCache.size} debounce entries, ${NOTIFICATION_RATE_CACHE.size} rate limit entries`);
  }
}, 5 * 60 * 1000); // Clean every 5 minutes

/**
 * Generate a hash for notification deduplication
 */
function generateNotificationHash(
  incidentId: string,
  changeType: string,
  subscriber: string,
  newValue?: string
): string {
  return `${incidentId}:${changeType}:${subscriber}:${newValue || ''}`;
}

/**
 * Check if notification should be debounced
 */
function shouldDebounceNotification(
  notificationHash: string,
  debounceMs: number = DEBOUNCE_WINDOW_MS
): boolean {
  const cached = notificationCache.get(notificationHash);
  const now = Date.now();
  
  if (cached && (now - cached.timestamp) < debounceMs) {
    return true; // Should debounce
  }
  
  // Update cache
  notificationCache.set(notificationHash, { timestamp: now, hash: notificationHash });
  
  // Clean up old entries every 100 operations
  if (notificationCache.size > 1000) {
    const cutoff = now - (debounceMs * 2);
    for (const [hash, entry] of notificationCache.entries()) {
      if (entry.timestamp < cutoff) {
        notificationCache.delete(hash);
      }
    }
  }
  
  return false;
}

/**
 * Check rate limiting for subscriber
 */
function checkRateLimit(subscriber: string): boolean {
  const now = Date.now();
  const hourMs = 60 * 60 * 1000;
  const cached = NOTIFICATION_RATE_CACHE.get(subscriber);
  
  if (!cached || now > cached.resetTime) {
    // Reset or initialize rate limit
    NOTIFICATION_RATE_CACHE.set(subscriber, {
      count: 1,
      resetTime: now + hourMs
    });
    return true; // Allow
  }
  
  if (cached.count >= MAX_NOTIFICATIONS_PER_HOUR) {
    return false; // Rate limited
  }
  
  // Increment count
  cached.count++;
  return true; // Allow
}

/**
 * Send notification to incident subscribers with safeguards
 */
export async function notifyIncidentSubscribers(
  incidentId: string,
  notificationData: IncidentNotificationData,
  options: {
    skipInactive?: boolean;
    skipResolutionOnly?: boolean;
    debounceMs?: number;
    retryAttempts?: number;
    bypassRateLimit?: boolean;
  } = {}
): Promise<{
  sent: number;
  failed: number;
  skipped: number;
  debounced: number;
  rateLimited: number;
  errors: string[];
}> {
  const results = {
    sent: 0,
    failed: 0,
    skipped: 0,
    debounced: 0,
    rateLimited: 0,
    errors: [] as string[]
  };

  try {
    // Get all subscribers for this incident
    const subscribers = await getIncidentSubscribers(incidentId);
    
    if (subscribers.length === 0) {
      console.log(`📧 No subscribers found for incident ${incidentId}`);
      return results;
    }

    console.log(`📧 Notifying ${subscribers.length} subscribers for incident ${incidentId} (${notificationData.change_type})`);

    // Apply debouncing and rate limiting
    const debounceMs = options.debounceMs || DEBOUNCE_WINDOW_MS;
    const bypassRateLimit = options.bypassRateLimit || false;

    // Filter subscribers based on preferences and safeguards
    const filteredSubscribers = subscribers.filter(sub => {
      // Skip inactive subscriptions
      if (options.skipInactive && !sub.active) {
        results.skipped++;
        return false;
      }

      // Check if subscriber wants this type of notification
      const prefs = sub.preferences;
      if (prefs) {
        // Resolution-only mode
        if (prefs.resolution_only && notificationData.change_type !== 'status_change') {
          results.skipped++;
          return false;
        }
        if (prefs.resolution_only && notificationData.change_type === 'status_change' && notificationData.new_value !== 'resolved') {
          results.skipped++;
          return false;
        }

        // Status change notifications
        if (!prefs.status_changes && notificationData.change_type === 'status_change') {
          results.skipped++;
          return false;
        }

        // Timeline update notifications  
        if (!prefs.timeline_updates && notificationData.change_type === 'timeline_update') {
          results.skipped++;
          return false;
        }
      }

      // Check debouncing
      const notificationHash = generateNotificationHash(
        incidentId,
        notificationData.change_type,
        sub.subscriber,
        notificationData.new_value
      );
      
      if (shouldDebounceNotification(notificationHash, debounceMs)) {
        results.debounced++;
        console.log(`⏱️ Debounced notification for ${sub.subscriber} (${notificationData.change_type})`);
        return false;
      }

      // Check rate limiting
      if (!bypassRateLimit && !checkRateLimit(sub.subscriber)) {
        results.rateLimited++;
        console.log(`🚫 Rate limited notification for ${sub.subscriber}`);
        return false;
      }

      return true;
    });

    console.log(`📧 Sending to ${filteredSubscribers.length} subscribers after filtering`);

    // Send notifications based on channel preference
    const slackNotifications: Promise<void>[] = [];
    const emailNotifications: Promise<void>[] = [];

    for (const subscription of filteredSubscribers) {
      if (subscription.channel === 'slack') {
        slackNotifications.push(
          sendSlackIncidentNotification(subscription, notificationData, options.retryAttempts || 3)
            .then(() => {
              results.sent++;
            })
            .catch((error) => {
              results.failed++;
              results.errors.push(`Slack notification failed for ${subscription.subscriber}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            })
        );
      } else if (subscription.channel === 'email') {
        // Email notifications could be implemented here
        console.log(`📧 Email notifications not yet implemented for ${subscription.subscriber}`);
        results.skipped++;
      }
    }

    // Execute all Slack notifications
    if (slackNotifications.length > 0) {
      await Promise.allSettled(slackNotifications);
    }

    // Execute all email notifications  
    if (emailNotifications.length > 0) {
      await Promise.allSettled(emailNotifications);
    }

    console.log(`📧 Notification results: ${results.sent} sent, ${results.failed} failed, ${results.skipped} skipped, ${results.debounced} debounced, ${results.rateLimited} rate limited`);

    return results;

  } catch (error) {
    console.error(`❌ Failed to notify incident subscribers:`, error);
    results.errors.push(`System error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return results;
  }
}

/**
 * Send Slack notification for incident update with retry logic
 */
async function sendSlackIncidentNotification(
  subscription: IncidentSubscription,
  notificationData: IncidentNotificationData,
  retryAttempts: number = 3
): Promise<void> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= retryAttempts; attempt++) {
    try {
      // Import Slack notification utility  
      const { sendSlackWebApiNotification } = await import('@/lib/server/notify');
      
      // Format message for Slack
      const { text, blocks } = formatIncidentNotificationForSlack(notificationData);
      
      // Get Slack credentials from environment
      const slackToken = process.env.SLACK_BOT_TOKEN;
      if (!slackToken) {
        throw new Error('SLACK_BOT_TOKEN not configured');
      }
      
      // Determine the channel - could be direct message or channel
      const channel = subscription.subscriber.includes('@') 
        ? subscription.subscriber  // Email - send as DM
        : `@${subscription.subscriber}`; // User ID - send as DM
      
      // Convert to alert notification format for the existing function
      const alertNotification = {
        type: 'incident_update',
        severity: notificationData.incident.severity,
        message: text,
        title: `Incident: ${notificationData.incident.title}`,
        created_at: new Date().toISOString(),
        source: 'incident_subscription',
        meta: {
          incident_id: notificationData.incident.id,
          change_type: notificationData.change_type,
          previous_value: notificationData.previous_value,
          new_value: notificationData.new_value
        }
      };
      
      // Send the notification using the existing Slack API function
      await sendSlackWebApiNotification(alertNotification, slackToken, channel);

      console.log(`✅ Sent Slack notification to ${subscription.subscriber} (attempt ${attempt})`);
      return; // Success, exit retry loop

    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      console.error(`❌ Failed to send Slack notification to ${subscription.subscriber} (attempt ${attempt}):`, error);
      
      // Don't retry on certain errors
      if (lastError.message.includes('SLACK_BOT_TOKEN not configured') || 
          lastError.message.includes('channel_not_found') ||
          lastError.message.includes('invalid_auth')) {
        break; // Don't retry configuration or permanent errors
      }
      
      // Wait before retry (exponential backoff)
      if (attempt < retryAttempts) {
        const delayMs = Math.min(1000 * Math.pow(2, attempt - 1), 30000); // Max 30s delay
        console.log(`⏳ Retrying in ${delayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }
  
  // All retries failed
  throw lastError || new Error('Failed to send notification after retries');
}

// ============================================================================
// CACHE MANAGEMENT & DEBUGGING
// ============================================================================

/**
 * Get notification system statistics for debugging
 */
export function getNotificationStats() {
  const now = Date.now();
  
  // Count active debounce entries
  const activeDebounceEntries = Array.from(notificationCache.values())
    .filter(entry => (now - entry.timestamp) < DEBOUNCE_WINDOW_MS).length;
  
  // Count active rate limit entries
  const activeRateLimitEntries = Array.from(NOTIFICATION_RATE_CACHE.values())
    .filter(entry => now <= entry.resetTime).length;
  
  return {
    debounce_cache: {
      total_entries: notificationCache.size,
      active_entries: activeDebounceEntries,
      debounce_window_ms: DEBOUNCE_WINDOW_MS
    },
    rate_limit_cache: {
      total_entries: NOTIFICATION_RATE_CACHE.size,
      active_entries: activeRateLimitEntries,
      max_per_hour: MAX_NOTIFICATIONS_PER_HOUR
    },
    memory_usage: {
      approx_memory_kb: Math.round((notificationCache.size + NOTIFICATION_RATE_CACHE.size) * 0.1)
    }
  };
}

/**
 * Clear notification system caches (for debugging/maintenance)
 */
export function clearNotificationCaches(): { cleared: number } {
  const totalCleared = notificationCache.size + NOTIFICATION_RATE_CACHE.size;
  
  notificationCache.clear();
  NOTIFICATION_RATE_CACHE.clear();
  
  console.log(`🧹 Manually cleared notification caches: ${totalCleared} entries`);
  
  return { cleared: totalCleared };
}

/**
 * Force bypass rate limiting for emergency notifications
 */
export function bypassRateLimit(subscriber: string): void {
  NOTIFICATION_RATE_CACHE.delete(subscriber);
  console.log(`🚨 Rate limit bypassed for ${subscriber}`);
}
