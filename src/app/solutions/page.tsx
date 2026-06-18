import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ctaLinks } from "@/config/links";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/schema";

const TITLE = "Solutions";
const DESCRIPTION =
  "What AJ Digital builds: Founder Intelligence Systems for founder-led service businesses. Diagnose with an AI Operations Audit, architect a System Blueprint, build custom applications, AI agents, and AI receptionist systems, then operate with a Managed Intelligence Retainer.";

// Canonical offer ladder. One commercial path: Diagnose → Design → Build → Operate.
// Naming follows the ratified AJ Digital canonical offer model.
type Offer = {
  name: string;
  blurb: string;
  href: string;
  cta: string;
};

type Stage = {
  step: string;
  stage: string;
  intro: string;
  offers: Offer[];
};

const STAGES: Stage[] = [
  {
    step: "01",
    stage: "Diagnose",
    intro:
      "Every engagement starts with a paid, decision-ready diagnosis — never a tool sold before the constraint is found.",
    offers: [
      {
        name: "AI Operations Audit",
        blurb:
          "A structured read of where your operations leak revenue, time, and signal — intake, follow-up, data, reporting, and decision cadence — ending in a prioritized plan for exactly what to build next.",
        href: ctaLinks.signalDiagnostic,
        cta: "Start the audit",
      },
    ],
  },
  {
    step: "02",
    stage: "Design",
    intro:
      "The audit prescribes the build. The Blueprint is the architecture before a line of work begins.",
    offers: [
      {
        name: "System Architecture & Blueprint",
        blurb:
          "The operating-system design the audit calls for: how follow-up, data, agents, and reporting connect — scoped to your stack so the build is deliberate, not improvised.",
        href: "/book-a-call",
        cta: "Scope a blueprint",
      },
    ],
  },
  {
    step: "03",
    stage: "Build",
    intro:
      "The installed systems — scoped and built per engagement around the blueprint.",
    offers: [
      {
        name: "Custom Application Builds",
        blurb:
          "Bespoke internal applications that replace spreadsheets, manual handoffs, and disconnected tools with one system the team actually runs on.",
        href: "/book-a-call",
        cta: "Discuss a build",
      },
      {
        name: "AI Agent Builds",
        blurb:
          "Production AI agents scoped to a specific workflow — responsibilities, prompts, guardrails, handoffs, and escalation paths that support the operator instead of replacing judgment.",
        href: "/agents",
        cta: "See agent systems",
      },
      {
        name: "AI Receptionist Systems",
        blurb:
          "Capture, qualify, route, and recover inbound demand across calls, forms, and messages so no lead goes cold. Productized as ResponseOS.",
        href: "/agents/responseos",
        cta: "Explore ResponseOS",
      },
    ],
  },
  {
    step: "04",
    stage: "Operate",
    intro:
      "Once the system is live, the work shifts to running it, optimizing it, and deciding what to build next.",
    offers: [
      {
        name: "Managed Intelligence Retainer",
        blurb:
          "Ongoing operation, optimization, and advisory after the install — a steady hand on priorities, measurement, and the next highest-leverage system.",
        href: "/book-a-call",
        cta: "Book a call",
      },
    ],
  },
];

// Validation-program offers — the deeper, full-system path. Presented as
// scoped/per-engagement work, not off-the-shelf commodity products.
const ADVANCED: Offer[] = [
  {
    name: "Founder Intelligence Diagnostic",
    blurb:
      "The deep operating diagnostic that maps the full Founder Intelligence System — revenue and operating leaks across follow-up, CRM, attribution, and business memory.",
    href: "/founder-intelligence/diagnostic",
    cta: "Request the diagnostic",
  },
  {
    name: "Founder Intelligence System Install",
    blurb:
      "The full installed operating intelligence layer across revenue, ops, AI, and reporting — connected into one system you can see and run.",
    href: "/founder-intelligence",
    cta: "Explore the system",
  },
];

const LADDER = ["Diagnose", "Design", "Build", "Operate"] as const;

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/solutions",
});

