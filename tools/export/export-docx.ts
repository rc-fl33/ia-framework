#!/usr/bin/env bun
/**
 * Observability Skill - Word Export
 *
 * Converts markdown files to DOCX using the docx library.
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, basename, extname, relative } from 'path';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ExternalHyperlink,
} from 'docx';

interface ExportOptions {
  filePath: string;
  claudeDir: string;
}

interface ExportResult {
  success: boolean;
  docxPath?: string;
  error?: string;
}

/**
 * Parse markdown into document elements
 */
function parseMarkdown(markdown: string): Paragraph[] {
  const paragraphs: Paragraph[] = [];
  const lines = markdown.split('\n');
  let inCodeBlock = false;
  let codeBlockContent: string[] = [];
  let inTable = false;
  let tableRows: string[][] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle code blocks
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        // End code block
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: codeBlockContent.join('\n'),
                font: 'Courier New',
                size: 20,
              }),
            ],
            shading: { fill: 'F3F4F6' },
            spacing: { before: 200, after: 200 },
          })
        );
        codeBlockContent = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }

    // Handle tables
    if (line.includes('|') && line.trim().startsWith('|')) {
      const cells = line.split('|').filter(c => c.trim() !== '');

      // Skip separator row
      if (cells.every(c => /^[\s:-]+$/.test(c))) {
        continue;
      }

      if (!inTable) {
        inTable = true;
        tableRows = [];
      }
      tableRows.push(cells.map(c => c.trim()));

      // Check if next line is not a table
      const nextLine = lines[i + 1];
      if (!nextLine || !nextLine.includes('|') || !nextLine.trim().startsWith('|')) {
        // End table
        if (tableRows.length > 0) {
          paragraphs.push(...createTable(tableRows));
        }
        tableRows = [];
        inTable = false;
      }
      continue;
    }

    // Handle headers
    const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headerMatch) {
      const level = headerMatch[1].length;
      const text = headerMatch[2];
      const headingLevel = [
        HeadingLevel.HEADING_1,
        HeadingLevel.HEADING_2,
        HeadingLevel.HEADING_3,
        HeadingLevel.HEADING_4,
        HeadingLevel.HEADING_5,
        HeadingLevel.HEADING_6,
      ][level - 1];

      paragraphs.push(
        new Paragraph({
          text: text,
          heading: headingLevel,
          spacing: { before: 400, after: 200 },
        })
      );
      continue;
    }

    // Handle horizontal rules
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
      paragraphs.push(
        new Paragraph({
          border: {
            bottom: { style: BorderStyle.SINGLE, size: 6, color: 'E5E7EB' },
          },
          spacing: { before: 400, after: 400 },
        })
      );
      continue;
    }

    // Handle blockquotes
    if (line.startsWith('>')) {
      const text = line.replace(/^>\s*/, '');
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: text,
              italics: true,
              color: '4B5563',
            }),
          ],
          indent: { left: 720 },
          border: {
            left: { style: BorderStyle.SINGLE, size: 24, color: '3B82F6' },
          },
          spacing: { before: 200, after: 200 },
        })
      );
      continue;
    }

    // Handle unordered lists
    if (/^[\s]*[-*+]\s+/.test(line)) {
      const indent = line.match(/^(\s*)/)?.[1].length || 0;
      const text = line.replace(/^[\s]*[-*+]\s+/, '');
      paragraphs.push(
        new Paragraph({
          children: parseInlineFormatting(text),
          bullet: { level: Math.floor(indent / 2) },
          spacing: { before: 100, after: 100 },
        })
      );
      continue;
    }

    // Handle ordered lists
    const orderedMatch = line.match(/^[\s]*(\d+)\.\s+(.+)$/);
    if (orderedMatch) {
      const indent = line.match(/^(\s*)/)?.[1].length || 0;
      const text = orderedMatch[2];
      paragraphs.push(
        new Paragraph({
          children: parseInlineFormatting(text),
          numbering: { reference: 'default-numbering', level: Math.floor(indent / 2) },
          spacing: { before: 100, after: 100 },
        })
      );
      continue;
    }

    // Handle empty lines
    if (line.trim() === '') {
      paragraphs.push(new Paragraph({ text: '' }));
      continue;
    }

    // Regular paragraph
    paragraphs.push(
      new Paragraph({
        children: parseInlineFormatting(line),
        spacing: { before: 200, after: 200 },
      })
    );
  }

  return paragraphs;
}

/**
 * Parse inline formatting (bold, italic, code, links)
 */
