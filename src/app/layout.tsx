import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ToastProvider } from "@/components/Toast";
import { siteConfig } from "@/lib/site";

// Typography is served from /public/fonts so builds do not depend on
// Google Fonts availability in CI or local development.
const sora = localFont({
  src: [
    { path: "../../public/fonts/Sora-Medium.ttf", weight: "500" },
    { path: "../../public/fonts/Sora-SemiBold.ttf", weight: "600" },
    { path: "../../public/fonts/Sora-Bold.ttf", weight: "700" },
  ],
  variable: "--font-syne",
  display: "swap",
});
const inter = localFont({
  src: [
    { path: "../../public/fonts/Inter-Regular.ttf", weight: "400" },
    { path: "../../public/fonts/Inter-Medium.ttf", weight: "500" },
    { path: "../../public/fonts/Inter-SemiBold.ttf", weight: "600" },
    { path: "../../public/fonts/Inter-Bold.ttf", weight: "700" },
  ],
  variable: "--font-dm-sans",
  display: "swap",
});
const spaceGrotesk = localFont({
  src: [
    { path: "../../public/fonts/SpaceGrotesk-Regular.ttf", weight: "400" },
    { path: "../../public/fonts/SpaceGrotesk-Medium.ttf", weight: "500" },
    { path: "../../public/fonts/SpaceGrotesk-SemiBold.ttf", weight: "600" },
    { path: "../../public/fonts/SpaceGrotesk-Bold.ttf", weight: "700" },
  ],
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
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
    other: [
      { rel: "manifest", url: "/site.webmanifest" },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${inter.variable} ${spaceGrotesk.variable}`}
    >
      <body className="bg-bg-base text-text-primary font-body antialiased">
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
      </body>
    </html>
  );
}
