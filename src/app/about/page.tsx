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
import { breadcrumbJsonLd, organizationJsonLd, personJsonLd } from "@/lib/seo/schema";
import { ctaLinks } from "@/config/links";

const principles = [
  ["Understand before recommending", "Understand the current system before recommending the next one."],
  ["Include the people doing the work", "Include the people who perform the work, not only the people who approve it."],
  ["Design for exceptions", "Design for exceptions, not only the ideal path."],
  ["Use technology deliberately", "Use technology only where it improves a defined operating outcome."],
  ["Measure the changed work", "Measure whether the new system actually changed the work."],
] as const;

export const metadata: Metadata = buildMetadata({
  title: "Strategy, Operations, and Implementation",
  description: "Audio Jones works between founders, operators, and technical systems to turn operating reality into implementable business systems architecture.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={personJsonLd()} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", url: "/" }, { name: "About", url: "/about" }])} />
      <SignalHero
        title="Strategy, operations, and implementation in one working relationship."
        description="Audio Jones works between the founder, the operators who know the daily reality, and the technical systems that must support them. The job is to ask the right questions, make hidden rules and dependencies visible, and carry the resulting architecture into implementation."
        primaryHref={ctaLinks.founderIntelligenceDiagnostic}
        primaryLabel="Start the Founder Intelligence Diagnostic"
        secondaryHref="/solutions"
        secondaryLabel="View Solutions"
      />
      <DarkSection>
        <SectionIntro
          label="The working relationship"
          title="One line of accountability from discovery through implementation."
          description="Business analysis is separated from tool preference, but not from delivery. The same operating model that supports the recommendation also governs what is implemented and how it is measured."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <ProductCard title="Founder context" description="Clarify the business objective, constraint, risk, and decision that must be made." />
          <ProductCard title="Operator reality" description="Learn from the people who perform the work, handle the exceptions, and reconcile the systems." />
          <ProductCard title="Technical implementation" description="Translate the validated future state into process, application, integration, automation, AI, and measurement decisions." />
        </div>
      </DarkSection>
      <LightProofSection>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--aj-blue-deep)]">Working principles</p>
            <h2 className="mt-4 font-accent text-[clamp(2.25rem,4vw,4rem)] font-bold leading-[1.02] tracking-[-0.035em]">The system must survive contact with the real work.</h2>
          </div>
          <div className="grid gap-4">
            {principles.map(([title, copy]) => <div key={title} className="aj-proof-card"><h3 className="font-accent text-xl font-bold">{title}</h3><p className="mt-2 leading-7 text-[#4b5563]">{copy}</p></div>)}
          </div>
        </div>
      </LightProofSection>
      <FinalCta
        title="Bring the operating reality into the room."
        description="Start with discovery when the breakdown is recurring but the right system decision is still unclear."
        primaryLabel="Start the Founder Intelligence Diagnostic"
        primaryHref={ctaLinks.founderIntelligenceDiagnostic}
        secondaryLabel="Discuss a Known Systems Problem"
        secondaryHref="/book-a-call"
      />
    </>
  );
}
