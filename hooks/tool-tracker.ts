/**
 * Tool Tracker Hook
 * Tracks file reads, modifications, and other tool usage during a session
 */

import { existsSync, readFileSync, writeFileSync, appendFileSync, renameSync, unlinkSync } from 'fs';
import { join } from 'path';
import { resolveFrameworkRoot } from '@/tools/framework/utils/path-resolution';
import { parseSessionYaml, toSessionYaml } from '@/tools/framework/sessions/yaml-parser';

interface ToolInput {
  tool_name: string;
  tool_input: {
    file_path?: string;
    command?: string;
    notebook_path?: string;
    edit_mode?: string;
  };
  tool_response?: {
    stdout?: string;
    exit_code?: number;
  };
}

interface Session {
  startedAt: string;
  lastActivityAt: string;
  lastCheckpointAt?: string;
  toolCalls: Record<string, number>;
  filesRead: string[];
  filesModified: string[];
  gitCommits: string[];
  learning_signals?: Record<string, unknown>;
  [key: string]: unknown;
}

interface FilePlacement {
  path: string;
  rule_checked: string;
  compliant: boolean;
  expected_location: string | null;
  timestamp: string;
}

// --- Mutation JSONL Audit Logging ---

const MUTATION_TOOLS = new Set(['Write', 'Edit', 'Bash', 'NotebookEdit']);

const API_KEY_PATTERNS = [
  /(?:api[_-]?key|token|secret|password|credential|auth)[=:\s]+\S+/gi,
  /(?:sk|pk|rk|ak)-[A-Za-z0-9_-]{20,}/g,
  /ghp_[A-Za-z0-9_]{36,}/g,
  /gho_[A-Za-z0-9_]{36,}/g,
  /xox[bpas]-[A-Za-z0-9-]{10,}/g,
  /Bearer\s+[A-Za-z0-9._~+/=-]{20,}/gi,
  /AKIA[0-9A-Z]{16}/g,
];

interface MutationEntry {
  timestamp: string;
  tool: string;
  operation: string;
  target: string;
  exit_code?: number;
}

function sanitizeBashCommand(command: string): string {
  let sanitized = command;
  for (const pattern of API_KEY_PATTERNS) {
    sanitized = sanitized.replace(pattern, '[REDACTED]');
  }
  if (sanitized.length > 200) {
    sanitized = sanitized.slice(0, 200) + '...[truncated]';
  }
  return sanitized;
}

function detectFileOperation(toolName: string, toolInput: ToolInput['tool_input']): string {
  if (toolName === 'Bash') {
    return 'execute';
  }
  if (toolName === 'NotebookEdit') {
    const mode = toolInput.edit_mode || 'replace';
    if (mode === 'insert') return 'create';
    if (mode === 'delete') return 'delete';
    return 'modify';
  }
  if (toolName === 'Write') {
    const filePath = toolInput.file_path;
    if (filePath && existsSync(filePath)) {
      return 'modify';
    }
    return 'create';
  }
  // Edit is always modify
  return 'modify';
}

function logMutationEvent(data: ToolInput, sessionId: string, sessionDir: string): void {
  try {
    const toolName = data.tool_name;
    if (!MUTATION_TOOLS.has(toolName)) return;

    const toolInput = data.tool_input || {};
    const operation = detectFileOperation(toolName, toolInput);

    let target: string;
    if (toolName === 'Bash') {
      target = sanitizeBashCommand(toolInput.command || '');
    } else if (toolName === 'NotebookEdit') {
      target = toolInput.notebook_path || '';
    } else {
      target = toolInput.file_path || '';
    }

    const entry: MutationEntry = {
      timestamp: new Date().toISOString(),
      tool: toolName,
      operation,
      target,
    };

    if (toolName === 'Bash' && data.tool_response?.exit_code !== undefined) {
      entry.exit_code = data.tool_response.exit_code;
    }

    const jsonlFile = join(sessionDir, `${sessionId}-mutations.jsonl`);
    appendFileSync(jsonlFile, JSON.stringify(entry) + '\n');
  } catch {
    // Silent fail - never block on mutation logging errors
  }
}

// --- End Mutation JSONL Audit Logging ---

// --- File Placement Compliance Tracking ---

/**
 * Evaluate whether a file placement follows framework structure rules.
 * Mirrors rules from hooks/pre-commit/validate-file-placement.ts
 * but implemented as a standalone function (no imports from pre-commit).
 */
