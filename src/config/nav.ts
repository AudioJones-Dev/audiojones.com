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

export const mainNav: NavItem[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Services",
    href: "/services",
    description: "Explore our service offerings and packages",
  },
  {
    label: "Systems",
    href: "/systems",
    description: "Integrated platform modules",
    children: modules.map(m => ({
      label: m.name,
      href: m.href,
      description: m.shortDescription,
    })),
  },
  {
    label: "Workshops",
    href: "/ai-workshops",
    description: "Signal OS Workshop: turn AI into a business operating system",
  },
  {
    label: "For Creators",
    href: "/creators",
    description: "Tools and systems for artists, podcasters, and creators",
  },
  {
    label: "For Businesses",
    href: "/business",
    description: "Enterprise solutions for consultants, SMBs, and thought leaders",
  },
  {
    label: "Pricing",
    href: "/pricing",
  },
  {
    label: "About",
    href: "/about",
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
