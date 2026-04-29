/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import { useEffect, useState } from 'react';
import { DegradedBanner } from '@/components/status/DegradedBanner';
import { useStatusAlerts } from '@/context/SystemStatusProvider';

interface DashboardStats {
  totalUsers: number;
  adminUsers: number;
  pendingApprovals: number;
  activeProjects: number;
  systemHealth: 'healthy' | 'warning' | 'error';
  lastWebhook: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    adminUsers: 0,
    pendingApprovals: 0,
    activeProjects: 0,
    systemHealth: 'healthy',
    lastWebhook: 'Never'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Get authentication token
        const user = await new Promise((resolve) => {
          // This would use your existing Firebase Auth context
          // For now, we'll simulate the API call structure
          resolve({ accessToken: 'placeholder' });
        });

        // Fetch admin dashboard stats
        const response = await fetch('/api/admin/dashboard', {
          headers: {
            'Authorization': `Bearer ${(user as any).accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-lg border border-gray-700 bg-gray-900 p-6">
              <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
              <div className="mt-4 h-8 bg-gray-700 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Get status alert data from context
  const { shouldShowBanner, bannerType, primaryIncident } = useStatusAlerts();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="mt-2 text-gray-400">
          Monitor and manage all Audio Jones operations
        </p>
      </div>

      {/* Status-aware Banner */}
      {shouldShowBanner && bannerType && (
        <DegradedBanner 
          status={bannerType} 
          incidents={primaryIncident ? [primaryIncident] : []} 
        />
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-700 bg-gray-900 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center">
                <span className="text-sm font-medium text-white">U</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-300">Total Users</p>
              <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-700 bg-gray-900 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-md bg-red-600 flex items-center justify-center">
                <span className="text-sm font-medium text-white">A</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-300">Admin Users</p>
              <p className="text-2xl font-bold text-white">{stats.adminUsers}</p>
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
              <p className="text-sm font-medium text-gray-300">Pending Approvals</p>
              <p className="text-2xl font-bold text-white">{stats.pendingApprovals}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-700 bg-gray-900 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-md bg-green-600 flex items-center justify-center">
                <span className="text-sm font-medium text-white">P</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-300">Active Projects</p>
              <p className="text-2xl font-bold text-white">{stats.activeProjects}</p>
            </div>
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-700 bg-gray-900 p-6">
          <h3 className="text-lg font-medium text-white mb-4">System Health</h3>
          <div className="flex items-center space-x-3">
            <div className={`h-3 w-3 rounded-full ${
              stats.systemHealth === 'healthy' ? 'bg-green-500' : 
              stats.systemHealth === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
            }`}></div>
            <span className="text-white capitalize">{stats.systemHealth}</span>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Firebase Admin</span>
              <span className="text-green-400">Connected</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Database</span>
              <span className="text-green-400">Connected</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Last Webhook</span>
              <span className="text-gray-300">{stats.lastWebhook}</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-700 bg-gray-900 p-6">
          <h3 className="text-lg font-medium text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <a
              href="/portal/admin/users"
              className="block w-full rounded-md bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-700 transition"
            >
              Manage Users
            </a>
            <a
              href="/portal/admin/approvals"
              className="block w-full rounded-md bg-yellow-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-yellow-700 transition"
            >
              Review Approvals
            </a>
            <a
              href="/portal/admin/system"
              className="block w-full rounded-md bg-gray-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-gray-700 transition"
            >
              System Status
            </a>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-lg border border-gray-700 bg-gray-900 p-6">
        <h3 className="text-lg font-medium text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-gray-700 pb-3">
            <div>
              <p className="text-sm font-medium text-white">New user registration</p>
              <p className="text-xs text-gray-400">2 minutes ago</p>
            </div>
            <span className="rounded-full bg-blue-600 px-2 py-1 text-xs text-white">USER</span>
          </div>
          <div className="flex items-center justify-between border-b border-gray-700 pb-3">
            <div>
              <p className="text-sm font-medium text-white">Content approval required</p>
              <p className="text-xs text-gray-400">15 minutes ago</p>
            </div>
            <span className="rounded-full bg-yellow-600 px-2 py-1 text-xs text-white">APPROVAL</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Webhook received from Whop</p>
              <p className="text-xs text-gray-400">1 hour ago</p>
            </div>
            <span className="rounded-full bg-green-600 px-2 py-1 text-xs text-white">WEBHOOK</span>
          </div>
        </div>
      </div>
    </div>
  );
}