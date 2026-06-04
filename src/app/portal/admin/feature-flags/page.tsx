'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  key: string;
  created_at: { seconds: number };
  updated_at: { seconds: number };
  status: 'active' | 'inactive' | 'archived';
  flag_type: 'boolean' | 'multivariate' | 'rollout' | 'kill_switch';
  rollout: {
    enabled: boolean;
    percentage: number;
    strategy: string;
    ramp_rate?: number;
    max_percentage?: number;
  };
  targeting: {
    organizations?: string[];
    user_segments?: string[];
    geographic?: string[];
  };
  variants?: Array<{
    key: string;
    name: string;
    weight: number;
    value: any;
  }>;
  kill_switch?: {
    enabled: boolean;
    triggered_at?: { seconds: number };
    triggered_by?: string;
    reason?: string;
  };
  metadata: {
    total_evaluations: number;
    last_evaluation: { seconds: number };
    enabled_users: number;
    error_rate: number;
  };
}

interface FeatureFlagMetrics {
  total_flags: number;
  active_flags: number;
  flags_with_kill_switch: number;
  flags_in_rollout: number;
  total_evaluations_24h: number;
  avg_evaluation_time_ms: number;
  top_flags_by_usage: Array<{
    key: string;
    name: string;
    evaluations: number;
    rollout_percentage: number;
    status: string;
  }>;
}

