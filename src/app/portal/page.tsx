'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';

interface DashboardData {
  nextActions: Array<{
    id: string;
    title: string;
    type: 'approval' | 'payment' | 'meeting' | 'milestone';
    dueDate?: string;
    urgent: boolean;
  }>;
  billingStatus: {
    status: 'active' | 'overdue' | 'trial';
    nextBilling?: string;
    amount?: number;
    daysOverdue?: number;
  };
  upcomingMeetings: Array<{
    id: string;
    title: string;
    date: string;
    type: string;
    meetingLink?: string;
  }>;
  projectSummary: {
    total: number;
    active: number;
    completed: number;
    pendingApprovals: number;
  };
  recentActivity: Array<{
    id: string;
    action: string;
    date: string;
    type: 'project' | 'approval' | 'billing' | 'file';
  }>;
}

export default function PortalDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        const token = await user.getIdToken();
        const response = await fetch('/api/portal/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-8 bg-gray-700 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-700 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'approval': return '✓';
      case 'payment': return '$';
      case 'meeting': return '📅';
      case 'milestone': return '🎯';
      default: return '•';
    }
  };

  const getActionColor = (type: string, urgent: boolean) => {
    if (urgent) return 'text-red-400';
    switch (type) {
      case 'approval': return 'text-yellow-400';
      case 'payment': return 'text-green-400';
      case 'meeting': return 'text-blue-400';
      case 'milestone': return 'text-purple-400';
      default: return 'text-text-muted';
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Welcome back, {user?.displayName || user?.email?.split('@')[0]}
        </h1>
        <p className="mt-2 text-text-muted">
          Here's what needs your attention today
        </p>
      </div>

      {/* Billing Alert */}
      {dashboardData?.billingStatus.status === 'overdue' && (
        <div className="rounded-lg border border-red-600 bg-red-900/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-red-400">Payment Overdue</h3>
              <p className="text-red-300">
                Your payment is {dashboardData.billingStatus.daysOverdue} days overdue. 
                Please update your payment method to avoid service interruption.
              </p>
            </div>
            <a
              href="/portal/billing"
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition"
            >
              Pay Now
            </a>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-700 bg-gray-900 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center">
                <span className="text-sm font-medium text-white">P</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-text-primary">Active Projects</p>
              <p className="text-2xl font-bold text-white">{dashboardData?.projectSummary.active || 0}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-700 bg-gray-900 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-md bg-yellow-600 flex items-center justify-center">
                <span className="text-sm font-medium text-white">!</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-text-primary">Pending Approvals</p>
              <p className="text-2xl font-bold text-white">{dashboardData?.projectSummary.pendingApprovals || 0}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-700 bg-gray-900 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-md bg-green-600 flex items-center justify-center">
                <span className="text-sm font-medium text-white">✓</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-text-primary">Completed</p>
              <p className="text-2xl font-bold text-white">{dashboardData?.projectSummary.completed || 0}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-700 bg-gray-900 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className={`h-8 w-8 rounded-md flex items-center justify-center ${
                dashboardData?.billingStatus.status === 'active' ? 'bg-green-600' :
                dashboardData?.billingStatus.status === 'overdue' ? 'bg-red-600' : 'bg-gray-600'
              }`}>
                <span className="text-sm font-medium text-white">$</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-text-primary">Billing Status</p>
              <p className="text-lg font-bold text-white capitalize">
                {dashboardData?.billingStatus.status || 'Unknown'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next Actions */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-gray-700 bg-gray-900 p-6">
            <h3 className="text-lg font-medium text-white mb-4">Next Actions</h3>
            <div className="space-y-4">
              {dashboardData?.nextActions.length ? (
                dashboardData.nextActions.map((action) => (
                  <div key={action.id} className="flex items-center justify-between border-b border-gray-700 pb-4 last:border-b-0 last:pb-0">
                    <div className="flex items-center space-x-3">
                      <span className={`${getActionColor(action.type, action.urgent)}`}>
                        {getActionIcon(action.type)}
                      </span>
                      <div>
                        <p className="font-medium text-white">{action.title}</p>
                        {action.dueDate && (
                          <p className="text-sm text-text-muted">Due: {action.dueDate}</p>
                        )}
                      </div>
                    </div>
                    {action.urgent && (
                      <span className="rounded-full bg-red-600 px-2 py-1 text-xs text-white">Urgent</span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-text-muted">No pending actions</p>
              )}
            </div>
          </div>
        </div>

        {/* Upcoming Meetings */}
        <div>
          <div className="rounded-lg border border-gray-700 bg-gray-900 p-6">
            <h3 className="text-lg font-medium text-white mb-4">Upcoming Meetings</h3>
            <div className="space-y-3">
              {dashboardData?.upcomingMeetings.length ? (
                dashboardData.upcomingMeetings.map((meeting) => (
                  <div key={meeting.id} className="border-b border-gray-700 pb-3 last:border-b-0 last:pb-0">
                    <p className="font-medium text-white">{meeting.title}</p>
                    <p className="text-sm text-text-muted">{meeting.date}</p>
                    {meeting.meetingLink && (
                      <a
                        href={meeting.meetingLink}
                        className="text-sm text-blue-400 hover:text-blue-300"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Join Meeting
                      </a>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-text-muted">No upcoming meetings</p>
              )}
            </div>
            <div className="mt-4">
              <a
                href="/portal/bookings"
                className="block w-full rounded-md bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-700 transition"
              >
                Schedule Meeting
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-lg border border-gray-700 bg-gray-900 p-6">
        <h3 className="text-lg font-medium text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {dashboardData?.recentActivity.length ? (
            dashboardData.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between">
                <div>
                  <p className="text-white">{activity.action}</p>
                  <p className="text-sm text-text-muted">{activity.date}</p>
                </div>
                <span className="rounded-full bg-gray-700 px-2 py-1 text-xs text-text-primary capitalize">
                  {activity.type}
                </span>
              </div>
            ))
          ) : (
            <p className="text-text-muted">No recent activity</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <a
          href="/portal/projects"
          className="rounded-lg border border-gray-700 bg-gray-900 p-4 text-center hover:bg-gray-800 transition"
        >
          <div className="text-2xl mb-2">📁</div>
          <div className="font-medium text-white">View Projects</div>
        </a>
        <a
          href="/portal/approvals"
          className="rounded-lg border border-gray-700 bg-gray-900 p-4 text-center hover:bg-gray-800 transition"
        >
          <div className="text-2xl mb-2">✅</div>
          <div className="font-medium text-white">Review Approvals</div>
        </a>
        <a
          href="/portal/billing"
          className="rounded-lg border border-gray-700 bg-gray-900 p-4 text-center hover:bg-gray-800 transition"
        >
          <div className="text-2xl mb-2">💳</div>
          <div className="font-medium text-white">Manage Billing</div>
        </a>
        <a
          href="/portal/files"
          className="rounded-lg border border-gray-700 bg-gray-900 p-4 text-center hover:bg-gray-800 transition"
        >
          <div className="text-2xl mb-2">📄</div>
          <div className="font-medium text-white">Access Files</div>
        </a>
      </div>
    </div>
  );
}