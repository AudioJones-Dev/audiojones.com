/**
 * Simple Status JSON Endpoint
 * 
 * Provides a lightweight status summary for external consumers like Zapier,
 * monitoring tools, or third-party integrations.
 * 
 * Returns only essential status information without detailed incident data.
 */

import { NextRequest, NextResponse } from 'next/server';
import { listIncidentRecords } from '@/db/incidents';
import { serializeIncidentsForFeed } from '@/lib/server/incidentFeed';
import { getCachedStatus } from '@/lib/server/statusEvents';

interface SimpleStatusResponse {
  ok: true;
  status: 'operational' | 'degraded' | 'outage';
  incident_count: number;
  last_updated: string;
  source: 'audiojones-status-v1';
}

interface SimpleStatusErrorResponse {
  ok: false;
  status: 'unknown';
  error: string;
  last_updated: string;
  source: 'audiojones-status-v1';
}

export async function GET(request: NextRequest) {
  try {
    let activeIncidents: Array<{ severity?: string; status?: string }> = [];

    try {
      // Fetch recent incidents to determine status
      const records = await listIncidentRecords({ limit: 25 });

      // Serialize incidents using existing helper
      const incidents = serializeIncidentsForFeed(records);

      // Filter to active incidents only
      activeIncidents = incidents.filter(incident =>
        incident.status === 'open' ||
        incident.status === 'investigating' ||
        incident.status === 'monitoring'
      );
    } catch (incidentFetchError) {
      console.warn('Status endpoint incident fetch unavailable, falling back to cached/operational status:', incidentFetchError);
    }

    // Determine overall status
    let overallStatus: 'operational' | 'degraded' | 'outage' = 'operational';
    
    if (activeIncidents.length > 0) {
      // Check for critical or high severity incidents
      const hasCritical = activeIncidents.some(i => i.severity === 'critical');
      const hasHigh = activeIncidents.some(i => i.severity === 'high');
      
      if (hasCritical) {
        overallStatus = 'outage';
      } else if (hasHigh || activeIncidents.length > 2) {
        overallStatus = 'outage';
      } else {
        overallStatus = 'degraded';
      }
    }

    // Check cached status to improve fallback behavior.
    // NOTE: This public endpoint intentionally avoids mutating status/event stores.
    const cachedStatus = await getCachedStatus();

    if (
      activeIncidents.length === 0 &&
      (cachedStatus === 'operational' || cachedStatus === 'degraded' || cachedStatus === 'outage')
    ) {
      overallStatus = cachedStatus;
    }
    const response: SimpleStatusResponse = {
      ok: true,
      status: overallStatus,
      incident_count: activeIncidents.length,
      last_updated: new Date().toISOString(),
      source: 'audiojones-status-v1',
    };

    return new NextResponse(JSON.stringify(response), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
      },
    });

  } catch (error) {
    console.error('Error in simple status endpoint:', error);

    const errorResponse: SimpleStatusErrorResponse = {
      ok: false,
      status: 'unknown',
      error: 'Failed to determine system status',
      last_updated: new Date().toISOString(),
      source: 'audiojones-status-v1',
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
