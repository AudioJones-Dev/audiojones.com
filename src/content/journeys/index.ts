/**
 * Canonical page and journey registry.
 *
 * Ratified in docs/specs/AudioJones-Resource-Funnel-CRM-Canonical-Map-v1.1.md
 * (sections 9 and 15, Phase 1). This is the source of truth for page roles,
 * lifecycle status, canonical route ownership, CTA intent, internal-link
 * relationships, indexability, sitemap eligibility, and navigation visibility.
 *
 * It is deliberately not a second tool or offer registry. Tool pages carry a
 * `toolId` and take their route from `src/content/tools`; commercial CTAs
 * carry an `offerId` that must exist in `src/content/offers`; pillar pages are
 * generated from the Insight and Framework registries rather than restated.
 * `validate.ts` enforces those references.
 *
 * Phase 1 registers the relationships only. Header, Footer, and sitemap keep
 * their current behaviour until Phases 2 and 3 consume the selectors below.
 */

import { OFFERS } from "@/content/offers";
import { FRAMEWORKS } from "@/content/frameworks";
import { INSIGHTS } from "@/content/insights";
import { TOOLS, type Tool, type ToolKind } from "@/content/tools";

export type LifecycleStatus = "live" | "planned" | "deprecated";

export type PageArchetype =
  | "brand-landing"
  | "hub"
  | "solution-family"
  | "solution-landing"
  | "service-landing"
  | "tool-landing"
  | "tool-instrument"
  | "result"
  | "pillar"
  | "proof"
  | "pricing"
  | "qualification"
  | "booking"
  | "confirmation"
  | "squeeze";

export type FunnelRole =
  | "discover"
  | "educate"
  | "orient"
  | "diagnose"
  | "quantify"
  | "validate"
  | "qualify"
  | "convert"
  | "book"
  | "onboard"
  | "retain";

export type CtaIntent =
  | "start-tool"
  | "continue-tool"
  | "request-report"
  | "apply"
  | "send-inquiry"
  | "schedule"
  | "view-solution"
  | "view-pricing"
  | "read-proof"
  | "read-related";

export type NavVisibility =
  | "primary"
  | "dropdown"
  | "footer"
  | "contextual"
  | "hidden";

export type SitemapMeta = {
  changeFrequency?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
};

export type JourneyCta = {
  id: string;
  intent: CtaIntent;
  label: string;
  destination: string;
  toolId?: string;
  offerId?: string;
  crmIntent?: string;
};

export type JourneyPage = {
  id: string;
  route: string;
  status: LifecycleStatus;
  archetype: PageArchetype;
  funnelRoles: FunnelRole[];
  parentId?: string;
  toolId?: string;
  offerId?: string;

  canonicalRoute?: string;
  indexable: boolean;
  sitemapEligible: boolean;
  /** ISO date of the last real content change. Omitted when none is tracked. */
  updatedAt?: string;
  sitemap?: SitemapMeta;

  navVisibility?: NavVisibility[];
  /** Display label wherever navigation or link projections render the page. */
  navLabel: string;
  navDescription?: string;

  primaryCta: JourneyCta;
  secondaryCtas?: JourneyCta[];

  requiredInboundFrom?: string[];
  requiredOutboundTo?: string[];
  relatedPageIds?: string[];

  submissionEvent?: string;
};

export type JourneyDefinition = {
  id: string;
  name: string;
  entryPageIds: string[];
  orderedPageIds: string[];
  successEvent: string;
  fallbackPageId?: string;
};

// Internal CTAs carry journey context, never acquisition UTMs (spec §6.1, §7.4).
function withContext(path: string, originPage: string, ctaId: string): string {
  const joiner = path.includes("?") ? "&" : "?";
  return `${path}${joiner}origin_page=${encodeURIComponent(originPage)}&cta_id=${ctaId}`;
}

const toolById = new Map(TOOLS.map((t) => [t.id, t]));

function toolRoute(toolId: string): string {
  const tool = toolById.get(toolId);
  if (!tool) throw new Error(`journeys: unknown toolId "${toolId}"`);
  return tool.href;
}

function toolStatus(toolId: string): LifecycleStatus {
  return toolById.get(toolId)?.status === "live" ? "live" : "planned";
}

// ── Static public pages ─────────────────────────────────────────────────────

