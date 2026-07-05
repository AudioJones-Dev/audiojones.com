import type { Metadata } from "next";
import Link from "next/link";

import FAQ from "@/components/founder-intelligence/FAQ";
import {
  DarkSection,
  FinalCta,
  LightProofSection,
  SectionIntro,
  SignalHero,
} from "@/components/marketing/DesignSystemSections";
import JsonLd from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { ctaLinks } from "@/config/links";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  breadcrumbJsonLd,
  definedTermJsonLd,
  faqJsonLd,
  serviceJsonLd,
} from "@/lib/seo/schema";

const PATH = ctaLinks.revenueLeakDiagnostic;
const TITLE = "Founder Revenue Leak Diagnostic";
const DESCRIPTION =
  "A $1,997 diagnostic for founder-led service businesses that checks where leads, follow-up, attribution, and reporting may be leaking revenue.";
const DEFINITION =
  "A Founder Revenue Leak Diagnostic is a structured entry point into Founder Intelligence Systems that checks where earned demand may be lost across response speed, follow-up, qualification, attribution, CRM process, and reporting clarity.";

const leakSignals = [
  "Missed calls, stale form fills, or slow first response.",
  "Follow-up that stops before the buyer has made a decision.",
  "Weak lead qualification and unclear handoffs between tools or people.",
  "Attribution gaps that make the founder scale the wrong channel.",
  "CRM, reporting, and ownership gaps that hide the loss.",
] as const;

const diagnosticChecks = [
  {
    title: "Response speed",
    description:
      "How fast new demand is captured, acknowledged, routed, and recovered when the first attempt fails.",
  },
  {
    title: "Follow-up system",
    description:
      "Whether lead follow-up has timing, ownership, message sequence, and escalation logic.",
  },
  {
    title: "Qualification path",
    description:
      "Whether the business can separate fit, urgency, value, and next action without founder guesswork.",
  },
  {
    title: "Attribution clarity",
    description:
      "Whether source, conversation, booking, and close data connect well enough to guide spend.",
  },
  {
    title: "Reporting rhythm",
    description:
      "Whether the founder can see the few operating numbers that explain revenue movement.",
  },
  {
    title: "System readiness",
    description:
      "Whether ResponseOS, automation, or a broader Founder Intelligence System is the right next layer.",
  },
] as const;

const outcomes = [
  "A ranked map of likely revenue leaks.",
  "A prioritized action plan by impact, difficulty, confidence, and dependency.",
  "A clear recommendation for the next system layer: fix follow-up, improve attribution, install ResponseOS, or scope a larger Founder Intelligence System.",
] as const;

