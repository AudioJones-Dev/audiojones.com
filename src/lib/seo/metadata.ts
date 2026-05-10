import type { Metadata } from "next";
import { SITE_URL } from "@/lib/applied-intelligence/tokens";

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

  // Root layout sets `metadata.title.template = "%s | Audio Jones"` which
  // appends the site name to the head <title>. OpenGraph and Twitter titles
  // are not templated by Next, so we append the site name here for those.
  const socialTitle = `${title} | Audio Jones`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: socialTitle,
      description,
      url,
      type,
      siteName: "Audio Jones",
      images: [{ url: image, width: 1200, height: 630, alt: socialTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [image],
    },
  };
}
