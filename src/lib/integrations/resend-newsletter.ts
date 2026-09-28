import type { NewsletterInput } from "@/lib/newsletter/newsletter-schema";
import { redactEmail } from "@/lib/logging/redact-email";

const RESEND_API_BASE = process.env.RESEND_API_BASE ?? "https://api.resend.com";
const RESEND_TIMEOUT_MS = 10_000;

export const DEFAULT_NEWSLETTER_EVENT = "audiojones.newsletter.subscribed";

type ResendContact = { id: string };
type ResendList<T> = { data?: T[] };
type ResendSegment = { id: string };

type ResendRequestResult<T> =
  | { ok: true; status: number; data: T }
  | { ok: false; status: number };

async function resendRequest<T>(
  token: string,
  path: string,
  init: { method?: string; body?: unknown } = {},
): Promise<ResendRequestResult<T>> {
  try {
    const response = await fetch(`${RESEND_API_BASE}${path}`, {
      method: init.method ?? "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        ...(init.body === undefined ? {} : { "Content-Type": "application/json" }),
      },
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
      cache: "no-store",
      signal: AbortSignal.timeout(RESEND_TIMEOUT_MS),
    });

    if (!response.ok) return { ok: false, status: response.status };
    return { ok: true, status: response.status, data: (await response.json()) as T };
  } catch {
    return { ok: false, status: 0 };
  }
}

export type ResendNewsletterResult =
  | { ok: true; id: string; automationQueued?: boolean }
  | { ok: false; status: number };

export async function subscribeWithResend(
  input: NewsletterInput,
): Promise<ResendNewsletterResult> {
  const token = process.env.RESEND_API_KEY;
  const segmentId = process.env.RESEND_NEWSLETTER_SEGMENT_ID;
  const topicId = process.env.RESEND_NEWSLETTER_TOPIC_ID;
  const eventName = process.env.RESEND_NEWSLETTER_EVENT || DEFAULT_NEWSLETTER_EVENT;

  if (!token || !segmentId || !topicId) {
    console.error("[newsletter resend] configuration incomplete", {
      hasToken: Boolean(token),
      hasSegmentId: Boolean(segmentId),
      hasTopicId: Boolean(topicId),
    });
    return { ok: false, status: 0 };
  }

  const encodedEmail = encodeURIComponent(input.email);
  const contact = await resendRequest<ResendContact>(token, `/contacts/${encodedEmail}`);
  let contactId: string;
  let newlyJoinedNewsletter = false;

  if (!contact.ok && contact.status === 404) {
    const created = await resendRequest<ResendContact>(token, "/contacts", {
      method: "POST",
      body: {
        email: input.email,
        ...(input.name ? { first_name: input.name } : {}),
        segments: [{ id: segmentId }],
        topics: [{ id: topicId, subscription: "opt_in" }],
      },
    });
    if (!created.ok) return { ok: false, status: created.status };
    contactId = created.data.id;
    newlyJoinedNewsletter = true;
  } else if (contact.ok) {
    contactId = contact.data.id;

    if (input.name) {
      const updated = await resendRequest<ResendContact>(token, `/contacts/${encodedEmail}`, {
        method: "PATCH",
        body: { first_name: input.name },
      });
      if (!updated.ok) return { ok: false, status: updated.status };
    }

    const segments = await resendRequest<ResendList<ResendSegment>>(
      token,
      `/contacts/${encodedEmail}/segments`,
    );
    if (!segments.ok) return { ok: false, status: segments.status };

    const alreadyInSegment = segments.data.data?.some((segment) => segment.id === segmentId) ?? false;
    if (!alreadyInSegment) {
      const added = await resendRequest<{ id: string }>(
        token,
        `/contacts/${encodedEmail}/segments/${encodeURIComponent(segmentId)}`,
        { method: "POST" },
      );
      if (!added.ok) return { ok: false, status: added.status };
      newlyJoinedNewsletter = true;
    }

    const optedIn = await resendRequest<{ id: string }>(token, `/contacts/${encodedEmail}/topics`, {
      method: "PATCH",
      body: [{ id: topicId, subscription: "opt_in" }],
    });
    if (!optedIn.ok) return { ok: false, status: optedIn.status };
  } else {
    return { ok: false, status: contact.status };
  }

  if (!newlyJoinedNewsletter) return { ok: true, id: contactId };

  const event = await resendRequest<{ event: string }>(token, "/events/send", {
    method: "POST",
    body: {
      event: eventName,
      email: input.email,
      payload: {
        source: input.source ?? "direct",
        ...(input.utmSource ? { utm_source: input.utmSource } : {}),
        ...(input.utmMedium ? { utm_medium: input.utmMedium } : {}),
        ...(input.utmCampaign ? { utm_campaign: input.utmCampaign } : {}),
      },
    },
  });

  if (!event.ok) {
    // The contact and consent state are durable. A welcome-event outage must
    // not discard the subscriber or encourage duplicate form submissions.
    console.error("[newsletter resend] automation event failed", {
      status: event.status,
      email: redactEmail(input.email),
      event: eventName,
    });
    return { ok: true, id: contactId, automationQueued: false };
  }

  return { ok: true, id: contactId, automationQueued: true };
}
