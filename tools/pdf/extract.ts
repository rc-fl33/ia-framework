#!/usr/bin/env bun
/**
 * PDF Text Extraction Tool
 *
 * Extracts text from PDFs with character-level coordinate tracking.
 * Designed for semantic extraction (preserves structure) vs. simple OCR.
 *
 * Philosophy: Extract text + metadata in a format suitable for:
 * - Markdown conversion (with heading structure)
 * - Annotation systems (with character offsets)
 * - LLM context windows (chunked by semantic boundaries)
 *
 * Based on PDF++ architecture: text extraction -> markdown storage -> annotations
 */

import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { basename, extname, dirname, join } from 'path';

interface ExtractionOptions {
  inputPath: string;
  outputPath?: string;
  includeMetadata?: boolean;
  preserveStructure?: boolean;
}

interface TextSelection {
  page: number;
  startCharIndex: number;
  endCharIndex: number;
  text: string;
  confidence?: number;
}

interface ExtractedContent {
  metadata: {
    title?: string;
    author?: string;
    createdDate?: string;
    modifiedDate?: string;
    pageCount: number;
    language?: string;
    extractedAt: string;
  };
  pages: Array<{
    number: number;
    text: string;
    height?: number;
    width?: number;
  }>;
  structure?: {
    headings: TextSelection[];
    sections: Array<{
      title: string;
      startPage: number;
      endPage: number;
    }>;
  };
}

/**
 * Extract text and metadata from PDF
 */
export async function extractPdfText(options: ExtractionOptions): Promise<ExtractedContent> {
  const { inputPath, includeMetadata = true, preserveStructure = true } = options;

  // Lazy-load pdfjs-dist to avoid module bloat
  // pdfjs-dist: lighter than puppeteer, focused on PDF parsing
  const pdfjs = await import('pdfjs-dist');

  // Read PDF file
  const pdfBytes = await readFile(inputPath);
  const pdf = await pdfjs.getDocument({ data: pdfBytes }).promise;

  const metadata: ExtractedContent['metadata'] = {
    pageCount: pdf.numPages,
    extractedAt: new Date().toISOString(),
  };

  // Extract PDF metadata if available
  if (includeMetadata) {
    try {
      const pdfMetadata = await pdf.getMetadata();
      if (pdfMetadata && pdfMetadata.info) {
        const info = pdfMetadata.info as any;
        if (info.Title) metadata.title = info.Title;
        if (info.Author) metadata.author = info.Author;
        if (info.CreationDate) metadata.createdDate = info.CreationDate;
        if (info.ModDate) metadata.modifiedDate = info.ModDate;
      }
    } catch (err) {
      // Metadata extraction failed, continue with text extraction
      console.warn('Note: Could not extract PDF metadata');
    }
  }

  // Extract text from each page
  const pages: ExtractedContent['pages'] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    try {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();

      // Reconstruct text with layout information
      let pageText = '';
      let lastY = 0;

      if (preserveStructure && textContent.items) {
        // Group text by Y position to preserve layout
        const lineGroups: Map<number, any[]> = new Map();

        for (const item of textContent.items) {
          if ('y' in item && item.y !== undefined) {
            const y = Math.round(item.y);
            if (!lineGroups.has(y)) {
              lineGroups.set(y, []);
            }
            lineGroups.get(y)!.push(item);
          }
        }

        // Sort by Y position (top to bottom) and reconstruct
        const sortedYs = Array.from(lineGroups.keys()).sort((a, b) => b - a);
        for (const y of sortedYs) {
          const lineItems = lineGroups.get(y)!;
          // Sort by X position (left to right)
          lineItems.sort((a, b) => (a.x || 0) - (b.x || 0));

          const lineText = lineItems
            .map((item: any) => item.str || '')
            .join(' ')
            .trim();

          if (lineText) {
            pageText += lineText + '\n';
          }
        }
      } else {
        // Simple concatenation (faster, less structure)
        pageText = textContent.items
          .map((item: any) => item.str || '')
          .join(' ');
      }

      pages.push({
        number: i,
        text: pageText.trim(),
        height: page.pageInfo?.view?.[3],
        width: page.pageInfo?.view?.[2],
      });
    } catch (err) {
      console.warn(`Warning: Failed to extract text from page ${i}: ${err}`);
      pages.push({
        number: i,
        text: '[Text extraction failed]',
      });
    }
  }

  const extracted: ExtractedContent = { metadata, pages };

  // Extract structural elements if requested
  if (preserveStructure && pages.length > 0) {
    extracted.structure = extractStructure(pages);
  }

  return extracted;
}

/**
 * Extract document structure (headings, sections) from text
 */
