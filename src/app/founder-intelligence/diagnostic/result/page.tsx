import type { Metadata } from "next";
import Breadcrumbs from "@/components/founder-intelligence/Breadcrumbs";
import DiagnosticResult from "@/components/founder-intelligence/DiagnosticResult";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Assessment Result | Founder Intelligence",
    description:
      "Your Founder Intelligence Assessment result, score dimensions, and recommended next step.",
    path: "/founder-intelligence/diagnostic/result",
  }),
  robots: { index: false, follow: false },
};

export default function FounderIntelligenceDiagnosticResultPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Founder Intelligence", href: "/founder-intelligence" },
          { name: "Diagnostic", href: "/founder-intelligence/diagnostic" },
          { name: "Result" },
        ]}
      />
      <DiagnosticResult />
    </>
  );
}

