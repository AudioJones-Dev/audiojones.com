"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

/**
 * Confirmation strip for the ?checkout= redirect that Stripe Checkout
 * returns to (see /api/stripe/checkout). Without it the buyer lands back
 * on an unchanged pricing page with no signal that the payment went
 * through — which reads as a failure and invites a second purchase.
 *
 * Client-side + Suspense so /pricing stays statically rendered.
 */
function Notice({ productNames }: { productNames: Record<string, string> }) {
  const searchParams = useSearchParams();
  const state = searchParams.get("checkout");

  if (state !== "success" && state !== "cancelled") return null;

  const product = searchParams.get("product");
  const purchased = product ? productNames[product] : undefined;

  // TODO(copy): placeholder wording — brand voice review pending.
  const message =
    state === "success"
      ? purchased
        ? `Payment received for ${purchased}. A receipt is on its way to your email, and we'll be in touch to schedule.`
        : "Payment received. A receipt is on its way to your email, and we'll be in touch to schedule."
      : "Checkout was cancelled — you have not been charged. Pick up where you left off whenever you're ready.";

  return (
    <div className="border-b border-white/10 bg-bg-1">
      <div
        className="mx-auto max-w-5xl px-6 py-5"
        role="status"
        aria-live="polite"
      >
        <p className="aj-data-label">
          {state === "success" ? "Order confirmed" : "Checkout cancelled"}
        </p>
        <p className="mt-2 text-sm leading-6 text-fg-2">{message}</p>
      </div>
    </div>
  );
}

export default function CheckoutNotice({
  productNames,
}: {
  productNames: Record<string, string>;
}) {
  return (
    <Suspense fallback={null}>
      <Notice productNames={productNames} />
    </Suspense>
  );
}
