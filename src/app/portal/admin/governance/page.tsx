"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

interface HealthMetrics {
  timestamp: string;
  system: {
    status: string;
    uptime: string;
    lastRestart: string;
    version: string;
  };
  performance: {
    responseTime: string;
    throughput: string;
    errorRate: string;
    cpuUsage: string;
    memoryUsage: string;
  };
  services: Record<string, { status: string; responseTime: string }>;
  security: {
    lastScan: string;
    vulnerabilities: number;
    failedLogins: number;
    suspiciousActivity: number;
  };
  compliance: {
    gdprCompliance: string;
    dataRetention: string;
    auditLog: string;
    backupStatus: string;
  };
}

interface BackupData {
  current_status: {
    last_backup: string;
    status: string;
    size: string;
    duration: string;
    type: string;
  };
  history: Array<{
    id: string;
    timestamp: string;
    type: string;
    status: string;
    size: string;
    duration: string;
  }>;
}

interface ComplianceData {
  overview: {
    overall_score: number;
    status: string;
    critical_issues: number;
    warnings: number;
  };
  frameworks: Record<string, {
    score: number;
    status: string;
    last_review: string;
  }>;
}

export default function GovernancePage() {
  const { user } = useAuth();
  const [healthData, setHealthData] = useState<HealthMetrics | null>(null);
  const [backupData, setBackupData] = useState<BackupData | null>(null);
  const [complianceData, setComplianceData] = useState<ComplianceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'health' | 'backup' | 'compliance' | 'audit'>('health');

  useEffect(() => {
    if (user) {
      fetchGovernanceData();
    }
  }, [user]);

  const fetchGovernanceData = async () => {
    try {
      const token = await user?.getIdToken();
      
      // Fetch health data
      const healthResponse = await fetch('/api/governance/health', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (healthResponse.ok) {
        const healthResult = await healthResponse.json();
        setHealthData(healthResult.data);
      }

      // Fetch backup data
      const backupResponse = await fetch('/api/governance/backup', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (backupResponse.ok) {
        const backupResult = await backupResponse.json();
        setBackupData(backupResult.data);
      }

      // Fetch compliance data
      const complianceResponse = await fetch('/api/governance/compliance', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (complianceResponse.ok) {
        const complianceResult = await complianceResponse.json();
        setComplianceData(complianceResult.data);
      }

    } catch (error) {
      console.error('Failed to fetch governance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerMaintenance = async (action: string, component?: string) => {
    try {
      const token = await user?.getIdToken();
      const response = await fetch('/api/governance/health', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action, component })
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message || 'Action completed successfully');
        fetchGovernanceData(); // Refresh data
      } else {
        alert('Action failed');
      }
    } catch (error) {
      console.error('Maintenance action failed:', error);
      alert('Action failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-xl">Loading governance dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Governance Dashboard</h1>
          <p className="text-white/70">System health, compliance, and administrative controls</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-white/5 rounded-lg p-1">
          {[
            { key: 'health', label: 'System Health', icon: '🏥' },
            { key: 'backup', label: 'Backup & Recovery', icon: '💾' },
            { key: 'compliance', label: 'Compliance', icon: '📋' },
            { key: 'audit', label: 'Audit Logs', icon: '📊' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.key
                  ? 'bg-[#008080] text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* System Health Tab */}
        {activeTab === 'health' && healthData && (
          <div className="space-y-6">
            {/* System Status Overview */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">System Status</h3>
                  <div className={`w-3 h-3 rounded-full ${
                    healthData.system.status === 'operational' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                </div>
                <div className="text-2xl font-bold text-green-500 mb-2">
                  {healthData.system.status.toUpperCase()}
                </div>
                <div className="text-sm text-white/60">
                  Uptime: {healthData.system.uptime}
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <h3 className="text-lg font-semibold mb-4">Performance</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/70">Response Time</span>
                    <span className="text-[#008080]">{healthData.performance.responseTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Throughput</span>
                    <span className="text-[#F0FF85]">{healthData.performance.throughput}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Error Rate</span>
                    <span className="text-green-500">{healthData.performance.errorRate}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <h3 className="text-lg font-semibold mb-4">Resources</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/70">CPU Usage</span>
                    <span className="text-[#008080]">{healthData.performance.cpuUsage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Memory Usage</span>
                    <span className="text-[#F0FF85]">{healthData.performance.memoryUsage}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <h3 className="text-lg font-semibold mb-4">Security</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-white/70">Vulnerabilities</span>
                    <span className="text-green-500">{healthData.security.vulnerabilities}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Failed Logins</span>
                    <span className="text-yellow-500">{healthData.security.failedLogins}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Services Status */}
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-6">Service Health</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {Object.entries(healthData.services).map(([service, status]) => (
                  <div key={service} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div>
                      <div className="font-medium capitalize">{service.replace('_', ' ')}</div>
                      <div className="text-sm text-white/60">{status.responseTime}</div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      status.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Maintenance Actions */}
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-6">Maintenance Actions</h3>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => triggerMaintenance('restart')}
                  className="px-4 py-2 bg-[#E8FF5A] text-[#080808] rounded-lg hover:bg-[#E8FF5A]/80"
                >
                  Restart System
                </button>
                <button
                  onClick={() => triggerMaintenance('clear_cache')}
                  className="px-4 py-2 bg-[#008080] text-white rounded-lg hover:bg-[#008080]/80"
                >
                  Clear Cache
                </button>
                <button
                  onClick={() => triggerMaintenance('backup')}
                  className="px-4 py-2 bg-[#F0FF85] text-black rounded-lg hover:bg-[#F0FF85]/80"
                >
                  Create Backup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Backup Tab */}
        {activeTab === 'backup' && backupData && (
          <div className="space-y-6">
            {/* Current Backup Status */}
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-6">Current Backup Status</h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-white/60">Last Backup</div>
                  <div className="text-lg font-medium">
                    {new Date(backupData.current_status.last_backup).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-white/60">Status</div>
                  <div className={`text-lg font-medium ${
                    backupData.current_status.status === 'completed' ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {backupData.current_status.status.toUpperCase()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-white/60">Size</div>
                  <div className="text-lg font-medium">{backupData.current_status.size}</div>
                </div>
                <div>
                  <div className="text-sm text-white/60">Duration</div>
                  <div className="text-lg font-medium">{backupData.current_status.duration}</div>
                </div>
              </div>
            </div>

            {/* Backup History */}
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-6">Backup History</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3">Date</th>
                      <th className="text-left py-3">Type</th>
                      <th className="text-left py-3">Status</th>
                      <th className="text-left py-3">Size</th>
                      <th className="text-left py-3">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {backupData.history.slice(0, 10).map((backup) => (
                      <tr key={backup.id} className="border-b border-white/5">
                        <td className="py-3">
                          {new Date(backup.timestamp).toLocaleDateString()}
                        </td>
                        <td className="py-3 capitalize">{backup.type.replace('_', ' ')}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded text-xs ${
                            backup.status === 'completed' 
                              ? 'bg-green-500/20 text-green-500' 
                              : 'bg-red-500/20 text-red-500'
                          }`}>
                            {backup.status}
                          </span>
                        </td>
                        <td className="py-3">{backup.size}</td>
                        <td className="py-3">{backup.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Compliance Tab */}
        {activeTab === 'compliance' && complianceData && (
          <div className="space-y-6">
            {/* Compliance Overview */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <h3 className="text-lg font-semibold mb-4">Overall Score</h3>
                <div className="text-3xl font-bold text-[#008080] mb-2">
                  {complianceData.overview.overall_score}%
                </div>
                <div className="text-sm text-white/60">
                  Status: {complianceData.overview.status}
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <h3 className="text-lg font-semibold mb-4">Critical Issues</h3>
                <div className="text-3xl font-bold text-green-500 mb-2">
                  {complianceData.overview.critical_issues}
                </div>
                <div className="text-sm text-white/60">No critical issues</div>
              </div>

              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <h3 className="text-lg font-semibold mb-4">Warnings</h3>
                <div className="text-3xl font-bold text-yellow-500 mb-2">
                  {complianceData.overview.warnings}
                </div>
                <div className="text-sm text-white/60">Minor issues to address</div>
              </div>

              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <h3 className="text-lg font-semibold mb-4">Frameworks</h3>
                <div className="text-3xl font-bold text-[#F0FF85] mb-2">
                  {Object.keys(complianceData.frameworks).length}
                </div>
                <div className="text-sm text-white/60">Active compliance frameworks</div>
              </div>
            </div>

            {/* Framework Details */}
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-6">Compliance Frameworks</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(complianceData.frameworks).map(([framework, data]) => (
                  <div key={framework} className="p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-medium uppercase">{framework.replace('_', ' ')}</h4>
                      <div className={`px-3 py-1 rounded text-sm ${
                        data.status === 'compliant' 
                          ? 'bg-green-500/20 text-green-500' 
                          : 'bg-red-500/20 text-red-500'
                      }`}>
                        {data.status}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Score</span>
                      <span className="text-[#008080] font-bold">{data.score}%</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-white/70">Last Review</span>
                      <span className="text-white/60 text-sm">
                        {new Date(data.last_review).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Audit Tab */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-6">Audit Logs</h3>
              <div className="text-white/60">
                Audit log functionality will be implemented with real-time log streaming and filtering capabilities.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}