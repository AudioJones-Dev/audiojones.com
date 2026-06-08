import type { Metadata } from "next";
import {
  DarkSection,
  FinalCta,
  LightProofSection,
  SectionIntro,
  SignalHero,
} from "@/components/marketing/DesignSystemSections";
import { ButtonLink } from "@/components/ui/Button";
import { diagnosticDimensions } from "@/data/audiojones-design";
import { buildMetadata } from "@/lib/seo/metadata";

const DESCRIPTION =
  "Assess business systems, data maturity, automation gaps, follow-up speed, and readiness for AI-powered execution.";

export const metadata: Metadata = buildMetadata({
  title: "AI Readiness Diagnostic",
  description: DESCRIPTION,
  path: "/ai-readiness-diagnostic",
});

export default function AiReadinessDiagnosticPage() {
  return (
    <>
      <SignalHero
        title="Diagnose the system before you install AI."
        description={DESCRIPTION}
        primaryHref="/founder-intelligence-system/diagnostic"
        primaryLabel="Start the Diagnostic"
        secondaryHref="/book-a-call"
        secondaryLabel="Book a Call"
        stats={[
          { metric: "6", label: "Readiness dimensions across workflow, data, SOP, and adoption." },
          { metric: "Tiered", label: "Outputs classify whether to nurture, audit, build, or consult." },
          { metric: "Action", label: "Every result points to a next-best process." },
        ]}
      />

      <DarkSection>
        <SectionIntro
          label="Diagnostic Surface"
          title="A business MRI, not a generic form."
          description="The diagnostic reads the operating system behind the company: how work enters, how decisions happen, where follow-up breaks, and whether the team can absorb an intelligence layer."
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
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0088cc]">
              Result Routing
            </p>
            <h2 className="mt-4 font-accent text-[clamp(2.25rem,4vw,4rem)] font-bold leading-[1.02] tracking-[-0.035em]">
              The result should activate the next process.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#4b5563]">
              A useful diagnostic does not stop at a score. It classifies readiness, identifies the bottleneck, and routes the prospect toward the right system or service path.
            </p>
          </div>
          <div className="grid gap-4">
            {[
              ["Foundation", "Clarify process, ownership, SOPs, and source-of-truth before automation."],
              ["Growth", "Audit attribution, follow-up, and pipeline signal before scaling activity."],
              ["AI readiness", "Prioritize data, workflow, and adoption layers needed for implementation."],
              ["AI scaling", "Move from isolated wins to durable agent systems and measurement loops."],
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
            Diagnostic Entry
          </p>
          <h2 className="mt-4 font-accent text-3xl font-bold tracking-[-0.03em] text-fg-0 sm:text-4xl">
            Ready to run the assessment?
          </h2>
          <p className="mt-4 text-lg leading-8 text-fg-2">
            The active diagnostic flow is available now. Use it to create the readiness profile and route the next process.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/founder-intelligence-system/diagnostic" variant="glow">
              Start the Diagnostic
            </ButtonLink>
            <ButtonLink href="/roi-calculator" variant="secondary">
              Calculate Lost Revenue
            </ButtonLink>
          </div>
        </div>
      </DarkSection>

      <FinalCta
        title="Do not automate the wrong constraint."
        description="Start with diagnosis, then route the business into the right revenue, signal, content, operations, or pipeline system."
        primaryLabel="Start the Diagnostic"
        primaryHref="/founder-intelligence-system/diagnostic"
        secondaryLabel="Book a Call"
        secondaryHref="/book-a-call"
      />
    </>
  );
}
