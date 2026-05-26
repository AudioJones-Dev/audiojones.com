// src/app/api/whop/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getDb } from '@/lib/server/legacyAdmin';
import { getTierByBillingSku } from "@/lib/getPricing";
import { AlertTemplates } from "@/lib/alerts";
import TracingMiddleware from '@/lib/observability/TracingMiddleware';
import crypto from "crypto";

// ⬇️ optional: if you installed @whop/sdk
// import Whop from "@whop/sdk";

// ─────────────────────────────────────────────
// Production-grade security helpers
// ─────────────────────────────────────────────

// Rate limiting storage (in-memory for simplicity, use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function rateLimit(ip: string, maxRequests: number = 60, windowMs: number = 60000): boolean {
  const now = Date.now();
  const key = ip;
  
  const current = rateLimitMap.get(key);
  
  if (!current || now > current.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (current.count >= maxRequests) {
    return false; // Rate limit exceeded
  }
  
  current.count++;
  return true;
}

function validateWebhookSignature(
  payload: string,
  signature: string | null,
  timestamp: string | null,
  secret: string
): boolean {
  if (!signature || !timestamp) {
    console.warn("[whop webhook] Missing signature or timestamp headers");
    return false;
  }

  // Check timestamp to prevent replay attacks (5 minutes tolerance)
  const now = Math.floor(Date.now() / 1000);
  const webhookTime = parseInt(timestamp);
  
  if (Math.abs(now - webhookTime) > 300) {
    console.warn("[whop webhook] Timestamp too old, possible replay attack");
    return false;
  }

  // Verify HMAC-SHA256 signature
  const signedPayload = `${timestamp}.${payload}`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(signedPayload, 'utf8')
    .digest('hex');

  // Use timing-safe comparison to prevent timing attacks
  const providedSignature = signature.replace('sha256=', '');
  
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(providedSignature, 'hex')
    );
  } catch (err) {
    console.warn("[whop webhook] Invalid signature format");
    return false;
  }
}

// ─────────────────────────────────────────────
// retired admin - using shared utility
// ─────────────────────────────────────────────

// ─────────────────────────────────────────────
// Enhanced pricing lookup - checks Firestore first, then falls back to hardcoded
// ─────────────────────────────────────────────
async function getTierByBillingSkuEnhanced(db: DocumentStoreTypes.Firestore, billingSku: string) {
  try {
    // First, try to find in Firestore pricing_skus collection
    const pricingQuery = await db
      .collection('pricing_skus')
      .where('billing_sku', '==', billingSku)
      .where('active', '==', true)
      .limit(1)
      .get();

    if (!pricingQuery.empty) {
      const pricingDoc = pricingQuery.docs[0];
      const pricingData = pricingDoc.data();
      
      console.log(`[pricing] Found Firestore SKU: ${billingSku} -> service: ${pricingData.service_id}, tier: ${pricingData.tier_id}`);
      
      return {
        service: { id: pricingData.service_id },
        tier: { 
          id: pricingData.tier_id,
          name: pricingData.tier_id, // Use tier_id as name for now
          price_min: 0 // Default price, could be enhanced later
        }
      };
    }
  } catch (error) {
    console.error(`[pricing] Firestore lookup failed for ${billingSku}:`, error);
  }

  // Fallback to hardcoded function
  console.log(`[pricing] Using hardcoded fallback for SKU: ${billingSku}`);
  return getTierByBillingSku(billingSku);
}

// ─────────────────────────────────────────────
// (optional) Whop client helper
// If you want to re-fetch payment/invoice from Whop
// ─────────────────────────────────────────────
async function fetchWhopResource(kind: "payment" | "invoice", id: string) {
  const whopAppId = process.env.WHOP_APP_ID;
  const whopApiKey = process.env.WHOP_API_KEY;

  if (!whopAppId || !whopApiKey) {
    console.warn("[whop webhook] WHOP_APP_ID / WHOP_API_KEY missing, skipping re-fetch");
    return null;
  }

  // minimal fetch using fetch() so you don't have to install SDK
  const url =
    kind === "payment"
      ? `https://api.whop.com/api/v1/payments/${id}`
      : `https://api.whop.com/api/v1/invoices/${id}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${whopApiKey}`,
      "Content-Type": "application/json",
      "X-Whop-App-Id": whopAppId,
    },
  });

  if (!res.ok) {
    console.warn(`[whop webhook] failed to refetch ${kind} ${id}`, await res.text());
    return null;
  }
  return res.json();
}

// ─────────────────────────────────────────────
// GET = health check
// ─────────────────────────────────────────────
export async function GET() {
  return NextResponse.json({ ok: true, source: "whop-webhook" });
}

