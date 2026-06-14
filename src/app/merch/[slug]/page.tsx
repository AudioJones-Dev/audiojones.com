import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import BuyButton from "@/components/merch/BuyButton";
import JsonLd from "@/components/seo/JsonLd";
import { isStorefrontConfigured } from "@/lib/fourthwall/config";
import { getProductBySlug } from "@/lib/fourthwall/storefront";
import { breadcrumbJsonLd } from "@/lib/seo/schema";
import { buildMetadata } from "@/lib/seo/metadata";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = isStorefrontConfigured() ? await getProductBySlug(slug) : null;
  return buildMetadata({
    title: product ? `${product.name} — Merch` : "Merch",
    description: product?.description?.slice(0, 160) || "Audio Jones merch. Wear the signal.",
    path: `/merch/${slug}`,
  });
}

export default async function MerchProductPage({ params }: Params) {
  const { slug } = await params;
  if (!isStorefrontConfigured()) notFound();

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const hero = product.images?.[0];
  const rest = product.images?.slice(1) ?? [];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Merch", url: "/merch" },
          { name: product.name, url: `/merch/${product.slug}` },
        ])}
      />

      <section className="bg-bg-base py-12 sm:py-16">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
          <Link href="/merch" className="aj-data-label hover:text-signal-yellow">
            ← Merch
          </Link>

          <div className="mt-6 grid gap-10 lg:grid-cols-2">
            {/* Gallery */}
            <div>
              <div className="aspect-square w-full overflow-hidden rounded-xl border border-border-subtle bg-surface-2">
                {hero ? (
                  // eslint-disable-next-line @next/next/no-img-element -- external Fourthwall CDN, host not allowlisted for next/image
                  <img src={hero.transformedUrl || hero.url} alt={product.name} className="h-full w-full object-cover" />
                ) : null}
              </div>
              {rest.length > 0 ? (
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {rest.slice(0, 4).map((img) => (
                    <div key={img.id} className="aspect-square overflow-hidden rounded-lg border border-border-subtle bg-surface-2">
                      {/* eslint-disable-next-line @next/next/no-img-element -- external Fourthwall CDN */}
                      <img src={img.transformedUrl || img.url} alt="" className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Details */}
            <div>
              <h1 className="t-h2">{product.name}</h1>
              {product.description ? (
                <div className="mt-5 whitespace-pre-line t-body-lg text-fg-2">
                  {product.description}
                </div>
              ) : null}
              <BuyButton variants={product.variants} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
