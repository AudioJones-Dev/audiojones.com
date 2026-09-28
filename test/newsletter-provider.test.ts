// A newsletter signup must either reach MailerLite or visibly fail. Before
// this, production defaulted to the mock adapter and any upstream error fell
// back to it, so the footer said "subscribed" while every address was dropped.

import assert from "node:assert/strict";
import test from "node:test";

import {
  createNeonAdapter,
  getNewsletterAdapter,
  NEWSLETTER_GROUP_NAME,
  type NewsletterStore,
} from "../src/lib/newsletter/newsletter-storage";
import type { MailerLiteSyncOutcome } from "../src/lib/newsletter/newsletter-row";
import type { NewsletterInput } from "../src/lib/newsletter/newsletter-schema";
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

const live = {
  NODE_ENV: "production",
  VERCEL_ENV: "production",
  NEWSLETTER_PROVIDER: undefined,
  NEXT_PUBLIC_MAILERLITE_DISABLED: undefined,
  MAILERLITE_TOKEN: "test-token",
  MAILERLITE_API_KEY: undefined,
  MAILERLITE_API_BASE: undefined,
  MAILERLITE_GROUP_ID: "111",
};

test("a configured token sends the signup to MailerLite", async () => {
  await withEnv(live, async () => {
    await withFetch(
      () => ({ status: 201, body: { data: { id: "987" } } }),
      async (calls) => {
        const result = await getNewsletterAdapter().subscribe({
          email: "dana@example.com",
          source: "footer",
        });
        assert.deepEqual(result, { ok: true, id: "987", provider: "mailerlite" });
        assert.equal(calls.length, 1);
        assert.equal(calls[0].url, "https://connect.mailerlite.com/api/subscribers");
        assert.equal(calls[0].method, "POST");
        assert.equal(calls[0].headers.Authorization, "Bearer test-token");
        assert.equal(calls[0].headers["Content-Type"], "application/json");
        assert.equal(calls[0].headers.Accept, "application/json");
        assert.deepEqual(calls[0].body, { email: "dana@example.com", groups: ["111"] });
      },
    );
  });
});

test("the legacy MAILERLITE_API_KEY name still works", async () => {
  await withEnv({ ...live, MAILERLITE_TOKEN: undefined, MAILERLITE_API_KEY: "old-name" }, async () => {
    await withFetch(
      () => ({ status: 200, body: { data: { id: "1" } } }),
      async (calls) => {
        const result = await getNewsletterAdapter().subscribe({ email: "dana@example.com" });
        assert.equal(result.ok, true);
        assert.equal(calls[0].headers.Authorization, "Bearer old-name");
      },
    );
  });
});

test("a base URL quoted with /api is not doubled", async () => {
  await withEnv({ ...live, MAILERLITE_API_BASE: "https://connect.mailerlite.com/api" }, async () => {
    await withFetch(
      () => ({ status: 200, body: { data: { id: "1" } } }),
      async (calls) => {
        await getNewsletterAdapter().subscribe({ email: "dana@example.com" });
        assert.equal(calls[0].url, "https://connect.mailerlite.com/api/subscribers");
      },
    );
  });
});

for (const status of [401, 422, 500]) {
  test(`an upstream ${status} is reported, not mocked`, async () => {
    await withEnv(live, async () => {
      await withFetch(
        () => ({ status, body: { message: "nope" } }),
        async () => {
          const result = await getNewsletterAdapter().subscribe({ email: "dana@example.com" });
          assert.equal(result.ok, false);
          assert.equal(result.ok === false && result.code, "PROVIDER_ERROR");
          assert.ok(result.ok === false && !result.error.includes("nope"));
        },
      );
    });
  });
}

test("a rejected field is logged by name, never by message", async () => {
  await withEnv(live, async () => {
    await withFetch(
      () => ({
        status: 422,
        body: {
          message: "dana@example.com: The selected groups.0 is invalid.",
          errors: { "groups.0": ["The selected groups.0 is invalid."] },
        },
      }),
      async () => {
        const original = console.error;
        const logged: unknown[][] = [];
        console.error = (...args: unknown[]) => void logged.push(args);
        try {
          await getNewsletterAdapter().subscribe({ email: "dana@example.com" });
        } finally {
          console.error = original;
        }
        const text = JSON.stringify(logged);
        assert.ok(text.includes("groups.0"));
        assert.ok(!text.includes("dana@example.com"));
      },
    );
  });
});

