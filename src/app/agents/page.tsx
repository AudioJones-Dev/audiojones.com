import type { Metadata } from "next";
import {
  DarkSection,
  FinalCta,
  LightProofSection,
  ProductCard,
  SectionIntro,
  SignalHero,
} from "@/components/marketing/DesignSystemSections";
import { ButtonLink } from "@/components/ui/Button";
import VibrantCard from "@/components/ui/VibrantCard";
import { agentSystems, proofSignals } from "@/data/audiojones-design";
import { buildMetadata } from "@/lib/seo/metadata";

const TITLE = "Agent systems for business execution.";
const DESCRIPTION =
  "Audio Jones builds deployable AI infrastructure for founder-led businesses: revenue recovery, signal clarity, content operations, client delivery, and pipeline control.";

export const metadata: Metadata = buildMetadata({
  title: "Agent Systems",
  description: DESCRIPTION,
  path: "/agents",
});

export default function AgentsPage() {
  return (
    <>
      <SignalHero
        title={TITLE}
        description={DESCRIPTION}
        primaryHref="/agents/responseos"
        primaryLabel="Explore ResponseOS"
        secondaryHref="/ai-readiness-diagnostic"
        secondaryLabel="Start the Diagnostic"
        stats={proofSignals}
      />

      <DarkSection>
        <SectionIntro
          label="Agent Layer"
          title="Six operating systems. One control plane."
          description="The product architecture is organized around business functions, not generic bots. Each system fixes a specific leak in the way founder-led companies attract, qualify, respond, publish, sell, or deliver."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {agentSystems.map((agent) => (
            <ProductCard
              key={agent.name}
              title={agent.name}
              description={agent.description}
              meta={`${agent.category} / ${agent.signal}`}
              href={agent.href}
            />
          ))}
        </div>
      </DarkSection>

      <LightProofSection>
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0088cc]">
              System Comparison
            </p>
            <h2 className="mt-4 font-accent text-[clamp(2.25rem,4vw,4rem)] font-bold leading-[1.02] tracking-[-0.035em]">
              Do not buy another tool before you know the leak.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#4b5563]">
              Audio Jones starts with signal diagnosis, then installs the smallest system layer that removes the constraint.
            </p>
          </div>
          <div className="grid gap-4">
            {[
              ["Generic automation", "Task execution without context, routing, or business diagnosis."],
              ["Chatbot package", "A surface interaction that does not own the operating workflow."],
              ["Agent system", "A designed recovery path with inputs, decision logic, handoffs, and measurable outcomes."],
            ].map(([title, copy]) => (
              <div key={title} className="aj-proof-card">
                <h3 className="font-accent text-2xl font-bold tracking-[-0.02em]">
                  {title}
                </h3>
                <p className="mt-3 leading-7 text-[#4b5563]">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </LightProofSection>

      <DarkSection className="bg-bg-1">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <SectionIntro
            label="Featured System"
            title="ResponseOS is the flagship wedge."
            description="Most founder-led businesses do not lose revenue because demand is absent. They lose it because response, qualification, and follow-up are not a system."
          />
          <VibrantCard>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--signal-yellow)]">
              Revenue Recovery Infrastructure
            </p>
            <h3 className="mt-4 font-accent text-3xl font-bold tracking-[-0.03em] text-fg-0">
              Missed calls, slow replies, and scattered inboxes become one recovery path.
            </h3>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/agents/responseos" variant="glow">
                Explore ResponseOS
              </ButtonLink>
              <ButtonLink href="/roi-calculator" variant="secondary">
                Calculate Lost Revenue
              </ButtonLink>
            </div>
          </VibrantCard>
        </div>
      </DarkSection>

      <FinalCta
        title="Find the system your business is missing."
        description="Start with the AI Readiness Diagnostic, then route the strongest opportunity into the right agent system."
        primaryLabel="Start the Diagnostic"
        primaryHref="/ai-readiness-diagnostic"
        secondaryLabel="Book a Call"
        secondaryHref="/book-a-call"
      />
    </>
  );
}
