/**
 * Public Status Dot
 * 
 * Minimal status indicator for the main site header.
 * Shows just a colored dot with status text and links to full status page.
 */

'use client';

import Link from 'next/link';
import { useSystemStatusIndicator } from '@/hooks/useSystemStatus';
import { getStatusIndicatorStyles } from '@/lib/statusToTone';

export function PublicStatusDot() {
  const { status, loading } = useSystemStatusIndicator();
  
  if (loading) {
    return (
      <Link 
        href="/status" 
        className="flex items-center text-sm text-text-muted hover:text-text-primary transition no-underline"
      >
        <div className="w-2 h-2 rounded-full bg-surface-2 animate-pulse mr-2" />
        Status
      </Link>
    );
  }
  
  const styles = getStatusIndicatorStyles(status);
  
  return (
    <Link 
      href="/status"
      className="flex items-center text-sm text-text-primary hover:text-text-primary transition no-underline"
      title={`System status: ${status}. Click to view details.`}
    >
      <div className={`w-2 h-2 rounded-full mr-2 ${
        status === 'operational' ? 'bg-accent-green' :
        status === 'degraded' ? 'bg-accent-amber' :
        'bg-accent-red'
      }`} />
      Status
    </Link>
  );
}