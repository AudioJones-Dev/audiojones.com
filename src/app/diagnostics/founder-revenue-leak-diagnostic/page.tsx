import type { Metadata } from "next";
import Link from "next/link";

import Breadcrumbs from "@/components/founder-intelligence/Breadcrumbs";
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

const PATH = "/diagnostics/founder-revenue-leak-diagnostic";
const TITLE = "Founder Revenue Leak Diagnostic";
const DESCRIPTION =
  "Find where founder-led service businesses lose revenue through missed calls, slow follow-up, weak qualification, broken attribution, and reporting gaps.";
const DEFINITION =
  "The Founder Revenue Leak Diagnostic is a structured assessment that shows where a founder-led service business is losing revenue through missed calls, slow follow-up, weak qualification, broken attribution, and reporting gaps.";

const LEAKS = [
  {
    title: "Missed calls",
    description:
      "Inbound demand arrives, but the business does not respond fast enough to convert it.",
  },
  {
    title: "Slow follow-up",
    description:
      "Leads get one touch, then disappear into a CRM, inbox, spreadsheet, or memory gap.",
  },
  {
    title: "Weak qualification",
    description:
      "The team spends equal energy on every lead instead of routing the right-fit buyer first.",
  },
  {
    title: "Broken attribution",
    description:
      "Marketing spend continues, but the business cannot see which source created booked revenue.",
  },
  {
    title: "Reporting gaps",
    description:
      "The leak exists in plain sight, but no operating report makes it visible soon enough to fix.",
  },
] as const;

const LADDER = [
  {
    step: "Free score",
    title: "Size the leak",
    description:
      "Use the free revenue-leak score path to estimate where the opportunity is hiding.",
  },
  {
    step: "Paid diagnostic",
    title: "Turn the score into a prescription",
    description:
      "The $1,997 diagnostic produces a decision-ready report and prioritized action plan.",
  },
  {
    step: "ResponseOS",
    title: "Recover the demand",
    description:
      "When the leak is follow-up, intake, or recovery, ResponseOS becomes the likely first system.",
  },
  {
    step: "Founder Intelligence System",
    title: "Connect the operating layer",
    description:
      "When the leak is broader than revenue recovery, the next step is a fuller intelligence system.",
  },
] as const;

const OUTPUTS = [
  "A map of where revenue leaks after demand enters the business.",
  "A ranked recovery priority, not a generic list of marketing ideas.",
  "A recommended next system: ResponseOS, workshop, or broader Founder Intelligence build.",
  "A decision-ready action plan for the highest-leverage fix.",
] as const;

