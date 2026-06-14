import type { Metadata } from "next";
import Link from "next/link";

import JsonLd from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { fourthwallPublic, isStorefrontConfigured } from "@/lib/fourthwall/config";
import { formatMoney, getAllProducts } from "@/lib/fourthwall/storefront";
import type { FourthwallProduct } from "@/lib/fourthwall/types";
import { breadcrumbJsonLd } from "@/lib/seo/schema";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Merch",
  description:
    "Eightee20 Society and Audio Jones merch — signal, systems, and operator identity. Wear the signal.",
  path: "/merch",
});

function priceLabel(product: FourthwallProduct): string {
  const prices = product.variants.map((v) => v.unitPrice).filter(Boolean);
  if (prices.length === 0) return "";
  const min = Math.min(...prices.map((p) => p.value));
  return `From ${formatMoney(min, prices[0].currency)}`;
}

export default async function MerchPage() {
  const configured = isStorefrontConfigured();
  const products = configured ? await getAllProducts() : [];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Merch", url: "/merch" },
        ])}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-bg-base py-16 sm:py-24">
        <div aria-hidden className="absolute inset-0 bg-grid-fine opacity-25" />
        <div aria-hidden className="absolute inset-0 bg-glow-signal opacity-60" />
        <div className="relative mx-auto max-w-[1180px] px-5 sm:px-8">
          <p className="t-label">Merch · Fourthwall</p>
          <h1 className="mt-5 max-w-3xl t-h1">
            Wear the <span className="text-signal-yellow">signal.</span>
          </h1>
          <p className="mt-6 max-w-2xl t-body-lg">
            Eightee20 Society and Audio Jones identity — signal over noise,
            operator mode, founder intelligence. Identity and culture for the
            people building the systems.
          </p>
        </div>
      </section>

      {/* Catalog */}
      <section className="border-t border-border-subtle bg-surface-1 py-16">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
          {products.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => {
                const img = product.images?.[0];
                return (
                  <Link key={product.id} href={`/merch/${product.slug}`} className="aj-card group block overflow-hidden p-0">
                    <div className="aspect-square w-full overflow-hidden bg-surface-2">
                      {img ? (
                        // eslint-disable-next-line @next/next/no-img-element -- external Fourthwall CDN, host not allowlisted for next/image
                        <img
                          src={img.transformedUrl || img.url}
                          alt={product.name}
                          className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                          loading="lazy"
                        />
                      ) : null}
                    </div>
                    <div className="p-5">
                      <h3 className="t-h4">{product.name}</h3>
                      <p className="mt-2 text-sm text-signal-yellow">{priceLabel(product)}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="mx-auto max-w-2xl text-center">
              <p className="t-label">Store</p>
              <h2 className="mt-4 t-h3">The drop is loading in.</h2>
              <p className="mt-4 t-body-lg text-fg-2">
                {configured
                  ? "No products are published yet. Check back soon."
                  : "The merch store isn't connected in this environment yet."}
              </p>
              {fourthwallPublic.checkoutUrl ? (
                <div className="mt-8">
                  <ButtonLink href={fourthwallPublic.checkoutUrl} variant="secondary">
                    Visit the store
                  </ButtonLink>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
