import assert from "node:assert/strict";
import test from "node:test";

import { DEFAULT_BODY_LIMIT, readCappedBody } from "../src/lib/notifications/safe-body";

test("returns a short body unchanged", async () => {
  const res = new Response("downstream refused", { status: 500 });
  assert.equal(await readCappedBody(res), "downstream refused");
});

test("caps a long body at the limit", async () => {
  const res = new Response("x".repeat(10_000), { status: 500 });
  const body = await readCappedBody(res);
  assert.equal(body.length, DEFAULT_BODY_LIMIT);
});

// The point of the helper: it must stop pulling, not drain the whole thing.
// A body that never ends would otherwise hold the deferred task open until
// the platform kills it, and the status would never be logged.
test("stops reading a non-terminating body instead of draining it", async () => {
  let chunksPulled = 0;
  let cancelled = false;

  const stream = new ReadableStream<Uint8Array>({
    pull(controller) {
      chunksPulled += 1;
      if (chunksPulled > 10_000) {
        throw new Error("readCappedBody drained an endless body");
      }
      controller.enqueue(new TextEncoder().encode("y".repeat(64)));
    },
    cancel() {
      cancelled = true;
    },
  });

  const body = await readCappedBody(new Response(stream, { status: 502 }));

  assert.equal(body.length, DEFAULT_BODY_LIMIT);
  assert.equal(cancelled, true, "the stream must be cancelled, not left open");
  // 500 chars at 64 per chunk is 8 pulls; allow slack, but nowhere near endless.
  assert.ok(chunksPulled < 32, `pulled ${chunksPulled} chunks; should stop at the limit`);
});

test("honours an explicit limit", async () => {
  const res = new Response("z".repeat(1000), { status: 429 });
  assert.equal((await readCappedBody(res, 10)).length, 10);
});

test("reports unreadable rather than throwing when the stream errors", async () => {
  const stream = new ReadableStream<Uint8Array>({
    pull() {
      throw new Error("connection reset mid-body");
    },
  });

  // Must not reject: this runs inside a catch-all logging path, and a throw
  // here would mask the very status being reported.
  assert.equal(await readCappedBody(new Response(stream, { status: 500 })), "<unreadable>");
});

test("handles an empty body", async () => {
  assert.equal(await readCappedBody(new Response(null, { status: 204 })), "");
});
