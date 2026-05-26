/**
 * /ai-services-fort-myers
 *
 * P1 localized landing page — built from
 * docs/landing-pages/ai-services-naples-and-fort-myers.md.
 *
 * Fort Myers shares the SW Florida blue-collar thesis with Naples but
 * the local context differs materially: Lee County's economy is the
 * post-Ian rebuild + marine + service-business mix, not Collier
 * County's wealth-services mix. Copy reflects that — these are two
 * different markets even though the operational pitch is identical.
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

const PATH = "/ai-services-fort-myers";
const TITLE =
  "AI Services in Fort Myers — AI Receptionist & Automation for Service Businesses";
const DESCRIPTION =
  "Fort Myers AI consultant for HVAC, plumbing, roofing, marine, and restoration businesses. AI receptionist, lead automation, attribution. Pays for itself or you don't pay.";

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

const FAQS = [
  {
    question: "What does an AI receptionist actually do?",
    answer:
      "It answers your phone 24/7 in English or Spanish, qualifies the caller, books the estimate or service call, and texts you a summary. Works on your existing phone number — no port required. Typically catches 90%+ of after-hours and overflow calls.",
  },
  {
    question: "I run a restoration company. Can it handle emergency calls properly?",
    answer:
      "Yes. We configure escalation rules per call type. Emergency or water-mitigation calls bypass the qualification queue and ring your on-call tech directly; non-emergency calls follow the standard booking flow. Same logic works for HVAC after-hours dispatch and marine emergencies.",
  },
  {
    question: "Will it sound like a robot?",
    answer:
      "No. Modern AI voice handles natural conversation fluently. Most callers don't realize they're not talking to a human until 30+ seconds in. The handoff to your team (when needed) is seamless via text.",
  },
  {
    question: "Do I need to switch software?",
    answer:
      "Usually not. We integrate with what you already use — ServiceTitan, Housecall Pro, Jobber, Zoho, custom CRMs, even Google Sheets if that's your current stack.",
  },
  {
    question: "How does pricing work?",
    answer:
      "The AI receptionist scales with call volume. Most clients see it pay for itself in the first month of recovered calls. Full system installs (receptionist + attribution + automation) run a one-time 90-day implementation plus a monthly optimization retainer. We quote your exact numbers on the Strategy Session.",
  },
  {
    question: "What size businesses do you work with?",
    answer:
      "Best fit is service businesses doing $1M-$10M with meaningful inbound call volume. Below that, the math doesn't always pencil out. We'll tell you upfront if it's not a fit.",
  },
];

// TODO(stakeholder): publish actual pricing brackets once productized.
const FOOTER_NOTE =
  "Engagement scopes start with the AI receptionist because it's the cheapest, fastest proof of ROI. Strategy Session is complimentary.";

export default function AiServicesFortMyersPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Service Areas", url: "/service-areas" },
          { name: "Fort Myers", url: PATH },
        ])}
      />
      <JsonLd
        data={serviceJsonLd({
          name: "AI Services for Service Businesses in Fort Myers",
          description: DESCRIPTION,
          url: PATH,
          areaServedCity: "Fort Myers",
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
        title="AI services in Fort Myers — built for the businesses that run Lee County."
        description="HVAC, plumbing, roofing, marine, restoration, electrical. Audio Jones installs AI receptionists, automated lead routing, and attribution dashboards for the service businesses Fort Myers actually runs on. Less working in the truck. More booked jobs."
        primaryHref="/book-a-call?source=fort-myers-blue-collar"
        primaryLabel="See How It Works"
        secondaryHref="/applied-intelligence/diagnostic"
        secondaryLabel="Run the Diagnostic"
      />

      <DarkSection>
        <SectionIntro
          label="Three Problems We Solve"
          title="Not theory. The three operational problems eating Lee County service businesses."
          description="Each one has a measurable cost. Each one has a system that recovers it within 30-90 days."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {[
            {
              title: "The 22-38% of calls you miss are revenue you never count.",
              copy:
                "Industry benchmarks put missed-call rates on home-services businesses at 22-38% — most owners think they're at 10%. Our AI receptionist answers 24/7 in English and Spanish, qualifies the lead, books the estimate, and texts you a summary. For most Lee County operators, that's the system that pays for itself in month one.",
            },
            {
              title: "You can't tell which marketing channel actually closes deals.",
              copy:
                "Google Ads, Facebook, truck wraps, referrals, the Yellow Pages somehow — most operators have 4-7 channels running with zero visibility into which one closed the last 10 jobs. We install causal attribution that ties revenue back to source so you can double down on what works and cut the rest.",
            },
            {
              title:
                "You're personally answering emails at 9pm because nobody else will.",
              copy:
                "Dispatching jobs, chasing late invoices, asking for reviews, sending confirmations — most of these tasks are perfectly automatable. We design automation that handles the repeatable parts so you can get back to the work that requires your judgment.",
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
          label="Services for Fort Myers Operators"
          title="What we install — in priority order."
          description="We start with the AI receptionist because it's the cheapest, fastest proof of ROI. We expand only when the data says it's the next bottleneck."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["AI Receptionist", "24/7 bilingual call answering with emergency escalation logic for restoration, HVAC, and marine operators."],
            ["Marketing Automation", "Lead routing, follow-up sequences, no-show recovery, review-request workflows."],
            ["Analytics & Attribution", "Which marketing channel actually closes jobs — and what each closed job cost you."],
            ["Business Automation", "Invoice reminders, crew schedule sync, review requests, customer-satisfaction follow-ups."],
            ["AI Consulting", "Quarterly strategy + system optimization once the operational layer is in place."],
            ["AEO Strategy", "Get cited when locals ask ChatGPT, Claude, or Google AI for service recommendations."],
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
              Lee County runs on service businesses. Now they need the operational layer.
            </h2>
          </div>
          <div className="space-y-5 text-base leading-7 text-[#1F2937]">
            <p>
              Fort Myers and Lee County run on service businesses: HVAC
              contractors, marine operators around the Caloosahatchee,
              restoration companies that rebuilt after Ian, plumbing,
              electrical, roofing, and a growing professional-services tier
              in downtown.
            </p>
            <p>
              What unites them: owners who&apos;ve built real revenue
              without ever installing the operational systems that turn $2M
              businesses into $5M businesses. Audio Jones is the AI
              consultant designed for that exact transition. We don&apos;t
              sell you software you&apos;ll never use. We install the three
              or four operational layers that compound revenue: AI
              receptionist, attribution, lead automation, and executive
              reporting.
            </p>
            <p>
              Serving Fort Myers, Cape Coral, North Fort Myers, Lehigh
              Acres, and the Lee County corridor. Most engagements show
              measurable lift in 60-90 days.
            </p>
          </div>
        </div>
      </LightProofSection>

      <DarkSection>
        <SectionIntro
          label="Frequently Asked"
          title="The questions Fort Myers operators actually ask."
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
        title="See what the AI receptionist would recover for your business."
        description="Book a 30-minute Strategy Session. We'll look at your actual call volume, missed-call rate, and lead-channel mix — and tell you what installing the system would recover in the first 90 days."
        primaryLabel="Book a Strategy Session"
        primaryHref="/book-a-call?source=fort-myers-blue-collar"
        secondaryLabel="Run the Diagnostic"
        secondaryHref="/applied-intelligence/diagnostic"
      />
    </>
  );
}
