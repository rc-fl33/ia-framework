#!/usr/bin/env bun
/**
 * UPS v2.0 Structure Validator
 *
 * Scans all phase and command markdown files across skills
 * to verify Universal Prompt Structure compliance.
 *
 * Checks:
 * 1. METADATA frontmatter (required fields)
 * 2. Required UPS sections (IDENTITY through CHECKPOINTS, plus security-specific sections for prompts)
 * 3. NEXT routing (file paths exist)
 * 4. OUTPUT → INPUT contract alignment (advisory)
 * 5. Security prompt-specific: FLEXIBILITY GUIDANCE, PROOF CLASSIFICATION, TEST PLAN INTEGRATION, REFERENCES
 *
 * Usage:
 *   bun tools/validation/validate-ups-structure.ts              # All skills
 *   bun tools/validation/validate-ups-structure.ts --skill=career  # One skill
 *   bun tools/validation/validate-ups-structure.ts --json         # JSON output
 *   bun tools/validation/validate-ups-structure.ts --fix-report   # Generate fix report
 */

import { readFileSync, readdirSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, basename, dirname, relative } from 'path';
import { parseMarkdownSections, hasSection, findSection, extractFilePaths } from '../markdown/section-parser';

// --- Configuration ---

const FRAMEWORK_ROOT = join(import.meta.dir, '..', '..');

const REQUIRED_FRONTMATTER_FIELDS = [
  'domain', 'skill', 'agent', 'model', 'mode', 'complexity', 'chain_position',
];

const REQUIRED_SECTIONS = [
  'IDENTITY',
  'INPUT CONTRACT',
  'OBJECTIVE',
  'METHODOLOGY',
  'EXECUTION',
  'OUTPUT CONTRACT',
  'NEXT',
  'CHECKPOINTS',
];

// Additional sections required for security prompts (skills/pentest/prompts/**)
const SECURITY_PROMPT_SECTIONS = [
  'FLEXIBILITY GUIDANCE',
  'PROOF CLASSIFICATION',
  'TEST PLAN INTEGRATION',
  'REFERENCES',
];

// Additional frontmatter field required for security prompts
const SECURITY_PROMPT_FRONTMATTER = ['flexibility_tier'];

// Skills that haven't been standardized yet (exclude from validation)
const EXCLUDED_SKILLS: string[] = [];

// --- Types ---

interface UPSFailure {
  check: string;
  expected?: string;
  actual?: string;
  message: string;
  fix_instructions: string;
  severity: 'critical' | 'warning';
}

interface UPSFileResult {
  file: string;
  relativePath: string;
  skill: string;
  fileType: 'phase' | 'command' | 'prompt';
  passed: boolean;
  failures: UPSFailure[];
}

interface UPSReport {
  timestamp: string;
  filesScanned: number;
  filesPassed: number;
  filesFailed: number;
  criticalCount: number;
  warningCount: number;
  results: UPSFileResult[];
  skillSummary: Record<string, { total: number; passed: number; failed: number }>;
}

// --- Argument parsing ---

const args = process.argv.slice(2);
const skillFilter = args.find(a => a.startsWith('--skill='))?.split('=')[1];
const jsonOutput = args.includes('--json');
const fixReport = args.includes('--fix-report');

// --- File discovery ---

