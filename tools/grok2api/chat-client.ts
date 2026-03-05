/**
 * Grok Chat API Client
 *
 * TypeScript wrapper for Grok text generation (chat) via grok2api
 *
 * Service: chenyme/grok2api running on localhost:8000
 * Models: grok-3, grok-4, grok-4.1-fast, grok-4.1-thinking, etc.
 */

import type {
  ReasoningEffort,
  GrokChatMessageV2,
  ContentPart,
  VideoConfig,
  GrokModelInfo,
  GrokModelsResponse,
} from './types';

export interface GrokChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GrokChatOptions {
  model?: string;
  messages: GrokChatMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface GrokChatOptionsV2 extends GrokChatOptions {
  reasoning_effort?: ReasoningEffort;
  top_p?: number;
  video_config?: VideoConfig;
}

export interface GrokChatResponse {
  content: string;
  model: string;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
}

// Available models from grok2api
export const GROK_MODELS = {
  // Chat models
  'grok-3': 'Grok 3 base model',
  'grok-3-mini': 'Grok 3 mini (lightweight)',
  'grok-3-thinking': 'Grok 3 with reasoning',
  'grok-4': 'Grok 4 base model',
  'grok-4-mini': 'Grok 4 mini (lightweight)',
  'grok-4-thinking': 'Grok 4 with reasoning',
  'grok-4.1-mini': 'Grok 4.1 mini',
  'grok-4.1-fast': 'Grok 4.1 fast',
  'grok-4.1-expert': 'Grok 4.1 expert reasoning',
  'grok-4.1-thinking': 'Grok 4.1 with advanced thinking',
  'grok-4.20-beta': 'Grok 4.20 beta',

  // Heavy model (Super account only)
  'grok-4-heavy': 'Most powerful Grok 4 (requires Super)',

  // Image/video generation (use dedicated endpoints)
  'grok-imagine-1.0': 'Image generation (POST /v1/images/generations)',
  'grok-imagine-1.0-edit': 'Image editing (POST /v1/images/edits)',
  'grok-imagine-1.0-video': 'Video generation'
} as const;

export type GrokModel = keyof typeof GROK_MODELS;

/**
 * Send a chat completion request to Grok
 *
 * @param options - Chat options including model, messages, and parameters
 * @returns Promise with response content and metadata
 *
 * @example
 * const response = await chat({
 *   model: 'grok-4.1',
 *   messages: [
 *     { role: 'user', content: 'Explain quantum computing' }
 *   ]
 * });
 * console.log(response.content);
 */
export async function chat(options: GrokChatOptions): Promise<GrokChatResponse> {
  const {
    model = 'grok-4.1',
    messages,
    temperature = 1.0,
    max_tokens,
    stream = false
  } = options;

  const API_URL = 'http://localhost:8000/v1/chat/completions';

  const payload: any = {
    model,
    messages,
    temperature,
    stream
  };

  if (max_tokens) {
    payload.max_tokens = max_tokens;
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Grok API error: ${response.status} ${error}`);
  }

  const data = await response.json();

  if (!data.choices || data.choices.length === 0) {
    throw new Error('No response from Grok API');
  }

  return {
    content: data.choices[0].message.content,
    model: data.model || model,
    usage: data.usage
  };
}

/**
 * Quick helper for simple single-message prompts
 *
 * @example
 * const answer = await chatSimple('What is TypeScript?');
 */
export async function chatSimple(
  prompt: string,
  model: GrokModel = 'grok-4.1'
): Promise<string> {
  const response = await chat({
    model,
    messages: [{ role: 'user', content: prompt }]
  });
  return response.content;
}

/**
 * Chat with thinking model for complex reasoning
 *
 * @example
 * const analysis = await chatThinking(
 *   'Analyze the security implications of this architecture...'
 * );
 */
export async function chatThinking(prompt: string): Promise<string> {
  return chatSimple(prompt, 'grok-4.1-thinking');
}

/**
 * Get available models with their descriptions
 */
export function getAvailableModels(): typeof GROK_MODELS {
  return GROK_MODELS;
}

/**
 * Check if grok2api service is healthy
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch('http://localhost:8000/v1/models');
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Check if grok2api Docker container is running (comprehensive check)
 *
 * This checks:
 * 1. Docker is installed and running
 * 2. grok2api container is running
 * 3. API is responding
 *
 * @throws Error with helpful message if container is not ready
 */
export async function ensureDockerRunning(): Promise<void> {
  const { exec } = await import('child_process');
  const { promisify } = await import('util');
  const execAsync = promisify(exec);

  try {
    // Check if API is responding
    const isHealthy = await checkHealth();
    if (isHealthy) {
      return; // All good!
    }

    // API not responding - check Docker container
    const { stdout } = await execAsync('docker ps --filter "name=grok2api" --format "{{.Names}}"');
    const containerName = stdout.trim();

    if (!containerName) {
      // Container not running - check if it exists but is stopped
      let stoppedName: string | null = null;
      try {
        const { stdout: stoppedContainers } = await execAsync(
          'docker ps -a --filter "name=grok2api" --filter "status=exited" --format "{{.Names}}"'
        );
        stoppedName = stoppedContainers.trim().split('\n')[0] || null;
      } catch {
        // Ignore docker command errors
      }

      if (stoppedName) {
        throw new Error(
          `❌ grok2api container is stopped\n\n` +
          `Start the container:\n` +
          `  docker start ${stoppedName}\n\n` +
          `Then try again.`
        );
      }

      throw new Error(
        `❌ grok2api container is not running\n\n` +
        `Setup grok2api:\n` +
        `  1. Clone repo: git clone https://github.com/chenyme/grok2api ~/grok2api\n` +
        `  2. Start: docker compose -f tools/grok2api/deploy/docker-compose.yml up -d --build\n` +
        `  3. Add tokens via admin: http://localhost:8000 (key: grok2api)\n`
      );
    }

