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
  ["ResponseOS", "Customer response, qualification, routing, follow-up, and recovery when that workflow is the diagnosed constraint.", "Proven application"],
  ["SignalOS", "A conceptual pattern for separating meaningful operating signals from activity and reporting noise.", "Capability pattern"],
  ["ContentOS and PodcastOS", "Conceptual patterns for governed publishing and media workflows when authority production is an operating requirement.", "Capability pattern"],
  ["ClientOS", "A conceptual pattern for onboarding, delivery visibility, ownership, and handoff control.", "Capability pattern"],
  ["SalesOS", "A conceptual pattern for qualification, booking, sales handoffs, and follow-up control.", "Capability pattern"],
  ["Business-memory agents", "A capability pattern for retrieving approved SOPs, definitions, decisions, and rules within defined authority boundaries.", "Capability pattern"],
] as const;

const boundaries = [
  ["Defined responsibility", "The agent owns a specific, approved responsibility—not a vague promise to run the business."],
  ["Approved information", "Sources, definitions, freshness, access, and system-of-record status are explicit."],
  ["Authority limits", "The system knows what it may decide, what requires review, and when it must stop."],
  ["Failure behavior", "Exceptions, uncertainty, unavailable systems, and unsafe conditions have designed outcomes."],
  ["Human handoffs", "Escalation includes the context the next person needs to act."],
  ["Measurement", "Performance is tied to a defined workflow and operating outcome."],
] as const;

export const metadata: Metadata = buildMetadata({
  title: "AI Workflow and Agent Systems Consulting",
  description: "AI systems built for defined business responsibilities after workflows, information sources, authority boundaries, handoffs, and failure conditions are understood.",
  path: "/agents",
});

export default function AgentsPage() {
  return (
    <>
      <SignalHero
        title="AI systems built for defined business responsibilities."
        description="An AI agent is not the starting point. It becomes appropriate only after the workflow, information sources, authority boundaries, handoffs, and failure conditions are understood."
        primaryHref={ctaLinks.founderIntelligenceDiagnostic}
        primaryLabel="Start the Founder Intelligence Diagnostic"
        secondaryHref="/agents/responseos"
        secondaryLabel="Explore ResponseOS"
      />
      <DarkSection>
        <SectionIntro
          label="Capability patterns"
          title="Architectural possibilities, not a suite every customer should buy."
          description="These patterns illustrate how AI may support a validated future-state system. Only ResponseOS is presented here as a proven named application; the others are capability patterns, not deployment claims."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {patterns.map(([title, description, meta]) => <ProductCard key={title} title={title} description={description} meta={meta} href={title === "ResponseOS" ? "/agents/responseos" : undefined} />)}
        </div>
      </DarkSection>
      <LightProofSection>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--aj-blue-deep)]">Agent architecture</p>
            <h2 className="mt-4 font-accent text-[clamp(2.25rem,4vw,4rem)] font-bold leading-[1.02] tracking-[-0.035em]">Useful autonomy requires explicit boundaries.</h2>
            <p className="mt-5 text-lg leading-8 text-[#4b5563]">AI is used when it improves a defined workflow, decision, or operating outcome. It is not always the answer.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {boundaries.map(([title, copy]) => <div key={title} className="aj-proof-card"><h3 className="font-accent text-xl font-bold">{title}</h3><p className="mt-2 leading-7 text-[#4b5563]">{copy}</p></div>)}
          </div>
        </div>
      </LightProofSection>
      <FinalCta
        title="Do not start with an agent. Start with the responsibility."
        description="Business Systems Discovery determines whether AI belongs in the workflow and what boundaries it requires."
        primaryLabel="Start the Founder Intelligence Diagnostic"
        primaryHref={ctaLinks.founderIntelligenceDiagnostic}
        secondaryLabel="View Solutions"
        secondaryHref="/solutions"
      />
    </>
  );
}
