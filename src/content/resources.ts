/**
 * Public projection of the Resources hub (Canonical Map v1.1 §13.1, Phase 5).
 *
 * Tools already come from `src/content/tools`. This module moves the two
 * page-local arrays the hub used to keep, the library categories and the
 * theme pathways, onto registry identity: every card names a journey page
 * ID, and its route, label, and live status come from the registry. The
 * descriptive copy stays here as presentation and is unchanged.
 *
 * Library order is the registry's own Resources "Library" group, the same
 * order the header dropdown and footer use, so the three surfaces cannot
 * drift apart.
 */

import {
  getPageById,
  getPageByRoute,
  getResourcesNavChildren,
  type JourneyPage,
} from "@/content/journeys";

export type ResourceLibraryEntry = {
  pageId: string;
  title: string;
  href: string;
  description: string;
};

export type ResourceTheme = {
  pageId: string;
  label: string;
  href: string;
  blurb: string;
};

const LIBRARY_COPY: Record<string, string> = {
  insights:
    "Pillar essays on Founder Intelligence Systems, signal vs noise, AI failure modes, and attribution.",
  frameworks:
    "The working IP: Founder Intelligence Systems, M.A.P. (Meaningful. Actionable. Profitable.), N.I.C.H.E, and Signal vs Noise.",
  blog: "Founder Intelligence, signal systems, and AI-readiness, organized into topic clusters.",
  workshops:
    "Operator workshops for teams building AI readiness, revenue recovery, and signal-over-noise systems.",
  "case-studies":
    "Operator proof organized around signal, leak, and the system that closed the gap.",
};

// The ideas the resource library reinforces. A content hub, not a link dump —
// every theme routes to the surface that develops it.
const THEME_SPECS: ReadonlyArray<Omit<ResourceTheme, "href">> = [
  {
    pageId: "founder-intelligence",
    label: "Founder Intelligence",
    blurb: "Operating leverage and systems that compound founder judgment.",
  },
  {
    pageId: "framework-map-attribution",
    label: "M.A.P.",
    blurb: "Meaningful. Actionable. Profitable. — the decision filter every metric must pass.",
  },
  {
    pageId: "responseos",
    label: "ResponseOS",
    blurb:
      "A managed Revenue Recovery System for capture, qualification, routing, follow-up, attribution, and reporting.",
  },
  {
    pageId: "roi-calculator",
    label: "Revenue Intelligence",
    blurb: "See where revenue leaks and what recovering it is worth.",
  },
  {
    pageId: "ai-readiness-diagnostic",
    label: "AI Readiness",
    blurb: "Whether the business is ready for AI — and the gaps to close first.",
  },
  {
    pageId: "insight-signal-vs-noise-business",
    label: "Operational Clarity",
    blurb: "Separate signal from noise so every decision gets sharper.",
  },
];

function livePage(pageId: string): JourneyPage {
  const page = getPageById(pageId);
  if (!page) throw new Error(`resources: unknown pageId "${pageId}"`);
  if (page.status !== "live") throw new Error(`resources: page "${pageId}" is ${page.status}`);
  return page;
}

const libraryGroup = getResourcesNavChildren().find((g) => g.label === "Library");

export const resourceLibrary: readonly ResourceLibraryEntry[] = (libraryGroup?.items ?? []).map((item) => {
  const page = getPageByRoute(item.href);
  if (!page) throw new Error(`resources: library item ${item.href} is not a registered page`);
  const description = LIBRARY_COPY[page.id];
  if (!description) throw new Error(`resources: no library copy for "${page.id}"`);
  return { pageId: page.id, title: page.navLabel, href: page.route, description };
});

export const resourceThemes: readonly ResourceTheme[] = THEME_SPECS.map((t) => ({
  ...t,
  href: livePage(t.pageId).route,
}));
