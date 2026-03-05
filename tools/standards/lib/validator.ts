/**
 * Framework Enrichment Validator — checks completeness of enrichment artifacts.
 */

import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import * as yaml from 'yaml';

export interface ValidationCheck { name: string; status: 'pass' | 'fail' | 'warn'; detail: string; }
export interface ValidationReport {
  framework: string; checks: ValidationCheck[]; errors: number; warnings: number; tier_achieved: number;
}

function fwDir(id: string, root: string): string {
  return id.includes('/') ? join(root, ...id.split('/')) : join(root, id);
}
function slug(id: string): string { return id.includes('/') ? id.replace('/', '-') : id; }
function chk(name: string, status: 'pass' | 'fail' | 'warn', detail: string): ValidationCheck {
  return { name, status, detail };
}

export async function validate(
  frameworkId: string, frameworksRoot: string, crosswalksRoot: string,
): Promise<ValidationReport> {
  const dir = fwDir(frameworkId, frameworksRoot);
  const fw = slug(frameworkId);
  const paths = {
    manifest: join(dir, 'manifest.yaml'), controls: join(dir, 'controls.yaml'),
    questions: join(dir, 'questions.yaml'), crosswalk: join(crosswalksRoot, `${fw}.yaml`),
  };
  const checks: ValidationCheck[] = [
    chk('manifest_exists', existsSync(paths.manifest) ? 'pass' : 'fail', paths.manifest),
    chk('controls_exists', existsSync(paths.controls) ? 'pass' : 'fail', paths.controls),
    chk('questions_exists', existsSync(paths.questions) ? 'pass' : 'fail', paths.questions),
    chk('crosswalk_exists', existsSync(paths.crosswalk) ? 'pass' : 'fail', paths.crosswalk),
  ];

  let controlIds: string[] = [];
  let questions: Record<string, unknown>[] = [];

  if (existsSync(paths.controls)) {
    const p = yaml.parse(await readFile(paths.controls, 'utf-8')) as Record<string, unknown>;
    controlIds = ((p.controls as Record<string, unknown>[]) ?? []).map((c) => c.id as string).filter(Boolean);
  }

  if (existsSync(paths.questions)) {
    const p = yaml.parse(await readFile(paths.questions, 'utf-8')) as Record<string, unknown>;
    questions = (p.questions as Record<string, unknown>[]) ?? [];
    const declared = (p.total_questions as number) ?? 0;

    const refs = new Set(questions.flatMap((q) =>
      Object.values((q.controls as Record<string, string>) ?? {}).flatMap((v) => v.split(/,\s*/))));
    const uncovered = controlIds.filter((id) => !refs.has(id));
    const fwCounts = questions.map((q) => Object.keys((q.controls as Record<string, string>) ?? {}).length - 1);
    const avgFw = fwCounts.length ? fwCounts.reduce((a, b) => a + b, 0) / fwCounts.length : 0;
    const missing = questions.filter(
      (q) => !['id', 'text', 'category', 'domain', 'controls', 'evidence_required', 'scoring', 'risk_weight']
        .every((f) => f in q));

    checks.push(chk('question_count', questions.length >= 20 ? 'pass' : 'warn', `${questions.length} questions (need ≥20 for T2)`));
    checks.push(chk('question_coverage', uncovered.length === 0 ? 'pass' : 'warn',
      uncovered.length ? `${uncovered.length} controls not in any question` : 'All controls referenced'));
    checks.push(chk('framework_depth', avgFw >= 5 ? 'pass' : 'fail', `Avg ${avgFw.toFixed(1)} external framework mappings per question (need ≥5 for T3)`));
    checks.push(chk('cardinality', declared === questions.length ? 'pass' : 'warn', `total_questions=${declared}, actual=${questions.length}`));
    checks.push(chk('required_fields', missing.length === 0 ? 'pass' : 'fail',
      missing.length ? `${missing.length} questions missing required fields` : 'All questions have required fields'));
  } else {
    ['question_count', 'question_coverage', 'framework_depth', 'cardinality', 'required_fields']
      .forEach((n) => checks.push(chk(n, 'fail', 'questions.yaml missing')));
  }

  const errors = checks.filter((c) => c.status === 'fail').length;
  const warnings = checks.filter((c) => c.status === 'warn').length;
  // T3-only requirements: missing these blocks T3 but not T2
  const t3Reqs = new Set(['crosswalk_exists', 'framework_depth']);
  const hardErrors = checks.filter((c) => c.status === 'fail' && !t3Reqs.has(c.name)).length;
  const t3Missing = checks.filter((c) => c.status === 'fail' && t3Reqs.has(c.name)).length;
  const tier = hardErrors > 0
    ? (checks[0].status === 'pass' ? 1 : 0)
    : questions.length < 20
    ? 1
    : t3Missing > 0 ? 2 : 3;
  const report: ValidationReport = { framework: frameworkId, checks, errors, warnings, tier_achieved: tier };

  const reportDir = join(frameworksRoot, '..', 'docs', 'validation');
  await mkdir(reportDir, { recursive: true });
  await writeFile(join(reportDir, `${fw}-validation-report.yaml`), yaml.stringify(report));
  return report;
}
