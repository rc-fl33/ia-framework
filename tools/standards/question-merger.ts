#!/usr/bin/env bun
/**
 * Compliance Question Merger
 *
 * Merges questions from multiple compliance frameworks into a unified questionnaire.
 * Identifies overlapping controls and consolidates related questions.
 *
 * Usage:
 *   bun run tools/standards/question-merger.ts [--frameworks <list>] [--output <file>]
 *
 * Examples:
 *   bun run tools/standards/question-merger.ts --frameworks nist-csf,hipaa
 *   bun run tools/standards/question-merger.ts --frameworks hipaa,pci-dss --output merged.yaml
 */

import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import * as yaml from 'yaml';

// Paths relative to this script
const SCRIPT_DIR = dirname(import.meta.path).replace('file://', '');
const SKILL_ROOT = join(SCRIPT_DIR, '..');
const FRAMEWORKS_DIR = join(SKILL_ROOT, 'frameworks');

// NIST CSF 2.0 Phases (canonical ordering)
const NIST_PHASES = ['GOVERN', 'IDENTIFY', 'PROTECT', 'DETECT', 'RESPOND', 'RECOVER'] as const;
type NistPhase = typeof NIST_PHASES[number];

interface ControlMapping {
  [framework: string]: string;
}

interface Question {
  id: string;
  text: string;
  category: string;
  phase: NistPhase;
  controls: ControlMapping;
  evidence_required: string[];
  scoring: {
    full: string;
    partial: string;
    none: string;
  };
  sub_questions?: string[];
  risk_weight?: 'HIGH' | 'MEDIUM' | 'LOW';
}

interface FrameworkQuestions {
  framework: string;
  version: string;
  total_questions: number;
  questions: Question[];
}

interface MergedQuestion {
  id: string;
  text: string;
  category: string;
  phase: NistPhase;
  source_frameworks: string[];
  source_questions: string[];
  controls: ControlMapping;
  evidence_required: string[];
  scoring: {
    full: string;
    partial: string;
    none: string;
  };
  sub_questions: string[];
  risk_weight: 'HIGH' | 'MEDIUM' | 'LOW';
}

interface MergedQuestionnaire {
  generated: string;
  frameworks: string[];
  total_questions: number;
  phases: {
    [phase: string]: MergedQuestion[];
  };
}

/**
 * Load questions from a framework's questions.yaml
 */
async function loadFrameworkQuestions(frameworkName: string): Promise<FrameworkQuestions | null> {
  const questionsPath = join(FRAMEWORKS_DIR, frameworkName, 'questions.yaml');

  if (!existsSync(questionsPath)) {
    console.log(`  ⚠️  No questions.yaml found for: ${frameworkName}`);
    return null;
  }

  try {
    const content = await readFile(questionsPath, 'utf-8');
    const data = yaml.parse(content) as FrameworkQuestions;
    console.log(`  ✅ Loaded ${data.questions.length} questions from ${frameworkName}`);
    return data;
  } catch (error) {
    console.error(`  ❌ Error loading ${frameworkName}: ${error}`);
    return null;
  }
}

/**
 * Extract control domain from NIST CSF control ID
 * e.g., "PR.AA-01" -> "PR.AA" (Access Authentication)
 */
function getControlDomain(controlId: string): string {
  // Match pattern like "PR.AA-01" -> "PR.AA"
  const match = controlId.match(/^([A-Z]{2}\.[A-Z]{2})/);
  if (match) return match[1];

  // Match pattern like "ID.AM-01" -> "ID.AM"
  const match2 = controlId.match(/^([A-Z]{2}\.[A-Z]+)/);
  if (match2) return match2[1];

  return controlId;
}

/**
 * Calculate similarity score between two questions based on control overlap
 */
function calculateSimilarity(q1: Question, q2: Question): number {
  let score = 0;

  // Check for same NIST CSF control domain
  const nist1 = q1.controls['nist-csf']?.split(',').map(c => getControlDomain(c.trim()));
  const nist2 = q2.controls['nist-csf']?.split(',').map(c => getControlDomain(c.trim()));

  if (nist1 && nist2) {
    const overlap = nist1.filter(c => nist2.includes(c));
    score += overlap.length * 30; // Heavy weight for NIST CSF overlap
  }

  // Check for same phase
  if (q1.phase === q2.phase) {
    score += 10;
  }

  // Check for same category
  if (q1.category === q2.category) {
    score += 15;
  }

  // Check for overlapping control mappings in other frameworks
  const frameworks1 = Object.keys(q1.controls);
  const frameworks2 = Object.keys(q2.controls);
  const commonFrameworks = frameworks1.filter(f => frameworks2.includes(f) && f !== 'nist-csf');

  score += commonFrameworks.length * 10;

  return score;
}

/**
 * Merge two questions into one
 */
