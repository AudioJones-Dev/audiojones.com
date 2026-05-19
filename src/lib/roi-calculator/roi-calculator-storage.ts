import "server-only";

import { createHash, randomUUID } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import type { RoiLeadInput } from "./roi-calculator-schema";

export type PersistLeadArgs = {
  lead: RoiLeadInput;
  ip: string | null;
  userAgent: string | null;
};

export type PersistLeadResult = {
  ok: true;
  leadId: string;
  provider: "mock" | "neon";
} | {
  ok: false;
  code: "PROVIDER_ERROR";
};

function hash(value: string | null | undefined) {
  const salt = process.env.IP_HASH_SALT;
  if (!value || !salt) return null;
  return createHash("sha256").update(`${value}:${salt}`).digest("hex");
}

function redactEmail(email: string) {
  return email.replace(/(.).+(@.+)/, "$1•••$2");
}

export function getEmailHash(email: string) {
  return hash(email.toLowerCase()) ?? createHash("sha256").update(email.toLowerCase()).digest("hex");
}

export function getIpHash(ip: string | null) {
  return hash(ip);
}

export async function persistRoiCalculatorLead({ lead, ip, userAgent }: PersistLeadArgs): Promise<PersistLeadResult> {
  const emailHash = getEmailHash(lead.email);
  const ipHash = getIpHash(ip);
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    if (process.env.NODE_ENV === "production") {
      console.error("[roi-calculator] DATABASE_URL missing; production persistence refused");
      return { ok: false, code: "PROVIDER_ERROR" };
    }

    const leadId = `mock-${randomUUID()}`;
    console.warn("[roi-calculator mock] lead accepted without database persistence", {
      leadId,
      email: redactEmail(lead.email),
      source: lead.source,
    });
    return { ok: true, leadId, provider: "mock" };
  }

  try {
    const sql = neon(databaseUrl);
    const leadId = randomUUID();
    await sql`
      insert into roi_calculator_leads (
        id,
        email,
        email_hash,
        ip_hash,
        user_agent,
        source,
        utm_source,
        utm_medium,
        utm_campaign,
        utm_term,
        utm_content,
        input,
        result,
        agency_email_status,
        client_email_status
      ) values (
        ${leadId},
        ${lead.email.toLowerCase()},
        ${emailHash},
        ${ipHash},
        ${userAgent},
        ${lead.source ?? "roi-calculator-page"},
        ${lead.utm?.utm_source ?? null},
        ${lead.utm?.utm_medium ?? null},
        ${lead.utm?.utm_campaign ?? null},
        ${lead.utm?.utm_term ?? null},
        ${lead.utm?.utm_content ?? null},
        ${JSON.stringify(lead.input)},
        ${JSON.stringify(lead.result)},
        'pending',
        'pending'
      )
    `;
    return { ok: true, leadId, provider: "neon" };
  } catch (error) {
    console.error("[roi-calculator] failed to persist lead", error);
    return { ok: false, code: "PROVIDER_ERROR" };
  }
}

export type StoredRoiLead = {
  id: string;
  email: string;
  source: string | null;
  input: RoiLeadInput["input"];
  result: RoiLeadInput["result"];
  createdAt: string;
};

export async function getRoiCalculatorLead(leadId: string): Promise<StoredRoiLead | null> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return null;

  try {
    const sql = neon(databaseUrl);
    const rows = (await sql`
      select id, email, source, input, result, created_at
      from roi_calculator_leads
      where id = ${leadId}
      limit 1
    `) as Array<{
      id: string;
      email: string;
      source: string | null;
      input: RoiLeadInput["input"];
      result: RoiLeadInput["result"];
      created_at: string | Date;
    }>;

    const row = rows[0];
    if (!row) return null;

    const createdAt = row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at);
    return {
      id: row.id,
      email: row.email,
      source: row.source,
      input: row.input,
      result: row.result,
      createdAt,
    };
  } catch (error) {
    console.error("[roi-calculator] failed to read lead", { leadId, error });
    return null;
  }
}

export async function updateRoiLeadEmailStatus({
  leadId,
  agencyEmailStatus,
  clientEmailStatus,
}: {
  leadId: string;
  agencyEmailStatus?: string;
  clientEmailStatus?: string;
}) {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl || leadId.startsWith("mock-")) return;

  try {
    const sql = neon(databaseUrl);
    await sql`
      update roi_calculator_leads
      set
        agency_email_status = coalesce(${agencyEmailStatus ?? null}, agency_email_status),
        client_email_status = coalesce(${clientEmailStatus ?? null}, client_email_status),
        updated_at = now()
      where id = ${leadId}
    `;
  } catch (error) {
    console.error("[roi-calculator] failed to update email status", { leadId, error });
  }
}
