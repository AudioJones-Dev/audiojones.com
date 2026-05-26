"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { mainNav, headerCtas } from "@/config/nav";

// Single source of truth for primary nav lives in `src/config/nav.ts`.
// Both Header and Footer import the same `mainNav` constant.
const NAV = mainNav;

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href.startsWith("http")) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

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
      className="site-header fixed inset-x-0 top-0 z-50 h-20"
      role="banner"
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-full max-w-[1280px] items-center justify-between gap-4 px-5 sm:px-8"
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
        <ul className="hidden items-center gap-1 xl:flex">
          {NAV.map((item) => {
            const active = isActive(item.href);

            return (
              <li key={item.href}>
                {item.href.startsWith("http") ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="site-nav-link"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className={cx("site-nav-link", active && "is-active")}
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        {/* Desktop CTAs — secondary + primary glow per DESIGN.md §11.1 */}
        <div className="hidden items-center gap-3 xl:flex">
          <ButtonLink href={headerCtas.diagnostic.href} variant="secondary" size="md">
            {headerCtas.diagnostic.label}
          </ButtonLink>
          <ButtonLink href={headerCtas.bookCall.href} variant="glow">
            {headerCtas.bookCall.label}
          </ButtonLink>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="primary-nav-mobile"
          aria-label={open ? "Close primary navigation" : "Open primary navigation"}
          className="site-menu-button xl:hidden"
        >
          {open ? <X aria-hidden size={20} /> : <Menu aria-hidden size={20} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div
          id="primary-nav-mobile"
          className="site-mobile-drawer xl:hidden"
        >
          <ul className="mx-auto max-w-[1280px] space-y-1 px-5 py-6 sm:px-8">
            {NAV.map((item) => {
              const active = isActive(item.href);

              return (
                <li key={item.href}>
                  {item.href.startsWith("http") ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="site-mobile-nav-link"
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className={cx("site-mobile-nav-link", active && "is-active")}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
            <li className="flex flex-col gap-3 pt-4">
              <ButtonLink
                href={headerCtas.diagnostic.href}
                variant="secondary"
                className="w-full"
              >
                {headerCtas.diagnostic.label}
              </ButtonLink>
              <ButtonLink
                href={headerCtas.bookCall.href}
                variant="glow"
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
