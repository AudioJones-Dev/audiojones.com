// Read a bounded prefix of a failed notification response, for logging.
//
// `await res.text()` buffers the whole body before any slice happens, so a
// large or non-terminating error body from Resend or a webhook can exhaust
// the function's memory, or hold a deferred `after` task open until its
// duration limit — at which point the status this exists to report is never
// logged at all. The helper written to make a failure visible must not be
// able to become one.
//
// Shared by the /apply and diagnostic notifiers so there is one
// implementation to get right rather than a copy in each.

export const DEFAULT_BODY_LIMIT = 500;

export async function readCappedBody(
  res: Response,
  limit: number = DEFAULT_BODY_LIMIT,
): Promise<string> {
  try {
    if (!res.body) {
      // No stream to read (some runtimes give a null body for empty
      // responses). Fall back to text(), which is bounded by definition here.
      const text = await res.text();
      return text.slice(0, limit);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let out = "";

    try {
      while (out.length < limit) {
        const { done, value } = await reader.read();
        if (done) break;
        out += decoder.decode(value, { stream: true });
      }
    } finally {
      // Stop the transfer rather than draining the remainder. Cancel can
      // reject on an already-errored stream; that must not mask the status.
      await reader.cancel().catch(() => {});
    }

    return out.slice(0, limit);
  } catch {
    return "<unreadable>";
  }
}
