// Blog Admin Layout - Requires admin Firebase claim
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/server/firebaseAdmin';

interface BlogAdminLayoutProps {
  children: React.ReactNode;
}

export default async function BlogAdminLayout({ children }: BlogAdminLayoutProps) {
  // Get session cookie
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('__session')?.value;
  
  if (!sessionCookie) {
    redirect('/login?next=/portal/admin/blog');
  }

  try {
    // Verify session cookie and admin claim
    const decoded = await adminAuth().verifySessionCookie(sessionCookie, true);
    
    if (decoded.admin !== true) {
      redirect('/not-authorized');
    }
  } catch (error) {
    console.error('Admin verification failed:', error);
    redirect('/login?next=/portal/admin/blog');
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Admin Header */}
      <div className="border-b border-gray-800 bg-gray-900/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-[#F0FF85]">
                📝 Blog Admin
              </h1>
              <span className="px-3 py-1 bg-[#E8FF5A]/20 text-[#E8FF5A] text-sm rounded-full border border-[#E8FF5A]/30">
                Audio Jones CMS
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">
                🔥 Miami operator-level content control
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Content */}
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}