/**
 * /ai-services-naples
 *
 * P1 localized landing page — built from
 * docs/landing-pages/ai-services-naples-and-fort-myers.md.
 *
 * SW Florida positioning is INTENTIONALLY different from the South FL P0
 * pages. The buyer here is a 45-65 year old service-business owner doing
 * $1-10M, not a Miami founder. Tone: concrete dollars, missed calls,
 * recovered hours. AI receptionist is the lead wedge — the cheapest
 * proof-of-ROI we can offer in this market.
 *
 * Do NOT mirror this page's copy to Fort Myers. Both pages share a
 * positioning thesis but Collier and Lee Counties read differently.
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

const PATH = "/ai-services-naples";
const TITLE =
  "AI Services for Service Businesses in Naples, FL — Audio Jones";
const DESCRIPTION =
  "AI tools that pay for themselves: 24/7 AI receptionist, automated lead routing, marketing attribution. Built for Naples HVAC, plumbing, marine, and home-service businesses doing $1M-$10M.";

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

const FAQS = [
  {
    question: "What does an AI receptionist actually do?",
    answer:
      "It answers your phone 24/7 in English or Spanish, asks the caller a few qualifying questions, books the estimate or service call, and texts you a summary. Works on your existing phone number — no port required. Typically catches 90%+ of after-hours and overflow calls.",
  },
  {
    question: "Will it sound like a robot?",
    answer:
      "No. Modern AI voice handles natural conversation fluently. Most callers don't realize they're not talking to a human until 30+ seconds in. The handoff to your team (when needed) is seamless via text.",
  },
  {
    question: "What if a caller wants to talk to a real person?",
    answer:
      "The AI handles 80-90% of inbound calls completely. For the rest, it collects the request and routes to your team via SMS or dashboard — same as your current system, just better organized.",
  },
  {
    question: "Do I need to switch software?",
    answer:
      "Usually not. We integrate with what you already use — ServiceTitan, Housecall Pro, Jobber, Zoho, custom CRMs, even Google Sheets if that's your current stack.",
  },
  {
    question: "What does this cost?",
    answer:
      "The AI receptionist alone scales with call volume. Most clients see it pay for itself in the first month of recovered calls. Full system installs (receptionist + attribution + automation) run a one-time 90-day implementation plus a monthly optimization retainer. We'll quote your exact numbers on the Strategy Session.",
  },
  {
    question: "What's the catch?",
    answer:
      "It works best for service businesses doing $1M-$10M with meaningful inbound call volume. Below that, the math doesn't always pencil out. We'll tell you upfront if it's not a fit.",
  },
];

// TODO(stakeholder): publish actual pricing brackets once productized.
const FOOTER_NOTE =
  "Engagement scopes start with the system most likely to recover lost revenue — usually the AI receptionist. Strategy Session is complimentary.";

export default function AiServicesNaplesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Service Areas", url: "/service-areas" },
          { name: "Naples", url: PATH },
        ])}
      />
      <JsonLd
        data={serviceJsonLd({
          name: "AI Services for Service Businesses in Naples",
          description: DESCRIPTION,
          url: PATH,
          areaServedCity: "Naples",
          serviceType: [
            "AI Receptionist",
            "Marketing Automation",
            "Lead Routing",
            "Business Automation",
            "Analytics & Attribution",
          ],
        })}
      />
      <JsonLd data={faqJsonLd(FAQS)} />

      <SignalHero
        title="You missed 14 calls last week. Your competitor's AI receptionist booked 9 of them."
        description="Audio Jones installs AI receptionists, automated lead routing, and attribution dashboards built for Naples service businesses — HVAC, plumbing, marine, restoration, premium home services. Not built for tech startups."
        primaryHref="/book-a-call?source=naples-blue-collar"
        primaryLabel="See How It Works"
        secondaryHref="/applied-intelligence/diagnostic"
        secondaryLabel="Run the Diagnostic"
      />

      <DarkSection>
        <SectionIntro
          label="Three Problems We Solve"
          title="The AI most service-business owners actually need."
          description="Forget the conceptual stuff. These are the three operational problems we install systems for — measurable, recoverable, paid-for-by-month-one."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {[
            {
              title:
                "Missed calls cost you jobs you didn't even know existed.",
              copy:
                "A typical home-services business misses 22-38% of inbound calls. That's not 'missed opportunities' — that's revenue you literally never knew about. Our AI receptionist answers 24/7 in English and Spanish, qualifies the lead, books the estimate, and texts you a summary. Most clients pay for the install in their first month of recovered calls.",
            },
            {
              title: "You don't know which marketing channel is making you money.",
              copy:
                "You've got Google Ads, maybe the Yellow Pages still somehow, a guy doing social, the truck wraps, and a referral program. Some of those work. Some of those don't. We install the attribution layer that tells you exactly which channel closed the last 10 deals — so you can double down on what works and kill what doesn't.",
            },
            {
              title:
                "You're working 70 hours a week running both the field and the office.",
              copy:
                "Most service-business owners are still personally answering emails, dispatching jobs, chasing late invoices, and managing crew schedules. We design automation that handles the repeatable parts — lead intake, confirmation messages, follow-up sequences, review requests — so you can stop being the bottleneck.",
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
          label="Services for Naples Operators"
          title="What we install — in priority order."
          description="Engagements start with the AI receptionist because it's the cheapest, fastest proof of ROI. We expand from there based on what your numbers show."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["AI Receptionist", "24/7 bilingual call answering, qualification, booking. Pays for itself in month one for most operators."],
            ["Marketing Automation", "Lead routing, follow-up sequences, no-show recovery. Built around your existing CRM."],
            ["Analytics & Attribution", "Which marketing channel is actually paying for itself — and which isn't."],
            ["Business Automation", "Invoice reminders, review requests, crew schedule integration."],
            ["AI Consulting", "Quarterly strategy + system optimization once the operational layer is in place."],
            ["AEO Strategy", "Get cited when locals ask Google, ChatGPT, or Claude for service recommendations."],
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
              Naples has the margin. Most operators just don&apos;t have the systems yet.
            </h2>
          </div>
          <div className="space-y-5 text-base leading-7 text-[#1F2937]">
            <p>
              Naples is one of the wealthiest small markets in Florida —
              Collier County&apos;s median household income is among the top
              10 in the U.S. — which means service businesses here typically
              have margin to invest in real systems.
            </p>
            <p>
              But the local service-business landscape (HVAC, pool service,
              landscape, marine, restoration, premium home services) is
              still mostly run on spreadsheets and gut feel. The owners who
              install operational intelligence — AI receptionists, automated
              lead routing, attribution dashboards — are the ones who&apos;ll
              consolidate the next decade.
            </p>
            <p>
              Audio Jones is a Florida-based AI consultant working the SW
              Florida corridor: Naples (Old Naples to Vanderbilt Beach),
              Bonita Springs, Estero. Engagements typically start with the
              AI receptionist and expand from there.
            </p>
          </div>
        </div>
      </LightProofSection>

      <DarkSection>
        <SectionIntro
          label="Frequently Asked"
          title="The questions Naples operators actually ask."
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
        <p className="mt-10 text-sm leading-7 text-fg-3">{FOOTER_NOTE}</p>
      </DarkSection>

      <FinalCta
        title="See how the AI receptionist works on your business."
        description="Book a 30-minute Strategy Session. We'll look at your actual call volume, missed-call rate, and lead-channel mix — and tell you what installing the AI receptionist would recover in the first 90 days."
        primaryLabel="Book a Strategy Session"
        primaryHref="/book-a-call?source=naples-blue-collar"
        secondaryLabel="Run the Diagnostic"
        secondaryHref="/applied-intelligence/diagnostic"
      />
    </>
  );
}
