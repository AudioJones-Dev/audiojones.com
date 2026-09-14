// Redact an email address for logging (CWE-532). The whole local part goes,
// not all-but-the-first-character: with a one-character local part —
// `a@b.com`, `x@y.co.uk`, both valid and routable — keeping the first
// character leaves nothing hidden, and the original address is fully
// recoverable from the log. A string with no `@` is redacted entirely rather
// than passed through, so a malformed value cannot slip out.
//
// Kept free of server-only imports so any storage module can use it without
// pulling in the db barrel.
export function redactEmail(email: string): string {
  const at = email.lastIndexOf("@");
  return at === -1 ? "•••" : `•••${email.slice(at)}`;
}
