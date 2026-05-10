import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/applied-intelligence/Breadcrumbs";
import SignalHero from "@/components/applied-intelligence/SignalHero";
import SectionShell from "@/components/applied-intelligence/SectionShell";
import FinalCTA from "@/components/applied-intelligence/FinalCTA";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  breadcrumbJsonLd,
  organizationJsonLd,
  webSiteJsonLd,
} from "@/lib/seo/schema";
import { ctaLinks } from "@/config/links";

const TITLE = "Growth Models | Audio Jones";
const DESCRIPTION =
  "Two ways to engage Audio Jones. Strategic Build + Growth Operations installs the system. Performance Partnership runs it with you for shared upside. Most businesses don't have a lead problem — they have a signal problem.";

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/services/growth-models",
});

type Model = {
  id: string;
  eyebrow: string;
  name: string;
  tagline: string;
  bestFor: string;
  description: string;
  inclusions: string[];
  cadence: string;
  engagementShape: string;
  primaryOutcome: string;
  primaryCta: { label: string; href: string };
  accent: "blue" | "gold";
};

const MODELS: Model[] = [
  {
    id: "strategic-build",
    eyebrow: "Engagement model 01",
    name: "Strategic Build + Growth Operations",
    tagline:
      "We architect the system, install it inside your business, and run growth operations against the signal it produces.",
    bestFor:
      "Operators with real revenue who are scaling noise instead of judgment — paid spend, content, hiring, tooling — and need a single operating layer that ties it all to outcomes.",
    description:
      "A senior engagement that begins with a constraint diagnosis and ends with a working Applied Intelligence System: attribution that maps to causal inputs, signal vs. noise instrumentation, and a growth ops cadence that compounds month over month. You keep the IP. We run it with you until it's calm.",
    inclusions: [
      "Constraint diagnosis and growth model design",
      "M.A.P attribution + signal-vs-noise instrumentation",
      "Applied Intelligence System buildout (data, agents, workflow)",
      "Weekly growth operations cadence + decision logs",
      "Founder-level strategic review and roadmap revision",
      "Documented IP, SOPs, and handover when you're ready",
    ],
    cadence: "Quarterly retainer. Typical engagement: 2–4 quarters.",
    engagementShape:
      "Fixed-fee build sprint, then monthly retainer for growth operations.",
    primaryOutcome:
      "A working operating layer that turns spend, attention, and effort into compounding signal — not another dashboard.",
    primaryCta: {
      label: "Apply for Strategic Build",
      href: "/apply",
    },
    accent: "blue",
  },
  {
    id: "performance-partnership",
    eyebrow: "Engagement model 02",
    name: "Performance Partnership",
    tagline:
      "Aligned incentives. We invest senior operating capacity against a defined growth thesis and share in the upside we create together.",
    bestFor:
      "Founder-led businesses with proven product-market signal, healthy unit economics, and an obvious lever — but no operating system or operator to pull it. Selective. We turn most of these conversations down.",
    description:
      "A small number of partnerships per year where Audio Jones takes a hybrid stake: a base retainer plus a performance component tied to the metric that actually matters in your business — qualified pipeline, recovered revenue, lifetime value, or net new ARR. Scope, metric, and term are agreed in writing before we start.",
    inclusions: [
      "Joint thesis on the constraint and the lever",
      "Embedded operating cadence with founder + leadership",
      "Build + run of the Applied Intelligence System for the lever",
      "Clear, auditable metric definition and reporting",
      "Hybrid economics: base retainer + performance component",
      "Defined term, exit ramp, and IP terms in writing",
    ],
    cadence: "Annual partnership term. Reviewed quarterly. Selective intake.",
    engagementShape:
      "Base retainer + performance component tied to a single contractually-defined metric.",
    primaryOutcome:
      "Shared accountability for one number that matters — backed by the operating system that moves it.",
    primaryCta: {
      label: "Request Partnership Conversation",
      href: ctaLinks.bookSession,
    },
    accent: "gold",
  },
];

const COMPARISON: Array<{
  dimension: string;
  build: string;
  partnership: string;
}> = [
  {
    dimension: "Best for",
    build: "Operators ready to install the system and run it",
    partnership: "Operators with one obvious lever and no operator to pull it",
  },
  {
    dimension: "Economics",
    build: "Build sprint + monthly retainer",
    partnership: "Base retainer + performance component",
  },
  {
    dimension: "Scope",
    build: "Whole-business operating layer",
    partnership: "Single contractually-defined metric",
  },
  {
    dimension: "Cadence",
    build: "Weekly ops + quarterly strategy",
    partnership: "Embedded weekly + quarterly review",
  },
  {
    dimension: "IP ownership",
    build: "Yours, with full handover",
    partnership: "Yours, with shared operating record",
  },
  {
    dimension: "Intake",
    build: "Apply via the diagnostic",
    partnership: "Selective. Conversation first.",
  },
];

function accentClasses(accent: Model["accent"]) {
  if (accent === "gold") {
    return {
      eyebrow: "text-[#C8A96A]",
      bar: "from-[#C8A96A]/60 via-[#C8A96A]/20 to-transparent",
      bullet: "text-[#C8A96A]",
      cta:
        "bg-transparent border border-[#C8A96A]/60 text-[#F4E4BC] hover:border-[#C8A96A] hover:bg-[#C8A96A]/10",
    };
  }
  return {
    eyebrow: "text-[#3B5BFF]",
    bar: "from-[#3B5BFF]/60 via-[#3B5BFF]/20 to-transparent",
    bullet: "text-[#3B5BFF]",
    cta:
      "bg-[#3B5BFF] text-white shadow-[0_10px_40px_-10px_rgba(59,91,255,0.7)] hover:bg-[#5B7AFF]",
  };
}

