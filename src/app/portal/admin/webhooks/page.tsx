'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/Toast';
import { RefreshCw, Play, AlertTriangle, CheckCircle, Clock, Mail } from 'lucide-react';

interface WebhookEvent {
  id: string;
  event_type: string;
  customer_email: string;
  tier?: string;
  timestamp: string;
  processed_at?: string;
  processing_time_ms?: number;
  has_been_replayed: boolean;
  replay_count: number;
  last_replay_at?: string;
  last_replay_result?: {
    success: boolean;
    error?: string;
    action?: string;
  };
}

export default function WebhooksPage() {
  const [events, setEvents] = useState<WebhookEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [replayingIds, setReplayingIds] = useState<Set<string>>(new Set());
  const [stats, setStats] = useState({
    total: 0,
    successful: 0,
    replayed: 0
  });
  
  const { show: showToast } = useToast();

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/_proxy/admin/webhooks', {
      });

      if (response.ok) {
        const data = await response.json();
        setEvents(data.events);
        
        // Calculate stats
        const total = data.events.length;
        const successful = data.events.filter((e: WebhookEvent) => e.processed_at).length;
        const replayed = data.events.filter((e: WebhookEvent) => e.has_been_replayed).length;
        
        setStats({ total, successful, replayed });
      } else {
        showToast({ description: 'Failed to load webhook events', variant: 'error' });
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      showToast({ description: 'Error loading webhook events', variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const replayEvent = async (eventId: string) => {
    setReplayingIds(prev => new Set([...prev, eventId]));
    
    try {
      const response = await fetch('/api/_proxy/admin/webhooks/replay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ event_id: eventId })
      });

      const result = await response.json();

      if (response.ok && result.ok) {
        showToast({ 
          description: `Webhook replayed successfully (${result.replay_status})`,
          variant: result.replay_status === 'success' ? 'success' : 'info'
        });
        
        // Refresh the events list
        await fetchEvents();
      } else {
        showToast({ description: `Replay failed: ${result.error || 'Unknown error'}`, variant: 'error' });
      }
    } catch (error) {
      console.error('Error replaying webhook:', error);
      showToast({ description: 'Error replaying webhook', variant: 'error' });
    } finally {
      setReplayingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(eventId);
        return newSet;
      });
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getEventBadgeVariant = (event: WebhookEvent) => {
    if (event.last_replay_result?.success === false) return 'outline';
    if (event.has_been_replayed) return 'secondary';
    if (event.processed_at) return 'default';
    return 'outline';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>Loading webhook events...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Webhook Replayer</h1>
          <p className="text-text-muted mt-1">Debug and replay webhook events</p>
        </div>
        <button 
          onClick={fetchEvents}
          className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors text-sm"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-blue-400" />
            <div>
              <p className="text-sm text-text-muted">Total Events</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <div>
              <p className="text-sm text-text-muted">Processed</p>
              <p className="text-2xl font-bold">{stats.successful}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center gap-2">
            <Play className="h-5 w-5 text-purple-400" />
            <div>
              <p className="text-sm text-text-muted">Replayed</p>
              <p className="text-2xl font-bold">{stats.replayed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-gray-900 rounded-lg border border-gray-700">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Recent Webhook Events</h2>
          <p className="text-sm text-text-muted">Last 50 events with replay capabilities</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left p-4 font-medium text-text-primary">Event</th>
                <th className="text-left p-4 font-medium text-text-primary">Customer</th>
                <th className="text-left p-4 font-medium text-text-primary">Timestamp</th>
                <th className="text-left p-4 font-medium text-text-primary">Status</th>
                <th className="text-left p-4 font-medium text-text-primary">Replays</th>
                <th className="text-left p-4 font-medium text-text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Badge variant={getEventBadgeVariant(event)}>
                        {event.event_type}
                      </Badge>
                      {event.tier && (
                        <span className="text-sm text-text-muted">• {event.tier}</span>
                      )}
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-text-muted" />
                      <span className="text-sm">{event.customer_email}</span>
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <div className="text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-text-muted" />
                        {formatTimestamp(event.timestamp)}
                      </div>
                      {event.processing_time_ms && (
                        <div className="text-xs text-text-muted mt-1">
                          {event.processing_time_ms}ms
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      {event.processed_at ? (
                        <Badge variant="default" className="w-fit">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Processed
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="w-fit">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                      
                      {event.last_replay_result && (
                        <Badge 
                          variant={event.last_replay_result.success ? "default" : "outline"}
                          className="w-fit text-xs"
                        >
                          Last replay: {event.last_replay_result.success ? 'OK' : 'Failed'}
                        </Badge>
                      )}
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <div className="text-sm">
                      <div className="font-medium">{event.replay_count}</div>
                      {event.last_replay_at && (
                        <div className="text-xs text-text-muted">
                          Last: {formatTimestamp(event.last_replay_at)}
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <button
                      onClick={() => replayEvent(event.id)}
                      disabled={replayingIds.has(event.id)}
                      className={`flex items-center gap-1 px-2 py-1 text-xs border rounded hover:bg-gray-700 transition-colors ${
                        replayingIds.has(event.id) 
                          ? 'opacity-50 cursor-not-allowed border-gray-600' 
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      {replayingIds.has(event.id) ? (
                        <>
                          <RefreshCw className="h-3 w-3 animate-spin" />
                          Replaying...
                        </>
                      ) : (
                        <>
                          <Play className="h-3 w-3" />
                          Replay
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {events.length === 0 && (
            <div className="p-8 text-center text-text-muted">
              <RefreshCw className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No webhook events found</p>
              <p className="text-sm">Events will appear here once webhooks are received</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}