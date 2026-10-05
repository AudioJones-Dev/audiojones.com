import type { Metadata } from "next";
import {
  DarkSection,
  FinalCta,
  ProductCard,
  SectionIntro,
  SignalHero,
} from "@/components/marketing/DesignSystemSections";
import { buildMetadata } from "@/lib/seo/metadata";
import { ctaLinks } from "@/config/links";

export const metadata: Metadata = buildMetadata({
  title: "Engagement Scope",
  description: "Audio Jones scopes business systems engagements after the operating problem, evidence requirements, boundaries, and implementation responsibilities are understood.",
  path: "/pricing",
});

const scopeFactors = [
  ["Discovery depth", "Number of workflows, stakeholders, locations, systems, records, and exceptions that must be examined."],
  ["Architecture scope", "Current-state modeling, future-state design, information structure, decision rules, system boundaries, controls, and implementation planning."],
  ["Installation responsibility", "Process changes, applications, integrations, automation, AI, migration, testing, training, and measurement required."],
  ["Ongoing operation", "Knowledge maintenance, workflow review, exception review, measurement, and iterative improvement after installation."],
] as const;

export default function PricingPage() {
  return (
    <>
      <SignalHero
        title="Scope follows diagnosis."
        description="A responsible systems engagement cannot be priced from a technology list alone. Scope depends on the operating problem, evidence required, system boundaries, implementation responsibility, and level of ongoing support."
        primaryHref={ctaLinks.founderIntelligenceDiagnostic}
        primaryLabel="Start the Founder Intelligence Diagnostic"
        secondaryHref="/solutions"
        secondaryLabel="View the Engagement Path"
      />
      <DarkSection>
        <SectionIntro
          label="Engagement scope"
          title="What determines the work."
          description="No unapproved public price or invented range is used here. A written scope follows sufficient discovery and a clear definition of the decision or system to be delivered."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {scopeFactors.map(([title, description]) => <ProductCard key={title} title={title} description={description} />)}
        </div>
      </DarkSection>
      <FinalCta
        title="Find the operating problem before pricing the implementation."
        description="The Founder Intelligence Diagnostic creates the evidence required to recommend and scope the right next step."
        primaryLabel="Start the Founder Intelligence Diagnostic"
        primaryHref={ctaLinks.founderIntelligenceDiagnostic}
        secondaryLabel="Discuss a Known Systems Problem"
        secondaryHref="/book-a-call"
      />
    </>
  );
}
