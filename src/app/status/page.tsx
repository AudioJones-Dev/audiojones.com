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
      <div className="border-b border-gray-800">
        <StatusBar incidents={incidents} />
      </div>
      
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            System Status
          </h1>
          <p className="text-gray-400 text-lg">
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
            <span className="text-sm font-normal text-gray-400 ml-3">
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
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-900/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">
                No Recent Incidents
              </h3>
              <p className="text-gray-400">
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
        <div className="text-center text-gray-500 text-sm border-t border-gray-800 pt-8">
          <p className="mb-2">
            Status page automatically updated every 5 minutes
          </p>
          <p className="mb-4">
            Last updated: {new Date().toLocaleString()}
          </p>
          <div className="flex justify-center space-x-6">
            <a 
              href="/api/incidents" 
              className="text-blue-400 hover:text-blue-300 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              JSON Feed
            </a>
            <a 
              href="mailto:support@audiojones.com" 
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Contact Support
            </a>
            <Link
              href="/"
              className="text-blue-400 hover:text-blue-300 transition-colors"
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
    open: 'bg-red-900/20 border-red-800 text-red-200',
    investigating: 'bg-amber-900/20 border-amber-800 text-amber-200',
    monitoring: 'bg-blue-900/20 border-blue-800 text-blue-200',
    resolved: 'bg-green-900/20 border-green-800 text-green-200',
  };
  
  const statusBadgeColors = {
    open: 'bg-red-900 text-red-200 border-red-700',
    investigating: 'bg-amber-900 text-amber-200 border-amber-700',
    monitoring: 'bg-blue-900 text-blue-200 border-blue-700',
    resolved: 'bg-green-900 text-green-200 border-green-700',
  };

  const severityColors = {
    critical: 'bg-red-900 text-red-200',
    high: 'bg-orange-900 text-orange-200',
    medium: 'bg-amber-900 text-amber-200',
    low: 'bg-yellow-900 text-yellow-200',
  };

  return (
    <div className={`bg-gray-900 border rounded-lg p-6 ${statusColors[incident.status]}`}>
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
        <p className="text-gray-300 mb-4">
          {incident.short_description}
        </p>
      )}
      
      <div className="flex items-center justify-between text-sm text-gray-400">
        <span>
          Started: {incident.started_at ? new Date(incident.started_at).toLocaleString() : 'Unknown'}
        </span>
        <span>
          Updated: {incident.updated_at ? new Date(incident.updated_at).toLocaleString() : 'Unknown'}
        </span>
      </div>
      
      {incident.affected_components && incident.affected_components.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <span className="text-sm text-gray-400">Affected components: </span>
          <div className="flex flex-wrap gap-2 mt-2">
            {incident.affected_components.map((component, index) => (
              <span 
                key={index}
                className="inline-flex items-center px-2 py-1 rounded bg-gray-800 text-gray-300 text-xs"
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
      color: 'bg-green-900/20 border-green-800',
      indicator: 'bg-green-400',
      text: 'Operational'
    },
    degraded: {
      color: 'bg-amber-900/20 border-amber-800',
      indicator: 'bg-amber-400',
      text: 'Degraded'
    },
    outage: {
      color: 'bg-red-900/20 border-red-800',
      indicator: 'bg-red-400',
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
          <span className="text-sm text-gray-300">{config.text}</span>
        </div>
      </div>
    </div>
  );
}

// Enable ISR for this page - revalidate every 5 minutes
export const revalidate = 300;