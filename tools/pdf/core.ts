#!/usr/bin/env bun
/**
 * PDF Tools - Core Utilities
 *
 * Shared functionality for PDF operations:
 * - Markdown to HTML conversion
 * - Chrome dependency checking
 * - Common error handling
 */

import { execSync } from 'child_process';

/**
 * Check if Chrome/Puppeteer dependencies are installed
 */
export function checkChromeDependencies(): { ok: boolean; missing: string[] } {
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

  // Run ldconfig once and check all libs against cached output
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

  return { ok: missing.length === 0, missing };
}

/**
 * Print dependency installation instructions
 */
export function printDependencyHelp(missing: string[]): void {
  console.error('\n╔══════════════════════════════════════════════════════════════╗');
  console.error('║  PDF Tools - Missing System Dependencies                     ║');
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

/**
 * Strip YAML frontmatter from markdown
 */
export function stripFrontmatter(markdown: string): string {
  const frontmatterRegex = /^---\s*\n[\s\S]*?\n---\s*\n/;
  return markdown.replace(frontmatterRegex, '');
}

/**
 * Convert markdown to styled HTML for PDF generation
 */
export function markdownToHtml(markdown: string, fileName: string): string {
  // Strip YAML frontmatter before processing
  const cleanMarkdown = stripFrontmatter(markdown);

  // Lazy-load marked to avoid module graph bloat
  const marked = require('marked');
  const html = marked.parse(cleanMarkdown);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(fileName)}</title>
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

    h3 { font-size: 12pt !important; text-align: left !important; direction: ltr !important; }
    h4 { font-size: 11pt !important; text-align: left !important; direction: ltr !important; }
    h5, h6 { font-size: 10pt !important; text-align: left !important; direction: ltr !important; }

    h1, h2, h3, h4, h5, h6 { break-after: avoid-page; }

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

    ul { list-style-type: disc !important; }
    ul ul { list-style-type: circle !important; margin-top: 0.2em; }
    ul ul ul { list-style-type: square !important; }
    ol { list-style-type: decimal !important; }

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

    table tr { page-break-inside: avoid; }

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

    p, li { orphans: 3; widows: 3; }

    strong, b {
      font-weight: 600;
      word-spacing: 0pt !important;
      letter-spacing: 0pt !important;
    }

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
 * Escape HTML special characters (Node.js compatible)
 */
function escapeHtml(text: string): string {
  const escapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => escapeMap[char] || char);
}
