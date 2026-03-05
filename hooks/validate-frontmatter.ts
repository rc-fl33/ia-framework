/**
 * Frontmatter Validator Hook
 *
 * PreToolUse hook that validates YAML frontmatter in commands and skills.
 * Ensures components have required metadata for discovery and routing.
 *
 * Required fields for commands: name, description
 * Required fields for SKILL.md: name, description
 *
 * Trigger: PreToolUse on Write tool when writing .md files
 * Action: Validate frontmatter, warn on missing required fields
 */

import { existsSync, readFileSync } from 'fs';
import { join, basename, dirname } from 'path';

interface PreToolUseInput {
  tool_name: string;
  tool_input: {
    file_path?: string;
    content?: string;
    [key: string]: unknown;
  };
}

interface ValidationResult {
  action: 'allow' | 'warn' | 'block';
  message?: string;
  suggestion?: string;
}

interface FrontmatterViolation {
  file: string;
  issues: string[];
}

// Required fields per file type
const COMMAND_REQUIRED_FIELDS = ['name', 'description'];
const SKILL_REQUIRED_FIELDS = ['name', 'description'];

// Deprecated fields that should not be in command frontmatter
const COMMAND_DEPRECATED_FIELDS = ['complexity', 'version'];

/**
 * Extract YAML frontmatter from content
 */
function extractFrontmatter(content: string): Record<string, string> | null {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;

  const frontmatter: Record<string, string> = {};
  const lines = match[1].split('\n');

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
      frontmatter[key] = value;
    }
  }

  return frontmatter;
}

/**
 * Validate command file frontmatter
 */
function validateCommandFrontmatter(content: string, filePath: string): string[] {
  const issues: string[] = [];
  const frontmatter = extractFrontmatter(content);

  if (!frontmatter) {
    issues.push('Missing YAML frontmatter (must have --- delimiters)');
    return issues;
  }

  // Check required fields
  for (const field of COMMAND_REQUIRED_FIELDS) {
    if (!frontmatter[field]) {
      issues.push(`Missing required field: ${field}`);
    }
  }

  // Check for deprecated fields
  for (const field of COMMAND_DEPRECATED_FIELDS) {
    if (frontmatter[field]) {
      issues.push(`Deprecated field: ${field} (remove from frontmatter)`);
    }
  }

  return issues;
}

/**
 * Validate SKILL.md frontmatter
 */
function validateSkillFrontmatter(content: string, filePath: string): string[] {
  const issues: string[] = [];
  const frontmatter = extractFrontmatter(content);

  if (!frontmatter) {
    issues.push('Missing YAML frontmatter (must have --- delimiters)');
    return issues;
  }

  // Check required fields
  for (const field of SKILL_REQUIRED_FIELDS) {
    if (!frontmatter[field]) {
      issues.push(`Missing required field: ${field}`);
    }
  }

  // Check name matches directory
  const dirName = basename(dirname(filePath));
  if (frontmatter.name && frontmatter.name !== dirName) {
    // Allow nested skills where name might not match immediate parent
    if (!filePath.includes('/nist/') && !filePath.includes('/iso/')) {
      issues.push(`Frontmatter name "${frontmatter.name}" does not match directory "${dirName}"`);
    }
  }

  return issues;
}

/**
 * Main hook entry point
 */
async function main() {
  // Read input from stdin
  let inputData = '';

  for await (const chunk of Bun.stdin.stream()) {
    inputData += new TextDecoder().decode(chunk);
  }

  // Parse input
  let data: PreToolUseInput;
  try {
    data = JSON.parse(inputData);
  } catch {
    console.log(JSON.stringify({ action: 'allow' }));
    return;
  }

  // Only run on Write tool
  if (data.tool_name !== 'Write') {
    console.log(JSON.stringify({ action: 'allow' }));
    return;
  }

  const filePath = data.tool_input?.file_path || '';
  const content = data.tool_input?.content || '';

  // Skip non-markdown files
  if (!filePath.endsWith('.md')) {
    console.log(JSON.stringify({ action: 'allow' }));
    return;
  }

  // Skip README files
  if (basename(filePath) === 'README.md') {
    console.log(JSON.stringify({ action: 'allow' }));
    return;
  }

  let issues: string[] = [];

  // Determine file type and validate
  if (filePath.includes('/commands/') && !filePath.includes('/skills/')) {
    // Root commands directory (symlinks)
    issues = validateCommandFrontmatter(content, filePath);
  } else if (filePath.includes('/skills/') && filePath.includes('/commands/')) {
    // Skill commands
    issues = validateCommandFrontmatter(content, filePath);
  } else if (basename(filePath) === 'SKILL.md') {
    // Skill entry point
    issues = validateSkillFrontmatter(content, filePath);
  } else if (filePath.includes('/workflows/') && filePath.endsWith('.md')) {
    // Workflow files - check for basic frontmatter
    const frontmatter = extractFrontmatter(content);
    if (!frontmatter) {
      // Workflows don't strictly require frontmatter, just warn
      issues.push('Workflow file has no frontmatter (recommended for discoverability)');
    }
  }

  if (issues.length === 0) {
    console.log(JSON.stringify({ action: 'allow' }));
    return;
  }

  // Build warning message
  const message = `Frontmatter issues in ${basename(filePath)}:\n  - ${issues.join('\n  - ')}`;

  const result: ValidationResult = {
    action: 'warn',
    message,
    suggestion: 'See docs/templates/command-template.md or skills/create/templates/SKILL-TEMPLATE.md'
  };

  console.log(JSON.stringify(result));
}

main().catch(err => {
  console.error('Frontmatter validator error:', err);
  console.log(JSON.stringify({ action: 'allow' }));
});

export { validateCommandFrontmatter, validateSkillFrontmatter, extractFrontmatter };