function discoverFiles(): { path: string; skill: string; type: 'phase' | 'command' | 'prompt' }[] {
  const files: { path: string; skill: string; type: 'phase' | 'command' | 'prompt' }[] = [];
  const skillsDir = join(FRAMEWORK_ROOT, 'skills');

  if (!existsSync(skillsDir)) {
    console.error('Skills directory not found');
    process.exit(2);
  }

  const skills = readdirSync(skillsDir, { withFileTypes: true })
    .filter(e => e.isDirectory())
    .map(e => e.name)
    .filter(s => !EXCLUDED_SKILLS.includes(s))
    .filter(s => !skillFilter || s === skillFilter);

  if (skillFilter && skills.length === 0) {
    console.error(`Skill not found: ${skillFilter}`);
    process.exit(2);
  }

  for (const skill of skills) {
    // Phase files
    const phasesDir = join(skillsDir, skill, 'phases');
    if (existsSync(phasesDir)) {
      const phaseFiles = readdirSync(phasesDir).filter(f => f.endsWith('.md'));
      for (const file of phaseFiles) {
        files.push({ path: join(phasesDir, file), skill, type: 'phase' });
      }
    }

    // Command files
    const commandsDir = join(skillsDir, skill, 'commands');
    if (existsSync(commandsDir)) {
      const cmdFiles = readdirSync(commandsDir).filter(f => f.endsWith('.md'));
      for (const file of cmdFiles) {
        files.push({ path: join(commandsDir, file), skill, type: 'command' });
      }
    }

    // Security prompt files (recursive scan of prompts/ subdirectories)
    const promptsDir = join(skillsDir, skill, 'prompts');
    if (existsSync(promptsDir)) {
      function scanPromptsDir(dir: string): void {
        const entries = readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = join(dir, entry.name);
          if (entry.isDirectory()) {
            // Skip shared/ directory (contains includes, not standalone prompts)
            if (entry.name === 'shared') continue;
            scanPromptsDir(fullPath);
          } else if (entry.name.endsWith('.md') && entry.name !== 'TEMPLATE.md') {
            files.push({ path: fullPath, skill, type: 'prompt' });
          }
        }
      }
      scanPromptsDir(promptsDir);
    }
  }

  return files;
}

// --- Validators ---

