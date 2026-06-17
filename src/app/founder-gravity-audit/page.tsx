import type { Metadata } from "next";
import Link from "next/link";
import FAQ from "@/components/founder-intelligence/FAQ";
import JsonLd from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { GRAVITY_LAYERS } from "@/lib/founder-gravity-audit/content";
import { buildMetadata } from "@/lib/seo/metadata";
import { founderIntelligenceFaqs } from "@/lib/seo/founder-intelligence-faq";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo/schema";

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
      <JsonLd data={faqJsonLd(founderIntelligenceFaqs)} />

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
              It measures how much the business still runs through you — your
              decisions, approvals, follow-up, revenue, and memory. No contact
              details needed to start.
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
            <p className="t-label">What it checks</p>
            <ul className="mt-5 grid gap-3">
              {[
                "Decisions that still wait on you",
                "Approvals nothing moves without",
                "Revenue that only moves when you push",
                "Knowledge that lives only in your head",
                "Follow-up that depends on you",
                "Work that stalls when you step away",
              ].map((item) => (
                <li
                  key={item}
                  className="flex gap-3 border-b border-border-subtle pb-3 text-fg-1 last:border-b-0 last:pb-0"
                >
                  <span aria-hidden className="text-signal-yellow">
                    →
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="model" className="border-t border-border-subtle bg-surface-1 py-16">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
          <div className="max-w-3xl">
            <p className="t-label">The six things it measures</p>
            <h2 className="mt-4 t-h2">It measures how the business pulls on you — not your personality.</h2>
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
          <div className="mb-10 max-w-3xl">
            <p className="t-label">Direct Answer</p>
            <h2 className="mt-4 t-h2">
              The audit shows the jobs your business still cannot do without
              you: decide, approve, remember, follow up, and move money.
            </h2>
            <p className="mt-4 t-body-lg text-fg-2">
              The result points to the one thing to fix before you build a
              Founder Intelligence System.
            </p>
          </div>
          <div className="mb-10 max-w-3xl">
            <FAQ items={founderIntelligenceFaqs} />
          </div>
          <div className="aj-callout is-blue">
            <p className="font-headline text-xl font-bold text-fg-0">
              No credentials. No sales pressure. Just the diagnostic.
            </p>
            <p className="mt-2 text-fg-1">
              Start free and see a preview of your result. Share an email only if
              you want the full report. We never ask for phone numbers, payment,
              or CRM access to run the audit.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
