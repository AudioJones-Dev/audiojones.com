import assert from "node:assert/strict";
import test from "node:test";

import {
  absolutizeRootRelative,
  acceptsMarkdown,
  isAllowedMarkdownHost,
  isMarkdownEligiblePath,
} from "../src/lib/agent-docs/markdown";

test("only an explicit, non-zero text/markdown triggers markdown", () => {
  assert.equal(acceptsMarkdown("text/markdown"), true);
  assert.equal(acceptsMarkdown("text/html, text/markdown;q=0.5"), true);
  assert.equal(acceptsMarkdown("TEXT/MARKDOWN; charset=utf-8"), true);
  assert.equal(acceptsMarkdown("text/markdown;q=0, text/html"), false);
  assert.equal(acceptsMarkdown("text/markdown;q=0.0"), false);
  assert.equal(acceptsMarkdown("text/html,application/xhtml+xml,*/*;q=0.8"), false);
  assert.equal(acceptsMarkdown("*/*"), false);
  assert.equal(acceptsMarkdown(null), false);
});

test("private surfaces and files are never converted", () => {
  for (const path of ["/", "/about", "/blog/some-post", "/apiary", "/statusquo"]) {
    assert.equal(isMarkdownEligiblePath(path), true, path);
  }
  for (const path of ["/api", "/api/leads", "/_next/static/x", "/portal/admin", "/ops/docs", "/env", "/status", "/not-authorized", "/robots.txt", "/favicon.ico"]) {
    assert.equal(isMarkdownEligiblePath(path), false, path);
  }
});

test("only the site's own hosts are served", () => {
  for (const host of ["localhost", "127.0.0.1", "audiojones.com", "www.audiojones.com", "audiojones-abc123-audiojones.vercel.app"]) {
    assert.equal(isAllowedMarkdownHost(host), true, host);
  }
  for (const host of ["evil.test", "audiojones.com.evil.test", "vercel.app.evil.test"]) {
    assert.equal(isAllowedMarkdownHost(host), false, host);
  }
});

test("root-relative links resolve on the serving origin, others are untouched", () => {
  const html = '<a href="/blog">b</a><img src="/a.png"><a href="//cdn.test/x">c</a><a href="https://medium.com/p">m</a><a href="#top">t</a>';
  assert.equal(
    absolutizeRootRelative(html, "https://www.audiojones.com"),
    '<a href="https://www.audiojones.com/blog">b</a><img src="https://www.audiojones.com/a.png"><a href="//cdn.test/x">c</a><a href="https://medium.com/p">m</a><a href="#top">t</a>'
  );
});
