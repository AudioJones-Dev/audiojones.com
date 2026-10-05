import type { Metadata } from "next";
import HeroAllSignal from "@/components/home/landing/HeroAllSignal";
import HomepageSystems from "@/components/home/landing/HomepageSystems";
import JsonLd from "@/components/seo/JsonLd";
import { organizationJsonLd, personJsonLd, webSiteJsonLd } from "@/lib/seo/schema";
import { siteConfig } from "@/lib/site";

const description =
  "Business systems consulting for founder-led service businesses. Audio Jones maps how work actually happens, identifies operating breakdowns, and implements the system the evidence supports.";

export const metadata: Metadata = {
  title: "Business Systems Consulting for Founder-Led Service Businesses",
  description,
  alternates: { canonical: `${siteConfig.url}/` },
  openGraph: {
    title: "Audio Jones — Business Systems Consulting",
    description,
    url: `${siteConfig.url}/`,
    siteName: "Audio Jones",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Audio Jones — Business Systems Consulting", description },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={personJsonLd()} />
      <JsonLd data={webSiteJsonLd()} />
      <HeroAllSignal />
      <HomepageSystems />
    </>
  );
}
