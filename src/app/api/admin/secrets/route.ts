/**
 * Admin API for Secrets Rotation Management
 * Handles secret rotation operations, monitoring, and audit trails
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server/requireAdmin';
import { secretsRotationEngine } from '@/lib/secrets/SecretsRotationEngine';
import { getDb } from '@/lib/server/firebaseAdmin';
import { SecretsRotationEngine } from '@/lib/server/secrets/secretsEngine';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);

    const { action, secret_name, force, reason } = await request.json();

    switch (action) {
      case 'initialize':
        await secretsRotationEngine.initialize();
        return NextResponse.json({
          success: true,
          message: 'Secrets rotation system initialized successfully'
        });

      case 'rotate_secret':
        if (!secret_name) {
          return NextResponse.json(
            { error: 'secret_name is required for rotation' },
            { status: 400 }
          );
        }

        const rotationJob = await secretsRotationEngine.rotateSecret(
          secret_name,
          'admin-api',
          force || false
        );

        return NextResponse.json({
          success: true,
          message: `Secret rotation started for ${secret_name}`,
          job: {
            id: rotationJob.id,
            secret_name: rotationJob.secret_name,
            status: rotationJob.status,
            created_at: rotationJob.created_at.toISOString()
          }
        });

      case 'rollback_rotation':
        const { job_id } = await request.json();
        if (!job_id || !reason) {
          return NextResponse.json(
            { error: 'job_id and reason are required for rollback' },
            { status: 400 }
          );
        }

        await secretsRotationEngine.rollbackRotation(job_id, reason, 'admin-api');

        return NextResponse.json({
          success: true,
          message: `Rotation rollback initiated for job ${job_id}`,
          reason: reason
        });

      case 'check_schedule':
        const overdueSecrets = await secretsRotationEngine.checkRotationSchedule();
        
        return NextResponse.json({
          success: true,
          overdue_secrets: overdueSecrets,
          count: overdueSecrets.length,
          checked_at: new Date().toISOString()
        });

      case 'auto_rotate_overdue':
        const overdue = await secretsRotationEngine.checkRotationSchedule();
        const rotationResults = [];

        for (const secretName of overdue) {
          try {
            const job = await secretsRotationEngine.rotateSecret(
              secretName,
              'auto-scheduler',
              false
            );
            rotationResults.push({
              secret_name: secretName,
              success: true,
              job_id: job.id
            });
          } catch (error) {
            rotationResults.push({
              secret_name: secretName,
              success: false,
              error: error instanceof Error ? error.message : 'Unknown error'
            });
          }
        }

        return NextResponse.json({
          success: true,
          message: `Processed ${overdue.length} overdue secrets`,
          results: rotationResults,
          successful_rotations: rotationResults.filter(r => r.success).length,
          failed_rotations: rotationResults.filter(r => !r.success).length
        });

      // Enhanced Secrets Engine Actions
      case 'enhanced_rotate':
        const enhancedEngine = SecretsRotationEngine.getInstance();
        const { configuration_id, trigger_type = 'manual', enhanced_reason = 'Manual rotation' } = await request.json();
        
        if (!configuration_id) {
          return NextResponse.json(
            { error: 'Configuration ID required' },
            { status: 400 }
          );
        }

        const execution = await enhancedEngine.executeRotation(configuration_id, trigger_type, enhanced_reason);
        
        return NextResponse.json({
          success: true,
          data: {
            execution_id: execution.id,
            status: execution.status,
            started_at: execution.started_at,
            configuration_id: execution.configuration_id
          },
          message: 'Enhanced secret rotation initiated'
        });

      case 'emergency_rotation':
        const enhancedEngineEmerg = SecretsRotationEngine.getInstance();
        const emergencyData = await request.json();
        const { 
          secret_configuration_id, 
          emergency_reason, 
          urgency = 'high',
          skip_approval = false,
          skip_grace_period = false,
          force_immediate_cutover = false,
          description = ''
        } = emergencyData;
        
        if (!secret_configuration_id || !emergency_reason) {
          return NextResponse.json(
            { error: 'Secret configuration ID and reason required' },
            { status: 400 }
          );
        }

        const emergencyRequest = await enhancedEngineEmerg.requestEmergencyRotation({
          secret_configuration_id,
          reason: emergency_reason,
          urgency,
          description,
          skip_approval,
          skip_grace_period,
          force_immediate_cutover,
          requested_by: 'admin',
          approval_required: urgency === 'critical' ? false : true,
          status: 'pending_approval'
        });
        
        return NextResponse.json({
          success: true,
          data: {
            request_id: emergencyRequest.id,
            status: emergencyRequest.status,
            execution_id: emergencyRequest.execution_id
          },
          message: 'Emergency rotation request submitted'
        });

      case 'run_scheduled_rotations':
        const enhancedEngineScheduled = SecretsRotationEngine.getInstance();
        const scheduledExecutions = await enhancedEngineScheduled.runScheduledRotations();
        
        return NextResponse.json({
          success: true,
          data: {
            rotations_started: scheduledExecutions.length,
            executions: scheduledExecutions.map(e => ({
              execution_id: e.id,
              configuration_id: e.configuration_id,
              status: e.status
            }))
          },
          message: `Started ${scheduledExecutions.length} enhanced scheduled rotations`
        });

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}. Available: initialize, rotate_secret, rollback_rotation, check_schedule, auto_rotate_overdue, enhanced_rotate, emergency_rotation, run_scheduled_rotations` },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Secrets rotation API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const view = searchParams.get('view') || 'dashboard';

    const db = getDb();

    switch (view) {
      case 'dashboard':
        const metrics = await secretsRotationEngine.getMetrics();
        
        // Get recent activity
        const recentActivityQuery = await db
          .collection('secret_audit_log')
          .orderBy('timestamp', 'desc')
          .limit(10)
          .get();

        const recentActivity = recentActivityQuery.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp.toDate().toISOString()
        }));

        return NextResponse.json({
          success: true,
          dashboard: {
            metrics: {
              ...metrics,
              last_rotation_check: metrics.last_rotation_check.toISOString()
            },
            recent_activity: recentActivity,
            health_status: {
              overall: metrics.compliance_score >= 90 ? 'healthy' : 
                      metrics.compliance_score >= 75 ? 'warning' : 'critical',
              compliance_score: metrics.compliance_score,
              overdue_count: metrics.overdue_rotations,
              failed_24h: metrics.failed_rotations_24h
            }
          }
        });

      case 'secrets':
        const secretsQuery = await db.collection('secret_configs').get();
        const secrets = secretsQuery.docs.map((doc: any) => ({
          name: doc.id,
          ...doc.data(),
          created_at: doc.data().created_at?.toDate().toISOString(),
          last_rotation: doc.data().last_rotation?.toDate().toISOString(),
          next_rotation_due: doc.data().next_rotation_due?.toDate().toISOString(),
          days_until_rotation: doc.data().next_rotation_due 
            ? Math.ceil((doc.data().next_rotation_due.toDate().getTime() - Date.now()) / (1000 * 60 * 60 * 24))
            : null
        }));

        return NextResponse.json({
          success: true,
          secrets: secrets.sort((a: any, b: any) => (a.days_until_rotation || 0) - (b.days_until_rotation || 0)),
          total_count: secrets.length
        });

      case 'jobs':
        const limit = parseInt(searchParams.get('limit') || '20');
        const status = searchParams.get('status');

        let jobsQuery = db
          .collection('secret_rotation_jobs')
          .orderBy('created_at', 'desc')
          .limit(limit);

        if (status) {
          jobsQuery = jobsQuery.where('status', '==', status);
        }

        const jobsSnapshot = await jobsQuery.get();
        const jobs = jobsSnapshot.docs.map((doc: any) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            created_at: data.created_at?.toDate().toISOString(),
            started_at: data.started_at?.toDate().toISOString(),
            completed_at: data.completed_at?.toDate().toISOString(),
            dual_accept_started: data.dual_accept_started?.toDate().toISOString(),
            dual_accept_ends: data.dual_accept_ends?.toDate().toISOString(),
            audit_trail: data.audit_trail?.map((entry: any) => ({
              ...entry,
              timestamp: entry.timestamp?.toDate().toISOString()
            }))
          };
        });

        return NextResponse.json({
          success: true,
          jobs: jobs,
          total_count: jobs.length,
          filter: { status, limit }
        });

      case 'audit':
        const auditLimit = parseInt(searchParams.get('limit') || '50');
        const secretName = searchParams.get('secret_name');

        let auditQuery = db
          .collection('secret_audit_log')
          .orderBy('timestamp', 'desc')
          .limit(auditLimit);

        if (secretName) {
          auditQuery = auditQuery.where('metadata.secret_name', '==', secretName);
        }

        const auditSnapshot = await auditQuery.get();
        const auditLogs = auditSnapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp.toDate().toISOString()
        }));

        return NextResponse.json({
          success: true,
          audit_logs: auditLogs,
          total_count: auditLogs.length,
          filter: { secret_name: secretName, limit: auditLimit }
        });

      case 'health':
        const healthMetrics = await secretsRotationEngine.getMetrics();
        
        // Calculate health indicators
        const healthIndicators = {
          rotation_compliance: {
            score: healthMetrics.compliance_score,
            status: healthMetrics.compliance_score >= 90 ? 'good' : 
                   healthMetrics.compliance_score >= 75 ? 'warning' : 'critical',
            details: `${healthMetrics.overdue_rotations} secrets overdue for rotation`
          },
          failure_rate: {
            score: healthMetrics.failed_rotations_24h === 0 ? 100 : 
                  Math.max(0, 100 - (healthMetrics.failed_rotations_24h * 10)),
            status: healthMetrics.failed_rotations_24h === 0 ? 'good' : 
                   healthMetrics.failed_rotations_24h <= 2 ? 'warning' : 'critical',
            details: `${healthMetrics.failed_rotations_24h} failed rotations in last 24h`
          },
          performance: {
            score: healthMetrics.average_rotation_time_minutes <= 5 ? 100 :
                  healthMetrics.average_rotation_time_minutes <= 15 ? 75 : 50,
            status: healthMetrics.average_rotation_time_minutes <= 5 ? 'good' :
                   healthMetrics.average_rotation_time_minutes <= 15 ? 'warning' : 'critical',
            details: `Average rotation time: ${healthMetrics.average_rotation_time_minutes.toFixed(1)} minutes`
          },
          active_operations: {
            score: healthMetrics.pending_rotations <= 3 ? 100 : 
                  healthMetrics.pending_rotations <= 5 ? 75 : 50,
            status: healthMetrics.pending_rotations <= 3 ? 'good' :
                   healthMetrics.pending_rotations <= 5 ? 'warning' : 'critical',
            details: `${healthMetrics.pending_rotations} rotations in progress, ${healthMetrics.dual_accept_active} in dual-accept`
          }
        };

        const overallHealth = Object.values(healthIndicators)
          .map(indicator => indicator.score)
          .reduce((sum, score) => sum + score, 0) / Object.keys(healthIndicators).length;

        return NextResponse.json({
          success: true,
          health: {
            overall_score: Math.round(overallHealth),
            overall_status: overallHealth >= 90 ? 'healthy' : 
                          overallHealth >= 75 ? 'warning' : 'critical',
            indicators: healthIndicators,
            metrics: {
              ...healthMetrics,
              last_rotation_check: healthMetrics.last_rotation_check.toISOString()
            },
            checked_at: new Date().toISOString()
          }
        });

      // Enhanced Engine Views
      case 'enhanced_health':
        const enhancedEngine = SecretsRotationEngine.getInstance();
        const enhancedHealth = await enhancedEngine.getSecretsHealth();
        
        return NextResponse.json({
          success: true,
          enhanced_health: enhancedHealth,
          message: 'Enhanced secrets rotation health retrieved'
        });

      case 'configurations':
        // Return mock configurations for now - will be implemented when we add a public getter
        return NextResponse.json({
          success: true,
          configurations: [
            {
              id: 'admin-api-key',
              name: 'Admin API Key',
              type: 'api_key',
              frequency: 'monthly',
              auto_rotation: true,
              max_age: 30,
              grace_period: 24,
              approval_required: false,
              dependencies: ['admin-api', 'webhook-service'],
              last_rotation: null,
              next_rotation: null,
              status: 'configured'
            },
            {
              id: 'firebase-private-key',
              name: 'Firebase Private Key',
              type: 'certificate',
              frequency: 'quarterly',
              auto_rotation: false,
              max_age: 90,
              grace_period: 48,
              approval_required: true,
              dependencies: ['firebase-auth', 'admin-sdk'],
              last_rotation: null,
              next_rotation: null,
              status: 'configured'
            },
            {
              id: 'webhook-signing-secret',
              name: 'Webhook Signing Secret',
              type: 'webhook_secret',
              frequency: 'monthly',
              auto_rotation: true,
              max_age: 30,
              grace_period: 12,
              approval_required: false,
              dependencies: ['webhook-endpoints', 'external-integrations'],
              last_rotation: null,
              next_rotation: null,
              status: 'configured'
            }
          ],
          total_count: 3,
          message: 'Enhanced secrets configurations retrieved'
        });

      case 'recent_executions':
        // Return mock data for now since we don't have execution storage yet
        return NextResponse.json({
          success: true,
          executions: [],
          total_count: 0,
          message: 'Recent rotation executions retrieved (enhanced engine)'
        });

      default:
        return NextResponse.json(
          { error: `Unknown view: ${view}. Available: dashboard, secrets, jobs, audit, health, enhanced_health, configurations, recent_executions` },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Secrets rotation GET API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}