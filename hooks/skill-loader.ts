/**
 * Skill Loader Hook (PostToolUse)
 * Injects pre-flight checklist reminder when SKILL.md is read
 * Also suggests agent delegation based on skill type
 *
 * Trigger: PostToolUse on Read tool for SKILL.md files
 * Action: Output system-reminder with pre-flight checklist reminder
 *
 * Exit codes:
 *   0 = Success (always - this is advisory only)
 */

import { basename, dirname } from 'path';

// Allowed parent directories for SKILL.md files
const ALLOWED_BASE_DIRS = ['skills', 'tools', 'hooks'];

/**
 * Validates that a file path is safe to process
 * Returns true if path is within allowed directories
 */
function isPathAllowed(filePath: string): boolean {
  try {
    // Reject paths with null bytes or other invalid characters
    if (!filePath || filePath.includes('\0')) {
      return false;
    }

    // Get the normalized path
    const normalized = filePath.replace(/\\/g, '/');

    // Check if the path starts with an allowed directory
    const parts = normalized.split('/').filter(Boolean);
    if (parts.length < 2) {
      return false;
    }

    // Check if the first part is an allowed base directory
    return ALLOWED_BASE_DIRS.includes(parts[0]);
  } catch {
    return false;
  }
}

interface PostToolUseInput {
  tool_name: string;
  tool_input: {
    file_path?: string;
    [key: string]: unknown;
  };
  tool_result?: {
    content?: string;
    [key: string]: unknown;
  };
}

// Agent mapping for skill types
const SKILL_AGENT_MAP: Record<string, {
  agent: string;
  phases?: Record<string, string>;
}> = {
  'health': {
    agent: 'advisor',
    phases: {
      'research': 'advisor (research methodology)',
      'report': 'writer (content generation)'
    }
  },
  'ghost': {
    agent: 'writer',
    phases: {
      'research': 'advisor (research methodology)',
      'draft': 'writer (content creation)',
      'qa': 'advisor (quality review)'
    }
  },
  'git': {
    agent: 'engineer',
    phases: {
      'security-scan': 'security (credential detection)'
    }
  },
  'implementation': {
    agent: 'engineer',
    phases: {
      'plan': 'engineer (architecture)',
      'implement': 'engineer (implementation)',
      'validate': 'security (validation)'
    }
  },
  'compliance': {
    agent: 'security',
    phases: {
      'assess': 'security (assessment)',
      'remediate': 'engineer (remediation)',
      'report': 'writer (documentation)'
    }
  },
  'legal': {
    agent: 'legal',
    phases: {
      'research': 'legal (analysis)',
      'report': 'writer (documentation)'
    }
  },
  'career': {
    agent: 'advisor',
    phases: {
      'research': 'advisor (OSINT)',
      'analysis': 'advisor (strengths)',
      'coaching': 'advisor (mentorship)'
    }
  },
  'research': {
    agent: 'advisor',
    phases: {
      'osint': 'advisor (research)',
      'qa': 'advisor (quality review)'
    }
  },
  'content': {
    agent: 'writer',
    phases: {
      'research': 'advisor (research)',
      'draft': 'writer (content)',
      'qa': 'advisor (quality review)'
    }
  },
  'writer': {
    agent: 'writer',
    phases: {}
  },
  'personal-training': {
    agent: 'advisor',
    phases: {}
  },
  'infrastructure-ops': {
    agent: 'engineer',
    phases: {}
  }
};

async function main() {
  try {
    const input = await Bun.stdin.text();

    // Exit silently if no input
    if (!input || !input.trim()) {
      process.exit(0);
    }

    const data: PostToolUseInput = JSON.parse(input);

    // Only process Read tool calls
    if (data.tool_name !== 'Read') {
      process.exit(0);
    }

    const filePath = data.tool_input?.file_path;

    // Validate path before processing
    if (!filePath || !isPathAllowed(filePath)) {
      process.exit(0);
    }

    // Wrap path operations in try-catch for malformed input
    let fileName: string;
    let skillName: string;
    let parentDir: string;

    try {
      fileName = basename(filePath);
      skillName = basename(dirname(filePath));
      parentDir = basename(dirname(dirname(filePath)));
    } catch {
      // Invalid path format - silently exit
      process.exit(0);
    }

    // Check if this is a SKILL.md file
    if (fileName !== 'SKILL.md') {
      process.exit(0);
    }

    // Determine if this is a nested skill
    let displayName = skillName;
    if (parentDir !== 'skills') {
      displayName = `${parentDir}/${skillName}`;
    }

    // Check for agent mapping (check both skill name and parent)
    const agentInfo = SKILL_AGENT_MAP[skillName] || SKILL_AGENT_MAP[parentDir];

    // Inject pre-flight checklist reminder
    console.log('<system-reminder>');
    console.log('SKILL LOADED: Pre-flight Checklist');
    console.log('');
    console.log(`Skill: ${displayName}`);

    // Add agent delegation hint if available
    if (agentInfo) {
      console.log('');
      console.log(`AGENT: Use "${agentInfo.agent}" agent standards`);
      console.log(`   Load: ~/.claude/agents/${agentInfo.agent}.md`);
      if (agentInfo.phases && Object.keys(agentInfo.phases).length > 0) {
        console.log('');
        console.log('   Phase-specific agents:');
        for (const [phase, agent] of Object.entries(agentInfo.phases)) {
          console.log(`     ${phase}: ${agent}`);
        }
      }
    }

    console.log('');
    console.log('BEFORE executing this skill, confirm:');
    console.log('  - I have read the SKILL.md completely');
    console.log('  - I understand the USE WHEN triggers');
    console.log('  - I will follow ALL workflow steps exactly');
    console.log('  - I will NOT skip phases or create shortcuts');
    console.log('  - I will complete verification when done');
    console.log('</system-reminder>');

    process.exit(0);

  } catch (err) {
    // Don't block Claude Code, but log unexpected errors
    const error = err as Error;
    // Only log if it's NOT a JSON parse error (those are expected from empty stdin)
    if (!error.message?.includes('JSON Parse error')) {
      console.error('Skill loader error:', error.message);
    }
    process.exit(0);
  }
}

main();
