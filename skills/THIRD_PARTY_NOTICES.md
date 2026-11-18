# Third-party skills

The following skill files are copied **unmodified** from
[addyosmani/agent-skills](https://github.com/addyosmani/agent-skills), tag `0.6.9`
(commit `84ee50673804b95c287d1e4eb4f1c1dad7c5188a`). They are used here under a
time-boxed pilot; see `docs/governance/APPROVED_DEVELOPMENT_TOOLING.md`.

| File in this repo | Upstream path | Git blob SHA (matches upstream) |
|---|---|---|
| `skills/performance-optimization.skill.md` | `skills/performance-optimization/SKILL.md` | `cbc7e950a6f376d25ac88cf310d5a48555db2ec1` |
| `skills/deprecation-and-migration.skill.md` | `skills/deprecation-and-migration/SKILL.md` | `7bf884ca5743d63be448725f88041dde8a10cd5d` |
| `skills/source-driven-development.skill.md` | `skills/source-driven-development/SKILL.md` | `d1f599a9fe8eb77d4af7dc2f45404c2f6363e441` |

Known gaps in this copy:
- `performance-optimization` links to `../../references/performance-checklist.md`, which is not
  included. The link does not resolve here.
- These skills mention other agent-skills skills (`incremental-implementation`,
  `security-and-hardening`) that are not included.
- Commands a skill suggests (for example `npx bundlesize`, `npx lhci`) do not override
  this repo's `AGENTS.md`: new dependencies still need explicit approval.

## License

```
MIT License

Copyright (c) 2025 Addy Osmani

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
