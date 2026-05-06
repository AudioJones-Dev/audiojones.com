/**
 * Sanity client for the Audio Jones blog.
 *
 * Reads from:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   NEXT_PUBLIC_SANITY_DATASET        (defaults to "production")
 *   NEXT_PUBLIC_SANITY_API_VERSION    (defaults to "2025-01-01")
 *   SANITY_API_READ_TOKEN             (optional — only needed for draft preview)
 *
 * If NEXT_PUBLIC_SANITY_PROJECT_ID is missing, the client is replaced with
 * a no-op stub so blog pages fail gracefully with empty state rather than
 * throwing at build or runtime.
 *
 * No secrets are hardcoded. All values come from environment variables.
 */

import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";

/** Whether Sanity is configured in the current environment. */
export const isSanityConfigured = Boolean(projectId);

/**
 * Live Sanity client. Will be undefined if env vars are missing.
 * Always access via `safeFetch` instead of using this directly.
 */
export const sanityClient = isSanityConfigured
  ? createClient({
      projectId: projectId!,
      dataset,
      apiVersion,
      useCdn: true, // use CDN for public read; set false for preview/drafts
      token: process.env.SANITY_API_READ_TOKEN, // optional — only for draft content
    })
  : null;

/**
 * Safe fetch wrapper. Returns `null` if Sanity is not configured or if the
 * query fails. Blog pages should handle `null` by rendering an empty state.
 */
export async function safeFetch<T>(
  query: string,
  params: Record<string, unknown> = {}
): Promise<T | null> {
  if (!sanityClient) {
    // Sanity env vars not configured — return null, not an error.
    return null;
  }
  try {
    return await sanityClient.fetch<T>(query, params);
  } catch (err) {
    // In production, log and degrade gracefully.
    if (process.env.NODE_ENV !== "production") {
      console.warn("[Sanity] fetch failed:", err);
    }
    return null;
  }
}