const FAQS = [
  {
    question: "What is a Founder Revenue Leak Diagnostic?",
    answer: DEFINITION,
  },
  {
    question: "What does the diagnostic cost?",
    answer:
      "The Founder Revenue Leak Diagnostic is $1,997. Larger implementation work is scoped separately after the diagnostic shows which likely leak is worth checking first.",
  },
  {
    question: "Who is it for?",
    answer:
      "It is for founder-led service businesses, usually around $250K to $5M in annual revenue, that generate leads but cannot clearly see where opportunities are lost.",
  },
  {
    question: "Is this a marketing audit?",
    answer:
      "No. A marketing audit usually reviews campaigns. This diagnostic reviews what happens after demand arrives: response speed, follow-up, qualification, attribution, CRM process, and reporting clarity.",
  },
  {
    question: "What happens after the diagnostic?",
    answer:
      "You get a ranked plan. The next step may be a small follow-up fix, a ResponseOS install, attribution cleanup, or a broader Founder Intelligence System.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

export default function FounderRevenueLeakDiagnosticPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Diagnostics", url: "/ai-readiness-diagnostic" },
          { name: TITLE, url: PATH },
        ])}
      />
      <JsonLd
        data={serviceJsonLd({
          name: TITLE,
          description: DESCRIPTION,
          url: PATH,
          serviceType: "Revenue leak diagnostic",
          audience: "Founder-led service businesses",
          offers: {
            price: "1997",
            priceCurrency: "USD",
            url: PATH,
            description:
              "Structured diagnostic that checks for and ranks likely revenue leaks before implementation is scoped.",
          },
        })}
      />
      <JsonLd
        data={definedTermJsonLd({
          name: TITLE,
          description: DEFINITION,
          url: PATH,
        })}
      />
      <JsonLd data={faqJsonLd(FAQS)} />

      <SignalHero
        title="Check where earned revenue may be leaking before you buy more leads."
        description={DESCRIPTION}
        primaryHref={ctaLinks.bookSession}
        primaryLabel="Book the Diagnostic"
        secondaryHref="/pricing"
        secondaryLabel="View Pricing"
        stats={[
          { metric: "$1,997", label: "Public starting price for the diagnostic." },
          { metric: "6", label: "Operating areas checked before system recommendations." },
          { metric: "1", label: "Ranked next move instead of a menu of tools." },
        ]}
      />

      <DarkSection>
        <SectionIntro
          label="The problem"
          title="Most service businesses do not lose revenue in one obvious place."
          description="Leaks may include the gaps between demand generation and closed work: late first response, thin follow-up, inconsistent qualification, or attribution that is too blurry to show which fix matters."
        />
        <div className="mt-10 grid gap-4 lg:grid-cols-5">
          {leakSignals.map((signal) => (
            <div key={signal} className="aj-product-card">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-[var(--aj-blue)]">
                Leak signal
              </p>
              <p className="mt-3 text-sm leading-7 text-fg-2">{signal}</p>
            </div>
          ))}
        </div>
      </DarkSection>

      <LightProofSection>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--aj-blue-deep)]">
              Diagnostic scope
            </p>
            <h2 className="mt-4 font-accent text-[clamp(2.25rem,4vw,4rem)] font-bold leading-[1.02] tracking-[-0.035em]">
              The diagnostic checks the conversion system, not just the website.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#4b5563]">
              A useful revenue read follows the full path from inbound demand to
              booked work. The output is a ranked operating plan, not copied
              competitor copy or generic SEO recommendations.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {diagnosticChecks.map((check) => (
              <div key={check.title} className="aj-proof-card">
                <h3 className="font-accent text-2xl font-bold">{check.title}</h3>
                <p className="mt-3 leading-7 text-[#4b5563]">{check.description}</p>
              </div>
            ))}
          </div>
        </div>
      </LightProofSection>

      <DarkSection className="bg-bg-1">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <SectionIntro
            label="What you receive"
            title="A decision-ready map of the leaks worth fixing first."
            description="The work separates facts from inference and ranks the next actions by leverage. The goal is to make the next Founder Intelligence System build smaller, clearer, and easier to justify."
          />
          <div className="grid gap-4">
            {outcomes.map((outcome, index) => (
              <div
                key={outcome}
                className="rounded-xl border border-[var(--line-2)] bg-bg-2 p-6"
              >
                <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-[var(--aj-amber)]">
                  Output {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-3 text-lg leading-8 text-fg-1">{outcome}</p>
              </div>
            ))}
          </div>
        </div>
      </DarkSection>

      <DarkSection>
        <div className="aj-form-panel mx-auto max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--aj-orange)]">
            Which path fits?
          </p>
          <h2 className="mt-4 font-accent text-3xl font-bold tracking-[-0.03em] text-fg-0 sm:text-4xl">
            Use the free score if you need orientation. Use this diagnostic when
            the revenue question is already active.
          </h2>
          <p className="mt-4 text-lg leading-8 text-fg-2">
            The free AI Readiness Diagnostic is the broad entry point. The
            Founder Revenue Leak Diagnostic is the paid operating review when
            lead response, follow-up, attribution, or reporting is already
            suspected of affecting revenue.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={ctaLinks.bookSession} variant="glow">
              Book the Diagnostic
            </ButtonLink>
            <ButtonLink href="/ai-readiness-diagnostic" variant="secondary">
              Start with the Free Score
            </ButtonLink>
          </div>
          <div className="mt-6 flex flex-col gap-3 text-sm font-semibold text-signal-yellow sm:flex-row sm:flex-wrap">
            <Link href="/pricing" className="hover:underline">
              See offers and pricing
            </Link>
            <Link href="/agents/responseos" className="hover:underline">
              Explore ResponseOS
            </Link>
            <Link href="/insights/revenue-leak-diagnostic-cost" className="hover:underline">
              Read the cost breakdown
            </Link>
          </div>
        </div>
      </DarkSection>

      <DarkSection className="bg-bg-1">
        <SectionIntro
          label="FAQ"
          title="Direct answers for buyers and search engines."
          description="These answers define the offer, the price, the fit, and the downstream implementation path."
        />
        <div className="mx-auto mt-10 max-w-3xl">
          <FAQ items={FAQS} />
        </div>
      </DarkSection>

      <FinalCta
        title="Diagnose the leak before scoping the system."
        description="If the business is generating demand but revenue visibility is unclear, start with the paid diagnostic before scoping the Founder Intelligence System."
        primaryLabel="Book the Diagnostic"
        primaryHref={ctaLinks.bookSession}
        secondaryLabel="View Pricing"
        secondaryHref="/pricing"
      />
    </>
  );
}
