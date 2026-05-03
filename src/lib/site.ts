/**
 * site.ts — Single source of truth for canonical domain, site name,
 * and public route map. Used by sitemap, robots, metadata, and schema.
 *
 * SITE_URL is also exported from src/lib/applied-intelligence/tokens.ts
 * for backward compatibility — do not remove that export.
 */

export const siteConfig = {
  name: "Audio Jones",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://audiojones.com",
  description:
    "Applied Intelligence Systems for founder-led businesses. Identify causal growth signals, reduce operational noise, and build the system that compounds.",
  ogImage: "/assets/og/audio-jones-og.jpg",
  twitterHandle: "@audiojones",
} as const;

/**
 * Public routes that are crawlable, sitemap-eligible, and
 * safe to include in metadata/schema references.
 *
 * Keep this list clean. Do not add portal, admin, ops, dev,
 * or legacy routes here — those belong in the robots Disallow list.
 */
export const publicRoutes = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/applied-intelligence", priority: 0.95, changeFrequency: "weekly" },
  { path: "/applied-intelligence/diagnostic", priority: 0.9, changeFrequency: "monthly" },
  { path: "/frameworks", priority: 0.85, changeFrequency: "monthly" },
  { path: "/insights", priority: 0.85, changeFrequency: "weekly" },
  { path: "/blog", priority: 0.85, changeFrequency: "weekly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
  // /pricing — include only once route is confirmed final for launch
  // /step-2  — intentionally excluded: funnel/internal, noindexed
  // /podcast — intentionally excluded: route does not exist
] as const;

/**
 * Routes that are intentionally excluded from the sitemap and should
 * have noindex metadata or be blocked in robots.ts.
 *
 * NOTE: This is documentation, not enforcement. Enforcement happens in
 * src/app/robots.ts and via page-level `robots` metadata exports.
 */
export const noindexRoutes = [
  "/step-2",
  "/not-authorized",
  "/status",
  "/consent-testimonial",
  "/book",
  "/business",
  "/creators",
  "/artisthub",
  "/env",
] as const;

/**
 * Routes completely blocked from crawlers (enforced in robots.ts).
 */
export const disallowedRoutes = [
  "/portal/",
  "/ops/",
  "/api/",
  "/systems/",
  "/modules/",
  "/test-slack",
  "/uploader",
  "/env",
  "/not-authorized",
  "/status",
  "/consent-testimonial",
] as const;