const STATIC_PAGES: JourneyPage[] = [
  {
    id: "home",
    route: "/",
    status: "live",
    archetype: "brand-landing",
    funnelRoles: ["discover", "orient"],
    indexable: true,
    sitemapEligible: true,
    sitemap: { changeFrequency: "weekly", priority: 1 },
    navVisibility: ["primary"],
    navLabel: "Home",
    navDescription: "Audio Jones — Founder Intelligence Systems",
    primaryCta: {
      id: "home-primary",
      intent: "start-tool",
      label: "Score My Revenue Leaks",
      destination: withContext("/roi-calculator", "/", "home-primary"),
      toolId: "revenue-leak-scorecard",
    },
    secondaryCtas: [
      {
        id: "home-solutions",
        intent: "view-solution",
        label: "Explore Solutions",
        destination: "/solutions",
      },
    ],
    requiredOutboundTo: ["solutions", "resources"],
  },
  {
    id: "solutions",
    route: "/solutions",
    status: "live",
    archetype: "hub",
    funnelRoles: ["orient", "convert"],
    indexable: true,
    sitemapEligible: true,
    sitemap: { changeFrequency: "weekly", priority: 0.95 },
    navVisibility: ["primary", "footer"],
    navLabel: "Solutions",
    navDescription: "What AJ Digital builds — the canonical offer ladder",
    primaryCta: {
      id: "solutions-diagnostic",
      intent: "request-report",
      label: "Request a Diagnostic",
      destination: withContext("/founder-intelligence/diagnostic", "/solutions", "solutions-diagnostic"),
      crmIntent: "diagnostic_review_requested",
    },
    secondaryCtas: [
      { id: "solutions-pricing", intent: "view-pricing", label: "View Pricing", destination: "/pricing" },
    ],
    requiredOutboundTo: ["responseos", "founder-intelligence", "pricing"],
  },
  {
    id: "pricing",
    route: "/pricing",
    status: "live",
    archetype: "pricing",
    funnelRoles: ["orient", "convert"],
    parentId: "solutions",
    indexable: true,
    sitemapEligible: true,
    sitemap: { changeFrequency: "monthly", priority: 0.85 },
    navVisibility: ["primary", "footer"],
    navLabel: "Pricing",
    navDescription: "Offers and pricing — start with a diagnostic",
    // Each pricing card applies with its own offer ID; see getOfferDestination.
    primaryCta: {
      id: "pricing-apply",
      intent: "apply",
      label: "Apply for the Selected Offer",
      destination: withContext("/apply?source=pricing", "/pricing", "pricing-apply"),
    },
    secondaryCtas: [
      {
        id: "pricing-diagnostic",
        intent: "start-tool",
        label: "Score My Revenue Leaks",
        destination: withContext("/roi-calculator", "/pricing", "pricing-diagnostic"),
        toolId: "revenue-leak-scorecard",
      },
    ],
    requiredInboundFrom: ["solutions"],
    requiredOutboundTo: ["apply", "responseos", "founder-intelligence"],
  },
  {
    id: "about",
    route: "/about",
    status: "live",
    archetype: "brand-landing",
    funnelRoles: ["validate"],
    indexable: true,
    sitemapEligible: true,
    sitemap: { changeFrequency: "monthly", priority: 0.6 },
    navVisibility: ["primary", "footer"],
    navLabel: "About",
    navDescription: "The strategist and operator behind the systems",
    primaryCta: {
      id: "about-diagnostic",
      intent: "start-tool",
      label: "Assess AI Readiness",
      destination: withContext("/ai-readiness-diagnostic", "/about", "about-diagnostic"),
      toolId: "ai-readiness-diagnostic",
    },
    secondaryCtas: [
      { id: "about-proof", intent: "read-proof", label: "See the Case Studies", destination: "/case-studies" },
    ],
    relatedPageIds: ["case-studies", "services"],
  },
  {
    id: "resources",
    route: "/resources",
    status: "live",
    archetype: "hub",
    funnelRoles: ["discover", "educate", "orient"],
    indexable: true,
    sitemapEligible: true,
    sitemap: { changeFrequency: "weekly", priority: 0.7 },
    navVisibility: ["primary", "footer"],
    navLabel: "Resources",
    navDescription: "Diagnostics, calculators, insights, frameworks, and case studies",
    primaryCta: {
      id: "resources-scorecard",
      intent: "start-tool",
      label: "Score My Revenue Leaks",
      destination: withContext("/roi-calculator", "/resources", "resources-scorecard"),
      toolId: "revenue-leak-scorecard",
    },
    requiredOutboundTo: [
      "ai-readiness-diagnostic",
      "founder-gravity-audit",
      "roi-calculator",
      "insights",
      "frameworks",
      "blog",
      "workshops",
      "case-studies",
    ],
  },
  {
    id: "book-a-call",
    route: "/book-a-call",
    status: "live",
    // Decision 10 (DECISIONS.md 2026-09-14): an inquiry gateway, not a booking
    // page. No calendar exists, so the CTA intent is send-inquiry, never
    // schedule. Renaming the public label is a Phase 6 copy decision.
    archetype: "qualification",
    funnelRoles: ["qualify"],
    parentId: "solutions",
    indexable: true,
    sitemapEligible: true,
    sitemap: { changeFrequency: "monthly", priority: 0.85 },
    navVisibility: ["primary", "footer"],
    navLabel: "Contact",
    navDescription: "Tell us what you need to scope the right system",
    primaryCta: {
      id: "book-a-call-inquiry",
      intent: "send-inquiry",
      label: "Tell Us What You Need",
      destination: withContext("/apply?source=direct", "/book-a-call", "book-a-call-inquiry"),
      crmIntent: "inquiry_submitted",
    },
    requiredOutboundTo: ["apply"],
  },
  {
    id: "services",
    route: "/services",
    status: "live",
    archetype: "service-landing",
    funnelRoles: ["orient", "educate"],
    parentId: "solutions",
    indexable: true,
    sitemapEligible: true,
    sitemap: { changeFrequency: "weekly", priority: 0.9 },
    navVisibility: ["contextual"],
    navLabel: "Services",
    primaryCta: {
      id: "services-scorecard",
      intent: "start-tool",
      label: "Score My Revenue Leaks",
      destination: withContext("/roi-calculator", "/services", "services-scorecard"),
      toolId: "revenue-leak-scorecard",
    },
    secondaryCtas: [
      {
        id: "services-inquiry",
        intent: "send-inquiry",
        label: "Tell Us What You Need",
        destination: withContext("/apply?source=other", "/services", "services-inquiry"),
      },
    ],
    requiredInboundFrom: ["solutions"],
    relatedPageIds: ["case-studies", "pricing"],
  },
  {
    id: "agents",
    route: "/agents",
    status: "live",
    archetype: "hub",
    funnelRoles: ["orient"],
    parentId: "solutions",
    indexable: true,
    sitemapEligible: true,
    sitemap: { changeFrequency: "weekly", priority: 0.9 },
    navVisibility: ["contextual"],
    navLabel: "Agents",
    primaryCta: {
      id: "agents-responseos",
      intent: "view-solution",
      label: "Explore ResponseOS",
      destination: "/agents/responseos",
    },
    requiredInboundFrom: ["solutions"],
    requiredOutboundTo: ["responseos"],
  },
  {
    id: "responseos",
    route: "/agents/responseos",
    status: "live",
    archetype: "solution-landing",
    funnelRoles: ["educate", "validate", "convert"],
    parentId: "solutions",
    offerId: "responseos-managed-pilot",
    indexable: true,
    sitemapEligible: true,
    sitemap: { changeFrequency: "weekly", priority: 0.9 },
    navVisibility: ["dropdown", "footer"],
    navLabel: "ResponseOS",
    navDescription: "Managed revenue recovery: capture, qualify, route, follow up",
    primaryCta: {
      id: "responseos-scorecard",
      intent: "start-tool",
      label: "Score My Revenue Leaks",
      destination: withContext("/roi-calculator", "/agents/responseos", "responseos-scorecard"),
      toolId: "revenue-leak-scorecard",
    },
    secondaryCtas: [
      {
        id: "responseos-apply",
        intent: "apply",
        label: "Apply for ResponseOS Managed Pilot",
        destination: withContext(
          "/apply?source=other&offer=responseos-managed-pilot",
          "/agents/responseos",
          "responseos-apply",
        ),
        offerId: "responseos-managed-pilot",
        crmIntent: "offer_application_interest",
      },
      { id: "responseos-pricing", intent: "view-pricing", label: "View Pricing", destination: "/pricing" },
    ],
    requiredInboundFrom: ["solutions", "agents"],
    requiredOutboundTo: ["roi-calculator", "case-studies", "pricing", "apply"],
    relatedPageIds: ["insight-follow-up-intelligence", "insight-revenue-leak-diagnostic"],
  },
  {
    id: "founder-intelligence",
    route: "/founder-intelligence",
    status: "live",
    archetype: "solution-landing",
    funnelRoles: ["educate", "validate", "convert"],
    parentId: "solutions",
    offerId: "founder-intelligence-system",
    indexable: true,
    sitemapEligible: true,
    sitemap: { changeFrequency: "weekly", priority: 0.85 },
    navVisibility: ["dropdown", "footer"],
    navLabel: "Founder Intelligence",
    navDescription: "The operating system that compounds founder judgment",
    primaryCta: {
      id: "founder-intelligence-diagnostic",
      intent: "request-report",
      label: "Request a Diagnostic",
      destination: withContext(
        "/founder-intelligence/diagnostic",
        "/founder-intelligence",
        "founder-intelligence-diagnostic",
      ),
      crmIntent: "diagnostic_review_requested",
    },
    secondaryCtas: [
      { id: "founder-intelligence-pricing", intent: "view-pricing", label: "View Pricing", destination: "/pricing" },
    ],
    requiredInboundFrom: ["solutions"],
    requiredOutboundTo: ["founder-intelligence-diagnostic", "pricing", "case-studies"],
    relatedPageIds: ["framework-founder-intelligence-systems", "insight-founder-intelligence-systems"],
  },
  {
    id: "founder-intelligence-diagnostic",
    route: "/founder-intelligence/diagnostic",
    status: "live",
    archetype: "qualification",
    funnelRoles: ["diagnose", "qualify"],
    parentId: "founder-intelligence",
    indexable: true,
    // A qualification form that is a step in the AI-readiness journey; not a
    // discovery surface in its own right (spec §10.4).
    sitemapEligible: false,
    navVisibility: ["contextual"],
    navLabel: "Founder Intelligence Diagnostic",
    primaryCta: {
      id: "fi-diagnostic-submit",
      intent: "request-report",
      label: "Request My Review",
      destination: "/founder-intelligence/diagnostic/thank-you",
      crmIntent: "diagnostic_review_requested",
    },
    requiredInboundFrom: ["ai-readiness-diagnostic", "founder-intelligence"],
    requiredOutboundTo: ["ai-readiness-diagnostic", "founder-intelligence"],
    submissionEvent: "diagnostic_request_created",
  },
  {
    id: "founder-intelligence-diagnostic-thank-you",
    route: "/founder-intelligence/diagnostic/thank-you",
    status: "live",
    archetype: "confirmation",
    funnelRoles: ["validate"],
    parentId: "founder-intelligence-diagnostic",
    indexable: false,
    sitemapEligible: false,
    navVisibility: ["hidden"],
    navLabel: "Diagnostic request received",
    primaryCta: {
      id: "fi-thank-you-framework",
      intent: "read-related",
      label: "Read the Founder Intelligence Systems framework",
      destination: "/frameworks/founder-intelligence-systems",
    },
    requiredInboundFrom: ["founder-intelligence-diagnostic"],
    relatedPageIds: ["framework-founder-intelligence-systems", "framework-map-attribution"],
  },
  {
    id: "ai-readiness-diagnostic",
    route: toolRoute("ai-readiness-diagnostic"),
    status: toolStatus("ai-readiness-diagnostic"),
    archetype: "tool-landing",
    funnelRoles: ["educate", "diagnose"],
    parentId: "resources",
    toolId: "ai-readiness-diagnostic",
    offerId: "ai-readiness-score",
    indexable: true,
    sitemapEligible: true,
    sitemap: { changeFrequency: "monthly", priority: 0.9 },
    navVisibility: ["dropdown", "footer"],
    navLabel: "AI Readiness Diagnostic",
    navDescription: "Whether the business is ready for AI — and the gaps to close first",
    primaryCta: {
      id: "ai-readiness-start",
      intent: "start-tool",
      label: "Assess AI Readiness",
      destination: withContext("/founder-intelligence/diagnostic", "/ai-readiness-diagnostic", "ai-readiness-start"),
      toolId: "ai-readiness-diagnostic",
      crmIntent: "diagnostic_review_requested",
    },
    secondaryCtas: [
      {
        id: "ai-readiness-scorecard",
        intent: "start-tool",
        label: "Score My Revenue Leaks",
        destination: withContext("/roi-calculator", "/ai-readiness-diagnostic", "ai-readiness-scorecard"),
        toolId: "revenue-leak-scorecard",
      },
    ],
    requiredInboundFrom: ["resources"],
    requiredOutboundTo: ["founder-intelligence-diagnostic", "resources"],
    relatedPageIds: ["insight-why-ai-fails-most-companies", "founder-intelligence", "workshops"],
  },
  {
    id: "founder-gravity-audit",
    route: toolRoute("founder-gravity-audit"),
    status: toolStatus("founder-gravity-audit"),
    archetype: "tool-landing",
    funnelRoles: ["educate", "diagnose"],
    parentId: "resources",
    toolId: "founder-gravity-audit",
    indexable: true,
    sitemapEligible: true,
    sitemap: { changeFrequency: "monthly", priority: 0.9 },
    navVisibility: ["dropdown", "footer"],
    navLabel: "Founder Gravity Audit",
    navDescription: "Map how much of the business still routes through you",
    primaryCta: {
      id: "founder-gravity-start",
      intent: "start-tool",
      label: "Map My Gravity Load",
      destination: withContext("/founder-gravity-audit/diagnostic", "/founder-gravity-audit", "founder-gravity-start"),
      toolId: "founder-gravity-audit",
    },
    requiredInboundFrom: ["resources"],
    requiredOutboundTo: ["founder-gravity-audit-diagnostic", "resources"],
    relatedPageIds: ["insight-business-memory", "founder-intelligence", "framework-signal-vs-noise"],
  },
  {
    id: "founder-gravity-audit-diagnostic",
    route: "/founder-gravity-audit/diagnostic",
    status: toolStatus("founder-gravity-audit"),
    archetype: "tool-instrument",
    funnelRoles: ["diagnose"],
    parentId: "founder-gravity-audit",
    toolId: "founder-gravity-audit",
    indexable: true,
    sitemapEligible: false,
    navVisibility: ["contextual"],
    navLabel: "Founder Gravity Audit instrument",
    primaryCta: {
      id: "founder-gravity-full-report",
      intent: "request-report",
      label: "Generate Full Report",
      destination: "/founder-gravity-audit/report",
      toolId: "founder-gravity-audit",
      crmIntent: "tool_result_requested",
    },
    requiredInboundFrom: ["founder-gravity-audit"],
    requiredOutboundTo: ["founder-gravity-audit-report", "founder-gravity-audit"],
    submissionEvent: "tool_submission_created",
  },
  {
    id: "founder-gravity-audit-report",
    route: "/founder-gravity-audit/report",
    status: toolStatus("founder-gravity-audit"),
    archetype: "result",
    funnelRoles: ["diagnose", "convert"],
    parentId: "founder-gravity-audit",
    toolId: "founder-gravity-audit",
    indexable: false,
    sitemapEligible: false,
    navVisibility: ["hidden"],
    navLabel: "Founder Gravity Audit report",
    // Segment-specific: the rendered primary is chosen per result, but every
    // segment resolves to a declared next step; the registry records the
    // default so the graph has no dead end.
    primaryCta: {
      id: "founder-gravity-next-step",
      intent: "request-report",
      label: "Request a Diagnostic",
      destination: withContext(
        "/founder-intelligence/diagnostic",
        "/founder-gravity-audit/report",
        "founder-gravity-next-step",
      ),
      crmIntent: "diagnostic_review_requested",
    },
    secondaryCtas: [
      {
        id: "founder-gravity-restart",
        intent: "start-tool",
        label: "Restart the Audit",
        destination: "/founder-gravity-audit",
        toolId: "founder-gravity-audit",
      },
      { id: "founder-gravity-responseos", intent: "view-solution", label: "Explore ResponseOS", destination: "/agents/responseos" },
    ],
    requiredInboundFrom: ["founder-gravity-audit-diagnostic"],
    requiredOutboundTo: ["founder-intelligence", "responseos", "founder-gravity-audit"],
  },
  {
    id: "roi-calculator",
    route: toolRoute("revenue-leak-scorecard"),
    status: toolStatus("revenue-leak-scorecard"),
    archetype: "tool-instrument",
    funnelRoles: ["quantify", "diagnose"],
    parentId: "resources",
    toolId: "revenue-leak-scorecard",
    indexable: true,
    sitemapEligible: true,
    sitemap: { changeFrequency: "weekly", priority: 0.9 },
    navVisibility: ["dropdown", "footer"],
    navLabel: "Revenue Leak Scorecard",
    navDescription: "See where revenue leaks and what recovering it is worth",
    primaryCta: {
      id: "roi-result-primary",
      intent: "apply",
      label: "Validate My Revenue Leaks",
      destination: withContext(
        "/apply?source=diagnostic&offer=revenue-leak-assessment",
        "/roi-calculator",
        "roi-result-primary",
      ),
      offerId: "revenue-leak-assessment",
      crmIntent: "paid_diagnostic_interest",
    },
    secondaryCtas: [
      {
        id: "roi-methodology",
        intent: "read-related",
        label: "How the Revenue Leak Diagnostic works",
        destination: "/insights/revenue-leak-diagnostic",
      },
    ],
    requiredInboundFrom: ["resources", "insight-revenue-leak-diagnostic", "responseos"],
    requiredOutboundTo: ["apply", "insight-revenue-leak-diagnostic", "resources"],
    submissionEvent: "tool_submission_created",
  },
  {
    id: "apply",
    route: "/apply",
    status: "live",
    archetype: "qualification",
    funnelRoles: ["qualify", "convert"],
    parentId: "pricing",
    indexable: true,
    // Qualification-only form; excluded by default (spec §10.4).
    sitemapEligible: false,
    navVisibility: ["contextual"],
    navLabel: "Apply",
    primaryCta: {
      id: "apply-submit",
      intent: "apply",
      label: "Submit Application",
      destination: "/apply/thank-you",
      crmIntent: "offer_application_submitted",
    },
    requiredInboundFrom: ["pricing", "roi-calculator", "book-a-call"],
    requiredOutboundTo: ["apply-thank-you"],
    submissionEvent: "application_created",
  },
  {
    id: "apply-thank-you",
    route: "/apply/thank-you",
    status: "live",
    archetype: "confirmation",
    funnelRoles: ["validate"],
    parentId: "apply",
    indexable: false,
    sitemapEligible: false,
    navVisibility: ["hidden"],
    navLabel: "Application received",
    primaryCta: {
      id: "apply-thank-you-insights",
      intent: "read-related",
      label: "Read the Insights",
      destination: "/insights",
    },
    requiredInboundFrom: ["apply"],
    relatedPageIds: ["frameworks", "insights"],
  },
  {
    id: "insights",
    route: "/insights",
    status: "live",
    archetype: "hub",
    funnelRoles: ["educate"],
    parentId: "resources",
    indexable: true,
    sitemapEligible: true,
    sitemap: { changeFrequency: "weekly", priority: 0.85 },
    navVisibility: ["dropdown", "footer"],
    navLabel: "Insights",
    navDescription: "Pillar essays on Founder Intelligence, signal vs noise, AI failure modes, and attribution",
    primaryCta: {
      id: "insights-scorecard",
      intent: "start-tool",
      label: "Score My Revenue Leaks",
      destination: withContext("/roi-calculator", "/insights", "insights-scorecard"),
      toolId: "revenue-leak-scorecard",
    },
    requiredInboundFrom: ["resources"],
  },
  {
    id: "frameworks",
    route: "/frameworks",
    status: "live",
    archetype: "hub",
    funnelRoles: ["educate"],
    parentId: "resources",
    indexable: true,
    sitemapEligible: true,
    sitemap: { changeFrequency: "monthly", priority: 0.8 },
    navVisibility: ["dropdown", "footer"],
    navLabel: "Frameworks",
    navDescription: "The working IP: Founder Intelligence Systems, M.A.P., N.I.C.H.E, Signal vs Noise",
    primaryCta: {
      id: "frameworks-diagnostic",
      intent: "start-tool",
      label: "Assess AI Readiness",
      destination: withContext("/ai-readiness-diagnostic", "/frameworks", "frameworks-diagnostic"),
      toolId: "ai-readiness-diagnostic",
    },
    requiredInboundFrom: ["resources"],
  },
  {
    id: "blog",
    route: "/blog",
    status: "live",
    archetype: "hub",
    funnelRoles: ["discover", "educate"],
    parentId: "resources",
    indexable: true,
    sitemapEligible: true,
    sitemap: { changeFrequency: "weekly", priority: 0.8 },
    navVisibility: ["dropdown"],
    navLabel: "Blog",
    navDescription: "Founder Intelligence, signal systems, and AI readiness in topic clusters",
    primaryCta: {
      id: "blog-diagnostic",
      intent: "start-tool",
      label: "Assess AI Readiness",
      destination: withContext("/ai-readiness-diagnostic", "/blog", "blog-diagnostic"),
      toolId: "ai-readiness-diagnostic",
    },
    requiredInboundFrom: ["resources"],
  },
  {
    id: "workshops",
    route: "/workshops",
    status: "live",
    archetype: "service-landing",
    funnelRoles: ["educate", "convert"],
    parentId: "resources",
    offerId: "team-ai-readiness-workshop",
    indexable: true,
    sitemapEligible: true,
    sitemap: { changeFrequency: "weekly", priority: 0.85 },
    navVisibility: ["dropdown"],
    navLabel: "Workshops",
    navDescription: "Operator workshops for AI readiness, revenue recovery, and signal-over-noise systems",
    primaryCta: {
      id: "workshops-inquiry",
      intent: "send-inquiry",
      label: "Tell Us What You Need",
      destination: withContext("/apply?source=other", "/workshops", "workshops-inquiry"),
    },
    requiredInboundFrom: ["resources"],
    relatedPageIds: ["ai-readiness-diagnostic"],
  },
  {
    id: "case-studies",
    route: "/case-studies",
    status: "live",
    archetype: "proof",
    funnelRoles: ["validate"],
    parentId: "resources",
    indexable: true,
    sitemapEligible: true,
    sitemap: { changeFrequency: "weekly", priority: 0.9 },
    navVisibility: ["dropdown", "footer"],
    navLabel: "Case Studies",
    navDescription: "Operator proof organized around signal, leak, and the system that closed the gap",
    primaryCta: {
      id: "case-studies-scorecard",
      intent: "start-tool",
      label: "Score My Revenue Leaks",
      destination: withContext("/roi-calculator", "/case-studies", "case-studies-scorecard"),
      toolId: "revenue-leak-scorecard",
    },
    secondaryCtas: [
      { id: "case-studies-responseos", intent: "view-solution", label: "Explore ResponseOS", destination: "/agents/responseos" },
    ],
    requiredInboundFrom: ["resources"],
    requiredOutboundTo: ["responseos", "roi-calculator"],
  },
  {
    id: "ecosystem",
    route: "/ecosystem",
    status: "live",
    archetype: "hub",
    funnelRoles: ["orient"],
    parentId: "solutions",
    indexable: true,
    // Not in the current sitemap; left out until Phase 4 decides its role.
    sitemapEligible: false,
    navVisibility: ["contextual"],
    navLabel: "Ecosystem",
    primaryCta: {
      id: "ecosystem-gravity",
      intent: "start-tool",
      label: "Map My Gravity Load",
      destination: withContext("/founder-gravity-audit", "/ecosystem", "ecosystem-gravity"),
      toolId: "founder-gravity-audit",
    },
    requiredInboundFrom: ["solutions"],
    relatedPageIds: ["workshops", "founder-gravity-audit"],
  },
  {
    id: "step-2",
    route: "/step-2",
    status: "live",
    archetype: "pillar",
    funnelRoles: ["educate", "orient"],
    parentId: "founder-intelligence",
    indexable: false,
    sitemapEligible: false,
    navVisibility: ["hidden"],
    navLabel: "Step 2",
    primaryCta: {
      id: "step-2-diagnostic",
      intent: "start-tool",
      label: "Assess AI Readiness",
      destination: withContext("/ai-readiness-diagnostic", "/step-2", "step-2-diagnostic"),
      toolId: "ai-readiness-diagnostic",
    },
    requiredInboundFrom: ["founder-intelligence"],
    relatedPageIds: ["framework-map-attribution"],
  },
];

