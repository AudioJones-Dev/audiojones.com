'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';

interface BillingInfo {
  subscription: {
    status: 'active' | 'past_due' | 'canceled' | 'trial';
    plan: string;
    amount: number;
    currency: string;
    nextBilling: string;
    daysOverdue?: number;
  };
  paymentMethod: {
    type: string;
    last4?: string;
    brand?: string;
    expiryMonth?: number;
    expiryYear?: number;
  };
  invoices: Array<{
    id: string;
    date: string;
    amount: number;
    status: 'paid' | 'pending' | 'failed';
    downloadUrl?: string;
  }>;
  usage?: {
    current: number;
    limit: number;
    period: string;
  };
}

export default function BillingPage() {
  const { user } = useAuth();
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBillingInfo = async () => {
      if (!user) return;

      try {
        const token = await user.getIdToken();
        const response = await fetch('/api/portal/billing', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setBillingInfo(data);
        }
      } catch (error) {
        console.error('Failed to fetch billing info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBillingInfo();
  }, [user]);

  const openStripePortal = async () => {
    if (!user) return;

    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          return_url: window.location.href,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Failed to open Stripe portal:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'trial': return 'bg-blue-100 text-blue-800';
      case 'past_due': return 'bg-yellow-100 text-yellow-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-700 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-700 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Billing & Subscription</h1>
        <p className="mt-2 text-text-muted">
          Manage your subscription, payments, and billing history
        </p>
      </div>

      {/* Billing Alert */}
      {billingInfo?.subscription.status === 'past_due' && (
        <div className="rounded-lg border border-red-600 bg-red-900/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-red-400">Payment Overdue</h3>
              <p className="text-red-300 mt-1">
                Your payment is {billingInfo.subscription.daysOverdue} days overdue. 
                Please update your payment method to avoid service interruption.
              </p>
            </div>
            <button
              onClick={openStripePortal}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition"
            >
              Update Payment
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subscription Details */}
        <div className="rounded-lg border border-gray-700 bg-gray-900 p-6">
          <h3 className="text-lg font-medium text-white mb-4">Current Subscription</h3>
          {billingInfo ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Plan</span>
                <span className="text-white font-medium">{billingInfo.subscription.plan}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Status</span>
                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(billingInfo.subscription.status)}`}>
                  {billingInfo.subscription.status.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Amount</span>
                <span className="text-white font-medium">
                  ${billingInfo.subscription.amount.toLocaleString()}/{billingInfo.subscription.currency}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Next Billing</span>
                <span className="text-white">{billingInfo.subscription.nextBilling}</span>
              </div>
              
              {billingInfo.usage && (
                <div className="pt-4 border-t border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-text-muted">Usage</span>
                    <span className="text-white">
                      {billingInfo.usage.current} / {billingInfo.usage.limit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(billingInfo.usage.current / billingInfo.usage.limit) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-text-muted mt-1">This {billingInfo.usage.period}</div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-text-muted">No subscription information available</p>
          )}
        </div>

        {/* Payment Method */}
        <div className="rounded-lg border border-gray-700 bg-gray-900 p-6">
          <h3 className="text-lg font-medium text-white mb-4">Payment Method</h3>
          {billingInfo?.paymentMethod ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-8 bg-gray-700 rounded flex items-center justify-center">
                  <span className="text-xs text-white">
                    {billingInfo.paymentMethod.brand?.toUpperCase() || 'CARD'}
                  </span>
                </div>
                <div>
                  <div className="text-white">
                    •••• •••• •••• {billingInfo.paymentMethod.last4}
                  </div>
                  {billingInfo.paymentMethod.expiryMonth && billingInfo.paymentMethod.expiryYear && (
                    <div className="text-sm text-text-muted">
                      Expires {billingInfo.paymentMethod.expiryMonth}/{billingInfo.paymentMethod.expiryYear}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-text-muted">No payment method on file</p>
          )}
          
          <div className="mt-6">
            <button
              onClick={openStripePortal}
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
            >
              Manage Payment Methods
            </button>
          </div>
        </div>
      </div>

      {/* Billing History */}
      <div className="rounded-lg border border-gray-700 bg-gray-900 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-white">Billing History</h3>
          <button
            onClick={openStripePortal}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            View All Invoices
          </button>
        </div>
        
        {billingInfo?.invoices.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 text-text-muted font-medium">Date</th>
                  <th className="text-left py-3 text-text-muted font-medium">Amount</th>
                  <th className="text-left py-3 text-text-muted font-medium">Status</th>
                  <th className="text-right py-3 text-text-muted font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {billingInfo.invoices.slice(0, 5).map((invoice) => (
                  <tr key={invoice.id} className="border-b border-gray-700 last:border-b-0">
                    <td className="py-3 text-white">{invoice.date}</td>
                    <td className="py-3 text-white">${invoice.amount.toLocaleString()}</td>
                    <td className="py-3">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      {invoice.downloadUrl && (
                        <a
                          href={invoice.downloadUrl}
                          className="text-blue-400 hover:text-blue-300 text-sm"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-text-muted">No billing history available</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={openStripePortal}
          className="rounded-lg border border-gray-700 bg-gray-900 p-4 text-center hover:bg-gray-800 transition"
        >
          <div className="text-2xl mb-2">💳</div>
          <div className="font-medium text-white">Update Payment Method</div>
        </button>
        <button
          onClick={openStripePortal}
          className="rounded-lg border border-gray-700 bg-gray-900 p-4 text-center hover:bg-gray-800 transition"
        >
          <div className="text-2xl mb-2">📊</div>
          <div className="font-medium text-white">View Usage Details</div>
        </button>
        <button
          onClick={openStripePortal}
          className="rounded-lg border border-gray-700 bg-gray-900 p-4 text-center hover:bg-gray-800 transition"
        >
          <div className="text-2xl mb-2">📋</div>
          <div className="font-medium text-white">Download Invoices</div>
        </button>
      </div>
    </div>
  );
}