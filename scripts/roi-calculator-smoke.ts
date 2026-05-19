/**
 * ROI Calculator pipeline smoke test.
 *
 * Posts a synthetic submission against a running dev/preview server and
 * reports whether the lead persisted and whether email delivery accepted.
 *
 * Usage:
 *   pnpm tsx scripts/roi-calculator-smoke.ts http://localhost:3000 you@example.com
 *
 * Defaults to http://localhost:3000 and smoke+<timestamp>@audiojones.test
 * if arguments are omitted.
 */

import { calculateRoiResult } from "../src/lib/roi-calculator/calculations";
import type { RoiCalculatorInput } from "../src/lib/roi-calculator/types";

const baseUrl = (process.argv[2] || process.env.SMOKE_BASE_URL || "http://localhost:3000").replace(/\/+$/, "");
const email = process.argv[3] || `smoke+${Date.now()}@audiojones.test`;

const input: RoiCalculatorInput = {
  industry: "professional-services",
  companySize: "6-20",
  monthlyRevenue: "100k-500k",
  workflowType: "lead-routing",
  taskFrequency: "weekly",
  hoursPerWeek: 12,
  hourlyCost: 95,
  errorFrequency: "medium",
  monthlyReworkCost: 2400,
  delayPain: "moderate",
  implementationBudget: 18000,
  timelineExpectation: "quarter",
  internalOwner: "clear-owner",
  processClarity: 4,
  dataQuality: 3,
  sopMaturity: 3,
  toolFragmentation: 3,
  teamAdoption: 4,
  name: "Smoke Test",
  email,
  company: "Smoke Test Co",
  phone: "",
  message: "Automated smoke test",
};

const result = calculateRoiResult(input);

async function main() {
  const url = `${baseUrl}/api/roi-calculator/lead`;
  console.log(`[smoke] POST ${url}`);
  console.log(`[smoke] email=${email}`);

  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, input, result, source: "smoke-test", utm: {}, hp: "" }),
  });

  const body = await response.json().catch(() => null);
  console.log(`[smoke] status=${response.status}`);
  console.log(`[smoke] body=${JSON.stringify(body, null, 2)}`);

  if (!response.ok || !body?.ok) {
    console.error("[smoke] FAIL — submission rejected");
    process.exit(1);
  }

  const data = body.data ?? {};
  console.log(`[smoke] leadId=${data.leadId}`);
  console.log(`[smoke] emailStatus=${data.emailStatus}`);
  if (data.reportUrl) console.log(`[smoke] reportUrl=${data.reportUrl}`);

  console.log("[smoke] PASS — check the inbox for the client email and your team channel for the notification.");
  console.log("[smoke] If emailStatus=partial, check server logs for the [roi-calculator] warning explaining which env var is missing.");
}

main().catch((error) => {
  console.error("[smoke] threw:", error);
  process.exit(1);
});