// ── Legal pages: footer-only, indexable, not sitemap-listed today ───────────

const LEGAL_ROUTES: Array<[string, string]> = [
  ["privacy-policy", "Privacy Policy"],
  ["terms-of-service", "Terms of Service"],
  ["cookie-policy", "Cookie Policy"],
  ["cancellation-policy", "Cancellation Policy"],
  ["studio-policy", "Studio Policy"],
];

const LEGAL_PAGES: JourneyPage[] = LEGAL_ROUTES.map(([slug, label]) => ({
  id: slug,
  route: `/${slug}`,
  status: "live",
  archetype: "pillar",
  funnelRoles: ["validate"],
  parentId: "home",
  indexable: true,
  sitemapEligible: false,
  navVisibility: ["footer"],
  navLabel: label,
  primaryCta: {
    id: `${slug}-inquiry`,
    intent: "send-inquiry",
    label: "Tell Us What You Need",
    destination: withContext("/apply?source=other", `/${slug}`, `${slug}-inquiry`),
  },
}));

// ── Planned tools: registered so they can go live by flipping status ────────

const PLANNED_TOOL_PAGES: JourneyPage[] = TOOLS.filter((t) => t.status === "planned").map((t) => ({
  id: t.id,
  route: t.href,
  status: "planned",
  archetype: t.kind === "diagnostic" ? "tool-landing" : "tool-instrument",
  funnelRoles: t.kind === "diagnostic" ? ["diagnose"] : ["quantify"],
  parentId: "resources",
  toolId: t.id,
  indexable: true,
  sitemapEligible: true,
  // Hidden while planned (spec §8.10); flip to ["dropdown", "footer"] with status.
  navVisibility: ["hidden"],
  navLabel: t.name,
  navDescription: t.description,
  // Planned tools route to focused inquiry until a matching offer is ratified
  // (spec §5.6, §5.7); they must not invent an offer ID.
  primaryCta: {
    id: `${t.id}-inquiry`,
    intent: "send-inquiry",
    label: t.id === "seo-roi-calculator" ? "Discuss the SEO Opportunity" : "Discuss My Website Project",
    destination: withContext("/apply?source=other", t.href, `${t.id}-inquiry`),
  },
  requiredInboundFrom: ["resources"],
}));

