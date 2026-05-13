// src/components/CookieBanner.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-800/90 backdrop-blur-sm p-4 text-white shadow-lg">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm">
          We use cookies to enhance your browsing experience, serve personalized ads, and analyze traffic. By
          clicking “Accept All,” you consent to our cookies.{" "}
          <Link href="/cookie-policy" className="underline hover:text-[#E8FF5A]">
            Learn more.
          </Link>
        </p>
        <div className="flex gap-2">
          <button
            onClick={acceptCookies}
            className="rounded-full bg-[#E8FF5A] px-4 py-2 text-sm font-bold text-[#080808] transition hover:bg-[#F0FF85]"
          >
            Accept All
          </button>
          <button
            onClick={declineCookies}
            className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
