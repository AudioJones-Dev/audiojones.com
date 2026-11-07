import type { Metadata } from "next";
import {
  DarkSection,
  FinalCta,
  LightProofSection,
  ProductCard,
  SectionIntro,
  SignalHero,
} from "@/components/marketing/DesignSystemSections";
import { caseStudies, clientCaseStudies, proofSignals } from "@/data/audiojones-design";
import { buildMetadata } from "@/lib/seo/metadata";

const DESCRIPTION =
  "Operator proof for Audio Jones systems: lead capture, follow-up, content operations, attribution clarity, and business signal diagnosis.";

export const metadata: Metadata = buildMetadata({
  title: "Case Studies",
  description: DESCRIPTION,
  path: "/case-studies",
});

export default function CaseStudiesPage() {
  return (
    <>
      <SignalHero
        title="Proof should show the system, not just the result."
        description={DESCRIPTION}
        primaryHref="/founder-intelligence/diagnostic"
        primaryLabel="Start the Diagnostic"
        secondaryHref="/services"
        secondaryLabel="See Services"
        stats={proofSignals}
      />

      <DarkSection>
        <SectionIntro
          label="Client result"
          title="Signal, leak, system, result."
          description="Each case study shows what the business needed, what was getting in the way, and what changed."
        />
        <div className="mt-10 grid gap-6">
          {clientCaseStudies.map((study) => (
            <article key={study.client} className="aj-product-card grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <h3 className="font-accent text-3xl font-bold tracking-[-0.02em] text-fg-0">
                  {study.client}
                </h3>
                <p className="mt-2 text-sm text-fg-2">{study.industry}</p>
                <p className="mt-8 font-accent text-[clamp(2.5rem,5vw,4rem)] font-bold leading-none text-[var(--aj-blue)]">
                  {study.metric}
                </p>
                <p className="mt-3 text-sm leading-6 text-fg-2">{study.metricLabel}</p>
              </div>
              <dl className="grid gap-5">
                {(
                  [
                    ["Signal", study.signal],
                    ["Leak", study.leak],
                    ["System", study.system],
                    ["Result", study.result],
                  ] as const
                ).map(([label, copy]) => (
                  <div key={label}>
                    <dt className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--aj-amber)]">
                      {label}
                    </dt>
                    <dd className="mt-2 text-base leading-7 text-fg-1">{copy}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </DarkSection>

      <DarkSection>
        <SectionIntro
          label="Illustrative workflows"
          title="Other gaps the same approach fixes."
          description="These are example workflows, not client results."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {caseStudies.map((study) => (
            <ProductCard
              key={study.title}
              title={study.title}
              description={study.description}
              meta={study.outcome}
            />
          ))}
        </div>
      </DarkSection>

      <LightProofSection>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--aj-blue-deep)]">
              Proof Model
            </p>
            <h2 className="mt-4 font-accent text-[clamp(2.25rem,4vw,4rem)] font-bold leading-[1.02] tracking-[-0.035em]">
              What matters is whether the operating rhythm changed.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#4b5563]">
              Audio Jones case studies are written like system diagnosis notes: where demand entered, where clarity broke, and what control layer fixed the path.
            </p>
          </div>
          <div className="grid gap-4">
            {[
              ["Signal", "The measurable business input that should have triggered action."],
              ["Leak", "The constraint that created delay, noise, rework, or missed opportunity."],
              ["System", "The repeatable operating layer that changed the workflow."],
            ].map(([title, copy]) => (
              <div key={title} className="aj-proof-card">
                <h3 className="font-accent text-2xl font-bold">{title}</h3>
                <p className="mt-3 leading-7 text-[#4b5563]">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </LightProofSection>

      <FinalCta
        title="Find the case your business is becoming."
        description="Run the diagnostic to identify whether your constraint is revenue recovery, signal clarity, operations, content, or pipeline control."
        primaryLabel="Start the Diagnostic"
        primaryHref="/founder-intelligence/diagnostic"
        secondaryLabel="Book a Call"
        secondaryHref="/book-a-call"
      />
    </>
  );
}
