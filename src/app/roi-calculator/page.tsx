import type { Metadata } from "next";
import Link from "next/link";
import RoiCalculator from "@/components/roi-calculator/RoiCalculator";
import { ctaLinks } from "@/config/links";
import { buildMetadata } from "@/lib/seo/metadata";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, organizationJsonLd, webSiteJsonLd } from "@/lib/seo/schema";

export const metadata: Metadata = buildMetadata({
  title: "AI ROI Calculator for Founder-Led Businesses",
  description:
    "Estimate potential AI ROI, readiness, and payback period before investing in automation.",
  path: "/roi-calculator",
});

export default function RoiCalculatorPage() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={webSiteJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "ROI Calculator", url: "/roi-calculator" },
        ])}
      />

      <section className="bg-bg-0 py-24 sm:py-32">
        <div className="mx-auto grid max-w-[1280px] gap-10 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--metric)]">AI ROI Calculator</p>
            <h1 className="mt-5 t-h1">Find out if AI is actually worth it for your business.</h1>
            <p className="mt-6 t-lead text-fg-2">
              Estimate potential ROI, readiness, and payback period before you invest in automation.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a className="btn-glow" href="#diagnostic">Calculate Your AI ROI</a>
              <Link
                href={ctaLinks.signalDiagnostic}
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-[var(--line-2)] px-5 py-3 text-sm font-semibold text-fg-1 transition hover:border-[var(--line-3)] hover:text-fg-0 focus-visible:[box-shadow:0_0_0_2px_var(--aj-blue-bright)]"
              >
                Take Signal Diagnostic
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-[var(--line-2)] bg-bg-2 p-6 sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--metric)]">What it estimates</p>
            <div className="mt-6 grid gap-4">
              {[
                ["Monthly savings", "Labor hours, rework cost, and cycle-time drag."],
                ["Payback period", "How quickly a reasonable implementation budget could be recovered."],
                ["Readiness score", "Process clarity, data quality, SOP maturity, tools, and adoption."],
              ].map(([title, copy]) => (
                <div key={title} className="rounded-md border border-[var(--line-1)] bg-bg-3 p-5">
                  <h2 className="t-h4">{title}</h2>
                  <p className="mt-2 text-sm leading-6 text-fg-2">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <RoiCalculator />
    </>
  );
}
