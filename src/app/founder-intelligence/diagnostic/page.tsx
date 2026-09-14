import type { Metadata } from "next";
import FAQ from "@/components/founder-intelligence/FAQ";
import DiagnosticForm from "@/components/founder-intelligence/DiagnosticForm";
import Breadcrumbs from "@/components/founder-intelligence/Breadcrumbs";
import { Eyebrow } from "@/components/ui/Eyebrow";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo/schema";
import { founderIntelligenceFaqs } from "@/lib/seo/founder-intelligence-faq";

export const metadata: Metadata = buildMetadata({
  title: "Request a Diagnostic | Founder Intelligence",
  description:
    "Request a Founder Intelligence Diagnostic. Tell us where leads, work, or decisions get stuck so we can review the next step with you.",
  path: "/founder-intelligence/diagnostic",
});

export default function DiagnosticPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Founder Intelligence", url: "/founder-intelligence" },
          { name: "Diagnostic", url: "/founder-intelligence/diagnostic" },
        ])}
      />
      <JsonLd data={faqJsonLd(founderIntelligenceFaqs)} />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Founder Intelligence", href: "/founder-intelligence" },
          { name: "Diagnostic" },
        ]}
      />

      <section className="bg-bg-base pt-16 pb-10">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <div className="mb-3">
            <Eyebrow withLine>Founder Intelligence Diagnostic</Eyebrow>
          </div>
          <h1 className="text-balance text-3xl font-semibold leading-tight text-text-primary sm:text-4xl">
            Where does work get stuck in your business?
          </h1>
          <p className="mt-4 text-lg text-text-muted">
            Six steps about your business, tools, and goals. I review each request
            and reply within two business days if there is a strong fit. This
            starts a review; it does not give you an instant report.
          </p>
        </div>
      </section>

      <section className="bg-bg-base pb-24">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <div className="mb-10 rounded-xl border border-border-subtle bg-surface-1 p-6 sm:p-8">
            <Eyebrow>Direct Answer</Eyebrow>
            <h2 className="mt-4 t-h3 text-fg-0">
              Find where time and sales are lost, then choose what to fix first.
            </h2>
            <p className="mt-4 t-body text-fg-2">
              The Founder Intelligence Diagnostic looks at how leads, jobs, and
              decisions move through your business. We check follow-up, customer
              records, shared knowledge, and reporting. Scope and price for any
              paid work are agreed before it starts.
            </p>
            <div className="mt-8">
              <FAQ items={founderIntelligenceFaqs} />
            </div>
          </div>
          <DiagnosticForm />
        </div>
      </section>
    </>
  );
}
