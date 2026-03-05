#!/usr/bin/env bun
/**
 * Video Downloader (Pure JavaScript Wrapper)
 *
 * Downloads videos from YouTube using youtube-dl-exec (wraps yt-dlp/youtube-dl).
 *
 * Usage:
 *   bun run download-video.ts --url <url> --output <path>
 *   bun run download-video.ts --url "https://youtu.be/1gQJdIlaXuY" --output /tmp/video.mp4
 *
 * Dependencies:
 *   - youtube-dl-exec (installed via bun) - manages yt-dlp binary automatically
 */

import { create as createYoutubeDl } from 'youtube-dl-exec';
import { existsSync } from 'fs';
import { dirname } from 'path';
import { homedir } from 'os';
import { join } from 'path';

// Use our locally installed yt-dlp
const ytdlpPath = join(homedir(), '.local/bin/yt-dlp');
const youtubedl = createYoutubeDl(ytdlpPath);

interface DownloadOptions {
  url: string;
  output: string;
  quality?: 'best' | 'worst';
}

interface DownloadResult {
  success: boolean;
  path?: string;
  metadata?: {
    title: string;
    duration: number;
    author: string;
  };
  error?: string;
}

/**
 * Download video using youtube-dl-exec (wraps yt-dlp)
 */
async function downloadVideo(options: DownloadOptions): Promise<DownloadResult> {
  const { url, output, quality = 'best' } = options;

  try {
    // Ensure output directory exists
    const outputDir = dirname(output);
    if (!existsSync(outputDir)) {
      return {
        success: false,
        error: `Output directory does not exist: ${outputDir}`,
      };
    }

    // Download with youtube-dl-exec
    // This will automatically use yt-dlp if available, otherwise youtube-dl
    const result = await youtubedl(url, {
      output,
      format: quality === 'best' ? 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best' : 'worst[ext=mp4]/worst',
      noPlaylist: true,
      noWarnings: true,
      printJson: true,
    });

    // Extract metadata from result
    const metadata = {
      title: result.title || 'Unknown',
      duration: result.duration || 0,
      author: result.uploader || result.channel || 'Unknown',
    };

    if (!existsSync(output)) {
      return {
        success: false,
        error: 'Video file was not created',
      };
    }

    return {
      success: true,
      path: output,
      metadata,
    };
  } catch (error) {
    const errorMsg = error instanceof Error
      ? `${error.message}\nStack: ${error.stack}`
      : `Unknown error: ${JSON.stringify(error)}`;
    return {
      success: false,
      error: errorMsg,
    };
  }
}

/**
 * CLI Entry Point
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length < 4 || !args.includes('--url') || !args.includes('--output')) {
    console.log(
      'Usage: bun run download-video.ts --url <url> --output <path> [--quality <best|worst>]'
    );
    console.log('\nExample:');
    console.log('  bun run download-video.ts --url "https://youtu.be/1gQJdIlaXuY" --output /tmp/video.mp4');
    process.exit(1);
  }

  const urlIndex = args.indexOf('--url');
  const outputIndex = args.indexOf('--output');
  const qualityIndex = args.indexOf('--quality');

  const url = args[urlIndex + 1];
  const output = args[outputIndex + 1];
  const quality = qualityIndex >= 0 ? (args[qualityIndex + 1] as any) : 'best';

  console.log(`\n📥 Video Download`);
  console.log(`${'═'.repeat(50)}`);
  console.log(`URL: ${url}`);
  console.log(`Output: ${output}`);
  console.log(`Quality: ${quality}`);
  console.log();

  const result = await downloadVideo({ url, output, quality });

  if (!result.success) {
    console.error(`\n❌ Download failed: ${result.error}`);
    process.exit(1);
  }

  console.log(`${'═'.repeat(50)}`);
  console.log(`✅ DOWNLOAD COMPLETE`);
  console.log(`${'═'.repeat(50)}`);
  console.log(`Video: ${result.path}`);

  if (result.metadata) {
    console.log(`Title: ${result.metadata.title}`);
    console.log(
      `Duration: ${Math.floor(result.metadata.duration / 60)}:${String(Math.floor(result.metadata.duration % 60)).padStart(2, '0')}`
    );
    console.log(`Author: ${result.metadata.author}`);
  }

  console.log();
}

if (import.meta.main) {
  main().catch((error) => {
    console.error(`Fatal error: ${error.message}`);
    process.exit(1);
  });
}

export { downloadVideo };
export type { DownloadOptions, DownloadResult };
