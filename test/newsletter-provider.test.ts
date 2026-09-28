// Newsletter signups must reach the configured Resend contact boundary or
// visibly fail. Production must never report success through the mock adapter.

import assert from "node:assert/strict";
import test from "node:test";

import { getNewsletterAdapter } from "../src/lib/newsletter/newsletter-storage";
import { newsletterSchema } from "../src/lib/newsletter/newsletter-schema";
import { getOrCreateGroupId, upsertMailerLiteSubscriber } from "../src/lib/integrations/mailerlite";

type Call = { url: string; method: string; headers: Record<string, string>; body: unknown };

async function withEnv(
  env: Record<string, string | undefined>,
  run: () => Promise<void>,
) {
  const previous = new Map<string, string | undefined>();
  for (const [key, value] of Object.entries(env)) {
    previous.set(key, process.env[key]);
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  try {
    await run();
  } finally {
    for (const [key, value] of previous) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

async function withFetch(
  respond: (call: Call) => { status: number; body: unknown },
  run: (calls: Call[]) => Promise<void>,
) {
  const original = globalThis.fetch;
  const calls: Call[] = [];
  globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    const call: Call = {
      url: String(input),
      method: init?.method ?? "GET",
      headers: (init?.headers ?? {}) as Record<string, string>,
      body: init?.body ? JSON.parse(String(init.body)) : undefined,
    };
    calls.push(call);
    const { status, body } = respond(call);
    return new Response(JSON.stringify(body), { status });
  }) as typeof fetch;
  try {
    await run(calls);
  } finally {
    globalThis.fetch = original;
  }
}

const segmentId = "0c48c406-5fa3-46d4-9553-f23680d775e0";
const topicId = "8253f5f9-7d9c-4c6e-b325-0e0ad59b4b82";

const live = {
  NODE_ENV: "production",
  VERCEL_ENV: "production",
  NEWSLETTER_PROVIDER: "resend",
  NEXT_PUBLIC_NEWSLETTER_DISABLED: undefined,
  NEXT_PUBLIC_MAILERLITE_DISABLED: undefined,
  RESEND_API_KEY: "test-token",
  RESEND_NEWSLETTER_SEGMENT_ID: segmentId,
  RESEND_NEWSLETTER_TOPIC_ID: topicId,
  RESEND_NEWSLETTER_EVENT: "audiojones.newsletter.subscribed",
};

test("a new signup creates an opted-in contact and emits the welcome event", async () => {
  await withEnv(live, async () => {
    await withFetch(
      (call) => {
        if (call.method === "GET") return { status: 404, body: { message: "not found" } };
        if (call.url.endsWith("/contacts")) return { status: 201, body: { id: "contact-1" } };
        return { status: 200, body: { event: "audiojones.newsletter.subscribed" } };
      },
      async (calls) => {
        const result = await getNewsletterAdapter().subscribe({
          email: "dana@example.com",
          name: "Dana",
          source: "footer",
          utmSource: "linkedin",
        });

        assert.deepEqual(result, {
          ok: true,
          id: "contact-1",
          provider: "resend",
          automationQueued: true,
        });
        assert.equal(calls.length, 3);
        assert.equal(calls[0].url, "https://api.resend.com/contacts/dana%40example.com");
        assert.equal(calls[0].headers.Authorization, "Bearer test-token");
        assert.deepEqual(calls[1].body, {
          email: "dana@example.com",
          first_name: "Dana",
          segments: [{ id: segmentId }],
          topics: [{ id: topicId, subscription: "opt_in" }],
        });
        assert.deepEqual(calls[2].body, {
          event: "audiojones.newsletter.subscribed",
          email: "dana@example.com",
          payload: { source: "footer", utm_source: "linkedin" },
        });
      },
    );
  });
});

test("an existing newsletter member is opted in without a duplicate welcome event", async () => {
  await withEnv(live, async () => {
    await withFetch(
      (call) => {
        if (call.url.endsWith("/contacts/dana%40example.com")) {
          return { status: 200, body: { id: "contact-1" } };
        }
        if (call.url.endsWith("/segments")) {
          return { status: 200, body: { data: [{ id: segmentId }] } };
        }
        if (call.url.endsWith("/topics")) {
          return { status: 200, body: { data: [{ id: topicId, subscription: "opt_in" }] } };
        }
        return { status: 200, body: { id: "contact-1" } };
      },
      async (calls) => {
        const result = await getNewsletterAdapter().subscribe({ email: "dana@example.com" });
        assert.deepEqual(result, { ok: true, id: "contact-1", provider: "resend" });
        assert.equal(calls.some((call) => call.url.endsWith("/events/send")), false);
        assert.equal(
          calls.some((call) => call.method === "PATCH" && call.url.endsWith("/topics")),
          false,
        );
      },
    );
  });
});

test("an existing contact newly joining the segment receives the welcome event", async () => {
  await withEnv(live, async () => {
    await withFetch(
      (call) => {
        if (call.url.endsWith("/contacts/dana%40example.com")) {
          return { status: 200, body: { id: "contact-1" } };
        }
        if (call.url.endsWith("/segments")) return { status: 200, body: { data: [] } };
        if (call.method === "GET" && call.url.endsWith("/topics")) {
          return { status: 200, body: { data: [] } };
        }
        return { status: 200, body: { id: "contact-1" } };
      },
      async (calls) => {
        const result = await getNewsletterAdapter().subscribe({ email: "dana@example.com" });
        assert.equal(result.ok === true && result.automationQueued, true);
        assert.equal(calls.some((call) => call.url.endsWith(`/segments/${segmentId}`)), true);
        assert.equal(calls.some((call) => call.url.endsWith("/events/send")), true);
        const topicUpdate = calls.findIndex(
          (call) => call.method === "PATCH" && call.url.endsWith("/topics"),
        );
        const segmentAdd = calls.findIndex((call) => call.url.endsWith(`/segments/${segmentId}`));
        assert.ok(topicUpdate >= 0 && topicUpdate < segmentAdd);
      },
    );
  });
});

test("an existing topic opt-out is preserved without changing segment membership", async () => {
  await withEnv(live, async () => {
    await withFetch(
      (call) => {
        if (call.url.endsWith("/contacts/dana%40example.com")) {
          return { status: 200, body: { id: "contact-1" } };
        }
        if (call.url.endsWith("/segments")) return { status: 200, body: { data: [] } };
        if (call.url.endsWith("/topics")) {
          return { status: 200, body: { data: [{ id: topicId, subscription: "opt_out" }] } };
        }
        return { status: 500, body: {} };
      },
      async (calls) => {
        const result = await getNewsletterAdapter().subscribe({
          email: "dana@example.com",
          name: "Unverified replacement",
        });
        assert.deepEqual(result, { ok: true, id: "contact-1", provider: "resend" });
        assert.equal(calls.some((call) => call.method === "PATCH"), false);
        assert.equal(calls.some((call) => call.url.endsWith(`/segments/${segmentId}`)), false);
        assert.equal(calls.some((call) => call.url.endsWith("/events/send")), false);
      },
    );
  });
});

test("a failed segment add can retry after topic consent and still emit the welcome event", async () => {
  await withEnv(live, async () => {
    let topicOptedIn = false;
    let segmentAttempts = 0;
    await withFetch(
      (call) => {
        if (call.url.endsWith("/contacts/dana%40example.com")) {
          return { status: 200, body: { id: "contact-1" } };
        }
        if (call.url.endsWith("/segments")) return { status: 200, body: { data: [] } };
        if (call.method === "GET" && call.url.endsWith("/topics")) {
          return {
            status: 200,
            body: {
              data: topicOptedIn ? [{ id: topicId, subscription: "opt_in" }] : [],
            },
          };
        }
        if (call.method === "PATCH" && call.url.endsWith("/topics")) {
          topicOptedIn = true;
          return { status: 200, body: { id: "contact-1" } };
        }
        if (call.url.endsWith(`/segments/${segmentId}`)) {
          segmentAttempts += 1;
          return segmentAttempts === 1
            ? { status: 503, body: {} }
            : { status: 200, body: { id: "contact-1" } };
        }
        return { status: 200, body: { event: "audiojones.newsletter.subscribed" } };
      },
      async (calls) => {
        const first = await getNewsletterAdapter().subscribe({ email: "dana@example.com" });
        assert.equal(first.ok, false);

        const second = await getNewsletterAdapter().subscribe({ email: "dana@example.com" });
        assert.equal(second.ok === true && second.automationQueued, true);
        assert.equal(
          calls.filter((call) => call.method === "PATCH" && call.url.endsWith("/topics")).length,
          1,
        );
        assert.equal(calls.filter((call) => call.url.endsWith("/events/send")).length, 1);
      },
    );
  });
});

test("a contact API failure is reported, not mocked", async () => {
  await withEnv(live, async () => {
    await withFetch(
      () => ({ status: 401, body: { message: "bad token for dana@example.com" } }),
      async () => {
        const result = await getNewsletterAdapter().subscribe({ email: "dana@example.com" });
        assert.equal(result.ok, false);
        assert.equal(result.ok === false && result.code, "PROVIDER_ERROR");
        assert.ok(result.ok === false && !result.error.includes("dana@example.com"));
      },
    );
  });
});

test("an event outage keeps the durable subscriber and logs only a redacted email", async () => {
  await withEnv(live, async () => {
    await withFetch(
      (call) => {
        if (call.method === "GET") return { status: 404, body: {} };
        if (call.url.endsWith("/contacts")) return { status: 201, body: { id: "contact-1" } };
        return { status: 500, body: { message: "down" } };
      },
      async () => {
        const original = console.error;
        const logged: unknown[][] = [];
        console.error = (...args: unknown[]) => void logged.push(args);
        try {
          const result = await getNewsletterAdapter().subscribe({ email: "dana@example.com" });
          assert.equal(result.ok === true && result.automationQueued, false);
        } finally {
          console.error = original;
        }
        const text = JSON.stringify(logged);
        assert.ok(text.includes("•••@example.com"));
        assert.ok(!text.includes("dana@example.com"));
      },
    );
  });
});

test("production without complete Resend config refuses instead of mocking", async () => {
  await withEnv(
    {
      ...live,
      NEWSLETTER_PROVIDER: undefined,
      RESEND_NEWSLETTER_SEGMENT_ID: undefined,
      RESEND_NEWSLETTER_TOPIC_ID: undefined,
    },
    async () => {
      const result = await getNewsletterAdapter().subscribe({ email: "dana@example.com" });
      assert.equal(result.ok, false);
    },
  );
});

test("development without Resend config uses the mock", async () => {
  await withEnv(
    {
      ...live,
      NODE_ENV: "development",
      VERCEL_ENV: undefined,
      NEWSLETTER_PROVIDER: undefined,
      RESEND_API_KEY: undefined,
      RESEND_NEWSLETTER_SEGMENT_ID: undefined,
      RESEND_NEWSLETTER_TOPIC_ID: undefined,
    },
    async () => {
      const result = await getNewsletterAdapter().subscribe({ email: "dana@example.com" });
      assert.equal(result.ok === true && result.provider, "mock");
    },
  );
});

test("the provider-neutral public flag disables live delivery without a false production success", async () => {
  await withEnv({ ...live, NEXT_PUBLIC_NEWSLETTER_DISABLED: "true" }, async () => {
    const result = await getNewsletterAdapter().subscribe({ email: "dana@example.com" });
    assert.equal(result.ok, false);
  });
});

test("a legacy caller name remains normalized by the newsletter schema", () => {
  const parsed = newsletterSchema.parse({ email: "dana@example.com", name: " Dana " });
  assert.equal(parsed.name, "Dana");
});

// MailerLite remains in scope for Whop buyer groups until that lifecycle path
// is migrated separately. These tests prevent the newsletter change from
// breaking the retained boundary.
const mailerlite = {
  MAILERLITE_TOKEN: "test-token",
  MAILERLITE_API_KEY: undefined,
  MAILERLITE_API_BASE: undefined,
};

test("a Whop tag reuses the MailerLite group with that exact name", async () => {
  await withEnv(mailerlite, async () => {
    await withFetch(
      (call) =>
        call.url.includes("/groups")
          ? {
              status: 200,
              body: { data: [{ id: 5, name: "epm-lab-alumni" }, { id: 6, name: "epm-lab" }] },
            }
          : { status: 200, body: { data: { id: "42" } } },
      async (calls) => {
        const ok = await upsertMailerLiteSubscriber({ email: "dana@example.com", tag: "epm-lab" });
        assert.equal(ok, true);
        const upsert = calls.find((call) => call.url.endsWith("/subscribers"));
        assert.deepEqual(upsert?.body, { email: "dana@example.com", groups: ["6"] });
      },
    );
  });
});

test("a Whop tag whose group cannot be resolved fails without an ungrouped upsert", async () => {
  await withEnv(mailerlite, async () => {
    await withFetch(
      (call) =>
        call.url.includes("/groups")
          ? { status: 500, body: { message: "down" } }
          : { status: 200, body: { data: { id: "42" } } },
      async (calls) => {
        const ok = await upsertMailerLiteSubscriber({
          email: "dana@example.com",
          tag: "unresolvable-group",
        });
        assert.equal(ok, false);
        assert.equal(calls.some((call) => call.url.endsWith("/subscribers")), false);
      },
    );
  });
});

test("a missing MailerLite buyer group is created once", async () => {
  await withEnv(mailerlite, async () => {
    await withFetch(
      (call) => {
        if (call.url.includes("/groups?")) return { status: 200, body: { data: [] } };
        if (call.url.endsWith("/groups")) {
          return { status: 201, body: { data: { id: "77" } } };
        }
        return { status: 200, body: { data: { id: "42" } } };
      },
      async (calls) => {
        assert.equal(await getOrCreateGroupId("new-buyers"), "77");
        assert.equal(await getOrCreateGroupId("new-buyers"), "77");
        const creates = calls.filter((call) => call.method === "POST" && call.url.endsWith("/groups"));
        assert.equal(creates.length, 1);
        assert.deepEqual(creates[0].body, { name: "new-buyers" });
      },
    );
  });
});
