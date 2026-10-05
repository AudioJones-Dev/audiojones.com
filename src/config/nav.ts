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
// surface. Founder Intelligence explains the method, while the diagnostic is
// the single global entry point.
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
    label: "Method",
    href: "/founder-intelligence",
    description: "How Business Systems Discovery becomes a working system",
  },
  {
    label: "Case Studies",
    href: "/case-studies",
    description: "System patterns and evidence",
  },
  {
    label: "Insights",
    href: "/insights",
    description: "Business systems analysis and operating guidance",
  },
  {
    label: "About",
    href: "/about",
    description: "The strategist and operator behind the systems",
  },
];

// One site-wide primary CTA keeps the commercial path unambiguous.
export const headerCtas = {
  diagnostic: {
    label: "Start Diagnostic",
    href: "/founder-intelligence/diagnostic",
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
