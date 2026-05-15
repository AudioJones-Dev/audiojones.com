'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ArrowLeft, Calendar, Package, User, AlertCircle, RefreshCw, MessageSquare, Plus, Edit3, Save, X } from 'lucide-react';

interface Customer {
  email: string;
  status: string;
  billing_sku?: string;
  service_id?: string;
  tier_id?: string;
  updated_at: string;
}

interface SubscriptionEvent {
  id: string;
  event_type: string;
  customer_email: string;
  whop_user_id?: string;
  tier?: string;
  timestamp: string;
  processed_at: string;
  raw_data?: any;
}

interface CustomerNote {
  id: string;
  message: string;
  created_at: string;
  created_by: string;
}

interface CustomerDetailResponse {
  ok: boolean;
  customer: Customer | null;
  events: SubscriptionEvent[];
  notes: CustomerNote[];
  error?: string;
}

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const email = decodeURIComponent(params.email as string);
  
  const [data, setData] = useState<CustomerDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  
  // Edit customer state
  const [isEditing, setIsEditing] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editData, setEditData] = useState({
    status: '',
    billing_sku: '',
    service_id: '',
    tier_id: '',
  });

  const fetchCustomerDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/_proxy/admin/customers/${encodeURIComponent(email)}`, {
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result: CustomerDetailResponse = await response.json();
      setData(result);
      setError(null);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const addNote = async () => {
    if (!newNote.trim() || addingNote) return;
    
    try {
      setAddingNote(true);
      const response = await fetch(`/api/_proxy/admin/customers/${encodeURIComponent(email)}/note`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: newNote.trim() }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      if (result.ok) {
        setNewNote('');
        // Refresh customer data to get updated notes
        await fetchCustomerDetail();
      } else {
        throw new Error(result.error || 'Failed to add note');
      }
    } catch (err) {
      console.error('Error adding note:', err);
      alert(err instanceof Error ? err.message : 'Failed to add note');
    } finally {
      setAddingNote(false);
    }
  };

  const startEdit = () => {
    if (data?.customer) {
      setEditData({
        status: data.customer.status || '',
        billing_sku: data.customer.billing_sku || '',
        service_id: data.customer.service_id || '',
        tier_id: data.customer.tier_id || '',
      });
      setIsEditing(true);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditData({
      status: '',
      billing_sku: '',
      service_id: '',
      tier_id: '',
    });
  };

  const saveCustomer = async () => {
    if (!data?.customer || editLoading) return;

    try {
      setEditLoading(true);
      
      // Only send fields that have changed
      const updates: any = {};
      if (editData.status !== data.customer.status) {
        updates.status = editData.status;
      }
      if (editData.billing_sku !== (data.customer.billing_sku || '')) {
        updates.billing_sku = editData.billing_sku;
      }
      if (editData.service_id !== (data.customer.service_id || '')) {
        updates.service_id = editData.service_id;
      }
      if (editData.tier_id !== (data.customer.tier_id || '')) {
        updates.tier_id = editData.tier_id;
      }

      if (Object.keys(updates).length === 0) {
        setIsEditing(false);
        return;
      }

      const response = await fetch(`/api/_proxy/admin/customers/${encodeURIComponent(email)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      if (result.ok) {
        setIsEditing(false);
        // Refresh customer data to show updates
        await fetchCustomerDetail();
        alert('Customer updated successfully!');
      } else {
        throw new Error(result.error || 'Failed to update customer');
      }
    } catch (err) {
      console.error('Error updating customer:', err);
      alert(err instanceof Error ? err.message : 'Failed to update customer');
    } finally {
      setEditLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerDetail();
  }, [email]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'default';
      case 'cancelled':
      case 'inactive':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getEventTypeColor = (eventType: string) => {
    switch (eventType) {
      case 'subscription.created':
        return 'text-green-600';
      case 'subscription.cancelled':
        return 'text-red-600';
      case 'payment.succeeded':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <div className="h-8 w-64 bg-gray-200 animate-pulse rounded" />
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="h-6 w-32 bg-gray-200 animate-pulse rounded" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
                  <div className="h-4 w-32 bg-gray-200 animate-pulse rounded" />
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="h-6 w-40 bg-gray-200 animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-32 w-full bg-gray-200 animate-pulse rounded" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-red-600">Error Loading Customer</h1>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="font-medium text-red-600">Failed to load customer details</p>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
              <button
                onClick={fetchCustomerDetail}
                className="mt-4 flex items-center gap-2 mx-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <RefreshCw className="h-4 w-4" />
                Retry
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data?.customer) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <h1 className="text-2xl font-bold">Customer Not Found</h1>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="font-medium">Customer not found</p>
              <p className="text-sm text-muted-foreground mt-1">
                No customer with email "{email}" exists in the database.
              </p>
              <button
                onClick={() => router.push('/portal/admin/customers')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Back to Customers
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { customer, events } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <h1 className="text-2xl font-bold">{customer.email}</h1>
          <Badge variant={getStatusBadgeVariant(customer.status)}>
            {customer.status}
          </Badge>
        </div>
        <button
          onClick={fetchCustomerDetail}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2">
        {/* Customer Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </div>
              {!isEditing ? (
                <button
                  onClick={startEdit}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  <Edit3 className="h-3 w-3" />
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={saveCustomer}
                    disabled={editLoading}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    <Save className="h-3 w-3" />
                    {editLoading ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={cancelEdit}
                    disabled={editLoading}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
                  >
                    <X className="h-3 w-3" />
                    Cancel
                  </button>
                </div>
              )}
            </CardTitle>
            <CardDescription>Core customer data and subscription details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Email:</span>
              <span className="text-muted-foreground">{customer.email}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-medium">Status:</span>
              {isEditing ? (
                <select
                  value={editData.status}
                  onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                  className="px-2 py-1 border rounded text-sm"
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="canceled">Canceled</option>
                  <option value="payment_failed">Payment Failed</option>
                </select>
              ) : (
                <Badge variant={getStatusBadgeVariant(customer.status)}>
                  {customer.status}
                </Badge>
              )}
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium">Billing SKU:</span>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.billing_sku}
                  onChange={(e) => setEditData({ ...editData, billing_sku: e.target.value })}
                  className="px-2 py-1 border rounded text-sm w-48"
                  placeholder="e.g. prod_basic_miami"
                />
              ) : (
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                  {customer.billing_sku || 'Not set'}
                </code>
              )}
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium">Service ID:</span>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.service_id}
                  onChange={(e) => setEditData({ ...editData, service_id: e.target.value })}
                  className="px-2 py-1 border rounded text-sm w-48"
                  placeholder="e.g. basic_audio_service"
                />
              ) : (
                <span className="text-muted-foreground">{customer.service_id || 'Not set'}</span>
              )}
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium">Tier ID:</span>
              {isEditing ? (
                <select
                  value={editData.tier_id}
                  onChange={(e) => setEditData({ ...editData, tier_id: e.target.value })}
                  className="px-2 py-1 border rounded text-sm"
                >
                  <option value="">Select tier...</option>
                  <option value="basic">Basic</option>
                  <option value="premium">Premium</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              ) : (
                <span className="text-muted-foreground">{customer.tier_id || 'Not set'}</span>
              )}
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium">Last Updated:</span>
              <span className="text-muted-foreground">
                {formatDate(customer.updated_at)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Timeline Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Activity Summary
            </CardTitle>
            <CardDescription>Recent webhook events and activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Total Events:</span>
                <span className="text-2xl font-bold">{events.length}</span>
              </div>
              
              {events.length > 0 && (
                <>
                  <div className="flex justify-between">
                    <span className="font-medium">Latest Event:</span>
                    <span className={`font-medium ${getEventTypeColor(events[0].event_type)}`}>
                      {events[0].event_type}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-medium">Last Activity:</span>
                    <span className="text-muted-foreground">
                      {formatDate(events[0].timestamp)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notes Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Admin Notes
            </CardTitle>
            <CardDescription>Internal notes and comments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Note Form */}
            <div className="space-y-2">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add a note about this customer..."
                className="w-full min-h-[80px] p-3 border rounded-lg resize-none text-sm"
                disabled={addingNote}
              />
              <button
                onClick={addNote}
                disabled={!newNote.trim() || addingNote}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <Plus className="h-4 w-4" />
                {addingNote ? 'Adding...' : 'Add Note'}
              </button>
            </div>

            {/* Notes List */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {data?.notes && data.notes.length > 0 ? (
                data.notes.map((note) => (
                  <div key={note.id} className="p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                    <p className="text-sm text-gray-800 mb-2">{note.message}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>by {note.created_by}</span>
                      <span>{formatDate(note.created_at)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No notes yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Event Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Event Timeline
          </CardTitle>
          <CardDescription>
            All subscription events for this customer, ordered by most recent
          </CardDescription>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No events found for this customer</p>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                  </div>
                  
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-medium ${getEventTypeColor(event.event_type)}`}>
                        {event.event_type}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(event.timestamp)}
                      </span>
                    </div>
                    
                    <div className="text-sm text-muted-foreground space-y-1">
                      {event.whop_user_id && (
                        <div>Whop User: {event.whop_user_id}</div>
                      )}
                      {event.tier && (
                        <div>Tier: {event.tier}</div>
                      )}
                      <div>Processed: {formatDate(event.processed_at)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}