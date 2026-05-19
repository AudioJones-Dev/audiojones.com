'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Plus, RefreshCw, Edit3, Save, X, Package, AlertTriangle, Check, Info } from 'lucide-react';

interface PricingSku {
  id: string;
  billing_sku: string;
  service_id: string;
  tier_id: string;
  active: boolean;
  created_at?: string;
  updated_at: string;
}

export default function AdminPricingPage() {
  const [skus, setSkus] = useState<PricingSku[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [newSku, setNewSku] = useState({
    billing_sku: '',
    service_id: '',
    tier_id: '',
    active: true,
  });

  const [editData, setEditData] = useState({
    billing_sku: '',
    service_id: '',
    tier_id: '',
    active: true,
  });

  const fetchSkus = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/pricing', {
        headers: {
          'admin-key': '',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      if (data.ok) {
        setSkus(data.skus);
      } else {
        throw new Error(data.error || 'Failed to fetch SKUs');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const saveSku = async (skuData: any) => {
    try {
      setSaving(true);

      const response = await fetch('/api/admin/pricing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'admin-key': '',
        },
        body: JSON.stringify(skuData),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      if (result.ok) {
        await fetchSkus(); // Refresh the list
        return true;
      } else {
        throw new Error(result.error || 'Failed to save SKU');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save SKU');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleAddSku = async () => {
    if (!newSku.billing_sku.trim() || !newSku.service_id.trim() || !newSku.tier_id.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    const success = await saveSku(newSku);
    if (success) {
      setNewSku({
        billing_sku: '',
        service_id: '',
        tier_id: '',
        active: true,
      });
      setShowAddForm(false);
    }
  };

  const startEdit = (sku: PricingSku) => {
    setEditData({
      billing_sku: sku.billing_sku,
      service_id: sku.service_id,
      tier_id: sku.tier_id,
      active: sku.active,
    });
    setEditingId(sku.id);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({
      billing_sku: '',
      service_id: '',
      tier_id: '',
      active: true,
    });
  };

  const handleEditSku = async () => {
    if (!editData.billing_sku.trim() || !editData.service_id.trim() || !editData.tier_id.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    const success = await saveSku(editData);
    if (success) {
      setEditingId(null);
    }
  };

  useEffect(() => {
    fetchSkus();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">SKU Manager</h1>
          <p className="text-muted-foreground">Manage pricing SKU mappings and service tiers</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchSkus}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Plus className="h-4 w-4" />
            Add SKU
          </button>
        </div>
      </div>

      {/* Add SKU Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New SKU</CardTitle>
            <CardDescription>Create a new billing SKU mapping</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="block text-sm font-medium mb-1">Billing SKU *</label>
                <input
                  type="text"
                  value={newSku.billing_sku}
                  onChange={(e) => setNewSku({ ...newSku, billing_sku: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  placeholder="e.g. prod_basic_miami"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Service ID *</label>
                <input
                  type="text"
                  value={newSku.service_id}
                  onChange={(e) => setNewSku({ ...newSku, service_id: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                  placeholder="e.g. basic_audio_service"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tier ID *</label>
                <select
                  value={newSku.tier_id}
                  onChange={(e) => setNewSku({ ...newSku, tier_id: e.target.value })}
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">Select tier...</option>
                  <option value="basic">Basic</option>
                  <option value="premium">Premium</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="new-active"
                checked={newSku.active}
                onChange={(e) => setNewSku({ ...newSku, active: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="new-active" className="text-sm">Active</label>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAddSku}
                disabled={saving}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Add SKU'}
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                disabled={saving}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <span>Error loading SKUs: {error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      {!loading && !error && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Total SKUs</p>
                  <p className="text-2xl font-bold">{skus.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Active</p>
                  <p className="text-2xl font-bold">{skus.filter(s => s.active).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <X className="h-4 w-4 text-red-500" />
                <div>
                  <p className="text-sm font-medium">Inactive</p>
                  <p className="text-2xl font-bold">{skus.filter(s => !s.active).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Services</p>
                  <p className="text-2xl font-bold">{new Set(skus.map(s => s.service_id)).size}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* SKUs Table */}
      {!loading && !error && (
        <Card>
          <CardHeader>
            <CardTitle>SKU Mappings</CardTitle>
            <CardDescription>
              {skus.length === 0 ? 'No SKUs configured yet' : `${skus.length} SKU${skus.length === 1 ? '' : 's'} configured`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {skus.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-muted-foreground">No SKUs configured yet</p>
                <p className="text-sm text-muted-foreground mt-1">Add your first SKU to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {skus.map((sku) => (
                  <div key={sku.id} className="border rounded-lg p-4">
                    {editingId === sku.id ? (
                      // Edit Mode
                      <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-3">
                          <div>
                            <label className="block text-sm font-medium mb-1">Billing SKU</label>
                            <input
                              type="text"
                              value={editData.billing_sku}
                              onChange={(e) => setEditData({ ...editData, billing_sku: e.target.value })}
                              className="w-full p-2 border rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Service ID</label>
                            <input
                              type="text"
                              value={editData.service_id}
                              onChange={(e) => setEditData({ ...editData, service_id: e.target.value })}
                              className="w-full p-2 border rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Tier ID</label>
                            <select
                              value={editData.tier_id}
                              onChange={(e) => setEditData({ ...editData, tier_id: e.target.value })}
                              className="w-full p-2 border rounded-lg"
                            >
                              <option value="basic">Basic</option>
                              <option value="premium">Premium</option>
                              <option value="pro">Pro</option>
                              <option value="enterprise">Enterprise</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={`edit-active-${sku.id}`}
                              checked={editData.active}
                              onChange={(e) => setEditData({ ...editData, active: e.target.checked })}
                              className="rounded"
                            />
                            <label htmlFor={`edit-active-${sku.id}`} className="text-sm">Active</label>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={handleEditSku}
                              disabled={saving}
                              className="flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                            >
                              <Save className="h-3 w-3" />
                              {saving ? 'Saving...' : 'Save'}
                            </button>
                            <button
                              onClick={cancelEdit}
                              disabled={saving}
                              className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                              <X className="h-3 w-3" />
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div className="flex items-center justify-between">
                        <div className="grid gap-4 md:grid-cols-4 flex-1">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Billing SKU</p>
                            <code className="text-sm bg-gray-100 px-2 py-1 rounded">{sku.billing_sku}</code>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Service ID</p>
                            <p className="text-sm">{sku.service_id}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Tier ID</p>
                            <Badge variant="secondary">{sku.tier_id}</Badge>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Status</p>
                            <Badge variant={sku.active ? 'default' : 'outline'}>
                              {sku.active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => startEdit(sku)}
                            className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            <Edit3 className="h-3 w-3" />
                            Edit
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="mt-2 text-xs text-gray-500">
                      Updated: {formatDate(sku.updated_at)}
                      {sku.created_at && ` • Created: ${formatDate(sku.created_at)}`}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}