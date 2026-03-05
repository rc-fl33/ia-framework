/**
 * Question Generator — scaffolds questions.yaml from controls.yaml + crosswalk data.
 */

import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import * as yaml from 'yaml';
import type { NistPhase } from './nist-phase-map.ts';

const DOMAIN_MAP: Record<string, string> = {
  GOVERN: 'governance', IDENTIFY: 'asset_management', PROTECT: 'access_control',
  DETECT: 'monitoring', RESPOND: 'incident_response', RECOVER: 'business_continuity',
};

function fwDir(id: string, root: string): string {
  return id.includes('/') ? join(root, ...id.split('/')) : join(root, id);
}
function slug(id: string): string { return id.includes('/') ? id.replace('/', '-') : id; }
function catSlug(cat: string): string { return cat.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase().slice(0, 8); }
function groupBy<T>(arr: T[], key: (i: T) => string): Map<string, T[]> {
  const m = new Map<string, T[]>();
  for (const item of arr) { const k = key(item); if (!m.has(k)) m.set(k, []); m.get(k)!.push(item); }
  return m;
}

export async function generateQuestions(
  frameworkId: string, frameworksRoot: string, crosswalksRoot: string,
): Promise<void> {
  const dir = fwDir(frameworkId, frameworksRoot);
  const fw = slug(frameworkId);
  const controlsPath = join(dir, 'controls.yaml');
  if (!existsSync(controlsPath)) { console.error(`  controls.yaml not found: ${controlsPath}`); return; }

  const parsed = yaml.parse(await readFile(controlsPath, 'utf-8')) as Record<string, unknown>;
  const controls = (parsed.controls as Record<string, unknown>[]) ?? [];

  // Load crosswalk external mappings per control
  const xwalk = new Map<string, Record<string, string[]>>();
  const xwalkPath = join(crosswalksRoot, `${fw}.yaml`);
  if (existsSync(xwalkPath)) {
    const cw = yaml.parse(await readFile(xwalkPath, 'utf-8')) as Record<string, unknown>;
    for (const m of (cw.mappings as Record<string, unknown>[]) ?? []) {
      xwalk.set(m.control as string, (m.external_mappings as Record<string, string[]>) ?? {});
    }
  }

  const groups = groupBy(controls, (c) => (c.native_category as string) ?? 'GENERAL');
  const fwUpper = fw.toUpperCase().replace(/-/g, '');
  const questions: Record<string, unknown>[] = [];
  let n = 1;

  for (const [category, batch] of groups.entries()) {
    for (let i = 0; i < batch.length; i += 4) {
      const group = batch.slice(i, i + 4);
      const phase = (group[0].nist_phase as NistPhase) ?? 'PROTECT';
      const ids = group.map((c) => c.id as string);
      const titles = group.map((c) => (c.title as string) ?? '').filter(Boolean);

      // Merge external mappings for all controls in group
      const ext: Record<string, Set<string>> = {};
      for (const id of ids) {
        for (const [f, fIds] of Object.entries(xwalk.get(id) ?? {})) {
          if (!ext[f]) ext[f] = new Set();
          for (const fId of fIds) ext[f].add(fId);
        }
      }
      const controlsBlock: Record<string, string> = { [fw]: ids.join(', ') };
      for (const [f, s] of Object.entries(ext)) controlsBlock[f] = [...s].join(', ');

      questions.push({
        id: `Q-${fwUpper}-${catSlug(category)}-${String(n).padStart(3, '0')}`,
        text: `Are ${titles.join(', ')} implemented and documented?`,
        category: category.toLowerCase().replace(/[^a-z0-9]/g, '_'),
        phase, domain: DOMAIN_MAP[phase] ?? 'governance',
        controls: controlsBlock,
        evidence_required: ['Documentation review', 'Policy evidence', 'Implementation evidence'],
        scoring: { full: 'Controls fully implemented, documented, evidence available.',
          partial: 'Partially implemented or documentation incomplete.',
          none: 'Not implemented or no evidence available.' },
        risk_weight: 'MEDIUM',
      });
      n++;
    }
  }

  const output = { framework: fw, version: parsed.version ?? 'unknown',
    total_questions: questions.length, industry_focus: ['all'], questions };
  const outPath = join(dir, 'questions.yaml');
  await writeFile(outPath, yaml.stringify(output));
  console.log(`  Generated ${questions.length} questions -> ${outPath}`);
}
