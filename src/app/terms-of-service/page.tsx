// src/app/terms-of-service/page.tsx
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  description:
    "The terms governing use of audiojones.com and AJ Digital LLC services: scope, payments, cancellations, intellectual property, and liability.",
  path: "/terms-of-service",
});

export default function TermsOfServicePage() {
  const lastUpdated = "October 29, 2025";

  return (
    <main className="min-h-screen bg-[#111] text-white">
      <section className="mx-auto max-w-4xl px-6 py-20">
        <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">Terms of Service</h1>
        <p className="mt-4 text-lg text-white/75">Last Updated: {lastUpdated}</p>

        <div className="prose prose-invert mt-8 max-w-none">
          <p>
            Welcome to Audio Jones, operated by AJ Digital LLC (“Company”). By using our website or services,
            you agree to these terms.
          </p>

          <h2>1. Services Provided</h2>
          <p>
            AI-driven marketing, automation systems, branding, SEO, and podcast studio sessions inside
            Circle House Studios.
          </p>

          <h2>2. Client Responsibilities</h2>
          <p>
            Provide accurate information, timely approvals, and safe conduct during in-studio sessions.
          </p>

          <h2>3. Payments</h2>
          <p>
            Invoices due upon receipt unless otherwise stated. Late payments may incur 5% monthly fee. All
            prices USD + applicable taxes.
          </p>

          <h2>4. Cancellations & Refunds</h2>
          <p>
            See our <a href="/cancellation-policy">Cancellation Policy</a>.
          </p>

          <h2>5. Studio Use & Safety</h2>
          <p>Follow posted safety rules; clients liable for damage caused by negligence.</p>

          <h2>6. Intellectual Property</h2>
          <p>
            All creative materials remain property of AJ Digital LLC until invoice paid in full. AI-generated
            outputs licensed for client use only.
          </p>

          <h2>7. Confidentiality</h2>
          <p>Both parties agree to protect confidential information.</p>

          <h2>8. Limitation of Liability</h2>
          <p>We are not liable for indirect, incidental, or consequential losses.</p>

          <h2>9. Indemnification</h2>
          <p>
            Client agrees to hold harmless AJ Digital LLC and its affiliates from claims arising from misuse
            of services or content.
          </p>

          <h2>10. Dispute Resolution</h2>
          <p>Governing law = Florida; venue = Miami-Dade County courts.</p>

          <p>
            By using this site or our services, you acknowledge and agree to these Terms of Service.
          </p>
        </div>
      </section>
    </main>
  );
}
