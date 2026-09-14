"use client";

// Consent-gated analytics loader.
//
// Loads Google Tag Manager (NEXT_PUBLIC_GTM_ID), or GA4 (NEXT_PUBLIC_GA_ID) as
// a fallback when no container is configured, only after the visitor accepts
// cookies and never on portal/admin surfaces. GTM is preferred: one container
// lets marketing add GA4, the Meta pixel, and Google Ads conversion tags
// without further code changes, and loading GA directly alongside a container
// that already carries it would double-count page views. With neither id set
// this renders nothing, so the site ships analytics-ready but inert.
//
// Withdrawing consent stops further event dispatch (see events.ts) and
// unmounts these tags, but a container that has already executed cannot be
// unloaded from a running page without a reload — that is a limitation of
// GTM itself, not something this component can reverse.

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CONSENT_EVENT,
  hasAnalyticsConsent,
  isAnalyticsExcludedPath,
} from "@/lib/analytics/consent";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function AnalyticsScripts() {
  const pathname = usePathname();
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    setConsented(hasAnalyticsConsent());
    const update = () => setConsented(hasAnalyticsConsent());
    window.addEventListener(CONSENT_EVENT, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(CONSENT_EVENT, update);
      window.removeEventListener("storage", update);
    };
  }, []);

  if (isAnalyticsExcludedPath(pathname)) return null;
  if (!consented) return null;

  if (GTM_ID) {
    return (
      <>
        <Script id="gtm-init" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="gtm"
          />
        </noscript>
      </>
    );
  }

  if (GA_ID) {
    return (
      <>
        <Script
          id="ga4-src"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=window.gtag||gtag;gtag('js',new Date());gtag('config','${GA_ID}');`}
        </Script>
      </>
    );
  }

  return null;
}
