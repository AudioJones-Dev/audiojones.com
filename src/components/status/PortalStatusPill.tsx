/**
 * Portal Status Pill Component
 * 
 * Compact status indicator for the portal header that shows current system health
 * and links to the full status page.
 */

'use client';

import Link from 'next/link';
import { useSystemStatusIndicator, useSystemStatus } from '@/hooks/useSystemStatus';
import { getStatusIndicatorStyles, formatStatusTime } from '@/lib/statusToTone';
import { StatusIcon } from './StatusIcon';
import { IncidentFeedItem } from '@/types/incidents';

export function PortalStatusPill() {
  const { status, loading, hasActiveIncidents } = useSystemStatusIndicator();
  
  if (loading) {
    return (
      <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-surface-2 text-text-muted border border-border-subtle">
        <div className="w-2 h-2 rounded-full bg-surface-2 animate-pulse mr-2" />
        Status
      </div>
    );
  }
  
  const styles = getStatusIndicatorStyles(status);
  
  return (
    <Link 
      href="/status"
      className={`${styles.pill} hover:opacity-80 transition-opacity no-underline`}
      title={`System status: ${status}. Click to view details.`}
    >
      <div className={styles.dot} />
      <span className="ml-2">
        {status === 'operational' ? 'Operational' : 
         status === 'degraded' ? 'Degraded' : 
         'Incident'}
      </span>
      {hasActiveIncidents && (
        <span className="ml-1 px-1 py-0.5 text-xs bg-white/20 rounded">
          !
        </span>
      )}
    </Link>
  );
}

/**
 * Full status card for dashboard/client portal use
 */
export function StatusCard() {
  const { overallStatus, activeIncidents, lastUpdated, loading, error } = useSystemStatus();
  
  if (loading) {
    return (
      <div className="p-4 bg-surface-1 border border-border-subtle rounded-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-surface-2 rounded w-1/3 mb-2" />
          <div className="h-3 bg-surface-2 rounded w-2/3" />
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 bg-surface-1 border border-border-subtle rounded-lg">
        <div className="flex items-center space-x-2 text-text-muted">
          <StatusIcon status="operational" className="w-4 h-4" />
          <span className="text-sm">Status unavailable</span>
        </div>
        <p className="text-xs text-text-muted mt-1">
          Unable to fetch current status
        </p>
      </div>
    );
  }
  
  const styles = getStatusIndicatorStyles(overallStatus);
  
  return (
    <div className="p-4 bg-surface-1 border border-border-subtle rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-white">System Status</h3>
        <Link
          href="/status"
          className="text-xs text-accent-blue hover:text-accent-blue/80 no-underline"
        >
          View Details →
        </Link>
      </div>
      
      <div className="flex items-center space-x-2 mb-2">
        <div className={styles.dot} />
        <span className={`text-sm font-medium ${styles.text}`}>
          {overallStatus === 'operational' ? 'All systems operational' :
           overallStatus === 'degraded' ? 'Some systems degraded' :
           'Service interruption'}
        </span>
      </div>
      
      {activeIncidents.length > 0 && (
        <div className="mt-3 space-y-2">
          <p className="text-xs text-text-muted">
            {activeIncidents.length} active incident{activeIncidents.length !== 1 ? 's' : ''}:
          </p>
          {activeIncidents.slice(0, 2).map((incident: IncidentFeedItem) => (
            <div key={incident.id} className="text-xs text-text-primary">
              • {incident.title}
              {incident.severity && (
                <span className={`ml-2 px-1 py-0.5 rounded text-xs ${
                  incident.severity === 'critical' ? 'bg-accent-red/20 text-accent-red' :
                  incident.severity === 'high' ? 'bg-signal-yellow/20 text-signal-yellow' :
                  incident.severity === 'medium' ? 'bg-accent-amber/20 text-accent-amber' :
                  'bg-signal-soft/20 text-signal-soft'
                }`}>
                  {incident.severity}
                </span>
              )}
            </div>
          ))}
          {activeIncidents.length > 2 && (
            <p className="text-xs text-text-muted">
              +{activeIncidents.length - 2} more incidents
            </p>
          )}
        </div>
      )}
      
      {lastUpdated && (
        <p className="text-xs text-text-muted mt-3">
          Updated {formatStatusTime(lastUpdated)}
        </p>
      )}
    </div>
  );
}