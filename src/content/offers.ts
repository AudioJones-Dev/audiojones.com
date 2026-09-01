/**
 * Canonical offer registry.
 *
 * This is the single source for every commercial entity AJ Digital sells. Public
 * surfaces — `/pricing`, offer pages, JSON-LD, the sitemap, and any future
 * `/offers.json` — derive from these records rather than holding their own copies.
 *
 * ## Data status
 *
 * The records below **mirror the live site verbatim** as of commit `f5745ea`.
 * Nothing here is a new commercial decision. `src/content/pricing.ts` now derives
 * its exports from this file, so `test/pricing-offers.test.ts` passing unchanged
 * is the proof that the migration is behaviour-preserving.
 *
 * ## Fields that are deliberately not filled in
 *
 * Several fields in the target schema depend on decisions that are the operator's
 * to make (Phase 0 / Wave 0 of the offer-map plan). They are optional here, and
 * left undefined rather than guessed, because a descriptive placeholder silently
 * becoming the decision is the failure mode worth avoiding:
 *
 * - `family` — populated only for the three diagnostics, whose family is
 *   unambiguous. ResponseOS, Managed Intelligence, and Strategic Partnership are
 *   exactly the rows the reconciliation gate flags as scope-ambiguous.
 * - `displayConvention` — corridor-floor vs anchor is an open decision. Until it
 *   is made, `pricing.display` simply reproduces the live string.
 * - `prerequisiteOfferIds` / `followOnOfferIds` — the live copy states
 *   prerequisites in prose ("Diagnostic required before implementation") but
 *   never names an offer id. Encoding specific ids is a commercial statement.
 * - `proofAssetPaths` — empty for all ten. No offer has a standalone page yet, so
 *   the proof gate is vacuously satisfied; see `pagePath` below.
 *
 * `evidenceStatus` is `"unratified"` on every record for the same reason: these
 * prices are live, but none has been through the reconciliation gate.
 */

import { SITE_URL } from "@/lib/founder-intelligence/tokens";

export type OfferFamily =
  | "diagnostics"
  | "digital-foundation"
  | "revenue-systems"
  | "business-memory"
  | "ai-systems"
  | "custom-operations"
  | "managed-operations";

export type OfferStage =
  | "assessment"
  | "diagnostic"
  | "architecture"
  | "foundation"
  | "implementation"
  | "managed";

/**
 * How a price may be shown publicly. Derived mechanically from the live display
 * string — "Free"/"$1,997" are fixed, "From $X" is a floor, "Application only"
 * is scoped — so this describes current behaviour rather than setting policy.
 * `private-corridor` and `internal-allocation` are unused today and exist so the
 * public view can fail closed on them.
 */
export type OfferVisibility =
  | "public-fixed"
  | "public-from"
  | "public-scoped"
  | "private-corridor"
  | "internal-allocation";

/** Whether a price has cleared the reconciliation gate. All ten are pending. */
export type EvidenceStatus =
  | "unratified"
  | "established"
  | "market-calibrated"
  | "scoped"
  | "internal";

/** Which `/pricing` section a record renders in. Describes the current layout. */
export type PricingGroup =
  | "diagnosis"
  | "workshop"
  | "implementation"
  | "managed"
  | "expansion";

export type OfferEventName =
  | "pricing_assessment_cta"
  | "pricing_rekonr_diagnostic_cta"
  | "pricing_workshop_cta"
  | "pricing_responseos_pilot_cta"
  | "pricing_responseos_core_cta"
  | "pricing_fis_cta"
  | "pricing_managed_intelligence_cta"
  | "pricing_worksie_pilot_cta"
  | "pricing_strategic_partnership_cta";

export type OfferCta = {
  label: string;
  href: string;
  eventName: OfferEventName;
};

export type OfferSchemaPrice = {
  amount: string;
  name: string;
  unitText?: "MONTH";
};

export interface Offer {
  id: string;
  slug: string;
  name: string;

  /** Unambiguous families only — see the file header. */
  family?: OfferFamily;
  stage: OfferStage;
  pricingGroup: PricingGroup;

