import type { Metadata } from "next";
import { SITE_URL } from "@/lib/founder-intelligence/tokens";

export type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  type?: "website" | "article";
};

export function buildMetadata({
  title,
  description,
  path,
  ogImage,
  type = "website",
}: PageMetaInput): Metadata {
  const url = path.startsWith("http") ? path : `${SITE_URL}${path}`;
  const image = ogImage
    ? ogImage.startsWith("http")
      ? ogImage
      : `${SITE_URL}${ogImage}`
    : `${SITE_URL}/assets/og/audio-jones-og.jpg`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type,
      siteName: "Audio Jones",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
