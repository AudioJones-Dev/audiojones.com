'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Eye, 
  RefreshCw, 
  FileText,
  AlertCircle,
  Info,
  Activity
} from 'lucide-react';

interface Incident {
  id: string;
  title: string;
  status: 'open' | 'investigating' | 'monitoring' | 'resolved';
  severity: 'info' | 'warning' | 'critical';
  source: string;
  related_alert_ids: string[];
  timeline: Array<{
    ts: string;
    type: 'alert' | 'action' | 'note' | 'auto';
    message: string;
    meta?: any;
  }>;
  created_at: string;
  updated_at: string;
  runbook_id?: string;
}

interface IncidentStats {
  total: number;
  open: number;
  investigating: number;
  monitoring: number;
  resolved: number;
  critical: number;
  warning: number;
  info: number;
}

export default function AdminIncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [stats, setStats] = useState<IncidentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'investigating' | 'monitoring' | 'resolved'>('all');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'capacity' | 'webhook' | 'billing' | 'system' | 'predictive'>('all');

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (sourceFilter !== 'all') params.set('source', sourceFilter);
      params.set('limit', '50');

      const response = await fetch(`/api/admin/incidents?${params.toString()}`, {
        headers: {
          'admin-key': '',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setIncidents(data.incidents || []);
      
      // Calculate stats
      const totalIncidents = data.incidents || [];
      const newStats: IncidentStats = {
        total: totalIncidents.length,
        open: totalIncidents.filter((i: Incident) => i.status === 'open').length,
        investigating: totalIncidents.filter((i: Incident) => i.status === 'investigating').length,
        monitoring: totalIncidents.filter((i: Incident) => i.status === 'monitoring').length,
        resolved: totalIncidents.filter((i: Incident) => i.status === 'resolved').length,
        critical: totalIncidents.filter((i: Incident) => i.severity === 'critical').length,
        warning: totalIncidents.filter((i: Incident) => i.severity === 'warning').length,
        info: totalIncidents.filter((i: Incident) => i.severity === 'info').length,
      };
      setStats(newStats);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch incidents');
      console.error('Failed to fetch incidents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [statusFilter, sourceFilter]);

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "outline" => {
    switch (status) {
      case 'open': return 'default';
      case 'investigating': return 'outline';
      case 'monitoring': return 'secondary';
      case 'resolved': return 'outline';
      default: return 'default';
    }
  };

  const getSeverityBadgeVariant = (severity: string): "default" | "secondary" | "outline" => {
    switch (severity) {
      case 'critical': return 'default';
      case 'warning': return 'secondary';
      case 'info': return 'outline';
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

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info': return <Info className="h-4 w-4 text-blue-500" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getTimeAgo = (timestamp: string) => {
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

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Loading incidents...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Incident Management</h1>
          <p className="text-gray-400">
            Monitor and manage incident timelines with automated alert grouping
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={fetchIncidents}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <Card className="border-red-800 bg-red-900/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="h-4 w-4" />
              <span>Error: {error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-400">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-1 bg-gray-800 text-white rounded border border-gray-700"
          >
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="investigating">Investigating</option>
            <option value="monitoring">Monitoring</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-400">Source:</label>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value as any)}
            className="px-3 py-1 bg-gray-800 text-white rounded border border-gray-700"
          >
            <option value="all">All</option>
            <option value="capacity">Capacity</option>
            <option value="webhook">Webhook</option>
            <option value="billing">Billing</option>
            <option value="system">System</option>
            <option value="predictive">Predictive</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Open</p>
                  <p className="text-2xl font-bold text-red-400">{stats.open}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Investigating</p>
                  <p className="text-2xl font-bold text-yellow-400">{stats.investigating}</p>
                </div>
                <Activity className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Resolved</p>
                  <p className="text-2xl font-bold text-green-400">{stats.resolved}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Incidents List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-white">
            Active Incidents ({incidents.length})
          </CardTitle>
          <CardDescription>
            Click on an incident to view detailed timeline and manage status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {incidents.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No incidents found</p>
              <p className="text-sm">Incidents are automatically created when alerts are processed</p>
            </div>
          ) : (
            <div className="space-y-4">
              {incidents.map((incident) => (
                <div
                  key={incident.id}
                  className="border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Link
                          href={`/portal/admin/incidents/${incident.id}`}
                          className="font-semibold text-white hover:text-blue-400 transition-colors"
                        >
                          {incident.title}
                        </Link>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(incident.status)}
                          <Badge variant={getStatusBadgeVariant(incident.status)}>
                            {incident.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          {getSeverityIcon(incident.severity)}
                          <Badge variant={getSeverityBadgeVariant(incident.severity)}>
                            {incident.severity}
                          </Badge>
                        </div>
                        <Badge variant="outline">
                          {incident.source}
                        </Badge>
                        {incident.runbook_id && (
                          <Badge variant="secondary">
                            📚 Runbook
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Created {getTimeAgo(incident.created_at)}
                        </span>
                        <span>
                          Updated {getTimeAgo(incident.updated_at)}
                        </span>
                        <span>
                          {incident.related_alert_ids.length} alerts
                        </span>
                        <span>
                          {incident.timeline.length} events
                        </span>
                      </div>
                    </div>
                    
                    <Link
                      href={`/portal/admin/incidents/${incident.id}`}
                      className="flex items-center gap-2 px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Link>
                  </div>

                  {/* Latest timeline event */}
                  {incident.timeline.length > 0 && (
                    <div className="mt-3 p-3 bg-gray-900/50 rounded border-l-2 border-gray-600">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-500">Latest event:</span>
                        <Badge variant="outline" className="text-xs">
                          {incident.timeline[incident.timeline.length - 1].type}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {getTimeAgo(incident.timeline[incident.timeline.length - 1].ts)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300">
                        {incident.timeline[incident.timeline.length - 1].message}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}