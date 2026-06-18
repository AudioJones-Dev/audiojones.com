import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/schema";

const TITLE = "Resources";
const DESCRIPTION =
  "The Audio Jones resource library: insights, frameworks, the blog, workshops, case studies, and the ROI calculator for founder-led service businesses.";

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
  {
    title: "ROI Calculator",
    href: "/roi-calculator",
    description:
      "Quantify the operational waste hiding in manual work, slow follow-up, and founder bottlenecks.",
  },
] as const;

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: "/resources",
});

export default function ResourcesPage() {
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
              Frameworks, insights, and tools for founder-led operators.
            </h1>
            <p className="mt-6 t-lead text-fg-2">
              Everything that explains the thinking behind the systems — and a
              calculator to size the opportunity in your own business.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-[1280px] gap-6 px-5 sm:px-8 md:grid-cols-2 lg:grid-cols-3">
          {RESOURCES.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className="group flex h-full flex-col rounded-2xl border border-[var(--line-2)] bg-bg-2 p-6 sm:p-8 transition-colors hover:border-[var(--line-blue)]"
            >
              <h2 className="t-h3 text-fg-0">{r.title}</h2>
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
