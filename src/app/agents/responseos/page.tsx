import type { Metadata } from "next";

import FAQ from "@/components/founder-intelligence/FAQ";
import {
  DarkSection,
  LightProofSection,
  SectionIntro,
  SignalConsole,
} from "@/components/marketing/DesignSystemSections";
import PricingCtaLink from "@/components/pricing/PricingCtaLink";
import JsonLd from "@/components/seo/JsonLd";
import { RESPONSEOS_SITE, responseOsHref } from "@/config/links";
import { proofSignals, responseOsFlow } from "@/data/audiojones-design";
import { SITE_URL } from "@/lib/founder-intelligence/tokens";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo/schema";

const DESCRIPTION =
  "ResponseOS is a diagnostic-led, managed Revenue Recovery System for demand capture, qualification, routing, follow-up, booking, escalation, attribution, and reporting.";

const RESPONSEOS_FAQS = [
  {
    question: "Is ResponseOS an AI receptionist?",
    answer:
      "AI receptionist or voice functionality can be one capability when the diagnosed workflow requires it. ResponseOS is the broader Revenue Recovery System behind demand capture, qualification, routing, follow-up, booking, escalation, attribution, and reporting.",
  },
  {
    question: "What comes before implementation?",
    answer:
      "A paid Readiness & Revenue Leak Assessment on responseos.pro. It maps the workflow, sizes the missed demand, and gives a fit or no-fit answer before any setup is scoped.",
  },
  {
    question: "Where are ResponseOS pricing and the assessment?",
    answer:
      "On the ResponseOS product site, responseos.pro. It has the current assessment fee, how setup and the monthly retainer are scoped, a demo on sample data, and the assessment request form.",
  },
  {
    question: "Is there a self-service subscription?",
    answer:
      "No public self-service plan is available yet. ResponseOS is currently delivered as a managed implementation with ongoing monitoring and optimization.",
  },
  {
    question: "Are voice, SMS, and model costs included?",
    answer:
      "No. Provider usage is separate from managed-service pricing and is billed directly where possible or passed through transparently under the engagement terms.",
  },
  {
    question: "Does ResponseOS replace our CRM?",
    answer:
      "Not by default. Existing systems of record are retained or integrated where practical. Replacement is recommended only when the diagnosed workflow cannot be supported reliably by the current system.",
  },
  {
    question: "How long does implementation take?",
    answer:
      "Timing depends on access, data quality, workflows, integrations, volume, and complexity. The implementation plan and milestones are established after diagnosis.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: "ResponseOS Revenue Recovery System",
  description: DESCRIPTION,
  path: "/agents/responseos",
});

