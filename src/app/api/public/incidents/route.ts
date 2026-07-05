/**
 * Public Incidents API Endpoint
 * 
 * Alternative public endpoint that wraps our existing incident feed logic.
 * Provides same data as /api/incidents but under /api/public/incidents
 * for clearer public API organization.
 */

import { NextRequest, NextResponse } from 'next/server';
import { listIncidentRecords } from '@/db/incidents';
import { serializeIncidentsForFeed, applyFeedFilters } from '@/lib/server/incidentFeed';
import type { 
  IncidentFeedResponse, 
  IncidentFeedErrorResponse, 
  IncidentFeedQuery 
} from '@/types/incidents';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const limitParam = searchParams.get('limit');
    const statusParam = searchParams.get('status');
    const sinceParam = searchParams.get('since');
    const tokenParam = searchParams.get('token');
    
    const limit = limitParam ? Math.min(parseInt(limitParam, 10), 100) : 25;
    const statusFilter = statusParam ? statusParam.split(',').map(s => s.trim()) : null;
    const since = sinceParam || null;
    
    // Check for status page token (optional enhanced access)
    const isEnhanced = tokenParam === process.env.STATUS_PAGE_SECRET;
    
    // Query NeonDB with extra buffer for in-memory status filtering
    const sinceDate = since ? new Date(since) : null;
    const validSince = sinceDate && !isNaN(sinceDate.getTime()) ? sinceDate : null;

    const records = await listIncidentRecords({
      sinceIso: validSince?.toISOString(),
      limit: limit * 2,
    });

    // Serialize incidents using existing helper
    const allIncidents = serializeIncidentsForFeed(records);

    // Apply filters using existing helper
    const incidents = applyFeedFilters(allIncidents, {
      status: statusFilter || undefined,
      since: validSince || undefined,
      limit,
    });
    
    // Build response
    const response: IncidentFeedResponse = {
      ok: true,
      incidents,
      count: incidents.length,
      timestamp: new Date().toISOString(),
      filters_applied: {
        ...(statusFilter && { status: statusFilter }),
        ...(since && { since }),
        limit
      }
    };
    
    // Add enhanced fields if token provided
    if (isEnhanced) {
      // Could add additional fields here for internal dashboards
      // For now, same data but marked as enhanced
      (response as any).enhanced = true;
    }
    
    // Set CORS headers for public API
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
    });
    
    return new NextResponse(JSON.stringify(response), {
      status: 200,
      headers,
    });
    
  } catch (error) {
    // DB unreachable / not provisioned: degrade honestly to an empty feed
    // rather than a 500 so status consumers keep rendering.
    console.error('Error in public incidents API, returning empty feed:', error);

    const fallback: IncidentFeedResponse = {
      ok: true,
      incidents: [],
      count: 0,
      timestamp: new Date().toISOString(),
    };

    return new NextResponse(JSON.stringify(fallback), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store',
      },
    });
  }
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
