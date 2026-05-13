// Blog Admin Dashboard - Main interface for content management
import { Suspense } from 'react';
import BlogAdminNavigation from '@/components/blog/admin/BlogAdminNavigation';
import DraftsList from '@/components/blog/admin/DraftsList';
import QuickStats from '@/components/blog/admin/QuickStats';
import ContentScheduler from '@/components/blog/admin/ContentScheduler';
import { PillarType } from '@/lib/models/blog';

interface BlogAdminDashboardProps {
  searchParams?: {
    tab?: string;
    pillar?: PillarType;
  };
}

export default function BlogAdminDashboard({ searchParams }: BlogAdminDashboardProps) {
  const activeTab = searchParams?.tab || 'drafts';
  const selectedPillar = searchParams?.pillar;

  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <Suspense fallback={<div className="animate-pulse bg-gray-800 h-32 rounded-xl" />}>
        <QuickStats />
      </Suspense>

      {/* Navigation Tabs */}
      <BlogAdminNavigation activeTab={activeTab} />

      {/* Main Content Area */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Primary Content */}
        <div className="lg:col-span-8">
          {activeTab === 'drafts' && (
            <Suspense fallback={<div className="animate-pulse bg-gray-800 h-96 rounded-xl" />}>
              <DraftsList pillarFilter={selectedPillar} />
            </Suspense>
          )}

          {activeTab === 'schedule' && (
            <Suspense fallback={<div className="animate-pulse bg-gray-800 h-96 rounded-xl" />}>
              <ContentScheduler />
            </Suspense>
          )}

          {activeTab === 'analytics' && (
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
              <div className="text-center">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-bold mb-2">Analytics Dashboard</h3>
                <p className="text-gray-400">
                  Performance tracking coming soon...
                </p>
              </div>
            </div>
          )}

          {activeTab === 'automation' && (
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
              <div className="text-center">
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="text-xl font-bold mb-2">AI Automation Hub</h3>
                <p className="text-gray-400">
                  Automated content generation controls coming soon...
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Actions */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4 text-[#F0FF85]">
              ⚡ Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-[#E8FF5A] to-[#F0FF85] hover:from-[#F0FF85] hover:to-[#E8FF5A] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200">
                🎯 Generate AI Content
              </button>
              <button className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
                📝 New Draft
              </button>
              <button className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
                📅 Schedule Post
              </button>
              <button className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
                🔍 Content Research
              </button>
            </div>
          </div>

          {/* Pillar Performance */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4 text-[#F0FF85]">
              📈 Pillar Performance
            </h3>
            <div className="space-y-3">
              {['ai', 'marketing', 'podcast-news', 'tech-business-trends', 'personal-brand'].map((pillar) => (
                <div key={pillar} className="flex items-center justify-between">
                  <span className="text-sm text-gray-300 capitalize">
                    {pillar.replace('-', ' ')}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#E8FF5A] to-[#F0FF85]"
                        style={{ width: `${Math.random() * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400">
                      {Math.floor(Math.random() * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4 text-[#F0FF85]">
              🔥 Recent Activity
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <span className="text-green-400">✓</span>
                <div>
                  <p className="text-white">Published AI Marketing post</p>
                  <p className="text-gray-400">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-400">📝</span>
                <div>
                  <p className="text-white">Draft created: EPM Framework</p>
                  <p className="text-gray-400">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-yellow-400">⏰</span>
                <div>
                  <p className="text-white">Scheduled: Personal Brand Tips</p>
                  <p className="text-gray-400">Yesterday</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-purple-400">🤖</span>
                <div>
                  <p className="text-white">AI research completed</p>
                  <p className="text-gray-400">2 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Audio Jones Footer */}
      <div className="mt-12 text-center border-t border-gray-800 pt-8">
        <p className="text-gray-400 text-sm">
          🔥 <span className="text-[#E8FF5A]">Audio Jones</span> Blog Admin • 
          Powered by Miami operator-level systems • 
          <span className="text-[#F0FF85]">Predictable growth through content automation</span>
        </p>
      </div>
    </div>
  );
}