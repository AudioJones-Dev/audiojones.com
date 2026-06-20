import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import { ButtonLink } from "@/components/ui/Button";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/schema";

export const metadata: Metadata = buildMetadata({
  title: "Offer Ecosystem",
  description:
    "The Audio Jones offer ecosystem: free diagnostics generate demand, paid diagnostics create prescription, workshops educate and qualify, Agent OS installs solve, community retains, and merch signals identity.",
  path: "/ecosystem",
});

/* ──────────────────────────────────────────────────────────
   Canonical offer architecture (single source of truth for
   this page — edit copy here, layout stays intact).
   ────────────────────────────────────────────────────────── */

const FREE_OFFERS: { offer: string; leadsTo: string; href: string }[] = [
  { offer: "Revenue Leak Scorecard", leadsTo: "Revenue Leak Diagnostic", href: "/roi-calculator" },
  { offer: "AI Readiness Scorecard", leadsTo: "AI Readiness Diagnostic", href: "/ai-readiness-diagnostic" },
  { offer: "Founder Gravity Audit", leadsTo: "Founder Intelligence Diagnostic", href: "/founder-gravity-audit" },
  { offer: "Missed Call / Follow-Up Audit", leadsTo: "ResponseOS", href: "/agents/responseos" },
  { offer: "Content System Assessment", leadsTo: "PodcastOS", href: "/agents" },
  { offer: "Business Memory Check", leadsTo: "ReKonr OS", href: "/agents" },
];

const DIAGNOSTICS: { name: string; purpose: string; next: string; href: string }[] = [
  {
    name: "Revenue Leak Diagnostic",
    purpose: "Finds missed revenue in calls, follow-up, pipeline, and attribution.",
    next: "ResponseOS or workshop",
    href: "/roi-calculator",
  },
  {
    name: "AI Readiness Diagnostic",
    purpose: "Tests whether the business is ready for AI implementation.",
    next: "Agent OS solution",
    href: "/ai-readiness-diagnostic",
  },
  {
    name: "Founder Intelligence Diagnostic",
    purpose: "Maps operations, workflows, decision bottlenecks, and data gaps.",
    next: "Blueprint or Agent OS",
    href: "/founder-intelligence/diagnostic",
  },
  {
    name: "Content Engine Diagnostic",
    purpose: "Audits content, podcast, authority, and repurposing.",
    next: "PodcastOS",
    href: "/agents",
  },
  {
    name: "Business Memory Diagnostic",
    purpose: "Audits SOPs, docs, decisions, CRM notes, and knowledge loss.",
    next: "ReKonr OS",
    href: "/agents",
  },
];

const WORKSHOPS: { name: string; bestFor: string }[] = [
  { name: "Revenue Leak Workshop", bestFor: "Founders who want to understand missed revenue" },
  { name: "AI Readiness Workshop", bestFor: "Businesses considering AI but lacking clarity" },
  { name: "Founder Intelligence Workshop", bestFor: "Owners who need operating clarity" },
  { name: "ResponseOS Workshop", bestFor: "Leads with missed calls / follow-up problems" },
  { name: "ReKonr OS Workshop", bestFor: "Teams with scattered knowledge and weak documentation" },
  { name: "PodcastOS Workshop", bestFor: "Creators / founders needing a content system" },
  { name: "Offer Architecture Workshop", bestFor: "Consultants / builders turning expertise into offers" },
];

const AGENT_OS: { name: string; solves: string; href: string | null }[] = [
  { name: "ResponseOS", solves: "Missed calls, slow follow-up, lead leakage, weak intake.", href: "/agents/responseos" },
  { name: "ReKonr OS", solves: "Lost business memory, scattered docs, poor operational context.", href: null },
  { name: "PodcastOS", solves: "Inconsistent content, poor repurposing, no authority engine.", href: null },
  { name: "Founder Intelligence System", solves: "Full operating intelligence across revenue, ops, AI, and reporting.", href: "/founder-intelligence" },
];

const COMMUNITY: { name: string; role: string }[] = [
  { name: "Eightee20 Society", role: "Free audience-to-community bridge" },
  { name: "Signal Room", role: "Paid entry community" },
  { name: "Operator Lab", role: "Builder implementation community" },
  { name: "Founder Systems Circle", role: "Premium advisory / community layer" },
  { name: "Build Sprints", role: "Cohort implementation products" },
];