export default function ResponseOsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Agent Systems", url: "/agents" },
          { name: "ResponseOS", url: "/agents/responseos" },
        ])}
      />
      <JsonLd data={faqJsonLd(RESPONSEOS_FAQS)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "ResponseOS Revenue Recovery System",
          serviceType: "Managed revenue recovery implementation",
          description: DESCRIPTION,
          url: `${SITE_URL}/agents/responseos`,
          sameAs: [RESPONSEOS_SITE],
          provider: {
            "@type": "Organization",
            name: "AJ Digital LLC",
            alternateName: "Audio Jones",
            url: SITE_URL,
          },
          audience: {
            "@type": "BusinessAudience",
            audienceType: "Founder-led service businesses",
          },
        }}
      />

      <section className="relative overflow-hidden border-b border-[var(--line-2)] bg-[var(--aj-gradient-dark)] py-20 sm:py-28 lg:py-32">
        <div className="aj-noise-overlay" aria-hidden />
        <div className="pointer-events-none absolute inset-0 bg-grid-fine opacity-60" aria-hidden />
        <div className="relative mx-auto grid max-w-[1440px] gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="max-w-4xl">
            <p className="aj-data-label">Revenue Recovery System</p>
            <h1 className="mt-5 max-w-full break-words font-accent text-[clamp(2.55rem,9vw,5.6rem)] font-bold leading-[0.96] tracking-[-0.025em] text-fg-0 sm:tracking-[-0.045em]">
              ResponseOS turns missed demand into an accountable recovery path.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-fg-2 sm:text-xl">
              {DESCRIPTION}
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <PricingCtaLink
                href={responseOsHref("/audit", "agents-responseos-hero")}
                eventName="responseos_handoff_cta"
                offerId="responseos-readiness-assessment"
                placement="responseos-hero"
                variant="glow"
              >
                Book the Readiness Assessment
              </PricingCtaLink>
              <PricingCtaLink
                href={responseOsHref("/demo", "agents-responseos-hero")}
                eventName="responseos_handoff_cta"
                offerId="responseos-demo"
                placement="responseos-hero"
                variant="secondary"
              >
                See the demo
              </PricingCtaLink>
            </div>
            <dl className="mt-12 grid gap-4 sm:grid-cols-3">
              {proofSignals.map((signal) => (
                <div key={signal.metric} className="aj-product-card">
                  <dt className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--aj-blue)]">
                    {signal.metric}
                  </dt>
                  <dd className="mt-3 text-sm leading-6 text-fg-2">{signal.label}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="min-w-0">
            <SignalConsole />
          </div>
        </div>
      </section>

      <DarkSection>
        <SectionIntro
          label="The leak"
          title="Slow response is a workflow problem before it is a tool problem."
          description="Missed calls, unowned forms, scattered messages, delayed estimates, and disconnected follow-up create the same failure pattern: legitimate demand exists, but the business cannot turn it into a reliable next action."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            ["Demand scatters", "Calls, forms, email, social, chat, calendars, and estimates create separate response queues."],
            ["Ownership breaks", "The team cannot see who should act, which opportunity is qualified, or what the next step is."],
            ["Evidence disappears", "Without attribution and outcome reporting, the business cannot learn which recovery path worked."],
          ].map(([title, copy]) => (
            <article key={title} className="aj-product-card">
              <h3 className="font-accent text-2xl font-bold tracking-[-0.02em] text-fg-0">
                {title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-fg-2">{copy}</p>
            </article>
          ))}
        </div>
      </DarkSection>

      <DarkSection className="bg-bg-1">
        <SectionIntro
          label="How it works"
          title="Capture, qualify, route, recover, learn."
          description="ResponseOS creates one managed recovery path with human escalation and measurable operating outcomes."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {responseOsFlow.map((item) => (
            <article key={item.step} className="aj-card-signal">
              <div className="aj-card-inner h-full">
                <p className="font-mono text-sm font-bold text-signal-yellow">{item.step}</p>
                <h3 className="mt-4 font-accent text-2xl font-bold text-fg-0">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-fg-2">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </DarkSection>

      <LightProofSection>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--aj-blue-deep)]">
              Managed capability
            </p>
            <h2 className="mt-4 font-accent text-[clamp(2.25rem,4vw,4rem)] font-bold leading-[1.02] tracking-[-0.035em]">
              Voice is one possible channel. Revenue recovery is the system.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#4b5563]">
              AI receptionist, voice, or conversational functionality is selected only
              when the diagnosed workflow requires it. The managed system remains
              accountable for the full opportunity path.
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {[
              "Demand capture",
              "Qualification",
              "Routing",
              "Follow-up",
              "Booking",
              "Human escalation",
              "Attribution baseline",
              "Revenue-recovery reporting",
              "Monitoring",
              "Optimization",
            ].map((capability) => (
              <li
                key={capability}
                className="border border-[#d8d3c6] bg-white/60 px-4 py-3 text-sm font-semibold text-[#101827]"
              >
                {capability}
              </li>
            ))}
          </ul>
        </div>
      </LightProofSection>

      <DarkSection>
        <SectionIntro
          label="Pricing and next step"
          title="Pricing, the demo, and the assessment live on responseos.pro."
          description="ResponseOS has its own product site. Start with the paid Readiness & Revenue Leak Assessment there; setup and the monthly retainer are scoped from what it finds."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {[
            ["Readiness Assessment", "Sizes your missed demand and gives a fit or no-fit answer before any install.", "/audit", "Book the assessment"],
            ["Pricing", "How the assessment, setup, and monthly retainer work.", "/pricing", "See ResponseOS pricing"],
            ["Demo", "Walk a recovery record and the operator console on sample data.", "/demo", "See the demo"],
          ].map(([title, copy, path, label]) => (
            <article key={title} className="aj-product-card">
              <h3 className="font-accent text-3xl font-bold text-fg-0">{title}</h3>
              <p className="mt-4 text-sm leading-7 text-fg-2">{copy}</p>
              <div className="mt-7">
                <PricingCtaLink
                  href={responseOsHref(path as "/audit" | "/pricing" | "/demo", "agents-responseos-next-step")}
                  eventName="responseos_handoff_cta"
                  offerId={`responseos${path.replace("/", "-")}`}
                  placement="responseos-next-step"
                  variant="secondary"
                >
                  {label}
                </PricingCtaLink>
              </div>
            </article>
          ))}
        </div>
      </DarkSection>

      <DarkSection className="bg-bg-1">
        <SectionIntro
          label="FAQ"
          title="ResponseOS commercial and operating boundaries"
          description="What the managed system covers, what remains separate, and why the implementation begins with diagnosis."
        />
        <div className="mx-auto mt-10 max-w-4xl">
          <FAQ items={RESPONSEOS_FAQS} />
        </div>
      </DarkSection>

      <section className="relative overflow-hidden border-t border-[var(--line-2)] bg-[var(--aj-gradient-dark)] py-16 sm:py-24">
        <div className="pointer-events-none absolute inset-0 bg-grid-fine opacity-50" aria-hidden />
        <div className="relative mx-auto max-w-[900px] px-5 text-center sm:px-8">
          <h2 className="font-accent text-[clamp(2.25rem,4vw,4rem)] font-bold leading-[1.02] tracking-[-0.035em] text-fg-0">
            Diagnose the recovery path before installing the system.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-fg-2">
            Book the Readiness Assessment when the business has a real response,
            routing, follow-up, booking, or attribution constraint to investigate.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <PricingCtaLink
              href={responseOsHref("/audit", "agents-responseos-final")}
              eventName="responseos_handoff_cta"
              offerId="responseos-readiness-assessment"
              placement="responseos-final-cta"
              variant="glow"
            >
              Book the Readiness Assessment
            </PricingCtaLink>
            <PricingCtaLink
              href="/founder-intelligence/diagnostic"
              eventName="responseos_handoff_cta"
              offerId="founder-intelligence-diagnostic"
              placement="responseos-final-cta"
              variant="secondary"
            >
              Not sure it is follow-up? Request a Diagnostic
            </PricingCtaLink>
          </div>
        </div>
      </section>
    </>
  );
}
