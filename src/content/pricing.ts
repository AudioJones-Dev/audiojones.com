/**
 * Public pricing view.
 *
 * The offer data itself now lives in `src/content/offers.ts`. This file projects
 * the registry into the shape `/pricing`, `/agents/responseos`, `PricingCtaLink`,
 * and the pricing JSON-LD already consume, so those surfaces are unchanged.
 *
 * Everything below the offer projections — factors, policies, FAQs — is page copy
 * rather than offer data and stays here.
 */

import {
  OFFERS,
  offersInGroup,
  type Offer,
  type OfferEventName,
  type PricingGroup,
} from "@/content/offers";
import { SITE_URL } from "@/lib/founder-intelligence/tokens";

export type PricingEventName = OfferEventName;

type PricingCta = {
  label: string;
  href: string;
  eventName: PricingEventName;
};

type SchemaPrice = {
  amount: string;
  name: string;
  unitText?: "MONTH";
};

export type PricingOffer = {
  id: string;
  name: string;
  price: string;
  priceDetails?: readonly string[];
  description: string;
  bestFor?: readonly string[];
  scopeLabel?: string;
  scope: readonly string[];
  guardrails?: readonly string[];
  cta: PricingCta;
  featured?: boolean;
  schemaPrice?: SchemaPrice;
};

/**
 * Optional keys are spread conditionally rather than assigned `undefined`, so a
 * projected offer has exactly the keys the hand-written literals used to have.
 */
function toPricingOffer(offer: Offer): PricingOffer {
  return {
    id: offer.id,
    name: offer.name,
    price: offer.pricing.display,
    ...(offer.pricing.details ? { priceDetails: offer.pricing.details } : {}),
    description: offer.summary,
    ...(offer.bestFor ? { bestFor: offer.bestFor } : {}),
    ...(offer.scopeLabel ? { scopeLabel: offer.scopeLabel } : {}),
    scope: offer.scope,
    ...(offer.guardrails ? { guardrails: offer.guardrails } : {}),
    cta: offer.cta,
    ...(offer.featured ? { featured: offer.featured } : {}),
    ...(offer.pricing.schema ? { schemaPrice: offer.pricing.schema } : {}),
  };
}

/**
 * Fails at module load rather than yielding `undefined`, so a registry edit that
 * empties or duplicates a single-offer section is caught by the build and not by
 * a blank card in production.
 */
function onlyOfferInGroup(group: PricingGroup): PricingOffer {
  const matches = offersInGroup(group);
  if (matches.length !== 1) {
    throw new Error(
      `Expected exactly one offer in pricing group "${group}", found ${matches.length}.`,
    );
  }
  return toPricingOffer(matches[0]);
}

export const diagnosisOffers: readonly PricingOffer[] =
  offersInGroup("diagnosis").map(toPricingOffer);

export const workshopOffer: PricingOffer = onlyOfferInGroup("workshop");

export const implementationOffers: readonly PricingOffer[] =
  offersInGroup("implementation").map(toPricingOffer);

export const managedIntelligenceOffer: PricingOffer = onlyOfferInGroup("managed");

export const expansionOffers: readonly PricingOffer[] =
  offersInGroup("expansion").map(toPricingOffer);

/**
 * Section order, which `/pricing` renders in and the ItemList JSON-LD derives
 * `position` from. `test/pricing-offers.test.ts` asserts this matches registry
 * order, so the two cannot drift.
 */
export const pricingOffers: readonly PricingOffer[] = [
  ...diagnosisOffers,
  workshopOffer,
  ...implementationOffers,
  managedIntelligenceOffer,
  ...expansionOffers,
];

/** Registry order, for the drift assertion in the contract test. */
export const registryOrderedOfferIds: readonly string[] = OFFERS.map(
  (offer) => offer.id,
);

export const pricingFactors = [
  "Number of locations",
  "Number of workflows",
  "Lead or conversation volume",
  "Integrations",
  "Data quality",
  "Provider usage",
  "Compliance requirements",
  "Operational risk",
  "Customization",
  "Reporting requirements",
  "Support requirements",
] as const;

export const providerUsagePolicy =
  "Voice, SMS, model, storage, telephony, and other third-party usage are billed directly to the client where possible or passed through transparently under the engagement terms.";

export const pricingPolicy =
  "Published figures are starting prices for defined scopes. Final pricing depends on the diagnosed workflow, systems, data quality, integrations, operating complexity, volume, risk, usage, and managed-support requirements.";

