import { Button, ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

type DiagnosticIntroProps = {
  onStart: () => void;
};

export default function DiagnosticIntro({ onStart }: DiagnosticIntroProps) {
  return (
    <div className="rounded-2xl border border-[var(--line-2)] bg-bg-2 p-8 sm:p-10">
      <Eyebrow tone="gold">AI ROI Diagnostic</Eyebrow>
      <h2 className="mt-4 t-h2 text-balance text-fg-0">
        Diagnose before you automate.
      </h2>
      <p className="mt-4 t-lead text-fg-2">
        Five short steps that estimate your AI ROI potential, your operational
        readiness, and which workflow you should automate first. The result tells
        you whether to automate now, pilot first, redesign your workflow, or fix
        operations before investing.
      </p>

      <ul className="mt-7 grid gap-3 sm:grid-cols-2">
        {[
          "AI ROI, Readiness, and Automation Priority scores",
          "Estimated annual financial impact and payback period",
          "Bottleneck diagnosis with confidence rating",
          "One of six clear recommended next steps",
        ].map((item) => (
          <li key={item} className="flex items-start gap-2 t-small text-fg-1">
            <span
              aria-hidden
              className="mt-[7px] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-aj-orange"
            />
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="button" variant="glow" size="lg" onClick={onStart}>
          Calculate AI ROI
        </Button>
        <ButtonLink
          href="/applied-intelligence/diagnostic"
          variant="secondary"
          size="lg"
        >
          Take the Signal Diagnostic
        </ButtonLink>
      </div>
      <p className="mt-4 t-small text-fg-3">
        Estimates are directional, not guarantees of results.
      </p>
    </div>
  );
}
