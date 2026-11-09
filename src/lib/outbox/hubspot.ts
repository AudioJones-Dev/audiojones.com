// Minimal HubSpot CRM client for the lead outbox. Server-only; reads
// HUBSPOT_ACCESS_TOKEN (private app token or service key).
//
// Contact upsert by email is idempotent. Note and task creation are not, so
// the dispatcher stores each returned id before moving on.

import "server-only";
import type { LeadHandoff } from "./handoff";

const BASE = "https://api.hubapi.com";
const TIMEOUT_MS = 10_000;
// HubSpot-defined association types (crm/v3 notes and tasks guides).
const NOTE_TO_CONTACT = 202;
const TASK_TO_CONTACT = 204;

export class HubSpotError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "HubSpotError";
  }

  // 429 and 5xx are worth retrying; other 4xx mean the request itself is bad.
  get retryable(): boolean {
    return this.status === 429 || this.status >= 500;
  }
}

export function hubspotConfigured(): boolean {
  return Boolean(process.env.HUBSPOT_ACCESS_TOKEN);
}

async function call<T>(path: string, body: unknown): Promise<T> {
  const token = process.env.HUBSPOT_ACCESS_TOKEN;
  if (!token) throw new HubSpotError("HUBSPOT_ACCESS_TOKEN is not set", 503);
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (err) {
    throw new HubSpotError(`network: ${err instanceof Error ? err.message : String(err)}`, 599);
  }
  const text = await res.text();
  if (!res.ok) throw new HubSpotError(`${path} ${res.status}: ${text.slice(0, 500)}`, res.status);
  return (text ? JSON.parse(text) : {}) as T;
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function upsertContact(handoff: LeadHandoff): Promise<string> {
  const c = handoff.contact;
  const properties: Record<string, string> = { email: c.email };
  if (c.firstName) properties.firstname = c.firstName;
  if (c.lastName) properties.lastname = c.lastName;
  if (c.phone) properties.phone = c.phone;
  if (c.company) properties.company = c.company;
  if (c.website) properties.website = c.website;
  if (c.jobTitle) properties.jobtitle = c.jobTitle;

  const data = await call<{ results?: Array<{ id: string }> }>(
    "/crm/v3/objects/contacts/batch/upsert",
    { inputs: [{ id: c.email, idProperty: "email", properties }] },
  );
  const id = data.results?.[0]?.id;
  if (!id) throw new HubSpotError("contact upsert returned no id", 502);
  return id;
}

export async function createNote(handoff: LeadHandoff, contactId: string): Promise<string> {
  const body = [
    `<strong>${escapeHtml(handoff.noteTitle)}</strong>`,
    ...handoff.noteLines.map(([label, value]) => `${escapeHtml(label)}: ${escapeHtml(value)}`),
  ].join("<br>");
  const data = await call<{ id: string }>("/crm/v3/objects/notes", {
    properties: { hs_timestamp: handoff.submittedAt, hs_note_body: body },
    associations: [
      { to: { id: contactId }, types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: NOTE_TO_CONTACT }] },
    ],
  });
  return data.id;
}

export async function createTask(handoff: LeadHandoff, contactId: string): Promise<string | null> {
  if (!handoff.task) return null;
  const due = new Date(new Date(handoff.submittedAt).getTime() + 24 * 60 * 60 * 1000).toISOString();
  const data = await call<{ id: string }>("/crm/v3/objects/tasks", {
    properties: {
      hs_timestamp: due,
      hs_task_subject: handoff.task.subject,
      hs_task_body: handoff.task.body,
      hs_task_status: "NOT_STARTED",
      hs_task_priority: "HIGH",
      hs_task_type: "TODO",
    },
    associations: [
      { to: { id: contactId }, types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: TASK_TO_CONTACT }] },
    ],
  });
  return data.id;
}
