#!/usr/bin/env bun
/**
 * CLAUDE.md Section Parser
 *
 * Parses CLAUDE.md into sections with ownership detection.
 * Identifies framework-owned, user-customizable, and hybrid sections.
 * Respects code fences (doesn't parse ## inside code blocks).
 *
 * Usage:
 *   bun tools/framework/claude-md-sync/parser-claude-md.ts [path/to/CLAUDE.md]
 *   bun tools/framework/claude-md-sync/parser-claude-md.ts --json
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Framework root resolution
const FRAMEWORK_ROOT = process.env.IA_FRAMEWORK_ROOT || join(import.meta.dir, '..', '..');

interface ClaudeMdLine {
  type: 'heading' | 'comment' | 'content' | 'code-fence' | 'empty';
  raw: string;
  level?: number;           // 2 for ##, 3 for ###, etc.
  text?: string;            // Heading text without #'s
  language?: string;        // For code fence (```language)
}

interface ClaudeMdSection {
  id: string;                                           // slug-version of title
  title: string;
  level: number;                                        // 2, 3, 4, etc.
  ownership: 'framework' | 'user' | 'hybrid' | 'unknown';
  mergeStrategy: 'replace' | 'preserve' | 'intelligent';
  startLine: number;
  endLine: number;
  lines: ClaudeMdLine[];
  subsections: ClaudeMdSection[];
  ownership_marker?: string;                            // The marker comment found
}

interface ParsedClaudeMd {
  sections: ClaudeMdSection[];
  allLines: ClaudeMdLine[];
  rawContent: string;
}

// Framework-owned section patterns (auto-detected)
const FRAMEWORK_OWNED_PATTERNS = [
  'YOUR ROLE',
  'ORCHESTRATOR',
  'Critical Requirements',
  'YOUR PRIMARY ROLE',
  'Routing Decision Tree',
  'Agent Routing Table',
  'YOU ONLY handle',
];

// User-customizable patterns
const USER_CUSTOMIZABLE_PATTERNS = [
  'Custom',
  'My',
  'Personal',
  'Communication Style',
];

/**
 * Parse a single line from CLAUDE.md
 */
function parseLine(line: string, inCodeFence: boolean): { line: ClaudeMdLine; inCodeFence: boolean } {
  // Toggle code fence state
  if (line.trim().startsWith('```')) {
    const language = line.trim().substring(3).trim();
    return {
      line: {
        type: 'code-fence',
        raw: line,
        language: language || undefined
      },
      inCodeFence: !inCodeFence
    };
  }

  // If in code fence, don't parse structure
  if (inCodeFence) {
    return {
      line: { type: 'content', raw: line },
      inCodeFence
    };
  }

  // Empty line
  if (!line.trim()) {
    return {
      line: { type: 'empty', raw: line },
      inCodeFence
    };
  }

  // Comment line (HTML or markdown)
  if (line.trim().startsWith('<!--') || line.trim().startsWith('//')) {
    return {
      line: { type: 'comment', raw: line },
      inCodeFence
    };
  }

  // Heading
  const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
  if (headingMatch) {
    return {
      line: {
        type: 'heading',
        raw: line,
        level: headingMatch[1].length,
        text: headingMatch[2].trim()
      },
      inCodeFence
    };
  }

  // Default: content
  return {
    line: { type: 'content', raw: line },
    inCodeFence
  };
}

/**
 * Detect ownership from heuristics and markers
 */
function detectOwnership(section: ClaudeMdSection): { ownership: 'framework' | 'user' | 'hybrid'; marker?: string } {
  // Look for ownership markers in nearby comments
  const comments = section.lines.filter(l => l.type === 'comment').map(l => l.raw);

  for (const comment of comments) {
    if (comment.includes('@framework-section: owned')) {
      return { ownership: 'framework', marker: '@framework-section: owned' };
    }
    if (comment.includes('@framework-section: user')) {
      return { ownership: 'user', marker: '@framework-section: user' };
    }
    if (comment.includes('@framework-section: hybrid')) {
      return { ownership: 'hybrid', marker: '@framework-section: hybrid' };
    }
  }

  // Heuristic detection
  const title = (section.title || '').toLowerCase();

  for (const pattern of USER_CUSTOMIZABLE_PATTERNS) {
    if (title.includes(pattern.toLowerCase())) {
      return { ownership: 'user' };
    }
  }

  for (const pattern of FRAMEWORK_OWNED_PATTERNS) {
    if (title.includes(pattern.toLowerCase())) {
      return { ownership: 'framework' };
    }
  }

  // Default for top-level sections
  if (section.level === 2) {
    // Check if it looks like framework doc (contains routing, orchestration, etc.)
    if (title.includes('routing') || title.includes('directory') || title.includes('reference')) {
      return { ownership: 'framework' };
    }
  }

  return { ownership: 'unknown' };
}

/**
 * Determine merge strategy from ownership
 */
