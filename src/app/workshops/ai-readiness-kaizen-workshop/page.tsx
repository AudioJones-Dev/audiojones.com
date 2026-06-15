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
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo/schema";

const DESCRIPTION =
  "A workshop for founder-led service businesses that need education, alignment, and guided improvement before adopting AI or automation.";

const FAQS = [
  {
    question: "Is this the same as the free Online AI Readiness Diagnostic?",
    answer:
      "No. The free online diagnostic is the scorecard and lead capture route. This workshop is the education and alignment layer for founders and teams.",
  },
  {
    question: "Is this the paid AI Readiness Kaizen Diagnostic?",
    answer:
      "No. The paid diagnostic is a deeper assessment with a roadmap, scorecard, revenue leak findings, process friction map, automation opportunity matrix, risk register, 30-day action plan, and 90-day roadmap.",
  },
  {
    question: "What happens after the workshop?",
    answer:
      "Participants may move into the paid AI Readiness Kaizen Diagnostic, Founder Intelligence Systems, ResponseOS, another Agent OS solution, a retainer, or a nurture path.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: "AI Readiness Kaizen Workshop",
  description: DESCRIPTION,
  path: "/workshops/ai-readiness-kaizen-workshop",
});

export default function AiReadinessKaizenWorkshopPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Workshops", url: "/workshops" },
          {
            name: "AI Readiness Kaizen Workshop",
            url: "/workshops/ai-readiness-kaizen-workshop",
          },
        ])}
      />
      <JsonLd data={faqJsonLd(FAQS)} />
      <SignalHero
        title="Teach the team what to fix before AI enters the system."
        description={DESCRIPTION}
        primaryHref="/diagnostics/ai-readiness-kaizen-diagnostic"
        primaryLabel="See the Paid Diagnostic"
        secondaryHref="/ai-readiness-diagnostic"
        secondaryLabel="Start with the Free Scorecard"
        stats={[
          { metric: "Workshop", label: "Education, alignment, and guided operational improvement." },
          { metric: "Kaizen", label: "Fix, standardize, automate, augment, then transform." },
          { metric: "No pricing", label: "Workshop pricing remains a separate decision." },
        ]}
      />

      <DarkSection>
        <SectionIntro
          label="Workshop Layer"
          title="This is not the scorecard and not the paid diagnostic."
          description="The workshop helps founders and teams understand operational friction, process gaps, tool sprawl, and automation risk before committing to deeper assessment or implementation."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "What should be fixed",
            "What should be standardized",
            "What should be automated",
            "What should be augmented by AI",
            "What should stay human",
            "What should never have AI involved",
          ].map((item) => (
            <div key={item} className="aj-product-card">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-[var(--aj-blue)]">
                Workshop Output
              </p>
              <h3 className="mt-3 font-accent text-2xl font-bold tracking-[-0.02em] text-fg-0">
                {item}
              </h3>
            </div>
          ))}
        </div>
      </DarkSection>

      <LightProofSection>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--aj-blue-deep)]">
              Working Session Path
            </p>
            <h2 className="mt-4 font-accent text-[clamp(2.25rem,4vw,4rem)] font-bold leading-[1.02] tracking-[-0.035em]">
              Education becomes a better operating decision.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#4b5563]">
              The workshop gives the buyer language and structure before a paid diagnostic or Agent OS build. It reduces tool-first urgency and creates a shared improvement map.
            </p>
          </div>
          <div className="grid gap-4">
            {[
              ["Operational lens", "Identify where workflows, handoffs, documentation, and reporting create friction."],
              ["AI boundary", "Separate safe AI augmentation from work that should remain human or requires cleanup first."],
              ["Route decision", "A practical recommendation: nurture, paid diagnostic, Agent OS, or retainer conversation."],
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
        <SectionIntro
          label="Next-Step Logic"
          title="The workshop can route serious buyers into deeper assessment."
          description="After the workshop, serious operational complexity should move into the paid diagnostic. Clear implementation opportunities can move into an Agent OS scoping path."
        />
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/diagnostics/ai-readiness-kaizen-diagnostic" variant="glow">
            See the Paid Diagnostic
          </ButtonLink>
          <ButtonLink href="/agents/responseos" variant="secondary">
            View ResponseOS
          </ButtonLink>
        </div>
      </DarkSection>

      <DarkSection>
        <SectionIntro
          label="FAQ"
          title="Workshop, scorecard, and diagnostic stay separate."
          description="The workshop is the education and alignment layer in the AI Readiness offer stack."
        />
        <div className="mt-10">
          <FAQ items={FAQS} />
        </div>
      </DarkSection>

      <FinalCta
        title="Align the room before you install the system."
        description="Use the workshop when the team needs shared understanding before a paid diagnostic, Agent OS solution, or retainer path."
        primaryLabel="See the Paid Diagnostic"
        primaryHref="/diagnostics/ai-readiness-kaizen-diagnostic"
        secondaryLabel="Start with the Free Scorecard"
        secondaryHref="/ai-readiness-diagnostic"
      />
    </>
  );
}
