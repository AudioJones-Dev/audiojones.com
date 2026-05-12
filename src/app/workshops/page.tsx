import type { Metadata } from "next";
import {
  DarkSection,
  FinalCta,
  LightProofSection,
  ProductCard,
  SectionIntro,
  SignalHero,
} from "@/components/marketing/DesignSystemSections";
import { workshops } from "@/data/audiojones-design";
import { buildMetadata } from "@/lib/seo/metadata";

const DESCRIPTION =
  "Operator workshops for founders and teams building AI readiness, revenue recovery, and signal-over-noise business systems.";

export const metadata: Metadata = buildMetadata({
  title: "Workshops",
  description: DESCRIPTION,
  path: "/workshops",
});

export default function WorkshopsPage() {
  return (
    <>
      <SignalHero
        title="Workshops for operators building real AI systems."
        description={DESCRIPTION}
        primaryHref="/book-a-call"
        primaryLabel="Book a Call"
        secondaryHref="/ai-readiness-diagnostic"
        secondaryLabel="Start the Diagnostic"
        stats={[
          { metric: "Live", label: "Working sessions built around your operating reality." },
          { metric: "Systems", label: "Each workshop outputs a map, constraint, and next action." },
          { metric: "Signal", label: "No generic AI prompts, no tool-first curriculum." },
        ]}
      />

      <DarkSection>
        <SectionIntro
          label="Workshop Tracks"
          title="Education that becomes operating infrastructure."
          description="Each session is designed to help a founder-led team see the system they are already running, then decide what intelligence layer belongs on top of it."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {workshops.map((workshop) => (
            <ProductCard
              key={workshop.title}
              title={workshop.title}
              description={workshop.description}
              meta={workshop.format}
            />
          ))}
        </div>
      </DarkSection>

      <LightProofSection>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0088cc]">
              Working Session Output
            </p>
            <h2 className="mt-4 font-accent text-[clamp(2.25rem,4vw,4rem)] font-bold leading-[1.02] tracking-[-0.035em]">
              The deliverable is a clearer operating decision.
            </h2>
          </div>
          <div className="grid gap-4">
            {[
              ["System map", "A visual view of where work enters, moves, stalls, and gets measured."],
              ["Readiness score", "A practical read on data, process, SOP, ownership, and adoption maturity."],
              ["Next system", "A prioritized path into diagnostic, ResponseOS, services, or internal implementation."],
            ].map(([title, copy]) => (
              <div key={title} className="aj-proof-card">
                <h3 className="font-accent text-2xl font-bold">{title}</h3>
                <p className="mt-3 leading-7 text-[#4b5563]">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </LightProofSection>

      <FinalCta
        title="Bring the signal into the room."
        description="Use a workshop when the team needs shared clarity before committing to a systems buildout."
        primaryLabel="Book a Call"
        primaryHref="/book-a-call"
        secondaryLabel="Start the Diagnostic"
        secondaryHref="/ai-readiness-diagnostic"
      />
    </>
  );
}
