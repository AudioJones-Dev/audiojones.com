import type { Metadata } from "next";
import {
  DarkSection,
  FinalCta,
  LightProofSection,
  SectionIntro,
  SignalConsole,
  SignalHero,
} from "@/components/marketing/DesignSystemSections";
import { ButtonLink } from "@/components/ui/Button";
import { proofSignals, responseOsFlow } from "@/data/audiojones-design";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo/schema";
import { buildMetadata } from "@/lib/seo/metadata";

const DESCRIPTION =
  "ResponseOS is revenue recovery infrastructure for founder-led businesses that need faster response, better qualification, and measurable follow-up.";

export const metadata: Metadata = buildMetadata({
  title: "ResponseOS Revenue Recovery Infrastructure",
  description: DESCRIPTION,
  path: "/agents/responseos",
});

const FAQS: Array<[string, string]> = [
  [
    "Is this a chatbot?",
    "No. A chat interface can be one input, but ResponseOS is the operational layer behind capture, qualification, routing, and recovery.",
  ],
  [
    "Who is it for?",
    "Founder-led businesses with enough inbound demand to feel the cost of slow follow-up, unclear ownership, or scattered response channels.",
  ],
  [
    "What comes first?",
    "The ROI calculator or diagnostic. The system should be justified by the size and urgency of the revenue leak.",
  ],
  [
    "Does it replace the team?",
    "No. It gives the team cleaner signal, faster next actions, and a more accountable follow-up path.",
  ],
];

export default function ResponseOsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Agents", url: "/agents" },
          { name: "ResponseOS", url: "/agents/responseos" },
        ])}
      />
      <JsonLd
        data={faqJsonLd(FAQS.map(([question, answer]) => ({ question, answer })))}
      />

      <SignalHero
        title="ResponseOS turns missed demand into a recovery path."
        description={DESCRIPTION}
        primaryHref="/roi-calculator"
        primaryLabel="Calculate Lost Revenue"
        secondaryHref="/book-a-call"
        secondaryLabel="Book a Call"
        stats={proofSignals}
      >
        <SignalConsole />
      </SignalHero>

      <DarkSection>
        <SectionIntro
          label="The Leak"
          title="Slow follow-up is an infrastructure problem."
          description="Missed calls, open forms, unqualified messages, and owner-dependent response habits create the same failure pattern: demand exists, but the business cannot turn it into a reliable next action."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            ["Inbound scatter", "Lead signals live across forms, phone, email, social, chat, and scheduling tools."],
            ["No qualification layer", "The team cannot quickly separate high-intent opportunities from low-signal activity."],
            ["No recovery memory", "When follow-up fails, the business rarely knows what was lost or why."],
          ].map(([title, copy]) => (
            <div key={title} className="aj-product-card">
              <h3 className="font-accent text-2xl font-bold tracking-[-0.02em] text-fg-0">
                {title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-fg-2">{copy}</p>
            </div>
          ))}
        </div>
      </DarkSection>

      <DarkSection className="bg-bg-1">
        <SectionIntro
          label="How It Works"
          title="Capture, qualify, route, recover."
          description="ResponseOS is not a chatbot. It is a follow-up control plane for high-intent demand."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-4">
          {responseOsFlow.map((item) => (
            <div key={item.step} className="aj-card-signal">
              <div className="aj-card-inner">
                <p className="font-mono text-sm font-bold text-[var(--aj-orange)]">
                  {item.step}
                </p>
                <h3 className="mt-4 font-accent text-2xl font-bold text-fg-0">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-fg-2">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </DarkSection>

      <LightProofSection>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0088cc]">
              ROI Snapshot
            </p>
            <h2 className="mt-4 font-accent text-[clamp(2.25rem,4vw,4rem)] font-bold leading-[1.02] tracking-[-0.035em]">
              The business case starts with the cost of the gap.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#4b5563]">
              ResponseOS is scoped after the revenue leak is estimated. Use the calculator to quantify missed opportunities, slow response, rework, and readiness drag.
            </p>
            <div className="mt-8">
              <ButtonLink href="/roi-calculator" variant="glow">
                Calculate Lost Revenue
              </ButtonLink>
            </div>
          </div>
          <div className="grid gap-4">
            {[
              ["Input", "Missed calls, forms, DMs, emails, and booking events."],
              ["Intelligence", "Intent scoring, fit indicators, urgency, source, and next action."],
              ["Output", "Booking route, operator task, nurture path, and recovery reporting."],
            ].map(([title, copy]) => (
              <div key={title} className="aj-proof-card">
                <h3 className="font-accent text-2xl font-bold">{title}</h3>
                <p className="mt-3 leading-7 text-[#4b5563]">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </LightProofSection>

      <DarkSection>
        <SectionIntro
          label="FAQ"
          title="Built for operators, not tool collectors."
          description="ResponseOS is installed around your existing stack where possible. The goal is a reliable recovery path, not another disconnected dashboard."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {FAQS.map(([question, answer]) => (
            <div key={question} className="rounded-2xl border border-[var(--line-2)] bg-bg-2 p-6">
              <h3 className="font-accent text-xl font-bold text-fg-0">
                {question}
              </h3>
              <p className="mt-3 text-sm leading-7 text-fg-2">{answer}</p>
            </div>
          ))}
        </div>
      </DarkSection>

      <FinalCta
        title="Recover the revenue already trying to reach you."
        description="Estimate the leak, then decide whether ResponseOS is the right infrastructure layer."
        primaryLabel="Calculate Lost Revenue"
        primaryHref="/roi-calculator"
        secondaryLabel="Book a Call"
        secondaryHref="/book-a-call"
      />
    </>
  );
}
