import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/server/legacyAdmin';
import AdminSidebar from '@/app/portal/components/AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  // Server-side session cookie verification for admin access
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  
  if (!sessionCookie) {
    redirect('/portal/admin/login');
  }

  try {
    // Verify session cookie and check admin claims
    const decoded = await adminAuth().verifySessionCookie(sessionCookie, true);
    
    // Require admin custom claim
    if (decoded.admin !== true) {
      redirect('/not-authorized');
    }
  } catch (error) {
    console.error('Admin auth verification failed:', error);
    redirect('/portal/admin/login');
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
                <span className="text-sm text-gray-400">
                  {new Date().toLocaleDateString()}
                </span>
                <a href="/portal" className="text-gray-300 hover:text-white transition text-sm">
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