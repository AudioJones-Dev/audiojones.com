// src/app/portal/admin/dashboard/page.tsx
// Enhanced admin dashboard with Firestore integration

import { getDashboardStats } from '@/lib/firestore/collections';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { 
  Users, 
  DollarSign, 
  Activity, 
  TrendingUp,
  Calendar,
  AlertCircle
} from 'lucide-react';

export default async function AdminDashboard() {
  // Fetch real data server-side
  const stats = await getDashboardStats();

  const StatCard = ({ 
    title, 
    value, 
    description, 
    icon: Icon, 
    trend,
    trendLabel 
  }: {
    title: string;
    value: string | number;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    trend?: number;
    trendLabel?: string;
  }) => (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-text-primary">{title}</CardTitle>
        <Icon className="h-4 w-4 text-text-muted" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
        <p className="text-xs text-text-muted mt-1">{description}</p>
        {trend !== undefined && (
          <div className="flex items-center mt-2">
            <TrendingUp className={`h-3 w-3 mr-1 ${trend > 0 ? 'text-green-400' : 'text-red-400'}`} />
            <span className={`text-xs ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {trend > 0 ? '+' : ''}{trend}% {trendLabel}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-text-muted mt-1">
            Overview of your AudioJones.com admin portal
          </p>
        </div>
        <div className="text-sm text-text-muted">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          description="Registered users"
          icon={Users}
          trend={stats.customerGrowth}
          trendLabel="from last month"
        />
        <StatCard
          title="Active Subscriptions"
          value={stats.activeSubscriptions}
          description="Currently active"
          icon={Activity}
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          description="All-time earnings"
          icon={DollarSign}
        />
        <StatCard
          title="Recent Events"
          value={stats.recentEvents.length}
          description="Last 24 hours"
          icon={Calendar}
        />
      </div>

      {/* Event Type Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg text-white">Event Breakdown</CardTitle>
            <CardDescription className="text-text-muted">
              Subscription event types
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-text-primary">Payments</span>
              <Badge variant="secondary" className="bg-green-900 text-green-100">
                {stats.eventCounts.payments}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-primary">Subscriptions</span>
              <Badge variant="secondary" className="bg-blue-900 text-blue-100">
                {stats.eventCounts.subscriptions}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-primary">Cancellations</span>
              <Badge variant="secondary" className="bg-red-900 text-red-100">
                {stats.eventCounts.cancellations}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-gray-900 border-gray-700 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg text-white">Recent Activity</CardTitle>
            <CardDescription className="text-text-muted">
              Latest subscription events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentEvents.slice(0, 5).map((event, index) => (
                <div key={event.id || index} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          event.event_type && typeof event.event_type === 'string' && event.event_type.includes('payment') ? 'border-green-500 text-green-400' :
                          event.event_type && typeof event.event_type === 'string' && event.event_type.includes('subscription') ? 'border-blue-500 text-blue-400' :
                          'border-gray-500 text-text-muted'
                        }`}
                      >
                        {event.event_type || 'unknown'}
                      </Badge>
                      <span className="text-sm text-text-primary">{event.customer_email}</span>
                    </div>
                    <div className="text-xs text-text-muted mt-1">
                      {event.timestamp && typeof event.timestamp === 'string' ? new Date(event.timestamp).toLocaleString() : 'No timestamp'}
                    </div>
                  </div>
                  {event.amount && (
                    <div className="text-sm text-white font-medium">
                      ${(event.amount / 100).toFixed(2)}
                    </div>
                  )}
                </div>
              ))}
              {stats.recentEvents.length === 0 && (
                <div className="text-center py-4 text-text-muted">
                  <AlertCircle className="h-6 w-6 mx-auto mb-2" />
                  No recent events
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg text-white">Quick Actions</CardTitle>
          <CardDescription className="text-text-muted">
            Common administrative tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-left">
              <Users className="h-5 w-5 text-blue-400 mb-2" />
              <div className="text-sm font-medium text-white">Manage Customers</div>
            </button>
            <button className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-left">
              <Activity className="h-5 w-5 text-green-400 mb-2" />
              <div className="text-sm font-medium text-white">View Events</div>
            </button>
            <button className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-left">
              <DollarSign className="h-5 w-5 text-yellow-400 mb-2" />
              <div className="text-sm font-medium text-white">Revenue Report</div>
            </button>
            <button className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-left">
              <TrendingUp className="h-5 w-5 text-purple-400 mb-2" />
              <div className="text-sm font-medium text-white">Analytics</div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}