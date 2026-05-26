/**
 * Backup & Disaster Recovery Types
 * 
 * Type definitions for automated backup system with GCS integration,
 * disaster recovery automation, and backup verification processes.
 */

export interface BackupConfiguration {
  id: string;
  name: string;
  description: string;
  source_type: 'firestore' | 'storage' | 'database' | 'configuration';
  source_path: string;
  destination: {
    provider: 'gcs' | 'object_storage' | 'local';
    bucket: string;
    path: string;
    region?: string;
  };
  schedule: {
    frequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
    time?: string; // HH:MM format for daily/weekly/monthly
    day_of_week?: number; // 0-6 for weekly
    day_of_month?: number; // 1-31 for monthly
  };
  retention: {
    keep_daily: number; // number of daily backups to keep
    keep_weekly: number; // number of weekly backups to keep
    keep_monthly: number; // number of monthly backups to keep
  };
  encryption: {
    enabled: boolean;
    key_id?: string;
    algorithm?: 'AES256' | 'AES256-GCM';
  };
  compression: {
    enabled: boolean;
    algorithm?: 'gzip' | 'brotli';
  };
  verification: {
    enabled: boolean;
    checksum_algorithm: 'sha256' | 'md5';
    auto_restore_test: boolean;
  };
  active: boolean;
  created_at: number;
  updated_at: number;
  created_by: string;
}

export interface BackupExecution {
  id: string;
  configuration_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  started_at: number;
  completed_at?: number;
  duration_ms?: number;
  source_info: {
    type: string;
    path: string;
    size_bytes: number;
    file_count?: number;
    checksum?: string;
  };
  destination_info: {
    provider: string;
    bucket: string;
    path: string;
    size_bytes?: number;
    checksum?: string;
    encryption_key_id?: string;
  };
  metrics: {
    bytes_transferred: number;
    compression_ratio?: number;
    transfer_rate_mbps?: number;
    verification_passed?: boolean;
  };
  error_details?: {
    error_code: string;
    error_message: string;
    stack_trace?: string;
    retry_count: number;
  };
  created_at: number;
}

export interface RestoreRequest {
  id: string;
  backup_execution_id: string;
  restore_type: 'full' | 'partial' | 'test';
  destination: {
    type: 'firestore' | 'storage' | 'database';
    path: string;
    overwrite: boolean;
  };
  filters?: {
    collections?: string[];
    documents?: string[];
    date_range?: {
      start: number;
      end: number;
    };
  };
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  started_at: number;
  completed_at?: number;
  duration_ms?: number;
  restored_items: {
    collections: number;
    documents: number;
    files: number;
    total_size_bytes: number;
  };
  verification_results?: {
    checksum_match: boolean;
    data_integrity_check: boolean;
    functional_test_passed?: boolean;
  };
  error_details?: {
    error_code: string;
    error_message: string;
    stack_trace?: string;
  };
  requested_by: string;
  created_at: number;
}

export interface DisasterRecoveryPlan {
  id: string;
  name: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  trigger_conditions: {
    manual_activation: boolean;
    auto_triggers: Array<{
      type: 'service_down' | 'data_corruption' | 'security_breach' | 'high_error_rate';
      threshold?: number;
      duration_minutes?: number;
    }>;
  };
  recovery_steps: Array<{
    id: string;
    name: string;
    description: string;
    type: 'backup_restore' | 'service_restart' | 'traffic_redirect' | 'manual_intervention';
    order: number;
    timeout_minutes: number;
    parameters: Record<string, any>;
    rollback_possible: boolean;
  }>;
  estimated_rto: number; // Recovery Time Objective in minutes
  estimated_rpo: number; // Recovery Point Objective in minutes
  communication_plan: {
    stakeholders: string[];
    notification_channels: string[];
    status_page_update: boolean;
  };
  testing_schedule: {
    frequency: 'monthly' | 'quarterly' | 'biannually';
    last_tested: number;
    next_test: number;
  };
  active: boolean;
  created_at: number;
  updated_at: number;
  created_by: string;
}

export interface DisasterRecoveryExecution {
  id: string;
  plan_id: string;
  trigger_reason: string;
  trigger_type: 'manual' | 'automatic';
  status: 'initiated' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  started_at: number;
  completed_at?: number;
  total_duration_ms?: number;
  steps_executed: Array<{
    step_id: string;
    status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
    started_at: number;
    completed_at?: number;
    duration_ms?: number;
    output?: string;
    error_message?: string;
  }>;
  metrics: {
    actual_rto_minutes: number;
    actual_rpo_minutes?: number;
    services_restored: number;
    data_loss_detected: boolean;
  };
  communication_log: Array<{
    timestamp: number;
    channel: string;
    message: string;
    recipients: string[];
  }>;
  initiated_by: string;
  created_at: number;
}

export interface BackupHealthMetrics {
  total_configurations: number;
  active_configurations: number;
  successful_backups_24h: number;
  failed_backups_24h: number;
  total_storage_used_gb: number;
  oldest_backup_age_days: number;
  newest_backup_age_hours: number;
  average_backup_duration_minutes: number;
  backup_success_rate_7d: number;
  recovery_tests_passed_30d: number;
  critical_issues: Array<{
    type: 'backup_failure' | 'storage_full' | 'verification_failed' | 'retention_violation';
    message: string;
    count: number;
    first_seen: number;
    last_seen: number;
  }>;
  storage_by_type: Record<string, number>;
  retention_compliance: {
    configurations_compliant: number;
    configurations_total: number;
    violations: Array<{
      configuration_id: string;
      violation_type: string;
      severity: 'warning' | 'critical';
    }>;
  };
}

export interface BackupVerificationResult {
  backup_execution_id: string;
  verification_type: 'checksum' | 'integrity' | 'restore_test' | 'functional_test';
  status: 'passed' | 'failed' | 'warning';
  performed_at: number;
  duration_ms: number;
  details: {
    checksum_match?: boolean;
    expected_checksum?: string;
    actual_checksum?: string;
    data_integrity_score?: number;
    restore_success?: boolean;
    functional_tests_passed?: number;
    functional_tests_total?: number;
  };
  issues_found: Array<{
    type: 'corruption' | 'missing_data' | 'permission_error' | 'timeout';
    description: string;
    severity: 'warning' | 'critical';
    affected_items: string[];
  }>;
}