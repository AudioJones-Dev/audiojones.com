import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";

export default function DiagnosticCTA() {
  return (
    <section id="diagnostic" className="scroll-mt-24 border-t border-border-subtle bg-surface-1 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <Eyebrow>Choose the first fix</Eyebrow>
        <h2 className="mt-4 t-h2 text-balance text-fg-0">What keeps costing you time or sales?</h2>
        <p className="mx-auto mt-6 max-w-2xl t-body-lg text-fg-2">Tell us where work gets stuck. We will review your request and see whether a diagnostic is the right next step.</p>
        <div className="mt-8 flex flex-col items-center gap-4">
          <Link href="/founder-intelligence/diagnostic" className="aj-btn-signal">Request a Diagnostic</Link>
          <Link href="/book-a-call" className="text-fg-0 underline underline-offset-4 hover:text-signal-yellow">Already know the issue? Book a call.</Link>
        </div>
        <p className="mt-6 t-small text-fg-2">Six steps to request a review. Scope and price are agreed before paid work starts.</p>
        <Link href="/insights" className="mt-10 inline-block text-sm text-fg-2 underline underline-offset-4 hover:text-fg-0">Read our guides to AI, workflows, and attribution</Link>
      </div>
    </section>
  );
}
