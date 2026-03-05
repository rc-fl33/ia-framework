#!/usr/bin/env bun
/**
 * Frame Extractor (Pure JavaScript)
 *
 * Extracts frames from video using @ffmpeg/ffmpeg (WebAssembly - no system dependencies).
 *
 * Usage:
 *   bun run extract-frames.ts --video <path> --interval <seconds> --output <dir>
 *   bun run extract-frames.ts --video /tmp/video.mp4 --interval 5 --output /tmp/frames/
 *
 * Dependencies:
 *   - @ffmpeg/ffmpeg (installed via bun)
 *   - @ffmpeg/util (installed via bun)
 */

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL, fetchFile } from '@ffmpeg/util';
import { existsSync, mkdirSync, writeFileSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';

interface ExtractOptions {
  video: string;
  interval: number; // Seconds between frames
  output: string; // Output directory
}

interface ExtractResult {
  success: boolean;
  frames?: string[]; // Paths to extracted frames
  count?: number;
  error?: string;
}

// Global FFmpeg instance to avoid reloading
let ffmpegInstance: FFmpeg | null = null;

/**
 * Initialize FFmpeg.wasm
 */
async function initFFmpeg(): Promise<FFmpeg> {
  if (ffmpegInstance) {
    return ffmpegInstance;
  }

  const ffmpeg = new FFmpeg();

  // Load FFmpeg core
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  });

  ffmpegInstance = ffmpeg;
  return ffmpeg;
}

/**
 * Get video duration using FFmpeg.wasm
 */
async function getVideoDuration(videoPath: string): Promise<number | null> {
  try {
    const ffmpeg = await initFFmpeg();

    // Read video file
    const videoData = await fetchFile(videoPath);
    await ffmpeg.writeFile('input.mp4', videoData);

    // Use ffprobe-like command to get duration
    // This is a workaround: we'll extract metadata via ffmpeg output
    let duration: number | null = null;

    ffmpeg.on('log', ({ message }) => {
      // Parse duration from FFmpeg output: "Duration: 00:12:34.56"
      const match = message.match(/Duration:\s*(\d{2}):(\d{2}):(\d{2}\.\d{2})/);
      if (match) {
        const hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        const seconds = parseFloat(match[3]);
        duration = hours * 3600 + minutes * 60 + seconds;
      }
    });

    // Run a quick command that outputs duration
    await ffmpeg.exec(['-i', 'input.mp4', '-f', 'null', '-']);

    return duration;
  } catch {
    return null;
  }
}

/**
 * Extract frames from video using FFmpeg.wasm
 */
async function extractFrames(options: ExtractOptions): Promise<ExtractResult> {
  const { video, interval, output } = options;

  try {
    // Check video exists
    if (!existsSync(video)) {
      return {
        success: false,
        error: `Video file not found: ${video}`,
      };
    }

    // Initialize FFmpeg
    console.log('  Loading FFmpeg.wasm...');
    const ffmpeg = await initFFmpeg();

    // Create output directory
    if (!existsSync(output)) {
      mkdirSync(output, { recursive: true });
    }

    // Read video file into FFmpeg virtual filesystem
    console.log('  Loading video into memory...');
    const videoData = await fetchFile(video);
    await ffmpeg.writeFile('input.mp4', videoData);

    // Calculate frame extraction pattern
    // Extract 1 frame every N seconds: fps=1/N
    const fps = `1/${interval}`;

    console.log(`  Extracting frames (1 frame per ${interval} seconds)...`);

    // Extract frames with pattern: frame_00001.png, frame_00002.png, etc.
    await ffmpeg.exec([
      '-i',
      'input.mp4',
      '-vf',
      `fps=${fps}`,
      'frame_%05d.png',
    ]);

    // Read extracted frames from FFmpeg virtual filesystem
    const files = await ffmpeg.listDir('/');
    const frameFiles = files.filter((file: any) => file.name.startsWith('frame_') && file.name.endsWith('.png'));

    if (frameFiles.length === 0) {
      return {
        success: false,
        error: 'No frames were extracted',
      };
    }

    // Write frames to actual filesystem
    const extractedFrames: string[] = [];
    for (const file of frameFiles) {
      const frameData = await ffmpeg.readFile(file.name);
      const framePath = join(output, file.name);
      writeFileSync(framePath, frameData);
      extractedFrames.push(framePath);
    }

    // Clean up FFmpeg virtual filesystem
    await ffmpeg.deleteFile('input.mp4');
    for (const file of frameFiles) {
      await ffmpeg.deleteFile(file.name);
    }

    return {
      success: true,
      frames: extractedFrames.sort(),
      count: extractedFrames.length,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during frame extraction',
    };
  }
}

/**
 * CLI Entry Point
 */
async function main() {
  const args = process.argv.slice(2);

  if (
    args.length < 6 ||
    !args.includes('--video') ||
    !args.includes('--interval') ||
    !args.includes('--output')
  ) {
    console.log(
      'Usage: bun run extract-frames.ts --video <path> --interval <seconds> --output <dir>'
    );
    console.log('\nExample:');
    console.log('  bun run extract-frames.ts --video /tmp/video.mp4 --interval 5 --output /tmp/frames/');
    process.exit(1);
  }

  const videoIndex = args.indexOf('--video');
  const intervalIndex = args.indexOf('--interval');
  const outputIndex = args.indexOf('--output');

  const video = args[videoIndex + 1];
  const interval = parseInt(args[intervalIndex + 1], 10);
  const output = args[outputIndex + 1];

  if (isNaN(interval) || interval < 1) {
    console.error('❌ Error: interval must be a positive integer');
    process.exit(1);
  }

  console.log(`\n🎞️  Frame Extraction`);
  console.log(`${'═'.repeat(50)}`);
  console.log(`Video: ${video}`);
  console.log(`Interval: ${interval} seconds`);
  console.log(`Output: ${output}`);
  console.log();

  const result = await extractFrames({ video, interval, output });

  if (!result.success) {
    console.error(`\n❌ Extraction failed: ${result.error}`);
    process.exit(1);
  }

  console.log(`${'═'.repeat(50)}`);
  console.log(`✅ EXTRACTION COMPLETE`);
  console.log(`${'═'.repeat(50)}`);
  console.log(`Frames extracted: ${result.count}`);
  console.log(`Output directory: ${output}`);
  console.log();
}

if (import.meta.main) {
  main().catch((error) => {
    console.error(`Fatal error: ${error.message}`);
    process.exit(1);
  });
}

export { extractFrames, initFFmpeg, getVideoDuration };
export type { ExtractOptions, ExtractResult };
