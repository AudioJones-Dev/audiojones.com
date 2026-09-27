import assert from "node:assert/strict";
import test from "node:test";

import { link } from "../src/lib/agent-docs/llms-format";

test("plain entries follow the llms.txt link-list shape", () => {
  assert.equal(link("About", "https://x.test/about", "Who we are."), "- [About](https://x.test/about): Who we are.");
  assert.equal(link("Blog", "https://x.test/blog"), "- [Blog](https://x.test/blog)");
  assert.equal(link("Blog", "https://x.test/blog", null), "- [Blog](https://x.test/blog)");
});

test("brackets and backslashes in titles cannot break the link", () => {
  assert.equal(
    link("M.A.P. [beta] \\ v2", "https://x.test/map"),
    "- [M.A.P. \\[beta\\] \\\\ v2](https://x.test/map)"
  );
});

test("newlines in copy cannot start a new list item", () => {
  const line = link("Two\nlines", "https://x.test/", "First.\n- not an item\n\n  Last.");
  assert.equal(line, "- [Two lines](https://x.test/): First. - not an item Last.");
  assert.equal(line.split("\n").length, 1);
});
