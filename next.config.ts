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
  async headers() {
    return [
      { source: "/", headers: [{ key: "Cache-Control", value: "no-store, must-revalidate" }] },
      { source: "/(.*)", headers: [{ key: "Cache-Control", value: "no-store, must-revalidate" }] },
      { source: "/_next/static/(.*)", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/assets/(.*)", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
    ];
  },
};

export default nextConfig;
