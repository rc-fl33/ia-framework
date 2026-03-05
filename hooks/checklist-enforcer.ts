/**
 * Checklist Enforcer Hook (PreToolUse)
 * Enforces that verification checklists are completed before critical operations
 *
 * Detects patterns that indicate phase skipping:
 * - git commit/push without verification phase
 * - publishing without QA completion
 * - implementation without approval
 *
 * Exit codes:
 *   0 = Allow
 *   1 = Soft block (warning)
 *   2 = Hard block (cannot proceed)
 */

import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';

interface PreToolUseInput {
  tool_name: string;
  tool_input: Record<string, unknown>;
  session_id?: string;
}

interface WorkflowState {
  active_workflow?: string;
  current_phase?: string;
  phases_completed: string[];
  verification_pending: boolean;
  last_updated: string;
}

// Use IA_FRAMEWORK_ROOT env var if set, otherwise self-discover from script location
const FRAMEWORK_PATH = process.env.IA_FRAMEWORK_ROOT || join(import.meta.dir, '..');
const STATE_FILE = join(FRAMEWORK_PATH, 'sessions', '.workflow-state.yaml');

// Critical operations that require verification
const CRITICAL_OPERATIONS: Record<string, {
  tool: string;
  patterns: RegExp[];
  requires_phases: string[];
  block_level: 'soft' | 'hard';
  message: string;
}[]> = {
  // Git operations
  'Bash': [
    {
      tool: 'Bash',
      patterns: [/git\s+push/, /git\s+commit/],
      requires_phases: ['verification'],
      block_level: 'soft',
      message: 'Git commit/push detected. Have you completed the verification checklist?'
    },
    {
      tool: 'Bash',
      patterns: [/ghost.*publish/, /npm\s+run\s+publish/],
      requires_phases: ['qa', 'verification'],
      block_level: 'soft',
      message: 'Publishing detected. QA and verification should be completed first.'
    }
  ]
};

// Phrases that indicate phase completion
const PHASE_COMPLETION_SIGNALS: Record<string, RegExp[]> = {
  'research': [/research.*complete/i, /sources.*gathered/i, /research.*done/i],
  'draft': [/draft.*complete/i, /writing.*done/i, /content.*ready/i],
  'qa': [/qa.*passed/i, /qa.*complete/i, /quality.*approved/i, /rating.*[45]/i],
  'verification': [/verification.*complete/i, /checklist.*done/i, /all.*verified/i],
  'approval': [/approved/i, /proceed/i, /confirmed/i, /yes.*implement/i]
};

async function main() {
  try {
    const input = await Bun.stdin.text();
    const data: PreToolUseInput = JSON.parse(input);

    const result = await enforceChecklist(data);

    if (result.block) {
      console.log('<system-reminder>');
      console.log('⚠️ CHECKLIST ENFORCEMENT WARNING');
      console.log('');
      console.log(result.message);
      console.log('');
      if (result.suggestion) {
        console.log(`Suggestion: ${result.suggestion}`);
      }
      console.log('');
      console.log('To proceed anyway, acknowledge that verification is pending.');
      console.log('</system-reminder>');

      if (result.level === 'hard') {
        process.exit(2);
      } else {
        process.exit(1);
      }
    }

    process.exit(0);

  } catch (error) {
    // FAIL CLOSED: Log error and block operation with soft fail
    const err = error as Error;
    console.error('❌ HOOK ERROR - checklist-enforcer.ts');
    console.error(`Error: ${err.message}`);
    console.error(`Stack: ${err.stack}`);

    // Exit code 1 = soft block with warning (allows override)
    process.exit(1);
  }
}

async function enforceChecklist(data: PreToolUseInput): Promise<{
  block: boolean;
  level?: 'soft' | 'hard';
  message?: string;
  suggestion?: string;
}> {
  const toolName = data.tool_name;

  // Check if this tool has critical operations
  const criticalOps = CRITICAL_OPERATIONS[toolName];
  if (!criticalOps) {
    return { block: false };
  }

  // Get command for Bash tool
  let command = '';
  if (toolName === 'Bash' && typeof data.tool_input.command === 'string') {
    command = data.tool_input.command;
  }

  // Check each critical operation
  for (const op of criticalOps) {
    const matches = op.patterns.some(p => p.test(command));
    if (!matches) continue;

    // Load workflow state
    const state = loadWorkflowState();

    // Check if required phases are completed
    const missingPhases = op.requires_phases.filter(
      phase => !state.phases_completed.includes(phase)
    );

    if (missingPhases.length > 0) {
      return {
        block: true,
        level: op.block_level,
        message: op.message,
        suggestion: `Complete these phases first: ${missingPhases.join(', ')}`
      };
    }
  }

  return { block: false };
}

function loadWorkflowState(): WorkflowState {
  try {
    if (existsSync(STATE_FILE)) {
      const content = readFileSync(STATE_FILE, 'utf-8');
      return parseYaml(content) as WorkflowState;
    }
  } catch {
    // Ignore errors
  }

  return {
    phases_completed: [],
    verification_pending: true,
    last_updated: new Date().toISOString()
  };
}

function saveWorkflowState(state: WorkflowState): void {
  try {
    state.last_updated = new Date().toISOString();
    writeFileSync(STATE_FILE, stringifyYaml(state));
  } catch {
    // Ignore errors
  }
}

// Export for testing
export { enforceChecklist, loadWorkflowState, saveWorkflowState };

main();
