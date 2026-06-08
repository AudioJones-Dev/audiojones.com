import type { Metadata } from "next";
import Link from "next/link";
import FAQ from "@/components/founder-intelligence/FAQ";
import RoiCalculator from "@/components/roi-calculator/RoiCalculator";
import { ctaLinks } from "@/config/links";
import { buildMetadata } from "@/lib/seo/metadata";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, faqJsonLd, organizationJsonLd, webSiteJsonLd } from "@/lib/seo/schema";
import { founderIntelligenceFaqs } from "@/lib/seo/founder-intelligence-faq";

export const metadata: Metadata = buildMetadata({
  title: "Operational Waste Recovery Calculator",
  description:
    "Quantify the operational waste hiding inside manual work, slow follow-up, rework, and founder bottlenecks — before adding another AI tool.",
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
      <JsonLd data={faqJsonLd(founderIntelligenceFaqs)} />

      <section className="bg-bg-0 py-24 sm:py-32">
        <div className="mx-auto grid max-w-[1280px] gap-10 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--metric)]">Operational Waste Recovery Calculator</p>
            <h1 className="mt-5 t-h1">We don't calculate AI hype. We calculate operational waste recovery.</h1>
            <p className="mt-6 t-lead text-fg-2">
              Quantify the recovery hiding inside manual work, slow follow-up, rework, and founder bottlenecks — before adding another AI tool.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a className="btn-glow" href="#diagnostic">Calculate Your Recovery</a>
              <Link
                href={ctaLinks.signalDiagnostic}
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-[var(--line-2)] px-5 py-3 text-sm font-semibold text-fg-1 transition hover:border-[var(--line-3)] hover:text-fg-0 focus-visible:[box-shadow:0_0_0_2px_var(--aj-blue-bright)]"
              >
                Take Signal Diagnostic
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-[var(--line-2)] bg-bg-2 p-6 sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--metric)]">Five recovery levers</p>
            <div className="mt-6 grid gap-4">
              {[
                ["Manual labor recovery", "Hours pulled back from repetitive workflows your team runs every week."],
                ["Revenue recovery", "Closed-won lift from faster lead response and reduced cycle time."],
                ["Error reduction", "Preventable rework, refunds, and missed handoffs taken off the table."],
                ["Owner capacity unlocked", "Founder hours moved out of the weeds and back into strategic work."],
                ["Headcount avoidance", "Next-hire spend deferred or eliminated by tighter systems."],
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
            The calculator estimates recoverable waste before recommending a
            Founder Intelligence System.
          </h2>
          <p className="mt-4 t-body-lg text-fg-2">
            It is for founder-led service businesses where manual work, slow
            follow-up, rework, and founder bottlenecks are hiding measurable
            operating capacity.
          </p>
          <div className="mt-8">
            <FAQ items={founderIntelligenceFaqs} />
          </div>
        </div>
      </section>
    </>
  );
}
