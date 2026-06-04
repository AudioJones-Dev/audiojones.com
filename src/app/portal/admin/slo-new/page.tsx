/**
 * SLO & Auto-Credits Dashboard
 * 
 * Comprehensive SLO monitoring interface with burn rate tracking,
 * credit issuance management, and reliability enforcement monitoring.
 */

'use client';

import { useState, useEffect } from 'react';
import { useRequireAuth } from '@/lib/client/useRequireAuth';

interface SLODashboardData {
  overall_health: 'healthy' | 'warning' | 'critical';
  total_slos: number;
  active_violations: number;
  credits_issued_this_month: number;
  error_budget_summary: {
    consumed_percentage: number;
    remaining_days: number;
    burn_rate_trend: 'improving' | 'stable' | 'degrading';
  };
  slo_performance: Array<{
    slo_id: string;
    name: string;
    current_availability: number;
    target: number;
    status: 'healthy' | 'warning' | 'critical';
    burn_rate: number;
    time_to_exhaustion?: number;
  }>;
}

interface SLOViolation {
  id: string;
  slo_id: string;
  slo_name: string;
  started_at: number;
  ended_at?: number;
  duration_minutes?: number;
  severity: 'warning' | 'critical';
  burn_rate_peak: number;
  error_budget_consumed: number;
  impact_description: string;
  credit_issued: boolean;
  credit_amount?: number;
  status: 'active' | 'resolved' | 'acknowledged';
  organization_id: string;
}

interface BillingCredit {
  id: string;
  organization_id: string;
  amount: number;
  reason: string;
  description: string;
  issued_at: number;
  issued_by: string;
  status: 'pending' | 'applied' | 'expired' | 'cancelled';
  slo_name?: string;
}

