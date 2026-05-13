// Content Scheduler Component - Calendar view for scheduled content
'use client';

import { useState, useEffect } from 'react';
import { PillarType, PILLARS } from '@/lib/models/blog';

interface ScheduledPost {
  id: string;
  title: string;
  slug: string;
  pillar: PillarType;
  scheduledFor: string;
  status: 'scheduled' | 'publishing' | 'published' | 'failed';
  estimatedViews: number;
  aiGenerated: boolean;
}

export default function ContentScheduler() {
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Mock data - replace with real API call
  useEffect(() => {
    const mockScheduledPosts: ScheduledPost[] = [
      {
        id: '1',
        title: 'AI Marketing Automation Framework',
        slug: 'ai-marketing-automation-framework',
        pillar: 'ai',
        scheduledFor: '2024-01-16T09:00:00Z',
        status: 'scheduled',
        estimatedViews: 2400,
        aiGenerated: true
      },
      {
        id: '2',
        title: 'Personal Brand Strategy for Creators',
        slug: 'personal-brand-strategy-creators',
        pillar: 'personal-brand',
        scheduledFor: '2024-01-17T14:00:00Z',
        status: 'scheduled',
        estimatedViews: 1800,
        aiGenerated: false
      },
      {
        id: '3',
        title: 'Podcast Growth Hacks That Work',
        slug: 'podcast-growth-hacks-work',
        pillar: 'podcast-news',
        scheduledFor: '2024-01-18T11:00:00Z',
        status: 'scheduled',
        estimatedViews: 3200,
        aiGenerated: true
      },
      {
        id: '4',
        title: 'Marketing ROI Calculator',
        slug: 'marketing-roi-calculator',
        pillar: 'marketing',
        scheduledFor: '2024-01-19T10:00:00Z',
        status: 'scheduled',
        estimatedViews: 2800,
        aiGenerated: true
      },
      {
        id: '5',
        title: 'Tech Trends Q1 2024',
        slug: 'tech-trends-q1-2024',
        pillar: 'tech-business-trends',
        scheduledFor: '2024-01-20T15:00:00Z',
        status: 'scheduled',
        estimatedViews: 2100,
        aiGenerated: false
      }
    ];

    setTimeout(() => {
      setScheduledPosts(mockScheduledPosts);
      setLoading(false);
    }, 500);
  }, []);

  const getWeekDates = (startDate: Date) => {
    const dates = [];
    const start = new Date(startDate);
    const day = start.getDay();
    const diff = start.getDate() - day; // First day is the day of the month - the day of the week
    const monday = new Date(start.setDate(diff));

    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const getPostsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return scheduledPosts.filter(post => 
      post.scheduledFor.split('T')[0] === dateStr
    );
  };

  const getPillarColor = (pillar: PillarType) => {
    return PILLARS[pillar].color;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500/20 text-blue-400';
      case 'publishing': return 'bg-yellow-500/20 text-yellow-400';
      case 'published': return 'bg-green-500/20 text-green-400';
      case 'failed': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const weekDates = getWeekDates(selectedDate);

  if (loading) {
    return (
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-800 rounded w-48 mb-6" />
          <div className="grid grid-cols-7 gap-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-800 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-[#F0FF85]">
            📅 Content Calendar
          </h2>
          <span className="px-3 py-1 bg-[#E8FF5A]/20 text-[#E8FF5A] text-sm rounded-full">
            {scheduledPosts.length} scheduled
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'week' 
                  ? 'bg-[#E8FF5A] text-[#080808]' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'month' 
                  ? 'bg-[#E8FF5A] text-[#080808]' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Month
            </button>
          </div>

          {/* Date Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setDate(newDate.getDate() - 7);
                setSelectedDate(newDate);
              }}
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              ←
            </button>
            <span className="text-sm font-medium text-white min-w-[120px] text-center">
              {selectedDate.toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric',
                day: 'numeric'
              })}
            </span>
            <button
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setDate(newDate.getDate() + 7);
                setSelectedDate(newDate);
              }}
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              →
            </button>
          </div>

          <button className="bg-[#E8FF5A] hover:bg-[#F0FF85] text-[#080808] px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            + Schedule Post
          </button>
        </div>
      </div>

      {/* Week View Calendar */}
      {viewMode === 'week' && (
        <div className="grid grid-cols-7 gap-4">
          {weekDates.map((date, index) => {
            const postsForDate = getPostsForDate(date);
            const isToday = date.toDateString() === new Date().toDateString();
            
            return (
              <div
                key={index}
                className={`bg-gray-800/50 border rounded-lg p-3 min-h-[200px] ${
                  isToday ? 'border-[#E8FF5A] bg-[#E8FF5A]/5' : 'border-gray-700'
                }`}
              >
                {/* Day Header */}
                <div className="text-center mb-3">
                  <div className="text-xs text-gray-400 mb-1">
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                  <div className={`text-lg font-semibold ${
                    isToday ? 'text-[#E8FF5A]' : 'text-white'
                  }`}>
                    {date.getDate()}
                  </div>
                </div>

                {/* Posts for this date */}
                <div className="space-y-2">
                  {postsForDate.map((post) => (
                    <div
                      key={post.id}
                      className="bg-gray-900/50 border border-gray-600 rounded-lg p-2 cursor-pointer hover:bg-gray-900/70 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: getPillarColor(post.pillar) }}
                        />
                        <span className="text-xs font-medium text-white truncate">
                          {post.title}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">
                          {new Date(post.scheduledFor).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        <div className="flex items-center gap-1">
                          {post.aiGenerated && (
                            <span className="text-purple-400">🤖</span>
                          )}
                          <span className={`px-1 py-0.5 rounded text-xs ${getStatusColor(post.status)}`}>
                            {post.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500 mt-1">
                        Est. {post.estimatedViews.toLocaleString()} views
                      </div>
                    </div>
                  ))}
                  
                  {postsForDate.length === 0 && (
                    <div className="text-center text-gray-500 text-xs py-4">
                      No posts scheduled
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Month View Placeholder */}
      {viewMode === 'month' && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📅</div>
          <h3 className="text-lg font-semibold text-white mb-2">Month View</h3>
          <p className="text-gray-400">
            Month view coming soon. Use week view for detailed scheduling.
          </p>
        </div>
      )}

      {/* Scheduling Stats */}
      <div className="mt-8 pt-6 border-t border-gray-700">
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#E8FF5A] mb-1">
              {scheduledPosts.length}
            </div>
            <div className="text-sm text-gray-400">Total Scheduled</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-[#F0FF85] mb-1">
              {Math.round(scheduledPosts.reduce((sum, post) => sum + post.estimatedViews, 0) / 1000)}k
            </div>
            <div className="text-sm text-gray-400">Est. Total Views</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {scheduledPosts.filter(post => post.aiGenerated).length}
            </div>
            <div className="text-sm text-gray-400">AI Generated</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {scheduledPosts.filter(post => post.status === 'scheduled').length}
            </div>
            <div className="text-sm text-gray-400">Ready to Publish</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-700 text-center">
        <p className="text-xs text-gray-400">
          🔥 <span className="text-[#E8FF5A]">Audio Jones</span> Content Scheduler • 
          Automated publishing for predictable growth • 
          <span className="text-[#F0FF85]">Miami operator efficiency</span>
        </p>
      </div>
    </div>
  );
}