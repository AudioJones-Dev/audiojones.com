/**
 * Public Incident Feed API
 * 
 * Provides external systems with read-only access to current incidents.
 * Excludes admin-only fields and supports token authentication.
 * 
 * Example usage:
 * curl https://audiojones.com/api/incidents
 * curl "https://audiojones.com/api/incidents?status=open&limit=10&token=YOUR_TOKEN"
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/server/legacyAdmin';
import { serializeIncidentsForFeed, applyFeedFilters } from '@/lib/server/incidentFeed';
import type { 
  IncidentFeedResponse, 
  IncidentFeedErrorResponse, 
  IncidentFeedQuery 
} from '@/types/incidents';

// Maximum limits to prevent abuse
const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 20;

export async function GET(req: NextRequest): Promise<NextResponse<IncidentFeedResponse | IncidentFeedErrorResponse>> {
  try {
    // Extract query parameters
    const { searchParams } = new URL(req.url);
    const query: IncidentFeedQuery = {
      status: searchParams.get('status') || undefined,
      limit: searchParams.get('limit') || undefined,
      since: searchParams.get('since') || undefined,
      token: searchParams.get('token') || undefined,
      include: searchParams.get('include') || undefined,
    };

    // Check token authentication
    const tokenAuthResult = checkTokenAuth(req, query.token);
    if (!tokenAuthResult.success) {
      return NextResponse.json(
        {
          ok: false,
          error: 'unauthorized',
          message: tokenAuthResult.message
        },
        { status: 401 }
      );
    }

    // Parse and validate query parameters
    const filters = parseQueryFilters(query);
    if (!filters.success || !filters.data) {
      return NextResponse.json(
        {
          ok: false,
          error: 'invalid-parameters',
          message: filters.message || 'Invalid query parameters'
        },
        { status: 400 }
      );
    }

    console.log(`📡 Incident feed request: ${JSON.stringify(filters.data)}`);

    // Fetch incidents from Firestore
    const incidents = await fetchIncidentsFromFirestore(filters.data);

    // Build response
    const response: IncidentFeedResponse = {
      ok: true,
      incidents,
      count: incidents.length,
      timestamp: new Date().toISOString(),
      filters_applied: {
        status: filters.data.status,
        since: filters.data.since?.toISOString(),
        limit: filters.data.limit
      }
    };

    console.log(`📡 Incident feed response: ${incidents.length} incidents`);

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, max-age=60', // Cache for 1 minute
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type, x-incident-feed-token'
      }
    });

  } catch (error) {
    console.error('❌ Incident feed API error:', error);
    
    return NextResponse.json(
      {
        ok: false,
        error: 'internal-error',
        message: 'Failed to fetch incidents'
      },
      { status: 500 }
    );
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check token authentication
 */
function checkTokenAuth(
  req: NextRequest, 
  queryToken?: string
): { success: boolean; message?: string } {
  const requiredToken = process.env.INCIDENT_FEED_TOKEN;
  
  // If no token is configured, allow public access
  if (!requiredToken) {
    return { success: true };
  }

  // Check for token in header or query parameter
  const headerToken = req.headers.get('x-incident-feed-token');
  const providedToken = headerToken || queryToken;

  if (!providedToken) {
    return { 
      success: false, 
      message: 'Token required. Provide via x-incident-feed-token header or ?token= parameter.' 
    };
  }

  if (providedToken !== requiredToken) {
    return { 
      success: false, 
      message: 'Invalid token provided.' 
    };
  }

  return { success: true };
}

/**
 * Parse and validate query parameters
 */
function parseQueryFilters(query: IncidentFeedQuery): {
  success: boolean;
  message?: string;
  data?: {
    status?: string[];
    since?: Date;
    limit?: number;
  };
} {
  const filters: {
    status?: string[];
    since?: Date;
    limit?: number;
  } = {};

  // Parse status filter
  if (query.status) {
    const statuses = query.status.split(',').map(s => s.trim().toLowerCase());
    const validStatuses = ['open', 'investigating', 'monitoring', 'resolved'];
    
    const invalidStatuses = statuses.filter(s => !validStatuses.includes(s));
    if (invalidStatuses.length > 0) {
      return {
        success: false,
        message: `Invalid status values: ${invalidStatuses.join(', ')}. Valid: ${validStatuses.join(', ')}`
      };
    }
    
    filters.status = statuses;
  } else {
    // Default to open and investigating incidents
    filters.status = ['open', 'investigating'];
  }

  // Parse limit
  if (query.limit) {
    const limit = parseInt(query.limit, 10);
    if (isNaN(limit) || limit < 1) {
      return {
        success: false,
        message: 'Limit must be a positive integer'
      };
    }
    if (limit > MAX_LIMIT) {
      return {
        success: false,
        message: `Limit cannot exceed ${MAX_LIMIT}`
      };
    }
    filters.limit = limit;
  } else {
    filters.limit = DEFAULT_LIMIT;
  }

  // Parse since date
  if (query.since) {
    const sinceDate = new Date(query.since);
    if (isNaN(sinceDate.getTime())) {
      return {
        success: false,
        message: 'Since parameter must be a valid ISO date'
      };
    }
    filters.since = sinceDate;
  }

  return {
    success: true,
    data: filters
  };
}

/**
 * Fetch incidents from Firestore with basic filtering
 */
async function fetchIncidentsFromFirestore(filters: {
  status?: string[];
  since?: Date;
  limit?: number;
}) {
  try {
    // Start with base query - fetch recent incidents
    let query = getDb().collection('incidents')
      .orderBy('updated_at', 'desc')
      .limit(Math.min(filters.limit! * 2, MAX_LIMIT)); // Fetch extra to account for filtering

    // Apply since filter at Firestore level if provided
    if (filters.since) {
      query = query.where('updated_at', '>', filters.since.toISOString());
    }

    console.log(`🔍 Querying Firestore for incidents...`);
    
    const snapshot = await query.get();
    
    console.log(`📊 Firestore returned ${snapshot.size} incident documents`);

    // Serialize to safe format
    const incidents = serializeIncidentsForFeed(snapshot.docs);
    
    console.log(`✅ Serialized ${incidents.length} valid incidents`);

    // Apply additional filters in memory
    const filteredIncidents = applyFeedFilters(incidents, {
      status: filters.status,
      since: filters.since,
      limit: filters.limit
    });

    console.log(`🎯 Final filtered result: ${filteredIncidents.length} incidents`);

    return filteredIncidents;

  } catch (error) {
    console.error('❌ Failed to fetch incidents from Firestore:', error);
    throw error;
  }
}

// Handle CORS preflight requests
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-incident-feed-token',
      'Access-Control-Max-Age': '86400', // 24 hours
    },
  });
}
