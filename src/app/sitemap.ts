import { MetadataRoute } from "next";
import { FRAMEWORKS } from "@/content/frameworks";
import { INSIGHTS } from "@/content/insights";
import { siteConfig } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
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

  // ── TODO: Sanity blog post routes ─────────────────────────────────────────
  // When Sanity is wired, fetch published posts and map to:
  //   { url: `${base}/blog/${post.slug.current}`, lastModified: post.updatedAt, ... }
  // Guard with: if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return []

  return [...staticRoutes, ...frameworkRoutes, ...insightRoutes];
}
