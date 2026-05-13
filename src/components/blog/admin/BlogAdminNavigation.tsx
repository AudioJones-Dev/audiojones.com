// Blog Admin Navigation - Tab-based navigation for admin interface
'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface BlogAdminNavigationProps {
  activeTab: string;
}

const adminTabs = [
  {
    id: 'drafts',
    label: 'Drafts',
    icon: '📝',
    count: 12,
    description: 'Manage content drafts'
  },
  {
    id: 'schedule',
    label: 'Schedule',
    icon: '📅',
    count: 5,
    description: 'Content calendar'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: '📊',
    count: null,
    description: 'Performance insights'
  },
  {
    id: 'automation',
    label: 'AI Automation',
    icon: '🤖',
    count: null,
    description: 'Content generation'
  }
];

export default function BlogAdminNavigation({ activeTab }: BlogAdminNavigationProps) {
  const searchParams = useSearchParams();

  const createTabUrl = (tabId: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('tab', tabId);
    return `/portal/admin/blog?${params.toString()}`;
  };

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#F0FF85]">
          🎛️ Content Control Center
        </h2>
        <div className="text-sm text-gray-400">
          Miami operator-level content management
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="grid md:grid-cols-4 gap-4">
        {adminTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          
          return (
            <Link
              key={tab.id}
              href={createTabUrl(tab.id)}
              className={`
                group relative p-4 rounded-lg border transition-all duration-200
                ${isActive 
                  ? 'bg-gradient-to-r from-[#E8FF5A]/20 to-[#F0FF85]/20 border-[#E8FF5A]/40 text-white' 
                  : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-gray-600'
                }
              `}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#E8FF5A] rounded-full" />
              )}

              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{tab.icon}</span>
                  <span className="font-semibold">{tab.label}</span>
                </div>
                {tab.count && (
                  <span className={`
                    px-2 py-1 text-xs rounded-full font-medium
                    ${isActive ? 'bg-[#E8FF5A] text-[#080808]' : 'bg-gray-700 text-gray-300'}
                  `}>
                    {tab.count}
                  </span>
                )}
              </div>

              <p className={`text-xs ${isActive ? 'text-gray-200' : 'text-gray-400'}`}>
                {tab.description}
              </p>

              {/* Hover effect */}
              <div className={`
                absolute inset-0 rounded-lg transition-opacity duration-200
                ${isActive ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}
                bg-gradient-to-r from-[#E8FF5A]/5 to-[#F0FF85]/5
              `} />
            </Link>
          );
        })}
      </div>

      {/* Active Tab Info */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[#E8FF5A]">
              {adminTabs.find(tab => tab.id === activeTab)?.icon}
            </span>
            <span className="text-sm text-gray-400">
              Active: <span className="text-white font-medium">
                {adminTabs.find(tab => tab.id === activeTab)?.label}
              </span>
            </span>
          </div>
          <div className="text-xs text-gray-500">
            🔥 Audio Jones CMS • Predictable content growth
          </div>
        </div>
      </div>
    </div>
  );
}