import type { Metadata } from "next";
import {
  DarkSection,
  FinalCta,
  LightProofSection,
  ProductCard,
  SectionIntro,
  SignalHero,
} from "@/components/marketing/DesignSystemSections";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, organizationJsonLd } from "@/lib/seo/schema";
import { ctaLinks } from "@/config/links";

const examples = [
  ["Project delivery", "Make ownership, readiness gates, dependencies, and exception paths visible."],
  ["Fulfillment and procurement", "Track orders, assets, configurations, custody, and project association through the operating lifecycle."],
  ["Field service", "Give installers and operators the approved context required at the point of work."],
  ["Onboarding and approvals", "Preserve decisions, required information, and handoffs as responsibility changes."],
  ["Customer response", "Route qualification, follow-up, and recovery through a defined operating system."],
  ["Operational exceptions", "Design for the conditions that break the ideal path, not only the happy path."],
] as const;

const professionalMethod = [
  ["Elicit", "Gather knowledge from the people, records, tools, and work itself."],
  ["Model", "Represent the current workflow, information, rules, ownership, and exceptions."],
  ["Validate", "Check the model against evidence and the people who perform the work."],
  ["Design", "Define the future state, boundaries, controls, and implementation plan."],
  ["Implement", "Install the approved operating and technology changes."],
  ["Measure", "Evaluate adoption and outcomes, then update the system."],
] as const;

export const metadata: Metadata = buildMetadata({
  title: "Founder Intelligence Systems | Business Operating Knowledge",
  description: "Founder Intelligence turns scattered operating knowledge, rules, decisions, and exceptions into a governed system the business can use.",
  path: "/founder-intelligence",
});

export default function FounderIntelligencePage() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", url: "/" }, { name: "Founder Intelligence", url: "/founder-intelligence" }])} />
      <SignalHero
        title="Founder Intelligence turns operating knowledge into a system the business can use."
        description="Every business develops its own rules, workarounds, judgment, and institutional knowledge. When that knowledge remains scattered across people, inboxes, spreadsheets, and software, growth creates inconsistency instead of leverage. A Founder Intelligence System makes the critical parts visible, structured, governed, and usable by people and approved technology."
        primaryHref={ctaLinks.founderIntelligenceDiagnostic}
        primaryLabel="Start the Founder Intelligence Diagnostic"
        secondaryHref="#method"
        secondaryLabel="See the Method"
      />

      <DarkSection>
        <SectionIntro
          label="Founder Intelligence Systems"
          title="The operating model is broader than revenue, attribution, or AI."
          description="It captures how the business makes decisions and performs work across the operation, then gives people and approved systems reliable context."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {examples.map(([title, description]) => <ProductCard key={title} title={title} description={description} />)}
        </div>
      </DarkSection>

      <LightProofSection>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--aj-blue-deep)]">What becomes visible</p>
            <h2 className="mt-4 font-accent text-[clamp(2.25rem,4vw,4rem)] font-bold leading-[1.02] tracking-[-0.035em]">Rules, dependencies, ownership, context, and exceptions stop being tribal knowledge.</h2>
          </div>
          <div className="space-y-4 text-lg leading-8 text-[#4b5563]">
            <p>Founder Intelligence is not a database of everything a founder has ever said. It is the approved operating context required to perform work and make decisions reliably.</p>
            <p>Business Memory and SOP Architecture support this system, but they do not replace process design, decision rights, information structure, or system architecture.</p>
          </div>
        </div>
      </LightProofSection>

      <DarkSection id="method">
        <SectionIntro
          label="Underlying professional method"
          title="Elicit. Model. Validate. Design. Implement. Measure."
          description="This deeper method supports the public Assess → Diagnose → Architect → Install → Improve engagement path. It is where operational claims become evidence and evidence becomes architecture."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {professionalMethod.map(([title, description], index) => <ProductCard key={title} title={title} description={description} meta={String(index + 1).padStart(2, "0")} />)}
        </div>
      </DarkSection>

      <FinalCta
        title="Make the operating reality visible before deciding what to build."
        description="The Founder Intelligence Diagnostic maps how work enters, how information moves, where decisions stall, and which future-state system would remove the constraint."
        primaryLabel="Start the Founder Intelligence Diagnostic"
        primaryHref={ctaLinks.founderIntelligenceDiagnostic}
        secondaryLabel="View Solutions"
        secondaryHref="/solutions"
      />
    </>
  );
}
