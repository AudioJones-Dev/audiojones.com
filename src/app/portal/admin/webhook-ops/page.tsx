'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { 
  RefreshCw, 
  Activity, 
  Send, 
  Shield, 
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface WebhookItem {
  id: string;
  created_at?: string;
  seen_at?: string;
  expires_at?: string;
  event?: string;
  source?: string;
  url?: string;
  status?: string;
  status_code?: number;
  verified?: boolean;
  signature_valid?: boolean;
  error?: string;
  failure_reason?: string;
  event_id?: string;
  is_expired?: boolean;
  retry_count?: number;
  response_time_ms?: number;
}

interface WebhookData {
  inbound: WebhookItem[];
  outbound: WebhookItem[];
  idempotency: WebhookItem[];
  failures: WebhookItem[];
  loading: boolean;
  lastRefresh?: string;
}

export default function WebhookOpsPage() {
  const { user } = useAuth();
  const [data, setData] = useState<WebhookData>({
    inbound: [],
    outbound: [],
    idempotency: [],
    failures: [],
    loading: true
  });

  const fetchWebhookData = async () => {
    if (!user) return;

    setData(prev => ({ ...prev, loading: true }));

    try {
      const token = await user.getIdToken();
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const [inboundRes, outboundRes, idempotencyRes, failuresRes] = await Promise.all([
        fetch('/api/admin/webhooks/inbound', { headers }),
        fetch('/api/admin/webhooks/outbound', { headers }),
        fetch('/api/admin/webhooks/idempotency', { headers }),
        fetch('/api/admin/webhooks/failures', { headers })
      ]);

      const [inbound, outbound, idempotency, failures] = await Promise.all([
        inboundRes.json(),
        outboundRes.json(),
        idempotencyRes.json(),
        failuresRes.json()
      ]);

      setData({
        inbound: inbound.items || [],
        outbound: outbound.items || [],
        idempotency: idempotency.items || [],
        failures: failures.items || [],
        loading: false,
        lastRefresh: new Date().toLocaleString()
      });

    } catch (error) {
      console.error('Failed to fetch webhook data:', error);
      setData(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchWebhookData();
  }, [user]);

  const formatTime = (timestamp?: string) => {
    if (!timestamp) return 'Unknown';
    try {
      return new Date(timestamp).toLocaleString();
    } catch {
      return 'Invalid date';
    }
  };

  const getStatusBadge = (item: WebhookItem) => {
    if (item.status_code !== undefined) {
      // Outbound delivery
      if (item.status_code >= 400) {
        return <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-900/30 text-red-400 rounded-full">
          <XCircle className="w-3 h-3 mr-1" />
          Failed ({item.status_code})
        </span>;
      } else if (item.status_code >= 200) {
        return <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-900/30 text-green-400 rounded-full">
          <CheckCircle className="w-3 h-3 mr-1" />
          Success
        </span>;
      }
    }

    if (item.verified === false || item.signature_valid === false) {
      return <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-900/30 text-red-400 rounded-full">
        <XCircle className="w-3 h-3 mr-1" />
        Invalid
      </span>;
    }

    if (item.is_expired) {
      return <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-900/30 text-yellow-400 rounded-full">
        <Clock className="w-3 h-3 mr-1" />
        Expired
      </span>;
    }

    return <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-900/30 text-text-muted rounded-full">
      <AlertCircle className="w-3 h-3 mr-1" />
      Unknown
    </span>;
  };

  const CardTable = ({ 
    title, 
    icon: Icon, 
    items, 
    emptyMessage,
    columns 
  }: {
    title: string;
    icon: any;
    items: WebhookItem[];
    emptyMessage: string;
    columns: { key: string; label: string; render?: (item: WebhookItem) => React.ReactNode }[];
  }) => (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5 text-blue-400" />
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <span className="text-sm text-text-muted">({items.length})</span>
      </div>
      
      {items.length === 0 ? (
        <div className="text-center py-8 text-text-muted">
          {emptyMessage}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                {columns.map(col => (
                  <th key={col.key} className="text-left py-2 text-text-muted font-medium">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item.id || idx} className="border-b border-gray-800 hover:bg-gray-800/50">
                  {columns.map(col => (
                    <td key={col.key} className="py-2 text-text-primary">
                      {col.render ? col.render(item) : (item as any)[col.key] || 'N/A'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Webhook Operations</h1>
          <p className="text-text-muted mt-1">
            Monitor inbound webhooks, outbound deliveries, and system health
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {data.lastRefresh && (
            <span className="text-sm text-text-muted">
              Last refresh: {data.lastRefresh}
            </span>
          )}
          <button
            onClick={fetchWebhookData}
            disabled={data.loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium"
          >
            <RefreshCw className={`w-4 h-4 ${data.loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inbound Webhooks */}
        <CardTable
          title="Inbound Webhooks"
          icon={Activity}
          items={data.inbound}
          emptyMessage="No inbound webhooks yet"
          columns={[
            { key: 'created_at', label: 'Time', render: (item) => formatTime(item.created_at) },
            { key: 'source', label: 'Source' },
            { key: 'event', label: 'Event' },
            { key: 'status', label: 'Status', render: (item) => getStatusBadge(item) }
          ]}
        />

        {/* Outbound Deliveries */}
        <CardTable
          title="Outbound Deliveries"
          icon={Send}
          items={data.outbound}
          emptyMessage="No outbound deliveries yet"
          columns={[
            { key: 'created_at', label: 'Time', render: (item) => formatTime(item.created_at) },
            { key: 'url', label: 'Target', render: (item) => (
              <span className="font-mono text-xs">{item.url?.replace(/^https?:\/\//, '') || 'N/A'}</span>
            )},
            { key: 'event', label: 'Event' },
            { key: 'status', label: 'Status', render: (item) => getStatusBadge(item) }
          ]}
        />

        {/* Idempotency Records */}
        <CardTable
          title="Idempotency Records"
          icon={Shield}
          items={data.idempotency}
          emptyMessage="No idempotency records yet"
          columns={[
            { key: 'seen_at', label: 'Seen At', render: (item) => formatTime(item.seen_at) },
            { key: 'event_id', label: 'Event ID', render: (item) => (
              <span className="font-mono text-xs">{item.event_id?.substring(0, 12)}...</span>
            )},
            { key: 'expires_at', label: 'Expires', render: (item) => formatTime(item.expires_at) },
            { key: 'status', label: 'Status', render: (item) => getStatusBadge(item) }
          ]}
        />

        {/* Validation Failures */}
        <CardTable
          title="Validation Failures"
          icon={AlertTriangle}
          items={data.failures}
          emptyMessage="No validation failures"
          columns={[
            { key: 'created_at', label: 'Time', render: (item) => formatTime(item.created_at) },
            { key: 'source', label: 'Source' },
            { key: 'event', label: 'Event' },
            { key: 'failure_reason', label: 'Reason', render: (item) => (
              <span className="text-red-400 text-xs">{item.failure_reason || item.error || 'Unknown'}</span>
            )}
          ]}
        />
      </div>

      {data.loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 flex items-center gap-3">
            <RefreshCw className="w-5 h-5 animate-spin text-blue-400" />
            <span className="text-white">Loading webhook data...</span>
          </div>
        </div>
      )}
    </div>
  );
}