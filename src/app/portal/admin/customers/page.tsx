// src/app/portal/admin/customers/page.tsx
// Admin customers listing with Firestore integration

import Link from 'next/link';
import { getCustomers } from '@/lib/firestore/collections';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Users, Mail, Calendar, Activity } from 'lucide-react';

export default async function AdminCustomers() {
  // Fetch customers server-side
  const customers = await getCustomers(50);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Customers</h1>
          <p className="text-text-muted mt-1">
            Manage customer accounts and subscriptions
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-text-muted">
            Total: {customers.length} customers
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Total Customers</p>
                <p className="text-2xl font-bold text-white">{customers.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Active Subscriptions</p>
                <p className="text-2xl font-bold text-white">
                  {customers.filter(c => c.subscription_status === 'active').length}
                </p>
              </div>
              <Activity className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">This Month</p>
                <p className="text-2xl font-bold text-white">
                  {customers.filter(c => {
                    const created = new Date(c.created_at);
                    const thisMonth = new Date();
                    return created.getMonth() === thisMonth.getMonth() && 
                           created.getFullYear() === thisMonth.getFullYear();
                  }).length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Cancelled</p>
                <p className="text-2xl font-bold text-white">
                  {customers.filter(c => c.subscription_status === 'cancelled').length}
                </p>
              </div>
              <Mail className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Directory</CardTitle>
        </CardHeader>
        <CardContent>
          {customers.length === 0 ? (
            <div className="text-center py-8 text-text-muted">
              <Users className="h-12 w-12 mx-auto mb-4 text-text-muted" />
              <p>No customers found</p>
              <p className="text-sm mt-1">Customer data will appear here once webhook events are processed</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-text-primary font-medium">Customer</th>
                    <th className="text-left py-3 px-4 text-text-primary font-medium">Email</th>
                    <th className="text-left py-3 px-4 text-text-primary font-medium">Subscription</th>
                    <th className="text-left py-3 px-4 text-text-primary font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-text-primary font-medium">Created</th>
                    <th className="text-left py-3 px-4 text-text-primary font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer, index) => (
                    <tr key={customer.id || index} className="border-b border-gray-800 hover:bg-gray-800/50">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          {customer.avatar_image_url ? (
                            <img 
                              src={customer.avatar_image_url} 
                              alt={customer.username || customer.email}
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                              <Users className="h-4 w-4 text-text-muted" />
                            </div>
                          )}
                          <div>
                            <div className="text-white font-medium">
                              {customer.username || 'Unknown'}
                            </div>
                            <div className="text-xs text-text-muted">
                              ID: {customer.whop_user_id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-text-primary">
                        <Link 
                          href={`/portal/admin/customers/${encodeURIComponent(customer.email)}`}
                          className="text-blue-400 hover:text-blue-300 hover:underline"
                        >
                          {customer.email}
                        </Link>
                      </td>
                      <td className="py-4 px-4">
                        {customer.subscription_tier ? (
                          <Badge variant="secondary">
                            {customer.subscription_tier}
                          </Badge>
                        ) : (
                          <span className="text-text-muted text-sm">No subscription</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          variant="outline"
                          className={
                            customer.subscription_status === 'active'
                              ? 'border-green-500 text-green-400'
                              : customer.subscription_status === 'cancelled'
                              ? 'border-red-500 text-red-400'
                              : 'border-gray-500 text-text-muted'
                          }
                        >
                          {customer.subscription_status || 'inactive'}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-text-muted text-sm">
                        {new Date(customer.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <Link 
                          href={`/portal/admin/customers/${encodeURIComponent(customer.email)}`}
                          className="text-blue-400 hover:text-blue-300 text-sm hover:underline"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}