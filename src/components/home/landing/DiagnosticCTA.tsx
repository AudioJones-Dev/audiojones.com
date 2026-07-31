import Link from "next/link";
import Image from "next/image";
import { Eyebrow } from "@/components/ui/Eyebrow";

const CTA_BG =
  "/assets/Homepage/12-final-diagnostic-cta/backgrounds/final-cta-bg-v2.webp";

/**
 * RI-001 final diagnostic CTA. Intake remains on the canonical
 * Founder Intelligence diagnostic route.
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
        className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_50%_30%,rgba(77,172,255,0.18),transparent_50%)]"
      />

      <div className="mx-auto max-w-[960px] px-5 sm:px-8 text-center">
        <Eyebrow>Start With Diagnosis</Eyebrow>
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
          Stop guessing at the fix.
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
          If the problem is unclear, the responsible next step is diagnosis,
          not another tool, workflow, or disconnected automation.
        </p>
        <p className="mt-4 t-body text-fg-2 max-w-2xl mx-auto">
          The Founder Intelligence Diagnostic maps the constraint before any
          implementation is recommended.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/founder-intelligence/diagnostic" className="aj-btn-signal w-full sm:w-auto">
            Start the Founder Intelligence Diagnostic
          </Link>
          <Link href="/founder-intelligence" className="aj-btn-intel w-full sm:w-auto">
            Explore Founder Intelligence
          </Link>
        </div>
        <p className="mt-6 t-small text-fg-3">
          Six focused steps. Reviewed before any system is prescribed.
        </p>
      </div>
    </section>
  );
}
