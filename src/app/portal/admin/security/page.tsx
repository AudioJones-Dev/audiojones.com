/**
 * Security & Compliance Dashboard
 * 
 * Comprehensive security monitoring interface with threat detection,
 * vulnerability management, compliance tracking, and security analytics.
 */

'use client';

import { useState, useEffect } from 'react';
import { useRequireAuth } from '@/lib/client/useRequireAuth';

interface SecurityStatus {
  status: 'secure' | 'warning' | 'critical';
  metrics: {
    threats_detected: number;
    threats_blocked: number;
    vulnerabilities_found: number;
    vulnerabilities_fixed: number;
    compliance_violations: number;
    security_incidents: number;
    compliance_score: number;
    risk_score: number;
  };
  active_threats: number;
  compliance_score: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
}

interface SecurityThreat {
  id: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  source: string;
  target: string;
  timestamp: number;
  status: string;
  details: any;
  indicators: any[];
  response: any[];
}

interface Vulnerability {
  id: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'informational';
  component: string;
  description: string;
  cve_id?: string;
  cvss_score?: number;
  patch_available: boolean;
  status: string;
  discovered: number;
}

interface ComplianceRule {
  id: string;
  framework: string;
  category: string;
  requirement: string;
  description: string;
  severity: string;
  status: 'compliant' | 'non_compliant' | 'unknown' | 'investigating';
  last_check: number;
}

