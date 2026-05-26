/**
 * /service-areas
 *
 * P2 hub page — built from docs/landing-pages/service-areas-hub.md.
 *
 * Closes the internal-linking loop for the localized landing pages:
 * every city page links back here; this page links to every city page.
 *
 * Also acts as the canonical answer to "where does Audio Jones operate"
 * for AEO surfaces (ChatGPT, Claude, Perplexity). Service schema
 * aggregates all 14 areaServed entries from aiLocalBusiness so the
 * entity graph stays connected.
 */

import type { Metadata } from "next";
import Link from "next/link";
import {
  DarkSection,
  FinalCta,
  LightProofSection,
  SectionIntro,
  SignalHero,
} from "@/components/marketing/DesignSystemSections";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/schema";
import { aiLocalBusiness, SITE_URL } from "@/lib/applied-intelligence/tokens";

const PATH = "/service-areas";
const TITLE = "Service Areas — Where Audio Jones Operates in Florida";
const DESCRIPTION =
  "Audio Jones serves founder-led businesses across South Florida (Miami-Dade, Broward) and Southwest Florida (Naples, Fort Myers). See all 14 service areas with localized landing pages.";

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

/**
 * Multi-area Service schema — single Service node, many areaServed entries.
 * References the canonical LocalBusiness via @id so the entity graph stays
 * connected to the site-wide schema in layout.tsx.
 */
function multiAreaServiceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Applied Intelligence Systems",
    description:
      "AI consulting, marketing automation, attribution, podcast production, and Founder Intelligence Systems for founder-led service businesses across South Florida and Southwest Florida.",
    url: `${SITE_URL}${PATH}`,
    provider: { "@id": `${SITE_URL}/#localbusiness` },
    areaServed: aiLocalBusiness.areaServed.map((area) => ({
      "@type": area.type,
      name: area.name,
      containedInPlace: { "@type": "State", name: "Florida" },
    })),
  } as const;
}

// Linked cards — keep in sync with publicRoutes in src/lib/site.ts.
// Cities marked status:"built" have a page.tsx; status:"planned" don't yet.
const SOUTH_FL_CITIES = [
  {
    city: "Hialeah",
    county: "Miami-Dade",
    href: "/marketing-consultant-hialeah",
    note: "HQ",
    status: "built",
  },
  {
    city: "Miami",
    county: "Miami-Dade",
    href: "/ai-consultant-miami",
    note: "Primary metro",
    status: "built",
  },
  {
    city: "Fort Lauderdale",
    county: "Broward",
    href: "/ai-services-fort-lauderdale",
    note: "",
    status: "built",
  },
  // TODO(future): build dedicated pages for these once volume warrants.
  { city: "Miami Beach", county: "Miami-Dade", note: "" },
  { city: "Hollywood", county: "Broward", note: "" },
  { city: "Pembroke Pines", county: "Broward", note: "" },
  { city: "Miramar", county: "Broward", note: "" },
  { city: "Davie", county: "Broward", note: "" },
  { city: "Cooper City", county: "Broward", note: "" },
] as const;

const SW_FL_CITIES = [
  {
    city: "Naples",
    county: "Collier",
    href: "/ai-services-naples",
    note: "Blue-collar AI wedge",
    status: "built",
  },
  {
    city: "Fort Myers",
    county: "Lee",
    href: "/ai-services-fort-myers",
    note: "Blue-collar AI wedge",
    status: "built",
  },
] as const;