function parseInlineFormatting(text: string): (TextRun | ExternalHyperlink)[] {
  const runs: (TextRun | ExternalHyperlink)[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    // Check for inline code
    const codeMatch = remaining.match(/^`([^`]+)`/);
    if (codeMatch) {
      runs.push(
        new TextRun({
          text: codeMatch[1],
          font: 'Courier New',
          size: 20,
          shading: { fill: 'F3F4F6' },
        })
      );
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    // Check for bold+italic
    const boldItalicMatch = remaining.match(/^\*\*\*([^*]+)\*\*\*/);
    if (boldItalicMatch) {
      runs.push(
        new TextRun({
          text: boldItalicMatch[1],
          bold: true,
          italics: true,
        })
      );
      remaining = remaining.slice(boldItalicMatch[0].length);
      continue;
    }

    // Check for bold
    const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);
    if (boldMatch) {
      runs.push(
        new TextRun({
          text: boldMatch[1],
          bold: true,
        })
      );
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // Check for italic
    const italicMatch = remaining.match(/^\*([^*]+)\*/);
    if (italicMatch) {
      runs.push(
        new TextRun({
          text: italicMatch[1],
          italics: true,
        })
      );
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }

    // Check for links
    const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      runs.push(
        new ExternalHyperlink({
          children: [
            new TextRun({
              text: linkMatch[1],
              color: '3B82F6',
              underline: {},
            }),
          ],
          link: linkMatch[2],
        })
      );
      remaining = remaining.slice(linkMatch[0].length);
      continue;
    }

    // Find next special character
    const nextSpecial = remaining.search(/[`*\[]/);
    if (nextSpecial === -1) {
      // No more special characters
      runs.push(new TextRun({ text: remaining }));
      break;
    } else if (nextSpecial === 0) {
      // Special char that didn't match patterns - treat as regular text
      runs.push(new TextRun({ text: remaining[0] }));
      remaining = remaining.slice(1);
    } else {
      // Add text up to special character
      runs.push(new TextRun({ text: remaining.slice(0, nextSpecial) }));
      remaining = remaining.slice(nextSpecial);
    }
  }

  return runs;
}

/**
 * Create table from parsed rows
 */
function createTable(rows: string[][]): Paragraph[] {
  if (rows.length === 0) return [];

  const maxCols = Math.max(...rows.map(r => r.length));

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rows.map((row, rowIndex) =>
      new TableRow({
        children: row.map(cell =>
          new TableCell({
            children: [
              new Paragraph({
                children: parseInlineFormatting(cell),
                alignment: AlignmentType.LEFT,
              }),
            ],
            shading: rowIndex === 0 ? { fill: 'F3F4F6' } : undefined,
          })
        ),
      })
    ),
  });

  return [
    new Paragraph({ text: '' }),
    table as unknown as Paragraph, // Type workaround
    new Paragraph({ text: '' }),
  ];
}

/**
 * Export markdown file to DOCX
 */
async function exportToDocx(options: ExportOptions): Promise<ExportResult> {
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

    // Parse markdown
    const fileName = basename(fullPath, extname(fullPath));
    const paragraphs = parseMarkdown(markdown);

    // Create document
    const doc = new Document({
      numbering: {
        config: [
          {
            reference: 'default-numbering',
            levels: [
              { level: 0, format: 'decimal', text: '%1.', alignment: AlignmentType.START },
              { level: 1, format: 'lowerLetter', text: '%2.', alignment: AlignmentType.START },
              { level: 2, format: 'lowerRoman', text: '%3.', alignment: AlignmentType.START },
            ],
          },
        ],
      },
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1440, // 1 inch in twips
                right: 1440,
                bottom: 1440,
                left: 1440,
              },
            },
          },
          children: paragraphs,
        },
      ],
    });

    // Generate DOCX path (same directory, .docx extension)
    const docxPath = fullPath.replace(/\.md$/, '.docx');

    // Pack and save
    const buffer = await Packer.toBuffer(doc);
    writeFileSync(docxPath, buffer);

    return {
      success: true,
      docxPath: relative(options.claudeDir, docxPath),
    };
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
    console.error('Usage: export-docx.ts <file-path>');
    process.exit(1);
  }

  const claudeDir = process.env.IA_FRAMEWORK_ROOT || join(import.meta.dir, '..', '..');
  const result = await exportToDocx({
    filePath: args[0],
    claudeDir,
  });

  if (result.success) {
    console.log(`Word document exported: ${result.docxPath}`);
    process.exit(0);
  } else {
    console.error(result.error);
    process.exit(1);
  }
}

export { exportToDocx, type ExportOptions, type ExportResult };
