#!/usr/bin/env bun
/**
 * Anthropic → OpenAI Proxy
 *
 * Converts Claude Code's Anthropic API format to OpenAI format,
 * forwards to grok2api (localhost:8000), converts responses back.
 *
 * Usage:
 *   bun tools/grok2api/scripts/anthropic-proxy.ts
 *
 * Env:
 *   GROK2API_URL   grok2api base URL (default: http://localhost:8000)
 *   PORT           proxy listen port  (default: 3001)
 */

import { serve } from 'bun';

const GROK2API_URL = process.env.GROK2API_URL ?? 'http://localhost:8000';
const PORT = parseInt(process.env.PORT ?? '3001');

// ─── Format Converters ────────────────────────────────────────────────────────

function contentToString(content: unknown): string {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return (content as Array<{ type: string; text?: string }>)
      .filter(b => b.type === 'text')
      .map(b => b.text ?? '')
      .join('');
  }
  return '';
}

function buildOpenAiMessages(
  system: string | undefined,
  messages: Array<{ role: string; content: unknown }>,
): Array<{ role: string; content: string }> {
  const result: Array<{ role: string; content: string }> = [];
  if (system) result.push({ role: 'system', content: system });
  for (const msg of messages) {
    result.push({ role: msg.role, content: contentToString(msg.content) });
  }
  return result;
}

function toStopReason(reason: string | null): string {
  if (reason === 'length') return 'max_tokens';
  if (reason === 'tool_calls') return 'tool_use';
  return 'end_turn';
}

function toAnthropicTools(tools: Array<Record<string, unknown>>) {
  return tools.map(t => ({
    type: 'function',
    function: {
      name: t['name'],
      description: t['description'],
      parameters: t['input_schema'],
    },
  }));
}

// ─── Streaming ────────────────────────────────────────────────────────────────

function sse(event: string, data: unknown): string {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

async function streamProxy(
  upstream: Response,
  model: string,
): Promise<Response> {
  const msgId = `msg_${Date.now()}`;
  const encoder = new TextEncoder();
  let started = false;

  const readable = new ReadableStream({
    async start(controller) {
      const reader = upstream.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      const emit = (chunk: string) => controller.enqueue(encoder.encode(chunk));

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const raw = line.slice(6).trim();
            if (raw === '[DONE]') continue;

            let chunk: Record<string, unknown>;
            try { chunk = JSON.parse(raw); } catch { continue; }

            const choice = (chunk['choices'] as Array<Record<string, unknown>>)?.[0];
            if (!choice) continue;
            const delta = choice['delta'] as Record<string, unknown> | undefined;
            const finishReason = choice['finish_reason'] as string | null;
            const usage = chunk['usage'] as Record<string, number> | undefined;

            if (!started) {
              emit(sse('message_start', {
                type: 'message_start',
                message: {
                  id: msgId, type: 'message', role: 'assistant',
                  content: [], model, stop_reason: null, stop_sequence: null,
                  usage: { input_tokens: usage?.['prompt_tokens'] ?? 0, output_tokens: 0 },
                },
              }));
              emit(sse('content_block_start', { type: 'content_block_start', index: 0, content_block: { type: 'text', text: '' } }));
              emit(sse('ping', { type: 'ping' }));
              started = true;
            }

            if (delta?.['content']) {
              emit(sse('content_block_delta', {
                type: 'content_block_delta', index: 0,
                delta: { type: 'text_delta', text: delta['content'] },
              }));
            }

            if (finishReason) {
              emit(sse('content_block_stop', { type: 'content_block_stop', index: 0 }));
              emit(sse('message_delta', {
                type: 'message_delta',
                delta: { stop_reason: toStopReason(finishReason), stop_sequence: null },
                usage: { output_tokens: usage?.['completion_tokens'] ?? 0 },
              }));
              emit(sse('message_stop', { type: 'message_stop' }));
            }
          }
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' },
  });
}

// ─── Handlers ─────────────────────────────────────────────────────────────────

async function handleMessages(req: Request): Promise<Response> {
  const body = await req.json() as Record<string, unknown>;
  const {
    model, messages, system, max_tokens,
    stream = false, tools,
  } = body as {
    model: string;
    messages: Array<{ role: string; content: unknown }>;
    system?: string;
    max_tokens?: number;
    stream?: boolean;
    tools?: Array<Record<string, unknown>>;
  };

  const payload: Record<string, unknown> = {
    model,
    messages: buildOpenAiMessages(system, messages),
    max_tokens: max_tokens ?? 8192,
    stream,
  };
  if (tools?.length) payload['tools'] = toAnthropicTools(tools);

  const upstream = await fetch(`${GROK2API_URL}/v1/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer grok2api' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(300_000),
  });

  if (!upstream.ok) {
    const err = await upstream.text();
    return Response.json(
      { type: 'error', error: { type: 'api_error', message: err } },
      { status: upstream.status },
    );
  }

  if (stream) return streamProxy(upstream, model);

  const data = await upstream.json() as Record<string, unknown>;
  const choices = data['choices'] as Array<Record<string, unknown>>;
  const choice = choices?.[0];
  const message = choice?.['message'] as Record<string, unknown> | undefined;
  const usage = data['usage'] as Record<string, number> | undefined;

  return Response.json({
    id: `msg_${Date.now()}`,
    type: 'message',
    role: 'assistant',
    content: [{ type: 'text', text: message?.['content'] ?? '' }],
    model,
    stop_reason: toStopReason(choice?.['finish_reason'] as string | null),
    stop_sequence: null,
    usage: {
      input_tokens: usage?.['prompt_tokens'] ?? 0,
      output_tokens: usage?.['completion_tokens'] ?? 0,
    },
  });
}

async function handleModels(): Promise<Response> {
  const upstream = await fetch(`${GROK2API_URL}/v1/models`, {
    signal: AbortSignal.timeout(5000),
  });
  return new Response(await upstream.text(), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// ─── Server ───────────────────────────────────────────────────────────────────

serve({
  port: PORT,
  async fetch(req) {
    const { pathname } = new URL(req.url);

    if (req.method === 'POST' && pathname === '/v1/messages') return handleMessages(req);
    if (req.method === 'GET' && pathname === '/v1/models') return handleModels();

    return new Response('Not found', { status: 404 });
  },
});

console.log(`Anthropic proxy listening on http://localhost:${PORT}`);
console.log(`Forwarding to: ${GROK2API_URL}`);
