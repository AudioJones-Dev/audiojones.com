/**
 * /marketing-consultant-hialeah
 *
 * P0 localized landing page — built from
 * docs/landing-pages/marketing-consultant-hialeah.md.
 *
 * Stakeholder open questions remain (see brief). Best-judgment defaults
 * are used inline; TODO markers flag where Audio should refine copy.
 */

import type { Metadata } from "next";
import Link from "next/link";
import {
  DarkSection,
  FinalCta,
  LightProofSection,
  SectionIntro,
  SignalHero,
} from "@/components/marketing/DesignSystemSections";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  serviceJsonLd,
} from "@/lib/seo/schema";

const PATH = "/marketing-consultant-hialeah";
const TITLE = "Marketing Consultant in Hialeah, FL — Audio Jones";
const DESCRIPTION =
  "Audio Jones is a Hialeah-based marketing consultant helping founder-led businesses install Applied Intelligence Systems — AI workflows, marketing automation, attribution. Bilingual delivery. Serving Miami-Dade.";

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

const FAQS = [
  {
    question: "Do you serve businesses outside Hialeah?",
    answer:
      "Yes. We're based in Hialeah and serve all of Miami-Dade, Broward, and selected Southwest Florida markets (Naples, Fort Myers). Local clients get in-person sessions when useful; remote clients get the same systems delivered over video and shared docs.",
  },
  {
    question: "Are your services bilingual?",
    answer:
      "Yes. We deliver in English and Spanish, and we design marketing systems that handle bilingual audiences as a first-class feature — segmentation, content, follow-up, and reporting — not an afterthought.",
  },
  {
    question: "What size businesses do you work with?",
    answer:
      "Founder-led service businesses in the $250K-$5M ARR range. Below $250K you typically don't need operational intelligence systems yet; above $5M you need an internal team, not a consultant.",
  },
  {
    question: "How fast can we get started?",
    answer:
      "The first conversation is a 30-minute Strategy Session. From there, most engagements kick off within 1-2 weeks depending on scope.",
  },
  {
    question:
      "Do you replace my existing marketing team or work alongside them?",
    answer:
      "Both work. Smaller clients use Audio Jones as a fractional CMO + systems architect. Larger clients keep their existing team and we install the operational layer underneath. The systems we build outlast the engagement.",
  },
];

// TODO(stakeholder): replace placeholder pricing block with real ranges once approved.
const PRICING_NOTE =
  "Engagement pricing depends on scope — the Strategy Session is complimentary, and implementation engagements scale with the systems being installed.";

export default function MarketingConsultantHialeahPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Service Areas", url: "/service-areas" },
          { name: "Hialeah", url: PATH },
        ])}
      />
      <JsonLd
        data={serviceJsonLd({
          name: "Marketing Consultant in Hialeah",
          description: DESCRIPTION,
          url: PATH,
          areaServedCity: "Hialeah",
          serviceType: [
            "Marketing Consulting",
            "AI Consulting",
            "Marketing Automation",
            "Bilingual Marketing Systems",
          ],
        })}
      />
      <JsonLd data={faqJsonLd(FAQS)} />

      <SignalHero
        title="Marketing consultant in Hialeah for founder-led businesses."
        description="You don't have a marketing problem. You have a signal problem. Audio Jones helps Hialeah-based founders build operational intelligence systems that compound — AI workflows, marketing automation, attribution clarity, and founder media — across Miami-Dade and Broward."
        primaryHref="/book-a-call?source=hialeah"
        primaryLabel="Book a Strategy Session"
        secondaryHref="/applied-intelligence/diagnostic"
        secondaryLabel="Start the Diagnostic"
      />

      <DarkSection>
        <SectionIntro
          label="Why Hialeah Founders Choose Audio Jones"
          title="Three reasons Hialeah operators bring us in."
          description="We work specifically with founder-led service businesses that have built real revenue but haven't yet installed the operational layer that makes that revenue compound."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {[
            {
              title: "You're running a business in English and Spanish — and your tools speak neither.",
              copy:
                "Hialeah has the highest Hispanic-population percentage of any major U.S. city (95%+). Most martech vendors treat bilingual audiences as an afterthought. We design bilingual marketing systems from the ground up — content workflows, CRM segmentation, lead-scoring rubrics, and reporting dashboards that don't break when half your audience reads in Spanish.",
            },
            {
              title: "You've outgrown agencies — but you don't have a marketing team yet.",
              copy:
                "Most Hialeah businesses in the $250K-$5M ARR band have one founder doing sales, one VA doing posts, and a contractor who built a website three years ago. Audio Jones drops in operational intelligence systems that don't require headcount — automated lead routing, attribution, follow-up sequences, and executive reporting that runs whether you're in the office or not.",
            },
            {
              title: "You're working harder than ever and you can't see where the revenue is coming from.",
              copy:
                "Without attribution, every marketing dollar feels like a gamble. Hialeah-based service businesses — accessibility contractors, importers, medical practices, professional services — typically have 3-7 channels running with zero visibility into which one closed the last 10 deals. Applied Intelligence Systems install causal attribution so you stop guessing and start scaling what works.",
            },
          ].map(({ title, copy }) => (
            <div key={title} className="aj-product-card">
              <h3 className="font-accent text-xl font-bold leading-snug tracking-[-0.02em] text-fg-0">
                {title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-fg-2">{copy}</p>
            </div>
          ))}
        </div>
      </DarkSection>

      <DarkSection className="border-t border-[var(--border-subtle)]">
        <SectionIntro
          label="Services for Hialeah Operators"
          title="What we install."
          description="Engagements start with the system most likely to move your top metric. We expand from there — never the other way around."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["AI Consulting", "Strategy + roadmap for AI integration in established service businesses."],
            ["Marketing Automation", "Resend, MailerLite, and n8n pipelines designed for bilingual segmentation."],
            ["Analytics & Attribution", "Causal attribution that survives multi-touch buyer journeys."],
            ["Founder Intelligence Systems", "Operating-system design for founder-led companies."],
            ["Conversion Optimization", "Funnel diagnosis and remediation across the buyer journey."],
            ["Executive Reporting Systems", "Looker, Sheets, and dashboard installs your operators actually open."],
          ].map(([title, copy]) => (
            <div key={title} className="aj-product-card">
              <h3 className="font-accent text-lg font-bold tracking-[-0.02em] text-fg-0">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-fg-2">{copy}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 max-w-3xl text-sm leading-7 text-fg-3">
          <Link
            href="/services"
            className="text-[var(--signal-yellow)] underline underline-offset-4 hover:text-[var(--signal-soft)]"
          >
            See the full service catalog →
          </Link>
        </p>
      </DarkSection>

      <LightProofSection>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0088cc]">
              Local Context
            </p>
            <h2 className="mt-4 font-accent text-[clamp(2rem,3.5vw,3.25rem)] font-bold leading-[1.04] tracking-[-0.03em]">
              We&apos;re not a Miami agency that drove up Palmetto.
            </h2>
          </div>
          <div className="space-y-5 text-base leading-7 text-[#1F2937]">
            <p>
              Hialeah is Florida&apos;s sixth-largest city and home to one of
              the densest concentrations of family-run service businesses in
              the country — manufacturing on the Okeechobee corridor,
              healthcare around Palmetto General, import-export along NW 36th
              Street, and professional services in the city center.
            </p>
            <p>
              What unites them: founders who&apos;ve built real revenue
              without ever installing the operational systems that scale
              beyond their personal involvement. Audio Jones is local —
              registered at NW 64th Place, working with founders from
              Westland Mall to Hialeah Park — and we specialize in the kinds
              of operational intelligence systems that turn hard-won revenue
              into compounding business value.
            </p>
            <p className="text-sm text-[#4B5563]">
              Bilingual delivery (English &amp; Spanish) available across
              every service.
            </p>
          </div>
        </div>
      </LightProofSection>

      <DarkSection>
        <SectionIntro
          label="Frequently Asked"
          title="What Hialeah founders ask before we start working together."
        />
        <dl className="mt-10 grid gap-6 lg:grid-cols-2">
          {FAQS.map(({ question, answer }) => (
            <div
              key={question}
              className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-1)] p-6"
            >
              <dt className="font-accent text-base font-bold leading-snug tracking-[-0.01em] text-fg-0">
                {question}
              </dt>
              <dd className="mt-3 text-sm leading-7 text-fg-2">{answer}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-10 text-sm leading-7 text-fg-3">{PRICING_NOTE}</p>
      </DarkSection>

      <FinalCta
        title="Ready to install operational intelligence?"
        description="Book a 30-minute Strategy Session. We'll diagnose your top constraint and show you the system most likely to move your top metric."
        primaryLabel="Book a Strategy Session"
        primaryHref="/book-a-call?source=hialeah"
        secondaryLabel="Start the Diagnostic"
        secondaryHref="/applied-intelligence/diagnostic"
      />
    </>
  );
}
