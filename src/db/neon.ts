// NeonDB serverless client — lazy singleton.
//
// All server-side Postgres access for AudioJones.com flows through this file.
// Uses the HTTP serverless driver (no persistent connection / pool needed
// inside Vercel/Edge functions). Reads DATABASE_URL.
//
// See db/migrations/ for the canonical schema.

import "server-only";
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let cached: NeonQueryFunction<false, false> | null = null;

export function getSql(): NeonQueryFunction<false, false> {
  if (cached) return cached;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. NeonDB connection string is required for server-side data access.",
    );
  }
  cached = neon(url);
  return cached;
}
