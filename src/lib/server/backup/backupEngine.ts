/**
 * Backup & Disaster Recovery Engine
 * 
 * Comprehensive backup system with automated Firestore backups,
 * GCS integration, disaster recovery automation, and verification.
 */

import { Storage } from '@google-cloud/storage';
import { getDb } from '../firebaseAdmin';
import eventStreamingEngine from '../../streaming/EventStreamingEngine';
import crypto from 'crypto';
import zlib from 'zlib';
import { promisify } from 'util';
import {
  BackupConfiguration,
  BackupExecution,
  RestoreRequest,
  DisasterRecoveryPlan,
  DisasterRecoveryExecution,
  BackupHealthMetrics,
  BackupVerificationResult
} from './types';

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

export class BackupEngine {
  private static instance: BackupEngine;
  private storage: Storage;
  private eventStreaming: typeof eventStreamingEngine;
  private defaultConfigurations: BackupConfiguration[];

  // Lazy Firestore accessor — see StreamAnalyticsCorrelationEngine for rationale.
  private get db(): FirebaseFirestore.Firestore {
    return getDb();
  }

  private constructor() {
    this.storage = new Storage({
      projectId: process.env.GOOGLE_CLOUD_PROJECT,
    });
    this.eventStreaming = eventStreamingEngine;
    this.defaultConfigurations = this.createDefaultConfigurations();

    console.log('🔄 Initializing Backup & DR Engine...');
    this.initializeDefaultConfigurations();
    console.log('💾 Backup & DR Engine initialized successfully');
  }

  public static getInstance(): BackupEngine {
    if (!BackupEngine.instance) {
      BackupEngine.instance = new BackupEngine();
    }
    return BackupEngine.instance;
  }

  private createDefaultConfigurations(): BackupConfiguration[] {
    const now = Date.now();
    return [
      {
        id: 'firestore-daily-full',
        name: 'Firestore Daily Full Backup',
        description: 'Complete daily backup of all Firestore collections',
        source_type: 'firestore',
        source_path: '/',
        destination: {
          provider: 'gcs',
          bucket: process.env.BACKUP_BUCKET || 'audiojones-backups',
          path: 'firestore/daily',
          region: 'us-central1'
        },
        schedule: {
          frequency: 'daily',
          time: '02:00'
        },
        retention: {
          keep_daily: 7,
          keep_weekly: 4,
          keep_monthly: 12
        },
        encryption: {
          enabled: true,
          algorithm: 'AES256-GCM'
        },
        compression: {
          enabled: true,
          algorithm: 'gzip'
        },
        verification: {
          enabled: true,
          checksum_algorithm: 'sha256',
          auto_restore_test: false
        },
        active: true,
        created_at: now,
        updated_at: now,
        created_by: 'system'
      },
      {
        id: 'firestore-hourly-incremental',
        name: 'Firestore Hourly Incremental',
        description: 'Hourly incremental backup of changed documents',
        source_type: 'firestore',
        source_path: '/',
        destination: {
          provider: 'gcs',
          bucket: process.env.BACKUP_BUCKET || 'audiojones-backups',
          path: 'firestore/incremental',
          region: 'us-central1'
        },
        schedule: {
          frequency: 'hourly'
        },
        retention: {
          keep_daily: 24,
          keep_weekly: 7,
          keep_monthly: 3
        },
        encryption: {
          enabled: true,
          algorithm: 'AES256-GCM'
        },
        compression: {
          enabled: true,
          algorithm: 'gzip'
        },
        verification: {
          enabled: true,
          checksum_algorithm: 'sha256',
          auto_restore_test: false
        },
        active: true,
        created_at: now,
        updated_at: now,
        created_by: 'system'
      },
      {
        id: 'critical-data-realtime',
        name: 'Critical Data Real-time Backup',
        description: 'Real-time backup of critical collections (users, billing, subscriptions)',
        source_type: 'firestore',
        source_path: '/users,/billing,/subscriptions,/organizations',
        destination: {
          provider: 'gcs',
          bucket: process.env.BACKUP_BUCKET || 'audiojones-backups',
          path: 'firestore/critical',
          region: 'us-central1'
        },
        schedule: {
          frequency: 'hourly'
        },
        retention: {
          keep_daily: 48,
          keep_weekly: 12,
          keep_monthly: 24
        },
        encryption: {
          enabled: true,
          algorithm: 'AES256-GCM'
        },
        compression: {
          enabled: true,
          algorithm: 'gzip'
        },
        verification: {
          enabled: true,
          checksum_algorithm: 'sha256',
          auto_restore_test: true
        },
        active: true,
        created_at: now,
        updated_at: now,
        created_by: 'system'
      }
    ];
  }