const MERCH: { name: string; purpose: string }[] = [
  { name: "Eightee20 Society Core", purpose: "Community identity" },
  { name: "Signal Over Noise", purpose: "Brand philosophy" },
  { name: "Operator Mode", purpose: "Builder / operator identity" },
  { name: "Founder Intelligence", purpose: "Premium / business identity" },
  { name: "Workshop Drops", purpose: "Limited campaign-based merch" },
];

const FUNNELS: { label: string; accent: string; steps: string[] }[] = [
  { label: "Primary", accent: "text-signal-yellow", steps: ["Free Diagnostic", "Paid Diagnostic", "Agent OS Solution", "Retainer / Optimization"] },
  { label: "Education", accent: "text-accent-amber", steps: ["Free Diagnostic", "Workshop", "Paid Diagnostic", "Agent OS Solution"] },
  { label: "Community", accent: "text-accent-blue", steps: ["Content", "Free Community / Signal List", "Signal Room / Operator Lab", "Workshop or Diagnostic", "Agent OS"] },
  { label: "Merch", accent: "text-fg-1", steps: ["Community / Content / Workshops", "Fourthwall Merch", "Identity + Retention + Brand Affinity"] },
];

/* Numbered flow node for the canonical map. */
function FlowNode({ n, title, sub, accent }: { n: string; title: string; sub: string; accent: string }) {
  return (
    <div className="aj-card flex items-start gap-4">
      <span className={`font-mono text-sm font-bold ${accent}`}>{n}</span>
      <div>
        <h3 className="t-h4">{title}</h3>
        <p className="mt-1 text-sm text-fg-2">{sub}</p>
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <div aria-hidden className="flex justify-center py-2 text-2xl leading-none text-signal-yellow/60">
      ↓
    </div>
  );
}

function SectionLabel({ index, label }: { index: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-xs font-bold text-signal-yellow">{index}</span>
      <p className="t-label">{label}</p>
    </div>
  );
}

