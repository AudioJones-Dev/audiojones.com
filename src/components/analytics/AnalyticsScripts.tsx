"use client";

// Consent-gated analytics loader.
//
// Loads Google Tag Manager (NEXT_PUBLIC_GTM_ID) and/or GA4 (NEXT_PUBLIC_GA_ID)
// only after the visitor has accepted cookies. GTM is preferred: one container
// lets marketing add GA4, the Meta pixel, and Google Ads conversion tags
// without further code changes. Both ids are optional — with neither set this
// renders nothing, so the site ships analytics-ready but inert until configured.

import Script from "next/script";
import { useEffect, useState } from "react";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

function hasConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem("cookie_consent") === "true";
  } catch {
    return false;
  }
}

export default function AnalyticsScripts() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    setConsented(hasConsent());
    const update = () => setConsented(hasConsent());
    window.addEventListener("aj:consent-changed", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("aj:consent-changed", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  if (!consented) return null;
  if (!GTM_ID && !GA_ID) return null;

  return (
    <>
      {GTM_ID && (
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
      )}

      {GA_ID && (
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
      )}
    </>
  );
}
