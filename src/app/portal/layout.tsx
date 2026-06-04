'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { PortalStatusPill } from '@/components/status/PortalStatusPill';
import { SystemStatusProvider } from '@/context/SystemStatusProvider';

interface PortalLayoutProps {
  children: React.ReactNode;
}

export default function PortalLayout({ children }: PortalLayoutProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?next=/portal');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-text-muted">Loading portal...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <SystemStatusProvider>
      <div className="min-h-screen bg-black text-white">
        {/* Portal Header */}
        <header className="border-b border-gray-800 bg-black/95 backdrop-blur sticky top-0 z-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-bold text-white">
                  Audio Jones Portal
                </h1>
              </div>
              
              <nav className="hidden md:flex items-center space-x-6">
                <a href="/portal" className="text-text-primary hover:text-white transition">
                  Dashboard
                </a>
                <a href="/portal/projects" className="text-text-primary hover:text-white transition">
                  Projects
                </a>
                <a href="/portal/billing" className="text-text-primary hover:text-white transition">
                  Billing
                </a>
                <a href="/portal/approvals" className="text-text-primary hover:text-white transition">
                  Approvals
                </a>
                <a href="/portal/bookings" className="text-text-primary hover:text-white transition">
                  Bookings
                </a>
                <a href="/portal/files" className="text-text-primary hover:text-white transition">
                  Files
                </a>
                <a href="/portal/client" className="text-blue-400 hover:text-blue-300 transition">
                  Client Portal
                </a>
                
                {/* Admin link for admin users */}
                {user.customClaims?.admin && (
                  <a href="/portal/admin" className="text-red-400 hover:text-red-300 transition">
                    Admin
                  </a>
                )}
                
                {/* System Status Indicator */}
                <div className="border-l border-gray-700 pl-4">
                  <PortalStatusPill />
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-text-muted">
                    {user.email}
                  </span>
                  <button
                    onClick={() => {
                      // TODO: Implement logout
                      router.push('/login');
                    }}
                    className="text-text-primary hover:text-white transition text-sm"
                  >
                    Logout
                  </button>
                </div>
              </nav>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button className="text-text-primary hover:text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Portal Content */}
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </SystemStatusProvider>
  );
}