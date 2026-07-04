/**
 * Public Incidents API Endpoint
 * 
 * Alternative public endpoint that wraps our existing incident feed logic.
 * Provides same data as /api/incidents but under /api/public/incidents
 * for clearer public API organization.
 */

import { NextRequest, NextResponse } from 'next/server';
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
    
    // Firebase/Firestore was removed from audiojones.com (see docs/architecture/stack-decision.md)
    // and no NeonDB-backed incident store has been built yet. Until it is, the feed reports
    // no active incidents instead of throwing, so the public status page stays up.
    const incidents: IncidentFeedResponse['incidents'] = [];
    
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
    console.error('Error in public incidents API:', error);
    
    const errorResponse = {
      ok: false,
      error: 'Internal server error',
      incidents: [],
      count: 0,
      timestamp: new Date().toISOString(),
    };
    
    return new NextResponse(JSON.stringify(errorResponse), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
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
