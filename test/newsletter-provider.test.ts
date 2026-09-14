// The newsletter selector must never hand back an adapter that answers
// success when nobody was subscribed. NewsletterForm renders ok:true as
// "Subscribed." in the footer of every page, and each case below is a path
// that used to discard a signup behind that message: an unset provider, a
// mock in production, a missing token, a MailerLite error. The /apply
// equivalent is test/apply-provider.test.ts.

import assert from "node:assert/strict";
import test from "node:test";

import {
  createNeonAdapter,
  getNewsletterAdapter,
  type NewsletterStore,
} from "../src/lib/newsletter/newsletter-storage";
import type { MailerLiteSyncOutcome } from "../src/lib/newsletter/newsletter-row";
import type { NewsletterInput } from "../src/lib/newsletter/newsletter-schema";

const input: NewsletterInput = { email: "dana@example.com", source: "footer" };
const ctx = { ipHash: "abc123", userAgent: "test-agent" };

const PRODUCTION = { NODE_ENV: "production", VERCEL_ENV: "production" };
const PREVIEW = { NODE_ENV: "production", VERCEL_ENV: "preview" };

// Every variable the selector reads, cleared, so a value in the shell running
// the tests cannot change an outcome.
const CLEAN = {
  NEWSLETTER_PROVIDER: undefined,
  DATABASE_URL: undefined,
  MAILERLITE_TOKEN: undefined,
  MAILERLITE_API_KEY: undefined,
  MAILERLITE_GROUP_ID: undefined,
  NEXT_PUBLIC_MAILERLITE_DISABLED: undefined,
};

// The selector reads process.env on every call, so each case restores what it
// changed rather than relying on ordering.
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

type FetchCall = { url: string; init?: RequestInit };

// No case may reach the network. The stub records what the adapter tried to
// send and answers with `respond`, which lets the MailerLite path be driven
// through each failure without a real request.
async function withFetch(
  respond: () => Response,
  run: (calls: FetchCall[]) => Promise<void>,
) {
  const original = globalThis.fetch;
  const calls: FetchCall[] = [];
  globalThis.fetch = (async (url: RequestInfo | URL, init?: RequestInit) => {
    calls.push({ url: String(url), init });
    return respond();
  }) as typeof fetch;
  try {
    await run(calls);
  } finally {
    globalThis.fetch = original;
  }
}

const unreachable = (): never => {
  throw new Error("unexpected network call");
};

for (const provider of [undefined, "", "mock", "convertkit"]) {
  const label = provider === undefined ? "unset" : `"${provider}"`;
  test(`production refuses a provider that subscribes nobody (${label})`, async () => {
    await withEnv({ ...CLEAN, ...PRODUCTION, NEWSLETTER_PROVIDER: provider }, () =>
      withFetch(unreachable, async (calls) => {
        const result = await getNewsletterAdapter().subscribe(input, ctx);
        assert.equal(result.ok, false, `${label} must not report success in production`);
        assert.equal(result.ok === false && result.code, "PROVIDER_ERROR");
        assert.equal(calls.length, 0);
      }),
    );
  });
}

test("production refuses NEXT_PUBLIC_MAILERLITE_DISABLED even with MailerLite configured", async () => {
  await withEnv(
    {
      ...CLEAN,
      ...PRODUCTION,
      NEWSLETTER_PROVIDER: "mailerlite",
      MAILERLITE_TOKEN: "test-token",
      NEXT_PUBLIC_MAILERLITE_DISABLED: "true",
    },
    () =>
      withFetch(unreachable, async (calls) => {
        const result = await getNewsletterAdapter().subscribe(input, ctx);
        assert.equal(result.ok, false);
        assert.equal(calls.length, 0);
      }),
  );
});

// Runtime reads MAILERLITE_TOKEN. The env schema and verifier used to check
// MAILERLITE_API_KEY, so an operator could set only that name and get mock.
test("production refuses mailerlite when only MAILERLITE_API_KEY is set", async () => {
  await withEnv(
    { ...CLEAN, ...PRODUCTION, NEWSLETTER_PROVIDER: "mailerlite", MAILERLITE_API_KEY: "test-key" },
    () =>
      withFetch(unreachable, async (calls) => {
        const result = await getNewsletterAdapter().subscribe(input, ctx);
        assert.equal(result.ok, false);
        assert.equal(result.ok === false && result.code, "PROVIDER_ERROR");
        assert.equal(calls.length, 0);
      }),
  );
});

