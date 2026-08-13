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

      {/* Narrative spine: the reader meets the problem and its cost before
          the system, and the architecture last. See docs/DECISIONS.md
          (2026-08-12 — Sell the pain first; keep the frontier internal). */}

      {/* 1. Pain — the symptoms a founder already feels */}
      <HeroAllSignal />

      {/* 2. Economic cost — what those symptoms are worth */}
      <RoiLeadMagnet />

      {/* 3. Diagnosis — how the constraint gets found */}
      <ProcessPipeline />

      {/* 4. Visible result — what the diagnosis produced */}
      <ProofStats />

      {/* 5. System — the flagship that produces the result */}
      <ResponseOSWedge />

      {/* 6. Architecture — signal vs noise, as depth, not as entry price */}
      <SignalNoiseModel />

      {/* 7. FAQ — plain-language, AEO surface */}
      <HomeFaqSection />

      {/* 8. Final CTA */}
      <DiagnosticCTA />
    </>
  );
}
