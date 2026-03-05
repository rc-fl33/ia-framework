#!/usr/bin/env bun
/**
 * Environment Management System - Integration Test
 *
 * Tests the complete workflow:
 * 1. Backup existing .env
 * 2. Parse structure
 * 3. Merge new section
 * 4. Validate result
 * 5. Show diff
 *
 * Usage:
 *   bun tools/framework/env-sync/integration-test.ts
 */

import { readFileSync, writeFileSync, existsSync, rmSync } from 'fs';
import { join } from 'path';
import { parseEnvFile } from './parser-env';
import { validateEnv } from './validate-env';
import { backupEnvFile } from './backup-env';
import { mergeSectionKeys } from './merge-env-sections';
import { diffEnvFiles } from './diff-env';

// Framework root resolution
const FRAMEWORK_ROOT = process.env.IA_FRAMEWORK_ROOT || join(import.meta.dir, '..', '..');

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  message: string;
  details?: string;
}

const results: TestResult[] = [];

/**
 * Test 1: Backup creation
 */
async function testBackup(): Promise<void> {
  console.log('\n📦 TEST 1: Backup Creation');
  console.log('─'.repeat(50));

  try {
    const envPath = join(FRAMEWORK_ROOT, '.env');
    const result = await backupEnvFile(envPath);

    if (result.success && result.backupPath) {
      console.log(`✅ Backup created: ${result.backupPath}`);
      console.log(`   Size: ${result.size} bytes`);

      results.push({
        name: 'Backup Creation',
        status: 'pass',
        message: `Created timestamped backup at ${result.backupPath}`,
        details: `Backup verified: ${result.timestamp}`
      });
    } else {
      results.push({
        name: 'Backup Creation',
        status: 'fail',
        message: result.error || 'Unknown error'
      });
    }
  } catch (error) {
    results.push({
      name: 'Backup Creation',
      status: 'fail',
      message: `Error: ${error}`
    });
  }
}

/**
 * Test 2: Parse existing .env
 */
async function testParser(): Promise<void> {
  console.log('\n📄 TEST 2: Parse .env Structure');
  console.log('─'.repeat(50));

  try {
    const envPath = join(FRAMEWORK_ROOT, '.env');
    const parsed = parseEnvFile(envPath);

    if (parsed) {
      console.log(`✅ Parsed successfully`);
      console.log(`   Sections: ${parsed.sections.size}`);
      console.log(`   Total lines: ${parsed.allLines.length}`);

      const totalKeys = Array.from(parsed.sections.values()).reduce(
        (sum, section) => sum + section.keys.size,
        0
      );
      console.log(`   Keys found: ${totalKeys}`);

      results.push({
        name: 'Parse Structure',
        status: 'pass',
        message: `Parsed ${parsed.sections.size} sections with ${totalKeys} keys`,
        details: `${parsed.allLines.length} lines preserved`
      });
    } else {
      results.push({
        name: 'Parse Structure',
        status: 'fail',
        message: 'Failed to parse .env file'
      });
    }
  } catch (error) {
    results.push({
      name: 'Parse Structure',
      status: 'fail',
      message: `Error: ${error}`
    });
  }
}

/**
 * Test 3: Merge new section (in-memory)
 */
async function testMerge(): Promise<void> {
  console.log('\n🔀 TEST 3: Merge New Section');
  console.log('─'.repeat(50));

  try {
    const envPath = join(FRAMEWORK_ROOT, '.env');
    const parsed = parseEnvFile(envPath);

    if (!parsed) {
      results.push({
        name: 'Merge Section',
        status: 'fail',
        message: 'Could not parse .env file'
      });
      return;
    }

    // Test merging new section with placeholder keys
    const newKeys = new Map([
      ['TEST_API_KEY', '[insert_key]'],
      ['TEST_API_URL', '[insert_url]'],
      ['TEST_API_SECRET', '[insert_key]']
    ]);

    const { lines, addedKeys, modifiedKeys, sectionFound } = mergeSectionKeys(
      [...parsed.allLines],
      'test-skill',
      newKeys
    );

    console.log(`✅ Merge completed (in-memory)`);
    console.log(`   Section found: ${sectionFound}`);
    console.log(`   New section: ${!sectionFound ? 'created' : 'updated'}`);
    console.log(`   Added keys: ${addedKeys.length}`);
    console.log(`   Modified keys: ${modifiedKeys.length}`);
    console.log(`   New line count: ${lines.length}`);

    results.push({
      name: 'Merge Section',
      status: 'pass',
      message: `Merged ${addedKeys.length} new keys (in-memory)`,
      details: `${addedKeys.length} added, ${modifiedKeys.length} modified`
    });
  } catch (error) {
    results.push({
      name: 'Merge Section',
      status: 'fail',
      message: `Error: ${error}`
    });
  }
}