    // Container is running but API not responding
    throw new Error(
      `❌ grok2api container is running but API not responding\n\n` +
      `Container: ${containerName}\n` +
      `Health check: http://localhost:8000/v1/models\n\n` +
      `Troubleshooting:\n` +
      `  1. Check logs: docker logs -f ${containerName}\n` +
      `  2. Restart: docker restart ${containerName}\n` +
      `  3. Verify tokens: Check ~/grok2api-data/token.json\n`
    );

  } catch (error) {
    // If the error is already our custom error, rethrow it
    if (error instanceof Error && error.message.includes('grok2api')) {
      throw error;
    }

    // Docker not running or other system error
    throw new Error(
      `❌ Docker is not running or not installed\n\n` +
      `Install Docker Desktop for WSL2:\n` +
      `  https://docs.docker.com/desktop/install/windows-install/\n\n` +
      `Original error: ${error}`
    );
  }
}

// ─── V2 Functions ──────────────────────────────────────────────────────────

/**
 * Stream chat completion response via SSE
 * Yields chunks as they arrive from the API
 */
export async function* chatStream(
  options: GrokChatOptionsV2
): AsyncGenerator<string, void, undefined> {
  const {
    model = 'grok-4.1',
    messages,
    temperature = 1.0,
    max_tokens,
    reasoning_effort,
    top_p,
  } = options;

  const API_URL = 'http://localhost:8000/v1/chat/completions';

  const payload: Record<string, unknown> = {
    model,
    messages,
    temperature,
    stream: true,
  };

  if (max_tokens) payload.max_tokens = max_tokens;
  if (reasoning_effort) payload.reasoning_effort = reasoning_effort;
  if (top_p !== undefined) payload.top_p = top_p;

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Grok API error: ${response.status} ${error}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const data = line.slice(6).trim();
      if (data === '[DONE]') return;

      try {
        const parsed = JSON.parse(data);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) yield content;
      } catch {
        // Skip malformed SSE chunks
      }
    }
  }
}

/**
 * Chat with explicit reasoning effort control
 *
 * @param prompt - User message
 * @param effort - Reasoning effort level
 * @param model - Model to use (default: grok-4.1-thinking)
 */
export async function chatWithReasoning(
  prompt: string,
  effort: ReasoningEffort = 'medium',
  model: string = 'grok-4.1-thinking',
): Promise<GrokChatResponse> {
  const API_URL = 'http://localhost:8000/v1/chat/completions';

  const payload = {
    model,
    messages: [{ role: 'user', content: prompt }],
    reasoning_effort: effort,
    stream: false,
  };

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Grok API error: ${response.status} ${error}`);
  }

  const data = await response.json();

  if (!data.choices || data.choices.length === 0) {
    throw new Error('No response from Grok API');
  }

  return {
    content: data.choices[0].message.content,
    model: data.model || model,
    usage: data.usage,
  };
}

/**
 * Chat with an image attachment (vision)
 *
 * @param prompt - Text prompt describing what to analyze
 * @param imageUrl - URL of the image to analyze
 * @param model - Model to use (default: grok-4.1-fast)
 */
export async function chatWithImage(
  prompt: string,
  imageUrl: string,
  model: string = 'grok-4.1-fast',
): Promise<GrokChatResponse> {
  const API_URL = 'http://localhost:8000/v1/chat/completions';

  const messages: GrokChatMessageV2[] = [
    {
      role: 'user',
      content: [
        { type: 'text', text: prompt },
        { type: 'image_url', image_url: { url: imageUrl } },
      ],
    },
  ];

  const payload = { model, messages, stream: false };

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Grok API error: ${response.status} ${error}`);
  }

  const data = await response.json();

  if (!data.choices || data.choices.length === 0) {
    throw new Error('No response from Grok API');
  }

  return {
    content: data.choices[0].message.content,
    model: data.model || model,
    usage: data.usage,
  };
}

/**
 * Full multimodal chat with all 4 content types
 * (text, image_url, input_audio, file)
 */
export async function chatMultimodal(
  messages: GrokChatMessageV2[],
  model: string = 'grok-4.1-fast',
): Promise<GrokChatResponse> {
  const API_URL = 'http://localhost:8000/v1/chat/completions';

  const payload = { model, messages, stream: false };

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Grok API error: ${response.status} ${error}`);
  }

  const data = await response.json();

  if (!data.choices || data.choices.length === 0) {
    throw new Error('No response from Grok API');
  }

  return {
    content: data.choices[0].message.content,
    model: data.model || model,
    usage: data.usage,
  };
}

/**
 * Fetch live model list from grok2api Docker service
 */
export async function fetchModels(): Promise<GrokModelInfo[]> {
  const response = await fetch('http://localhost:8000/v1/models');
  if (!response.ok) {
    throw new Error(`Failed to fetch models: ${response.status}`);
  }
  const data: GrokModelsResponse = await response.json();
  return data.data || [];
}
