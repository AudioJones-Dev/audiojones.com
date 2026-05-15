'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  ArrowLeft,
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Eye, 
  RefreshCw, 
  FileText,
  AlertCircle,
  Info,
  Activity,
  MessageSquare,
  Plus,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import IncidentSubscriptionManager from './components/IncidentSubscriptionManager';

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

interface Alert {
  id: string;
  type: string;
  severity: string;
  message: string;
  created_at: string;
  source?: string;
}

interface Runbook {
  id: string;
  name: string;
  source: string;
  steps: string[];
  active: boolean;
}

export default function IncidentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const incidentId = params.id as string;

  const [incident, setIncident] = useState<Incident | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [runbook, setRunbook] = useState<Runbook | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [showNoteForm, setShowNoteForm] = useState(false);

  const fetchIncident = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/_proxy/admin/incidents/${incidentId}`, {
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setIncident(data.incident);
      setAlerts(data.alerts || []);

      // Fetch runbook if incident has one
      if (data.incident.runbook_id) {
        await fetchRunbook(data.incident.runbook_id);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch incident');
      console.error('Failed to fetch incident:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRunbook = async (runbookId: string) => {
    try {
      const response = await fetch(`/api/_proxy/admin/runbooks?id=${runbookId}`, {
      });

      if (response.ok) {
        const data = await response.json();
        if (data.runbooks && data.runbooks.length > 0) {
          setRunbook(data.runbooks[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch runbook:', err);
    }
  };

  const updateStatus = async (newStatus: Incident['status']) => {
    try {
      setUpdating(true);

      const response = await fetch(`/api/_proxy/admin/incidents/${incidentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.statusText}`);
      }

      // Refresh incident data
      await fetchIncident();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
      console.error('Failed to update status:', err);
    } finally {
      setUpdating(false);
    }
  };

  const addNote = async () => {
    if (!newNote.trim()) return;

    try {
      setUpdating(true);

      const response = await fetch(`/api/_proxy/admin/incidents/${incidentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: newNote,
          type: 'note'
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add note: ${response.statusText}`);
      }

      setNewNote('');
      setShowNoteForm(false);
      
      // Refresh incident data
      await fetchIncident();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add note');
      console.error('Failed to add note:', err);
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    if (incidentId) {
      fetchIncident();
    }
  }, [incidentId]);

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

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'action': return <Activity className="h-4 w-4 text-blue-400" />;
      case 'note': return <MessageSquare className="h-4 w-4 text-green-400" />;
      case 'auto': return <RefreshCw className="h-4 w-4 text-gray-400" />;
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
          <span>Loading incident...</span>
        </div>
      </div>
    );
  }

  if (error || !incident) {
    return (
      <div className="p-6">
        <Card className="border-red-800 bg-red-900/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="h-4 w-4" />
              <span>Error: {error || 'Incident not found'}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            Back
          </Link>
          
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">{incident.title}</h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {getStatusIcon(incident.status)}
                <Badge variant={getStatusBadgeVariant(incident.status)}>
                  {incident.status}
                </Badge>
              </div>
              <Badge variant={getSeverityBadgeVariant(incident.severity)}>
                {incident.severity}
              </Badge>
              <Badge variant="outline">
                {incident.source}
              </Badge>
              {incident.runbook_id && (
                <Badge variant="secondary">
                  📚 Runbook Attached
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={fetchIncident}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-white">Status Management</CardTitle>
              <CardDescription>
                Update incident status and track progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                {['open', 'investigating', 'monitoring', 'resolved'].map((status) => (
                  <button
                    key={status}
                    onClick={() => updateStatus(status as Incident['status'])}
                    disabled={updating || incident.status === status}
                    className={`px-4 py-2 rounded-lg transition-colors capitalize ${
                      incident.status === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-white hover:bg-gray-700'
                    } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {updating ? <RefreshCw className="h-4 w-4 animate-spin" /> : null}
                    {status}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Incident Timeline</CardTitle>
                  <CardDescription>
                    Chronological history of all incident events
                  </CardDescription>
                </div>
                <button
                  onClick={() => setShowNoteForm(!showNoteForm)}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Note
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Add Note Form */}
              {showNoteForm && (
                <div className="mb-6 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                  <textarea
                    placeholder="Add a note to the incident timeline..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="w-full p-3 bg-gray-800 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none resize-none"
                    rows={3}
                  />
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={addNote}
                      disabled={!newNote.trim() || updating}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add Note
                    </button>
                    <button
                      onClick={() => {
                        setShowNoteForm(false);
                        setNewNote('');
                      }}
                      className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Timeline Events */}
              <div className="space-y-4">
                {incident.timeline
                  .slice()
                  .reverse()
                  .map((event, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 mt-1">
                        {getTimelineIcon(event.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {event.type}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(event.ts)}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({getTimeAgo(event.ts)})
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-300 mb-2">
                          {event.message}
                        </p>
                        
                        {/* Metadata */}
                        {event.meta && Object.keys(event.meta).length > 0 && (
                          <details className="text-xs text-gray-500">
                            <summary className="cursor-pointer hover:text-gray-400">
                              View metadata
                            </summary>
                            <pre className="mt-2 p-2 bg-gray-900 rounded text-xs overflow-x-auto">
                              {JSON.stringify(event.meta, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  ))}
              </div>

              {incident.timeline.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No timeline events yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Incident Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-white">Incident Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wide">
                  Created
                </label>
                <p className="text-sm text-white">
                  {formatTimestamp(incident.created_at)}
                </p>
              </div>
              
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wide">
                  Last Updated
                </label>
                <p className="text-sm text-white">
                  {formatTimestamp(incident.updated_at)}
                </p>
              </div>
              
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wide">
                  Related Alerts
                </label>
                <p className="text-sm text-white">
                  {incident.related_alert_ids.length} alerts
                </p>
              </div>
              
              <div>
                <label className="text-xs text-gray-400 uppercase tracking-wide">
                  Timeline Events
                </label>
                <p className="text-sm text-white">
                  {incident.timeline.length} events
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Related Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-white">Related Alerts</CardTitle>
              <CardDescription>
                Alerts that triggered this incident
              </CardDescription>
            </CardHeader>
            <CardContent>
              {alerts.length === 0 ? (
                <p className="text-gray-400 text-sm">No related alerts found</p>
              ) : (
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="p-3 bg-gray-900/50 rounded border border-gray-700">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {alert.type}
                        </Badge>
                        <Badge variant={getSeverityBadgeVariant(alert.severity)} className="text-xs">
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-300 mb-2">
                        {alert.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {getTimeAgo(alert.created_at)}
                        </span>
                        <Link
                          href={`/portal/admin/alerts`}
                          className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                        >
                          View <ExternalLink className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Subscription Manager */}
          <IncidentSubscriptionManager incidentId={incidentId} />

          {/* Runbook */}
          {runbook && (
            <Card>
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Runbook: {runbook.name}
                </CardTitle>
                <CardDescription>
                  Response procedures for {runbook.source} incidents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {runbook.steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                        {index + 1}
                      </span>
                      <p className="text-sm text-gray-300">{step}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}