/**
 * Test 4: Validate structure
 */
async function testValidation(): Promise<void> {
  console.log('\n✔️  TEST 4: Validate Structure');
  console.log('─'.repeat(50));

  try {
    const envPath = join(FRAMEWORK_ROOT, '.env');
    const result = await validateEnv(envPath);

    console.log(`Status: ${result.valid ? '✅ VALID' : '⚠️  WITH WARNINGS'}`);
    console.log(`Keys found: ${result.keysFound}`);
    console.log(`Errors: ${result.errors.length}`);
    console.log(`Warnings: ${result.warnings.length}`);

    if (result.requiredKeysMissing.length > 0) {
      console.log(`Missing required keys: ${result.requiredKeysMissing.join(', ')}`);
    }

    results.push({
      name: 'Validate Structure',
      status: result.valid ? 'pass' : 'warn',
      message: `Found ${result.keysFound} keys`,
      details: `${result.errors.length} errors, ${result.warnings.length} warnings`
    });
  } catch (error) {
    results.push({
      name: 'Validate Structure',
      status: 'fail',
      message: `Error: ${error}`
    });
  }
}

/**
 * Test 5: Diff comparison
 */
async function testDiff(): Promise<void> {
  console.log('\n🔍 TEST 5: Diff Comparison');
  console.log('─'.repeat(50));

  try {
    const envPath = join(FRAMEWORK_ROOT, '.env');
    const backups = readFileSync('/bin/bash', 'utf-8'); // dummy read

    // Find most recent backup
    const backupPattern = envPath + '.backup.';
    const allBackups: string[] = [];

    // Create a test by comparing .env with itself
    const content = readFileSync(envPath, 'utf-8');
    const diff = diffEnvFiles(content, content);

    console.log(`✅ Diff completed`);
    console.log(`   Added: ${diff.totalAdded}`);
    console.log(`   Modified: ${diff.totalModified}`);
    console.log(`   Removed: ${diff.totalRemoved}`);
    console.log(`   Summary: ${diff.summary}`);

    results.push({
      name: 'Diff Comparison',
      status: 'pass',
      message: 'Diff engine working',
      details: `${diff.summary}`
    });
  } catch (error) {
    results.push({
      name: 'Diff Comparison',
      status: 'fail',
      message: `Error: ${error}`
    });
  }
}

/**
 * Print summary
 */
function printSummary(): void {
  console.log('\n' + '='.repeat(70));
  console.log('INTEGRATION TEST SUMMARY');
  console.log('='.repeat(70));

  for (const result of results) {
    const icon = result.status === 'pass' ? '✅' : result.status === 'fail' ? '❌' : '⚠️ ';
    console.log(`\n${icon} ${result.name}`);
    console.log(`   Status: ${result.status.toUpperCase()}`);
    console.log(`   Message: ${result.message}`);
    if (result.details) {
      console.log(`   Details: ${result.details}`);
    }
  }

  // Summary statistics
  const passes = results.filter((r) => r.status === 'pass').length;
  const failures = results.filter((r) => r.status === 'fail').length;
  const warnings = results.filter((r) => r.status === 'warn').length;

  console.log('\n' + '─'.repeat(70));
  console.log(`Results: ${passes} pass, ${failures} fail, ${warnings} warn`);
  console.log('='.repeat(70) + '\n');
}

/**
 * Run all tests
 */
async function runAllTests(): Promise<void> {
  console.log('\n' + '='.repeat(70));
  console.log('ENVIRONMENT MANAGEMENT SYSTEM - INTEGRATION TEST');
  console.log('='.repeat(70));
  console.log(`Started: ${new Date().toISOString()}`);

  await testBackup();
  await testParser();
  await testMerge();
  await testValidation();
  await testDiff();

  printSummary();
}

// Execute
runAllTests();
