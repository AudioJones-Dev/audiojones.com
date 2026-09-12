// The provider selector must never hand back an adapter that reports success
// without persisting. On 2026-09-10 an unset LEAD_FORM_PROVIDER in production
// silently discarded every application behind a "Application received" page;
// these assertions are what stop that recurring.

import assert from "node:assert/strict";
import test from "node:test";

import { getApplyAdapter } from "../src/lib/apply/apply-storage";
import type { ApplyInput } from "../src/lib/apply/apply-schema";

const input: ApplyInput = {
  firstName: "Dana",
  email: "dana@example.com",
  companyName: "Northwind Services",
  annualRevenueRange: "$1M–$2M",
  desiredOutcome: "Stop losing inbound to slow follow-up",
  timeline: "Within 30 days",
  consentToContact: true,
};

const ctx = { ipHash: null, userAgent: null };

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

for (const provider of [undefined, "mock", "resend", "postgres", ""]) {
  const label = provider === undefined ? "unset" : `"${provider}"`;
  test(`production refuses a non-persisting provider (${label})`, async () => {
    await withEnv(
      {
        NODE_ENV: "production",
        VERCEL_ENV: "production",
        LEAD_FORM_PROVIDER: provider,
        DATABASE_URL: undefined,
      },
      async () => {
        const result = await getApplyAdapter().submit(input, ctx);
        assert.equal(result.ok, false, `${label} must not report success in production`);
        assert.equal(result.ok === false && result.code, "PROVIDER_ERROR");
      },
    );
  });
}

// Preview builds also run with NODE_ENV=production. An unchosen fallback must
// still refuse there — a preview that says "Application received" while
// storing nothing misleads whoever is testing the form.
for (const provider of [undefined, "resend", ""]) {
  const label = provider === undefined ? "unset" : `"${provider}"`;
  test(`preview refuses an unchosen provider (${label})`, async () => {
    await withEnv(
      {
        NODE_ENV: "production",
        VERCEL_ENV: "preview",
        LEAD_FORM_PROVIDER: provider,
        DATABASE_URL: undefined,
      },
      async () => {
        const result = await getApplyAdapter().submit(input, ctx);
        assert.equal(result.ok, false, `${label} must not report success on a preview`);
      },
    );
  });
}

// ...but a developer who names mock on a preview has consented to it.
test("preview allows mock when it is named explicitly", async () => {
  await withEnv(
    {
      NODE_ENV: "production",
      VERCEL_ENV: "preview",
      LEAD_FORM_PROVIDER: "mock",
      DATABASE_URL: undefined,
    },
    async () => {
      const result = await getApplyAdapter().submit(input, ctx);
      assert.equal(result.ok, true);
      assert.equal(result.ok === true && result.provider, "mock");
    },
  );
});

// Hosting that sets no VERCEL_ENV still counts as production via NODE_ENV.
test("non-Vercel production refuses mock", async () => {
  await withEnv(
    {
      NODE_ENV: "production",
      VERCEL_ENV: undefined,
      LEAD_FORM_PROVIDER: "mock",
      DATABASE_URL: undefined,
    },
    async () => {
      const result = await getApplyAdapter().submit(input, ctx);
      assert.equal(result.ok, false);
    },
  );
});

test("production refuses neon without DATABASE_URL", async () => {
  await withEnv(
    { NODE_ENV: "production", VERCEL_ENV: "production", LEAD_FORM_PROVIDER: "neon", DATABASE_URL: undefined },
    async () => {
      const result = await getApplyAdapter().submit(input, ctx);
      assert.equal(result.ok, false);
      assert.equal(result.ok === false && result.code, "PROVIDER_ERROR");
    },
  );
});

test("a refusal never leaks configuration to the applicant", async () => {
  await withEnv(
    { NODE_ENV: "production", VERCEL_ENV: "production", LEAD_FORM_PROVIDER: undefined, DATABASE_URL: undefined },
    async () => {
      const result = await getApplyAdapter().submit(input, ctx);
      assert.equal(result.ok, false);
      const message = result.ok === false ? result.error : "";
      for (const leak of ["LEAD_FORM_PROVIDER", "DATABASE_URL", "neon", "mock", "production"]) {
        assert.ok(!message.includes(leak), `applicant-facing error must not mention ${leak}`);
      }
    },
  );
});

test("development still falls back to mock so the form is workable", async () => {
  await withEnv(
    { NODE_ENV: "development", VERCEL_ENV: undefined, LEAD_FORM_PROVIDER: undefined, DATABASE_URL: undefined },
    async () => {
      const result = await getApplyAdapter().submit(input, ctx);
      assert.equal(result.ok, true);
      assert.equal(result.ok === true && result.provider, "mock");
    },
  );
});

// Applicant emails must never reach the logs in full (CWE-532). Flagged by
// CodeRabbit on #251 against the refusal path, which had copied the pattern
// from the pre-existing misconfigured-provider and persistence-failure logs.
// These assertions cover the refusal path the provider selector can reach.
// A single-character local part is a valid address. The pattern this codebase
// used elsewhere needs a character between the first and the "@", so it left
// such an address untouched — the exact leak redaction is meant to stop.
for (const address of ["a@b.com", "x@y.co.uk", "dana@example.com"]) {
  test(`a refusal redacts the email ${address}`, async () => {
    const captured: string[] = [];
    const realError = console.error;
    console.error = (...args: unknown[]) => {
      captured.push(args.map((a) => (typeof a === "string" ? a : JSON.stringify(a))).join(" "));
    };
    try {
      await withEnv(
        {
          NODE_ENV: "production",
          VERCEL_ENV: "production",
          LEAD_FORM_PROVIDER: undefined,
          DATABASE_URL: undefined,
        },
        async () => {
          await getApplyAdapter().submit({ ...input, email: address }, ctx);
        },
      );
    } finally {
      console.error = realError;
    }
    const logged = captured.join("\n");
    assert.ok(!logged.includes(address), `raw address ${address} must not be logged; got: ${logged}`);
    assert.ok(logged.includes("•••"), "a redacted form should still be logged");
  });
}

test("a refusal does not log the applicant's raw email", async () => {
  const captured: string[] = [];
  const realError = console.error;
  console.error = (...args: unknown[]) => {
    captured.push(args.map((a) => (typeof a === "string" ? a : JSON.stringify(a))).join(" "));
  };
  try {
    await withEnv(
      {
        NODE_ENV: "production",
        VERCEL_ENV: "production",
        LEAD_FORM_PROVIDER: undefined,
        DATABASE_URL: undefined,
      },
      async () => {
        const result = await getApplyAdapter().submit(input, ctx);
        assert.equal(result.ok, false);
      },
    );
  } finally {
    console.error = realError;
  }

  const logged = captured.join("\n");
  assert.ok(logged.length > 0, "the refusal must still log something operators can act on");
  assert.ok(
    !logged.includes(input.email),
    `the raw applicant email must not appear in logs; got: ${logged}`,
  );
  assert.ok(
    logged.includes("d•••@example.com"),
    "the redacted email should still be present so a failure can be traced",
  );
});
