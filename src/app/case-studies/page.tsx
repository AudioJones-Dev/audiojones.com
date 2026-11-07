import type { Metadata } from "next";
import Image from "next/image";
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
  "How Florida Ramp & Lift turned 5 missed quotes a month into 5 new sales a month with an AI-transcribed business line that logs every call in the CRM and follows up automatically.";

export const metadata: Metadata = buildMetadata({
  title: "Case Study: Florida Ramp & Lift",
  description: DESCRIPTION,
  path: "/case-studies",
});

export default function CaseStudiesPage() {
  return (
    <>
      <SignalHero
        title="From 5 missed quotes a month to 5 new sales."
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
            <article key={study.client} id={study.slug} className="aj-product-card scroll-mt-28 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <Image
                  src={study.logo.src}
                  alt=""
                  width={study.logo.width}
                  height={study.logo.height}
                  className="mb-5 h-14 w-auto"
                />
                <h3 className="font-accent text-3xl font-bold tracking-[-0.02em] text-fg-0">
                  {study.client}
                </h3>
                <p className="mt-2 text-sm text-fg-2">{study.industry}</p>
                <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-[0.14em] text-fg-3">Before</dt>
                    <dd className="mt-1 font-accent text-3xl font-bold text-[var(--aj-orange)]">{study.before}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-[0.14em] text-fg-3">After</dt>
                    <dd className="mt-1 font-accent text-3xl font-bold text-[var(--aj-success)]">{study.after}</dd>
                  </div>
                </dl>
                <figure className="mt-8 border-l-2 border-[var(--aj-amber)] pl-5">
                  <blockquote className="text-lg leading-8 text-fg-0">&ldquo;{study.quote}&rdquo;</blockquote>
                  <figcaption className="mt-2 text-sm text-fg-2">{study.quoteBy}</figcaption>
                </figure>
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
