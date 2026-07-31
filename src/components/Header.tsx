"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { mainNav, headerCtas } from "@/config/nav";

// Single source of truth for primary nav lives in `src/config/nav.ts`.
// Both Header and Footer import the same `mainNav` constant.
const NAV = mainNav;

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
      className="fixed inset-x-0 top-0 z-50 h-20 border-b border-[var(--border-subtle)] bg-[rgba(8,8,8,0.82)] backdrop-blur-lg"
      role="banner"
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-full max-w-[1280px] items-center justify-between gap-6 px-5 sm:px-8"
      >
        {/* Wordmark — V2 horizontal lockup (signal mark + Syne wordmark) */}
        <Link
          href="/"
          className="flex items-center gap-2 t-h4 text-fg-0"
          aria-label="Audio Jones — home"
        >
          <Image
            src="/assets/logos/audiojones-wordmark-nav.svg"
            alt="Audio Jones"
            width={180}
            height={36}
            priority
            className="h-8 w-auto"
          />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) => (
            <li key={item.href}>
              {item.href.startsWith("http") ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-fg-0 transition-colors hover:text-signal-yellow"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  href={item.href}
                  className="text-sm font-semibold text-fg-0 transition-colors hover:text-signal-yellow"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Desktop CTAs — booking secondary, RI-001 diagnostic primary. */}
        <div className="hidden items-center gap-3 lg:flex">
          <ButtonLink href={headerCtas.bookCall.href} variant="secondary" size="md">
            {headerCtas.bookCall.label}
          </ButtonLink>
          <ButtonLink href={headerCtas.diagnostic.href} variant="glow">
            {headerCtas.diagnostic.label}
          </ButtonLink>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="primary-nav-mobile"
          className="rounded-md border border-[var(--border-subtle)] bg-bg-2 px-3 py-2 t-small text-fg-0 lg:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div
          id="primary-nav-mobile"
          className="border-t border-[var(--border-subtle)] bg-bg-base lg:hidden"
        >
          <ul className="mx-auto max-w-[1280px] space-y-1 px-5 py-6 sm:px-8">
            {NAV.map((item) => (
              <li key={item.href}>
                {item.href.startsWith("http") ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-md px-3 py-3 text-base font-semibold text-fg-0 hover:bg-bg-2 hover:text-signal-yellow"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className="block rounded-md px-3 py-3 text-base font-semibold text-fg-0 hover:bg-bg-2 hover:text-signal-yellow"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
            <li className="flex flex-col gap-3 pt-4">
              <ButtonLink
                href={headerCtas.bookCall.href}
                variant="secondary"
                className="w-full"
              >
                {headerCtas.bookCall.label}
              </ButtonLink>
              <ButtonLink
                href={headerCtas.diagnostic.href}
                variant="glow"
                className="w-full"
              >
                {headerCtas.diagnostic.label}
              </ButtonLink>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
