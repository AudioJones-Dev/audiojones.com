import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Allow all legitimate search engine crawlers on public content.
        // Retired marketing routes (/book, /business, /creators, /artisthub,
        // /systems/*, /(site)/*) are intentionally NOT disallowed here — they
        // 308-redirect to canonical destinations via next.config.ts, and
        // crawlers must be able to fetch the redirect to transfer link equity
        // to the new URL. Blocking them would kill the SEO transfer.
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/portal/",
          "/portal/admin/",
          "/ops/",
          "/env",
          "/not-authorized",
          "/status",
          "/consent-testimonial",
          "/test-slack",
          "/uploader",
          "/step-2",
        ],
      },
      {
        // Block GPTBot from entire site unless explicitly opted in later.
        userAgent: "GPTBot",
        disallow: "/",
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
