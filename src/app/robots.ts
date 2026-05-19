import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Allow all legitimate search engine crawlers on public content
        userAgent: "*",
        allow: "/",
        disallow: [
          "/portal/",
          "/ops/",
          "/api/",
          "/test-slack",
          "/uploader",
          "/env",
          "/not-authorized",
          "/status",
          "/consent-testimonial",
          // Admin portal — block completely (subset of /portal/, kept
          // explicit for crawlers that don't honour prefix matches).
          "/portal/admin/",
        ],
      },
      {
        // Block GPTBot from entire site unless explicitly opted in later
        userAgent: "GPTBot",
        disallow: "/",
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
