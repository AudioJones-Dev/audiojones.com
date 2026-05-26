/**
 * /ai-services-fort-lauderdale
 *
 * P0 localized landing page — built from
 * docs/landing-pages/ai-services-fort-lauderdale.md.
 *
 * Broward positioning: marine + hospitality + real estate + professional
 * services. Buyers operate between Miami's brand pressure and the
 * Treasure Coast's quieter markets — sharper differentiation, tighter
 * attribution. Copy distinct from Hialeah (bilingual angle) and Miami
 * (density angle).
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

const PATH = "/ai-services-fort-lauderdale";
const TITLE =
  "AI Services & Marketing Consultant in Fort Lauderdale — Audio Jones";
const DESCRIPTION =
  "Audio Jones is a Fort Lauderdale-area AI consultant for founder-led businesses. Marketing automation, attribution, AI workflows, founder media systems. Serving Broward County.";

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

const FAQS = [
  {
    question: "Do you have an office in Fort Lauderdale?",
    answer:
      "We're based in Hialeah, about 25 minutes south. In-person sessions in Fort Lauderdale by appointment. Most implementation work happens remotely once the system is installed.",
  },
  {
    question: "What industries do you specialize in for Broward?",
    answer:
      "Marine services, hospitality, real estate, healthcare, and professional services — anywhere a founder-led business has crossed $250K ARR and needs the operational intelligence layer.",
  },
  {
    question:
      "How is your AI implementation different from a martech agency?",
    answer:
      "Agencies execute campaigns. We design the systems underneath — attribution, automation, qualification — so the campaign work becomes measurable and compounding.",
  },
  {
    question: "Do you work with seasonal businesses?",
    answer:
      "Yes. Broward's hospitality and marine sectors run highly seasonal demand. Our attribution dashboards isolate seasonal versus structural demand so you can plan accordingly.",
  },
  {
    question: "What does an engagement typically look like?",
    answer:
      "Ninety-day implementation, monthly optimization retainer afterward. First measurable wins in 30-60 days; full system in 90.",
  },
];

// TODO(stakeholder): publish pricing or remove. SW Florida pages share this TODO.
const PRICING_NOTE =
  "Engagement pricing scales with the systems being installed. The Strategy Session is complimentary.";

export default function AiServicesFortLauderdalePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Service Areas", url: "/service-areas" },
          { name: "Fort Lauderdale", url: PATH },
        ])}
      />
      <JsonLd
        data={serviceJsonLd({
          name: "AI Services in Fort Lauderdale",
          description: DESCRIPTION,
          url: PATH,
          areaServedCity: "Fort Lauderdale",
          serviceType: [
            "AI Consulting",
            "Marketing Automation",
            "Founder Intelligence Systems",
            "Analytics & Attribution",
          ],
        })}
      />
      <JsonLd data={faqJsonLd(FAQS)} />

      <SignalHero
        title="AI services & marketing consulting in Fort Lauderdale."
        description="Fort Lauderdale's founder-led businesses — marine services, hospitality, real estate, professional services — operate in one of the most competitive small-market environments in Florida. Audio Jones installs the operational intelligence systems that compound."
        primaryHref="/book-a-call?source=fort-lauderdale"
        primaryLabel="Book a Strategy Session"
        secondaryHref="/applied-intelligence/diagnostic"
        secondaryLabel="Start the Diagnostic"
      />

      <DarkSection>
        <SectionIntro
          label="Why Fort Lauderdale Founders Choose Audio Jones"
          title="Broward businesses sit between Miami's brand pressure and the Treasure Coast's quiet."
          description="You need sharper differentiation, tighter attribution, and faster compounding. We install the operational layer that makes Broward businesses look more like Miami competitors and less like overlooked alternatives."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {[
            {
              title: "You compete with Miami without Miami's customer density.",
              copy:
                "Broward businesses face Miami-level brand pressure with less foot traffic and lower customer density per square mile. Tighter attribution and sharper messaging matter more here than almost anywhere else in the state. We install the operational layer that gives Broward operators the same compounding visibility their Miami competitors run on.",
            },
            {
              title:
                "Marine, hospitality, and professional services need different martech than tech startups.",
              copy:
                "The marketing-automation playbooks that work for SaaS don't translate to charter boats, restoration companies, or Las Olas restaurants. We design systems that fit your actual buyer journey — long consideration cycles, referral-heavy attribution, seasonal demand.",
            },
            {
              title: "Your CRM is a list, not a system.",
              copy:
                "Most Broward businesses have a CRM that holds contacts but doesn't automate anything. We install the operational layer on top: lead scoring, automated qualification, follow-up sequences, executive reporting that runs nightly.",
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
          label="Applied Intelligence Services for Broward"
          title="What we install."
          description="Engagements are scoped to Broward buyer journeys — longer consideration cycles, seasonal demand, and the referral-and-relationship attribution patterns this market actually runs on."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["AI Consulting", "Strategy + roadmap for AI integration across long sales cycles."],
            ["Marketing Automation", "Buyer-journey-aware workflows for service businesses."],
            ["Founder Intelligence Systems", "Operating-system design for founder-led companies."],
            ["Analytics & Attribution", "Multi-touch attribution that survives 60-180 day sales cycles."],
            ["Podcast Production", "Authority-building media systems for Broward executives."],
            ["Conversion Optimization", "Funnel diagnosis for service-business sales cycles."],
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
              From Las Olas to Port Everglades — built for the way Broward
              actually operates.
            </h2>
          </div>
          <div className="space-y-5 text-base leading-7 text-[#1F2937]">
            <p>
              Fort Lauderdale&apos;s economy is a layered mix: marine
              services and the Port Everglades corridor, hospitality and
              tourism around Las Olas and the beach, real estate from
              downtown to the Galt Ocean, professional services across
              Broward, and a fast-growing tech scene in the FAT Village arts
              district.
            </p>
            <p>
              Audio Jones is a Broward-adjacent AI consultant (based in
              Hialeah, 25 minutes south) working with founder-led businesses
              across all of these verticals. We deliver in-person sessions
              in Fort Lauderdale and remote across the rest of Broward.
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
          title="What Fort Lauderdale founders ask before we start."
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
        title="Ready to install the operational layer?"
        description="Book a 30-minute Strategy Session. We'll diagnose your top constraint and show you the system most likely to move your top metric in 60-90 days."
        primaryLabel="Book a Strategy Session"
        primaryHref="/book-a-call?source=fort-lauderdale"
        secondaryLabel="Start the Diagnostic"
        secondaryHref="/applied-intelligence/diagnostic"
      />
    </>
  );
}
