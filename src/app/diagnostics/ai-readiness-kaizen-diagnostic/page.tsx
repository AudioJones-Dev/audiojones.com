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
  "A paid operational diagnostic that maps AI readiness, revenue leakage, process friction, automation opportunities, risks, and a practical implementation roadmap.";

const FAQS = [
  {
    question: "How is this different from the free Online AI Readiness Diagnostic?",
    answer:
      "The free route is a scorecard and lead qualification layer. This paid diagnostic is a deeper operational assessment that produces a roadmap and implementation prescription.",
  },
  {
    question: "How is this different from the AI Readiness Kaizen Workshop?",
    answer:
      "The workshop is the education and alignment layer. The paid diagnostic inspects the business in more depth and produces findings, risks, priorities, and a 30-day and 90-day implementation path.",
  },
  {
    question: "What can this route to next?",
    answer:
      "It can route to Founder Intelligence Systems, ResponseOS, ReKonr OS, Business Memory System, AI Executive Assistant, Operational Intelligence Retainer, or another Agent OS solution.",
  },
];

const deliverables = [
  "Executive summary",
  "AI Readiness Scorecard",
  "Revenue leak report",
  "Process friction map",
  "Tool and workflow inventory",
  "Automation opportunity matrix",
  "Risk register",
  "30-day action plan",
  "90-day roadmap",
] as const;

export const metadata: Metadata = buildMetadata({
  title: "AI Readiness Kaizen Diagnostic",
  description: DESCRIPTION,
  path: "/diagnostics/ai-readiness-kaizen-diagnostic",
});

export default function AiReadinessKaizenDiagnosticPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Online AI Readiness Diagnostic", url: "/ai-readiness-diagnostic" },
          {
            name: "AI Readiness Kaizen Diagnostic",
            url: "/diagnostics/ai-readiness-kaizen-diagnostic",
          },
        ])}
      />
      <JsonLd data={faqJsonLd(FAQS)} />
      <SignalHero
        title="Go deeper than a score before you automate the business."
        description={DESCRIPTION}
        primaryHref="/book-a-call"
        primaryLabel="Book a Revenue Leak Diagnostic"
        secondaryHref="/ai-readiness-diagnostic"
        secondaryLabel="Start with the Free Scorecard"
        stats={[
          { metric: "Paid", label: "Deeper operational assessment and roadmap." },
          { metric: "90 days", label: "Implementation sequence across fix, standardize, automate, augment." },
          { metric: "Boundary", label: "Clarifies what AI should, should not, and must never touch." },
        ]}
      />

      <DarkSection>
        <SectionIntro
          label="Paid Diagnostic"
          title="This is the programmatic assessment layer."
          description="The paid diagnostic is deeper than the free Online AI Readiness Diagnostic. It maps operational reality, identifies risks, and produces a practical roadmap before AI, automation, or Agent OS implementation."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {deliverables.map((deliverable) => (
            <div key={deliverable} className="aj-product-card">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-[var(--aj-blue)]">
                Deliverable
              </p>
              <h3 className="mt-3 font-accent text-2xl font-bold tracking-[-0.02em] text-fg-0">
                {deliverable}
              </h3>
            </div>
          ))}
        </div>
      </DarkSection>

      <LightProofSection>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--aj-blue-deep)]">
              Methodology
            </p>
            <h2 className="mt-4 font-accent text-[clamp(2.25rem,4vw,4rem)] font-bold leading-[1.02] tracking-[-0.035em]">
              Diagnose before automating.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#4b5563]">
              The paid diagnostic follows a structured sequence so the business improves before it automates: discovery, operational mapping, AI readiness assessment, Kaizen analysis, and roadmap design.
            </p>
          </div>
          <div className="grid gap-4">
            {[
              ["Discovery", "Understand the model, revenue flows, team structure, tools, bottlenecks, and goals."],
              ["Operational mapping", "Map lead flow, sales flow, delivery flow, handoffs, communication, and reporting."],
              ["Readiness assessment", "Score people, process, technology, information, and security maturity."],
              ["Kaizen analysis", "Identify waste, friction, bottlenecks, standardization needs, and safe automation candidates."],
              ["Roadmap design", "Prioritize fix, standardize, automate, augment, and transform work."],
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
          label="Funnel Placement"
          title="The paid diagnostic sits downstream of the free scorecard and workshop."
          description="Qualified prospects may enter from the Online AI Readiness Diagnostic, AI Readiness Kaizen Workshop, a founder-led discovery call, a referral, or an existing client relationship."
        />
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/workshops/ai-readiness-kaizen-workshop" variant="secondary">
            View the Workshop
          </ButtonLink>
          <ButtonLink href="/agents/responseos" variant="secondary">
            View ResponseOS
          </ButtonLink>
        </div>
      </DarkSection>

      <DarkSection>
        <SectionIntro
          label="FAQ"
          title="Use this when a score is not enough."
          description="The paid diagnostic is the deeper assessment layer after the online scorecard or workshop path."
        />
        <div className="mt-10">
          <FAQ items={FAQS} />
        </div>
      </DarkSection>

      <FinalCta
        title="Build the roadmap before the system."
        description="Use the paid diagnostic when the business needs a practical roadmap before AI, automation, Agent OS, or retainer implementation."
        primaryLabel="Book a Revenue Leak Diagnostic"
        primaryHref="/book-a-call"
        secondaryLabel="Start with the Free Scorecard"
        secondaryHref="/ai-readiness-diagnostic"
      />
    </>
  );
}
