import Link from "next/link";
import MissingMiddleDiagram from "@/components/applied-intelligence/MissingMiddleDiagram";
import { ctaLinks } from "@/config/links";

export default function Step2Section() {
  return (
    <section className="border-t border-border-subtle bg-bg-base py-20 text-white">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mb-12 max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-signal-yellow">
            Applied Intelligence for the missing middle
          </p>
          <h2 className="text-balance text-3xl font-semibold leading-tight sm:text-4xl">
            Most businesses are missing Step 2.
          </h2>
          <p className="mt-4 text-lg text-text-muted">
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
            className="inline-flex items-center justify-center rounded-md bg-accent-blue px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_40px_-10px_rgba(77,172,255,0.7)] transition hover:bg-[#5B7AFF]"
          >
            Explore Step 2
          </Link>
          <Link
            href={ctaLinks.signalDiagnostic}
            className="inline-flex items-center justify-center rounded-md border border-border-subtle px-6 py-3 text-sm font-semibold text-white transition hover:border-border-strong hover:bg-white/5"
          >
            Work with Audio Jones
          </Link>
        </div>
      </div>
    </section>
  );
}
