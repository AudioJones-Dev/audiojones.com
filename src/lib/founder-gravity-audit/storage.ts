import "server-only";
import { createHash } from "node:crypto";
import {
  insertFounderGravityAuditLead,
  type FounderGravityLeadContext,
  type StoredFounderGravityLead,
} from "@/db/founder-gravity-audit-leads";
import type { FounderGravityAuditLeadSchemaInput } from "./schema";
import type { FounderGravityResult } from "./types";

export type { FounderGravityLeadContext, StoredFounderGravityLead };

export function hashFounderGravityIp(ip: string | null | undefined): string | null {
  if (!ip) return null;
  const salt = process.env.IP_HASH_SALT || "audio-jones-default-salt";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

export async function persistFounderGravityAuditLead(
  input: FounderGravityAuditLeadSchemaInput,
  result: FounderGravityResult,
  ctx: FounderGravityLeadContext,
): Promise<StoredFounderGravityLead> {
  try {
    return await insertFounderGravityAuditLead(input, result, ctx);
  } catch (err) {
    console.error("[founder-gravity-audit] failed to persist lead", {
      error: err instanceof Error ? err.message : String(err),
      email: input.email,
      segment: result.segment,
    });
    throw err;
  }
}
