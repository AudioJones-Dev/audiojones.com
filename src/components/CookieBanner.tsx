// src/components/CookieBanner.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie_consent", "true");
    setShowBanner(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookie_consent", "false");
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div
        className="
          w-full max-w-[720px]
          rounded-[var(--r-card)]
          border border-border-strong
          bg-surface-1/95 backdrop-blur-md
          shadow-[var(--shadow-card),0_10px_40px_-10px_rgba(232,255,90,0.18)]
          px-5 py-4 sm:px-6 sm:py-5
          flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between
          font-body
        "
      >
        <p className="text-[13px] leading-relaxed text-text-primary sm:max-w-[460px]">
          We use cookies to enhance your experience and analyze traffic.{" "}
          <Link
            href="/cookie-policy"
            className="text-signal-yellow underline underline-offset-4 decoration-signal-yellow/40 hover:decoration-signal-yellow transition-colors"
          >
            Learn more
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <Button variant="secondary" size="sm" onClick={declineCookies}>
            Decline
          </Button>
          <Button variant="primary" size="sm" onClick={acceptCookies}>
            Accept all
          </Button>
        </div>
      </div>
    </div>
  );
}