  summary: string;
  scopeLabel?: string;
  scope: readonly string[];
  bestFor?: readonly string[];
  guardrails?: readonly string[];

  pricing: {
    currency: "USD";
    /** Verbatim live display string. */
    display: string;
    details?: readonly string[];
    visibility: OfferVisibility;
    evidenceStatus: EvidenceStatus;
    /** Present only where the live site emits an Offer node. */
    schema?: OfferSchemaPrice;
    /** Open decision — deliberately undefined. */
    displayConvention?: "corridor-floor" | "anchor";
  };

  /**
   * Undefined for all ten: every current offer is a card on `/pricing`, not a
   * standalone route. The proof gate in `test/pricing-offers.test.ts` keys off
   * this, so it is vacuously satisfied today and starts biting the moment an
   * offer gets its own page.
   */
  pagePath?: string;
  indexable: boolean;

  cta: OfferCta;
  featured?: boolean;

  prerequisiteOfferIds: readonly string[];
  followOnOfferIds: readonly string[];
  proofAssetPaths: readonly string[];

  updatedAt: string;
}

// `offer` preselects the engagement on the application form, so each of these
// CTAs lands on a form that already names what the visitor clicked. `source`
// separates pricing-ladder applications from the diagnostic and homepage paths
// for routing and scoring. Ids must stay in `APPLY_OFFERS`.
const applyHref = (offerId: string) =>
  `/apply?source=pricing&offer=${offerId}&utm_source=pricing&utm_medium=website&utm_campaign=pricing-offers&utm_content=${offerId}`;

const routeHref = (path: string, offerId: string) =>
  `${path}?utm_source=pricing&utm_medium=website&utm_campaign=pricing-offers&utm_content=${offerId}`;

const UPDATED = "2026-09-01";

/**
 * Order is load-bearing: `/pricing` renders in this order and the ItemList
 * JSON-LD derives `position` from it.
 */