export default function SecurityDashboard() {
  const { loading } = useRequireAuth({ redirectTo: "/login" });
  const [activeTab, setActiveTab] = useState('overview');
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus | null>(null);
  const [threats, setThreats] = useState<SecurityThreat[]>([]);
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [complianceRules, setComplianceRules] = useState<ComplianceRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<any>(null);

  useEffect(() => {
    if (!loading) {
      loadSecurityData();
      const interval = setInterval(loadSecurityData, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [loading]);

  const loadSecurityData = async () => {
    try {
      setError(null);
      
      // Load security status
      const statusResponse = await fetch('/api/admin/security?action=status');
      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        setSecurityStatus(statusData.data);
      }

      // Load threats
      const threatsResponse = await fetch('/api/admin/security?action=threats&limit=20');
      if (threatsResponse.ok) {
        const threatsData = await threatsResponse.json();
        setThreats(threatsData.data.threats);
      }

      // Load vulnerabilities
      const vulnResponse = await fetch('/api/admin/security?action=vulnerabilities&limit=20');
      if (vulnResponse.ok) {
        const vulnData = await vulnResponse.json();
        setVulnerabilities(vulnData.data.vulnerabilities);
      }

      // Load compliance
      const complianceResponse = await fetch('/api/admin/security?action=compliance');
      if (complianceResponse.ok) {
        const complianceData = await complianceResponse.json();
        setComplianceRules(complianceData.data.rules);
      }

    } catch (error) {
      console.error('Error loading security data:', error);
      setError('Failed to load security data');
    } finally {
      setIsLoading(false);
    }
  };

  const runSecurityTest = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/security?action=security-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test_type: 'comprehensive' }),
      });

      if (response.ok) {
        const data = await response.json();
        setTestResults(data.data.test_results);
      } else {
        throw new Error('Security test failed');
      }
    } catch (error) {
      console.error('Error running security test:', error);
      setError('Failed to run security test');
    } finally {
      setIsLoading(false);
    }
  };

  const resolveIncident = async (threatId: string, resolution: string) => {
    try {
      const response = await fetch('/api/admin/security?action=resolve-incident', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threat_id: threatId, resolution }),
      });

      if (response.ok) {
        await loadSecurityData(); // Refresh data
      } else {
        throw new Error('Failed to resolve incident');
      }
    } catch (error) {
      console.error('Error resolving incident:', error);
      setError('Failed to resolve incident');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'secure': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-text-muted';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'informational': return 'bg-gray-100 text-gray-800 border border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'high': return 'text-orange-500';
      case 'critical': return 'text-red-500';
      default: return 'text-text-muted';
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
          <h1 className="text-3xl font-bold mb-2">Security & Compliance Dashboard</h1>
          <p className="text-text-muted">
            Enterprise security monitoring, threat detection, and compliance management
          </p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-200 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Security Status Overview */}
        {securityStatus && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">Security Status</p>
                  <p className={`text-2xl font-bold ${getStatusColor(securityStatus.status)}`}>
                    {securityStatus.status.toUpperCase()}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  securityStatus.status === 'secure' ? 'bg-green-500/20' :
                  securityStatus.status === 'warning' ? 'bg-yellow-500/20' : 'bg-red-500/20'
                }`}>
                  🛡️
                </div>
              </div>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">Active Threats</p>
                  <p className="text-2xl font-bold">{securityStatus.active_threats}</p>
                </div>
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                  🚨
                </div>
              </div>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">Compliance Score</p>
                  <p className="text-2xl font-bold">{Math.round(securityStatus.compliance_score)}%</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  📋
                </div>
              </div>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">Risk Level</p>
                  <p className={`text-2xl font-bold ${getRiskLevelColor(securityStatus.risk_level)}`}>
                    {securityStatus.risk_level.toUpperCase()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                  ⚠️
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="border-b border-gray-800 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'threats', label: 'Threats', icon: '🚨' },
              { id: 'vulnerabilities', label: 'Vulnerabilities', icon: '🔍' },
              { id: 'compliance', label: 'Compliance', icon: '📋' },
              { id: 'testing', label: 'Security Testing', icon: '🧪' },
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
        {activeTab === 'overview' && securityStatus && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Security Metrics */}
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                <h3 className="text-xl font-semibold mb-4">Security Metrics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Threats Detected:</span>
                    <span className="font-medium">{securityStatus.metrics.threats_detected}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Threats Blocked:</span>
                    <span className="font-medium text-green-400">{securityStatus.metrics.threats_blocked}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Vulnerabilities Found:</span>
                    <span className="font-medium">{securityStatus.metrics.vulnerabilities_found}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Vulnerabilities Fixed:</span>
                    <span className="font-medium text-green-400">{securityStatus.metrics.vulnerabilities_fixed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Security Incidents:</span>
                    <span className="font-medium">{securityStatus.metrics.security_incidents}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Risk Score:</span>
                    <span className={`font-medium ${
                      securityStatus.metrics.risk_score > 75 ? 'text-red-400' :
                      securityStatus.metrics.risk_score > 50 ? 'text-yellow-400' :
                      securityStatus.metrics.risk_score > 25 ? 'text-orange-400' : 'text-green-400'
                    }`}>
                      {securityStatus.metrics.risk_score}/100
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={runSecurityTest}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                  >
                    🧪 Run Security Test
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
                  >
                    🔄 Refresh Dashboard
                  </button>
                  <button
                    onClick={() => {
                      fetch('/api/admin/security?action=scan-vulnerabilities', {
                        method: 'POST',
                      });
                    }}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded transition-colors"
                  >
                    🔍 Scan Vulnerabilities
                  </button>
                  <button
                    onClick={() => {
                      fetch('/api/admin/security?action=compliance-check', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ framework: 'all' }),
                      });
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
                  >
                    📋 Run Compliance Check
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'threats' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Security Threats</h3>
              <div className="text-sm text-text-muted">
                Showing {threats.length} most recent threats
              </div>
            </div>

            {threats.length === 0 ? (
              <div className="bg-gray-900 p-8 rounded-lg border border-gray-800 text-center">
                <div className="text-4xl mb-4">🛡️</div>
                <h3 className="text-xl font-semibold mb-2">No Active Threats</h3>
                <p className="text-text-muted">Your system is currently secure with no detected threats.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {threats.map((threat) => (
                  <div key={threat.id} className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(threat.severity)}`}>
                            {threat.severity.toUpperCase()}
                          </span>
                          <span className="text-sm font-medium">{threat.type.replace('_', ' ').toUpperCase()}</span>
                        </div>
                        <p className="text-text-muted text-sm">
                          Source: {threat.source} → Target: {threat.target}
                        </p>
                        <p className="text-text-muted text-sm">
                          Detected: {new Date(threat.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {threat.status !== 'resolved' && (
                          <button
                            onClick={() => {
                              const resolution = prompt('Enter resolution details:');
                              if (resolution) {
                                resolveIncident(threat.id, resolution);
                              }
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </div>

                    {threat.indicators.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Threat Indicators:</h4>
                        <div className="space-y-1">
                          {threat.indicators.map((indicator, index) => (
                            <div key={index} className="text-sm text-text-muted">
                              {indicator.type}: {indicator.value} (confidence: {Math.round(indicator.confidence * 100)}%)
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'vulnerabilities' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Vulnerabilities</h3>
              <div className="text-sm text-text-muted">
                Showing {vulnerabilities.length} vulnerabilities
              </div>
            </div>

            {vulnerabilities.length === 0 ? (
              <div className="bg-gray-900 p-8 rounded-lg border border-gray-800 text-center">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-xl font-semibold mb-2">No Vulnerabilities Found</h3>
                <p className="text-text-muted">Your system has no known vulnerabilities.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {vulnerabilities.map((vuln) => (
                  <div key={vuln.id} className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(vuln.severity)}`}>
                            {vuln.severity.toUpperCase()}
                          </span>
                          <span className="text-sm font-medium">{vuln.component}</span>
                          {vuln.cve_id && (
                            <span className="text-xs text-blue-400">{vuln.cve_id}</span>
                          )}
                        </div>
                        <p className="text-white mb-2">{vuln.description}</p>
                        <div className="flex items-center gap-4 text-sm text-text-muted">
                          <span>Type: {vuln.type}</span>
                          {vuln.cvss_score && <span>CVSS: {vuln.cvss_score}</span>}
                          <span>Status: {vuln.status.replace('_', ' ')}</span>
                          <span className={vuln.patch_available ? 'text-green-400' : 'text-red-400'}>
                            {vuln.patch_available ? '✅ Patch Available' : '❌ No Patch'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'compliance' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Compliance Status</h3>
              <div className="text-sm text-text-muted">
                Monitoring {complianceRules.length} compliance rules
              </div>
            </div>

            {/* Compliance Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['SOC2', 'GDPR', 'HIPAA'].map((framework) => {
                const frameworkRules = complianceRules.filter(r => r.framework === framework);
                const compliantCount = frameworkRules.filter(r => r.status === 'compliant').length;
                const compliancePercentage = frameworkRules.length > 0 ? 
                  (compliantCount / frameworkRules.length) * 100 : 0;

                return (
                  <div key={framework} className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                    <h4 className="text-lg font-semibold mb-4">{framework}</h4>
                    <div className="text-3xl font-bold mb-2">
                      {Math.round(compliancePercentage)}%
                    </div>
                    <div className="text-sm text-text-muted">
                      {compliantCount} of {frameworkRules.length} rules compliant
                    </div>
                    <div className="mt-4 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${compliancePercentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Compliance Rules */}
            <div className="space-y-4">
              {complianceRules.map((rule) => (
                <div key={rule.id} className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-medium text-blue-400">{rule.framework}</span>
                        <span className="text-sm text-text-muted">{rule.requirement}</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          rule.status === 'compliant' ? 'bg-green-100 text-green-800 border border-green-200' :
                          rule.status === 'non_compliant' ? 'bg-red-100 text-red-800 border border-red-200' :
                          'bg-gray-100 text-gray-800 border border-gray-200'
                        }`}>
                          {rule.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <h4 className="text-white font-medium mb-2">{rule.category}</h4>
                      <p className="text-text-muted text-sm">{rule.description}</p>
                      {rule.last_check > 0 && (
                        <p className="text-text-muted text-xs mt-2">
                          Last checked: {new Date(rule.last_check).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'testing' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Security Testing</h3>
              <button
                onClick={runSecurityTest}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
              >
                🧪 Run Comprehensive Security Test
              </button>
            </div>

            {testResults ? (
              <div className="space-y-6">
                {/* Overall Score */}
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                  <h4 className="text-xl font-semibold mb-4">Test Results</h4>
                  <div className="flex items-center gap-6">
                    <div>
                      <div className="text-4xl font-bold text-green-400">{testResults.overall_score}/100</div>
                      <div className="text-sm text-text-muted">Overall Security Score</div>
                    </div>
                    <div>
                      <div className={`text-2xl font-semibold ${getRiskLevelColor(testResults.risk_level)}`}>
                        {testResults.risk_level.toUpperCase()}
                      </div>
                      <div className="text-sm text-text-muted">Risk Level</div>
                    </div>
                    <div>
                      <div className="text-2xl font-semibold">{testResults.total_test_time}ms</div>
                      <div className="text-sm text-text-muted">Test Duration</div>
                    </div>
                  </div>
                </div>

                {/* Test Categories */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Threat Detection */}
                  <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                    <h4 className="text-lg font-semibold mb-4">🚨 Threat Detection</h4>
                    <div className="space-y-3">
                      {Object.entries(testResults.threat_detection).map(([test, result]: [string, any]) => (
                        <div key={test} className="flex justify-between items-center">
                          <span className="text-sm">{test.replace('_', ' ')}</span>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded ${
                              result.status === 'pass' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {result.status}
                            </span>
                            <span className="text-xs text-text-muted">{result.response_time}ms</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Vulnerability Assessment */}
                  <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                    <h4 className="text-lg font-semibold mb-4">🔍 Vulnerability Assessment</h4>
                    <div className="space-y-3">
                      {Object.entries(testResults.vulnerability_assessment).map(([scan, results]: [string, any]) => (
                        <div key={scan} className="border-b border-gray-700 pb-2">
                          <div className="text-sm font-medium mb-1">{scan.replace('_', ' ')}</div>
                          <div className="text-xs text-text-muted grid grid-cols-2 gap-2">
                            <span>Total: {results.vulnerabilities_found}</span>
                            <span>Critical: {results.critical}</span>
                            <span>High: {results.high}</span>
                            <span>Medium: {results.medium}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Compliance Testing */}
                  <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                    <h4 className="text-lg font-semibold mb-4">📋 Compliance Testing</h4>
                    <div className="space-y-3">
                      {Object.entries(testResults.compliance_testing).map(([framework, results]: [string, any]) => (
                        <div key={framework} className="flex justify-between items-center">
                          <span className="text-sm">{framework.replace('_', ' ')}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{results.score}%</span>
                            <span className="text-xs text-text-muted">
                              {results.warnings} warnings
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Security Controls */}
                  <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                    <h4 className="text-lg font-semibold mb-4">⚙️ Security Controls</h4>
                    <div className="space-y-3">
                      {Object.entries(testResults.security_controls).map(([control, results]: [string, any]) => (
                        <div key={control} className="flex justify-between items-center">
                          <span className="text-sm">{control.replace('_', ' ')}</span>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded ${
                              results.status === 'pass' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {results.status}
                            </span>
                            <span className="text-xs text-text-muted">{results.effectiveness}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                {testResults.recommendations && testResults.recommendations.length > 0 && (
                  <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                    <h4 className="text-lg font-semibold mb-4">💡 Recommendations</h4>
                    <ul className="space-y-2">
                      {testResults.recommendations.map((rec: string, index: number) => (
                        <li key={index} className="text-sm text-text-primary flex items-start gap-2">
                          <span className="text-yellow-400 mt-1">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-900 p-8 rounded-lg border border-gray-800 text-center">
                <div className="text-4xl mb-4">🧪</div>
                <h3 className="text-xl font-semibold mb-2">Run Security Tests</h3>
                <p className="text-text-muted mb-6">
                  Execute comprehensive security testing to evaluate threat detection, 
                  vulnerability assessment, compliance validation, and security controls.
                </p>
                <button
                  onClick={runSecurityTest}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded transition-colors"
                >
                  Start Security Test
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}