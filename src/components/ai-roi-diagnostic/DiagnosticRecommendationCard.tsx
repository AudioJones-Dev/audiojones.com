import Link from "next/link";
import type { RecommendationState } from "@/lib/ai-roi-diagnostic/types";

type DiagnosticRecommendationCardProps = {
  recommendation: RecommendationState;
  description: string;
  ctaLabel: string;
  ctaHref?: string;
};

export default function DiagnosticRecommendationCard({
  recommendation,
  description,
  ctaLabel,
  ctaHref = "/book",
}: DiagnosticRecommendationCardProps) {
  return (
    <div className="rounded-2xl border border-[#FF4500]/40 bg-gradient-to-br from-[#FF4500]/10 via-black/60 to-black/80 p-8">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#FF4500]">
        Recommended Next Step
      </p>
      <h3 className="mt-2 text-3xl font-black text-white sm:text-4xl">
        {recommendation}
      </h3>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80">
        {description}
      </p>
      <Link
        href={ctaHref}
        className="mt-6 inline-flex items-center justify-center rounded-full bg-[#FF4500] px-6 py-3 text-sm font-bold text-black transition hover:bg-[#ff5a1f]"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
