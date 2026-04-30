// Lead persistence for the Applied Intelligence diagnostic.
//
// Persists leads to NeonDB via the canonical SQL schema in
// db/migrations/001_applied_intelligence_leads.sql. Firebase/Firestore is
// intentionally not used — see docs/architecture/stack-decision.md.

import "server-only";
import { createHash } from "node:crypto";
import type { AppliedIntelligenceLeadInput } from "./lead-schema";
import type { LeadScores } from "./lead-scoring";
import {
  insertAppliedIntelligenceLead,
  type LeadContext,
  type StoredLead,
} from "@/db/leads";

export type { LeadContext, StoredLead };

export function hashIp(ip: string | null | undefined): string | null {
  if (!ip) return null;
  const salt = process.env.IP_HASH_SALT || "audio-jones-default-salt";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

export async function persistAppliedIntelligenceLead(
  input: AppliedIntelligenceLeadInput,
  scores: LeadScores,
  ctx: LeadContext,
): Promise<StoredLead> {
  try {
    return await insertAppliedIntelligenceLead(input, scores, ctx);
  } catch (err) {
    // Log so the lead is not silently dropped, then re-throw so the API route
    // returns a 500 and the form can surface the error rather than pretending
    // to succeed.
    console.error("[applied-intelligence] failed to persist lead", {
      error: err instanceof Error ? err.message : String(err),
      email: input.email,
    });
    throw err;
  }
}
