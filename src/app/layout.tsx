import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ToastProvider } from "@/components/Toast";
import { siteConfig } from "@/lib/site";

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
      { url: "/favicons/favicon.ico" },
      { url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicons/favicon-32x32.png",
    apple: "/favicons/apple-touch-icon.png",
    other: [
      { rel: "manifest", url: "/favicons/site.webmanifest" },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-bg-0 text-fg-1 font-body antialiased">
        <ToastProvider>
          <Header />
          <main className="min-h-screen pt-20">{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
