/**
 * Session End Hook
 * Closes the session and captures final state when conversation ends
 *
 * PHASE 1 ENHANCEMENT: Automatic state capture with decision extraction
 * - Extracts decisions, objectives, next actions from transcript
 * - Generates actionable summary for next session
 * - Captures all state automatically (no agent involvement)
 */

import { existsSync, readFileSync, writeFileSync, unlinkSync, readdirSync } from 'fs';
import { join, basename } from 'path';
import { execSync } from 'child_process';
import { resolveFrameworkRoot } from '@/tools/framework/utils/path-resolution';
import { addOrUpdateSession, hasSessionsOlderThan } from '@/tools/framework/sessions/session-index';
import { parseSessionYaml, toSessionYaml } from '@/tools/framework/sessions/yaml-parser';

interface SessionEndInput {
  reason?: string;
  transcript_path?: string;
}

interface Session {
  startedAt: string;
  endedAt?: string;
  status: string;
  endReason?: string;
  cwd: string;
  gitCommits: string[];
  filesRead: string[];
  filesModified: string[];
  durationMinutes?: number;
  summary?: string;
  decisions?: string[];
  objectives_completed?: string[];
  next_actions?: string[];
  blockers?: string[];
  next_session_context?: string;
  tags?: string[];
  auditIssues?: AuditIssue[];
  learning_signals?: Record<string, unknown>;
  [key: string]: unknown;
}

