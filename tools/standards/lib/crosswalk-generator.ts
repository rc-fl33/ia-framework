/**
 * Crosswalk Generator — auto-generates crosswalk stub from controls.yaml
 * via reverse-mapping existing crosswalk files from other frameworks.
 */

import { readFile, writeFile, readdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import * as yaml from 'yaml';

function fwDir(id: string, root: string): string {
  return id.includes('/') ? join(root, ...id.split('/')) : join(root, id);
}
function slug(id: string): string {
  return id.includes('/') ? id.replace('/', '-') : id;
}

export async function generateCrosswalk(
  frameworkId: string, frameworksRoot: string, crosswalksRoot: string,
): Promise<void> {
  const controlsPath = join(fwDir(frameworkId, frameworksRoot), 'controls.yaml');
  if (!existsSync(controlsPath)) { console.error(`  controls.yaml not found: ${controlsPath}`); return; }

  const parsed = yaml.parse(await readFile(controlsPath, 'utf-8')) as Record<string, unknown>;
  const controls = (parsed.controls as Record<string, unknown>[]) ?? [];
  const fw = slug(frameworkId);

  // Build reverse index: controlId -> { sourceFramework -> [controlIds] }
  const index = new Map<string, Record<string, string[]>>();
  try {
    const files = await readdir(crosswalksRoot);
    for (const file of files) {
      if (!file.endsWith('.yaml') || file === `${fw}.yaml`) continue;
      const src = file.replace('.yaml', '');
      const cw = yaml.parse(await readFile(join(crosswalksRoot, file), 'utf-8')) as Record<string, unknown>;
      for (const m of (cw.mappings as Record<string, unknown>[]) ?? []) {
        for (const ids of Object.values((m.external_mappings as Record<string, string[]>) ?? {})) {
          for (const id of ids) {
            if (!index.has(id)) index.set(id, {});
            const e = index.get(id)!;
            if (!e[src]) e[src] = [];
            e[src].push(m.control as string);
          }
        }
      }
    }
  } catch (e) { console.warn(`  Could not scan crosswalks: ${e}`); }

  let mapped = 0;
  const mappings = controls.map((c) => {
    const found = index.get(c.id as string) ?? {};
    if (Object.keys(found).length) mapped++;
    return { control: c.id as string, title: (c.title as string) ?? '', external_mappings: found, confidence: 'medium' };
  });

  const pct = controls.length ? Math.round((mapped / controls.length) * 100) : 0;
  const out = { framework: fw, version: parsed.version ?? 'unknown', description: `${fw} cross-framework mappings`,
    last_updated: new Date().toISOString().split('T')[0], generated_by: 'enrich-pipeline', coverage_pct: pct, mappings };

  await writeFile(join(crosswalksRoot, `${fw}.yaml`), yaml.stringify(out));
  console.log(`  Mapped ${mapped}/${controls.length} controls (${pct}% coverage)`);
}
