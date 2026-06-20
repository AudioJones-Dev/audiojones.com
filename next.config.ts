import type { NextConfig } from "next";

const COMMIT = process.env.VERCEL_GIT_COMMIT_SHA || "";
const FALLBACK_DATE = new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 12);
const ASSET_VERSION = process.env.NEXT_PUBLIC_ASSET_VERSION || COMMIT.slice(0, 7) || FALLBACK_DATE;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        pathname: "**",
      },
    ],
  },
  env: {
    NEXT_PUBLIC_ASSET_VERSION: ASSET_VERSION,
    NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA || "",
  },
  async redirects() {
    return [
      // Pre-redesign /modules/* — retired (already redirected pre-existing).
      { source: "/modules/ai-optimization", destination: "/founder-intelligence", permanent: true },
      { source: "/modules/client-delivery", destination: "/services", permanent: true },
      { source: "/modules/data-intelligence", destination: "/founder-intelligence", permanent: true },
      { source: "/modules/marketing-automation", destination: "/services", permanent: true },
      // /systems index + leaves — retired by 2026-05-10 nav restructure.
      { source: "/systems", destination: "/founder-intelligence", permanent: true },
      { source: "/systems/ai-optimization", destination: "/founder-intelligence", permanent: true },
      { source: "/systems/client-delivery", destination: "/services", permanent: true },
      { source: "/systems/data-intelligence", destination: "/founder-intelligence", permanent: true },
      { source: "/systems/marketing-automation", destination: "/services", permanent: true },
      // Pre-redesign legacy marketing pages — retired by 2026-05-10 nav
      // restructure. Backlinks transfer to the closest semantic replacement.
      { source: "/book", destination: "/book-a-call", permanent: true },
      { source: "/business", destination: "/services", permanent: true },
      { source: "/creators", destination: "/services", permanent: true },
      { source: "/artisthub", destination: "/services", permanent: true },
      // Brand rename: "Applied Intelligence" → "Founder Intelligence".
      // 308 (permanent: true) preserves request method so existing POSTs to
      // the API endpoint keep working through the redirect.
      { source: "/applied-intelligence", destination: "/founder-intelligence", permanent: true },
      { source: "/applied-intelligence/:path*", destination: "/founder-intelligence/:path*", permanent: true },
      { source: "/api/applied-intelligence/:path*", destination: "/api/founder-intelligence/:path*", permanent: true },
      { source: "/frameworks/applied-intelligence-systems", destination: "/frameworks/founder-intelligence-systems", permanent: true },
      { source: "/insights/applied-intelligence-systems", destination: "/insights/founder-intelligence-systems", permanent: true },
      { source: "/blog/topic/applied-intelligence-systems", destination: "/blog/topic/founder-intelligence-systems", permanent: true },
    ];
  },
  async headers() {
    return [
      { source: "/", headers: [{ key: "Cache-Control", value: "no-store, must-revalidate" }] },
      { source: "/(.*)", headers: [{ key: "Cache-Control", value: "no-store, must-revalidate" }] },
      { source: "/_next/static/(.*)", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/assets/(.*)", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      // Optimized images are derived from immutable, versioned source assets,
      // so they're safe to cache. Without this they fall under the `/(.*)`
      // no-store rule above and get re-fetched on every navigation.
      { source: "/_next/image(.*)", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
    ];
  },
};

export default nextConfig;
