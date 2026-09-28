// Server-only MailerLite client for the current API
// (https://connect.mailerlite.com/api). Every MailerLite call in the app goes
// through here so auth, headers and error handling live in one place.
//
// MAILERLITE_TOKEN is the canonical env name. MAILERLITE_API_KEY is what the
// older .env.example and env schema documented, so it is still honoured.

import { redactEmail } from "@/lib/logging/redact-email";

export function getMailerLiteToken(): string | undefined {
  return process.env.MAILERLITE_TOKEN || process.env.MAILERLITE_API_KEY || undefined;
}

// Accept the base with or without the trailing `/api`, since MailerLite's own
// docs quote it as `https://connect.mailerlite.com/api`.
function apiUrl(path: string): string {
  const base = (process.env.MAILERLITE_API_BASE || "https://connect.mailerlite.com")
    .replace(/\/+$/, "")
    .replace(/\/api$/, "");
  return `${base}/api${path}`;
}

type ApiResult =
  | { ok: true; status: number; data: unknown }
  | { ok: false; status: number; data: unknown };

async function request(
  token: string,
  path: string,
  init: { method: "GET" | "POST"; body?: unknown },
): Promise<ApiResult> {
  try {
    const res = await fetch(apiUrl(path), {
      method: init.method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    const data: unknown = await res.json().catch(() => null);
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    console.error(`[mailerlite] ${init.method} ${path} failed:`, err);
    return { ok: false, status: 0, data: null };
  }
}

function idOf(data: unknown): string | undefined {
  const id = (data as { data?: { id?: unknown } } | null)?.data?.id;
  return id === undefined || id === null ? undefined : String(id);
}

// MailerLite's current API has no tags; groups are the equivalent. Group ids
// are stable, so a resolved name is cached for the life of the instance.
const groupIds = new Map<string, string>();

export async function getOrCreateGroupId(name: string): Promise<string | undefined> {
  const cached = groupIds.get(name);
  if (cached) return cached;

  const token = getMailerLiteToken();
  if (!token) return undefined;

  // filter[name] is a partial match, so pick the exact name out of the page.
  const found = await request(
    token,
    `/groups?filter[name]=${encodeURIComponent(name)}&limit=100`,
    { method: "GET" },
  );
  if (found.ok) {
    const groups = (found.data as { data?: { id: unknown; name: unknown }[] } | null)?.data ?? [];
    const match = groups.find((g) => g.name === name);
    if (match) {
      groupIds.set(name, String(match.id));
      return String(match.id);
    }
  }

  const created = await request(token, "/groups", { method: "POST", body: { name } });
  const id = created.ok ? idOf(created.data) : undefined;
  if (!id) {
    console.error(`[mailerlite] could not resolve group "${name}" (${created.status})`);
    return undefined;
  }
  groupIds.set(name, id);
  return id;
}

export type UpsertResult =
  | { ok: true; id: string }
  | { ok: false; status: number };

// POST /subscribers is a non-destructive upsert: existing subscribers keep
// their other groups and fields. Status is deliberately not sent, so an
// unsubscribed contact is never silently re-activated and the account's
// double opt-in setting still applies to new ones.
export async function upsertSubscriber(input: {
  email: string;
  name?: string;
  groups?: string[];
}): Promise<UpsertResult> {
  const token = getMailerLiteToken();
  if (!token) {
    console.error("[mailerlite] MAILERLITE_TOKEN is not configured");
    return { ok: false, status: 0 };
  }

  const body: Record<string, unknown> = { email: input.email };
  if (input.name) body.fields = { name: input.name };
  if (input.groups?.length) body.groups = input.groups;

  const res = await request(token, "/subscribers", { method: "POST", body });
  const id = res.ok ? idOf(res.data) : undefined;
  if (!id) {
    // Only the names of the fields MailerLite rejected (e.g. "groups.0"),
    // never its messages, which can echo the submitted address.
    const errors = (res.data as { errors?: Record<string, unknown> } | null)?.errors;
    console.error(`[mailerlite] subscriber upsert failed (${res.status})`, {
      email: redactEmail(input.email),
      rejectedFields: errors ? Object.keys(errors) : undefined,
    });
    return { ok: false, status: res.status };
  }
  return { ok: true, id };
}

/**
 * Creates or updates a MailerLite subscriber and, when `tag` is given, adds
 * them to the group of that name (created on first use). Returns false
 * without upserting when the group cannot be resolved, so the caller can
 * fail and be retried rather than leave the buyer outside their group.
 */
export async function upsertMailerLiteSubscriber(params: {
  email: string;
  tag?: string;
  name?: string;
}): Promise<boolean> {
  const { email, tag, name } = params;
  if (!email) return false;

  const groupId = tag ? await getOrCreateGroupId(tag) : undefined;
  if (tag && !groupId) return false;

  const result = await upsertSubscriber({
    email,
    name,
    groups: groupId ? [groupId] : undefined,
  });
  return result.ok;
}
