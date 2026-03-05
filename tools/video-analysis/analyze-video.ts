#!/usr/bin/env bun
/**
 * Video Analyzer (Pure JavaScript)
 *
 * Orchestrates video download, frame extraction, analysis, and cleanup.
 * Uses pure JavaScript libraries - no system dependencies required.
 *
 * Usage:
 *   bun run analyze-video.ts --url <url> --interval <seconds> --output <file>
 *   bun run analyze-video.ts --url "https://youtu.be/1gQJdIlaXuY" --interval 5 --output research.md
 *
 * Dependencies (installed via bun):
 *   - @distube/ytdl-core (YouTube download)
 *   - @ffmpeg/ffmpeg (frame extraction via WebAssembly)
 *   - @ffmpeg/util (FFmpeg utilities)
 *   - @anthropic-ai/sdk (Claude vision analysis)
 *   - ANTHROPIC_API_KEY in .env
 */

import { downloadVideo } from './download-video';
import { extractFrames } from './extract-frames';
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';

// Load .env
const envPath = join(process.cwd(), '.env');
if (existsSync(envPath)) {
  config({ path: envPath });
}

interface AnalyzeOptions {
  url: string;
  interval: number;
  output: string;
  keepFrames?: boolean;
  keepVideo?: boolean;
  model?: string;
}

interface AnalysisResult {
  success: boolean;
  output?: string;
  framesAnalyzed?: number;
  error?: string;
}

/**
 * Analyze single frame with Claude vision
 */
async function analyzeFrame(
  client: Anthropic,
  framePath: string,
  frameNumber: number,
  timestamp: string,
  model: string
): Promise<string> {
  // Read image as base64
  const imageData = readFileSync(framePath);
  const base64Image = imageData.toString('base64');

  // Determine media type from extension
  const mediaType = framePath.endsWith('.png')
    ? 'image/png'
    : framePath.endsWith('.jpg') || framePath.endsWith('.jpeg')
      ? 'image/jpeg'
      : 'image/png';

  const response = await client.messages.create({
    model,
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType,
              data: base64Image,
            },
          },
          {
            type: 'text',
            text: `Analyze this video frame (Frame ${frameNumber}, timestamp ${timestamp}). Describe:
1. What is shown in this frame
2. Any text, code, diagrams, or technical content visible
3. Key insights or information presented

Be concise but thorough. Focus on extracting factual information.`,
          },
        ],
      },
    ],
  });

  const textContent = response.content.find((block) => block.type === 'text');
  return textContent && 'text' in textContent ? textContent.text : 'No analysis generated';
}

/**
 * Analyze video: download → extract → analyze → cleanup
 */
