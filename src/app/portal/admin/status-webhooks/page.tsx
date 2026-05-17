/**
 * Status Webhook Deliveries Admin Page
 * 
 * Shows:
 * - Recent webhook delivery attempts (last 50)
 * - Success/failure status
 * - Target URLs
 * - Timestamps and response times
 * - "Run Retry Now" button
 */

'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle2, XCircle, Clock, AlertTriangle, Play, Plus, Edit, Trash2, Settings } from 'lucide-react';

// Helper to get admin key
const getAdminKey = (): string => {
  return '';
};

interface WebhookDeliveryAttempt {
  event_id: string;
  url: string;
  status: number | null;
  error?: string;
  timestamp: string;
  response_time_ms?: number;
}

interface WebhookQueueStats {
  pending: number;
  failed: number;
  total: number;
}

interface RetryRunnerResponse {
  success: boolean;
  processed: number;
  succeeded: number;
  failed: number;
  results: {
    event_id: string;
    url: string;
    success: boolean;
    error?: string;
  }[];
}

interface StatusWebhookTarget {
  id?: string;
  url: string;
  secret?: string;
  events?: string[];
  active: boolean;
  description?: string;
  created_at: string;
  updated_at: string;
}

interface CreateWebhookTargetData {
  url: string;
  secret?: string;
  events?: string[];
  description?: string;
}

