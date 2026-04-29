// src/lib/alerts.ts
import { getApps, initializeApp, cert } from "@/lib/legacy-stubs";
import { getFirestore } from "@/lib/legacy-stubs";

interface AlertOptions {
  title: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  category?: 'webhook' | 'payment' | 'system' | 'user' | 'security';
  metadata?: Record<string, any>;
  auto_dismiss_minutes?: number;
}

// Initialize Firebase Admin if not already done
function getFirebaseApp() {
  if (getApps().length === 0) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (!projectId || !clientEmail || !privateKey) {
      console.warn("Firebase Admin credentials not configured for alerts");
      return null;
    }

    return initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }
  return getApps()[0]!;
}

export async function createAlert(options: AlertOptions): Promise<string | null> {
  try {
    const app = getFirebaseApp();
    if (!app) return null;

    const db = getFirestore(app);

    const alertData = {
      title: options.title.trim(),
      message: options.message.trim(),
      severity: options.severity,
      category: options.category || 'system',
      status: 'active',
      created_at: new Date().toISOString(),
      created_by: 'system',
      dismissed_at: null,
      dismissed_by: null,
      metadata: options.metadata || {},
      auto_dismiss_at: options.auto_dismiss_minutes 
        ? new Date(Date.now() + options.auto_dismiss_minutes * 60 * 1000).toISOString()
        : null,
    };

    const docRef = await db.collection("alerts").add(alertData);
    
    console.log(`[alerts] Created ${options.severity} alert: ${options.title} (${docRef.id})`);
    return docRef.id;

  } catch (error) {
    console.error("[alerts] Failed to create alert:", error);
    return null;
  }
}

// Predefined alert creators for common scenarios
export const AlertTemplates = {
  webhookFailure: (error: string, metadata?: Record<string, any>) =>
    createAlert({
      title: "Webhook Processing Failed",
      message: `Webhook processing encountered an error: ${error}`,
      severity: 'critical',
      category: 'webhook',
      metadata,
      auto_dismiss_minutes: 60, // Auto-dismiss after 1 hour
    }),

  paymentFailure: (customerEmail: string, reason?: string, metadata?: Record<string, any>) =>
    createAlert({
      title: "Payment Processing Failed",
      message: `Payment failed for customer ${customerEmail}${reason ? `: ${reason}` : ''}`,
      severity: 'warning',
      category: 'payment',
      metadata: { customer_email: customerEmail, ...metadata },
    }),

  systemError: (component: string, error: string, metadata?: Record<string, any>) =>
    createAlert({
      title: "System Error Detected",
      message: `Error in ${component}: ${error}`,
      severity: 'critical',
      category: 'system',
      metadata: { component, ...metadata },
    }),

  securityIncident: (type: string, details: string, metadata?: Record<string, any>) =>
    createAlert({
      title: "Security Incident",
      message: `${type}: ${details}`,
      severity: 'critical',
      category: 'security',
      metadata,
    }),

  rateLimit: (ip: string, endpoint: string, metadata?: Record<string, any>) =>
    createAlert({
      title: "Rate Limit Exceeded",
      message: `IP ${ip} exceeded rate limit on ${endpoint}`,
      severity: 'warning',
      category: 'security',
      metadata: { ip, endpoint, ...metadata },
      auto_dismiss_minutes: 30,
    }),

  newCustomer: (customerEmail: string, sku?: string, metadata?: Record<string, any>) =>
    createAlert({
      title: "New Customer Registration",
      message: `New customer registered: ${customerEmail}${sku ? ` (${sku})` : ''}`,
      severity: 'info',
      category: 'user',
      metadata: { customer_email: customerEmail, sku, ...metadata },
      auto_dismiss_minutes: 120, // Auto-dismiss after 2 hours
    }),
};

// Auto-dismiss expired alerts (can be called periodically)
export async function cleanupExpiredAlerts(): Promise<number> {
  try {
    const app = getFirebaseApp();
    if (!app) return 0;

    const db = getFirestore(app);
    const now = new Date().toISOString();

    const expiredQuery = db.collection("alerts")
      .where("status", "==", "active")
      .where("auto_dismiss_at", "<=", now);

    const snapshot = await expiredQuery.get();
    
    if (snapshot.empty) return 0;

    const batch = db.batch();
    let count = 0;

    snapshot.docs.forEach((doc) => {
      batch.update(doc.ref, {
        status: 'dismissed',
        dismissed_at: now,
        dismissed_by: 'auto-cleanup',
        updated_at: now,
      });
      count++;
    });

    await batch.commit();
    
    console.log(`[alerts] Auto-dismissed ${count} expired alerts`);
    return count;

  } catch (error) {
    console.error("[alerts] Failed to cleanup expired alerts:", error);
    return 0;
  }
}