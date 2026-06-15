import type { Metadata } from "next";
import Link from "next/link";

import {
  DarkSection,
  FinalCta,
  LightProofSection,
  SectionIntro,
  SignalHero,
} from "@/components/marketing/DesignSystemSections";
import FAQ from "@/components/founder-intelligence/FAQ";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo/schema";

const DESCRIPTION =
  "Start with a diagnostic, then build the system you actually need — revenue recovery, business memory, content, or a full Founder Intelligence System. Scope follows the diagnosis, not a fixed price table.";

export const metadata: Metadata = buildMetadata({
  title: "Offers",
  description: DESCRIPTION,
  path: "/pricing",
});

const DIAGNOSTICS = [
  ["Revenue Leak Diagnostic", "Finds the money slipping through missed calls, slow follow-up, pipeline, and unclear attribution."],
  ["AI Readiness Diagnostic", "Tests whether your business is ready for AI before you spend a dollar installing it."],
  ["Founder Intelligence Diagnostic", "Maps your operations, workflows, decision bottlenecks, and data gaps in one read."],
  ["Content Engine Diagnostic", "Audits your content, podcast, authority, and how well your work gets repurposed."],
  ["Business Memory Diagnostic", "Audits the SOPs, decisions, and CRM notes your business keeps losing."],
] as const;

const SYSTEMS = [
  {
    name: "ResponseOS",
    problem: "Missed calls, slow follow-up, lead leakage, and weak intake.",
    status: "Live",
    href: "/agents/responseos",
  },
  {
    name: "Founder Intelligence System",
    problem: "A full operating layer across revenue, operations, AI, and reporting.",
    status: "Live",
    href: "/founder-intelligence",
  },
  {
    name: "ReKonr OS",
    problem: "Lost business memory — scattered docs, decisions, and operational context.",
    status: "In development",
    href: null,
  },
  {
    name: "PodcastOS",
    problem: "Inconsistent content, poor repurposing, and no authority engine.",
    status: "In development",
    href: null,
  },
] as const;

const WORKSHOPS = [
  ["Revenue Leak Workshop", "Founders who want to understand where revenue goes missing."],
  ["AI Readiness Workshop", "Businesses considering AI but unsure where it fits."],
  ["Founder Intelligence Workshop", "Owners who need operating clarity before they build."],
  ["ResponseOS Workshop", "Teams with a missed-call and follow-up problem."],
  ["ReKonr OS Workshop", "Teams with scattered knowledge and weak documentation."],
  ["PodcastOS Workshop", "Creators and founders who need a content system."],
  ["Offer Architecture Workshop", "Consultants turning expertise into a clear offer."],
] as const;

const PRICING_FAQS = [
  {
    question: "How much does it cost?",
    answer:
      "Pricing is scoped to what the diagnostic finds. You get a decision-ready report and a clear quote for the one system you actually need — not a guess off a generic price table.",
  },
  {
    question: "Why is there no fixed price list?",
    answer:
      "Because the right fix depends on where your business is leaking. A missed-call problem and a lost-knowledge problem need different systems. The diagnostic decides which one, then we scope it.",
  },
  {
    question: "Do you offer month-to-month?",
    answer:
      "Some engagements can start month-to-month. Larger systems work is scoped around the diagnostic and the operating change required to make it stick.",
  },
  {
    question: "Can you work with the tools we already use?",
    answer:
      "Yes. We usually build around the tools already in place, then clarify the workflows, ownership, attribution, and reporting around them.",
  },
];

