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
          "/systems/",
          "/modules/",
          "/test-slack",
          "/uploader",
          "/env",
          "/not-authorized",
          "/status",
          "/consent-testimonial",
          "/book",
          "/business",
          "/creators",
          // Legacy artist-hub routes — not part of public nav
          "/artisthub",
          "/(site)/artist-hub",
          "/(site)/epm",
          // Admin portal — block completely
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