function getMergeStrategy(ownership: 'framework' | 'user' | 'hybrid' | 'unknown'): 'replace' | 'preserve' | 'intelligent' {
  switch (ownership) {
    case 'framework':
      return 'replace';
    case 'user':
      return 'preserve';
    case 'hybrid':
      return 'intelligent';
    default:
      return 'preserve'; // Conservative default
  }
}

/**
 * Create section ID from title
 */
function createSectionId(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Parse entire CLAUDE.md file into sections
 */
export function parseClaudeMdFile(filePath: string): ParsedClaudeMd | null {
  if (!existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return null;
  }

  const rawContent = readFileSync(filePath, 'utf-8');
  const lines = rawContent.split('\n');

  const allLines: ClaudeMdLine[] = [];
  const sections: ClaudeMdSection[] = [];
  let inCodeFence = false;
  let currentSection: ClaudeMdSection | null = null;
  let sectionStack: ClaudeMdSection[] = [];

  for (let i = 0; i < lines.length; i++) {
    const { line, inCodeFence: newInCodeFence } = parseLine(lines[i], inCodeFence);
    inCodeFence = newInCodeFence;
    allLines.push(line);

    // Process headings
    if (line.type === 'heading' && line.level && line.text) {
      // Create new section
      const newSection: ClaudeMdSection = {
        id: createSectionId(line.text),
        title: line.text,
        level: line.level,
        ownership: 'unknown',
        mergeStrategy: 'preserve',
        startLine: i,
        endLine: i,
        lines: [line],
        subsections: []
      };

      // Detect ownership
      const ownershipResult = detectOwnership(newSection);
      newSection.ownership = ownershipResult.ownership;
      newSection.ownership_marker = ownershipResult.marker;
      newSection.mergeStrategy = getMergeStrategy(newSection.ownership);

      // Determine parent-child relationship
      if (currentSection && line.level! > currentSection.level) {
        // This is a subsection
        currentSection.subsections.push(newSection);
        sectionStack.push(currentSection);
        currentSection = newSection;
      } else {
        // This is a top-level section or sibling
        // Pop stack until we find parent at correct level
        while (sectionStack.length > 0 && sectionStack[sectionStack.length - 1].level >= line.level!) {
          sectionStack.pop();
        }

        if (sectionStack.length > 0) {
          sectionStack[sectionStack.length - 1].subsections.push(newSection);
        } else {
          sections.push(newSection);
        }

        currentSection = newSection;
      }
    } else if (currentSection) {
      // Add line to current section
      currentSection.lines.push(line);
      currentSection.endLine = i;
    }
  }

  return {
    sections,
    allLines,
    rawContent
  };
}

/**
 * Pretty print sections tree
 */
function printSectionsTree(sections: ClaudeMdSection[], indent = 0) {
  for (const section of sections) {
    const prefix = '  '.repeat(indent);
    const ownershipIcon = {
      'framework': '📘',
      'user': '👤',
      'hybrid': '🔄',
      'unknown': '❓'
    }[section.ownership];

    const strategyLabel = {
      'replace': '↻ replace',
      'preserve': '⊚ preserve',
      'intelligent': '⚡ intelligent'
    }[section.mergeStrategy];

    console.log(`${prefix}${ownershipIcon} ${section.title} (${strategyLabel})`);
    if (section.ownership_marker) {
      console.log(`${prefix}   marker: ${section.ownership_marker}`);
    }

    if (section.subsections.length > 0) {
      printSectionsTree(section.subsections, indent + 1);
    }
  }
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  const filePath = args[0] || join(FRAMEWORK_ROOT, 'CLAUDE.md');
  const jsonOutput = args.includes('--json');

  if (!existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  const parsed = parseClaudeMdFile(filePath);

  if (!parsed) {
    process.exit(1);
  }

  if (jsonOutput) {
    // Output JSON for programmatic use
    console.log(JSON.stringify(parsed.sections, null, 2));
  } else {
    // Print human-readable tree
    console.log(`\n📄 CLAUDE.md Section Analysis`);
    console.log(`File: ${filePath}`);
    console.log(`Lines: ${parsed.allLines.length}\n`);

    console.log('Legend:');
    console.log('  📘 Framework-owned (replace on update)');
    console.log('  👤 User-customizable (always preserve)');
    console.log('  🔄 Hybrid (intelligent merge)');
    console.log('  ❓ Unknown (default to preserve)\n');

    console.log('Section Tree:\n');
    printSectionsTree(parsed.sections);

    // Summary
    const stats = {
      framework: parsed.sections.filter(s => s.ownership === 'framework').length,
      user: parsed.sections.filter(s => s.ownership === 'user').length,
      hybrid: parsed.sections.filter(s => s.ownership === 'hybrid').length,
      unknown: parsed.sections.filter(s => s.ownership === 'unknown').length
    };

    console.log(`\n\nSummary:`);
    console.log(`  Framework-owned: ${stats.framework}`);
    console.log(`  User-customizable: ${stats.user}`);
    console.log(`  Hybrid: ${stats.hybrid}`);
    console.log(`  Unknown: ${stats.unknown}`);
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
