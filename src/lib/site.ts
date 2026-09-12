/**
 * site.ts — Single source of truth for the canonical domain and site name.
 * Used by sitemap, robots, metadata, and schema.
 *
 * SITE_URL is also exported from src/lib/founder-intelligence/tokens.ts
 * for backward compatibility — do not remove that export.
 *
 * This file previously also exported `publicRoutes`, `noindexRoutes` and
 * `disallowedRoutes`. Nothing imported them: the sitemap builds its own list
 * and robots.ts holds its own disallows, so the arrays were a second, silently
 * diverging route map that this file's own header claimed was authoritative.
 * Removed rather than wired up, because the enforcement points already work.
 */

function normalizeSiteUrl(url: string) {
  return url
    .replace(/^https:\/\/audiojones\.com\/?$/, "https://www.audiojones.com")
    .replace(/\/$/, "");
}

const canonicalSiteUrl = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.audiojones.com"
);

export const siteConfig = {
  name: "Audio Jones",
  url: canonicalSiteUrl,
  description:
    "Founder Intelligence Systems for founder-led businesses. Identify causal growth signals, reduce operational noise, and build the system that compounds.",
  ogImage: "/assets/og/audio-jones-og.jpg",
  twitterHandle: "@audiojones",
} as const;
