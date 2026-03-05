/**
 * Grok Imagine API Client
 *
 * TypeScript wrapper for Grok image, video, and image editing via grok2api.
 * Uses direct fetch() to localhost:8000 API (no shell dependencies).
 */

import { mkdir, writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';
import type {
  ImageGenerateOptions,
  ImageEditOptions,
  ImageGenerationResult,
  VideoGenerateOptions,
  VideoGenerationResult,
  VideoConfig,
} from './types';
import {
  GROK2API_BASE_URL,
  FRAMEWORK_DEFAULTS,
  resolveOutputDir,
  generateFilename,
} from './types';

// ─── Image Generation ────────────────────────────────────────────────────

/**
 * Generate images from text prompt via POST /v1/images/generations
 */
export async function generateImage(
  options: ImageGenerateOptions | { prompt: string },
): Promise<ImageGenerationResult> {
  const opts = 'model' in options ? options as ImageGenerateOptions : {
    prompt: (options as { prompt: string }).prompt,
  };

  const {
    prompt,
    model = FRAMEWORK_DEFAULTS.image.model,
    n = FRAMEWORK_DEFAULTS.image.n,
    size = FRAMEWORK_DEFAULTS.image.size,
    format = FRAMEWORK_DEFAULTS.image.format,
    nsfw = false,
    outputDir,
  } = opts;

  const { ensureDockerRunning } = await import('./chat-client');
  await ensureDockerRunning();

  const outDir = outputDir || resolveOutputDir('images', nsfw);
  await mkdir(outDir, { recursive: true });

  const response = await fetch(`${GROK2API_BASE_URL}/v1/images/generations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, prompt, n, size }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Image generation failed: ${response.status} ${error}`);
  }

  const data = await response.json();
  const urls: string[] = (data.data || [])
    .map((d: { url?: string }) => d.url)
    .filter(Boolean);

  if (urls.length === 0) {
    throw new Error('No image URLs in API response');
  }

  const images = await downloadImages(urls, outDir, 'image', format);

  if (images.length === 0) {
    throw new Error('Failed to download any images');
  }

  return { images, prompt, timestamp: new Date().toISOString() };
}

// ─── Video Generation ────────────────────────────────────────────────────

/**
 * Generate video via POST /v1/chat/completions with video_config
 *
 * Two-step process:
 * 1. Generate base image from prompt
 * 2. Animate image into video using video_config
 */
export async function generateVideo(
  options: VideoGenerateOptions | { imagePrompt: string; animationPrompt: string },
): Promise<VideoGenerationResult> {
  // Support legacy signature
  let prompt: string;
  let videoOpts: VideoGenerateOptions;

  if ('imagePrompt' in options) {
    const legacy = options as { imagePrompt: string; animationPrompt: string };
    prompt = legacy.imagePrompt;
    videoOpts = {
      prompt,
      aspect_ratio: FRAMEWORK_DEFAULTS.video.aspect_ratio,
      video_length: FRAMEWORK_DEFAULTS.video.video_length,
      resolution_name: FRAMEWORK_DEFAULTS.video.resolution_name,
      preset: FRAMEWORK_DEFAULTS.video.preset,
    };
  } else {
    videoOpts = options as VideoGenerateOptions;
    prompt = videoOpts.prompt;
  }

  const {
    referenceImage,
    aspect_ratio = FRAMEWORK_DEFAULTS.video.aspect_ratio,
    video_length = FRAMEWORK_DEFAULTS.video.video_length,
    resolution_name = FRAMEWORK_DEFAULTS.video.resolution_name,
    preset = FRAMEWORK_DEFAULTS.video.preset,
    nsfw = false,
    outputDir,
  } = videoOpts;

  const { ensureDockerRunning } = await import('./chat-client');
  await ensureDockerRunning();

  const outDir = outputDir || resolveOutputDir('videos', nsfw, preset);
  await mkdir(outDir, { recursive: true });

  // Step 1: Generate base image
  const baseImageUrl = await generateBaseImage(prompt);

  // Step 2: Generate video from image
  const videoUrl = await animateImage(
    prompt,
    baseImageUrl,
    { aspect_ratio, video_length, resolution_name, preset, referenceImage },
  );

  // Download video
  const filename = generateFilename('video', 1, 'mp4');
  const filePath = join(outDir, filename);

  const dlResponse = await fetch(videoUrl);
  if (!dlResponse.ok) {
    throw new Error(`Failed to download video: ${dlResponse.status}`);
  }

  const videoBuffer = Buffer.from(await dlResponse.arrayBuffer());
  await writeFile(filePath, videoBuffer);

  return {
    videoPath: filePath,
    prompt,
    timestamp: new Date().toISOString(),
    sizeBytes: videoBuffer.length,
  };
}

// ─── Image Editing ───────────────────────────────────────────────────────

/**
 * Edit an existing image via POST /v1/images/edits (multipart/form-data)
 */
