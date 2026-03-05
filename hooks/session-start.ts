/**
 * Session Start Hook
 * Creates a new session file when a Claude Code conversation begins
 *
 * PHASE 1 ENHANCEMENT: Continuation detection and context enforcement
 * - Detects related previous sessions (same CWD, recent activity)
 * - Injects MANDATORY reminder to read previous session
 * - Provides summary of previous work
 * - Enforces "read first" pattern via strong system-reminder
 */

import { mkdirSync, writeFileSync, existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { resolveFrameworkRoot } from '@/tools/framework/utils/path-resolution';
import { findRecentSessionByCwd, loadIndex, rebuildIndex } from '@/tools/framework/sessions/session-index';
import { parseSessionYaml, toSessionYaml } from '@/tools/framework/sessions/yaml-parser';

interface SessionStartInput {
  session_id: string;
  cwd: string;
  transcript_path: string;
}

interface Session {
  id: string;
  claudeSessionId: string;
  date: string;
  startedAt: string;
  lastActivityAt: string;
  lastCheckpointAt: string;
  status: 'active' | 'completed';
  cwd: string;
  transcriptPath: string;
  filesRead: string[];
  filesModified: string[];
  gitCommits: string[];
  toolCalls: Record<string, number>;
  objectives: string[];
  decisions: string[];
  ideas: string[];
  active_module?: string;
  workflow?: string;
  workflow_state?: {
    current_phase: string;
    phase_data: Record<string, unknown>;
    checkpoints_passed: string[];
  };
  learning_signals?: Record<string, unknown>;
}

interface LoadedSession extends Record<string, unknown> {
  id?: string;
  endedAt?: string;
  durationMinutes?: number;
  next_session_context?: string;
  decisions?: string[];
  next_actions?: string[];
  blockers?: string[];
}

async function main() {
  const input = await Bun.stdin.text();

  try {
    const data: SessionStartInput = JSON.parse(input);
    const sessionId = createSession(data);
    injectStartupSequence(sessionId);

    // PHASE 1: Detect continuation and inject context reminder
    await detectContinuation(data.cwd, sessionId);

    await loadUserConfig();
    await loadModuleFrontmatter();
    await generateFrameworkStats();
  } catch (err) {
    console.error('Session start error:', (err as Error).message);
    process.exit(0); // Don't block Claude Code
  }
}

/**
 * Inject startup sequence reminder - aligned with CLAUDE.md enforcement patterns
 */
function injectStartupSequence(sessionId: string): void {
  console.log(`SessionStart:compact hook success: Session created: ${sessionId}`);
}

/**
 * Detect continuation sessions and inject MANDATORY read reminder
 * This enforces the "read session context first" pattern
 *
 * OPTIMIZATION: Uses session index for O(n) lookup instead of full filesystem scan
 * On first run, rebuilds index if corrupted/missing
 */
async function detectContinuation(cwd: string, currentSessionId: string): Promise<void> {
  try {
    const frameworkRoot = resolveFrameworkRoot();
    const sessionDir = join(frameworkRoot, 'sessions');

    if (!existsSync(sessionDir)) {
      return; // No sessions yet
    }

    // Ensure index exists and is valid
    let index = loadIndex();
    if (index.length === 0 && readdirSync(sessionDir).filter(f => f.endsWith('.yaml')).length > 0) {
      // Index missing but sessions exist - rebuild it
      index = rebuildIndex();
    }

    const now = new Date();
    const sevenDaysAgo = now.getTime() - (7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = now.getTime() - (30 * 24 * 60 * 60 * 1000);

    // Find recent session (< 7 days) using index O(n) lookup
    const recentEntry = findRecentSessionByCwd(cwd, 7 * 24 * 60 * 60 * 1000);

    let mostRecentSession: LoadedSession | null = null;
    let staleSession: LoadedSession | null = null;

    if (recentEntry && new Date(recentEntry.endedAt).getTime() > sevenDaysAgo) {
      // Load full session data from YAML
      const sessionFile = join(sessionDir, `${recentEntry.sessionId}.yaml`);
      if (existsSync(sessionFile)) {
        try {
          const content = readFileSync(sessionFile, 'utf8');
          mostRecentSession = {
            ...parseSessionYaml(content),
            id: recentEntry.sessionId
          };
        } catch {
          // Fall through if file is malformed
        }
      }
    }

    // If no recent session, check for stale session (7-30 days)
    if (!mostRecentSession) {
      const staleEntry = index
        .filter(e => e.cwd === cwd && e.status === 'completed')
        .filter(e => {
          const t = new Date(e.endedAt).getTime();
          return t > thirtyDaysAgo && t <= sevenDaysAgo;
        })
        .sort((a, b) => new Date(b.endedAt).getTime() - new Date(a.endedAt).getTime())[0];

      if (staleEntry) {
        const sessionFile = join(sessionDir, `${staleEntry.sessionId}.yaml`);
        if (existsSync(sessionFile)) {
          try {
            const content = readFileSync(sessionFile, 'utf8');
            staleSession = {
              ...parseSessionYaml(content),
              id: staleEntry.sessionId
            };
          } catch {
            // Fall through if file is malformed
          }
        }
      }
    }

    // If found continuation, inject STRONG reminder
    if (mostRecentSession) {
      const endTime = new Date(mostRecentSession.endedAt);
      const hoursAgo = Math.floor((now.getTime() - endTime.getTime()) / (1000 * 60 * 60));
      const daysAgo = Math.floor(hoursAgo / 24);

      const timeAgo = daysAgo > 0
        ? `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`
        : `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;

      console.log('<system-reminder>');
      console.log('🛑 STOP - CONTINUATION DETECTED');
      console.log('');
      console.log(`Previous session: ${mostRecentSession.id}`);
      console.log(`Ended: ${timeAgo}`);
      console.log(`Duration: ${mostRecentSession.durationMinutes || 0} minutes`);
      console.log('');

      // Show context preview
      if (mostRecentSession.next_session_context) {
        console.log('PREVIOUS CONTEXT:');
        console.log(mostRecentSession.next_session_context);
        console.log('');
      }

      // Show decisions
      if (mostRecentSession.decisions && mostRecentSession.decisions.length > 0) {
        console.log('DECISIONS MADE:');
        mostRecentSession.decisions.slice(0, 3).forEach((d: string) => {
          console.log(`  • ${d}`);
        });
        if (mostRecentSession.decisions.length > 3) {
          console.log(`  ... and ${mostRecentSession.decisions.length - 3} more`);
        }
        console.log('');
      }

      // Show next actions
      if (mostRecentSession.next_actions && mostRecentSession.next_actions.length > 0) {
        console.log('NEXT ACTIONS:');
        mostRecentSession.next_actions.slice(0, 3).forEach((a: string) => {
          console.log(`  • ${a}`);
        });
        console.log('');
      }

      // Show blockers
      if (mostRecentSession.blockers && mostRecentSession.blockers.length > 0) {
        console.log('⚠️  BLOCKERS:');
        mostRecentSession.blockers.forEach((b: string) => {
          console.log(`  • ${b}`);
        });
        console.log('');
      }

      console.log('MANDATORY: Read this file FIRST before proceeding:');
      console.log(`  sessions/${mostRecentSession.id}.yaml`);
      console.log('');
      console.log('This file contains your complete previous context.');
      console.log('Use the Read tool to load it before continuing work.');
      console.log('</system-reminder>');
    }
    // PHASE 2: Stale session warning (7-30 days old)
    else if (staleSession) {
      const endTime = new Date(staleSession.endedAt);
      const daysAgo = Math.floor((now.getTime() - endTime.getTime()) / (1000 * 60 * 60 * 24));

      console.log('<system-reminder>');
      console.log('⚠️  STALE SESSION DETECTED');
      console.log('');
      console.log(`Previous session: ${staleSession.id}`);
      console.log(`Ended: ${daysAgo} days ago`);
      console.log(`Duration: ${staleSession.durationMinutes || 0} minutes`);
      console.log('');
      console.log('This session is over a week old. Context may be outdated.');
      console.log('');
      console.log('Consider:');
      console.log('1. Review session context before continuing');
      console.log('2. Start fresh if work direction has changed');
      console.log('3. Archive old session if no longer relevant');
      console.log('');
      console.log(`Previous session file: sessions/${staleSession.id}.yaml`);
      console.log('</system-reminder>');
    }
  } catch (err) {
    console.error('Continuation detection error:', (err as Error).message);
    // Non-fatal - continue session start
  }
}


async function loadUserConfig(): Promise<void> {
  try {
    // Load user configuration from environment variables
    const userName = process.env.USER_NAME || 'User';
    const userTimezone = process.env.USER_TIMEZONE || 'UTC';
    const commStyle = process.env.USER_COMMUNICATION_STYLE || 'balanced';
    const codeStyle = process.env.USER_CODE_STYLE || 'standard';

    const intentSensitivity = process.env.INTENT_MATCHING_SENSITIVITY || 'medium';
    const qaRequirement = process.env.DEFAULT_QA_REQUIREMENT || '5.0';
    const checkpointInterval = process.env.AUTO_CHECKPOINT_INTERVAL || '15';
    const minSources = process.env.MIN_RESEARCH_SOURCES || '10';

    // Output user config as system-reminder
    console.log('<system-reminder>');
    console.log('User Configuration');
    console.log('');
    console.log('PROFILE:');
    console.log(`  Name: ${userName}`);
    console.log(`  Timezone: ${userTimezone}`);
    console.log(`  Communication: ${commStyle}`);
    console.log(`  Code Style: ${codeStyle}`);
    console.log('');
    console.log('FRAMEWORK PREFERENCES:');
    console.log(`  Intent Matching: ${intentSensitivity}`);
    console.log(`  QA Requirement: ${qaRequirement}/5.0`);
    console.log(`  Checkpoint Interval: ${checkpointInterval} minutes`);
    console.log(`  Min Research Sources: ${minSources}`);
    console.log('</system-reminder>');
  } catch (err) {
    // Don't block if user config loading fails
    console.error('User config loading error:', (err as Error).message);
  }
}

async function loadModuleFrontmatter(): Promise<void> {
  // Removed: Old V2 foundation/modules architecture that was never implemented
  // Current architecture uses skills/ directory instead
  // Skills are discovered via SKILL.md files and docs/catalogs/commands.md
}

/**
 * Generate dynamic framework statistics
 * This replaces hardcoded counts that become stale
 */
async function generateFrameworkStats(): Promise<void> {
  try {
    const { readdirSync, existsSync } = await import('fs');
    const frameworkPath = resolveFrameworkRoot();

    // Count directories (skills)
    const countDirs = (path: string): number => {
      if (!existsSync(path)) return 0;
      return readdirSync(path, { withFileTypes: true })
        .filter(d => d.isDirectory() && !d.name.startsWith('.'))
        .length;
    };

    // Count files matching pattern
    const countFiles = (path: string, ext: string): number => {
      if (!existsSync(path)) return 0;
      return readdirSync(path)
        .filter(f => f.endsWith(ext))
        .length;
    };

    const skills = countDirs(join(frameworkPath, 'skills'));
    const agents = countFiles(join(frameworkPath, 'agents'), '.md');
    const hooks = countFiles(join(frameworkPath, 'hooks'), '.ts');
    const plans = countFiles(join(frameworkPath, 'plans'), '.md');
    const docs = countFiles(join(frameworkPath, 'docs'), '.md');

    console.log('<system-reminder>');
    console.log('FRAMEWORK STATS (auto-generated, never hardcode these):');
    console.log(`  Skills: ${skills}`);
    console.log(`  Agents: ${agents}`);
    console.log(`  Hooks: ${hooks}`);
    console.log(`  Plans: ${plans}`);
    console.log(`  Docs: ${docs}`);
    console.log('');
    console.log('NOTE: These counts are generated at session start.');
    console.log('Never hardcode counts in documentation - they become stale.');
    console.log('</system-reminder>');
  } catch (err) {
    // Don't block if stats generation fails
    console.error('Framework stats error:', (err as Error).message);
  }
}


/**
 * Extract names from a markdown table column (0-indexed).
 * Only parses rows between the FIRST header separator (|---|) and the next
 * blank line or heading, avoiding false matches from other tables in the file.
 * Returns unique, sorted names.
 */
function extractCatalogNames(filePath: string, column = 0): string[] {
  if (!existsSync(filePath)) return [];
  const lines = readFileSync(filePath, 'utf8').split('\n');
  const names = new Set<string>();
  let inTable = false;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd(); // Handle \r from Windows line endings
    if (!inTable) {
      if (/^\|[-\s|]+\|$/.test(line)) inTable = true;
      continue;
    }
    if (!line.startsWith('|') || line.trim() === '') break;
    const cells = line.split('|').filter(c => c.trim() !== '');
    if (cells.length > column) {
      const val = cells[column].trim().replace(/`/g, '');
      if (/^[a-z][\w-]*$/.test(val)) names.add(val);
    }
  }
  return [...names].sort();
}

/**
 * Initialize learning signals with framework health snapshot.
 * Tracks skills and agents by name, identifying specific catalog drift.
 * Non-blocking: all errors are silently caught.
 */
function initializeLearningSignals(frameworkRoot: string): Record<string, unknown> {
  const emptyDomain = {
    actual: 0, cataloged: 0,
    missing_from_catalog: [] as string[],
    missing_from_disk: [] as string[],
    drift_detected: false
  };

  const learningSignals: Record<string, unknown> = {
    file_placements: [],
    structure_violations: [],
    framework_health: {
      skills: { ...emptyDomain },
      agents: { ...emptyDomain },
      tools: { ...emptyDomain },
      drift_detected: false
    }
  };

  try {
    // --- Skills: directories vs catalog ---
    const skillsPath = join(frameworkRoot, 'skills');
    const skillsCatalog = join(frameworkRoot, 'docs/catalogs/skills.md');
    const onDiskSkills = existsSync(skillsPath)
      ? readdirSync(skillsPath, { withFileTypes: true })
          .filter(d => d.isDirectory() && !d.name.startsWith('.'))
          .map(d => d.name).sort()
      : [];
    const catalogedSkills = extractCatalogNames(skillsCatalog);
    const missingFromSkillsCatalog = onDiskSkills
      .filter(s => !catalogedSkills.includes(s));
    const missingSkillsFromDisk = catalogedSkills
      .filter(s => !onDiskSkills.includes(s));

    // --- Agents: files vs catalog ---
    const agentsPath = join(frameworkRoot, 'agents');
    const agentsCatalog = join(frameworkRoot, 'docs/catalogs/agents.md');
    const onDiskAgents = existsSync(agentsPath)
      ? readdirSync(agentsPath)
          .filter(f => f.endsWith('.md') && f !== 'README.md')
          .map(f => f.replace('.md', '')).sort()
      : [];
    const catalogedAgents = extractCatalogNames(agentsCatalog);
    const missingFromAgentsCatalog = onDiskAgents
      .filter(a => !catalogedAgents.includes(a));
    const missingAgentsFromDisk = catalogedAgents
      .filter(a => !onDiskAgents.includes(a));

    // --- Tools: directories vs catalog (column 1 = tool name) ---
    const toolsPath = join(frameworkRoot, 'tools');
    const toolsCatalog = join(frameworkRoot, 'docs/catalogs/tool-catalog.md');
    const onDiskTools = existsSync(toolsPath)
      ? readdirSync(toolsPath, { withFileTypes: true })
          .filter(d => d.isDirectory() && !d.name.startsWith('.'))
          .map(d => d.name).sort()
      : [];
    const catalogedTools = extractCatalogNames(toolsCatalog, 1);
    const missingFromToolsCatalog = onDiskTools
      .filter(t => !catalogedTools.includes(t));
    const missingToolsFromDisk = catalogedTools
      .filter(t => !onDiskTools.includes(t));

    const skillsDrift = missingFromSkillsCatalog.length > 0
      || missingSkillsFromDisk.length > 0;
    const agentsDrift = missingFromAgentsCatalog.length > 0
      || missingAgentsFromDisk.length > 0;
    const toolsDrift = missingToolsFromDisk.length > 0;

    learningSignals.framework_health = {
      skills: {
        actual: onDiskSkills.length,
        cataloged: catalogedSkills.length,
        missing_from_catalog: missingFromSkillsCatalog,
        missing_from_disk: missingSkillsFromDisk,
        drift_detected: skillsDrift
      },
      agents: {
        actual: onDiskAgents.length,
        cataloged: catalogedAgents.length,
        missing_from_catalog: missingFromAgentsCatalog,
        missing_from_disk: missingAgentsFromDisk,
        drift_detected: agentsDrift
      },
      tools: {
        actual: onDiskTools.length,
        cataloged: catalogedTools.length,
        missing_from_catalog: missingFromToolsCatalog,
        missing_from_disk: missingToolsFromDisk,
        drift_detected: toolsDrift
      },
      drift_detected: skillsDrift || agentsDrift || toolsDrift
    };
  } catch {
    // Non-fatal: keep default values
  }

  return learningSignals;
}

function createSession(data: SessionStartInput): string {
  const frameworkRoot = resolveFrameworkRoot();
  const sessionDir = join(frameworkRoot, 'sessions');
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = now.toTimeString().slice(0, 5).replace(':', '');

  // Generate readable session ID
  const sessionId = `${dateStr}-${timeStr}-${data.session_id?.slice(0, 8) || 'unknown'}`;
  const sessionFile = join(sessionDir, `${sessionId}.yaml`);

  // Initialize learning signals for this session
  const learningSignals = initializeLearningSignals(frameworkRoot);

  const session: Session = {
    id: sessionId,
    claudeSessionId: data.session_id,
    date: dateStr,
    startedAt: now.toISOString(),
    lastActivityAt: now.toISOString(),
    lastCheckpointAt: now.toISOString(),
    status: 'active',
    cwd: data.cwd,
    transcriptPath: data.transcript_path,
    filesRead: [],
    filesModified: [],
    gitCommits: [],
    toolCalls: {},
    objectives: [],
    decisions: [],
    ideas: [],
    active_module: undefined,
    workflow: undefined,
    workflow_state: undefined,
    learning_signals: learningSignals
  };

  // Ensure directory exists
  mkdirSync(sessionDir, { recursive: true });

  // Write YAML format
  const yaml = toSessionYaml(session);
  writeFileSync(sessionFile, yaml);

  // Also write a .current file for easy lookup
  writeFileSync(join(sessionDir, '.current'), sessionId);

  return sessionId;
}

main();
