'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/Toast';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Download, 
  RefreshCw,
  DollarSign,
  AlertTriangle,
  Calendar,
  FileText
} from 'lucide-react';

interface ReportSummary {
  period: string;
  date_range: {
    from: string;
    to: string;
  };
  customers: {
    total: number;
    active: number;
    paused: number;
    canceled: number;
    churn_rate: number;
  };
  events: {
    total: number;
    by_type: Record<string, number>;
    timeline: Record<string, { total: number; by_type: Record<string, number> }>;
  };
  pricing: {
    total_skus: number;
    active_skus: number;
    revenue_by_service: Record<string, number>;
  };
  alerts: {
    total: number;
    by_type: Record<string, number>;
  };
  generated_at: string;
}

export default function ReportsPage() {
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('weekly');
  const [exporting, setExporting] = useState<Set<string>>(new Set());
  
  const { show: showToast } = useToast();

  const fetchSummary = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/admin/reports/summary?period=${period}`, {
        headers: {
          'admin-key': ''
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSummary(data);
      } else {
        showToast({ description: 'Failed to load report summary', variant: 'error' });
      }
    } catch (error) {
      console.error('Error fetching summary:', error);
      showToast({ description: 'Error loading report summary', variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const exportData = async (type: string, format: string = 'csv') => {
    setExporting(prev => new Set([...prev, type]));
    
    try {
      const response = await fetch(`/api/admin/export/${type}?format=${format}`, {
        headers: {
          'admin-key': ''
        }
      });

      if (response.ok) {
        // Get filename from response headers
        const contentDisposition = response.headers.get('content-disposition');
        const filename = contentDisposition?.match(/filename="(.+)"/)?.[1] || `${type}-export.${format}`;
        
        // Create download link
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        showToast({ description: `${type} export downloaded successfully`, variant: 'success' });
      } else {
        showToast({ description: `Failed to export ${type}`, variant: 'error' });
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      showToast({ description: `Error exporting ${type}`, variant: 'error' });
    } finally {
      setExporting(prev => {
        const newSet = new Set(prev);
        newSet.delete(type);
        return newSet;
      });
    }
  };

  const exportComprehensive = async () => {
    setExporting(prev => new Set([...prev, 'comprehensive']));
    
    try {
      const response = await fetch('/api/admin/reports/export', {
        headers: {
          'admin-key': ''
        }
      });

      if (response.ok) {
        // Get filename from response headers
        const contentDisposition = response.headers.get('content-disposition');
        const filename = contentDisposition?.match(/filename="(.+)"/)?.[1] || 'comprehensive-export.json';
        
        // Create download link
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        showToast({ description: 'Comprehensive export downloaded successfully', variant: 'success' });
      } else {
        showToast({ description: 'Failed to export comprehensive data', variant: 'error' });
      }
    } catch (error) {
      console.error('Error exporting comprehensive data:', error);
      showToast({ description: 'Error exporting comprehensive data', variant: 'error' });
    } finally {
      setExporting(prev => {
        const newSet = new Set(prev);
        newSet.delete('comprehensive');
        return newSet;
      });
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [period]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const calculateMRR = () => {
    if (!summary) return 0;
    // Simplified MRR calculation based on active customers
    // In real implementation, you'd have actual pricing data
    return summary.customers.active * 50; // Assuming $50 average per customer
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="h-6 w-6 animate-pulse" />
          <span>Loading reports...</span>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-400">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Failed to load report data</p>
        </div>
      </div>
    );
  }

  const mrr = calculateMRR();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-gray-400 mt-1">Business insights and data exports</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm"
          >
            <option value="daily">Daily (7 days)</option>
            <option value="weekly">Weekly (30 days)</option>
            <option value="monthly">Monthly (6 months)</option>
          </select>
          <button 
            onClick={fetchSummary}
            className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors text-sm"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Date Range */}
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Calendar className="h-4 w-4" />
        <span>
          {formatDate(summary.date_range.from)} - {formatDate(summary.date_range.to)}
        </span>
        <Badge variant="outline" className="ml-2">
          {summary.period}
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-400" />
              Monthly Recurring Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mrr.toLocaleString()}</div>
            <p className="text-xs text-gray-400 mt-1">
              {summary.customers.active} active customers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-400" />
              Total Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.customers.total}</div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="default" className="text-xs">{summary.customers.active} active</Badge>
              <Badge variant="outline" className="text-xs">{summary.customers.paused} paused</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              {summary.customers.churn_rate > 10 ? (
                <TrendingDown className="h-4 w-4 text-red-400" />
              ) : (
                <TrendingUp className="h-4 w-4 text-green-400" />
              )}
              Churn Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.customers.churn_rate}%</div>
            <p className="text-xs text-gray-400 mt-1">
              {summary.customers.canceled} canceled customers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-purple-400" />
              Active SKUs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.pricing.active_skus}</div>
            <p className="text-xs text-gray-400 mt-1">
              of {summary.pricing.total_skus} total SKUs
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Event Analytics */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Event Volume
            </CardTitle>
            <CardDescription>Total: {summary.events.total} events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(summary.events.by_type).map(([type, count]) => (
                <div key={type} className="flex justify-between items-center">
                  <span className="text-sm">{type.replace('_', ' ')}</span>
                  <Badge variant="outline">{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Revenue by Service
            </CardTitle>
            <CardDescription>Active customers by service</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(summary.pricing.revenue_by_service).map(([service, count]) => (
                <div key={service} className="flex justify-between items-center">
                  <span className="text-sm">{service}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="default">{count} customers</Badge>
                    <span className="text-xs text-gray-400">
                      ${(count * 50).toLocaleString()}/mo
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Data Exports
          </CardTitle>
          <CardDescription>Download comprehensive data reports</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Comprehensive Export - Highlighted */}
          <div className="mb-6 p-4 border-2 border-blue-600/30 bg-blue-950/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Download className="h-5 w-5 text-blue-400" />
              <h3 className="font-medium text-blue-100">Complete Data Export</h3>
              <Badge variant="outline" className="text-xs border-blue-600 text-blue-300">
                Recommended
              </Badge>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              Download all customers, events, and alerts in a single comprehensive JSON file.
            </p>
            <button
              onClick={exportComprehensive}
              disabled={exporting.has('comprehensive')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                exporting.has('comprehensive') 
                  ? 'opacity-50 cursor-not-allowed bg-blue-800 border border-blue-700' 
                  : 'bg-blue-600 hover:bg-blue-700 border border-blue-500 text-white'
              }`}
            >
              {exporting.has('comprehensive') ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {exporting.has('comprehensive') ? 'Exporting...' : 'Export All Data (JSON)'}
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { type: 'customers', label: 'Customers', description: 'All customer data' },
              { type: 'events', label: 'Events', description: 'Subscription events' },
              { type: 'revenue', label: 'Revenue', description: 'Revenue analysis' },
              { type: 'audit', label: 'Audit Log', description: 'Admin actions' }
            ].map(({ type, label, description }) => (
              <div key={type} className="p-4 border border-gray-700 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-gray-400" />
                  <h3 className="font-medium">{label}</h3>
                </div>
                <p className="text-xs text-gray-400 mb-3">{description}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => exportData(type, 'csv')}
                    disabled={exporting.has(type)}
                    className={`flex items-center gap-1 px-2 py-1 text-xs border rounded transition-colors ${
                      exporting.has(type) 
                        ? 'opacity-50 cursor-not-allowed border-gray-600' 
                        : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700'
                    }`}
                  >
                    {exporting.has(type) ? (
                      <RefreshCw className="h-3 w-3 animate-spin" />
                    ) : (
                      <Download className="h-3 w-3" />
                    )}
                    CSV
                  </button>
                  <button
                    onClick={() => exportData(type, 'json')}
                    disabled={exporting.has(type)}
                    className={`flex items-center gap-1 px-2 py-1 text-xs border rounded transition-colors ${
                      exporting.has(type) 
                        ? 'opacity-50 cursor-not-allowed border-gray-600' 
                        : 'border-gray-600 hover:border-gray-500 hover:bg-gray-700'
                    }`}
                  >
                    {exporting.has(type) ? (
                      <RefreshCw className="h-3 w-3 animate-spin" />
                    ) : (
                      <Download className="h-3 w-3" />
                    )}
                    JSON
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Info */}
      <div className="text-center text-sm text-gray-400">
        <p>Report generated at {new Date(summary.generated_at).toLocaleString()}</p>
      </div>
    </div>
  );
}