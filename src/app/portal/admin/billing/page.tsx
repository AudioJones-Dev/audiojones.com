'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Download,
  Eye,
  EyeOff,
  Calendar,
  TrendingUp,
  DollarSign
} from 'lucide-react';

interface BillingDiff {
  id: string;
  type: 'missing_contract' | 'missing_subscription' | 'price_mismatch' | 'status_mismatch' | 'missing_sku';
  severity: 'high' | 'medium' | 'low';
  whop_id?: string;
  firestore_id?: string;
  description: string;
  expected_value?: any;
  actual_value?: any;
  customer_email?: string;
  created_at: string;
  reconciled_at: string;
  resolved: boolean;
  false_positive: boolean;
}

interface ReconciliationSummary {
  total: number;
  active: number;
  resolved: number;
  false_positives: number;
  high_severity: number;
  medium_severity: number;
  low_severity: number;
}

interface ReconciliationData {
  summary: ReconciliationSummary;
  latest_reconciliation: string | null;
  active_diffs: BillingDiff[];
}

export default function BillingReconciliationPage() {
  const { user } = useAuth();
  const [data, setData] = useState<ReconciliationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [reconciling, setReconciling] = useState(false);
  const [selectedDiff, setSelectedDiff] = useState<BillingDiff | null>(null);

  const fetchReconciliationData = async () => {
    if (!user) return;

    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/admin/billing/reconcile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        console.error('Failed to fetch reconciliation data');
      }
    } catch (error) {
      console.error('Error fetching reconciliation data:', error);
    } finally {
      setLoading(false);
    }
  };

  const runReconciliation = async () => {
    if (!user) return;

    setReconciling(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/admin/billing/reconcile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      
      if (result.ok) {
        // Refresh data after successful reconciliation
        await fetchReconciliationData();
        
        // Show success/warning message based on variance
        console.log('Reconciliation completed:', result.message);
      } else {
        console.error('Reconciliation failed:', result.error);
      }
    } catch (error) {
      console.error('Error running reconciliation:', error);
    } finally {
      setReconciling(false);
    }
  };

  const markAsFalsePositive = async (diffId: string) => {
    if (!user) return;

    try {
      const token = await user.getIdToken();
      const response = await fetch(`/api/admin/billing/diffs/${diffId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ false_positive: true })
      });

      if (response.ok) {
        await fetchReconciliationData();
      }
    } catch (error) {
      console.error('Error marking as false positive:', error);
    }
  };

  useEffect(() => {
    fetchReconciliationData();
  }, [user]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-900/30';
      case 'medium': return 'text-yellow-400 bg-yellow-900/30';
      case 'low': return 'text-blue-400 bg-blue-900/30';
      default: return 'text-text-muted bg-gray-900/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'missing_contract': return '📋';
      case 'missing_subscription': return '🔄';
      case 'price_mismatch': return '💰';
      case 'status_mismatch': return '⚠️';
      case 'missing_sku': return '🏷️';
      default: return '❓';
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-700 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-800 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Failed to Load Data</h2>
          <p className="text-text-muted">Unable to fetch billing reconciliation data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Billing Reconciliation</h1>
          <p className="text-text-muted mt-1">
            Whop ↔ Firestore billing integrity monitoring
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {data.latest_reconciliation && (
            <span className="text-sm text-text-muted">
              Last run: {new Date(data.latest_reconciliation).toLocaleString()}
            </span>
          )}
          <button
            onClick={runReconciliation}
            disabled={reconciling}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium"
          >
            <RefreshCw className={`w-4 h-4 ${reconciling ? 'animate-spin' : ''}`} />
            {reconciling ? 'Reconciling...' : 'Run Reconciliation'}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-900 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">Total Diffs</p>
              <p className="text-2xl font-bold text-white">{data.summary.total}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">Active Issues</p>
              <p className="text-2xl font-bold text-red-400">{data.summary.active}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">Resolved</p>
              <p className="text-2xl font-bold text-green-400">{data.summary.resolved}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">False Positives</p>
              <p className="text-2xl font-bold text-yellow-400">{data.summary.false_positives}</p>
            </div>
            <EyeOff className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Severity Breakdown */}
      <div className="bg-gray-900 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Active Issues by Severity</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">{data.summary.high_severity}</div>
            <div className="text-sm text-text-muted">High Severity</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{data.summary.medium_severity}</div>
            <div className="text-sm text-text-muted">Medium Severity</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{data.summary.low_severity}</div>
            <div className="text-sm text-text-muted">Low Severity</div>
          </div>
        </div>
      </div>

      {/* Active Diffs Table */}
      <div className="bg-gray-900 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Active Billing Differences</h2>
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-text-muted" />
            <span className="text-sm text-text-muted">CSV export available after reconciliation</span>
          </div>
        </div>

        {data.active_diffs.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No Active Issues</h3>
            <p className="text-text-muted">All billing differences have been resolved or marked as false positives</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 text-text-muted font-medium">Type</th>
                  <th className="text-left py-3 text-text-muted font-medium">Severity</th>
                  <th className="text-left py-3 text-text-muted font-medium">Description</th>
                  <th className="text-left py-3 text-text-muted font-medium">Customer</th>
                  <th className="text-left py-3 text-text-muted font-medium">Created</th>
                  <th className="text-left py-3 text-text-muted font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.active_diffs.map((diff) => (
                  <tr key={diff.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getTypeIcon(diff.type)}</span>
                        <span className="text-text-primary capitalize">{diff.type.replace('_', ' ')}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(diff.severity)}`}>
                        {diff.severity}
                      </span>
                    </td>
                    <td className="py-3 text-text-primary max-w-md">
                      <div className="truncate" title={diff.description}>
                        {diff.description}
                      </div>
                    </td>
                    <td className="py-3 text-text-primary">
                      {diff.customer_email || '-'}
                    </td>
                    <td className="py-3 text-text-muted">
                      {new Date(diff.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedDiff(diff)}
                          className="p-1 text-blue-400 hover:text-blue-300"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => markAsFalsePositive(diff.id)}
                          className="p-1 text-yellow-400 hover:text-yellow-300"
                          title="Mark as false positive"
                        >
                          <EyeOff className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedDiff && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Billing Difference Details</h3>
              <button
                onClick={() => setSelectedDiff(null)}
                className="text-text-muted hover:text-white"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-text-muted mb-1">Type</label>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getTypeIcon(selectedDiff.type)}</span>
                  <span className="text-white capitalize">{selectedDiff.type.replace('_', ' ')}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-text-muted mb-1">Description</label>
                <p className="text-white">{selectedDiff.description}</p>
              </div>
              
              {selectedDiff.whop_id && (
                <div>
                  <label className="block text-sm text-text-muted mb-1">Whop ID</label>
                  <code className="text-green-400 font-mono">{selectedDiff.whop_id}</code>
                </div>
              )}
              
              {selectedDiff.firestore_id && (
                <div>
                  <label className="block text-sm text-text-muted mb-1">Firestore ID</label>
                  <code className="text-blue-400 font-mono">{selectedDiff.firestore_id}</code>
                </div>
              )}
              
              {selectedDiff.expected_value && (
                <div>
                  <label className="block text-sm text-text-muted mb-1">Expected Value</label>
                  <pre className="text-green-400 font-mono text-sm bg-gray-800 p-2 rounded">
                    {JSON.stringify(selectedDiff.expected_value, null, 2)}
                  </pre>
                </div>
              )}
              
              {selectedDiff.actual_value && (
                <div>
                  <label className="block text-sm text-text-muted mb-1">Actual Value</label>
                  <pre className="text-red-400 font-mono text-sm bg-gray-800 p-2 rounded">
                    {JSON.stringify(selectedDiff.actual_value, null, 2)}
                  </pre>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => markAsFalsePositive(selectedDiff.id)}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg"
              >
                Mark as False Positive
              </button>
              <button
                onClick={() => setSelectedDiff(null)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}