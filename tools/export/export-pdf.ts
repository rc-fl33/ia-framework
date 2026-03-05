#!/usr/bin/env bun
/**
 * PDF Export Tool - Markdown to PDF
 *
 * Converts markdown files to PDF using Puppeteer.
 * Uses shared utilities from tools/pdf/core.ts to avoid duplication.
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname, basename, extname, relative } from 'path';
import { checkChromeDependencies, printDependencyHelp, markdownToHtml } from '../pdf/core.ts';

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
    const html = markdownToHtml(markdown, fileName);

    // Generate PDF path (same directory, .pdf extension)
    const pdfPath = fullPath.replace(/\.md$/, '.pdf');

    // Lazy-load puppeteer to avoid eagerly parsing the entire module graph at startup
    // Puppeteer-core ships files that bun corrupts during install,
    // so deferring the import means the tool can start even if PDF export is broken
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

      // Generate PDF
      await page.pdf({
        path: pdfPath,
        format: 'A4',
        margin: {
          top: '2cm',
          right: '2cm',
          bottom: '2cm',
          left: '2cm',
        },
        printBackground: true,
      });

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

// CLI mode
if (import.meta.main) {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error('Usage: export-pdf.ts <file-path>');
    process.exit(1);
  }

  const claudeDir = process.env.IA_FRAMEWORK_ROOT || join(import.meta.dir, '..', '..');
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

export { exportToPdf, type ExportOptions, type ExportResult };
