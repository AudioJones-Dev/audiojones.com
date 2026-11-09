"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

export const COOKIE_CONSENT_EVENT = "cookie-consent-change";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// GA4 loads only after the visitor accepts cookies in <CookieBanner>.
// Page views on client-side navigation come from GA4 enhanced measurement
// ("page changes based on browser history events"), so no router hook.
export default function GoogleAnalytics() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    const read = () => {
      let granted = false;
      try {
        granted = localStorage.getItem("cookie_consent") === "true";
      } catch {
        granted = false;
      }
      // Google's documented opt-out flag: stops an already-loaded tag from
      // sending hits if consent is withdrawn (removing <Script> does not).
      if (GA_ID) {
        (window as unknown as Record<string, unknown>)[`ga-disable-${GA_ID}`] = !granted;
      }
      setConsented(granted);
    };
    // Consent can also change in another tab; same-tab changes use the event.
    const onStorage = (e: StorageEvent) => {
      if (e.key === null || e.key === "cookie_consent") read();
    };
    read();
    window.addEventListener(COOKIE_CONSENT_EVENT, read);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(COOKIE_CONSENT_EVENT, read);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  if (!GA_ID || !consented) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}');`}
      </Script>
    </>
  );
}
