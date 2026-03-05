/**
 * Mermaid tool — SVG, PNG, and PDF rendering
 *
 * Provides three rendering strategies:
 * - renderSVG: In-process SVG generation via mermaid core library
 * - renderPNG: File export via @mermaid-js/mermaid-cli (requires Chromium)
 * - renderPDF: File export via @mermaid-js/mermaid-cli (requires Chromium)
 *
 * Usage:
 *   import { renderSVG, renderPNG, renderPDF } from '@/tools/mermaid/scripts/render';
 *
 * CLI:
 *   bun tools/mermaid/scripts/render.ts --format svg "graph TD\n  A --> B"
 *   bun tools/mermaid/scripts/render.ts --format png --out out.png "graph TD\n  A --> B"
 */

import { spawnSync } from 'child_process';
import { writeFileSync, mkdirSync, unlinkSync } from 'fs';
import { resolve, dirname } from 'path';
import { tmpdir } from 'os';
import type {
  RenderOptions,
  SVGRenderResult,
  FileRenderResult,
  MermaidCliConfig,
} from './types.ts';

// ---------------------------------------------------------------------------
// Syntax preprocessing
// ---------------------------------------------------------------------------

/**
 * Preprocess Mermaid syntax to fix common issues:
 * - Convert \n to <br/> in node labels (Mermaid doesn't support \n escapes)
 * - Convert escaped newlines \\n to actual newlines for CLI arguments
 */
function preprocessSyntax(syntax: string, fromCli: boolean = false): string {
  let processed = syntax;

  // Convert \n to <br/> in node labels (e.g., node["text\nmore"] -> node["text<br/>more"])
  // This regex matches quoted strings in Mermaid: ["..."] or ['...'] or (...)
  processed = processed.replace(
    /(\[(?:\[[^\]]*\]|[^\]])*\]|\((?:\([^)]*\)|[^)])*\)|"[^"]*"|'[^']*')/g,
    (match) => match.replace(/\\n/g, '<br/>')
  );

  // If from CLI, also convert escaped \\n to actual newlines
  if (fromCli) {
    processed = processed.replace(/\\n/g, '\n');
  }

  return processed;
}

// ---------------------------------------------------------------------------
// SVG rendering — mermaid core library (in-process)
// ---------------------------------------------------------------------------

let mermaidInstance: typeof import('mermaid').default | null = null;

/**
 * Lazily initialize the mermaid library.
 * Mermaid is designed for browser environments; in Node/Bun we use it
 * with a minimal DOM shim for SVG string generation.
 */
async function getMermaid(): Promise<typeof import('mermaid').default> {
  if (mermaidInstance) return mermaidInstance;

  // Dynamic import to avoid loading if only PNG/PDF is needed
  const mod = await import('mermaid');
  mermaidInstance = mod.default;
  return mermaidInstance;
}

/**
 * Generate a unique diagram ID for mermaid rendering.
 */
