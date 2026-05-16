import type { Metadata } from "next";
import BookACallEmbed from "@/components/marketing/BookACallEmbed";
import {
  DarkSection,
  LightProofSection,
  SectionIntro,
  SignalHero,
} from "@/components/marketing/DesignSystemSections";
import { buildMetadata } from "@/lib/seo/metadata";

const DESCRIPTION =
  "Schedule a diagnostic call to identify the highest-leverage AI system opportunity inside your business.";

export const metadata: Metadata = buildMetadata({
  title: "Book a Call",
  description: DESCRIPTION,
  path: "/book-a-call",
});

export default function BookACallPage() {
  return (
    <>
      <SignalHero
        title="Book the call after you know what system is missing."
        description={DESCRIPTION}
        primaryHref="/ai-readiness-diagnostic"
        primaryLabel="Start the Diagnostic"
        secondaryHref="/apply"
        secondaryLabel="Apply Async"
      >
        <BookACallEmbed />
      </SignalHero>

      <DarkSection>
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <SectionIntro
            label="Call Criteria"
            title="The best call starts with a clear operating question."
            description="Audio Jones is selective by design. The call is most useful when the business has a real workflow, revenue, or response constraint to diagnose."
          />
          <div className="aj-form-panel">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--aj-orange)]">
              Before You Book
            </p>
            <h2 className="mt-4 font-accent text-3xl font-bold tracking-[-0.03em] text-fg-0">
              Bring a constraint, not a wish list.
            </h2>
            <p className="mt-4 text-sm leading-7 text-fg-2">
              The most useful 30 minutes start with one specific bottleneck —
              follow-up speed, attribution clarity, content cadence, fulfillment
              drag. Audio Jones will diagnose it on the call and recommend the
              next system.
            </p>
          </div>
        </div>
      </DarkSection>

      <LightProofSection>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Founder-led", "Best fit for businesses where founder expertise still shapes sales, delivery, or operations."],
            ["System constraint", "The conversation should center on an operating leak, not a generic AI wish list."],
            ["Implementation path", "The output is a recommended diagnostic, service, workshop, or agent-system next step."],
          ].map(([title, copy]) => (
            <div key={title} className="aj-proof-card">
              <h3 className="font-accent text-2xl font-bold">{title}</h3>
              <p className="mt-3 leading-7 text-[#4b5563]">{copy}</p>
            </div>
          ))}
        </div>
      </LightProofSection>
    </>
  );
}