function validateFile(filePath: string, skill: string, fileType: 'phase' | 'command' | 'prompt'): UPSFileResult {
  const relativePath = relative(FRAMEWORK_ROOT, filePath);
  const failures: UPSFailure[] = [];
  const fileName = basename(filePath);

  let content: string;
  try {
    content = readFileSync(filePath, 'utf-8');
  } catch (err) {
    failures.push({
      check: 'file_read',
      message: `Cannot read file: ${err}`,
      fix_instructions: 'Verify file exists and is readable',
      severity: 'critical',
    });
    return { file: filePath, relativePath, skill, fileType, passed: false, failures };
  }

  const parsed = parseMarkdownSections(content);

  // --- Check 1: Frontmatter ---
  if (!parsed.frontmatter) {
    failures.push({
      check: 'frontmatter_missing',
      expected: 'YAML frontmatter with --- delimiters',
      actual: 'No frontmatter found',
      message: 'Missing METADATA frontmatter',
      fix_instructions: 'Add YAML frontmatter block at top of file with required fields: ' +
        REQUIRED_FRONTMATTER_FIELDS.join(', '),
      severity: 'critical',
    });
  } else {
    for (const field of REQUIRED_FRONTMATTER_FIELDS) {
      if (!(field in parsed.frontmatter)) {
        failures.push({
          check: 'frontmatter_field',
          expected: `Field "${field}" present in frontmatter`,
          actual: `Field "${field}" missing`,
          message: `Missing frontmatter field: ${field}`,
          fix_instructions: `Add "${field}:" to YAML frontmatter`,
          severity: 'critical',
        });
      }
    }
  }

  // --- Check 2: Required sections ---
  for (const section of REQUIRED_SECTIONS) {
    if (!hasSection(parsed.sections, section)) {
      failures.push({
        check: 'missing_section',
        expected: `## ${section} section`,
        actual: 'Section not found',
        message: `Missing required section: ${section}`,
        fix_instructions: `Add "## ${section}" section to ${fileName}`,
        severity: 'critical',
      });
    }
  }

  // --- Check 2b: Security prompt-specific sections ---
  if (fileType === 'prompt') {
    for (const section of SECURITY_PROMPT_SECTIONS) {
      if (!hasSection(parsed.sections, section)) {
        failures.push({
          check: 'missing_section',
          expected: `## ${section} section (required for security prompts)`,
          actual: 'Section not found',
          message: `Missing security prompt section: ${section}`,
          fix_instructions: `Add "## ${section}" section to ${fileName}`,
          severity: 'critical',
        });
      }
    }

    // Check security-specific frontmatter fields
    if (parsed.frontmatter) {
      for (const field of SECURITY_PROMPT_FRONTMATTER) {
        if (!(field in parsed.frontmatter)) {
          failures.push({
            check: 'frontmatter_field',
            expected: `Field "${field}" present in frontmatter (required for security prompts)`,
            actual: `Field "${field}" missing`,
            message: `Missing security prompt frontmatter field: ${field}`,
            fix_instructions: `Add "${field}:" to YAML frontmatter`,
            severity: 'critical',
          });
        }
      }
    }

    // Check that every ### Step has a **Tool:** line
    const executionSection = findSection(parsed.sections, 'EXECUTION');
    if (executionSection) {
      const stepSections = parsed.sections.filter(
        s => s.level === 3 && s.title.toLowerCase().includes('step')
      );
      for (const step of stepSections) {
        if (!step.content.includes('**Tool:**')) {
          failures.push({
            check: 'missing_tool_tag',
            expected: `**Tool:** line in ${step.title}`,
            actual: 'No **Tool:** line found',
            message: `${step.title} missing **Tool:** tag`,
            fix_instructions: `Add "**Tool:** Bash", "**Tool:** Read", or "**Tool:** Write" to ${step.title}`,
            severity: 'critical',
          });
        }
      }
    }
  }

  // --- Check 3: NEXT routing paths ---
  const nextSection = findSection(parsed.sections, 'NEXT');
  if (nextSection) {
    const paths = extractFilePaths(nextSection.content);
    for (const p of paths) {
      // Skip template paths with variables like {topic}, {client-dir}
      if (p.includes('{') && p.includes('}')) continue;

      // Skip input/output paths (user-provided content, not part of skill structure)
      if (p.includes('/input/') || p.includes('/output/')) continue;

      const fullPath = join(FRAMEWORK_ROOT, p);
      if (!existsSync(fullPath)) {
        failures.push({
          check: 'broken_routing',
          expected: `File exists: ${p}`,
          actual: 'File not found',
          message: `NEXT section references non-existent file: ${p}`,
          fix_instructions: `Verify path is correct or update to actual file location`,
          severity: 'critical',
        });
      }
    }
  }

  // --- Check 4: Empty sections (warning) ---
  // EXECUTION sections typically have content in ### Step sub-headers,
  // so we check if the section OR its sub-sections have content.
  for (const section of REQUIRED_SECTIONS) {
    const found = findSection(parsed.sections, section);
    if (found && found.content.trim().length < 10) {
      // For EXECUTION, check if there are Step sub-headers following it
      if (section === 'EXECUTION') {
        const idx = parsed.sections.indexOf(found);
        const hasSteps = parsed.sections.slice(idx + 1).some(
          s => s.level > found.level && s.title.toLowerCase().includes('step')
        );
        if (hasSteps) continue; // Not actually empty — content is in sub-steps
      }

      failures.push({
        check: 'empty_section',
        expected: `Meaningful content in ## ${section}`,
        actual: `Only ${found.content.trim().length} characters`,
        message: `Section "${section}" appears empty or minimal`,
        fix_instructions: `Add substantive content to ## ${section} section`,
        severity: 'warning',
      });
    }
  }

  return {
    file: filePath,
    relativePath,
    skill,
    fileType,
    passed: failures.filter(f => f.severity === 'critical').length === 0,
    failures,
  };
}

// --- Cross-phase contract matching ---

