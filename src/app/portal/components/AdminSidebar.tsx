// src/app/portal/components/AdminSidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Activity, 
  Settings, 
  Database,
  BarChart3,
  FileText,
  Shield,
  TrendingUp,
  Bell,
  AlertTriangle,
  Package,
  RefreshCw,
  Clock,
  Download,
  Target,
  MessageSquare,
  Rss,
  DollarSign,
  Building2
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

const navigation: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/portal/admin',
    icon: LayoutDashboard,
    description: 'Overview and metrics'
  },
  {
    name: 'Customers',
    href: '/portal/admin/customers',
    icon: Users,
    description: 'Customer management'
  },
  {
    name: 'Events',
    href: '/portal/admin/events',
    icon: Activity,
    description: 'Subscription events'
  },
  {
    name: 'Statistics',
    href: '/portal/admin/stats',
    icon: TrendingUp,
    description: 'Live data & metrics'
  },
  {
    name: 'Alerts',
    href: '/portal/admin/alerts',
    icon: Bell,
    description: 'System notifications'
  },
  {
    name: 'Incidents',
    href: '/portal/admin/incidents',
    icon: AlertTriangle,
    description: 'Incident management'
  },
  {
    name: 'Incident Feed',
    href: '/portal/admin/incidents/feed',
    icon: Rss,
    description: 'Public incident API feed'
  },
  {
    name: 'SLOs',
    href: '/portal/admin/slo',
    icon: Target,
    description: 'Service level objectives'
  },
  {
    name: 'Digest',
    href: '/portal/admin/digest',
    icon: MessageSquare,
    description: 'Ops digest & Slack reports'
  },
  {
    name: 'Pricing',
    href: '/portal/admin/pricing',
    icon: Package,
    description: 'SKU management'
  },
  {
    name: 'SLO Credits',
    href: '/portal/admin/slo-credits',
    icon: Target,
    description: 'Auto billing credits'
  },
  {
    name: 'Backup & DR',
    href: '/portal/admin/backup',
    icon: Download,
    description: 'Disaster recovery'
  },
  {
    name: 'Secrets Rotation',
    href: '/portal/admin/secrets',
    icon: Shield,
    description: 'Zero-downtime secret rotation'
  },
  {
    name: 'Organizations',
    href: '/portal/admin/multitenant',
    icon: Building2,
    description: 'Multi-tenant management'
  },
  {
    name: 'Feature Flags',
    href: '/portal/admin/feature-flags',
    icon: Target,
    description: 'Dark launches & kill switches'
  },
  {
    name: 'Observability',
    href: '/portal/admin/observability',
    icon: BarChart3,
    description: 'Distributed tracing & metrics'
  },
  {
    name: 'Webhooks',
    href: '/portal/admin/webhooks',
    icon: RefreshCw,
    description: 'Debug & replay events'
  },
  {
    name: 'Webhook Tester',
    href: '/portal/admin/webhook-tester',
    icon: Shield,
    description: 'Test webhook signatures'
  },
  {
    name: 'Webhook Ops',
    href: '/portal/admin/webhook-ops',
    icon: Activity,
    description: 'Monitor webhook operations'
  },
  {
    name: 'Audit',
    href: '/portal/admin/audit',
    icon: Clock,
    description: 'Admin action log'
  },
  {
    name: 'Reports',
    href: '/portal/admin/reports',
    icon: Download,
    description: 'Analytics & exports'
  },
  {
    name: 'Analytics',
    href: '/portal/admin/analytics',
    icon: BarChart3,
    description: 'Revenue & growth'
  },
  {
    name: 'System',
    href: '/portal/admin/system',
    icon: Database,
    description: 'System health'
  },
  {
    name: 'Settings',
    href: '/portal/admin/settings',
    icon: Settings,
    description: 'Configuration'
  }
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex flex-col flex-grow pt-5 bg-gray-900 overflow-y-auto">
        {/* Logo/Brand */}
        <div className="flex items-center flex-shrink-0 px-4">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-blue-400" />
            <div className="ml-3">
              <h1 className="text-xl font-semibold text-white">Admin Portal</h1>
              <p className="text-sm text-gray-400">AudioJones.com</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-8 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/portal/admin' && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center px-2 py-3 text-sm font-medium rounded-md transition-colors
                  ${isActive
                    ? 'bg-blue-900 text-blue-100 border-r-2 border-blue-400'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }
                `}
              >
                <item.icon
                  className={`
                    mr-3 flex-shrink-0 h-5 w-5 transition-colors
                    ${isActive ? 'text-blue-300' : 'text-gray-400 group-hover:text-gray-300'}
                  `}
                />
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  {item.description && (
                    <div className="text-xs text-gray-500 group-hover:text-gray-400">
                      {item.description}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="flex-shrink-0 px-4 py-4 border-t border-gray-700">
          <div className="text-xs text-gray-500">
            <div className="flex items-center justify-between">
              <span>System Status</span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                <span>Online</span>
              </div>
            </div>
            <div className="mt-1 text-gray-600">
              v1.0.0 • {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}