// Schema.org JSON-LD builders for Applied Intelligence pages.
// Keep all entity facts here so they stay consistent across routes.

import { aiEntity, aiLocalBusiness, SITE_URL } from "@/lib/applied-intelligence/tokens";

export type BreadcrumbItem = { name: string; url: string };
export type FaqItem = { question: string; answer: string };

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: aiEntity.brandName,
    legalName: aiEntity.legalName,
    url: SITE_URL,
    logo: `${SITE_URL}/assets/logos/audiojones-workmark-white.png`,
    sameAs: aiEntity.sameAs,
    founder: {
      "@type": "Person",
      name: aiEntity.name,
    },
  } as const;
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: aiEntity.name,
    alternateName: aiEntity.legalName,
    jobTitle: aiEntity.title,
    description: aiEntity.description,
    url: SITE_URL,
    sameAs: aiEntity.sameAs,
    knowsAbout: aiEntity.knowsAbout,
    worksFor: {
      "@type": "Organization",
      name: aiEntity.brandName,
    },
  } as const;
}

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: aiEntity.brandName,
    url: SITE_URL,
    publisher: {
      "@type": "Organization",
      name: aiEntity.brandName,
    },
  } as const;
}

export function breadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  } as const;
}

export function faqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  } as const;
}

export function articleJsonLd(args: {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  image?: string;
}) {
  const datePublished = args.datePublished || new Date().toISOString();
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: args.title,
    description: args.description,
    mainEntityOfPage: args.url.startsWith("http")
      ? args.url
      : `${SITE_URL}${args.url}`,
    datePublished,
    dateModified: args.dateModified || datePublished,
    image: args.image
      ? args.image.startsWith("http")
        ? args.image
        : `${SITE_URL}${args.image}`
      : `${SITE_URL}/og`,
    author: {
      "@type": "Person",
      name: aiEntity.name,
    },
    publisher: {
      "@type": "Organization",
      name: aiEntity.brandName,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/assets/logos/audiojones-workmark-white.png`,
      },
    },
  } as const;
}

export function definedTermJsonLd(args: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: args.name,
    description: args.description,
    url: args.url.startsWith("http") ? args.url : `${SITE_URL}${args.url}`,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "Audio Jones Applied Intelligence Glossary",
      url: `${SITE_URL}/frameworks`,
    },
  } as const;
}

export function speakableSpec(cssSelectors: string[]) {
  return {
    "@type": "SpeakableSpecification",
    cssSelector: cssSelectors,
  } as const;
}

/**
 * Service schema for localized landing pages — references the canonical
 * LocalBusiness via `provider.@id` so the entity graph stays connected.
 *
 * Use one per city landing page. `areaServed` should be a single city
 * (not an array) so Google can rank the page geographically.
 */
export function serviceJsonLd(args: {
  name: string;
  description: string;
  url: string;
  areaServedCity: string;
  serviceType?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: args.name,
    description: args.description,
    url: args.url.startsWith("http") ? args.url : `${SITE_URL}${args.url}`,
    serviceType: args.serviceType ?? [
      "AI Consulting",
      "Marketing Automation",
      "Founder Intelligence Systems",
    ],
    provider: {
      "@id": `${SITE_URL}/#localbusiness`,
    },
    areaServed: {
      "@type": "City",
      name: args.areaServedCity,
      containedInPlace: { "@type": "State", name: "Florida" },
    },
  } as const;
}

/**
 * LocalBusiness / ProfessionalService schema for site-wide local SEO.
 *
 * Uses `ProfessionalService` (a LocalBusiness subtype) for sharper category
 * matching with the GBP primary category "Marketing Consultant".
 *
 * Mount once in app/layout.tsx (not per-page) so every URL inherits the
 * local-business entity. The @id anchors it as the canonical local-business
 * node referenced by other schemas via { "@id": ".../#localbusiness" }.
 *
 * NAP (Name + Address + Phone) MUST stay byte-for-byte identical here, on
 * the GBP listing, and in any third-party citations (Yelp, Apple Business
 * Connect, Bing Places). Any drift dilutes local-pack ranking signal.
 */
export function localBusinessJsonLd() {
  const id = `${SITE_URL}/#localbusiness`;
  const logoUrl = `${SITE_URL}/web-app-manifest-512x512.png`;

  return {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "LocalBusiness"],
    "@id": id,
    name: aiLocalBusiness.brandName,
    legalName: aiLocalBusiness.legalEntity,
    description:
      "Audio Jones helps founder-led service businesses turn operational chaos into measurable clarity. AI consulting, marketing automation, attribution, podcast production, and Founder Intelligence Systems implementation for South Florida and Southwest Florida markets.",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: logoUrl,
      width: 512,
      height: 512,
    },
    image: logoUrl,
    telephone: aiLocalBusiness.telephone,
    email: aiLocalBusiness.email,
    priceRange: aiLocalBusiness.priceRange,
    address: {
      "@type": "PostalAddress",
      streetAddress: aiLocalBusiness.address.streetAddress,
      addressLocality: aiLocalBusiness.address.addressLocality,
      addressRegion: aiLocalBusiness.address.addressRegion,
      postalCode: aiLocalBusiness.address.postalCode,
      addressCountry: aiLocalBusiness.address.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: aiLocalBusiness.geo.latitude,
      longitude: aiLocalBusiness.geo.longitude,
    },
    areaServed: aiLocalBusiness.areaServed.map((area) => ({
      "@type": area.type,
      name: area.name,
      containedInPlace: {
        "@type": "State",
        name: "Florida",
      },
    })),
    openingHoursSpecification: aiLocalBusiness.openingHours.map((spec) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
      // Mirror the GBP justification — AI receptionist provides 24/7 reach.
      description: spec,
    })),
    sameAs: [
      "https://www.audiojones.com",
      "https://www.linkedin.com/in/audiojones",
      "https://www.instagram.com/audiojones/",
      "https://www.youtube.com/@audiojones",
      "https://x.com/AudioJones",
      "https://www.facebook.com/AudioJonesTheAIConsultant",
    ],
    knowsAbout: aiLocalBusiness.knowsAbout,
    founder: {
      "@type": "Person",
      name: aiLocalBusiness.founder,
      jobTitle: aiEntity.title,
      worksFor: {
        "@type": "Organization",
        name: aiLocalBusiness.legalEntity,
      },
    },
    parentOrganization: {
      "@type": "Organization",
      name: aiLocalBusiness.legalEntity,
    },
    /**
     * Service catalog mirrors the GBP services list. Each item links back
     * to the canonical service or booking page so the schema closes the
     * loop with the actual conversion endpoints.
     */
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Audio Jones — Applied Intelligence Services",
      itemListElement: aiLocalBusiness.knowsAbout.slice(1).map((serviceName) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: serviceName,
          provider: { "@id": id },
        },
      })),
    },
  } as const;
}
