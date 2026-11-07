import type { Metadata } from "next";
import Image from "next/image";
import {
  DarkSection,
  FinalCta,
  LightProofSection,
  SectionIntro,
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
  "Audio Jones is a forward deployed engineer, AI consultant, and business strategist with more than 20 years in entertainment and more than 20 years in corporate work. He builds AI systems for founder-led businesses.";

export const metadata: Metadata = buildMetadata({
  title: "About Audio Jones - AI Consultant and Business Strategist",
  description: DESCRIPTION,
  path: "/about",
});

const ROLES = [
  ["Forward deployed engineer", "Works inside your tools and team to build the fix, not just recommend it."],
  ["AI consultant", "Decides where AI helps, where it doesn't, and what a person should still own."],
  ["Business strategist", "Finds the constraint in how leads, jobs, and decisions move."],
  ["Digital marketer", "Connects marketing spend to the leads and jobs it actually produces."],
  ["Personal brand coach", "Helps founders show up clearly so the right clients find them."],
] as const;

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
        title="Meet Audio Jones."
        description="Forward deployed engineer, AI consultant, and business strategist. Two decades in entertainment and two decades in corporate work taught him how businesses really run. He now uses that to build AI systems for founder-led businesses."
        primaryHref="/founder-intelligence/diagnostic"
        primaryLabel="Request a Diagnostic"
        secondaryHref="/book-a-call"
        secondaryLabel="Book a Call"
      >
        <figure className="mx-auto w-full max-w-md overflow-hidden rounded-[var(--r-lg)] border border-[var(--line-2)]">
          <Image
            src="/assets/about/audio-jones-portrait.webp"
            alt="Portrait of Audio Jones"
            width={900}
            height={1125}
            priority
            sizes="(min-width: 1024px) 28rem, 100vw"
            className="h-auto w-full"
          />
        </figure>
      </SignalHero>

      <DarkSection>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionIntro
            label="The story"
            title="Two careers. One lesson about how work moves."
          />
          <div className="space-y-5 text-lg leading-8 text-fg-2">
            <p>
              &ldquo;I spent more than 20 years in entertainment and more than 20 years in corporate
              work. Both taught me the same thing: the business that wins is the one where the
              handoffs work. Leads get answered. Jobs get scheduled. Decisions don&rsquo;t sit in
              someone&rsquo;s inbox.&rdquo;
            </p>
            <p>
              &ldquo;That&rsquo;s what I bring to AI. I start with how your business actually
              operates, find where things get stuck, and build only what fixes it.&rdquo;
            </p>
            <p className="text-base text-fg-3">Audio Jones, founder of AJ Digital</p>
          </div>
        </div>
      </DarkSection>

      <LightProofSection>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--aj-blue-deep)]">
          What he does
        </p>
        <h2 className="mt-4 font-accent text-[clamp(2.25rem,4vw,4rem)] font-bold leading-[1.02] tracking-[-0.035em]">
          Strategy, AI, and the build, from one person.
        </h2>
        <dl className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {ROLES.map(([title, copy]) => (
            <div key={title}>
              <dt className="font-accent text-xl font-bold">{title}</dt>
              <dd className="mt-2 text-base leading-7 text-[#4b5563]">{copy}</dd>
            </div>
          ))}
        </dl>
      </LightProofSection>

      <DarkSection>
        <SectionIntro
          label="How we help"
          title="Diagnose first. Then build only what fixes the gap."
          description="Audio Jones finds where leads, jobs, and decisions get stuck. AJ Digital builds the agreed fix and checks whether it worked."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["Diagnostic", "A close look at how a real lead or job moves through your business."],
            ["ResponseOS", "Capture, route, and follow up on every inquiry so fewer leads go quiet."],
            ["Systems builds", "Workflows, shared knowledge, and reporting scoped to the gap we found."],
            ["Guides and tools", "Plain guides, workshops, and an ROI calculator to size the problem."],
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
        description="Tell Audio Jones where leads, jobs, or decisions get stuck. A person reviews every diagnostic request."
        primaryLabel="Request a Diagnostic"
        primaryHref="/founder-intelligence/diagnostic"
        secondaryLabel="Book a Call"
        secondaryHref="/book-a-call"
      />
    </>
  );
}
