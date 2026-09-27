import { siteConfig } from "@/lib/site";

// A route handler rather than `app/robots.ts`: Next's typed robots config
// cannot emit the Content-Signal directive (contentsignals.org).
export const dynamic = "force-static";

// Owner decision 2026-09-27: AI answers may cite the site; training may not.
const CONTENT_SIGNAL = "search=yes, ai-input=yes, ai-train=no";

const DISALLOW = [
  "/portal/",
  "/ops/",
  "/api/",
  "/test-slack",
  "/uploader",
  "/env",
  "/not-authorized",
  "/status",
  "/consent-testimonial",
  // Legacy artist-hub routes — not part of public nav
  "/(site)/artist-hub",
  "/(site)/epm",
  // Admin portal — block completely
  "/portal/admin/",
];

export function GET() {
  const body = [
    "User-Agent: *",
    `Content-Signal: ${CONTENT_SIGNAL}`,
    "Allow: /",
    ...DISALLOW.map((path) => `Disallow: ${path}`),
    "",
    // GPTBot is OpenAI's training crawler; blocking it outright backs ai-train=no.
    "User-Agent: GPTBot",
    "Disallow: /",
    "",
    `Sitemap: ${siteConfig.url}/sitemap.xml`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
