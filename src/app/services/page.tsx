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

const steps = [
  ["Assess", "Establish the symptoms, business context, and likely constraints."],
  ["Diagnose", "Document how work happens, then locate the real operating failure."],
  ["Architect", "Define the future-state workflow, information, roles, rules, boundaries, and controls."],
  ["Install", "Implement the approved process, application, integration, automation, AI, or reporting layer."],
  ["Improve", "Measure adoption and operating results, then revise using validated evidence."],
] as const;

export const metadata: Metadata = buildMetadata({
  title: "How We Work | Business Systems Consulting",
  description: "From operating problem to working system: assess, diagnose, architect, install, and improve.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <SignalHero
        title="From operating problem to working system."
        description="We do not begin with a software recommendation. We begin by documenting what the business is trying to accomplish, how work happens today, where context is lost, and which rules or exceptions the current process cannot handle."
        primaryHref={ctaLinks.founderIntelligenceDiagnostic}
        primaryLabel="Start the Founder Intelligence Diagnostic"
        secondaryHref="/solutions"
        secondaryLabel="View Solutions"
      />
      <DarkSection>
        <SectionIntro
          label="How we work"
          title="Diagnosis before technology."
          description="The public engagement path stays simple. Underneath it, structured elicitation, modeling, validation, design, implementation, and measurement make the recommendations defensible."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
          {steps.map(([title, description], index) => (
            <ProductCard key={title} title={title} description={description} meta={String(index + 1).padStart(2, "0")} />
          ))}
        </div>
      </DarkSection>
      <DarkSection className="bg-bg-1">
        <div className="grid gap-10 lg:grid-cols-2">
          <SectionIntro
            label="Business Systems Discovery"
            title="Operational knowledge becomes evidence before it becomes architecture."
            description="Discovery may combine guided assessments, stakeholder interviews, workflow walkthroughs, document review, software review, process observation, exception analysis, and information review. Questionnaire output alone is not treated as verified requirements."
          />
          <SectionIntro
            label="Implementation"
            title="The architecture determines what gets built."
            description="The result may be process redesign, a custom application, a portal, an integration, automation, an AI system, business memory, a dashboard, ResponseOS, or no build at all."
          />
        </div>
      </DarkSection>
      <FinalCta
        title="Understand the business first. Architect the system second."
        description="Start with the Founder Intelligence Diagnostic when the recurring breakdown is visible but the right solution is not."
        primaryLabel="Start the Founder Intelligence Diagnostic"
        primaryHref={ctaLinks.founderIntelligenceDiagnostic}
        secondaryLabel="See the Commercial Path"
        secondaryHref="/solutions"
      />
    </>
  );
}
