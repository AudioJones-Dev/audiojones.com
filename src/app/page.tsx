import type { Metadata } from "next";
import {
  HeroAllSignal,
  SignalNoiseModel,
  ResponseOSWedge,
  RoiLeadMagnet,
  ProcessPipeline,
  ProofStats,
  DiagnosticCTA,
} from "@/components/home/landing";
import JsonLd from "@/components/seo/JsonLd";
import {
  organizationJsonLd,
  personJsonLd,
  webSiteJsonLd,
} from "@/lib/seo/schema";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title:
    "Audio Jones — Applied Intelligence Systems for founder-led businesses",
  description:
    "You don't have a growth problem. You have a signal problem. Audio Jones helps founder-led businesses identify causal growth signals, reduce operational noise, and build Applied Intelligence Systems that compound.",
  path: "/",
});

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

      {/* 7. Final CTA */}
      <DiagnosticCTA />
    </>
  );
}
