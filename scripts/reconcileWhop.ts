#!/usr/bin/env npx tsx

/**
 * Whop ↔ Billing Integrity Reconciliation Script
 * 
 * Compares Whop Products, Entitlements, Subscriptions against Firestore
 * client_contracts and pricing_skus collections to identify billing discrepancies.
 * 
 * Usage:
 *   npx tsx scripts/reconcileWhop.ts
 *   
 * Environment Variables:
 *   WHOP_API_KEY - Whop API authentication
 *   FIREBASE_* - Firebase Admin SDK configuration
 */

import { getDb } from '../src/lib/server/firebaseAdmin';
import fs from 'fs/promises';
import path from 'path';

interface WhopProduct {
  id: string;
  name: string;
  price: number;
  billing_period: number;
  created_at: string;
  visibility: string;
  stock?: number;
}

interface WhopSubscription {
  id: string;
  user_id: string;
  product_id: string;
  plan_id: string;
  status: string;
  created_at: string;
  expires_at?: string;
  cancel_at_period_end?: boolean;
}

interface FirestoreContract {
  id: string;
  customer_email: string;
  whop_subscription_id?: string;
  whop_product_id?: string;
  billing_sku: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface FirestorePricingSku {
  id: string;
  billing_sku: string;
  whop_product_id?: string;
  service_id: string;
  tier_id: string;
  price_monthly: number;
  active: boolean;
}

interface BillingDiff {
  type: 'missing_contract' | 'missing_subscription' | 'price_mismatch' | 'status_mismatch' | 'missing_sku';
  severity: 'high' | 'medium' | 'low';
  whop_id?: string;
  firestore_id?: string;
  description: string;
  expected_value?: unknown;
  actual_value?: unknown;
  customer_email?: string;
  created_at: string;
  resolved?: boolean;
  false_positive?: boolean;
}

class WhopBillingReconciler {
  private whopApiKey: string;
  private db: FirebaseFirestore.Firestore;
  
  constructor() {
    this.whopApiKey = process.env.WHOP_API_KEY || '';
    if (!this.whopApiKey) {
      throw new Error('WHOP_API_KEY environment variable is required');
    }
    this.db = getDb();
  }

