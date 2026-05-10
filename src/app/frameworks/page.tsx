import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/applied-intelligence/Breadcrumbs";
import FinalCTA from "@/components/applied-intelligence/FinalCTA";
import JsonLd from "@/components/seo/JsonLd";
import { FRAMEWORKS } from "@/content/frameworks";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/schema";

export const metadata: Metadata = buildMetadata({
  title: "Frameworks",
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

      <section className="bg-[#05070F] pt-20 pb-12">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#C8A96A]">
            Framework library
          </p>
          <h1 className="text-balance text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Operating models for founders who are done scaling noise.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-300">
            Each framework is a piece of working IP — used inside the diagnostic
            and refined across every engagement.
          </p>
        </div>
      </section>

      <section className="bg-[#05070F] pb-24">
        <div className="mx-auto grid max-w-5xl gap-4 px-5 sm:px-8 md:grid-cols-2">
          {FRAMEWORKS.map((f) => (
            <Link
              key={f.slug}
              href={`/frameworks/${f.slug}`}
              className="group rounded-xl border border-white/10 bg-[#0B1020] p-7 transition hover:border-white/30"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#C8A96A]">
                {f.shortTitle}
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                {f.title}
              </h2>
              <p className="mt-1 text-sm text-[#3B5BFF]">{f.tagline}</p>
              <p className="mt-4 text-slate-300">{f.description}</p>
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
