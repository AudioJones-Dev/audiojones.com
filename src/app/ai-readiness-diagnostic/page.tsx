import type { Metadata } from "next";
import {
  DarkSection,
  FinalCta,
  LightProofSection,
  SectionIntro,
  SignalHero,
} from "@/components/marketing/DesignSystemSections";
import { ButtonLink } from "@/components/ui/Button";
import FAQ from "@/components/founder-intelligence/FAQ";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { faqJsonLd } from "@/lib/seo/schema";

const diagnosticDimensions = [
  "Clear steps for each job",
  "Facts your team can trust",
  "Fast, clear follow-up",
  "Written steps and rules (SOPs)",
  "Tools that share information",
  "A team ready to use the system",
];

const DESCRIPTION =
  "Find where work gets stuck and whether AI can help. Review your team's steps, tools, data, and follow-up before you spend on a build.";

export const metadata: Metadata = buildMetadata({
  title: "AI Readiness Diagnostic",
  description: DESCRIPTION,
  path: "/ai-readiness-diagnostic",
});

const DIAGNOSTIC_FAQS = [
  {
    question: "What is the AI Readiness Diagnostic?",
    answer:
      "A structured review of your business before any AI goes in. It checks where revenue leaks, where work gets repeated, and whether your data and workflows are ready for automation.",
  },
  {
    question: "Why diagnose before installing AI?",
    answer:
      "AI needs clear steps and good information. We check for gaps first so you can decide whether to fix the process, connect your tools, or add AI.",
  },
  {
    question: "What do I get from it?",
    answer:
      "The online form starts a review of your business and goals. If there is a fit, we discuss the scope of a diagnostic. It is not an instant report or a completed paid assessment.",
  },
  {
    question: "Who should take it?",
    answer:
      "Founder-led service businesses considering AI but unsure where it fits, or why earlier tools never stuck.",
  },
  {
    question: "What happens after the diagnostic?",
    answer:
      "We review the gaps and agree on what to fix first. Any paid work has an agreed scope and price before it starts.",
  },
];

export default function AiReadinessDiagnosticPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(DIAGNOSTIC_FAQS)} />
      <SignalHero
        title="Find what needs fixing before you add AI."
        description={DESCRIPTION}
        primaryHref="/founder-intelligence/diagnostic"
        primaryLabel="Request a Diagnostic"
        secondaryHref="/book-a-call"
        secondaryLabel="Book a Call"
        stats={[
          { metric: "6", label: "Steps about your business, tools, and goals." },
          { metric: "Review", label: "Share where work gets stuck and what you have tried." },
          { metric: "Action", label: "Discuss the next step if there is a fit." },
        ]}
      />

      <DarkSection>
        <SectionIntro
          label="What we review"
          title="Start with how work gets done."
          description="We look at how a lead or job comes in, who handles it, and where it gets stuck. We check the data and rules your team would need to use AI well."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {diagnosticDimensions.map((dimension) => (
            <div key={dimension} className="aj-product-card">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-[var(--aj-blue)]">
                Review area
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
              Possible next steps
            </p>
            <h2 className="mt-4 font-accent text-[clamp(2.25rem,4vw,4rem)] font-bold leading-[1.02] tracking-[-0.035em]">
              Choose a next step that fits the gap.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#4b5563]">
              Some teams need clear steps. Others need better data or connected tools. A diagnostic helps choose what to work on first.
            </p>
          </div>
          <div className="grid gap-4">
            {[
              ["Foundation", "Set clear steps and owners. Keep agreed rules in one trusted place."],
              ["Growth", "Check follow-up and which efforts lead to sales before adding more work."],
              ["AI readiness", "Check the data, steps, and training your team needs to use AI."],
              ["AI scaling", "Expand what works, with clear limits and checks for each AI task."],
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
            Request a review
          </p>
          <h2 className="mt-4 font-accent text-3xl font-bold tracking-[-0.03em] text-fg-0 sm:text-4xl">
            Tell us where work gets stuck.
          </h2>
          <p className="mt-4 text-lg leading-8 text-fg-2">
            Answer six steps about your business. Audio Jones reviews your request and follows up if there is a strong fit.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/founder-intelligence/diagnostic" variant="glow">
              Request a Diagnostic
            </ButtonLink>
            <ButtonLink href="/roi-calculator" variant="secondary">
              Calculate Lost Revenue
            </ButtonLink>
          </div>
        </div>
      </DarkSection>

      <DarkSection>
        <SectionIntro
          label="FAQ"
          title="Common questions"
          description="Plain answers about the diagnostic and what it does for your business."
        />
        <div className="mx-auto mt-10 max-w-3xl">
          <FAQ items={DIAGNOSTIC_FAQS} />
        </div>
      </DarkSection>

      <FinalCta
        title="Find the first issue to fix."
        description="Share where time or sales are lost. We will review your request before discussing any paid work."
        primaryLabel="Request a Diagnostic"
        primaryHref="/founder-intelligence/diagnostic"
        secondaryLabel="Book a Call"
        secondaryHref="/book-a-call"
      />
    </>
  );
}
