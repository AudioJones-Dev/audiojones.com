export const runtime = 'nodejs';
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { env } from "@aj/config";

export async function POST(req: NextRequest) {
  const stripeSecret = env.STRIPE_SECRET_KEY;
  if (!stripeSecret) return NextResponse.json({ error: "Billing portal not configured" }, { status: 503 });
  const stripe = new Stripe(stripeSecret);

  const { customerId, return_url } = await req.json();
  if (!customerId || !return_url) return NextResponse.json({ error: "Missing params" }, { status: 400 });

  const portal = await stripe.billingPortal.sessions.create({ customer: customerId, return_url });
  return NextResponse.json({ url: portal.url });
}
