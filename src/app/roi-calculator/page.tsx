import type { Metadata } from "next";
import Link from "next/link";
import FAQ from "@/components/founder-intelligence/FAQ";
import RoiCalculator from "@/components/roi-calculator/RoiCalculator";
import { ctaLinks } from "@/config/links";
import { buildMetadata } from "@/lib/seo/metadata";
import JsonLd from "@/components/seo/JsonLd";
import RegistryBreadcrumbs from "@/components/nav/RegistryBreadcrumbs";
import { faqJsonLd, organizationJsonLd, webSiteJsonLd } from "@/lib/seo/schema";
import { founderIntelligenceFaqs } from "@/lib/seo/founder-intelligence-faq";

export const metadata: Metadata = buildMetadata({
  title: "Revenue Leak Scorecard",
  description:
    "Measure the economic value of missed calls, slow follow-up, unworked quotes, and operational labor — priced against your local labor market and gross profit.",
  path: "/roi-calculator",
});

export default function RoiCalculatorPage() {
  return (
    <>
      <RegistryBreadcrumbs pageId="roi-calculator" />
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={webSiteJsonLd()} />
      <JsonLd data={faqJsonLd(founderIntelligenceFaqs)} />

      <section className="bg-bg-0 py-24 sm:py-32">
        <div className="mx-auto grid max-w-[1280px] gap-10 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--metric)]">Revenue Leak Scorecard</p>
            <h1 className="mt-5 t-h1">We don't calculate AI hype. We measure revenue leakage.</h1>
            <p className="mt-6 t-lead text-fg-2">
              The economic value of missed calls, slow follow-up, unworked quotes, and operational labor — priced against your actual workload, gross profit, and local labor market.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a className="btn-glow" href="#diagnostic">Score My Revenue Leaks</a>
              <Link
                href={ctaLinks.signalDiagnostic}
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-[var(--line-2)] px-5 py-3 text-sm font-semibold text-fg-1 transition hover:border-[var(--line-3)] hover:text-fg-0 focus-visible:[box-shadow:0_0_0_2px_var(--aj-blue-bright)]"
              >
                Take Signal Diagnostic
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-[var(--line-2)] bg-bg-2 p-6 sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--metric)]">Four economic layers</p>
            <div className="mt-6 grid gap-4">
              {[
                ["Labor capacity", "Operational hours priced at local loaded labor cost, with only the addressable share counted."],
                ["Revenue leakage", "Gross-profit value of missed calls, after-hours demand, and quotes nobody followed up."],
                ["Conversion opportunity", "Incremental gross profit from faster response, modeled separately from leakage already counted."],
                ["Owner capacity", "Founder hours on operational work, read two ways: local replacement cost and redirected founder time."],
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

      <section className="bg-bg-0 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--metric)]">
            Direct Answer
          </p>
          <h2 className="mt-4 t-h2 text-fg-0">
            The scorecard models economic exposure before the Revenue Leak
            Diagnostic validates it.
          </h2>
          <p className="mt-4 t-body-lg text-fg-2">
            It is for founder-led service businesses where missed calls, slow
            follow-up, unworked quotes, and operational labor are hiding
            measurable gross profit and operating capacity. Every figure is a
            modeled estimate with its assumptions and benchmark sources shown.
          </p>
          <div className="mt-8">
            <FAQ items={founderIntelligenceFaqs} />
          </div>
        </div>
      </section>
    </>
  );
}
