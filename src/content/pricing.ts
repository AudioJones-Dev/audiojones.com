import { SITE_URL } from "@/lib/founder-intelligence/tokens";

export type PricingEventName =
  | "pricing_assessment_cta"
  | "pricing_rekonr_diagnostic_cta"
  | "pricing_workshop_cta"
  | "pricing_responseos_pilot_cta"
  | "pricing_responseos_core_cta"
  | "pricing_fis_cta"
  | "pricing_managed_intelligence_cta"
  | "pricing_worksie_pilot_cta"
  | "pricing_strategic_partnership_cta";

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

const pricingApplyHref = (offerId: string) =>
  `/apply?source=other&utm_source=pricing&utm_medium=website&utm_campaign=pricing-offers&utm_content=${offerId}`;

const pricingRouteHref = (path: string, offerId: string) =>
  `${path}?utm_source=pricing&utm_medium=website&utm_campaign=pricing-offers&utm_content=${offerId}`;

export const diagnosisOffers: readonly PricingOffer[] = [
  {
    id: "ai-readiness-score",
    name: "AI Readiness Score",
    price: "Free",
    description:
      "Get a preliminary view of where operational friction, revenue leakage, or AI-readiness gaps may exist.",
    scopeLabel: "What it provides",
    scope: [
      "Lightweight qualification and orientation",
      "A preliminary view of operating and AI-readiness gaps",
      "A practical next-step recommendation",
    ],
    guardrails: ["This is not a full diagnostic."],
    cta: {
      label: "Take the Free Assessment",
      href: pricingRouteHref("/ai-readiness-diagnostic", "ai-readiness-score"),
      eventName: "pricing_assessment_cta",
    },
    schemaPrice: { amount: "0", name: "Free assessment" },
  },
  {
    id: "revenue-leak-assessment",
    name: "Revenue Leak Assessment",
    price: "$1,997",
    description:
      "Evaluate one critical revenue workflow to identify where qualified opportunities, follow-up, booking, estimates, or handoffs may be leaking value.",
    scope: [
      "One business location",
      "One primary revenue workflow",
      "Limited evidence sources",
      "Revenue-leak findings",
      "One priority recommendation",
      "Executive readout",
    ],
    guardrails: [
      "No complete system architecture",
      "No implementation",
      "No broad multi-workflow transformation plan",
    ],
    cta: {
      label: "Start the Assessment",
      href: pricingApplyHref("revenue-leak-assessment"),
      eventName: "pricing_assessment_cta",
    },
    featured: true,
    schemaPrice: {
      amount: "1997",
      name: "Starting price for the defined Revenue Leak Assessment scope",
    },
  },
  {
    id: "rekonr-revenue-recovery-diagnostic",
    name: "ReKonr Revenue Recovery Diagnostic",
    price: "From $3,500",
    description:
      "A paid, evidence-based diagnostic that identifies the operational constraints costing the business revenue and determines which intervention should be implemented first.",
    scope: [
      "Workflow mapping",
      "Revenue-leak analysis",
      "Data-quality review",
      "Lead and communication review",
      "CRM, calendar, estimate, and follow-up review",
      "System and process constraints",
      "Baseline metrics",
      "Ranked interventions",
      "Recommended intervention",
      "90-day implementation blueprint",
      "Executive findings presentation",
    ],
    guardrails: [
      "This is AJ Digital's first complete paid diagnostic engagement.",
      "ReKonr is a professional diagnostic engagement, not software or SaaS.",
    ],
    cta: {
      label: "Book a Diagnostic",
      href: pricingApplyHref("rekonr-revenue-recovery-diagnostic"),
      eventName: "pricing_rekonr_diagnostic_cta",
    },
    schemaPrice: {
      amount: "3500",
      name: "Starting price for ReKonr Revenue Recovery Diagnostic",
    },
  },
];

export const workshopOffer: PricingOffer = {
  id: "team-ai-readiness-workshop",
  name: "Team AI Readiness Workshop",
  price: "From $2,500",
  description:
    "An interactive leadership or team session for aligning on AI opportunities, operating priorities, risks, and practical next steps.",
  scope: [
    "Education",
    "Leadership alignment",
    "Team alignment",
    "Responsible AI adoption",
    "Opportunity prioritization",
    "Executive planning",
  ],
  guardrails: ["The workshop is not a substitute for the ReKonr diagnostic."],
  cta: {
    label: "Plan a Workshop",
    href: pricingRouteHref("/workshops", "team-ai-readiness-workshop"),
    eventName: "pricing_workshop_cta",
  },
  schemaPrice: {
    amount: "2500",
    name: "Starting price for Team AI Readiness Workshop",
  },
};

