/**
 * Grok2API v2 Type Definitions
 *
 * Complete types for all API surfaces:
 * Chat, Image Generation, Image Editing, Video Generation,
 * Voice/LiveKit, NSFW, Admin, and Provider integration.
 *
 * @version 2.0
 * @updated 2026-02-19
 */

import { homedir } from 'os';

// ─── Chat Models ────────────────────────────────────────────────────────────

export type GrokChatModel =
  | 'grok-3'
  | 'grok-3-mini'
  | 'grok-3-thinking'
  | 'grok-4'
  | 'grok-4-mini'
  | 'grok-4-thinking'
  | 'grok-4-heavy'
  | 'grok-4.1-mini'
  | 'grok-4.1-fast'
  | 'grok-4.1-expert'
  | 'grok-4.1-thinking'
  | 'grok-4.20-beta';

export type ReasoningEffort =
  | 'none'
  | 'minimal'
  | 'low'
  | 'medium'
  | 'high'
  | 'xhigh';

// ─── Chat Content Parts (Multimodal) ────────────────────────────────────────

export interface TextContent {
  type: 'text';
  text: string;
}

export interface ImageUrlContent {
  type: 'image_url';
  image_url: { url: string };
}

export interface InputAudioContent {
  type: 'input_audio';
  input_audio: { data: string; format: string };
}

export interface FileContent {
  type: 'file';
  file: { url: string };
}

export type ContentPart =
  | TextContent
  | ImageUrlContent
  | InputAudioContent
  | FileContent;

export interface GrokChatMessageV2 {
  role: 'system' | 'user' | 'assistant';
  content: string | ContentPart[];
}

// ─── Image Types ────────────────────────────────────────────────────────────

export type ImageSize =
  | '1280x720'
  | '720x1280'
  | '1024x1024'
  | '1792x1024'
  | '1024x1792';

export type ImageResponseFormat = 'url' | 'b64_json' | 'base64';

export interface ImageGenerateOptions {
  prompt: string;
  model?: string;
  n?: number;
  size?: ImageSize;
  response_format?: ImageResponseFormat;
  stream?: boolean;
  format?: 'png' | 'jpg';
  nsfw?: boolean;
  outputDir?: string;
}

export interface ImageEditOptions {
  prompt: string;
  imagePath: string;
  model?: string;
  n?: number;
  size?: ImageSize;
  response_format?: ImageResponseFormat;
  format?: 'png' | 'jpg';
  nsfw?: boolean;
  outputDir?: string;
}

// ─── Video Types ────────────────────────────────────────────────────────────

export type AspectRatio = '16:9' | '9:16' | '1:1' | '2:3' | '3:2';
export type VideoLength = 6 | 10 | 15;
export type VideoResolution = '480p' | '720p';
export type VideoPreset = 'fun' | 'normal' | 'spicy' | 'custom';

export interface VideoConfig {
  aspect_ratio?: AspectRatio;
  video_length?: VideoLength;
  resolution_name?: VideoResolution;
  preset?: VideoPreset;
  reference_image?: string;
}

export interface VideoGenerateOptions {
  prompt: string;
  referenceImage?: string;
  aspect_ratio?: AspectRatio;
  video_length?: VideoLength;
  resolution_name?: VideoResolution;
  preset?: VideoPreset;
  nsfw?: boolean;
  outputDir?: string;
}

// ─── Voice / LiveKit Types ──────────────────────────────────────────────────

export interface VoiceConfig {
  voice?: string;
  personality?: string;
  speed?: number;
}

export interface LiveKitConnection {
  url: string;
  token: string;
  participantName: string;
  roomName: string;
}

// ─── NSFW Types ─────────────────────────────────────────────────────────────

export interface NSFWConfig {
  imageNsfw: boolean;
  perTokenEnabled: boolean;
}

// ─── Admin Types ────────────────────────────────────────────────────────────

export interface TokenInfo {
  token: string;
  status: 'active' | 'expired' | 'blocked';
  quota: number;
  pool?: 'ssoBasic' | 'ssoSuper';
}

export interface TokenFile {
  ssoBasic: TokenInfo[];
  ssoSuper: TokenInfo[];
}

export interface AdminCacheStats {
  localImages: number;
  localVideos: number;
  onlineAssets: number;
  totalSizeBytes: number;
}

// ─── Model Types ────────────────────────────────────────────────────────────

export interface GrokModelInfo {
  id: string;
  object: string;
  created: number;
  owned_by: string;
}

export interface GrokModelsResponse {
  object: string;
  data: GrokModelInfo[];
}

// ─── Result Types ───────────────────────────────────────────────────────────

export interface ImageGenerationResult {
  images: string[];
  prompt: string;
  timestamp: string;
}

export interface VideoGenerationResult {
  videoPath: string;
  prompt: string;
  timestamp: string;
  sizeBytes: number;
}

// ─── Output Directory Configuration ─────────────────────────────────────────

const HOME = homedir();

export const GROK_OUTPUT_ROOT = `${HOME}/grok-output`;

export const OUTPUT_DIRS = {
  images: {
    sfw: `${GROK_OUTPUT_ROOT}/images/sfw`,
    nsfw: `${GROK_OUTPUT_ROOT}/images/nsfw`,
  },
  edits: {
    sfw: `${GROK_OUTPUT_ROOT}/edits/sfw`,
    nsfw: `${GROK_OUTPUT_ROOT}/edits/nsfw`,
  },
  videos: {
    sfw: `${GROK_OUTPUT_ROOT}/videos/sfw`,
    nsfw: `${GROK_OUTPUT_ROOT}/videos/nsfw`,
  },
} as const;

// ─── API Configuration ──────────────────────────────────────────────────────

export const GROK2API_BASE_URL = 'http://localhost:8000';
export const GROK2API_ADMIN_KEY = 'grok2api';

// ─── Framework Defaults ─────────────────────────────────────────────────────

export const FRAMEWORK_DEFAULTS = {
  image: {
    model: 'grok-imagine-1.0' as const,
    size: '1280x720' as ImageSize,
    format: 'png' as const,
    n: 1,
  },
  video: {
    model: 'grok-imagine-1.0-video' as const,
    aspect_ratio: '16:9' as AspectRatio,
    video_length: 10 as VideoLength,
    resolution_name: '720p' as VideoResolution,
    preset: 'normal' as VideoPreset,
  },
  chat: {
    model: 'grok-4.1' as const,
    temperature: 1.0,
    top_p: 0.95,
    stream: false,
  },
} as const;

// ─── Utility: Resolve output directory based on NSFW flag ───────────────────

export function resolveOutputDir(
  type: 'images' | 'edits' | 'videos',
  nsfw: boolean,
  preset?: VideoPreset,
): string {
  const isNsfw = nsfw || preset === 'spicy';
  return isNsfw ? OUTPUT_DIRS[type].nsfw : OUTPUT_DIRS[type].sfw;
}

// ─── Utility: Generate timestamped filename ─────────────────────────────────

export function generateFilename(
  type: 'image' | 'edit' | 'video',
  index: number,
  ext: string,
): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const time = now.toTimeString().slice(0, 8).replace(/:/g, '');
  return `grok-${type}-${date}-${time}-${index}.${ext}`;
}
