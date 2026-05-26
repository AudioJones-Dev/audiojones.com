/**
 * Seed Basic Runbooks
 * 
 * Creates default runbooks for common incident types.
 * Run with: npx tsx scripts/seedRunbooks.ts
 */

import { getDb } from '../src/lib/server/legacyAdmin';
import type { Runbook } from '../src/lib/server/incidents';

const defaultRunbooks: Omit<Runbook, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    name: 'Capacity Critical Response',
    source: 'capacity',
    active: true,
    steps: [
      'Check current capacity utilization in admin dashboard',
      'Review recent capacity trends and forecasts',
      'Check for any pending deployments or migrations',
      'Scale infrastructure if needed (data-store quotas, server resources)',
      'Notify team lead about capacity issue',
      'Monitor for 15 minutes to ensure stabilization',
      'Update incident status once resolved'
    ]
  },
  {
    name: 'Webhook Failure Response',
    source: 'webhook',
    active: true,
    steps: [
      'Check webhook endpoint logs for errors',
      'Verify external service (Whop, Stripe) is operational',
      'Check network connectivity and firewall rules',
      'Review recent webhook payload changes',
      'Attempt manual webhook replay if possible',
      'Contact external service support if needed',
      'Update incident status and document resolution'
    ]
  },
  {
    name: 'Billing Issue Response',
    source: 'billing',
    active: true,
    steps: [
      'Check Whop dashboard for payment issues',
      'Review Stripe customer portal for billing alerts',
      'Verify subscription status and payment methods',  
      'Check for failed payment notifications',
      'Contact customer if payment issue confirmed',
      'Update billing status in admin system',
      'Monitor for successful payment retry'
    ]
  },
  {
    name: 'System Critical Response',
    source: 'system',
    active: true,
    steps: [
      'Check system health metrics and dashboards',
      'Review error logs for root cause',
      'Verify retired auth services are operational',
      'Check external dependencies (APIs, CDNs)',
      'Restart services if needed',
      'Escalate to on-call engineer if unresolved',
      'Update incident status and notify stakeholders'
    ]
  },
  {
    name: 'Predictive Alert Response', 
    source: 'predictive',
    active: true,
    steps: [
      'Review capacity forecast and trend analysis',
      'Check days remaining until threshold breach',
      'Assess current resource utilization',
      'Plan capacity scaling or optimization',
      'Schedule preventive maintenance if needed',
      'Set monitoring alerts for earlier warning',
      'Update capacity planning documentation'
    ]
  }
];

async function seedRunbooks() {
  console.log('📚 Starting runbook seeding...');
  
  try {
    const existingRunbooks = await getDb().collection('runbooks').get();
    console.log(`Found ${existingRunbooks.size} existing runbooks`);
    
    const now = new Date().toISOString();
    let created = 0;
    let skipped = 0;

    for (const runbookData of defaultRunbooks) {
      // Check if runbook for this source already exists
      const existingQuery = await getDb().collection('runbooks')
        .where('source', '==', runbookData.source)
        .where('active', '==', true)
        .limit(1)
        .get();

      if (!existingQuery.empty) {
        console.log(`⏭️ Skipping ${runbookData.source} - active runbook already exists`);
        skipped++;
        continue;
      }

      // Create new runbook
      const runbook: Omit<Runbook, 'id'> = {
        ...runbookData,
        created_at: now,
        updated_at: now
      };

      const docRef = await getDb().collection('runbooks').add(runbook);
      console.log(`✅ Created runbook ${docRef.id}: ${runbook.name}`);
      created++;
    }

    console.log(`🎉 Runbook seeding complete! Created: ${created}, Skipped: ${skipped}`);
    
    if (created > 0) {
      console.log('\n📋 To test runbook attachment:');
      console.log('1. Create a capacity alert');
      console.log('2. Process the alert to create an incident');
      console.log('3. Check that the incident has runbook_id attached');
      console.log('4. View /portal/admin/incidents to see runbook steps');
    }

  } catch (error) {
    console.error('❌ Failed to seed runbooks:', error);
    process.exit(1);
  }
}

// Auto-run if script is executed directly
if (require.main === module) {
  seedRunbooks()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Script failed:', error);
      process.exit(1);
    });
}

export { seedRunbooks };