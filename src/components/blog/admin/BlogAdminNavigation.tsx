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
    <div className="bg-surface-1 border border-border-subtle rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-signal-yellow">
          🎛️ Content Control Center
        </h2>
        <div className="text-sm text-text-muted">
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
                  ? 'bg-gradient-to-r from-[#E8FF5A]/20 to-[#4DACFF]/20 border-signal-yellow/40 text-white'
                  : 'bg-surface-2 border-border-subtle text-text-muted hover:bg-surface-2 hover:border-border-strong'
                }
              `}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-signal-yellow rounded-full" />
              )}

              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{tab.icon}</span>
                  <span className="font-semibold">{tab.label}</span>
                </div>
                {tab.count && (
                  <span className={`
                    px-2 py-1 text-xs rounded-full font-medium
                    ${isActive ? 'bg-signal-yellow text-bg-base' : 'bg-surface-2 text-text-muted'}
                  `}>
                    {tab.count}
                  </span>
                )}
              </div>

              <p className={`text-xs ${isActive ? 'text-text-primary' : 'text-text-muted'}`}>
                {tab.description}
              </p>

              {/* Hover effect */}
              <div className={`
                absolute inset-0 rounded-lg transition-opacity duration-200
                ${isActive ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}
                bg-gradient-to-r from-[#E8FF5A]/5 to-[#4DACFF]/5
              `} />
            </Link>
          );
        })}
      </div>

      {/* Active Tab Info */}
      <div className="mt-6 pt-4 border-t border-border-subtle">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-signal-yellow">
              {adminTabs.find(tab => tab.id === activeTab)?.icon}
            </span>
            <span className="text-sm text-text-muted">
              Active: <span className="text-white font-medium">
                {adminTabs.find(tab => tab.id === activeTab)?.label}
              </span>
            </span>
          </div>
          <div className="text-xs text-text-muted">
            🔥 Audio Jones CMS • Predictable content growth
          </div>
        </div>
      </div>
    </div>
  );
}