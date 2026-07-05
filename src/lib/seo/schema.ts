// Schema.org JSON-LD builders for Founder Intelligence pages.
// Keep all entity facts here so they stay consistent across routes.

import { aiEntity, SITE_URL } from "@/lib/founder-intelligence/tokens";

export type BreadcrumbItem = { name: string; url: string };
export type FaqItem = { question: string; answer: string };

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: aiEntity.brandName,
    legalName: aiEntity.legalName,
    url: SITE_URL,
    logo: `${SITE_URL}/assets/og/audio-jones-logo.png`,
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
      : `${SITE_URL}/assets/og/audio-jones-og.jpg`,
    author: {
      "@type": "Person",
      name: aiEntity.name,
    },
    publisher: {
      "@type": "Organization",
      name: aiEntity.brandName,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/assets/og/audio-jones-logo.png`,
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
      name: "Audio Jones Founder Intelligence Glossary",
      url: `${SITE_URL}/frameworks`,
    },
  } as const;
}

export function serviceJsonLd(args: {
  name: string;
  description: string;
  url: string;
  serviceType?: string;
  audience?: string;
  offers?: {
    price: string;
    priceCurrency: string;
    url?: string;
    description?: string;
  };
}) {
  const url = args.url.startsWith("http") ? args.url : `${SITE_URL}${args.url}`;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: args.name,
    description: args.description,
    url,
    serviceType: args.serviceType,
    provider: {
      "@type": "Organization",
      name: aiEntity.brandName,
      url: SITE_URL,
    },
    audience: args.audience
      ? {
          "@type": "BusinessAudience",
          name: args.audience,
        }
      : undefined,
    offers: args.offers
      ? {
          "@type": "Offer",
          price: args.offers.price,
          priceCurrency: args.offers.priceCurrency,
          url: args.offers.url
            ? args.offers.url.startsWith("http")
              ? args.offers.url
              : `${SITE_URL}${args.offers.url}`
            : url,
          description: args.offers.description,
          availability: "https://schema.org/InStock",
        }
      : undefined,
  } as const;
}

export function speakableSpec(cssSelectors: string[]) {
  return {
    "@type": "SpeakableSpecification",
    cssSelector: cssSelectors,
  } as const;
}
