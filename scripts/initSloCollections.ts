#!/usr/bin/env tsx

/**
 * Initialize Firestore collections for SLO Credit System
 * Creates sample data and indexes for testing
 */

import { getDb } from '../src/lib/server/firebaseAdmin';
import { FieldValue } from "@/lib/legacy-stubs";

async function initializeCollections() {
  console.log('🔄 Initializing Firestore collections for SLO Credit System...\n');
  
  const db = getDb();

  try {
    // 1. Create sample client contracts
    console.log('1️⃣ Creating sample client contracts...');
    
    const sampleContracts = [
      {
        client_id: 'test-client-001',
        service_id: 'webhook',
        monthly_fee: 500,
        active: true,
        plan_name: 'Enterprise Webhook',
        start_date: new Date('2025-01-01'),
      },
      {
        client_id: 'test-client-001', 
        service_id: 'capacity',
        monthly_fee: 300,
        active: true,
        plan_name: 'Capacity Management Pro',
        start_date: new Date('2025-01-01'),
      },
      {
        client_id: 'test-client-002',
        service_id: 'billing',
        monthly_fee: 750,
        active: true,
        plan_name: 'Billing Enterprise',
        start_date: new Date('2025-01-15'),
      },
      {
        client_id: 'test-client-003',
        service_id: 'webhook',
        monthly_fee: 250,
        active: true,
        plan_name: 'Webhook Professional',
        start_date: new Date('2025-02-01'),
      }
    ];

    for (const contract of sampleContracts) {
      const contractId = `${contract.client_id}_${contract.service_id}`;
      await db.collection('client_contracts').doc(contractId).set({
        ...contract,
        start_date: FieldValue.serverTimestamp(),
        created_at: FieldValue.serverTimestamp(),
      });
      console.log(`  ✅ Created contract: ${contractId}`);
    }
    console.log('');

    // 2. Create sample SLO targets (these should match DEFAULT_SLOS)
    console.log('2️⃣ Creating SLO targets...');
    
    const sloTargets = [
      {
        service_id: 'webhook',
        metric_type: 'availability',
        target_percentage: 99.0,
        measurement_window_hours: 168, // 7 days
        credit_percentage: 15,
        alert_burn_rate: 2.0,
      },
      {
        service_id: 'webhook',
        metric_type: 'availability', 
        target_percentage: 99.5,
        measurement_window_hours: 720, // 30 days
        credit_percentage: 15,
        alert_burn_rate: 2.0,
      },
      {
        service_id: 'billing',
        metric_type: 'processing',
        target_percentage: 99.5,
        measurement_window_hours: 720, // 30 days
        credit_percentage: 20,
        alert_burn_rate: 1.5,
      },
      {
        service_id: 'capacity',
        metric_type: 'forecasting',
        target_percentage: 98.5,
        measurement_window_hours: 168, // 7 days
        credit_percentage: 10,
        alert_burn_rate: 2.5,
      }
    ];

    for (const target of sloTargets) {
      const targetId = `${target.service_id}_${target.metric_type}_${target.measurement_window_hours}h`;
      await db.collection('slo_targets').doc(targetId).set({
        ...target,
        created_at: FieldValue.serverTimestamp(),
      });
      console.log(`  ✅ Created SLO target: ${targetId}`);
    }
    console.log('');

    // 3. Create sample historical metrics to establish baseline
    console.log('3️⃣ Creating sample historical metrics...');
    
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Generate metrics for the past week
    for (let i = 0; i < 168; i++) { // Hourly metrics for a week
      const timestamp = new Date(oneWeekAgo.getTime() + i * 60 * 60 * 1000);
      
      const metrics = [
        {
          service_id: 'webhook',
          client_id: 'test-client-001',
          metric_type: 'availability',
          value: 98.5 + Math.random() * 1.5, // 98.5-100%
          threshold: 99.0,
          success: Math.random() > 0.02, // 98% success rate
        },
        {
          service_id: 'billing',
          client_id: 'test-client-002',
          metric_type: 'processing',
          value: 99.0 + Math.random() * 1.0, // 99-100%
          threshold: 99.5,
          success: Math.random() > 0.005, // 99.5% success rate
        },
        {
          service_id: 'capacity',
          client_id: 'test-client-001',
          metric_type: 'forecasting',
          value: 97.0 + Math.random() * 2.5, // 97-99.5%
          threshold: 98.5,
          success: Math.random() > 0.015, // 98.5% success rate
        }
      ];

      for (const metric of metrics) {
        const metricId = `${metric.service_id}_${metric.client_id}_${metric.metric_type}_${timestamp.getTime()}`;
        await db.collection('slo_metrics').doc(metricId).set({
          ...metric,
          timestamp: FieldValue.serverTimestamp(),
          created_at: FieldValue.serverTimestamp(),
        });
      }
      
      if (i % 24 === 0) {
        console.log(`  📊 Created metrics for day ${Math.floor(i / 24) + 1}`);
      }
    }
    console.log('');

    // 4. Initialize empty collections with proper structure
    console.log('4️⃣ Initializing collection structures...');
    
    // SLO Credit Rules collection
    await db.collection('slo_credit_rules').doc('_init').set({
      _placeholder: true,
      created_at: FieldValue.serverTimestamp(),
    });
    console.log(`  ✅ Initialized slo_credit_rules collection`);

    // SLO Credit Applications collection
    await db.collection('slo_credit_applications').doc('_init').set({
      _placeholder: true,
      created_at: FieldValue.serverTimestamp(),
    });
    console.log(`  ✅ Initialized slo_credit_applications collection`);

    // SLO Violations collection
    await db.collection('slo_violations').doc('_init').set({
      _placeholder: true,
      created_at: FieldValue.serverTimestamp(),
    });
    console.log(`  ✅ Initialized slo_violations collection`);

    // SLO Burn Alerts collection
    await db.collection('slo_burn_alerts').doc('_init').set({
      _placeholder: true,
      created_at: FieldValue.serverTimestamp(),
    });
    console.log(`  ✅ Initialized slo_burn_alerts collection`);

    // Billing Credits collection (already exists, but ensure structure)
    await db.collection('billing_credits').doc('_init').set({
      _placeholder: true,
      created_at: FieldValue.serverTimestamp(),
    });
    console.log(`  ✅ Initialized billing_credits collection`);
    console.log('');

    // 5. Display collection summary
    console.log('5️⃣ Collection Summary:');
    
    const collections = [
      'client_contracts',
      'slo_targets', 
      'slo_metrics',
      'slo_credit_rules',
      'slo_credit_applications',
      'slo_violations',
      'slo_burn_alerts',
      'billing_credits'
    ];

    for (const collectionName of collections) {
      const snapshot = await db.collection(collectionName).get();
      console.log(`  📊 ${collectionName}: ${snapshot.size} documents`);
    }
    console.log('');

    console.log('🎉 Firestore initialization completed successfully!');
    console.log('\n📝 Ready for SLO Credit System testing:');
    console.log('   • Run: npm run test:slo-credits');
    console.log('   • Access admin UI: /portal/admin/slo-credits');
    console.log('   • API endpoint: /api/admin/slo/credits');

  } catch (error) {
    console.error('❌ Initialization failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  initializeCollections().catch(console.error);  
}

export default initializeCollections;