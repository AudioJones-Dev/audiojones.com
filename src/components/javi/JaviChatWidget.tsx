"use client";

/**
 * JaviChatWidget — V1 proof-of-concept of Audio Jones' AI Executive
 * Assistant, embedded site-wide as a floating launcher.
 *
 * Mock-mode today. The send pipeline goes through
 * `sendJaviMessage` in `src/lib/javi/javiClient.ts`, which is the
 * single seam to swap for the real backend when ready.
 *
 * Brand contract: dark surface, signal-yellow as the sole accent,
 * Syne in the header, DM Sans in the body. No raw hexes — tokens only.
 */

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  JAVI_SUGGESTED_PROMPTS,
  type JaviSuggestion,
} from "@/lib/javi/mockJaviResponses";
import { sendJaviMessage, type JaviResponse } from "@/lib/javi/javiClient";

type ChatTurn =
  | { role: "javi"; id: string; response: JaviResponse }
  | { role: "user"; id: string; text: string };

// Routes where the marketing widget would be noise — operator surfaces.
const HIDDEN_PATH_PREFIXES = ["/portal", "/ops", "/uploader", "/status"];

function shouldHideOnPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return HIDDEN_PATH_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

function isEnabled(): boolean {
  // Public env var; safe to read at build time. Default ON — flip to
  // "false" in Vercel to kill-switch the widget without a redeploy.
  const flag = process.env.NEXT_PUBLIC_JAVI_WIDGET_ENABLED;
  if (flag === undefined) return true;
  return flag !== "false" && flag !== "0";
}

function JaviAvatar({ size = 32 }: { size?: number }) {
  const [errored, setErrored] = React.useState(false);
  if (errored) {
    return (
      <span
        aria-hidden
        className="inline-flex items-center justify-center rounded-full bg-bg-base text-signal-yellow font-headline font-bold ring-1 ring-signal-yellow/60"
        style={{ width: size, height: size, fontSize: Math.round(size * 0.5) }}
      >
        J
      </span>
    );
  }
  return (
    <Image
      src="/images/javi/avatar.png"
      alt="Javi"
      width={size}
      height={size}
      className="rounded-full object-cover ring-1 ring-signal-yellow/60"
      onError={() => setErrored(true)}
      // Avatar is a UI chrome element, not a hero — skip priority.
      unoptimized={false}
    />
  );
}

function Bubble({ children, fromUser }: { children: React.ReactNode; fromUser?: boolean }) {
  if (fromUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded bg-signal-yellow/10 px-3 py-2 text-[14px] leading-[1.55] text-text-primary border border-signal-yellow/30">
          {children}
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-2">
      <div className="mt-0.5 shrink-0">
        <JaviAvatar size={28} />
      </div>
      <div className="max-w-[85%] rounded bg-surface-2 px-3 py-2 text-[14px] leading-[1.55] text-text-primary border border-border-subtle">
        {children}
      </div>
    </div>
  );
}

function SuggestionChip({
  suggestion,
  onSelect,
}: {
  suggestion: JaviSuggestion;
  onSelect: (s: JaviSuggestion) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(suggestion)}
      className="rounded-full border border-border-strong px-3 py-1.5 text-[12px] font-body text-text-primary transition-colors hover:border-signal-yellow hover:text-signal-yellow focus-visible:outline-none focus-visible:[box-shadow:0_0_0_2px_var(--signal-yellow)]"
    >
      {suggestion.label}
    </button>
  );
}

function InlineCta({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center gap-2 rounded h-9 px-4 text-[13px] font-headline font-bold tracking-[-0.01em] bg-signal-yellow text-bg-base border border-signal-yellow shadow-[0_10px_40px_-10px_rgba(232,255,90,0.55)] hover:bg-signal-soft hover:border-signal-soft transition-colors focus-visible:outline-none focus-visible:[box-shadow:0_0_0_2px_var(--signal-yellow)]"
    >
      {label}
    </Link>
  );
}

