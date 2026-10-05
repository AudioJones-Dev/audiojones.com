import type { Metadata } from "next";
import {
  DarkSection,
  LightProofSection,
  ProductCard,
  SectionIntro,
  SignalHero,
} from "@/components/marketing/DesignSystemSections";
import { buildMetadata } from "@/lib/seo/metadata";
import { ctaLinks } from "@/config/links";

export const metadata: Metadata = buildMetadata({
  title: "Discuss an Operating Problem",
  description: "Bring a recurring breakdown in workflow, information, ownership, delivery, or customer response and determine the right next step.",
  path: "/book-a-call",
});

export default function BookACallPage() {
  return (
    <>
      <SignalHero
        title="Bring a known operating problem. Leave with the right next step."
        description="This conversation is for founders and operators who can point to a recurring breakdown in workflow, information, ownership, delivery, or customer response. We will determine whether the appropriate next step is discovery, architecture, implementation, or no build at all."
        primaryHref="/apply"
        primaryLabel="Discuss a Known Systems Problem"
        secondaryHref={ctaLinks.founderIntelligenceDiagnostic}
        secondaryLabel="Start the Diagnostic"
      />
      <DarkSection>
        <SectionIntro
          label="Conversation criteria"
          title="Bring the recurring breakdown—not a preferred tool."
          description="The most useful starting point is a real operating condition that can be examined. A software request without operating context may be redirected to discovery first."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <ProductCard title="The breakdown" description="Describe where work, information, ownership, delivery, or customer response repeatedly fails." />
          <ProductCard title="The context" description="Identify who performs the work, which systems are involved, and what the failure costs or delays." />
          <ProductCard title="The next decision" description="Leave with a recommendation for discovery, architecture, implementation, or no build at all." />
        </div>
      </DarkSection>
      <LightProofSection>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--aj-blue-deep)]">No tool recommendation before diagnosis</p>
          <h2 className="mt-4 font-accent text-[clamp(2.25rem,4vw,4rem)] font-bold leading-[1.02] tracking-[-0.035em]">If the problem is still unclear, start with the Founder Intelligence Diagnostic.</h2>
        </div>
      </LightProofSection>
    </>
  );
}
