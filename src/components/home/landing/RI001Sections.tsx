import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ctaLinks } from "@/config/links";

const PROBLEM_SIGNALS = [
  {
    title: "Follow-up breaks",
    description:
      "Earned demand cools while ownership, timing, and next actions remain unclear.",
  },
  {
    title: "Attribution stops at the source",
    description:
      "Reports name a channel without explaining what caused the outcome or what to do next.",
  },
  {
    title: "Decisions stay with the founder",
    description:
      "Context lives in conversations and memory, so the team cannot act consistently without escalation.",
  },
  {
    title: "Work repeats without compounding",
    description:
      "The team stays active, but the same handoff, knowledge, and execution problems return.",
  },
] as const;

const CAPABILITIES = [
  {
    title: "See",
    description:
      "Understand where demand, revenue, and operating friction are actually coming from.",
    href: "/frameworks/map-attribution",
  },
  {
    title: "Remember",
    description:
      "Preserve decisions, customer context, and operating knowledge beyond one person.",
    href: "/insights/business-memory",
  },
  {
    title: "Decide",
    description:
      "Turn scattered information into a prioritized operating blueprint.",
    href: "/founder-intelligence",
  },
  {
    title: "Act",
    description:
      "Install reliable follow-up, routing, reporting, and AI-supported workflows.",
    href: "/solutions",
  },
] as const;

const COMMERCIAL_PATH = [
  {
    step: "01",
    title: "Founder Intelligence Diagnostic",
    description: "Identify the real constraint and the evidence behind it.",
  },
  {
    step: "02",
    title: "Operating Blueprint",
    description: "Define the system, ownership, handoffs, and measures that should exist.",
  },
  {
    step: "03",
    title: "Founder Intelligence System",
    description: "Implement the approved design around the existing business and stack.",
  },
  {
    step: "04",
    title: "Operating Support",
    description: "Measure and strengthen the system where ongoing support is justified.",
  },
] as const;

export function ProblemFramingSection() {
  return (
    <section
      id="problem"
      className="relative border-t border-[var(--line-2)] bg-bg-0 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="max-w-3xl">
          <Eyebrow>What A Signal Problem Looks Like</Eyebrow>
          <h2 className="mt-4 t-h1 text-balance">
            Your business is busy. But it cannot reliably tell you what is working.
          </h2>
          <p className="mt-5 t-lead text-fg-2">
            That is not simply a marketing or effort problem. It is a
            visibility, memory, judgment, and follow-through problem.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {PROBLEM_SIGNALS.map((item, index) => (
            <article key={item.title} className="aj-data-panel p-7 sm:p-8">
              <div className="flex items-start gap-5">
                <span className="font-mono text-xs text-signal-yellow">
                  0{index + 1}
                </span>
                <div>
                  <h3 className="t-h4 text-fg-0">{item.title}</h3>
                  <p className="mt-3 t-body text-fg-2">{item.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CapabilitiesSection() {
  return (
    <section id="capabilities" className="surface-light aj-bg-grid-light py-24 sm:py-32">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="max-w-3xl">
          <Eyebrow tone="blue">Operating Capabilities</Eyebrow>
          <h2 className="mt-4 t-h1 text-balance">
            Fix the capability that is constraining the business.
          </h2>
          <p className="mt-5 t-lead text-fg-2">
            Some businesses leak revenue. Some lose knowledge. Some cannot
            trust their numbers. The diagnostic determines which capability
            matters first.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {CAPABILITIES.map((capability) => (
            <Link
              key={capability.title}
              href={capability.href}
              className="group flex h-full flex-col rounded-[var(--r-card)] border border-[var(--line-2)] bg-white/75 p-7 transition-colors hover:border-[var(--system)]"
            >
              <h3 className="t-h4">{capability.title}</h3>
              <p className="mt-3 flex-1 t-body text-fg-2">
                {capability.description}
              </p>
              <span className="mt-6 font-mono text-xs font-medium uppercase tracking-[0.14em] text-[var(--system)]">
                Explore <span aria-hidden>→</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CommercialPathSection() {
  return (
    <section id="commercial-path" className="border-t border-[var(--line-2)] bg-bg-0 py-24 sm:py-32">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="max-w-xl">
            <Eyebrow>The Engagement Path</Eyebrow>
            <h2 className="mt-4 t-h1 text-balance">
              From confusion to a working system.
            </h2>
            <p className="mt-5 t-lead text-fg-2">
              You do not begin by buying another product. You begin by
              understanding the constraint, then designing the system that
              should exist.
            </p>
            <ButtonLink
              href={ctaLinks.founderIntelligenceDiagnostic}
              variant="glow"
              className="mt-8"
            >
              Start the Founder Intelligence Diagnostic
            </ButtonLink>
          </div>

          <ol className="grid gap-4">
            {COMMERCIAL_PATH.map((item) => (
              <li
                key={item.step}
                className="grid gap-4 rounded-[var(--r-card)] border border-[var(--line-2)] bg-bg-1 p-6 sm:grid-cols-[56px_1fr] sm:p-7"
              >
                <span className="font-mono text-sm text-signal-yellow">
                  {item.step}
                </span>
                <div>
                  <h3 className="t-h4 text-fg-0">{item.title}</h3>
                  <p className="mt-2 t-body text-fg-2">{item.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function TrustSection() {
  return (
    <section id="about" className="relative overflow-hidden border-t border-[var(--line-2)] bg-bg-1 py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-grid-fine opacity-40" aria-hidden />
      <div className="relative mx-auto grid max-w-[1280px] gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:items-center">
        <div>
          <Eyebrow tone="blue">Audio Jones + AJ Digital</Eyebrow>
          <h2 className="mt-4 t-h1 text-balance">
            Strategy you can understand. Systems your team can operate.
          </h2>
        </div>
        <div className="aj-card-signal">
          <div className="aj-card-inner">
            <p className="t-body-lg text-fg-1">
              Audio Jones is the public voice of the work: direct
              explanations, practical frameworks, and founder-level guidance.
            </p>
            <p className="mt-5 t-body text-fg-2">
              AJ Digital LLC is the operating company behind the research,
              system design, and implementation. The goal is not dependency on
              another agency. It is a business that operates with greater
              clarity and consistency.
            </p>
            <Link href="/about" className="aj-btn-intel mt-8">
              About Audio Jones
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
