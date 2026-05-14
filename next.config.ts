import type { NextConfig } from "next";

const COMMIT = process.env.VERCEL_GIT_COMMIT_SHA || "";
const FALLBACK_DATE = new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 12);
const ASSET_VERSION = process.env.NEXT_PUBLIC_ASSET_VERSION || COMMIT.slice(0, 7) || FALLBACK_DATE;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
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
      { source: "/modules/ai-optimization", destination: "/applied-intelligence", permanent: true },
      { source: "/modules/client-delivery", destination: "/services", permanent: true },
      { source: "/modules/data-intelligence", destination: "/applied-intelligence", permanent: true },
      { source: "/modules/marketing-automation", destination: "/services", permanent: true },
      // /systems index + leaves — retired by 2026-05-10 nav restructure.
      { source: "/systems", destination: "/applied-intelligence", permanent: true },
      { source: "/systems/ai-optimization", destination: "/applied-intelligence", permanent: true },
      { source: "/systems/client-delivery", destination: "/services", permanent: true },
      { source: "/systems/data-intelligence", destination: "/applied-intelligence", permanent: true },
      { source: "/systems/marketing-automation", destination: "/services", permanent: true },
      // Pre-redesign legacy marketing pages — retired by 2026-05-10 nav
      // restructure. Backlinks transfer to the closest semantic replacement.
      { source: "/book", destination: "/book-a-call", permanent: true },
      { source: "/business", destination: "/services", permanent: true },
      { source: "/creators", destination: "/services", permanent: true },
      { source: "/artisthub", destination: "/services", permanent: true },
    ];
  },
  async headers() {
    return [
      { source: "/", headers: [{ key: "Cache-Control", value: "no-store, must-revalidate" }] },
      { source: "/(.*)", headers: [{ key: "Cache-Control", value: "no-store, must-revalidate" }] },
      { source: "/_next/static/(.*)", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/assets/(.*)", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      // Favicon set: 24h cache + must-revalidate so updates roll out within a
      // day without flickering on every page view.
      { source: "/favicon.ico", headers: [{ key: "Cache-Control", value: "public, max-age=86400, must-revalidate" }] },
      { source: "/:file(favicon-.*\\.png|apple-touch-icon\\.png|android-chrome-.*\\.png|icon\\.png|icon\\.svg|site\\.webmanifest)", headers: [{ key: "Cache-Control", value: "public, max-age=86400, must-revalidate" }] },
    ];
  },
};

export default nextConfig;
