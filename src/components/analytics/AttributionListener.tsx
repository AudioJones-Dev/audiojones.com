"use client";

// Runs first-party attribution capture on first load and on every client
// navigation — including query-string-only changes — so a paid landing's
// utm/gclid/fbclid is persisted before the visitor reaches a lead form.
// Renders nothing. Capture is first-party only (own cookie), is intentionally
// not consent-gated (see attribution.ts), and is skipped on portal/admin
// surfaces. Uses useSearchParams, so the layout mounts this inside a Suspense
// boundary to keep static rendering intact.

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { captureAttribution } from "@/lib/analytics/attribution";
import { isAnalyticsExcludedPath } from "@/lib/analytics/consent";

export default function AttributionListener() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isAnalyticsExcludedPath(pathname)) return;
    captureAttribution();
  }, [pathname, searchParams]);

  return null;
}
