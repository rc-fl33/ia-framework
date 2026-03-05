#!/usr/bin/env bun
/**
 * Clean External Framework References from questions.yaml
 *
 * Removes all external framework control mappings from questions.yaml,
 * keeping only the aiuc-1: control references.
 *
 * Usage:
 *   bun run tools/standards/clean-questions.ts
 */

import { readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import * as yaml from 'yaml';

const SCRIPT_DIR = dirname(import.meta.path).replace('file://', '');
const SKILL_ROOT = join(SCRIPT_DIR, '..');
const QUESTIONS_PATH = join(SKILL_ROOT, 'frameworks/aiuc-1/questions.yaml');
const BACKUP_PATH = join(SKILL_ROOT, 'frameworks/aiuc-1/questions.yaml.backup');

interface Question {
  id: string;
  controls: {
    [framework: string]: string;
  };
  [key: string]: any;
}

interface QuestionsFile {
  [key: string]: any;
  questions: Question[];
}

async function cleanQuestions() {
  console.log('📖 Reading questions.yaml...');
  const questionsContent = await readFile(QUESTIONS_PATH, 'utf-8');
  const questionsData = yaml.parse(questionsContent) as QuestionsFile;

  console.log(`   Found ${questionsData.questions.length} questions`);

  // Create backup
  console.log(`\n💾 Creating backup at ${BACKUP_PATH}...`);
  await writeFile(BACKUP_PATH, questionsContent);

  let removedCount = 0;
  let totalExternalRefs = 0;

  // Clean each question
  for (const question of questionsData.questions) {
    if (!question.controls) continue;

    const originalFrameworks = Object.keys(question.controls);
    totalExternalRefs += originalFrameworks.length - 1; // Exclude aiuc-1

    // Keep only aiuc-1
    const cleanedControls: { [framework: string]: string } = {};
    if (question.controls['aiuc-1']) {
      cleanedControls['aiuc-1'] = question.controls['aiuc-1'];
    }

    const removedFrameworks = originalFrameworks.filter(f => f !== 'aiuc-1');
    if (removedFrameworks.length > 0) {
      removedCount++;
    }

    question.controls = cleanedControls;
  }

  console.log(`\n🧹 Cleaning statistics:`);
  console.log(`   Questions cleaned: ${removedCount}`);
  console.log(`   Total external references removed: ${totalExternalRefs}`);

  // Write cleaned file
  console.log(`\n💾 Writing cleaned questions.yaml...`);
  await writeFile(QUESTIONS_PATH, yaml.stringify(questionsData, {
    indent: 2,
    lineWidth: 100
  }));

  console.log('\n✅ Questions cleaned successfully!');
  console.log(`   Original saved to: ${BACKUP_PATH}`);
  console.log(`   Cleaned file: ${QUESTIONS_PATH}`);
}

cleanQuestions().catch(console.error);