// ─────────────────────────────────────────────
// POST = main webhook
// handles:
// 1) legacy/simple payloads: { user: {email}, product_id/billing_sku/... }
// 2) event-based payloads: { type: "payment.succeeded", data: {...} }
// ─────────────────────────────────────────────
export const POST = TracingMiddleware.wrapWebhookHandler('whop', async (req: NextRequest) => {
  const startTime = Date.now();
  const requestId = crypto.randomUUID();
  
  console.log(`[whop webhook:${requestId}] Incoming webhook request`);

  // Rate limiting
  const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || 'unknown';
  if (!rateLimit(clientIp)) {
    console.warn(`[whop webhook:${requestId}] Rate limit exceeded for IP: ${clientIp}`);
    
    // Create security alert for rate limiting
    AlertTemplates.rateLimit(clientIp, '/api/whop', { 
      request_id: requestId,
      user_agent: req.headers.get('user-agent') || 'unknown'
    });
    
    return NextResponse.json(
      { ok: false, error: "rate_limit_exceeded" }, 
      { status: 429 }
    );
  }

  // Get raw body for signature verification
  const rawBody = await req.text().catch(() => null);
  if (!rawBody) {
    console.error(`[whop webhook:${requestId}] Failed to read request body`);
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  let json: any;
  try {
    json = JSON.parse(rawBody);
  } catch (err) {
    console.error(`[whop webhook:${requestId}] Invalid JSON payload`);
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Production webhook signature verification
  const webhookSecret = process.env.WHOP_WEBHOOK_SECRET;
  if (webhookSecret) {
    const signature = req.headers.get("whop-signature") || req.headers.get("webhook-signature");
    const timestamp = req.headers.get("whop-timestamp") || req.headers.get("webhook-timestamp");
    
    if (!validateWebhookSignature(rawBody, signature, timestamp, webhookSecret)) {
      console.error(`[whop webhook:${requestId}] Invalid webhook signature`);
      
      // Create security alert for invalid signature
      AlertTemplates.securityIncident(
        'Invalid Webhook Signature',
        `Webhook request with invalid signature from IP: ${clientIp}`,
        { 
          request_id: requestId,
          ip: clientIp,
          signature_provided: !!signature,
          timestamp_provided: !!timestamp
        }
      );
      
      return NextResponse.json(
        { ok: false, error: "invalid_signature" }, 
        { status: 401 }
      );
    }
  } else {
    console.warn(`[whop webhook:${requestId}] WHOP_WEBHOOK_SECRET not configured - signature verification skipped`);
  }

  // Branch 1: event-style payloads from the Whop docs (have "type")
  if (typeof json.type === "string") {
    const eventType = json.type as string;
    const eventId = json.id as string | undefined;
    const ts = json.timestamp as string | undefined;

    // We'll keep what Whop sent
    const rawData = json.data || {};

    // decide if we want to re-fetch
    let enriched: any = null;
    if (eventType.startsWith("payment.") && rawData.id) {
      enriched = await fetchWhopResource("payment", rawData.id).catch(() => null);
    } else if (eventType.startsWith("invoice.") && rawData.id) {
      enriched = await fetchWhopResource("invoice", rawData.id).catch(() => null);
    }

    // figure out email / user from whatever we have
    const email =
      enriched?.user?.email ||
      rawData?.user?.email ||
      rawData?.billing_address?.email_address ||
      null;

    // try to map SKU/product → your service
    // payments usually have product / plan
    const possibleSku =
      enriched?.product?.id ||
      enriched?.plan?.id ||
      rawData?.product?.id ||
      rawData?.plan?.id ||
      rawData?.billing_sku ||
      null;

    let pricingMatch: any = null;
    if (possibleSku) {
      pricingMatch = await getTierByBillingSkuEnhanced(getDb(), possibleSku);
    }

    // write to Firestore (best-effort)
    try {
      console.log(`[whop webhook:${requestId}] Processing event: ${eventType}, email: ${email}, sku: ${possibleSku}`);
      
      // 1) event log with enhanced metadata
      await getDb().collection("subscription_events").add({
        whop_event_id: eventId,
        event_type: eventType,
        whop_user_id: "unknown",
        customer_email: email,
        tier: pricingMatch?.tier?.id || null,
        timestamp: ts || new Date().toISOString(),
        processed_at: new Date().toISOString(),
        processing_time_ms: Date.now() - startTime,
        request_id: requestId,
        raw_data: json,
        enriched_data: enriched,
      });

      // 2) upsert customer if we have an email
      if (email) {
        const customerRef = getDb().collection("customers").doc(email);
        const customerData = {
          email,
          status:
            eventType === "payment.succeeded" || eventType === "invoice.paid"
              ? "active"
              : eventType === "payment.failed" || eventType === "invoice.failed"
              ? "payment_failed"
              : "updated",
          service_id: pricingMatch?.service?.id || null,
          tier_id: pricingMatch?.tier?.id || null,
          billing_sku: possibleSku || null,
          updated_at: new Date().toISOString(),
          last_event_type: eventType,
          last_processed_request_id: requestId,
        };
        
        await customerRef.set(customerData, { merge: true });
        console.log(`[whop webhook:${requestId}] Customer updated: ${email} -> ${customerData.status}`);
        
        // Create alerts for important events
        if (eventType === "payment.succeeded") {
          AlertTemplates.newCustomer(email, possibleSku, {
            request_id: requestId,
            event_type: eventType,
            tier: pricingMatch?.tier?.id,
            service: pricingMatch?.service?.id
          });
        } else if (eventType === "payment.failed") {
          AlertTemplates.paymentFailure(email, "Payment processing failed", {
            request_id: requestId,
            event_type: eventType,
            sku: possibleSku
          });
        }
      }
    } catch (err) {
      console.error(`[whop webhook:${requestId}] Firestore write failed:`, err);
      
      // Log error details for debugging
      try {
        await getDb().collection("webhook_errors").add({
          request_id: requestId,
          error_type: "firestore_write_failed",
          error_message: err instanceof Error ? err.message : String(err),
          event_type: eventType,
          customer_email: email,
          timestamp: new Date().toISOString(),
          raw_payload: json,
        });
        
        // Create critical alert for webhook processing failure
        AlertTemplates.webhookFailure(
          err instanceof Error ? err.message : String(err),
          {
            request_id: requestId,
            event_type: eventType,
            customer_email: email,
            error_type: "firestore_write_failed"
          }
        );
      } catch (logErr) {
        console.error(`[whop webhook:${requestId}] Failed to log error to Firestore:`, logErr);
      }
      
      // Still return 200 to prevent infinite retries, but with error flag
      return NextResponse.json({
        ok: false,
        error: "processing_failed",
        request_id: requestId,
        eventType,
        email,
        sku: possibleSku,
      }, { status: 200 }); // 200 to stop retries
    }

    const processingTime = Date.now() - startTime;
    console.log(`[whop webhook:${requestId}] Successfully processed event in ${processingTime}ms`);
    
    return NextResponse.json({
      ok: true,
      mode: "event",
      request_id: requestId,
      eventType,
      email,
      sku: possibleSku,
      pricingMatch: pricingMatch || null,
      processing_time_ms: processingTime,
    });
  }

  // ─────────────────────────────────────────
  // Branch 2: your earlier "simple webhook" style
  // where we just get { user: { email }, product_id / plan_id / billing_sku ... }
  // ─────────────────────────────────────────
  const email =
    json.user?.email ||
    json.customer?.email ||
    json.email ||
    null;

  const sku =
    json.billing_sku ||
    json.product_id ||
    json.plan_id ||
    json.sku ||
    null;

  let pricingMatch: any = null;
  if (sku) {
    pricingMatch = await getTierByBillingSkuEnhanced(getDb(), sku);
  }

  try {
    console.log(`[whop webhook:${requestId}] Processing simple webhook: email: ${email}, sku: ${sku}`);
    
    // event log with enhanced metadata
    await getDb().collection("subscription_events").add({
      event_type: "subscription.created",
      whop_user_id: "unknown",
      customer_email: email,
      tier: pricingMatch?.tier?.id || null,
      timestamp: new Date().toISOString(),
      processed_at: new Date().toISOString(),
      processing_time_ms: Date.now() - startTime,
      request_id: requestId,
      raw_data: json,
    });

    // upsert customer with enhanced data
    if (email) {
      const customerRef = getDb().collection("customers").doc(email);
      const customerData = {
        email,
        status: "active",
        last_sku: sku,
        service_id: pricingMatch?.service?.id || null,
        tier_id: pricingMatch?.tier?.id || null,
        billing_sku: sku,
        updated_at: new Date().toISOString(),
        last_event_type: "subscription.created",
        last_processed_request_id: requestId,
      };
      
      await customerRef.set(customerData, { merge: true });
      console.log(`[whop webhook:${requestId}] Customer created/updated: ${email} -> active`);
    }
  } catch (err) {
    console.error(`[whop webhook:${requestId}] Firestore write failed:`, err);
    
    // Log error for debugging
    try {
      await getDb().collection("webhook_errors").add({
        request_id: requestId,
        error_type: "firestore_write_failed",
        error_message: err instanceof Error ? err.message : String(err),
        event_type: "subscription.created",
        customer_email: email,
        timestamp: new Date().toISOString(),
        raw_payload: json,
      });
    } catch (logErr) {
      console.error(`[whop webhook:${requestId}] Failed to log error to Firestore:`, logErr);
    }
    
    return NextResponse.json({
      ok: false,
      error: "processing_failed",
      request_id: requestId,
      mode: "simple",
      email,
      sku,
    }, { status: 200 }); // 200 to stop retries
  }

  const processingTime = Date.now() - startTime;
  console.log(`[whop webhook:${requestId}] Successfully processed simple webhook in ${processingTime}ms`);

  return NextResponse.json({
    ok: true,
    mode: "simple",
    request_id: requestId,
    email,
    sku,
    pricingMatch: pricingMatch || null,
    processing_time_ms: processingTime,
  });
});