// ── Pillar pages generated from the Insight and Framework registries ────────

/** Topic-to-tool routing from spec §7.2. Unlisted slugs fall back by pillar. */
const INSIGHT_PRIMARY_TOOL: Record<string, string> = {
  "revenue-leak-diagnostic": "revenue-leak-scorecard",
  "follow-up-intelligence": "revenue-leak-scorecard",
  "marketing-attribution-causal-identification": "revenue-leak-scorecard",
  "why-ai-fails-most-companies": "ai-readiness-diagnostic",
  "founder-intelligence-systems": "founder-gravity-audit",
  "business-memory": "founder-gravity-audit",
  "signal-vs-noise-business": "founder-gravity-audit",
};

const FRAMEWORK_PRIMARY_TOOL: Record<string, string> = {
  "founder-intelligence-systems": "founder-gravity-audit",
  "map-attribution": "revenue-leak-scorecard",
  "niche-framework": "ai-readiness-diagnostic",
  "signal-vs-noise": "founder-gravity-audit",
};

const TOOL_CTA_LABEL: Record<string, string> = {
  "revenue-leak-scorecard": "Score My Revenue Leaks",
  "ai-readiness-diagnostic": "Assess AI Readiness",
  "founder-gravity-audit": "Map My Gravity Load",
};

