/**
 * Mermaid tool — public API
 *
 * This is the canonical import surface for consumers of the mermaid tool.
 * Import from here rather than from individual script files.
 *
 * Usage:
 *   import { renderSVG, renderPNG, renderPDF, validate } from '@/tools/mermaid/scripts/client';
 *
 * Quick example:
 *   const svg = await renderSVG('graph TD\n  A --> B');
 *   const check = await validate('graph TD\n  A --> B');
 */

// Re-export rendering functions
export { renderSVG, renderPNG, renderPDF } from './render.ts';

// Re-export validation
export { validate } from './validate.ts';

// Re-export all types for consumers that need them
export type {
  MermaidTheme,
  RenderFormat,
  RenderOptions,
  ValidationResult,
  SVGRenderResult,
  FileRenderResult,
  MermaidCliConfig,
} from './types.ts';