test("production without a token refuses instead of mocking", async () => {
  await withEnv({ ...live, MAILERLITE_TOKEN: undefined }, async () => {
    await withFetch(
      () => {
        throw new Error("no request expected");
      },
      async () => {
        const result = await getNewsletterAdapter().subscribe({ email: "dana@example.com" });
        assert.equal(result.ok, false);
      },
    );
  });
});

test("development without a token uses the mock", async () => {
  await withEnv(
    { ...live, NODE_ENV: "development", VERCEL_ENV: undefined, MAILERLITE_TOKEN: undefined },
    async () => {
      const result = await getNewsletterAdapter().subscribe({ email: "dana@example.com" });
      assert.equal(result.ok === true && result.provider, "mock");
    },
  );
});

// Runs before the default-group test below: resolved group ids are cached
// per process, and this case needs the lookup to actually fail.
test("an unavailable newsletter group still subscribes the visitor", async () => {
  await withEnv({ ...live, MAILERLITE_GROUP_ID: undefined }, async () => {
    await withFetch(
      (call) =>
        call.url.includes("/groups")
          ? { status: 500, body: { message: "down" } }
          : { status: 200, body: { data: { id: "5" } } },
      async (calls) => {
        const result = await getNewsletterAdapter().subscribe({ email: "dana@example.com" });
        assert.equal(result.ok, true);
        const upsert = calls.find((c) => c.url.endsWith("/subscribers"));
        assert.deepEqual(upsert?.body, { email: "dana@example.com" });
      },
    );
  });
});

test("without MAILERLITE_GROUP_ID, signups join the Website newsletter group", async () => {
  await withEnv({ ...live, MAILERLITE_GROUP_ID: undefined }, async () => {
    await withFetch(
      (call) =>
        call.url.includes("/groups")
          ? { status: 200, body: { data: [{ id: 9, name: NEWSLETTER_GROUP_NAME }] } }
          : { status: 200, body: { data: { id: "5" } } },
      async (calls) => {
        await getNewsletterAdapter().subscribe({ email: "dana@example.com" });
        await getNewsletterAdapter().subscribe({ email: "lee@example.com" });
        const upserts = calls.filter((c) => c.url.endsWith("/subscribers"));
        assert.deepEqual(upserts[0].body, { email: "dana@example.com", groups: ["9"] });
        assert.deepEqual(upserts[1].body, { email: "lee@example.com", groups: ["9"] });
        assert.equal(calls.filter((c) => c.url.includes("/groups")).length, 1);
      },
    );
  });
});

test("a Whop tag reuses the MailerLite group with that exact name", async () => {
  await withEnv(live, async () => {
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
        assert.equal(calls.filter((c) => c.method === "POST" && c.url.endsWith("/groups")).length, 0);
        const upsert = calls.find((c) => c.url.endsWith("/subscribers"));
        assert.deepEqual(upsert?.body, { email: "dana@example.com", groups: ["6"] });
      },
    );
  });
});

test("a legacy caller's name reaches MailerLite", async () => {
  await withEnv(live, async () => {
    await withFetch(
      () => ({ status: 200, body: { data: { id: "1" } } }),
      async (calls) => {
        const parsed = newsletterSchema.parse({ email: "dana@example.com", name: " Dana " });
        await getNewsletterAdapter().subscribe(parsed);
        assert.deepEqual(calls[0].body, {
          email: "dana@example.com",
          fields: { name: "Dana" },
          groups: ["111"],
        });
      },
    );
  });
});

test("a Whop tag whose group cannot be resolved fails without an ungrouped upsert", async () => {
  await withEnv(live, async () => {
    await withFetch(
      (call) =>
        call.url.includes("/groups")
          ? { status: 500, body: { message: "down" } }
          : { status: 200, body: { data: { id: "42" } } },
      async (calls) => {
        const ok = await upsertMailerLiteSubscriber({ email: "dana@example.com", tag: "unresolvable-group" });
        assert.equal(ok, false);
        assert.equal(calls.filter((c) => c.url.endsWith("/subscribers")).length, 0);
      },
    );
  });
});