export default function ServiceAreasPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Service Areas", url: PATH },
        ])}
      />
      <JsonLd data={multiAreaServiceJsonLd()} />

      <SignalHero
        title="Where Audio Jones operates."
        description="Founder-led businesses across South Florida and Southwest Florida. In-person sessions when geographically practical, remote delivery everywhere. Bilingual (English & Spanish) across all services."
        primaryHref="/book-a-call?source=service-areas"
        primaryLabel="Book a Strategy Session"
        secondaryHref="/applied-intelligence/diagnostic"
        secondaryLabel="Start the Diagnostic"
      />

      <DarkSection>
        <SectionIntro
          label="South Florida"
          title="Miami-Dade & Broward — our primary metro."
          description="In-person sessions available across all listed cities. Remote delivery for system implementation, dashboards, and ongoing optimization."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SOUTH_FL_CITIES.map((entry) => {
            const isBuilt = "status" in entry && entry.status === "built";
            const card = (
              <div className="aj-product-card h-full">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-accent text-lg font-bold tracking-[-0.02em] text-fg-0">
                    {entry.city}
                  </h3>
                  {entry.note ? (
                    <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--signal-yellow)]">
                      {entry.note}
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-xs uppercase tracking-[0.12em] text-fg-3">
                  {entry.county} County
                </p>
                {isBuilt ? (
                  <p className="mt-4 text-sm leading-6 text-[var(--signal-yellow)] underline underline-offset-4">
                    See {entry.city} page →
                  </p>
                ) : (
                  <p className="mt-4 text-xs leading-6 text-fg-3">
                    Service area — dedicated page coming soon.
                  </p>
                )}
              </div>
            );

            return isBuilt && "href" in entry ? (
              <Link
                key={entry.city}
                href={entry.href as string}
                className="block transition hover:-translate-y-0.5"
              >
                {card}
              </Link>
            ) : (
              <div key={entry.city}>{card}</div>
            );
          })}
        </div>
      </DarkSection>

      <DarkSection className="border-t border-[var(--border-subtle)]">
        <SectionIntro
          label="Southwest Florida"
          title="Collier & Lee Counties — the blue-collar AI wedge."
          description="Naples and Fort Myers service businesses ($1M-$10M revenue) installing AI receptionists, attribution, and operational automation. Different tone, same systems."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {SW_FL_CITIES.map((entry) => (
            <Link
              key={entry.city}
              href={entry.href}
              className="block transition hover:-translate-y-0.5"
            >
              <div className="aj-product-card h-full">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-accent text-lg font-bold tracking-[-0.02em] text-fg-0">
                    {entry.city}
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--signal-yellow)]">
                    {entry.note}
                  </span>
                </div>
                <p className="mt-2 text-xs uppercase tracking-[0.12em] text-fg-3">
                  {entry.county} County
                </p>
                <p className="mt-4 text-sm leading-6 text-[var(--signal-yellow)] underline underline-offset-4">
                  See {entry.city} page →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </DarkSection>

      <LightProofSection>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0088cc]">
              How We Deliver
            </p>
            <h2 className="mt-4 font-accent text-[clamp(2rem,3.5vw,3.25rem)] font-bold leading-[1.04] tracking-[-0.03em]">
              Local presence in Miami-Dade. Remote delivery everywhere else.
            </h2>
          </div>
          <div className="space-y-5 text-base leading-7 text-[#1F2937]">
            <p>
              In-person sessions across Miami-Dade and Broward — Hialeah HQ
              with travel to client locations as needed. Quarterly on-site
              sessions for Naples and Fort Myers engagements.
            </p>
            <p>
              All system implementation work — AI receptionist setup,
              attribution dashboards, workflow automation, executive
              reporting — is delivered remotely through video, shared docs,
              and collaborative dashboards. The systems we install outlast
              the engagement.
            </p>
            <p className="text-sm text-[#4B5563]">
              Bilingual delivery (English &amp; Spanish) available across
              every service.
            </p>
          </div>
        </div>
      </LightProofSection>

      <DarkSection>
        <SectionIntro
          label="Industries We Serve"
          title="Where Applied Intelligence Systems compound."
          description="The common thread: founder-led service businesses with real revenue but no operational layer underneath."
        />
        <div className="mt-10 grid gap-3 text-sm leading-7 text-fg-2 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "Professional services (legal, accounting, consulting)",
            "Healthcare (private practices, allied health)",
            "Home services (HVAC, plumbing, roofing, restoration)",
            "Marine services (Fort Lauderdale, Naples, Fort Myers)",
            "Real estate and hospitality",
            "Creative and personal-brand businesses",
          ].map((industry) => (
            <div
              key={industry}
              className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-1)] px-4 py-3"
            >
              {industry}
            </div>
          ))}
        </div>
      </DarkSection>

      <FinalCta
        title="Not sure which page applies to you?"
        description="Book a 30-minute Strategy Session and we'll help you find the right entry point. Most engagements start with the system most likely to recover lost revenue in 90 days."
        primaryLabel="Book a Strategy Session"
        primaryHref="/book-a-call?source=service-areas"
        secondaryLabel="Start the Diagnostic"
        secondaryHref="/applied-intelligence/diagnostic"
      />
    </>
  );
}
