#!/usr/bin/env tsx

/**
 * Scheduled Backup Automation Script
 * Runs automated backups based on configuration and scheduling
 */

import { backupDREngine } from '../src/lib/backup/BackupDREngine';
import { getDb } from '../src/lib/server/legacyAdmin';

interface ScheduledBackupConfig {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  hour: number; // 0-23
  day_of_week?: number; // 0-6 for weekly (0 = Sunday)
  day_of_month?: number; // 1-31 for monthly
  collections?: string[];
  retention_days: number;
}

async function shouldRunBackup(config: ScheduledBackupConfig): Promise<boolean> {
  if (!config.enabled) {
    console.log('📴 Scheduled backups are disabled');
    return false;
  }

  const now = new Date();
  const currentHour = now.getHours();

  // Check if it's the right hour
  if (currentHour !== config.hour) {
    console.log(`⏰ Not backup time (current: ${currentHour}, scheduled: ${config.hour})`);
    return false;
  }

  // Get last backup to avoid duplicates
  const db = getDb();
  const lastBackupSnapshot = await db
    .collection('backup_jobs')
    .where('metadata.trigger', '==', 'scheduled')
    .orderBy('started_at', 'desc')
    .limit(1)
    .get();

  const lastBackup = lastBackupSnapshot.docs[0]?.data();
  
  if (lastBackup) {
    const lastBackupDate = lastBackup.started_at.toDate();
    const hoursSinceLastBackup = (now.getTime() - lastBackupDate.getTime()) / (1000 * 60 * 60);
    
    // Prevent running multiple backups within the same day
    if (hoursSinceLastBackup < 23) {
      console.log(`🚫 Backup already ran today (${hoursSinceLastBackup.toFixed(1)}h ago)`);
      return false;
    }
  }

  // Check frequency-specific conditions
  switch (config.frequency) {
    case 'daily':
      return true;
      
    case 'weekly':
      const dayOfWeek = now.getDay();
      if (dayOfWeek !== (config.day_of_week || 0)) {
        console.log(`📅 Not weekly backup day (current: ${dayOfWeek}, scheduled: ${config.day_of_week || 0})`);
        return false;
      }
      return true;
      
    case 'monthly':
      const dayOfMonth = now.getDate();
      if (dayOfMonth !== (config.day_of_month || 1)) {
        console.log(`📅 Not monthly backup day (current: ${dayOfMonth}, scheduled: ${config.day_of_month || 1})`);
        return false;
      }
      return true;
      
    default:
      return false;
  }
}

async function getBackupConfiguration(): Promise<ScheduledBackupConfig> {
  const db = getDb();
  const configDoc = await db.collection('backup_config').doc('scheduled').get();
  
  if (configDoc.exists) {
    return configDoc.data() as ScheduledBackupConfig;
  }

  // Default configuration
  const defaultConfig: ScheduledBackupConfig = {
    enabled: true,
    frequency: 'daily',
    hour: 2, // 2 AM
    retention_days: 30,
  };

  // Save default config
  await configDoc.ref.set(defaultConfig);
  console.log('📝 Created default scheduled backup configuration');
  
  return defaultConfig;
}

