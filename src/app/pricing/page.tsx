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
  "Start with a diagnostic — most are publicly priced. Then build the system you need, from ResponseOS to a full Founder Intelligence System. No guessing what it costs to begin.";

export const metadata: Metadata = buildMetadata({
  title: "Offers & Pricing",
  description: DESCRIPTION,
  path: "/pricing",
});

type Offer = {
  name: string;
  price: string;
  priceNote?: string;
  designedFor: string;
  goal: string;
  outcome?: string;
  href?: string;
  cta?: string;
  featured?: boolean;
};

// ── Entry: diagnostics (the buying sequence starts here) ──
const DIAGNOSTICS: Offer[] = [
  {
    name: "AI Readiness Score",
    price: "Free",
    designedFor: "Any founder-led service business wondering where AI and operations actually stand.",
    goal: "A fast read on how ready your business is — and where the gaps are before you spend anything.",
    href: "/ai-readiness-diagnostic",
    cta: "Get your score",
  },
  {
    name: "Revenue Leak Diagnostic",
    price: "$1,997",
    designedFor: "Founder-led businesses doing $500K–$5M+.",
    goal: "Identify where revenue is being lost — slow response times, missed follow-up, poor attribution, operational bottlenecks, and reporting gaps.",
    outcome: "A prioritized action plan showing the highest-leverage opportunities to recover revenue and improve operational efficiency.",
    href: "/book-a-call",
    cta: "Book the diagnostic",
    featured: true,
  },
  {
    name: "AI Readiness Kaizen Diagnostic",
    price: "$3,500",
    designedFor: "Businesses ready for a full operating review, not a single-issue read.",
    goal: "A deeper, continuous-improvement read across workflow, data, SOPs, and adoption — what to fix, and in what order.",
    href: "/book-a-call",
    cta: "Book the diagnostic",
  },
];

const WORKSHOP: Offer = {
  name: "AI Readiness Workshop",
  price: "$2,500–$3,500",
  designedFor: "Teams who want to learn the model before committing to a build.",
  goal: "A guided working session that leaves you with a readiness score and a clear next step.",
  href: "/workshops",
  cta: "See workshops",
};

// ── Systems: ResponseOS tiers ──
const RESPONSEOS: Offer[] = [
  {
    name: "ResponseOS Starter",
    price: "$397/mo",
    designedFor: "Smaller teams that just need to stop leads going cold.",
    goal: "Core capture and fast follow-up so no inbound lead falls through the cracks.",
  },
  {
    name: "ResponseOS Core",
    price: "$797/mo",
    designedFor: "Growing teams with a real follow-up and recovery problem.",
    goal: "Adds qualification and a recovery cadence that re-engages stalled and ghosted leads.",
    featured: true,
  },
  {
    name: "ResponseOS Pro",
    price: "$1,297/mo",
    designedFor: "Teams that need the full picture, not just the recovery.",
    goal: "Full intake, recovery, and attribution reporting so you see what actually drives revenue.",
  },
];

// ── Larger engagements ──
const ENGAGEMENTS: Offer[] = [
  {
    name: "Founder Intelligence System",
    price: "Custom",
    priceNote: "Most engagements range $5,000–$25,000+",
    designedFor: "Businesses ready for a full operating intelligence layer across revenue, ops, AI, and reporting.",
    goal: "Connect follow-up, CRM, attribution, reporting, and business memory into one system you can see and run.",
    href: "/founder-intelligence",
    cta: "Explore the system",
  },
  {
    name: "Strategic Advisory",
    price: "From $2,000/mo",
    designedFor: "Founders who want ongoing operating guidance, not a one-time build.",
    goal: "A steady hand on the system — priorities, decisions, and what to build next.",
    href: "/book-a-call",
    cta: "Book a call",
  },
];

const PARTNERSHIP: Offer = {
  name: "Performance Partnership",
  price: "Application only",
  designedFor: "A small number of businesses where we tie our upside to your results.",
  goal: "A performance-based engagement scoped around outcomes. Pricing is bespoke — apply to see if it is a fit.",
  href: "/apply",
  cta: "Apply",
};

const PRICING_FAQS = [
  {
    question: "What does it cost to start?",
    answer:
      "The AI Readiness Score is free. The Revenue Leak Diagnostic is $1,997. Most engagements begin with one of those, then move into a system once you know what to fix.",
  },
  {
    question: "Why do you publish prices?",
    answer:
      "Because transparency saves everyone time. You can see exactly where to start and what it costs before you ever get on a call.",
  },
  {
    question: "Can I start small?",
    answer:
      "Yes. ResponseOS starts at $397/month and moves up as it proves out. You do not have to commit to a full build to fix your biggest leak first.",
  },
  {
    question: "What is not priced publicly?",
    answer:
      "Founder Intelligence Systems are scoped to your business (most range $5,000–$25,000+), and the Performance Partnership is application-only because pricing is built around outcomes.",
  },
];

