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
import {
  diagnosisOffers,
  expansionOffers,
  implementationOffers,
  managedIntelligenceOffer,
  pricingFactors,
  pricingFaqs,
  pricingPolicy,
  pricingServicesJsonLd,
  providerUsagePolicy,
  type PricingOffer,
  workshopOffer,
} from "@/content/pricing";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo/schema";

const DESCRIPTION =
  "AJ Digital starts with evidence, installs only the intervention the evidence supports, and manages the system after implementation. Review diagnostic, ResponseOS, and Managed Intelligence starting prices.";

export const metadata: Metadata = buildMetadata({
  title: "AJ Digital Pricing: Diagnose, Implement, Manage",
  description: DESCRIPTION,
  path: "/pricing",
});

function OfferCard({ offer }: { offer: PricingOffer }) {
  return (
    <article
      id={offer.id}
      className={
        offer.featured
          ? "aj-card-signal scroll-mt-28"
          : "aj-product-card scroll-mt-28"
      }
    >
      <div
        className={
          offer.featured
            ? "aj-card-inner flex h-full flex-col"
            : "flex h-full flex-col"
        }
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <h3 className="max-w-xl font-accent text-2xl font-bold tracking-[-0.02em] text-fg-0">
            {offer.name}
          </h3>
          {offer.featured ? (
            <span className="aj-data-label whitespace-nowrap">Defined pilot scope</span>
          ) : null}
        </div>

        <p className="mt-4 font-headline text-3xl font-bold text-signal-yellow">
          {offer.price}
        </p>
        {offer.price !== "Free" && offer.price !== "Application only" ? (
          <p className="mt-2 text-xs uppercase tracking-[0.12em] text-fg-3">
            Starting price for a defined scope
          </p>
        ) : null}
        {offer.priceDetails ? (
          <ul className="mt-3 space-y-1 text-sm font-semibold text-fg-1">
            {offer.priceDetails.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        ) : null}

        <p className="mt-5 text-sm leading-7 text-fg-2">{offer.description}</p>

        {offer.bestFor ? (
          <div className="mt-6">
            <p className="aj-data-label">Best suited for</p>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-fg-2 sm:grid-cols-2">
              {offer.bestFor.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden className="text-signal-yellow">
                    —
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-6">
          <p className="aj-data-label">{offer.scopeLabel ?? "Scope includes"}</p>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-fg-2 sm:grid-cols-2">
            {offer.scope.map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden className="text-signal-yellow">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {offer.guardrails ? (
          <div className="mt-6 border-l-2 border-signal-yellow bg-bg-1 px-4 py-3">
            <p className="aj-data-label">Scope guardrails</p>
            <ul className="mt-2 space-y-2 text-xs leading-6 text-fg-2">
              {offer.guardrails.map((guardrail) => (
                <li key={guardrail}>{guardrail}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-auto pt-7">
          <PricingCtaLink
            href={offer.cta.href}
            eventName={offer.cta.eventName}
            offerId={offer.id}
            placement="offer-card"
            variant={offer.featured ? "glow" : "secondary"}
            className="min-h-11 w-full sm:w-auto"
          >
            {offer.cta.label}
          </PricingCtaLink>
        </div>
      </div>
    </article>
  );
}

export default function PricingPage() {
  const rekonr = diagnosisOffers[2];

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Pricing", url: "/pricing" },
        ])}
      />
      <JsonLd data={faqJsonLd([...pricingFaqs])} />
      <JsonLd data={pricingServicesJsonLd()} />

      <section className="relative overflow-hidden border-b border-[var(--line-2)] bg-[var(--aj-gradient-dark)] py-20 sm:py-28 lg:py-32">
        <div className="aj-noise-overlay" aria-hidden />
        <div className="pointer-events-none absolute inset-0 bg-grid-fine opacity-60" aria-hidden />
        <div className="relative mx-auto grid max-w-[1440px] gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="max-w-4xl">
            <p className="aj-data-label">AJ Digital pricing</p>
            <h1 className="mt-5 max-w-full break-words font-accent text-[clamp(2.55rem,9vw,5.6rem)] font-bold leading-[0.96] tracking-[-0.025em] text-fg-0 sm:tracking-[-0.045em]">
              Find the leak first. Install only what the evidence supports.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-fg-2 sm:text-xl">
              AJ Digital diagnoses operational constraints, implements the smallest
              system required to fix them, and measures whether the intervention
              worked.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <PricingCtaLink
                href={diagnosisOffers[0].cta.href}
                eventName="pricing_assessment_cta"
                offerId="ai-readiness-score"
                placement="hero"
                variant="glow"
              >
                Take the Free Assessment
              </PricingCtaLink>
              <PricingCtaLink
                href={rekonr.cta.href}
                eventName="pricing_rekonr_diagnostic_cta"
                offerId={rekonr.id}
                placement="hero"
                variant="secondary"
              >
                Apply for the Diagnostic
              </PricingCtaLink>
            </div>
            <dl className="mt-12 grid gap-4 sm:grid-cols-3">
              {[
                ["Free", "Preliminary AI Readiness Score."],
                ["$1,997", "Bounded Revenue Leak Assessment."],
                ["Diagnosis first", "Implementation scope follows evidence."],
              ].map(([metric, label]) => (
                <div key={metric} className="aj-product-card">
                  <dt className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--aj-blue)]">
                    {metric}
                  </dt>
                  <dd className="mt-3 text-sm leading-6 text-fg-2">{label}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="min-w-0">
            <SignalConsole />
          </div>
        </div>
      </section>

      <LightProofSection>
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--aj-blue-deep)]">
              Pricing philosophy
            </p>
            <h2 className="mt-4 font-accent text-[clamp(2.25rem,4vw,4rem)] font-bold leading-[1.02] tracking-[-0.035em]">
              Start with evidence. Scope the intervention second.
            </h2>
          </div>
          <div className="space-y-5 text-lg leading-8 text-[#4b5563]">
            <p>
              AJ Digital does not sell a tool before the operating constraint is
              understood. Diagnosis establishes the baseline, the intervention,
              and the measurement plan.
            </p>
            <p>
              Published prices are controlled starting points for testing defined
              scopes. They are not market benchmarks or proof of willingness to pay.
            </p>
          </div>
        </div>
      </LightProofSection>

      <DarkSection>
        <SectionIntro
          label="1 · Start with diagnosis"
          title="Choose the smallest diagnostic that answers the real question."
          description="The free score orients. The bounded assessment isolates one workflow. ReKonr is the first complete paid diagnostic engagement."
        />
        <div className="mt-10 grid items-stretch gap-6 xl:grid-cols-3">
          {diagnosisOffers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      </DarkSection>

      <DarkSection className="border-y border-[var(--line-2)] bg-bg-1">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <SectionIntro
            label="Parallel path · Alignment"
            title="Align the team without substituting education for diagnosis."
            description="The workshop supports responsible adoption, leadership alignment, and practical prioritization. It does not replace ReKonr."
          />
          <OfferCard offer={workshopOffer} />
        </div>
      </DarkSection>

      <DarkSection>
        <SectionIntro
          label="2 · Implement the evidence-supported intervention"
          title="Managed systems, scoped after diagnosis."
          description="ResponseOS is a Revenue Recovery System delivered as a managed implementation. Founder Intelligence Systems extend the governed operating layer only where the evidence supports it."
        />
        <div className="mt-10 grid items-stretch gap-6 xl:grid-cols-3">
          {implementationOffers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      </DarkSection>

      <DarkSection className="border-y border-[var(--line-2)] bg-bg-1">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <SectionIntro
            label="3 · Manage and improve"
            title="Keep the installed system accurate, governed, and useful."
            description="Managed Intelligence is the recurring operate-and-improve layer after implementation, with defined review, support, monitoring, and change boundaries."
          />
          <OfferCard offer={managedIntelligenceOffer} />
        </div>
      </DarkSection>

      <DarkSection>
        <SectionIntro
          label="4 · Expansion and strategic engagements"
          title="Expand only through controlled, evidence-supported scopes."
          description="Worksie remains a narrow reference pilot. Strategic Partnership replaces performance-based positioning without outcome fees or guarantees."
        />
        <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-2">
          {expansionOffers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      </DarkSection>

      <LightProofSection>
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--aj-blue-deep)]">
              What affects pricing
            </p>
            <h2 className="mt-4 font-accent text-[clamp(2.25rem,4vw,4rem)] font-bold leading-[1.02] tracking-[-0.035em]">
              Starting figures are not universal quotes.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#4b5563]">{pricingPolicy}</p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {pricingFactors.map((factor) => (
              <li
                key={factor}
                className="border border-[#d8d3c6] bg-white/60 px-4 py-3 text-sm font-semibold text-[#101827]"
              >
                {factor}
              </li>
            ))}
          </ul>
        </div>
      </LightProofSection>

      <DarkSection className="bg-bg-1">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <SectionIntro
            label="Provider and usage costs"
            title="Managed-service pricing and provider usage are separate."
            description={providerUsagePolicy}
          />
          <div className="aj-product-card">
            <p className="aj-data-label">Commercial guardrails</p>
            <ul className="mt-5 space-y-4 text-sm leading-7 text-fg-2">
              <li>No unlimited voice, SMS, model, storage, or telephony usage.</li>
              <li>No self-service ResponseOS subscription is publicly offered.</li>
              <li>No outcome fee, recovered-revenue percentage, or ROI guarantee is offered.</li>
              <li>Final implementation scope follows diagnosis.</li>
            </ul>
          </div>
        </div>
      </DarkSection>

      <DarkSection>
        <SectionIntro
          label="FAQ"
          title="Pricing, implementation, and operating boundaries"
          description="Straight answers about diagnosis, provider usage, existing systems, timing, guarantees, and what happens after implementation."
        />
        <div id="pricing-faq" className="mx-auto mt-10 max-w-4xl scroll-mt-28">
          <FAQ items={[...pricingFaqs]} />
        </div>
      </DarkSection>

      <section className="relative overflow-hidden border-t border-[var(--line-2)] bg-[var(--aj-gradient-dark)] py-16 sm:py-24">
        <div className="pointer-events-none absolute inset-0 bg-grid-fine opacity-50" aria-hidden />
        <div className="relative mx-auto max-w-[900px] px-5 text-center sm:px-8">
          <h2 className="font-accent text-[clamp(2.25rem,4vw,4rem)] font-bold leading-[1.02] tracking-[-0.035em] text-fg-0">
            Start with the evidence required to make the next decision.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-fg-2">
            Take the free assessment for orientation, or apply for ReKonr when you
            need a complete revenue-recovery diagnostic and implementation blueprint.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <PricingCtaLink
              href={diagnosisOffers[0].cta.href}
              eventName="pricing_assessment_cta"
              offerId="ai-readiness-score"
              placement="final-cta"
              variant="glow"
            >
              Take the Free Assessment
            </PricingCtaLink>
            <PricingCtaLink
              href={rekonr.cta.href}
              eventName="pricing_rekonr_diagnostic_cta"
              offerId={rekonr.id}
              placement="final-cta"
              variant="secondary"
            >
              Apply for the Diagnostic
            </PricingCtaLink>
          </div>
          <p className="mt-6 text-xs leading-6 text-fg-3">
            ResponseOS implementation requires diagnosis. Managed-service fees do not
            include provider usage.
          </p>
        </div>
      </section>
    </>
  );
}
