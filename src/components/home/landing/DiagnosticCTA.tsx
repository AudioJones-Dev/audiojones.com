import Link from "next/link";
import Image from "next/image";
import { Eyebrow } from "@/components/ui/Eyebrow";

const CTA_BG =
  "/assets/Homepage/12-final-diagnostic-cta/backgrounds/final-cta-bg-v2.webp";

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
      className="relative overflow-hidden border-t border-[var(--line-2)] bg-bg-0 py-32 sm:py-40"
    >
      <div aria-hidden className="absolute inset-0 -z-30">
        <Image
          src={CTA_BG}
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
          style={{ opacity: 0.58 }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(5,7,15,0.34),rgba(5,7,15,0.88)_68%)]" />
      </div>
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
        <h2
          className="mt-4 text-fg-0 text-balance"
          style={{
            fontFamily: "var(--font-headline)",
            fontSize: "clamp(40px,6vw,64px)",
            fontWeight: 700,
            lineHeight: 1.0,
            letterSpacing: "-0.035em",
          }}
        >
          Build around what actually works.
        </h2>
        <p
          className="mt-4 text-fg-2 max-w-[56ch] mx-auto"
          style={{
            fontFamily: "var(--font-accent)",
            fontSize: "20px",
            fontWeight: 500,
            lineHeight: 1.5,
            letterSpacing: "-0.01em",
          }}
        >
          Run the diagnostic, identify the signal, and build the system that
          turns it into measurable growth.
        </p>
        <p className="mt-4 t-body text-fg-2 max-w-2xl mx-auto">
          Choose the live call path when you are ready to scope the system.
          Choose the diagnostic path when the leak still needs to be mapped.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/book-a-call" className="aj-btn-signal w-full sm:w-auto">
            Book a Call
          </Link>
          <Link href="/ai-readiness-diagnostic" className="aj-btn-intel w-full sm:w-auto">
            Start the AI Readiness Diagnostic
          </Link>
        </div>
        <p className="mt-6 t-small text-fg-3">
          Free fit review. No commitment. Reviewed personally by Audio Jones.
        </p>

        {/* ── Quiet divider ── */}
        <div
          aria-hidden
          className="mx-auto mt-16 h-px w-32 bg-gradient-to-r from-transparent via-[var(--line-2)] to-transparent"
        />

        <div className="mx-auto mt-10 max-w-[480px] text-center">
          <Eyebrow tone="muted">Insights</Eyebrow>
          <p className="mt-3 t-small text-fg-2">
            Read the latest signal notes on AI systems, attribution, and revenue recovery.
          </p>
          <Link href="/insights" className="aj-btn-intel mt-5">
            Read Insights
          </Link>
        </div>
      </div>
    </section>
  );
}