interface AuditIssue {
  type: string;
  path: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

async function main() {
  const input = await Bun.stdin.text();

  try {
    const data: SessionEndInput = JSON.parse(input);
    await closeSession(data);
  } catch (err) {
    console.error('Session end error:', (err as Error).message);
    process.exit(0);
  }
}

async function closeSession(data: SessionEndInput): Promise<void> {
  const frameworkRoot = resolveFrameworkRoot();
  const sessionDir = join(frameworkRoot, 'sessions');
  const currentFile = join(sessionDir, '.current');

  if (!existsSync(currentFile)) {
    process.exit(0);
  }

  const sessionId = readFileSync(currentFile, 'utf8').trim();
  const sessionFile = join(sessionDir, `${sessionId}.yaml`);

  if (!existsSync(sessionFile)) {
    process.exit(0);
  }

  const yamlContent = readFileSync(sessionFile, 'utf8');
  const session = parseSessionYaml(yamlContent) as Session;

  // Update end state
  session.endedAt = new Date().toISOString();
  session.status = 'completed';
  session.endReason = data.reason || 'unknown';

  // Try to capture recent git commits made during session
  try {
    const startTime = session.startedAt;
    if (startTime && session.cwd) {
      const commits = execSync(
        `git log --oneline --since="${startTime}" 2>/dev/null || echo ""`,
        { cwd: session.cwd, encoding: 'utf8', timeout: 5000 }
      ).trim().split('\n').filter(Boolean);

      if (commits.length > 0 && commits[0] !== '') {
        session.gitCommits = commits.map(c => c.split(' ')[0]);
      }
    }
  } catch {
    // Git not available or error - continue
  }

  // Calculate duration
  if (session.startedAt && session.endedAt) {
    const start = new Date(session.startedAt);
    const end = new Date(session.endedAt);
    const durationMs = end.getTime() - start.getTime();
    const minutes = Math.floor(durationMs / 60000);
    session.durationMinutes = minutes;
  }

  // PHASE 1: Extract decisions and context from transcript
  if (data.transcript_path && existsSync(data.transcript_path)) {
    try {
      await extractSessionIntelligence(data.transcript_path, session);
    } catch (err) {
      console.error('Decision extraction error:', (err as Error).message);
      // Continue - basic summary is better than nothing
    }
  }

  // Capture file placement violations from pre-commit hook
  capturePreCommitViolations(session, frameworkRoot);

  // Calculate compliance summary from learning signals
  calculateComplianceSummary(session);

  // Generate summary
  session.summary = generateSummary(session);

  // Run file system audit (merge with any existing audit issues from compliance)
  const auditIssues = auditFileSystem();
  if (auditIssues.length > 0) {
    if (!session.auditIssues) session.auditIssues = [];
    session.auditIssues.push(...auditIssues);
  }

  // Write final state
  const yaml = toSessionYaml(session);
  writeFileSync(sessionFile, yaml);

  // OPTIMIZATION: Update session index (O(1) lookup for future sessions)
  try {
    addOrUpdateSession({
      cwd: session.cwd,
      sessionId: sessionId,
      endedAt: session.endedAt || new Date().toISOString(),
      status: 'completed'
    });
  } catch (err) {
    console.error('Index update error:', (err as Error).message);
    // Non-fatal - continue closing
  }

  // Remove .current marker
  unlinkSync(currentFile);

  // Output session close and any audit issues
  console.log(`Session closed: ${sessionId} (${session.durationMinutes || 0} minutes)`);

  const allIssues = session.auditIssues || [];
  if (allIssues.length > 0) {
    console.log('<system-reminder>');
    console.log('FILE SYSTEM AUDIT - Issues Found:');
    console.log('');
    for (const issue of allIssues) {
      const icon = issue.severity === 'error' ? '!!!' : issue.severity === 'warning' ? '!!' : 'i';
      console.log(`[${icon}] ${issue.type}: ${issue.message}`);
      console.log(`    Path: ${issue.path}`);
    }
    console.log('');
    console.log('Review these issues before next session.');
    console.log('</system-reminder>');
  }

  // PHASE 3: Conditional auto-archive (only if old sessions exist)
  // OPTIMIZATION: Check index first before spawning subprocess
  try {
    if (hasSessionsOlderThan(30)) {
      const archiveResult = Bun.spawnSync(['bun', 'tools/framework/sessions/archive-old-sessions.ts'], {
        cwd: frameworkRoot,
        stdout: 'pipe',
        stderr: 'pipe'
      });

      // Only show output if sessions were archived
      const output = archiveResult.stdout.toString();
      if (output.includes('Archived') && !output.includes('No sessions to archive')) {
        console.log(output);
      }
    }
  } catch (err) {
    // Don't fail session-end if archive fails
    console.error('Archive error:', (err as Error).message);
  }
}

/**
 * Read pre-commit file placement violations from temp file and merge into session
 * The temp file is written by hooks/pre-commit/validate-file-placement.ts
 */
function capturePreCommitViolations(session: Session, frameworkRoot: string): void {
  try {
    const violationsPath = join(session.cwd || frameworkRoot, '.file-placement-violations.json');
    if (existsSync(violationsPath)) {
      const violations = JSON.parse(readFileSync(violationsPath, 'utf8'));
      if (!session.learning_signals) {
        session.learning_signals = {
          file_placements: [], structure_violations: [], framework_health: {}
        };
      }
      (session.learning_signals as Record<string, unknown>).structure_violations = violations;
      unlinkSync(violationsPath);
    }
  } catch {
    // Silent fail - never block session end on learning signal capture
  }
}

/**
 * Calculate compliance summary from learning signals and add audit nudge
 * for non-compliant file placements
 */
function calculateComplianceSummary(session: Session): void {
  if (!session.learning_signals) return;

  try {
    const ls = session.learning_signals as Record<string, unknown>;
    const placements = (ls.file_placements || []) as Array<{ compliant: boolean }>;
    const total = placements.length;
    const compliant = placements.filter(p => p.compliant).length;
    const violations = ((ls.structure_violations || []) as unknown[]).length;

    ls.compliance_summary = {
      files_evaluated: total,
      files_compliant: compliant,
      files_non_compliant: total - compliant,
      compliance_rate: total > 0 ? Math.round((compliant / total) * 100) : 100,
      violations_caught_by_hook: violations
    };

    // Add audit nudge for non-compliant placements
    const nonCompliant = total - compliant;
    if (nonCompliant > 0) {
      if (!session.auditIssues) session.auditIssues = [];
      session.auditIssues.push({
        type: 'file_placement',
        path: 'learning_signals',
        message: `${nonCompliant} file(s) placed in non-compliant locations`,
        severity: 'warning'
      });
    }
  } catch {
    // Silent fail - never block session end on compliance calculation
  }
}

/**
 * Extract decisions, objectives, and context from transcript using heuristics
 *
 * NOTE: Cannot use Claude Code's native models from hooks (hooks run as separate processes)
 * Options for LLM extraction:
 *   1. Pattern matching (current implementation - no API calls)
 *   2. Deferred extraction (agent reads transcript and updates session manually)
 *   3. Separate extraction script agent can invoke
 *
 * For now: Simple pattern matching to extract basic intelligence
 */
async function extractSessionIntelligence(transcriptPath: string, session: Session): Promise<void> {
  try {
    const transcript = readFileSync(transcriptPath, 'utf8');

    // Don't process very short sessions (< 2KB transcript)
    if (transcript.length < 2000) {
      session.next_session_context = 'Brief session - minimal context';
      return;
    }

    // Simple heuristic extraction (no LLM needed)
    const decisions: string[] = [];
    const objectives: string[] = [];
    const nextActions: string[] = [];
    const blockers: string[] = [];
    const tags = new Set<string>();

    // Extract from common patterns
    const lines = transcript.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();

      // Detect decisions
      if (line.includes('decided to') || line.includes('decision:') || line.includes('we should')) {
        decisions.push(lines[i].trim().slice(0, 150));
      }

      // Detect completions
      if (line.includes('completed') || line.includes('implemented') || line.includes('fixed')) {
        objectives.push(lines[i].trim().slice(0, 150));
      }

      // Detect next actions
      if (line.includes('next:') || line.includes('todo:') || line.includes('should do')) {
        nextActions.push(lines[i].trim().slice(0, 150));
      }

      // Detect blockers
      if (line.includes('blocked') || line.includes('issue:') || line.includes('problem:')) {
        blockers.push(lines[i].trim().slice(0, 150));
      }

      // Extract tags from file paths
      if (line.includes('skills/')) {
        const skillMatch = line.match(/skills\/([^\/\s]+)/);
        if (skillMatch) tags.add(skillMatch[1]);
      }
    }

    // Populate session fields (limit to top 5 each)
    if (decisions.length > 0) {
      session.decisions = decisions.slice(0, 5);
    }
    if (objectives.length > 0) {
      session.objectives_completed = objectives.slice(0, 5);
    }
    if (nextActions.length > 0) {
      session.next_actions = nextActions.slice(0, 5);
    }
    if (blockers.length > 0) {
      session.blockers = blockers.slice(0, 5);
    }
    if (tags.size > 0) {
      session.tags = Array.from(tags).slice(0, 5);
    }

    // Generate simple context summary
    const contextParts: string[] = [];
    if (objectives.length > 0) {
      contextParts.push(`Completed ${objectives.length} task(s)`);
    }
    if (decisions.length > 0) {
      contextParts.push(`Made ${decisions.length} decision(s)`);
    }
    if (nextActions.length > 0) {
      contextParts.push(`${nextActions.length} action(s) identified`);
    }

    session.next_session_context = contextParts.join('. ') || 'Session activity captured';

  } catch (err) {
    console.error('Intelligence extraction failed:', (err as Error).message);
    // Non-fatal - continue with basic summary
  }
}

