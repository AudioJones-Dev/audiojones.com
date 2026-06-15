import type { Metadata } from "next";
import {
  DarkSection,
  FinalCta,
  LightProofSection,
  SectionIntro,
  SignalHero,
} from "@/components/marketing/DesignSystemSections";
import FAQ from "@/components/founder-intelligence/FAQ";
import JsonLd from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { diagnosticDimensions } from "@/data/audiojones-design";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo/schema";

const DESCRIPTION =
  "A free lead-generation assessment and online AI readiness scorecard for founder-led service businesses that need to see whether their workflows, data, documentation, and team habits are ready for AI.";

const FAQS = [
  {
    question: "Is this the paid AI Readiness Kaizen Diagnostic?",
    answer:
      "No. This is the free online readiness scorecard and lead qualification route. The paid diagnostic is a deeper operational assessment with a roadmap and implementation prescription.",
  },
  {
    question: "What happens after the scorecard?",
    answer:
      "The result should point you toward the AI Readiness Kaizen Workshop, the paid AI Readiness Kaizen Diagnostic, an Agent OS solution, or a nurture path if the business is not ready yet.",
  },
  {
    question: "What does the free diagnostic check?",
    answer:
      "It checks process maturity, documentation, tool clarity, data quality, reporting visibility, follow-up reliability, human ownership, and adoption capacity.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: "Online AI Readiness Diagnostic",
  description: DESCRIPTION,
  path: "/ai-readiness-diagnostic",
});

export default function AiReadinessDiagnosticPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Online AI Readiness Diagnostic", url: "/ai-readiness-diagnostic" },
        ])}
      />
      <JsonLd data={faqJsonLd(FAQS)} />
      <SignalHero
        title="Check AI readiness before you buy another tool."
        description={DESCRIPTION}
        primaryHref="/workshops/ai-readiness-kaizen-workshop"
        primaryLabel="Review the Workshop Path"
        secondaryHref="/diagnostics/ai-readiness-kaizen-diagnostic"
        secondaryLabel="See the Paid Diagnostic"
        stats={[
          { metric: "Free", label: "Lead-gen scorecard and readiness screen." },
          { metric: "3 paths", label: "Workshop, paid diagnostic, or Agent OS qualification." },
          { metric: "No tools", label: "The first job is classification, not software selection." },
        ]}
      />

      <DarkSection>
        <SectionIntro
          label="Free Lead Gen"
          title="This is the online scorecard, not the paid diagnostic."
          description="The free route gives the business a readiness signal. It should separate education needs, operational cleanup, deeper assessment, and implementation interest before anyone buys a tool."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {diagnosticDimensions.map((dimension) => (
            <div key={dimension} className="aj-product-card">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-[var(--aj-blue)]">
                Signal Score
              </p>
              <h3 className="mt-3 font-accent text-2xl font-bold tracking-[-0.02em] text-fg-0">
                {dimension}
              </h3>
            </div>
          ))}
        </div>
      </DarkSection>

      <LightProofSection>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--aj-blue-deep)]">
              Result Routing
            </p>
            <h2 className="mt-4 font-accent text-[clamp(2.25rem,4vw,4rem)] font-bold leading-[1.02] tracking-[-0.035em]">
              The free scorecard should route to the right next step.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#4b5563]">
              A useful readiness screen does not pretend to solve the whole operation. It classifies the business and shows whether education, deeper diagnosis, or implementation is the next practical move.
            </p>
          </div>
          <div className="grid gap-4">
            {[
              ["Workshop", "Use when the founder or team needs shared language, education, and guided improvement before deeper work."],
              ["Paid diagnostic", "Use when operational complexity, revenue leakage, or implementation risk needs a roadmap."],
              ["Agent OS", "Use when the workflow is mature enough for a scoped system or managed implementation."],
              ["Nurture", "Use when the business is interested but not ready for paid diagnosis or implementation."],
            ].map(([title, copy]) => (
              <div key={title} className="aj-proof-card">
                <h3 className="font-accent text-2xl font-bold">{title}</h3>
                <p className="mt-3 leading-7 text-[#4b5563]">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </LightProofSection>

      <DarkSection className="bg-bg-1">
        <div className="aj-form-panel mx-auto max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--aj-orange)]">
            Next-Step Routes
          </p>
          <h2 className="mt-4 font-accent text-3xl font-bold tracking-[-0.03em] text-fg-0 sm:text-4xl">
            Pick the next layer based on readiness.
          </h2>
          <p className="mt-4 text-lg leading-8 text-fg-2">
            The online diagnostic is the free front door. From here, move into education, a paid diagnostic, or direct implementation only when the operating reality supports it.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/workshops/ai-readiness-kaizen-workshop" variant="glow">
              View the Workshop
            </ButtonLink>
            <ButtonLink href="/diagnostics/ai-readiness-kaizen-diagnostic" variant="secondary">
              View the Paid Diagnostic
            </ButtonLink>
          </div>
        </div>
      </DarkSection>

      <DarkSection>
        <SectionIntro
          label="FAQ"
          title="Keep the free scorecard separate from the paid diagnostic."
          description="The offer stack is designed to prevent tool-first AI adoption and route the buyer by maturity."
        />
        <div className="mt-10">
          <FAQ items={FAQS} />
        </div>
      </DarkSection>

      <FinalCta
        title="Do not automate before the work is clear."
        description="Use the free readiness route to decide whether the next step is workshop education, a paid diagnostic, or a scoped Agent OS conversation."
        primaryLabel="Review the Workshop Path"
        primaryHref="/workshops/ai-readiness-kaizen-workshop"
        secondaryLabel="See the Paid Diagnostic"
        secondaryHref="/diagnostics/ai-readiness-kaizen-diagnostic"
      />
    </>
  );
}
