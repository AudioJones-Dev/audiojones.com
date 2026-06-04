'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  ArrowLeft,
  ExternalLink,
  Copy,
  CheckCircle,
  AlertTriangle,
  Clock,
  Eye,
  RefreshCw,
  Rss,
  Globe,
  Shield,
  AlertCircle,
  Activity
} from 'lucide-react';
import type { IncidentFeedItem, IncidentFeedResponse } from '@/types/incidents';

export default function IncidentFeedPage() {
  const [incidents, setIncidents] = useState<IncidentFeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const fetchFeed = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch from our own API (internal request)
      const response = await fetch('/api/incidents?limit=50');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: IncidentFeedResponse = await response.json();
      setIncidents(data.incidents || []);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch incident feed');
      console.error('Failed to fetch incident feed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedUrl(label);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'open': return 'default';
      case 'investigating': return 'outline';
      case 'monitoring': return 'secondary';
      case 'resolved': return 'outline';
      default: return 'default';
    }
  };

  const getSeverityBadgeVariant = (severity?: string) => {
    switch (severity) {
      case 'critical': return 'default';
      case 'high': return 'secondary';
      case 'medium': return 'outline';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'investigating': return <Activity className="h-4 w-4 text-yellow-500" />;
      case 'monitoring': return <Eye className="h-4 w-4 text-blue-500" />;
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return 'Unknown';
    return new Date(timestamp).toLocaleString();
  };

  const getTimeAgo = (timestamp?: string) => {
    if (!timestamp) return '';
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  // Build endpoint URLs
  const baseUrl = typeof window !== 'undefined' 
    ? `${window.location.protocol}//${window.location.host}`
    : 'https://audiojones.com';
  
  const feedUrl = `${baseUrl}/api/incidents`;
  const isTokenProtected = process.env.NEXT_PUBLIC_INCIDENT_FEED_TOKEN === 'true';

  const exampleUrls = [
    {
      label: 'Basic feed',
      url: feedUrl,
      description: 'All open and investigating incidents'
    },
    {
      label: 'Open only',
      url: `${feedUrl}?status=open`,
      description: 'Only open incidents'
    },
    {
      label: 'All statuses',
      url: `${feedUrl}?status=open,investigating,monitoring,resolved&limit=50`,
      description: 'All incidents, up to 50 results'
    },
    {
      label: 'Recent updates',
      url: `${feedUrl}?since=${new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()}&limit=20`,
      description: 'Incidents updated in last 24 hours'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/portal/admin/incidents"
            className="flex items-center gap-2 px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Incidents
          </Link>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Rss className="h-6 w-6 text-orange-400" />
              <h1 className="text-2xl font-bold text-white">Incident Feed</h1>
            </div>
            <p className="text-text-muted">
              Public API for external systems to read current incidents
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={fetchFeed}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Feed Configuration */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Endpoint Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-400" />
                <CardTitle className="text-white">API Endpoint</CardTitle>
              </div>
              <CardDescription>
                Public endpoint for external consumption
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              
              <div>
                <label className="text-sm font-medium text-text-primary mb-2 block">
                  Base URL
                </label>
                <div className="flex items-center gap-2 p-2 bg-gray-900 rounded border border-gray-700">
                  <code className="text-sm text-green-400 flex-1 break-all">
                    {feedUrl}
                  </code>
                  <button
                    onClick={() => copyToClipboard(feedUrl, 'base')}
                    className="p-1 hover:bg-gray-800 rounded transition-colors"
                  >
                    {copiedUrl === 'base' ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : (
                      <Copy className="h-4 w-4 text-text-muted" />
                    )}
                  </button>
                </div>
              </div>

              {/* Token Protection Status */}
              <div className="flex items-center gap-2 p-3 bg-gray-900/50 rounded border border-gray-700">
                {isTokenProtected ? (
                  <>
                    <Shield className="h-4 w-4 text-yellow-400" />
                    <div>
                      <div className="text-sm font-medium text-white">Token Protected</div>
                      <div className="text-xs text-text-muted">
                        Append ?token=YOUR_TOKEN when consuming
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <Globe className="h-4 w-4 text-green-400" />
                    <div>
                      <div className="text-sm font-medium text-white">Public Access</div>
                      <div className="text-xs text-text-muted">
                        No authentication required
                      </div>
                    </div>
                  </>
                )}
              </div>

            </CardContent>
          </Card>

          {/* Example URLs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-white">Example Requests</CardTitle>
              <CardDescription>
                Common usage patterns and query parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {exampleUrls.map((example, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">
                      {example.label}
                    </span>
                    <button
                      onClick={() => copyToClipboard(example.url, example.label)}
                      className="p-1 hover:bg-gray-800 rounded transition-colors"
                    >
                      {copiedUrl === example.label ? (
                        <CheckCircle className="h-3 w-3 text-green-400" />
                      ) : (
                        <Copy className="h-3 w-3 text-text-muted" />
                      )}
                    </button>
                  </div>
                  <div className="p-2 bg-gray-900 rounded border border-gray-700">
                    <code className="text-xs text-green-400 break-all">
                      {example.url}
                    </code>
                  </div>
                  <p className="text-xs text-text-muted">
                    {example.description}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

        </div>

        {/* Feed Preview */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Feed Preview</CardTitle>
                  <CardDescription>
                    Live preview of the incident feed API response
                  </CardDescription>
                </div>
                
                <Badge variant="outline" className="text-text-primary">
                  {incidents.length} incident{incidents.length !== 1 ? 's' : ''}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              
              {/* Error Display */}
              {error && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg">
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                </div>
              )}

              {/* Loading State */}
              {loading ? (
                <div className="flex items-center justify-center py-8 text-text-muted">
                  <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                  Loading incident feed...
                </div>
              ) : incidents.length === 0 ? (
                <div className="text-center py-8 text-text-muted">
                  <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No incidents in feed</p>
                  <p className="text-sm">This is good news! No active incidents to report.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {incidents.map((incident) => (
                    <div 
                      key={incident.id} 
                      className="p-4 bg-gray-900/50 rounded-lg border border-gray-700"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusIcon(incident.status)}
                            <h3 className="font-medium text-white">
                              {incident.title}
                            </h3>
                          </div>
                          
                          {incident.short_description && (
                            <p className="text-sm text-text-primary mb-2">
                              {incident.short_description}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-2">
                            <Badge variant={getStatusBadgeVariant(incident.status)}>
                              {incident.status}
                            </Badge>
                            {incident.severity && (
                              <Badge variant={getSeverityBadgeVariant(incident.severity)}>
                                {incident.severity}
                              </Badge>
                            )}
                          </div>
                          
                          {incident.updated_at && (
                            <span className="text-xs text-text-muted">
                              {getTimeAgo(incident.updated_at)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-text-muted">
                        <div className="flex items-center gap-4">
                          <span>ID: {incident.id}</span>
                          {incident.source && (
                            <span>Source: {incident.source}</span>
                          )}
                          {incident.started_at && (
                            <span>Started: {formatTimestamp(incident.started_at)}</span>
                          )}
                        </div>
                        
                        {incident.affected_components && incident.affected_components.length > 0 && (
                          <div className="flex items-center gap-1">
                            <span>Components:</span>
                            <span className="text-blue-400">
                              {incident.affected_components.slice(0, 3).join(', ')}
                              {incident.affected_components.length > 3 && '...'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}