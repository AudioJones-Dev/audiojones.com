// Incident persistence — public /status feed + admin incident tooling.
//
// Reads/writes the `incidents`, `runbooks`, and `incident_subscriptions`
// tables on NeonDB. Schema lives in db/migrations/003_incidents.sql.
// Business logic (titles, notifications, timeline capping) stays in
// src/lib/server/incidents.ts; this module is queries only.

import "server-only";
import type {
  Incident,
  IncidentSubscription,
  IncidentTimelineEvent,
  Runbook,
} from "@/lib/server/incidents";
import { getSql } from "./neon";

const INCIDENT_COLUMNS = `
  id::text AS id,
  title,
  status::text AS status,
  severity::text AS severity,
  priority,
  source,
  description,
  affected_components,
  related_alert_ids,
  timeline,
  runbook_id::text AS runbook_id,
  created_at,
  updated_at,
  resolved_at
`;

type IncidentRow = {
  id: string;
  title: string;
  status: Incident["status"];
  severity: Incident["severity"];
  priority: string | null;
  source: string;
  description: string | null;
  affected_components: unknown;
  related_alert_ids: unknown;
  timeline: unknown;
  runbook_id: string | null;
  created_at: Date | string;
  updated_at: Date | string;
  resolved_at: Date | string | null;
};

function toIso(value: Date | string): string {
  return value instanceof Date
    ? value.toISOString()
    : new Date(value).toISOString();
}

function toStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((v): v is string => typeof v === "string")
    : [];
}

function rowToIncident(row: IncidentRow): Incident {
  const incident: Incident = {
    id: row.id,
    title: row.title,
    status: row.status,
    severity: row.severity,
    source: row.source,
    related_alert_ids: toStringArray(row.related_alert_ids),
    timeline: Array.isArray(row.timeline)
      ? (row.timeline as IncidentTimelineEvent[])
      : [],
    created_at: toIso(row.created_at),
    updated_at: toIso(row.updated_at),
  };
  if (row.priority) {
    incident.priority = row.priority as Incident["priority"];
  }
  if (row.description) {
    incident.description = row.description;
  }
  const components = toStringArray(row.affected_components);
  if (components.length > 0) {
    incident.affected_components = components;
  }
  if (row.runbook_id) {
    incident.runbook_id = row.runbook_id;
  }
  if (row.resolved_at) {
    incident.resolved_at = toIso(row.resolved_at);
  }
  return incident;
}

export async function insertIncident(
  incident: Omit<Incident, "id">,
): Promise<string> {
  const sql = getSql();
  const rows = (await sql.query(
    `INSERT INTO incidents (
       title, status, severity, priority, source, description,
       affected_components, related_alert_ids, timeline
     ) VALUES (
       $1, $2::incident_status, $3::incident_severity, $4, $5, $6,
       $7::jsonb, $8::jsonb, $9::jsonb
     )
     RETURNING id::text AS id`,
    [
      incident.title,
      incident.status,
      incident.severity,
      incident.priority ?? null,
      incident.source,
      incident.description ?? null,
      JSON.stringify(incident.affected_components ?? []),
      JSON.stringify(incident.related_alert_ids ?? []),
      JSON.stringify(incident.timeline ?? []),
    ],
  )) as Array<{ id: string }>;

  const row = rows[0];
  if (!row) {
    throw new Error("Incident insert returned no rows");
  }
  return row.id;
}

export async function getIncidentById(id: string): Promise<Incident | null> {
  const sql = getSql();
  const rows = (await sql.query(
    `SELECT ${INCIDENT_COLUMNS} FROM incidents WHERE id = $1::uuid`,
    [id],
  )) as IncidentRow[];
  return rows[0] ? rowToIncident(rows[0]) : null;
}

export async function listIncidentRecords(
  options: {
    status?: Incident["status"];
    source?: string;
    sinceIso?: string;
    limit?: number;
  } = {},
): Promise<Incident[]> {
  const sql = getSql();
  const limit = Math.max(1, Math.min(options.limit ?? 50, 200));
  const rows = (await sql.query(
    `SELECT ${INCIDENT_COLUMNS}
     FROM incidents
     WHERE ($1::text IS NULL OR status = $1::incident_status)
       AND ($2::text IS NULL OR source = $2)
       AND ($3::timestamptz IS NULL OR updated_at >= $3::timestamptz)
     ORDER BY updated_at DESC
     LIMIT $4`,
    [options.status ?? null, options.source ?? null, options.sinceIso ?? null, limit],
  )) as IncidentRow[];
  return rows.map(rowToIncident);
}

export async function findOpenIncidentRecordBySource(
  source: string,
): Promise<Incident | null> {
  const sql = getSql();
  const rows = (await sql.query(
    `SELECT ${INCIDENT_COLUMNS}
     FROM incidents
     WHERE source = $1 AND status <> 'resolved'
     ORDER BY created_at DESC
     LIMIT 1`,
    [source],
  )) as IncidentRow[];
  return rows[0] ? rowToIncident(rows[0]) : null;
}

