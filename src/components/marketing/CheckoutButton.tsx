"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

type Props = {
  /** Product slug from the server-side catalog in /api/stripe/checkout. */
  product: string;
  label: string;
  /** Where to send the visitor when checkout is not configured (503). */
  fallbackHref?: string;
  className?: string;
};

const CTA_CLASS =
  "inline-block text-sm font-semibold text-signal-yellow hover:underline disabled:opacity-60";

function Cta({ product, label, fallbackHref = "/book-a-call", className }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function startCheckout() {
    if (pending) return;
    setPending(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product }),
      });
      if (res.ok) {
        const { url } = (await res.json()) as { url?: string };
        if (url) {
          window.location.assign(url);
          return;
        }
      }
      // Unconfigured (503) or any other failure: fall back to booking.
      router.push(fallbackHref);
    } catch {
      router.push(fallbackHref);
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={startCheckout}
      disabled={pending}
      className={className ?? CTA_CLASS}
    >
      {pending ? "Redirecting…" : `${label} →`}
    </button>
  );
}

/**
 * Swaps the buy CTA for a settled state once Stripe has redirected back
 * with ?checkout=success for this same product, so a visitor who reads the
 * unchanged pricing page as a failed payment can't buy it a second time.
 */
function CtaOrReceipt(props: Props) {
  const searchParams = useSearchParams();
  const justPurchased =
    searchParams.get("checkout") === "success" &&
    searchParams.get("product") === props.product;

  if (justPurchased) {
    // TODO(copy): placeholder wording — brand voice review pending.
    return (
      <span className="inline-block text-sm font-semibold text-fg-3">
        Purchased — check your email
      </span>
    );
  }

  return <Cta {...props} />;
}

/**
 * Starts a Stripe Checkout session for a catalog product. Degrades to the
 * booking flow when Stripe isn't configured, so the CTA never dead-ends.
 *
 * The Suspense boundary is what lets /pricing stay statically rendered
 * while still reacting to the ?checkout= redirect params; the fallback is
 * the plain CTA, so the button works before hydration either way.
 */
export default function CheckoutButton(props: Props) {
  return (
    <Suspense fallback={<Cta {...props} />}>
      <CtaOrReceipt {...props} />
    </Suspense>
  );
}
