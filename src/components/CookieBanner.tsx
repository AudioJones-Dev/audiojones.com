// src/components/CookieBanner.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { CONSENT_KEY, setConsent } from "@/lib/consent";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(() => {
    if (typeof window === "undefined") return false;
    return !window.localStorage.getItem(CONSENT_KEY);
  });

  const acceptCookies = () => {
    setConsent(true);
    setShowBanner(false);
  };

  const declineCookies = () => {
    setConsent(false);
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--border-strong)] bg-[rgba(8,8,8,0.96)] p-4 text-[var(--text-primary)] shadow-[0_-16px_48px_rgba(0,0,0,0.45)]">
      <div className="mx-auto flex max-w-[1180px] flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <p className="max-w-[82ch] text-sm leading-6 text-[var(--text-secondary)]">
          We use cookies to enhance your browsing experience, serve personalized ads, and analyze traffic. By
          clicking “Accept All,” you consent to our cookies.{" "}
          <Link href="/cookie-policy" className="text-[var(--text-primary)] underline decoration-[var(--border-strong)] underline-offset-4 transition hover:text-[var(--signal-yellow)] hover:decoration-[var(--signal-yellow)]">
            Learn more.
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={acceptCookies}
            className="rounded-[4px] border border-[var(--signal-yellow)] bg-[var(--signal-yellow)] px-4 py-2 text-sm font-bold text-[var(--bg-base)] shadow-[0_0_28px_rgba(232,255,90,0.22)] transition hover:bg-[var(--signal-soft)]"
          >
            Accept All
          </button>
          <button
            onClick={declineCookies}
            className="rounded-[4px] border border-[var(--border-strong)] bg-transparent px-4 py-2 text-sm font-semibold text-[var(--text-primary)] transition hover:border-[var(--accent-blue)] hover:text-[var(--accent-blue)]"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
