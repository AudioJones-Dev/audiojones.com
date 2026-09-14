import { after, NextRequest, NextResponse } from "next/server";
import { calculateRoiResult } from "@/lib/roi-calculator/calculations";
import { staticLaborBenchmarkProvider } from "@/lib/roi-calculator/labor/benchmark-provider";
import {
  sendAgencyRoiNotification,
  sendAgencyScorecardNotification,
  sendClientRoiResult,
  sendClientScorecardResult,
} from "@/lib/roi-calculator/roi-calculator-email";
import { parseRoiLead } from "@/lib/roi-calculator/roi-calculator-schema";
import {
  getEmailHash,
  getIpHash,
  persistRoiCalculatorLead,
  updateRoiLeadEmailStatus,
  type PersistableRoiLead,
} from "@/lib/roi-calculator/roi-calculator-storage";
import { calculateRevenueLeakScorecard, resolveScorecardContext } from "@/lib/roi-calculator/scorecard";
import type { RevenueLeakScorecardResult } from "@/lib/roi-calculator/types";

export const runtime = "nodejs";

type ApiErrorCode = "VALIDATION_ERROR" | "RATE_LIMITED" | "PROVIDER_ERROR" | "METHOD_NOT_ALLOWED";

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();
const WINDOW_MS = 60 * 60 * 1000;
const LIMIT = 10;
const MAX_BYTES = 64 * 1024;

function errorResponse(code: ApiErrorCode, message: string, status: number) {
  return NextResponse.json({ ok: false, error: { code, message } }, { status });
}

function successResponse(data: Record<string, unknown>, status = 200) {
  return NextResponse.json({ ok: true, data }, { status });
}

function getIp(req: NextRequest) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    null
  );
}

function isRateLimited(key: string) {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > LIMIT;
}

export async function POST(req: NextRequest) {
  const contentLength = Number(req.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BYTES) {
    return errorResponse("VALIDATION_ERROR", "Payload is too large.", 413);
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return errorResponse("VALIDATION_ERROR", "Request body must be valid JSON.", 400);
  }

  const parsed = parseRoiLead(json);
  if (!parsed.success) {
    return errorResponse("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid ROI calculator submission.", 400);
  }

  const lead = parsed.data;
  if (lead.hp && lead.hp.trim().length > 0) {
    return successResponse({ leadId: null, dropped: true });
  }

  // The server's calculation is the only one that counts. V1 clients send a
  // result and it must match; V2 clients send inputs only and get the
  // authoritative result back.
  let persistable: PersistableRoiLead;
  let scorecard: RevenueLeakScorecardResult | null = null;
  if (lead.calculationVersion === "v2-geo-economic") {
    const context = await resolveScorecardContext(lead.input, staticLaborBenchmarkProvider);
    scorecard = calculateRevenueLeakScorecard(lead.input, context);
    persistable = {
      email: lead.email,
      source: lead.source,
      utm: lead.utm,
      calculationVersion: "v2-geo-economic",
      input: lead.input,
      result: scorecard,
    };
  } else {
    const recalculated = calculateRoiResult(lead.input);
    if (JSON.stringify(recalculated) !== JSON.stringify(lead.result)) {
      return errorResponse("VALIDATION_ERROR", "Submitted result does not match calculator inputs.", 400);
    }
    persistable = {
      email: lead.email,
      source: lead.source,
      utm: lead.utm,
      calculationVersion: "v1",
      input: lead.input,
      result: lead.result,
    };
  }

  const ip = getIp(req);
  const ipHash = getIpHash(ip) ?? "unknown-ip";
  const rateKey = `${ipHash}:${getEmailHash(lead.email)}`;
  if (isRateLimited(rateKey)) {
    return errorResponse("RATE_LIMITED", "Too many ROI calculator submissions. Try again later.", 429);
  }

  const persisted = await persistRoiCalculatorLead({
    lead: persistable,
    ip,
    userAgent: req.headers.get("user-agent"),
  });

  if (!persisted.ok) {
    return errorResponse("PROVIDER_ERROR", "We could not save the ROI calculator submission. Please try again.", 503);
  }

  const submittedAt = new Date().toISOString();
  const leadId = persisted.leadId;

  if (lead.calculationVersion === "v2-geo-economic") {
    if (!scorecard) return errorResponse("PROVIDER_ERROR", "Scorecard calculation did not complete.", 503);
    const args = { leadId, input: lead.input, result: scorecard, submittedAt, source: lead.source };
    const agencyEmailStatus = await sendAgencyScorecardNotification(args);
    await updateRoiLeadEmailStatus({ leadId, agencyEmailStatus });
    after(async () => {
      const clientEmailStatus = await sendClientScorecardResult(args);
      await updateRoiLeadEmailStatus({ leadId, clientEmailStatus });
    });
    return successResponse({
      leadId,
      emailStatus: agencyEmailStatus === "failed" ? "partial" : "accepted",
      result: scorecard,
    });
  }

  const v1Lead = lead;
  const agencyEmailStatus = await sendAgencyRoiNotification({ leadId, lead: v1Lead, submittedAt });
  await updateRoiLeadEmailStatus({ leadId, agencyEmailStatus });
  // `after` rather than a bare `void`: on serverless the invocation can be
  // suspended as soon as the response is sent. That would drop two things —
  // the result email the client is waiting for, and the status write that
  // records whether it was sent — leaving the row claiming nothing happened.
  // `after` keeps the invocation alive until both settle, without making the
  // caller wait for them.
  after(async () => {
    const clientEmailStatus = await sendClientRoiResult({ leadId, lead: v1Lead, submittedAt });
    await updateRoiLeadEmailStatus({ leadId, clientEmailStatus });
  });

  return successResponse({
    leadId,
    emailStatus: agencyEmailStatus === "failed" ? "partial" : "accepted",
  });
}
