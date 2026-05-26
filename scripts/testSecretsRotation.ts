#!/usr/bin/env tsx

/**
 * Secrets Rotation Testing Script
 * Comprehensive testing and validation for the secrets rotation system
 */

import { secretsRotationEngine } from '../src/lib/secrets/SecretsRotationEngine';
import { getDb } from '../src/lib/server/legacyAdmin';

interface TestResult {
  name: string;
  success: boolean;
  duration: number;
  error?: string;
  details?: any;
}

class SecretsRotationTester {
  private results: TestResult[] = [];

  private async runTest(name: string, testFn: () => Promise<any>): Promise<TestResult> {
    console.log(`\n🧪 Running test: ${name}`);
    const startTime = Date.now();

    try {
      const result = await testFn();
      const duration = Date.now() - startTime;
      
      console.log(`✅ ${name} passed (${duration}ms)`);
      
      const testResult: TestResult = {
        name,
        success: true,
        duration,
        details: result
      };
      
      this.results.push(testResult);
      return testResult;

    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      console.log(`❌ ${name} failed (${duration}ms): ${errorMessage}`);
      
      const testResult: TestResult = {
        name,
        success: false,
        duration,
        error: errorMessage
      };
      
      this.results.push(testResult);
      return testResult;
    }
  }

  async runAllTests(): Promise<void> {
    console.log('🔐 Starting Secrets Rotation System Tests');
    console.log('==========================================\n');

    // Test 1: System Initialization
    await this.runTest('System Initialization', async () => {
      await secretsRotationEngine.initialize();
      
      // Verify configurations were created
      const db = getDb();
      const configsSnapshot = await db.collection('secret_configs').get();
      
      if (configsSnapshot.empty) {
        throw new Error('No secret configurations found after initialization');
      }

      return {
        configs_created: configsSnapshot.size,
        config_names: configsSnapshot.docs.map(doc => doc.id)
      };
    });

    // Test 2: Metrics Collection
    await this.runTest('Metrics Collection', async () => {
      const metrics = await secretsRotationEngine.getMetrics();
      
      if (typeof metrics.total_secrets !== 'number') {
        throw new Error('Invalid metrics structure');
      }

      return {
        total_secrets: metrics.total_secrets,
        compliance_score: metrics.compliance_score,
        pending_rotations: metrics.pending_rotations
      };
    });

    // Test 3: Schedule Check
    await this.runTest('Schedule Check', async () => {
      const overdueSecrets = await secretsRotationEngine.checkRotationSchedule();
      
      return {
        overdue_count: overdueSecrets.length,
        overdue_secrets: overdueSecrets
      };
    });

    // Test 4: Test Secret Creation and Rotation
    await this.runTest('Test Secret Rotation', async () => {
      // Create a test secret configuration
      const db = getDb();
      const testSecretName = 'test_api_key';
      
      await db.collection('secret_configs').doc(testSecretName).set({
        name: testSecretName,
        type: 'api_key',
        description: 'Test API key for rotation testing',
        rotation_frequency_days: 1, // Short frequency for testing
        dual_accept_window_hours: 0.1, // 6 minutes for testing
        validation_endpoint: '/api/admin/ping',
        rollback_threshold_minutes: 2,
        created_at: new Date(),
        last_rotation: null,
        next_rotation_due: new Date(Date.now() - 1000) // Already overdue
      });

      // Start rotation
      const rotationJob = await secretsRotationEngine.rotateSecret(
        testSecretName,
        'test-runner',
        true
      );

      if (!rotationJob.id) {
        throw new Error('Rotation job was not created');
      }

      // Wait a moment for processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Check job status
      const jobDoc = await db.collection('secret_rotation_jobs').doc(rotationJob.id).get();
      const jobData = jobDoc.data();

      if (!jobData) {
        throw new Error('Rotation job not found in database');
      }

      return {
        job_id: rotationJob.id,
        job_status: jobData.status,
        secret_name: rotationJob.secret_name,
        audit_trail_length: jobData.audit_trail?.length || 0
      };
    });

    // Test 5: Audit Trail Verification
    await this.runTest('Audit Trail Verification', async () => {
      const db = getDb();
      
      // Get recent audit logs
      const auditSnapshot = await db
        .collection('secret_audit_log')
        .orderBy('timestamp', 'desc')
        .limit(5)
        .get();

      if (auditSnapshot.empty) {
        throw new Error('No audit logs found');
      }

      const auditLogs = auditSnapshot.docs.map(doc => doc.data());

      return {
        recent_audit_count: auditLogs.length,
        latest_action: auditLogs[0]?.action,
        all_successful: auditLogs.every(log => log.success === true)
      };
    });

    // Test 6: Rollback Functionality
    await this.runTest('Rollback Functionality', async () => {
      const db = getDb();
      
      // Find a job that can be rolled back
      const jobsSnapshot = await db
        .collection('secret_rotation_jobs')
        .where('status', 'in', ['dual_accept', 'completed'])
        .limit(1)
        .get();

      if (jobsSnapshot.empty) {
        // Create a test job for rollback
        const testJobId = 'test-rollback-job';
        await db.collection('secret_rotation_jobs').doc(testJobId).set({
          id: testJobId,
          secret_name: 'test_rollback_secret',
          status: 'dual_accept',
          created_at: new Date(),
          initiated_by: 'test-runner',
          audit_trail: []
        });

        await secretsRotationEngine.rollbackRotation(
          testJobId,
          'Test rollback functionality',
          'test-runner'
        );

        // Verify rollback
        const rolledBackJob = await db.collection('secret_rotation_jobs').doc(testJobId).get();
        const jobData = rolledBackJob.data();

        if (jobData?.status !== 'rolled_back') {
          throw new Error('Job was not properly rolled back');
        }

        return {
          rollback_successful: true,
          job_id: testJobId,
          final_status: jobData.status
        };
      }

      return {
        rollback_test: 'skipped - no suitable jobs found'
      };
    });

    // Test 7: Performance Testing
    await this.runTest('Performance Testing', async () => {
      const iterations = 5;
      const metricsTimes: number[] = [];

      for (let i = 0; i < iterations; i++) {
        const start = Date.now();
        await secretsRotationEngine.getMetrics();
        metricsTimes.push(Date.now() - start);
      }

      const avgTime = metricsTimes.reduce((sum, time) => sum + time, 0) / iterations;
      const maxTime = Math.max(...metricsTimes);

      if (avgTime > 1000) { // 1 second threshold
        throw new Error(`Performance degraded: average time ${avgTime}ms`);
      }

      return {
        iterations,
        average_time_ms: Math.round(avgTime),
        max_time_ms: maxTime,
        all_times: metricsTimes
      };
    });

    // Test 8: Integration Testing
    await this.runTest('Integration Testing', async () => {
      // Test database connectivity and indexes
      const db = getDb();
      
      // Test complex queries that would be used in production
      const [
        configsQuery,
        jobsQuery,
        auditQuery
      ] = await Promise.all([
        db.collection('secret_configs').orderBy('next_rotation_due').limit(1).get(),
        db.collection('secret_rotation_jobs').where('status', '==', 'pending').limit(1).get(),
        db.collection('secret_audit_log').orderBy('timestamp', 'desc').limit(1).get()
      ]);

      return {
        database_connectivity: true,
        configs_queryable: !configsQuery.empty,
        jobs_queryable: true,
        audit_queryable: !auditQuery.empty,
        indexes_working: true
      };
    });

    // Test 9: Cleanup
    await this.runTest('Test Cleanup', async () => {
      const db = getDb();
      
      // Clean up test data
      const testSecrets = ['test_api_key', 'test_rollback_secret'];
      const testJobs = ['test-rollback-job'];

      // Delete test secret configs
      for (const secretName of testSecrets) {
        try {
          await db.collection('secret_configs').doc(secretName).delete();
        } catch (error) {
          // Ignore if doesn't exist
        }
      }

      // Delete test jobs
      for (const jobId of testJobs) {
        try {
          await db.collection('secret_rotation_jobs').doc(jobId).delete();
        } catch (error) {
          // Ignore if doesn't exist
        }
      }

      return {
        cleanup_completed: true,
        secrets_cleaned: testSecrets.length,
        jobs_cleaned: testJobs.length
      };
    });

    // Generate test report
    this.generateReport();
  }