test("mailerlite without a token refuses even in local development", async () => {
  await withEnv(
    { ...CLEAN, NODE_ENV: "development", VERCEL_ENV: undefined, NEWSLETTER_PROVIDER: "mailerlite" },
    () =>
      withFetch(unreachable, async (calls) => {
        const result = await getNewsletterAdapter().subscribe(input, ctx);
        assert.equal(result.ok, false);
        assert.equal(calls.length, 0);
      }),
  );
});

// Each of these used to fall back to mock and answer "Subscribed.".
const upstreamFailures: [string, () => Response][] = [
  ["401, bad or revoked token", () => new Response("{}", { status: 401 })],
  ["403", () => new Response("{}", { status: 403 })],
  ["422, address rejected", () => new Response("{}", { status: 422 })],
  ["429", () => new Response("{}", { status: 429 })],
  ["500", () => new Response("{}", { status: 500 })],
  ["503", () => new Response("{}", { status: 503 })],
  [
    "network error",
    () => {
      throw new TypeError("fetch failed");
    },
  ],
];

for (const [label, respond] of upstreamFailures) {
  test(`a MailerLite failure is refused, not faked (${label})`, async () => {
    await withEnv(
      { ...CLEAN, ...PRODUCTION, NEWSLETTER_PROVIDER: "mailerlite", MAILERLITE_TOKEN: "test-token" },
      () =>
        withFetch(respond, async (calls) => {
          const result = await getNewsletterAdapter().subscribe(input, ctx);
          assert.equal(calls.length, 1, "MailerLite must actually be called");
          assert.equal(result.ok, false, `${label} must not report success`);
          assert.equal(result.ok === false && result.code, "PROVIDER_ERROR");
        }),
    );
  });
}

test("production reports success only when MailerLite accepts the address", async () => {
  await withEnv(
    {
      ...CLEAN,
      ...PRODUCTION,
      NEWSLETTER_PROVIDER: "mailerlite",
      MAILERLITE_TOKEN: "test-token",
      MAILERLITE_GROUP_ID: "group-1",
    },
    () =>
      withFetch(
        () => new Response(JSON.stringify({ data: { id: "ml-42" } }), { status: 201 }),
        async (calls) => {
          const result = await getNewsletterAdapter().subscribe(input, ctx);
          assert.equal(result.ok, true);
          assert.equal(result.ok === true && result.provider, "mailerlite");
          assert.equal(result.ok === true && result.id, "ml-42");

          assert.equal(calls.length, 1);
          const [{ url, init }] = calls;
          assert.ok(url.endsWith("/api/subscribers"), `unexpected MailerLite URL ${url}`);
          assert.equal(init?.method, "POST");
          assert.equal(new Headers(init?.headers).get("authorization"), "Bearer test-token");
          const sent = JSON.parse(String(init?.body)) as { email?: string; groups?: string[] };
          assert.equal(sent.email, input.email);
          assert.deepEqual(sent.groups, ["group-1"]);
        },
      ),
  );
});

// Preview builds also run with NODE_ENV=production. An unchosen fallback must
// still refuse there — a preview that says "Subscribed." while subscribing
// nobody misleads whoever is testing the form.
for (const provider of [undefined, "", "convertkit"]) {
  const label = provider === undefined ? "unset" : `"${provider}"`;
  test(`preview refuses an unchosen provider (${label})`, async () => {
    await withEnv({ ...CLEAN, ...PREVIEW, NEWSLETTER_PROVIDER: provider }, () =>
      withFetch(unreachable, async (calls) => {
        const result = await getNewsletterAdapter().subscribe(input, ctx);
        assert.equal(result.ok, false, `${label} must not report success on a preview`);
        assert.equal(calls.length, 0);
      }),
    );
  });
}

// ...but naming mock on a preview, or setting the disable flag for an E2E run,
// is a deliberate choice.
const chosenMocks: [string, Record<string, string>][] = [
  ["NEWSLETTER_PROVIDER=mock", { NEWSLETTER_PROVIDER: "mock" }],
  ["NEXT_PUBLIC_MAILERLITE_DISABLED=true", { NEXT_PUBLIC_MAILERLITE_DISABLED: "true" }],
];

for (const [label, env] of chosenMocks) {
  test(`preview allows a deliberately chosen mock (${label})`, async () => {
    await withEnv({ ...CLEAN, ...PREVIEW, ...env }, () =>
      withFetch(unreachable, async (calls) => {
        const result = await getNewsletterAdapter().subscribe(input, ctx);
        assert.equal(result.ok, true);
        assert.equal(result.ok === true && result.provider, "mock");
        assert.equal(calls.length, 0);
      }),
    );
  });
}

