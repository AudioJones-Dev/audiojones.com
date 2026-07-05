import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { isAdminUser } from '@/lib/server/requireAdminUser';
import AdminSidebar from '@/app/portal/components/AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  // Server-side Supabase session verification for admin access.
  // Fail closed: no configured Supabase or no verified user → login.
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    redirect('/portal/admin/login');
  }

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    redirect('/portal/admin/login');
  }

  if (!isAdminUser(data.user)) {
    redirect('/not-authorized');
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Admin Sidebar */}
      <AdminSidebar />
      
      {/* Main content area */}
      <div className="flex-1 md:ml-64">
        {/* Top Header */}
        <header className="border-b border-gray-800 bg-black/95 backdrop-blur">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-bold text-white md:hidden">
                  AJ Admin Portal
                </h1>
                <span className="rounded-full bg-red-600 px-2 py-1 text-xs font-medium text-white">
                  ADMIN
                </span>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-sm text-text-muted">
                  {new Date().toLocaleDateString()}
                </span>
                <a href="/portal" className="text-text-primary hover:text-white transition text-sm">
                  Back to Portal
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Admin Content */}
        <main className="bg-black">
          {children}
        </main>
      </div>
    </div>
  );
}