import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyTemplate } from "@/components/marketing/CaseStudyTemplate";
import { getCaseStudy } from "@/data/case-studies";
import { buildMetadata } from "@/lib/seo/metadata";

const SLUG = "scattered-activity-to-signal-system";

export const metadata: Metadata = (() => {
  const study = getCaseStudy(SLUG);
  if (!study) {
    return buildMetadata({
      title: "Case Study",
      description: "Audio Jones case study.",
      path: `/case-studies/${SLUG}`,
      type: "article",
    });
  }
  return buildMetadata({
    title: study.headline,
    description: study.summary,
    path: `/case-studies/${SLUG}`,
    type: "article",
  });
})();

export default function CaseStudyPage() {
  const study = getCaseStudy(SLUG);
  if (!study) notFound();
  return <CaseStudyTemplate study={study} />;
}
