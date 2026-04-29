import { NextRequest, NextResponse } from "next/server";
import { parseWhopWebhook, type WhopWebhookEvent } from "@aj/whop";
import { env } from "@aj/config";
import mappings from "@/config/automation-mappings.json";
import { upsertMailerLiteSubscriber } from "@/lib/integrations/mailerlite";
import { mapWhopPlanToInternal } from "@/lib/capacity";
import { getDb } from '@/lib/server/firebaseAdmin';

interface WhopWebhookData {
  event: string;
  data: {
    email: string;
    product_id: string;
    name?: string;
    amount?: number;
  };
}

export async function POST(req: NextRequest) {
  try {
    // Verify webhook signature using the adapter
    const signature = req.headers.get("whop-signature") || req.headers.get("x-whop-signature");
    
    if (!signature) {
      console.log('[whop-webhook] Missing signature');
      return NextResponse.json({ error: "missing signature" }, { status: 400 });
    }
    
    const rawBody = await req.text();
    const event = parseWhopWebhook(rawBody, signature);
    
    console.log('[whop-webhook] Received verified event:', { 
      type: event.type,
      id: event.id,
      timestamp: event.created_at 
    });

    // Legacy format compatibility
    const body: WhopWebhookData = {
      event: event.type,
      data: event.data as WhopWebhookData['data']
    };

    const email = body?.data?.email;
  const productId = body?.data?.product_id;
  const name = body?.data?.name ?? "";

  console.log('[whop-webhook] Received:', { 
    event: body.event, 
    email, 
    productId, 
    name 
  });

  // Find product mapping
  const match = Array.isArray(mappings)
    ? mappings.find((p) => p.whopProductId === productId)
    : null;

  if (!match) {
    console.log("[whop-webhook] unmapped product", productId);
    return NextResponse.json({ ok: true, unmapped: true });
  }

  if (!email) {
    console.log("[whop-webhook] missing email", body);
    return NextResponse.json({ ok: true, missingEmail: true });
  }

  // Process the automation
  await upsertMailerLiteSubscriber({
    email,
    name,
    tag: match.mailerliteTag,
  });

  // Map Whop data to client contract
  const contractMapping = mapWhopPlanToInternal(body.data);
  const contractId = `whop-${productId}-${email.replace('@', '-at-')}`;

  // Determine contract status based on event type
  let contractStatus = 'active';
  if (body.event?.includes('cancel') || body.event?.includes('expire')) {
    contractStatus = 'offboarding';
  } else if (body.event?.includes('renew')) {
    contractStatus = 'pending_renewal';
  }

  // Upsert client contract for capacity management
  try {
    await getDb().collection("client_contracts").doc(contractId).set({
      client_id: email,
      whop_product_id: productId,
      plan_tier: contractMapping.plan_tier,
      plan_type: contractMapping.plan_type,
      monthly_fee: body.data?.amount || 5000, // Default if not provided
      hours_committed: contractMapping.hours_committed,
      status: contractStatus,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      source: 'whop_webhook',
      whop_event: body.event,
      client_name: name || email
    }, { merge: true });

    console.log(`[whop-webhook] Updated client contract: ${contractId} (${contractMapping.plan_tier})`);
  } catch (error) {
    console.error('[whop-webhook] Failed to update client contract:', error);
    // Don't fail the webhook for this - just log it
  }

  console.log('[whop-webhook] Processed successfully:', {
    email,
    productId,
    tag: match.mailerliteTag,
    epmStage: match.epmStage,
    contractId,
    contractStatus
  });

  return NextResponse.json({ 
    ok: true,
    processed: {
      email,
      productId,
      tag: match.mailerliteTag,
      epmStage: match.epmStage,
      client_contract: {
        id: contractId,
        plan_tier: contractMapping.plan_tier,
        plan_type: contractMapping.plan_type,
        status: contractStatus
      }
    }
  });
  
  } catch (error) {
    console.error('[whop-webhook] Error processing webhook:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Webhook processing failed",
        success: false 
      }, 
      { status: 400 }
    );
  }
}
