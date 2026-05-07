/**
 * Navigation Configuration for Audio Jones
 * 
 * Central source of truth for all navigation items across the site.
 * Used by Header, Footer, and any navigation components.
 */

import { modules } from "./modules";

export type NavItem = {
  label: string;
  href: string;
  external?: boolean;
  description?: string;
  children?: NavItem[];
};

// Canonical primary navigation. Consumed by:
//   - `src/components/Header.tsx`
//   - `src/components/Footer.tsx`
//
// Wordmark = home (no explicit "Home" item, per DESIGN.md §11.6).
//
// Items NOT included (intentional):
//   - "ROI Calculator" — `/roi-calculator` doesn't exist on main yet.
//     Codex v1 PR adds the line per `docs/codex/roi-calculator-v1-brief.md`
//     §18.7 Case A.
//   - "Workshops" / "AI Agents" — pages don't exist yet. Their nav lines
//     land alongside their respective page PRs.
//   - "Diagnostic" — the standalone Diagnostic OS at
//     `https://diagnostic.audiojones.com` is the destination of the
//     primary header CTA (and many in-page CTAs), not a primary nav slot.
//   - "Frameworks" / "Blog" — sub-areas. Frameworks consolidates under
//     `/insights` (or its own internal-link surface); Blog is being
//     unified into `/insights` per editorial direction.
export const mainNav: NavItem[] = [
  {
    label: "Services",
    href: "/services",
    description: "Service offerings and engagement packages",
  },
  {
    label: "ROI Calculator",
    href: "/roi-calculator",
    description: "Estimate AI ROI, readiness, and payback period",
  },
  {
    label: "Insights",
    href: "/insights",
    description: "Pillar essays on Applied Intelligence Systems",
  },
  {
    label: "Apply",
    href: "/apply",
    description: "Apply for a strategic engagement",
  },
];

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
