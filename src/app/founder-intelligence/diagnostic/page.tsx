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
  title: "Founder Intelligence Diagnostic | Business Systems Discovery",
  description:
    "Understand what is breaking before deciding what to build. Map workflows, information, decisions, exceptions, systems, and the future-state architecture.",
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
            Understand what is breaking before deciding what to build.
          </h1>
          <p className="mt-4 text-lg text-text-muted">
            The Founder Intelligence Diagnostic maps how work enters the
            business, how information moves, where decisions stall, which
            exceptions create risk, and what future-state system would remove
            the constraint.
          </p>
        </div>
      </section>

      <section className="bg-bg-base pb-24">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <div className="mb-10 rounded-xl border border-border-subtle bg-surface-1 p-6 sm:p-8">
            <Eyebrow>Business Systems Discovery</Eyebrow>
            <h2 className="mt-4 t-h3 text-fg-0">
              A decision-ready diagnosis of the current operating system and
              the next system decision.
            </h2>
            <p className="mt-4 t-body text-fg-2">
              Structured assessment responses begin the evidence-gathering
              process. Findings are validated through interviews, records,
              systems, documents, observation, or other appropriate evidence;
              questionnaire output alone is not treated as verified requirements.
            </p>
            <h3 className="mt-8 t-h4 text-fg-0">Potential deliverables</h3>
            <ul className="mt-4 grid gap-3 t-body text-fg-2 sm:grid-cols-2">
              {[
                "Current-State Operating Map",
                "Stakeholder and Handoff Map",
                "Business Rules and Exception Register",
                "Information and System Map",
                "Priority Gap Analysis",
                "Future-State Architecture",
                "Implementation Recommendation",
              ].map((item) => <li key={item}>— {item}</li>)}
            </ul>
            <div className="mt-8">
              <FAQ items={founderIntelligenceFaqs} />
            </div>
          </div>
          <DiagnosticForm />
          <p className="mt-6 text-center t-small text-fg-3">
            Reviewed personally. No tool recommendation before diagnosis.
          </p>
        </div>
      </section>
    </>
  );
}
