// src/types/admin.ts

export interface AdminCustomer {
  email: string;
  status: 'active' | 'canceled' | 'expired' | 'payment_failed' | string;
  billing_sku?: string | null;
  service_id?: string | null;
  tier_id?: string | null;
  created_at: string;
  updated_at: string;
  last_event_type?: string | null;
  last_processed_request_id?: string | null;
}

export interface SubscriptionEvent {
  id?: string;
  event_type: string;
  customer_email?: string | null;
  billing_sku?: string | null;
  service_id?: string | null;
  tier_id?: string | null;
  timestamp: string;
  processed_at?: string | null;
  request_id?: string | null;
  raw_data?: any;
  metadata?: any;
}

export interface AdminAlert {
  id?: string;
  title: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  category: 'webhook' | 'payment' | 'system' | 'user' | string;
  status: 'active' | 'dismissed';
  created_at: string;
  created_by: string;
  dismissed_at?: string | null;
  dismissed_by?: string | null;
  auto_dismiss_at?: string | null;
  updated_at?: string | null;
  metadata?: any;
}

export interface PricingSku {
  id?: string;
  billing_sku: string;
  service_id: string;
  tier_id: string;
  active: boolean;
  created_at?: string;
  updated_at: string;
}

export interface AuditLog {
  id?: string;
  action: string;
  actor: string;
  target_email?: string | null;
  payload?: any;
  created_at: string;
}

// Utility type for Firestore document with safe defaults
export type FirestoreDoc<T> = {
  id: string;
  data(): any;
} & T;

// Helper function to safely cast Firestore doc data with defaults
export function safeDocCast<T>(doc: DocumentStoreTypes.DocumentSnapshot, defaults: Partial<T>): T & { id: string } {
  const data = doc.data() || {};
  return {
    id: doc.id,
    ...defaults,
    ...data,
  } as T & { id: string };
}