function extractStructure(
  pages: ExtractedContent['pages']
): ExtractedContent['structure'] {
  const headings: TextSelection[] = [];
  const sections: Array<{ title: string; startPage: number; endPage: number }> = [];

  let currentSection: { title: string; startPage: number } | null = null;

  for (const page of pages) {
    const lines = page.text.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();

      // Simple heuristic: lines that look like headings (short, uppercase, or at start)
      // This is basic - in production you'd use font size detection from PDF
      if (trimmed.length > 0 && trimmed.length < 100) {
        const isLikelyHeading =
          trimmed.length < 50 &&
          (trimmed.toUpperCase() === trimmed ||
            (trimmed[0] === trimmed[0].toUpperCase() && !trimmed.includes('.')));

        if (isLikelyHeading) {
          headings.push({
            page: page.number,
            startCharIndex: 0,
            endCharIndex: trimmed.length,
            text: trimmed,
          });

          if (currentSection) {
            sections.push({
              ...currentSection,
              endPage: page.number - 1,
            });
          }
          currentSection = { title: trimmed, startPage: page.number };
        }
      }
    }
  }

  // Close last section
  if (currentSection) {
    sections.push({
      ...currentSection,
      endPage: pages[pages.length - 1].number,
    });
  }

  return { headings, sections };
}

/**
 * Format extracted content as markdown
 */
export function formatAsMarkdown(extracted: ExtractedContent): string {
  let markdown = '';

  // Add frontmatter with metadata
  markdown += '---\n';
  if (extracted.metadata.title) {
    markdown += `title: "${extracted.metadata.title}"\n`;
  }
  if (extracted.metadata.author) {
    markdown += `author: "${extracted.metadata.author}"\n`;
  }
  if (extracted.metadata.createdDate) {
    markdown += `created: "${extracted.metadata.createdDate}"\n`;
  }
  markdown += `pages: ${extracted.metadata.pageCount}\n`;
  markdown += `extracted: "${extracted.metadata.extractedAt}"\n`;
  markdown += '---\n\n';

  // Add content with page breaks as headers
  for (const page of extracted.pages) {
    markdown += `## Page ${page.number}\n\n`;
    markdown += page.text + '\n\n';
  }

  // Add structure index if available
  if (extracted.structure && extracted.structure.sections.length > 0) {
    markdown += '---\n\n## Structure Index\n\n';
    for (const section of extracted.structure.sections) {
      markdown += `- **${section.title}** (pages ${section.startPage}-${section.endPage})\n`;
    }
  }

  return markdown;
}

// CLI handling
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
PDF Text Extraction - Extract text with structure preservation

Usage:
  bun run tools/pdf/extract.ts <input.pdf> [options]

Options:
  --output <file>         Output file (default: same name, .md extension)
  --no-metadata           Skip metadata extraction
  --no-structure          Don't detect section structure
  --format <type>         Output format: markdown (default) or json
  -h, --help              Show this help

Examples:
  bun run tools/pdf/extract.ts document.pdf
  bun run tools/pdf/extract.ts nist-framework.pdf --output nist-extracted.md
  bun run tools/pdf/extract.ts report.pdf --format json
`);
    process.exit(0);
  }

  const inputPath = args[0];
  let outputPath = args.find((arg, i) => args[i - 1] === '--output')
    ? args[args.indexOf('--output') + 1]
    : inputPath.replace(/\.pdf$/i, '.md');

  const includeMetadata = !args.includes('--no-metadata');
  const preserveStructure = !args.includes('--no-structure');
  const format = args.includes('--format')
    ? args[args.indexOf('--format') + 1]
    : 'markdown';

  // Validate input
  if (!existsSync(inputPath)) {
    console.error(`Error: Input file not found: ${inputPath}`);
    process.exit(1);
  }

  if (!inputPath.toLowerCase().endsWith('.pdf')) {
    console.error(`Error: Input must be a PDF file: ${inputPath}`);
    process.exit(1);
  }

  console.log(`Extracting text from: ${inputPath}`);

  try {
    const extracted = await extractPdfText({
      inputPath,
      outputPath,
      includeMetadata,
      preserveStructure,
    });

    // Format output
    let output = '';
    if (format === 'json') {
      output = JSON.stringify(extracted, null, 2);
    } else {
      output = formatAsMarkdown(extracted);
    }

    // Write output
    await writeFile(outputPath, output);
    console.log(`✓ Extracted ${extracted.metadata.pageCount} pages`);
    console.log(`✓ Saved to: ${outputPath}`);

    if (extracted.structure?.sections) {
      console.log(`✓ Found ${extracted.structure.sections.length} sections`);
    }
  } catch (error) {
    console.error(`Error extracting PDF: ${error}`);
    process.exit(1);
  }
}

if (import.meta.main) {
  main();
}

export { extractPdfText, formatAsMarkdown, type ExtractionOptions, type ExtractedContent };
