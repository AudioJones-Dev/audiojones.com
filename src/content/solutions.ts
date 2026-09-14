/**
 * Public projection of the commercial ladder for `/solutions`.
 *
 * Canonical Map v1.1 §3.4 and Phase 4: the page must derive commercial
 * identity from `src/content/offers.ts` and must not keep a parallel catalog.
 * This module owns the split between the two:
 *
 * - **Identity** (which offer, its name, where it sends the visitor) comes
 *   from the offer registry and the journey registry. An `offer` card names an
 *   offer ID; its title is the registry name and its destination is
 *   `getOfferPublicRoute`. A `system` card names the live journey page that
 *   owns one or more offers (ResponseOS carries two tiers on one canonical
 *   page, §8.6). A `capability` card names a live journey page for an
 *   engagement category that has no ratified offer yet, so it can carry no
 *   offer ID and no price.
 * - **Presentation** (stage intros, card blurbs, CTA labels) stays here as
 *   copy. It is deliberately not moved into the registry.
 *
 * `test/solutions.test.ts` holds every card to those rules.
 */

import { offerById } from "@/content/offers";
import { getOfferPublicRoute, getPageById } from "@/content/journeys";

type CardCopy = {
  blurb: string;
  cta: string;
};

export type SolutionCardSpec =
  | ({
      kind: "offer";
      offerId: string;
      /**
       * Hold the card on a specific live page instead of the offer's public
       * route. Used only where the card's CTA label promises that page;
       * relabelling is a copy decision, not a projection rule.
       */
      destinationPageId?: string;
    } & CardCopy)
  | ({ kind: "system"; pageId: string; offerIds: readonly string[]; title: string } & CardCopy)
  | ({ kind: "capability"; pageId: string; title: string } & CardCopy);

export type SolutionCard = {
  kind: SolutionCardSpec["kind"];
  /** Registry offer ID for `offer` cards; the owning page's offers for `system` cards. */
  offerIds: readonly string[];
  title: string;
  blurb: string;
  href: string;
  cta: string;
};

export type SolutionStage = {
  step: string;
  stage: string;
  intro: string;
  cards: readonly SolutionCard[];
};

// Canonical offer ladder. One commercial path: Diagnose → Design → Build → Operate.
// Naming follows the ratified AJ Digital canonical offer model.
const STAGE_SPECS: ReadonlyArray<Omit<SolutionStage, "cards"> & { cards: readonly SolutionCardSpec[] }> = [
  {
    step: "00",
    stage: "Free",
    intro: "Start by sharing where work gets stuck and what you want to change.",
    cards: [
      {
        kind: "offer",
        offerId: "ai-readiness-score",
        blurb:
          "Review how your team works, what data you have, and where AI might fit. The online form starts a review; it is not a full paid diagnostic.",
        cta: "Explore AI readiness",
      },
    ],
  },
  {
    step: "01",
    stage: "Audit",
    intro: "Find the cause of lost time or sales before choosing a tool.",
    cards: [
      {
        kind: "offer",
        offerId: "rekonr-revenue-recovery-diagnostic",
        blurb:
          "We map the steps your work follows, check where sales are lost, and measure the starting point. You get a ranked list of fixes and a 90-day build plan.",
        cta: "See the audit",
      },
    ],
  },
  {
    step: "02",
    stage: "Blueprint",
    intro: "Agree on how the fix will work before the build starts.",
    cards: [
      {
        // Engagement category without a ratified offer: no offer ID, no price.
        kind: "capability",
        pageId: "book-a-call",
        title: "System Architecture & Blueprint",
        blurb:
          "A plan for how people, tools, and data will work together. It sets the steps, owners, rules, and checks for the build.",
        cta: "Scope a blueprint",
      },
    ],
  },
  {
    step: "03",
    stage: "Build",
    intro: "Build the agreed fix around your team and the way work gets done.",
    cards: [
      {
        kind: "capability",
        pageId: "book-a-call",
        title: "Custom Application Build",
        blurb:
          "Custom tools for jobs your current software cannot handle well. Keep the right facts and next steps in one place so work is easier to track.",
        cta: "Discuss a build",
      },
      {
        kind: "capability",
        pageId: "agents",
        title: "AI Agent Build",
        blurb:
          "AI given a clear task, approved sources, and limits. We define when a person must check its work or take over.",
        cta: "See agent systems",
      },
      {
        // Two ratified tiers, one canonical page (§8.6).
        kind: "system",
        pageId: "responseos",
        offerIds: ["responseos-managed-pilot", "responseos-core"],
        title: "ResponseOS Revenue Recovery System",
        blurb:
          "A system for capturing leads, checking their needs, routing them, and following up. Booking, call handling, and reports are scoped to fit the gap we find.",
        cta: "Explore ResponseOS",
      },
    ],
  },
  {
    step: "04",
    stage: "Operate",
    intro: "Keep the system useful as your team and business change.",
    cards: [
      {
        kind: "offer",
        offerId: "managed-intelligence",
        blurb:
          "Check how the system works, keep shared rules up to date, and improve the parts that need attention. Support and changes have an agreed scope.",
        // "View Pricing" approved by the operator 2026-09-14 (§6.2 view_pricing):
        // the destination is the pricing card, and §6.3 forbids "Book a Call"
        // on a page that does not book.
        cta: "View Pricing",
      },
    ],
  },
];

