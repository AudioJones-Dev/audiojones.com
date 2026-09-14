"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ButtonLink } from "@/components/ui/Button";
import NavDropdown, { NavAccordion } from "@/components/nav/NavDropdown";
import { mainNav, headerCtas } from "@/config/nav";

// Single source of truth for primary nav lives in `src/config/nav.ts`.
// Both Header and Footer import the same `mainNav` constant. Items with
// `children` (derived from the journey registry) render a dropdown on desktop
// and an accordion in the mobile drawer; the parent stays a direct link.
const NAV = mainNav;

const DESKTOP_LINK =
  "text-sm font-semibold text-fg-0 transition-colors hover:text-signal-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-yellow rounded-[4px] aria-[current=page]:text-signal-yellow data-[active]:text-signal-yellow";
const MOBILE_LINK =
  "block min-h-11 rounded-md px-3 py-3 text-base font-semibold text-fg-0 hover:bg-bg-2 hover:text-signal-yellow aria-[current=page]:text-signal-yellow";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() ?? "/";
  const isActive = (href: string) => pathname === href;

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
          {NAV.map((item) =>
            item.children?.length ? (
              <NavDropdown key={item.href} item={item} isActive={isActive} linkClassName={DESKTOP_LINK} />
            ) : (
              <li key={item.href}>
                {item.external ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className={DESKTOP_LINK}>
                    {item.label}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className={DESKTOP_LINK}
                    aria-current={isActive(item.href) ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ),
          )}
        </ul>

        {/* The diagnostic is the primary action at both viewport sizes. */}
        <div className="hidden items-center gap-3 lg:flex">
          <ButtonLink href={headerCtas.diagnostic.href} variant="glow" size="md">
            {headerCtas.diagnostic.label}
          </ButtonLink>
          <ButtonLink href={headerCtas.bookCall.href} variant="secondary">
            {headerCtas.bookCall.label}
          </ButtonLink>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="primary-nav-mobile"
          className="min-h-11 rounded-md border border-[var(--border-subtle)] bg-bg-2 px-3 py-2 t-small text-fg-0 lg:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div
          id="primary-nav-mobile"
          className="max-h-[calc(100vh-5rem)] overflow-y-auto border-t border-[var(--border-subtle)] bg-bg-base lg:hidden"
        >
          <ul className="mx-auto max-w-[1280px] space-y-1 px-5 py-6 sm:px-8">
            {NAV.map((item) =>
              item.children?.length ? (
                <NavAccordion
                  key={item.href}
                  item={item}
                  isActive={isActive}
                  onNavigate={() => setOpen(false)}
                  linkClassName={MOBILE_LINK}
                />
              ) : (
                <li key={item.href}>
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={MOBILE_LINK}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className={MOBILE_LINK}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ),
            )}
            <li className="flex flex-col gap-3 pt-4">
              <ButtonLink
                href={headerCtas.diagnostic.href}
                variant="glow"
                className="w-full"
              >
                {headerCtas.diagnostic.label}
              </ButtonLink>
              <ButtonLink
                href={headerCtas.bookCall.href}
                variant="secondary"
                className="w-full"
              >
                {headerCtas.bookCall.label}
              </ButtonLink>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
