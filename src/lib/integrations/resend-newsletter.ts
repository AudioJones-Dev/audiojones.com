import type { NewsletterInput } from "@/lib/newsletter/newsletter-schema";
import { redactEmail } from "@/lib/logging/redact-email";

const RESEND_API_BASE = process.env.RESEND_API_BASE ?? "https://api.resend.com";
const RESEND_TIMEOUT_MS = 10_000;

type ResendContact = { id: string; unsubscribed?: boolean };
type ResendList<T> = { data?: T[] };
type ResendSegment = { id: string };
type ResendTopicSubscription = {
  id: string;
  subscription: "opt_in" | "opt_out";
};

type ResendRequestResult<T> =
  | { ok: true; status: number; data: T }
  | { ok: false; status: number };

async function resendRequest<T>(
  token: string,
  path: string,
  init: { method?: string; body?: unknown; headers?: Record<string, string> } = {},
): Promise<ResendRequestResult<T>> {
  try {
    const response = await fetch(`${RESEND_API_BASE}${path}`, {
      method: init.method ?? "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        ...(init.body === undefined ? {} : { "Content-Type": "application/json" }),
        ...init.headers,
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
  | { ok: true; id: string; welcomeQueued?: boolean }
  | { ok: false; status: number };

export async function subscribeWithResend(
  input: NewsletterInput,
): Promise<ResendNewsletterResult> {
  const token = process.env.RESEND_API_KEY;
  const segmentId = process.env.RESEND_NEWSLETTER_SEGMENT_ID;
  const topicId = process.env.RESEND_NEWSLETTER_TOPIC_ID;
  const welcomeTemplateId = process.env.RESEND_NEWSLETTER_WELCOME_TEMPLATE_ID;

  if (!token || !segmentId || !topicId || !welcomeTemplateId) {
    console.error("[newsletter resend] configuration incomplete", {
      hasToken: Boolean(token),
      hasSegmentId: Boolean(segmentId),
      hasTopicId: Boolean(topicId),
      hasWelcomeTemplateId: Boolean(welcomeTemplateId),
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
    if (contact.data.unsubscribed) {
      return { ok: true, id: contactId };
    }

    const segments = await resendRequest<ResendList<ResendSegment>>(
      token,
      `/contacts/${encodedEmail}/segments`,
    );
    if (!segments.ok) return { ok: false, status: segments.status };

    const topics = await resendRequest<ResendList<ResendTopicSubscription>>(
      token,
      `/contacts/${encodedEmail}/topics`,
    );
    if (!topics.ok) return { ok: false, status: topics.status };

    const newsletterTopic = topics.data.data?.find((topic) => topic.id === topicId);
    if (newsletterTopic?.subscription === "opt_out") {
      return { ok: true, id: contactId };
    }

    if (!newsletterTopic) {
      const optedIn = await resendRequest<{ id: string }>(token, `/contacts/${encodedEmail}/topics`, {
        method: "PATCH",
        body: [{ id: topicId, subscription: "opt_in" }],
      });
      if (!optedIn.ok) return { ok: false, status: optedIn.status };
    }

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
  } else {
    return { ok: false, status: contact.status };
  }

  if (!newlyJoinedNewsletter) return { ok: true, id: contactId };

  const welcome = await resendRequest<{ id: string }>(token, "/emails", {
    method: "POST",
    headers: { "Idempotency-Key": `audiojones-welcome/${contactId}` },
    body: {
      to: [input.email],
      template: { id: welcomeTemplateId },
      headers: {
        "List-Unsubscribe":
          "<mailto:support@audiojones.com?subject=Unsubscribe%20from%20Audio%20Jones>",
      },
    },
  });

  if (!welcome.ok) {
    // The contact and consent state are durable. A welcome-email outage must
    // not discard the subscriber or encourage duplicate form submissions.
    console.error("[newsletter resend] welcome email failed", {
      status: welcome.status,
      email: redactEmail(input.email),
    });
    return { ok: true, id: contactId, welcomeQueued: false };
  }

  return { ok: true, id: contactId, welcomeQueued: true };
}
