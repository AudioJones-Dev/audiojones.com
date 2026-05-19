import "server-only";

import type { RoiLeadInput } from "./roi-calculator-schema";

type NotifyArgs = {
  leadId: string;
  lead: RoiLeadInput;
  reportUrl: string;
};

function money(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

export async function notifyRoiCalculatorChannel({ leadId, lead, reportUrl }: NotifyArgs): Promise<"sent" | "skipped" | "failed"> {
  const webhookUrl =
    process.env.ROI_CALCULATOR_NOTIFY_WEBHOOK_URL ||
    process.env.N8N_LEAD_WEBHOOK_URL ||
    process.env.CRM_WEBHOOK_URL;

  if (!webhookUrl) return "skipped";

  const { input, result } = lead;
  const text = `*ROI Calculator lead* — ${input.name} (${input.email}) · ${input.company}\n` +
    `${result.recommendation} · ${money(result.annualSavings)}/yr · readiness ${result.readinessScore}/100 · ${result.confidenceTier} confidence\n` +
    `Report: ${reportUrl}`;

  const payload = {
    event: "roi_calculator_lead_created",
    text,
    lead: {
      id: leadId,
      name: input.name,
      email: input.email,
      company: input.company,
      phone: input.phone,
      industry: input.industry,
      companySize: input.companySize,
      monthlyRevenue: input.monthlyRevenue,
      workflowType: input.workflowType,
      hoursPerWeek: input.hoursPerWeek,
      hourlyCost: input.hourlyCost,
      source: lead.source,
      utm: lead.utm,
    },
    result: {
      recommendation: result.recommendation,
      confidenceTier: result.confidenceTier,
      monthlySavings: result.monthlySavings,
      annualSavings: result.annualSavings,
      paybackMonths: result.paybackMonths,
      readinessScore: result.readinessScore,
      priorityScore: result.priorityScore,
    },
    reportUrl,
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) {
      console.warn("[roi-calculator] notify webhook returned non-2xx", { status: response.status });
      return "failed";
    }
    return "sent";
  } catch (error) {
    console.error("[roi-calculator] notify webhook failed", { leadId, error });
    return "failed";
  }
}
