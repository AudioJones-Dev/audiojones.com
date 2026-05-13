// Quick Stats Component - Dashboard overview for blog admin
import { Suspense } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  icon: string;
  color: 'orange' | 'gold' | 'green' | 'blue';
}

function StatCard({ title, value, trend, icon, color }: StatCardProps) {
  const colorClasses = {
    orange: 'from-[#E8FF5A]/20 to-[#F0FF85]/20 border-[#E8FF5A]/30',
    gold: 'from-[#F0FF85]/20 to-[#FFA500]/20 border-[#F0FF85]/30',
    green: 'from-green-500/20 to-green-600/20 border-green-500/30',
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30'
  };

  const textColors = {
    orange: 'text-[#E8FF5A]',
    gold: 'text-[#F0FF85]',
    green: 'text-green-400',
    blue: 'text-blue-400'
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-6`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <h3 className="font-semibold text-white">{title}</h3>
        </div>
        {trend && (
          <span className={`text-xs px-2 py-1 rounded-full ${textColors[color]} bg-black/20`}>
            {trend}
          </span>
        )}
      </div>
      
      <div className="flex items-end gap-2">
        <span className={`text-3xl font-bold ${textColors[color]}`}>
          {value}
        </span>
      </div>
    </div>
  );
}

async function getStatsData() {
  // In a real app, this would fetch from your database
  // For now, returning mock data
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return {
    totalPosts: 127,
    drafts: 12,
    scheduled: 5,
    viewsThisMonth: 24567,
    engagement: 3.2,
    avgPerformance: 85
  };
}

async function StatsContent() {
  const stats = await getStatsData();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Posts"
        value={stats.totalPosts}
        trend="+12 this month"
        icon="📄"
        color="blue"
      />
      
      <StatCard
        title="Active Drafts"
        value={stats.drafts}
        trend="3 ready"
        icon="📝"
        color="orange"
      />
      
      <StatCard
        title="Scheduled"
        value={stats.scheduled}
        trend="Next: Tomorrow"
        icon="📅"
        color="gold"
      />
      
      <StatCard
        title="Monthly Views"
        value={`${(stats.viewsThisMonth / 1000).toFixed(1)}k`}
        trend="+34%"
        icon="👀"
        color="green"
      />
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <div className="animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gray-700 rounded" />
              <div className="h-4 bg-gray-700 rounded w-24" />
            </div>
            <div className="h-8 bg-gray-700 rounded w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function QuickStats() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[#F0FF85]">
          📊 Performance Overview
        </h2>
        <div className="text-sm text-gray-400">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
      
      <Suspense fallback={<StatsSkeleton />}>
        <StatsContent />
      </Suspense>
      
      {/* Additional Performance Metrics */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 text-white">
          🎯 Audio Jones Performance Metrics
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#E8FF5A] mb-1">85%</div>
            <div className="text-sm text-gray-400">Avg. Performance Score</div>
            <div className="text-xs text-green-400 mt-1">▲ 12% vs last month</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-[#F0FF85] mb-1">3.2</div>
            <div className="text-sm text-gray-400">Engagement Rate</div>
            <div className="text-xs text-green-400 mt-1">▲ 0.4 vs last month</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">4.1m</div>
            <div className="text-sm text-gray-400">Reading Time (min)</div>
            <div className="text-xs text-gray-400 mt-1">● Optimal range</div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">
              🔥 Miami operator-level performance tracking
            </span>
            <span className="text-[#E8FF5A]">
              Predictable growth through data
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}