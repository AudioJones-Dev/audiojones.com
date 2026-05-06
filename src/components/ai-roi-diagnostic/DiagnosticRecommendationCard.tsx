import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { RecommendationState } from "@/lib/ai-roi-diagnostic/types";

type DiagnosticRecommendationCardProps = {
  recommendation: RecommendationState;
  description: string;
  ctaLabel: string;
  ctaHref: string;
};

export default function DiagnosticRecommendationCard({
  recommendation,
  description,
  ctaLabel,
  ctaHref,
}: DiagnosticRecommendationCardProps) {
  return (
    <div
      className="rounded-2xl border border-[var(--line-blue)] bg-bg-2 p-6 sm:p-8"
      style={{
        boxShadow: "0 0 40px -10px rgba(59,91,255,0.30)",
      }}
    >
      <Eyebrow tone="blue">Recommendation</Eyebrow>
      <h3 className="mt-3 t-h3 text-fg-0">{recommendation}</h3>
      <p className="mt-3 t-body text-fg-2">{description}</p>
      <div className="mt-6">
        <ButtonLink href={ctaHref} variant="glow" size="lg">
          {ctaLabel}
        </ButtonLink>
      </div>
    </div>
  );
}
