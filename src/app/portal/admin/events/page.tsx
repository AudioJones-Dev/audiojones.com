/**
 * Event Bus Admin Page
 * 
 * Displays and manages events from the unified Audio Jones Event Bus.
 * Shows last 100 events with filtering, delivery tracking, and replay functionality.
 */

'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Play, Eye, AlertTriangle, CheckCircle2, XCircle, Clock, Activity } from 'lucide-react';

// Helper to get admin key
const getAdminKey = (): string => {
  return '';
};

interface EventBusEvent {
  event_id: string;
  event_type: string;
  payload: any;
  metadata?: Record<string, any>;
  source?: string;
  created_at: string;
  dispatched_to: number;
  delivery_success: number;
  delivery_failed: number;
}

interface EventBusStats {
  total_events: number;
  events_by_type: Record<string, number>;
  delivery_success_rate: number;
  recent_activity: {
    last_24h: number;
    last_7d: number;
  };
}

export default function EventBusPage() {
  const [events, setEvents] = useState<EventBusEvent[]>([]);
  const [stats, setStats] = useState<EventBusStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEventType, setSelectedEventType] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<EventBusEvent | null>(null);
  const [replayingEvent, setReplayingEvent] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // For now, use placeholder data until APIs are implemented
      setEvents([]);
      setStats({
        total_events: 0,
        events_by_type: {},
        delivery_success_rate: 0,
        recent_activity: { last_24h: 0, last_7d: 0 }
      });

    } catch (err: any) {
      console.error('Error fetching event bus data:', err);
      setError(err.message || 'Failed to load event bus data');
    } finally {
      setLoading(false);
    }
  };

  const replayEvent = async (eventId: string) => {
    try {
      setReplayingEvent(eventId);
      setError(null);

      // Placeholder for now
      console.log('Would replay event:', eventId);
      
    } catch (err: any) {
      console.error('Error replaying event:', err);
      setError(err.message || 'Failed to replay event');
    } finally {
      setReplayingEvent(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedEventType]);

  const getEventTypeColor = (eventType: string) => {
    if (eventType.includes('status')) return 'text-blue-400';
    if (eventType.includes('capacity')) return 'text-orange-400';
    if (eventType.includes('alert')) return 'text-red-400';
    if (eventType.includes('incident')) return 'text-purple-400';
    return 'text-gray-400';
  };

  const getDeliveryStatusIcon = (event: EventBusEvent) => {
    if (event.dispatched_to === 0) {
      return <Clock className="w-4 h-4 text-gray-400" />;
    }
    if (event.delivery_failed > 0) {
      return <XCircle className="w-4 h-4 text-red-400" />;
    }
    if (event.delivery_success > 0) {
      return <CheckCircle2 className="w-4 h-4 text-green-400" />;
    }
    return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
  };

  const eventTypes = stats ? Object.keys(stats.events_by_type) : [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Event Bus</h1>
        <p className="text-gray-400">Monitor and manage all Audio Jones events</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Events</p>
                <p className="text-2xl font-bold text-white">{stats.total_events}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Success Rate</p>
                <p className="text-2xl font-bold text-green-400">
                  {Math.round(stats.delivery_success_rate * 100)}%
                </p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Last 24h</p>
                <p className="text-2xl font-bold text-blue-400">{stats.recent_activity.last_24h}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Last 7 days</p>
                <p className="text-2xl font-bold text-purple-400">{stats.recent_activity.last_7d}</p>
              </div>
              <Activity className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <select
            value={selectedEventType}
            onChange={(e) => setSelectedEventType(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
          >
            <option value="all">All Event Types</option>
            {eventTypes.map(type => (
              <option key={type} value={type}>
                {type} ({stats?.events_by_type[type] || 0})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2">
            <XCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-300">{error}</span>
          </div>
        </div>
      )}

      {/* Events Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Event</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Source</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Delivery</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Created</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading events...
                  </td>
                </tr>
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    <Activity className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                    <p>No events found</p>
                    <p className="text-sm mt-1">Events will appear here as they are published to the event bus</p>
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr key={event.event_id} className="hover:bg-gray-700/50">
                    <td className="px-4 py-3">
                      <div className="font-mono text-sm text-gray-300">
                        {event.event_id.substring(0, 16)}...
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-medium ${getEventTypeColor(event.event_type)}`}>
                        {event.event_type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-300">{event.source || 'unknown'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        {getDeliveryStatusIcon(event)}
                        <span className="text-sm text-gray-300">
                          {event.delivery_success}/{event.dispatched_to}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-300">
                        {new Date(event.created_at).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedEvent(event)}
                          className="p-1 text-gray-400 hover:text-white transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => replayEvent(event.event_id)}
                          disabled={replayingEvent === event.event_id}
                          className="p-1 text-gray-400 hover:text-blue-400 disabled:text-gray-600 transition-colors"
                          title="Replay event"
                        >
                          {replayingEvent === event.event_id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Event Details</h3>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Event ID</label>
                  <div className="bg-gray-700 rounded px-3 py-2 font-mono text-sm text-white">
                    {selectedEvent.event_id}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
                  <div className="bg-gray-700 rounded px-3 py-2 text-sm text-white">
                    {selectedEvent.event_type}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Payload</label>
                  <pre className="bg-gray-700 rounded px-3 py-2 text-sm text-white overflow-x-auto">
                    {JSON.stringify(selectedEvent.payload, null, 2)}
                  </pre>
                </div>

                {selectedEvent.metadata && (
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Metadata</label>
                    <pre className="bg-gray-700 rounded px-3 py-2 text-sm text-white overflow-x-auto">
                      {JSON.stringify(selectedEvent.metadata, null, 2)}
                    </pre>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Dispatched</label>
                    <div className="bg-gray-700 rounded px-3 py-2 text-sm text-white">
                      {selectedEvent.dispatched_to}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Success</label>
                    <div className="bg-gray-700 rounded px-3 py-2 text-sm text-green-400">
                      {selectedEvent.delivery_success}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Failed</label>
                    <div className="bg-gray-700 rounded px-3 py-2 text-sm text-red-400">
                      {selectedEvent.delivery_failed}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
