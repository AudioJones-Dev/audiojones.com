/**
 * Incident Feed Serializer
 * 
 * Converts internal Firestore incident documents to safe, client-facing objects.
 * Excludes admin-only fields and provides null-safe serialization.
 */

import 'server-only';
import type { IncidentFeedItem, IncidentFeedTimelineItem } from '@/types/incidents';
import type { Incident, IncidentTimelineEvent } from '@/lib/server/incidents';

/**
 * Serialize a Firestore incident document to a safe feed item
 * 
 * @param doc - Firestore document snapshot
 * @returns Safe incident feed item or null if invalid
 */
export function serializeIncidentForFeed(
  doc: FirebaseFirestore.DocumentSnapshot
): IncidentFeedItem | null {
  if (!doc.exists) {
    return null;
  }

  try {
    const data = doc.data();
    if (!data) {
      return null;
    }

    // Map internal incident to safe external shape
    const incident: IncidentFeedItem = {
      id: doc.id,
      title: data.title || 'Unknown Incident',
      status: mapStatus(data.status),
    };

    // Add optional fields only if they exist and are valid
    if (data.severity && isValidSeverity(data.severity)) {
      incident.severity = data.severity;
    }

    if (data.source && typeof data.source === 'string') {
      incident.source = data.source;
    }

    // Map timestamps
    if (data.created_at) {
      incident.started_at = normalizeTimestamp(data.created_at);
    }

    if (data.updated_at) {
      incident.updated_at = normalizeTimestamp(data.updated_at);
    }

    // Extract short description from timeline or description field
    incident.short_description = extractShortDescription(data);

    // Extract affected components if available
    if (data.affected_components && Array.isArray(data.affected_components)) {
      incident.affected_components = data.affected_components
        .filter((component: any) => typeof component === 'string')
        .slice(0, 10); // Limit to 10 components max
    }

    return incident;

  } catch (error) {
    console.error(`❌ Failed to serialize incident ${doc.id}:`, error);
    return null;
  }
}

/**
 * Serialize multiple incident documents
 * 
 * @param docs - Array of Firestore document snapshots
 * @returns Array of safe incident feed items (filters out nulls)
 */
export function serializeIncidentsForFeed(
  docs: FirebaseFirestore.DocumentSnapshot[]
): IncidentFeedItem[] {
  return docs
    .map(doc => serializeIncidentForFeed(doc))
    .filter((item): item is IncidentFeedItem => item !== null);
}

/**
 * Serialize timeline entries for expanded feed responses
 * 
 * @param timeline - Internal timeline events
 * @param limit - Maximum number of entries to return
 * @returns Safe timeline items
 */
export function serializeTimelineForFeed(
  timeline: IncidentTimelineEvent[] | undefined,
  limit: number = 3
): IncidentFeedTimelineItem[] {
  if (!timeline || !Array.isArray(timeline)) {
    return [];
  }

  return timeline
    .slice(-limit) // Get most recent entries
    .map(entry => ({
      timestamp: normalizeTimestamp(entry.ts),
      type: mapTimelineType(entry.type),
      message: sanitizeMessage(entry.message || '')
    }))
    .filter(item => item.message.length > 0);
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Map internal status to safe external status
 */
function mapStatus(status: any): IncidentFeedItem['status'] {
  const validStatuses = ['open', 'investigating', 'monitoring', 'resolved'];
  
  if (typeof status === 'string' && validStatuses.includes(status)) {
    return status as IncidentFeedItem['status'];
  }
  
  // Default to 'open' for unknown statuses
  return 'open';
}

/**
 * Validate severity value
 */
function isValidSeverity(severity: any): severity is IncidentFeedItem['severity'] {
  const validSeverities = ['low', 'medium', 'high', 'critical'];
  return typeof severity === 'string' && validSeverities.includes(severity);
}

/**
 * Map internal timeline type to safe external type
 */
function mapTimelineType(type: any): IncidentFeedTimelineItem['type'] {
  switch (type) {
    case 'action':
      return 'status_change';
    case 'note':
      return 'update';
    case 'auto':
      return 'update';
    default:
      return 'update';
  }
}

/**
 * Normalize timestamp to ISO string
 */
function normalizeTimestamp(timestamp: any): string {
  try {
    if (typeof timestamp === 'string') {
      // Already a string, validate it's a valid date
      const date = new Date(timestamp);
      return isNaN(date.getTime()) ? new Date().toISOString() : timestamp;
    }
    
    if (timestamp && typeof timestamp.toDate === 'function') {
      // Firestore Timestamp
      return timestamp.toDate().toISOString();
    }
    
    if (timestamp instanceof Date) {
      return timestamp.toISOString();
    }
    
    // Fallback to current time
    return new Date().toISOString();
    
  } catch (error) {
    console.warn('Failed to normalize timestamp:', error);
    return new Date().toISOString();
  }
}

/**
 * Extract short description from incident data
 */
function extractShortDescription(data: any): string | undefined {
  // Try to get from explicit description field first
  if (data.description && typeof data.description === 'string') {
    return sanitizeMessage(data.description);
  }

  // Fall back to latest timeline entry
  if (data.timeline && Array.isArray(data.timeline) && data.timeline.length > 0) {
    // Get the most recent non-empty timeline entry
    for (let i = data.timeline.length - 1; i >= 0; i--) {
      const entry = data.timeline[i];
      if (entry && entry.message && typeof entry.message === 'string') {
        const message = sanitizeMessage(entry.message);
        if (message.length > 0) {
          return message;
        }
      }
    }
  }

  // No description available
  return undefined;
}

/**
 * Sanitize message content for external consumption
 * Removes admin-only information and truncates if needed
 */
function sanitizeMessage(message: string): string {
  if (typeof message !== 'string') {
    return '';
  }

  let sanitized = message
    // Remove potential admin-only prefixes
    .replace(/^\[ADMIN\]/i, '')
    .replace(/^\[INTERNAL\]/i, '')
    .replace(/^\[AUTO\]/i, '')
    // Remove sensitive patterns
    .replace(/admin\s*key\s*[:=]\s*\S+/gi, '[REDACTED]')
    .replace(/token\s*[:=]\s*\S+/gi, '[REDACTED]')
    .replace(/password\s*[:=]\s*\S+/gi, '[REDACTED]')
    // Clean up whitespace
    .trim();

  // Truncate if too long
  if (sanitized.length > 200) {
    sanitized = sanitized.substring(0, 197) + '...';
  }

  return sanitized;
}

/**
 * Apply filters to incident feed items
 * 
 * @param incidents - Array of incidents to filter
 * @param filters - Filter criteria
 * @returns Filtered incidents
 */
export function applyFeedFilters(
  incidents: IncidentFeedItem[],
  filters: {
    status?: string[];
    since?: Date;
    limit?: number;
  }
): IncidentFeedItem[] {
  let filtered = [...incidents];

  // Filter by status
  if (filters.status && filters.status.length > 0) {
    filtered = filtered.filter(incident => 
      filters.status!.includes(incident.status)
    );
  }

  // Filter by since date
  if (filters.since) {
    filtered = filtered.filter(incident => {
      if (!incident.updated_at) return false;
      return new Date(incident.updated_at) > filters.since!;
    });
  }

  // Apply limit
  if (filters.limit && filters.limit > 0) {
    filtered = filtered.slice(0, filters.limit);
  }

  return filtered;
}