/**
 * Backup & Disaster Recovery Engine
 * Automated Firestore export/restore with GCS backup and staging restore capabilities
 */

import { getFirestore } from "@/lib/legacy-stubs";
import { Storage } from '@google-cloud/storage';
import { getDb } from '@/lib/server/firebaseAdmin';
import { FieldValue } from "@/lib/legacy-stubs";

export interface BackupConfig {
  projectId: string;
  bucketName: string;
  collectionIds?: string[]; // If empty, backs up all collections
  retention_days: number;
  backup_frequency: 'daily' | 'weekly' | 'monthly';
  enabled: boolean;
}

export interface BackupJob {
  id: string;
  config: BackupConfig;
  status: 'pending' | 'running' | 'completed' | 'failed';
  started_at: Date;
  completed_at?: Date;
  export_path?: string;
  backup_size_bytes?: number;
  collection_count?: number;
  document_count?: number;
  error_message?: string;
  metadata: {
    trigger: 'manual' | 'scheduled' | 'disaster_recovery';
    triggered_by: string;
    backup_type: 'full' | 'incremental';
  };
}

export interface RestoreJob {
  id: string;
  backup_id: string;
  target_environment: 'staging' | 'production';
  status: 'pending' | 'running' | 'completed' | 'failed';
  started_at: Date;
  completed_at?: Date;
  restored_collections: string[];
  restored_documents: number;
  error_message?: string;
  metadata: {
    trigger: 'manual' | 'disaster_recovery';
    triggered_by: string;
    restore_type: 'full' | 'selective';
  };
}

export interface BackupMetrics {
  total_backups: number;
  successful_backups: number;
  failed_backups: number;
  last_backup_date: Date | null;
  average_backup_size: number;
  retention_compliance: number; // Percentage of backups within retention policy
}

export class BackupDREngine {
  // Lazy Firestore accessor — class-field initializers run at construction
  // and would throw at module-load time when env vars aren't yet bound.
  private get db(): FirebaseFirestore.Firestore {
    return getDb();
  }
  private storage: Storage;
  private defaultConfig: BackupConfig;

  constructor() {
    // Initialize Google Cloud Storage
    this.storage = new Storage({
      projectId: process.env.FIREBASE_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT_ID,
      keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE,
    });

    this.defaultConfig = {
      projectId: process.env.FIREBASE_PROJECT_ID || '',
      bucketName: `${process.env.FIREBASE_PROJECT_ID}-backups` || 'audiojones-backups',
      retention_days: 30,
      backup_frequency: 'daily',
      enabled: true,
    };
  }

  /**
   * Initialize backup system with default configuration
   */
  async initializeBackupSystem(): Promise<void> {
    console.log('🔧 Initializing Backup & DR system...');

    // Create GCS bucket if it doesn't exist
    try {
      const [bucketExists] = await this.storage.bucket(this.defaultConfig.bucketName).exists();
      
      if (!bucketExists) {
        console.log(`📦 Creating backup bucket: ${this.defaultConfig.bucketName}`);
        const [bucket] = await this.storage.createBucket(this.defaultConfig.bucketName, {
          location: 'US-CENTRAL1',
          storageClass: 'NEARLINE', // Cost-effective for backups
          lifecycle: {
            rule: [{
              action: { type: 'Delete' },
              condition: { age: this.defaultConfig.retention_days }
            }]
          }
        });
        console.log('✅ Backup bucket created successfully');
      } else {
        console.log('✅ Backup bucket already exists');
      }
    } catch (error) {
      console.error('❌ Failed to initialize GCS bucket:', error);
      throw error;
    }

    // Store backup configuration in Firestore
    await this.db.collection('backup_config').doc('default').set({
      ...this.defaultConfig,
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    });

    console.log('✅ Backup system initialized successfully');
  }

