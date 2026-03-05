/**
 * Skill Hook Loader (PreToolUse)
 * Dispatches hook events to active skill's hooks
 *
 * This framework-level hook:
 * 1. Checks if session has active_skill
 * 2. Loads skill's hooks from scripts/hooks/ or config/hooks.json
 * 3. Executes skill-specific hooks for this event type
 * 4. BLOCKS if any hook exits 1
 * 5. ALLOWS if all hooks exit 0
 *
 * Exit 0 = Allow tool use
 * Exit 1 = BLOCK tool use
 */

import { readFileSync, existsSync, readdirSync } from 'fs';
import { join, basename } from 'path';
import { spawn } from 'child_process';

interface HookInput {
  tool_name: string;
  tool_input: Record<string, unknown>;
}

interface SkillHookConfig {
  hooks: Record<string, Array<{
    hook: string;
    description: string;
  }>>;
}

interface Session {
  active_skill?: string;
  workflow_state?: {
    current_phase: string;
    checkpoints_passed: string[];
  };
}

// Use IA_FRAMEWORK_ROOT env var if set, otherwise self-discover from script location
const FRAMEWORK_ROOT = process.env.IA_FRAMEWORK_ROOT || join(import.meta.dir, '..');
const SESSIONS_DIR = join(FRAMEWORK_ROOT, 'sessions');
const SKILLS_DIR = join(FRAMEWORK_ROOT, 'skills');

async function main() {
  try {
    // Read input from stdin
    let inputData = '';
    for await (const chunk of Bun.stdin.stream()) {
      inputData += new TextDecoder().decode(chunk);
    }

    const event: HookInput = JSON.parse(inputData);

    // Get current session
    const currentFile = join(SESSIONS_DIR, '.current');
    if (!existsSync(currentFile)) {
      // No active session - allow
      console.log(JSON.stringify({ action: 'allow' }));
      return;
    }

    const sessionId = readFileSync(currentFile, 'utf-8').trim();
    const sessionFile = join(SESSIONS_DIR, `${sessionId}.yaml`);

    if (!existsSync(sessionFile)) {
      console.log(JSON.stringify({ action: 'allow' }));
      return;
    }

    const session = loadSession(sessionFile);

    // Check if session has active skill
    if (!session.active_skill) {
      // No active skill - allow
      console.log(JSON.stringify({ action: 'allow' }));
      return;
    }

    const skillName = session.active_skill;

    // Find skill directory (handle nested skills like compliance/nist)
    let skillPath = join(SKILLS_DIR, skillName);
    if (!existsSync(skillPath)) {
      // Try nested path
      const parts = skillName.split('/');
      if (parts.length > 1) {
        skillPath = join(SKILLS_DIR, ...parts);
      }
    }

    if (!existsSync(skillPath)) {
      // Skill not found - allow
      console.log(JSON.stringify({ action: 'allow' }));
      return;
    }

    // Look for skill hooks configuration
    const hooksConfigFile = join(skillPath, 'config', 'hooks.json');
    const scriptsHooksDir = join(skillPath, 'scripts', 'hooks');

    let hooks: Array<{ path: string; description: string }> = [];

    // Method 1: hooks.json configuration
    if (existsSync(hooksConfigFile)) {
      const config: SkillHookConfig = JSON.parse(readFileSync(hooksConfigFile, 'utf-8'));
      const eventHooks = config.hooks['PreToolUse'] || [];

      for (const h of eventHooks) {
        const hookPath = join(skillPath, h.hook);
        if (existsSync(hookPath)) {
          hooks.push({ path: hookPath, description: h.description });
        }
      }
    }

    // Method 2: scripts/hooks/ directory with pre-*.ts files
    if (existsSync(scriptsHooksDir)) {
      const hookFiles = readdirSync(scriptsHooksDir)
        .filter(f => f.startsWith('pre-') && f.endsWith('.ts'));

      for (const file of hookFiles) {
        const hookPath = join(scriptsHooksDir, file);
        hooks.push({ path: hookPath, description: `Skill hook: ${file}` });
      }
    }

    if (hooks.length === 0) {
      // No hooks to run - allow
      console.log(JSON.stringify({ action: 'allow' }));
      return;
    }

    // Execute each hook
    for (const hook of hooks) {
      const result = await executeHook(hook.path, inputData);

      if (result.exitCode !== 0) {
        // Hook blocked the action
        console.log(JSON.stringify({
          action: 'block',
          message: `Skill hook blocked: ${hook.description}`,
          suggestion: `Check skill ${skillName} requirements`
        }));
        return;
      }
    }

    // All hooks passed
    console.log(JSON.stringify({ action: 'allow' }));

  } catch (err) {
    // Don't block on errors - fail open
    console.log(JSON.stringify({ action: 'allow' }));
  }
}

/**
 * Load session from YAML file
 */
function loadSession(sessionFile: string): Session {
  const content = readFileSync(sessionFile, 'utf-8');

  // Simple YAML parsing - extract active_skill
  const activeSkillMatch = content.match(/^active_skill:\s*(.+)$/m);

  return {
    active_skill: activeSkillMatch ? activeSkillMatch[1].trim() : undefined
  };
}

/**
 * Execute a skill hook as a subprocess
 */
async function executeHook(hookPath: string, inputData: string): Promise<{ exitCode: number }> {
  return new Promise((resolve) => {
    const child = spawn('bun', ['run', hookPath], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: process.env,
      cwd: FRAMEWORK_ROOT
    });

    // Pass event data to hook via stdin
    child.stdin.write(inputData);
    child.stdin.end();

    child.on('close', (code) => {
      resolve({ exitCode: code || 0 });
    });

    child.on('error', () => {
      resolve({ exitCode: 0 }); // Fail open
    });
  });
}

main();