export const pricingFaqs = [
  {
    question: "Why is a diagnostic required?",
    answer:
      "Diagnosis establishes the workflow, baseline, constraints, and evidence needed to choose the smallest defensible intervention. Final implementation scope follows that diagnosis.",
  },
  {
    question: "Is ResponseOS just an AI receptionist?",
    answer:
      "No. ResponseOS is a managed Revenue Recovery System covering demand capture, qualification, routing, follow-up, booking, escalation, attribution, and reporting. Voice or AI receptionist functionality is included only when the diagnosed workflow requires it.",
  },
  {
    question: "Are provider costs included?",
    answer:
      "No. Voice, SMS, model, storage, telephony, and other third-party usage are separate from managed-service pricing and are billed directly where possible or passed through transparently under the engagement terms.",
  },
  {
    question: "Does AJ Digital replace my CRM?",
    answer:
      "Not by default. Existing systems of record are retained or integrated where practical. Replacement is recommended only when the evidence shows the current system cannot support the required workflow.",
  },
  {
    question: "Can AJ Digital work with existing tools?",
    answer:
      "Yes. The diagnostic reviews the current CRM, calendar, estimate, communications, and follow-up stack so the intervention can integrate with useful existing tools where practical.",
  },
  {
    question: "How long does implementation take?",
    answer:
      "Timing depends on access, data quality, integrations, workflow complexity, volume, and approval speed. AJ Digital defines the implementation plan after diagnosis instead of promising a universal timeline.",
  },
  {
    question: "What affects final pricing?",
    answer:
      "Final pricing depends on locations, workflows, lead or conversation volume, integrations, data quality, provider usage, compliance, operational risk, customization, reporting, and managed-support requirements.",
  },
  {
    question: "Is there a self-service plan?",
    answer:
      "No public self-service ResponseOS plan is available yet. Current ResponseOS engagements are diagnostic-led managed implementations, not instant-activation subscriptions.",
  },
  {
    question: "Does AJ Digital guarantee recovered revenue?",
    answer:
      "No. AJ Digital does not guarantee recovered revenue, ROI, or revenue improvement. The engagement establishes a baseline, tracks agreed outcomes, and reports what changed without turning estimates into promises.",
  },
  {
    question: "What happens after implementation?",
    answer:
      "Where contracted, Managed Intelligence provides monitoring, KPI reporting, workflow optimization, business-memory maintenance, exception review, priority recommendations, and founder decision support.",
  },
  {
    question: "Who is Worksie for?",
    answer:
      "Worksie is a controlled reference pilot for specialized field workflows that require strong documentation, proof-of-work, compliance, contractor coordination, or office-to-field visibility. It is not generic field-service software.",
  },
  {
    question: "What is Managed Intelligence?",
    answer:
      "Managed Intelligence is the recurring operate-and-improve layer: ongoing monitoring, reporting, optimization, business-memory maintenance, exception review, and decision support for installed systems.",
  },
  {
    question: "Are listed prices fixed?",
    answer:
      "No. Listed figures are modeled starting prices being tested for defined scopes. They are not market benchmarks or commercially validated prices; final scope and pricing follow diagnosis.",
  },
  {
    question: "Is the diagnostic credited toward implementation?",
    answer:
      "No. The diagnostic is independently deliverable and is not automatically credited toward implementation. Diagnosis remains required before implementation. AJ Digital will revisit this policy after three comparable paid ReKonr engagements.",
  },
] as const;

export function pricingServicesJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "AJ Digital diagnostic-led services and pricing",
    url: `${SITE_URL}/pricing`,
    itemListElement: pricingOffers.map((offer, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: offer.name,
        description: offer.description,
        url: `${SITE_URL}/pricing#${offer.id}`,
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
        ...(offer.schemaPrice
          ? {
              offers: {
                "@type": "Offer",
                url: `${SITE_URL}/pricing#${offer.id}`,
                priceCurrency: "USD",
                price: offer.schemaPrice.amount,
                priceSpecification: {
                  "@type": "UnitPriceSpecification",
                  price: offer.schemaPrice.amount,
                  priceCurrency: "USD",
                  name: offer.schemaPrice.name,
                  ...(offer.schemaPrice.unitText
                    ? { unitText: offer.schemaPrice.unitText }
                    : {}),
                },
              },
            }
          : {}),
      },
    })),
  } as const;
}
