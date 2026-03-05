#!/usr/bin/env bun
/**
 * Extract Cross-Framework Mappings from questions.yaml
 *
 * Reads frameworks/aiuc-1/questions.yaml and extracts all external framework
 * control mappings into mappings/crosswalks/aiuc-1.yaml
 *
 * Usage:
 *   bun run tools/standards/extract-crosswalks.ts
 */

import { readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import * as yaml from 'yaml';

const SCRIPT_DIR = dirname(import.meta.path).replace('file://', '');
const SKILL_ROOT = join(SCRIPT_DIR, '..');
const QUESTIONS_PATH = join(SKILL_ROOT, 'frameworks/aiuc-1/questions.yaml');
const CROSSWALK_OUTPUT = join(SKILL_ROOT, 'mappings/crosswalks/aiuc-1.yaml');

interface Question {
  id: string;
  text: string;
  controls: {
    [framework: string]: string;
  };
  [key: string]: any;
}

interface QuestionsFile {
  framework: string;
  version: string;
  questions: Question[];
  [key: string]: any;
}

interface ControlMapping {
  control: string;
  title: string;
  external_mappings: {
    [framework: string]: string[];
  };
  confidence: string;
  evidence: string[];
  notes: string;
}

interface CrosswalkFile {
  framework: string;
  version: string;
  description: string;
  last_updated: string;
  mappings: ControlMapping[];
}

async function extractCrosswalks() {
  console.log('📖 Reading questions.yaml...');
  const questionsContent = await readFile(QUESTIONS_PATH, 'utf-8');
  const questionsData = yaml.parse(questionsContent) as QuestionsFile;

  console.log(`   Found ${questionsData.questions.length} questions`);

  // Extract mappings organized by AIUC-1 control
  const controlMappings = new Map<string, ControlMapping>();

  for (const question of questionsData.questions) {
    if (!question.controls || !question.controls['aiuc-1']) {
      console.warn(`   ⚠️  Question ${question.id} missing aiuc-1 control`);
      continue;
    }

    const aiucControl = question.controls['aiuc-1'];

    // Extract external framework mappings
    const externalMappings: { [framework: string]: string[] } = {};
    let hasExternalMappings = false;

    for (const [framework, controlIds] of Object.entries(question.controls)) {
      if (framework === 'aiuc-1') continue; // Skip AIUC-1 itself

      // Split comma-separated control IDs
      const controlList = controlIds.split(',').map(c => c.trim()).filter(c => c.length > 0);
      if (controlList.length > 0) {
        externalMappings[framework] = controlList;
        hasExternalMappings = true;
      }
    }

    if (!hasExternalMappings) {
      continue; // No external mappings for this control
    }

    // Create or update mapping entry
    if (!controlMappings.has(aiucControl)) {
      controlMappings.set(aiucControl, {
        control: aiucControl,
        title: extractControlTitle(question.text, aiucControl),
        external_mappings: externalMappings,
        confidence: 'high',
        evidence: ['AIUC-1 official questions.yaml v1.0'],
        notes: `Extracted from question ${question.id}`
      });
    } else {
      // Merge mappings if control appears multiple times
      const existing = controlMappings.get(aiucControl)!;
      for (const [framework, controls] of Object.entries(externalMappings)) {
        if (existing.external_mappings[framework]) {
          // Merge and deduplicate
          existing.external_mappings[framework] = [
            ...new Set([...existing.external_mappings[framework], ...controls])
          ];
        } else {
          existing.external_mappings[framework] = controls;
        }
      }
    }
  }

  console.log(`   Extracted mappings for ${controlMappings.size} controls`);

  // Create crosswalk file
  const crosswalk: CrosswalkFile = {
    framework: 'aiuc-1',
    version: '1.0',
    description: 'AIUC-1 v1.0 cross-framework control mappings',
    last_updated: new Date().toISOString().split('T')[0],
    mappings: Array.from(controlMappings.values()).sort((a, b) =>
      a.control.localeCompare(b.control)
    )
  };

  // Write crosswalk file
  console.log(`\n💾 Writing crosswalk to ${CROSSWALK_OUTPUT}...`);
  await writeFile(CROSSWALK_OUTPUT, yaml.stringify(crosswalk, {
    indent: 2,
    lineWidth: 100
  }));

  // Generate statistics
  console.log('\n📊 Crosswalk Statistics:');
  console.log(`   Total AIUC-1 controls with mappings: ${crosswalk.mappings.length}`);

  const frameworkCounts = new Map<string, number>();
  for (const mapping of crosswalk.mappings) {
    for (const framework of Object.keys(mapping.external_mappings)) {
      frameworkCounts.set(framework, (frameworkCounts.get(framework) || 0) + 1);
    }
  }

  console.log('   Controls mapped per framework:');
  for (const [framework, count] of Array.from(frameworkCounts.entries()).sort((a, b) => b[1] - a[1])) {
    console.log(`     - ${framework}: ${count} controls`);
  }

  console.log('\n✅ Crosswalk extraction complete!');
  console.log(`   Output: ${CROSSWALK_OUTPUT}`);
}

function extractControlTitle(questionText: string, controlId: string): string {
  // Extract a concise title from the question text
  // Remove "Has the organization" and similar prefixes
  let title = questionText
    .replace(/^Has the organization /i, '')
    .replace(/^Are /i, '')
    .replace(/^Is /i, '')
    .replace(/^Does /i, '')
    .replace(/\?$/, '');

  // Truncate to reasonable length
  if (title.length > 80) {
    title = title.substring(0, 77) + '...';
  }

  return title;
}

extractCrosswalks().catch(console.error);
