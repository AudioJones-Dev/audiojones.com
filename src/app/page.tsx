import type { Metadata } from "next";
import {
  HeroAllSignal,
  TrustedByStrip,
  ProblemReframeSplit,
  SignalNoiseModel,
  MAPAttributionSection,
  SystemModelLoop,
  ICPFilterSection,
  ProcessPipeline,
  ProofStats,
  InsightsPreview,
  DiagnosticCTA,
} from "@/components/home/landing";
import JsonLd from "@/components/seo/JsonLd";
import {
  organizationJsonLd,
  personJsonLd,
  webSiteJsonLd,
} from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Audio Jones — Applied Intelligence Systems for founder-led businesses",
  description:
    "You don't have an AI problem. You have a signal problem. Audio Jones helps founder-led businesses identify causal growth signals, reduce operational noise, and build Applied Intelligence Systems that compound.",
  alternates: { canonical: "https://audiojones.com/" },
  openGraph: {
    title: "Audio Jones — Applied Intelligence Systems",
    description:
      "Identify causal growth signals. Reduce noise. Build the system that compounds.",
    url: "https://audiojones.com/",
    siteName: "Audio Jones",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Audio Jones — Applied Intelligence Systems",
    description:
      "Identify causal growth signals. Reduce noise. Build the system that compounds.",
  },
};

export default function HomePage() {
  return (
    <>
      {/* ── Entity schema — Organization + Person + WebSite ── */}
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={personJsonLd()} />
      <JsonLd data={webSiteJsonLd()} />

      {/* 1. Hero */}
      <HeroAllSignal />

      {/* 2. Trusted-by strip */}
      <TrustedByStrip />

      {/* 3. Problem Reframe */}
      <ProblemReframeSplit />

      {/* 4. Signal vs Noise Model */}
      <SignalNoiseModel />

      {/* 5. M.A.P Attribution Framework */}
      <MAPAttributionSection />

      {/* 6. Applied Intelligence Systems */}
      <SystemModelLoop />

      {/* 7. ICP Filter */}
      <ICPFilterSection />

      {/* 8. Process */}
      <ProcessPipeline />

      {/* 9. Proof / Metrics */}
      <ProofStats />

      {/* 10. Insights Preview */}
      <InsightsPreview />

      {/* 11. Final Diagnostic CTA */}
      <DiagnosticCTA />
    </>
  );
}
