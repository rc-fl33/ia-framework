/**
 * Framework Scaffolder
 * Generates missing file stubs from templates for a new compliance framework.
 */

import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';

export interface ScaffoldResult {
  created: string[];
  skipped: string[];
}

/** Resolve provider + id from a framework ID like "iso/42005" or "hipaa" */
function resolveProviderPath(frameworkId: string): { provider: string; id: string; slug: string } {
  if (frameworkId.includes('/')) {
    const [provider, id] = frameworkId.split('/');
    return { provider, id, slug: `${provider}-${id}` };
  }
  return { provider: '', id: frameworkId, slug: frameworkId };
}

async function copyTemplate(
  templatePath: string,
  destPath: string,
  replacements: Record<string, string>,
): Promise<boolean> {
  if (existsSync(destPath)) return false;

  let content = await readFile(templatePath, 'utf-8');
  for (const [key, value] of Object.entries(replacements)) {
    content = content.replaceAll(`{${key}}`, value);
    content = content.replaceAll(`{FRAMEWORK_ID}`, value);
  }

  await mkdir(dirname(destPath), { recursive: true });
  await writeFile(destPath, content);
  return true;
}

export async function scaffold(
  frameworkId: string,
  frameworksRoot: string,
  templatesDir: string,
): Promise<ScaffoldResult> {
  const { provider, id, slug } = resolveProviderPath(frameworkId);
  const frameworkDir = provider
    ? join(frameworksRoot, provider, id)
    : join(frameworksRoot, id);
  const crosswalksRoot = join(frameworksRoot, '..', 'mappings', 'crosswalks');

  const replacements: Record<string, string> = {
    FRAMEWORK_ID: slug,
    FRAMEWORK_UPPER: slug.toUpperCase().replace(/-/g, '_'),
  };

  const files: Array<{ template: string; dest: string }> = [
    { template: join(templatesDir, 'manifest-template.yaml'), dest: join(frameworkDir, 'manifest.yaml') },
    { template: join(templatesDir, 'controls-template.yaml'), dest: join(frameworkDir, 'controls.yaml') },
    { template: join(templatesDir, 'questions-template.yaml'), dest: join(frameworkDir, 'questions.yaml') },
    { template: join(templatesDir, 'crosswalk-template.yaml'), dest: join(crosswalksRoot, `${slug}.yaml`) },
  ];

  const created: string[] = [];
  const skipped: string[] = [];

  for (const { template, dest } of files) {
    if (!existsSync(template)) {
      console.warn(`  Template not found: ${template}`);
      skipped.push(dest);
      continue;
    }
    const wasCreated = await copyTemplate(template, dest, replacements);
    if (wasCreated) {
      created.push(dest);
    } else {
      skipped.push(dest);
    }
  }

  return { created, skipped };
}
