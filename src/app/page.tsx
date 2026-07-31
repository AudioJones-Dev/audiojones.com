import type { Metadata } from "next";
import {
  HeroAllSignal,
  ProblemFramingSection,
  SystemModelLoop,
  ProcessPipeline,
  ResponseOSWedge,
  CapabilitiesSection,
  CommercialPathSection,
  TrustSection,
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
    "You don't have a growth problem. You have a signal problem. Audio Jones helps founder-led businesses diagnose what is actually happening before they automate it.",
  alternates: { canonical: `${siteConfig.url}/` },
  openGraph: {
    title: "Audio Jones — Founder Intelligence Systems",
    description:
      "Diagnose what is actually happening inside your business before you automate it.",
    url: `${siteConfig.url}/`,
    siteName: "Audio Jones",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Audio Jones — Founder Intelligence Systems",
    description:
      "Diagnose what is actually happening inside your business before you automate it.",
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

      {/* 2. Translate the signal problem into founder-recognizable symptoms. */}
      <ProblemFramingSection />

      {/* 3. Name and define Founder Intelligence in public language. */}
      <SystemModelLoop />

      {/* 4. Establish diagnosis as the method and primary next action. */}
      <ProcessPipeline />

      {/* 5. Prove the philosophy through the ResponseOS wedge. */}
      <ResponseOSWedge />

      {/* 6. Expand from the proof product to operating capabilities. */}
      <CapabilitiesSection />

      {/* 7. Clarify the path from diagnosis to implementation. */}
      <CommercialPathSection />

      {/* 8. Establish the Audio Jones / AJ Digital trust model. */}
      <TrustSection />

      {/* 9. Convert recognition into one diagnostic action. */}
      <DiagnosticCTA />
    </>
  );
}
