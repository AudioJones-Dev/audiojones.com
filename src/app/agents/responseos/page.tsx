import type { Metadata } from "next";
import {
  DarkSection,
  FinalCta,
  LightProofSection,
  ProductCard,
  SectionIntro,
  SignalHero,
} from "@/components/marketing/DesignSystemSections";
import { responseOsFlow } from "@/data/audiojones-design";
import { buildMetadata } from "@/lib/seo/metadata";
import { ctaLinks } from "@/config/links";

export const metadata: Metadata = buildMetadata({
  title: "ResponseOS | Customer Response and Routing System",
  description: "ResponseOS is one proven application of the Audio Jones methodology when customer response, qualification, routing, follow-up, or recovery is the diagnosed constraint.",
  path: "/agents/responseos",
});

export default function ResponseOSPage() {
  return (
    <>
      <SignalHero
        title="ResponseOS addresses a diagnosed customer-response constraint."
        description="ResponseOS is one proven application of the broader Audio Jones methodology when customer response, qualification, routing, follow-up, or recovery is the operating problem. It is not the category of the company and is not prescribed before discovery."
        primaryHref={ctaLinks.founderIntelligenceDiagnostic}
        primaryLabel="Start with Diagnosis"
        secondaryHref="/book-a-call"
        secondaryLabel="Discuss a Response Problem"
      />
      <DarkSection>
        <SectionIntro
          label="The operating constraint"
          title="Demand creates value only when the response system can carry it."
          description="The diagnosis examines channel intake, required context, qualification rules, ownership, routing, response expectations, follow-up states, exceptions, authoritative records, and outcome measurement."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {responseOsFlow.map((item) => <ProductCard key={item.step} title={item.title} description={item.description} meta={item.step} />)}
        </div>
      </DarkSection>
      <LightProofSection>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--aj-blue-deep)]">Architecture first</p>
            <h2 className="mt-4 font-accent text-[clamp(2.25rem,4vw,4rem)] font-bold leading-[1.02] tracking-[-0.035em]">The installation follows the response model.</h2>
          </div>
          <div className="space-y-4 text-lg leading-8 text-[#4b5563]">
            <p>ResponseOS may include intake, qualification logic, routing, automation, approved AI responsibilities, human review, system integrations, dashboards, and recovery measurement.</p>
            <p>The exact implementation depends on the validated workflow and the systems already in place.</p>
          </div>
        </div>
      </LightProofSection>
      <FinalCta
        title="Confirm the response constraint before installing the system."
        description="Start with the Founder Intelligence Diagnostic, or bring a clearly defined response problem to a systems conversation."
        primaryLabel="Start the Founder Intelligence Diagnostic"
        primaryHref={ctaLinks.founderIntelligenceDiagnostic}
        secondaryLabel="Discuss a Response Problem"
        secondaryHref="/book-a-call"
      />
    </>
  );
}
