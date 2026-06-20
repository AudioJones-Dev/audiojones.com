'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: { seconds: number };
  settings: {
    max_users: number;
    max_api_keys: number;
    features: string[];
  };
  subscription?: {
    plan: string;
    status: string;
  };
  metadata: {
    total_users: number;
    total_api_keys: number;
    data_usage_bytes: number;
  };
}

interface OrganizationMember {
  id: string;
  user_id: string;
  email: string;
  role: string;
  joined_at: { seconds: number };
  status: string;
}

interface ScopedApiKey {
  id: string;
  name: string;
  key_prefix: string;
  created_at: { seconds: number };
  expires_at?: { seconds: number };
  scopes: string[];
  usage_stats: {
    total_requests: number;
    requests_today: number;
  };
  status: string;
}

interface OrganizationMetrics {
  total_orgs: number;
  active_orgs: number;
  total_members: number;
  total_api_keys: number;
  avg_members_per_org: number;
  data_usage_total_gb: number;
  api_requests_24h: number;
  top_orgs_by_activity: Array<{
    org_id: string;
    name: string;
    activity_score: number;
  }>;
}

export default function MultiTenantAdminPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'organizations' | 'create-org' | 'api-keys'>('dashboard');

  // Helper function to get error message
  const getErrorMessage = (error: unknown): string => {
    return error instanceof Error ? error.message : 'Unknown error';
  };
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Dashboard state
  const [metrics, setMetrics] = useState<OrganizationMetrics | null>(null);

  // Organizations state
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [orgMembers, setOrgMembers] = useState<OrganizationMember[]>([]);
  const [orgApiKeys, setOrgApiKeys] = useState<ScopedApiKey[]>([]);

  // Create organization form
  const [createOrgForm, setCreateOrgForm] = useState({
    name: '',
    slug: '',
    description: '',
    plan: 'free',
    features: [] as string[]
  });

  // Create API key form
  const [createApiKeyForm, setCreateApiKeyForm] = useState({
    org_id: '',
    name: '',
    scopes: [] as string[],
    expires_at: '',
    rate_limits: {
      requests_per_minute: 100,
      requests_per_hour: 1000,
      requests_per_day: 10000
    }
  });

  // Add member form
  const [addMemberForm, setAddMemberForm] = useState({
    org_id: '',
    user_id: '',
    email: '',
    role: 'member'
  });

  // Show new API key
  const [newApiKey, setNewApiKey] = useState<string | null>(null);

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
      const response = await makeApiCall('/api/admin/multitenant?action=dashboard');
      setMetrics(response.data.metrics);
    } catch (error) {
      showMessage('error', `Failed to load metrics: ${getErrorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  };

  // Load organizations
  const loadOrganizations = async () => {
    try {
      setLoading(true);
      const response = await makeApiCall('/api/admin/multitenant?action=organizations');
      setOrganizations(response.data.organizations);
    } catch (error) {
      showMessage('error', `Failed to load organizations: ${getErrorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  };

  // Load organization details
  const loadOrganizationDetails = async (orgId: string) => {
    try {
      setLoading(true);
      const response = await makeApiCall(`/api/admin/multitenant?action=organization&org_id=${orgId}`);
      setSelectedOrg(response.data.organization);
      setOrgMembers(response.data.members);
      setOrgApiKeys(response.data.api_keys);
    } catch (error) {
      showMessage('error', `Failed to load organization details: ${getErrorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  };

  // Initialize multi-tenant system
  const initializeSystem = async () => {
    try {
      setLoading(true);
      await makeApiCall('/api/admin/multitenant', 'POST', { action: 'initialize' });
      showMessage('success', 'Multi-tenant system initialized successfully');
      loadMetrics();
    } catch (error) {
      showMessage('error', `Failed to initialize system: ${getErrorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  };

  // Create organization
  const createOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await makeApiCall('/api/admin/multitenant', 'POST', {
        action: 'create_organization',
        ...createOrgForm
      });
      showMessage('success', `Organization '${createOrgForm.name}' created successfully`);
      setCreateOrgForm({ name: '', slug: '', description: '', plan: 'free', features: [] });
      loadOrganizations();
      setActiveTab('organizations');
    } catch (error) {
      showMessage('error', `Failed to create organization: ${getErrorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  };

  // Create API key
  const createApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await makeApiCall('/api/admin/multitenant', 'POST', {
        action: 'create_api_key',
        ...createApiKeyForm
      });
      setNewApiKey(response.data.raw_key);
      showMessage('success', `API key '${createApiKeyForm.name}' created successfully`);
      setCreateApiKeyForm({
        org_id: '',
        name: '',
        scopes: [],
        expires_at: '',
        rate_limits: { requests_per_minute: 100, requests_per_hour: 1000, requests_per_day: 10000 }
      });
      if (selectedOrg) {
        loadOrganizationDetails(selectedOrg.id);
      }
    } catch (error) {
      showMessage('error', `Failed to create API key: ${getErrorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  };

  // Add member
  const addMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await makeApiCall('/api/admin/multitenant', 'POST', {
        action: 'add_member',
        ...addMemberForm
      });
      showMessage('success', 'Member added successfully');
      setAddMemberForm({ org_id: '', user_id: '', email: '', role: 'member' });
      if (selectedOrg) {
        loadOrganizationDetails(selectedOrg.id);
      }
    } catch (error) {
      showMessage('error', `Failed to add member: ${getErrorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  };

  // Revoke API key
  const revokeApiKey = async (apiKeyId: string) => {
    if (!confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      await makeApiCall('/api/admin/multitenant', 'POST', {
        action: 'revoke_api_key',
        api_key_id: apiKeyId
      });
      showMessage('success', 'API key revoked successfully');
      if (selectedOrg) {
        loadOrganizationDetails(selectedOrg.id);
      }
    } catch (error) {
      showMessage('error', `Failed to revoke API key: ${getErrorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  };

  // Remove member
  const removeMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this member?')) {
      return;
    }

    try {
      setLoading(true);
      await makeApiCall('/api/admin/multitenant', 'POST', {
        action: 'remove_member',
        member_id: memberId
      });
      showMessage('success', 'Member removed successfully');
      if (selectedOrg) {
        loadOrganizationDetails(selectedOrg.id);
      }
    } catch (error) {
      showMessage('error', `Failed to remove member: ${getErrorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'dashboard') {
      loadMetrics();
    } else if (activeTab === 'organizations') {
      loadOrganizations();
    }
  }, [activeTab]);

  const formatDate = (timestamp: { seconds: number }) => {
    return new Date(timestamp.seconds * 1000).toLocaleDateString();
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Multi-Tenant Organizations</h1>
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

        {/* New API Key Display */}
        {newApiKey && (
          <div className="mb-6 p-4 bg-yellow-900 text-yellow-100 rounded">
            <h3 className="font-bold mb-2">🔑 New API Key Created</h3>
            <p className="text-sm mb-2">
              <strong>IMPORTANT:</strong> This is the only time you'll see the full API key. Copy it now:
            </p>
            <div className="bg-black p-3 rounded font-mono text-sm break-all">
              {newApiKey}
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(newApiKey);
                showMessage('success', 'API key copied to clipboard');
              }}
              className="mt-2 px-3 py-1 bg-yellow-700 hover:bg-yellow-600 rounded text-sm"
            >
              Copy to Clipboard
            </button>
            <button
              onClick={() => setNewApiKey(null)}
              className="mt-2 ml-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-gray-700">
          {[
            { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
            { id: 'organizations', label: '🏢 Organizations', icon: '🏢' },
            { id: 'create-org', label: '➕ Create Org', icon: '➕' },
            { id: 'api-keys', label: '🔑 API Keys', icon: '🔑' }
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
                <h3 className="text-lg font-semibold mb-2">Total Organizations</h3>
                <p className="text-3xl font-bold text-blue-400">{metrics.total_orgs}</p>
                <p className="text-sm text-text-muted">{metrics.active_orgs} active</p>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Total Members</h3>
                <p className="text-3xl font-bold text-green-400">{metrics.total_members}</p>
                <p className="text-sm text-text-muted">Avg: {metrics.avg_members_per_org} per org</p>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">API Keys</h3>
                <p className="text-3xl font-bold text-purple-400">{metrics.total_api_keys}</p>
                <p className="text-sm text-text-muted">{metrics.api_requests_24h} requests today</p>
              </div>
              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Data Usage</h3>
                <p className="text-3xl font-bold text-orange-400">{metrics.data_usage_total_gb} GB</p>
                <p className="text-sm text-text-muted">Total across all orgs</p>
              </div>
            </div>

            {/* Top Organizations */}
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Top Organizations by Activity</h3>
              <div className="space-y-3">
                {metrics.top_orgs_by_activity.map((org, index) => (
                  <div key={org.org_id} className="flex items-center justify-between p-3 bg-gray-800 rounded">
                    <div>
                      <span className="text-sm text-text-muted">#{index + 1}</span>
                      <span className="ml-3 font-medium">{org.name}</span>
                    </div>
                    <span className="text-blue-400">{org.activity_score} pts</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Organizations Tab */}
        {activeTab === 'organizations' && (
          <div className="space-y-6">
            {selectedOrg ? (
              /* Organization Details View */
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedOrg.name}</h2>
                    <p className="text-text-muted">/{selectedOrg.slug}</p>
                  </div>
                  <button
                    onClick={() => setSelectedOrg(null)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
                  >
                    ← Back to Organizations
                  </button>
                </div>

                {/* Organization Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Plan & Status</h3>
                    <p className="text-lg">{selectedOrg.subscription?.plan || 'free'}</p>
                    <p className="text-sm text-text-muted">{selectedOrg.subscription?.status || 'active'}</p>
                  </div>
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Members</h3>
                    <p className="text-lg">{selectedOrg.metadata.total_users} / {selectedOrg.settings.max_users}</p>
                    <p className="text-sm text-text-muted">users</p>
                  </div>
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">API Keys</h3>
                    <p className="text-lg">{selectedOrg.metadata.total_api_keys} / {selectedOrg.settings.max_api_keys}</p>
                    <p className="text-sm text-text-muted">keys</p>
                  </div>
                </div>

                {/* Members */}
                <div className="bg-gray-900 p-6 rounded-lg mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Members</h3>
                    <button
                      onClick={() => {
                        setAddMemberForm({ ...addMemberForm, org_id: selectedOrg.id });
                      }}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                    >
                      Add Member
                    </button>
                  </div>

                  {/* Add Member Form */}
                  {addMemberForm.org_id === selectedOrg.id && (
                    <form onSubmit={addMember} className="mb-4 p-4 bg-gray-800 rounded">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input
                          type="text"
                          placeholder="User ID"
                          value={addMemberForm.user_id}
                          onChange={(e) => setAddMemberForm({ ...addMemberForm, user_id: e.target.value })}
                          className="px-3 py-2 bg-gray-700 rounded text-white"
                          required
                        />
                        <input
                          type="email"
                          placeholder="Email (optional)"
                          value={addMemberForm.email}
                          onChange={(e) => setAddMemberForm({ ...addMemberForm, email: e.target.value })}
                          className="px-3 py-2 bg-gray-700 rounded text-white"
                        />
                        <select
                          value={addMemberForm.role}
                          onChange={(e) => setAddMemberForm({ ...addMemberForm, role: e.target.value })}
                          className="px-3 py-2 bg-gray-700 rounded text-white"
                        >
                          <option value="viewer">Viewer</option>
                          <option value="member">Member</option>
                          <option value="admin">Admin</option>
                          <option value="owner">Owner</option>
                        </select>
                        <div className="flex space-x-2">
                          <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded disabled:opacity-50"
                          >
                            Add
                          </button>
                          <button
                            type="button"
                            onClick={() => setAddMemberForm({ org_id: '', user_id: '', email: '', role: 'member' })}
                            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </form>
                  )}

                  <div className="space-y-3">
                    {orgMembers.map(member => (
                      <div key={member.id} className="flex items-center justify-between p-3 bg-gray-800 rounded">
                        <div>
                          <p className="font-medium">{member.email}</p>
                          <p className="text-sm text-text-muted">
                            {member.role} • Joined {formatDate(member.joined_at)}
                          </p>
                        </div>
                        <button
                          onClick={() => removeMember(member.id)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* API Keys */}
                <div className="bg-gray-900 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">API Keys</h3>
                    <button
                      onClick={() => {
                        setCreateApiKeyForm({ ...createApiKeyForm, org_id: selectedOrg.id });
                      }}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                    >
                      Create API Key
                    </button>
                  </div>

                  {/* Create API Key Form */}
                  {createApiKeyForm.org_id === selectedOrg.id && (
                    <form onSubmit={createApiKey} className="mb-4 p-4 bg-gray-800 rounded space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="API Key Name"
                          value={createApiKeyForm.name}
                          onChange={(e) => setCreateApiKeyForm({ ...createApiKeyForm, name: e.target.value })}
                          className="px-3 py-2 bg-gray-700 rounded text-white"
                          required
                        />
                        <input
                          type="datetime-local"
                          placeholder="Expires At (optional)"
                          value={createApiKeyForm.expires_at}
                          onChange={(e) => setCreateApiKeyForm({ ...createApiKeyForm, expires_at: e.target.value })}
                          className="px-3 py-2 bg-gray-700 rounded text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Scopes (comma-separated):</label>
                        <input
                          type="text"
                          placeholder="data.read, data.write, webhooks.read"
                          value={createApiKeyForm.scopes.join(', ')}
                          onChange={(e) => setCreateApiKeyForm({ 
                            ...createApiKeyForm, 
                            scopes: e.target.value.split(',').map(s => s.trim()).filter(s => s) 
                          })}
                          className="w-full px-3 py-2 bg-gray-700 rounded text-white"
                          required
                        />
                      </div>
                      <div className="flex space-x-2">
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded disabled:opacity-50"
                        >
                          Create API Key
                        </button>
                        <button
                          type="button"
                          onClick={() => setCreateApiKeyForm({ 
                            org_id: '', name: '', scopes: [], expires_at: '',
                            rate_limits: { requests_per_minute: 100, requests_per_hour: 1000, requests_per_day: 10000 }
                          })}
                          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="space-y-3">
                    {orgApiKeys.map(apiKey => (
                      <div key={apiKey.id} className="flex items-center justify-between p-3 bg-gray-800 rounded">
                        <div>
                          <p className="font-medium">{apiKey.name}</p>
                          <p className="text-sm text-text-muted">
                            {apiKey.key_prefix}... • {apiKey.usage_stats.total_requests} requests
                            {apiKey.expires_at && ` • Expires ${formatDate(apiKey.expires_at)}`}
                          </p>
                          <p className="text-xs text-text-muted">
                            Scopes: {apiKey.scopes.join(', ')}
                          </p>
                        </div>
                        <button
                          onClick={() => revokeApiKey(apiKey.id)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                        >
                          Revoke
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Organizations List View */
              <div className="space-y-4">
                {organizations.map(org => (
                  <div key={org.id} className="bg-gray-900 p-6 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{org.name}</h3>
                        <p className="text-text-muted">/{org.slug}</p>
                        <div className="mt-2 flex space-x-4 text-sm text-text-muted">
                          <span>{org.metadata.total_users} members</span>
                          <span>{org.metadata.total_api_keys} API keys</span>
                          <span>{org.subscription?.plan || 'free'} plan</span>
                          <span>Created {formatDate(org.created_at)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => loadOrganizationDetails(org.id)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create Organization Tab */}
        {activeTab === 'create-org' && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">Create New Organization</h2>
            <form onSubmit={createOrganization} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Organization Name</label>
                <input
                  type="text"
                  value={createOrgForm.name}
                  onChange={(e) => setCreateOrgForm({ ...createOrgForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 rounded text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Slug (URL identifier)</label>
                <input
                  type="text"
                  value={createOrgForm.slug}
                  onChange={(e) => setCreateOrgForm({ ...createOrgForm, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                  className="w-full px-3 py-2 bg-gray-700 rounded text-white"
                  pattern="[a-z0-9-]+"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description (optional)</label>
                <textarea
                  value={createOrgForm.description}
                  onChange={(e) => setCreateOrgForm({ ...createOrgForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 rounded text-white"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Plan</label>
                <select
                  value={createOrgForm.plan}
                  onChange={(e) => setCreateOrgForm({ ...createOrgForm, plan: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 rounded text-white"
                >
                  <option value="free">Free (5 users, 2 API keys)</option>
                  <option value="pro">Pro (25 users, 5 API keys)</option>
                  <option value="enterprise">Enterprise (100 users, 20 API keys)</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-50"
              >
                Create Organization
              </button>
            </form>
          </div>
        )}

        {/* API Keys Tab */}
        {activeTab === 'api-keys' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Global API Key Management</h2>
            <p className="text-text-muted">
              This section shows all API keys across all organizations for system-wide monitoring.
            </p>
            {/* Implementation would show all API keys with organization context */}
            <div className="bg-gray-900 p-6 rounded-lg">
              <p className="text-center text-text-muted">
                Select an organization from the Organizations tab to manage API keys.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}