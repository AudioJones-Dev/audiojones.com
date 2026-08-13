"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { Eyebrow } from "@/components/ui/Eyebrow";

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

  return (
    <div className="border-b border-white/10 bg-bg-1">
      <div
        role="status"
        aria-live="polite"
        className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-6"
      >
        {state === "success" ? (
          <>
            <Eyebrow tone="signal">Payment received</Eyebrow>
            <p className="t-lead text-fg-1">
              You&apos;re in. Your receipt is on its way, and we&apos;ll be in
              touch to schedule.
            </p>
            {purchased && (
              <p className="t-small text-fg-3">
                Confirmed for{" "}
                <span className="font-medium text-fg-1">{purchased}</span>.
              </p>
            )}
          </>
        ) : (
          <>
            <Eyebrow tone="muted">Checkout cancelled</Eyebrow>
            <p className="t-lead text-fg-1">
              No charge was made. Pick up where you left off whenever
              you&apos;re ready.
            </p>
          </>
        )}
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
