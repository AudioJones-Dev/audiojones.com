#!/usr/bin/env tsx
/**
 * Predictive Scheduler Standalone Runner
 * 
 * Node-safe standalone script for running predictive capacity scans.
 * Designed for cron jobs, GitHub Actions, or external schedulers.
 * 
 * Usage:
 *   npx tsx scripts/runPredictiveScheduler.ts
 *   node scripts/runPredictiveScheduler.js (if compiled)
 * 
 * Environment Variables Required:
 *   - GOOGLE_CLOUD_PROJECT
 *   - LEGACY_AUTH_PRIVATE_KEY_BASE64
 *   - LEGACY_AUTH_CLIENT_EMAIL
 *   - ADMIN_KEY (for API calls)
 */

import { runPredictiveScan } from '../src/lib/server/predictiveScheduler';

async function main() {
  const startTime = new Date();
  console.log(`🔮 Predictive Scheduler Started: ${startTime.toISOString()}`);
  console.log(`📅 Scheduled run every 6 hours`);
  
  try {
    // Validate required environment variables
    const requiredEnvVars = [
      'GOOGLE_CLOUD_PROJECT',
      'LEGACY_AUTH_PRIVATE_KEY_BASE64',
      'LEGACY_AUTH_CLIENT_EMAIL'
    ];
    
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
    
    console.log(`🔧 Environment validated - cloud project: ${process.env.GOOGLE_CLOUD_PROJECT}`);
    
    // Run the predictive scan
    const result = await runPredictiveScan();
    
    // Log results with timestamp
    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();
    
    if (result.ok) {
      console.log(`✅ Predictive scan completed successfully in ${duration}ms`);
      console.log(`📊 Scan Results:`, {
        alerts_created: result.alertsCreated,
        alerts_skipped: result.existing_alerts_skipped,
        snapshots_analyzed: result.snapshots_analyzed,
        current_utilization: `${result.forecastSummary.current_utilization}%`,
        projected_utilization: `${result.forecastSummary.projected_3day_utilization}%`,
        risk_level: result.forecastSummary.risk_level,
        trend: `${result.forecastSummary.trend_hours_per_day} hrs/day`,
        confidence: result.forecastSummary.confidence_score
      });
      
      // Exit with success
      process.exit(0);
    } else {
      console.error(`❌ Predictive scan failed: ${result.error}`);
      console.error(`📊 Partial Results:`, {
        snapshots_analyzed: result.snapshots_analyzed,
        scan_timestamp: result.scan_timestamp
      });
      
      // Exit with error
      process.exit(1);
    }
    
  } catch (error) {
    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();
    
    console.error(`❌ Predictive scheduler failed after ${duration}ms:`, error);
    
    if (error instanceof Error) {
      console.error(`Error details: ${error.message}`);
      console.error(`Stack trace:`, error.stack);
    }
    
    // Exit with error
    process.exit(1);
  }
}

// Handle process signals gracefully
process.on('SIGINT', () => {
  console.log('🛑 Predictive scheduler interrupted (SIGINT)');
  process.exit(130);
});

process.on('SIGTERM', () => {
  console.log('🛑 Predictive scheduler terminated (SIGTERM)');
  process.exit(143);
});

// Handle unhandled errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Promise Rejection:', reason);
  console.error('Promise:', promise);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Run the main function
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Main function failed:', error);
    process.exit(1);
  });
}

export { main as runPredictiveSchedulerScript };
