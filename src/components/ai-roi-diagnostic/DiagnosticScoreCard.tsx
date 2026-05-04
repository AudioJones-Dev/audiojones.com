type ScoreTone = "signal" | "system" | "metric";

type DiagnosticScoreCardProps = {
  title: string;
  score: number;
  description: string;
  tone?: ScoreTone;
};

const TONE_CLASS: Record<ScoreTone, string> = {
  signal: "text-aj-orange",
  system: "text-aj-blue-bright",
  metric: "text-aj-gold",
};

const scoreLabel = (score: number): string => {
  if (score >= 75) return "Strong";
  if (score >= 50) return "Moderate";
  if (score >= 25) return "Limited";
  return "Weak";
};

export default function DiagnosticScoreCard({
  title,
  score,
  description,
  tone = "signal",
}: DiagnosticScoreCardProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  return (
    <div className="flex h-full flex-col rounded-2xl border border-[var(--line-2)] bg-bg-2 p-6">
      <p className="t-small font-semibold uppercase tracking-[0.18em] text-fg-2">
        {title}
      </p>
      <div className="mt-4 flex items-baseline gap-2">
        <span className={`text-5xl font-semibold leading-none ${TONE_CLASS[tone]}`}>
          {clamped}
        </span>
        <span className="t-small text-fg-3">/ 100</span>
      </div>
      <p className={`mt-1 t-small font-medium ${TONE_CLASS[tone]}`}>
        {scoreLabel(clamped)}
      </p>
      <div
        className="mt-4 h-1 w-full overflow-hidden rounded-full bg-bg-3"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full ${tone === "signal" ? "bg-aj-orange" : tone === "system" ? "bg-aj-blue-bright" : "bg-aj-gold"}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      <p className="mt-4 t-small text-fg-2">{description}</p>
    </div>
  );
}
