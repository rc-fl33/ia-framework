/**
 * Markdown section parser — extracts sections by header from markdown files.
 * Handles frontmatter, code blocks, and nested headers.
 *
 * Usage:
 *   import { parseMarkdownSections, extractFrontmatter } from './section-parser';
 *   const { frontmatter, sections } = parseMarkdownSections(content);
 */

import matter from 'gray-matter';

export interface MarkdownSection {
  level: number;
  title: string;
  content: string;
  lineNumber: number;
}

export interface ParsedMarkdown {
  frontmatter: Record<string, unknown> | null;
  frontmatterRaw: string;
  sections: MarkdownSection[];
  title: string | null;
}

/**
 * Parse a markdown file into frontmatter + sections.
 * Correctly handles:
 * - YAML frontmatter (--- delimiters)
 * - Code blocks (``` fenced blocks)
 * - Nested headers (##, ###, etc.)
 */
export function parseMarkdownSections(content: string): ParsedMarkdown {
  let frontmatter: Record<string, unknown> | null = null;
  let frontmatterRaw = '';

  try {
    const parsed = matter(content);
    if (parsed.data && Object.keys(parsed.data).length > 0) {
      frontmatter = parsed.data;
      frontmatterRaw = parsed.matter;
    }
  } catch {
    // Frontmatter parsing failed — continue without it
  }

  // Normalize line endings (handle \r\n and \r)
  const normalizedContent = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = normalizedContent.split('\n');
  const sections: MarkdownSection[] = [];
  let title: string | null = null;
  let currentSection: MarkdownSection | null = null;
  let inCodeBlock = false;

  // Skip frontmatter at the start of the file only
  let startLine = 0;
  if (lines[0]?.trim() === '---') {
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === '---') {
        startLine = i + 1;
        break;
      }
    }
  }

  for (let i = startLine; i < lines.length; i++) {
    const line = lines[i];

    // Track fenced code blocks
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      if (currentSection) {
        currentSection.content += line + '\n';
      }
      continue;
    }

    // Only detect headers outside code blocks
    const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headerMatch && !inCodeBlock) {
      const level = headerMatch[1].length;
      const headerTitle = headerMatch[2].trim();

      // Capture document title (first # header)
      if (level === 1 && !title) {
        title = headerTitle;
      }

      // Save previous section
      if (currentSection) {
        currentSection.content = currentSection.content.trimEnd();
        sections.push(currentSection);
      }

      // Start new section
      currentSection = {
        level,
        title: headerTitle,
        content: '',
        lineNumber: i + 1,
      };
    } else if (currentSection) {
      currentSection.content += line + '\n';
    }
  }

  // Save final section
  if (currentSection) {
    currentSection.content = currentSection.content.trimEnd();
    sections.push(currentSection);
  }

  return { frontmatter, frontmatterRaw, sections, title };
}

/**
 * Check if a section exists with a specific title pattern.
 * Case-insensitive matching.
 */
export function hasSection(sections: MarkdownSection[], titlePattern: string): boolean {
  const pattern = titlePattern.toUpperCase();
  return sections.some(s => s.title.toUpperCase().includes(pattern));
}

/**
 * Find a section by title pattern. Returns first match.
 * Case-insensitive.
 */
export function findSection(sections: MarkdownSection[], titlePattern: string): MarkdownSection | undefined {
  const pattern = titlePattern.toUpperCase();
  return sections.find(s => s.title.toUpperCase().includes(pattern));
}

/**
 * Extract file paths from a section's content.
 * Looks for patterns like: `skills/career/phases/02-research.md`
 * or paths in backticks/quotes.
 */
export function extractFilePaths(content: string): string[] {
  const paths: string[] = [];
  // Match paths in backticks
  const backtickPaths = content.matchAll(/`([^`]*(?:skills|tools)\/[^`]+\.(?:md|ts|json))`/g);
  for (const match of backtickPaths) {
    paths.push(match[1]);
  }
  // Match bare paths that look like skill/tool paths
  const barePaths = content.matchAll(/(?:^|\s)((?:skills|tools)\/[a-z0-9_-]+\/[^\s,)]+\.(?:md|ts|json))/gm);
  for (const match of barePaths) {
    if (!paths.includes(match[1])) {
      paths.push(match[1]);
    }
  }
  return paths;
}
