/**
 * Shared diagnostic runtime — session helper (Phase 4B).
 *
 * Generic, behavior-equivalent extraction of Founder Gravity's
 * `createSessionId` (FounderGravityAuditFlow.tsx:56-61). The only
 * generalization is that the fallback prefix is a parameter.
 *
 * Pure (no side effects). No React, no fetch, no routing.
 */

export function createDiagnosticSessionId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
