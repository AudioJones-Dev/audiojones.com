import { MetadataRoute } from "next";
import { publishedCaseStudies } from "@/data/case-studies";
import { FRAMEWORKS } from "@/content/frameworks";
import { INSIGHTS } from "@/content/insights";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const now = new Date();

  // ── Static public routes ──────────────────────────────────────────────────
  // Mirror the 7-item primary nav + the 2 right-side CTAs introduced by the
  // 2026-05-10 nav restructure, plus crawlable supporting surfaces.
  const staticRoutes: MetadataRoute.Sitemap = [
    // Primary nav
    { url: base,                                        lastModified: now, changeFrequency: "weekly",  priority: 1    },
    { url: `${base}/agents`,                            lastModified: now, changeFrequency: "weekly",  priority: 0.9  },
    { url: `${base}/agents/responseos`,                 lastModified: now, changeFrequency: "weekly",  priority: 0.9  },
    { url: `${base}/services`,                          lastModified: now, changeFrequency: "weekly",  priority: 0.9  },
    { url: `${base}/case-studies`,                      lastModified: now, changeFrequency: "weekly",  priority: 0.9  },
    { url: `${base}/insights`,                          lastModified: now, changeFrequency: "weekly",  priority: 0.85 },
    { url: `${base}/roi-calculator`,                    lastModified: now, changeFrequency: "weekly",  priority: 0.9  },
    { url: `${base}/workshops`,                         lastModified: now, changeFrequency: "weekly",  priority: 0.85 },
    // Right-side header CTAs
    { url: `${base}/ai-readiness-diagnostic`,           lastModified: now, changeFrequency: "monthly", priority: 0.9  },
    { url: `${base}/book-a-call`,                       lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    // Supporting surfaces
    { url: `${base}/applied-intelligence`,              lastModified: now, changeFrequency: "weekly",  priority: 0.85 },
    { url: `${base}/applied-intelligence/diagnostic`,   lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/apply`,                             lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/pricing`,                           lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/frameworks`,                        lastModified: now, changeFrequency: "monthly", priority: 0.8  },
    { url: `${base}/blog`,                              lastModified: now, changeFrequency: "weekly",  priority: 0.8  },
    { url: `${base}/about`,                             lastModified: now, changeFrequency: "monthly", priority: 0.6  },
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

  // ── Dynamic case-study routes ─────────────────────────────────────────────
  const caseStudyRoutes: MetadataRoute.Sitemap = publishedCaseStudies.map((c) => ({
    url: `${base}/case-studies/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.85,
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

  return [
    ...staticRoutes,
    ...frameworkRoutes,
    ...insightRoutes,
    ...caseStudyRoutes,
    ...blogPostRoutes,
  ];
}
