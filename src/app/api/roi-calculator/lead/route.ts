import { NextRequest, NextResponse } from "next/server";
import { calculateRoiResult } from "@/lib/roi-calculator/calculations";
import { sendAgencyRoiNotification, sendClientRoiResult } from "@/lib/roi-calculator/roi-calculator-email";
import { notifyRoiCalculatorChannel } from "@/lib/roi-calculator/roi-calculator-notify";
import { buildReportUrl } from "@/lib/roi-calculator/report-token";
import { roiLeadSchema } from "@/lib/roi-calculator/roi-calculator-schema";
import { getEmailHash, getIpHash, persistRoiCalculatorLead, updateRoiLeadEmailStatus } from "@/lib/roi-calculator/roi-calculator-storage";

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

  const parsed = roiLeadSchema.safeParse(json);
  if (!parsed.success) {
    return errorResponse("VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid ROI calculator submission.", 400);
  }

  const lead = parsed.data;
  if (lead.hp && lead.hp.trim().length > 0) {
    return successResponse({ leadId: null, dropped: true });
  }

  const recalculated = calculateRoiResult(lead.input);
  if (JSON.stringify(recalculated) !== JSON.stringify(lead.result)) {
    return errorResponse("VALIDATION_ERROR", "Submitted result does not match calculator inputs.", 400);
  }

  const ip = getIp(req);
  const ipHash = getIpHash(ip) ?? "unknown-ip";
  const rateKey = `${ipHash}:${getEmailHash(lead.email)}`;
  if (isRateLimited(rateKey)) {
    return errorResponse("RATE_LIMITED", "Too many ROI calculator submissions. Try again later.", 429);
  }

  const persisted = await persistRoiCalculatorLead({
    lead,
    ip,
    userAgent: req.headers.get("user-agent"),
  });

  if (!persisted.ok) {
    return errorResponse("PROVIDER_ERROR", "We could not save the ROI calculator submission. Please try again.", 503);
  }

  const submittedAt = new Date().toISOString();
  const reportUrl = buildReportUrl(persisted.leadId);

  const agencyEmailStatus = await sendAgencyRoiNotification({ leadId: persisted.leadId, lead, submittedAt });
  await updateRoiLeadEmailStatus({ leadId: persisted.leadId, agencyEmailStatus });

  void sendClientRoiResult({ leadId: persisted.leadId, lead, submittedAt }).then((clientEmailStatus) =>
    updateRoiLeadEmailStatus({ leadId: persisted.leadId, clientEmailStatus }),
  );

  void notifyRoiCalculatorChannel({ leadId: persisted.leadId, lead, reportUrl });

  return successResponse({
    leadId: persisted.leadId,
    reportUrl,
    emailStatus: agencyEmailStatus === "sent" ? "accepted" : "partial",
  });
}