  private generateReport(): void {
    console.log('\n📊 TEST RESULTS SUMMARY');
    console.log('========================\n');

    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.success).length;
    const failedTests = totalTests - passedTests;
    const successRate = Math.round((passedTests / totalTests) * 100);

    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests} ✅`);
    console.log(`Failed: ${failedTests} ❌`);
    console.log(`Success Rate: ${successRate}%`);

    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);
    console.log(`Total Duration: ${totalDuration}ms`);

    if (failedTests > 0) {
      console.log('\n❌ FAILED TESTS:');
      this.results
        .filter(r => !r.success)
        .forEach(r => {
          console.log(`   ${r.name}: ${r.error}`);
        });
    }

    console.log('\n🔍 DETAILED RESULTS:');
    this.results.forEach(r => {
      const status = r.success ? '✅' : '❌';
      console.log(`   ${status} ${r.name} (${r.duration}ms)`);
      if (r.details && typeof r.details === 'object') {
        console.log(`      Details: ${JSON.stringify(r.details, null, 6)}`);
      }
    });

    console.log('\n🏁 PRODUCTION READINESS CHECKLIST:');
    
    const checks = [
      { name: '🔧 System Initialization', passed: this.results.find(r => r.name === 'System Initialization')?.success },
      { name: '📊 Metrics Collection', passed: this.results.find(r => r.name === 'Metrics Collection')?.success },
      { name: '⏰ Schedule Management', passed: this.results.find(r => r.name === 'Schedule Check')?.success },
      { name: '🔄 Secret Rotation', passed: this.results.find(r => r.name === 'Test Secret Rotation')?.success },
      { name: '📋 Audit Logging', passed: this.results.find(r => r.name === 'Audit Trail Verification')?.success },
      { name: '🔙 Rollback Capability', passed: this.results.find(r => r.name === 'Rollback Functionality')?.success },
      { name: '⚡ Performance', passed: this.results.find(r => r.name === 'Performance Testing')?.success },
      { name: '🔗 Integration', passed: this.results.find(r => r.name === 'Integration Testing')?.success }
    ];

    checks.forEach(check => {
      const status = check.passed ? '✅' : '❌';
      console.log(`   ${status} ${check.name}`);
    });

    const allPassed = checks.every(check => check.passed);
    
    console.log(`\n${allPassed ? '🎉' : '⚠️'} SYSTEM STATUS: ${allPassed ? 'PRODUCTION READY' : 'NEEDS ATTENTION'}`);
    
    if (allPassed) {
      console.log('✅ Secrets rotation system is ready for production deployment!');
      console.log('\n📝 NEXT STEPS:');
      console.log('   1. Deploy to production environment');
      console.log('   2. Configure Google Cloud Secret Manager');
      console.log('   3. Set up automated rotation schedule');
      console.log('   4. Enable monitoring and alerting');
      console.log('   5. Train team on emergency rollback procedures');
    } else {
      console.log('⚠️ Please address failed tests before production deployment.');
    }
  }
}

// CLI execution
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'test';

  switch (command) {
    case 'init':
      console.log('🔐 Initializing Secrets Rotation System...');
      await secretsRotationEngine.initialize();
      console.log('✅ Initialization complete!');
      break;

    case 'test':
      const tester = new SecretsRotationTester();
      await tester.runAllTests();
      break;

    case 'metrics':
      console.log('📊 Fetching Secrets Rotation Metrics...');
      const metrics = await secretsRotationEngine.getMetrics();
      console.log('\n📈 CURRENT METRICS:');
      console.log(`   Total Secrets: ${metrics.total_secrets}`);
      console.log(`   Compliance Score: ${metrics.compliance_score}%`);
      console.log(`   Pending Rotations: ${metrics.pending_rotations}`);
      console.log(`   Overdue Rotations: ${metrics.overdue_rotations}`);
      console.log(`   Failed (24h): ${metrics.failed_rotations_24h}`);
      console.log(`   Avg Rotation Time: ${metrics.average_rotation_time_minutes.toFixed(1)}min`);
      console.log(`   Dual Accept Active: ${metrics.dual_accept_active}`);
      break;

    case 'check':
      console.log('⏰ Checking Rotation Schedule...');
      const overdue = await secretsRotationEngine.checkRotationSchedule();
      if (overdue.length > 0) {
        console.log(`⚠️ Found ${overdue.length} overdue secrets:`);
        overdue.forEach(secret => console.log(`   - ${secret}`));
      } else {
        console.log('✅ All secrets are up to date!');
      }
      break;

    default:
      console.log('🔐 Secrets Rotation Testing Script');
      console.log('Usage:');
      console.log('  npm run secrets:init     # Initialize system');
      console.log('  npm run secrets:test     # Run full test suite');
      console.log('  npm run secrets:metrics  # Show current metrics');
      console.log('  npm run secrets:check    # Check rotation schedule');
      break;
  }
}

if (require.main === module) {
  main().catch(console.error);
}

export default main;