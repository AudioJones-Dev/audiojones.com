// src/app/api/admin/webhooks/replay/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getDb } from '@/lib/server/legacyAdmin';

// Internal webhook processing function
async function processWebhookEvent(db: DocumentStoreTypes.Firestore, eventData: any) {
  const startTime = Date.now();
  
  try {
    // Extract customer info from the event
    const email = eventData.customer_email || eventData.email;
    const whopUserId = eventData.whop_user_id || `user_${Date.now()}`;
    const billingSkus = eventData.billing_sku || eventData.tier || 'unknown-sku';
    
    if (!email) {
      throw new Error('No customer email found in event');
    }

    // Get or create customer document
    const customerRef = getDb().collection('customers').doc(email);
    const customerDoc = await customerRef.get();
    
    let customerData;
    if (customerDoc.exists) {
      customerData = customerDoc.data();
      // Update existing customer
      await customerRef.update({
        last_webhook_replay: new Date().toISOString(),
        billing_sku: billingSkus,
        tier: eventData.tier || customerData?.tier || 'unknown',
        service_name: eventData.service_name || customerData?.service_name || 'unknown',
        updated_at: new Date().toISOString()
      });
    } else {
      // Create new customer from event data
      customerData = {
        whop_user_id: whopUserId,
        email: email,
        name: eventData.customer_name || eventData.name || "Unknown User",
        billing_sku: billingSkus,
        tier: eventData.tier || "unknown",
        service_name: eventData.service_name || "unknown",
        status: "active",
        created_at: eventData.timestamp || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_webhook_replay: new Date().toISOString(),
        source: "webhook_replay"
      };
      
      await customerRef.set(customerData);
    }

    const processingTime = Date.now() - startTime;
    
    return {
      success: true,
      customer_email: email,
      processing_time_ms: processingTime,
      action: customerDoc.exists ? 'updated' : 'created'
    };
    
  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error('[webhook replay] Processing error:', error);
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      processing_time_ms: processingTime
    };
  }
}

import { requireAdmin } from "@/lib/server/requireAdmin";

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    // Admin authentication using shared helper
    requireAdmin(req);

    // Parse request body
    const body = await req.json();
    const { event_id } = body;

    if (!event_id) {
      return NextResponse.json(
        { error: 'event_id is required' },
        { status: 400 }
      );
    }

    // Find the event in subscription_events collection
    const eventDoc = await getDb().collection('subscription_events').doc(event_id).get();
    
    if (!eventDoc.exists) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    const eventData = eventDoc.data();
    console.log(`[webhook replay] Replaying event ${event_id}:`, eventData?.event_type);

    // Process the webhook event
    const replayResult = await processWebhookEvent(getDb(), eventData);

    // Log the replay result in the original event document
    await eventDoc.ref.update({
      last_replay_at: new Date().toISOString(),
      last_replay_result: replayResult,
      replay_count: (eventData?.replay_count || 0) + 1
    });

    // Log replay action in admin audit log
    await getDb().collection('admin_audit_log').add({
      action: 'webhook_replay',
      actor: 'admin',
      target_email: replayResult.customer_email || 'unknown',
      payload: {
        event_id,
        event_type: eventData?.event_type,
        replay_result: replayResult
      },
      created_at: new Date().toISOString()
    });

    const totalTime = Date.now() - startTime;

    return NextResponse.json({
      ok: true,
      replay_status: replayResult.success ? 'success' : 'error',
      event_id,
      result: replayResult,
      processing_time_ms: totalTime
    });

  } catch (error) {
    console.error('[webhook replay] API error:', error);
    
    // If it's already a NextResponse (from requireAdmin), return it
    if (error instanceof NextResponse) {
      return error;
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
