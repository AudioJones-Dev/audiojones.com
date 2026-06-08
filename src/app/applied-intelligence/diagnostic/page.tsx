import type { Metadata } from "next";
import FAQ from "@/components/applied-intelligence/FAQ";
import DiagnosticForm from "@/components/applied-intelligence/DiagnosticForm";
import Breadcrumbs from "@/components/applied-intelligence/Breadcrumbs";
import { Eyebrow } from "@/components/ui/Eyebrow";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo/schema";
import { founderIntelligenceFaqs } from "@/lib/seo/founder-intelligence-faq";

export const metadata: Metadata = buildMetadata({
  title: "Strategic Diagnostic | Applied Intelligence",
  description:
    "Apply for an Applied Intelligence Diagnostic. Six steps that map your constraint, signal architecture, AI readiness, and attribution clarity.",
  path: "/applied-intelligence/diagnostic",
});

export default function DiagnosticPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Applied Intelligence", url: "/applied-intelligence" },
          { name: "Diagnostic", url: "/applied-intelligence/diagnostic" },
        ])}
      />
      <JsonLd data={faqJsonLd(founderIntelligenceFaqs)} />
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Applied Intelligence", href: "/applied-intelligence" },
          { name: "Diagnostic" },
        ]}
      />

      <section className="bg-bg-base pt-16 pb-10">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <div className="mb-3">
            <Eyebrow withLine>Strategic Diagnostic</Eyebrow>
          </div>
          <h1 className="text-balance text-3xl font-semibold leading-tight text-text-primary sm:text-4xl">
            Tell me where your business actually leaks signal.
          </h1>
          <p className="mt-4 text-lg text-text-muted">
            Six short steps. I review every submission personally and reply
            within two business days if there’s a strong fit.
          </p>
        </div>
      </section>

      <section className="bg-bg-base pb-24">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <div className="mb-10 rounded-xl border border-border-subtle bg-surface-1 p-6 sm:p-8">
            <Eyebrow>Direct Answer</Eyebrow>
            <h2 className="mt-4 t-h3 text-fg-0">
              The Applied Intelligence Diagnostic maps the revenue and
              operating leaks hidden in follow-up, CRM, attribution, and
              business memory.
            </h2>
            <p className="mt-4 t-body text-fg-2">
              It is built for founder-led service businesses that need clarity
              on what to fix before adding another AI tool or automation layer.
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
