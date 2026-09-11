// The newsletter selector must never hand back an adapter that answers
// success when nobody was subscribed. NewsletterForm renders ok:true as
// "Subscribed." in the footer of every page, and each case below is a path
// that used to discard a signup behind that message: an unset provider, a
// mock in production, a missing token, a MailerLite error. The /apply
// equivalent is test/apply-provider.test.ts.

import assert from "node:assert/strict";
import test from "node:test";

import { getNewsletterAdapter } from "../src/lib/newsletter/newsletter-storage";
import type { NewsletterInput } from "../src/lib/newsletter/newsletter-schema";

const input: NewsletterInput = { email: "dana@example.com", source: "footer" };

const PRODUCTION = { NODE_ENV: "production", VERCEL_ENV: "production" };
const PREVIEW = { NODE_ENV: "production", VERCEL_ENV: "preview" };

// Every variable the selector reads, cleared, so a value in the shell running
// the tests cannot change an outcome.
const CLEAN = {
  NEWSLETTER_PROVIDER: undefined,
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

for (const provider of [undefined, "", "mock", "neon"]) {
  const label = provider === undefined ? "unset" : `"${provider}"`;
  test(`production refuses a provider that subscribes nobody (${label})`, async () => {
    await withEnv({ ...CLEAN, ...PRODUCTION, NEWSLETTER_PROVIDER: provider }, () =>
      withFetch(unreachable, async (calls) => {
        const result = await getNewsletterAdapter().subscribe(input);
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
        const result = await getNewsletterAdapter().subscribe(input);
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
        const result = await getNewsletterAdapter().subscribe(input);
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
        const result = await getNewsletterAdapter().subscribe(input);
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
          const result = await getNewsletterAdapter().subscribe(input);
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
          const result = await getNewsletterAdapter().subscribe(input);
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
for (const provider of [undefined, "", "neon"]) {
  const label = provider === undefined ? "unset" : `"${provider}"`;
  test(`preview refuses an unchosen provider (${label})`, async () => {
    await withEnv({ ...CLEAN, ...PREVIEW, NEWSLETTER_PROVIDER: provider }, () =>
      withFetch(unreachable, async (calls) => {
        const result = await getNewsletterAdapter().subscribe(input);
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
        const result = await getNewsletterAdapter().subscribe(input);
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
        const result = await getNewsletterAdapter().subscribe(input);
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
        const result = await getNewsletterAdapter().subscribe(input);
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
      const result = await getNewsletterAdapter().subscribe(input);
      assert.equal(result.ok, true);
      assert.equal(result.ok === true && result.provider, "mock");
      assert.equal(calls.length, 0);
    }),
  );
});