export async function editImage(
  options: ImageEditOptions,
): Promise<ImageGenerationResult> {
  const {
    prompt,
    imagePath,
    model = 'grok-imagine-1.0-edit',
    n = 1,
    size = '1024x1024',
    format = FRAMEWORK_DEFAULTS.image.format,
    nsfw = false,
    outputDir,
  } = options;

  const { ensureDockerRunning } = await import('./chat-client');
  await ensureDockerRunning();

  const outDir = outputDir || resolveOutputDir('edits', nsfw);
  await mkdir(outDir, { recursive: true });

  // Read source image
  const imageBuffer = await readFile(imagePath);
  const blob = new Blob([imageBuffer]);

  // Build multipart form data
  const formData = new FormData();
  formData.append('image', blob, 'input.png');
  formData.append('prompt', prompt);
  formData.append('model', model);
  formData.append('n', String(n));
  formData.append('size', size);

  const response = await fetch(`${GROK2API_BASE_URL}/v1/images/edits`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Image editing failed: ${response.status} ${error}`);
  }

  const data = await response.json();
  const urls: string[] = (data.data || [])
    .map((d: { url?: string }) => d.url)
    .filter(Boolean);

  if (urls.length === 0) {
    throw new Error('No edited image URLs in API response');
  }

  const images = await downloadImages(urls, outDir, 'edit', format);

  if (images.length === 0) {
    throw new Error('Failed to download any edited images');
  }

  return { images, prompt, timestamp: new Date().toISOString() };
}

// ─── Convenience Helpers ─────────────────────────────────────────────────

/**
 * Quick helper for simple image generation
 * Returns just the first image path
 */
export async function generateImageSimple(prompt: string): Promise<string> {
  const result = await generateImage({ prompt });
  return result.images[0]!;
}

/**
 * Quick helper for simple video generation
 * Returns just the video path
 */
export async function generateVideoSimple(
  imagePrompt: string,
  animationPrompt: string,
): Promise<string> {
  const result = await generateVideo({ imagePrompt, animationPrompt });
  return result.videoPath;
}

// ─── Internal Helpers ────────────────────────────────────────────────────

/** Download images from URLs, optionally converting to PNG */
async function downloadImages(
  urls: string[],
  outDir: string,
  prefix: 'image' | 'edit',
  format: 'png' | 'jpg' = 'png',
): Promise<string[]> {
  const images: string[] = [];

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]!;
    const ext = format === 'png' ? 'png' : 'jpg';
    const filename = generateFilename(prefix, i + 1, ext);
    const filePath = join(outDir, filename);

    const imgResponse = await fetch(url);
    if (!imgResponse.ok) continue;

    const buffer = Buffer.from(await imgResponse.arrayBuffer());

    if (format === 'png') {
      await sharp(buffer).png({ compressionLevel: 6 }).toFile(filePath);
    } else {
      await writeFile(filePath, buffer);
    }

    images.push(filePath);
  }

  return images;
}

/** Generate a base image and return its URL */
async function generateBaseImage(prompt: string): Promise<string> {
  const imgResponse = await fetch(
    `${GROK2API_BASE_URL}/v1/images/generations`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'grok-imagine-1.0',
        prompt,
        n: 1,
        size: '1280x720',
      }),
    },
  );

  if (!imgResponse.ok) {
    const error = await imgResponse.text();
    throw new Error(`Image generation failed: ${imgResponse.status} ${error}`);
  }

  const imgData = await imgResponse.json();
  const imageUrl = imgData.data?.[0]?.url;
  if (!imageUrl) {
    throw new Error('No image URL from generation step');
  }

  return imageUrl;
}

/** Animate an image into a video and return the video URL */
async function animateImage(
  prompt: string,
  imageUrl: string,
  config: {
    aspect_ratio: VideoConfig['aspect_ratio'];
    video_length: VideoConfig['video_length'];
    resolution_name: VideoConfig['resolution_name'];
    preset: VideoConfig['preset'];
    referenceImage?: string;
  },
): Promise<string> {
  const video_config: VideoConfig = {
    aspect_ratio: config.aspect_ratio,
    video_length: config.video_length,
    resolution_name: config.resolution_name,
    preset: config.preset,
  };
  if (config.referenceImage) {
    video_config.reference_image = config.referenceImage;
  }

  const videoResponse = await fetch(
    `${GROK2API_BASE_URL}/v1/chat/completions`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: FRAMEWORK_DEFAULTS.video.model,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: imageUrl } },
            ],
          },
        ],
        stream: false,
        video_config,
      }),
    },
  );

  if (!videoResponse.ok) {
    const error = await videoResponse.text();
    throw new Error(
      `Video generation failed: ${videoResponse.status} ${error}`,
    );
  }

  const videoData = await videoResponse.json();
  const content = videoData.choices?.[0]?.message?.content || '';

  return extractVideoUrl(videoData, content);
}

/** Extract video URL from API response (structured data or content) */
function extractVideoUrl(
  data: { data?: Array<{ url?: string }> },
  content: string,
): string {
  // Try structured data first
  if (data.data?.[0]?.url) {
    return data.data[0].url;
  }

  // Fallback: extract URL from content
  const urlMatch = content.match(
    /https?:\/\/[^\s"'<>]+\.mp4[^\s"'<>]*/,
  );
  if (urlMatch) {
    return urlMatch[0];
  }

  const localMatch = content.match(
    /(?:src=["']?)?(\/v1\/files\/video\/[^\s"'<>]+)/,
  );
  if (localMatch) {
    return `${GROK2API_BASE_URL}${localMatch[1]}`;
  }

  throw new Error('No video URL in API response');
}

// ─── Re-exports ──────────────────────────────────────────────────────────

// Re-export chat client
export {
  chat,
  chatSimple,
  chatThinking,
  chatStream,
  chatWithReasoning,
  chatWithImage,
  chatMultimodal,
  fetchModels,
  getAvailableModels,
  checkHealth,
  ensureDockerRunning,
  GROK_MODELS,
  type GrokChatMessage,
  type GrokChatOptions,
  type GrokChatOptionsV2,
  type GrokChatResponse,
  type GrokModel,
} from './chat-client';

// Re-export types
export * from './types';
