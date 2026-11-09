import { MetadataRoute } from "next";
import { FRAMEWORKS } from "@/content/frameworks";
import { INSIGHTS } from "@/content/insights";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;

  // ── Static public routes ──────────────────────────────────────────────────
  // Mirror the 7-item primary nav + the 2 right-side CTAs introduced by the
  // 2026-05-10 nav restructure, plus crawlable supporting surfaces.
  const staticRoutes: MetadataRoute.Sitemap = [
    // Primary nav
    { url: base,                                        changeFrequency: "weekly",  priority: 1    },
    { url: `${base}/solutions`,                         changeFrequency: "weekly",  priority: 0.95 },
    { url: `${base}/resources`,                         changeFrequency: "weekly",  priority: 0.7  },
    { url: `${base}/agents`,                            changeFrequency: "weekly",  priority: 0.9  },
    { url: `${base}/agents/responseos`,                 changeFrequency: "weekly",  priority: 0.9  },
    { url: `${base}/services`,                          changeFrequency: "weekly",  priority: 0.9  },
    { url: `${base}/case-studies`,                      changeFrequency: "weekly",  priority: 0.9  },
    { url: `${base}/insights`,                          changeFrequency: "weekly",  priority: 0.85 },
    { url: `${base}/roi-calculator`,                    changeFrequency: "weekly",  priority: 0.9  },
    { url: `${base}/workshops`,                         changeFrequency: "weekly",  priority: 0.85 },
    // Right-side header CTAs
    { url: `${base}/ai-readiness-diagnostic`,           changeFrequency: "monthly", priority: 0.9  },
    { url: `${base}/book-a-call`,                       changeFrequency: "monthly", priority: 0.85 },
    // Supporting surfaces
    { url: `${base}/founder-intelligence`,              changeFrequency: "weekly",  priority: 0.85 },
    { url: `${base}/founder-intelligence/diagnostic`,   changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/founder-gravity-audit`,             changeFrequency: "monthly", priority: 0.9  },
    { url: `${base}/founder-gravity-audit/diagnostic`,  changeFrequency: "monthly", priority: 0.9  },
    { url: `${base}/apply`,                             changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/pricing`,                           changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/frameworks`,                        changeFrequency: "monthly", priority: 0.8  },
    { url: `${base}/about`,                             changeFrequency: "monthly", priority: 0.6  },
  ];

  // ── Dynamic framework routes (from content file) ──────────────────────────
  const frameworkRoutes: MetadataRoute.Sitemap = FRAMEWORKS.map((f) => ({
    url: `${base}/frameworks/${f.slug}`,
    
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // ── Dynamic insight routes (from content file) ────────────────────────────
  const insightRoutes: MetadataRoute.Sitemap = INSIGHTS.map((i) => ({
    url: `${base}/insights/${i.slug}`,
    
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  // ── Dynamic Sanity blog post routes ──────────────────────────────────────
  // Only fetched when NEXT_PUBLIC_SANITY_PROJECT_ID is configured.
  // If Sanity is not connected, no post URLs are emitted — no crash.
  // The /blog index redirects to /insights (next.config.ts), so it is not listed.
  let blogPostRoutes: MetadataRoute.Sitemap = [];
  if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    try {
      const { safeFetch } = await import("@/lib/sanity/client");
      const { SITEMAP_POSTS_QUERY } = await import("@/lib/sanity/queries");
      const posts = await safeFetch<Array<{ slug: string; lastModified?: string }>>(
        SITEMAP_POSTS_QUERY
      );
      if (posts) {
        blogPostRoutes = posts.map((p) => {
          // A malformed date would make toISOString() throw and break the sitemap.
          const lastModified = p.lastModified ? new Date(p.lastModified) : undefined;
          const hasValidDate = lastModified !== undefined && !Number.isNaN(lastModified.getTime());
          return {
            url: `${base}/blog/${p.slug}`,
            ...(hasValidDate ? { lastModified } : {}),
            changeFrequency: "weekly" as const,
            priority: 0.75,
          };
        });
      }
    } catch {
      // Sanity fetch failed — degrade gracefully, sitemap still generates
    }
  }

  return [...staticRoutes, ...frameworkRoutes, ...insightRoutes, ...blogPostRoutes];
}
