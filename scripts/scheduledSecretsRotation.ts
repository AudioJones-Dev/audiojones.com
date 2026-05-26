#!/usr/bin/env tsx

/**
 * Scheduled Secrets Rotation Script
 * Automatically rotates secrets based on schedule and monitors system health
 */

import { secretsRotationEngine } from '../src/lib/secrets/SecretsRotationEngine';
import { getDb } from '../src/lib/server/legacyAdmin';

interface RotationScheduleConfig {
  enabled: boolean;
  check_frequency_hours: number;
  auto_rotate_overdue: boolean;
  notification_webhook?: string;
  max_concurrent_rotations: number;
  health_check_enabled: boolean;
}

async function getScheduleConfiguration(): Promise<RotationScheduleConfig> {
  const db = getDb();
  const configDoc = await db.collection('secrets_schedule_config').doc('default').get();
  
  if (configDoc.exists) {
    return configDoc.data() as RotationScheduleConfig;
  }

  // Default configuration
  const defaultConfig: RotationScheduleConfig = {
    enabled: true,
    check_frequency_hours: 6, // Check every 6 hours
    auto_rotate_overdue: true,
    max_concurrent_rotations: 3,
    health_check_enabled: true,
  };

  // Save default config
  await configDoc.ref.set(defaultConfig);
  console.log('📝 Created default secrets rotation schedule configuration');
  
  return defaultConfig;
}

async function shouldRunScheduledCheck(): Promise<boolean> {
  const db = getDb();
  const config = await getScheduleConfiguration();

  if (!config.enabled) {
    console.log('📴 Scheduled secrets rotation is disabled');
    return false;
  }

  // Check last run time
  const lastRunDoc = await db.collection('secrets_schedule_state').doc('last_run').get();
  
  if (lastRunDoc.exists) {
    const lastRun = lastRunDoc.data()?.timestamp?.toDate();
    if (lastRun) {
      const hoursSinceLastRun = (Date.now() - lastRun.getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceLastRun < config.check_frequency_hours) {
        console.log(`⏰ Not time yet (last run: ${hoursSinceLastRun.toFixed(1)}h ago, frequency: ${config.check_frequency_hours}h)`);
        return false;
      }
    }
  }

  return true;
}

async function updateLastRunTime(): Promise<void> {
  const db = getDb();
  await db.collection('secrets_schedule_state').doc('last_run').set({
    timestamp: new Date(),
    scheduler_version: '1.0.0'
  });
}

async function checkCurrentRotationLoad(): Promise<number> {
  const metrics = await secretsRotationEngine.getMetrics();
  return metrics.pending_rotations + metrics.dual_accept_active;
}

async function sendNotification(message: string, level: 'info' | 'warning' | 'error' = 'info'): Promise<void> {
  console.log(`📢 [${level.toUpperCase()}] ${message}`);

  // Log notification to database
  const db = getDb();
  await db.collection('secrets_notifications').add({
    timestamp: new Date(),
    message,
    level,
    source: 'scheduled_rotation'
  });

  // TODO: In production, send to webhook/Slack/email
  // if (config.notification_webhook) {
  //   await fetch(config.notification_webhook, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ message, level, timestamp: new Date().toISOString() })
  //   });
  // }
}

async function performHealthCheck(): Promise<{ healthy: boolean; issues: string[] }> {
  console.log('🏥 Performing secrets system health check...');
  
  const issues: string[] = [];
  const metrics = await secretsRotationEngine.getMetrics();

  // Check compliance score
  if (metrics.compliance_score < 90) {
    issues.push(`Low compliance score: ${metrics.compliance_score}% (target: 90%+)`);
  }

  // Check for failed rotations
  if (metrics.failed_rotations_24h > 0) {
    issues.push(`${metrics.failed_rotations_24h} failed rotations in last 24h`);
  }

  // Check for overdue rotations
  if (metrics.overdue_rotations > 3) {
    issues.push(`${metrics.overdue_rotations} secrets are overdue for rotation`);
  }

  // Check average rotation time
  if (metrics.average_rotation_time_minutes > 15) {
    issues.push(`Slow rotation performance: ${metrics.average_rotation_time_minutes.toFixed(1)}min average`);
  }

  // Check for stuck rotations
  if (metrics.pending_rotations > 5) {
    issues.push(`High number of pending rotations: ${metrics.pending_rotations}`);
  }

  const healthy = issues.length === 0;

  if (healthy) {
    console.log('✅ Secrets system health check passed');
  } else {
    console.log(`⚠️ Secrets system health check found ${issues.length} issues:`);
    issues.forEach(issue => console.log(`   - ${issue}`));
  }

  return { healthy, issues };
}

