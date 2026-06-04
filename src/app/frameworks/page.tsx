import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/applied-intelligence/Breadcrumbs";
import FinalCTA from "@/components/applied-intelligence/FinalCTA";
import JsonLd from "@/components/seo/JsonLd";
import { FRAMEWORKS } from "@/content/frameworks";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/schema";

export const metadata: Metadata = buildMetadata({
  title: "Frameworks | Audio Jones",
  description:
    "The Audio Jones framework library: Applied Intelligence Systems, M.A.P Attribution, N.I.C.H.E, and Signal vs Noise.",
  path: "/frameworks",
});

export default function FrameworksIndex() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Frameworks", url: "/frameworks" },
        ])}
      />
      <Breadcrumbs
        items={[{ name: "Home", href: "/" }, { name: "Frameworks" }]}
      />

      <section className="bg-bg-base pt-20 pb-12">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-signal-yellow">
            Framework library
          </p>
          <h1 className="text-balance text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Operating models for founders who are done scaling noise.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-text-muted">
            Each framework is a piece of working IP — used inside the diagnostic
            and refined across every engagement.
          </p>
        </div>
      </section>

      <section className="bg-bg-base pb-24">
        <div className="mx-auto grid max-w-5xl gap-4 px-5 sm:px-8 md:grid-cols-2">
          {FRAMEWORKS.map((f) => (
            <Link
              key={f.slug}
              href={`/frameworks/${f.slug}`}
              className="group rounded-xl border border-border-subtle bg-surface-1 p-7 transition hover:border-border-strong"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-signal-yellow">
                {f.shortTitle}
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                {f.title}
              </h2>
              <p className="mt-1 text-sm text-accent-blue">{f.tagline}</p>
              <p className="mt-4 text-text-muted">{f.description}</p>
              <p className="mt-6 text-sm font-semibold text-white opacity-70 group-hover:opacity-100">
                Read the framework →
              </p>
            </Link>
          ))}
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