export const OFFERS: readonly Offer[] = [
  {
    id: "ai-readiness-score",
    slug: "ai-readiness-score",
    name: "AI Readiness Score",
    family: "diagnostics",
    stage: "assessment",
    pricingGroup: "diagnosis",
    summary:
      "Get a preliminary view of where operational friction, revenue leakage, or AI-readiness gaps may exist.",
    scopeLabel: "What it provides",
    scope: [
      "Lightweight qualification and orientation",
      "A preliminary view of operating and AI-readiness gaps",
      "A practical next-step recommendation",
    ],
    guardrails: ["This is not a full diagnostic."],
    pricing: {
      currency: "USD",
      display: "Free",
      visibility: "public-fixed",
      evidenceStatus: "unratified",
      schema: { amount: "0", name: "Free assessment" },
    },
    indexable: false,
    cta: {
      label: "Take the Free Assessment",
      href: routeHref("/ai-readiness-diagnostic", "ai-readiness-score"),
      eventName: "pricing_assessment_cta",
    },
    prerequisiteOfferIds: [],
    followOnOfferIds: [],
    proofAssetPaths: [],
    updatedAt: UPDATED,
  },
  {
    id: "revenue-leak-assessment",
    slug: "revenue-leak-assessment",
    name: "Revenue Leak Assessment",
    family: "diagnostics",
    stage: "diagnostic",
    pricingGroup: "diagnosis",
    summary:
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
    pricing: {
      currency: "USD",
      display: "$1,997",
      visibility: "public-fixed",
      evidenceStatus: "unratified",
      schema: {
        amount: "1997",
        name: "Starting price for the defined Revenue Leak Assessment scope",
      },
    },
    indexable: false,
    cta: {
      label: "Apply for the Assessment",
      href: applyHref("revenue-leak-assessment"),
      eventName: "pricing_assessment_cta",
    },
    featured: true,
    prerequisiteOfferIds: [],
    followOnOfferIds: [],
    proofAssetPaths: [],
    updatedAt: UPDATED,
  },
  {
    id: "rekonr-revenue-recovery-diagnostic",
    slug: "rekonr-revenue-recovery-diagnostic",
    name: "ReKonr Revenue Recovery Diagnostic",
    family: "diagnostics",
    stage: "diagnostic",
    pricingGroup: "diagnosis",
    summary:
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
    pricing: {
      currency: "USD",
      display: "From $3,500",
      visibility: "public-from",
      evidenceStatus: "unratified",
      schema: {
        amount: "3500",
        name: "Starting price for ReKonr Revenue Recovery Diagnostic",
      },
    },
    indexable: false,
    cta: {
      label: "Apply for the Diagnostic",
      href: applyHref("rekonr-revenue-recovery-diagnostic"),
      eventName: "pricing_rekonr_diagnostic_cta",
    },
    prerequisiteOfferIds: [],
    followOnOfferIds: [],
    proofAssetPaths: [],
    updatedAt: UPDATED,
  },
  {
    id: "team-ai-readiness-workshop",
    slug: "team-ai-readiness-workshop",
    name: "Team AI Readiness Workshop",
    // family: unassigned — this offer has no equivalent row in the master
    // matrix at all, which the reconciliation gate flags as an orphaned public
    // offer pending a keep-or-remove decision.
    stage: "assessment",
    pricingGroup: "workshop",
    summary:
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
    pricing: {
      currency: "USD",
      display: "From $2,500",
      visibility: "public-from",
      evidenceStatus: "unratified",
      schema: {
        amount: "2500",
        name: "Starting price for Team AI Readiness Workshop",
      },
    },
    indexable: false,
    cta: {
      label: "Plan a Workshop",
      href: routeHref("/workshops", "team-ai-readiness-workshop"),
      eventName: "pricing_workshop_cta",
    },
    prerequisiteOfferIds: [],
    followOnOfferIds: [],
    proofAssetPaths: [],
    updatedAt: UPDATED,
  },
  {
    id: "responseos-managed-pilot",
    slug: "responseos-managed-pilot",
    name: "ResponseOS Managed Pilot",
    // family: unassigned — whether ResponseOS is public as a managed
    // implementation or as productized tiers is an open decision, and the
    // answer determines whether this sits in ai-systems or revenue-systems.
    stage: "implementation",
    pricingGroup: "implementation",
    summary:
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
    pricing: {
      currency: "USD",
      display: "From $8,500 implementation",
      details: ["From $1,500/month", "Provider usage separate"],
      visibility: "public-from",
      evidenceStatus: "unratified",
      // No schema price: the live site deliberately omits an Offer node for the
      // mixed one-time-plus-monthly prices rather than publishing a partial one.
    },
    indexable: false,
    cta: {
      label: "Apply for a Managed Pilot",
      href: applyHref("responseos-managed-pilot"),
      eventName: "pricing_responseos_pilot_cta",
    },
    featured: true,
    prerequisiteOfferIds: [],
    followOnOfferIds: [],
    proofAssetPaths: [],
    updatedAt: UPDATED,
  },
  {
    id: "responseos-core",
    slug: "responseos-core",
    name: "ResponseOS Core",
    // family: unassigned — see ResponseOS Managed Pilot above.
    stage: "implementation",
    pricingGroup: "implementation",
    summary:
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
    pricing: {
      currency: "USD",
      display: "From $12,500 implementation",
      details: ["From $2,500/month", "Provider usage separate"],
      visibility: "public-from",
      evidenceStatus: "unratified",
    },
    indexable: false,
    cta: {
      label: "Apply for ResponseOS Core",
      href: applyHref("responseos-core"),
      eventName: "pricing_responseos_core_cta",
    },
    prerequisiteOfferIds: [],
    followOnOfferIds: [],
    proofAssetPaths: [],
    updatedAt: UPDATED,
  },
  {
    id: "founder-intelligence-system",
    slug: "founder-intelligence-system",
    name: "Founder Intelligence System",
    // family: unassigned — the reconciliation gate holds that this name
    // currently collapses two distinct matrix offers (Core Business Memory and
    // Integrated Founder Intelligence / RAG), which must be split first.
    stage: "implementation",
    pricingGroup: "implementation",
    summary:
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
    pricing: {
      currency: "USD",
      display: "From $15,000",
      visibility: "public-from",
      evidenceStatus: "unratified",
      schema: {
        amount: "15000",
        name: "Starting price for Founder Intelligence System",
      },
    },
    indexable: false,
    cta: {
      // Shortened from the offer's full name, which renders 369px wide and
      // overflows the 341px card interior at 1440. The card heading directly
      // above carries "Founder Intelligence System" in full.
      label: "Apply for an Intelligence System",
      href: applyHref("founder-intelligence-system"),
      eventName: "pricing_fis_cta",
    },
    prerequisiteOfferIds: [],
    followOnOfferIds: [],
    proofAssetPaths: [],
    updatedAt: UPDATED,
  },
  {
    id: "managed-intelligence",
    slug: "managed-intelligence",
    name: "Managed Intelligence",
    // family: unassigned — the reconciliation gate requires naming the exact
    // managed service and its installed-system prerequisite before this can be
    // placed; today the name spans several matrix scopes.
    stage: "managed",
    pricingGroup: "managed",
    summary:
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
    guardrails: [
      "Managed Intelligence is not a generic executive-assistant service.",
    ],
    pricing: {
      currency: "USD",
      display: "From $2,500/month",
      visibility: "public-from",
      evidenceStatus: "unratified",
      schema: {
        amount: "2500",
        name: "Starting monthly price for Managed Intelligence",
        unitText: "MONTH",
      },
    },
    indexable: false,
    cta: {
      label: "Apply for Managed Intelligence",
      href: applyHref("managed-intelligence"),
      eventName: "pricing_managed_intelligence_cta",
    },
    prerequisiteOfferIds: [],
    followOnOfferIds: [],
    proofAssetPaths: [],
    updatedAt: UPDATED,
  },
  {
    id: "worksie-reference-pilot",
    slug: "worksie-reference-pilot",
    name: "Worksie Reference Pilot",
    // family: unassigned — maps loosely to the custom-operations family but is
    // not a named matrix row; held as a controlled pilot path.
    stage: "implementation",
    pricingGroup: "expansion",
    summary:
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
    pricing: {
      currency: "USD",
      display: "Application only",
      visibility: "public-scoped",
      evidenceStatus: "unratified",
      // No schema price: "Application only" is not a price, and publishing an
      // Offer node for it would fabricate one.
    },
    indexable: false,
    cta: {
      label: "Apply for a Worksie Pilot",
      href: applyHref("worksie-reference-pilot"),
      eventName: "pricing_worksie_pilot_cta",
    },
    prerequisiteOfferIds: [],
    followOnOfferIds: [],
    proofAssetPaths: [],
    updatedAt: UPDATED,
  },
  {
    id: "strategic-partnership",
    slug: "strategic-partnership",
    name: "Strategic Partnership",
    // family: unassigned — the reconciliation gate holds that this should
    // resolve to a named managed service or remain a private qualification
    // path; either answer changes its family.
    stage: "managed",
    pricingGroup: "expansion",
    summary:
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
    pricing: {
      currency: "USD",
      display: "Application only",
      visibility: "public-scoped",
      evidenceStatus: "unratified",
    },
    indexable: false,
    cta: {
      label: "Apply for a Strategic Partnership",
      href: applyHref("strategic-partnership"),
      eventName: "pricing_strategic_partnership_cta",
    },
    prerequisiteOfferIds: [],
    followOnOfferIds: [],
    proofAssetPaths: [],
    updatedAt: UPDATED,
  },
];

/** Records in a given `/pricing` section, preserving registry order. */
export function offersInGroup(group: PricingGroup): readonly Offer[] {
  return OFFERS.filter((offer) => offer.pricingGroup === group);
}

export function offerById(id: string): Offer | undefined {
  return OFFERS.find((offer) => offer.id === id);
}

export const OFFERS_URL = `${SITE_URL}/pricing`;
