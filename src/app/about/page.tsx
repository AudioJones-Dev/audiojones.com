import type { Metadata } from "next";
import {
  DarkSection,
  FinalCta,
  LightProofSection,
  SectionIntro,
  SignalConsole,
  SignalHero,
} from "@/components/marketing/DesignSystemSections";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  breadcrumbJsonLd,
  organizationJsonLd,
  personJsonLd,
} from "@/lib/seo/schema";

const DESCRIPTION =
  "Audio Jones is the strategist and operator behind founder intelligence systems for founder-led businesses.";

export const metadata: Metadata = buildMetadata({
  title: "About Audio Jones - Founder Intelligence Systems",
  description: DESCRIPTION,
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={personJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "About", url: "/about" },
        ])}
      />

      <SignalHero
        title="Audio Jones builds signal systems for founder-led businesses."
        description="The brand combines personal authority, applied AI infrastructure, business diagnosis, and operating-system design for teams that need clarity before scale."
        primaryHref="/ai-readiness-diagnostic"
        primaryLabel="Start the Diagnostic"
        secondaryHref="/services"
        secondaryLabel="See Services"
      >
        <SignalConsole />
      </SignalHero>

      <DarkSection>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionIntro
            label="Founder Authority"
            title="The work starts where strategy meets operations."
            description="Audio Jones is not positioned as a generic AI agency. The operating thesis is simple: most businesses do not need more noise. They need a clearer signal path, a better follow-up system, and intelligence layers that support how work actually moves."
          />
          <div className="grid gap-4">
            {[
              ["Strategist", "Clarifies the market, message, constraint, and system opportunity."],
              ["Operator", "Turns diagnosis into workflows, handoffs, dashboards, and adoption paths."],
              ["Builder", "Installs practical intelligence systems around the tools and team already in motion."],
            ].map(([title, copy]) => (
              <div key={title} className="aj-product-card">
                <h3 className="font-accent text-2xl font-bold tracking-[-0.02em] text-fg-0">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-fg-2">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </DarkSection>

      <LightProofSection>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--aj-blue-deep)]">
              Core Phrase
            </p>
            <h2 className="mt-4 font-accent text-[clamp(2.5rem,5vw,5rem)] font-bold leading-[0.98] tracking-[-0.045em]">
              Signal over noise.
            </h2>
          </div>
          <p className="text-lg leading-8 text-[#4b5563]">
            The design language, content architecture, and product routes all point back to the same question: where is the signal, where is the leak, and what system fixes it?
          </p>
        </div>
      </LightProofSection>

      <DarkSection>
        <SectionIntro
          label="Operating Principles"
          title="What the site now has to communicate."
          description="Audio Jones is a premium personal-brand and AI systems company website. It should feel like a systems platform, not a generic consultant portfolio."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["Agents", "Deployable business infrastructure."],
            ["ResponseOS", "The flagship revenue recovery wedge."],
            ["Services", "Human advisory and implementation."],
            ["Education", "Insights, workshops, ROI, and diagnostic entry points."],
          ].map(([title, copy]) => (
            <div key={title} className="aj-card-signal">
              <div className="aj-card-inner">
                <h3 className="font-accent text-2xl font-bold text-fg-0">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-fg-2">{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </DarkSection>

      <FinalCta
        title="Start with the signal."
        description="Use the diagnostic, calculator, or service path to identify the operating constraint before building the next intelligence layer."
        primaryLabel="Start the Diagnostic"
        primaryHref="/ai-readiness-diagnostic"
        secondaryLabel="Book a Call"
        secondaryHref="/book-a-call"
      />
    </>
  );
}
