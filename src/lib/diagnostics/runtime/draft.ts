/**
 * Shared diagnostic runtime — draft helpers (Phase 4B).
 *
 * Generic, behavior-equivalent extraction of Founder Gravity's localStorage
 * draft logic (FounderGravityAuditFlow.tsx mount effect 120-143 + saveDraft
 * 156-166 + clear on submit 245). Key-addressed; browser-guarded exactly as
 * the original (no-op on the server). The caller owns the payload shape.
 *
 * No React, no fetch, no routing.
 */

export function loadDraft<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  const saved = window.localStorage.getItem(key);
  if (!saved) return null;
  try {
    return JSON.parse(saved) as T;
  } catch {
    window.localStorage.removeItem(key);
    return null;
  }
}

export function saveDraft<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function clearDraft(key: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(key);
}
