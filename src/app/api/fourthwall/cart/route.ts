import { NextResponse } from "next/server";

import { createCartCheckoutUrl } from "@/lib/fourthwall/storefront";

export const runtime = "nodejs";

type CartRequest = {
  items?: { variantId: string; quantity: number }[];
};

/**
 * Create a Fourthwall cart and return the hosted-checkout URL.
 * The client POSTs the selected variant(s); the supporter is then redirected
 * to Fourthwall's hosted checkout to pay.
 */
export async function POST(request: Request) {
  let body: CartRequest;
  try {
    body = (await request.json()) as CartRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const items = (body.items ?? []).filter(
    (i) => typeof i?.variantId === "string" && Number.isFinite(i?.quantity) && i.quantity > 0,
  );
  if (items.length === 0) {
    return NextResponse.json({ error: "No valid items." }, { status: 400 });
  }

  const checkoutUrl = await createCartCheckoutUrl(items);
  if (!checkoutUrl) {
    return NextResponse.json(
      { error: "Checkout is unavailable. Store not configured." },
      { status: 503 },
    );
  }

  return NextResponse.json({ checkoutUrl });
}
