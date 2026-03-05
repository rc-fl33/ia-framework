#!/usr/bin/env bun
/**
 * PDF Splitter - TypeScript version
 * Splits large PDFs into chunks for LLM context windows
 *
 * Usage:
 *   bun run tools/export/pdf-splitter.ts <input.pdf> [--output-dir <dir>] [--pages-per-chunk <n>]
 *
 * Example:
 *   bun run tools/export/pdf-splitter.ts document.pdf --output-dir output/ --pages-per-chunk 10
 */

import { PDFDocument } from 'pdf-lib';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { basename, join, dirname } from 'path';

interface SplitOptions {
  inputPath: string;
  outputDir: string;
  pagesPerChunk: number;
  keepOriginal: boolean;
  onProgress?: (current: number, total: number) => void;
}

interface ChunkData {
  filename: string;
  path: string;
  bytes: Uint8Array;
  pageRange: string;
}

async function splitPdf(options: SplitOptions): Promise<string[]> {
  const { inputPath, outputDir, pagesPerChunk, keepOriginal, onProgress } = options;

  // Read the PDF
  console.log(`Reading: ${inputPath}`);
  const pdfBytes = await readFile(inputPath);
  const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });

  const totalPages = pdfDoc.getPageCount();
  console.log(`Total pages: ${totalPages}`);

  // Create output directory if needed
  if (!existsSync(outputDir)) {
    await mkdir(outputDir, { recursive: true });
  }

  // Calculate chunks
  const numChunks = Math.ceil(totalPages / pagesPerChunk);
  const chunks: ChunkData[] = [];

  // Get base filename without extension
  const inputBasename = basename(inputPath, '.pdf');

  console.log(`Splitting into ${numChunks} chunks of ${pagesPerChunk} pages each...`);

  // Phase 1: Generate all chunk data (without writing to disk)
  for (let chunk = 0; chunk < numChunks; chunk++) {
    const startPage = chunk * pagesPerChunk;
    const endPage = Math.min(startPage + pagesPerChunk, totalPages);

    // Create a new PDF for this chunk
    const chunkDoc = await PDFDocument.create();

    // Copy pages to the chunk
    const pageIndices = Array.from(
      { length: endPage - startPage },
      (_, i) => startPage + i
    );
    const copiedPages = await chunkDoc.copyPages(pdfDoc, pageIndices);
    copiedPages.forEach(page => chunkDoc.addPage(page));

    // Generate output filename
    const startPageStr = String(startPage + 1).padStart(3, '0');
    const endPageStr = String(endPage).padStart(3, '0');
    const outputFilename = `${inputBasename}_pages_${startPageStr}-${endPageStr}.pdf`;
    const outputPath = join(outputDir, outputFilename);

    // Save the chunk bytes
    const chunkBytes = await chunkDoc.save();
    const pageRange = `pages ${startPage + 1}-${endPage}`;

    chunks.push({
      filename: outputFilename,
      path: outputPath,
      bytes: chunkBytes,
      pageRange
    });

    if (onProgress) {
      onProgress(chunk + 1, numChunks);
    }
  }

  console.log(`Generated all chunks, writing ${chunks.length} files concurrently...`);

  // Phase 2: Write all chunks concurrently
  const writePromises = chunks.map(chunk =>
    writeFile(chunk.path, chunk.bytes)
      .then(() => {
        console.log(`  Created: ${chunk.filename} (${chunk.pageRange})`);
        return chunk.path;
      })
  );

  const outputFiles = await Promise.all(writePromises);

  // Phase 3: Delete original file (only if explicitly requested)
  if (!keepOriginal && outputFiles.length > 0) {
    const { unlink } = await import('fs/promises');
    try {
      await unlink(inputPath);
      console.log(`\n✓ Deleted original: ${inputPath}`);
    } catch (error) {
      console.warn(`Warning: Could not delete original file: ${error}`);
    }
  }

  console.log(`\n✓ Complete! Created ${outputFiles.length} chunks in ${outputDir}`);
  if (keepOriginal) {
    console.log(`✓ Original PDF preserved: ${inputPath}`);
  }
  return outputFiles;
}

// CLI handling
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
PDF Splitter - Split large PDFs into chunks for LLM context

Usage:
  bun run tools/export/pdf-splitter.ts <input.pdf> [options]

Options:
  --output-dir <dir>      Output directory (default: same as input)
  --pages-per-chunk <n>   Pages per chunk (default: 10)
  --delete-original       Delete original PDF after splitting (default: KEEP original)
  -h, --help              Show this help

PHILOSOPHY (PDF++): By default, the original PDF is PRESERVED (non-destructive).
This follows Obsidian PDF++ architecture: create alongside, don't replace.

Examples:
  bun run tools/export/pdf-splitter.ts document.pdf
  bun run tools/export/pdf-splitter.ts NIST.SP.800-53r5.pdf --output-dir frameworks/nist-800-53/reference/
  bun run tools/export/pdf-splitter.ts large.pdf --pages-per-chunk 20 --keep-original
`);
    process.exit(0);
  }

  // Parse arguments
  const inputPath = args[0];
  let outputDir = dirname(inputPath);
  let pagesPerChunk = 10;
  let keepOriginal = true; // Changed from false - preserve original by default (PDF++ philosophy)

  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--output-dir' && args[i + 1]) {
      outputDir = args[i + 1];
      i++;
    } else if (args[i] === '--pages-per-chunk' && args[i + 1]) {
      pagesPerChunk = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--delete-original') {
      keepOriginal = false;
    } else if (args[i] === '--keep-original') {
      // Deprecated: now the default behavior
      keepOriginal = true;
      console.warn('Warning: --keep-original is now the default. Use --delete-original to remove original.');
    }
  }

  // Validate input
  if (!existsSync(inputPath)) {
    console.error(`Error: Input file not found: ${inputPath}`);
    process.exit(1);
  }

  if (!inputPath.toLowerCase().endsWith('.pdf')) {
    console.error(`Error: Input must be a PDF file: ${inputPath}`);
    process.exit(1);
  }

  // Split the PDF
  try {
    await splitPdf({ inputPath, outputDir, pagesPerChunk, keepOriginal });
  } catch (error) {
    console.error(`Error splitting PDF: ${error}`);
    process.exit(1);
  }
}

main();
