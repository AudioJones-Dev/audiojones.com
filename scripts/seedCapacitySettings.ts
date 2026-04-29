#!/usr/bin/env node

/**
 * Seed Capacity Settings Script
 * 
 * One-time script to initialize default capacity management settings
 * in Firestore for the Audio Jones business capacity system.
 * 
 * Usage: npm run seed:capacity
 */

import { getFirestore } from "@/lib/legacy-stubs";
import admin from "@/lib/legacy-stubs";

// Initialize Firebase Admin directly in the script
if (!admin.apps.length) {
  try {
    const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS 
      ? require(process.env.GOOGLE_APPLICATION_CREDENTIALS)
      : null;

    if (serviceAccount) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID
      });
    } else {
      // Use default credentials
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || 'audiojones-com'
      });
    }
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
    process.exit(1);
  }
}

const db = getFirestore();

const DEFAULT_CAPACITY_SETTINGS = {
  slots_total: 5,
  min_retainers: 5,
  min_mrr: 26000,
  max_hours: 200,
  max_podcast_clients: 2,
  preopen_window_days: 14,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

async function seedCapacitySettings() {
  try {
    console.log('🌱 Seeding capacity settings...');
    
    // Check if settings already exist
    const existingDoc = await db.collection('capacity_settings').doc('default').get();
    
    if (existingDoc.exists) {
      console.log('⚠️ Capacity settings already exist. Current settings:');
      console.log(JSON.stringify(existingDoc.data(), null, 2));
      
      const response = await new Promise<string>((resolve) => {
        const readline = require('readline');
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });
        
        rl.question('Do you want to overwrite existing settings? (y/N): ', (answer: string) => {
          rl.close();
          resolve(answer.toLowerCase());
        });
      });
      
      if (response !== 'y' && response !== 'yes') {
        console.log('❌ Cancelled. Existing settings preserved.');
        process.exit(0);
      }
    }
    
    // Write settings to Firestore
    await db.collection('capacity_settings').doc('default').set(DEFAULT_CAPACITY_SETTINGS);
    
    console.log('✅ Capacity settings seeded successfully!');
    console.log('📊 Settings configured:');
    console.log(`   • Total slots: ${DEFAULT_CAPACITY_SETTINGS.slots_total}`);
    console.log(`   • Minimum retainers: ${DEFAULT_CAPACITY_SETTINGS.min_retainers}`);
    console.log(`   • Minimum MRR: $${DEFAULT_CAPACITY_SETTINGS.min_mrr.toLocaleString()}`);
    console.log(`   • Maximum hours: ${DEFAULT_CAPACITY_SETTINGS.max_hours}`);
    console.log(`   • Maximum podcast clients: ${DEFAULT_CAPACITY_SETTINGS.max_podcast_clients}`);
    console.log(`   • Pre-open window: ${DEFAULT_CAPACITY_SETTINGS.preopen_window_days} days`);
    
    // Verify the write
    const verifyDoc = await db.collection('capacity_settings').doc('default').get();
    if (verifyDoc.exists) {
      console.log('🔍 Verification: Settings successfully written to Firestore');
    } else {
      console.error('❌ Verification failed: Settings not found in Firestore');
      process.exit(1);
    }
    
    console.log('\n🚀 Next steps:');
    console.log('   1. Test the capacity API: GET /api/capacity');
    console.log('   2. Add client contracts to see capacity calculations');
    console.log('   3. Configure capacity banner on public site');
    
    process.exit(0);
    
  } catch (error) {
    console.error('💥 Failed to seed capacity settings:', error);
    process.exit(1);
  }
}

// Add some sample client contracts for testing
async function seedSampleContracts() {
  console.log('📝 Adding sample client contracts for testing...');
  
  const sampleContracts = [
    {
      client_id: 'client1@example.com',
      plan_tier: 'growth',
      plan_type: 'retainer',
      monthly_fee: 7500,
      hours_committed: 35,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      client_id: 'client2@example.com',
      plan_tier: 'podcast',
      plan_type: 'podcast',
      monthly_fee: 4500,
      hours_committed: 22,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      client_id: 'client3@example.com',
      plan_tier: 'foundation',
      plan_type: 'retainer',
      monthly_fee: 5000,
      hours_committed: 20,
      status: 'offboarding',
      next_open_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
  
  for (let i = 0; i < sampleContracts.length; i++) {
    const contract = sampleContracts[i];
    await db.collection('client_contracts').doc(`sample-${i + 1}`).set(contract);
    console.log(`   ✅ Added sample contract: ${contract.client_id} (${contract.plan_tier})`);
  }
  
  console.log('📋 Sample contracts added for testing capacity calculations');
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const includeSamples = args.includes('--samples');
  
  await seedCapacitySettings();
  
  if (includeSamples) {
    await seedSampleContracts();
  }
}

if (require.main === module) {
  main();
}