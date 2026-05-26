/**
 * Automated Alert Processing API
 * 
 * Processes alerts through the automated remediation system.
 * POST /api/admin/alerts/auto
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server/requireAdmin';
import { getDb } from '@/lib/server/legacyAdmin';
import { handleAlert, getActionsSummary, type Alert, type AlertAction } from '@/lib/server/alertActions';
import { 
  createIncidentFromAlert, 
  appendIncidentEvent, 
  findOpenIncidentBySource 
} from '@/lib/server/incidents';

export async function POST(req: NextRequest) {
  try {
    // Require admin authentication
    requireAdmin(req);
    
    const body = await req.json();
    const { alertId } = body;
    
    if (!alertId || typeof alertId !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid alertId' },
        { status: 400 }
      );
    }

    console.log(`🤖 Starting automated processing for alert: ${alertId}`);

    // Load alert from Firestore
    const alertDoc = await getDb().collection('alerts').doc(alertId).get();
    
    if (!alertDoc.exists) {
      return NextResponse.json(
        { error: 'Alert not found' },
        { status: 404 }
      );
    }

    const alertData = alertDoc.data();
    
    if (!alertData) {
      return NextResponse.json(
        { error: 'Alert data is corrupted or empty' },
        { status: 500 }
      );
    }
    
    const alert: Alert = {
      id: alertId,
      type: alertData.type,
      severity: alertData.severity,
      message: alertData.message,
      created_at: alertData.created_at,
      source: alertData.source,
      meta: alertData.meta || {}
    };

    console.log(`📋 Processing alert:`, { 
      id: alert.id, 
      type: alert.type, 
      severity: alert.severity,
      message: alert.message?.substring(0, 100) + '...'
    });

    // === INCIDENT MANAGEMENT ===
    // Create or update incident for this alert
    let incidentId: string | null = null;
    
    try {
      const alertSource = alert.source || alert.type || 'system';
      
      // Try to find existing open incident for this source
      const existingIncident = await findOpenIncidentBySource(alertSource);
      
      if (existingIncident) {
        // Add alert to existing incident
        incidentId = existingIncident.id!;
        console.log(`📋 Adding alert ${alertId} to existing incident ${incidentId}`);
        
        // Update incident with new alert ID
        const updatedAlertIds = [...existingIncident.related_alert_ids];
        if (!updatedAlertIds.includes(alertId)) {
          updatedAlertIds.push(alertId);
          await getDb().collection('incidents').doc(incidentId).update({
            related_alert_ids: updatedAlertIds,
            updated_at: new Date().toISOString()
          });
        }
        
        // Add timeline event
        await appendIncidentEvent(incidentId, {
          type: 'alert',
          message: alert.message || 'Alert received',
          meta: {
            alert_id: alertId,
            alert_type: alert.type,
            alert_severity: alert.severity,
            source: alert.source
          }
        });
        
      } else {
        // Create new incident
        incidentId = await createIncidentFromAlert(alert);
        console.log(`🚨 Created new incident ${incidentId} for alert ${alertId}`);
      }
      
    } catch (error) {
      console.error(`⚠️ Failed to manage incident for alert ${alertId}:`, error);
      // Continue processing - incident creation failure shouldn't block alert processing
    }

    // Execute automated actions
    const actions = await handleAlert(alert);
    
    // === LOG ACTIONS TO INCIDENT ===
    if (incidentId && actions.length > 0) {
      try {
        const actionSummary = getActionsSummary(actions);
        await appendIncidentEvent(incidentId, {
          type: 'auto',
          message: `Auto-processed: ${actionSummary}`,
          meta: {
            alert_id: alertId,
            actions_count: actions.length,
            successful_actions: actions.filter(a => a.success).length,
            failed_actions: actions.filter(a => !a.success).length,
            actions: actions.map(a => ({
              type: a.type,
              description: a.description,
              success: a.success
            }))
          }
        });
      } catch (error) {
        console.error(`⚠️ Failed to log actions to incident ${incidentId}:`, error);
      }
    }
    
    // Log actions to Firestore subcollection (existing functionality)
    const actionsLogRef = getDb().collection('alerts').doc(alertId).collection('actions_log');
    
    const logEntry = {
      processed_at: new Date().toISOString(),
      actions_count: actions.length,
      successful_actions: actions.filter(a => a.success).length,
      failed_actions: actions.filter(a => !a.success).length,
      actions: actions,
      summary: getActionsSummary(actions),
      processor: 'automated-alert-handler',
      processor_version: '1.0.0',
      incident_id: incidentId // Link to incident
    };

    await actionsLogRef.add(logEntry);
    console.log(`📝 Logged ${actions.length} actions to Firestore for alert ${alertId}`);

    // Also update the main alert document with processing info
    await getDb().collection('alerts').doc(alertId).update({
      auto_processed: true,
      auto_processed_at: new Date().toISOString(),
      last_action_count: actions.length,
      last_action_summary: getActionsSummary(actions),
      incident_id: incidentId, // Link alert to incident
      updated_at: new Date().toISOString()
    });

    // Build response with action details
    const successfulActions = actions.filter(a => a.success);
    const failedActions = actions.filter(a => !a.success);

    const response = {
      ok: true,
      alertId,
      incidentId, // Include incident information
      actionsRun: actions.map(a => a.description),
      totalActions: actions.length,
      successfulActions: successfulActions.length,
      failedActions: failedActions.length,
      summary: getActionsSummary(actions),
      details: {
        successful: successfulActions.map(a => ({
          type: a.type,
          description: a.description,
          executed_at: a.executed_at
        })),
        failed: failedActions.map(a => ({
          type: a.type,
          description: a.description,
          error: a.error,
          executed_at: a.executed_at
        }))
      }
    };

    console.log(`✅ Automated processing complete for ${alertId}:`, {
      total: actions.length,
      successful: successfulActions.length,
      failed: failedActions.length
    });

    return NextResponse.json(response);

  } catch (error) {
    if (error instanceof NextResponse) {
      return error; // This is from requireAdmin
    }
    
    console.error('❌ Automated alert processing failed:', error);
    return NextResponse.json(
      { 
        error: 'Automated processing failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

// Only allow POST requests
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to process alerts.' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to process alerts.' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to process alerts.' },
    { status: 405 }
  );
}
