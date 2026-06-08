import Link from "next/link";
import MissingMiddleDiagram from "@/components/founder-intelligence/MissingMiddleDiagram";
import { ctaLinks } from "@/config/links";

export default function Step2Section() {
  return (
    <section className="border-t border-white/5 bg-[#05070F] py-20 text-white">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mb-12 max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#C8A96A]">
            Founder Intelligence System for the missing middle
          </p>
          <h2 className="text-balance text-3xl font-semibold leading-tight sm:text-4xl">
            Most businesses are missing Step 2.
          </h2>
          <p className="mt-4 text-lg text-slate-300">
            The market built Step 1 — AI capability — and keeps promising
            Step 3 — transformation, leverage, profit. The gap is Step 2:
            the operating layer that turns AI capability into measurable
            outcomes. Audio Jones builds Step 2.
          </p>
        </div>

        <MissingMiddleDiagram />

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link
            href="/step-2"
            className="inline-flex items-center justify-center rounded-md bg-[#3B5BFF] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_40px_-10px_rgba(59,91,255,0.7)] transition hover:bg-[#5B7AFF]"
          >
            Explore Step 2
          </Link>
          <Link
            href={ctaLinks.signalDiagnostic}
            className="inline-flex items-center justify-center rounded-md border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5"
          >
            Work with Audio Jones
          </Link>
        </div>
      </div>
    </section>
  );
}