test("a missing group is created once", async () => {
  await withEnv(live, async () => {
    await withFetch(
      (call) => {
        if (call.url.includes("/groups?")) return { status: 200, body: { data: [] } };
        if (call.url.endsWith("/groups")) return { status: 201, body: { data: { id: "77" } } };
        return { status: 200, body: { data: { id: "42" } } };
      },
      async (calls) => {
        assert.equal(await getOrCreateGroupId("new-buyers"), "77");
        assert.equal(await getOrCreateGroupId("new-buyers"), "77");
        const creates = calls.filter((c) => c.method === "POST" && c.url.endsWith("/groups"));
        assert.equal(creates.length, 1);
        assert.deepEqual(creates[0].body, { name: "new-buyers" });
      },
    );
  });
});

// ─── neon ────────────────────────────────────────────────────────────────────

const signup: NewsletterInput = { email: "dana@example.com", source: "footer" };
const ctx = { ipHash: "abc123", userAgent: "test-agent" };
const neon = { ...live, NEWSLETTER_PROVIDER: "neon", DATABASE_URL: undefined };

// Naming neon without a database refuses everywhere, local development
// included. Falling back to the mock would hide the missing DATABASE_URL
// behind a success message, and a smoke test against a half-configured deploy
// is expected to fail.
const environments: [string, Record<string, string | undefined>][] = [
  ["production", { NODE_ENV: "production", VERCEL_ENV: "production" }],
  ["preview", { NODE_ENV: "production", VERCEL_ENV: "preview" }],
  ["local development", { NODE_ENV: "development", VERCEL_ENV: undefined }],
];

for (const [label, env] of environments) {
  test(`neon without DATABASE_URL is refused (${label})`, async () => {
    await withEnv({ ...neon, ...env }, async () => {
      await withFetch(
        () => ({ status: 200, body: {} }),
        async (calls) => {
          const result = await getNewsletterAdapter().subscribe(signup, ctx);
          assert.equal(result.ok, false);
          assert.equal(result.ok === false && result.code, "PROVIDER_ERROR");
          assert.equal(calls.length, 0, "MailerLite must not be called");
        },
      );
    });
  });
}

// A Storybook or E2E session that asked for no integrations must not start
// writing rows either, so the disable flag still wins over an explicit neon.
test("the disable flag wins over neon, so no row is written", async () => {
  await withEnv(
    {
      ...neon,
      NODE_ENV: "development",
      VERCEL_ENV: undefined,
      DATABASE_URL: "postgres://unused",
      NEXT_PUBLIC_MAILERLITE_DISABLED: "true",
    },
    async () => {
      await withFetch(
        () => ({ status: 200, body: {} }),
        async (calls) => {
          const result = await getNewsletterAdapter().subscribe(signup, ctx);
          assert.equal(result.ok, true);
          assert.equal(result.ok === true && result.provider, "mock");
          assert.equal(calls.length, 0);
        },
      );
    },
  );
});

// With a DATABASE_URL the selector hands back the real store, whose
// "server-only" import throws outside a server bundle. A test through it would
// pass for the wrong reason, so the save-then-sync sequence is driven through
// createNeonAdapter with an in-memory store instead.
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
  await withEnv(live, async () => {
    const log: StoreEvent[] = [];
    let savesWhenMailerLiteCalled = -1;
    await withFetch(
      () => {
        savesWhenMailerLiteCalled = log.filter((e) => e.event === "save").length;
        return { status: 201, body: { data: { id: "ml-42" } } };
      },
      async (calls) => {
        const result = await createNeonAdapter(memoryStore(log)).subscribe(signup, ctx);

        assert.equal(result.ok, true);
        assert.equal(result.ok === true && result.provider, "neon");
        assert.equal(result.ok === true && result.id, "row-1");

        assert.equal(savesWhenMailerLiteCalled, 1, "the row must exist before MailerLite is called");
        assert.equal(calls.length, 1);
        assert.ok(calls[0].url.endsWith("/api/subscribers"), `unexpected URL ${calls[0].url}`);
        // Segmentation must not depend on which provider is configured: the
        // sync joins the same group the direct path would.
        assert.deepEqual(
          (calls[0].body as { groups?: string[] }).groups,
          ["111"],
        );
        assert.deepEqual(lastEvent(log), {
          event: "recordSync",
          id: "row-1",
          outcome: { status: "synced", subscriberId: "ml-42" },
        });
      },
    );
  });
});

