import type { Metadata } from "next";
import Link from "next/link";
import SignalHero from "@/components/founder-intelligence/SignalHero";
import ProblemReframe from "@/components/founder-intelligence/ProblemReframe";
import SignalNoiseModel from "@/components/founder-intelligence/SignalNoiseModel";
import FrameworkFeature from "@/components/founder-intelligence/FrameworkFeature";
import SystemModel from "@/components/founder-intelligence/SystemModel";
import ICPFilter from "@/components/founder-intelligence/ICPFilter";
import ProcessSteps from "@/components/founder-intelligence/ProcessSteps";
import OfferCard from "@/components/founder-intelligence/OfferCard";
import FinalCTA from "@/components/founder-intelligence/FinalCTA";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  breadcrumbJsonLd,
  organizationJsonLd,
  personJsonLd,
  webSiteJsonLd,
} from "@/lib/seo/schema";
import { ctaLinks } from "@/config/links";

export const metadata: Metadata = buildMetadata({
  title: "Founder Intelligence Systems for Founder-Led Businesses",
  description:
    "Audio Jones helps founder-led businesses identify causal growth signals, reduce noise, and build Founder Intelligence Systems that scale judgment and execution.",
  path: "/founder-intelligence-system",
});

export default function FounderIntelligenceSystemPage() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={personJsonLd()} />
      <JsonLd data={webSiteJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Founder Intelligence System", url: "/founder-intelligence-system" },
        ])}
      />

      <SignalHero
        eyebrow="Founder Intelligence Systems"
        headline="You don’t have an AI problem. You have a signal problem."
        subheadline="Audio Jones helps founder-led businesses identify the causal inputs behind growth, reduce operational noise, and build systems that scale judgment, execution, and profit."
        primaryCta={{
          label: "Request Strategic Diagnostic",
          href: ctaLinks.signalDiagnostic,
        }}
        secondaryCta={{
          label: "View the System Model",
          href: "#system-model",
        }}
      />

      <ProblemReframe />

      {/* Step 2 cross-link: position Founder Intelligence System as the discipline behind Step 2. */}
      <section className="border-t border-white/5 bg-[#0B1020] py-10">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="text-slate-300">
            Founder Intelligence System is the discipline.{" "}
            <Link
              href="/step-2"
              className="font-semibold text-[#3B5BFF] hover:text-[#5B7AFF]"
            >
              Step 2
            </Link>{" "}
            is the missing operating layer it builds in your business.
          </p>
          <Link
            href="/step-2"
            className="inline-flex shrink-0 items-center justify-center rounded-md border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5"
          >
            Read the Step 2 thesis →
          </Link>
        </div>
      </section>

      <SignalNoiseModel />
      <FrameworkFeature />
      <SystemModel />
      <ICPFilter />
      <ProcessSteps />
      <OfferCard />
      <FinalCTA />
    </>
  );
}
