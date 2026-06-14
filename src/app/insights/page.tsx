import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/founder-intelligence/Breadcrumbs";
import FinalCTA from "@/components/founder-intelligence/FinalCTA";
import JsonLd from "@/components/seo/JsonLd";
import { INSIGHTS } from "@/content/insights";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/schema";

export const metadata: Metadata = buildMetadata({
  title: "Insights | Audio Jones",
  description:
    "Pillar essays on Founder Intelligence Systems, signal vs noise, AI failure modes, and marketing attribution for founder-led businesses.",
  path: "/insights",
});

export default function InsightsIndex() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Insights", url: "/insights" },
        ])}
      />
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Insights" }]} />

      <section className="bg-bg-base pt-20 pb-12">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-signal-yellow">
            Insights
          </p>
          <h1 className="text-balance text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Essays on Founder Intelligence, signal architecture, and the
            business systems behind useful AI.
          </h1>
        </div>
      </section>

      <section className="bg-bg-base pb-24">
        <div className="mx-auto grid max-w-4xl gap-4 px-5 sm:px-8">
          {INSIGHTS.map((i) => (
            <Link
              key={i.slug}
              href={`/insights/${i.slug}`}
              className="group rounded-xl border border-border-subtle bg-surface-1 p-7 transition hover:border-border-strong"
            >
              <h2 className="text-2xl font-semibold text-white">{i.title}</h2>
              <p className="mt-3 text-text-muted">{i.excerpt}</p>
              <p className="mt-5 text-sm font-semibold text-white opacity-70 group-hover:opacity-100">
                Read the essay →
              </p>
            </Link>
          ))}
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
