#!/usr/bin/env bun
/**
 * Update AIUC-1 REFERENCE.md to remove cross-framework mapping table
 * and add pointer to new crosswalks file
 */

import { readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';

const SCRIPT_DIR = dirname(import.meta.path).replace('file://', '');
const SKILL_ROOT = join(SCRIPT_DIR, '..');
const REFERENCE_PATH = join(SKILL_ROOT, 'frameworks/aiuc-1/docs/AIUC-1-REFERENCE.md');

async function updateReference() {
  console.log('📖 Reading AIUC-1-REFERENCE.md...');
  const content = await readFile(REFERENCE_PATH, 'utf-8');
  const lines = content.split('\n');

  // Find the Cross-Framework Mapping Table section
  const startIdx = lines.findIndex(line => line.trim() === '## Cross-Framework Mapping Table');
  const nextSectionIdx = lines.findIndex((line, idx) =>
    idx > startIdx && line.startsWith('## ')
  );

  if (startIdx === -1) {
    console.error('❌ Cross-Framework Mapping Table section not found');
    process.exit(1);
  }

  console.log(`   Found section at line ${startIdx + 1}`);
  console.log(`   Next section at line ${nextSectionIdx + 1}`);

  // Replace the section
  const replacement = [
    '## Cross-Framework Mappings',
    '',
    'All 51 AIUC-1 requirements are mapped to external frameworks including EU AI Act, ISO 42001, NIST AI RMF, OWASP LLM Top 10, MITRE ATLAS, and CSA AICM.',
    '',
    '**For complete control-to-control mappings**, see:',
    '- `../../mappings/crosswalks/aiuc-1.yaml` - Structured cross-framework control mappings',
    '',
    'The crosswalk file contains mappings for all 51 controls organized by AIUC-1 control ID with confidence levels and evidence citations.',
    '',
    '---',
    ''
  ];

  const newLines = [
    ...lines.slice(0, startIdx),
    ...replacement,
    ...lines.slice(nextSectionIdx)
  ];

  const newContent = newLines.join('\n');

  console.log('\n💾 Writing updated REFERENCE.md...');
  await writeFile(REFERENCE_PATH, newContent);

  console.log('✅ REFERENCE.md updated successfully!');
  console.log(`   Removed ${nextSectionIdx - startIdx} lines`);
  console.log(`   Added ${replacement.length} lines`);
}

updateReference().catch(console.error);