function validateContracts(results: UPSFileResult[]): UPSFailure[] {
  const warnings: UPSFailure[] = [];

  // Group phase files by skill
  const skillPhases: Record<string, UPSFileResult[]> = {};
  for (const r of results) {
    if (r.fileType !== 'phase') continue;
    if (!skillPhases[r.skill]) skillPhases[r.skill] = [];
    skillPhases[r.skill].push(r);
  }

  for (const [skill, phases] of Object.entries(skillPhases)) {
    // Sort by filename (00-workflow.md, 01-xxx.md, 02-xxx.md, etc.)
    phases.sort((a, b) => basename(a.file).localeCompare(basename(b.file)));

    // Check consecutive phases for OUTPUT → INPUT alignment
    for (let i = 0; i < phases.length - 1; i++) {
      const current = phases[i];
      const next = phases[i + 1];

      // Skip 00-workflow (it's the orchestrator, not a sequential phase)
      if (basename(current.file).startsWith('00-')) continue;

      const currentContent = readFileSync(current.file, 'utf-8');
      const nextContent = readFileSync(next.file, 'utf-8');
      const currentParsed = parseMarkdownSections(currentContent);
      const nextParsed = parseMarkdownSections(nextContent);

      const outputSection = findSection(currentParsed.sections, 'OUTPUT CONTRACT');
      const inputSection = findSection(nextParsed.sections, 'INPUT CONTRACT');

      if (outputSection && inputSection) {
        const outputPaths = extractFilePaths(outputSection.content);
        const inputPaths = extractFilePaths(inputSection.content);

        // Simple check: does the next phase's INPUT reference at least one of the current phase's outputs?
        if (outputPaths.length > 0 && inputPaths.length > 0) {
          const outputFiles = outputPaths.map(p => basename(p));
          const inputFiles = inputPaths.map(p => basename(p));
          const overlap = outputFiles.some(f => inputFiles.includes(f));

          if (!overlap) {
            warnings.push({
              check: 'contract_mismatch',
              expected: `${basename(next.file)} INPUT references outputs from ${basename(current.file)}`,
              actual: `OUTPUT files: ${outputFiles.join(', ')} | INPUT files: ${inputFiles.join(', ')}`,
              message: `[${skill}] ${basename(current.file)} → ${basename(next.file)}: OUTPUT/INPUT contract mismatch`,
              fix_instructions: 'Verify this is intentional — the next phase may receive inputs through other means',
              severity: 'warning',
            });
          }
        }
      }
    }
  }

  return warnings;
}

// --- Reporting ---

function generateReport(results: UPSFileResult[], contractWarnings: UPSFailure[]): UPSReport {
  const skillSummary: Record<string, { total: number; passed: number; failed: number }> = {};

  for (const r of results) {
    if (!skillSummary[r.skill]) {
      skillSummary[r.skill] = { total: 0, passed: 0, failed: 0 };
    }
    skillSummary[r.skill].total++;
    if (r.passed) {
      skillSummary[r.skill].passed++;
    } else {
      skillSummary[r.skill].failed++;
    }
  }

  const allFailures = results.flatMap(r => r.failures).concat(contractWarnings);

  return {
    timestamp: new Date().toISOString(),
    filesScanned: results.length,
    filesPassed: results.filter(r => r.passed).length,
    filesFailed: results.filter(r => !r.passed).length,
    criticalCount: allFailures.filter(f => f.severity === 'critical').length,
    warningCount: allFailures.filter(f => f.severity === 'warning').length,
    results,
    skillSummary,
  };
}

