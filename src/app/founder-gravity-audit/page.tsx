import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import {
  FOUNDER_GRAVITY_ASSET,
  GRAVITY_LAYERS,
} from "@/lib/founder-gravity-audit/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/schema";

export const metadata: Metadata = buildMetadata({
  title: "Founder Gravity Audit",
  description:
    "A diagnostic for founder-led service businesses that maps operational dependency, Gravity Load, and the next operating move.",
  path: "/founder-gravity-audit",
});

export default function FounderGravityAuditPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Founder Gravity Audit", url: "/founder-gravity-audit" },
        ])}
      />

      <section className="relative overflow-hidden bg-bg-base py-16 sm:py-24">
        <div aria-hidden className="absolute inset-0 bg-grid-fine opacity-25" />
        <div aria-hidden className="absolute inset-0 bg-glow-signal opacity-60" />
        <div className="relative mx-auto grid max-w-[1180px] gap-10 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="t-label">Founder Gravity Audit</p>
            <h1 className="mt-5 max-w-4xl text-balance t-h1">
              Find where your business still orbits around you.
            </h1>
            <p className="mt-6 max-w-2xl t-body-lg">
              Founder Gravity Audit maps decision, approval, revenue, memory,
              accountability, and execution dependency before asking for
              contact information.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/founder-gravity-audit/diagnostic">
                Begin diagnostic
              </ButtonLink>
              <Link
                href="#model"
                className="aj-btn-intel"
              >
                View gravity layers
              </Link>
            </div>
          </div>

          <div className="aj-form-panel">
            <p className="t-label">Runtime Classification</p>
            <dl className="mt-5 grid gap-4">
              <Definition label="Record type" value={FOUNDER_GRAVITY_ASSET.recordType} />
              <Definition label="Asset type" value={FOUNDER_GRAVITY_ASSET.assetType} />
              <Definition label="Lane" value={FOUNDER_GRAVITY_ASSET.productizationLane} />
              <Definition label="Readiness" value={FOUNDER_GRAVITY_ASSET.productReadinessStage} />
              <Definition label="GTM motion" value={FOUNDER_GRAVITY_ASSET.gtmMotion} />
            </dl>
          </div>
        </div>
      </section>

      <section id="model" className="border-t border-border-subtle bg-surface-1 py-16">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
          <div className="max-w-3xl">
            <p className="t-label">Six-Layer Dependency Model</p>
            <h2 className="mt-4 t-h2">The audit measures operating pull, not personality.</h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(GRAVITY_LAYERS).map(([id, label]) => (
              <div key={id} className="aj-card">
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-signal-yellow">
                  {id}
                </p>
                <h3 className="mt-3 t-h4">{label}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-bg-base py-16">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
          <div className="aj-callout is-blue">
            <p className="font-headline text-xl font-bold text-fg-0">
              Funnel path: ungated start, preview reveal, email gate, full report,
              segment CTA.
            </p>
            <p className="mt-2 text-fg-1">
              This implementation keeps phone, payment, SaaS claims, and live CRM
              credentials out of the diagnostic gate.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function Definition({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-border-subtle pb-3 last:border-b-0 last:pb-0">
      <dt className="aj-data-label">{label}</dt>
      <dd className="mt-1 font-headline text-lg font-bold text-fg-0">{value}</dd>
    </div>
  );
}
