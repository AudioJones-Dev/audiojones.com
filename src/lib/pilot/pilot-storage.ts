// Server-only persistence helper for pilot applications.
//
// Writes through to NeonDB via src/db/pilot.ts. Hashes the client IP with
// IP_HASH_SALT so the raw IP never lands in the database. Errors are
// re-thrown so the API route can return a 500 instead of silently dropping
// the application.

import "server-only";
import { createHash } from "node:crypto";
import type { PilotApplicationInput } from "./pilot-schema";
import {
  insertPilotApplication,
  type PilotApplicationContext,
  type StoredPilotApplication,
} from "@/db/pilot";

export type { PilotApplicationContext, StoredPilotApplication };

export function hashIp(ip: string | null | undefined): string | null {
  if (!ip) return null;
  const salt = process.env.IP_HASH_SALT || "audio-jones-default-salt";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}

export async function persistPilotApplication(
  input: PilotApplicationInput,
  ctx: PilotApplicationContext,
): Promise<StoredPilotApplication> {
  try {
    return await insertPilotApplication(input, ctx);
  } catch (err) {
    console.error("[pilot] failed to persist application", {
      error: err instanceof Error ? err.message : String(err),
      email: input.email,
    });
    throw err;
  }
}
