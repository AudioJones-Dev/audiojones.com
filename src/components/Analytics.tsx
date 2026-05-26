/**
 * Analytics.tsx — Consent-gated Google Analytics 4 + Meta Pixel.
 *
 * Loads tracking scripts only after the user accepts cookies in CookieBanner.
 * If env vars are missing, components silently render nothing (safe in dev).
 *
 * Existing components in the codebase already call `window.gtag('event', …)`
 * (ServiceTile, ComingSoonCard, EpmHero) — those calls become live once GA
 * boots here. Until then they are silent no-ops.
 *
 * Route-change tracking: Next.js App Router uses client-side navigation,
 * which doesn't trigger a full reload. The RouteChangeTracker component
 * hooks into `usePathname` to fire pageview events on navigation.
 */

"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useConsent } from "@/lib/consent";

// ---------------------------------------------------------------------------
// Window type augmentation — silences TS errors in existing event calls.
// ---------------------------------------------------------------------------
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & { callMethod?: unknown };
  }
}

// ---------------------------------------------------------------------------
// Google Analytics 4
// ---------------------------------------------------------------------------

function GoogleAnalyticsScripts({ gaId }: { gaId: string }) {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            send_page_view: true,
            anonymize_ip: true
          });
        `}
      </Script>
    </>
  );
}

/**
 * Tracks SPA navigation as gtag pageview events.
 * Wrapped in Suspense at the parent because useSearchParams suspends.
 */
function GoogleAnalyticsRouteTracker({ gaId }: { gaId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined" || !window.gtag) return;
    const url =
      pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    window.gtag("config", gaId, { page_path: url });
  }, [gaId, pathname, searchParams]);

  return null;
}

export function GoogleAnalytics() {
  const consent = useConsent();
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  if (!gaId || !consent) return null;

  return (
    <>
      <GoogleAnalyticsScripts gaId={gaId} />
      <Suspense fallback={null}>
        <GoogleAnalyticsRouteTracker gaId={gaId} />
      </Suspense>
    </>
  );
}

// ---------------------------------------------------------------------------
// Meta Pixel
// ---------------------------------------------------------------------------

function MetaPixelScripts({ pixelId }: { pixelId: string }) {
  return (
    <>
      <Script id="meta-pixel-init" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${pixelId}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}

function MetaPixelRouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined" || !window.fbq) return;
    // Pass current path so Pixel attribution reflects SPA navigation.
    window.fbq("track", "PageView");
    // pathname and searchParams included to retrigger on navigation
    void pathname;
    void searchParams;
  }, [pathname, searchParams]);

  return null;
}

export function MetaPixel() {
  const consent = useConsent();
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  if (!pixelId || !consent) return null;

  return (
    <>
      <MetaPixelScripts pixelId={pixelId} />
      <Suspense fallback={null}>
        <MetaPixelRouteTracker />
      </Suspense>
    </>
  );
}