function toolCta(pageRoute: string, ctaId: string, toolId: string): JourneyCta {
  return {
    id: ctaId,
    intent: "start-tool",
    label: TOOL_CTA_LABEL[toolId] ?? "Start the tool",
    destination: withContext(toolRoute(toolId), pageRoute, ctaId),
    toolId,
  };
}

/** Journey page ID for a tool, by tool ID (tool landing/instrument pages). */
const TOOL_PAGE_ID: Record<string, string> = {
  "revenue-leak-scorecard": "roi-calculator",
  "ai-readiness-diagnostic": "ai-readiness-diagnostic",
  "founder-gravity-audit": "founder-gravity-audit",
};

const INSIGHT_PAGES: JourneyPage[] = INSIGHTS.map((i) => {
  const toolId = INSIGHT_PRIMARY_TOOL[i.slug] ?? "revenue-leak-scorecard";
  const route = `/insights/${i.slug}`;
  return {
    id: `insight-${i.slug}`,
    route,
    status: "live",
    archetype: "pillar",
    funnelRoles: ["educate"],
    parentId: "insights",
    indexable: true,
    sitemapEligible: true,
    sitemap: { changeFrequency: "monthly", priority: 0.75 },
    navVisibility: ["contextual"],
    navLabel: i.title,
    navDescription: i.excerpt,
    primaryCta: toolCta(route, `insight-${i.slug}-tool`, toolId),
    requiredInboundFrom: ["insights"],
    requiredOutboundTo: ["insights", TOOL_PAGE_ID[toolId]],
  };
});

