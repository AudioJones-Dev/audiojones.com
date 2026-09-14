import { MetadataRoute } from "next";
import { getSitemapRoutes } from "@/content/journeys";
import { siteConfig } from "@/lib/site";

/**
 * The sitemap is a projection of canonical public page state, not an
 * inventory of its own (Canonical Map v1.1 §10). Static marketing pages, tool
 * landings, solution pages, Insights, and Frameworks come from the journey
 * registry, which already derives Insight and Framework entries from their
 * own content registries; blog posts come from Sanity. Both feed one
 * deduplication boundary.
 *
 * `lastModified` is set only from a real content date: a registry page's
 * declared `updatedAt`, or a post's CMS timestamp. Nothing is stamped with
 * build time (§10.5).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;

  const registryRoutes: MetadataRoute.Sitemap = getSitemapRoutes().map((r) => ({
    // The homepage declares its canonical as `${siteConfig.url}/`; match it.
    url: `${base}${r.route}`,
    ...(r.lastModified ? { lastModified: r.lastModified } : {}),
    ...(r.changeFrequency ? { changeFrequency: r.changeFrequency } : {}),
    ...(r.priority !== undefined ? { priority: r.priority } : {}),
  }));

  return dedupeByUrl([...registryRoutes, ...(await getBlogSitemapRoutes(base))]);
}

// Only fetched when NEXT_PUBLIC_SANITY_PROJECT_ID is configured. If Sanity is
// not connected, /blog itself still comes from the registry — no crash.
async function getBlogSitemapRoutes(base: string): Promise<MetadataRoute.Sitemap> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return [];
  try {
    const { safeFetch } = await import("@/lib/sanity/client");
    const { SITEMAP_POSTS_QUERY } = await import("@/lib/sanity/queries");
    const posts = await safeFetch<Array<{ slug: string; lastModified?: string }>>(
      SITEMAP_POSTS_QUERY,
    );
    return (posts ?? []).map((p) => ({
      url: `${base}/blog/${p.slug}`,
      ...(p.lastModified ? { lastModified: new Date(p.lastModified) } : {}),
      changeFrequency: "weekly",
      priority: 0.75,
    }));
  } catch {
    // Sanity fetch failed — degrade gracefully, sitemap still generates
    return [];
  }
}

function dedupeByUrl(entries: MetadataRoute.Sitemap): MetadataRoute.Sitemap {
  const seen = new Set<string>();
  return entries.filter((e) => {
    if (seen.has(e.url)) return false;
    seen.add(e.url);
    return true;
  });
}
