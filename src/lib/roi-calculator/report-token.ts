import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

const DEFAULT_TTL_DAYS = 90;

function secret() {
  return (
    process.env.ROI_REPORT_TOKEN_SECRET ||
    process.env.LEAD_FORM_SECRET ||
    process.env.IP_HASH_SALT ||
    ""
  );
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url").slice(0, 24);
}

export function buildReportToken(leadId: string, ttlDays = DEFAULT_TTL_DAYS): string {
  const exp = Math.floor(Date.now() / 1000) + ttlDays * 24 * 60 * 60;
  const sig = sign(`${leadId}.${exp}`);
  return `${exp}.${sig}`;
}

export function verifyReportToken(leadId: string, token: string | null | undefined): boolean {
  if (!token || !secret()) return false;
  const [expRaw, sigRaw] = token.split(".");
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || !sigRaw) return false;
  if (exp < Math.floor(Date.now() / 1000)) return false;

  const expected = sign(`${leadId}.${exp}`);
  if (expected.length !== sigRaw.length) return false;
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(sigRaw));
  } catch {
    return false;
  }
}

function siteBase(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");
  if (explicit) return explicit;
  const vercel = process.env.VERCEL_URL?.replace(/\/+$/, "");
  if (vercel) return `https://${vercel}`;
  return "https://audiojones.com";
}

export function buildReportUrl(leadId: string): string {
  const token = buildReportToken(leadId);
  return `${siteBase()}/roi-calculator/report/${encodeURIComponent(leadId)}?t=${encodeURIComponent(token)}`;
}
