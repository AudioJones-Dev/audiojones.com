import type { Metadata } from "next";
import Breadcrumbs from "@/components/applied-intelligence/Breadcrumbs";
import DiagnosticThankYouPanel from "@/components/applied-intelligence/DiagnosticThankYouPanel";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Diagnostic received | Applied Intelligence",
    description:
      "Your Applied Intelligence Diagnostic submission has been received. Review the next step, schedule a call, or return to AudioJones.com.",
    path: "/applied-intelligence/diagnostic/thank-you",
  }),
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Applied Intelligence", href: "/applied-intelligence" },
          { name: "Diagnostic", href: "/applied-intelligence/diagnostic" },
          { name: "Received" },
        ]}
      />
      <DiagnosticThankYouPanel />
    </>
  );
}
