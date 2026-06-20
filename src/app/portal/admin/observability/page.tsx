'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface TraceEvent {
  id: string;
  traceId: string;
  spanId: string;
  operationName: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  status: 'success' | 'error' | 'timeout';
  metadata: Record<string, any>;
  parentSpanId?: string;
  userId?: string;
  organizationId?: string;
  tags: string[];
}

interface PerformanceMetric {
  name: string;
  value: number;
  unit: 'ms' | 'bytes' | 'count' | 'percent';
  labels: Record<string, string>;
  timestamp: number;
  traceId?: string;
}

interface SystemMetrics {
  total_requests_24h: number;
  avg_response_time_ms: number;
  error_rate_percent: number;
  active_traces: number;
  webhook_events_24h: number;
  database_operations_24h: number;
  feature_flag_evaluations_24h: number;
  top_operations: Array<{
    name: string;
    count: number;
    avg_duration_ms: number;
    error_rate: number;
  }>;
  recent_errors: Array<{
    timestamp: number;
    operation: string;
    error: string;
    trace_id: string;
  }>;
}

export default function ObservabilityDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'traces' | 'metrics' | 'alerts'>('dashboard');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Dashboard state
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  
  // Traces state
  const [traces, setTraces] = useState<TraceEvent[]>([]);
  const [selectedTrace, setSelectedTrace] = useState<TraceEvent | null>(null);
  const [traceFilters, setTraceFilters] = useState({
    timeRange: '1h',
    status: '',
    operation: '',
    userId: '',
    organizationId: ''
  });

  // Metrics state
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [metricsTimeRange, setMetricsTimeRange] = useState('1h');

  // Helper functions
  const getErrorMessage = (error: unknown): string => {
    return error instanceof Error ? error.message : 'Unknown error';
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const makeApiCall = async (endpoint: string, method: 'GET' | 'POST' = 'GET', body?: any) => {
    const token = await user?.getIdToken();
    const response = await fetch(endpoint, {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'API call failed');
    }
    return data;
  };

  // Load system metrics
  const loadSystemMetrics = async () => {
    try {
      setLoading(true);
      const response = await makeApiCall('/api/admin/observability/metrics');
      setSystemMetrics(response.data.metrics);
    } catch (error) {
      showMessage('error', `Failed to load system metrics: ${getErrorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  };

  // Load trace events
  const loadTraces = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (traceFilters.timeRange) params.append('timeRange', traceFilters.timeRange);
      if (traceFilters.status) params.append('status', traceFilters.status);
      if (traceFilters.operation) params.append('operation', traceFilters.operation);
      if (traceFilters.userId) params.append('userId', traceFilters.userId);
      if (traceFilters.organizationId) params.append('organizationId', traceFilters.organizationId);

      const response = await makeApiCall(`/api/admin/observability/traces?${params}`);
      setTraces(response.data.traces);
    } catch (error) {
      showMessage('error', `Failed to load traces: ${getErrorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  };

  // Load performance metrics
  const loadPerformanceMetrics = async () => {
    try {
      setLoading(true);
      const response = await makeApiCall(`/api/admin/observability/performance?timeRange=${metricsTimeRange}`);
      setPerformanceMetrics(response.data.metrics);
    } catch (error) {
      showMessage('error', `Failed to load performance metrics: ${getErrorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      if (activeTab === 'dashboard') {
        loadSystemMetrics();
      } else if (activeTab === 'traces') {
        loadTraces();
      } else if (activeTab === 'metrics') {
        loadPerformanceMetrics();
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [activeTab, autoRefresh, traceFilters, metricsTimeRange]);

  // Initial load
  useEffect(() => {
    if (activeTab === 'dashboard') {
      loadSystemMetrics();
    } else if (activeTab === 'traces') {
      loadTraces();
    } else if (activeTab === 'metrics') {
      loadPerformanceMetrics();
    }
  }, [activeTab]);

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(1)}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'timeout': return 'text-yellow-400';
      default: return 'text-text-muted';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'timeout': return '⏰';
      default: return '⚪';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Observability Dashboard</h1>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Auto-refresh (30s)</span>
            </label>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
              <span className="text-sm text-text-muted">
                {autoRefresh ? 'Live' : 'Paused'}
              </span>
            </div>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded ${
            message.type === 'success' ? 'bg-green-900 text-green-100' : 'bg-red-900 text-red-100'
          }`}>
            {message.text}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-gray-700">
          {[
            { id: 'dashboard', label: '📊 Overview', icon: '📊' },
            { id: 'traces', label: '🔍 Distributed Traces', icon: '🔍' },
            { id: 'metrics', label: '📈 Performance Metrics', icon: '📈' },
            { id: 'alerts', label: '🚨 Alerts & Anomalies', icon: '🚨' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-text-muted hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="mb-6 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-text-muted">Loading observability data...</p>
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && systemMetrics && (
          <div className="space-y-6">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Requests (24h)</h3>
                <p className="text-3xl font-bold text-blue-400">{systemMetrics.total_requests_24h.toLocaleString()}</p>
                <p className="text-sm text-text-muted">HTTP requests processed</p>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Avg Response Time</h3>
                <p className="text-3xl font-bold text-green-400">{systemMetrics.avg_response_time_ms.toFixed(1)}ms</p>
                <p className="text-sm text-text-muted">Overall performance</p>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Error Rate</h3>
                <p className={`text-3xl font-bold ${systemMetrics.error_rate_percent > 5 ? 'text-red-400' : 'text-green-400'}`}>
                  {systemMetrics.error_rate_percent.toFixed(2)}%
                </p>
                <p className="text-sm text-text-muted">Request failures</p>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Active Traces</h3>
                <p className="text-3xl font-bold text-purple-400">{systemMetrics.active_traces}</p>
                <p className="text-sm text-text-muted">Current operations</p>
              </div>
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Webhook Events</h3>
                <p className="text-2xl font-bold text-yellow-400">{systemMetrics.webhook_events_24h.toLocaleString()}</p>
                <p className="text-sm text-text-muted">24h webhook processing</p>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Database Ops</h3>
                <p className="text-2xl font-bold text-indigo-400">{systemMetrics.database_operations_24h.toLocaleString()}</p>
                <p className="text-sm text-text-muted">24h Firestore operations</p>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Feature Flags</h3>
                <p className="text-2xl font-bold text-cyan-400">{systemMetrics.feature_flag_evaluations_24h.toLocaleString()}</p>
                <p className="text-sm text-text-muted">24h flag evaluations</p>
              </div>
            </div>

            {/* Top Operations */}
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Top Operations by Volume</h3>
              <div className="space-y-3">
                {systemMetrics.top_operations.map((op, index) => (
                  <div key={op.name} className="flex items-center justify-between p-3 bg-gray-800 rounded">
                    <div>
                      <span className="text-sm text-text-muted">#{index + 1}</span>
                      <span className="ml-3 font-medium">{op.name}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-blue-400">{op.count.toLocaleString()} calls</span>
                      <span className="text-green-400">{op.avg_duration_ms.toFixed(1)}ms avg</span>
                      <span className={`${op.error_rate > 5 ? 'text-red-400' : 'text-text-muted'}`}>
                        {op.error_rate.toFixed(1)}% errors
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Errors */}
            {systemMetrics.recent_errors.length > 0 && (
              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Recent Errors</h3>
                <div className="space-y-3">
                  {systemMetrics.recent_errors.map((error, index) => (
                    <div key={index} className="flex items-start justify-between p-3 bg-red-900/20 border border-red-800 rounded">
                      <div>
                        <p className="font-medium text-red-400">{error.operation}</p>
                        <p className="text-sm text-text-primary mt-1">{error.error}</p>
                        <p className="text-xs text-text-muted mt-1">Trace ID: {error.trace_id}</p>
                      </div>
                      <div className="text-sm text-text-muted">
                        {formatTimestamp(error.timestamp)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Traces Tab */}
        {activeTab === 'traces' && (
          <div className="space-y-6">
            {/* Trace Filters */}
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Filter Traces</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Time Range</label>
                  <select
                    value={traceFilters.timeRange}
                    onChange={(e) => setTraceFilters({ ...traceFilters, timeRange: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 rounded text-white"
                  >
                    <option value="1h">Last Hour</option>
                    <option value="6h">Last 6 Hours</option>
                    <option value="24h">Last 24 Hours</option>
                    <option value="7d">Last 7 Days</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    value={traceFilters.status}
                    onChange={(e) => setTraceFilters({ ...traceFilters, status: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 rounded text-white"
                  >
                    <option value="">All Statuses</option>
                    <option value="success">Success</option>
                    <option value="error">Error</option>
                    <option value="timeout">Timeout</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Operation</label>
                  <input
                    type="text"
                    value={traceFilters.operation}
                    onChange={(e) => setTraceFilters({ ...traceFilters, operation: e.target.value })}
                    placeholder="webhook.whop, api.get"
                    className="w-full px-3 py-2 bg-gray-700 rounded text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">User ID</label>
                  <input
                    type="text"
                    value={traceFilters.userId}
                    onChange={(e) => setTraceFilters({ ...traceFilters, userId: e.target.value })}
                    placeholder="user123"
                    className="w-full px-3 py-2 bg-gray-700 rounded text-white"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={loadTraces}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Traces List */}
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Distributed Traces</h3>
              <div className="space-y-3">
                {traces.map(trace => (
                  <div
                    key={trace.id}
                    onClick={() => setSelectedTrace(trace)}
                    className="flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-700 rounded cursor-pointer"
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">{getStatusIcon(trace.status)}</span>
                      <div>
                        <p className="font-medium">{trace.operationName}</p>
                        <p className="text-sm text-text-muted">Trace ID: {trace.traceId}</p>
                        {trace.userId && (
                          <p className="text-xs text-text-muted">User: {trace.userId}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${getStatusColor(trace.status)}`}>
                        {trace.status.toUpperCase()}
                      </p>
                      <p className="text-sm text-text-muted">
                        {trace.duration ? formatDuration(trace.duration) : 'In Progress'}
                      </p>
                      <p className="text-xs text-text-muted">
                        {formatTimestamp(trace.startTime)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Trace Details */}
            {selectedTrace && (
              <div className="bg-gray-900 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Trace Details</h3>
                  <button
                    onClick={() => setSelectedTrace(null)}
                    className="text-text-muted hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Basic Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-text-muted">Operation:</span> {selectedTrace.operationName}</p>
                      <p><span className="text-text-muted">Trace ID:</span> {selectedTrace.traceId}</p>
                      <p><span className="text-text-muted">Span ID:</span> {selectedTrace.spanId}</p>
                      <p><span className="text-text-muted">Status:</span>
                        <span className={`ml-2 ${getStatusColor(selectedTrace.status)}`}>
                          {selectedTrace.status}
                        </span>
                      </p>
                      <p><span className="text-text-muted">Duration:</span>
                        {selectedTrace.duration ? formatDuration(selectedTrace.duration) : 'N/A'}
                      </p>
                      <p><span className="text-text-muted">Start Time:</span> {formatTimestamp(selectedTrace.startTime)}</p>
                      {selectedTrace.userId && (
                        <p><span className="text-text-muted">User ID:</span> {selectedTrace.userId}</p>
                      )}
                      {selectedTrace.organizationId && (
                        <p><span className="text-text-muted">Organization:</span> {selectedTrace.organizationId}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Metadata</h4>
                    <pre className="text-xs bg-gray-800 p-3 rounded overflow-auto max-h-40">
                      {JSON.stringify(selectedTrace.metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Metrics Tab */}
        {activeTab === 'metrics' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Performance Metrics</h2>
              <select
                value={metricsTimeRange}
                onChange={(e) => setMetricsTimeRange(e.target.value)}
                className="px-3 py-2 bg-gray-700 rounded text-white"
              >
                <option value="1h">Last Hour</option>
                <option value="6h">Last 6 Hours</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
              </select>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Custom Metrics</h3>
              <div className="space-y-3">
                {performanceMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded">
                    <div>
                      <p className="font-medium">{metric.name}</p>
                      <p className="text-sm text-text-muted">
                        {Object.entries(metric.labels).map(([key, value]) => `${key}: ${value}`).join(', ')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-400">
                        {metric.value.toLocaleString()} {metric.unit}
                      </p>
                      <p className="text-xs text-text-muted">
                        {formatTimestamp(metric.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Alerts & Anomalies</h2>
            <div className="bg-gray-900 p-6 rounded-lg">
              <p className="text-center text-text-muted">
                Advanced alerting system coming soon...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