const FRAMEWORK_PAGES: JourneyPage[] = FRAMEWORKS.map((f) => {
  const toolId = FRAMEWORK_PRIMARY_TOOL[f.slug] ?? "ai-readiness-diagnostic";
  const route = `/frameworks/${f.slug}`;
  return {
    id: `framework-${f.slug}`,
    route,
    status: "live",
    archetype: "pillar",
    funnelRoles: ["educate"],
    parentId: "frameworks",
    indexable: true,
    sitemapEligible: true,
    sitemap: { changeFrequency: "monthly", priority: 0.8 },
    navVisibility: ["contextual"],
    navLabel: f.title,
    navDescription: f.tagline,
    primaryCta: toolCta(route, `framework-${f.slug}-tool`, toolId),
    requiredInboundFrom: ["frameworks"],
    requiredOutboundTo: ["frameworks", TOOL_PAGE_ID[toolId]],
  };
});

export const JOURNEY_PAGES: readonly JourneyPage[] = [
  ...STATIC_PAGES,
  ...LEGAL_PAGES,
  ...PLANNED_TOOL_PAGES,
  ...INSIGHT_PAGES,
  ...FRAMEWORK_PAGES,
];

// ── Journeys (spec §5) ──────────────────────────────────────────────────────

export const JOURNEYS: readonly JourneyDefinition[] = [
  {
    id: "revenue-leak-to-assessment",
    name: "Revenue Leak Scorecard to Revenue Leak Assessment",
    entryPageIds: ["resources", "responseos", "insight-revenue-leak-diagnostic", "home"],
    orderedPageIds: ["roi-calculator", "apply", "apply-thank-you"],
    successEvent: "application_submitted",
    fallbackPageId: "resources",
  },
  {
    id: "ai-readiness-to-review",
    name: "AI Readiness landing to Founder Intelligence diagnostic review",
    entryPageIds: ["resources", "about", "insight-why-ai-fails-most-companies", "frameworks", "blog"],
    orderedPageIds: [
      "ai-readiness-diagnostic",
      "founder-intelligence-diagnostic",
      "founder-intelligence-diagnostic-thank-you",
    ],
    successEvent: "tool_result_requested",
    fallbackPageId: "resources",
  },
  {
    id: "founder-gravity-to-path",
    name: "Founder Gravity Audit to segment-matched next step",
    entryPageIds: ["resources", "insight-business-memory", "ecosystem"],
    orderedPageIds: [
      "founder-gravity-audit",
      "founder-gravity-audit-diagnostic",
      "founder-gravity-audit-report",
    ],
    successEvent: "tool_result_viewed",
    fallbackPageId: "founder-gravity-audit",
  },
  {
    id: "direct-offer-to-application",
    name: "Selected offer to application",
    entryPageIds: ["solutions", "pricing", "responseos", "founder-intelligence"],
    orderedPageIds: ["apply", "apply-thank-you"],
    successEvent: "application_submitted",
    fallbackPageId: "solutions",
  },
  {
    id: "inquiry",
    name: "Inquiry gateway to application",
    entryPageIds: ["book-a-call", "services", "workshops"],
    orderedPageIds: ["apply", "apply-thank-you"],
    successEvent: "application_submitted",
    fallbackPageId: "solutions",
  },
];

