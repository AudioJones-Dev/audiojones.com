'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface BackupJob {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  started_at: string;
  completed_at?: string;
  export_path?: string;
  backup_size_bytes?: number;
  collection_count?: number;
  document_count?: number;
  error_message?: string;
  metadata: {
    trigger: string;
    triggered_by: string;
    backup_type: string;
  };
}

interface RestoreJob {
  id: string;
  backup_id: string;
  target_environment: 'staging' | 'production';
  status: 'pending' | 'running' | 'completed' | 'failed';
  started_at: string;
  completed_at?: string;
  restored_collections: string[];
  restored_documents: number;
  error_message?: string;
  metadata: {
    trigger: string;
    triggered_by: string;
    restore_type: string;
  };
}

interface BackupMetrics {
  total_backups: number;
  successful_backups: number;
  failed_backups: number;
  last_backup_date: string | null;
  average_backup_size: number;
  retention_compliance: number;
}

interface DashboardData {
  metrics: BackupMetrics;
  recent_backups: BackupJob[];
  recent_restores: RestoreJob[];
  system_status: {
    backup_enabled: boolean;
    next_scheduled_backup: string;
    gcs_bucket_status: string;
    retention_days: number;
  };
}

export default function BackupDRPage() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [backupJobs, setBackupJobs] = useState<BackupJob[]>([]);
  const [restoreJobs, setRestoreJobs] = useState<RestoreJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'backups' | 'restores' | 'disaster'>('dashboard');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const token = await user?.getIdToken();
      if (!token) return;

      const [dashboardRes, backupsRes, restoresRes] = await Promise.all([
        fetch('/api/admin/backup?view=dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/admin/backup?view=jobs&limit=20', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/admin/backup?view=restores&limit=10', {
          headers: { Authorization: `Bearer ${token}` }
        }),
      ]);

      if (dashboardRes.ok) {
        const dashboardData = await dashboardRes.json();
        setDashboard(dashboardData.dashboard);
      }

      if (backupsRes.ok) {
        const backupsData = await backupsRes.json();
        setBackupJobs(backupsData.jobs);
      }

      if (restoresRes.ok) {
        const restoresData = await restoresRes.json();
        setRestoreJobs(restoresData.jobs);
      }
    } catch (error) {
      console.error('Failed to fetch backup data:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeSystem = async () => {
    if (!user) return;
    
    setProcessing(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/admin/backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ action: 'initialize' })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('System initialized:', result);
        await fetchDashboardData();
        alert('Backup & DR system initialized successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Failed to initialize system:', error);
      alert('Failed to initialize backup system');
    }
    setProcessing(false);
  };

  const createBackup = async (trigger: string = 'manual') => {
    if (!user) return;
    
    setProcessing(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/admin/backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'create_backup',
          trigger,
          triggered_by: user.email || 'admin'
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Backup created:', result);
        await fetchDashboardData();
        alert(`Backup job created successfully: ${result.job.id}`);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Failed to create backup:', error);
      alert('Failed to create backup');
    }
    setProcessing(false);
  };

  const restoreToStaging = async (backupId: string) => {
    if (!user) return;
    
    const confirmRestore = confirm(`Are you sure you want to restore backup ${backupId} to staging environment? This will overwrite staging data.`);
    if (!confirmRestore) return;

    setProcessing(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/admin/backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'restore_to_staging',
          backup_id: backupId,
          triggered_by: user.email || 'admin'
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Staging restore started:', result);
        await fetchDashboardData();
        alert(`Staging restore job created: ${result.job.id}`);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Failed to restore to staging:', error);
      alert('Failed to restore to staging');
    }
    setProcessing(false);
  };

  const executeDisasterRecovery = async (backupId: string) => {
    if (!user) return;
    
    const confirmDR = confirm(`🚨 DISASTER RECOVERY INITIATION 🚨\n\nThis will:\n1. Restore backup ${backupId} to staging\n2. Run validation tests\n3. Prepare for production restore\n\nAre you absolutely sure?`);
    if (!confirmDR) return;

    setProcessing(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/admin/backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'disaster_recovery',
          backup_id: backupId,
          triggered_by: user.email || 'admin'
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Disaster recovery initiated:', result);
        await fetchDashboardData();
        alert(`🚨 DISASTER RECOVERY INITIATED\n\nStaging restore completed: ${result.job.id}\n\n⚠️ Manual intervention required for production restore`);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Failed to execute disaster recovery:', error);
      alert('Failed to execute disaster recovery');
    }
    setProcessing(false);
  };

  const cleanupOldBackups = async () => {
    if (!user) return;
    
    const confirmCleanup = confirm('This will delete backups older than the retention period. Continue?');
    if (!confirmCleanup) return;

    setProcessing(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/admin/backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ action: 'cleanup_old' })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Cleanup completed:', result);
        await fetchDashboardData();
        alert(`Cleanup completed: ${result.result.deleted} backups deleted, ${result.result.errors} errors`);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Failed to cleanup backups:', error);
      alert('Failed to cleanup backups');
    }
    setProcessing(false);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'running': return 'text-blue-400';
      case 'pending': return 'text-yellow-400';
      case 'failed': return 'text-red-400';
      default: return 'text-text-muted';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Backup & Disaster Recovery</h1>
        <p className="text-text-muted">
          Automated Firestore backups with GCS storage and staging restore capabilities
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6">
        {[
          { key: 'dashboard', label: 'Dashboard' },
          { key: 'backups', label: 'Backup Jobs' },
          { key: 'restores', label: 'Restore Jobs' },
          { key: 'disaster', label: 'Disaster Recovery' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-white text-black'
                : 'bg-gray-800 text-text-primary hover:bg-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && dashboard && (
        <div className="space-y-6">
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={initializeSystem}
              disabled={processing}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {processing ? 'Initializing...' : 'Initialize System'}
            </button>
            <button
              onClick={() => createBackup('manual')}
              disabled={processing}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {processing ? 'Creating...' : 'Create Backup Now'}
            </button>
            <button
              onClick={cleanupOldBackups}
              disabled={processing}
              className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {processing ? 'Cleaning...' : 'Cleanup Old Backups'}
            </button>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="text-sm font-medium text-text-muted mb-2">Total Backups</h3>
              <div className="text-2xl font-bold text-white">{dashboard.metrics.total_backups}</div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="text-sm font-medium text-text-muted mb-2">Success Rate</h3>
              <div className="text-2xl font-bold text-green-400">
                {dashboard.metrics.total_backups > 0 
                  ? Math.round((dashboard.metrics.successful_backups / dashboard.metrics.total_backups) * 100)
                  : 0}%
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="text-sm font-medium text-text-muted mb-2">Avg Backup Size</h3>
              <div className="text-2xl font-bold text-white">
                {formatBytes(dashboard.metrics.average_backup_size)}
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="text-sm font-medium text-text-muted mb-2">Last Backup</h3>
              <div className="text-2xl font-bold text-white">
                {dashboard.metrics.last_backup_date 
                  ? new Date(dashboard.metrics.last_backup_date).toLocaleDateString()
                  : 'Never'}
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-text-muted">Backup Enabled: </span>
                <span className={dashboard.system_status.backup_enabled ? 'text-green-400' : 'text-red-400'}>
                  {dashboard.system_status.backup_enabled ? 'Yes' : 'No'}
                </span>
              </div>
              <div>
                <span className="text-text-muted">GCS Bucket: </span>
                <span className="text-green-400">{dashboard.system_status.gcs_bucket_status}</span>
              </div>
              <div>
                <span className="text-text-muted">Retention: </span>
                <span className="text-white">{dashboard.system_status.retention_days} days</span>
              </div>
              <div>
                <span className="text-text-muted">Next Backup: </span>
                <span className="text-white">
                  {new Date(dashboard.system_status.next_scheduled_backup).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Backups */}
            <div className="bg-gray-800 rounded-lg border border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-white">Recent Backups</h3>
              </div>
              <div className="p-6">
                {dashboard.recent_backups.length > 0 ? (
                  <div className="space-y-3">
                    {dashboard.recent_backups.slice(0, 5).map((backup) => (
                      <div key={backup.id} className="flex justify-between items-center">
                        <div>
                          <div className="text-white font-medium">{backup.id}</div>
                          <div className="text-sm text-text-muted">
                            {new Date(backup.started_at).toLocaleString()}
                          </div>
                        </div>
                        <div className={`text-sm font-medium ${getStatusColor(backup.status)}`}>
                          {backup.status}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-text-muted">No backups yet</div>
                )}
              </div>
            </div>

            {/* Recent Restores */}
            <div className="bg-gray-800 rounded-lg border border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-white">Recent Restores</h3>
              </div>
              <div className="p-6">
                {dashboard.recent_restores.length > 0 ? (
                  <div className="space-y-3">
                    {dashboard.recent_restores.map((restore) => (
                      <div key={restore.id} className="flex justify-between items-center">
                        <div>
                          <div className="text-white font-medium">{restore.target_environment}</div>
                          <div className="text-sm text-text-muted">
                            {new Date(restore.started_at).toLocaleString()}
                          </div>
                        </div>
                        <div className={`text-sm font-medium ${getStatusColor(restore.status)}`}>
                          {restore.status}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-text-muted">No restores yet</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backup Jobs Tab */}
      {activeTab === 'backups' && (
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">Backup Jobs</h3>
            <p className="text-sm text-text-muted mt-1">All backup operations and their status</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Job ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Started
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Collections
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {backupJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-mono">
                      {job.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                      {new Date(job.started_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                      {job.backup_size_bytes ? formatBytes(job.backup_size_bytes) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                      {job.collection_count || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {job.status === 'completed' && (
                        <button
                          onClick={() => restoreToStaging(job.id)}
                          disabled={processing}
                          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-3 py-1 rounded text-xs"
                        >
                          Restore to Staging
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Restore Jobs Tab */}
      {activeTab === 'restores' && (
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white">Restore Jobs</h3>
            <p className="text-sm text-text-muted mt-1">All restore operations and their status</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Job ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Backup ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Environment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Started
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                    Documents
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {restoreJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-mono">
                      {job.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary font-mono">
                      {job.backup_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        job.target_environment === 'staging' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {job.target_environment}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                      {new Date(job.started_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                      {job.restored_documents.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Disaster Recovery Tab */}
      {activeTab === 'disaster' && (
        <div className="space-y-6">
          <div className="bg-red-900 border border-red-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-100 mb-4">⚠️ Disaster Recovery Procedures</h3>
            <div className="text-red-200 space-y-2">
              <p>1. Select a completed backup from the list below</p>
              <p>2. Click "Initiate Disaster Recovery" to start the process</p>
              <p>3. System will restore to staging and run validation tests</p>
              <p>4. Manual intervention required for production restore</p>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-white">Available Backups for Recovery</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                      Backup ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                      Collections
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {backupJobs.filter(job => job.status === 'completed').map((job) => (
                    <tr key={job.id} className="hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-mono">
                        {job.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                        {new Date(job.started_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                        {job.backup_size_bytes ? formatBytes(job.backup_size_bytes) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                        {job.collection_count || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          onClick={() => restoreToStaging(job.id)}
                          disabled={processing}
                          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-3 py-1 rounded text-xs"
                        >
                          Test Restore
                        </button>
                        <button
                          onClick={() => executeDisasterRecovery(job.id)}
                          disabled={processing}
                          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-3 py-1 rounded text-xs"
                        >
                          🚨 Initiate DR
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}