function PriceCard({ offer, featured = offer.featured }: { offer: Offer; featured?: boolean }) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-accent text-xl font-bold tracking-[-0.02em] text-fg-0">
          {offer.name}
        </h3>
        {featured ? <span className="aj-data-label whitespace-nowrap">Popular</span> : null}
      </div>
      <p className="mt-3 font-headline text-3xl font-bold text-signal-yellow">{offer.price}</p>
      {offer.priceNote ? <p className="mt-1 text-xs text-fg-3">{offer.priceNote}</p> : null}

      <dl className="mt-5 space-y-4">
        <div>
          <dt className="aj-data-label">Designed for</dt>
          <dd className="mt-1 text-sm leading-6 text-fg-2">{offer.designedFor}</dd>
        </div>
        <div>
          <dt className="aj-data-label">What it does</dt>
          <dd className="mt-1 text-sm leading-6 text-fg-2">{offer.goal}</dd>
        </div>
        {offer.outcome ? (
          <div>
            <dt className="aj-data-label">Typical outcome</dt>
            <dd className="mt-1 text-sm leading-6 text-fg-2">{offer.outcome}</dd>
          </div>
        ) : null}
      </dl>

      {offer.href && offer.cta ? (
        <Link
          href={offer.href}
          className="mt-5 inline-block text-sm font-semibold text-signal-yellow hover:underline"
        >
          {offer.cta} →
        </Link>
      ) : null}
    </>
  );

  return featured ? (
    <div className="aj-card-signal">
      <div className="aj-card-inner">{body}</div>
    </div>
  ) : (
    <div className="aj-product-card">{body}</div>
  );
}

export default function OffersPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Offers & Pricing", url: "/pricing" },
        ])}
      />
      <JsonLd data={faqJsonLd(PRICING_FAQS)} />

      <SignalHero
        title="Start with a diagnostic. Build the system you actually need."
        description={DESCRIPTION}
        primaryHref="/ai-readiness-diagnostic"
        primaryLabel="Get your free score"
        secondaryHref="/book-a-call"
        secondaryLabel="Book a Diagnostic"
        stats={[
          { metric: "Free", label: "AI Readiness Score to see where you stand." },
          { metric: "$1,997", label: "Revenue Leak Diagnostic — find the money leaking out." },
          { metric: "$397/mo", label: "ResponseOS starts here — stop losing leads." },
        ]}
      />

      {/* Step 1 — Diagnostics */}
      <DarkSection>
        <SectionIntro
          label="Step 1 · Start here"
          title="Every engagement starts with a diagnosis."
          description="A diagnostic is a structured read of your business that ends in a decision-ready plan — the single highest-leverage thing to fix next. These are the entry point, and most are publicly priced."
        />
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {DIAGNOSTICS.map((o) => (
            <PriceCard key={o.name} offer={o} />
          ))}
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <PriceCard offer={WORKSHOP} />
        </div>
      </DarkSection>

      {/* How pricing works */}
      <LightProofSection>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--aj-blue-deep)]">
            How pricing works
          </p>
          <h2 className="mt-4 font-accent text-[clamp(2rem,4vw,3.25rem)] font-bold leading-[1.05] tracking-[-0.03em]">
            Transparent where it helps. Scoped where it matters.
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#4b5563]">
            Diagnostics and ResponseOS are publicly priced, so you know exactly
            where to start. Full Founder Intelligence Systems are scoped to your
            business, because the right build depends on what the diagnostic
            finds. The Performance Partnership is application-only — pricing
            there is built around results.
          </p>
        </div>
      </LightProofSection>

      {/* Step 2 — ResponseOS tiers */}
      <DarkSection>
        <SectionIntro
          label="Step 2 · ResponseOS"
          title="Stop losing the leads you already earned."
          description="ResponseOS is the revenue-recovery system. Start at the tier that matches your follow-up problem and move up as it proves out."
        />
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {RESPONSEOS.map((o) => (
            <PriceCard key={o.name} offer={o} />
          ))}
        </div>
        <div className="mt-8">
          <Link href="/agents/responseos" className="text-sm font-semibold text-signal-yellow hover:underline">
            Explore ResponseOS in full →
          </Link>
        </div>
      </DarkSection>

      {/* Larger engagements */}
      <DarkSection className="bg-bg-1">
        <SectionIntro
          label="Build & operate"
          title="When you are ready for the whole system."
          description="Once a diagnostic proves the model, these are the larger builds and ongoing engagements."
        />
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {ENGAGEMENTS.map((o) => (
            <PriceCard key={o.name} offer={o} />
          ))}
          <PriceCard offer={PARTNERSHIP} />
        </div>
      </DarkSection>

      {/* FAQ */}
      <DarkSection>
        <SectionIntro
          label="FAQ"
          title="Common questions about cost"
          description="Straight answers about how engagements are priced and where to start."
        />
        <div className="mx-auto mt-10 max-w-3xl">
          <FAQ items={PRICING_FAQS} />
        </div>
      </DarkSection>

      <FinalCta
        title="Find the leak first. Price the fix second."
        description="Start with the free AI Readiness Score, or book the Revenue Leak Diagnostic to find exactly where your business is losing revenue."
        primaryLabel="Get your free score"
        primaryHref="/ai-readiness-diagnostic"
        secondaryLabel="Book a Diagnostic"
        secondaryHref="/book-a-call"
      />
    </>
  );
}