async function runScheduledRotations(): Promise<{
  checked: number;
  rotated: number;
  skipped: number;
  failed: number;
  results: Array<{ secret: string; success: boolean; error?: string; job_id?: string }>;
}> {
  console.log('🔄 Running scheduled secrets rotations...');

  const config = await getScheduleConfiguration();
  const currentLoad = await checkCurrentRotationLoad();

  if (currentLoad >= config.max_concurrent_rotations) {
    console.log(`⏸️ Skipping rotations - too many active (${currentLoad}/${config.max_concurrent_rotations})`);
    return { checked: 0, rotated: 0, skipped: 0, failed: 0, results: [] };
  }

  // Get overdue secrets
  const overdueSecrets = await secretsRotationEngine.checkRotationSchedule();
  const availableSlots = config.max_concurrent_rotations - currentLoad;
  const secretsToRotate = overdueSecrets.slice(0, availableSlots);

  console.log(`📋 Found ${overdueSecrets.length} overdue secrets, rotating ${secretsToRotate.length} (slots available: ${availableSlots})`);

  const results = [];
  let rotated = 0;
  let failed = 0;

  for (const secretName of secretsToRotate) {
    try {
      console.log(`🔑 Starting rotation for: ${secretName}`);
      
      const rotationJob = await secretsRotationEngine.rotateSecret(
        secretName,
        'scheduled-rotation',
        false
      );

      results.push({
        secret: secretName,
        success: true,
        job_id: rotationJob.id
      });

      rotated++;
      console.log(`✅ Rotation started for ${secretName} (job: ${rotationJob.id})`);

      // Small delay between rotations to avoid overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      results.push({
        secret: secretName,
        success: false,
        error: errorMessage
      });

      failed++;
      console.log(`❌ Failed to rotate ${secretName}: ${errorMessage}`);
    }
  }

  return {
    checked: overdueSecrets.length,
    rotated,
    skipped: overdueSecrets.length - secretsToRotate.length,
    failed,
    results
  };
}

async function generateSchedulerReport(): Promise<void> {
  console.log('📊 Generating scheduler health report...');

  const metrics = await secretsRotationEngine.getMetrics();
  const healthCheck = await performHealthCheck();
  const db = getDb();

  // Get recent scheduler activity
  const recentRunsQuery = await db
    .collection('secrets_schedule_state')
    .orderBy('timestamp', 'desc')
    .limit(5)
    .get();

  const recentRuns = recentRunsQuery.docs.map(doc => doc.data());

  const report = {
    timestamp: new Date().toISOString(),
    system_health: {
      healthy: healthCheck.healthy,
      issues: healthCheck.issues,
      compliance_score: metrics.compliance_score,
      overdue_count: metrics.overdue_rotations
    },
    current_metrics: {
      total_secrets: metrics.total_secrets,
      pending_rotations: metrics.pending_rotations,
      dual_accept_active: metrics.dual_accept_active,
      failed_24h: metrics.failed_rotations_24h,
      avg_rotation_time: metrics.average_rotation_time_minutes
    },
    recent_activity: recentRuns.slice(0, 3),
    recommendations: [] as string[]
  };

  // Add recommendations
  if (metrics.overdue_rotations > 0) {
    report.recommendations.push(`Consider increasing rotation frequency or investigating ${metrics.overdue_rotations} overdue secrets`);
  }
  if (metrics.failed_rotations_24h > 2) {
    report.recommendations.push(`Investigate recurring rotation failures (${metrics.failed_rotations_24h} in 24h)`);
  }
  if (metrics.average_rotation_time_minutes > 10) {
    report.recommendations.push(`Optimize rotation performance (current avg: ${metrics.average_rotation_time_minutes.toFixed(1)}min)`);
  }
  if (!healthCheck.healthy) {
    report.recommendations.push('Address health check issues before next rotation cycle');
  }

  // Save report
  await db.collection('secrets_scheduler_reports').add(report);

  console.log('📋 Scheduler Health Report:');
  console.log(`   Status: ${healthCheck.healthy ? '✅ Healthy' : '⚠️ Issues Found'}`);
  console.log(`   Compliance: ${metrics.compliance_score}%`);
  console.log(`   Overdue: ${metrics.overdue_rotations} secrets`);
  console.log(`   Active: ${metrics.pending_rotations} rotations`);
  console.log(`   Failed (24h): ${metrics.failed_rotations_24h}`);
  
  if (report.recommendations.length > 0) {
    console.log('\n🔧 Recommendations:');
    report.recommendations.forEach(rec => console.log(`   - ${rec}`));
  }
}

