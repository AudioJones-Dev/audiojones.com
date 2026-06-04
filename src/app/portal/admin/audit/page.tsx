'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/Toast';
import { Clock, Filter, User, Mail, Activity, RefreshCw, Eye, ChevronDown } from 'lucide-react';

interface AuditLog {
  id: string;
  action: string;
  actor: string;
  target_email: string;
  payload: any;
  created_at: string;
}

interface AuditStats {
  total: number;
  action_counts: Record<string, number>;
  recent_24h: number;
}

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<AuditStats>({
    total: 0,
    action_counts: {},
    recent_24h: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [selectedTarget, setSelectedTarget] = useState<string>('');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  
  const { show: showToast } = useToast();

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (selectedAction) params.append('action', selectedAction);
      if (selectedTarget) params.append('target', selectedTarget);
      
      const response = await fetch(`/api/admin/audit?${params}`, {
        headers: {
          'admin-key': 'gGho3TE8ztiSAMvORfyCDem62Fk0xpW1'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs);
        setStats(data.stats);
      } else {
        showToast({ description: 'Failed to load audit logs', variant: 'error' });
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      showToast({ description: 'Error loading audit logs', variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, [selectedAction, selectedTarget]);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getActionBadgeVariant = (action: string) => {
    switch (action) {
      case 'customer_update': return 'default';
      case 'pricing_create':
      case 'pricing_update': return 'secondary';
      case 'webhook_replay': return 'outline';
      case 'note_create':
      case 'note_update': return 'default';
      case 'alert_create': return 'outline'; // Changed from destructive
      default: return 'outline';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'customer_update': return <User className="h-4 w-4" />;
      case 'pricing_create':
      case 'pricing_update': return <Activity className="h-4 w-4" />;
      case 'webhook_replay': return <RefreshCw className="h-4 w-4" />;
      case 'note_create':
      case 'note_update': return <Eye className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const toggleRowExpanded = (id: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const uniqueActions = Object.keys(stats.action_counts);
  const uniqueTargets = [...new Set(logs.map(log => log.target_email))];

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="h-6 w-6 animate-spin" />
          <span>Loading audit logs...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Admin Audit Log</h1>
          <p className="text-text-muted mt-1">Track all administrative actions and changes</p>
        </div>
        <button 
          onClick={fetchAuditLogs}
          className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors text-sm"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-400" />
            <div>
              <p className="text-sm text-text-muted">Total Actions</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-green-400" />
            <div>
              <p className="text-sm text-text-muted">Last 24 Hours</p>
              <p className="text-2xl font-bold">{stats.recent_24h}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-purple-400" />
            <div>
              <p className="text-sm text-text-muted">Customers</p>
              <p className="text-2xl font-bold">{stats.action_counts.customer_update || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-orange-400" />
            <div>
              <p className="text-sm text-text-muted">Replays</p>
              <p className="text-2xl font-bold">{stats.action_counts.webhook_replay || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-text-muted" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded px-3 py-1 text-sm"
            >
              <option value="">All Actions</option>
              {uniqueActions.map(action => (
                <option key={action} value={action}>
                  {action.replace('_', ' ')} ({stats.action_counts[action]})
                </option>
              ))}
            </select>
            
            <select
              value={selectedTarget}
              onChange={(e) => setSelectedTarget(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded px-3 py-1 text-sm"
            >
              <option value="">All Targets</option>
              {uniqueTargets.slice(0, 20).map(target => (
                <option key={target} value={target}>
                  {target}
                </option>
              ))}
            </select>
          </div>
          
          {(selectedAction || selectedTarget) && (
            <button
              onClick={() => {
                setSelectedAction('');
                setSelectedTarget('');
              }}
              className="px-3 py-1 bg-gray-800 border border-gray-600 rounded hover:bg-gray-700 transition-colors text-sm"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-gray-900 rounded-lg border border-gray-700">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Audit Trail</h2>
          <p className="text-sm text-text-muted">
            Showing {logs.length} of {stats.total} total actions
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left p-4 font-medium text-text-primary">Action</th>
                <th className="text-left p-4 font-medium text-text-primary">Target</th>
                <th className="text-left p-4 font-medium text-text-primary">Actor</th>
                <th className="text-left p-4 font-medium text-text-primary">Timestamp</th>
                <th className="text-left p-4 font-medium text-text-primary">Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <>
                  <tr key={log.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Badge variant={getActionBadgeVariant(log.action)} className="flex items-center gap-1">
                          {getActionIcon(log.action)}
                          {log.action.replace('_', ' ')}
                        </Badge>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-text-muted" />
                        <span className="text-sm">{log.target_email}</span>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-text-muted" />
                        <Badge variant="outline" className="text-xs">
                          {log.actor}
                        </Badge>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-text-muted" />
                          {formatTimestamp(log.created_at)}
                        </div>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <button
                        onClick={() => toggleRowExpanded(log.id)}
                        className="flex items-center gap-1 px-2 py-1 text-xs hover:bg-gray-700 rounded transition-colors"
                      >
                        <ChevronDown 
                          className={`h-3 w-3 transition-transform ${
                            expandedRows.has(log.id) ? 'rotate-180' : ''
                          }`} 
                        />
                        {expandedRows.has(log.id) ? 'Hide' : 'Show'} Details
                      </button>
                    </td>
                  </tr>
                  
                  {expandedRows.has(log.id) && (
                    <tr className="bg-gray-800/30">
                      <td colSpan={5} className="p-4">
                        <div className="bg-gray-800 rounded p-3">
                          <h4 className="text-sm font-medium mb-2">Payload Details:</h4>
                          <pre className="text-xs text-text-primary overflow-x-auto">
                            {JSON.stringify(log.payload, null, 2)}
                          </pre>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
          
          {logs.length === 0 && (
            <div className="p-8 text-center text-text-muted">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No audit logs found</p>
              <p className="text-sm">
                {selectedAction || selectedTarget 
                  ? 'Try adjusting your filters' 
                  : 'Logs will appear here as admin actions are performed'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}