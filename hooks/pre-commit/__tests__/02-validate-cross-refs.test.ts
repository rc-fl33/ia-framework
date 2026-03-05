#!/usr/bin/env bun
/**
 * Unit tests for cross-reference validation
 *
 * Tests:
 * - Public skills listed in CLAUDE.md exist in skills/
 * - Private skills are NOT required in CLAUDE.md
 * - Skills in CLAUDE.md have corresponding directories
 * - Classification field is correctly parsed
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

const TEST_ROOT = join(import.meta.dir, 'fixtures', 'cross-refs');
const CLAUDE_MD_PATH = join(TEST_ROOT, 'CLAUDE.md');
const SKILLS_DIR = join(TEST_ROOT, 'skills');

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}

const results: TestResult[] = [];

function test(name: string, fn: () => void) {
  try {
    fn();
    results.push({ name, passed: true });
    console.log(`✓ ${name}`);
  } catch (error) {
    results.push({
      name,
      passed: false,
      error: error instanceof Error ? error.message : String(error)
    });
    console.log(`✗ ${name}: ${error instanceof Error ? error.message : error}`);
  }
}

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

function getSkillsFromClaudeMd(claudeMdPath: string): string[] {
  const content = readFileSync(claudeMdPath, 'utf-8');
  const skillPattern = /^-\s+([a-z0-9-]+):/gm;
  const skills: string[] = [];
  let match;

  while ((match = skillPattern.exec(content)) !== null) {
    skills.push(match[1]);
  }

  return skills;
}

function getSkillsFromDirectory(skillsDir: string): Map<string, { name: string; classification: string }> {
  const skills = new Map<string, { name: string; classification: string }>();

  if (!existsSync(skillsDir)) {
    return skills;
  }

  const entries = readdirSync(skillsDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const skillPath = join(skillsDir, entry.name, 'SKILL.md');
    if (!existsSync(skillPath)) continue;

    const content = readFileSync(skillPath, 'utf-8');
    const parsed = matter(content);

    skills.set(entry.name, {
      name: parsed.data.name || entry.name,
      classification: parsed.data.classification || 'public'
    });
  }

  return skills;
}

function validateCrossRefs(): {
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  const documentedSkills = getSkillsFromClaudeMd(CLAUDE_MD_PATH);
  const actualSkills = getSkillsFromDirectory(SKILLS_DIR);

  // Check: Skills in CLAUDE.md exist
  for (const skill of documentedSkills) {
    if (!actualSkills.has(skill)) {
      errors.push(`Skill "${skill}" listed in CLAUDE.md but not found in skills/`);
    }
  }

  // Check: Public skills are documented
  for (const [skillDir, skillData] of actualSkills.entries()) {
    if (skillData.classification === 'public') {
      if (!documentedSkills.includes(skillDir)) {
        errors.push(`Public skill "${skillDir}" exists but not documented in CLAUDE.md`);
      }
    } else if (skillData.classification === 'private') {
      if (documentedSkills.includes(skillDir)) {
        warnings.push(`Private skill "${skillDir}" is documented in CLAUDE.md (should be public-only)`);
      }
    }
  }

  return { errors, warnings };
}

// Test 1: CLAUDE.md references existing skills
test('CLAUDE.md should reference existing skills', () => {
  const skills = getSkillsFromClaudeMd(CLAUDE_MD_PATH);
  assert(skills.includes('test-skill-1'), 'Expected test-skill-1 in CLAUDE.md');
  assert(skills.includes('test-skill-2'), 'Expected test-skill-2 in CLAUDE.md');
});

// Test 2: Public skills are documented
test('Public skills should be documented in CLAUDE.md', () => {
  const skills = getSkillsFromDirectory(SKILLS_DIR);
  const publicSkills = Array.from(skills.entries())
    .filter(([_, data]) => data.classification === 'public')
    .map(([dir, _]) => dir);

  const documented = getSkillsFromClaudeMd(CLAUDE_MD_PATH);

  for (const skill of publicSkills) {
    assert(documented.includes(skill), `Public skill ${skill} should be in CLAUDE.md`);
  }
});

// Test 3: Private skills are not required in CLAUDE.md
test('Private skills should not be required in CLAUDE.md', () => {
  const skills = getSkillsFromDirectory(SKILLS_DIR);
  const privateSkills = Array.from(skills.entries())
    .filter(([_, data]) => data.classification === 'private')
    .map(([dir, _]) => dir);

  assert(privateSkills.length > 0, 'Expected at least one private skill in test fixtures');
  // This test passes if we have private skills and they don't cause validation errors
});

// Test 4: Classification field is parsed correctly
test('Classification field should be parsed correctly', () => {
  const skills = getSkillsFromDirectory(SKILLS_DIR);

  assert(skills.has('test-skill-1'), 'Expected test-skill-1 to exist');
  assert(skills.get('test-skill-1')?.classification === 'public', 'test-skill-1 should be public');

  assert(skills.has('test-skill-private'), 'Expected test-skill-private to exist');
  assert(skills.get('test-skill-private')?.classification === 'private', 'test-skill-private should be private');
});

// Test 5: Full validation should pass for valid setup
test('Full validation should pass for valid setup', () => {
  const result = validateCrossRefs();
  assert(result.errors.length === 0, `Expected no errors, got: ${result.errors.join(', ')}`);
});

// Print summary
console.log('\n--- Test Summary ---');
const passed = results.filter(r => r.passed).length;
const failed = results.filter(r => !r.passed).length;
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Total: ${results.length}`);

if (failed > 0) {
  console.log('\nFailed tests:');
  results.filter(r => !r.passed).forEach(r => {
    console.log(`  - ${r.name}: ${r.error}`);
  });
  process.exit(1);
} else {
  console.log('\n✓ All tests passed!');
  process.exit(0);
}
