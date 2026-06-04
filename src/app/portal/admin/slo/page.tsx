'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminSLOPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to enhanced SLO dashboard
    router.replace('/portal/admin/slo-new');
  }, [router]);

  return (
    <div className="min-h-screen bg-black text-white p-8 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-pulse">
          <div className="text-4xl mb-4">📊</div>
          <h1 className="text-xl font-semibold mb-2">Redirecting to Enhanced SLO Dashboard...</h1>
          <p className="text-text-muted">Loading auto-credits monitoring system</p>
        </div>
      </div>
    </div>
  );
}