export const implementationOffers: readonly PricingOffer[] = [
  {
    id: "responseos-managed-pilot",
    name: "ResponseOS Managed Pilot",
    price: "From $8,500 implementation",
    priceDetails: ["From $1,500/month", "Provider usage separate"],
    description:
      "Capture, qualify, route, and follow up with legitimate opportunities before slow response or disconnected workflows cause them to disappear.",
    scope: [
      "Missed-call recovery",
      "Speed-to-lead workflows",
      "Demand capture",
      "Lead qualification",
      "Follow-up automation",
      "Booking or callback routing",
      "CRM integration",
      "Calendar integration",
      "Human escalation",
      "Attribution baseline",
      "Revenue-recovery reporting",
      "Monitoring",
      "Optimization",
    ],
    guardrails: [
      "Diagnostic required before implementation",
      "Scope depends on integrations, workflows, volume, data, and operating complexity",
      "This is not a self-service subscription or instant-activation product",
    ],
    cta: {
      label: "Apply for a Managed Pilot",
      href: pricingApplyHref("responseos-managed-pilot"),
      eventName: "pricing_responseos_pilot_cta",
    },
    featured: true,
  },
  {
    id: "responseos-core",
    name: "ResponseOS Core",
    price: "From $12,500 implementation",
    priceDetails: ["From $2,500/month", "Provider usage separate"],
    description:
      "A broader managed revenue-recovery deployment for businesses with multiple demand channels, workflows, integrations, or locations.",
    bestFor: [
      "Multiple lead channels",
      "Multiple workflows or locations",
      "More complex routing",
      "Deeper integrations",
      "Broader reporting requirements",
      "Higher operational volume",
      "Greater managed-support requirements",
    ],
    scope: [
      "Broader demand capture and qualification coverage",
      "Multi-workflow routing and escalation",
      "Deeper CRM, calendar, and reporting integrations",
      "Expanded monitoring and managed optimization",
    ],
    guardrails: [
      "Diagnostic required before implementation",
      "Core is distinct from the bounded Managed Pilot in breadth, volume, integrations, and support scope",
    ],
    cta: {
      label: "Discuss ResponseOS Core",
      href: pricingApplyHref("responseos-core"),
      eventName: "pricing_responseos_core_cta",
    },
  },
  {
    id: "founder-intelligence-system",
    name: "Founder Intelligence System",
    price: "From $15,000",
    description:
      "A governed intelligence system designed around the specific operating constraints, workflows, and decision needs of a founder-led service business.",
    scopeLabel: "Possible components",
    scope: [
      "CRM or revenue-operation infrastructure",
      "Attribution",
      "Reporting",
      "Business Memory",
      "Governed workflows",
      "Human approval states",
      "Operational intelligence",
      "Client dashboards",
      "Selected ResponseOS functionality",
      "Selected Worksie functionality",
      "Custom connectors",
    ],
    guardrails: [
      "Every installation is scoped from diagnosis; no installation includes every component by default.",
      "Pricing varies with business complexity, systems, data quality, workflows, locations, integrations, risk, volume, and support scope.",
    ],
    cta: {
      label: "Design My System",
      href: pricingApplyHref("founder-intelligence-system"),
      eventName: "pricing_fis_cta",
    },
    schemaPrice: {
      amount: "15000",
      name: "Starting price for Founder Intelligence System",
    },
  },
];

export const managedIntelligenceOffer: PricingOffer = {
  id: "managed-intelligence",
  name: "Managed Intelligence",
  price: "From $2,500/month",
  description:
    "Ongoing operational monitoring and decision support for keeping installed systems accurate, useful, governed, and aligned with business priorities.",
  scope: [
    "Monthly operational review",
    "Exception monitoring",
    "Revenue-leak monitoring",
    "KPI reporting",
    "Workflow optimization",
    "Business-memory maintenance",
    "Founder decision brief",
    "Priority recommendations",
    "Defined support window",
    "Limited managed-change allowance where contracted",
  ],
  guardrails: ["Managed Intelligence is not a generic executive-assistant service."],
  cta: {
    label: "Explore Managed Intelligence",
    href: pricingApplyHref("managed-intelligence"),
    eventName: "pricing_managed_intelligence_cta",
  },
  schemaPrice: {
    amount: "2500",
    name: "Starting monthly price for Managed Intelligence",
    unitText: "MONTH",
  },
};

export const expansionOffers: readonly PricingOffer[] = [
  {
    id: "worksie-reference-pilot",
    name: "Worksie Reference Pilot",
    price: "Application only",
    description:
      "A controlled field-operations pilot for businesses with specialized documentation, proof-of-work, compliance, contractor, or office-to-field requirements.",
    bestFor: [
      "Accessibility or home-modification workflows, or another approved field-service workflow",
      "One service type",
      "One complete work-order lifecycle",
    ],
    scope: [
      "Proof-of-work",
      "Documentation",
      "Photos",
      "Signatures",
      "Contractor or staff execution",
      "Office-to-field visibility",
      "One defined success metric",
    ],
    guardrails: [
      "Worksie is not positioned as generic field-service software.",
      "Success measures are selected from the verified transaction model, such as complete job packets, required proof captured, fewer return trips, faster invoice submission, fewer disputed completions, lower office reconciliation time, accurate contractor payouts, or better work-order visibility.",
    ],
    cta: {
      label: "Apply for a Worksie Pilot",
      href: pricingApplyHref("worksie-reference-pilot"),
      eventName: "pricing_worksie_pilot_cta",
    },
  },
  {
    id: "strategic-partnership",
    name: "Strategic Partnership",
    price: "Application only",
    description:
      "A high-touch strategic engagement for organizations requiring ongoing system design, operational intelligence, implementation leadership, and executive advisory.",
    scope: [
      "Ongoing system design",
      "Operational intelligence",
      "Implementation leadership",
      "Executive advisory",
    ],
    guardrails: [
      "No outcome fees or success fees",
      "No recovered-revenue percentages",
      "No guaranteed ROI, performance compensation, or guaranteed revenue improvement",
    ],
    cta: {
      label: "Apply for a Strategic Partnership",
      href: pricingApplyHref("strategic-partnership"),
      eventName: "pricing_strategic_partnership_cta",
    },
  },
];

export const pricingOffers: readonly PricingOffer[] = [
  ...diagnosisOffers,
  workshopOffer,
  ...implementationOffers,
  managedIntelligenceOffer,
  ...expansionOffers,
];

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
      "No public diagnostic-credit policy is currently published. The diagnostic is independently deliverable and required before implementation; no credit should be assumed unless a future written policy is separately approved.",
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
