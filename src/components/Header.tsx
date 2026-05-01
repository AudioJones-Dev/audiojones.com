"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ButtonLink } from "@/components/ui/Button";

const NAV = [
  { label: "AI", href: "/applied-intelligence" },
  { label: "Frameworks", href: "/frameworks" },
  { label: "Insights", href: "/insights" },
  { label: "Diagnostic", href: "/applied-intelligence/diagnostic" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  // Close on escape; lock scroll while menu is open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 h-20 border-b border-[var(--line-2)] bg-[rgba(5,7,15,0.78)] backdrop-blur-lg"
      role="banner"
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-full max-w-[1280px] items-center justify-between gap-6 px-5 sm:px-8"
      >
        {/* Wordmark */}
        <Link
          href="/"
          className="flex items-center gap-2 t-h4 text-fg-0"
          aria-label="Audio Jones — home"
        >
          <Image
            src="/assets/logos/audiojones-workmark-white.png"
            alt=""
            width={160}
            height={32}
            priority
            className="h-7 w-auto"
          />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="t-small font-medium text-fg-1 transition-colors hover:text-fg-0"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <ButtonLink
            href="/applied-intelligence/diagnostic"
            variant="primary"
            size="md"
          >
            Book Diagnostic
          </ButtonLink>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="primary-nav-mobile"
          className="rounded-md border border-[var(--line-2)] bg-bg-2 px-3 py-2 t-small text-fg-0 md:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div
          id="primary-nav-mobile"
          className="border-t border-[var(--line-2)] bg-bg-0 md:hidden"
        >
          <ul className="mx-auto max-w-[1280px] space-y-1 px-5 py-6 sm:px-8">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-md px-3 py-3 t-body font-medium text-fg-1 hover:bg-bg-2 hover:text-fg-0"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-4">
              <ButtonLink
                href="/applied-intelligence/diagnostic"
                variant="primary"
                size="lg"
                className="w-full"
              >
                Book Diagnostic
              </ButtonLink>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
