import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

// Default OG card served at /og — used as the brand-wide social fallback
// referenced by metadata, schema, and explicit per-page openGraph.images
// when a page-specific OG asset isn't provided.
export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "radial-gradient(120% 80% at 0% 0%, #0B1020 0%, #05070F 60%), #05070F",
          color: "#FFFFFF",
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: "#FF4500",
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 9,
              background: "#FF4500",
              boxShadow: "0 0 24px rgba(255,69,0,0.85)",
            }}
          />
          Audio Jones
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <div
            style={{
              fontSize: 80,
              fontWeight: 800,
              lineHeight: 1.04,
              letterSpacing: "-0.02em",
              maxWidth: 1000,
            }}
          >
            Applied Intelligence Systems
            <br />
            <span style={{ color: "#FF4500" }}>for founder-led businesses.</span>
          </div>
          <div
            style={{
              fontSize: 30,
              fontWeight: 400,
              color: "rgba(255,255,255,0.78)",
              maxWidth: 980,
              lineHeight: 1.35,
            }}
          >
            Identify causal growth signals. Reduce noise. Build the system that
            compounds.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 24,
            color: "rgba(255,255,255,0.6)",
          }}
        >
          <span>{siteConfig.url.replace(/^https?:\/\//, "")}</span>
          <span style={{ color: "#C8A96A" }}>All Signal. No Noise.</span>
        </div>
      </div>
    ),
    size,
  );
}