export default function OffersPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Offers", url: "/pricing" },
        ])}
      />
      <JsonLd data={faqJsonLd(PRICING_FAQS)} />

      <SignalHero
        title="Start with a diagnostic. Build the system you actually need."
        description={DESCRIPTION}
        primaryHref="/ai-readiness-diagnostic"
        primaryLabel="Book a Diagnostic"
        secondaryHref="/roi-calculator"
        secondaryLabel="Calculate Lost Revenue"
        stats={[
          { metric: "1", label: "Diagnose where revenue and attention leak." },
          { metric: "2", label: "Decide the one highest-leverage fix." },
          { metric: "3", label: "Build it — a workshop or a full install." },
          { metric: "4", label: "Operate and optimize on a retainer." },
        ]}
      />

      {/* Diagnostics */}
      <DarkSection>
        <SectionIntro
          label="Step 1 · Paid diagnostics"
          title="Every engagement starts with a diagnosis."
          description="A paid diagnostic is a structured read of your business that ends in a decision-ready report — the single highest-leverage system to build next."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DIAGNOSTICS.map(([name, copy]) => (
            <div key={name} className="aj-product-card">
              <h3 className="font-accent text-xl font-bold tracking-[-0.02em] text-fg-0">
                {name}
              </h3>
              <p className="mt-3 text-sm leading-7 text-fg-2">{copy}</p>
            </div>
          ))}
        </div>
      </DarkSection>

      {/* How pricing works */}
      <LightProofSection>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--aj-blue-deep)]">
            How pricing works
          </p>
          <h2 className="mt-4 font-accent text-[clamp(2rem,4vw,3.25rem)] font-bold leading-[1.05] tracking-[-0.03em]">
            We price the fix, not a package.
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#4b5563]">
            We do not sell one-size plans, because the right system depends on
            where your business is losing money. The diagnostic tells us — then
            you get a clear, scoped quote for the system that solves it. No
            guessing, no padded retainer for work you do not need.
          </p>
        </div>
      </LightProofSection>

      {/* Agent OS systems */}
      <DarkSection>
        <SectionIntro
          label="Step 2 · Agent OS solutions"
          title="The systems we install."
          description="These are installed business systems — not software subscriptions. The diagnostic points to the one that fixes your biggest leak first."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {SYSTEMS.map((s) => (
            <div key={s.name} className="aj-card-signal">
              <div className="aj-card-inner">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-accent text-2xl font-bold tracking-[-0.02em] text-fg-0">
                    {s.name}
                  </h3>
                  <span className="aj-data-label whitespace-nowrap">{s.status}</span>
                </div>
                <p className="mt-3 leading-7 text-fg-2">{s.problem}</p>
                {s.href ? (
                  <Link
                    href={s.href}
                    className="mt-4 inline-block text-sm font-semibold text-signal-yellow hover:underline"
                  >
                    Explore {s.name} →
                  </Link>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </DarkSection>

      {/* Workshops */}
      <DarkSection className="bg-bg-1">
        <SectionIntro
          label="Optional · Workshops"
          title="Want to learn before you build?"
          description="Workshops educate and qualify. They are the lower-cost way in for founders who want clarity before committing to a full install."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WORKSHOPS.map(([name, best]) => (
            <div key={name} className="aj-product-card">
              <h3 className="font-accent text-lg font-bold tracking-[-0.02em] text-fg-0">
                {name}
              </h3>
              <p className="mt-2 text-sm leading-6 text-fg-2">{best}</p>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Link
            href="/workshops"
            className="text-sm font-semibold text-signal-yellow hover:underline"
          >
            See all workshops →
          </Link>
        </div>
      </DarkSection>

      {/* FAQ */}
      <DarkSection>
        <SectionIntro
          label="FAQ"
          title="Common questions about cost"
          description="Straight answers about how engagements are priced and scoped."
        />
        <div className="mx-auto mt-10 max-w-3xl">
          <FAQ items={PRICING_FAQS} />
        </div>
      </DarkSection>

      <FinalCta
        title="Find the leak first. Price the fix second."
        description="Book a diagnostic and get a decision-ready read on where your business is losing revenue — and exactly what to build next."
        primaryLabel="Book a Diagnostic"
        primaryHref="/ai-readiness-diagnostic"
        secondaryLabel="Calculate Lost Revenue"
        secondaryHref="/roi-calculator"
      />
    </>
  );
}
