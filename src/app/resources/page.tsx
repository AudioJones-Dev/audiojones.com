import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { CALCULATORS, DIAGNOSTICS, visibleTools, type Tool } from "@/content/tools";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/schema";

const TITLE = "Resources";
const DESCRIPTION =
  "Diagnostics and calculators for founder-led service businesses, plus the Audio Jones library: insights, frameworks, the blog, workshops, and case studies.";

// The content library. The interactive tools live in the TOOLS registry
// (`src/content/tools`) and are rendered above this — a diagnostic that
// identifies a problem and a calculator that estimates value are not the same
// kind of thing as an essay, and the previous flat list obscured that.
const RESOURCES = [
  {
    title: "Insights",
    href: "/insights",
    description:
      "Pillar essays on Founder Intelligence Systems, signal vs noise, AI failure modes, and attribution.",
  },
  {
    title: "Frameworks",
    href: "/frameworks",
    description:
      "The working IP: Founder Intelligence Systems, M.A.P. (Meaningful. Actionable. Profitable.), N.I.C.H.E, and Signal vs Noise.",
  },
  {
    title: "Blog",
    href: "/blog",
    description:
      "Founder Intelligence, signal systems, and AI-readiness, organized into topic clusters.",
  },
  {
    title: "Workshops",
    href: "/workshops",
    description:
      "Operator workshops for teams building AI readiness, revenue recovery, and signal-over-noise systems.",
  },
  {
    title: "Case Studies",
    href: "/case-studies",
    description:
      "Operator proof organized around signal, leak, and the system that closed the gap.",
  },
] as const;

// The ideas the resource library reinforces. A content hub, not a link dump —
// every theme routes to the surface that develops it.
const THEMES = [
  {
    label: "Founder Intelligence",
    href: "/founder-intelligence",
    blurb: "Operating leverage and systems that compound founder judgment.",
  },
  {
    label: "M.A.P.",
    href: "/frameworks/map-attribution",
    blurb:
      "Meaningful. Actionable. Profitable. — the decision filter every metric must pass.",
  },
  {
    label: "ResponseOS",
    href: "/agents/responseos",
    blurb: "A managed Revenue Recovery System for capture, qualification, routing, follow-up, attribution, and reporting.",
  },
  {
    label: "Revenue Intelligence",
    href: "/roi-calculator",
    blurb: "See where revenue leaks and what recovering it is worth.",
  },
  {
    label: "AI Readiness",
    href: "/ai-readiness-diagnostic",
    blurb: "Whether the business is ready for AI — and the gaps to close first.",
  },
  {
    label: "Operational Clarity",
    href: "/insights/signal-vs-noise-business",
    blurb: "Separate signal from noise so every decision gets sharper.",
  },
] as const;

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/resources",
});

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={tool.href}
      className="group flex h-full flex-col rounded-2xl border border-[var(--line-2)] bg-bg-1 p-6 sm:p-8 transition-colors hover:border-[var(--line-blue)]"
    >
      <h3 className="t-h3 text-fg-0">{tool.name}</h3>
      <p className="mt-3 t-body text-fg-2">{tool.description}</p>
      <p className="mt-4 t-small text-aj-gold">{tool.primaryResult}</p>
      <span className="mt-6 t-body text-aj-orange group-hover:text-aj-orange-soft">
        {tool.cta} →
      </span>
    </Link>
  );
}

export default function ResourcesPage() {
  const diagnostics = visibleTools(DIAGNOSTICS);
  const calculators = visibleTools(CALCULATORS);

  return (
    <main className="min-h-screen bg-bg-0 text-fg-0">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Resources", url: "/resources" },
        ])}
      />

      <section className="border-b border-[var(--line-2)] py-16 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <div className="max-w-[var(--copy-max)]">
            <Eyebrow>Resources</Eyebrow>
            <h1 className="mt-5 t-h1 text-balance text-fg-0">
              Tools for better business decisions.
            </h1>
            <p className="mt-6 t-lead text-fg-2">
              Assess what needs attention, estimate potential returns, and
              identify the next practical investment for your business.
            </p>
          </div>
        </div>
      </section>

      {/* Diagnostics — tools that identify a problem */}
      <section className="border-b border-[var(--line-2)] py-16 sm:py-24">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <div className="max-w-3xl">
            <Eyebrow tone="blue">Diagnostics</Eyebrow>
            <h2 className="mt-4 t-h2 text-balance text-fg-0">
              Find out what needs attention.
            </h2>
            <p className="mt-5 t-body-lg text-fg-2">
              Structured assessments that surface where the business is
              constrained — before anything gets installed on top of it.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {diagnostics.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Calculators — tools that estimate cost or economic value */}
      <section className="border-b border-[var(--line-2)] py-16 sm:py-24">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <div className="max-w-3xl">
            <Eyebrow tone="blue">Calculators</Eyebrow>
            <h2 className="mt-4 t-h2 text-balance text-fg-0">
              Size the opportunity before you commit.
            </h2>
            <p className="mt-5 t-body-lg text-fg-2">
              Every figure is an estimate based on your inputs and stated
              assumptions — not a forecast or a guarantee.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {calculators.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Themes — what the library reinforces */}
      <section className="border-b border-[var(--line-2)] py-16 sm:py-24">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <div className="max-w-3xl">
            <Eyebrow tone="blue">What it reinforces</Eyebrow>
            <h2 className="mt-4 t-h2 text-balance text-fg-0">
              Six ideas the system runs on.
            </h2>
            <p className="mt-5 t-body-lg text-fg-2">
              The library is organized around the concepts behind Founder
              Intelligence Systems — each links to where it is developed in full.
            </p>
          </div>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {THEMES.map((t) => (
              <li key={t.label}>
                <Link
                  href={t.href}
                  className="group block h-full rounded-2xl border border-[var(--line-2)] bg-bg-1 p-6 transition-colors hover:border-[var(--line-blue)]"
                >
                  <p className="t-h4 text-aj-gold">{t.label}</p>
                  <p className="mt-2 t-body text-fg-2">{t.blurb}</p>
                  <span className="mt-4 inline-flex t-small text-aj-orange group-hover:text-aj-orange-soft">
                    Go deeper →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
          <div className="max-w-3xl">
            <Eyebrow>The library</Eyebrow>
            <h2 className="mt-4 t-h2 text-balance text-fg-0">
              Where each idea lives.
            </h2>
          </div>
        </div>
        <div className="mx-auto mt-10 grid max-w-[1280px] gap-6 px-5 sm:px-8 md:grid-cols-2 lg:grid-cols-3">
          {RESOURCES.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className="group flex h-full flex-col rounded-2xl border border-[var(--line-2)] bg-bg-2 p-6 sm:p-8 transition-colors hover:border-[var(--line-blue)]"
            >
              <h3 className="t-h3 text-fg-0">{r.title}</h3>
              <p className="mt-3 flex-1 t-body text-fg-2">{r.description}</p>
              <span className="mt-6 t-body text-aj-orange group-hover:text-aj-orange-soft">
                Explore →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
