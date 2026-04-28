"use client";

import React from 'react';
import { 
  Calendar, 
  CreditCard, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  FileText,
  MessageSquare,
  ArrowRight
} from 'lucide-react';

interface NextAction {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  type: 'approval' | 'payment' | 'booking' | 'content';
}

interface BillingStatus {
  status: 'current' | 'overdue' | 'pending';
  amount?: number;
  dueDate?: string;
  nextBilling?: string;
}

interface UpcomingBooking {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'consultation' | 'recording' | 'review';
}

export default function Dashboard() {
  // Mock data - in real app, this would come from API calls
  const nextActions: NextAction[] = [
    {
      id: '1',
      title: 'Review Brand Guidelines',
      description: 'Approve final brand guidelines for Q1 campaign',
      priority: 'high',
      dueDate: '2025-11-05',
      type: 'approval'
    },
    {
      id: '2',
      title: 'Content Calendar Feedback',
      description: 'Review and approve December content calendar',
      priority: 'medium',
      dueDate: '2025-11-08',
      type: 'content'
    },
    {
      id: '3',
      title: 'Schedule Q1 Strategy Call',
      description: 'Book your quarterly strategy session',
      priority: 'medium',
      type: 'booking'
    }
  ];

  const billingStatus: BillingStatus = {
    status: 'current',
    nextBilling: '2025-12-01',
    amount: 2500
  };

  const upcomingBooking: UpcomingBooking = {
    id: '1',
    title: 'Monthly Strategy Review',
    date: '2025-11-15',
    time: '2:00 PM EST',
    type: 'consultation'
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-900/20 border-red-800';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-800';
      case 'low': return 'text-green-400 bg-green-900/20 border-green-800';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-800';
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'approval': return <CheckCircle className="w-5 h-5" />;
      case 'payment': return <CreditCard className="w-5 h-5" />;
      case 'booking': return <Calendar className="w-5 h-5" />;
      case 'content': return <FileText className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const getBillingStatusColor = (status: string) => {
    switch (status) {
      case 'current': return 'text-green-400 bg-green-900/20 border-green-800';
      case 'overdue': return 'text-red-400 bg-red-900/20 border-red-800';
      case 'pending': return 'text-yellow-400 bg-yellow-900/20 border-yellow-800';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-gray-400">
            Here&apos;s what needs your attention today
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Next Actions */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Next Actions</h2>
                <span className="text-sm text-gray-400">{nextActions.length} pending</span>
              </div>
              
              <div className="space-y-3">
                {nextActions.map((action) => (
                  <div 
                    key={action.id}
                    className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="text-gray-400 mt-1">
                          {getActionIcon(action.type)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-white mb-1">{action.title}</h3>
                          <p className="text-sm text-gray-400 mb-2">{action.description}</p>
                          {action.dueDate && (
                            <p className="text-xs text-gray-500">Due: {action.dueDate}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(action.priority)}`}>
                          {action.priority}
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-800">
                <button className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center space-x-1">
                  <span>View all actions</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Quick Access</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: <CheckCircle className="w-6 h-6" />, label: 'Approvals', count: '3 pending' },
                  { icon: <MessageSquare className="w-6 h-6" />, label: 'Messages', count: '2 unread' },
                  { icon: <FileText className="w-6 h-6" />, label: 'Projects', count: '4 active' },
                  { icon: <Calendar className="w-6 h-6" />, label: 'Bookings', count: 'Schedule' }
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors cursor-pointer text-center"
                  >
                    <div className="text-blue-400 mb-2 flex justify-center">{item.icon}</div>
                    <h3 className="font-medium text-white text-sm mb-1">{item.label}</h3>
                    <p className="text-xs text-gray-400">{item.count}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Billing Status */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Billing Status</h2>
              
              <div className={`border rounded-lg p-4 ${getBillingStatusColor(billingStatus.status)}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Account Status</span>
                  <CreditCard className="w-5 h-5" />
                </div>
                <p className="text-sm capitalize mb-3">{billingStatus.status}</p>
                
                {billingStatus.nextBilling && (
                  <div className="text-sm">
                    <p className="text-gray-300">Next billing:</p>
                    <p className="font-medium">{billingStatus.nextBilling}</p>
                    {billingStatus.amount && (
                      <p className="text-gray-300">${billingStatus.amount.toLocaleString()}</p>
                    )}
                  </div>
                )}
              </div>

              <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                Manage Billing
              </button>
            </div>

            {/* Upcoming Booking */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Next Meeting</h2>
              
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-blue-400 mt-1" />
                  <div>
                    <h3 className="font-medium text-white mb-1">{upcomingBooking.title}</h3>
                    <p className="text-sm text-gray-400 mb-1">{upcomingBooking.date}</p>
                    <p className="text-sm text-gray-400">{upcomingBooking.time}</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-blue-900/30 text-blue-400 text-xs rounded-full">
                      {upcomingBooking.type}
                    </span>
                  </div>
                </div>
              </div>

              <button className="w-full mt-4 bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors border border-gray-700">
                View Calendar
              </button>
            </div>

            {/* Project Status */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Active Projects</h2>
              
              <div className="space-y-3">
                {[
                  { name: 'Brand Redesign', progress: 85, status: 'In Review' },
                  { name: 'Content Calendar', progress: 60, status: 'In Progress' },
                  { name: 'Website Updates', progress: 30, status: 'Planning' }
                ].map((project, index) => (
                  <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium text-white">{project.name}</h3>
                      <span className="text-xs text-gray-400">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-400">{project.status}</p>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 text-blue-400 hover:text-blue-300 py-2 text-sm font-medium transition-colors">
                View All Projects
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}