function printConsoleReport(report: UPSReport, contractWarnings: UPSFailure[]): void {
  const SEP = '='.repeat(70);
  const THIN = '─'.repeat(70);

  console.log(`\n${SEP}`);
  console.log('  UPS v2.0 STRUCTURE VALIDATION');
  console.log(SEP);
  console.log();
  console.log(`  Files scanned: ${report.filesScanned}`);
  console.log(`  Files passed:  ${report.filesPassed}`);
  console.log(`  Files failed:  ${report.filesFailed}`);
  console.log(`  Critical:      ${report.criticalCount}`);
  console.log(`  Warnings:      ${report.warningCount}`);
  console.log();

  // Skill summary table
  console.log(THIN);
  console.log('  SKILL SUMMARY');
  console.log(THIN);
  for (const [skill, summary] of Object.entries(report.skillSummary).sort((a, b) => a[0].localeCompare(b[0]))) {
    const icon = summary.failed === 0 ? '✅' : '❌';
    console.log(`  ${icon} ${skill.padEnd(28)} ${summary.passed}/${summary.total} passed`);
  }
  console.log();

  // Critical failures grouped by file
  const criticalResults = report.results.filter(r => r.failures.some(f => f.severity === 'critical'));
  if (criticalResults.length > 0) {
    console.log(THIN);
    console.log(`  🚨 CRITICAL FAILURES (${report.criticalCount})`);
    console.log(THIN);
    for (const r of criticalResults) {
      console.log();
      console.log(`  ${r.relativePath}`);
      const criticals = r.failures.filter(f => f.severity === 'critical');
      for (const f of criticals) {
        console.log(`    ❌ ${f.message}`);
        if (f.expected) console.log(`       Expected: ${f.expected}`);
        if (f.actual) console.log(`       Actual:   ${f.actual}`);
        console.log(`       Fix: ${f.fix_instructions}`);
      }
    }
    console.log();
  }

  // Warnings grouped by file
  const warningResults = report.results.filter(r => r.failures.some(f => f.severity === 'warning'));
  if (warningResults.length > 0 || contractWarnings.length > 0) {
    console.log(THIN);
    console.log(`  ⚠️  WARNINGS (${report.warningCount})`);
    console.log(THIN);

    for (const r of warningResults) {
      const warnings = r.failures.filter(f => f.severity === 'warning');
      if (warnings.length === 0) continue;
      console.log();
      console.log(`  ${r.relativePath}`);
      for (const f of warnings) {
        console.log(`    ⚠️  ${f.message}`);
        if (f.fix_instructions) console.log(`       Note: ${f.fix_instructions}`);
      }
    }

    if (contractWarnings.length > 0) {
      console.log();
      console.log('  Cross-phase contract mismatches:');
      for (const f of contractWarnings) {
        console.log(`    ⚠️  ${f.message}`);
        if (f.actual) console.log(`       ${f.actual}`);
      }
    }
    console.log();
  }

  // Final verdict
  console.log(SEP);
  if (report.criticalCount === 0) {
    console.log('  ✅ VALIDATION PASSED');
    if (report.warningCount > 0) {
      console.log(`     (${report.warningCount} warnings — review recommended)`);
    }
  } else {
    console.log(`  ❌ VALIDATION FAILED (${report.criticalCount} critical, ${report.warningCount} warnings)`);
  }
  console.log(SEP);
  console.log();
}

function writeLogFile(report: UPSReport): void {
  const logDir = join(FRAMEWORK_ROOT, 'logs', 'validation');
  if (!existsSync(logDir)) {
    mkdirSync(logDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const logPath = join(logDir, `ups-validation-${timestamp}.log`);

  const lines: string[] = [
    `UPS v2.0 Structure Validation — ${report.timestamp}`,
    '='.repeat(60),
    '',
    `Files scanned: ${report.filesScanned}`,
    `Files passed: ${report.filesPassed}`,
    `Files failed: ${report.filesFailed}`,
    `Critical: ${report.criticalCount}`,
    `Warnings: ${report.warningCount}`,
    '',
  ];

  for (const r of report.results) {
    if (r.failures.length === 0) continue;
    lines.push(`FILE: ${r.relativePath}`);
    for (const f of r.failures) {
      const icon = f.severity === 'critical' ? '❌' : '⚠️';
      lines.push(`  ${icon} [${f.severity}] ${f.message}`);
      if (f.fix_instructions) lines.push(`     Fix: ${f.fix_instructions}`);
    }
    lines.push('');
  }

  writeFileSync(logPath, lines.join('\n'), 'utf-8');
  console.log(`Log written to: ${relative(FRAMEWORK_ROOT, logPath)}`);
}

// --- Main ---

function main(): void {
  const files = discoverFiles();

  if (files.length === 0) {
    console.log('No files found to validate.');
    process.exit(0);
  }

  // Validate each file
  const results: UPSFileResult[] = [];
  for (const f of files) {
    results.push(validateFile(f.path, f.skill, f.type));
  }

  // Cross-phase contract matching
  const contractWarnings = validateContracts(results);

  // Generate report
  const report = generateReport(results, contractWarnings);

  if (jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    printConsoleReport(report, contractWarnings);
    writeLogFile(report);
  }

  // Exit code
  if (report.criticalCount > 0) {
    process.exit(2);
  } else if (report.warningCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main();