// Hosting that sets no VERCEL_ENV still counts as production via NODE_ENV.
test("non-Vercel production refuses mock", async () => {
  await withEnv(
    { ...CLEAN, NODE_ENV: "production", VERCEL_ENV: undefined, NEWSLETTER_PROVIDER: "mock" },
    () =>
      withFetch(unreachable, async () => {
        const result = await getNewsletterAdapter().subscribe(input, ctx);
        assert.equal(result.ok, false);
      }),
  );
});

test("a refusal never leaks configuration or MailerLite's response", async () => {
  const cases: [string, Record<string, string | undefined>, () => Response][] = [
    ["unset provider", {}, unreachable],
    [
      "MailerLite 401",
      { NEWSLETTER_PROVIDER: "mailerlite", MAILERLITE_TOKEN: "test-token" },
      () => new Response(JSON.stringify({ message: "Unauthenticated." }), { status: 401 }),
    ],
  ];
  for (const [label, env, respond] of cases) {
    await withEnv({ ...CLEAN, ...PRODUCTION, ...env }, () =>
      withFetch(respond, async () => {
        const result = await getNewsletterAdapter().subscribe(input, ctx);
        assert.equal(result.ok, false);
        const message = result.ok === false ? result.error : "";
        for (const leak of [
          "NEWSLETTER_PROVIDER",
          "MAILERLITE",
          "MailerLite",
          "token",
          "mock",
          "production",
          "401",
          "Unauthenticated",
        ]) {
          assert.ok(!message.includes(leak), `${label}: caller-facing error must not mention ${leak}`);
        }
      }),
    );
  }
});

test("local development still falls back to mock so the form is workable", async () => {
  await withEnv({ ...CLEAN, NODE_ENV: "development", VERCEL_ENV: undefined }, () =>
    withFetch(unreachable, async (calls) => {
      const result = await getNewsletterAdapter().subscribe(input, ctx);
      assert.equal(result.ok, true);
      assert.equal(result.ok === true && result.provider, "mock");
      assert.equal(calls.length, 0);
    }),
  );
});

// `vercel dev` sets VERCEL_ENV=development for a local session. That is a
// developer's machine, not a deployment, so the documented mock fallback still
// applies — otherwise the footer form rejects every signup during local work.
test("vercel dev counts as local, so an unset provider falls back to mock", async () => {
  await withEnv({ ...CLEAN, NODE_ENV: "development", VERCEL_ENV: "development" }, () =>
    withFetch(unreachable, async (calls) => {
      const result = await getNewsletterAdapter().subscribe(input, ctx);
      assert.equal(result.ok, true);
      assert.equal(result.ok === true && result.provider, "mock");
      assert.equal(calls.length, 0);
    }),
  );
});

// ─── neon ────────────────────────────────────────────────────────────────────

// Choosing neon without a database refuses everywhere, local development
// included: falling back to mock would hide the missing DATABASE_URL.
const environments: [string, Record<string, string | undefined>][] = [
  ["production", PRODUCTION],
  ["preview", PREVIEW],
  ["local development", { NODE_ENV: "development", VERCEL_ENV: undefined }],
];

for (const [label, env] of environments) {
  test(`neon without DATABASE_URL is refused (${label})`, async () => {
    await withEnv(
      { ...CLEAN, ...env, NEWSLETTER_PROVIDER: "neon", MAILERLITE_TOKEN: "test-token" },
      () =>
        withFetch(unreachable, async (calls) => {
          const result = await getNewsletterAdapter().subscribe(input, ctx);
          assert.equal(result.ok, false);
          assert.equal(result.ok === false && result.code, "PROVIDER_ERROR");
          assert.equal(calls.length, 0);
        }),
    );
  });
}

// With a DATABASE_URL the selector hands back the real store, whose
// "server-only" import throws outside a server bundle. A test through it would
// pass as a refusal for the wrong reason, so the save-then-sync sequence is
// driven through createNeonAdapter with an in-memory store instead.
type StoreEvent =
  | { event: "save"; email: string }
  | { event: "recordSync"; id: string; outcome: MailerLiteSyncOutcome };

function memoryStore(log: StoreEvent[], overrides: Partial<NewsletterStore> = {}): NewsletterStore {
  return {
    async save(subscriber) {
      log.push({ event: "save", email: subscriber.email });
      return { id: "row-1" };
    },
    async recordSync(id, outcome) {
      log.push({ event: "recordSync", id, outcome });
    },
    ...overrides,
  };
}