export default function StatusWebhooksPage() {
  const [deliveries, setDeliveries] = useState<WebhookDeliveryAttempt[]>([]);
  const [queueStats, setQueueStats] = useState<WebhookQueueStats>({ pending: 0, failed: 0, total: 0 });
  const [targets, setTargets] = useState<StatusWebhookTarget[]>([]);
  const [loading, setLoading] = useState(true);
  const [retryRunning, setRetryRunning] = useState(false);
  const [retryResult, setRetryResult] = useState<RetryRunnerResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'deliveries' | 'targets'>('deliveries');
  const [showAddTarget, setShowAddTarget] = useState(false);
  const [newTarget, setNewTarget] = useState<CreateWebhookTargetData>({
    url: '',
    secret: '',
    events: [],
    description: '',
  });
  const [testRunning, setTestRunning] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; eventId?: string } | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [deliveriesRes, statsRes, targetsRes] = await Promise.all([
        fetch('/api/admin/status-webhooks/deliveries', {
          headers: { 'admin-key': getAdminKey() }
        }),
        fetch('/api/admin/status-webhooks/stats', {
          headers: { 'admin-key': getAdminKey() }
        }),
        fetch('/api/admin/status-webhooks/targets', {
          headers: { 'admin-key': getAdminKey() }
        })
      ]);

      if (!deliveriesRes.ok || !statsRes.ok || !targetsRes.ok) {
        throw new Error('Failed to fetch webhook data');
      }

      const deliveriesData = await deliveriesRes.json();
      const statsData = await statsRes.json();
      const targetsData = await targetsRes.json();

      setDeliveries(deliveriesData.deliveries || []);
      setQueueStats(statsData.stats || { pending: 0, failed: 0, total: 0 });
      setTargets(targetsData.targets || []);

    } catch (err: any) {
      console.error('Error fetching webhook data:', err);
      setError(err.message || 'Failed to load webhook data');
    } finally {
      setLoading(false);
    }
  };

  const runRetries = async () => {
    try {
      setRetryRunning(true);
      setRetryResult(null);
      setError(null);

      const response = await fetch('/api/admin/status-webhooks/retry', {
        method: 'POST',
        headers: { 
          'admin-key': getAdminKey(),
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Retry run failed');
      }

      setRetryResult(result);
      
      // Refresh data after retry run
      setTimeout(() => {
        fetchData();
      }, 1000);

    } catch (err: any) {
      console.error('Error running retries:', err);
      setError(err.message || 'Failed to run retries');
    } finally {
      setRetryRunning(false);
    }
  };

  const addTarget = async () => {
    try {
      setError(null);

      const response = await fetch('/api/admin/status-webhooks/targets', {
        method: 'POST',
        headers: {
          'admin-key': getAdminKey(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...newTarget,
          events: newTarget.events?.filter(e => e.trim()) || []
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create target');
      }

      // Reset form
      setNewTarget({ url: '', secret: '', events: [], description: '' });
      setShowAddTarget(false);
      
      // Refresh data
      await fetchData();

    } catch (err: any) {
      console.error('Error adding target:', err);
      setError(err.message || 'Failed to add target');
    }
  };

  const toggleTargetActive = async (targetId: string, active: boolean) => {
    try {
      setError(null);

      const response = await fetch(`/api/admin/status-webhooks/targets/${targetId}`, {
        method: 'PATCH',
        headers: {
          'admin-key': getAdminKey(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ active })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update target');
      }

      // Refresh data
      await fetchData();

    } catch (err: any) {
      console.error('Error toggling target:', err);
      setError(err.message || 'Failed to update target');
    }
  };

  const deleteTarget = async (targetId: string) => {
    if (!confirm('Are you sure you want to delete this webhook target?')) {
      return;
    }

    try {
      setError(null);

      const response = await fetch(`/api/admin/status-webhooks/targets/${targetId}`, {
        method: 'DELETE',
        headers: { 'admin-key': getAdminKey() }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete target');
      }

      // Refresh data
      await fetchData();

    } catch (err: any) {
      console.error('Error deleting target:', err);
      setError(err.message || 'Failed to delete target');
    }
  };

  const testWebhookVerification = async () => {
    try {
      setTestRunning(true);
      setTestResult(null);
      setError(null);

      // Generate a test payload
      const testPayload = {
        timestamp: new Date().toISOString(),
        status: 'degraded',
        from: 'operational',
        to: 'degraded',
        message: 'Test webhook verification',
        source: 'admin-panel'
      };

      // Send to our test receiver endpoint
      const response = await fetch('/api/integrations/aj-webhook', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-aj-signature': await generateTestSignature(testPayload),
          'x-aj-timestamp': new Date().toISOString(),
          'x-aj-event': 'status_change'
        },
        body: JSON.stringify(testPayload)
      });

      const result = await response.json();

      if (response.ok) {
        setTestResult({
          success: true,
          message: `Webhook verification successful! Event ID: ${result.event_id}`,
          eventId: result.event_id
        });
      } else {
        setTestResult({
          success: false,
          message: `Verification failed: ${result.reason || 'Unknown error'}`
        });
      }

    } catch (err: any) {
      console.error('Error testing webhook verification:', err);
      setTestResult({
        success: false,
        message: `Test failed: ${err.message || 'Network error'}`
      });
    } finally {
      setTestRunning(false);
    }
  };

  // Helper to generate test signature (simplified for demo)
  const generateTestSignature = async (payload: any): Promise<string> => {
    // This is a simplified version - in production you'd use the same signing logic
    // as the server-side broadcasting function
    const secret = 'test-secret'; // In real usage, this would come from env
    const timestamp = new Date().toISOString();
    const body = JSON.stringify(payload);
    
    // Note: This is just for demo - actual signing would use crypto module
    return `sha256=demo_signature_${Date.now()}`;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname + urlObj.pathname;
    } catch {
      return url;
    }
  };

  const getStatusIcon = (status: number | null, error?: string) => {
    if (status && status >= 200 && status < 300) {
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    } else if (status && status >= 400) {
      return <XCircle className="w-4 h-4 text-red-500" />;
    } else {
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusText = (status: number | null, error?: string) => {
    if (status && status >= 200 && status < 300) {
      return `Success (${status})`;
    } else if (status) {
      return `HTTP ${status}`;
    } else {
      return 'Network Error';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span>Loading webhook deliveries...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Status Webhook Management</h1>
        <p className="text-gray-400">Monitor deliveries and manage webhook targets</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('deliveries')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'deliveries'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              Webhook Deliveries
            </button>
            <button
              onClick={() => setActiveTab('targets')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'targets'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              Webhook Targets
            </button>
          </nav>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-300">{error}</span>
          </div>
        </div>
      )}

      {/* Webhook Targets Tab */}
      {activeTab === 'targets' && (
        <>
          {/* Targets Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium text-white">Webhook Targets</h2>
            <button
              onClick={() => setShowAddTarget(true)}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Target</span>
            </button>
          </div>

          {/* Add Target Form */}
          {showAddTarget && (
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-medium text-white mb-4">Add Webhook Target</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">URL *</label>
                  <input
                    type="url"
                    value={newTarget.url}
                    onChange={(e) => setNewTarget({ ...newTarget, url: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://your-webhook-endpoint.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Secret (optional)</label>
                  <input
                    type="password"
                    value={newTarget.secret || ''}
                    onChange={(e) => setNewTarget({ ...newTarget, secret: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="HMAC signing secret"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Events (comma-separated)</label>
                  <input
                    type="text"
                    value={newTarget.events?.join(', ') || ''}
                    onChange={(e) => setNewTarget({ 
                      ...newTarget, 
                      events: e.target.value.split(',').map(s => s.trim()) 
                    })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="status_change, status_operational (empty = all events)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <input
                    type="text"
                    value={newTarget.description || ''}
                    onChange={(e) => setNewTarget({ ...newTarget, description: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Optional description"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4 mt-4">
                <button
                  onClick={addTarget}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Create Target
                </button>
                <button
                  onClick={() => setShowAddTarget(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Targets Table */}
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700">
              <h3 className="text-lg font-medium text-white">Configured Targets</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      URL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Events
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Security
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {targets.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                        No webhook targets configured
                      </td>
                    </tr>
                  ) : (
                    targets.map((target) => (
                      <tr key={target.id} className="hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {target.active ? (
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                            <span className="text-sm text-gray-300">
                              {target.active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm text-gray-300 font-mono">
                              {target.url}
                            </div>
                            {target.description && (
                              <div className="text-xs text-gray-500 mt-1">
                                {target.description}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-300">
                            {target.events && target.events.length > 0 
                              ? target.events.join(', ') 
                              : 'All events'
                            }
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-300">
                            {target.secret ? 'HMAC Signed' : 'Unsigned'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => toggleTargetActive(target.id!, !target.active)}
                              className={`p-2 rounded transition-colors ${
                                target.active
                                  ? 'text-red-400 hover:bg-red-900/20'
                                  : 'text-green-400 hover:bg-green-900/20'
                              }`}
                              title={target.active ? 'Deactivate' : 'Activate'}
                            >
                              <Settings className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteTarget(target.id!)}
                              className="p-2 rounded text-red-400 hover:bg-red-900/20 transition-colors"
                              title="Delete Target"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Webhook Deliveries Tab */}
      {activeTab === 'deliveries' && (
        <>

      {/* Queue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-yellow-400">{queueStats.pending}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Failed</p>
              <p className="text-2xl font-bold text-red-400">{queueStats.failed}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Queued</p>
              <p className="text-2xl font-bold text-blue-400">{queueStats.total}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <button
            onClick={runRetries}
            disabled={retryRunning || queueStats.pending === 0}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors mb-3"
          >
            {retryRunning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Run Retry Now</span>
              </>
            )}
          </button>
          
          <button
            onClick={testWebhookVerification}
            disabled={testRunning}
            className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
          >
            {testRunning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Testing...</span>
              </>
            ) : (
              <>
                <Settings className="w-4 h-4" />
                <span>Test Webhook Verification</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Test Result */}
      {testResult && (
        <div className={`rounded-lg p-4 mb-6 ${
          testResult.success 
            ? 'bg-green-900/20 border border-green-500/30' 
            : 'bg-red-900/20 border border-red-500/30'
        }`}>
          <div className="flex items-center space-x-2 mb-2">
            {testResult.success ? (
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            ) : (
              <XCircle className="w-5 h-5 text-red-400" />
            )}
            <h3 className="text-lg font-medium text-white">Webhook Verification Test</h3>
          </div>
          <p className={`text-sm ${testResult.success ? 'text-green-300' : 'text-red-300'}`}>
            {testResult.message}
          </p>
          {testResult.eventId && (
            <p className="text-xs text-gray-400 mt-1">
              Check the aj_webhook_events collection for event: {testResult.eventId}
            </p>
          )}
        </div>
      )}

      {/* Retry Result */}
      {retryResult && (
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-medium text-white mb-2">Last Retry Run Results</h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Processed:</span>
              <span className="ml-2 text-white">{retryResult.processed}</span>
            </div>
            <div>
              <span className="text-gray-400">Succeeded:</span>
              <span className="ml-2 text-green-400">{retryResult.succeeded}</span>
            </div>
            <div>
              <span className="text-gray-400">Failed:</span>
              <span className="ml-2 text-red-400">{retryResult.failed}</span>
            </div>
          </div>
        </div>
      )}

      {/* Deliveries Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium text-white">Recent Deliveries</h2>
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Event ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  URL
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Response Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Error
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {deliveries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    No webhook deliveries found
                  </td>
                </tr>
              ) : (
                deliveries.map((delivery, index) => (
                  <tr key={`${delivery.event_id}-${delivery.url}-${index}`} className="hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(delivery.status, delivery.error)}
                        <span className="text-sm text-gray-300">
                          {getStatusText(delivery.status, delivery.error)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono text-gray-300">{delivery.event_id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-300" title={delivery.url}>
                        {formatUrl(delivery.url)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-300">
                        {formatTimestamp(delivery.timestamp)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-300">
                        {delivery.response_time_ms ? `${delivery.response_time_ms}ms` : '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-red-300">
                        {delivery.error || '-'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      </>
      )}

    </div>
  );
}