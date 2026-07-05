export const runtime = 'nodejs';
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { env } from "@aj/config";
import { siteConfig } from "@/lib/site";

// Server-side product catalog. The client sends a product slug only;
// price IDs, checkout mode, and redirect URLs are resolved here so the
// route can never be pointed at arbitrary prices or URLs.
const CATALOG: Record<string, { priceId: string | undefined; mode: "payment" | "subscription" }> = {
  "revenue-leak-diagnostic": { priceId: env.STRIPE_PRICE_DIAGNOSTIC, mode: "payment" },
  "responseos-starter": { priceId: env.STRIPE_PRICE_RESPONSEOS_STARTER, mode: "subscription" },
  "responseos-core": { priceId: env.STRIPE_PRICE_RESPONSEOS_CORE, mode: "subscription" },
  "responseos-pro": { priceId: env.STRIPE_PRICE_RESPONSEOS_PRO, mode: "subscription" },
};

export async function POST(req: NextRequest) {
  const stripeSecret = env.STRIPE_SECRET_KEY;
  if (!stripeSecret) {
    return NextResponse.json({ error: "Checkout not configured" }, { status: 503 });
  }

  let product: unknown;
  try {
    ({ product } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (typeof product !== "string" || !(product in CATALOG)) {
    return NextResponse.json({ error: "Unknown product" }, { status: 400 });
  }

  const entry = CATALOG[product];
  if (!entry.priceId) {
    return NextResponse.json({ error: "Checkout not configured" }, { status: 503 });
  }

  const stripe = new Stripe(stripeSecret);
  const session = await stripe.checkout.sessions.create({
    mode: entry.mode,
    line_items: [{ price: entry.priceId, quantity: 1 }],
    success_url: `${siteConfig.url}/pricing?checkout=success&product=${product}`,
    cancel_url: `${siteConfig.url}/pricing?checkout=cancelled`,
    metadata: { product },
  });
  return NextResponse.json({ url: session.url });
}