const INTRO_RESPONSE: JaviResponse = {
  text:
    "I'm Javi, Audio Jones' AI Executive Assistant. I can help you understand our systems, services, and how an assistant like me could work for your business.",
  followUps: JAVI_SUGGESTED_PROMPTS,
};

const ERROR_RESPONSE: JaviResponse = {
  text:
    "Something went wrong reaching me just now. Please try again in a moment — or start with the diagnostic below.",
};

export default function JaviChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [turns, setTurns] = React.useState<ChatTurn[]>([
    { role: "javi", id: "intro", response: INTRO_RESPONSE },
  ]);

  const launcherRef = React.useRef<HTMLButtonElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const scrollerRef = React.useRef<HTMLDivElement | null>(null);
  const turnSeq = React.useRef(0);
  const nextId = (prefix: string) => `${prefix}-${++turnSeq.current}`;
  // Synchronous in-flight guard. `sending` drives the UI but is React state,
  // so a rapid double-Enter/double-click can re-enter dispatch before the
  // re-render flips it; this ref blocks the second call in the same tick.
  const inFlight = React.useRef(false);

  // Close on Escape; restore focus to launcher on close.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    // Auto-focus the input when panel opens.
    const t = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [open]);

  // Return focus to the launcher only on an open→close transition — not on
  // the initial mount, which would otherwise steal focus to the launcher on
  // every page load (the widget is mounted site-wide).
  const wasOpen = React.useRef(false);
  React.useEffect(() => {
    if (!open && wasOpen.current) {
      launcherRef.current?.focus({ preventScroll: true });
    }
    wasOpen.current = open;
  }, [open]);

  // Keep the chat scrolled to the latest turn.
  React.useEffect(() => {
    const el = scrollerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [turns, open]);

  if (!isEnabled() || shouldHideOnPath(pathname)) {
    return null;
  }

  // Single send pipeline: `display` is what the user sees in their bubble,
  // `payload` is what goes to the backend (a suggestion id for chips, the raw
  // text otherwise). Guards against concurrent in-flight requests and always
  // surfaces a reply — including an error bubble if the request fails — so the
  // typing indicator can never strand without a response.
  const dispatch = async (display: string, payload: string) => {
    if (inFlight.current) return;
    inFlight.current = true;
    setSending(true);
    setTurns((prev) => [
      ...prev,
      { role: "user", id: nextId("u"), text: display },
    ]);
    try {
      const response = await sendJaviMessage(payload);
      setTurns((prev) => [
        ...prev,
        { role: "javi", id: nextId("j"), response },
      ]);
    } catch {
      setTurns((prev) => [
        ...prev,
        { role: "javi", id: nextId("j"), response: ERROR_RESPONSE },
      ]);
    } finally {
      inFlight.current = false;
      setSending(false);
    }
  };

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || inFlight.current) return;
    setDraft("");
    void dispatch(trimmed, trimmed);
  };

  // The matcher in mockJaviResponses keys off the suggestion id for exact
  // matches; the label is what the user sees in the bubble.
  const sendSuggestion = (s: JaviSuggestion) => {
    void dispatch(s.label, s.id);
  };

  return (
    <>
      {/* Launcher — sits below the cookie banner (z-50) so consent UI
          always wins on first load. */}
      <button
        ref={launcherRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close Javi chat" : "Open Javi chat — AI Executive Assistant"}
        aria-expanded={open}
        aria-controls={open ? "javi-chat-panel" : undefined}
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-surface-1 border border-border-strong pl-1.5 pr-4 py-1.5 shadow-[0_10px_40px_-10px_rgba(232,255,90,0.45)] hover:border-signal-yellow transition-colors focus-visible:outline-none focus-visible:[box-shadow:0_0_0_2px_var(--signal-yellow)]"
      >
        <JaviAvatar size={32} />
        <span className="font-headline text-[13px] font-bold tracking-[-0.01em] text-text-primary">
          {open ? "Hide Javi" : "Ask Javi"}
        </span>
      </button>

      {open && (
        <div
          id="javi-chat-panel"
          role="dialog"
          aria-modal="false"
          aria-label="Javi — AI Executive Assistant"
          className="fixed bottom-20 right-3 z-40 w-[min(380px,calc(100vw-1.5rem))] max-h-[min(560px,calc(100vh-7rem))] flex flex-col rounded-lg bg-surface-1 border border-border-strong shadow-[0_30px_80px_-40px_rgba(0,0,0,0.7)] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border-subtle bg-bg-base">
            <div className="flex items-center gap-3">
              <JaviAvatar size={36} />
              <div className="leading-tight">
                <div className="font-headline text-[15px] font-bold tracking-[-0.01em] text-fg-0">
                  Javi
                </div>
                <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-text-muted">
                  AI Executive Assistant
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close Javi chat"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border-subtle text-text-muted hover:text-signal-yellow hover:border-signal-yellow transition-colors focus-visible:outline-none focus-visible:[box-shadow:0_0_0_2px_var(--signal-yellow)]"
            >
              <span aria-hidden className="text-[18px] leading-none">×</span>
            </button>
          </div>

          {/* Conversation scroller */}
          <div
            ref={scrollerRef}
            className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
          >
            {turns.map((turn) =>
              turn.role === "user" ? (
                <Bubble key={turn.id} fromUser>
                  {turn.text}
                </Bubble>
              ) : (
                <div key={turn.id} className="space-y-2">
                  <Bubble>{turn.response.text}</Bubble>
                  {turn.response.followUps && turn.response.followUps.length > 0 && (
                    <div className="flex flex-wrap gap-2 pl-9">
                      {turn.response.followUps.map((s) => (
                        <SuggestionChip
                          key={s.id}
                          suggestion={s}
                          onSelect={sendSuggestion}
                        />
                      ))}
                    </div>
                  )}
                  {turn.response.cta && (
                    <div className="pl-9 pt-1">
                      <InlineCta
                        href={turn.response.cta.href}
                        label={turn.response.cta.label}
                      />
                    </div>
                  )}
                </div>
              ),
            )}
            {sending && (
              <Bubble>
                <span className="inline-flex items-center gap-1.5 text-text-muted">
                  <span className="size-1.5 rounded-full bg-text-muted animate-pulse" />
                  <span className="size-1.5 rounded-full bg-text-muted animate-pulse [animation-delay:120ms]" />
                  <span className="size-1.5 rounded-full bg-text-muted animate-pulse [animation-delay:240ms]" />
                </span>
              </Bubble>
            )}
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send(draft);
            }}
            className="border-t border-border-subtle bg-bg-base px-3 py-3 flex items-center gap-2"
          >
            <label htmlFor="javi-input" className="sr-only">
              Message Javi
            </label>
            <input
              id="javi-input"
              ref={inputRef}
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask Javi anything…"
              autoComplete="off"
              className="flex-1 h-10 rounded bg-surface-2 border border-border-subtle px-3 text-[14px] text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:border-signal-yellow focus-visible:[box-shadow:0_0_0_2px_rgba(232,255,90,0.25)]"
            />
            <button
              type="submit"
              disabled={!draft.trim() || sending}
              aria-label="Send message"
              className="inline-flex items-center justify-center h-10 px-4 rounded font-headline font-bold text-[13px] tracking-[-0.01em] bg-signal-yellow text-bg-base border border-signal-yellow hover:bg-signal-soft hover:border-signal-soft disabled:opacity-40 disabled:pointer-events-none transition-colors focus-visible:outline-none focus-visible:[box-shadow:0_0_0_2px_var(--signal-yellow)]"
            >
              Send
            </button>
          </form>

          {/* Footer CTA — always visible offer line */}
          <div className="border-t border-border-subtle bg-surface-2 px-4 py-3 flex items-center justify-between gap-3">
            <div className="font-body text-[12px] text-text-muted leading-tight">
              Want a Javi for your business?
            </div>
            <InlineCta
              href="/ai-readiness-diagnostic"
              label="Start the Diagnostic"
            />
          </div>
        </div>
      )}
    </>
  );
}
