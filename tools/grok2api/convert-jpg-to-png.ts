#!/usr/bin/env bun
/**
 * Convert JPEG to PNG using sharp
 * Usage: bun convert-jpg-to-png.ts input.jpg output.png
 */

import sharp from 'sharp';
import { existsSync } from 'fs';

const inputPath = process.argv[2];
const outputPath = process.argv[3];

if (!inputPath || !outputPath) {
  console.error('Usage: bun convert-jpg-to-png.ts input.jpg output.png');
  process.exit(1);
}

if (!existsSync(inputPath)) {
  console.error(`Error: Input file not found: ${inputPath}`);
  process.exit(1);
}

(async () => {
  try {
    await sharp(inputPath)
      .png({ quality: 95, compressionLevel: 6 })
      .toFile(outputPath);

    console.log(`✓ Converted: ${inputPath} → ${outputPath}`);
  } catch (error) {
    console.error(`✗ Conversion failed: ${error}`);
    process.exit(1);
  }
})();