// ── Selectors (spec §9.4) ───────────────────────────────────────────────────

const pageById = new Map(JOURNEY_PAGES.map((p) => [p.id, p]));
const pageByRoute = new Map(JOURNEY_PAGES.map((p) => [p.route, p]));

export function stripQuery(route: string): string {
  const i = route.indexOf("?");
  return i === -1 ? route : route.slice(0, i);
}

export function getLiveTools(): Tool[] {
  return TOOLS.filter((t) => t.status === "live");
}

export function getToolsByKind(kind: ToolKind): Tool[] {
  return getLiveTools().filter((t) => t.kind === kind);
}

export function getPageById(id: string): JourneyPage | undefined {
  return pageById.get(id);
}

export function getPageByRoute(route: string): JourneyPage | undefined {
  return pageByRoute.get(stripQuery(route));
}

export function getPrimaryCta(pageId: string): JourneyCta | undefined {
  return pageById.get(pageId)?.primaryCta;
}

export function getRelatedPages(pageId: string): JourneyPage[] {
  const page = pageById.get(pageId);
  if (!page) return [];
  const ids = new Set([...(page.relatedPageIds ?? []), ...(page.requiredOutboundTo ?? [])]);
  ids.delete(pageId);
  return [...ids]
    .map((id) => pageById.get(id))
    .filter((p): p is JourneyPage => Boolean(p) && p!.status === "live");
}

