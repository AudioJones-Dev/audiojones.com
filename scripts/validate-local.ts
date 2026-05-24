#!/usr/bin/env tsx
import { spawn } from 'node:child_process';
import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { performance } from 'node:perf_hooks';

interface StepDefinition {
  name: string;
  command: string;
  args: string[];
}

interface StepResult {
  name: string;
  command: string;
  started_at: string;
  ended_at: string;
  duration_ms: number;
  exit_code: number;
  conclusion: 'success' | 'failure';
  log_tail: string;
}

interface LocalGitContext {
  head_sha: string | null;
  head_ref: string | null;
  is_dirty: boolean;
}

const SECRET_PATTERN = /(?:api[_-]?key|secret|token|password|bearer|authorization)\s*[:=]/i;

function redact(line: string): string {
  if (SECRET_PATTERN.test(line)) {
    return line.replace(/(=|:)\s*\S+/g, '$1 [REDACTED]');
  }
  return line;
}

function tailLog(buffer: string, maxLines = 50): string {
  const lines = buffer.split(/\r?\n/).filter((l) => l.length > 0);
  const tail = lines.slice(-maxLines).map(redact);
  if (lines.length > maxLines) {
    return `… (truncated, ${lines.length - maxLines} earlier lines omitted)\n${tail.join('\n')}`;
  }
  return tail.join('\n');
}

function runStep(step: StepDefinition): Promise<StepResult> {
  return new Promise((resolveStep) => {
    const started = new Date();
    const startedMs = performance.now();
    const child = spawn(step.command, step.args, {
      stdio: ['ignore', 'pipe', 'pipe'],
      env: process.env,
      shell: false,
    });

    let buffer = '';
    const onData = (chunk: Buffer) => {
      const text = chunk.toString('utf8');
      buffer += text;
      process.stdout.write(text);
    };
    child.stdout.on('data', onData);
    child.stderr.on('data', onData);

    child.on('close', (code) => {
      const exitCode = code ?? 1;
      const ended = new Date();
      resolveStep({
        name: step.name,
        command: `${step.command} ${step.args.join(' ')}`.trim(),
        started_at: started.toISOString(),
        ended_at: ended.toISOString(),
        duration_ms: Math.round(performance.now() - startedMs),
        exit_code: exitCode,
        conclusion: exitCode === 0 ? 'success' : 'failure',
        log_tail: tailLog(buffer),
      });
    });

    child.on('error', (err) => {
      const ended = new Date();
      buffer += `\n[validate-local] process error: ${err.message}\n`;
      resolveStep({
        name: step.name,
        command: `${step.command} ${step.args.join(' ')}`.trim(),
        started_at: started.toISOString(),
        ended_at: ended.toISOString(),
        duration_ms: Math.round(performance.now() - startedMs),
        exit_code: 1,
        conclusion: 'failure',
        log_tail: tailLog(buffer),
      });
    });
  });
}

function readGitContext(): LocalGitContext {
  const safe = (cmd: string): string | null => {
    try {
      return execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim() || null;
    } catch {
      return null;
    }
  };
  const head_sha = safe('git rev-parse HEAD');
  const head_ref = safe('git rev-parse --abbrev-ref HEAD');
  const porcelain = safe('git status --porcelain');
  return {
    head_sha,
    head_ref,
    is_dirty: porcelain !== null && porcelain.length > 0,
  };
}

function parseArgs(argv: string[]): { noBuild: boolean; outPath: string; emitJson: boolean } {
  let noBuild = false;
  let emitJson = false;
  let outPath = resolve(process.cwd(), 'validation-summary.json');
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--no-build') noBuild = true;
    else if (arg === '--json') emitJson = true;
    else if (arg === '--out') {
      const next = argv[i + 1];
      if (!next) {
        console.error('[validate-local] --out requires a path argument');
        process.exit(2);
      }
      outPath = resolve(process.cwd(), next);
      i += 1;
    }
  }
  return { noBuild, outPath, emitJson };
}

async function main(): Promise<void> {
  const { noBuild, outPath, emitJson } = parseArgs(process.argv.slice(2));

  const definitions: StepDefinition[] = [
    { name: 'typecheck', command: 'pnpm', args: ['typecheck'] },
    { name: 'lint', command: 'pnpm', args: ['lint'] },
    { name: 'check-no-firebase', command: 'pnpm', args: ['check:no-firebase'] },
  ];
  if (!noBuild) {
    definitions.push({ name: 'build', command: 'pnpm', args: ['build'] });
  }

  const steps: StepResult[] = [];
  for (const def of definitions) {
    process.stdout.write(`\n[validate-local] ▶ ${def.name}: ${def.command} ${def.args.join(' ')}\n`);
    const result = await runStep(def);
    steps.push(result);
    process.stdout.write(
      `[validate-local] ◀ ${def.name}: ${result.conclusion} (exit ${result.exit_code}, ${result.duration_ms}ms)\n`,
    );
  }

  const overall_status: 'pass' | 'fail' = steps.every((s) => s.conclusion === 'success') ? 'pass' : 'fail';
  const failed_steps = steps.filter((s) => s.conclusion === 'failure').map((s) => ({
    name: s.name,
    status: 'completed',
    conclusion: s.conclusion,
    url: null,
  }));
  const skipped_steps: typeof failed_steps = [];

  const git = readGitContext();

  const payload = {
    schema_version: '1',
    repository: null,
    pr_number: null,
    pr_url: null,
    head_sha: git.head_sha,
    head_ref: git.head_ref,
    base_ref: null,
    triggering_workflow: 'local',
    triggering_run_id: null,
    generated_at: new Date().toISOString(),
    overall_status,
    steps: steps.map((s) => ({
      name: s.name,
      status: 'completed',
      conclusion: s.conclusion,
      url: null,
      duration_ms: s.duration_ms,
      exit_code: s.exit_code,
      log_tail: s.log_tail,
    })),
    failed_steps,
    skipped_steps,
    changed_files: [],
    changed_files_truncated: false,
    changed_files_total: 0,
    preview: { url: null, outcome: null },
    next_action: overall_status === 'pass' ? 'none' : 'codex-fix',
    next_action_reason:
      overall_status === 'pass'
        ? 'All local checks green.'
        : `Local validation failed: ${failed_steps.map((f) => f.name).join(', ')}.`,
    local: {
      working_tree_dirty: git.is_dirty,
    },
  };

  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`);

  if (emitJson) {
    process.stdout.write(`\n${JSON.stringify(payload, null, 2)}\n`);
  }

  process.stdout.write(
    `\n[validate-local] overall: ${overall_status} • wrote ${outPath}\n`,
  );

  process.exit(overall_status === 'pass' ? 0 : 1);
}

main().catch((err) => {
  console.error('[validate-local] fatal:', err);
  process.exit(2);
});