async function runScheduledBackup(config: ScheduledBackupConfig): Promise<void> {
  console.log('🔄 Running scheduled backup...');
  console.log(`   Frequency: ${config.frequency}`);
  console.log(`   Hour: ${config.hour}:00`);
  console.log(`   Collections: ${config.collections ? config.collections.join(', ') : 'All'}`);
  console.log(`   Retention: ${config.retention_days} days`);

  try {
    const backupJob = await backupDREngine.createBackup(
      'scheduled',
      'system-scheduler',
      config.collections
    );

    console.log(`✅ Scheduled backup completed: ${backupJob.id}`);
    console.log(`   Status: ${backupJob.status}`);
    console.log(`   Export path: ${backupJob.export_path}`);
    
    if (backupJob.backup_size_bytes) {
      console.log(`   Size: ${Math.round(backupJob.backup_size_bytes / 1024 / 1024 * 100) / 100} MB`);
    }
    if (backupJob.collection_count) {
      console.log(`   Collections: ${backupJob.collection_count}`);
    }
    if (backupJob.document_count) {
      console.log(`   Documents: ${backupJob.document_count.toLocaleString()}`);
    }

    // Log successful backup
    const db = getDb();
    await db.collection('backup_logs').add({
      type: 'scheduled_backup_success',
      backup_id: backupJob.id,
      timestamp: new Date(),
      config: config,
      metrics: {
        size_bytes: backupJob.backup_size_bytes,
        collection_count: backupJob.collection_count,
        document_count: backupJob.document_count,
      }
    });

  } catch (error) {
    console.error('❌ Scheduled backup failed:', error);

    // Log backup failure
    const db = getDb();
    await db.collection('backup_logs').add({
      type: 'scheduled_backup_failure',
      timestamp: new Date(),
      config: config,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    throw error;
  }
}

async function runScheduledCleanup(retentionDays: number): Promise<void> {
  console.log(`🧹 Running scheduled cleanup (retention: ${retentionDays} days)...`);

  try {
    const cleanupResult = await backupDREngine.cleanupOldBackups();
    
    console.log(`✅ Cleanup completed:`);
    console.log(`   Deleted: ${cleanupResult.deleted} backups`);
    console.log(`   Errors: ${cleanupResult.errors} errors`);

    // Log cleanup results
    const db = getDb();
    await db.collection('backup_logs').add({
      type: 'scheduled_cleanup',
      timestamp: new Date(),
      result: cleanupResult,
    });

  } catch (error) {
    console.error('❌ Scheduled cleanup failed:', error);
    
    // Log cleanup failure
    const db = getDb();
    await db.collection('backup_logs').add({
      type: 'scheduled_cleanup_failure',
      timestamp: new Date(),
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

async function generateBackupReport(): Promise<void> {
  console.log('📊 Generating backup health report...');

  const metrics = await backupDREngine.getBackupMetrics();
  const db = getDb();

  // Get recent backup logs
  const logsSnapshot = await db
    .collection('backup_logs')
    .orderBy('timestamp', 'desc')
    .limit(10)
    .get();

  const recentLogs = logsSnapshot.docs.map(doc => doc.data());

  // Calculate health score
  const successRate = metrics.total_backups > 0 
    ? (metrics.successful_backups / metrics.total_backups) * 100 
    : 100;

  const isHealthy = successRate >= 95 && metrics.retention_compliance >= 90;

  const report = {
    timestamp: new Date().toISOString(),
    healthy: isHealthy,
    metrics: {
      total_backups: metrics.total_backups,
      success_rate: Math.round(successRate * 100) / 100,
      last_backup: metrics.last_backup_date,
      average_size_mb: Math.round(metrics.average_backup_size / 1024 / 1024 * 100) / 100,
      retention_compliance: Math.round(metrics.retention_compliance * 100) / 100,
    },
    recent_activity: recentLogs.slice(0, 5),
    recommendations: []
  };

  // Add recommendations based on health
  if (successRate < 95) {
    report.recommendations.push('⚠️ Backup success rate is below 95% - investigate failures');
  }
  if (metrics.retention_compliance < 90) {
    report.recommendations.push('⚠️ Retention compliance is low - check cleanup process');
  }
  if (!metrics.last_backup_date) {
    report.recommendations.push('🚨 No recent backups found - system may not be working');
  } else {
    const daysSinceLastBackup = (Date.now() - new Date(metrics.last_backup_date).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceLastBackup > 2) {
      report.recommendations.push(`🚨 Last backup was ${Math.round(daysSinceLastBackup)} days ago`);
    }
  }

  // Save report
  await db.collection('backup_reports').add(report);

  console.log('📋 Backup Health Report:');
  console.log(`   Status: ${isHealthy ? '✅ Healthy' : '⚠️ Needs Attention'}`);
  console.log(`   Success Rate: ${report.metrics.success_rate}%`);
  console.log(`   Total Backups: ${report.metrics.total_backups}`);
  console.log(`   Last Backup: ${report.metrics.last_backup || 'Never'}`);
  console.log(`   Average Size: ${report.metrics.average_size_mb} MB`);
  console.log(`   Retention Compliance: ${report.metrics.retention_compliance}%`);
  
  if (report.recommendations.length > 0) {
    console.log('\n🔧 Recommendations:');
    report.recommendations.forEach(rec => console.log(`   ${rec}`));
  }
}

async function main() {
  console.log('🕐 Backup Scheduler Starting...\n');

  try {
    // Get backup configuration
    const config = await getBackupConfiguration();
    
    // Check if backup should run
    const shouldRun = await shouldRunBackup(config);
    
    if (shouldRun) {
      // Run backup
      await runScheduledBackup(config);
      
      // Run cleanup (only if backup succeeded)
      await runScheduledCleanup(config.retention_days);
    } else {
      console.log('⏭️  Skipping backup - not scheduled time or already completed');
    }

    // Always generate health report
    await generateBackupReport();

    console.log('\n✅ Backup scheduler completed successfully');

  } catch (error) {
    console.error('❌ Backup scheduler failed:', error);
    process.exit(1);
  }
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--force')) {
    console.log('🔧 Force mode: Running backup regardless of schedule');
    // Override shouldRunBackup for force mode
    backupDREngine.createBackup('manual', 'cli-force')
      .then(job => {
        console.log(`✅ Force backup completed: ${job.id}`);
        process.exit(0);
      })
      .catch(error => {
        console.error('❌ Force backup failed:', error);
        process.exit(1);
      });
  } else if (args.includes('--report')) {
    console.log('📊 Generating backup report only');
    generateBackupReport()
      .then(() => {
        console.log('✅ Report generated');
        process.exit(0);
      })
      .catch(error => {
        console.error('❌ Report generation failed:', error);
        process.exit(1);
      });
  } else {
    main().catch(console.error);
  }
}

export default main;