export default function EcosystemPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Offer Ecosystem", url: "/ecosystem" },
        ])}
      />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-bg-base py-16 sm:py-24">
        <div aria-hidden className="absolute inset-0 bg-grid-fine opacity-25" />
        <div aria-hidden className="absolute inset-0 bg-glow-signal opacity-60" />
        <div className="relative mx-auto max-w-[1180px] px-5 sm:px-8">
          <p className="t-label">Offer Ecosystem</p>
          <h1 className="mt-5 max-w-4xl text-balance t-h1">
            Start with the leak.{" "}
            <span className="text-signal-yellow">Install the system.</span>
          </h1>
          <p className="mt-6 max-w-3xl t-body-lg">
            AJ Digital helps founder-led businesses diagnose revenue leaks,
            operational gaps, and AI readiness — then installs Agent OS
            solutions that turn scattered workflows into intelligent business
            systems.
          </p>
          <p className="mt-4 max-w-3xl text-fg-2">
            Start with a free diagnostic, go deeper with a paid business scan,
            learn through workshops, or install a full Agent OS solution.
            Community and merch support the movement around signal, systems, and
            operating leverage.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/founder-gravity-audit" variant="glow">
              Start a free diagnostic
            </ButtonLink>
            <Link href="#map" className="aj-btn-intel">
              See the full map
            </Link>
          </div>
        </div>
      </section>

      {/* ── The canonical flow map ── */}
      <section id="map" className="border-t border-border-subtle bg-surface-1 py-16">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
          <div className="max-w-3xl">
            <p className="t-label">The Map</p>
            <h2 className="mt-4 t-h2">One path to revenue. A movement around it.</h2>
            <p className="mt-4 t-body-lg text-fg-2">
              The conversion path is linear and disciplined. Community and merch
              sit beside it — they deepen trust, identity, and retention without
              cluttering the buyer&apos;s decision.
            </p>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
            {/* main conversion path */}
            <div>
              <p className="aj-data-label mb-4">Main conversion path</p>
              <FlowNode n="01" title="Free Lead Gen" sub="Scorecards, audits, assessments — capture and qualify." accent="text-accent-blue" />
              <Arrow />
              <FlowNode n="02" title="Paid Diagnostics" sub="A programmatic business scan that produces a decision-ready report." accent="text-signal-yellow" />
              <Arrow />
              <FlowNode n="03" title="Workshops or Agent OS" sub="Educate and qualify, or install the system that solves." accent="text-accent-amber" />
              <Arrow />
              <FlowNode n="04" title="Retainer / Optimization" sub="Compounding operating leverage after the install." accent="text-signal-yellow" />
            </div>

            {/* support layer */}
            <div className="rounded-xl border border-border-subtle bg-bg-base p-6">
              <p className="aj-data-label">Supporting layer</p>
              <p className="mt-3 text-sm text-fg-2">
                Not in the main conversion path — it surrounds it.
              </p>
              <div className="mt-5 space-y-3">
                <div className="rounded-lg border border-border-subtle bg-surface-2 p-4">
                  <p className="font-headline font-bold text-fg-0">Community</p>
                  <p className="mt-1 text-sm text-fg-2">Education, retention, belonging, audience depth.</p>
                </div>
                <div className="rounded-lg border border-border-subtle bg-surface-2 p-4">
                  <p className="font-headline font-bold text-fg-0">Merch</p>
                  <p className="mt-1 text-sm text-fg-2">Identity, culture, and brand signal. <span className="text-signal-yellow">Wear the signal.</span></p>
                </div>
              </div>
              <p className="mt-5 text-xs text-fg-3">
                Community → Workshops → Diagnostics → Agent OS
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 1. Free Lead Gen ── */}
      <section className="bg-bg-base py-16">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
          <SectionLabel index="01" label="Free Lead Gen" />
          <h2 className="mt-4 max-w-3xl t-h2">
            Find where your business is leaking revenue, attention, or
            operational clarity.
          </h2>
          <p className="mt-4 max-w-2xl t-body-lg text-fg-2">
            Quick, outcome-specific, and easy to understand. Each free offer
            routes into the paid path it qualifies for.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {FREE_OFFERS.map((o) => (
              <Link key={o.offer} href={o.href} className="aj-card group block">
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent-blue">
                  Free
                </p>
                <h3 className="mt-3 t-h4">{o.offer}</h3>
                <p className="mt-3 text-sm text-fg-2">
                  Leads to{" "}
                  <span className="font-semibold text-fg-0 group-hover:text-signal-yellow">
                    {o.leadsTo}
                  </span>
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. Paid Diagnostics ── */}
      <section className="border-t border-border-subtle bg-surface-1 py-16">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
          <SectionLabel index="02" label="Paid Diagnostics" />
          <h2 className="mt-4 max-w-3xl t-h2">
            Paid discovery that prescribes the system — before selling the tool.
          </h2>
          <div className="mt-6 aj-callout is-blue max-w-3xl">
            <p className="font-headline text-lg font-bold text-fg-0">
              A diagnostic is not a consultation.
            </p>
            <p className="mt-2 text-fg-1">
              It is a programmatic business scan that produces a decision-ready
              report — telling the client what system they actually need.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {DIAGNOSTICS.map((d) => (
              <Link key={d.name} href={d.href} className="aj-card group flex flex-col">
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-signal-yellow">
                  Diagnostic
                </p>
                <h3 className="mt-3 t-h4">{d.name}</h3>
                <p className="mt-3 flex-grow text-sm text-fg-2">{d.purpose}</p>
                <p className="mt-4 border-t border-border-subtle pt-3 text-xs uppercase tracking-[0.12em] text-fg-3">
                  Next:{" "}
                  <span className="text-fg-1 group-hover:text-signal-yellow">{d.next}</span>
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Workshops ── */}
      <section className="bg-bg-base py-16">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
          <SectionLabel index="03" label="Workshops" />
          <h2 className="mt-4 max-w-3xl t-h2">
            Education and guided implementation for buyers who need clarity
            first.
          </h2>
          <p className="mt-4 max-w-2xl t-body-lg text-fg-2">
            Workshops can sit after free lead gen or after a paid diagnostic —
            both paths are valid.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {WORKSHOPS.map((w) => (
              <div key={w.name} className="aj-card">
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent-amber">
                  Workshop
                </p>
                <h3 className="mt-3 t-h4">{w.name}</h3>
                <p className="mt-3 text-sm text-fg-2">{w.bestFor}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <ButtonLink href="/workshops" variant="secondary">
              Browse workshops
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ── 4. Agent OS Solutions ── */}
      <section className="border-t border-border-subtle bg-surface-1 py-16">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
          <SectionLabel index="04" label="Agent OS Solutions" />
          <h2 className="mt-4 max-w-3xl t-h2">
            The installed systems. This is where the money offers live.
          </h2>
          <div className="mt-6 aj-callout max-w-3xl">
            <p className="font-headline text-lg font-bold text-fg-0">
              Agent OS solutions are not software subscriptions.
            </p>
            <p className="mt-2 text-fg-1">
              They are installed business systems powered by AI, automation,
              workflows, dashboards, and operating discipline.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {AGENT_OS.map((a) => {
              const inner = (
                <>
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-signal-yellow">
                    Agent OS
                  </p>
                  <h3 className="mt-3 t-h3">{a.name}</h3>
                  <p className="mt-3 text-fg-2">{a.solves}</p>
                  {!a.href && (
                    <p className="mt-4 text-xs uppercase tracking-[0.12em] text-fg-3">
                      In development
                    </p>
                  )}
                </>
              );
              return a.href ? (
                <Link key={a.name} href={a.href} className="aj-card-signal block">
                  <div className="aj-card-inner">{inner}</div>
                </Link>
              ) : (
                <div key={a.name} className="aj-card">
                  {inner}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. Supplementary ecosystem ── */}
      <section className="bg-bg-base py-16">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
          <SectionLabel index="05" label="Supplementary Ecosystem" />
          <h2 className="mt-4 max-w-3xl t-h2">
            The movement around the systems — trust, identity, and retention.
          </h2>
          <p className="mt-4 max-w-2xl t-body-lg text-fg-2">
            These support the ecosystem but never confuse the main buyer path.
          </p>

          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            {/* Community */}
            <div>
              <p className="aj-data-label mb-4">Community</p>
              <div className="space-y-3">
                {COMMUNITY.map((c) => (
                  <div key={c.name} className="flex items-baseline justify-between gap-4 rounded-lg border border-border-subtle bg-surface-1 px-4 py-3">
                    <span className="font-headline font-bold text-fg-0">{c.name}</span>
                    <span className="text-right text-sm text-fg-2">{c.role}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Merch */}
            <div>
              <p className="aj-data-label mb-4">Merch · Fourthwall</p>
              <div className="space-y-3">
                {MERCH.map((m) => (
                  <div key={m.name} className="flex items-baseline justify-between gap-4 rounded-lg border border-border-subtle bg-surface-1 px-4 py-3">
                    <span className="font-headline font-bold text-fg-0">{m.name}</span>
                    <span className="text-right text-sm text-fg-2">{m.purpose}</span>
                  </div>
                ))}
              </div>
              <p className="mt-5 font-headline text-xl font-bold text-signal-yellow">
                Wear the signal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── The four funnels ── */}
      <section className="border-t border-border-subtle bg-surface-1 py-16">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
          <div className="max-w-3xl">
            <p className="t-label">Funnel Structures</p>
            <h2 className="mt-4 t-h2">Four ways in. One system at the end.</h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {FUNNELS.map((f) => (
              <div key={f.label} className="aj-card">
                <p className={`font-mono text-xs font-bold uppercase tracking-[0.16em] ${f.accent}`}>
                  {f.label} funnel
                </p>
                <ol className="mt-4 space-y-2">
                  {f.steps.map((s, i) => (
                    <li key={s} className="flex items-center gap-3 text-sm text-fg-1">
                      <span className="font-mono text-xs text-fg-3">{String(i + 1).padStart(2, "0")}</span>
                      {s}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing ── */}
      <section className="bg-bg-base py-20">
        <div className="mx-auto max-w-[900px] px-5 text-center sm:px-8">
          <h2 className="mx-auto max-w-3xl t-h2">
            Free diagnostics generate demand. Paid diagnostics create
            prescription. Agent OS installs solve.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl t-body-lg text-fg-2">
            Workshops educate and qualify. Community retains. Merch signals
            identity. Start where you are.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="/founder-gravity-audit" variant="glow">
              Start a free diagnostic
            </ButtonLink>
            <ButtonLink href="/book-a-call" variant="secondary">
              Book a call
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