export default function FeatureFlagsAdminPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'flags' | 'create-flag' | 'analytics'>('dashboard');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Dashboard state
  const [metrics, setMetrics] = useState<FeatureFlagMetrics | null>(null);

  // Flags state
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [selectedFlag, setSelectedFlag] = useState<FeatureFlag | null>(null);

  // Create flag form
  const [createFlagForm, setCreateFlagForm] = useState({
    name: '',
    key: '',
    description: '',
    flag_type: 'boolean',
    rollout_strategy: 'random',
    environments: ['development'],
    user_segments: [] as string[],
    organizations: [] as string[]
  });

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

  // Load dashboard metrics
  const loadMetrics = async () => {
    try {
      setLoading(true);
      const response = await makeApiCall('/api/admin/feature-flags?action=dashboard');
      setMetrics(response.data.metrics);
    } catch (error) {
      showMessage('error', `Failed to load metrics: ${getErrorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  };

  // Load all flags
  const loadFlags = async () => {
    try {
      setLoading(true);
      const response = await makeApiCall('/api/admin/feature-flags?action=flags');
      setFlags(response.data.flags);
    } catch (error) {
      showMessage('error', `Failed to load flags: ${getErrorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  };

  // Initialize system
  const initializeSystem = async () => {
    try {
      setLoading(true);
      await makeApiCall('/api/admin/feature-flags', 'POST', { action: 'initialize' });
      showMessage('success', 'Feature flags system initialized successfully');
      loadMetrics();
    } catch (error) {
      showMessage('error', `Failed to initialize system: ${getErrorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  };

  // Create feature flag
  const createFeatureFlag = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // Generate key from name if not provided
      const key = createFlagForm.key || 
        createFlagForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

      const config = {
        flag_type: createFlagForm.flag_type,
        rollout: {
          enabled: false,
          percentage: 0,
          strategy: createFlagForm.rollout_strategy
        },
        targeting: {
          organizations: createFlagForm.organizations,
          user_segments: createFlagForm.user_segments
        },
        integration: {
          environments: createFlagForm.environments
        }
      };

      await makeApiCall('/api/admin/feature-flags', 'POST', {
        action: 'create_flag',
        name: createFlagForm.name,
        key,
        description: createFlagForm.description,
        config
      });

      showMessage('success', `Feature flag '${createFlagForm.name}' created successfully`);
      setCreateFlagForm({
        name: '',
        key: '',
        description: '',
        flag_type: 'boolean',
        rollout_strategy: 'random',
        environments: ['development'],
        user_segments: [],
        organizations: []
      });
      loadFlags();
      setActiveTab('flags');
    } catch (error) {
      showMessage('error', `Failed to create feature flag: ${getErrorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  };

  // Update rollout percentage
  const updateRollout = async (flagKey: string, percentage: number) => {
    try {
      setLoading(true);
      await makeApiCall('/api/admin/feature-flags', 'POST', {
        action: 'update_rollout',
        flag_key: flagKey,
        percentage
      });
      showMessage('success', `Rollout updated to ${percentage}%`);
      loadFlags();
    } catch (error) {
      showMessage('error', `Failed to update rollout: ${getErrorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  };

  // Trigger kill switch
  const triggerKillSwitch = async (flagKey: string, reason: string) => {
    if (!confirm(`Are you sure you want to trigger the kill switch for ${flagKey}? This will immediately disable the feature for all users.`)) {
      return;
    }

    try {
      setLoading(true);
      await makeApiCall('/api/admin/feature-flags', 'POST', {
        action: 'trigger_kill_switch',
        flag_key: flagKey,
        reason
      });
      showMessage('success', `Kill switch activated for ${flagKey}`);
      loadFlags();
    } catch (error) {
      showMessage('error', `Failed to trigger kill switch: ${getErrorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  };

  // Disable kill switch
  const disableKillSwitch = async (flagKey: string) => {
    try {
      setLoading(true);
      await makeApiCall('/api/admin/feature-flags', 'POST', {
        action: 'disable_kill_switch',
        flag_key: flagKey
      });
      showMessage('success', `Kill switch disabled for ${flagKey}`);
      loadFlags();
    } catch (error) {
      showMessage('error', `Failed to disable kill switch: ${getErrorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  };

  // Update flag status
  const updateFlagStatus = async (flagKey: string, status: string) => {
    try {
      setLoading(true);
      await makeApiCall('/api/admin/feature-flags', 'POST', {
        action: 'update_flag',
        flag_key: flagKey,
        updates: { status }
      });
      showMessage('success', `Flag status updated to ${status}`);
      loadFlags();
    } catch (error) {
      showMessage('error', `Failed to update flag status: ${getErrorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'dashboard') {
      loadMetrics();
    } else if (activeTab === 'flags') {
      loadFlags();
    }
  }, [activeTab]);

  const formatDate = (timestamp: { seconds: number }) => {
    return new Date(timestamp.seconds * 1000).toLocaleDateString();
  };

  const getFlagStatusColor = (flag: FeatureFlag) => {
    if (flag.kill_switch?.enabled) return 'text-red-400';
    if (flag.status === 'active') return 'text-green-400';
    if (flag.status === 'inactive') return 'text-text-muted';
    return 'text-yellow-400';
  };

  const getFlagStatusIcon = (flag: FeatureFlag) => {
    if (flag.kill_switch?.enabled) return '🔴';
    if (flag.status === 'active') return '🟢';
    if (flag.status === 'inactive') return '⚫';
    return '🟡';
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Feature Flags</h1>
          <button
            onClick={initializeSystem}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Initialize System
          </button>
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
            { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
            { id: 'flags', label: '🚩 Feature Flags', icon: '🚩' },
            { id: 'create-flag', label: '➕ Create Flag', icon: '➕' },
            { id: 'analytics', label: '📈 Analytics', icon: '📈' }
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
            <p className="mt-2 text-text-muted">Loading...</p>
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && metrics && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Total Flags</h3>
                <p className="text-3xl font-bold text-blue-400">{metrics.total_flags}</p>
                <p className="text-sm text-text-muted">{metrics.active_flags} active</p>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Kill Switches</h3>
                <p className="text-3xl font-bold text-red-400">{metrics.flags_with_kill_switch}</p>
                <p className="text-sm text-text-muted">Active emergency switches</p>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Rollouts</h3>
                <p className="text-3xl font-bold text-yellow-400">{metrics.flags_in_rollout}</p>
                <p className="text-sm text-text-muted">Gradual rollouts in progress</p>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Evaluations (24h)</h3>
                <p className="text-3xl font-bold text-green-400">{metrics.total_evaluations_24h.toLocaleString()}</p>
                <p className="text-sm text-text-muted">Avg: {metrics.avg_evaluation_time_ms}ms</p>
              </div>
            </div>

            {/* Top Flags */}
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Top Feature Flags by Usage</h3>
              <div className="space-y-3">
                {metrics.top_flags_by_usage.map((flag, index) => (
                  <div key={flag.key} className="flex items-center justify-between p-3 bg-gray-800 rounded">
                    <div>
                      <span className="text-sm text-text-muted">#{index + 1}</span>
                      <span className="ml-3 font-medium">{flag.name}</span>
                      <span className="ml-2 text-sm text-text-muted">({flag.key})</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-blue-400">{flag.evaluations.toLocaleString()} evals</span>
                      <span className="text-yellow-400">{flag.rollout_percentage}%</span>
                      <span className={`${flag.status === 'active' ? 'text-green-400' : 'text-text-muted'}`}>
                        {flag.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Feature Flags Tab */}
        {activeTab === 'flags' && (
          <div className="space-y-6">
            <div className="space-y-4">
              {flags.map(flag => (
                <div key={flag.id} className="bg-gray-900 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{getFlagStatusIcon(flag)}</span>
                        <div>
                          <h3 className="text-lg font-semibold">{flag.name}</h3>
                          <p className="text-text-muted text-sm">{flag.key}</p>
                        </div>
                      </div>
                      <p className="text-text-primary mt-2">{flag.description}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${getFlagStatusColor(flag)}`}>
                        {flag.status.toUpperCase()}
                      </p>
                      <p className="text-sm text-text-muted">
                        {flag.metadata.total_evaluations.toLocaleString()} evaluations
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-800 p-4 rounded">
                      <h4 className="font-medium mb-2">Rollout</h4>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${flag.rollout.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-mono">{flag.rollout.percentage}%</span>
                      </div>
                      <p className="text-xs text-text-muted mt-1">
                        Strategy: {flag.rollout.strategy}
                      </p>
                    </div>
                    
                    <div className="bg-gray-800 p-4 rounded">
                      <h4 className="font-medium mb-2">Type</h4>
                      <p className="text-sm">{flag.flag_type}</p>
                      {flag.variants && (
                        <p className="text-xs text-text-muted">
                          {flag.variants.length} variants
                        </p>
                      )}
                    </div>

                    <div className="bg-gray-800 p-4 rounded">
                      <h4 className="font-medium mb-2">Performance</h4>
                      <p className="text-sm">Error Rate: {flag.metadata.error_rate}%</p>
                      <p className="text-xs text-text-muted">
                        Last evaluation: {formatDate(flag.metadata.last_evaluation)}
                      </p>
                    </div>
                  </div>

                  {/* Kill Switch Status */}
                  {flag.kill_switch?.enabled && (
                    <div className="bg-red-900 border border-red-700 p-4 rounded mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-red-100">🔴 Kill Switch Active</h4>
                          <p className="text-sm text-red-200">
                            Triggered: {flag.kill_switch.triggered_at ? formatDate(flag.kill_switch.triggered_at) : 'Unknown'}
                          </p>
                          {flag.kill_switch.reason && (
                            <p className="text-sm text-red-200">Reason: {flag.kill_switch.reason}</p>
                          )}
                        </div>
                        <button
                          onClick={() => disableKillSwitch(flag.key)}
                          className="px-3 py-1 bg-red-700 hover:bg-red-600 rounded text-sm"
                        >
                          Disable Kill Switch
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Controls */}
                  <div className="flex flex-wrap gap-2">
                    {/* Rollout Controls */}
                    {flag.status === 'active' && !flag.kill_switch?.enabled && (
                      <>
                        <button
                          onClick={() => updateRollout(flag.key, 0)}
                          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
                        >
                          0%
                        </button>
                        <button
                          onClick={() => updateRollout(flag.key, 25)}
                          className="px-3 py-1 bg-blue-700 hover:bg-blue-600 rounded text-sm"
                        >
                          25%
                        </button>
                        <button
                          onClick={() => updateRollout(flag.key, 50)}
                          className="px-3 py-1 bg-blue-700 hover:bg-blue-600 rounded text-sm"
                        >
                          50%
                        </button>
                        <button
                          onClick={() => updateRollout(flag.key, 100)}
                          className="px-3 py-1 bg-green-700 hover:bg-green-600 rounded text-sm"
                        >
                          100%
                        </button>
                      </>
                    )}

                    {/* Status Controls */}
                    {flag.status === 'inactive' && (
                      <button
                        onClick={() => updateFlagStatus(flag.key, 'active')}
                        className="px-3 py-1 bg-green-700 hover:bg-green-600 rounded text-sm"
                      >
                        Activate
                      </button>
                    )}

                    {flag.status === 'active' && (
                      <button
                        onClick={() => updateFlagStatus(flag.key, 'inactive')}
                        className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
                      >
                        Deactivate
                      </button>
                    )}

                    {/* Kill Switch */}
                    {flag.status === 'active' && !flag.kill_switch?.enabled && (
                      <button
                        onClick={() => {
                          const reason = prompt('Enter reason for kill switch:');
                          if (reason) triggerKillSwitch(flag.key, reason);
                        }}
                        className="px-3 py-1 bg-red-700 hover:bg-red-600 rounded text-sm"
                      >
                        🔴 Kill Switch
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Create Flag Tab */}
        {activeTab === 'create-flag' && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">Create Feature Flag</h2>
            <form onSubmit={createFeatureFlag} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Flag Name</label>
                <input
                  type="text"
                  value={createFlagForm.name}
                  onChange={(e) => setCreateFlagForm({ ...createFlagForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 rounded text-white"
                  placeholder="Enhanced Analytics Dashboard"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Flag Key (optional)</label>
                <input
                  type="text"
                  value={createFlagForm.key}
                  onChange={(e) => setCreateFlagForm({ ...createFlagForm, key: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_') })}
                  className="w-full px-3 py-2 bg-gray-700 rounded text-white"
                  placeholder="enhanced_analytics_dashboard"
                />
                <p className="text-xs text-text-muted mt-1">
                  Leave empty to auto-generate from name
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={createFlagForm.description}
                  onChange={(e) => setCreateFlagForm({ ...createFlagForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 rounded text-white"
                  rows={3}
                  placeholder="Advanced analytics and reporting features for enterprise users"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Flag Type</label>
                <select
                  value={createFlagForm.flag_type}
                  onChange={(e) => setCreateFlagForm({ ...createFlagForm, flag_type: e.target.value as any })}
                  className="w-full px-3 py-2 bg-gray-700 rounded text-white"
                >
                  <option value="boolean">Boolean (on/off)</option>
                  <option value="rollout">Rollout (percentage-based)</option>
                  <option value="multivariate">Multivariate (A/B testing)</option>
                  <option value="kill_switch">Kill Switch</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Rollout Strategy</label>
                <select
                  value={createFlagForm.rollout_strategy}
                  onChange={(e) => setCreateFlagForm({ ...createFlagForm, rollout_strategy: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 rounded text-white"
                >
                  <option value="random">Random</option>
                  <option value="user_id">User ID</option>
                  <option value="organization">Organization</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Environments</label>
                <div className="space-y-2">
                  {['development', 'staging', 'production'].map(env => (
                    <label key={env} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={createFlagForm.environments.includes(env)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCreateFlagForm({
                              ...createFlagForm,
                              environments: [...createFlagForm.environments, env]
                            });
                          } else {
                            setCreateFlagForm({
                              ...createFlagForm,
                              environments: createFlagForm.environments.filter(e => e !== env)
                            });
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="capitalize">{env}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-50"
              >
                Create Feature Flag
              </button>
            </form>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Feature Flag Analytics</h2>
            <div className="bg-gray-900 p-6 rounded-lg">
              <p className="text-center text-text-muted">
                Advanced analytics coming soon...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}