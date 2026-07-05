"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  /** Product slug from the server-side catalog in /api/stripe/checkout. */
  product: string;
  label: string;
  /** Where to send the visitor when checkout is not configured (503). */
  fallbackHref?: string;
  className?: string;
};

/**
 * Starts a Stripe Checkout session for a catalog product. Degrades to the
 * booking flow when Stripe isn't configured, so the CTA never dead-ends.
 */
export default function CheckoutButton({
  product,
  label,
  fallbackHref = "/book-a-call",
  className,
}: Props) {
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
      className={
        className ??
        "inline-block text-sm font-semibold text-signal-yellow hover:underline disabled:opacity-60"
      }
    >
      {pending ? "Redirecting…" : `${label} →`}
    </button>
  );
}
