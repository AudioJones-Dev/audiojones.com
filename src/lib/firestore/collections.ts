// src/lib/firestore/collections.ts
// Firestore collection utilities for portal dashboards

import { getAdminApp } from '@/lib/server/firebaseAdmin';
import { getFirestore } from "@/lib/legacy-stubs";

export interface Customer {
  id: string;
  whop_user_id: string;
  email: string;
  username?: string;
  avatar_image_url?: string;
  created_at: string;
  updated_at?: string;
  subscription_tier?: string;
  subscription_status?: 'active' | 'cancelled' | 'expired';
}

export interface SubscriptionEvent {
  id: string;
  event_type: 'payment.succeeded' | 'payment.failed' | 'invoice.paid' | 'subscription.created' | 'subscription.cancelled';
  whop_user_id: string;
  customer_email?: string;
  amount?: number;
  currency?: string;
  subscription_id?: string;
  tier?: string;
  timestamp: string;
  processed_at: string;
  raw_data?: any;
}

export interface DashboardStats {
  totalCustomers: number;
  activeSubscriptions: number;
  totalRevenue: number;
  recentEvents: SubscriptionEvent[];
  customerGrowth: number; // percentage change from last month
  eventCounts: {
    payments: number;
    subscriptions: number;
    cancellations: number;
  };
}

/**
 * Get Firestore instance (server-side only)
 */
function getDb() {
  return getFirestore(getAdminApp());
}

/**
 * Fetch all customers from Firestore
 */
export async function getCustomers(limit = 100): Promise<Customer[]> {
  try {
    const db = getDb();
    const snapshot = await db
      .collection('customers')
      .orderBy('created_at', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Customer[];
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
}

/**
 * Fetch subscription events from Firestore
 */
export async function getSubscriptionEvents(limit = 50): Promise<SubscriptionEvent[]> {
  try {
    const db = getDb();
    const snapshot = await db
      .collection('subscription_events')
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as SubscriptionEvent[];
  } catch (error) {
    console.error('Error fetching subscription events:', error);
    return [];
  }
}

/**
 * Calculate dashboard statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const db = getDb();
    
    // Get basic counts
    const [customersSnapshot, eventsSnapshot] = await Promise.all([
      db.collection('customers').get(),
      db.collection('subscription_events').get()
    ]);

    const customers = customersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Customer[];
    const allEvents = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as SubscriptionEvent[];

    // Calculate metrics
    const totalCustomers = customers.length;
    const activeSubscriptions = customers.filter(c => c.subscription_status && c.subscription_status === 'active').length;
    
    // Calculate total revenue from payment events
    const paymentEvents = allEvents.filter(e => e.event_type && e.event_type === 'payment.succeeded');
    const totalRevenue = paymentEvents.reduce((sum, event) => sum + (event.amount || 0), 0) / 100; // Convert from cents

    // Get recent events (last 10)
    const recentEvents = allEvents.slice(0, 10);

    // Event type counts (safe null checking)
    const eventCounts = {
      payments: allEvents.filter(e => e.event_type && typeof e.event_type === 'string' && e.event_type.includes('payment')).length,
      subscriptions: allEvents.filter(e => e.event_type && typeof e.event_type === 'string' && e.event_type.includes('subscription')).length,
      cancellations: allEvents.filter(e => e.event_type && e.event_type === 'subscription.cancelled').length,
    };

    // Calculate growth (simplified - would need time-based queries for real implementation)
    const customerGrowth = customers.length > 0 ? Math.floor(Math.random() * 20) + 5 : 0; // Mock for now

    return {
      totalCustomers,
      activeSubscriptions,
      totalRevenue,
      recentEvents,
      customerGrowth,
      eventCounts,
    };
  } catch (error) {
    console.error('Error calculating dashboard stats:', error);
    return {
      totalCustomers: 0,
      activeSubscriptions: 0,
      totalRevenue: 0,
      recentEvents: [],
      customerGrowth: 0,
      eventCounts: { payments: 0, subscriptions: 0, cancellations: 0 },
    };
  }
}

/**
 * Get customer by Whop user ID
 */
export async function getCustomerByWhopId(whopUserId: string): Promise<Customer | null> {
  try {
    const db = getDb();
    const snapshot = await db
      .collection('customers')
      .where('whop_user_id', '==', whopUserId)
      .limit(1)
      .get();

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Customer;
  } catch (error) {
    console.error('Error fetching customer by Whop ID:', error);
    return null;
  }
}