const FAQS = [
  {
    question: "What is the Founder Revenue Leak Diagnostic?",
    answer: DEFINITION,
  },
  {
    question: "Is this the same as the ROI calculator?",
    answer:
      "No. The ROI calculator is the free score path. The paid diagnostic is the deeper analysis that turns the score into a decision-ready action plan.",
  },
  {
    question: "How much does the Revenue Leak Diagnostic cost?",
    answer:
      "The paid Revenue Leak Diagnostic is currently listed at $1,997. The free score path should be used first when you are still sizing the leak.",
  },
  {
    question: "What happens after the diagnostic?",
    answer:
      "The output identifies the highest-leverage leak and routes the business toward the right next step: ResponseOS, a workshop, or a broader Founder Intelligence System.",
  },
  {
    question: "Who is it for?",
    answer:
      "It is for founder-led service businesses with inbound demand, missed follow-up, unclear attribution, or a sense that revenue is leaking after leads arrive.",
  },
  {
    question: "Do I need to book a call first?",
    answer:
      "No. Start with the free score path. Book the paid diagnostic when you want the deeper analysis and prescription.",
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
          { name: TITLE, url: PATH },
        ])}
      />
      <JsonLd data={definedTermJsonLd({ name: TITLE, description: DEFINITION, url: PATH })} />
      <JsonLd
        data={serviceJsonLd({
          name: TITLE,
          description: DEFINITION,
          url: PATH,
          price: "1997",
          priceCurrency: "USD",
        })}
      />
      <JsonLd data={faqJsonLd(FAQS)} />

      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: TITLE },
        ]}
      />

      <SignalHero
        title={TITLE}
        description={DESCRIPTION}
        primaryHref={ctaLinks.roiCalculator}
        primaryLabel="Calculate your leak"
        secondaryHref={ctaLinks.bookSession}
        secondaryLabel="Book the paid diagnostic"
        stats={[
          { metric: "Free", label: "Start with the revenue-leak score path before booking." },
          { metric: "$1,997", label: "Paid diagnostic with a decision-ready report." },
          { metric: "ResponseOS", label: "Likely next system when follow-up is the leak." },
        ]}
      />

      <DarkSection>
        <SectionIntro
          label="What it finds"
          title="Revenue usually leaks after the lead arrives."
          description="This diagnostic looks at the operating path between demand and booked revenue: response speed, follow-up, qualification, attribution, and reporting."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LEAKS.map((leak) => (
            <div key={leak.title} className="aj-product-card">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--aj-blue)]">
                Leak signal
              </p>
              <h2 className="mt-3 font-accent text-2xl font-bold tracking-[-0.02em] text-fg-0">
                {leak.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-fg-2">{leak.description}</p>
            </div>
          ))}
        </div>
      </DarkSection>

      <LightProofSection>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--aj-blue-deep)]">
              Diagnostic ladder
            </p>
            <h2 className="mt-4 font-accent text-[clamp(2.25rem,4vw,4rem)] font-bold leading-[1.02] tracking-[-0.035em]">
              Free score first. Paid prescription second.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#4b5563]">
              The page is not a shortcut to a sales call. It routes a founder
              from signal sizing into the right paid analysis, then into the
              system that actually closes the leak.
            </p>
          </div>
          <div className="grid gap-4">
            {LADDER.map((item) => (
              <div key={item.step} className="aj-proof-card">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--aj-blue-deep)]">
                  {item.step}
                </p>
                <h3 className="mt-3 font-accent text-2xl font-bold">{item.title}</h3>
                <p className="mt-3 leading-7 text-[#4b5563]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </LightProofSection>

      <DarkSection>
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <SectionIntro
              label="Pricing reference"
              title="The paid diagnostic is analysis, not generic consulting time."
              description="The Revenue Leak Diagnostic is currently listed at $1,997. Use the free score path if you are still sizing the leak; use the paid diagnostic when you want the report and prescription."
            />
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={ctaLinks.roiCalculator} variant="glow">
                Calculate your leak
              </ButtonLink>
              <ButtonLink href="/pricing" variant="secondary">
                See pricing
              </ButtonLink>
            </div>
          </div>
          <div className="aj-card-signal">
            <div className="aj-card-inner">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--aj-blue)]">
                What you get
              </p>
              <ul className="mt-6 space-y-4">
                {OUTPUTS.map((item) => (
                  <li key={item} className="grid grid-cols-[auto_1fr] gap-3 text-sm leading-7 text-fg-2">
                    <span className="mt-2 h-2 w-2 rounded-full bg-signal-yellow" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </DarkSection>

      <DarkSection className="bg-bg-1">
        <SectionIntro
          label="Best fit"
          title="Built for founder-led service businesses with demand already entering the system."
          description="The first visible mention matters: Founder Intelligence Systems for founder-led service businesses should start from diagnosis, not tool shopping. This route is for operators who suspect the revenue problem is in response, follow-up, attribution, or handoff quality."
        />
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <Link href="/agents/responseos" className="aj-product-card block">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--aj-blue)]">
              Likely system
            </p>
            <h3 className="mt-3 font-accent text-2xl font-bold tracking-[-0.02em] text-fg-0">
              ResponseOS
            </h3>
            <p className="mt-4 text-sm leading-7 text-fg-2">
              Use when the leak is missed calls, slow follow-up, stalled leads, or recovery.
            </p>
          </Link>
          <Link href="/founder-intelligence" className="aj-product-card block">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--aj-blue)]">
              Broader system
            </p>
            <h3 className="mt-3 font-accent text-2xl font-bold tracking-[-0.02em] text-fg-0">
              Founder Intelligence
            </h3>
            <p className="mt-4 text-sm leading-7 text-fg-2">
              Use when the leak spans revenue, operations, reporting, memory, and decision flow.
            </p>
          </Link>
          <Link href="/insights/revenue-leak-diagnostic" className="aj-product-card block">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--aj-blue)]">
              Definition
            </p>
            <h3 className="mt-3 font-accent text-2xl font-bold tracking-[-0.02em] text-fg-0">
              Revenue Leak Diagnostic
            </h3>
            <p className="mt-4 text-sm leading-7 text-fg-2">
              Read the concept article behind the diagnostic and why it differs from a marketing audit.
            </p>
          </Link>
        </div>
      </DarkSection>

      <DarkSection>
        <SectionIntro
          label="FAQ"
          title="Common questions"
          description="Direct answers for founders comparing the free score, paid diagnostic, and next system."
        />
        <div className="mx-auto mt-10 max-w-3xl">
          <FAQ items={FAQS} />
        </div>
      </DarkSection>

      <FinalCta
        title="Find the leak before you buy the fix."
        description="Start with the free score path. Book the paid diagnostic when you are ready for the deeper analysis and prescription."
        primaryLabel="Calculate your leak"
        primaryHref={ctaLinks.roiCalculator}
        secondaryLabel="Book the paid diagnostic"
        secondaryHref={ctaLinks.bookSession}
      />
    </>
  );
}
