import { MetadataRoute } from "next";
import { FRAMEWORKS } from "@/content/frameworks";
import { INSIGHTS } from "@/content/insights";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const now = new Date();

  // ── Static public routes ──────────────────────────────────────────────────
  // Rules:
  //  - /step-2   removed — funnel/internal, noindexed at page level
  //  - /podcast  removed — route does not exist
  //  - /services removed — pending review; add back when confirmed final
  //  - /blog     added — content hub, crawlable
  //  - /about    retained — metadata now added at page level
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base,                                        lastModified: now, changeFrequency: "weekly",  priority: 1    },
    { url: `${base}/applied-intelligence`,              lastModified: now, changeFrequency: "weekly",  priority: 0.95 },
    { url: `${base}/applied-intelligence/diagnostic`,  lastModified: now, changeFrequency: "monthly", priority: 0.9  },
    { url: `${base}/frameworks`,                        lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/insights`,                          lastModified: now, changeFrequency: "weekly",  priority: 0.85 },
    { url: `${base}/blog`,                              lastModified: now, changeFrequency: "weekly",  priority: 0.85 },
    { url: `${base}/about`,                             lastModified: now, changeFrequency: "monthly", priority: 0.6  },
    // TODO: Add /pricing once page content is confirmed final for launch
  ];

  // ── Dynamic framework routes (from content file) ──────────────────────────
  const frameworkRoutes: MetadataRoute.Sitemap = FRAMEWORKS.map((f) => ({
    url: `${base}/frameworks/${f.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // ── Dynamic insight routes (from content file) ────────────────────────────
  const insightRoutes: MetadataRoute.Sitemap = INSIGHTS.map((i) => ({
    url: `${base}/insights/${i.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  // ── Dynamic Sanity blog post routes ──────────────────────────────────────
  // Only fetched when NEXT_PUBLIC_SANITY_PROJECT_ID is configured.
  // If Sanity is not connected, /blog is still in staticRoutes above — no crash.
  let blogPostRoutes: MetadataRoute.Sitemap = [];
  if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    try {
      const { safeFetch } = await import("@/lib/sanity/client");
      const { SITEMAP_POSTS_QUERY } = await import("@/lib/sanity/queries");
      const posts = await safeFetch<Array<{ slug: string; lastModified?: string }>>(
        SITEMAP_POSTS_QUERY
      );
      if (posts) {
        blogPostRoutes = posts.map((p) => ({
          url: `${base}/blog/${p.slug}`,
          lastModified: p.lastModified ? new Date(p.lastModified) : now,
          changeFrequency: "weekly",
          priority: 0.75,
        }));
      }
    } catch {
      // Sanity fetch failed — degrade gracefully, sitemap still generates
    }
  }

  return [...staticRoutes, ...frameworkRoutes, ...insightRoutes, ...blogPostRoutes];
}
