import type { Metadata } from "next";
import FounderGravityReport from "@/components/founder-gravity-audit/FounderGravityReport";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/schema";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Report | Founder Gravity Audit",
    description:
      "Founder Gravity Audit report view with Gravity Load, segment, fragility zone, and the recommended next move.",
    path: "/founder-gravity-audit/report",
  }),
  robots: {
    index: false,
    follow: false,
  },
};

export default function FounderGravityAuditReportPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Founder Gravity Audit", url: "/founder-gravity-audit" },
          { name: "Report", url: "/founder-gravity-audit/report" },
        ])}
      />
      <FounderGravityReport />
    </>
  );
}
