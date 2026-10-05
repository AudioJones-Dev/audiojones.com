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

const patterns = [
  ["Customer response and routing", "A recurring response, qualification, routing, follow-up, or recovery breakdown may support a ResponseOS installation after the workflow and ownership model are validated."],
  ["Asset custody and install readiness", "Equipment ordering, project association, freight, package counts, custody, configuration, readiness gates, field installation, and reimbursement must be modeled as one operating system before software is selected."],
  ["Business memory and exception handling", "Scattered SOPs and tribal knowledge become useful only when approved rules, definitions, exceptions, ownership, and maintenance responsibilities are designed together."],
] as const;

const evidenceStructure = [
  "Business context",
  "Observed operating problem",
  "Discovery method",
  "Evidence reviewed",
  "Current-state model",
  "Architectural decision",
  "What changed",
  "Implementation",
  "Measured result",
  "Evidence note",
] as const;

export const metadata: Metadata = buildMetadata({
  title: "System Patterns and Business Systems Evidence",
  description: "Proof of how a business was understood—not just what was built. Current examples are labeled as system patterns until publishable evidence is available.",
  path: "/case-studies",
});

export default function CaseStudiesPage() {
  return (
    <>
      <SignalHero
        title="Proof of how the business was understood—not just what was built."
        description="Each case should show the operating problem, discovery evidence, current-state model, architectural decision, implementation, and measured change. Current examples are labeled as System Patterns until substantiated client evidence can be published."
        primaryHref={ctaLinks.founderIntelligenceDiagnostic}
        primaryLabel="Start the Founder Intelligence Diagnostic"
        secondaryHref="/solutions"
        secondaryLabel="View Solutions"
      />
      <DarkSection>
        <SectionIntro
          label="System Patterns"
          title="Useful operating patterns, without fabricated proof."
          description="These examples show the kinds of systems problems Audio Jones can diagnose and architect. They are not presented as verified client results."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {patterns.map(([title, description]) => <ProductCard key={title} title={title} description={description} meta="System pattern" />)}
        </div>
      </DarkSection>
      <LightProofSection>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--aj-blue-deep)]">Required case structure</p>
            <h2 className="mt-4 font-accent text-[clamp(2.25rem,4vw,4rem)] font-bold leading-[1.02] tracking-[-0.035em]">Evidence before claims.</h2>
            <p className="mt-5 text-lg leading-8 text-[#4b5563]">A publishable case must distinguish what was observed, what was inferred, what was changed, and what the available data can actually support.</p>
          </div>
          <ol className="grid gap-3 sm:grid-cols-2">
            {evidenceStructure.map((item, index) => <li key={item} className="aj-proof-card"><span className="mr-3 font-mono text-sm text-[var(--aj-blue-deep)]">{String(index + 1).padStart(2, "0")}</span>{item}</li>)}
          </ol>
        </div>
      </LightProofSection>
      <FinalCta
        title="Start with your operating evidence."
        description="The Founder Intelligence Diagnostic establishes the current-state system before a solution or performance claim is proposed."
        primaryLabel="Start the Founder Intelligence Diagnostic"
        primaryHref={ctaLinks.founderIntelligenceDiagnostic}
        secondaryLabel="Discuss a Known Systems Problem"
        secondaryHref="/book-a-call"
      />
    </>
  );
}