async function main() {
  console.log('🔐 Secrets Rotation Scheduler Starting...\n');

  try {
    const config = await getScheduleConfiguration();
    console.log(`⚙️ Configuration loaded: ${JSON.stringify(config, null, 2)}`);

    // Check if we should run
    const shouldRun = await shouldRunScheduledCheck();
    
    if (!shouldRun) {
      console.log('⏭️ Skipping scheduled check - not time yet or disabled');
      return;
    }

    // Update last run time
    await updateLastRunTime();

    // Perform health check if enabled
    if (config.health_check_enabled) {
      const healthCheck = await performHealthCheck();
      
      if (!healthCheck.healthy) {
        await sendNotification(
          `Secrets system health check failed: ${healthCheck.issues.join(', ')}`,
          'warning'
        );
      }
    }

    // Run rotations if auto-rotate is enabled
    if (config.auto_rotate_overdue) {
      const rotationResults = await runScheduledRotations();
      
      console.log(`\n📈 Rotation Results:`);
      console.log(`   Checked: ${rotationResults.checked} secrets`);
      console.log(`   Rotated: ${rotationResults.rotated} secrets`);
      console.log(`   Skipped: ${rotationResults.skipped} secrets`);
      console.log(`   Failed: ${rotationResults.failed} secrets`);

      // Send notifications for important events
      if (rotationResults.rotated > 0) {
        await sendNotification(
          `Scheduled rotation completed: ${rotationResults.rotated} secrets rotated`,
          'info'
        );
      }

      if (rotationResults.failed > 0) {
        await sendNotification(
          `Scheduled rotation failures: ${rotationResults.failed} secrets failed to rotate`,
          'error'
        );
      }
    } else {
      console.log('📋 Auto-rotation disabled - only checking schedule');
      const overdueSecrets = await secretsRotationEngine.checkRotationSchedule();
      
      if (overdueSecrets.length > 0) {
        await sendNotification(
          `${overdueSecrets.length} secrets are overdue for rotation but auto-rotation is disabled`,
          'warning'
        );
      }
    }

    // Generate report
    await generateSchedulerReport();

    console.log('\n✅ Secrets rotation scheduler completed successfully');

  } catch (error) {
    console.error('❌ Secrets rotation scheduler failed:', error);
    
    await sendNotification(
      `Scheduler error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'error'
    );

    process.exit(1);
  }
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--force')) {
    console.log('🔧 Force mode: Running scheduler regardless of timing');
    // Override timing check for force mode
    const originalShouldRun = shouldRunScheduledCheck;
    (global as any).shouldRunScheduledCheck = async () => true;
  }
  
  if (args.includes('--health-only')) {
    console.log('🏥 Health check mode: Only performing health check');
    performHealthCheck()
      .then(async (result) => {
        await generateSchedulerReport();
        console.log(result.healthy ? '✅ Health check passed' : '⚠️ Health check failed');
        process.exit(result.healthy ? 0 : 1);
      })
      .catch(error => {
        console.error('❌ Health check failed:', error);
        process.exit(1);
      });
  } else {
    main().catch(console.error);
  }
}

export default main;