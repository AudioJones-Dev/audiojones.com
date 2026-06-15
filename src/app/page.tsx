import type { Metadata } from "next";
import {
  HeroAllSignal,
  SignalNoiseModel,
  ResponseOSWedge,
  RoiLeadMagnet,
  ProcessPipeline,
  ProofStats,
  HomeFaqSection,
  DiagnosticCTA,
} from "@/components/home/landing";
import JsonLd from "@/components/seo/JsonLd";
import {
  organizationJsonLd,
  personJsonLd,
  webSiteJsonLd,
} from "@/lib/seo/schema";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Audio Jones — Founder Intelligence Systems for founder-led businesses",
  description:
    "You don't have a growth problem. You have a signal problem. Audio Jones helps founder-led businesses identify causal growth signals, reduce operational noise, and build Founder Intelligence Systems that compound.",
  alternates: { canonical: `${siteConfig.url}/` },
  openGraph: {
    title: "Audio Jones — Founder Intelligence Systems",
    description:
      "Identify causal growth signals. Reduce noise. Build the system that compounds.",
    url: `${siteConfig.url}/`,
    siteName: "Audio Jones",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Audio Jones — Founder Intelligence Systems",
    description:
      "Identify causal growth signals. Reduce noise. Build the system that compounds.",
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={personJsonLd()} />
      <JsonLd data={webSiteJsonLd()} />

      {/* 1. Hero */}
      <HeroAllSignal />

      {/* 2. Problem reframe — signal vs noise */}
      <SignalNoiseModel />

      {/* 3. Flagship offer — ResponseOS */}
      <ResponseOSWedge />

      {/* 4. ROI lead magnet */}
      <RoiLeadMagnet />

      {/* 5. Process — Diagnose / Design / Deploy */}
      <ProcessPipeline />

      {/* 6. Proof / Before-After */}
      <ProofStats />

      {/* 7. FAQ — plain-language, AEO surface */}
      <HomeFaqSection />

      {/* 8. Final CTA */}
      <DiagnosticCTA />
    </>
  );
}
