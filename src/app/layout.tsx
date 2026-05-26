import type { Metadata } from "next";
import { Syne, DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ToastProvider } from "@/components/Toast";
import { GoogleAnalytics, MetaPixel } from "@/components/Analytics";
import JsonLd from "@/components/seo/JsonLd";
import { localBusinessJsonLd } from "@/lib/seo/schema";
import { siteConfig } from "@/lib/site";

// Brand 2.0 typography (§03) — Syne for display/headers,
// DM Sans for body, DM Mono for labels/data/badges. CSS variables
// are wired to the corresponding --font-* tokens in globals.css.
const syne = Syne({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});
const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Audio Jones — Applied Intelligence Systems",
    template: "%s | Audio Jones",
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: "Audio Jones — Applied Intelligence Systems",
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Audio Jones — Applied Intelligence Systems",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Audio Jones — Applied Intelligence Systems",
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
    other: [
      { rel: "manifest", url: "/site.webmanifest" },
    ],
  },
  appleWebApp: {
    title: "Audio Jones",
    capable: true,
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable} ${dmMono.variable}`}
    >
      <body className="bg-bg-base text-text-primary font-body antialiased">
        {/* Site-wide LocalBusiness schema for local-pack ranking + GBP entity
            association. NAP must stay byte-identical to GBP + citations. */}
        <JsonLd data={localBusinessJsonLd()} />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-bg-2 focus:px-4 focus:py-2 focus:text-fg-0 focus:outline focus:outline-2 focus:outline-[var(--aj-orange)]"
        >
          Skip to main content
        </a>
        <ToastProvider>
          <Header />
          <main id="main-content" className="min-h-screen pt-20">
            {children}
          </main>
          <Footer />
          <CookieBanner />
        </ToastProvider>
        {/* Consent-gated tracking — render nothing until user accepts cookies
            AND the matching env var is set. See src/components/Analytics.tsx. */}
        <GoogleAnalytics />
        <MetaPixel />
      </body>
    </html>
  );
}
