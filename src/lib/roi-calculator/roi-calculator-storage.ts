import "server-only";
import { createHash, randomUUID } from "node:crypto";
import { getSql } from "@/db/neon";
import type { RoiLeadInput } from "./roi-calculator-schema";

export type RoiLeadContext = { ipHash: string | null; userAgent: string | null; emailHash: string };
export type StoredRoiLead = { id: string; provider: "mock" | "neon" };
export type EmailStatus = "sent" | "failed" | "pending";

export function hashValue(value: string | null | undefined): string | null {
  if (!value) return null;
  const salt = process.env.IP_HASH_SALT || "audio-jones-default-salt";
  return createHash("sha256").update(`${salt}:${value.toLowerCase().trim()}`).digest("hex");
}

export interface RoiCalculatorStorageAdapter {
  insertLead(input: RoiLeadInput, ctx: RoiLeadContext): Promise<StoredRoiLead>;
  updateEmailStatus(id: string, statuses: Partial<{ agency: EmailStatus; client: EmailStatus }>): Promise<void>;
}

const mockAdapter: RoiCalculatorStorageAdapter = {
  async insertLead(input, ctx) {
    console.info("[roi-calculator mock] lead accepted", { emailHash: ctx.emailHash, source: input.source, recommendation: input.result.recommendation });
    return { id: `mock-${randomUUID()}`, provider: "mock" };
  },
  async updateEmailStatus(id, statuses) {
    console.info("[roi-calculator mock] email status", { id, statuses });
  },
};

const neonAdapter: RoiCalculatorStorageAdapter = {
  async insertLead(input, ctx) {
    const sql = getSql();
    const rows = (await sql`
      INSERT INTO roi_calculator_leads (
        email, email_hash, ip_hash, user_agent, source,
        utm_source, utm_medium, utm_campaign, utm_term, utm_content,
        input, result
      ) VALUES (
        ${input.email.toLowerCase().trim()}, ${ctx.emailHash}, ${ctx.ipHash}, ${ctx.userAgent}, ${input.source},
        ${input.utm?.utm_source ?? null}, ${input.utm?.utm_medium ?? null}, ${input.utm?.utm_campaign ?? null}, ${input.utm?.utm_term ?? null}, ${input.utm?.utm_content ?? null},
        ${JSON.stringify(input.input)}::jsonb, ${JSON.stringify(input.result)}::jsonb
      ) RETURNING id::text AS id
    `) as Array<{ id: string }>;
    if (!rows[0]?.id) throw new Error("ROI lead insert returned no id");
    return { id: rows[0].id, provider: "neon" };
  },
  async updateEmailStatus(id, statuses) {
    const sql = getSql();
    await sql`
      UPDATE roi_calculator_leads
      SET agency_email_status = COALESCE(${statuses.agency ?? null}, agency_email_status),
          client_email_status = COALESCE(${statuses.client ?? null}, client_email_status),
          updated_at = NOW()
      WHERE id = ${id}
    `;
  },
};

export function getRoiCalculatorStorageAdapter(): RoiCalculatorStorageAdapter {
  if (process.env.DATABASE_URL) return neonAdapter;
  return mockAdapter;
}

// Future adapter seams: CRM, MailerLite, and n8n webhook delivery should attach
// beside this storage adapter after successful persistence, without changing the
// calculator UI or scoring flow.
