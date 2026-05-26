/**
 * Alert Processing API
 * 
 * Processes alerts and executes auto-remediation actions based on rules.
 * POST /api/admin/alerts/process
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server/requireAdmin';
import { getDb } from '@/lib/server/legacyAdmin';
import { getAlertActions, type Alert, type AlertAction } from '@/lib/server/alertRules';
import { sendAlertNotification, type AlertNotification } from '@/lib/server/notify';
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

    console.log(`🔄 Processing alert: ${alertId}`);

    // Load alert from Firestore
    const alertDoc = await getDb().collection('alerts').doc(alertId).get();
    
    if (!alertDoc.exists) {
      return NextResponse.json(
        { error: 'Alert not found' },
        { status: 404 }
      );
    }

    const alert = { id: alertId, ...alertDoc.data() } as Alert;
    console.log(`📋 Loaded alert:`, { 
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

    // Get actions to execute
    const actions = getAlertActions(alert);
    
    if (actions.length === 0) {
      console.log(`ℹ️ No actions required for alert ${alertId}`);
      
      // Link alert to incident even if no actions
      if (incidentId) {
        try {
          await getDb().collection('alerts').doc(alertId).update({
            incident_id: incidentId,
            updated_at: new Date().toISOString()
          });
        } catch (error) {
          console.error(`⚠️ Failed to link alert ${alertId} to incident ${incidentId}:`, error);
        }
      }
      
      return NextResponse.json({
        ok: true,
        alertId,
        incidentId,
        actionsRun: [],
        message: 'No actions required for this alert'
      });
    }

    // Execute each action
    const actionsRun: string[] = [];
    const errors: string[] = [];

    for (const action of actions) {
      try {
        console.log(`⚡ Executing action: ${action} for alert ${alertId}`);
        
        switch (action) {
          case 'notify-team':
            await executeNotifyTeam(alert);
            actionsRun.push(`notify-team: Sent notification to team`);
            break;
            
          case 'mark-needs-review':
            await executeMarkNeedsReview(alertId);
            actionsRun.push(`mark-needs-review: Flagged alert for review`);
            break;
            
          case 'queue-replay':
            await executeQueueReplay(alert);
            actionsRun.push(`queue-replay: Queued event for replay`);
            break;
            
          case 'escalate':
            await executeEscalate(alert);
            actionsRun.push(`escalate: Escalated to on-call team`);
            break;
            
          case 'create-ticket':
            // TODO: Implement ticket creation
            console.log(`⚠️ Action 'create-ticket' not implemented yet`);
            actionsRun.push(`create-ticket: Not implemented (logged only)`);
            break;
            
          default:
            console.warn(`❓ Unknown action: ${action}`);
            errors.push(`Unknown action: ${action}`);
        }
      } catch (error) {
        const errorMsg = `Failed to execute ${action}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        console.error(`❌ ${errorMsg}`);
        errors.push(errorMsg);
      }
    }

    // === LOG ACTIONS TO INCIDENT ===
    if (incidentId && (actionsRun.length > 0 || errors.length > 0)) {
      try {
        const actionSummary = `${actionsRun.length} actions executed${errors.length > 0 ? `, ${errors.length} failed` : ''}`;
        await appendIncidentEvent(incidentId, {
          type: 'auto',
          message: `Rule-based processing: ${actionSummary}`,
          meta: {
            alert_id: alertId,
            actions_executed: actionsRun,
            errors: errors,
            total_actions: actions.length,
            successful_actions: actionsRun.length
          }
        });
      } catch (error) {
        console.error(`⚠️ Failed to log actions to incident ${incidentId}:`, error);
      }
    }

    // Link alert to incident
    if (incidentId) {
      try {
        await getDb().collection('alerts').doc(alertId).update({
          incident_id: incidentId,
          updated_at: new Date().toISOString()
        });
      } catch (error) {
        console.error(`⚠️ Failed to link alert ${alertId} to incident ${incidentId}:`, error);
      }
    }

    console.log(`✅ Alert processing complete for ${alertId}:`, { actionsRun, errors });

    return NextResponse.json({
      ok: true,
      alertId,
      incidentId,
      actionsRun,
      errors: errors.length > 0 ? errors : undefined,
      totalActions: actions.length,
      successfulActions: actionsRun.length
    });

  } catch (error) {
    if (error instanceof NextResponse) {
      return error; // This is from requireAdmin
    }
    
    console.error('❌ Alert processing failed:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

/**
 * Action: Send notification to team
 */
async function executeNotifyTeam(alert: Alert): Promise<void> {
  const notification: AlertNotification = {
    type: alert.type,
    severity: alert.severity === 'error' ? 'critical' : alert.severity,
    message: `🤖 Auto-processed: ${alert.message}`,
    title: `Alert Auto-Remediation: ${alert.type}`,
    created_at: new Date().toISOString(),
    meta: {
      ...alert.meta,
      auto_processed: true,
      original_alert_id: alert.id,
      processing_timestamp: new Date().toISOString()
    },
    source: 'alert-processor'
  };

  const success = await sendAlertNotification(notification);
  if (!success) {
    throw new Error('Failed to send team notification');
  }
}

/**
 * Action: Mark alert as needing review
 */
async function executeMarkNeedsReview(alertId: string): Promise<void> {
  await getDb().collection('alerts').doc(alertId).update({
    needs_review: true,
    reviewed: false,
    auto_processed_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
}

/**
 * Action: Queue webhook for replay
 */
async function executeQueueReplay(alert: Alert): Promise<void> {
  const eventId = alert.meta?.event_id || alert.meta?.webhook_id;
  
  if (!eventId) {
    throw new Error('No event_id found in alert metadata for replay');
  }

  // Write to webhook_replay_queue collection
  await getDb().collection('webhook_replay_queue').add({
    event_id: eventId,
    original_alert_id: alert.id,
    alert_type: alert.type,
    alert_severity: alert.severity,
    queued_at: new Date().toISOString(),
    status: 'queued',
    retry_count: 0,
    meta: {
      ...alert.meta,
      auto_queued: true,
      reason: 'Critical webhook failure - auto-replay triggered'
    }
  });

  console.log(`📝 Queued event ${eventId} for replay due to alert ${alert.id}`);
}

/**
 * Action: Escalate to on-call team
 */
async function executeEscalate(alert: Alert): Promise<void> {
  // Send high-priority notification
  const escalationNotification: AlertNotification = {
    type: `${alert.type}-escalation`,
    severity: 'critical',
    message: `🚨 ESCALATED: ${alert.message}`,
    title: `🆘 Critical Alert Escalation: ${alert.type}`,
    created_at: new Date().toISOString(),
    meta: {
      ...alert.meta,
      escalated: true,
      escalation_reason: 'Auto-escalation due to critical alert rules',
      original_alert_id: alert.id,
      escalated_at: new Date().toISOString(),
      priority: 'HIGH'
    },
    source: 'alert-escalation'
  };

  const success = await sendAlertNotification(escalationNotification);
  if (!success) {
    throw new Error('Failed to send escalation notification');
  }

  // Also update the original alert
  await getDb().collection('alerts').doc(alert.id!).update({
    escalated: true,
    escalated_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
}
