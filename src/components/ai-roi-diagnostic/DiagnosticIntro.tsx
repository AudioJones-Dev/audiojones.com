import Link from "next/link";

type DiagnosticIntroProps = {
  onStart: () => void;
};

export default function DiagnosticIntro({ onStart }: DiagnosticIntroProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-8 sm:p-12">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#FF4500]">
        AI ROI Diagnostic
      </p>
      <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
        Diagnose before you automate.
      </h2>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80">
        This 5-step diagnostic estimates your AI ROI potential, your operational
        readiness, and which workflow you should automate first. It will tell
        you whether to automate now, pilot first, redesign your workflow, or
        fix operations before investing.
      </p>

      <ul className="mt-6 grid gap-3 text-sm text-white/70 sm:grid-cols-2">
        <li className="flex items-start gap-2">
          <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-[#FF4500]" />
          AI ROI Score, Readiness Score, Automation Priority Score
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-[#FF4500]" />
          Estimated annual financial impact and payback period
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-[#FF4500]" />
          Bottleneck diagnosis with confidence rating
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-[#FF4500]" />
          One of six clear recommended next steps
        </li>
      </ul>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onStart}
          className="inline-flex items-center justify-center rounded-full bg-[#FF4500] px-6 py-3 text-sm font-bold text-black transition hover:bg-[#ff5a1f]"
        >
          Start the Diagnostic
        </button>
        <Link
          href="/book"
          className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40"
        >
          Book an AI Readiness Review
        </Link>
      </div>
      <p className="mt-4 text-xs text-white/50">
        Estimates are directional. They are not guarantees of results.
      </p>
    </div>
  );
}