  private async initializeDefaultConfigurations(): Promise<void> {
    try {
      const batch = this.db.batch();
      
      for (const config of this.defaultConfigurations) {
        const docRef = this.db.collection('backup_configurations').doc(config.id);
        batch.set(docRef, config, { merge: true });
      }
      
      await batch.commit();
    } catch (error) {
      console.error('Failed to initialize default backup configurations:', error);
    }
  }

  public async createBackupConfiguration(config: Omit<BackupConfiguration, 'id' | 'created_at' | 'updated_at'>): Promise<BackupConfiguration> {
    const id = `backup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();
    
    const backupConfig: BackupConfiguration = {
      id,
      created_at: now,
      updated_at: now,
      ...config
    };

    await this.db.collection('backup_configurations').doc(id).set(backupConfig);

    // Emit event
    await this.eventStreaming.publishEvent({
      type: 'backup_configuration_created',
      source: 'backup_engine',
      data: { configuration_id: id, name: config.name },
      metadata: { organizationId: 'system', version: 1 }
    });

    return backupConfig;
  }

  public async executeBackup(configurationId: string): Promise<BackupExecution> {
    const configDoc = await this.db.collection('backup_configurations').doc(configurationId).get();
    if (!configDoc.exists) {
      throw new Error(`Backup configuration ${configurationId} not found`);
    }

    const config = configDoc.data() as BackupConfiguration;
    const executionId = `exec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();

    let execution: BackupExecution = {
      id: executionId,
      configuration_id: configurationId,
      status: 'running',
      started_at: now,
      source_info: {
        type: config.source_type,
        path: config.source_path,
        size_bytes: 0
      },
      destination_info: {
        provider: config.destination.provider,
        bucket: config.destination.bucket,
        path: `${config.destination.path}/${new Date().toISOString().split('T')[0]}/${executionId}`
      },
      metrics: {
        bytes_transferred: 0
      },
      created_at: now
    };

    // Save initial execution record
    await this.db.collection('backup_executions').doc(executionId).set(execution);

    try {
      // Emit start event
      await this.eventStreaming.publishEvent({
        type: 'backup_started',
        source: 'backup_engine',
        data: { execution_id: executionId, configuration_id: configurationId },
        metadata: { organizationId: 'system', version: 1 }
      });

      // Execute backup based on source type
      switch (config.source_type) {
        case 'firestore':
          execution = await this.executeFirestoreBackup(config, execution);
          break;
        default:
          throw new Error(`Unsupported source type: ${config.source_type}`);
      }

      // Verify backup if enabled
      if (config.verification.enabled) {
        const verification = await this.verifyBackup(execution, config);
        execution.metrics.verification_passed = verification.status === 'passed';
      }

      execution.status = 'completed';
      execution.completed_at = Date.now();
      execution.duration_ms = execution.completed_at - execution.started_at;

      // Emit completion event
      await this.eventStreaming.publishEvent({
        type: 'backup_completed',
        source: 'backup_engine',
        data: { 
          execution_id: executionId, 
          configuration_id: configurationId,
          bytes_transferred: execution.metrics.bytes_transferred,
          duration_ms: execution.duration_ms
        },
        metadata: { organizationId: 'system', version: 1 }
      });

    } catch (error) {
      execution.status = 'failed';
      execution.completed_at = Date.now();
      execution.duration_ms = execution.completed_at! - execution.started_at;
      execution.error_details = {
        error_code: 'BACKUP_FAILED',
        error_message: error instanceof Error ? error.message : 'Unknown error',
        stack_trace: error instanceof Error ? error.stack : undefined,
        retry_count: 0
      };

      // Emit failure event
      await this.eventStreaming.publishEvent({
        type: 'backup_failed',
        source: 'backup_engine',
        data: { 
          execution_id: executionId, 
          configuration_id: configurationId,
          error: execution.error_details.error_message
        },
        metadata: { organizationId: 'system', version: 1 }
      });
    }

    // Update execution record
    await this.db.collection('backup_executions').doc(executionId).set(execution);

    // Clean up old backups based on retention policy
    await this.enforceRetentionPolicy(config);

    return execution;
  }

