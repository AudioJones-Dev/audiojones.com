'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  Send, 
  Eye, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Activity,
  MessageSquare,
  BarChart3,
  Target,
  RefreshCw,
  Calendar,
  TrendingUp
} from 'lucide-react';

interface DigestStatus {
  sent_at?: string;
  success?: boolean;
  error?: string;
  digest_summary?: {
    slo_healthy: number;
    slo_at_risk: number;
    slo_violating: number;
    open_incidents: number;
    critical_incidents: number;
    capacity_status: string;
  };
}

interface DigestResponse {
  ok: boolean;
  preview_mode?: boolean;
  sent?: boolean;
  digest?: {
    generated_at: string;
    summary: DigestStatus['digest_summary'];
    slo_count?: number;
    incident_count?: number;
    has_capacity_data?: boolean;
  };
  slack?: {
    success: boolean;
    error?: string;
  };
  preview?: any;
  error?: string;
}

export default function AdminDigestPage() {
  const [loading, setLoading] = useState(false);
  const [lastStatus, setLastStatus] = useState<DigestStatus | null>(null);
  const [lastResult, setLastResult] = useState<DigestResponse | null>(null);
  const [previewData, setPreviewData] = useState<any>(null);
  const [configStatus, setConfigStatus] = useState<any>(null);

  // Load digest status and configuration on mount
  useEffect(() => {
    loadDigestStatus();
    loadConfiguration();
  }, []);

  const loadDigestStatus = async () => {
    try {
      // This would typically call an API to get digest status from Firestore
      // For now, we'll use the configuration endpoint
      const response = await fetch('/api/admin/digest/run', {
        headers: {
          'admin-key': process.env.NEXT_PUBLIC_ADMIN_KEY || '',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setConfigStatus(data);
      }
    } catch (error) {
      console.error('Failed to load digest status:', error);
    }
  };

  const loadConfiguration = async () => {
    try {
      const response = await fetch('/api/admin/digest/run', {
        headers: {
          'admin-key': process.env.NEXT_PUBLIC_ADMIN_KEY || '',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setConfigStatus(data);
      }
    } catch (error) {
      console.error('Failed to load configuration:', error);
    }
  };

  const sendDigest = async (preview: boolean = false) => {
    setLoading(true);
    setLastResult(null);
    setPreviewData(null);

    try {
      const url = preview ? '/api/admin/digest/run?preview=true' : '/api/admin/digest/run';
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'admin-key': process.env.NEXT_PUBLIC_ADMIN_KEY || '',
          'Content-Type': 'application/json',
        },
      });

      const data: DigestResponse = await response.json();
      setLastResult(data);

      if (preview && data.preview) {
        setPreviewData(data.preview);
      }

      if (!preview && data.sent) {
        // Reload status after successful send
        await loadDigestStatus();
      }

    } catch (error) {
      console.error('Failed to send digest:', error);
      setLastResult({
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      timeZone: 'America/New_York',
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Ops Digest</h1>
          <p className="text-text-muted">
            Automated operational status reports to Slack
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => sendDigest(true)}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <Eye className="h-4 w-4" />
            {loading ? 'Loading...' : 'Preview'}
          </button>
          
          <button
            onClick={() => sendDigest(false)}
            disabled={loading || !configStatus?.configuration?.slack_configured}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            {loading ? 'Sending...' : 'Send Digest Now'}
          </button>
        </div>
      </div>

      {/* Configuration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Configuration Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                configStatus?.configuration?.slack_configured ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <div>
                <p className="text-sm font-medium text-white">Slack Integration</p>
                <p className="text-xs text-text-muted">
                  {configStatus?.configuration?.slack_configured ? 'Configured' : 'Not configured'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <div>
                <p className="text-sm font-medium text-white">SLO Data</p>
                <p className="text-xs text-text-muted">Available</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <div>
                <p className="text-sm font-medium text-white">Incident Data</p>
                <p className="text-xs text-text-muted">Available</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Last Status */}
      {lastStatus && (
        <Card>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Last Digest Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {lastStatus.success ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                )}
                <div>
                  <p className="text-white font-medium">
                    {lastStatus.success ? 'Successfully sent' : 'Failed to send'}
                  </p>
                  {lastStatus.sent_at && (
                    <p className="text-sm text-text-muted">
                      {getTimeAgo(lastStatus.sent_at)} • {formatTimestamp(lastStatus.sent_at)}
                    </p>
                  )}
                </div>
              </div>
              
              {lastStatus.digest_summary && (
                <div className="text-right text-sm text-text-muted">
                  <p>{lastStatus.digest_summary.slo_healthy}/{lastStatus.digest_summary.slo_healthy + lastStatus.digest_summary.slo_at_risk + lastStatus.digest_summary.slo_violating} SLOs healthy</p>
                  <p>{lastStatus.digest_summary.open_incidents} open incidents</p>
                </div>
              )}
            </div>
            
            {lastStatus.error && (
              <div className="mt-3 p-3 bg-red-900/20 border border-red-800 rounded-lg">
                <p className="text-sm text-red-400">Error: {lastStatus.error}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Last Result */}
      {lastResult && (
        <Card>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              {lastResult.preview_mode ? 'Digest Preview' : 'Digest Result'}
            </CardTitle>
            <CardDescription>
              {lastResult.preview_mode ? 'Preview generated without sending' : 'Live digest sent to Slack'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {lastResult.ok ? (
              <>
                {/* Summary Stats */}
                {lastResult.digest?.summary && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Target className="h-4 w-4 text-green-400" />
                        <span className="text-2xl font-bold text-green-400">
                          {lastResult.digest.summary.slo_healthy}
                        </span>
                      </div>
                      <p className="text-xs text-text-muted">SLOs Healthy</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <AlertTriangle className="h-4 w-4 text-yellow-400" />
                        <span className="text-2xl font-bold text-yellow-400">
                          {lastResult.digest.summary.slo_at_risk + lastResult.digest.summary.slo_violating}
                        </span>
                      </div>
                      <p className="text-xs text-text-muted">SLOs At Risk</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Activity className="h-4 w-4 text-red-400" />
                        <span className="text-2xl font-bold text-red-400">
                          {lastResult.digest.summary.open_incidents}
                        </span>
                      </div>
                      <p className="text-xs text-text-muted">Open Incidents</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <BarChart3 className="h-4 w-4 text-blue-400" />
                        <Badge variant="outline" className="text-xs">
                          {lastResult.digest.summary.capacity_status}
                        </Badge>
                      </div>
                      <p className="text-xs text-text-muted">Capacity Status</p>
                    </div>
                  </div>
                )}

                {/* Result Status */}
                <div className="flex items-center gap-2">
                  {lastResult.sent ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : lastResult.preview_mode ? (
                    <Eye className="h-5 w-5 text-blue-500" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  )}
                  <span className="text-white font-medium">
                    {lastResult.sent ? 'Sent to Slack successfully' :
                     lastResult.preview_mode ? 'Preview generated' :
                     'Generated but not sent'}
                  </span>
                  {lastResult.digest?.generated_at && (
                    <span className="text-text-muted text-sm">
                      • {getTimeAgo(lastResult.digest.generated_at)}
                    </span>
                  )}
                </div>

                {/* Slack Error */}
                {lastResult.slack?.error && (
                  <div className="p-3 bg-red-900/20 border border-red-800 rounded-lg">
                    <p className="text-sm text-red-400">Slack Error: {lastResult.slack.error}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="p-3 bg-red-900/20 border border-red-800 rounded-lg">
                <p className="text-sm text-red-400">Error: {lastResult.error}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Preview Data */}
      {previewData && (
        <Card>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Slack Message Preview
            </CardTitle>
            <CardDescription>
              What will be sent to Slack
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-text-muted mb-2">Fallback Text</h4>
                <p className="text-sm text-white bg-gray-900 p-3 rounded">
                  {previewData.preview?.text}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-text-muted mb-2">
                  Slack Blocks ({previewData.preview?.blocks_count} blocks)
                </h4>
                <div className="bg-gray-900 p-3 rounded max-h-60 overflow-y-auto">
                  <pre className="text-xs text-text-primary">
                    {JSON.stringify(previewData.slack_payload, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Digest Sections */}
      <Card>
        <CardHeader>
          <CardTitle className="text-white">Digest Sections</CardTitle>
          <CardDescription>
            What's included in the operational digest
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg">
              <Target className="h-8 w-8 text-blue-400" />
              <div>
                <h4 className="font-medium text-white">Service Level Objectives</h4>
                <p className="text-sm text-text-muted">SLO status and error budget consumption</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg">
              <Activity className="h-8 w-8 text-red-400" />
              <div>
                <h4 className="font-medium text-white">Open Incidents</h4>
                <p className="text-sm text-text-muted">Active incidents requiring attention</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg">
              <BarChart3 className="h-8 w-8 text-green-400" />
              <div>
                <h4 className="font-medium text-white">Capacity Forecast</h4>
                <p className="text-sm text-text-muted">Resource utilization and predictions</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Automation Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Automation Setup
          </CardTitle>
          <CardDescription>
            How to schedule automatic digest delivery
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-white mb-2">Command Line</h4>
            <code className="text-sm bg-gray-900 p-2 rounded block text-green-400">
              npx tsx scripts/runOpsDigest.ts
            </code>
          </div>
          
          <div>
            <h4 className="font-medium text-white mb-2">API Endpoint</h4>
            <code className="text-sm bg-gray-900 p-2 rounded block text-blue-400">
              POST /api/admin/digest/run
            </code>
          </div>
          
          <div>
            <h4 className="font-medium text-white mb-2">Recommended Schedule</h4>
            <ul className="text-sm text-text-muted space-y-1">
              <li>• Daily at 9:00 AM EST (morning standup)</li>
              <li>• Critical incidents: immediate alerts via existing system</li>
              <li>• Weekly summaries: Fridays at 5:00 PM EST</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}