export async function updateIncidentTimeline(
  id: string,
  timeline: IncidentTimelineEvent[],
): Promise<void> {
  const sql = getSql();
  await sql.query(
    `UPDATE incidents SET timeline = $2::jsonb WHERE id = $1::uuid`,
    [id, JSON.stringify(timeline)],
  );
}

export async function updateIncidentStatusRecord(
  id: string,
  status: Incident["status"],
): Promise<void> {
  const sql = getSql();
  await sql.query(
    `UPDATE incidents
     SET status = $2::incident_status,
         resolved_at = CASE WHEN $2 = 'resolved' THEN NOW() ELSE NULL END
     WHERE id = $1::uuid`,
    [id, status],
  );
}

export async function attachIncidentRunbook(
  id: string,
  runbookId: string,
): Promise<void> {
  const sql = getSql();
  await sql.query(
    `UPDATE incidents SET runbook_id = $2::uuid WHERE id = $1::uuid`,
    [id, runbookId],
  );
}

export async function findActiveRunbookBySource(
  source: string,
): Promise<(Runbook & { id: string }) | null> {
  const sql = getSql();
  const rows = (await sql.query(
    `SELECT id::text AS id, name, source, steps, active,
            created_at, updated_at
     FROM runbooks
     WHERE source = $1 AND active
     LIMIT 1`,
    [source],
  )) as Array<{
    id: string;
    name: string;
    source: string;
    steps: unknown;
    active: boolean;
    created_at: Date | string;
    updated_at: Date | string;
  }>;
  const row = rows[0];
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    source: row.source,
    steps: toStringArray(row.steps),
    active: row.active,
    created_at: toIso(row.created_at),
    updated_at: toIso(row.updated_at),
  };
}

// ---------------------------------------------------------------------------
// Subscriptions
// ---------------------------------------------------------------------------

type SubscriptionRow = {
  incident_id: string;
  subscriber: string;
  channel: IncidentSubscription["channel"];
  active: boolean;
  preferences: unknown;
  created_by: string | null;
  created_at: Date | string;
};

function rowToSubscription(row: SubscriptionRow): IncidentSubscription {
  const subscription: IncidentSubscription = {
    incident_id: row.incident_id,
    subscriber: row.subscriber,
    channel: row.channel,
    active: row.active,
    created_at: toIso(row.created_at),
  };
  if (row.created_by) {
    subscription.created_by = row.created_by;
  }
  if (row.preferences && typeof row.preferences === "object") {
    subscription.preferences =
      row.preferences as IncidentSubscription["preferences"];
  }
  return subscription;
}

const SUBSCRIPTION_COLUMNS = `
  incident_id::text AS incident_id,
  subscriber,
  channel,
  active,
  preferences,
  created_by,
  created_at
`;

export async function getSubscriptionRecord(
  subscriptionId: string,
): Promise<IncidentSubscription | null> {
  const sql = getSql();
  const rows = (await sql.query(
    `SELECT ${SUBSCRIPTION_COLUMNS} FROM incident_subscriptions WHERE id = $1`,
    [subscriptionId],
  )) as SubscriptionRow[];
  return rows[0] ? rowToSubscription(rows[0]) : null;
}

export async function upsertSubscriptionRecord(
  subscriptionId: string,
  subscription: IncidentSubscription,
): Promise<void> {
  const sql = getSql();
  await sql.query(
    `INSERT INTO incident_subscriptions (
       id, incident_id, subscriber, channel, active, preferences, created_by
     ) VALUES ($1, $2::uuid, $3, $4, TRUE, $5::jsonb, $6)
     ON CONFLICT (id) DO UPDATE SET
       active = TRUE,
       preferences = EXCLUDED.preferences,
       created_by = EXCLUDED.created_by,
       created_at = NOW(),
       unsubscribed_at = NULL`,
    [
      subscriptionId,
      subscription.incident_id,
      subscription.subscriber,
      subscription.channel,
      JSON.stringify(subscription.preferences ?? {}),
      subscription.created_by ?? null,
    ],
  );
}

export async function deactivateSubscriptionRecord(
  subscriptionId: string,
): Promise<boolean> {
  const sql = getSql();
  const rows = (await sql.query(
    `UPDATE incident_subscriptions
     SET active = FALSE, unsubscribed_at = NOW()
     WHERE id = $1
     RETURNING id`,
    [subscriptionId],
  )) as Array<{ id: string }>;
  return rows.length > 0;
}

export async function listActiveSubscriptionsForIncident(
  incidentId: string,
): Promise<IncidentSubscription[]> {
  const sql = getSql();
  const rows = (await sql.query(
    `SELECT ${SUBSCRIPTION_COLUMNS}
     FROM incident_subscriptions
     WHERE incident_id = $1::uuid AND active`,
    [incidentId],
  )) as SubscriptionRow[];
  return rows.map(rowToSubscription);
}

export async function listActiveSubscriptionsForSubscriber(
  subscriber: string,
): Promise<IncidentSubscription[]> {
  const sql = getSql();
  const rows = (await sql.query(
    `SELECT ${SUBSCRIPTION_COLUMNS}
     FROM incident_subscriptions
     WHERE subscriber = $1 AND active
     ORDER BY created_at DESC`,
    [subscriber],
  )) as SubscriptionRow[];
  return rows.map(rowToSubscription);
}
