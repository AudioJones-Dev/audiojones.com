#!/usr/bin/env tsx
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

interface StepRow {
  name: string;
  status?: string | null;
  conclusion?: string | null;
  url?: string | null;
  duration_ms?: number | null;
  exit_code?: number | null;
  log_tail?: string | null;
}

interface ChangedFile {
  path: string;
  status?: string;
  additions?: number;
  deletions?: number;
}

interface ValidationPayload {
  schema_version: string;
  repository: string | null;
  pr_number: number | null;
  pr_url: string | null;
  head_sha: string | null;
  head_ref: string | null;
  base_ref?: string | null;
  triggering_workflow?: string | null;
  triggering_run_id?: number | null;
  generated_at: string;
  overall_status: 'pass' | 'fail';
  steps: StepRow[];
  failed_steps: StepRow[];
  skipped_steps: StepRow[];
  changed_files?: ChangedFile[];
  changed_files_truncated?: boolean;
  changed_files_total?: number;
  preview?: { url: string | null; outcome: string | null };
  next_action: 'codex-fix' | 'claude-review' | 'human-approval' | 'none' | string;
  next_action_reason: string;
  local?: { working_tree_dirty?: boolean };
}

function statusIcon(conclusion: string | null | undefined): string {
  switch (conclusion) {
    case 'success':
      return '✅';
    case 'skipped':
    case 'neutral':
      return '⚪';
    case 'failure':
    case 'cancelled':
    case 'timed_out':
    case 'action_required':
      return '❌';
    default:
      return conclusion ? '⏳' : '·';
  }
}

function statusLabel(conclusion: string | null | undefined): string {
  if (!conclusion) return 'pending';
  return conclusion;
}

function shortSha(sha: string | null): string {
  if (!sha) return '(no sha)';
  return sha.slice(0, 7);
}

function linkOrDash(url: string | null | undefined, label = 'run'): string {
  if (!url) return '—';
  return `[${label}](${url})`;
}

function handoffBlock(nextAction: string): string {
  const actors = {
    human: '👤 Human',
    codex: '🤖 Codex',
    claude: '🧠 Claude',
  };
  const noop = '— no action.';
  switch (nextAction) {
    case 'codex-fix':
      return [
        `- ${actors.codex} — reproduce locally with \`pnpm validate\`, push fix.`,
        `- ${actors.claude} ${noop}`,
        `- ${actors.human} ${noop}`,
      ].join('\n');
    case 'claude-review':
      return [
        `- ${actors.claude} — classify env-vs-code per AGENTS.md §5.5.`,
        `- ${actors.codex} ${noop}`,
        `- ${actors.human} ${noop}`,
      ].join('\n');
    case 'human-approval':
      return [
        `- ${actors.human} — audit required before merge.`,
        `- ${actors.codex} ${noop}`,
        `- ${actors.claude} ${noop}`,
      ].join('\n');
    case 'none':
    default:
      return [
        `- ${actors.human} — ready for normal review.`,
        `- ${actors.codex} ${noop}`,
        `- ${actors.claude} ${noop}`,
      ].join('\n');
  }
}

function renderTable(steps: StepRow[]): string {
  if (!steps.length) {
    return '_No check runs reported yet._';
  }
  const header = '| Check | Result | Link |\n| --- | --- | --- |';
  const rows = steps.map((step) => {
    const icon = statusIcon(step.conclusion);
    const label = statusLabel(step.conclusion);
    return `| ${step.name} | ${icon} ${label} | ${linkOrDash(step.url ?? null)} |`;
  });
  return [header, ...rows].join('\n');
}

function renderChangedFiles(payload: ValidationPayload): string {
  const files = payload.changed_files ?? [];
  if (!files.length) {
    return '_No changed files reported._';
  }
  const total = payload.changed_files_total ?? files.length;
  const rows = files.map((f) => {
    const adds = typeof f.additions === 'number' ? `+${f.additions}` : '';
    const dels = typeof f.deletions === 'number' ? `−${f.deletions}` : '';
    const delta = adds || dels ? ` (${adds}${adds && dels ? ' / ' : ''}${dels})` : '';
    return `- \`${f.path}\`${delta}`;
  });
  const suffix = payload.changed_files_truncated
    ? `\n\n_… truncated, showing ${files.length} of ${total} files._`
    : '';
  return `**Changed files (${total}):**\n${rows.join('\n')}${suffix}`;
}

function renderPreview(payload: ValidationPayload): string {
  const preview = payload.preview;
  if (!preview || (!preview.url && !preview.outcome)) {
    return '';
  }
  const outcome = preview.outcome ?? 'unknown';
  const url = preview.url
    ? `[${preview.url.replace(/^https?:\/\//, '')}](${preview.url})`
    : '_(no preview URL)_';
  return `\n**Preview:** ${url}  (outcome: \`${outcome}\`)\n`;
}

function renderHeader(payload: ValidationPayload): string {
  const ref = payload.head_ref ?? '(local)';
  const sha = shortSha(payload.head_sha);
  return `### Validation summary — \`${ref}\` @ \`${sha}\``;
}

function render(payload: ValidationPayload): string {
  const statusIconStr = payload.overall_status === 'pass' ? '✅ pass' : '❌ fail';
  const lines: string[] = [];
  lines.push(renderHeader(payload));
  lines.push('');
  lines.push(`**Status:** ${statusIconStr}  •  **Next action:** \`${payload.next_action}\``);
  lines.push('');
  lines.push(`> ${payload.next_action_reason}`);
  lines.push('');
  lines.push(renderTable(payload.steps));
  const preview = renderPreview(payload);
  if (preview) lines.push(preview);
  lines.push('');
  lines.push(renderChangedFiles(payload));
  lines.push('');
  lines.push('**Handoff:**');
  lines.push(handoffBlock(payload.next_action));

  if (payload.failed_steps.length > 0) {
    lines.push('');
    lines.push('<details><summary>Failed step log tails</summary>');
    lines.push('');
    for (const step of payload.failed_steps) {
      const tail = step.log_tail ?? '(no log captured)';
      lines.push(`**${step.name}**`);
      lines.push('');
      lines.push('```');
      lines.push(tail);
      lines.push('```');
      lines.push('');
    }
    lines.push('</details>');
  }

  const wf = payload.triggering_workflow ?? 'local';
  lines.push('');
  lines.push(
    `<sub>Generated by \`${wf}\` at ${payload.generated_at}. Schema v${payload.schema_version}. Re-run a check to refresh.</sub>`,
  );

  return `${lines.join('\n')}\n`;
}

function main(): void {
  const argv = process.argv.slice(2);
  const inputPath = argv[0]
    ? resolve(process.cwd(), argv[0])
    : resolve(process.cwd(), 'validation-summary.json');

  let raw: string;
  try {
    raw = readFileSync(inputPath, 'utf8');
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[render-validation-summary] cannot read ${inputPath}: ${message}`);
    process.exit(2);
  }

  let payload: ValidationPayload;
  try {
    payload = JSON.parse(raw) as ValidationPayload;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[render-validation-summary] invalid JSON in ${inputPath}: ${message}`);
    process.exit(2);
  }

  process.stdout.write(render(payload));
}

main();
