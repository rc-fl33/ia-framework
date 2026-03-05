/**
 * Agent Loader Hook
 *
 * PostToolUse hook that automatically loads agent prompts when a MODULE.md is read.
 * Follows PAI pattern: build safety AROUND the AI as middleware, not INTO prompts.
 *
 * Trigger: PostToolUse on Read tool
 * Action: If MODULE.md was read, check for agent requirements and inject agent prompt
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname, basename } from 'path';

interface PostToolUseInput {
  tool_name: string;
  tool_input: {
    file_path?: string;
    command?: string;
    [key: string]: unknown;
  };
  tool_output?: string;
}

interface AgentConfig {
  agent?: string;           // Single agent for all phases
  agents?: {                // Per-phase agents
    [phase: string]: string;
  };
}

async function main() {
  const input = await Bun.stdin.text();

  // Exit silently if no input
  if (!input || !input.trim()) {
    process.exit(0);
  }

  try {
    const data: PostToolUseInput = JSON.parse(input);

    // Only process Read tool calls
    if (data.tool_name !== 'Read') {
      process.exit(0);
    }

    const filePath = data.tool_input?.file_path;
    if (!filePath) {
      process.exit(0);
    }

    // Check if this is a MODULE.md file
    if (!basename(filePath).toUpperCase().includes('MODULE.MD')) {
      process.exit(0);
    }

    // Found a MODULE.md - check for agent requirements
    await loadAgentContext(filePath);

  } catch (err) {
    // Don't block Claude Code, but log unexpected errors
    const error = err as Error;
    // Only log if it's NOT a JSON parse error (those are expected from empty stdin)
    if (!error.message?.includes('JSON Parse error')) {
      console.error('Agent loader error:', error.message);
    }
    process.exit(0);
  }
}

async function loadAgentContext(moduleMdPath: string): Promise<void> {
  const moduleDir = dirname(moduleMdPath);
  const moduleYamlPath = join(moduleDir, 'module.yaml');

  // Check for module.yaml
  if (!existsSync(moduleYamlPath)) {
    return; // No module.yaml, nothing to load
  }

  const moduleYaml = readFileSync(moduleYamlPath, 'utf-8');
  const agentConfig = parseAgentConfig(moduleYaml);

  if (!agentConfig.agent && !agentConfig.agents) {
    return; // No agent configuration
  }

  // Determine which agent(s) to load
  const agentsToLoad = new Set<string>();

  if (agentConfig.agent) {
    agentsToLoad.add(agentConfig.agent);
  }

  if (agentConfig.agents) {
    Object.values(agentConfig.agents).forEach(a => agentsToLoad.add(a));
  }

  // Load and inject agent prompts
  // Agents are Claude Code sub-agents in the framework's agents/ directory
  // Use IA_FRAMEWORK_ROOT env var if set, otherwise self-discover from script location
  const frameworkPath = process.env.IA_FRAMEWORK_ROOT || join(import.meta.dir, '..');
  const agentsPath = join(frameworkPath, 'agents');

  console.log('<system-reminder>');
  console.log('Agent Context Auto-Loaded');
  console.log('');
  console.log(`Module: ${basename(moduleDir)}`);
  console.log(`Agents: ${Array.from(agentsToLoad).join(', ')}`);
  console.log('');

  for (const agentName of agentsToLoad) {
    const agentPromptPath = join(agentsPath, `${agentName}.md`);

    if (existsSync(agentPromptPath)) {
      const agentPrompt = readFileSync(agentPromptPath, 'utf-8');

      // Extract key standards (first 50 lines or until first ---)
      const lines = agentPrompt.split('\n');
      const keySection = extractKeyStandards(lines);

      console.log(`--- ${agentName.toUpperCase()} AGENT STANDARDS ---`);
      console.log(keySection);
      console.log('');
    } else {
      console.log(`⚠️ Agent prompt not found: ${agentName}`);
    }
  }

  console.log(`Full agent prompts: ~/.claude/agents/`);
  console.log('IMPORTANT: Apply these standards throughout execution.');
  console.log('</system-reminder>');
}

function parseAgentConfig(yamlContent: string): AgentConfig {
  const config: AgentConfig = {};

  // Parse single agent field
  const agentMatch = yamlContent.match(/^agent:\s*(\w+)\s*$/m);
  if (agentMatch) {
    config.agent = agentMatch[1];
  }

  // Parse multi-agent field (agents: block)
  const agentsMatch = yamlContent.match(/^agents:\s*\n((?:  \w+:\s*\w+\s*\n?)+)/m);
  if (agentsMatch) {
    config.agents = {};
    const agentLines = agentsMatch[1].split('\n').filter(l => l.trim());
    for (const line of agentLines) {
      const [phase, agent] = line.trim().split(':').map(s => s.trim());
      if (phase && agent) {
        config.agents[phase] = agent;
      }
    }
  }

  return config;
}

function extractKeyStandards(lines: string[]): string {
  const keyLines: string[] = [];
  let inCriticalSection = false;
  let foundFirstSection = false;

  for (const line of lines) {
    // Skip frontmatter
    if (line.startsWith('---') && !foundFirstSection) {
      foundFirstSection = true;
      continue;
    }

    // Look for critical sections
    if (line.includes('MANDATORY') ||
        line.includes('NEVER:') ||
        line.includes('ALWAYS:') ||
        line.includes('Critical Constraints') ||
        line.includes('Quality Standards')) {
      inCriticalSection = true;
    }

    if (inCriticalSection) {
      keyLines.push(line);

      // Stop after we've collected enough context
      if (keyLines.length > 30) {
        break;
      }
    }

    // Also grab the first header section for context
    if (line.startsWith('## ') && keyLines.length === 0) {
      keyLines.push(line);
    }
  }

  return keyLines.join('\n').trim() || 'See full agent prompt for standards.';
}

main();
