/**
 * Mermaid tool — shared TypeScript type definitions
 *
 * Consumed by: render.ts, validate.ts, client.ts
 */

/** Mermaid diagram theme options */
export type MermaidTheme = 'default' | 'dark' | 'forest' | 'neutral' | 'base';

/** Output format options for file-based rendering */
export type RenderFormat = 'svg' | 'png' | 'pdf';

/** Options passed to rendering functions */
export interface RenderOptions {
  /** Mermaid theme. Defaults to 'default'. */
  theme?: MermaidTheme;
  /** Output width in pixels (PNG/PDF only). Defaults to 1200. */
  width?: number;
  /** Output height in pixels (PNG/PDF only). Defaults to 800. */
  height?: number;
  /** Background color (PNG only). Defaults to 'white'. */
  backgroundColor?: string;
  /** Scale factor for retina displays (PNG only). Defaults to 2. */
  scale?: number;
}

/** Result of a validation check */
export interface ValidationResult {
  /** Whether the Mermaid syntax is valid */
  valid: boolean;
  /** Validation error messages (empty if valid) */
  errors: string[];
}

/** Result of an SVG render operation */
export interface SVGRenderResult {
  /** The rendered SVG markup string */
  svg: string;
  /** Diagram ID used during rendering */
  diagramId: string;
}

/** Result of a file render operation (PNG or PDF) */
export interface FileRenderResult {
  /** Absolute path to the created output file */
  outputPath: string;
  /** File format that was rendered */
  format: 'png' | 'pdf';
}

/** Configuration for mermaid-cli invocation */
export interface MermaidCliConfig {
  /** Path to mmdc binary. If not set, resolves via bun x mmdc. */
  mmdcPath?: string;
  /** Path to a custom puppeteer config file */
  puppeteerConfig?: string;
  /** Timeout in milliseconds for CLI execution. Defaults to 30000. */
  timeout?: number;
}
