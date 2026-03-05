#!/usr/bin/env bun
/**
 * Observability Skill - PDF Export
 *
 * Converts markdown files to PDF using Puppeteer.
 */

import { readFileSync, writeFileSync, existsSync, mkdtempSync, rmSync } from 'fs';
import { join, dirname, basename, extname, relative } from 'path';
import { execSync, spawnSync } from 'child_process';

const QUARTO_BIN = '/opt/quarto/bin/quarto';
const TYPST_DIR  = '/opt/quarto/bin/tools/x86_64';

/**
 * Check if Chrome/Puppeteer dependencies are installed
 */
function checkChromeDependencies(): { ok: boolean; missing: string[] } {
  const requiredLibs = [
    { lib: 'libssl.so.3', pkg: 'libssl3' },
    { lib: 'libnss3.so', pkg: 'libnss3' },
    { lib: 'libatk-1.0.so.0', pkg: 'libatk1.0-0' },
    { lib: 'libatk-bridge-2.0.so.0', pkg: 'libatk-bridge2.0-0' },
    { lib: 'libcups.so.2', pkg: 'libcups2' },
    { lib: 'libdrm.so.2', pkg: 'libdrm2' },
    { lib: 'libxkbcommon.so.0', pkg: 'libxkbcommon0' },
    { lib: 'libXcomposite.so.1', pkg: 'libxcomposite1' },
    { lib: 'libXdamage.so.1', pkg: 'libxdamage1' },
    { lib: 'libXfixes.so.3', pkg: 'libxfixes3' },
    { lib: 'libXrandr.so.2', pkg: 'libxrandr2' },
    { lib: 'libgbm.so.1', pkg: 'libgbm1' },
    { lib: 'libasound.so.2', pkg: 'libasound2' },
  ];

  const missing: string[] = [];

  // PERF-001: fixed - run ldconfig once and check all libs against cached output
  let ldcacheOutput = '';
  try {
    ldcacheOutput = execSync('ldconfig -p', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
  } catch {
    // ldconfig not available - report all as missing
    return { ok: false, missing: requiredLibs.map(r => r.pkg) };
  }

  for (const { lib, pkg } of requiredLibs) {
    if (!ldcacheOutput.includes(lib)) {
      missing.push(pkg);
    }
  }

  // Check for emoji font (not a shared lib — check font cache)
  try {
    const fcOutput = execSync('fc-list', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
    if (!fcOutput.includes('Noto Color Emoji')) {
      missing.push('fonts-noto-color-emoji');
    }
  } catch {
    missing.push('fonts-noto-color-emoji');
  }

  return { ok: missing.length === 0, missing };
}

/**
 * Print dependency installation instructions
 */
function printDependencyHelp(missing: string[]): void {
  console.error('\n╔══════════════════════════════════════════════════════════════╗');
  console.error('║  PDF Export - Missing System Dependencies                     ║');
  console.error('╚══════════════════════════════════════════════════════════════╝\n');
  console.error('Chrome/Puppeteer requires system libraries that are not installed.\n');
  console.error('Run this command to install them:\n');
  console.error('  sudo apt-get update && sudo apt-get install -y \\');
  console.error('    ' + missing.join(' \\\n    '));
  console.error('\nOr install all common Chrome dependencies at once:\n');
  console.error('  sudo apt-get update && sudo apt-get install -y \\');
  console.error('    libssl3 libnss3 libatk1.0-0 libatk-bridge2.0-0 \\');
  console.error('    libcups2 libdrm2 libxkbcommon0 libxcomposite1 \\');
  console.error('    libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2\n');
}

interface ExportOptions {
  filePath: string;
  claudeDir: string;
  returnBuffer?: boolean;
}

interface ExportResult {
  success: boolean;
  pdfPath?: string;
  buffer?: Buffer;
  error?: string;
}

/**
 * Strip YAML frontmatter from markdown
 */
function stripFrontmatter(markdown: string): string {
  // Remove YAML frontmatter (between --- markers at start of file)
  const frontmatterRegex = /^---\s*\n[\s\S]*?\n---\s*\n/;
  return markdown.replace(frontmatterRegex, '');
}

/**
 * Convert markdown to styled HTML
 */
function markdownToHtml(markdown: string, fileName: string): string {
  // Strip YAML frontmatter and Quarto-specific image attribute blocks
  const cleanMarkdown = stripFrontmatter(markdown)
    .replace(/!\[([^\]]*)\]\(([^)]+)\)\{[^}]+\}/g, '![$1]($2)');

  // Use marked with a custom heading renderer — marked v9+ no longer generates
  // heading IDs by default, which breaks markdown TOC anchor links.
  const { Marked } = require('marked');
  const markedInstance = new Marked({
    renderer: {
      // marked v9+ passes a token object; text may be pre-rendered HTML or undefined
      // in edge cases (e.g. headings containing only inline code). Guard defensively.
      heading(token: { text?: string; depth: number; raw?: string }) {
        const t = typeof token.text === 'string' ? token.text
          : typeof token.raw === 'string' ? token.raw.replace(/^#+\s*/, '') : '';
        const id = t.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
        return `<h${token.depth} id="${id}">${t}</h${token.depth}>\n`;
      },
    },
  });
  const html = markedInstance.parse(cleanMarkdown);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${fileName}</title>
  <style>
    /* PDF-optimized CSS with aggressive print overrides */
    @page {
      margin: 2cm;
      size: A4;
    }

    @media print {
      * {
        text-align: left !important;
      }
      h1, h2, h3, h4, h5, h6 {
        text-align: left !important;
      }
    }

    :root {
      --body-font: Georgia, "Times New Roman", Times, serif;
      --header-font: "Helvetica Neue", Helvetica, Arial, sans-serif;
      --code-font: "Courier New", Courier, monospace;
      --base-size: 10pt;
      --line-height: 1.5;
    }

    * {
      box-sizing: border-box;
      text-align: start !important;
    }

    body {
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      font-family: var(--body-font);
      font-size: var(--base-size);
      line-height: var(--line-height);
      color: #1a1a1a;
      background: white;
      word-spacing: 0pt !important;
      letter-spacing: 0pt !important;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
      text-align: left !important;
      direction: ltr !important;
    }

    p, li, div {
      font-family: var(--body-font);
      font-size: var(--base-size);
      line-height: var(--line-height);
      word-spacing: 0pt !important;
      letter-spacing: 0pt !important;
      margin: 0.5em 0;
      text-align: left !important;
      direction: ltr !important;
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: var(--header-font) !important;
      font-weight: 600 !important;
      line-height: 1.3 !important;
      page-break-after: avoid;
      page-break-inside: avoid;
      margin-top: 0.8em !important;
      margin-bottom: 0.3em !important;
      word-spacing: 0pt !important;
      letter-spacing: 0pt !important;
      text-align: left !important;
      direction: ltr !important;
      display: block !important;
    }

    h1 {
      font-size: 14pt !important;
      border-bottom: 2px solid #e0e0e0;
      padding-bottom: 0.2em;
      margin-top: 0 !important;
      text-align: left !important;
      direction: ltr !important;
    }

    h2 {
      font-size: 13pt !important;
      border-bottom: 1px solid #e0e0e0;
      padding-bottom: 0.2em;
      text-align: left !important;
      direction: ltr !important;
    }

    h3 {
      font-size: 12pt !important;
      text-align: left !important;
      direction: ltr !important;
    }
    h4 {
      font-size: 11pt !important;
      text-align: left !important;
      direction: ltr !important;
    }
    h5, h6 {
      font-size: 10pt !important;
      text-align: left !important;
      direction: ltr !important;
    }

    /* Keep headings with following content */
    h1, h2, h3, h4, h5, h6 {
      break-after: avoid-page;
    }

    code {
      font-family: var(--code-font);
      font-size: 9pt;
      background-color: #f5f5f5;
      border: 1px solid #d0d0d0;
      border-radius: 3px;
      padding: 0.1em 0.3em;
      word-spacing: 0pt !important;
      letter-spacing: 0pt !important;
    }

    pre {
      font-family: var(--code-font);
      font-size: 9pt;
      background-color: #f5f5f5;
      border: 1px solid #d0d0d0;
      border-radius: 4px;
      padding: 0.6em;
      overflow-x: auto;
      page-break-inside: avoid;
      margin: 0.6em 0;
      word-spacing: 0pt !important;
      letter-spacing: 0pt !important;
    }

    pre code {
      background: transparent;
      border: none;
      padding: 0;
      font-size: 9pt;
    }

    blockquote {
      border-left: 4px solid #2563eb;
      margin: 0.8em 0;
      padding: 0.5em 0 0.5em 1em;
      color: #4b5563;
      font-style: italic;
      page-break-inside: avoid;
      text-align: left !important;
    }

    ul, ol {
      margin: 0.4em 0 0.8em 0;
      padding-left: 2em;
      list-style-position: outside !important;
      text-align: left !important;
    }

    ul {
      list-style-type: disc !important;
    }

    ul ul {
      list-style-type: circle !important;
      margin-top: 0.2em;
    }

    ul ul ul {
      list-style-type: square !important;
    }

    ol {
      list-style-type: decimal !important;
    }

    li {
      margin: 0.2em 0;
      padding-left: 0.3em;
      word-spacing: 0pt !important;
      letter-spacing: 0pt !important;
      text-align: left !important;
      display: list-item !important;
    }

    table {
      border-collapse: collapse;
      width: 100%;
      margin: 0.6em 0;
      page-break-inside: avoid;
      font-size: 9pt;
    }

    table th,
    table td {
      border: 1px solid #d0d0d0;
      padding: 0.5em 0.75em;
      text-align: left;
      word-spacing: 0pt !important;
      letter-spacing: 0pt !important;
    }

    table th {
      background-color: #f5f5f5;
      font-weight: 600;
      page-break-after: avoid;
    }

    table tr {
      page-break-inside: avoid;
    }

    a {
      color: #2563eb;
      text-decoration: none;
    }

    a[href]:after {
      content: " (" attr(href) ")";
      font-size: 9pt;
      color: #6b7280;
    }

    img {
      max-width: 100%;
      height: auto;
      page-break-inside: avoid;
    }

    hr {
      border: none;
      border-top: 1px solid #d0d0d0;
      margin: 2em 0;
      page-break-after: avoid;
    }

    /* Prevent orphans and widows */
    p, li {
      orphans: 3;
      widows: 3;
    }

    /* Strong emphasis for bold text */
    strong, b {
      font-weight: 600;
      word-spacing: 0pt !important;
      letter-spacing: 0pt !important;
    }

    /* Italic emphasis */
    em, i {
      font-style: italic;
      word-spacing: 0pt !important;
      letter-spacing: 0pt !important;
    }
  </style>
</head>
<body>
${html}
</body>
</html>
`;
}

/**
 * Export markdown file to PDF
 */
async function exportToPdf(options: ExportOptions): Promise<ExportResult> {
  // Check dependencies first
  const depCheck = checkChromeDependencies();
  if (!depCheck.ok) {
    printDependencyHelp(depCheck.missing);
    return {
      success: false,
      error: `Missing system dependencies: ${depCheck.missing.join(', ')}`,
    };
  }

  try {
    const fullPath = join(options.claudeDir, options.filePath);

    // Read markdown file
    let markdown: string;
    try {
      markdown = readFileSync(fullPath, 'utf-8');
    } catch (err) {
      return {
        success: false,
        error: `Failed to read file: ${err}`,
      };
    }

    // Convert to HTML
    const fileName = basename(fullPath, extname(fullPath));
    let html = markdownToHtml(markdown, fileName);

    // Inject brand CSS if available (private/brand/assets/styles.css)
    const brandCssPath = join(options.claudeDir, 'private', 'brand', 'assets', 'styles.css');
    if (existsSync(brandCssPath)) {
      const brandCss = readFileSync(brandCssPath, 'utf-8');
      html = html.replace('</head>', `<style>\n${brandCss}\n</style>\n</head>`);
    }

    // Generate PDF path (same directory, .pdf extension)
    const pdfPath = fullPath.replace(/\.md$/, '.pdf');

    // Lazy-load puppeteer to avoid bun eagerly parsing the entire module graph at
    // startup. Puppeteer-core ships files that bun 1.3.5 corrupts during install,
    // so deferring the import means the server can start even if PDF export is broken.
    const puppeteer = (await import('puppeteer')).default;

    // Launch headless browser
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();

      // Set content and wait for rendering
      await page.setContent(html, {
        waitUntil: 'networkidle0',
      });

      const pdfOptions = {
        format: 'A4' as const,
        margin: {
          top: '2cm',
          right: '2cm',
          bottom: '2cm',
          left: '2cm',
        },
        printBackground: true,
      };

      if (options.returnBuffer) {
        // Return buffer without writing to disk
        const buffer = await page.pdf(pdfOptions) as Buffer;
        await browser.close();
        return { success: true, buffer };
      }

      // Write to disk (default behavior)
      await page.pdf({ ...pdfOptions, path: pdfPath });
      await browser.close();

      return {
        success: true,
        pdfPath: relative(options.claudeDir, pdfPath),
      };
    } catch (err) {
      await browser.close();
      return {
        success: false,
        error: `PDF generation failed: ${err}`,
      };
    }
  } catch (err) {
    return {
      success: false,
      error: `Export failed: ${err}`,
    };
  }
}

/**
 * Render markdown to self-contained HTML via Quarto with IA brand theme.
 * Returns the HTML string on success, null on failure (so caller can fall back).
 */
function quartoRenderHtml(markdown: string, fileName: string, claudeDir: string): string | null {
  if (!existsSync(QUARTO_BIN)) return null;

  const cleanMd = stripFrontmatter(markdown)
    .replace(/!\[([^\]]*)\]\(([^)]+)\)\{[^}]+\}/g, '![$1]($2)');

  const brandScss = join(claudeDir, 'private/brand/assets/theme-light.scss');
  const brandCss  = join(claudeDir, 'private/brand/assets/styles.css');

  const themeBlock = existsSync(brandScss)
    ? `    theme:\n      - cosmo\n      - ${brandScss}`
    : `    theme: cosmo`;
  const cssLine = existsSync(brandCss) ? `\n    css: ${brandCss}` : '';

  const safeTitle = fileName.replace(/"/g, "'");
  const qmdContent = [
    '---',
    `title: "${safeTitle}"`,
    'format:',
    '  html:',
    themeBlock,
    `${cssLine}`,
    '    toc: true',
    '    toc-depth: 3',
    '    toc-location: left',
    '    self-contained: true',
    '    number-sections: false',
    'execute:',
    '  echo: false',
    '  warning: false',
    '---',
    '',
    cleanMd,
  ].join('\n');

  const tmpDir = mkdtempSync('/tmp/ia-export-');
  const tmpQmd  = join(tmpDir, `${fileName}.qmd`);
  const tmpHtml = join(tmpDir, `${fileName}.html`);

  try {
    writeFileSync(tmpQmd, qmdContent, 'utf-8');
    const env = { ...process.env, PATH: `${TYPST_DIR}:${process.env.PATH}` };
    const result = spawnSync(QUARTO_BIN, ['render', tmpQmd, '--to', 'html'], {
      env, cwd: tmpDir, encoding: 'utf-8', timeout: 90_000,
    });
    if (result.status !== 0 || !existsSync(tmpHtml)) return null;
    return readFileSync(tmpHtml, 'utf-8');
  } catch {
    return null;
  } finally {
    try { rmSync(tmpDir, { recursive: true, force: true }); } catch {}
  }
}

/**
 * Export markdown file to branded self-contained HTML
 */
async function exportToHtml(options: ExportOptions): Promise<ExportResult> {
  try {
    const fullPath = join(options.claudeDir, options.filePath);

    let markdown: string;
    try {
      markdown = readFileSync(fullPath, 'utf-8');
    } catch (err) {
      return { success: false, error: `Failed to read file: ${err}` };
    }

    const fileName = basename(fullPath, extname(fullPath));

    // --- Quarto path (preferred) ---
    const quartoHtml = quartoRenderHtml(markdown, fileName, options.claudeDir);

    let html: string;
    if (quartoHtml) {
      html = quartoHtml;
    } else {
      // --- Marked fallback ---
      html = markdownToHtml(markdown, fileName);

      const brandCssPath = join(options.claudeDir, 'private', 'brand', 'assets', 'styles.css');
      if (existsSync(brandCssPath)) {
        const brandCss = readFileSync(brandCssPath, 'utf-8');
        html = html.replace('</head>', `<style>\n${brandCss}\n</style>\n</head>`);
      }

      html = html.replace('</head>', '<style>\nbody { max-width: 900px; margin: 0 auto; padding: 2rem 2.5rem; }\n</style>\n</head>');

      // Embed local images as base64
      const mdDir = dirname(fullPath);
      const MIME: Record<string, string> = {
        webp: 'image/webp', png: 'image/png', jpg: 'image/jpeg',
        jpeg: 'image/jpeg', svg: 'image/svg+xml', gif: 'image/gif',
      };
      html = html.replace(/<img([^>]*)\ssrc="([^"]+)"([^>]*)>/g, (match, before, src, after) => {
        if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) return match;
        const imagePath = src.startsWith('/') ? src : join(mdDir, src);
        if (existsSync(imagePath)) {
          const ext = extname(imagePath).slice(1).toLowerCase();
          const mime = MIME[ext] || 'image/png';
          const b64 = readFileSync(imagePath).toString('base64');
          return `<img${before} src="data:${mime};base64,${b64}"${after}>`;
        }
        return match;
      });
    }

    if (options.returnBuffer) {
      return { success: true, buffer: Buffer.from(html, 'utf-8') };
    }

    const htmlPath = fullPath.replace(/\.md$/, '.html');
    writeFileSync(htmlPath, html, 'utf-8');
    return { success: true, pdfPath: relative(options.claudeDir, htmlPath) };
  } catch (err) {
    return { success: false, error: `Export failed: ${err}` };
  }
}

// CLI mode
if (import.meta.main) {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error('Usage: export-pdf.ts <file-path>');
    process.exit(1);
  }

  const claudeDir = process.env.IA_FRAMEWORK_ROOT || join(import.meta.dir, '..', '..', '..');
  const result = await exportToPdf({
    filePath: args[0],
    claudeDir,
  });

  if (result.success) {
    console.log(`PDF exported: ${result.pdfPath}`);
    process.exit(0);
  } else {
    console.error(result.error);
    process.exit(1);
  }
}

/**
 * Render markdown to PDF via Quarto + Typst engine.
 * Returns the PDF buffer on success, null on failure.
 */
function quartoRenderPdf(markdown: string, fileName: string, claudeDir: string): Buffer | null {
  if (!existsSync(QUARTO_BIN)) return null;

  const cleanMd = stripFrontmatter(markdown)
    .replace(/!\[([^\]]*)\]\(([^)]+)\)\{[^}]+\}/g, '![$1]($2)');

  // Apply brand theme for PDF export
  const brandScss = join(claudeDir, 'private/brand/assets/theme-light.scss');
  const brandCss  = join(claudeDir, 'private/brand/assets/styles.css');

  const themeBlock = existsSync(brandScss)
    ? `    theme:\n      - cosmo\n      - ${brandScss}`
    : `    theme: cosmo`;
  const cssLine = existsSync(brandCss) ? `\n    css: ${brandCss}` : '';

  const safeTitle = fileName.replace(/"/g, "'");
  const qmdContent = [
    '---',
    `title: "${safeTitle}"`,
    'format:',
    '  pdf:',
    '    documentclass: report',
    '    papersize: us-letter',
    '    geometry:',
    '      - margin=1in',
    '    fontsize: 11pt',
    '    pdf-engine: typst',
    '    toc: true',
    '    toc-depth: 3',
    themeBlock,
    cssLine,
    'execute:',
    '  echo: false',
    '  warning: false',
    '---',
    '',
    cleanMd,
  ].join('\n');

  const tmpDir = mkdtempSync('/tmp/ia-export-');
  const tmpQmd = join(tmpDir, `${fileName}.qmd`);
  const tmpPdf = join(tmpDir, `${fileName}.pdf`);

  try {
    writeFileSync(tmpQmd, qmdContent, 'utf-8');
    const env = { ...process.env, PATH: `${TYPST_DIR}:${process.env.PATH}` };
    const result = spawnSync(QUARTO_BIN, ['render', tmpQmd, '--to', 'pdf'], {
      env, cwd: tmpDir, encoding: 'utf-8', timeout: 120_000,
    });
    if (result.status !== 0 || !existsSync(tmpPdf)) return null;
    return readFileSync(tmpPdf);
  } catch {
    return null;
  } finally {
    try { rmSync(tmpDir, { recursive: true, force: true }); } catch {}
  }
}

/**
 * Export markdown file to PDF via Quarto + Typst (no Chrome dependency).
 */
async function exportToQuartoPdf(options: ExportOptions): Promise<ExportResult> {
  try {
    const fullPath = join(options.claudeDir, options.filePath);
    let markdown: string;
    try {
      markdown = readFileSync(fullPath, 'utf-8');
    } catch (err) {
      return { success: false, error: `Failed to read file: ${err}` };
    }

    const fileName = basename(fullPath, extname(fullPath));
    const pdfBuffer = quartoRenderPdf(markdown, fileName, options.claudeDir);

    if (!pdfBuffer) {
      return { success: false, error: 'Quarto PDF render failed (Quarto + Typst required)' };
    }

    if (options.returnBuffer) {
      return { success: true, buffer: pdfBuffer };
    }

    const pdfPath = fullPath.replace(/\.md$/, '.pdf');
    writeFileSync(pdfPath, pdfBuffer);
    return { success: true, pdfPath: relative(options.claudeDir, pdfPath) };
  } catch (err) {
    return { success: false, error: `Export failed: ${err}` };
  }
}

export { exportToPdf, exportToHtml, exportToQuartoPdf, type ExportOptions, type ExportResult };
