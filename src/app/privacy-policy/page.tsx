// src/app/privacy-policy/page.tsx
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "How AJ Digital LLC (Audio Jones) collects, uses, retains, and shares personal information, plus your rights and contact options.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
    const lastUpdated = "October 29, 2025";

    return (
      <main className="min-h-screen bg-[#111] text-white">
        <section className="mx-auto max-w-4xl px-6 py-20">
          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">Privacy Policy</h1>
          <p className="mt-4 text-lg text-white/75">Last Updated: {lastUpdated}</p>

          <div className="prose prose-invert mt-8 max-w-none">
            <p>
              Audio Jones, a division of AJ Digital LLC (“we,” “our,” “us”), operates this website and related
              services from inside Circle House Studios in Miami, Florida. This Privacy Policy explains how we
              collect, use, and protect personal information.
            </p>

            <h2>1. Information We Collect</h2>
            <ul>
              <li>Contact data (name, email, phone) submitted via forms.</li>
              <li>Billing data for services (processed via secure third parties).</li>
              <li>Usage data (IP address, device, browser, analytics cookies).</li>
              <li>Media uploads (optional for clients sharing content).</li>
            </ul>

            <h2>2. How We Use Data</h2>
            <p>
              To deliver services, communicate with clients, analyze site traffic, and improve marketing
              performance.
            </p>

            <h2>3. Data Sharing</h2>
            <p>
              Shared only with trusted vendors (Payment Processors, Google Analytics, Meta Business Suite,
              MailerLite). No sale of personal data.
            </p>

            <h2>4. Retention & Security</h2>
            <p>Stored in encrypted systems; retained only as necessary for business or legal purposes.</p>

            <h2>5. Your Rights</h2>
            <p>
              Request access, correction, or deletion of personal data by emailing{" "}
              <a href="mailto:contact@audiojones.com">contact@audiojones.com</a>.
            </p>

            <h2>6. Cookies & Tracking</h2>
            <p>
              We use functional and analytics cookies — see our <a href="/cookie-policy">Cookie Policy</a>.
            </p>

            <h2>7. Children’s Data</h2>
            <p>We do not intentionally collect data from children under 13 (COPPA).</p>

            <h2>8. Changes</h2>
            <p>We may update this policy periodically and post the revision date.</p>

            <h2>9. Governing Law</h2>
            <p>State of Florida, United States.</p>

            <p>
              For questions: <a href="mailto:contact@audiojones.com">contact@audiojones.com</a> |{" "}
              <a href="tel:+17866452250">+1 (786) 645-2250</a>
            </p>
          </div>
        </section>
      </main>
    );
  }
