"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import type { FourthwallProductVariant } from "@/lib/fourthwall/types";

function money(value: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

export default function BuyButton({ variants }: { variants: FourthwallProductVariant[] }) {
  const [variantId, setVariantId] = useState(variants[0]?.id ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selected = variants.find((v) => v.id === variantId) ?? variants[0];

  async function checkout() {
    if (!selected) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/fourthwall/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [{ variantId: selected.id, quantity: 1 }] }),
      });
      const data = (await res.json()) as { checkoutUrl?: string; error?: string };
      if (res.ok && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      setError(data.error ?? "Checkout is unavailable right now.");
    } catch {
      setError("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8">
      {variants.length > 1 ? (
        <label className="block">
          <span className="aj-data-label">Variant</span>
          <select
            className="aj-input mt-2 w-full"
            value={variantId}
            onChange={(e) => setVariantId(e.target.value)}
          >
            {variants.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <div className="mt-5 flex items-center gap-4">
        <Button onClick={checkout} disabled={loading || !selected} variant="glow">
          {loading ? "Starting checkout…" : "Buy now"}
        </Button>
        {selected ? (
          <span className="font-headline text-xl font-bold text-fg-0">
            {money(selected.unitPrice.value, selected.unitPrice.currency)}
          </span>
        ) : null}
      </div>

      {error ? <p className="mt-3 text-sm text-accent-red">{error}</p> : null}
      <p className="mt-3 text-xs text-fg-3">Secure checkout is hosted by Fourthwall.</p>
    </div>
  );
}