export default function SolutionsPage() {
  return (
    <main className="min-h-screen bg-bg-0 text-fg-0">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Solutions", url: "/solutions" },
        ])}
      />

      {/* Hero */}
      <section className="border-b border-[var(--line-2)] py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <div className="max-w-[var(--copy-max)]">
            <Eyebrow>What AJ Digital Builds</Eyebrow>
            <h1 className="mt-5 t-h1 text-balance text-fg-0">
              Founder Intelligence Systems — diagnosed, architected, and
              installed.
            </h1>
            <p className="mt-6 t-lead text-fg-2">
              One commercial path for founder-led service businesses. Start with
              an audit, architect the blueprint, build only what it prescribes,
              then operate the system as it compounds.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={ctaLinks.signalDiagnostic} variant="glow">
                Start the Diagnostic
              </ButtonLink>
              <ButtonLink href="/book-a-call" variant="secondary">
                Book a Call
              </ButtonLink>
            </div>
          </div>

          {/* Ladder strip */}
          <ol className="mt-12 flex flex-wrap items-center gap-x-3 gap-y-2 t-small text-fg-3">
            {LADDER.map((label, i) => (
              <li key={label} className="flex items-center gap-3">
                <span className="text-aj-gold">{label}</span>
                {i < LADDER.length - 1 ? (
                  <span aria-hidden className="text-fg-3">
                    →
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Stages */}
      {STAGES.map((stage, idx) => (
        <section
          key={stage.stage}
          className={
            idx % 2 === 1
              ? "bg-bg-1 py-16 sm:py-24"
              : "py-16 sm:py-24"
          }
        >
          <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
            <div className="flex items-baseline gap-4">
              <span className="t-h4 text-aj-gold">{stage.step}</span>
              <div className="max-w-3xl">
                <Eyebrow tone="blue">{stage.stage}</Eyebrow>
                <p className="mt-3 t-body-lg text-fg-2">{stage.intro}</p>
              </div>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {stage.offers.map((offer) => (
                <article
                  key={offer.name}
                  className="flex h-full flex-col rounded-2xl border border-[var(--line-2)] bg-bg-2 p-6 sm:p-8"
                >
                  <h2 className="t-h3 text-fg-0">{offer.name}</h2>
                  <p className="mt-4 flex-1 t-body text-fg-2">{offer.blurb}</p>
                  <Link
                    href={offer.href}
                    className="mt-6 inline-flex t-body text-aj-orange hover:text-aj-orange-soft"
                  >
                    {offer.cta} →
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Advanced / validation program */}
      <section className="border-t border-[var(--line-2)] py-16 sm:py-24">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <div className="max-w-3xl">
            <Eyebrow>Advanced · Validation Program</Eyebrow>
            <h2 className="mt-4 t-h2 text-balance text-fg-0">
              The full Founder Intelligence System.
            </h2>
            <p className="mt-5 t-body-lg text-fg-2">
              These are delivered as a validation program — scoped and built per
              engagement, not sold as off-the-shelf commodity products. They are
              where the audit, blueprint, and builds come together into one
              operating layer.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {ADVANCED.map((offer) => (
              <article
                key={offer.name}
                className="flex h-full flex-col rounded-2xl border border-[var(--line-2)] bg-bg-2 p-6 sm:p-8"
              >
                <h3 className="t-h3 text-fg-0">{offer.name}</h3>
                <p className="mt-4 flex-1 t-body text-fg-2">{offer.blurb}</p>
                <Link
                  href={offer.href}
                  className="mt-6 inline-flex t-body text-aj-orange hover:text-aj-orange-soft"
                >
                  {offer.cta} →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-bg-1 py-16 sm:py-24">
        <div className="mx-auto max-w-[1280px] px-5 text-center sm:px-8">
          <Eyebrow>Start here</Eyebrow>
          <h2 className="mx-auto mt-4 max-w-3xl t-h2 text-balance text-fg-0">
            Start with the audit. Build only what it prescribes.
          </h2>
          <p className="mx-auto mt-5 max-w-[var(--copy-max)] t-body-lg text-fg-2">
            The AI Operations Audit gives us the operating-system map before any
            build is scoped. See how the offers ladder, or review pricing.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href={ctaLinks.signalDiagnostic} variant="glow">
              Start the Diagnostic
            </ButtonLink>
            <ButtonLink href="/pricing" variant="secondary">
              View Pricing
            </ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}
