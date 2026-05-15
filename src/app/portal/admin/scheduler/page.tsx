'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Clock, TrendingUp, AlertTriangle, Play, RefreshCw, Calendar, BarChart3, Target } from 'lucide-react';

interface ForecastSummary {
  current_utilization: string;
  projected_3day_utilization: string;
  trend_hours_per_day: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  days_until_capacity: number | null;
  confidence_score: number;
}

interface ScanResult {
  ok: boolean;
  alertsCreated: number;
  forecastSummary: ForecastSummary;
  scanDetails: {
    scan_timestamp: string;
    snapshots_analyzed: number;
    existing_alerts_skipped: number;
  };
  error?: string;
}

interface SchedulerStatus {
  lastRun?: string;
  lastResult?: ScanResult;
  isRunning: boolean;
}

export default function AdminSchedulerPage() {
  const [status, setStatus] = useState<SchedulerStatus>({ isRunning: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [runHistory, setRunHistory] = useState<any[]>([]);

  useEffect(() => {
    fetchSchedulerStatus();
    fetchRunHistory();
  }, []);

  const fetchSchedulerStatus = async () => {
    try {
      // For now, we'll show a placeholder status
      // In a real implementation, you might store last run info in Firestore
      setStatus({ isRunning: false });
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch scheduler status');
      setLoading(false);
    }
  };

  const fetchRunHistory = async () => {
    try {
      // Fetch recent scan results from Firestore
      // This would connect to the predictive_scans collection
      setRunHistory([]);
    } catch (err) {
      console.error('Failed to fetch run history:', err);
    }
  };

  const runScheduler = async () => {
    try {
      setStatus(prev => ({ ...prev, isRunning: true }));
      setError(null);
      
      const response = await fetch('/api/_proxy/admin/scheduler/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result: ScanResult = await response.json();
      
      if (result.ok) {
        setStatus({
          isRunning: false,
          lastRun: new Date().toISOString(),
          lastResult: result
        });
        
        alert(`🔮 Predictive scan completed!\n\n• ${result.alertsCreated} alerts created\n• Risk level: ${result.forecastSummary.risk_level}\n• Current utilization: ${result.forecastSummary.current_utilization}\n• Projected 3-day: ${result.forecastSummary.projected_3day_utilization}`);
      } else {
        throw new Error(result.error || 'Scheduler run failed');
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run scheduler');
      setStatus(prev => ({ ...prev, isRunning: false }));
    }
  };

  const getRiskBadgeVariant = (risk: string): "default" | "secondary" | "outline" | undefined => {
    switch (risk) {
      case 'critical': return 'outline';
      case 'high': return 'outline';
      case 'medium': return 'secondary';
      case 'low': return 'default';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-lg">Loading scheduler status...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Predictive Scheduler</h1>
          <p className="text-muted-foreground mt-2">
            Proactive capacity management through trend analysis and predictive alerting
          </p>
        </div>
        
        <button
          onClick={runScheduler}
          disabled={status.isRunning}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {status.isRunning ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Running Scan...
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Run Now
            </>
          )}
        </button>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">Error: {error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scheduler Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Scheduler Status
          </CardTitle>
          <CardDescription>
            Current status and last run information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${status.isRunning ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
              <div>
                <p className="text-sm font-medium">Status</p>
                <p className="text-lg">{status.isRunning ? 'Running' : 'Idle'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Last Run</p>
                <p className="text-lg">{status.lastRun ? formatDate(status.lastRun) : 'Never'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Target className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Schedule</p>
                <p className="text-lg">Every 6 hours</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Last Scan Results */}
      {status.lastResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Latest Forecast Results
            </CardTitle>
            <CardDescription>
              Predictive analysis from most recent scan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Current Utilization</span>
                </div>
                <p className="text-2xl font-bold text-blue-700">
                  {status.lastResult.forecastSummary.current_utilization}
                </p>
              </div>
              
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium">3-Day Projection</span>
                </div>
                <p className="text-2xl font-bold text-orange-700">
                  {status.lastResult.forecastSummary.projected_3day_utilization}
                </p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Trend</span>
                </div>
                <p className="text-2xl font-bold text-purple-700">
                  {status.lastResult.forecastSummary.trend_hours_per_day > 0 ? '+' : ''}
                  {status.lastResult.forecastSummary.trend_hours_per_day.toFixed(1)} hrs/day
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={getRiskBadgeVariant(status.lastResult.forecastSummary.risk_level)}>
                    {status.lastResult.forecastSummary.risk_level.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">Risk Level</p>
                <p className="text-xs text-gray-500 mt-1">
                  Confidence: {Math.round(status.lastResult.forecastSummary.confidence_score * 100)}%
                </p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm font-medium">Alerts Created</p>
                <p className="text-lg">{status.lastResult.alertsCreated}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Snapshots Analyzed</p>
                <p className="text-lg">{status.lastResult.scanDetails.snapshots_analyzed}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Alerts Skipped</p>
                <p className="text-lg">{status.lastResult.scanDetails.existing_alerts_skipped}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* How It Works */}
      <Card>
        <CardHeader>
          <CardTitle>How Predictive Scheduling Works</CardTitle>
          <CardDescription>
            Understanding the predictive capacity management system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-2">📊 Trend Analysis</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Analyzes last 7 capacity snapshots</li>
                <li>• Computes daily growth trends (hours/day, MRR/day)</li>
                <li>• Uses linear regression for trend projection</li>
                <li>• Calculates confidence scores based on data consistency</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">🚨 Predictive Alerts</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Warning: 90%+ utilization in 3 days (info severity)</li>
                <li>• Critical: 100%+ utilization in 3 days (warning severity)</li>
                <li>• Idempotent: One alert per type per day</li>
                <li>• Auto-processed via existing remediation system</li>
              </ul>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-2 text-blue-800">🔮 Proactive Benefits</h3>
            <p className="text-sm text-blue-700">
              Instead of reacting to capacity breaches, the system now predicts them 3 days in advance, 
              giving you time to adjust capacity, onboard new team members, or reschedule projects 
              before hitting critical thresholds.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}