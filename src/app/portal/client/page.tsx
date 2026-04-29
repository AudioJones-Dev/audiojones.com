/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { User, CreditCard, Activity, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ServiceNotices } from '@/components/status/ServiceNotices';
import { DegradedBanner } from '@/components/status/DegradedBanner';
import { useStatusAlerts } from '@/context/SystemStatusProvider';

interface ClientData {
  ok: boolean;
  customer?: {
    email: string;
    status: string;
    billing_sku: string;
    service_id: string;
    tier_id: string;
    created_at: string;
    updated_at: string;
  };
  events?: Array<{
    event_type: string;
    timestamp: string;
    billing_sku?: string;
    status?: string;
  }>;
  error?: string;
}

interface ProfileData {
  email: string;
  name?: string;
  company?: string;
  phone?: string;
  status: string;
}

interface ProfileFormData {
  name: string;
  company: string;
  phone: string;
}

interface ClientEvent {
  type: string;
  received_at: string;
  sku?: string;
  status?: string;
}

interface ClientEventsResponse {
  ok: boolean;
  events: ClientEvent[];
  total: number;
  error?: string;
}

export default function ClientPortalPage() {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Profile editing state
  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [profileForm, setProfileForm] = useState<ProfileFormData>({ name: '', company: '', phone: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Events state
  const [events, setEvents] = useState<ClientEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  
  // Billing state
  const [billingLoading, setBillingLoading] = useState(false);

  const fetchClientData = async () => {
    if (!user) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Get the user's ID token for authentication
      const idToken = await user.getIdToken();
      
      const response = await fetch('/api/client/me', {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const clientData: ClientData = await response.json();
      
      if (clientData.ok) {
        setData(clientData);
        setError(null);
      } else {
        throw new Error(clientData.error || 'Failed to fetch client data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    if (!user) return;

    try {
      setProfileLoading(true);
      const idToken = await user.getIdToken();
      
      const response = await fetch('/api/client/profile', {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      if (result.ok && result.customer) {
        setProfile(result.customer);
        setProfileForm({
          name: result.customer.name || '',
          company: result.customer.company || '',
          phone: result.customer.phone || '',
        });
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setSaveMessage({ type: 'error', text: 'Failed to load profile' });
    } finally {
      setProfileLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!user) return;

    try {
      setProfileSaving(true);
      setSaveMessage(null);
      const idToken = await user.getIdToken();
      
      const response = await fetch('/api/client/profile', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileForm),
      });
      
      const result = await response.json();
      
      if (result.ok && result.customer) {
        setProfile(result.customer);
        setSaveMessage({ type: 'success', text: 'Profile updated successfully!' });
        
        // Clear success message after 3 seconds
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        setSaveMessage({ 
          type: 'error', 
          text: result.error || 'Failed to update profile' 
        });
      }
    } catch (err) {
      console.error('Failed to save profile:', err);
      setSaveMessage({ type: 'error', text: 'Failed to save profile' });
    } finally {
      setProfileSaving(false);
    }
  };

  const fetchEvents = async () => {
    if (!user) return;

    try {
      setEventsLoading(true);
      const idToken = await user.getIdToken();
      
      const response = await fetch('/api/client/events', {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result: ClientEventsResponse = await response.json();
      if (result.ok && result.events) {
        setEvents(result.events);
      }
    } catch (err) {
      console.error('Failed to fetch events:', err);
      setEvents([]);
    } finally {
      setEventsLoading(false);
    }
  };

  const handleBillingPortal = async () => {
    if (!user) return;

    try {
      setBillingLoading(true);
      const idToken = await user.getIdToken();
      
      const response = await fetch('/api/client/billing/portal', {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      const result = await response.json();
      
      if (result.ok && result.portal_url) {
        // Redirect to billing portal
        window.open(result.portal_url, '_blank');
      } else {
        // Show error message
        setSaveMessage({ 
          type: 'error', 
          text: result.message || 'Unable to access billing portal' 
        });
        setTimeout(() => setSaveMessage(null), 5000);
      }
    } catch (err) {
      console.error('Failed to access billing portal:', err);
      setSaveMessage({ 
        type: 'error', 
        text: 'Failed to access billing portal' 
      });
      setTimeout(() => setSaveMessage(null), 5000);
    } finally {
      setBillingLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      if (activeTab === 'overview') {
        fetchClientData();
        fetchEvents();
      } else if (activeTab === 'account') {
        fetchProfile();
      }
    } else if (!authLoading && !user) {
      setError('Please log in to view your client portal');
      setLoading(false);
    }
  }, [authLoading, user, activeTab]);

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Client Portal</h1>
            <p className="text-muted-foreground">Your subscription and account details</p>
          </div>
          
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-lg">Loading your account details...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Client Portal</h1>
            <p className="text-muted-foreground">Your subscription and account details</p>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-red-600">
                <AlertCircle className="h-5 w-5" />
                <div>
                  <p className="font-medium">Failed to load account details</p>
                  <p className="text-sm text-muted-foreground mt-1">{error}</p>
                </div>
              </div>
              <button
                onClick={fetchClientData}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Try Again
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Get status alert data from context
  const { shouldShowBanner, bannerType, primaryIncident, incidentCount } = useStatusAlerts();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Client Portal</h1>
          <p className="text-muted-foreground">Your subscription and account details</p>
        </div>

        {/* Status-aware Banner */}
        {shouldShowBanner && bannerType && (
          <DegradedBanner 
            status={bannerType} 
            incidents={primaryIncident ? [primaryIncident] : []} 
          />
        )}

        {/* Global Messages */}
        {saveMessage && (
          <div className={`p-4 rounded-md ${
            saveMessage.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <div className="flex items-center">
              {saveMessage.type === 'success' ? (
                <div className="h-5 w-5 text-green-400 mr-2">✓</div>
              ) : (
                <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              )}
              <span className="text-sm font-medium">{saveMessage.text}</span>
            </div>
          </div>
        )}

        {/* Service Notices - Only shown when there are active incidents */}
        <ServiceNotices />

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('account')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'account'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Account
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          {/* Account Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-lg font-semibold">{data?.customer?.email ?? '—'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge variant="default" className="mt-1">
                  {data?.customer?.status ?? '—'}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                <p className="text-sm">
                  {data?.customer?.created_at 
                    ? new Date(data.customer.created_at).toLocaleDateString() 
                    : '—'
                  }
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subscription</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Service</p>
                <p className="text-lg font-semibold">{data?.customer?.service_id ?? '—'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tier</p>
                <Badge variant="secondary" className="mt-1">
                  {data?.customer?.tier_id ?? '—'}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Billing SKU</p>
                <p className="text-sm">{data?.customer?.billing_sku ?? '—'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                <p className="text-sm">
                  {data?.customer?.updated_at 
                    ? new Date(data.customer.updated_at).toLocaleDateString() 
                    : '—'
                  }
                </p>
              </div>
              
              {/* Manage Billing Button */}
              <div className="pt-3 border-t">
                <button
                  onClick={handleBillingPortal}
                  disabled={billingLoading}
                  className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {billingLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {billingLoading ? 'Loading...' : 'Manage Billing'}
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Activity Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {eventsLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span className="text-sm text-muted-foreground">Loading activity...</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {events && events.length > 0 ? (
                    events.slice(0, 5).map((event, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                        <div>
                          <p className="text-sm font-medium capitalize">
                            {event.type.replace(/_/g, ' ')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(event.received_at).toLocaleString()}
                          </p>
                          {event.sku && (
                            <p className="text-xs text-gray-400">{event.sku}</p>
                          )}
                        </div>
                        {event.status && (
                          <Badge variant="outline" className="text-xs capitalize">
                            {event.status}
                          </Badge>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No recent activity</p>
                  )}
                  
                  {events && events.length > 5 && (
                    <div className="pt-2 text-center">
                      <p className="text-xs text-muted-foreground">
                        Showing 5 of {events.length} recent events
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          </div>
        )}

        {activeTab === 'account' && (
          <div className="max-w-2xl">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Update your profile information and contact details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {profileLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="ml-2">Loading profile...</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Email (read-only) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profile?.email || user?.email || ''}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your full name"
                      />
                    </div>

                    {/* Company */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company
                      </label>
                      <input
                        type="text"
                        value={profileForm.company}
                        onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your company name"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your phone number"
                      />
                    </div>

                    {/* Save Button */}
                    <div className="flex items-center justify-between pt-4">
                      <button
                        onClick={saveProfile}
                        disabled={profileSaving}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {profileSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                        {profileSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                      
                      {saveMessage && (
                        <div className={`text-sm ${
                          saveMessage.type === 'success' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {saveMessage.text}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}