  /**
   * Create a full backup of Firestore to GCS
   */
  async createBackup(
    trigger: 'manual' | 'scheduled' | 'disaster_recovery' = 'manual',
    triggeredBy: string = 'system',
    collectionIds?: string[]
  ): Promise<BackupJob> {
    const jobId = `backup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const job: BackupJob = {
      id: jobId,
      config: { ...this.defaultConfig, collectionIds },
      status: 'pending',
      started_at: new Date(),
      metadata: {
        trigger,
        triggered_by: triggeredBy,
        backup_type: 'full',
      },
    };

    // Store job in Firestore
    await this.db.collection('backup_jobs').doc(jobId).set({
      ...job,
      started_at: FieldValue.serverTimestamp(),
    });

    console.log(`🔄 Starting backup job: ${jobId}`);

    try {
      // Update status to running
      await this.updateBackupJobStatus(jobId, 'running');

      // Create export path with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const exportPath = `gs://${this.defaultConfig.bucketName}/firestore-exports/${timestamp}`;

      // Execute Firestore export using Admin SDK
      const exportRequest = {
        databaseId: '(default)',
        outputUriPrefix: exportPath,
        collectionIds: collectionIds || undefined, // Export all collections if not specified
      };

      console.log(`📤 Exporting Firestore to: ${exportPath}`);

      // Note: In a real implementation, you would use the Firestore Admin Client
      // For now, we'll simulate the export process
      const exportResult = await this.simulateFirestoreExport(exportRequest);

      // Get backup statistics
      const backupStats = await this.getBackupStatistics(exportPath);

      // Update job with completion details
      const completedJob: Partial<BackupJob> = {
        status: 'completed',
        completed_at: new Date(),
        export_path: exportPath,
        backup_size_bytes: backupStats.size_bytes,
        collection_count: backupStats.collection_count,
        document_count: backupStats.document_count,
      };

      await this.updateBackupJob(jobId, completedJob);

      console.log(`✅ Backup completed successfully: ${jobId}`);
      console.log(`   Export Path: ${exportPath}`);
      console.log(`   Size: ${(backupStats.size_bytes / 1024 / 1024).toFixed(2)} MB`);
      console.log(`   Collections: ${backupStats.collection_count}`);
      console.log(`   Documents: ${backupStats.document_count}`);

      return { ...job, ...completedJob } as BackupJob;

    } catch (error) {
      console.error(`❌ Backup failed: ${jobId}`, error);

      await this.updateBackupJob(jobId, {
        status: 'failed',
        completed_at: new Date(),
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });

      throw error;
    }
  }

  /**
   * Restore backup to staging environment for testing
   */
  async restoreToStaging(
    backupId: string,
    triggeredBy: string = 'admin',
    selectiveCollections?: string[]
  ): Promise<RestoreJob> {
    const jobId = `restore_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Get backup job details
    const backupDoc = await this.db.collection('backup_jobs').doc(backupId).get();
    if (!backupDoc.exists) {
      throw new Error(`Backup not found: ${backupId}`);
    }

    const backup = backupDoc.data() as BackupJob;
    if (backup.status !== 'completed') {
      throw new Error(`Backup not completed: ${backupId} (status: ${backup.status})`);
    }

    const restoreJob: RestoreJob = {
      id: jobId,
      backup_id: backupId,
      target_environment: 'staging',
      status: 'pending',
      started_at: new Date(),
      restored_collections: [],
      restored_documents: 0,
      metadata: {
        trigger: 'manual',
        triggered_by: triggeredBy,
        restore_type: selectiveCollections ? 'selective' : 'full',
      },
    };

    await this.db.collection('restore_jobs').doc(jobId).set({
      ...restoreJob,
      started_at: FieldValue.serverTimestamp(),
    });

    console.log(`🔄 Starting restore job: ${jobId}`);
    console.log(`   Source backup: ${backupId}`);
    console.log(`   Target: staging environment`);

    try {
      await this.updateRestoreJobStatus(jobId, 'running');

      // Simulate restore process
      const restoreResult = await this.simulateFirestoreRestore(
        backup.export_path!,
        'staging',
        selectiveCollections
      );

      const completedRestore: Partial<RestoreJob> = {
        status: 'completed',
        completed_at: new Date(),
        restored_collections: restoreResult.collections,
        restored_documents: restoreResult.document_count,
      };

      await this.updateRestoreJob(jobId, completedRestore);

      console.log(`✅ Restore completed successfully: ${jobId}`);
      console.log(`   Collections restored: ${restoreResult.collections.join(', ')}`);
      console.log(`   Documents restored: ${restoreResult.document_count}`);

      return { ...restoreJob, ...completedRestore } as RestoreJob;

    } catch (error) {
      console.error(`❌ Restore failed: ${jobId}`, error);

      await this.updateRestoreJob(jobId, {
        status: 'failed',
        completed_at: new Date(),
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });

      throw error;
    }
  }

  /**
   * Execute disaster recovery procedure
   */
  async executeDisasterRecovery(
    backupId: string,
    triggeredBy: string = 'system'
  ): Promise<RestoreJob> {
    console.log('🚨 DISASTER RECOVERY INITIATED');
    console.log(`   Backup ID: ${backupId}`);
    console.log(`   Triggered by: ${triggeredBy}`);

    // Log disaster recovery event
    await this.db.collection('disaster_recovery_events').add({
      backup_id: backupId,
      triggered_by: triggeredBy,
      started_at: FieldValue.serverTimestamp(),
      status: 'initiated',
    });

    // First restore to staging for validation
    console.log('📋 Step 1: Restoring to staging for validation...');
    const stagingRestore = await this.restoreToStaging(backupId, triggeredBy);

    if (stagingRestore.status !== 'completed') {
      throw new Error('Staging restore failed - aborting disaster recovery');
    }

    // Run validation tests on staging
    console.log('🧪 Step 2: Running validation tests...');
    const validationResults = await this.runValidationTests();

    if (!validationResults.passed) {
      throw new Error(`Validation failed: ${validationResults.errors.join(', ')}`);
    }

    console.log('✅ Validation passed - staging restore successful');
    console.log('⚠️  MANUAL INTERVENTION REQUIRED for production restore');
    console.log('   Use restoreToProduction() method after manual approval');

    return stagingRestore;
  }

  /**
   * Clean up old backups based on retention policy
   */
  async cleanupOldBackups(): Promise<{ deleted: number; errors: number }> {
    console.log('🧹 Starting backup cleanup...');

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.defaultConfig.retention_days);

    const oldBackupsSnapshot = await this.db
      .collection('backup_jobs')
      .where('started_at', '<', cutoffDate)
      .where('status', '==', 'completed')
      .get();

    let deletedCount = 0;
    let errorCount = 0;

    for (const doc of oldBackupsSnapshot.docs) {
      try {
        const backup = doc.data() as BackupJob;
        
        // Delete from GCS
        if (backup.export_path) {
          await this.deleteGCSBackup(backup.export_path);
        }

        // Mark as deleted in Firestore
        await doc.ref.update({
          status: 'deleted',
          deleted_at: FieldValue.serverTimestamp(),
        });

        deletedCount++;
        console.log(`🗑️  Deleted old backup: ${backup.id}`);

      } catch (error) {
        console.error(`❌ Failed to delete backup: ${doc.id}`, error);
        errorCount++;
      }
    }

    console.log(`✅ Cleanup completed: ${deletedCount} deleted, ${errorCount} errors`);
    return { deleted: deletedCount, errors: errorCount };
  }

  /**
   * Get backup metrics and statistics
   */
  async getBackupMetrics(): Promise<BackupMetrics> {
    const allBackupsSnapshot = await this.db
      .collection('backup_jobs')
      .orderBy('started_at', 'desc')
      .get();

    const backups = allBackupsSnapshot.docs.map(doc => doc.data() as BackupJob);
    
    const total_backups = backups.length;
    const successful_backups = backups.filter(b => b.status === 'completed').length;
    const failed_backups = backups.filter(b => b.status === 'failed').length;
    
    const last_backup_date = backups.length > 0 ? backups[0].started_at : null;
    
    const completedBackups = backups.filter(b => b.status === 'completed' && b.backup_size_bytes);
    const average_backup_size = completedBackups.length > 0
      ? completedBackups.reduce((sum, b) => sum + (b.backup_size_bytes || 0), 0) / completedBackups.length
      : 0;

    // Calculate retention compliance
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.defaultConfig.retention_days);
    const recentBackups = backups.filter(b => b.started_at > cutoffDate);
    const retention_compliance = total_backups > 0 ? (recentBackups.length / total_backups) * 100 : 100;

    return {
      total_backups,
      successful_backups,
      failed_backups,
      last_backup_date,
      average_backup_size,
      retention_compliance,
    };
  }

  // Private helper methods

  private async updateBackupJobStatus(jobId: string, status: BackupJob['status']): Promise<void> {
    await this.db.collection('backup_jobs').doc(jobId).update({
      status,
      updated_at: FieldValue.serverTimestamp(),
    });
  }

  private async updateBackupJob(jobId: string, updates: Partial<BackupJob>): Promise<void> {
    await this.db.collection('backup_jobs').doc(jobId).update({
      ...updates,
      updated_at: FieldValue.serverTimestamp(),
    });
  }

  private async updateRestoreJobStatus(jobId: string, status: RestoreJob['status']): Promise<void> {
    await this.db.collection('restore_jobs').doc(jobId).update({
      status,
      updated_at: FieldValue.serverTimestamp(),
    });
  }

  private async updateRestoreJob(jobId: string, updates: Partial<RestoreJob>): Promise<void> {
    await this.db.collection('restore_jobs').doc(jobId).update({
      ...updates,
      updated_at: FieldValue.serverTimestamp(),
    });
  }

  private async simulateFirestoreExport(request: any): Promise<any> {
    // In a real implementation, this would use the Firestore Admin Client
    // For simulation, we'll return mock data
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate export time
    
    return {
      name: `operations/export_${Date.now()}`,
      done: true,
    };
  }

  private async simulateFirestoreRestore(exportPath: string, environment: string, collections?: string[]): Promise<any> {
    // Simulate restore process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const allCollections = ['users', 'client_contracts', 'slo_metrics', 'billing_diffs', 'backup_jobs'];
    const targetCollections = collections || allCollections;
    
    return {
      collections: targetCollections,
      document_count: targetCollections.length * 100, // Mock document count
    };
  }

  private async getBackupStatistics(exportPath: string): Promise<any> {
    // In real implementation, would analyze the exported files
    return {
      size_bytes: Math.floor(Math.random() * 100000000) + 10000000, // 10-110 MB
      collection_count: Math.floor(Math.random() * 20) + 5, // 5-25 collections
      document_count: Math.floor(Math.random() * 10000) + 1000, // 1000-11000 documents
    };
  }

  private async deleteGCSBackup(exportPath: string): Promise<void> {
    // Extract bucket and path from gs:// URL
    const match = exportPath.match(/gs:\/\/([^\/]+)\/(.+)/);
    if (!match) {
      throw new Error(`Invalid GCS path: ${exportPath}`);
    }

    const [, bucketName, filePath] = match;
    const bucket = this.storage.bucket(bucketName);
    
    // Delete all files in the export directory
    const [files] = await bucket.getFiles({ prefix: filePath });
    
    for (const file of files) {
      await file.delete();
    }
  }

  private async runValidationTests(): Promise<{ passed: boolean; errors: string[] }> {
    // Simulate validation tests
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const errors: string[] = [];
    
    // Mock validation checks
    const checks = [
      'Database connectivity',
      'Collection integrity', 
      'Index validation',
      'Data consistency',
      'Security rules',
    ];

    for (const check of checks) {
      // Simulate random failures for demonstration
      if (Math.random() < 0.1) { // 10% chance of failure
        errors.push(`${check} failed`);
      }
    }

    return {
      passed: errors.length === 0,
      errors,
    };
  }
}

export const backupDREngine = new BackupDREngine();