export function getJourney(journeyId: string): JourneyDefinition | undefined {
  return JOURNEYS.find((j) => j.id === journeyId);
}

export type OfferDestinationContext = {
  originPage: string;
  ctaId: string;
  source?: "diagnostic" | "homepage-cta" | "pricing" | "direct" | "other";
};

/**
 * The application URL for a ratified offer. Offers that convert elsewhere
 * (a tool landing, a workshop page) return that route instead. Throws on an
 * unknown offer so a stale ID fails at build time, not in a visitor's browser.
 */
export function getOfferDestination(offerId: string, context: OfferDestinationContext): string {
  const offer = OFFERS.find((o) => o.id === offerId);
  if (!offer) throw new Error(`journeys: unknown offerId "${offerId}"`);
  const base = stripQuery(offer.cta.href);
  const path =
    base === "/apply"
      ? `/apply?source=${context.source ?? "pricing"}&offer=${offerId}`
      : base;
  return withContext(path, context.originPage, context.ctaId);
}

export type NavLink = { label: string; href: string; description?: string };
export type NavGroup = { label: string; items: NavLink[] };

function isLivePublic(p: JourneyPage): boolean {
  return p.status === "live";
}

function hasVisibility(p: JourneyPage, v: NavVisibility): boolean {
  return p.navVisibility?.includes(v) ?? false;
}

function toNavLink(p: JourneyPage): NavLink {
  return { label: p.navLabel, href: p.route, description: p.navDescription };
}

function toolKindOf(p: JourneyPage): ToolKind | undefined {
  return p.toolId ? toolById.get(p.toolId)?.kind : undefined;
}

/** Resources dropdown (spec §8.4): only live routes, grouped by tool kind then library. */
export function getResourcesNavChildren(): NavGroup[] {
  const children = JOURNEY_PAGES.filter(
    (p) => p.parentId === "resources" && isLivePublic(p) && hasVisibility(p, "dropdown"),
  );
  const diagnostics = children.filter((p) => toolKindOf(p) === "diagnostic");
  const calculators = children.filter((p) => toolKindOf(p) === "calculator");
  const library = children.filter((p) => !p.toolId);
  return [
    { label: "Overview", items: [toNavLink(pageById.get("resources")!)] },
    { label: "Diagnostics", items: diagnostics.map(toNavLink) },
    { label: "Calculators", items: calculators.map(toNavLink) },
    { label: "Library", items: library.map(toNavLink) },
  ].filter((g) => g.items.length > 0);
}

/** Solutions dropdown (spec §8.5): family hubs appear only once live pages exist. */
export function getSolutionsNavChildren(): NavGroup[] {
  const children = JOURNEY_PAGES.filter(
    (p) => p.parentId === "solutions" && isLivePublic(p) && hasVisibility(p, "dropdown"),
  );
  const families = children.filter((p) => p.archetype === "solution-family");
  const featured = children.filter((p) => p.archetype !== "solution-family");
  return [
    { label: "Overview", items: [toNavLink(pageById.get("solutions")!)] },
    { label: "Solution Families", items: families.map(toNavLink) },
    { label: "Featured Systems", items: featured.map(toNavLink) },
  ].filter((g) => g.items.length > 0);
}

/**
 * Footer projection (spec §8.9). "Diagnostics" and "Calculators" are group
 * headings over the live tool links, not destinations: no such hub routes
 * exist (DECISIONS.md 2026-09-14).
 */
export function getFooterNavigation(): NavGroup[] {
  const footer = JOURNEY_PAGES.filter((p) => isLivePublic(p) && hasVisibility(p, "footer"));
  const under = (parentId: string) => footer.filter((p) => p.parentId === parentId);
  const resourcesChildren = under("resources");
  return [
    {
      label: "Solutions",
      items: [toNavLink(pageById.get("solutions")!), ...under("solutions").map(toNavLink)],
    },
    {
      label: "Resources",
      items: [toNavLink(pageById.get("resources")!), ...resourcesChildren.filter((p) => !p.toolId).map(toNavLink)],
    },
    { label: "Diagnostics", items: resourcesChildren.filter((p) => toolKindOf(p) === "diagnostic").map(toNavLink) },
    { label: "Calculators", items: resourcesChildren.filter((p) => toolKindOf(p) === "calculator").map(toNavLink) },
    {
      label: "Company",
      items: ["about", "pricing", "book-a-call"].map((id) => toNavLink(pageById.get(id)!)),
    },
    { label: "Legal", items: under("home").map(toNavLink) },
  ].filter((g) => g.items.length > 0);
}

export function getPublicIndexablePages(): JourneyPage[] {
  return JOURNEY_PAGES.filter((p) => isLivePublic(p) && p.indexable);
}

export type SitemapRoute = {
  route: string;
  lastModified?: Date;
  changeFrequency?: SitemapMeta["changeFrequency"];
  priority?: number;
};

/** Sitemap projection (spec §10.3, §10.5): canonical, live, indexable, eligible; real date or none. */
export function getSitemapRoutes(): SitemapRoute[] {
  const seen = new Set<string>();
  const out: SitemapRoute[] = [];
  for (const p of JOURNEY_PAGES) {
    if (!isLivePublic(p) || !p.indexable || !p.sitemapEligible) continue;
    if (p.canonicalRoute && p.canonicalRoute !== p.route) continue;
    if (seen.has(p.route)) continue;
    seen.add(p.route);
    out.push({
      route: p.route,
      ...(p.updatedAt ? { lastModified: new Date(p.updatedAt) } : {}),
      changeFrequency: p.sitemap?.changeFrequency,
      priority: p.sitemap?.priority,
    });
  }
  return out;
}