export default function GrowthModelsPage() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={webSiteJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Services", url: "/services" },
          { name: "Growth Models", url: "/services/growth-models" },
        ])}
      />

      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Services", href: "/services" },
          { name: "Growth Models" },
        ]}
      />

      <SignalHero
        eyebrow="Growth Models"
        headline="Most businesses don’t have a lead problem. They have a signal problem."
        subheadline="Two ways to work with Audio Jones — depending on whether you need to install the operating system, or whether you want us in the trenches with you on a single number."
        primaryCta={{
          label: "Apply for Strategic Build",
          href: "/apply",
        }}
        secondaryCta={{
          label: "Compare the Two Models",
          href: "#compare",
        }}
      />

      <SectionShell
        eyebrow="Why two models"
        title="One discipline. Two ways to deploy it."
        intro="Audio Jones builds Applied Intelligence Systems — the operating layer that turns scattered effort into compounding signal. How we engage depends on what your business actually needs next."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-[#0B1020] p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#3B5BFF]">
              If you need the system
            </p>
            <h3 className="mt-2 text-xl font-semibold text-white">
              Strategic Build + Growth Operations
            </h3>
            <p className="mt-3 text-slate-300">
              We architect, install, and run the operating layer with you until
              the cadence is calm and the signal is legible.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#0B1020] p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C8A96A]">
              If you have one number that matters
            </p>
            <h3 className="mt-2 text-xl font-semibold text-white">
              Performance Partnership
            </h3>
            <p className="mt-3 text-slate-300">
              We embed against a single contractually-defined metric and share
              in the upside we create together.
            </p>
          </div>
        </div>
      </SectionShell>

      {MODELS.map((model, idx) => {
        const cls = accentClasses(model.accent);
        const variant: "default" | "alt" = idx % 2 === 0 ? "alt" : "default";
        return (
          <SectionShell
            key={model.id}
            id={model.id}
            variant={variant}
            eyebrow={model.eyebrow}
          >
            <div className="rounded-2xl border border-white/10 bg-[#0B1020] p-8 sm:p-12">
              <div
                aria-hidden
                className={`mb-8 h-px w-32 bg-gradient-to-r ${cls.bar}`}
              />
              <p
                className={`text-xs font-semibold uppercase tracking-[0.18em] ${cls.eyebrow}`}
              >
                {model.name}
              </p>
              <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight text-white sm:text-4xl">
                {model.tagline}
              </h2>
              <p className="mt-5 max-w-3xl text-lg text-slate-300">
                {model.description}
              </p>

              <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Best for
                  </p>
                  <p className="mt-3 text-slate-200">{model.bestFor}</p>

                  <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Engagement shape
                  </p>
                  <p className="mt-3 text-slate-200">{model.engagementShape}</p>

                  <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Cadence
                  </p>
                  <p className="mt-3 text-slate-200">{model.cadence}</p>

                  <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Primary outcome
                  </p>
                  <p className="mt-3 text-slate-200">{model.primaryOutcome}</p>

                  <Link
                    href={model.primaryCta.href}
                    className={`mt-10 inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-semibold transition ${cls.cta}`}
                  >
                    {model.primaryCta.label}
                  </Link>
                </div>

                <div>
                  <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    What's included
                  </p>
                  <ul className="space-y-3">
                    {model.inclusions.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 rounded-md border border-white/10 bg-[#101827] p-4 text-slate-200"
                      >
                        <span aria-hidden className={cls.bullet}>
                          ▸
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </SectionShell>
        );
      })}

      <SectionShell
        id="compare"
        eyebrow="Decide"
        title="Which model fits where you are right now?"
        intro="If the constraint is that the system doesn't exist yet, start with Strategic Build. If the constraint is execution against a single number, request a Performance Partnership conversation."
      >
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0B1020]">
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="hidden border-b border-white/10 p-5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 md:block">
              Dimension
            </div>
            <div className="border-b border-white/10 p-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#3B5BFF] md:border-l">
              Strategic Build
            </div>
            <div className="border-b border-white/10 p-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#C8A96A] md:border-l">
              Performance Partnership
            </div>

            {COMPARISON.map((row) => (
              <div key={row.dimension} className="contents">
                <div className="border-b border-white/10 bg-[#101827] p-5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300 md:bg-transparent md:text-slate-400">
                  {row.dimension}
                </div>
                <div className="border-b border-white/10 p-5 text-slate-200 md:border-l">
                  {row.build}
                </div>
                <div className="border-b border-white/10 p-5 text-slate-200 md:border-l">
                  {row.partnership}
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-8 max-w-3xl text-sm text-slate-400">
          Not sure which fits? Start with the{" "}
          <Link
            href={ctaLinks.signalDiagnostic}
            className="font-semibold text-[#3B5BFF] hover:text-[#5B7AFF]"
          >
            Applied Intelligence Diagnostic
          </Link>
          . It's the front door to either model and the only way we scope
          either engagement.
        </p>
      </SectionShell>

      <FinalCTA
        headline="Stop scaling noise."
        body="Start with the diagnostic. We'll tell you which model fits — and whether either one does."
        ctaLabel="Request Strategic Diagnostic"
        ctaHref={ctaLinks.signalDiagnostic}
      />
    </>
  );
}
