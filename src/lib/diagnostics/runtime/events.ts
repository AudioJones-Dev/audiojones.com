/**
 * Shared diagnostic runtime — event helpers (Phase 4B).
 *
 * Generic, behavior-equivalent extraction of Founder Gravity's event logic
 * (FounderGravityAuditFlow.tsx: `emitBrowserEvent` 86-95, `recordEvent`
 * 145-154). The dataLayer prefix and the CustomEvent name are parameters
 * (Founder Gravity passes "fga" / "audiojones:fga_event").
 *
 * The capped (last-50) event buffer is owned by the caller via the `push`
 * callback — exactly as the live component does with `setEvents`.
 *
 * Browser-guarded; no React, no fetch, no routing.
 */

export type DiagnosticEvent = {
  event: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
};

export type DiagnosticEventEmitConfig = {
  /** dataLayer event prefix, e.g. "fga" -> dataLayer { event: "fga_<name>" }. */
  prefix: string;
  /** window CustomEvent name, e.g. "audiojones:fga_event". */
  customEventName: string;
};

export function createDiagnosticEvent(
  event: string,
  metadata?: Record<string, unknown>,
): DiagnosticEvent {
  return { event, timestamp: new Date().toISOString(), metadata };
}

export function emitDiagnosticEvent(
  config: DiagnosticEventEmitConfig,
  event: DiagnosticEvent,
): void {
  if (typeof window === "undefined") return;
  const win = window as Window & { dataLayer?: Array<Record<string, unknown>> };
  win.dataLayer?.push({ event: `${config.prefix}_${event.event}`, ...event.metadata });
  window.dispatchEvent(new CustomEvent(config.customEventName, { detail: event }));
}

/**
 * Builds a `recordEvent(name, metadata?)` closure: constructs the event,
 * hands it to the caller's buffer `push`, emits it, and returns it. Mirrors
 * the live component's `recordEvent` 1:1 (the cap-50 lives in `push`).
 */
export function createEventRecorder(
  config: DiagnosticEventEmitConfig,
  push: (event: DiagnosticEvent) => void,
): (event: string, metadata?: Record<string, unknown>) => DiagnosticEvent {
  return function recordEvent(event, metadata) {
    const built = createDiagnosticEvent(event, metadata);
    push(built);
    emitDiagnosticEvent(config, built);
    return built;
  };
}
