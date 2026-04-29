/**
 * Backup & Disaster Recovery Admin API
 * Manage automated backups, restore operations, and disaster recovery procedures
 * 
 * POST /api/admin/backup - Execute backup/restore operations
 * GET /api/admin/backup - View backup status and metrics
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/server/requireAdmin';
import { backupDREngine } from '@/lib/backup/BackupDREngine';
import { getDb } from '@/lib/server/firebaseAdmin';
import { BackupEngine } from '@/lib/server/backup/backupEngine';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);

    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'initialize':
        return await initializeBackupSystem();
      case 'create_backup':
        return await createBackup(data);
      case 'restore_to_staging':
        return await restoreToStaging(data);
      case 'disaster_recovery':
        return await executeDisasterRecovery(data);
      case 'cleanup_old':
        return await cleanupOldBackups();
      case 'validate_backup':
        return await validateBackup(data);
      // New Enhanced Backup Engine Actions
      case 'execute_backup':
        return await executeEnhancedBackup(data);
      case 'execute_all_backups':
        return await executeAllBackups();
      case 'create_configuration':
        return await createBackupConfiguration(data);
      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: initialize, create_backup, restore_to_staging, disaster_recovery, cleanup_old, validate_backup, execute_backup, execute_all_backups, create_configuration' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('Backup API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message?.includes('Admin') ? 403 : 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);

    const { searchParams } = new URL(request.url);
    const view = searchParams.get('view') || 'dashboard';

    switch (view) {
      case 'dashboard':
        return await getBackupDashboard();
      case 'jobs':
        return await getBackupJobs(searchParams);
      case 'restores':
        return await getRestoreJobs(searchParams);
      case 'metrics':
        return await getBackupMetrics();
      case 'config':
        return await getBackupConfig();
      case 'enhanced_health':
        return await getEnhancedBackupHealth();
      default:
        return NextResponse.json(
          { error: 'Invalid view. Use: dashboard, jobs, restores, metrics, config, enhanced_health' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('Backup API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: error.message?.includes('Admin') ? 403 : 500 }
    );
  }
}

async function initializeBackupSystem() {
  console.log('🔧 Initializing backup system...');
  
  await backupDREngine.initializeBackupSystem();
  
  return NextResponse.json({
    success: true,
    message: 'Backup & DR system initialized successfully',
    timestamp: new Date().toISOString()
  });
}

async function createBackup(data: any) {
  const {
    trigger = 'manual',
    triggered_by = 'admin',
    collection_ids
  } = data;

  console.log('📤 Creating backup...', { trigger, triggered_by, collection_ids });
  
  const job = await backupDREngine.createBackup(
    trigger,
    triggered_by,
    collection_ids
  );
  
  return NextResponse.json({
    success: true,
    message: 'Backup job created successfully',
    job: {
      id: job.id,
      status: job.status,
      started_at: job.started_at,
      export_path: job.export_path,
      metadata: job.metadata
    }
  });
}

async function restoreToStaging(data: any) {
  const { backup_id, triggered_by = 'admin', collections } = data;

  if (!backup_id) {
    return NextResponse.json(
      { error: 'backup_id is required' },
      { status: 400 }
    );
  }

  console.log('🔄 Restoring to staging...', { backup_id, collections });
  
  const restoreJob = await backupDREngine.restoreToStaging(
    backup_id,
    triggered_by,
    collections
  );
  
  return NextResponse.json({
    success: true,
    message: 'Staging restore job created successfully',
    job: {
      id: restoreJob.id,
      backup_id: restoreJob.backup_id,
      status: restoreJob.status,
      target_environment: restoreJob.target_environment,
      started_at: restoreJob.started_at,
      metadata: restoreJob.metadata
    }
  });
}

async function executeDisasterRecovery(data: any) {
  const { backup_id, triggered_by = 'admin' } = data;

  if (!backup_id) {
    return NextResponse.json(
      { error: 'backup_id is required' },
      { status: 400 }
    );
  }

  console.log('🚨 Executing disaster recovery...', { backup_id, triggered_by });
  
  const restoreJob = await backupDREngine.executeDisasterRecovery(
    backup_id,
    triggered_by
  );
  
  return NextResponse.json({
    success: true,
    message: 'Disaster recovery initiated - staging restore completed',
    warning: 'Manual intervention required for production restore',
    job: {
      id: restoreJob.id,
      backup_id: restoreJob.backup_id,
      status: restoreJob.status,
      started_at: restoreJob.started_at,
      completed_at: restoreJob.completed_at,
      restored_collections: restoreJob.restored_collections,
      restored_documents: restoreJob.restored_documents
    }
  });
}

async function cleanupOldBackups() {
  console.log('🧹 Cleaning up old backups...');
  
  const result = await backupDREngine.cleanupOldBackups();
  
  return NextResponse.json({
    success: true,
    message: 'Backup cleanup completed',
    result: {
      deleted: result.deleted,
      errors: result.errors,
      timestamp: new Date().toISOString()
    }
  });
}

async function validateBackup(data: any) {
  const { backup_id } = data;

  if (!backup_id) {
    return NextResponse.json(
      { error: 'backup_id is required' },
      { status: 400 }
    );
  }

  // Get backup details
  const db = getDb();
  const backupDoc = await db.collection('backup_jobs').doc(backup_id).get();
  
  if (!backupDoc.exists) {
    return NextResponse.json(
      { error: 'Backup not found' },
      { status: 404 }
    );
  }

  const backup = backupDoc.data();
  
  return NextResponse.json({
    success: true,
    backup: {
      id: backup_id,
      status: backup?.status,
      started_at: backup?.started_at?.toDate?.()?.toISOString(),
      completed_at: backup?.completed_at?.toDate?.()?.toISOString(),
      export_path: backup?.export_path,
      backup_size_bytes: backup?.backup_size_bytes,
      collection_count: backup?.collection_count,
      document_count: backup?.document_count,
      metadata: backup?.metadata
    }
  });
}

async function getBackupDashboard() {
  const metrics = await backupDREngine.getBackupMetrics();
  
  // Get recent backup jobs
  const db = getDb();
  const recentBackupsSnapshot = await db
    .collection('backup_jobs')
    .orderBy('started_at', 'desc')
    .limit(10)
    .get();

  const recent_backups = recentBackupsSnapshot.docs.map((doc: any) => ({
    id: doc.id,
    ...doc.data(),
    started_at: doc.data().started_at?.toDate?.()?.toISOString(),
    completed_at: doc.data().completed_at?.toDate?.()?.toISOString(),
  }));

  // Get recent restore jobs
  const recentRestoresSnapshot = await db
    .collection('restore_jobs')
    .orderBy('started_at', 'desc')
    .limit(5)
    .get();

  const recent_restores = recentRestoresSnapshot.docs.map((doc: any) => ({
    id: doc.id,
    ...doc.data(),
    started_at: doc.data().started_at?.toDate?.()?.toISOString(),
    completed_at: doc.data().completed_at?.toDate?.()?.toISOString(),
  }));

  return NextResponse.json({
    success: true,
    dashboard: {
      metrics: {
        ...metrics,
        last_backup_date: metrics.last_backup_date?.toISOString(),
      },
      recent_backups,
      recent_restores,
      system_status: {
        backup_enabled: true,
        next_scheduled_backup: getNextScheduledBackup(),
        gcs_bucket_status: 'healthy',
        retention_days: 30,
      }
    }
  });
}

async function getBackupJobs(searchParams: URLSearchParams) {
  const db = getDb();
  const limit = parseInt(searchParams.get('limit') || '50');
  const status = searchParams.get('status');

  let query = db.collection('backup_jobs').orderBy('started_at', 'desc');
  
  if (status) {
    query = query.where('status', '==', status);
  }

  const snapshot = await query.limit(limit).get();
  
  const jobs = snapshot.docs.map((doc: any) => ({
    id: doc.id,
    ...doc.data(),
    started_at: doc.data().started_at?.toDate?.()?.toISOString(),
    completed_at: doc.data().completed_at?.toDate?.()?.toISOString(),
  }));

  return NextResponse.json({
    success: true,
    jobs,
    total: snapshot.size
  });
}

async function getRestoreJobs(searchParams: URLSearchParams) {
  const db = getDb();
  const limit = parseInt(searchParams.get('limit') || '20');
  const environment = searchParams.get('environment');

  let query = db.collection('restore_jobs').orderBy('started_at', 'desc');
  
  if (environment) {
    query = query.where('target_environment', '==', environment);
  }

  const snapshot = await query.limit(limit).get();
  
  const jobs = snapshot.docs.map((doc: any) => ({
    id: doc.id,
    ...doc.data(),
    started_at: doc.data().started_at?.toDate?.()?.toISOString(),
    completed_at: doc.data().completed_at?.toDate?.()?.toISOString(),
  }));

  return NextResponse.json({
    success: true,
    jobs,
    total: snapshot.size
  });
}

async function getBackupMetrics() {
  const metrics = await backupDREngine.getBackupMetrics();
  
  return NextResponse.json({
    success: true,
    metrics: {
      ...metrics,
      last_backup_date: metrics.last_backup_date?.toISOString(),
      average_backup_size_mb: Math.round(metrics.average_backup_size / 1024 / 1024 * 100) / 100,
    }
  });
}

async function getBackupConfig() {
  const db = getDb();
  const configDoc = await db.collection('backup_config').doc('default').get();
  
  const config = configDoc.exists ? configDoc.data() : null;
  
  return NextResponse.json({
    success: true,
    config: config ? {
      ...config,
      created_at: config.created_at?.toDate?.()?.toISOString(),
      updated_at: config.updated_at?.toDate?.()?.toISOString(),
    } : null
  });
}

// Helper function to calculate next scheduled backup
function getNextScheduledBackup(): string {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(2, 0, 0, 0); // 2 AM daily backup
  
  return tomorrow.toISOString();
}

// Enhanced Backup Engine Functions
async function executeEnhancedBackup(data: any) {
  const { configuration_id } = data;
  if (!configuration_id) {
    return NextResponse.json(
      { error: 'Configuration ID required' },
      { status: 400 }
    );
  }

  const backupEngine = BackupEngine.getInstance();
  const execution = await backupEngine.executeBackup(configuration_id);
  
  return NextResponse.json({
    success: true,
    data: {
      execution_id: execution.id,
      status: execution.status,
      started_at: execution.started_at,
      configuration_id: execution.configuration_id
    },
    message: 'Enhanced backup execution initiated'
  });
}

async function executeAllBackups() {
  const backupEngine = BackupEngine.getInstance();
  const executions = await backupEngine.runAllBackups();
  
  return NextResponse.json({
    success: true,
    data: {
      executions_started: executions.length,
      executions: executions.map(e => ({
        execution_id: e.id,
        configuration_id: e.configuration_id,
        status: e.status
      }))
    },
    message: `Started ${executions.length} enhanced backup executions`
  });
}

async function createBackupConfiguration(data: any) {
  const { configuration } = data;
  if (!configuration) {
    return NextResponse.json(
      { error: 'Configuration data required' },
      { status: 400 }
    );
  }

  const backupEngine = BackupEngine.getInstance();
  const createdConfig = await backupEngine.createBackupConfiguration({
    ...configuration,
    created_by: 'admin'
  });
  
  return NextResponse.json({
    success: true,
    data: {
      configuration_id: createdConfig.id,
      name: createdConfig.name
    },
    message: 'Enhanced backup configuration created successfully'
  });
}

async function getEnhancedBackupHealth() {
  const backupEngine = BackupEngine.getInstance();
  const health = await backupEngine.getBackupHealth();
  
  return NextResponse.json({
    success: true,
    data: health,
    generated_at: new Date().toISOString()
  });
}