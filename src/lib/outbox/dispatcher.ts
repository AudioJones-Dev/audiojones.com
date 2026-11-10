// Delivers `lead_outbox` rows to HubSpot (db/migrations/004).
//
// At-least-once with effectively-once outcomes: rows are claimed with a lease
// (FOR UPDATE SKIP LOCKED, so overlapping runs never take the same row), each
// HubSpot id is saved the moment it exists, and a retry resumes from the
// first missing step. A crash between creating a note/task and saving its id
// can still duplicate that one note/task; the contact never duplicates
// (upsert by email).

import "server-only";
import { getSql } from "@/db/neon";
import type { LeadHandoff } from "./handoff";
import { createNote, createTask, hubspotConfigured, HubSpotError, upsertContact } from "./hubspot";

const LEASE = "2 minutes";
const MAX_ATTEMPTS = 8;
// Minutes before attempt n+1 (index = attempts so far, 1-based).
const BACKOFF_MINUTES = [0, 1, 5, 15, 60, 180, 720, 1440];

type OutboxRow = {
  id: string;
  event_key: string;
  payload: LeadHandoff;
  attempts: number;
  hubspot_contact_id: string | null;
  hubspot_note_id: string | null;
  hubspot_task_id: string | null;
};

export type DispatchSummary = {
  skipped?: "disabled" | "hubspot_not_configured";
  claimed: number;
  delivered: number;
  retrying: number;
  failed: number;
};

export function dispatchEnabled(): boolean {
  return process.env.LEAD_OUTBOX_DISPATCH !== "off" && hubspotConfigured();
}

export async function dispatchLeadOutbox(limit = 10): Promise<DispatchSummary> {
  const summary: DispatchSummary = { claimed: 0, delivered: 0, retrying: 0, failed: 0 };
  if (process.env.LEAD_OUTBOX_DISPATCH === "off") return { ...summary, skipped: "disabled" };
  // Without a token, rows stay pending and are delivered once it is set.
  if (!hubspotConfigured()) return { ...summary, skipped: "hubspot_not_configured" };

  const sql = getSql();
  const rows = (await sql`
    UPDATE lead_outbox
       SET status = 'processing',
           locked_until = NOW() + ${LEASE}::interval,
           attempts = attempts + 1,
           updated_at = NOW()
     WHERE id IN (
       SELECT id FROM lead_outbox
        WHERE (status = 'pending' AND next_attempt_at <= NOW())
           OR (status = 'processing' AND locked_until < NOW())
        ORDER BY created_at
        LIMIT ${limit}
        FOR UPDATE SKIP LOCKED
     )
     RETURNING id::text AS id, event_key, payload, attempts,
               hubspot_contact_id, hubspot_note_id, hubspot_task_id
  `) as OutboxRow[];
  summary.claimed = rows.length;

  for (const row of rows) {
    try {
      await deliver(row);
      summary.delivered += 1;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const permanent = err instanceof HubSpotError && !err.retryable;
      const exhausted = row.attempts >= MAX_ATTEMPTS;
      if (permanent || exhausted) {
        summary.failed += 1;
        await sql`
          UPDATE lead_outbox
             SET status = 'failed', last_error = ${message}, locked_until = NULL, updated_at = NOW()
           WHERE id = ${row.id}::uuid
        `;
        console.error("[lead-outbox] delivery failed permanently", { eventKey: row.event_key, attempts: row.attempts, error: message });
      } else {
        summary.retrying += 1;
        const waitMinutes = BACKOFF_MINUTES[Math.min(row.attempts, BACKOFF_MINUTES.length - 1)];
        await sql`
          UPDATE lead_outbox
             SET status = 'pending', last_error = ${message}, locked_until = NULL,
                 next_attempt_at = NOW() + ${`${waitMinutes} minutes`}::interval, updated_at = NOW()
           WHERE id = ${row.id}::uuid
        `;
        console.warn("[lead-outbox] delivery will retry", { eventKey: row.event_key, attempts: row.attempts, waitMinutes, error: message });
      }
    }
  }
  return summary;
}

// Fast path after a submission so HubSpot updates within seconds; the cron
// run is the safety net. Never throws: a failure here only delays delivery.
export async function kickLeadOutbox(): Promise<void> {
  try {
    await dispatchLeadOutbox(5);
  } catch (err) {
    console.warn("[lead-outbox] immediate dispatch failed; cron will retry", {
      error: err instanceof Error ? err.message : String(err),
    });
  }
}

async function deliver(row: OutboxRow): Promise<void> {
  const sql = getSql();
  const handoff = row.payload;

  let contactId = row.hubspot_contact_id;
  if (!contactId) {
    contactId = await upsertContact(handoff);
    await sql`UPDATE lead_outbox SET hubspot_contact_id = ${contactId}, updated_at = NOW() WHERE id = ${row.id}::uuid`;
  }
  if (!row.hubspot_note_id) {
    const noteId = await createNote(handoff, contactId);
    await sql`UPDATE lead_outbox SET hubspot_note_id = ${noteId}, updated_at = NOW() WHERE id = ${row.id}::uuid`;
  }
  if (handoff.task && !row.hubspot_task_id) {
    const taskId = await createTask(handoff, contactId);
    if (taskId) {
      await sql`UPDATE lead_outbox SET hubspot_task_id = ${taskId}, updated_at = NOW() WHERE id = ${row.id}::uuid`;
    }
  }
  await sql`
    UPDATE lead_outbox
       SET status = 'delivered', delivered_at = NOW(), locked_until = NULL, last_error = NULL, updated_at = NOW()
     WHERE id = ${row.id}::uuid
  `;
}
