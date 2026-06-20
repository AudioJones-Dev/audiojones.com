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
// "Home" is included explicitly per the 2026-05-10 nav restructure brief
// (overrides DESIGN.md §11.6's wordmark-as-home convention by deliberate
// product decision).
// One primary commercial path: Solutions is the canonical "what we sell"
// surface (2026-06-18 canonical offer model alignment). Content surfaces
// (Insights, Frameworks, Blog, Workshops, Case Studies, ROI Calculator) live
// under Resources. "Contact" routes to the existing booking page; there is no
// separate /contact route by design.
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
    description: "Insights, frameworks, blog, workshops, and the ROI calculator",
  },
  {
    label: "Contact",
    href: "/book-a-call",
    description: "Book a call to scope the right system",
  },
];

// Right-side header CTAs. Two slots: a soft (secondary) discovery CTA and a
// hard (primary glow) booking CTA. DESIGN.md §11.1 says "one signal-glow CTA
// per major section" — Book a Call carries the glow, Diagnostic is the
// secondary read-the-room option.
export const headerCtas = {
  diagnostic: {
    label: "AI Readiness Diagnostic",
    href: "/ai-readiness-diagnostic",
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