function generateSummary(session: Session): string {
  const parts: string[] = [];

  const filesRead = session.filesRead?.length || 0;
  const filesModified = session.filesModified?.length || 0;
  const commits = session.gitCommits?.length || 0;
  const decisions = session.decisions?.length || 0;
  const objectives = session.objectives_completed?.length || 0;

  if (objectives > 0) {
    parts.push(`Completed ${objectives} objective${objectives > 1 ? 's' : ''}`);
  }
  if (decisions > 0) {
    parts.push(`${decisions} decision${decisions > 1 ? 's' : ''} made`);
  }
  if (filesModified > 0) {
    parts.push(`Modified ${filesModified} file${filesModified > 1 ? 's' : ''}`);
  }
  if (commits > 0) {
    parts.push(`${commits} commit${commits > 1 ? 's' : ''}`);
  }

  return parts.join(', ') || 'No significant activity';
}

/**
 * Check if .framework-manifest.yaml is in sync with actual skills
 */
function checkManifestSync(frameworkPath: string, manifestPath: string): AuditIssue[] {
  const issues: AuditIssue[] = [];

  try {
    // Get actual skills from filesystem
    const skillsPath = join(frameworkPath, 'skills');
    if (!existsSync(skillsPath)) return issues;

    const actualSkills = readdirSync(skillsPath, { withFileTypes: true })
      .filter(d => d.isDirectory() && !d.name.startsWith('.'))
      .map(d => d.name)
      .filter(name => name !== 'README.md')
      .sort();

    // Read manifest to get listed skills
    const manifestContent = readFileSync(manifestPath, 'utf-8');
    const listedSkills = new Set<string>();

    // Parse public skills from manifest (simple pattern matching)
    const publicMatch = manifestContent.match(/skills:\s*\n\s*include:\s*\n((?:\s*-\s*skills\/[^/]+\/\*\*[^\n]*\n)+)/);
    if (publicMatch) {
      const publicLines = publicMatch[1].match(/skills\/([^/]+)\/\*\*/g) || [];
      publicLines.forEach(line => {
        const skill = line.match(/skills\/([^/]+)\//)?.[1];
        if (skill) listedSkills.add(skill);
      });
    }

    // Parse private skills from manifest
    const privateMatch = manifestContent.match(/private_skills:\s*\n((?:\s*-\s*skills\/[^/]+\/\*\*[^\n]*\n)+)/);
    if (privateMatch) {
      const privateLines = privateMatch[1].match(/skills\/([^/]+)\/\*\*/g) || [];
      privateLines.forEach(line => {
        const skill = line.match(/skills\/([^/]+)\//)?.[1];
        if (skill) listedSkills.add(skill);
      });
    }

    // Find mismatches
    const missingFromManifest = actualSkills.filter(s => !listedSkills.has(s));
    const missingFromDisk = Array.from(listedSkills).filter(s => !actualSkills.includes(s));

    // Report issues
    if (missingFromManifest.length > 0) {
      issues.push({
        type: 'manifest-sync',
        path: '.framework-manifest.yaml',
        message: `Skills exist but not in manifest: ${missingFromManifest.join(', ')}`,
        severity: 'warning'
      });
    }

    if (missingFromDisk.length > 0) {
      issues.push({
        type: 'manifest-sync',
        path: '.framework-manifest.yaml',
        message: `Skills in manifest but deleted from disk: ${missingFromDisk.join(', ')}`,
        severity: 'warning'
      });
    }

  } catch (err) {
    // Don't fail on manifest sync errors
    console.error('Manifest sync check error:', (err as Error).message);
  }

  return issues;
}

/**
 * Audit file system for governance violations
 */
function auditFileSystem(): AuditIssue[] {
  const issues: AuditIssue[] = [];
  const frameworkPath = resolveFrameworkRoot();

  try {
    // 0. Check and auto-fix manifest sync (if manifest exists)
    const manifestPath = join(frameworkPath, '.framework-manifest.yaml');
    if (existsSync(manifestPath)) {
      const manifestIssues = checkManifestSync(frameworkPath, manifestPath);

      // AUTO-FIX: If drift detected, auto-sync manifest
      if (manifestIssues.length > 0) {
        try {
          console.log('🔧 Auto-fixing manifest drift...');
          const result = Bun.spawnSync(['bun', 'tools/framework/manifest/sync-manifest.ts'], {
            cwd: frameworkPath,
            stdout: 'pipe',
            stderr: 'pipe'
          });

          if (result.exitCode === 0) {
            console.log('✅ Manifest auto-synced successfully');
            // Don't add issues to audit - it's fixed
          } else {
            console.error('❌ Manifest sync failed:', result.stderr.toString());
            issues.push(...manifestIssues); // Keep issues if auto-fix failed
          }
        } catch (err) {
          console.error('❌ Manifest sync error:', (err as Error).message);
          issues.push(...manifestIssues); // Keep issues if auto-fix failed
        }
      }
    }

    // 1. Check for orphaned files in root
    const allowedRoot = [
      // GitHub convention files (must be in root for GitHub UI)
      'CLAUDE.md', 'README.md', 'CHANGELOG.md', 'SECURITY.md',
      'CONTRIBUTING.md', 'INSTALL.md', 'CODE_OF_CONDUCT.md',
      'SUPPORT.md', 'LICENSE.md', 'LICENSE',
      // Build/config files
      'package.json', 'tsconfig.json', 'settings.json',
      'jest.config.js', '.env', '.gitignore',
      'package-lock.json', 'bun.lockb'
    ];

    if (existsSync(frameworkPath)) {
      const rootFiles = readdirSync(frameworkPath);
      for (const file of rootFiles) {
        // Skip directories and hidden files
        if (file.startsWith('.') && file !== '.env' && file !== '.gitignore') continue;

        const filePath = join(frameworkPath, file);
        try {
          const stats = require('fs').statSync(filePath);
          if (stats.isDirectory()) continue;
        } catch {
          continue;
        }

        if (file.endsWith('.md') && !allowedRoot.includes(file)) {
          issues.push({
            type: 'orphan',
            path: file,
            message: `Markdown file in root - should be in docs/`,
            severity: 'warning'
          });
        }
      }
    }

    // 2. Required docs check removed - different repos have different doc requirements
    // Public repo uses catalog-based discovery, private repo has extensive docs

    // 4. Check for temp file cleanup
    const tempPath = join(frameworkPath, '.tmp');
    if (existsSync(tempPath)) {
      const tempFiles = readdirSync(tempPath);
      if (tempFiles.length > 0) {
        issues.push({
          type: 'cleanup',
          path: '.tmp/',
          message: `${tempFiles.length} temp file(s) should be cleaned`,
          severity: 'info'
        });
      }
    }

    // 5. Module structure check removed - uses skills/ architecture now, not modules/

  } catch (err) {
    // Don't fail on audit errors
    console.error('Audit error:', (err as Error).message);
  }

  return issues;
}


main();
