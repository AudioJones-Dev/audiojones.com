import type { Metadata } from "next";
import {
  HeroAllSignal,
  ProblemReframeSplit,
  SystemModelLoop,
  FrameworksDuo,
  ProcessPipeline,
  ProofStats,
  InsightsPreview,
  DiagnosticCTA,
} from "@/components/home/landing";

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
      <HeroAllSignal />
      <ProblemReframeSplit />
      <SystemModelLoop />
      <FrameworksDuo />
      <ProcessPipeline />
      <ProofStats />
      <InsightsPreview />
      <DiagnosticCTA />
    </>
  );
}
