import type { Metadata } from "next";
import {
  DarkSection,
  FinalCta,
  LightProofSection,
  ProductCard,
  SectionIntro,
  SignalHero,
} from "@/components/marketing/DesignSystemSections";
import { buildMetadata } from "@/lib/seo/metadata";
import { ctaLinks } from "@/config/links";

const description =
  "Business systems consulting and implementation for founder-led service businesses. Discover how work happens, architect the right system, and build only what the evidence supports.";

const stages = [
  {
    title: "Discover",
    description: "Map how work actually happens across people, information, decisions, software, rules, handoffs, and exceptions.",
    meta: "Founder Intelligence Diagnostic",
  },
  {
    title: "Architect",
    description: "Define the future-state workflow, ownership, information structure, system boundaries, controls, and implementation blueprint.",
    meta: "Business Systems Architecture",
  },
  {
    title: "Install",
    description: "Implement the approved process, application, integration, automation, AI, business-memory, or measurement layer.",
    meta: "System Installation",
  },
  {
    title: "Improve",
    description: "Measure adoption and operating results, maintain approved knowledge, and revise the system from validated evidence.",
    meta: "Managed Intelligence",
  },
] as const;

const outputs = [
  "Current-State Operating Map",
  "Stakeholder and Handoff Map",
  "Business Rules and Exception Register",
  "Information and System Map",
  "Priority Gap Analysis",
  "Future-State Architecture",
  "Implementation Recommendation",
] as const;

const implementations = [
  ["Process redesign", "Clarify work, ownership, approvals, handoffs, and exception paths."],
  ["Applications and portals", "Build purpose-specific tools when existing software cannot support the required operation."],
  ["Integrations and automation", "Move approved information between systems and remove avoidable duplicate work."],
  ["AI systems", "Assign defined responsibilities with approved sources, authority boundaries, review gates, and failure behavior."],
  ["Business memory", "Make SOPs, rules, definitions, and approved operating context usable and maintainable."],
  ["Operational measurement", "Instrument cycle time, throughput, exceptions, response, quality, and other meaningful outcomes."],
] as const;

export const metadata: Metadata = buildMetadata({
  title: "Business Systems Consulting and Implementation",
  description,
  path: "/solutions",
});

export default function SolutionsPage() {
  return (
    <>
      <SignalHero
        title="Understand the operation. Architect the right system. Build only what the evidence supports."
        description="Audio Jones helps founder-led service businesses uncover how work actually moves across people, information, decisions, and software. We turn that operating reality into a practical blueprint—and implement the process, application, automation, integration, or AI layer the business genuinely needs."
        primaryHref={ctaLinks.founderIntelligenceDiagnostic}
        primaryLabel="Start the Founder Intelligence Diagnostic"
        secondaryHref="/founder-intelligence"
        secondaryLabel="See How the Method Works"
      />

      <DarkSection>
        <SectionIntro
          label="Business systems consulting and implementation"
          title="One progression from operating uncertainty to a working system."
          description="The engagement is organized around evidence and operating decisions, not a catalog of technologies."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {stages.map((stage) => <ProductCard key={stage.title} {...stage} />)}
        </div>
      </DarkSection>

      <LightProofSection>
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--aj-blue-deep)]">Discover first</p>
            <h2 className="mt-4 font-accent text-[clamp(2.25rem,4vw,4rem)] font-bold leading-[1.02] tracking-[-0.035em]">Map how work actually happens before deciding what to change or build.</h2>
            <p className="mt-5 text-lg leading-8 text-[#4b5563]">Structured assessments are evidence-gathering instruments, not ordinary lead forms. Findings are validated through interviews, records, systems, documents, observation, or other appropriate evidence.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {outputs.map((output) => <p key={output} className="aj-proof-card font-semibold">{output}</p>)}
          </div>
        </div>
      </LightProofSection>

      <DarkSection className="bg-bg-1">
        <SectionIntro
          label="Architecture-prescribed implementation"
          title="Technology appears after the operating decision."
          description="Not every business needs custom software, automation, or AI. These are implementation options used only when the architecture supports them."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {implementations.map(([title, copy]) => <ProductCard key={title} title={title} description={copy} />)}
        </div>
      </DarkSection>

      <DarkSection>
        <SectionIntro
          label="Proven application"
          title="ResponseOS solves one diagnosed class of operating constraint."
          description="When customer response, qualification, routing, follow-up, or recovery is the constraint, ResponseOS is one proven application of the broader Audio Jones methodology. It does not define the category of the company."
        />
      </DarkSection>

      <FinalCta
        title="Start with the operating reality."
        description="The Founder Intelligence Diagnostic identifies what is breaking, why it is breaking, and what system—if any—should be built next."
        primaryLabel="Start the Founder Intelligence Diagnostic"
        primaryHref={ctaLinks.founderIntelligenceDiagnostic}
        secondaryLabel="Discuss a Known Systems Problem"
        secondaryHref="/book-a-call"
      />
    </>
  );
}