function mergeQuestions(q1: MergedQuestion, q2: Question, frameworkName: string): MergedQuestion {
  // Merge controls
  const mergedControls: ControlMapping = { ...q1.controls };
  for (const [framework, control] of Object.entries(q2.controls)) {
    if (mergedControls[framework]) {
      // Append if different
      if (!mergedControls[framework].includes(control)) {
        mergedControls[framework] = `${mergedControls[framework]}, ${control}`;
      }
    } else {
      mergedControls[framework] = control;
    }
  }

  // Merge evidence
  const mergedEvidence = [...new Set([...q1.evidence_required, ...q2.evidence_required])];

  // Merge sub-questions
  const mergedSubQuestions = [...new Set([
    ...q1.sub_questions,
    ...(q2.sub_questions || [])
  ])];

  // Use highest risk weight
  const riskWeights = { HIGH: 3, MEDIUM: 2, LOW: 1 };
  const q2Weight = q2.risk_weight || 'MEDIUM';
  const highestRisk = riskWeights[q1.risk_weight] >= riskWeights[q2Weight]
    ? q1.risk_weight
    : q2Weight;

  return {
    ...q1,
    source_frameworks: [...new Set([...q1.source_frameworks, frameworkName])],
    source_questions: [...q1.source_questions, q2.id],
    controls: mergedControls,
    evidence_required: mergedEvidence,
    sub_questions: mergedSubQuestions,
    risk_weight: highestRisk,
  };
}

/**
 * Convert a single question to merged format
 */
function questionToMerged(q: Question, frameworkName: string): MergedQuestion {
  return {
    id: `M-${q.id.replace('Q-', '')}`,
    text: q.text,
    category: q.category,
    phase: q.phase,
    source_frameworks: [frameworkName],
    source_questions: [q.id],
    controls: { ...q.controls },
    evidence_required: [...q.evidence_required],
    scoring: { ...q.scoring },
    sub_questions: q.sub_questions ? [...q.sub_questions] : [],
    risk_weight: q.risk_weight || 'MEDIUM',
  };
}

/**
 * Merge questions from multiple frameworks
 */
function mergeAllQuestions(frameworksData: FrameworkQuestions[]): MergedQuestionnaire {
  const mergedQuestions: MergedQuestion[] = [];
  const processedQuestions = new Set<string>();

  // First, add all questions from the first (primary) framework
  const primaryFramework = frameworksData[0];
  for (const q of primaryFramework.questions) {
    mergedQuestions.push(questionToMerged(q, primaryFramework.framework));
    processedQuestions.add(q.id);
  }

  // Then, try to merge questions from other frameworks
  for (let i = 1; i < frameworksData.length; i++) {
    const framework = frameworksData[i];

    for (const q of framework.questions) {
      // Find best matching merged question
      let bestMatch: MergedQuestion | null = null;
      let bestScore = 0;
      const MERGE_THRESHOLD = 40; // Minimum score to merge

      for (const merged of mergedQuestions) {
        const score = calculateSimilarity(
          { ...q } as Question,
          {
            id: merged.source_questions[0],
            text: merged.text,
            category: merged.category,
            phase: merged.phase,
            controls: merged.controls,
            evidence_required: merged.evidence_required,
            scoring: merged.scoring,
            sub_questions: merged.sub_questions,
            risk_weight: merged.risk_weight,
          } as Question
        );

        if (score > bestScore && score >= MERGE_THRESHOLD) {
          bestScore = score;
          bestMatch = merged;
        }
      }

      if (bestMatch) {
        // Merge into existing question
        const idx = mergedQuestions.indexOf(bestMatch);
        mergedQuestions[idx] = mergeQuestions(bestMatch, q, framework.framework);
      } else {
        // Add as new question
        mergedQuestions.push(questionToMerged(q, framework.framework));
      }
    }
  }

  // Organize by phase
  const phases: { [phase: string]: MergedQuestion[] } = {};
  for (const phase of NIST_PHASES) {
    phases[phase] = mergedQuestions
      .filter(q => q.phase === phase)
      .sort((a, b) => {
        // Sort by risk weight (HIGH first), then by number of frameworks
        const riskOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
        if (riskOrder[a.risk_weight] !== riskOrder[b.risk_weight]) {
          return riskOrder[a.risk_weight] - riskOrder[b.risk_weight];
        }
        return b.source_frameworks.length - a.source_frameworks.length;
      });
  }

  // Re-number questions
  let questionNum = 1;
  for (const phase of NIST_PHASES) {
    for (const q of phases[phase]) {
      q.id = `M-${String(questionNum).padStart(3, '0')}`;
      questionNum++;
    }
  }

  return {
    generated: new Date().toISOString(),
    frameworks: frameworksData.map(f => f.framework),
    total_questions: mergedQuestions.length,
    phases,
  };
}