async function analyzeVideo(options: AnalyzeOptions): Promise<AnalysisResult> {
  const { url, interval, output, keepFrames = false, keepVideo = false, model = 'claude-3-5-sonnet-20241022' } = options;

  const API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!API_KEY) {
    return {
      success: false,
      error: 'ANTHROPIC_API_KEY not found in .env',
    };
  }

  const client = new Anthropic({ apiKey: API_KEY });

  // Create temp directory
  const tempDir = join('/tmp', `video-analysis-${Date.now()}`);
  mkdirSync(tempDir, { recursive: true });

  const videoPath = join(tempDir, 'video.mp4');
  const framesDir = join(tempDir, 'frames');

  try {
    // Step 1: Download video
    console.log('Step 1: Downloading video...');
    const downloadResult = await downloadVideo({ url, output: videoPath });
    if (!downloadResult.success) {
      return {
        success: false,
        error: `Download failed: ${downloadResult.error}`,
      };
    }

    const metadata = downloadResult.metadata;
    console.log(`✓ Downloaded: ${metadata?.title || 'Unknown'}`);
    console.log();

    // Step 2: Extract frames
    console.log('Step 2: Extracting frames...');
    const extractResult = await extractFrames({
      video: videoPath,
      interval,
      output: framesDir,
    });

    if (!extractResult.success) {
      return {
        success: false,
        error: `Frame extraction failed: ${extractResult.error}`,
      };
    }

    console.log(`✓ Extracted ${extractResult.count} frames`);
    console.log();

    // Step 3: Analyze frames
    console.log('Step 3: Analyzing frames with Claude...');
    const frameAnalyses: Array<{ frame: number; timestamp: string; analysis: string }> = [];

    for (let i = 0; i < extractResult.frames!.length; i++) {
      const framePath = extractResult.frames![i];
      const frameNumber = i + 1;
      const timestampSeconds = i * interval;
      const timestamp = `${Math.floor(timestampSeconds / 60)}:${String(timestampSeconds % 60).padStart(2, '0')}`;

      console.log(`  Analyzing frame ${frameNumber}/${extractResult.count} (${timestamp})...`);

      try {
        const analysis = await analyzeFrame(client, framePath, frameNumber, timestamp, model);
        frameAnalyses.push({ frame: frameNumber, timestamp, analysis });
      } catch (error) {
        console.error(`  ⚠️  Failed to analyze frame ${frameNumber}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    console.log(`✓ Analyzed ${frameAnalyses.length} frames`);
    console.log();

    // Step 4: Generate summary
    console.log('Step 4: Generating summary...');
    const summaryPrompt = `Based on these frame analyses from a video, provide:
1. A high-level summary (2-3 paragraphs)
2. 5-10 key insights extracted from the video
3. Notable quotes, data points, or technical details

Frame analyses:
${frameAnalyses.map((fa) => `[${fa.timestamp}] ${fa.analysis}`).join('\n\n')}`;

    const summaryResponse = await client.messages.create({
      model,
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: summaryPrompt,
        },
      ],
    });

    const summaryContent = summaryResponse.content.find((block) => block.type === 'text');
    const summary = summaryContent && 'text' in summaryContent ? summaryContent.text : 'Summary generation failed';

    console.log(`✓ Summary generated`);
    console.log();

    // Step 5: Write output
    console.log('Step 5: Writing analysis...');

    const outputContent = `# Video Analysis: ${metadata?.title || 'Unknown'}

**URL:** ${url}
**Duration:** ${metadata?.duration ? `${Math.floor(metadata.duration / 60)}:${String(Math.floor(metadata.duration % 60)).padStart(2, '0')}` : 'Unknown'}
**Analyzed:** ${new Date().toISOString()}
**Frames Analyzed:** ${frameAnalyses.length}
**Frame Interval:** ${interval} seconds

## Summary

${summary}

## Detailed Timeline

${frameAnalyses
  .map(
    (fa) => `### ${fa.timestamp} - Frame ${fa.frame}

${fa.analysis}
`
  )
  .join('\n')}

## Metadata

- Source: ${url}
- Uploader: ${metadata?.uploader || 'Unknown'}
- Analysis Model: ${model}
- Methodology: Frame extraction at ${interval}-second intervals

---

*Generated by Intelligence Adjacent Video Analysis Tool*
`;

    writeFileSync(output, outputContent, 'utf-8');
    console.log(`✓ Analysis written to ${output}`);
    console.log();

    // Step 6: Cleanup
    console.log('Step 6: Cleanup...');
    if (!keepVideo && existsSync(videoPath)) {
      unlinkSync(videoPath);
      console.log(`✓ Deleted video`);
    }

    if (!keepFrames && existsSync(framesDir)) {
      rmSync(framesDir, { recursive: true });
      console.log(`✓ Deleted ${frameAnalyses.length} frames`);
    }

    if (!keepVideo && !keepFrames) {
      rmSync(tempDir, { recursive: true });
    }

    console.log();

    return {
      success: true,
      output,
      framesAnalyzed: frameAnalyses.length,
    };
  } catch (error) {
    // Cleanup on error
    if (existsSync(tempDir)) {
      rmSync(tempDir, { recursive: true, force: true });
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during analysis',
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
    !args.includes('--url') ||
    !args.includes('--interval') ||
    !args.includes('--output')
  ) {
    console.log(
      'Usage: bun run analyze-video.ts --url <url> --interval <seconds> --output <file> [--keep-frames] [--keep-video] [--model <model>]'
    );
    console.log('\nExample:');
    console.log(
      '  bun run analyze-video.ts --url "https://youtu.be/1gQJdIlaXuY" --interval 5 --output research.md'
    );
    console.log('\nOptions:');
    console.log('  --keep-frames    Keep extracted frames after analysis');
    console.log('  --keep-video     Keep downloaded video after analysis');
    console.log('  --model          Claude model to use (default: claude-3-5-sonnet-20241022)');
    process.exit(1);
  }

  const urlIndex = args.indexOf('--url');
  const intervalIndex = args.indexOf('--interval');
  const outputIndex = args.indexOf('--output');
  const modelIndex = args.indexOf('--model');

  const url = args[urlIndex + 1];
  const interval = parseInt(args[intervalIndex + 1], 10);
  const output = args[outputIndex + 1];
  const keepFrames = args.includes('--keep-frames');
  const keepVideo = args.includes('--keep-video');
  const model = modelIndex >= 0 ? args[modelIndex + 1] : 'claude-3-5-sonnet-20241022';

  if (isNaN(interval) || interval < 1) {
    console.error('❌ Error: interval must be a positive integer');
    process.exit(1);
  }

  console.log(`\n🎬 Video Analysis Pipeline`);
  console.log(`${'═'.repeat(50)}`);
  console.log(`URL: ${url}`);
  console.log(`Interval: ${interval} seconds`);
  console.log(`Output: ${output}`);
  console.log(`Model: ${model}`);
  console.log(`Keep frames: ${keepFrames}`);
  console.log(`Keep video: ${keepVideo}`);
  console.log();

  const result = await analyzeVideo({
    url,
    interval,
    output,
    keepFrames,
    keepVideo,
    model,
  });

  if (!result.success) {
    console.error(`\n❌ Analysis failed: ${result.error}`);
    process.exit(1);
  }

  console.log(`${'═'.repeat(50)}`);
  console.log(`✅ VIDEO ANALYSIS COMPLETE`);
  console.log(`${'═'.repeat(50)}`);
  console.log(`Output: ${result.output}`);
  console.log(`Frames analyzed: ${result.framesAnalyzed}`);
  console.log();
}

if (import.meta.main) {
  main().catch((error) => {
    console.error(`Fatal error: ${error.message}`);
    process.exit(1);
  });
}

export { analyzeVideo };
export type { AnalyzeOptions, AnalysisResult };
