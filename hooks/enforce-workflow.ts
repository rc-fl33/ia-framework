/**
 * Workflow Enforcement Hook (PreToolUse)
 * BLOCKS tool usage that violates workflow phase gates
 *
 * CRITICAL: This hook enforces workflow integrity at runtime.
 * Exit codes (Claude Code spec):
 *   0 = Allow tool use
 *   1 = Soft block (warning, can be overridden)
 *   2 = Hard block (cannot proceed)
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { parse as parseYaml } from 'yaml';

interface PreToolUseInput {
  tool_name: string;
  tool_input: Record<string, unknown>;
  session_id: string;
  cwd: string;
}

interface Session {
  id: string;
  status: string;
  workflow?: string;
  workflow_state?: {
    current_phase?: string;
    phase_status?: Record<string, string>;
    gates_passed?: string[];
  };
}

// Workflow definitions with allowed tools per phase
const WORKFLOW_RULES: Record<string, {
  phases: Record<string, {
    allowed_tools: string[];
    required_gates?: string[];
  }>;
}> = {
  'blog-post': {
    phases: {
      'research': {
        allowed_tools: ['WebSearch', 'WebFetch', 'Read', 'Write', 'Grep', 'Glob'],
        required_gates: []
      },
      'draft': {
        allowed_tools: ['Read', 'Write', 'Edit', 'Grep', 'Glob'],
        required_gates: ['research_complete']
      },
      'qa': {
        allowed_tools: ['Read', 'Edit'],  // Cannot Write new draft, only edit
        required_gates: ['draft_complete']
      },
      'visuals': {
        allowed_tools: ['Read', 'Write', 'Bash', 'Edit'],
        required_gates: ['qa_passed']
      },
      'publish': {
        allowed_tools: ['Bash', 'Read', 'Write'],
        required_gates: ['visuals_complete']
      }
    }
  },
  'health-research': {
    phases: {
      'research': {
        allowed_tools: ['WebSearch', 'WebFetch', 'Read', 'Write', 'Grep', 'Glob'],
        required_gates: []
      },
      'analysis': {
        allowed_tools: ['Read', 'Write', 'Edit'],
        required_gates: ['research_complete']
      },
      'report': {
        allowed_tools: ['Read', 'Write', 'Edit'],
        required_gates: ['analysis_complete']
      }
    }
  }
};

async function main() {
  try {
    const input = await Bun.stdin.text();
    const data: PreToolUseInput = JSON.parse(input);

    const shouldBlock = await enforceWorkflow(data);

    if (shouldBlock) {
      process.exit(2);  // HARD BLOCK - phase gate violation
    } else {
      process.exit(0);  // Allow tool use
    }
  } catch (error) {
    // FAIL CLOSED: Log error and block operation with soft fail
    const err = error as Error;
    console.error('❌ HOOK ERROR - enforce-workflow.ts');
    console.error(`Error: ${err.message}`);
    console.error(`Stack: ${err.stack}`);

    // Exit code 1 = soft block with warning (allows override)
    process.exit(1);
  }
}

async function enforceWorkflow(data: PreToolUseInput): Promise<boolean> {
  // Use IA_FRAMEWORK_ROOT env var if set, otherwise self-discover from script location
  const frameworkRoot = process.env.IA_FRAMEWORK_ROOT || join(import.meta.dir, '..');
  const sessionDir = join(frameworkRoot, 'sessions');
  const currentFile = join(sessionDir, '.current');

  if (!existsSync(currentFile)) {
    // No active session, no enforcement
    return false;
  }

  const sessionId = readFileSync(currentFile, 'utf-8').trim();
  const sessionFile = join(sessionDir, `${sessionId}.yaml`);

  if (!existsSync(sessionFile)) {
    // Session file missing, don't block
    return false;
  }

  const sessionContent = readFileSync(sessionFile, 'utf-8');
  const session: Session = parseYaml(sessionContent);

  // Check if workflow enforcement is active
  if (!session.workflow || !session.workflow_state?.current_phase) {
    // No workflow active, no enforcement
    return false;
  }

  const workflow = session.workflow;
  const currentPhase = session.workflow_state.current_phase;

  // Get workflow rules
  const workflowRules = WORKFLOW_RULES[workflow];
  if (!workflowRules) {
    // Unknown workflow, don't block
    return false;
  }

  const phaseRules = workflowRules.phases[currentPhase];
  if (!phaseRules) {
    // Unknown phase, don't block
    return false;
  }

  // Check if tool is allowed in current phase
  const toolName = data.tool_name;
  const allowedTools = phaseRules.allowed_tools;

  if (!allowedTools.includes(toolName)) {
    // Tool NOT allowed - BLOCK
    console.log('<system-reminder>');
    console.log('⛔ WORKFLOW ENFORCEMENT ACTIVE');
    console.log('');
    console.log(`Workflow: ${workflow}`);
    console.log(`Current Phase: ${currentPhase}`);
    console.log(`Blocked Tool: ${toolName}`);
    console.log('');
    console.log(`Allowed tools in ${currentPhase} phase:`);
    allowedTools.forEach(tool => console.log(`  ✓ ${tool}`));
    console.log('');
    console.log('REASON: This tool is not permitted during the current workflow phase.');
    console.log(`To proceed: Complete the ${currentPhase} phase requirements first.`);
    console.log('');
    console.log('See CLAUDE.md section "Workflow Enforcement Rules" for details.');
    console.log('</system-reminder>');

    return true;  // HARD BLOCK - violation detected
  }

  // Check if required gates are passed
  if (phaseRules.required_gates && phaseRules.required_gates.length > 0) {
    const gatesPassed = session.workflow_state.gates_passed || [];

    for (const requiredGate of phaseRules.required_gates) {
      if (!gatesPassed.includes(requiredGate)) {
        // Required gate not passed - BLOCK
        console.log('<system-reminder>');
        console.log('⛔ PHASE GATE ENFORCEMENT');
        console.log('');
        console.log(`Workflow: ${workflow}`);
        console.log(`Current Phase: ${currentPhase}`);
        console.log(`Required Gate: ${requiredGate}`);
        console.log(`Status: NOT PASSED`);
        console.log('');
        console.log('REASON: Cannot proceed to this phase without passing required gate.');
        console.log(`To proceed: Complete the requirements for gate "${requiredGate}".`);
        console.log('');
        console.log('Gates passed:', gatesPassed.length > 0 ? gatesPassed.join(', ') : 'none');
        console.log('</system-reminder>');

        return true;  // HARD BLOCK - violation detected
      }
    }
  }

  // Tool is allowed and gates are passed
  return false;  // Allow
}

main();