/**
 * Generate summary statistics
 */
function generateSummary(merged: MergedQuestionnaire): string {
  const lines: string[] = [];

  lines.push('# Merged Questionnaire Summary\n');
  lines.push(`**Generated:** ${merged.generated}`);
  lines.push(`**Frameworks:** ${merged.frameworks.join(', ')}`);
  lines.push(`**Total Questions:** ${merged.total_questions}\n`);

  lines.push('## Questions by Phase\n');
  lines.push('| Phase | Count | HIGH Risk | MEDIUM Risk | LOW Risk |');
  lines.push('|-------|-------|-----------|-------------|----------|');

  for (const phase of NIST_PHASES) {
    const questions = merged.phases[phase] || [];
    const high = questions.filter(q => q.risk_weight === 'HIGH').length;
    const medium = questions.filter(q => q.risk_weight === 'MEDIUM').length;
    const low = questions.filter(q => q.risk_weight === 'LOW').length;
    lines.push(`| ${phase} | ${questions.length} | ${high} | ${medium} | ${low} |`);
  }

  lines.push('\n## Control Overlap Analysis\n');

  // Find questions that satisfy multiple frameworks
  const multiFramework = Object.values(merged.phases)
    .flat()
    .filter(q => q.source_frameworks.length > 1);

  lines.push(`**Questions satisfying multiple frameworks:** ${multiFramework.length}\n`);

  if (multiFramework.length > 0) {
    lines.push('| Question | Frameworks | Controls |');
    lines.push('|----------|------------|----------|');
    for (const q of multiFramework.slice(0, 10)) {
      const controlSummary = Object.entries(q.controls)
        .map(([f, c]) => `${f}: ${c.split(',')[0]}`)
        .join(', ');
      lines.push(`| ${q.id} | ${q.source_frameworks.join(', ')} | ${controlSummary.substring(0, 50)}... |`);
    }
  }

  return lines.join('\n');
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);

  console.log('Compliance Question Merger');
  console.log('==========================\n');

  // Parse arguments
  let frameworks: string[] = ['nist-csf', 'hipaa', 'pci-dss'];
  let outputFile: string | null = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--frameworks' && args[i + 1]) {
      frameworks = args[i + 1].split(',').map(f => f.trim());
      i++;
    } else if (args[i] === '--output' && args[i + 1]) {
      outputFile = args[i + 1];
      i++;
    } else if (args[i] === '--help' || args[i] === '-h') {
      console.log(`
Usage:
  bun run tools/standards/question-merger.ts [options]

Options:
  --frameworks <list>  Comma-separated list of frameworks (default: nist-csf,hipaa,pci-dss)
  --output <file>      Output file path (default: stdout summary)
  -h, --help           Show this help

Examples:
  bun run tools/standards/question-merger.ts --frameworks hipaa,pci-dss
  bun run tools/standards/question-merger.ts --frameworks nist-csf,hipaa --output merged.yaml
`);
      process.exit(0);
    }
  }

  console.log(`Frameworks to merge: ${frameworks.join(', ')}\n`);

  // Load all framework questions
  console.log('Loading framework questions...');
  const frameworksData: FrameworkQuestions[] = [];

  for (const framework of frameworks) {
    const data = await loadFrameworkQuestions(framework);
    if (data) {
      frameworksData.push(data);
    }
  }

  if (frameworksData.length === 0) {
    console.error('\n❌ No framework questions loaded. Exiting.');
    process.exit(1);
  }

  if (frameworksData.length === 1) {
    console.log('\n⚠️  Only one framework loaded. No merging needed.');
  }

  // Merge questions
  console.log('\nMerging questions...');
  const merged = mergeAllQuestions(frameworksData);

  // Generate and display summary
  const summary = generateSummary(merged);
  console.log('\n' + summary);

  // Write output if requested
  if (outputFile) {
    const outputPath = outputFile.startsWith('/') ? outputFile : join(process.cwd(), outputFile);

    if (outputFile.endsWith('.yaml') || outputFile.endsWith('.yml')) {
      await writeFile(outputPath, yaml.stringify(merged));
    } else {
      // Write markdown summary
      await writeFile(outputPath, summary);
    }

    console.log(`\n✅ Output written to: ${outputPath}`);
  }

  // Also write merged questionnaire to standard location
  const mergedPath = join(SKILL_ROOT, 'output', 'merged-questionnaire.yaml');
  try {
    const { mkdir } = await import('fs/promises');
    await mkdir(join(SKILL_ROOT, 'output'), { recursive: true });
    await writeFile(mergedPath, yaml.stringify(merged));
    console.log(`\n✅ Merged questionnaire saved to: ${mergedPath}`);
  } catch (e) {
    // Output directory may not exist in all contexts
  }
}

main().catch(console.error);
