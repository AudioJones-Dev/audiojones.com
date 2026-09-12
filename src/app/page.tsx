import type { Metadata } from "next";
import {
  HeroAllSignal,
  HomeFaqSection,
  DiagnosticCTA,
} from "@/components/home/landing";
import HomepageSystems from "@/components/home/landing/HomepageSystems";
import JsonLd from "@/components/seo/JsonLd";
import {
  organizationJsonLd,
  personJsonLd,
  webSiteJsonLd,
} from "@/lib/seo/schema";
import { siteConfig } from "@/lib/site";

const title = "Business Systems Consulting for Service Businesses | Audio Jones";
const description =
  "Find what costs your service business time and sales. Audio Jones helps fix follow-up, workflows, and reporting with a clear plan before you build.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: `${siteConfig.url}/` },
  openGraph: { title, description, url: `${siteConfig.url}/`, siteName: "Audio Jones", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={personJsonLd()} />
      <JsonLd data={webSiteJsonLd()} />

      <HeroAllSignal />
      <HomepageSystems />

      <HomeFaqSection />

      <DiagnosticCTA />
    </>
  );
}
