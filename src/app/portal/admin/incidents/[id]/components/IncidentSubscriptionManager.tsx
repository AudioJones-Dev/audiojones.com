'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  Users, 
  Bell, 
  BellOff, 
  UserPlus, 
  UserMinus, 
  Mail, 
  MessageSquare, 
  RefreshCw,
  AlertTriangle,
  Settings,
  CheckCircle
} from 'lucide-react';

interface IncidentSubscription {
  id: string;
  incident_id: string;
  subscriber: string;
  channel: 'slack' | 'email';
  active: boolean;
  preferences: {
    status_changes?: boolean;
    timeline_updates?: boolean;
    resolution_only?: boolean;
  };
  created_at: string;
  created_by?: string;
}

interface IncidentSubscriptionManagerProps {
  incidentId: string;
  className?: string;
}

export default function IncidentSubscriptionManager({ 
  incidentId, 
  className = "" 
}: IncidentSubscriptionManagerProps) {
  const [subscribers, setSubscribers] = useState<IncidentSubscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSubscriber, setNewSubscriber] = useState({
    subscriber: '',
    channel: 'slack' as 'slack' | 'email',
    preferences: {
      status_changes: true,
      timeline_updates: true,
      resolution_only: false
    }
  });
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/incidents/${incidentId}/subscribers`, {
        headers: {
          'admin-key': process.env.NEXT_PUBLIC_ADMIN_KEY || '',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch subscribers: ${response.statusText}`);
      }

      const data = await response.json();
      setSubscribers(data.subscribers || []);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch subscribers');
      console.error('Failed to fetch subscribers:', err);
    } finally {
      setLoading(false);
    }
  };

  const subscribe = async () => {
    if (!newSubscriber.subscriber.trim()) return;

    try {
      setActionLoading('subscribe');

      const response = await fetch(`/api/admin/incidents/${incidentId}/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'admin-key': process.env.NEXT_PUBLIC_ADMIN_KEY || '',
        },
        body: JSON.stringify(newSubscriber),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to subscribe: ${response.statusText}`);
      }

      // Reset form and refresh list
      setNewSubscriber({
        subscriber: '',
        channel: 'slack',
        preferences: {
          status_changes: true,
          timeline_updates: true,
          resolution_only: false
        }
      });
      setShowAddForm(false);
      await fetchSubscribers();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to subscribe');
      console.error('Failed to subscribe:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const unsubscribe = async (subscriber: string) => {
    try {
      setActionLoading(`unsubscribe-${subscriber}`);

      const response = await fetch(`/api/admin/incidents/${incidentId}/subscribe?subscriber=${encodeURIComponent(subscriber)}`, {
        method: 'DELETE',
        headers: {
          'admin-key': process.env.NEXT_PUBLIC_ADMIN_KEY || '',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to unsubscribe: ${response.statusText}`);
      }

      await fetchSubscribers();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unsubscribe');
      console.error('Failed to unsubscribe:', err);
    } finally {
      setActionLoading(null);
    }
  };

  useEffect(() => {
    if (incidentId) {
      fetchSubscribers();
    }
  }, [incidentId]);

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'slack': return <MessageSquare className="h-4 w-4 text-purple-400" />;
      case 'email': return <Mail className="h-4 w-4 text-blue-400" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const formatSubscriber = (subscriber: string) => {
    // If it looks like an email, truncate for display
    if (subscriber.includes('@')) {
      const [username, domain] = subscriber.split('@');
      if (username.length > 15) {
        return `${username.substring(0, 12)}...@${domain}`;
      }
    }
    return subscriber;
  };

  const formatPreferences = (prefs: IncidentSubscription['preferences']) => {
    const enabled = [];
    if (prefs.status_changes) enabled.push('Status');
    if (prefs.timeline_updates) enabled.push('Timeline');
    if (prefs.resolution_only) enabled.push('Resolution Only');
    
    return enabled.length > 0 ? enabled.join(', ') : 'All updates';
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-400" />
            <div>
              <CardTitle className="text-white">Incident Subscribers</CardTitle>
              <CardDescription>
                Manage who gets notified about incident updates
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-text-primary">
              {subscribers.length} subscriber{subscribers.length !== 1 ? 's' : ''}
            </Badge>
            
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              <UserPlus className="h-4 w-4" />
              Subscribe
            </button>
            
            <button
              onClick={fetchSubscribers}
              disabled={loading}
              className="p-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
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

        {/* Add Subscriber Form */}
        {showAddForm && (
          <div className="mb-6 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
            <h4 className="font-medium text-white mb-3">Add New Subscriber</h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Email or Slack User
                </label>
                <input
                  type="text"
                  placeholder="user@company.com or slack_user_id"
                  value={newSubscriber.subscriber}
                  onChange={(e) => setNewSubscriber(prev => ({ ...prev, subscriber: e.target.value }))}
                  className="w-full p-3 bg-gray-800 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Notification Channel
                </label>
                <select
                  value={newSubscriber.channel}
                  onChange={(e) => setNewSubscriber(prev => ({ ...prev, channel: e.target.value as 'slack' | 'email' }))}
                  className="w-full p-3 bg-gray-800 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  <option value="slack">Slack</option>
                  <option value="email" disabled>Email (Coming Soon)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Notification Preferences
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newSubscriber.preferences.status_changes}
                      onChange={(e) => setNewSubscriber(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, status_changes: e.target.checked }
                      }))}
                      className="rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-text-primary">Status changes</span>
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newSubscriber.preferences.timeline_updates}
                      onChange={(e) => setNewSubscriber(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, timeline_updates: e.target.checked }
                      }))}
                      className="rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-text-primary">Timeline updates</span>
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newSubscriber.preferences.resolution_only}
                      onChange={(e) => setNewSubscriber(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, resolution_only: e.target.checked }
                      }))}
                      className="rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-text-primary">Resolution only</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={subscribe}
                disabled={!newSubscriber.subscriber.trim() || actionLoading === 'subscribe'}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {actionLoading === 'subscribe' ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <UserPlus className="h-4 w-4" />
                )}
                Subscribe
              </button>
              
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setError(null);
                }}
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Subscribers List */}
        {loading && subscribers.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-text-muted">
            <RefreshCw className="h-5 w-5 animate-spin mr-2" />
            Loading subscribers...
          </div>
        ) : subscribers.length === 0 ? (
          <div className="text-center py-8 text-text-muted">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No subscribers yet</p>
            <p className="text-sm">Add subscribers to notify them about incident updates</p>
          </div>
        ) : (
          <div className="space-y-3">
            {subscribers.map((subscription) => (
              <div 
                key={subscription.id} 
                className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700"
              >
                <div className="flex items-center gap-3">
                  {getChannelIcon(subscription.channel)}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">
                        {formatSubscriber(subscription.subscriber)}
                      </span>
                      {subscription.active ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : (
                        <BellOff className="h-4 w-4 text-text-muted" />
                      )}
                    </div>
                    <div className="text-sm text-text-muted flex items-center gap-2">
                      <span>{formatPreferences(subscription.preferences)}</span>
                      <span>•</span>
                      <span>{new Date(subscription.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className={subscription.channel === 'slack' ? 'text-purple-400 border-purple-400' : 'text-blue-400 border-blue-400'}
                  >
                    {subscription.channel}
                  </Badge>
                  
                  <button
                    onClick={() => unsubscribe(subscription.subscriber)}
                    disabled={actionLoading === `unsubscribe-${subscription.subscriber}`}
                    className="p-2 text-red-400 hover:bg-red-900/50 rounded transition-colors disabled:opacity-50"
                    title="Unsubscribe"
                  >
                    {actionLoading === `unsubscribe-${subscription.subscriber}` ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <UserMinus className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}