// Under mailerlite each of these refuses the signup. Under neon the row is
// already saved, so the visitor's answer stands and the failure is recorded on
// the row for replay.
for (const status of [401, 422, 500]) {
  test(`neon keeps a saved signup when MailerLite answers ${status}`, async () => {
    await withEnv(live, async () => {
      const log: StoreEvent[] = [];
      await withFetch(
        () => ({ status, body: { errors: {} } }),
        async (calls) => {
          const result = await createNeonAdapter(memoryStore(log)).subscribe(signup, ctx);
          assert.equal(calls.length, 1, "MailerLite must actually be called");
          assert.equal(result.ok, true, "the row is saved, so the signup stands");
          const last = lastEvent(log);
          assert.equal(last?.event === "recordSync" && last.outcome.status, "failed");
        },
      );
    });
  });
}

test("neon without a MailerLite token saves the row and marks it skipped", async () => {
  await withEnv({ ...live, MAILERLITE_TOKEN: undefined, MAILERLITE_API_KEY: undefined }, async () => {
    const log: StoreEvent[] = [];
    await withFetch(
      () => ({ status: 200, body: {} }),
      async (calls) => {
        const result = await createNeonAdapter(memoryStore(log)).subscribe(signup, ctx);
        assert.equal(result.ok, true);
        assert.equal(calls.length, 0);
        assert.deepEqual(log, [
          { event: "save", email: signup.email },
          { event: "recordSync", id: "row-1", outcome: { status: "skipped" } },
        ]);
      },
    );
  });
});

// The fallback key name is a real configuration, so it must not be mistaken
// for "no token" and recorded as skipped.
test("the fallback MAILERLITE_API_KEY name still counts as a token", async () => {
  await withEnv({ ...live, MAILERLITE_TOKEN: undefined, MAILERLITE_API_KEY: "legacy-key" }, async () => {
    const log: StoreEvent[] = [];
    await withFetch(
      () => ({ status: 201, body: { data: { id: "ml-7" } } }),
      async (calls) => {
        await createNeonAdapter(memoryStore(log)).subscribe(signup, ctx);
        assert.equal(calls.length, 1, "the upsert must be attempted");
        const last = lastEvent(log);
        assert.equal(last?.event === "recordSync" && last.outcome.status, "synced");
      },
    );
  });
});

test("neon refuses when the row cannot be saved, and never calls MailerLite", async () => {
  await withEnv(live, async () => {
    const log: StoreEvent[] = [];
    const store = memoryStore(log, {
      async save() {
        throw new Error("relation newsletter_subscribers does not exist");
      },
    });
    await withFetch(
      () => ({ status: 200, body: {} }),
      async (calls) => {
        const result = await createNeonAdapter(store).subscribe(signup, ctx);
        assert.equal(result.ok, false);
        assert.equal(result.ok === false && result.code, "PROVIDER_ERROR");
        assert.equal(calls.length, 0);
        assert.equal(log.length, 0);
        const message = result.ok === false ? result.error : "";
        for (const leak of ["newsletter_subscribers", "relation", "DATABASE_URL"]) {
          assert.ok(!message.includes(leak), `caller-facing error must not mention ${leak}`);
        }
      },
    );
  });
});

test("failing to record the sync result does not undo a saved signup", async () => {
  await withEnv(live, async () => {
    const store = memoryStore([], {
      async recordSync() {
        throw new Error("connection reset");
      },
    });
    await withFetch(
      () => ({ status: 201, body: { data: { id: "ml-42" } } }),
      async () => {
        const result = await createNeonAdapter(store).subscribe(signup, ctx);
        assert.equal(result.ok, true);
      },
    );
  });
});
