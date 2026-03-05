/**
 * Mermaid tool — syntax validation
 *
 * Validates Mermaid diagram syntax without rendering.
 * Uses pattern-based checks and mermaid diagram type detection.
 *
 * Usage:
 *   import { validate } from '@/tools/mermaid/scripts/validate';
 *   const result = await validate('graph TD\n  A --> B');
 *
 * CLI:
 *   bun tools/mermaid/scripts/validate.ts "graph TD\n  A --> B"
 */

import type { ValidationResult } from './types.ts';

/** Known Mermaid diagram type prefixes */
const KNOWN_DIAGRAM_TYPES = [
  'graph',
  'flowchart',
  'sequenceDiagram',
  'classDiagram',
  'stateDiagram',
  'stateDiagram-v2',
  'erDiagram',
  'journey',
  'gantt',
  'pie',
  'requirementDiagram',
  'gitGraph',
  'mindmap',
  'timeline',
  'xychart-beta',
  'block-beta',
  'packet-beta',
  'architecture-beta',
  'C4Context',
  'C4Container',
  'C4Component',
  'C4Dynamic',
  'C4Deployment',
];

/**
 * Validate Mermaid diagram syntax.
 *
 * Performs structural validation:
 * 1. Non-empty input
 * 2. Recognizable diagram type declaration
 * 3. Minimum content (not just a type header)
 *
 * Note: This is a fast pre-flight check. Full parse validation
 * requires the mermaid library (see render.ts for deeper validation).
 *
 * @param syntax - Raw Mermaid diagram syntax string
 * @returns ValidationResult with valid flag and any error messages
 */
export async function validate(syntax: string): Promise<ValidationResult> {
  const errors: string[] = [];

  if (!syntax || syntax.trim().length === 0) {
    errors.push('Diagram syntax is empty');
    return { valid: false, errors };
  }

  const trimmed = syntax.trim();
  const firstLine = trimmed.split('\n')[0]?.trim() ?? '';

  const knownType = KNOWN_DIAGRAM_TYPES.find((t) =>
    firstLine.toLowerCase().startsWith(t.toLowerCase())
  );

  if (!knownType) {
    errors.push(
      `Unrecognized diagram type in first line: "${firstLine}". ` +
        `Known types: ${KNOWN_DIAGRAM_TYPES.slice(0, 8).join(', ')}, ...`
    );
  }

  const lines = trimmed.split('\n').filter((l) => l.trim().length > 0);
  if (lines.length < 2) {
    errors.push('Diagram appears to have no content beyond the type declaration');
  }

  const hasUnclosedQuote = (trimmed.match(/"/g) ?? []).length % 2 !== 0;
  if (hasUnclosedQuote) {
    errors.push('Diagram contains an unclosed double-quote');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// CLI entry point
if (import.meta.main) {
  const input = process.argv[2];
  if (!input) {
    console.error('Usage: bun validate.ts "<mermaid-syntax>"');
    process.exit(1);
  }

  const result = await validate(input.replace(/\\n/g, '\n'));
  if (result.valid) {
    console.log('VALID — syntax looks correct');
    process.exit(0);
  } else {
    console.error('INVALID:');
    for (const err of result.errors) {
      console.error(`  - ${err}`);
    }
    process.exit(1);
  }
}
