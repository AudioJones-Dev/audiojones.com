// A newsletter signup must either reach MailerLite or visibly fail. Before
// this, production defaulted to the mock adapter and any upstream error fell
// back to it, so the footer said "subscribed" while every address was dropped.

import assert from "node:assert/strict";
import test from "node:test";

import { getNewsletterAdapter, NEWSLETTER_GROUP_NAME } from "../src/lib/newsletter/newsletter-storage";
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