// Validation-program offers — the deeper, full-system path. Presented as
// scoped/per-engagement work, not off-the-shelf commodity products.
const ADVANCED_SPECS: readonly SolutionCardSpec[] = [
  {
    // The qualification form, not an offer: it starts a review.
    kind: "capability",
    pageId: "founder-intelligence-diagnostic",
    title: "Founder Intelligence Diagnostic",
    blurb:
      "A deeper review of where leads, jobs, and decisions get stuck. We look at follow-up, customer records, shared knowledge, and what your reports can tell you.",
    cta: "Request the diagnostic",
  },
  {
    kind: "offer",
    offerId: "founder-intelligence-system",
    blurb:
      "For founder-led service businesses: connect the team's work, customer records, shared knowledge, AI, and reports. Set clear owners and a way to check results.",
    cta: "Explore the system",
  },
];

function livePageRoute(pageId: string): string {
  const page = getPageById(pageId);
  if (!page) throw new Error(`solutions: unknown pageId "${pageId}"`);
  if (page.status !== "live") throw new Error(`solutions: page "${pageId}" is ${page.status}`);
  return page.route;
}

function resolve(spec: SolutionCardSpec): SolutionCard {
  switch (spec.kind) {
    case "offer": {
      const offer = offerById(spec.offerId);
      if (!offer) throw new Error(`solutions: unknown offerId "${spec.offerId}"`);
      return {
        kind: "offer",
        offerIds: [offer.id],
        title: offer.name,
        blurb: spec.blurb,
        href: spec.destinationPageId ? livePageRoute(spec.destinationPageId) : getOfferPublicRoute(offer.id),
        cta: spec.cta,
      };
    }
    case "system":
      for (const id of spec.offerIds) {
        if (!offerById(id)) throw new Error(`solutions: unknown offerId "${id}" on system "${spec.pageId}"`);
      }
      return {
        kind: "system",
        offerIds: spec.offerIds,
        title: spec.title,
        blurb: spec.blurb,
        href: livePageRoute(spec.pageId),
        cta: spec.cta,
      };
    case "capability":
      return {
        kind: "capability",
        offerIds: [],
        title: spec.title,
        blurb: spec.blurb,
        href: livePageRoute(spec.pageId),
        cta: spec.cta,
      };
  }
}

export const solutionStages: readonly SolutionStage[] = STAGE_SPECS.map((s) => ({
  step: s.step,
  stage: s.stage,
  intro: s.intro,
  cards: s.cards.map(resolve),
}));

export const advancedSolutions: readonly SolutionCard[] = ADVANCED_SPECS.map(resolve);

export const solutionLadder = STAGE_SPECS.map((s) => s.stage);

/** Every registry offer the hub surfaces, for tests and structured data. */
export function surfacedOfferIds(): readonly string[] {
  return [...solutionStages.flatMap((s) => s.cards), ...advancedSolutions].flatMap((c) => c.offerIds);
}
