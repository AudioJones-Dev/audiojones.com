"use client";

// Runs first-party attribution capture on first load and on every client
// navigation, so a paid landing's utm/gclid/fbclid is persisted before the
// visitor reaches a lead form. Renders nothing. Capture is first-party only
// (own cookie) and is intentionally not consent-gated — see attribution.ts.
//
// Keyed on pathname (not useSearchParams) so the root layout stays statically
// renderable without a Suspense boundary; capture reads window.location.search
// directly, so the landing query string is still recorded on first mount.

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { captureAttribution } from "@/lib/analytics/attribution";

export default function AttributionListener() {
  const pathname = usePathname();

  useEffect(() => {
    captureAttribution();
  }, [pathname]);

  return null;
}
