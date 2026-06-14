import { NextResponse } from "next/server";

import { getHmacSecret } from "@/lib/fourthwall/config";
import { verifyFourthwallSignature } from "@/lib/fourthwall/hmac";

export const runtime = "nodejs";
// Webhooks must read the raw body for signature verification — never cache.
export const dynamic = "force-dynamic";

type FourthwallWebhook = {
  type?: string;
  // Fourthwall payloads vary by event; keep this permissive and narrow per-type.
  [key: string]: unknown;
};

/**
 * Receive Fourthwall webhooks (orders, products, …).
 *
 * Verifies `X-Fourthwall-Hmac-SHA256` against the raw body using
 * FOURTHWALL_HMAC_SECRET, then dispatches by event type. Unconfigured →
 * 503; bad signature → 401.
 */
export async function POST(request: Request) {
  if (!getHmacSecret()) {
    return NextResponse.json({ error: "Webhooks not configured." }, { status: 503 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-fourthwall-hmac-sha256");

  if (!verifyFourthwallSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  let event: FourthwallWebhook;
  try {
    event = JSON.parse(rawBody) as FourthwallWebhook;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const type = event.type ?? "unknown";
  switch (type) {
    case "ORDER_PLACED":
    case "ORDER_UPDATED":
      // TODO: fulfilment / notification / CRM sync hook.
      console.info(`[fourthwall] order event: ${type}`);
      break;
    case "PRODUCT_CREATED":
    case "PRODUCT_UPDATED":
      // TODO: revalidate /merch caches when the catalog changes.
      console.info(`[fourthwall] product event: ${type}`);
      break;
    default:
      console.info(`[fourthwall] unhandled event: ${type}`);
  }

  // Acknowledge quickly so Fourthwall doesn't retry.
  return NextResponse.json({ received: true });
}
