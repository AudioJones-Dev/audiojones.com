'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface SecretConfig {
  name: string;
  type: string;
  description: string;
  rotation_frequency_days: number;
  dual_accept_window_hours: number;
  external_sync?: Record<string, boolean>;
  validation_endpoint?: string;
  rollback_threshold_minutes?: number;
  created_at?: string;
  last_rotation?: string;
  next_rotation_due?: string;
  days_until_rotation?: number;
}

interface RotationJob {
  id: string;
  secret_name: string;
  status: string;
  created_at: string;
  started_at?: string;
  completed_at?: string;
  dual_accept_started?: string;
  dual_accept_ends?: string;
  initiated_by: string;
  error?: string;
  validation_results?: {
    endpoint_tested?: boolean;
    external_sync_status?: Record<string, boolean>;
    rollback_triggered?: boolean;
  };
}

interface SecretMetrics {
  total_secrets: number;
  pending_rotations: number;
  overdue_rotations: number;
  failed_rotations_24h: number;
  average_rotation_time_minutes: number;
  dual_accept_active: number;
  compliance_score: number;
  last_rotation_check: string;
}

interface HealthIndicator {
  score: number;
  status: 'good' | 'warning' | 'critical';
  details: string;
}

export default function SecretsPage() {
  const { user, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'secrets' | 'jobs' | 'audit' | 'health'>('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dashboard data
  const [metrics, setMetrics] = useState<SecretMetrics | null>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [healthStatus, setHealthStatus] = useState<any>(null);

  // Secrets data
  const [secrets, setSecrets] = useState<SecretConfig[]>([]);

  // Jobs data
  const [jobs, setJobs] = useState<RotationJob[]>([]);

  // Audit data
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Health data
  const [healthIndicators, setHealthIndicators] = useState<Record<string, HealthIndicator>>({});
  const [overallHealth, setOverallHealth] = useState<{ score: number; status: string } | null>(null);

  // Action states
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedSecret, setSelectedSecret] = useState<string>('');
  const [forceRotation, setForceRotation] = useState(false);
  const [rollbackReason, setRollbackReason] = useState('');
  const [selectedJob, setSelectedJob] = useState<string>('');

  const fetchData = async (view: string) => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const token = await user.getIdToken();
      const response = await fetch(`/api/admin/secrets?view=${view}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Unknown error');
      }

      switch (view) {
        case 'dashboard':
          setMetrics(data.dashboard.metrics);
          setRecentActivity(data.dashboard.recent_activity);
          setHealthStatus(data.dashboard.health_status);
          break;
        case 'secrets':
          setSecrets(data.secrets);
          break;
        case 'jobs':
          setJobs(data.jobs);
          break;
        case 'audit':
          setAuditLogs(data.audit_logs);
          break;
        case 'health':
          setHealthIndicators(data.health.indicators);
          setOverallHealth({
            score: data.health.overall_score,
            status: data.health.overall_status
          });
          break;
      }

    } catch (error) {
      console.error(`Failed to fetch ${view} data:`, error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const executeAction = async (action: string, payload: any = {}) => {
    if (!user) return;

    try {
      setActionLoading(action);
      setError(null);

      const token = await user.getIdToken();
      const response = await fetch('/api/admin/secrets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action, ...payload })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Action failed');
      }

      // Refresh current view
      await fetchData(activeTab);

      // Clear form states
      setSelectedSecret('');
      setForceRotation(false);
      setRollbackReason('');
      setSelectedJob('');

      return data;

    } catch (error) {
      console.error(`Action ${action} failed:`, error);
      setError(error instanceof Error ? error.message : 'Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    if (user && !authLoading) {
      fetchData(activeTab);
    }
  }, [user, authLoading, activeTab]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'dual_accept': return 'text-yellow-400';
      case 'in_progress': return 'text-blue-400';
      case 'failed': case 'rolled_back': return 'text-red-400';
      default: return 'text-text-muted';
    }
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'good': case 'healthy': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-text-muted';
    }
  };

  const formatDuration = (start: string, end?: string) => {
    const startTime = new Date(start).getTime();
    const endTime = end ? new Date(end).getTime() : Date.now();
    const minutes = Math.round((endTime - startTime) / (1000 * 60));
    
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">🔐 Secrets Rotation</h1>
          <p className="text-text-muted">Zero-downtime secret rotation with dual-accept windows and audit ledger</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
            <p className="text-red-400">❌ {error}</p>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-gray-800/50 rounded-lg p-1">
          {[
            { id: 'dashboard', label: '📊 Dashboard' },
            { id: 'secrets', label: '🔑 Secrets' },
            { id: 'jobs', label: '⚙️ Jobs' },
            { id: 'audit', label: '📋 Audit' },
            { id: 'health', label: '🏥 Health' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-black'
                  : 'text-text-primary hover:text-white hover:bg-gray-700/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Metrics Cards */}
            {metrics && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-800/50 rounded-lg p-6">
                  <h3 className="text-sm font-medium text-text-muted mb-2">Total Secrets</h3>
                  <p className="text-2xl font-bold">{metrics.total_secrets}</p>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-6">
                  <h3 className="text-sm font-medium text-text-muted mb-2">Compliance Score</h3>
                  <p className={`text-2xl font-bold ${getHealthColor(healthStatus?.overall || 'good')}`}>
                    {metrics.compliance_score}%
                  </p>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-6">
                  <h3 className="text-sm font-medium text-text-muted mb-2">Overdue Rotations</h3>
                  <p className={`text-2xl font-bold ${metrics.overdue_rotations > 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {metrics.overdue_rotations}
                  </p>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-6">
                  <h3 className="text-sm font-medium text-text-muted mb-2">Active Rotations</h3>
                  <p className="text-2xl font-bold text-blue-400">{metrics.pending_rotations}</p>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-gray-800/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">🚀 Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => executeAction('initialize')}
                  disabled={actionLoading === 'initialize'}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg font-medium transition-colors"
                >
                  {actionLoading === 'initialize' ? '⏳ Initializing...' : '🔧 Initialize System'}
                </button>
                
                <button
                  onClick={() => executeAction('check_schedule')}
                  disabled={actionLoading === 'check_schedule'}
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 rounded-lg font-medium transition-colors"
                >
                  {actionLoading === 'check_schedule' ? '⏳ Checking...' : '📅 Check Schedule'}
                </button>
                
                <button
                  onClick={() => executeAction('auto_rotate_overdue')}
                  disabled={actionLoading === 'auto_rotate_overdue'}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 rounded-lg font-medium transition-colors"
                >
                  {actionLoading === 'auto_rotate_overdue' ? '⏳ Rotating...' : '🔄 Auto-Rotate Overdue'}
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            {recentActivity.length > 0 && (
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">📈 Recent Activity</h3>
                <div className="space-y-3">
                  {recentActivity.slice(0, 5).map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-700/50 last:border-b-0">
                      <div>
                        <p className="font-medium">{activity.details}</p>
                        <p className="text-sm text-text-muted">
                          {activity.action} • {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${activity.success ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                        {activity.success ? '✅' : '❌'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Secrets Tab */}
        {activeTab === 'secrets' && (
          <div className="space-y-6">
            {/* Manual Rotation */}
            <div className="bg-gray-800/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">🔄 Manual Rotation</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  value={selectedSecret}
                  onChange={(e) => setSelectedSecret(e.target.value)}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                >
                  <option value="">Select secret...</option>
                  {secrets.map((secret) => (
                    <option key={secret.name} value={secret.name}>
                      {secret.name} ({secret.type})
                    </option>
                  ))}
                </select>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={forceRotation}
                    onChange={(e) => setForceRotation(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-600 bg-gray-700"
                  />
                  <span className="text-sm">Force rotation</span>
                </label>
                
                <button
                  onClick={() => executeAction('rotate_secret', { secret_name: selectedSecret, force: forceRotation })}
                  disabled={!selectedSecret || actionLoading === 'rotate_secret'}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-lg font-medium transition-colors"
                >
                  {actionLoading === 'rotate_secret' ? '⏳ Rotating...' : '🔄 Start Rotation'}
                </button>
              </div>
            </div>

            {/* Secrets List */}
            <div className="bg-gray-800/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">🔑 Secrets Configuration</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4">Name</th>
                      <th className="text-left py-3 px-4">Type</th>
                      <th className="text-left py-3 px-4">Description</th>
                      <th className="text-left py-3 px-4">Frequency</th>
                      <th className="text-left py-3 px-4">Last Rotation</th>
                      <th className="text-left py-3 px-4">Next Due</th>
                      <th className="text-left py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {secrets.map((secret) => (
                      <tr key={secret.name} className="border-b border-gray-700/50">
                        <td className="py-3 px-4 font-medium">{secret.name}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-gray-700 rounded text-xs">
                            {secret.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-text-primary">{secret.description}</td>
                        <td className="py-3 px-4">{secret.rotation_frequency_days}d</td>
                        <td className="py-3 px-4 text-text-muted">
                          {secret.last_rotation 
                            ? new Date(secret.last_rotation).toLocaleDateString()
                            : 'Never'
                          }
                        </td>
                        <td className="py-3 px-4">
                          {secret.next_rotation_due && (
                            <span className={secret.days_until_rotation != null && secret.days_until_rotation < 0 ? 'text-red-400' : 'text-text-primary'}>
                              {secret.days_until_rotation != null
                                ? `${Math.abs(secret.days_until_rotation)}d ${secret.days_until_rotation < 0 ? 'overdue' : 'remaining'}`
                                : 'Not scheduled'
                              }
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {secret.days_until_rotation != null && secret.days_until_rotation < 0 ? (
                            <span className="px-2 py-1 bg-red-900/30 text-red-400 rounded text-xs">
                              ⚠️ Overdue
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded text-xs">
                              ✅ Current
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            {/* Rollback Control */}
            <div className="bg-gray-800/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">🔙 Rollback Control</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select
                  value={selectedJob}
                  onChange={(e) => setSelectedJob(e.target.value)}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                >
                  <option value="">Select job...</option>
                  {jobs.filter(job => ['dual_accept', 'completed'].includes(job.status)).map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.secret_name} - {job.status} ({new Date(job.created_at).toLocaleDateString()})
                    </option>
                  ))}
                </select>
                
                <input
                  type="text"
                  placeholder="Rollback reason..."
                  value={rollbackReason}
                  onChange={(e) => setRollbackReason(e.target.value)}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
                
                <button
                  onClick={() => executeAction('rollback_rotation', { job_id: selectedJob, reason: rollbackReason })}
                  disabled={!selectedJob || !rollbackReason || actionLoading === 'rollback_rotation'}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 rounded-lg font-medium transition-colors"
                >
                  {actionLoading === 'rollback_rotation' ? '⏳ Rolling back...' : '🔙 Rollback'}
                </button>
              </div>
            </div>

            {/* Jobs List */}
            <div className="bg-gray-800/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">⚙️ Rotation Jobs</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4">Secret</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Created</th>
                      <th className="text-left py-3 px-4">Duration</th>
                      <th className="text-left py-3 px-4">Dual Accept</th>
                      <th className="text-left py-3 px-4">Initiated By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job) => (
                      <tr key={job.id} className="border-b border-gray-700/50">
                        <td className="py-3 px-4 font-medium">{job.secret_name}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(job.status)}`}>
                            {job.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-text-muted">
                          {new Date(job.created_at).toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          {job.started_at ? formatDuration(job.started_at, job.completed_at) : '-'}
                        </td>
                        <td className="py-3 px-4">
                          {job.dual_accept_started && job.dual_accept_ends ? (
                            <div className="text-xs">
                              <div className="text-yellow-400">
                                {formatDuration(job.dual_accept_started, job.dual_accept_ends)}
                              </div>
                              <div className="text-text-muted">
                                until {new Date(job.dual_accept_ends).toLocaleTimeString()}
                              </div>
                            </div>
                          ) : '-'}
                        </td>
                        <td className="py-3 px-4 text-text-muted">{job.initiated_by}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Audit Tab */}
        {activeTab === 'audit' && (
          <div className="bg-gray-800/50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">📋 Audit Trail</h3>
            <div className="space-y-4">
              {auditLogs.map((log, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-gray-700/30 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${log.success ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">{log.details}</h4>
                      <span className="text-xs text-text-muted">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm text-text-muted">
                      <span className="capitalize">{log.action}</span>
                      {log.user_id && ` • by ${log.user_id}`}
                      {log.error && ` • Error: ${log.error}`}
                    </div>
                    {log.metadata && (
                      <div className="mt-2 text-xs text-text-muted">
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(log.metadata, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Health Tab */}
        {activeTab === 'health' && (
          <div className="space-y-6">
            {/* Overall Health */}
            {overallHealth && (
              <div className="bg-gray-800/50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">🏥 System Health</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`text-2xl font-bold ${getHealthColor(overallHealth.status)}`}>
                      {overallHealth.score}%
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getHealthColor(overallHealth.status)}`}>
                      {overallHealth.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Health Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(healthIndicators).map(([key, indicator]) => (
                <div key={key} className="bg-gray-800/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium capitalize">{key.replace('_', ' ')}</h4>
                    <span className={`text-lg font-bold ${getHealthColor(indicator.status)}`}>
                      {indicator.score}%
                    </span>
                  </div>
                  <p className="text-sm text-text-muted">{indicator.details}</p>
                  <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        indicator.status === 'good' ? 'bg-green-400' :
                        indicator.status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
                      }`}
                      style={{ width: `${indicator.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}