"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/**
 * Browser-side Supabase client (singleton).
 *
 * Returns null when Supabase env vars are not configured so auth UI can
 * degrade to a signed-out state instead of crashing at import time.
 */
export function getSupabaseBrowserClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  if (!client) {
    client = createBrowserClient(url, anonKey);
  }
  return client;
}
