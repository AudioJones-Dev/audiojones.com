import type { DiagnosticLeadPayload } from "./types";

export type MockLeadCaptureResult = {
  ok: boolean;
  leadId: string;
};

export async function mockLeadCapture(
  payload: DiagnosticLeadPayload,
): Promise<MockLeadCaptureResult> {
  if (process.env.NODE_ENV !== "production") {
    console.info("[AI ROI Diagnostic Lead Capture Mock]", payload);
  }

  if (typeof window !== "undefined") {
    try {
      const key = "ai-roi-diagnostic-lead";
      window.localStorage.setItem(
        key,
        JSON.stringify({ savedAt: new Date().toISOString(), payload }),
      );
    } catch {
      // ignore storage errors (private mode, quota, etc.)
    }
  }

  return {
    ok: true,
    leadId: `mock_${Date.now()}`,
  };
}
