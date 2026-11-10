// Lead hand-off payloads written to `lead_outbox` (db/migrations/004).
//
// Built at insert time from the validated form input, so the dispatcher never
// re-reads lead tables and the payload records exactly what was submitted.
// Bump `v` when the shape changes; the dispatcher must keep reading old rows.

export type LeadSource =
  | "apply"
  | "founder_intelligence"
  | "founder_gravity_audit"
  | "roi_calculator";

export type LeadHandoff = {
  v: 1;
  source: LeadSource;
  submittedAt: string;
  contact: {
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    company?: string;
    website?: string;
    jobTitle?: string;
  };
  noteTitle: string;
  noteLines: Array<[label: string, value: string]>;
  // Apply only: CRM map v1.1 creates a review task, not a deal.
  task?: { subject: string; body: string };
};

type Value = string | number | boolean | null | undefined;

function clean(value: Value): string | undefined {
  if (value === null || value === undefined) return undefined;
  const text = String(value).trim();
  return text.length > 0 ? text : undefined;
}

function lines(pairs: Array<[string, Value]>): Array<[string, string]> {
  const out: Array<[string, string]> = [];
  for (const [label, value] of pairs) {
    const text = clean(value);
    if (text !== undefined) out.push([label, text]);
  }
  return out;
}

function contact(fields: LeadHandoff["contact"]): LeadHandoff["contact"] {
  const result: LeadHandoff["contact"] = { email: fields.email.trim().toLowerCase() };
  for (const key of ["firstName", "lastName", "phone", "company", "website", "jobTitle"] as const) {
    const text = clean(fields[key]);
    if (text !== undefined) result[key] = text;
  }
  return result;
}

function splitName(name: string | undefined): { firstName?: string; lastName?: string } {
  const text = clean(name);
  if (!text) return {};
  const [first, ...rest] = text.split(/\s+/);
  return { firstName: first, lastName: rest.length > 0 ? rest.join(" ") : undefined };
}

const now = () => new Date().toISOString();

export function applyHandoff(row: {
  firstName: string;
  lastName: string | null;
  email: string;
  phone: string | null;
  companyName: string;
  website: string | null;
  role: string | null;
  annualRevenueRange: string | null;
  currentGrowthStage: string | null;
  primaryConstraint: string | null;
  teamSize: string | null;
  offer: string | null;
  desiredOutcome: string | null;
  timeline: string | null;
  budgetRange: string | null;
  notes: string | null;
  applySource: string | null;
  sourcePage: string | null;
}): LeadHandoff {
  return {
    v: 1,
    source: "apply",
    submittedAt: now(),
    contact: contact({
      email: row.email,
      firstName: row.firstName,
      lastName: row.lastName ?? undefined,
      phone: row.phone ?? undefined,
      company: row.companyName,
      website: row.website ?? undefined,
      jobTitle: row.role ?? undefined,
    }),
    noteTitle: "Website application (/apply)",
    noteLines: lines([
      ["Offer", row.offer ?? "No offer selected"],
      ["Desired outcome", row.desiredOutcome],
      ["Timeline", row.timeline],
      ["Budget", row.budgetRange],
      ["Annual revenue", row.annualRevenueRange],
      ["Growth stage", row.currentGrowthStage],
      ["Primary constraint", row.primaryConstraint],
      ["Team size", row.teamSize],
      ["Notes", row.notes],
      ["Came from", row.applySource],
      ["Page", row.sourcePage],
    ]),
    task: {
      subject: `Review application: ${row.companyName}`,
      body: "New engagement application from the website. Review fit and reply, or confirm the call they booked.",
    },
  };
}

export function founderIntelligenceHandoff(
  input: {
    firstName: string;
    lastName?: string;
    email: string;
    phone?: string;
    companyName?: string;
    website?: string;
    role?: string;
    biggestPain?: string;
    desiredOutcome?: string;
    timeline?: string;
    budgetRange?: string;
    annualRevenueRange?: string;
    sourcePage?: string;
  },
  scores: { totalScore: number; priority: string },
): LeadHandoff {
  return {
    v: 1,
    source: "founder_intelligence",
    submittedAt: now(),
    contact: contact({
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
      company: input.companyName,
      website: input.website,
      jobTitle: input.role,
    }),
    noteTitle: "Founder Intelligence diagnostic",
    noteLines: lines([
      ["Priority", scores.priority],
      ["Total score", scores.totalScore],
      ["Biggest pain", input.biggestPain],
      ["Desired outcome", input.desiredOutcome],
      ["Timeline", input.timeline],
      ["Budget", input.budgetRange],
      ["Annual revenue", input.annualRevenueRange],
      ["Page", input.sourcePage],
    ]),
  };
}

export function founderGravityAuditHandoff(
  input: { email: string; displayName: string; entityName: string; attribution?: { sourcePage?: string } },
  result: { segment: string; gravityLoad: number; confidenceScore: number; topFragilityZone: string | null },
): LeadHandoff {
  return {
    v: 1,
    source: "founder_gravity_audit",
    submittedAt: now(),
    contact: contact({ email: input.email, ...splitName(input.displayName), company: input.entityName }),
    noteTitle: "Founder Gravity Audit",
    noteLines: lines([
      ["Segment", result.segment],
      ["Gravity load", result.gravityLoad],
      ["Confidence", result.confidenceScore],
      ["Top fragility zone", result.topFragilityZone],
      ["Page", input.attribution?.sourcePage],
    ]),
  };
}

export function roiCalculatorHandoff(
  email: string,
  input: Record<string, unknown>,
  result: Record<string, unknown>,
): LeadHandoff {
  const str = (value: unknown) => (typeof value === "string" || typeof value === "number" ? value : undefined);
  return {
    v: 1,
    source: "roi_calculator",
    submittedAt: now(),
    contact: contact({
      email,
      ...splitName(str(input.name) as string | undefined),
      company: str(input.company) as string | undefined,
      phone: str(input.phone) as string | undefined,
    }),
    noteTitle: "Revenue Leak Scorecard (ROI calculator)",
    noteLines: lines([
      ["Primary leakage scenario", str(result.primaryLeakageScenario)],
      ["Confidence", str(result.confidenceTier)],
      ["Annual savings", str(result.annualSavings)],
      ["Industry", str(input.industry)],
      ["Context", str(input.message)],
    ]),
  };
}