function evaluatePlacement(filePath: string, frameworkRoot: string): FilePlacement {
  const relative = filePath.startsWith(frameworkRoot)
    ? filePath.slice(frameworkRoot.length + 1)
    : filePath;
  const now = new Date().toISOString();

  // Rule: PDFs outside /private/books/
  if (relative.endsWith('.pdf') && !relative.startsWith('private/books/')) {
    return { path: relative, rule_checked: 'BOOKS-001', compliant: false,
      expected_location: 'private/books/{topic}/', timestamp: now };
  }

  // Rule: Files in /private/docs/ root (except allowed files)
  const privateDocRoot = /^private\/docs\/[^/]+\.(md|yaml|json)$/;
  const allowedPrivateDocs = ['active-tracker.md', 'infrastructure-inventory.md'];
  if (privateDocRoot.test(relative)) {
    const fileName = relative.split('/').pop() || '';
    if (!allowedPrivateDocs.includes(fileName)) {
      return { path: relative, rule_checked: 'PRIV-001', compliant: false,
        expected_location: 'private/plans/ or skill docs', timestamp: now };
    }
  }

  // Rule: input/output inside skills/
  const skillDataMatch = relative.match(/^skills\/([^/]+)\/(input|output)\//);
  if (skillDataMatch) {
    return { path: relative, rule_checked: 'SKILL-001', compliant: false,
      expected_location: `private/${skillDataMatch[2]}/${skillDataMatch[1]}/`,
      timestamp: now };
  }

  // Rule: Markdown in /docs/ root (except README.md, index.md)
  const docsRoot = /^docs\/[^/]+\.md$/;
  const allowedDocsRoot = ['README.md', 'index.md'];
  if (docsRoot.test(relative)) {
    const fileName = relative.split('/').pop() || '';
    if (!allowedDocsRoot.includes(fileName)) {
      return { path: relative, rule_checked: 'DOCS-001', compliant: false,
        expected_location: 'docs/{standards|guides|templates|catalogs}/',
        timestamp: now };
    }
  }

  return { path: relative, rule_checked: 'OK', compliant: true,
    expected_location: null, timestamp: now };
}

// --- End File Placement Compliance Tracking ---

async function main() {
  const input = await Bun.stdin.text();

  try {
    const data: ToolInput = JSON.parse(input);
    trackTool(data);
  } catch {
    process.exit(0); // Silent fail - don't block Claude Code
  }
}

function trackTool(data: ToolInput): void {
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

  // Log mutation events to JSONL (append-only, no lock needed)
  logMutationEvent(data, sessionId, sessionDir);

  // Acquire lockfile to prevent concurrent read-modify-write corruption
  const lockFile = sessionFile + '.lock';
  if (!acquireLock(lockFile, 3000)) {
    process.exit(0); // Can't get lock - skip this update rather than block
  }

  try {
    const yamlContent = readFileSync(sessionFile, 'utf8');
    const session = parseSessionYaml(yamlContent) as Session;

    // Update last activity
    session.lastActivityAt = new Date().toISOString();

    // Track tool usage
    const toolName = data.tool_name;
    // Fix corrupted toolCalls (array instead of object)
    if (!session.toolCalls || Array.isArray(session.toolCalls)) session.toolCalls = {};
    if (!session.toolCalls[toolName]) {
      session.toolCalls[toolName] = 0;
    }
    session.toolCalls[toolName]++;

    // Track file operations
    const toolInput = data.tool_input || {};

    if (toolName === 'Read' && toolInput.file_path) {
      if (!session.filesRead) session.filesRead = [];
      if (!session.filesRead.includes(toolInput.file_path)) {
        session.filesRead.push(toolInput.file_path);
      }
    }

    if ((toolName === 'Edit' || toolName === 'Write') && toolInput.file_path) {
      if (!session.filesModified) session.filesModified = [];
      if (!session.filesModified.includes(toolInput.file_path)) {
        session.filesModified.push(toolInput.file_path);
      }
    }

    // Track file placement compliance for write operations
    if (['Write', 'Edit', 'NotebookEdit'].includes(toolName)) {
      const filePath = toolInput.file_path || toolInput.notebook_path || '';
      if (filePath) {
        try {
          const placement = evaluatePlacement(filePath, frameworkRoot);
          if (!session.learning_signals) {
            session.learning_signals = {
              file_placements: [], structure_violations: [], framework_health: {}
            };
          }
          const placements = session.learning_signals.file_placements as unknown[];
          if (Array.isArray(placements)) {
            placements.push(placement);
          }
        } catch {
          // Non-fatal: never block on placement tracking
        }
      }
    }

    // Track git commits from Bash
    if (toolName === 'Bash') {
      const cmd = toolInput.command || '';
      const response = data.tool_response?.stdout || '';

      if (cmd.includes('git commit') && response) {
        const commitMatch = response.match(/\[[\w-]+\s+([a-f0-9]+)\]/);
        if (commitMatch) {
          if (!session.gitCommits) session.gitCommits = [];
          if (!session.gitCommits.includes(commitMatch[1])) {
            session.gitCommits.push(commitMatch[1]);
          }
        }
      }
    }

    // Check for 15-minute checkpoint
    const lastCheckpoint = session.lastCheckpointAt || session.startedAt;
    const now = new Date();
    const minutesSinceCheckpoint = (now.getTime() - new Date(lastCheckpoint).getTime()) / 60000;

    if (minutesSinceCheckpoint >= 15) {
      try {
        appendCheckpoint(session, sessionId, sessionDir);
        session.lastCheckpointAt = now.toISOString();
      } catch (err) {
        // Silent fail - don't block on checkpoint errors
      }
    }

    // Write back atomically: write to temp file, then rename
    const yaml = toSessionYaml(session);
    const tmpFile = sessionFile + '.tmp';
    writeFileSync(tmpFile, yaml);
    renameSync(tmpFile, sessionFile);
  } finally {
    releaseLock(lockFile);
  }
}

function appendCheckpoint(session: Session, sessionId: string, sessionDir: string): void {
  const mdFile = join(sessionDir, `${sessionId}.md`);
  const now = new Date();
  const timestamp = now.toISOString().split('T')[1].slice(0, 5); // HH:MM format

  // Build checkpoint content
  let checkpoint = `\n## Checkpoint: ${timestamp}\n\n`;

  const filesModified = session.filesModified || [];
  const filesRead = session.filesRead || [];
  const gitCommits = session.gitCommits || [];

  if (filesModified.length > 0) {
    checkpoint += `**Modified:**\n`;
    filesModified.slice(-5).forEach(file => {
      const shortPath = file.replace(/^.*[\\\/]/, ''); // Just filename
      checkpoint += `- ${shortPath}\n`;
    });
    if (filesModified.length > 5) {
      checkpoint += `- ... and ${filesModified.length - 5} more\n`;
    }
    checkpoint += `\n`;
  }

  if (filesRead.length > 0) {
    checkpoint += `**Read:** ${filesRead.length} file(s)\n\n`;
  }

  if (gitCommits.length > 0) {
    checkpoint += `**Commits:**\n`;
    gitCommits.forEach(commit => {
      checkpoint += `- ${commit}\n`;
    });
    checkpoint += `\n`;
  }

  if (filesModified.length === 0 && filesRead.length === 0 && gitCommits.length === 0) {
    checkpoint += `*No significant activity*\n\n`;
  }

  // Check for critical documentation updates needed
  const docsNeeded = checkCriticalDocs(filesModified);
  if (docsNeeded.length > 0) {
    checkpoint += `**⚠️  Documentation Updates Needed:**\n`;
    docsNeeded.forEach(doc => {
      checkpoint += `- ${doc}\n`;
    });
    checkpoint += `\n`;
  }

  checkpoint += `---\n`;

  // Append to markdown file (create if doesn't exist)
  if (existsSync(mdFile)) {
    const existing = readFileSync(mdFile, 'utf8');
    writeFileSync(mdFile, existing + checkpoint);
  } else {
    // Create new markdown file with header
    const header = `# Session: ${sessionId}\n\n**Auto-Generated Checkpoints**\n\n---\n`;
    writeFileSync(mdFile, header + checkpoint);
  }
}

function checkCriticalDocs(filesModified: string[]): string[] {
  const docsNeeded: string[] = [];

  // Check if module files were changed
  const moduleChanges = filesModified.some(f =>
    f.includes('foundation/') || f.includes('modules/')
  );

  if (moduleChanges) {
    const claudeMdUpdated = filesModified.some(f => f.endsWith('CLAUDE.md'));
    if (!claudeMdUpdated) {
      docsNeeded.push('Update CLAUDE.md (module tier table or directory structure)');
    }
  }

  // Check if new module.yaml was created
  const newModule = filesModified.some(f =>
    f.endsWith('module.yaml') && f.includes('modules/')
  );

  if (newModule) {
    const moduleMdExists = filesModified.some(f => f.endsWith('MODULE.md'));
    if (!moduleMdExists) {
      docsNeeded.push('Create MODULE.md for new module');
    }
  }

  // Check if core engine was modified
  const coreChanges = filesModified.some(f =>
    f.includes('core/engine/') || f.includes('core/lib/')
  );

  if (coreChanges) {
    const archUpdated = filesModified.some(f => f.endsWith('ARCHITECTURE.md'));
    if (!archUpdated) {
      docsNeeded.push('Update core/ARCHITECTURE.md if behavior changed');
    }
  }

  // Check if hooks were modified
  const hookChanges = filesModified.some(f => f.includes('hooks/'));

  if (hookChanges) {
    const settingsUpdated = filesModified.some(f => f.endsWith('settings.json'));
    if (!settingsUpdated) {
      docsNeeded.push('Check settings.json hooks configuration');
    }
  }

  return docsNeeded;
}

/**
 * Simple lockfile guard for concurrent write protection.
 * Returns true if lock acquired, false if timed out.
 */
function acquireLock(lockPath: string, timeoutMs: number): boolean {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      // O_CREAT | O_EXCL equivalent — fails if file exists
      writeFileSync(lockPath, String(process.pid), { flag: 'wx' });
      return true;
    } catch {
      // Lock held by another process — check for stale lock
      try {
        const stat = require('fs').statSync(lockPath);
        // If lock is older than 10 seconds, it's stale — remove it
        if (Date.now() - stat.mtimeMs > 10000) {
          unlinkSync(lockPath);
          continue;
        }
      } catch {
        // Lock disappeared between check and stat — retry
        continue;
      }
      // Spin-wait briefly
      Bun.sleepSync(50);
    }
  }
  return false;
}

function releaseLock(lockPath: string): void {
  try {
    unlinkSync(lockPath);
  } catch {
    // Already released or never acquired
  }
}

main();
