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
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border-subtle bg-surface-1/95 backdrop-blur-sm p-4 text-text-primary shadow-lg">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 md:flex-row">
        <p className="w-full text-center text-sm text-text-muted md:w-auto md:max-w-2xl md:text-left">
          We use cookies to enhance your browsing experience, serve personalized ads, and analyze traffic. By
          clicking “Accept All,” you consent to our cookies.{" "}
          <Link href="/cookie-policy" className="underline hover:text-signal-yellow">
            Learn more.
          </Link>
        </p>
        <div className="flex gap-2">
          <Button variant="primary" size="md" onClick={acceptCookies}>
            Accept All
          </Button>
          <Button variant="secondary" size="md" onClick={declineCookies}>
            Decline
          </Button>
        </div>
      </div>
    </div>
  );
}