  private async fetchWhopData<T>(endpoint: string): Promise<T[]> {
    const url = `https://api.whop.com/api/v1/${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.whopApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Whop API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error(`Failed to fetch ${endpoint}:`, error);
      return [];
    }
  }

  private async getWhopProducts(): Promise<WhopProduct[]> {
    return this.fetchWhopData<WhopProduct>('products');
  }

  private async getWhopSubscriptions(): Promise<WhopSubscription[]> {
    return this.fetchWhopData<WhopSubscription>('subscriptions');
  }

  private async getFirestoreContracts(): Promise<FirestoreContract[]> {
    try {
      const snapshot = await this.db.collection('client_contracts').get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as FirestoreContract));
    } catch (error) {
      console.error('Failed to fetch Firestore contracts:', error);
      return [];
    }
  }

  private async getFirestorePricingSkus(): Promise<FirestorePricingSku[]> {
    try {
      const snapshot = await this.db.collection('pricing_skus').get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as FirestorePricingSku));
    } catch (error) {
      console.error('Failed to fetch Firestore pricing SKUs:', error);
      return [];
    }
  }

  private async storeBillingDiffs(diffs: BillingDiff[]): Promise<void> {
    const batch = this.db.batch();
    const now = new Date().toISOString();

    for (const diff of diffs) {
      const docRef = this.db.collection('billing_diffs').doc();
      batch.set(docRef, {
        ...diff,
        reconciled_at: now,
        resolved: false,
        false_positive: false
      });
    }

    await batch.commit();
    console.log(`Stored ${diffs.length} billing diffs to Firestore`);
  }

  private async exportToCsv(diffs: BillingDiff[], summary: any): Promise<string> {
    const tmpDir = path.join(process.cwd(), 'tmp');
    await fs.mkdir(tmpDir, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const csvPath = path.join(tmpDir, `billing-reconciliation-${timestamp}.csv`);

    const csvHeaders = [
      'Type',
      'Severity', 
      'Description',
      'Whop ID',
      'Firestore ID',
      'Customer Email',
      'Expected Value',
      'Actual Value',
      'Created At'
    ].join(',');

    const csvRows = diffs.map(diff => [
      diff.type,
      diff.severity,
      `"${diff.description.replace(/"/g, '""')}"`,
      diff.whop_id || '',
      diff.firestore_id || '',
      diff.customer_email || '',
      diff.expected_value ? `"${JSON.stringify(diff.expected_value).replace(/"/g, '""')}"` : '',
      diff.actual_value ? `"${JSON.stringify(diff.actual_value).replace(/"/g, '""')}"` : '',
      diff.created_at
    ].join(','));

    const csvContent = [
      `# Billing Reconciliation Report - ${new Date().toISOString()}`,
      `# Total Diffs: ${diffs.length}`,
      `# High Severity: ${summary.high_severity_count}`,
      `# Medium Severity: ${summary.medium_severity_count}`,
      `# Low Severity: ${summary.low_severity_count}`,
      `# Variance Percentage: ${summary.variance_percentage.toFixed(2)}%`,
      '',
      csvHeaders,
      ...csvRows
    ].join('\n');

    await fs.writeFile(csvPath, csvContent, 'utf8');
    console.log(`Exported reconciliation report to: ${csvPath}`);
    
    return csvPath;
  }

  public async reconcile(): Promise<{
    diffs: BillingDiff[];
    summary: {
      total_diffs: number;
      high_severity_count: number;
      medium_severity_count: number;
      low_severity_count: number;
      variance_percentage: number;
      export_path?: string;
    };
  }> {
    console.log('🔄 Starting Whop ↔ Billing reconciliation...\n');

    // Fetch data from all sources
    console.log('📡 Fetching Whop products...');
    const whopProducts = await this.getWhopProducts();
    console.log(`   Found ${whopProducts.length} Whop products`);

    console.log('📡 Fetching Whop subscriptions...');
    const whopSubscriptions = await this.getWhopSubscriptions();
    console.log(`   Found ${whopSubscriptions.length} Whop subscriptions`);

    console.log('📡 Fetching Firestore contracts...');
    const firestoreContracts = await this.getFirestoreContracts();
    console.log(`   Found ${firestoreContracts.length} Firestore contracts`);

    console.log('📡 Fetching Firestore pricing SKUs...');
    const firestorePricingSkus = await this.getFirestorePricingSkus();
    console.log(`   Found ${firestorePricingSkus.length} Firestore pricing SKUs\n`);

    const diffs: BillingDiff[] = [];
    const now = new Date().toISOString();

    // Check 1: Missing contracts for active Whop subscriptions
    for (const subscription of whopSubscriptions) {
      if (subscription.status === 'active' || subscription.status === 'trialing') {
        const matchingContract = firestoreContracts.find(c => 
          c.whop_subscription_id === subscription.id
        );

        if (!matchingContract) {
          diffs.push({
            type: 'missing_contract',
            severity: 'high',
            whop_id: subscription.id,
            description: `Active Whop subscription ${subscription.id} has no corresponding Firestore contract`,
            expected_value: 'Firestore contract exists',
            actual_value: 'No contract found',
            created_at: now
          });
        }
      }
    }

    // Check 2: Missing subscriptions for active Firestore contracts
    for (const contract of firestoreContracts) {
      if (contract.status === 'active' && contract.whop_subscription_id) {
        const matchingSubscription = whopSubscriptions.find(s => 
          s.id === contract.whop_subscription_id
        );

        if (!matchingSubscription) {
          diffs.push({
            type: 'missing_subscription',
            severity: 'high',
            firestore_id: contract.id,
            customer_email: contract.customer_email,
            description: `Active Firestore contract ${contract.id} references missing Whop subscription ${contract.whop_subscription_id}`,
            expected_value: 'Whop subscription exists',
            actual_value: 'Subscription not found in Whop',
            created_at: now
          });
        }
      }
    }

    // Check 3: Status mismatches
    for (const contract of firestoreContracts) {
      if (contract.whop_subscription_id) {
        const matchingSubscription = whopSubscriptions.find(s => 
          s.id === contract.whop_subscription_id
        );

        if (matchingSubscription) {
          const whopActive = ['active', 'trialing'].includes(matchingSubscription.status);
          const contractActive = contract.status === 'active';

          if (whopActive !== contractActive) {
            diffs.push({
              type: 'status_mismatch',
              severity: 'medium',
              whop_id: matchingSubscription.id,
              firestore_id: contract.id,
              customer_email: contract.customer_email,
              description: `Status mismatch: Whop subscription ${matchingSubscription.status} vs Firestore contract ${contract.status}`,
              expected_value: contractActive ? 'active' : 'inactive',
              actual_value: matchingSubscription.status,
              created_at: now
            });
          }
        }
      }
    }

    // Check 4: Missing SKUs for Whop products
    for (const product of whopProducts) {
      const matchingSku = firestorePricingSkus.find(sku => 
        sku.whop_product_id === product.id
      );

      if (!matchingSku) {
        diffs.push({
          type: 'missing_sku',
          severity: 'low',
          whop_id: product.id,
          description: `Whop product ${product.name} (${product.id}) has no corresponding pricing SKU`,
          expected_value: 'Pricing SKU exists',
          actual_value: 'No SKU found',
          created_at: now
        });
      }
    }

    // Check 5: Price mismatches (convert Whop cents to dollars)
    for (const contract of firestoreContracts) {
      if (contract.whop_product_id) {
        const whopProduct = whopProducts.find(p => p.id === contract.whop_product_id);
        const pricingSku = firestorePricingSkus.find(sku => 
          sku.billing_sku === contract.billing_sku
        );

        if (whopProduct && pricingSku) {
          const whopPriceUsd = whopProduct.price / 100; // Convert cents to dollars
          const skuPriceUsd = pricingSku.price_monthly;

          if (Math.abs(whopPriceUsd - skuPriceUsd) > 0.01) { // Allow 1 cent tolerance
            diffs.push({
              type: 'price_mismatch',
              severity: 'medium',
              whop_id: whopProduct.id,
              firestore_id: pricingSku.id,
              customer_email: contract.customer_email,
              description: `Price mismatch for ${contract.billing_sku}: Whop $${whopPriceUsd} vs SKU $${skuPriceUsd}`,
              expected_value: skuPriceUsd,
              actual_value: whopPriceUsd,
              created_at: now
            });
          }
        }
      }
    }

    // Calculate summary statistics
    const severityCounts = diffs.reduce((acc, diff) => {
      acc[diff.severity]++;
      return acc;
    }, { high: 0, medium: 0, low: 0 });

    const totalRecords = Math.max(whopSubscriptions.length, firestoreContracts.length, 1);
    const variancePercentage = (diffs.length / totalRecords) * 100;

    const summary = {
      total_diffs: diffs.length,
      high_severity_count: severityCounts.high,
      medium_severity_count: severityCounts.medium,
      low_severity_count: severityCounts.low,
      variance_percentage: variancePercentage,
      export_path: undefined as string | undefined
    };

    // Store diffs in Firestore
    if (diffs.length > 0) {
      await this.storeBillingDiffs(diffs);
    }

    // Export to CSV
    const exportPath = await this.exportToCsv(diffs, summary);
    summary.export_path = exportPath;

    console.log('📊 Reconciliation Summary:');
    console.log(`   Total Differences: ${summary.total_diffs}`);
    console.log(`   High Severity: ${summary.high_severity_count}`);
    console.log(`   Medium Severity: ${summary.medium_severity_count}`);
    console.log(`   Low Severity: ${summary.low_severity_count}`);
    console.log(`   Variance: ${summary.variance_percentage.toFixed(2)}%`);
    console.log(`   Export: ${exportPath}\n`);

    if (summary.variance_percentage > 1.0) {
      console.log('⚠️  WARNING: Variance >1% detected - review required!');
    } else {
      console.log('✅ Billing integrity within acceptable variance (<1%)');
    }

    return { diffs, summary };
  }
}

// CLI execution
async function main() {
  try {
    const reconciler = new WhopBillingReconciler();
    const result = await reconciler.reconcile();
    
    process.exit(result.summary.variance_percentage > 1.0 ? 1 : 0);
  } catch (error) {
    console.error('❌ Reconciliation failed:', error);
    process.exit(1);
  }
}

// Export for use in API routes
export { WhopBillingReconciler };

// Run if called directly
if (require.main === module) {
  main();
}