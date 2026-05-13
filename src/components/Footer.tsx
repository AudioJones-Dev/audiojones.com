import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Hash,
  Instagram,
  Linkedin,
  Music2,
  Twitter,
  Youtube,
} from "lucide-react";
import NewsletterForm from "@/components/newsletter/NewsletterForm";
import { socialLinks } from "@/config/links";
import { mainNav } from "@/config/nav";

// Primary nav imported from canonical source — same array Header consumes.
const PRIMARY_NAV = mainNav;

const LEGAL_NAV = [
  { label: "Privacy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms-of-service" },
  { label: "Cookies", href: "/cookie-policy" },
];

const SOCIAL = [
  {
    label: "LinkedIn",
    href: socialLinks.linkedin,
    icon: Linkedin,
    hoverClass: "hover:bg-[#0072b1]",
  },
  {
    label: "YouTube",
    href: socialLinks.youtube,
    icon: Youtube,
    hoverClass: "hover:bg-[#ff0000]",
  },
  {
    label: "Facebook",
    href: socialLinks.facebook,
    icon: Facebook,
    hoverClass: "hover:bg-[#1877f2]",
  },
  {
    label: "Instagram",
    href: socialLinks.instagram,
    icon: Instagram,
    hoverClass: "hover:bg-[#d62976]",
  },
  {
    label: "X",
    href: socialLinks.twitter,
    icon: Twitter,
    hoverClass: "hover:bg-[#00acee]",
  },
  {
    label: "Threads",
    href: socialLinks.threads,
    icon: Hash,
    hoverClass: "hover:bg-[#101010]",
  },
  {
    label: "TikTok",
    href: socialLinks.tiktok,
    icon: Music2,
    hoverClass: "hover:bg-[#ff0050]",
  },
];

export default function Footer() {
  return (
    <footer
      role="contentinfo"
      className="border-t border-[var(--line-2)] bg-bg-0"
    >
      <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Brand block */}
          <div className="lg:col-span-5">
            <Link
              href="/"
              className="inline-flex items-center"
              aria-label="Audio Jones — home"
            >
              <Image
                src="/assets/logos/audio-jones-signal-logo-white-nav.png"
                alt=""
                width={160}
                height={32}
                className="h-7 w-auto"
              />
            </Link>
            <p className="mt-6 max-w-md t-lead text-fg-1">
              Applied Intelligence Systems for founder-led businesses.
            </p>
            <p className="mt-3 max-w-md t-small text-fg-3">
              Audio Jones is the operating brand of AJ Digital LLC. Founder-led businesses, $250K–$5M.
            </p>
          </div>

          {/* Site nav */}
          <div className="lg:col-span-3">
            <h3 className="t-label text-aj-gold">Site</h3>
            <ul className="mt-5 space-y-3">
              {PRIMARY_NAV.map((item) => (
                <li key={item.href}>
                  {item.href.startsWith("http") ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="t-body text-fg-1 transition-colors hover:text-fg-0"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className="t-body text-fg-1 transition-colors hover:text-fg-0"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="lg:col-span-2">
            <h3 className="t-label text-aj-gold">Connect</h3>
            <div
              className="mt-5 flex w-fit flex-wrap items-center justify-center gap-3 rounded-[var(--r-card)] border border-[rgba(200,169,106,0.2)] bg-[rgba(238,238,238,0.06)] p-4 shadow-[0_0_20px_rgba(0,0,0,0.18)] backdrop-blur-sm"
              aria-label="Audio Jones social links"
            >
              {SOCIAL.map(({ label, href, icon: Icon, hoverClass }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Follow Audio Jones on ${label}`}
                  title={label}
                  className={`group flex h-[52px] w-[52px] items-center justify-center overflow-hidden rounded-[14px] bg-[#2c2c2c] text-white ring-1 ring-white/10 transition duration-300 hover:shadow-[0_0_24px_rgba(200,169,106,0.18)] active:scale-90 ${hoverClass}`}
                >
                  <Icon
                    aria-hidden="true"
                    className="h-[19px] w-[19px] transition-transform duration-300 group-hover:animate-[slide-in-top_0.3s_both]"
                    strokeWidth={2.4}
                  />
                  <span className="sr-only">{label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div className="lg:col-span-2">
            <h3 className="t-label text-aj-gold">Legal</h3>
            <ul className="mt-5 space-y-3">
              {LEGAL_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="t-body text-fg-1 transition-colors hover:text-fg-0"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/sitemap.xml"
                  className="t-small text-fg-3 transition-colors hover:text-fg-0"
                >
                  Site map
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* ── Newsletter row — compact inline variant ──
            Suspense required because <NewsletterForm> uses
            useSearchParams() (App Router constraint). */}
        <div className="mt-12 grid grid-cols-1 gap-4 border-t border-[var(--line-2)] pt-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <h3 className="t-label text-aj-gold">Subscribe</h3>
            <p className="mt-3 t-small text-fg-2">
              The next signal in your inbox. Direct, framework-driven, no nurture drip.
            </p>
          </div>
          <div className="lg:col-span-7">
            <Suspense fallback={<FooterNewsletterSkeleton />}>
              <NewsletterForm
                variant="inline"
                source="footer"
                showPendingNotice={false}
              />
            </Suspense>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-[var(--line-2)] pt-8 sm:flex-row sm:items-center">
          <p className="t-small text-fg-3">
            © {new Date().getFullYear()} AJ Digital LLC · Audio Jones · All rights reserved.
          </p>
          <p className="t-small text-fg-3 max-w-xl">
            Audio Jones provides strategic, creative, and systems consulting for
            informational and educational purposes. No specific financial, ranking,
            or operational result is guaranteed.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterNewsletterSkeleton() {
  return (
    <div aria-hidden className="flex flex-col gap-2 opacity-50 sm:flex-row">
      <div className="h-11 flex-1 rounded-md bg-bg-2" />
      <div className="h-11 w-full rounded-md bg-bg-2 sm:w-32" />
    </div>
  );
}
