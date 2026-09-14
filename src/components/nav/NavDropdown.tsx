"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { NavItem } from "@/config/nav";

// Registry of open dropdowns so only one is open at a time, however it was
// opened (pointer, Enter, Space, or ArrowDown).
const closers = new Map<string, () => void>();
function closeOthers(id: string) {
  for (const [key, close] of closers) if (key !== id) close();
}

/**
 * Desktop parent item with children (Canonical Map v1.1 §8.7).
 *
 * The parent label stays a plain link to its hub. A separate disclosure
 * button opens the menu, so nothing depends on hover: click, Enter, Space,
 * or ArrowDown open it; Escape and outside clicks close it and focus returns
 * to the button; arrow keys move between menu links.
 */
export default function NavDropdown({
  item,
  isActive,
  linkClassName,
}: {
  item: NavItem;
  isActive: (href: string) => boolean;
  linkClassName: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLLIElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  const focusFirstRef = useRef(false);

  const close = useCallback((refocus = false) => {
    setOpen(false);
    if (refocus) buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    closeOthers(panelId);
    closers.set(panelId, () => setOpen(false));
    return () => {
      closers.delete(panelId);
    };
  }, [open, panelId]);

  // Focus moves into the menu only after the panel has been committed visible.
  useEffect(() => {
    if (!open || !focusFirstRef.current) return;
    focusFirstRef.current = false;
    panelRef.current?.querySelector<HTMLAnchorElement>("a[href]")?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close(true);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const focusLink = (offset: number) => {
    const links = Array.from(panelRef.current?.querySelectorAll<HTMLAnchorElement>("a[href]") ?? []);
    if (links.length === 0) return;
    const current = links.indexOf(document.activeElement as HTMLAnchorElement);
    const next = current === -1 ? (offset > 0 ? 0 : links.length - 1) : (current + offset + links.length) % links.length;
    links[next].focus();
  };

  const onButtonKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusFirstRef.current = true;
      setOpen(true);
    }
  };

  const onPanelKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusLink(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      focusLink(-1);
    }
  };

  // Tab walks the menu links; the menu closes only once focus actually leaves
  // the trigger and panel, so a keyboard user never lands on nothing.
  const onRootBlur = (e: React.FocusEvent) => {
    if (open && !rootRef.current?.contains(e.relatedTarget as Node | null)) close();
  };

  const groups = item.groups ?? [];
  const parentActive = isActive(item.href) || (item.children ?? []).some((c) => isActive(c.href));

  return (
    <li ref={rootRef} onBlur={onRootBlur} className="relative flex items-center">
      <Link
        href={item.href}
        className={linkClassName}
        aria-current={isActive(item.href) ? "page" : undefined}
        data-active={parentActive || undefined}
      >
        {item.label}
      </Link>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onButtonKeyDown}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={panelId}
        aria-label={`${item.label} menu`}
        className="ml-1 flex h-8 w-8 items-center justify-center rounded-[4px] text-fg-1 transition-colors hover:text-signal-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-yellow"
      >
        <Chevron open={open} />
      </button>

      <div
        ref={panelRef}
        id={panelId}
        hidden={!open}
        onKeyDown={onPanelKeyDown}
        className="absolute left-0 top-full z-50 mt-3 min-w-[560px] rounded-[8px] border border-[var(--border-subtle)] bg-bg-base p-6 shadow-[var(--aj-elevation-overlay,0_16px_40px_rgba(0,0,0,0.55))]"
      >
        <div className={`grid gap-8 ${groups.length > 2 ? "grid-cols-3" : "grid-cols-2"}`}>
          {groups.map((group) => (
            <div key={group.label}>
              <p className="t-label mb-3">{group.label}</p>
              <ul className="space-y-1">
                {group.items.map((child) => (
                  <li key={child.href}>
                    <Link
                      href={child.href}
                      onClick={() => close()}
                      aria-current={isActive(child.href) ? "page" : undefined}
                      className="block rounded-[4px] px-2 py-2 transition-colors hover:bg-bg-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-yellow aria-[current=page]:text-signal-yellow"
                    >
                      <span className="block text-sm font-semibold text-fg-0">{child.label}</span>
                      {child.description && group.items.length <= 3 && (
                        <span className="mt-0.5 block text-xs leading-snug text-fg-2">{child.description}</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </li>
  );
}

/**
 * Mobile parent item with children (§8.8): an accordion inside the drawer.
 * The parent hub stays a direct link; the disclosure sits beside it. Child
 * links keep a 44px minimum target and selecting one closes the drawer.
 */
export function NavAccordion({
  item,
  isActive,
  onNavigate,
  linkClassName,
}: {
  item: NavItem;
  isActive: (href: string) => boolean;
  onNavigate: () => void;
  linkClassName: string;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const groups = item.groups ?? [];

  return (
    <li>
      <div className="flex items-center">
        <Link
          href={item.href}
          className={`${linkClassName} flex-1`}
          aria-current={isActive(item.href) ? "page" : undefined}
          onClick={onNavigate}
        >
          {item.label}
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={`${open ? "Collapse" : "Expand"} ${item.label}`}
          className="flex h-11 w-11 items-center justify-center rounded-[4px] text-fg-1 hover:text-signal-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-yellow"
        >
          <Chevron open={open} />
        </button>
      </div>
      <div id={panelId} hidden={!open} className="mb-2 ml-3 border-l border-[var(--border-subtle)] pl-3">
        {groups.map((group) => (
          <div key={group.label} className="py-2">
            <p className="t-label px-3 pb-1">{group.label}</p>
            <ul>
              {group.items.map((child) => (
                <li key={child.href}>
                  <Link
                    href={child.href}
                    onClick={onNavigate}
                    aria-current={isActive(child.href) ? "page" : undefined}
                    className="block min-h-11 rounded-[4px] px-3 py-3 text-base text-fg-1 hover:bg-bg-2 hover:text-signal-yellow aria-[current=page]:text-signal-yellow"
                  >
                    {child.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </li>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-transform ${open ? "rotate-180" : ""}`}
    >
      <path d="M3 6l5 5 5-5" />
    </svg>
  );
}