function generateDiagramId(): string {
  return `mermaid-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Render Mermaid syntax to an SVG string using the mermaid core library.
 *
 * Runs in-process — no CLI or Chromium required.
 * Suitable for embedding SVG directly in HTML or Markdown.
 *
 * @param syntax - Raw Mermaid diagram syntax
 * @param options - Optional render configuration (theme, etc.)
 * @returns SVGRenderResult containing the SVG markup string
 * @throws Error if mermaid library is not installed or syntax is invalid
 */
export async function renderSVG(
  syntax: string,
  options: RenderOptions = {}
): Promise<SVGRenderResult> {
  const mermaid = await getMermaid();
  const diagramId = generateDiagramId();

  mermaid.initialize({
    startOnLoad: false,
    theme: options.theme ?? 'default',
    securityLevel: 'loose',
  });

  const processedSyntax = preprocessSyntax(syntax);
  const { svg } = await mermaid.render(diagramId, processedSyntax);

  return { svg, diagramId };
}

// ---------------------------------------------------------------------------
// File rendering — mermaid-cli (PNG / PDF)
// ---------------------------------------------------------------------------

/**
 * Build mmdc CLI arguments from RenderOptions.
 */
function buildMmdcArgs(
  inputPath: string,
  outputPath: string,
  options: RenderOptions
): string[] {
  const args = ['-i', inputPath, '-o', outputPath];

  if (options.theme) {
    args.push('-t', options.theme);
  }
  if (options.width) {
    args.push('-w', String(options.width));
  }
  if (options.height) {
    args.push('-H', String(options.height));
  }
  if (options.backgroundColor) {
    args.push('-b', options.backgroundColor);
  }
  if (options.scale) {
    args.push('-s', String(options.scale));
  }

  return args;
}

/**
 * Invoke mermaid-cli (mmdc) to render a diagram file.
 * Uses `bun x mmdc` to run via the installed package.
 */
function invokeMmdc(
  inputPath: string,
  outputPath: string,
  options: RenderOptions,
  cliConfig: MermaidCliConfig = {}
): void {
  const mmdcPath = cliConfig.mmdcPath ?? 'mmdc';
  const timeout = cliConfig.timeout ?? 30000;
  const args = buildMmdcArgs(inputPath, outputPath, options);

  // Attempt direct invocation first, fall back to bun x
  let result = spawnSync(mmdcPath, args, {
    timeout,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  if (result.error || (result.status !== null && result.status !== 0)) {
    // Fallback: invoke via bun x (works when installed as dev dependency)
    result = spawnSync('bun', ['x', 'mmdc', ...args], {
      timeout,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  }

  if (result.error) {
    throw new Error(
      `mermaid-cli not found. Install with: bun add @mermaid-js/mermaid-cli\n${result.error.message}`
    );
  }

  if (result.status !== null && result.status !== 0) {
    const stderr = typeof result.stderr === 'string' ? result.stderr : '';
    throw new Error(`mermaid-cli (mmdc) failed with exit code ${result.status}:\n${stderr}`);
  }
}

/**
 * Render Mermaid syntax to a PNG file using mermaid-cli.
 *
 * Requires @mermaid-js/mermaid-cli and Chromium (auto-managed by mmdc).
 *
 * @param syntax - Raw Mermaid diagram syntax
 * @param outputPath - Absolute or relative path for the output PNG file
 * @param options - Optional render configuration
 * @param cliConfig - Optional mermaid-cli configuration
 * @returns FileRenderResult with the resolved output path
 * @throws Error if mermaid-cli is not installed or rendering fails
 */
export async function renderPNG(
  syntax: string,
  outputPath: string,
  options: RenderOptions = {},
  cliConfig: MermaidCliConfig = {}
): Promise<FileRenderResult> {
  const resolved = resolve(outputPath);
  mkdirSync(dirname(resolved), { recursive: true });

  const tmpInput = resolve(tmpdir(), `mermaid-${Date.now()}.mmd`);
  const processedSyntax = preprocessSyntax(syntax, true);
  writeFileSync(tmpInput, processedSyntax, 'utf8');

  try {
    const pngOptions: RenderOptions = {
      theme: options.theme ?? 'default',
      width: options.width ?? 1200,
      height: options.height ?? 800,
      backgroundColor: options.backgroundColor ?? 'white',
      scale: options.scale ?? 2,
    };

    invokeMmdc(tmpInput, resolved, pngOptions, cliConfig);
  } finally {
    try {
      unlinkSync(tmpInput);
    } catch {
      // Ignore cleanup errors
    }
  }

  return { outputPath: resolved, format: 'png' };
}

/**
 * Render Mermaid syntax to a PDF file using mermaid-cli.
 *
 * Requires @mermaid-js/mermaid-cli and Chromium (auto-managed by mmdc).
 *
 * @param syntax - Raw Mermaid diagram syntax
 * @param outputPath - Absolute or relative path for the output PDF file
 * @param options - Optional render configuration (theme, width, height)
 * @param cliConfig - Optional mermaid-cli configuration
 * @returns FileRenderResult with the resolved output path
 * @throws Error if mermaid-cli is not installed or rendering fails
 */
export async function renderPDF(
  syntax: string,
  outputPath: string,
  options: RenderOptions = {},
  cliConfig: MermaidCliConfig = {}
): Promise<FileRenderResult> {
  const resolved = resolve(outputPath);
  mkdirSync(dirname(resolved), { recursive: true });

  const tmpInput = resolve(tmpdir(), `mermaid-${Date.now()}.mmd`);
  const processedSyntax = preprocessSyntax(syntax, true);
  writeFileSync(tmpInput, processedSyntax, 'utf8');

  try {
    const pdfOptions: RenderOptions = {
      theme: options.theme ?? 'default',
      width: options.width ?? 1200,
      height: options.height ?? 800,
    };

    invokeMmdc(tmpInput, resolved, pdfOptions, cliConfig);
  } finally {
    try {
      unlinkSync(tmpInput);
    } catch {
      // Ignore cleanup errors
    }
  }

  return { outputPath: resolved, format: 'pdf' };
}

// ---------------------------------------------------------------------------
// CLI entry point
// ---------------------------------------------------------------------------

if (import.meta.main) {
  const args = process.argv.slice(2);

  const formatIdx = args.indexOf('--format');
  const format = formatIdx !== -1 ? args[formatIdx + 1] : 'svg';

  const outIdx = args.indexOf('--out');
  const outPath = outIdx !== -1 ? args[outIdx + 1] : undefined;

  let syntax = args.find((a) => !a.startsWith('--') && a !== format && a !== outPath);

  // If no syntax argument provided, read from stdin
  if (!syntax) {
    // Check if stdin has content (not a tty means piped input)
    if (!process.stdin.isTTY) {
      syntax = await new Promise((resolve) => {
        let data = '';
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', (chunk) => (data += chunk));
        process.stdin.on('end', () => resolve(data.trim()));
        process.stdin.on('error', () => resolve(''));
      });
    }
  }

  if (!syntax) {
    console.error('Usage: bun render.ts --format svg|png|pdf [--out path] "<syntax>"');
    console.error('   Or: cat diagram.mmd | bun render.ts --format svg [--out path]');
    process.exit(1);
  }

  if (format === 'svg') {
    const result = await renderSVG(syntax);
    console.log(result.svg);
  } else if (format === 'png') {
    if (!outPath) {
      console.error('--out <path> is required for PNG output');
      process.exit(1);
    }
    const result = await renderPNG(syntax, outPath);
    console.log(`PNG written to: ${result.outputPath}`);
  } else if (format === 'pdf') {
    if (!outPath) {
      console.error('--out <path> is required for PDF output');
      process.exit(1);
    }
    const result = await renderPDF(syntax, outPath);
    console.log(`PDF written to: ${result.outputPath}`);
  } else {
    console.error(`Unknown format: ${format}. Use svg, png, or pdf.`);
    process.exit(1);
  }
}