const lastEvent = (log: StoreEvent[]) => log[log.length - 1];

test("neon saves the row before MailerLite is called, then records the acceptance", async () => {
  await withEnv(
    { ...CLEAN, ...PRODUCTION, MAILERLITE_TOKEN: "test-token", MAILERLITE_GROUP_ID: "group-1" },
    async () => {
      const log: StoreEvent[] = [];
      let savesWhenMailerLiteCalled = -1;
      await withFetch(
        () => {
          savesWhenMailerLiteCalled = log.filter((e) => e.event === "save").length;
          return new Response(JSON.stringify({ data: { id: "ml-42" } }), { status: 201 });
        },
        async (calls) => {
          const result = await createNeonAdapter(memoryStore(log)).subscribe(input, ctx);

          assert.equal(result.ok, true);
          assert.equal(result.ok === true && result.provider, "neon");
          assert.equal(result.ok === true && result.id, "row-1");

          assert.equal(savesWhenMailerLiteCalled, 1, "the row must exist before MailerLite is called");
          assert.equal(calls.length, 1);
          assert.equal(new Headers(calls[0].init?.headers).get("authorization"), "Bearer test-token");
          assert.deepEqual(lastEvent(log), {
            event: "recordSync",
            id: "row-1",
            outcome: { status: "synced", subscriberId: "ml-42" },
          });
        },
      );
    },
  );
});

// Under mailerlite each of these refuses the signup. Under neon the row is
// already saved, so the visitor's answer stands and the failure is recorded on
// the row for replay.
for (const [label, respond] of upstreamFailures) {
  test(`neon keeps a saved signup when MailerLite fails, and records it (${label})`, async () => {
    await withEnv({ ...CLEAN, ...PRODUCTION, MAILERLITE_TOKEN: "test-token" }, async () => {
      const log: StoreEvent[] = [];
      await withFetch(respond, async (calls) => {
        const result = await createNeonAdapter(memoryStore(log)).subscribe(input, ctx);
        assert.equal(calls.length, 1, "MailerLite must actually be called");
        assert.equal(result.ok, true, "the row is saved, so the signup stands");
        const last = lastEvent(log);
        assert.equal(last?.event === "recordSync" && last.outcome.status, "failed");
      });
    });
  });
}

test("neon without MAILERLITE_TOKEN saves the row and marks it skipped", async () => {
  await withEnv({ ...CLEAN, ...PRODUCTION }, async () => {
    const log: StoreEvent[] = [];
    await withFetch(unreachable, async (calls) => {
      const result = await createNeonAdapter(memoryStore(log)).subscribe(input, ctx);
      assert.equal(result.ok, true);
      assert.equal(calls.length, 0);
      assert.deepEqual(log, [
        { event: "save", email: input.email },
        { event: "recordSync", id: "row-1", outcome: { status: "skipped" } },
      ]);
    });
  });
});

test("neon refuses when the row cannot be saved, and never calls MailerLite", async () => {
  await withEnv({ ...CLEAN, ...PRODUCTION, MAILERLITE_TOKEN: "test-token" }, async () => {
    const log: StoreEvent[] = [];
    const store = memoryStore(log, {
      async save() {
        throw new Error('relation "newsletter_subscribers" does not exist');
      },
    });
    await withFetch(unreachable, async (calls) => {
      const result = await createNeonAdapter(store).subscribe(input, ctx);
      assert.equal(result.ok, false);
      assert.equal(result.ok === false && result.code, "PROVIDER_ERROR");
      assert.equal(calls.length, 0);
      assert.equal(log.length, 0);
      const message = result.ok === false ? result.error : "";
      for (const leak of ["newsletter_subscribers", "relation", "Neon", "DATABASE_URL"]) {
        assert.ok(!message.includes(leak), `caller-facing error must not mention ${leak}`);
      }
    });
  });
});

test("failing to record the sync result does not undo a saved signup", async () => {
  await withEnv({ ...CLEAN, ...PRODUCTION, MAILERLITE_TOKEN: "test-token" }, async () => {
    const store = memoryStore([], {
      async recordSync() {
        throw new Error("connection reset");
      },
    });
    await withFetch(
      () => new Response(JSON.stringify({ data: { id: "ml-42" } }), { status: 201 }),
      async () => {
        const result = await createNeonAdapter(store).subscribe(input, ctx);
        assert.equal(result.ok, true);
      },
    );
  });
});