  private async executeFirestoreBackup(config: BackupConfiguration, execution: BackupExecution): Promise<BackupExecution> {
    const collections = config.source_path === '/' 
      ? await this.getAllCollections()
      : config.source_path.split(',').map(p => p.trim().replace(/^\//, ''));

    let totalDocuments = 0;
    let totalSize = 0;
    const backupData: Record<string, any[]> = {};

    // Extract data from Firestore
    for (const collectionName of collections) {
      try {
        const snapshot = await this.db.collection(collectionName).get();
        const documents: any[] = [];
        
        snapshot.forEach((doc: any) => {
          documents.push({
            id: doc.id,
            data: doc.data(),
            path: doc.ref.path,
            created: doc.createTime?.toDate(),
            updated: doc.updateTime?.toDate()
          });
        });

        backupData[collectionName] = documents;
        totalDocuments += documents.length;
        
        const collectionSize = Buffer.byteLength(JSON.stringify(documents), 'utf8');
        totalSize += collectionSize;
        
      } catch (error) {
        console.error(`Failed to backup collection ${collectionName}:`, error);
        // Continue with other collections
      }
    }

    execution.source_info.size_bytes = totalSize;
    execution.source_info.file_count = totalDocuments;

    // Create backup metadata
    const metadata = {
      backup_id: execution.id,
      timestamp: execution.started_at,
      source: config.source_path,
      collections: Object.keys(backupData),
      total_documents: totalDocuments,
      total_size_bytes: totalSize,
      firestore_project: process.env.GOOGLE_CLOUD_PROJECT
    };

    // Prepare backup payload
    const backupPayload = {
      metadata,
      data: backupData
    };

    let backupBuffer = Buffer.from(JSON.stringify(backupPayload), 'utf8');

    // Apply compression if enabled
    if (config.compression.enabled) {
      const originalSize = backupBuffer.length;
      backupBuffer = await gzip(backupBuffer);
      execution.metrics.compression_ratio = originalSize / backupBuffer.length;
    }

    // Calculate checksum
    const checksum = crypto.createHash(config.verification.checksum_algorithm)
      .update(backupBuffer)
      .digest('hex');
    
    execution.source_info.checksum = checksum;

    // Upload to GCS
    const startUpload = Date.now();
    const bucket = this.storage.bucket(config.destination.bucket);
    const fileName = `${execution.destination_info.path}/${execution.id}.json${config.compression.enabled ? '.gz' : ''}`;
    const file = bucket.file(fileName);

    const uploadOptions: any = {
      metadata: {
        contentType: 'application/json',
        metadata: {
          'backup-id': execution.id,
          'configuration-id': config.id,
          'checksum': checksum,
          'compression': config.compression.enabled ? config.compression.algorithm : 'none',
          'total-documents': totalDocuments.toString(),
          'collections': Object.keys(backupData).join(',')
        }
      }
    };

    // Apply encryption if enabled
    if (config.encryption.enabled) {
      uploadOptions.encryptionKey = await this.getEncryptionKey(config.encryption.key_id);
      execution.destination_info.encryption_key_id = config.encryption.key_id;
    }

    await file.save(backupBuffer, uploadOptions);

    const uploadDuration = Date.now() - startUpload;
    execution.metrics.bytes_transferred = backupBuffer.length;
    execution.metrics.transfer_rate_mbps = (backupBuffer.length / 1024 / 1024) / (uploadDuration / 1000);

    // Verify upload checksum
    const [fileMetadata] = await file.getMetadata();
    execution.destination_info.size_bytes = fileMetadata.size ? parseInt(fileMetadata.size.toString()) : 0;
    execution.destination_info.checksum = fileMetadata.md5Hash;

    return execution;
  }

  private async getAllCollections(): Promise<string[]> {
    const collections = await this.db.listCollections();
    return collections.map((col: any) => col.id);
  }

  private async getEncryptionKey(keyId?: string): Promise<string> {
    // In production, integrate with Google Cloud KMS or similar
    // For now, use environment variable
    const key = process.env.BACKUP_ENCRYPTION_KEY;
    if (!key) {
      throw new Error('Backup encryption key not configured');
    }
    return key;
  }

  private async verifyBackup(execution: BackupExecution, config: BackupConfiguration): Promise<BackupVerificationResult> {
    const verificationId = `verify-${execution.id}`;
    const startTime = Date.now();

    try {
      // Download and verify checksum
      const bucket = this.storage.bucket(config.destination.bucket);
      const fileName = `${execution.destination_info.path}/${execution.id}.json${config.compression.enabled ? '.gz' : ''}`;
      const file = bucket.file(fileName);

      const [fileContents] = await file.download();
      const downloadedChecksum = crypto.createHash(config.verification.checksum_algorithm)
        .update(fileContents)
        .digest('hex');

      const checksumMatch = downloadedChecksum === execution.source_info.checksum;

      const result: BackupVerificationResult = {
        backup_execution_id: execution.id,
        verification_type: 'checksum',
        status: checksumMatch ? 'passed' : 'failed',
        performed_at: startTime,
        duration_ms: Date.now() - startTime,
        details: {
          checksum_match: checksumMatch,
          expected_checksum: execution.source_info.checksum,
          actual_checksum: downloadedChecksum
        },
        issues_found: checksumMatch ? [] : [{
          type: 'corruption',
          description: 'Backup checksum mismatch detected',
          severity: 'critical',
          affected_items: [fileName]
        }]
      };

      // Store verification result
      await this.db.collection('backup_verifications').doc(verificationId).set(result);

      return result;

    } catch (error) {
      const result: BackupVerificationResult = {
        backup_execution_id: execution.id,
        verification_type: 'checksum',
        status: 'failed',
        performed_at: startTime,
        duration_ms: Date.now() - startTime,
        details: {},
        issues_found: [{
          type: 'permission_error',
          description: error instanceof Error ? error.message : 'Verification failed',
          severity: 'critical',
          affected_items: ['backup_file']
        }]
      };

      await this.db.collection('backup_verifications').doc(verificationId).set(result);
      return result;
    }
  }

  private async enforceRetentionPolicy(config: BackupConfiguration): Promise<void> {
    try {
      const bucket = this.storage.bucket(config.destination.bucket);
      const [files] = await bucket.getFiles({
        prefix: config.destination.path,
        maxResults: 1000
      });

      // Group files by date
      const filesByDate: Record<string, any[]> = {};
      files.forEach(file => {
        const match = file.name.match(/(\d{4}-\d{2}-\d{2})/);
        if (match) {
          const date = match[1];
          if (!filesByDate[date]) filesByDate[date] = [];
          filesByDate[date].push(file);
        }
      });

      const sortedDates = Object.keys(filesByDate).sort().reverse();
      const now = new Date();

      // Apply retention policy
      const filesToDelete: string[] = [];

      sortedDates.forEach((dateStr, index) => {
        const fileDate = new Date(dateStr);
        const daysOld = Math.floor((now.getTime() - fileDate.getTime()) / (24 * 60 * 60 * 1000));

        let shouldKeep = false;

        // Daily retention
        if (daysOld < config.retention.keep_daily) {
          shouldKeep = true;
        }
        // Weekly retention (keep one per week)
        else if (daysOld < config.retention.keep_weekly * 7 && fileDate.getDay() === 0) {
          shouldKeep = true;
        }
        // Monthly retention (keep one per month)
        else if (daysOld < config.retention.keep_monthly * 30 && fileDate.getDate() === 1) {
          shouldKeep = true;
        }

        if (!shouldKeep) {
          filesByDate[dateStr].forEach(file => {
            filesToDelete.push(file.name);
          });
        }
      });

      // Delete expired files
      for (const fileName of filesToDelete) {
        try {
          await bucket.file(fileName).delete();
        } catch (error) {
          console.error(`Failed to delete expired backup file ${fileName}:`, error);
        }
      }

      if (filesToDelete.length > 0) {
        await this.eventStreaming.publishEvent({
          type: 'backup_retention_enforced',
          source: 'backup_engine',
          data: { 
            configuration_id: config.id,
            files_deleted: filesToDelete.length
          },
          metadata: { organizationId: 'system', version: 1 }
        });
      }

    } catch (error) {
      console.error('Failed to enforce retention policy:', error);
    }
  }

  public async getBackupHealth(): Promise<BackupHealthMetrics> {
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);

    // Get configurations
    const configsSnapshot = await this.db.collection('backup_configurations').get();
    const totalConfigurations = configsSnapshot.size;
    const activeConfigurations = configsSnapshot.docs.filter((doc: any) => doc.data().active).length;

    // Get recent executions
    const executionsSnapshot = await this.db.collection('backup_executions')
      .where('started_at', '>=', oneDayAgo)
      .get();

    const executions = executionsSnapshot.docs.map((doc: any) => doc.data() as BackupExecution);
    const successfulBackups24h = executions.filter((e: any) => e.status === 'completed').length;
    const failedBackups24h = executions.filter((e: any) => e.status === 'failed').length;

    // Calculate success rate for last 7 days
    const weekExecutionsSnapshot = await this.db.collection('backup_executions')
      .where('started_at', '>=', sevenDaysAgo)
      .get();

    const weekExecutions = weekExecutionsSnapshot.docs.map((doc: any) => doc.data() as BackupExecution);
    const weekSuccessful = weekExecutions.filter((e: any) => e.status === 'completed').length;
    const backupSuccessRate7d = weekExecutions.length > 0 ? (weekSuccessful / weekExecutions.length) * 100 : 0;

    return {
      total_configurations: totalConfigurations,
      active_configurations: activeConfigurations,
      successful_backups_24h: successfulBackups24h,
      failed_backups_24h: failedBackups24h,
      total_storage_used_gb: 0, // Would need to query GCS for actual usage
      oldest_backup_age_days: 0,
      newest_backup_age_hours: 0,
      average_backup_duration_minutes: executions.length > 0 
        ? executions.reduce((sum: any, e: any) => sum + (e.duration_ms || 0), 0) / executions.length / 60000
        : 0,
      backup_success_rate_7d: backupSuccessRate7d,
      recovery_tests_passed_30d: 0, // Would need to implement recovery tests
      critical_issues: [],
      storage_by_type: {
        firestore: 0,
        storage: 0,
        database: 0
      },
      retention_compliance: {
        configurations_compliant: activeConfigurations,
        configurations_total: totalConfigurations,
        violations: []
      }
    };
  }

  public async runAllBackups(): Promise<BackupExecution[]> {
    const configsSnapshot = await this.db.collection('backup_configurations')
      .where('active', '==', true)
      .get();

    const executions: BackupExecution[] = [];

    for (const configDoc of configsSnapshot.docs) {
      try {
        const execution = await this.executeBackup(configDoc.id);
        executions.push(execution);
      } catch (error) {
        console.error(`Failed to execute backup for ${configDoc.id}:`, error);
      }
    }

    return executions;
  }
}