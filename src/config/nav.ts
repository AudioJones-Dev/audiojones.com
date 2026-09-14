/**
 * Navigation Configuration for Audio Jones
 *
 * Central source of truth for all navigation items across the site.
 * Used by Header, Footer, and any navigation components.
 */

import {
  getResourcesNavChildren,
  getSolutionsNavChildren,
  type NavGroup,
} from "@/content/journeys";
import { modules } from "./modules";

export type NavItem = {
  label: string;
  href: string;
  external?: boolean;
  description?: string;
  /** Flat list of child destinations; every entry is also in `groups`. */
  children?: NavItem[];
  /** Grouped child destinations for dropdown, accordion, and footer rendering. */
  groups?: NavGroup[];
};

// Children are derived from the journey registry (Canonical Map v1.1 §8.1,
// §8.4, §8.5): only live, registered routes appear, and the parent hub stays a
// direct link, so the "Overview" group the selectors emit is dropped here.
function childrenFrom(groups: NavGroup[]): Pick<NavItem, "children" | "groups"> {
  const withoutOverview = groups.filter((g) => g.label !== "Overview");
  return {
    groups: withoutOverview,
    children: withoutOverview.flatMap((g) =>
      g.items.map((i) => ({ label: i.label, href: i.href, description: i.description })),
    ),
  };
}

// Canonical primary navigation. Consumed by:
//   - `src/components/Header.tsx`
//   - `src/components/Footer.tsx`
//
// "Home" is included explicitly per the 2026-05-10 nav restructure brief
// (overrides DESIGN.md §11.6's wordmark-as-home convention by deliberate
// product decision).
// One primary commercial path: Solutions is the canonical "what we sell"
// surface (2026-06-18 canonical offer model alignment). Content surfaces
// (Insights, Frameworks, Blog, Workshops, Case Studies) and the interactive
// tools — diagnostics and calculators, registered in `src/content/tools` —
// live under Resources. "Contact" routes to the existing booking page; there
// is no separate /contact route by design.
export const mainNav: NavItem[] = [
  {
    label: "Home",
    href: "/",
    description: "Audio Jones — Founder Intelligence Systems",
  },
  {
    label: "Solutions",
    href: "/solutions",
    description: "What AJ Digital builds — the canonical offer ladder",
    ...childrenFrom(getSolutionsNavChildren()),
  },
  {
    label: "Pricing",
    href: "/pricing",
    description: "Offers and pricing — start with a diagnostic",
  },
  {
    label: "About",
    href: "/about",
    description: "The strategist and operator behind the systems",
  },
  {
    label: "Resources",
    href: "/resources",
    description: "Diagnostics, calculators, insights, frameworks, and case studies",
    ...childrenFrom(getResourcesNavChildren()),
  },
  {
    label: "Contact",
    href: "/book-a-call",
    description: "Book a call to scope the right system",
  },
];

// Diagnostic review is the primary action; booking remains a secondary path.
export const headerCtas = {
  diagnostic: {
    label: "Request a Diagnostic",
    href: "/founder-intelligence/diagnostic",
  },
  bookCall: {
    label: "Book a Call",
    href: "/book-a-call",
  },
} as const;

export const portalNav: NavItem[] = [
  {
    label: "Client Portal",
    href: "https://client.audiojones.com",
    external: true,
    description: "Manage your projects, bookings, and assets",
  },
  {
    label: "Admin Portal",
    href: "https://admin.audiojones.com",
    external: true,
    description: "Administrative access for team members",
  },
];

// Re-export modules from centralized config with legacy-compatible shape
export const systemModules = modules.map(m => ({
  id: m.id,
  name: m.name,
  tagline: m.tagline,
  description: m.shortDescription,
  href: m.href,
  icon: m.icon,
  color: `from-[${m.gradient.from}] to-[${m.gradient.to}]`,
  funnelStage: m.funnelStage,
}));

export const funnelStages = [
  {
    id: "discover",
    label: "Discover",
    description: "Attract and engage your audience",
    modules: ["marketing-automation"],
  },
  {
    id: "book",
    label: "Book",
    description: "Convert prospects into clients",
    modules: ["client-delivery"],
  },
  {
    id: "deliver",
    label: "Deliver",
    description: "Execute and fulfill projects",
    modules: ["client-delivery"],
  },
  {
    id: "optimize",
    label: "Optimize",
    description: "Improve performance continuously",
    modules: ["ai-optimization"],
  },
  {
    id: "retain",
    label: "Retain",
    description: "Build long-term relationships",
    modules: ["data-intelligence"],
  },
];
