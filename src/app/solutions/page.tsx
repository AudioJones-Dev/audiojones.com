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
  "Business systems consulting for founder-led service businesses. Find lost time and sales, plan the first fix, and connect workflows, AI, and reporting.";

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
    step: "00",
    stage: "Free",
    intro:
      "Start by sharing where work gets stuck and what you want to change.",
    offers: [
      {
        name: "AI Readiness Score",
        blurb:
          "Review how your team works, what data you have, and where AI might fit. The online form starts a review; it is not a full paid diagnostic.",
        href: ctaLinks.signalDiagnostic,
        cta: "Explore AI readiness",
      },
    ],
  },
  {
    step: "01",
    stage: "Audit",
    intro:
      "Find the cause of lost time or sales before choosing a tool.",
    offers: [
      {
        name: "ReKonr Revenue Recovery Diagnostic",
        blurb:
          "We map the steps your work follows, check where sales are lost, and measure the starting point. You get a ranked list of fixes and a 90-day build plan.",
        href: "/pricing",
        cta: "See the audit",
      },
    ],
  },
  {
    step: "02",
    stage: "Blueprint",
    intro:
      "Agree on how the fix will work before the build starts.",
    offers: [
      {
        name: "System Architecture & Blueprint",
        blurb:
          "A plan for how people, tools, and data will work together. It sets the steps, owners, rules, and checks for the build.",
        href: "/book-a-call",
        cta: "Scope a blueprint",
      },
    ],
  },
  {
    step: "03",
    stage: "Build",
    intro:
      "Build the agreed fix around your team and the way work gets done.",
    offers: [
      {
        name: "Custom Application Build",
        blurb:
          "Custom tools for jobs your current software cannot handle well. Keep the right facts and next steps in one place so work is easier to track.",
        href: "/book-a-call",
        cta: "Discuss a build",
      },
      {
        name: "AI Agent Build",
        blurb:
          "AI given a clear task, approved sources, and limits. We define when a person must check its work or take over.",
        href: "/agents",
        cta: "See agent systems",
      },
      {
        name: "ResponseOS Revenue Recovery System",
        blurb:
          "A system for capturing leads, checking their needs, routing them, and following up. Booking, call handling, and reports are scoped to fit the gap we find.",
        href: "/agents/responseos",
        cta: "Explore ResponseOS",
      },
    ],
  },
  {
    step: "04",
    stage: "Operate",
    intro:
      "Keep the system useful as your team and business change.",
    offers: [
      {
        name: "Managed Intelligence",
        blurb:
          "Check how the system works, keep shared rules up to date, and improve the parts that need attention. Support and changes have an agreed scope.",
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
      "A deeper review of where leads, jobs, and decisions get stuck. We look at follow-up, customer records, shared knowledge, and what your reports can tell you.",
    href: "/founder-intelligence/diagnostic",
    cta: "Request the diagnostic",
  },
  {
    name: "Founder Intelligence System",
    blurb:
      "For founder-led service businesses: connect the team's work, customer records, shared knowledge, AI, and reports. Set clear owners and a way to check results.",
    href: "/founder-intelligence",
    cta: "Explore the system",
  },
];

const LADDER = ["Free", "Audit", "Blueprint", "Build", "Operate"] as const;

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
              Fix the gaps that cost you time and sales.
            </h1>
            <p className="mt-6 t-lead text-fg-2">
              Missed leads, stuck jobs, and repeat work can have different causes.
              We help founder-led service businesses find the first issue to
              fix, agree on a plan, and build what the team needs.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/founder-intelligence/diagnostic" variant="glow">
                Request a Diagnostic
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
              A connected system for founder-led service businesses.
            </h2>
            <p className="mt-5 t-body-lg text-fg-2">
              These projects are part of a validation program. Each has an agreed
              scope and checks for success. We connect the parts of your business
              that need to work together, then test the result with your team.
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
            Start with the issue that hurts most.
          </h2>
          <p className="mx-auto mt-5 max-w-[var(--copy-max)] t-body-lg text-fg-2">
            Tell us where work gets stuck. We will review your request and
            discuss the next step if there is a fit. Scope and price are agreed
            before paid work starts.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="/founder-intelligence/diagnostic" variant="glow">
              Request a Diagnostic
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
