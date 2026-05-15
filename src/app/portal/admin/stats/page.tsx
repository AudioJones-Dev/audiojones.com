'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { RefreshCw, Users, UserCheck, Activity, TrendingUp, Heart, AlertCircle } from 'lucide-react';

interface StatsData {
  totalCustomers: number;
  activeSubscriptions: number;
  totalEvents: number;
  recentEvents: number;
  eventTypes: { [key: string]: number };
  customerStatuses: { [key: string]: number };
}

interface StatsResponse {
  ok: boolean;
  stats: StatsData;
  timestamp: string;
  error?: string;
}

interface HealthData {
  status: string;
  firestore: boolean;
  version: string;
  timestamp: string;
  uptime: string;
}

interface AnalyticsData {
  timestamp: string;
  customers: {
    total: number;
    active_subscriptions: number;
    inactive_subscriptions: number;
    churn_rate: number;
  };
  activity: {
    events_last_7_days: number;
    events_last_30_days: number;
    webhooks_last_24_hours: number;
  };
  subscription_tiers: Record<string, number>;
  service_distribution: Record<string, number>;
  health_indicators: {
    recent_signups: number;
    recent_churn: number;
    average_events_per_customer: number;
  };
}

export default function AdminStatsPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [health, setHealth] = useState<HealthData | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/_proxy/admin/analytics/summary', {
      });

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.analytics);
      }
    } catch (err) {
      console.error('Analytics fetch failed:', err);
      setAnalytics(null);
    }
  };

  const fetchHealth = async () => {
    try {
      const response = await fetch('/api/_proxy/admin/health', {
      });

      const data: HealthData = await response.json();
      setHealth(data);
    } catch (err) {
      console.error('Health check failed:', err);
      setHealth(null);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/_proxy/admin/stats', {
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: StatsResponse = await response.json();
      
      if (data.ok) {
        setStats(data.stats);
        setLastUpdated(new Date(data.timestamp).toLocaleTimeString());
        setError(null);
      } else {
        throw new Error(data.error || 'Failed to fetch stats');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const fetchAll = async () => {
    await Promise.all([fetchStats(), fetchHealth(), fetchAnalytics()]);
  };

  useEffect(() => {
    fetchAll();
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchAll, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ 
    title, 
    value, 
    description, 
    icon: Icon, 
    variant = "default" 
  }: { 
    title: string; 
    value: number | string; 
    description: string; 
    icon: any; 
    variant?: "default" | "success" | "warning";
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Statistics</h1>
          <div className="h-10 w-24 bg-gray-200 animate-pulse rounded" />
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-gray-200 animate-pulse rounded mb-2" />
                <div className="h-3 w-32 bg-gray-200 animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Statistics</h1>
          <button
            onClick={fetchStats}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p className="font-medium">Failed to load statistics</p>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Statistics</h1>
          <p className="text-muted-foreground">
            Last updated: {lastUpdated} • Auto-refreshes every 60s
          </p>
        </div>
        <button
          onClick={fetchAll}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Main Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Customers"
          value={stats?.totalCustomers || 0}
          description="All registered customers"
          icon={Users}
        />
        <StatCard
          title="Active Subscriptions"
          value={stats?.activeSubscriptions || 0}
          description="Currently active customers"
          icon={UserCheck}
          variant="success"
        />
        <StatCard
          title="Total Events"
          value={stats?.totalEvents || 0}
          description="All webhook events"
          icon={Activity}
        />
        <StatCard
          title="Recent Events"
          value={stats?.recentEvents || 0}
          description="Last 24 hours"
          icon={TrendingUp}
          variant="warning"
        />
      </div>

      {/* System Health Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">System Health</CardTitle>
          {health?.firestore ? (
            <Heart className="h-4 w-4 text-green-500" />  
          ) : (
            <AlertCircle className="h-4 w-4 text-red-500" />
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Status:</span>
              <Badge variant={health?.status === 'ok' ? 'default' : 'secondary'}>
                {health?.status || 'Unknown'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Firestore:</span>
              <Badge variant={health?.firestore ? 'default' : 'secondary'}>
                {health?.firestore ? 'Connected' : 'Disconnected'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Version:</span>
              <span className="text-sm text-muted-foreground">{health?.version || 'Unknown'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Uptime:</span>
              <span className="text-sm text-muted-foreground">{health?.uptime || 'Unknown'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Insights Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Business Insights
          </CardTitle>
          <CardDescription>Advanced analytics and growth metrics</CardDescription>
        </CardHeader>
        <CardContent>
          {analytics ? (
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
              <div className="space-y-1">
                <p className="text-2xl font-bold text-green-600">
                  {analytics.customers.total > 0 ? ((analytics.customers.active_subscriptions / analytics.customers.total) * 100).toFixed(1) : '0.0'}%
                </p>
                <p className="text-xs text-muted-foreground">Activation Rate</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-red-600">
                  {analytics.customers.churn_rate}%
                </p>
                <p className="text-xs text-muted-foreground">Churn Rate</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-blue-600">
                  {analytics.health_indicators.recent_signups}
                </p>
                <p className="text-xs text-muted-foreground">New (7 days)</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-yellow-600">
                  {analytics.health_indicators.average_events_per_customer.toFixed(1)}
                </p>
                <p className="text-xs text-muted-foreground">Events/Customer</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold">
                  {analytics.activity.events_last_7_days}
                </p>
                <p className="text-xs text-muted-foreground">Events (7d)</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold">
                  {analytics.activity.webhooks_last_24_hours}
                </p>
                <p className="text-xs text-muted-foreground">Webhooks (24h)</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-orange-600">
                  {analytics.health_indicators.recent_churn}
                </p>
                <p className="text-xs text-muted-foreground">Churned (7d)</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold">
                  {Object.keys(analytics.subscription_tiers).length}
                </p>
                <p className="text-xs text-muted-foreground">Active Tiers</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">Loading analytics...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Breakdowns */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Event Types */}
        <Card>
          <CardHeader>
            <CardTitle>Event Types</CardTitle>
            <CardDescription>Breakdown of webhook events by type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(stats?.eventTypes || {}).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{type}</Badge>
                  </div>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
              {Object.keys(stats?.eventTypes || {}).length === 0 && (
                <p className="text-sm text-muted-foreground">No events recorded</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Customer Statuses */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Statuses</CardTitle>
            <CardDescription>Breakdown of customers by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(stats?.customerStatuses || {}).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={status === 'active' ? 'default' : 'secondary'}
                    >
                      {status}
                    </Badge>
                  </div>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
              {Object.keys(stats?.customerStatuses || {}).length === 0 && (
                <p className="text-sm text-muted-foreground">No customers recorded</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}