'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Bell, AlertTriangle, Info, X, RefreshCw, Eye, EyeOff, Trash2, Clock, Settings, CheckCircle } from 'lucide-react';

interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  category: string;
  status: 'active' | 'dismissed';
  created_at: string;
  created_by: string;
  dismissed_at?: string;
  dismissed_by?: string;
  updated_at?: string;
  metadata?: Record<string, any>;
  auto_dismiss_at?: string;
  needs_review?: boolean;
  reviewed?: boolean;
  auto_process?: boolean;
  auto_processed_at?: string;
  escalated?: boolean;
}

interface AlertStats {
  total: number;
  active: number;
  dismissed: number;
  critical: number;
  warning: number;
  info: number;
}

export default function AdminAlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [stats, setStats] = useState<AlertStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'dismissed'>('active');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAlert, setNewAlert] = useState({
    title: '',
    message: '',
    severity: 'info' as 'critical' | 'warning' | 'info',
    category: 'system',
    auto_dismiss_minutes: '',
  });
  const [testAlertLoading, setTestAlertLoading] = useState(false);
  const [processingAlerts, setProcessingAlerts] = useState<Set<string>>(new Set());
  const [autoProcessingAlerts, setAutoProcessingAlerts] = useState<Set<string>>(new Set());

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filter !== 'all') params.set('status', filter);
      if (severityFilter !== 'all') params.set('severity', severityFilter);
      params.set('limit', '100');

      const response = await fetch(`/api/_proxy/admin/alerts?${params}`, {
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      if (data.ok) {
        setAlerts(data.alerts);
        setStats(data.stats);
      } else {
        throw new Error(data.error || 'Failed to fetch alerts');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const dismissAlert = async (alertId: string) => {
    try {
      const response = await fetch(`/api/_proxy/admin/alerts/${alertId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'dismiss' }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      if (result.ok) {
        await fetchAlerts(); // Refresh the list
      } else {
        throw new Error(result.error || 'Failed to dismiss alert');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to dismiss alert');
    }
  };

  const createAlert = async () => {
    try {
      const response = await fetch('/api/_proxy/admin/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newAlert,
          auto_dismiss_minutes: newAlert.auto_dismiss_minutes ? parseInt(newAlert.auto_dismiss_minutes) : null,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      if (result.ok) {
        setNewAlert({
          title: '',
          message: '',
          severity: 'info',
          category: 'system',
          auto_dismiss_minutes: '',
        });
        setShowCreateForm(false);
        await fetchAlerts(); // Refresh the list
      } else {
        throw new Error(result.error || 'Failed to create alert');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create alert');
    }
  };

  const processAlert = async (alertId: string) => {
    try {
      setProcessingAlerts(prev => new Set(prev).add(alertId));
      
      const response = await fetch('/api/_proxy/admin/alerts/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ alertId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      if (result.ok) {
        alert(`✅ Alert processed successfully!\n\nActions executed:\n${result.actionsRun.join('\n')}`);
        await fetchAlerts(); // Refresh the list
      } else {
        throw new Error(result.error || 'Failed to process alert');
      }
    } catch (err) {
      alert(`❌ Failed to process alert: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setProcessingAlerts(prev => {
        const next = new Set(prev);
        next.delete(alertId);
        return next;
      });
    }
  };

  const autoProcessAlert = async (alertId: string) => {
    try {
      setAutoProcessingAlerts(prev => new Set(prev).add(alertId));
      
      const response = await fetch('/api/_proxy/admin/alerts/auto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ alertId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      if (result.ok) {
        // Show detailed toast with actions summary
        const summary = result.summary || `${result.successfulActions} successful, ${result.failedActions} failed`;
        alert(`🤖 Automated processing complete!\n\n${summary}\n\nActions:\n${result.actionsRun.join('\n')}`);
        await fetchAlerts(); // Refresh the list
      } else {
        throw new Error(result.error || 'Failed to auto-process alert');
      }
    } catch (err) {
      alert(`❌ Auto-processing failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setAutoProcessingAlerts(prev => {
        const next = new Set(prev);
        next.delete(alertId);
        return next;
      });
    }
  };

  const sendTestAlert = async (severity: 'info' | 'warning' | 'critical' = 'warning') => {
    try {
      setTestAlertLoading(true);
      
      const response = await fetch('/api/_proxy/admin/alerts/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Test notification alert - ${severity.toUpperCase()}`,
          severity: severity,
          type: 'notification-test'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      if (result.ok) {
        alert(`✅ Test alert sent successfully! ${result.notification_sent ? 'Notification delivered.' : 'Notification failed to send.'}`);
        fetchAlerts(); // Refresh to show the new test alert
      } else {
        throw new Error(result.message || 'Failed to send test alert');
      }
    } catch (err) {
      alert(`❌ Test alert failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setTestAlertLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [filter, severityFilter]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getSeverityBadgeVariant = (severity: string): "default" | "secondary" | "outline" => {
    switch (severity) {
      case 'critical': return 'default'; // Use default (blue) for critical
      case 'warning': return 'default'; // Use default (blue) for warnings  
      case 'info': return 'secondary'; // Use secondary (gray) for info
      default: return 'outline';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'info': return <Info className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Alerts & Notifications</h1>
          <p className="text-muted-foreground">Monitor system events and manage notifications</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchAlerts}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button
            onClick={() => sendTestAlert('warning')}
            disabled={testAlertLoading}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
          >
            {testAlertLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Bell className="h-4 w-4" />
            )}
            {testAlertLoading ? 'Sending...' : 'Test Alert'}
          </button>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Bell className="h-4 w-4" />
            Create Alert
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Total</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Active</p>
                  <p className="text-2xl font-bold">{stats.active}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <EyeOff className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Dismissed</p>
                  <p className="text-2xl font-bold">{stats.dismissed}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <div>
                  <p className="text-sm font-medium">Critical</p>
                  <p className="text-2xl font-bold">{stats.critical}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium">Warning</p>
                  <p className="text-2xl font-bold">{stats.warning}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Info</p>
                  <p className="text-2xl font-bold">{stats.info}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex gap-2">
          <span className="text-sm font-medium">Status:</span>
          {(['all', 'active', 'dismissed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <span className="text-sm font-medium">Severity:</span>
          {(['all', 'critical', 'warning', 'info'] as const).map((severity) => (
            <button
              key={severity}
              onClick={() => setSeverityFilter(severity)}
              className={`px-3 py-1 rounded-full text-sm ${
                severityFilter === severity
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {severity.charAt(0).toUpperCase() + severity.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Create Alert Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Alert</CardTitle>
            <CardDescription>Add a custom alert to the system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={newAlert.title}
                  onChange={(e) => setNewAlert({ ...newAlert, title: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Alert title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Severity</label>
                <select
                  value={newAlert.severity}
                  onChange={(e) => setNewAlert({ ...newAlert, severity: e.target.value as any })}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                value={newAlert.message}
                onChange={(e) => setNewAlert({ ...newAlert, message: e.target.value })}
                className="w-full p-2 border rounded-lg"
                rows={3}
                placeholder="Alert message"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={newAlert.category}
                  onChange={(e) => setNewAlert({ ...newAlert, category: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="system">System</option>
                  <option value="webhook">Webhook</option>
                  <option value="payment">Payment</option>
                  <option value="security">Security</option>
                  <option value="user">User</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Auto-dismiss (minutes)</label>
                <input
                  type="number"
                  value={newAlert.auto_dismiss_minutes}
                  onChange={(e) => setNewAlert({ ...newAlert, auto_dismiss_minutes: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Optional"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={createAlert}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Create Alert
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <span>Error loading alerts: {error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alerts List */}
      {!loading && !error && (
        <div className="space-y-4">
          {alerts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Bell className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-muted-foreground">No alerts found</p>
              </CardContent>
            </Card>
          ) : (
            alerts.map((alert) => (
              <Card key={alert.id} className={`${alert.status === 'dismissed' ? 'opacity-60' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {getSeverityIcon(alert.severity)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-lg">{alert.title}</h3>
                          <p className="text-muted-foreground mt-1">{alert.message}</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant={getSeverityBadgeVariant(alert.severity)}>
                            {alert.severity}
                          </Badge>
                          <Badge variant="outline">{alert.category}</Badge>
                          
                          {/* Needs Review Badge */}
                          {alert.needs_review && !alert.reviewed && (
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                              Needs Review
                            </Badge>
                          )}
                          
                          {/* Auto-processed Badge */}
                          {alert.auto_processed_at && (
                            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                              Auto-processed
                            </Badge>
                          )}
                          
                          {/* Escalated Badge */}
                          {alert.escalated && (
                            <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                              Escalated
                            </Badge>
                          )}
                          
                          {/* Process Button */}
                          {alert.status === 'active' && (
                            <button
                              onClick={() => processAlert(alert.id)}
                              disabled={processingAlerts.has(alert.id)}
                              className="p-1 text-blue-500 hover:text-blue-700 disabled:text-gray-400"
                              title="Process alert (run auto-remediation actions)"
                            >
                              {processingAlerts.has(alert.id) ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <Settings className="h-4 w-4" />
                              )}
                            </button>
                          )}
                          
                          {/* Auto Process Button */}
                          {alert.status === 'active' && (
                            <button
                              onClick={() => autoProcessAlert(alert.id)}
                              disabled={autoProcessingAlerts.has(alert.id)}
                              className="p-1 text-green-500 hover:text-green-700 disabled:text-gray-400"
                              title="Auto Process (run automated remediation based on alert type/severity)"
                            >
                              {autoProcessingAlerts.has(alert.id) ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <CheckCircle className="h-4 w-4" />
                              )}
                            </button>
                          )}
                          
                          {alert.status === 'active' && (
                            <button
                              onClick={() => dismissAlert(alert.id)}
                              className="p-1 text-gray-500 hover:text-red-600"
                              title="Dismiss alert"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatDate(alert.created_at)}</span>
                        </div>
                        
                        {alert.dismissed_at && (
                          <div>
                            Dismissed {formatDate(alert.dismissed_at)} by {alert.dismissed_by}
                          </div>
                        )}
                        
                        {alert.auto_dismiss_at && alert.status === 'active' && (
                          <div>
                            Auto-dismiss: {formatDate(alert.auto_dismiss_at)}
                          </div>
                        )}
                      </div>
                      
                      {alert.metadata && Object.keys(alert.metadata).length > 0 && (
                        <details className="mt-4">
                          <summary className="text-sm text-blue-600 cursor-pointer">View metadata</summary>
                          <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
                            {JSON.stringify(alert.metadata, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}