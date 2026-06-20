import type { Metadata } from "next";
import FounderGravityAuditFlow from "@/components/founder-gravity-audit/FounderGravityAuditFlow";
import JsonLd from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/schema";

export const metadata: Metadata = buildMetadata({
  title: "Diagnostic | Founder Gravity Audit",
  description:
    "Complete the ungated Founder Gravity Audit diagnostic and reveal your Gravity Load preview before requesting the full report.",
  path: "/founder-gravity-audit/diagnostic",
});

export default function FounderGravityAuditDiagnosticPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Founder Gravity Audit", url: "/founder-gravity-audit" },
          { name: "Diagnostic", url: "/founder-gravity-audit/diagnostic" },
        ])}
      />
      <FounderGravityAuditFlow />
    </>
  );
}
