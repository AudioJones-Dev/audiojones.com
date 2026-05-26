/**
 * /ai-consultant-miami
 *
 * P0 localized landing page — built from
 * docs/landing-pages/ai-consultant-miami.md.
 *
 * Miami's positioning differs from Hialeah's: Hialeah leans bilingual /
 * family-business; Miami leans high-density competition + venture-and-
 * professional-services mix. Copy must reflect that — not be a Hialeah
 * page with the city name swapped.
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

const PATH = "/ai-consultant-miami";
const TITLE = "AI Consultant in Miami — Audio Jones Applied Intelligence";
const DESCRIPTION =
  "Audio Jones is a Miami AI consultant for founder-led businesses ($250K-$5M ARR). Marketing automation, attribution, AI workflows, podcast production. Based in Miami-Dade.";

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

const FAQS = [
  {
    question:
      "What's the difference between an AI consultant and a marketing agency?",
    answer:
      "An agency executes campaigns. An AI consultant designs the systems that make campaigns measurable, automated, and compounding. Most Miami businesses have agencies. Fewer have the operational layer that makes agency work attributable.",
  },
  {
    question: "Do you build the AI tools or just advise on them?",
    answer:
      "We build. Most engagements include hands-on implementation — n8n workflows, custom GPTs, attribution dashboards, AI receptionist integration. Strategy plus execution in the same engagement.",
  },
  {
    question: "What industries do you specialize in?",
    answer:
      "Founder-led service businesses across professional services, healthcare, home services, and creative industries. The common thread is the founder wears too many hats and has crossed the $250K-$5M ARR band where operational systems become the bottleneck.",
  },
  {
    question: "Do you work with venture-backed startups?",
    answer:
      "Occasionally. The fit is best for founder-led service businesses with actual revenue and a founder who wants to install systems, not raise capital. If you're pre-revenue or pre-seed, we're not the right fit.",
  },
  {
    question: "How fast does AI implementation actually take?",
    answer:
      "First measurable win in 30-60 days. Full operational layer in 90-180 days. Compounding effects show up at six months and beyond.",
  },
];

// TODO(stakeholder): publish actual pricing ranges or remove this block.
const PRICING_NOTE =
  "Engagement pricing scales with the systems being installed. The Strategy Session is complimentary.";

export default function AiConsultantMiamiPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Service Areas", url: "/service-areas" },
          { name: "Miami", url: PATH },
        ])}
      />
      <JsonLd
        data={serviceJsonLd({
          name: "AI Consultant in Miami",
          description: DESCRIPTION,
          url: PATH,
          areaServedCity: "Miami",
          serviceType: [
            "AI Consulting",
            "AI Automation",
            "Marketing Automation",
            "Analytics & Attribution",
          ],
        })}
      />
      <JsonLd data={faqJsonLd(FAQS)} />

      <SignalHero
        title="AI consultant in Miami for founder-led businesses."
        description="Miami is full of operators who've built real businesses without ever installing the operational intelligence systems that compound. Audio Jones helps Miami-based founders design AI workflows, marketing automation, and attribution that turn busy days into measurable growth."
        primaryHref="/book-a-call?source=miami"
        primaryLabel="Book a Strategy Session"
        secondaryHref="/applied-intelligence/diagnostic"
        secondaryLabel="Start the Diagnostic"
      />

      <DarkSection>
        <SectionIntro
          label="Why Miami Founders Choose Audio Jones"
          title="The Miami market punishes operators without operational intelligence."
          description="Brickell agencies, Wynwood studios, Coral Gables consultancies — Miami's per-square-mile competition for founder-led service businesses is among the steepest in the country. Operating instinct alone stops scaling around $1-2M ARR."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {[
            {
              title: "The Miami business landscape is the most competitive in the state.",
              copy:
                "You're competing against agencies in Brickell, consultants in Wynwood, and AI startups in the Miami tech corridor. Without operational intelligence you can't see which marketing dollar is working and which is leaking. Audio Jones installs the attribution layer most Miami businesses are missing.",
            },
            {
              title: "You need bilingual marketing systems that don't break at scale.",
              copy:
                "Miami's market splits roughly 70/30 Spanish-English. Most marketing automation tools handle bilingual as an afterthought. We design workflows where Spanish-language segmentation, content, and reporting are first-class — not tacked-on translations.",
            },
            {
              title: "You're a founder doing too much.",
              copy:
                "Miami founders typically wear seven hats and still personally close deals. Audio Jones builds operational systems that scale beyond your calendar: AI receptionists, automated qualification, executive reporting, and founder media engines that work whether you're at the office or on South Beach.",
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
          label="Applied Intelligence Services"
          title="The systems we install in Miami-Dade."
          description="Each engagement starts with the diagnostic, then we install the operational layer most likely to move your top metric within 60-90 days."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["AI Consulting", "Strategy + roadmap for AI integration across the buyer journey."],
            ["Marketing Automation", "Bilingual workflows engineered to survive scale and seasonality."],
            ["Founder Intelligence Systems", "Operating-system design for founder-led companies."],
            ["Podcast Production", "Miami's #1 personal-brand multiplier — production, distribution, and repurposing."],
            ["Analytics & Attribution", "Causal attribution that survives multi-touch journeys."],
            ["AEO Strategy", "Get cited in ChatGPT, Claude, Perplexity, and Google AI Overviews."],
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
              We work across every Miami-Dade neighborhood.
            </h2>
          </div>
          <div className="space-y-5 text-base leading-7 text-[#1F2937]">
            <p>
              Miami&apos;s economy spans tech (Brickell, Wynwood), finance
              (Brickell &amp; downtown), healthcare (Coral Gables), creative
              services (Wynwood &amp; Design District), hospitality (the
              beaches &amp; South Beach), and a deep small-business layer
              that touches every neighborhood from Allapattah to Kendall.
            </p>
            <p>
              Audio Jones is based in Miami-Dade and works across all of
              these verticals — anywhere a founder-led business has crossed
              $250K ARR and needs the operational intelligence layer to
              scale beyond personal effort. We deliver in-person sessions in
              Miami, hybrid for clients elsewhere in the state.
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
          title="What Miami founders ask before bringing us in."
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
        title="Ready to install applied intelligence?"
        description="Book a 30-minute Strategy Session. We'll diagnose your top constraint and show you the system that will move your top metric fastest."
        primaryLabel="Book a Strategy Session"
        primaryHref="/book-a-call?source=miami"
        secondaryLabel="Start the Diagnostic"
        secondaryHref="/applied-intelligence/diagnostic"
      />
    </>
  );
}
