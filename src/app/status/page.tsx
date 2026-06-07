/**
 * Public Status Page
 * 
 * Public-facing status page that shows current system health and incidents.
 * No authentication required - safe for public consumption.
 */

import Link from 'next/link';
import { fetchPublicIncidents, getSystemStatus, getRecentIncidents } from '@/lib/publicIncidents';
import StatusWidget, { StatusBar } from '@/components/status/StatusWidget';
import { IncidentFeedItem } from '@/types/incidents';

// This is a server component - fetch data at build/request time
export default async function StatusPage() {
  // Fetch incidents from our existing API endpoint
  const incidents = await fetchPublicIncidents({
    limit: 50, // Get more for recent incidents display
    baseUrl: process.env.NODE_ENV === 'production' 
      ? 'https://audiojones.com' 
      : 'http://localhost:3000'
  });
  
  const systemStatus = getSystemStatus(incidents);
  
  // Split incidents by status
  const activeIncidents = incidents.filter(incident => 
    incident.status === 'open' || 
    incident.status === 'investigating' || 
    incident.status === 'monitoring'
  );
  
  const recentIncidents = getRecentIncidents(incidents, 7)
    .sort((a, b) => {
      const timeA = new Date(b.updated_at || b.started_at || '');
      const timeB = new Date(a.updated_at || a.started_at || '');
      return timeA.getTime() - timeB.getTime();
    })
    .slice(0, 10);

  return (
    <div className="bg-black min-h-screen">
      {/* Status Bar at top */}
      <div className="border-b border-border-subtle">
        <StatusBar incidents={incidents} />
      </div>
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            System Status
          </h1>
          <p className="text-text-muted text-lg">
            Current operational status of Audio Jones services
          </p>
        </div>
        
        {/* Main Status Widget */}
        <div className="mb-12">
          <StatusWidget 
            incidents={incidents}
            title="Current Status"
            showDescription={true}
            maxIncidents={5}
          />
        </div>
        
        {/* Active Incidents Section */}
        {activeIncidents.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">
              Active Incidents
            </h2>
            <div className="space-y-4">
              {activeIncidents.map((incident) => (
                <IncidentCard key={incident.id} incident={incident} />
              ))}
            </div>
          </div>
        )}
        
        {/* Recent Incidents Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">
            Recent Activity
            <span className="text-sm font-normal text-text-muted ml-3">
              (Last 7 days)
            </span>
          </h2>
          
          {recentIncidents.length > 0 ? (
            <div className="space-y-4">
              {recentIncidents.map((incident) => (
                <IncidentCard 
                  key={incident.id} 
                  incident={incident} 
                  compact={true}
                />
              ))}
            </div>
          ) : (
            <div className="bg-surface-1 border border-border-subtle rounded-lg p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent-green/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                No Recent Incidents
              </h3>
              <p className="text-text-muted">
                All systems have been running smoothly
              </p>
            </div>
          )}
        </div>
        
        {/* System Components Status */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">
            Service Components
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ComponentStatus name="API Services" status="operational" />
            <ComponentStatus name="Web Application" status="operational" />
            <ComponentStatus name="Database" status="operational" />
            <ComponentStatus name="File Storage" status="operational" />
            <ComponentStatus name="Authentication" status="operational" />
            <ComponentStatus name="Webhooks" status="operational" />
          </div>
        </div>
        
        {/* Footer Info */}
        <div className="text-center text-text-muted text-sm border-t border-border-subtle pt-8">
          <p className="mb-2">
            Status page automatically updated every 5 minutes
          </p>
          <p className="mb-4">
            Last updated: {new Date().toLocaleString()}
          </p>
          <div className="flex justify-center space-x-6">
            <a
              href="/api/incidents"
              className="text-accent-blue hover:text-accent-blue/80 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              JSON Feed
            </a>
            <a
              href="mailto:support@audiojones.com"
              className="text-accent-blue hover:text-accent-blue/80 transition-colors"
            >
              Contact Support
            </a>
            <Link
              href="/"
              className="text-accent-blue hover:text-accent-blue/80 transition-colors"
            >
              Return to Main Site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Individual incident card component
 */
function IncidentCard({ incident, compact = false }: { 
  incident: IncidentFeedItem; 
  compact?: boolean;
}) {
  const statusColors = {
    open: 'bg-accent-red/15 border-accent-red/50 text-accent-red',
    investigating: 'bg-accent-amber/15 border-accent-amber/50 text-accent-amber',
    monitoring: 'bg-accent-blue/15 border-accent-blue/50 text-accent-blue',
    resolved: 'bg-accent-green/15 border-accent-green/50 text-accent-green',
  };

  const statusBadgeColors = {
    open: 'bg-accent-red/20 text-accent-red border-accent-red/40',
    investigating: 'bg-accent-amber/20 text-accent-amber border-accent-amber/40',
    monitoring: 'bg-accent-blue/20 text-accent-blue border-accent-blue/40',
    resolved: 'bg-accent-green/20 text-accent-green border-accent-green/40',
  };

  const severityColors = {
    critical: 'bg-accent-red/20 text-accent-red',
    high: 'bg-signal-yellow/20 text-signal-yellow',
    medium: 'bg-accent-amber/20 text-accent-amber',
    low: 'bg-signal-soft/20 text-signal-soft',
  };

  return (
    <div className={`bg-surface-1 border rounded-lg p-6 ${statusColors[incident.status]}`}>
      <div className="flex items-start justify-between mb-4">
        <h3 className={`font-semibold ${compact ? 'text-lg' : 'text-xl'} text-white`}>
          {incident.title}
        </h3>
        <div className="flex gap-2 ml-4">
          {incident.severity && (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${severityColors[incident.severity]}`}>
              {incident.severity.toUpperCase()}
            </span>
          )}
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusBadgeColors[incident.status]}`}>
            {incident.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>
      
      {incident.short_description && !compact && (
        <p className="text-text-primary mb-4">
          {incident.short_description}
        </p>
      )}
      
      <div className="flex items-center justify-between text-sm text-text-muted">
        <span>
          Started: {incident.started_at ? new Date(incident.started_at).toLocaleString() : 'Unknown'}
        </span>
        <span>
          Updated: {incident.updated_at ? new Date(incident.updated_at).toLocaleString() : 'Unknown'}
        </span>
      </div>
      
      {incident.affected_components && incident.affected_components.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border-subtle">
          <span className="text-sm text-text-muted">Affected components: </span>
          <div className="flex flex-wrap gap-2 mt-2">
            {incident.affected_components.map((component, index) => (
              <span 
                key={index}
                className="inline-flex items-center px-2 py-1 rounded bg-surface-2 text-text-primary text-xs"
              >
                {component}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Component status indicator
 */
function ComponentStatus({ name, status }: { 
  name: string; 
  status: 'operational' | 'degraded' | 'outage'; 
}) {
  const statusConfig = {
    operational: {
      color: 'bg-accent-green/15 border-accent-green/50',
      indicator: 'bg-accent-green',
      text: 'Operational'
    },
    degraded: {
      color: 'bg-accent-amber/15 border-accent-amber/50',
      indicator: 'bg-accent-amber',
      text: 'Degraded'
    },
    outage: {
      color: 'bg-accent-red/15 border-accent-red/50',
      indicator: 'bg-accent-red',
      text: 'Outage'
    }
  };
  
  const config = statusConfig[status];
  
  return (
    <div className={`p-4 rounded-lg border ${config.color}`}>
      <div className="flex items-center justify-between">
        <span className="text-white font-medium">{name}</span>
        <div className="flex items-center">
          <div className={`w-2 h-2 rounded-full mr-2 ${config.indicator}`} />
          <span className="text-sm text-text-muted">{config.text}</span>
        </div>
      </div>
    </div>
  );
}

// Enable ISR for this page - revalidate every 5 minutes
export const revalidate = 300;