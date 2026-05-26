/**
 * SLO (Service Level Objectives) API
 * 
 * GET /api/admin/slo - Compute and return current SLO burn rates
 * Provides real-time error budget tracking for all defined services
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server/requireAdmin';
import { computeMultipleSLOBurns, getSLOBurnSummary, shouldTriggerIncident, generateSLOIncidentMessage } from '@/lib/server/slo';
import { DEFAULT_SLOS } from '@/lib/server/defaultSLOs';
import { createIncidentFromAlert, appendIncidentEvent, findOpenIncidentBySource } from '@/lib/server/incidents';
import { getDb } from '@/lib/server/legacyAdmin';

export async function GET(req: NextRequest) {
  try {
    requireAdmin(req);
    
    const { searchParams } = new URL(req.url);
    const service = searchParams.get('service') as 'webhook' | 'capacity' | 'billing' | 'system' | null;
    const window = searchParams.get('window') as '7d' | '30d' | null;
    const includeIncidents = searchParams.get('include_incidents') === 'true';

    console.log('📊 Computing SLO burn rates...', { service, window, includeIncidents });

    // Filter SLOs based on query parameters
    let slosToCompute = DEFAULT_SLOS;
    
    if (service) {
      slosToCompute = slosToCompute.filter(slo => slo.service === service);
    }
    
    if (window) {
      slosToCompute = slosToCompute.filter(slo => slo.window === window);
    }

    // Compute burn rates for all selected SLOs
    const sloResults = await computeMultipleSLOBurns(slosToCompute);
    
    // Generate summary statistics
    const summary = getSLOBurnSummary(sloResults);

    // Handle incident creation for violating SLOs
    const incidentActions = [];
    
    if (includeIncidents) {
      for (const burn of sloResults) {
        if (shouldTriggerIncident(burn)) {
          try {
            const incidentMessage = generateSLOIncidentMessage(burn);
            
            // Create a synthetic alert for the SLO violation
            const sloAlert = {
              type: 'slo' as const,
              severity: burn.status === 'violating' ? 'critical' as const : 'warning' as const,
              message: incidentMessage,
              created_at: new Date().toISOString(),
              source: `slo-${burn.service}`,
              meta: {
                slo_id: burn.sloId,
                target: burn.target,
                achieved: burn.achieved,
                error_budget_consumed: burn.errorBudgetConsumed,
                window: burn.window,
                status: burn.status
              }
            };

            // Find existing incident for this SLO source
            const existingIncident = await findOpenIncidentBySource(`slo-${burn.service}`);
            
            if (existingIncident) {
              // Update existing incident with new SLO status
              await appendIncidentEvent(existingIncident.id!, {
                type: 'auto',
                message: incidentMessage,
                meta: {
                  slo_update: true,
                  ...sloAlert.meta
                }
              });
              
              incidentActions.push({
                action: 'updated_incident',
                incident_id: existingIncident.id,
                slo_id: burn.sloId
              });
            } else {
              // Create new incident for SLO violation
              const incidentId = await createIncidentFromAlert(sloAlert);
              
              incidentActions.push({
                action: 'created_incident', 
                incident_id: incidentId,
                slo_id: burn.sloId
              });
            }

            console.log(`🚨 SLO incident action for ${burn.sloId}: ${burn.status}`);
            
          } catch (error) {
            console.error(`❌ Failed to handle incident for SLO ${burn.sloId}:`, error);
            incidentActions.push({
              action: 'failed',
              slo_id: burn.sloId,
              error: error instanceof Error ? error.message : 'Unknown error'
            });
          }
        }
      }
    }

    // Sort results by status severity and achieved percentage
    const sortedResults = sloResults.sort((a, b) => {
      const statusPriority = { violating: 0, 'at-risk': 1, healthy: 2 };
      const aPriority = statusPriority[a.status];
      const bPriority = statusPriority[b.status];
      
      if (aPriority !== bPriority) {
        return aPriority - bPriority; // Sort by status severity first
      }
      
      return a.achieved - b.achieved; // Then by achieved percentage (lowest first)
    });

    const response = {
      ok: true,
      generated_at: new Date().toISOString(),
      filters: {
        service: service || 'all',
        window: window || 'all',
        include_incidents: includeIncidents
      },
      slos: sortedResults,
      summary: {
        total: summary.total,
        healthy: summary.healthy,
        at_risk: summary.atRisk,
        violating: summary.violating,
        average_achieved: summary.averageAchieved,
        worst_performing: summary.worstPerforming ? {
          slo_id: summary.worstPerforming.sloId,
          achieved: summary.worstPerforming.achieved,
          target: summary.worstPerforming.target,
          status: summary.worstPerforming.status
        } : null
      },
      incident_actions: incidentActions
    };

    console.log(`✅ SLO computation complete: ${summary.healthy}H/${summary.atRisk}@/${summary.violating}V`);

    return NextResponse.json(response);

  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    
    console.error('❌ SLO computation failed:', error);
    return NextResponse.json(
      { 
        error: 'Failed to compute SLO burn rates',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Health check endpoint for SLO monitoring
export async function HEAD(req: NextRequest) {
  try {
    requireAdmin(req);
    
    // Quick health check - just verify we can access the database
    await getDb().collection('alerts').limit(1).get();
    
    return new NextResponse(null, { 
      status: 200,
      headers: {
        'X-SLO-Status': 'operational',
        'Cache-Control': 'no-cache'
      }
    });
    
  } catch (error) {
    console.error('❌ SLO health check failed:', error);
    return new NextResponse(null, { 
      status: 503,
      headers: {
        'X-SLO-Status': 'degraded'
      }
    });
  }
}
