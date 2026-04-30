import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

/**
 * Section 8 — Diagnostic CTA.
 * High-conversion. Inline form preview is non-functional and routes
 * the user to the canonical 6-step diagnostic at
 * /applied-intelligence/diagnostic. We do not collect data here —
 * the field is visual scaffolding only. (Mock-only per Wave 1 rules;
 * real intake stays at the Applied Intelligence diagnostic route.)
 */
export default function DiagnosticCTA() {
  return (
    <section
      id="diagnostic"
      className="relative border-t border-[var(--line-2)] bg-bg-0 py-24 sm:py-32"
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-aj-blue-bright/40 to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_50%_30%,rgba(59,91,255,0.18),transparent_50%)]"
      />

      <div className="mx-auto max-w-[960px] px-5 sm:px-8 text-center">
        <Eyebrow>Apply</Eyebrow>
        <h2 className="mt-4 t-display-lg text-balance" style={{ fontSize: "60px" }}>
          Stop guessing what works.
        </h2>
        <p className="mt-5 t-lead text-fg-1">
          Identify what actually drives your business. Request a strategic
          diagnostic and get a constraint map, signal audit, and 30–45 day plan.
        </p>

        {/* Inline preview field — visual scaffolding only; routes user to the
            real 6-step diagnostic on submit / button click. No data captured. */}
        <form
          action="/applied-intelligence/diagnostic"
          method="get"
          className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 sm:flex-row"
          aria-label="Open the strategic diagnostic"
        >
          <label htmlFor="diag-email" className="sr-only">
            Email
          </label>
          <input
            id="diag-email"
            name="email"
            type="email"
            inputMode="email"
            placeholder="you@company.com"
            className="flex-1 rounded-[var(--r-sm)] border border-[var(--line-2)] bg-bg-2 px-5 py-3 t-body text-fg-0 placeholder:text-fg-3 focus:border-aj-blue-bright focus:outline-none focus:ring-0"
          />
          <ButtonLink
            href="/applied-intelligence/diagnostic"
            variant="primary"
            size="lg"
          >
            Request diagnostic
          </ButtonLink>
        </form>
        <p className="mt-4 t-small text-fg-3">
          Free fit review. No spam. Reviewed personally by Audio Jones.
        </p>
      </div>
    </section>
  );
}
