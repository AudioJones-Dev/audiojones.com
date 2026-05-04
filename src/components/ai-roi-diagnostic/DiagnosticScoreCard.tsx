type DiagnosticScoreCardProps = {
  title: string;
  score: number;
  description: string;
};

function scoreTone(score: number): {
  label: string;
  ringColor: string;
  textColor: string;
} {
  if (score >= 70) {
    return {
      label: "Strong",
      ringColor: "border-[#FF4500]",
      textColor: "text-[#FF4500]",
    };
  }
  if (score >= 40) {
    return {
      label: "Moderate",
      ringColor: "border-[#FFD700]",
      textColor: "text-[#FFD700]",
    };
  }
  return {
    label: "Low",
    ringColor: "border-white/30",
    textColor: "text-white/70",
  };
}

export default function DiagnosticScoreCard({
  title,
  score,
  description,
}: DiagnosticScoreCardProps) {
  const tone = scoreTone(score);
  return (
    <div className="flex h-full flex-col gap-4 rounded-xl border border-white/10 bg-black/40 p-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70">
          {title}
        </h3>
        <span
          className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${tone.ringColor} ${tone.textColor}`}
        >
          {tone.label}
        </span>
      </div>
      <div className="flex items-end gap-2">
        <span className={`text-5xl font-black ${tone.textColor}`}>
          {Math.round(score)}
        </span>
        <span className="pb-2 text-sm text-white/50">/100</span>
      </div>
      <p className="text-sm leading-relaxed text-white/70">{description}</p>
    </div>
  );
}
