'use client';

import { useEffect, useState } from 'react';

interface SystemStatus {
  legacyAuth: {
    admin: boolean;
    auth: boolean;
    database: boolean;
  };
  apis: {
    ping: boolean;
    whoami: boolean;
    users: boolean;
  };
  integrations: {
    stripe: boolean;
    whop: boolean;
    n8n: boolean;
  };
  environment: {
    nodeEnv: string;
    vercelEnv?: string;
    hasSecrets: boolean;
  };
  deployment: {
    lastDeploy?: string;
    commitHash?: string;
    branch?: string;
  };
}

export default function SystemMonitoring() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkSystemHealth = async () => {
    setLoading(true);
    try {
      const user = await new Promise((resolve) => {
        resolve({ accessToken: 'placeholder' });
      });

      const response = await fetch('/api/admin/system', {
        headers: {
          'Authorization': `Bearer ${(user as any).accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStatus(data);
        setLastCheck(new Date());
      }
    } catch (error) {
      console.error('Failed to check system health:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSystemHealth();
  }, []);

  const getStatusColor = (isHealthy: boolean) => 
    isHealthy ? 'text-green-400' : 'text-red-400';

  const getStatusIcon = (isHealthy: boolean) => 
    isHealthy ? '✓' : '✗';

  if (loading && !status) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-700 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-700 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">System Monitoring</h1>
          <p className="mt-2 text-gray-400">
            Monitor system health and integration status
          </p>
          {lastCheck && (
            <p className="mt-1 text-sm text-gray-500">
              Last checked: {lastCheck.toLocaleTimeString()}
            </p>
          )}
        </div>
        <button
          onClick={checkSystemHealth}
          disabled={loading}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {loading ? 'Checking...' : 'Refresh Status'}
        </button>
      </div>

      {status && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Retired auth Services */}
          <div className="rounded-lg border border-gray-700 bg-gray-900 p-6">
            <h3 className="text-lg font-medium text-white mb-4 flex items-center">
              Retired auth Services
              <span className="ml-2 text-sm">
                {Object.values(status.legacyAuth).every(Boolean) ? '🟢' : '🔴'}
              </span>
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Admin SDK</span>
                <span className={getStatusColor(status.legacyAuth.admin)}>
                  {getStatusIcon(status.legacyAuth.admin)} {status.legacyAuth.admin ? 'Connected' : 'Failed'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Authentication</span>
                <span className={getStatusColor(status.legacyAuth.auth)}>
                  {getStatusIcon(status.legacyAuth.auth)} {status.legacyAuth.auth ? 'Connected' : 'Failed'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Database</span>
                <span className={getStatusColor(status.legacyAuth.database)}>
                  {getStatusIcon(status.legacyAuth.database)} {status.legacyAuth.database ? 'Connected' : 'Failed'}
                </span>
              </div>
            </div>
          </div>

          {/* API Endpoints */}
          <div className="rounded-lg border border-gray-700 bg-gray-900 p-6">
            <h3 className="text-lg font-medium text-white mb-4 flex items-center">
              API Endpoints
              <span className="ml-2 text-sm">
                {Object.values(status.apis).every(Boolean) ? '🟢' : '🔴'}
              </span>
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Admin Ping</span>
                <span className={getStatusColor(status.apis.ping)}>
                  {getStatusIcon(status.apis.ping)} {status.apis.ping ? 'OK' : 'Failed'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Who Am I</span>
                <span className={getStatusColor(status.apis.whoami)}>
                  {getStatusIcon(status.apis.whoami)} {status.apis.whoami ? 'OK' : 'Failed'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Users API</span>
                <span className={getStatusColor(status.apis.users)}>
                  {getStatusIcon(status.apis.users)} {status.apis.users ? 'OK' : 'Failed'}
                </span>
              </div>
            </div>
          </div>

          {/* External Integrations */}
          <div className="rounded-lg border border-gray-700 bg-gray-900 p-6">
            <h3 className="text-lg font-medium text-white mb-4 flex items-center">
              External Integrations
              <span className="ml-2 text-sm">
                {Object.values(status.integrations).every(Boolean) ? '🟢' : 
                 Object.values(status.integrations).some(Boolean) ? '🟡' : '🔴'}
              </span>
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Stripe</span>
                <span className={getStatusColor(status.integrations.stripe)}>
                  {getStatusIcon(status.integrations.stripe)} {status.integrations.stripe ? 'Connected' : 'Failed'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Whop</span>
                <span className={getStatusColor(status.integrations.whop)}>
                  {getStatusIcon(status.integrations.whop)} {status.integrations.whop ? 'Connected' : 'Failed'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">N8N</span>
                <span className={getStatusColor(status.integrations.n8n)}>
                  {getStatusIcon(status.integrations.n8n)} {status.integrations.n8n ? 'Connected' : 'Failed'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Environment Info */}
      {status && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-lg border border-gray-700 bg-gray-900 p-6">
            <h3 className="text-lg font-medium text-white mb-4">Environment</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Node Environment</span>
                <span className="text-white font-mono text-sm">{status.environment.nodeEnv}</span>
              </div>
              {status.environment.vercelEnv && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Vercel Environment</span>
                  <span className="text-white font-mono text-sm">{status.environment.vercelEnv}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Secrets Loaded</span>
                <span className={getStatusColor(status.environment.hasSecrets)}>
                  {getStatusIcon(status.environment.hasSecrets)} {status.environment.hasSecrets ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-700 bg-gray-900 p-6">
            <h3 className="text-lg font-medium text-white mb-4">Deployment Info</h3>
            <div className="space-y-3">
              {status.deployment.lastDeploy && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Last Deploy</span>
                  <span className="text-white text-sm">{status.deployment.lastDeploy}</span>
                </div>
              )}
              {status.deployment.commitHash && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Commit</span>
                  <span className="text-white font-mono text-sm">{status.deployment.commitHash.slice(0, 8)}</span>
                </div>
              )}
              {status.deployment.branch && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Branch</span>
                  <span className="text-white font-mono text-sm">{status.deployment.branch}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="rounded-lg border border-gray-700 bg-gray-900 p-6">
        <h3 className="text-lg font-medium text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/api/admin/ping"
            target="_blank"
            rel="noopener noreferrer"
            className="text-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
          >
            Test Admin Ping
          </a>
          <a
            href="/api/admin/whoami"
            target="_blank"
            rel="noopener noreferrer"
            className="text-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition"
          >
            Check Who Am I
          </a>
          <a
            href="/api/test-retired-admin-sdk"
            target="_blank"
            rel="noopener noreferrer"
            className="text-center rounded-md bg-yellow-600 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-700 transition"
          >
            Test retired admin
          </a>
          <button
            onClick={() => window.location.reload()}
            className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition"
          >
            Reload Page
          </button>
        </div>
      </div>
    </div>
  );
}