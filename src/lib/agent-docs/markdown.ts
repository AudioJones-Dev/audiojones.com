export const MARKDOWN_ROUTE = "/api/agent-markdown";

const EXCLUDED_PREFIXES = [
  "/api",
  "/_next",
  "/portal",
  "/ops",
  "/env",
  "/status",
  "/not-authorized",
];

const ALLOWED_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "audiojones.com",
  "www.audiojones.com",
]);

/**
 * True when the Accept header lists text/markdown with a non-zero q.
 * Browsers never send text/markdown, so a wildcard alone does not count.
 */
export function acceptsMarkdown(accept: string | null): boolean {
  if (!accept) return false;
  return accept.split(",").some((part) => {
    const [type, ...params] = part.trim().toLowerCase().split(";");
    if (type.trim() !== "text/markdown") return false;
    const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
    return q === undefined || Number(q.slice(2)) > 0;
  });
}

export function isMarkdownEligiblePath(pathname: string): boolean {
  if (/\.[a-z0-9]+$/i.test(pathname)) return false;
  return !EXCLUDED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function isAllowedMarkdownHost(hostname: string): boolean {
  return ALLOWED_HOSTS.has(hostname) || hostname.endsWith(".vercel.app");
}
