// src/app/api/whop-base64/route.ts - Webhook using Base64 private key
import { NextRequest, NextResponse } from "next/server";
import { getDb } from '@/lib/server/legacyAdmin';
import { getTierByBillingSku } from "@/lib/getPricing";

// Enhanced pricing lookup - checks Firestore first, then falls back to hardcoded
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

export async function GET() {
  return NextResponse.json({ 
    status: "ok", 
    message: "Whop Base64 webhook endpoint ready",
    env_check: {
      has_project_id: !!process.env.GOOGLE_CLOUD_PROJECT,
      has_client_email: !!process.env.LEGACY_AUTH_CLIENT_EMAIL,
      has_private_key_direct: !!process.env.LEGACY_AUTH_PRIVATE_KEY,
      has_private_key_base64: !!process.env.LEGACY_AUTH_PRIVATE_KEY_BASE64,
      direct_key_length: process.env.LEGACY_AUTH_PRIVATE_KEY?.length || 0,
      base64_key_length: process.env.LEGACY_AUTH_PRIVATE_KEY_BASE64?.length || 0,
      has_whop_api_key: !!process.env.WHOP_API_KEY,
      has_whop_app_id: !!process.env.WHOP_APP_ID,
    }
  });
}

export async function POST(req: NextRequest) {
  try {
    console.log("[whop webhook] Processing request...");
    const body = await req.json();
    
    // Determine payload type and extract data
    let customerData: any = {};
    let eventType = "webhook_received";
    
    if (body.event && body.data) {
      // Event-based payload (modern Whop webhooks)
      eventType = body.event;
      const data = body.data;
      
      customerData = {
        whop_user_id: data.user?.id || data.customer?.id || `user_${Date.now()}`,
        email: data.user?.email || data.customer?.email || "unknown@example.com",
        name: data.user?.username || data.customer?.name || "Unknown User",
        billing_sku: data.billing_sku || "unknown-sku",
        payment_id: data.id,
        amount: data.amount,
        currency: data.currency || "usd",
        created_at: new Date().toISOString(),
        source: "whop_webhook_event"
      };
    } else {
      // Simple payload (legacy format)
      customerData = {
        whop_user_id: body.whop_user_id || `user_${Date.now()}`,
        email: body.email || "unknown@example.com", 
        name: body.name || "Unknown User",
        billing_sku: body.billing_sku || "unknown-sku",
        created_at: new Date().toISOString(),
        source: "whop_webhook_simple"
      };
    }

    // Look up pricing info
    const tier = await getTierByBillingSkuEnhanced(getDb(), customerData.billing_sku);
    if (tier) {
      customerData.service_name = tier.service.id;
      customerData.tier_name = tier.tier.name;
      customerData.tier_price = tier.tier.price_min;
    }

    // Write to customers collection
    const customerRef = getDb().collection('customers').doc(customerData.whop_user_id);
    await customerRef.set(customerData, { merge: true });

    // Write to subscription_events collection  
    const eventRef = getDb().collection('subscription_events').doc();
    await eventRef.set({
      event_type: eventType,
      customer_id: customerData.whop_user_id,
      billing_sku: customerData.billing_sku,
      payload: body,
      processed_at: new Date().toISOString(),
      webhook_source: "base64_webhook"
    });

    console.log("[whop webhook] Successfully processed and stored");

    return NextResponse.json({
      success: true,
      message: "Webhook processed successfully",
      customer_id: customerData.whop_user_id,
      event_type: eventType
    });

  } catch (error: any) {
    console.error("[whop webhook] Error:", error);
    return NextResponse.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
