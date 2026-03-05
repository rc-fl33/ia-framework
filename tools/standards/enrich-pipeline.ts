#!/usr/bin/env bun
/**
 * Compliance Framework Enrichment Pipeline CLI
 *
 * Usage:
 *   bun run tools/standards/enrich-pipeline.ts <command> [framework-id]
 *
 * Commands: status [--framework <id>] | scaffold | import-draft |
 *           gen-questions | gen-crosswalk | validate | report
 */

import { readFile, readdir, stat, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import * as yaml from 'yaml';
import { scaffold } from './lib/scaffolder.ts';
import { validate } from './lib/validator.ts';
import { generateCrosswalk } from './lib/crosswalk-generator.ts';
import { generateQuestions } from './lib/question-generator.ts';
import { lookupPhase } from './lib/nist-crosswalk-map.ts';

const SCRIPT_DIR = dirname(new URL(import.meta.url).pathname);
const FRAMEWORKS_ROOT = join(SCRIPT_DIR, '..', '..', 'standards', 'frameworks');
const CROSSWALKS_ROOT = join(SCRIPT_DIR, '..', '..', 'standards', 'mappings', 'crosswalks');
const TEMPLATES_DIR = join(SCRIPT_DIR, 'templates');

const C = { green: '\x1b[32m', cyan: '\x1b[36m', yellow: '\x1b[33m', gray: '\x1b[90m', reset: '\x1b[0m' };
function tierColor(t: number) { return t >= 4 ? C.green : t >= 3 ? C.cyan : t >= 2 ? C.yellow : C.gray; }
function slug(id: string) { return id.includes('/') ? id.replace('/', '-') : id; }

async function collectManifests(root: string): Promise<Array<{ id: string; data: Record<string, unknown> }>> {
  const out: Array<{ id: string; data: Record<string, unknown> }> = [];
  async function walk(dir: string, prefix: string) {
    let entries: string[] = [];
    try { entries = await readdir(dir); } catch { return; }
    for (const e of entries) {
      const full = join(dir, e);
      if (!(await stat(full)).isDirectory()) continue;
      const mf = join(full, 'manifest.yaml');
      const id = prefix ? `${prefix}/${e}` : e;
      if (existsSync(mf)) out.push({ id, data: yaml.parse(await readFile(mf, 'utf-8')) as Record<string, unknown> });
      else await walk(full, id);
    }
  }
  await walk(root, '');
  return out;
}

async function cmdStatus(filter?: string) {
  const all = await collectManifests(FRAMEWORKS_ROOT);
  const rows = filter ? all.filter((m) => m.id.includes(filter)) : all;
  console.log(`\n${'Framework'.padEnd(24)} Tier  ${'Controls'.padEnd(10)} ${'Questions'.padEnd(10)} ${'FW Count'.padEnd(10)} ${'Crosswalk'.padEnd(10)} Last Verified`);
  console.log('─'.repeat(92));
  for (const { id, data } of rows) {
    const es = (data.enrichment_status ?? {}) as Record<string, unknown>;
    const t = (es.tier as number) ?? 0;
    const cw = existsSync(join(CROSSWALKS_ROOT, `${slug(id)}.yaml`)) ? 'yes' : 'no';
    console.log(`${tierColor(t)}${id.padEnd(24)}${C.reset} T${t}    ${String(es.controls ?? 'pending').padEnd(10)} ${String(es.questions ?? 'pending').padEnd(10)} ${String(es.questions_framework_count ?? 0).padEnd(10)} ${cw.padEnd(10)} ${(es.last_verified as string) ?? 'n/a'}`);
  }
  console.log();
}

async function cmdImportDraft(frameworkId: string) {
  const dir = frameworkId.includes('/') ? join(FRAMEWORKS_ROOT, ...frameworkId.split('/')) : join(FRAMEWORKS_ROOT, frameworkId);
  const draftPath = join(dir, 'docs', 'extracted', 'controls-draft.yaml');
  if (!existsSync(draftPath)) { console.error(`  Draft not found: ${draftPath}`); process.exit(1); }

  // Gate nist_phase assignment to security frameworks only.
  // Regulatory, quality_management, ai_governance, and audit_methodology frameworks
  // use their own native categories — nist_phase is not applicable.
  const manifestPath = join(dir, 'manifest.yaml');
  let isSecurityFramework = false;
  if (existsSync(manifestPath)) {
    const manifest = yaml.parse(await readFile(manifestPath, 'utf-8')) as Record<string, unknown>;
    const es = (manifest.enrichment_status ?? {}) as Record<string, unknown>;
    isSecurityFramework = (es.framework_category as string) === 'security';
  }

  const parsed = yaml.parse(await readFile(draftPath, 'utf-8')) as Record<string, unknown>;
  const controls = (parsed.controls as Record<string, unknown>[]) ?? [];
  for (const c of controls) {
    if (isSecurityFramework) {
      c.nist_phase = lookupPhase((c.id as string) ?? '', (c.title as string) ?? '', (c.category as string) ?? '');
    }
    c.status = 'complete';
    c.frequency = 'ongoing';
  }
  await writeFile(join(dir, 'controls.yaml'), yaml.stringify({ ...parsed, controls }));
  const phaseNote = isSecurityFramework ? ' (nist_phase assigned)' : ' (framework-native only — no nist_phase)';
  console.log(`  Imported ${controls.length} controls -> controls.yaml${phaseNote}`);
}

async function cmdValidate(frameworkId: string) {
  const report = await validate(frameworkId, FRAMEWORKS_ROOT, CROSSWALKS_ROOT);
  console.log(`\nValidation: ${frameworkId}\n`);
  const colors: Record<string, string> = { pass: C.green, warn: C.yellow, fail: '\x1b[31m' };
  for (const c of report.checks) {
    console.log(`  ${colors[c.status]}[${c.status.toUpperCase()}]${C.reset} ${c.name.padEnd(22)} ${c.detail}`);
  }
  console.log(`\n${report.errors} errors, ${report.warnings} warnings. Tier achieved: T${report.tier_achieved}\n`);
  if (report.errors > 0) process.exit(1);
}

async function cmdReport() {
  const all = await collectManifests(FRAMEWORKS_ROOT);
  console.log('| Framework | Version | Tier | Controls | Questions | FW Mappings | Crosswalk | Last Verified |');
  console.log('|-----------|---------|------|----------|-----------|-------------|-----------|---------------|');
  for (const { id, data } of all) {
    const es = (data.enrichment_status ?? {}) as Record<string, unknown>;
    const cw = existsSync(join(CROSSWALKS_ROOT, `${slug(id)}.yaml`)) ? 'yes' : 'no';
    console.log(`| ${id} | ${data.version ?? ''} | T${(es.tier as number) ?? 0} | ${es.controls ?? 'pending'} | ${es.questions ?? 'pending'} | ${es.questions_framework_count ?? 0} | ${cw} | ${(es.last_verified as string) ?? 'n/a'} |`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const fwArg = args[1];
  const fwFilter = args.indexOf('--framework') !== -1 ? args[args.indexOf('--framework') + 1] : undefined;

  if (cmd === 'status')        return cmdStatus(fwFilter);
  if (cmd === 'scaffold')      { const r = await scaffold(fwArg, FRAMEWORKS_ROOT, TEMPLATES_DIR); r.created.forEach((f) => console.log(`  Created: ${f}`)); r.skipped.forEach((f) => console.log(`  Skipped: ${f}`)); return; }
  if (cmd === 'import-draft')  return cmdImportDraft(fwArg);
  if (cmd === 'gen-questions') { await generateQuestions(fwArg, FRAMEWORKS_ROOT, CROSSWALKS_ROOT); return; }
  if (cmd === 'gen-crosswalk') { await generateCrosswalk(fwArg, FRAMEWORKS_ROOT, CROSSWALKS_ROOT); return; }
  if (cmd === 'validate')      return cmdValidate(fwArg);
  if (cmd === 'report')        return cmdReport();
  console.log('Usage: enrich-pipeline.ts <status|scaffold|import-draft|gen-questions|gen-crosswalk|validate|report> [framework-id]');
  process.exit(1);
}

main().catch(console.error);