export default function SLODashboard() {
  const { loading } = useRequireAuth({ redirectTo: "/login" });
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState<SLODashboardData | null>(null);
  const [violations, setViolations] = useState<SLOViolation[]>([]);
  const [credits, setCredits] = useState<BillingCredit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [lastEvaluation, setLastEvaluation] = useState<any>(null);

  useEffect(() => {
    if (!loading) {
      loadSLOData();
      const interval = setInterval(loadSLOData, 60000); // Refresh every minute
      return () => clearInterval(interval);
    }
  }, [loading]);

  const loadSLOData = async () => {
    try {
      setError(null);
      
      // Load dashboard data
      const dashboardResponse = await fetch('/api/admin/slo?action=dashboard');
      if (dashboardResponse.ok) {
        const dashboardData = await dashboardResponse.json();
        setDashboardData(dashboardData.data);
      }

      // Load violations
      const violationsResponse = await fetch('/api/admin/slo?action=violations&limit=20');
      if (violationsResponse.ok) {
        const violationsData = await violationsResponse.json();
        setViolations(violationsData.data.violations);
      }

      // Load credits
      const creditsResponse = await fetch('/api/admin/slo?action=credits&limit=20');
      if (creditsResponse.ok) {
        const creditsData = await creditsResponse.json();
        setCredits(creditsData.data.credits);
      }

    } catch (error) {
      console.error('Error loading SLO data:', error);
      setError('Failed to load SLO data');
    } finally {
      setIsLoading(false);
    }
  };

  const runSLOEvaluation = async () => {
    try {
      setIsRunning(true);
      setError(null);

      const response = await fetch('/api/admin/slo/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const data = await response.json();
        setLastEvaluation(data.data);
        await loadSLOData(); // Refresh data after evaluation
      } else {
        throw new Error('SLO evaluation failed');
      }
    } catch (error) {
      console.error('Error running SLO evaluation:', error);
      setError('Failed to run SLO evaluation');
    } finally {
      setIsRunning(false);
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-text-muted';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800 border border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'critical': return 'bg-red-100 text-red-800 border border-red-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return '📈';
      case 'degrading': return '📉';
      case 'stable': return '➡️';
      default: return '❓';
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-800 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">SLO & Auto-Credits Dashboard</h1>
          <p className="text-text-muted">
            Service Level Objectives monitoring with automated credit issuance
          </p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* SLO Status Overview */}
        {dashboardData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">Overall Health</p>
                  <p className={`text-2xl font-bold ${getHealthColor(dashboardData.overall_health)}`}>
                    {dashboardData.overall_health.toUpperCase()}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  dashboardData.overall_health === 'healthy' ? 'bg-green-500/20' :
                  dashboardData.overall_health === 'warning' ? 'bg-yellow-500/20' : 'bg-red-500/20'
                }`}>
                  📊
                </div>
              </div>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">Active Violations</p>
                  <p className="text-2xl font-bold">{dashboardData.active_violations}</p>
                </div>
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                  🚨
                </div>
              </div>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">Credits This Month</p>
                  <p className="text-2xl font-bold">${dashboardData.credits_issued_this_month}</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  💳
                </div>
              </div>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">Error Budget</p>
                  <p className="text-2xl font-bold">{Math.round(100 - dashboardData.error_budget_summary.consumed_percentage)}%</p>
                  <p className="text-xs text-text-muted">
                    {getTrendIcon(dashboardData.error_budget_summary.burn_rate_trend)} {dashboardData.error_budget_summary.burn_rate_trend}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  ⏱️
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="flex gap-4">
              <button
                onClick={runSLOEvaluation}
                disabled={isRunning}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
              >
                {isRunning ? '🔄 Running...' : '▶️ Run SLO Evaluation'}
              </button>
              <button
                onClick={loadSLOData}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
              >
                🔄 Refresh Data
              </button>
            </div>

            {lastEvaluation && (
              <div className="mt-4 p-4 bg-gray-800 rounded">
                <h4 className="text-sm font-medium mb-2">Last Evaluation Results:</h4>
                <div className="text-sm text-text-primary grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>SLOs Evaluated: <span className="font-medium">{lastEvaluation.results.slos_evaluated}</span></div>
                  <div>Violations: <span className="font-medium text-red-400">{lastEvaluation.results.violations_detected}</span></div>
                  <div>Credits Issued: <span className="font-medium text-green-400">{lastEvaluation.results.credits_issued}</span></div>
                  <div>Total Credits: <span className="font-medium">${lastEvaluation.results.total_credit_amount}</span></div>
                </div>
                <div className="text-xs text-text-muted mt-2">
                  Executed in {lastEvaluation.execution_time_ms}ms at {new Date(lastEvaluation.completed_at).toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-800 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'SLO Overview', icon: '📊' },
              { id: 'violations', label: 'Violations', icon: '🚨' },
              { id: 'credits', label: 'Credit Issuance', icon: '💳' },
              { id: 'burn-rates', label: 'Burn Rates', icon: '🔥' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-white text-white'
                    : 'border-transparent text-text-muted hover:text-text-primary hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && dashboardData && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">SLO Performance Summary</h3>
            
            {dashboardData.slo_performance.length === 0 ? (
              <div className="bg-gray-900 p-8 rounded-lg border border-gray-800 text-center">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold mb-2">No SLOs Configured</h3>
                <p className="text-text-muted">Configure SLOs to start monitoring service reliability.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {dashboardData.slo_performance.map((slo) => (
                  <div key={slo.slo_id} className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold">{slo.name}</h4>
                        <p className="text-sm text-text-muted">Target: {slo.target}%</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(slo.status)}`}>
                        {slo.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Current Availability</span>
                          <span className="font-medium">{slo.current_availability.toFixed(2)}%</span>
                        </div>
                        <div className="bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              slo.current_availability >= slo.target ? 'bg-green-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(100, slo.current_availability)}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-text-muted">Burn Rate:</span>
                        <span className="font-medium">{slo.burn_rate.toFixed(1)}%</span>
                      </div>

                      {slo.time_to_exhaustion && (
                        <div className="flex justify-between text-sm">
                          <span className="text-text-muted">Time to Exhaustion:</span>
                          <span className="font-medium text-yellow-400">
                            {Math.round((slo.time_to_exhaustion - Date.now()) / (24 * 60 * 60 * 1000))} days
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'violations' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">SLO Violations</h3>
              <div className="text-sm text-text-muted">
                Showing {violations.length} recent violations
              </div>
            </div>

            {violations.length === 0 ? (
              <div className="bg-gray-900 p-8 rounded-lg border border-gray-800 text-center">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-xl font-semibold mb-2">No SLO Violations</h3>
                <p className="text-text-muted">All SLOs are currently meeting their targets.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {violations.map((violation) => (
                  <div key={violation.id} className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(violation.severity)}`}>
                            {violation.severity.toUpperCase()}
                          </span>
                          <span className="text-sm font-medium">{violation.slo_name}</span>
                          {violation.credit_issued && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium border border-green-200">
                              💳 CREDIT ISSUED
                            </span>
                          )}
                        </div>
                        <p className="text-white mb-2">{violation.impact_description}</p>
                        <div className="flex items-center gap-4 text-sm text-text-muted">
                          <span>Started: {new Date(violation.started_at).toLocaleString()}</span>
                          {violation.duration_minutes && (
                            <span>Duration: {violation.duration_minutes} min</span>
                          )}
                          <span>Burn Rate: {violation.burn_rate_peak.toFixed(1)}%</span>
                          <span>Budget Consumed: {violation.error_budget_consumed.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>

                    {violation.credit_issued && violation.credit_amount && (
                      <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded">
                        <div className="text-sm">
                          <span className="text-green-400 font-medium">Credit Issued: </span>
                          <span className="text-white">${violation.credit_amount}</span>
                          <span className="text-text-muted ml-2">for SLO breach</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'credits' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Credit Issuance Log</h3>
              <div className="text-sm text-text-muted">
                Total: ${credits.reduce((sum, c) => sum + c.amount, 0)}
              </div>
            </div>

            {credits.length === 0 ? (
              <div className="bg-gray-900 p-8 rounded-lg border border-gray-800 text-center">
                <div className="text-4xl mb-4">💳</div>
                <h3 className="text-xl font-semibold mb-2">No Credits Issued</h3>
                <p className="text-text-muted">No credits have been issued for SLO breaches yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {credits.map((credit) => (
                  <div key={credit.id} className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-lg font-bold text-green-400">${credit.amount}</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            credit.status === 'applied' ? 'bg-green-100 text-green-800 border border-green-200' :
                            credit.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                            'bg-gray-100 text-gray-800 border border-gray-200'
                          }`}>
                            {credit.status.toUpperCase()}
                          </span>
                          {credit.slo_name && (
                            <span className="text-sm text-blue-400">{credit.slo_name}</span>
                          )}
                        </div>
                        <p className="text-white mb-2">{credit.description}</p>
                        <div className="flex items-center gap-4 text-sm text-text-muted">
                          <span>Issued: {new Date(credit.issued_at).toLocaleString()}</span>
                          <span>By: {credit.issued_by}</span>
                          <span>Reason: {credit.reason.replace('_', ' ')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'burn-rates' && dashboardData && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Burn Rate Charts</h3>
            
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <h4 className="text-lg font-semibold mb-4">Error Budget Consumption</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dashboardData.slo_performance.map((slo) => (
                  <div key={slo.slo_id} className="bg-gray-800 p-4 rounded">
                    <h5 className="font-medium mb-3">{slo.name}</h5>
                    <div className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Error Budget Used</span>
                        <span className="font-medium">{(100 - slo.current_availability).toFixed(1)}%</span>
                      </div>
                      <div className="bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            slo.current_availability >= slo.target ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(100, 100 - slo.current_availability)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-sm text-text-muted">
                      Burn Rate: {slo.burn_rate.toFixed(1)}%/day
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}