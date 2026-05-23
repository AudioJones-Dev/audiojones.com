#!/usr/bin/env -S node --loader tsx
/**
 * Visual QA capture — fetches PNG screenshots for a list of routes via the
 * Site-Shot API and stores them under artifacts/visual-qa/<timestamp>/.
 *
 * Required env:
 *   SITE_SHOT_API_KEY       Site-Shot API token (never logged)
 *   VISUAL_QA_BASE_URL      Base URL to capture against (prod or preview)
 *
 * Optional env:
 *   VISUAL_QA_ROUTES        Comma-separated route list; overrides defaults.
 *
 * Output:
 *   artifacts/visual-qa/<iso-timestamp>/<route-slug>.png
 *   artifacts/visual-qa/<iso-timestamp>/manifest.json
 *
 * The script writes only to the local filesystem; it never posts results
 * upstream and never echoes the API key.
 */

import dotenv from "dotenv";
import { mkdir, writeFile } from "node:fs/promises";
import * as path from "node:path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const DEFAULT_ROUTES = [
  "/",
  "/agents",
  "/agents/responseos",
  "/ai-readiness-diagnostic",
  "/services",
] as const;

const SITE_SHOT_ENDPOINT = "https://api.site-shot.com/";

const CAPTURE_PARAMS = {
  width: "1280",
  height: "1280",
  full_size: "1",
  max_height: "8000",
  format: "png",
  response_type: "json",
  delay_time: "2000",
  no_ads: "1",
  no_cookie_popup: "1",
} as const;

type RouteResult = {
  path: string;
  file: string;
  status: "ok" | "error";
  bytes?: number;
  error?: string;
};

type Manifest = {
  generatedAt: string;
  baseUrl: string;
  captureParams: Record<string, string>;
  routes: RouteResult[];
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    console.error(
      `visual-qa: missing required env ${name}. Set it in .env.local or the shell.`,
    );
    process.exit(1);
  }
  return value.trim();
}

function slugFor(route: string): string {
  if (route === "/") return "home";
  return (
    route
      .replace(/^\/+/, "")
      .replace(/\/+$/, "")
      .replace(/[^a-z0-9/_-]/gi, "")
      .replace(/\//g, "_") || "root"
  );
}

/**
 * Removes the Site-Shot userkey query parameter from any string that may
 * leak into logs, manifest entries, or error messages. Native fetch()
 * errors include the full request URL — without this, the Site-Shot API
 * key would surface verbatim in stack traces.
 */
function scrubSecrets(text: string): string {
  return text.replace(/(userkey=)[^&\s'"]+/gi, "$1[REDACTED]");
}

function extractScreenshotUrl(json: unknown): string | null {
  if (!json || typeof json !== "object") return null;
  const obj = json as Record<string, unknown>;
  // Site-Shot returns the screenshot URL under `image`. The other keys are
  // kept as defensive fallbacks for adjacent API shapes (e.g. proxies or
  // future Site-Shot revisions).
  const candidates: unknown[] = [
    obj.image,
    obj.screenshot,
    obj.url,
    obj.image_url,
    obj.imageUrl,
    (obj.data as Record<string, unknown> | undefined)?.image,
    (obj.data as Record<string, unknown> | undefined)?.screenshot,
    (obj.data as Record<string, unknown> | undefined)?.url,
  ];
  for (const c of candidates) {
    if (typeof c === "string" && c.length > 0) return c;
  }
  return null;
}

async function captureRoute(args: {
  baseUrl: string;
  route: string;
  apiKey: string;
  outDir: string;
}): Promise<RouteResult> {
  const targetUrl = new URL(args.route, args.baseUrl).toString();
  const params = new URLSearchParams({
    ...CAPTURE_PARAMS,
    userkey: args.apiKey,
    url: targetUrl,
  });
  const requestUrl = `${SITE_SHOT_ENDPOINT}?${params.toString()}`;

  const file = `${slugFor(args.route)}.png`;
  const outPath = path.join(args.outDir, file);

  try {
    const res = await fetch(requestUrl, {
      method: "GET",
      headers: { Accept: "application/json,image/png" },
    });
    if (!res.ok) {
      throw new Error(`Site-Shot HTTP ${res.status} ${res.statusText}`);
    }
    const contentType = res.headers.get("content-type") ?? "";

    let bytes: Uint8Array;
    if (contentType.includes("application/json")) {
      const json = (await res.json()) as unknown;
      const downloadUrl = extractScreenshotUrl(json);
      if (!downloadUrl) {
        throw new Error(
          `Site-Shot JSON response missing screenshot URL (keys: ${Object.keys(
            (json as object) ?? {},
          ).join(",")})`,
        );
      }
      const imgRes = await fetch(downloadUrl);
      if (!imgRes.ok) {
        throw new Error(
          `Screenshot download HTTP ${imgRes.status} from Site-Shot CDN`,
        );
      }
      bytes = new Uint8Array(await imgRes.arrayBuffer());
    } else {
      bytes = new Uint8Array(await res.arrayBuffer());
    }

    await writeFile(outPath, bytes);
    return {
      path: args.route,
      file,
      status: "ok",
      bytes: bytes.byteLength,
    };
  } catch (err) {
    const raw = err instanceof Error ? err.message : String(err);
    return {
      path: args.route,
      file,
      status: "error",
      error: scrubSecrets(raw),
    };
  }
}

async function main() {
  const apiKey = requireEnv("SITE_SHOT_API_KEY");
  const baseUrl = requireEnv("VISUAL_QA_BASE_URL");

  const routes = (
    process.env.VISUAL_QA_ROUTES?.split(",")
      .map((r) => r.trim())
      .filter(Boolean) ?? Array.from(DEFAULT_ROUTES)
  );

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const outDir = path.resolve(
    process.cwd(),
    "artifacts",
    "visual-qa",
    timestamp,
  );
  await mkdir(outDir, { recursive: true });

  console.log(`visual-qa: capturing ${routes.length} routes from ${baseUrl}`);
  console.log(`visual-qa: output → ${path.relative(process.cwd(), outDir)}`);

  const manifest: Manifest = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    captureParams: { ...CAPTURE_PARAMS },
    routes: [],
  };

  for (const route of routes) {
    const result = await captureRoute({ baseUrl, route, apiKey, outDir });
    if (result.status === "ok") {
      console.log(`  ok  ${route} → ${result.file} (${result.bytes} bytes)`);
    } else {
      console.error(`  err ${route} — ${result.error}`);
    }
    manifest.routes.push(result);
  }

  await writeFile(
    path.join(outDir, "manifest.json"),
    JSON.stringify(manifest, null, 2),
  );

  const failed = manifest.routes.filter((r) => r.status === "error");
  if (failed.length > 0) {
    console.error(
      `visual-qa: ${failed.length}/${routes.length} routes failed; manifest written`,
    );
    process.exit(1);
  }
  console.log(`visual-qa: captured ${routes.length} routes successfully`);
}

main().catch((err) => {
  const raw = err instanceof Error ? err.message : String(err);
  console.error("visual-qa: unexpected error —", scrubSecrets(raw));
  process.exit(2);
});
