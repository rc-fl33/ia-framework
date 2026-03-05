#!/usr/bin/env bun
/**
 * Observability Event Capture Hook
 *
 * PostToolUse hook that captures tool events and sends via HTTP POST to monitor server.
 * Design: Fire-and-forget with 500ms timeout - silent failure if server not running.
 */

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

// Framework root - uses IA_FRAMEWORK_ROOT env variable or self-discovers from script location
const FRAMEWORK_ROOT = process.env.IA_FRAMEWORK_ROOT || join(import.meta.dir, '..', '..', '..', '..');
const SESSIONS_DIR = join(FRAMEWORK_ROOT, 'sessions');

// Monitor server endpoint
const MONITOR_SERVER_URL = `http://localhost:${process.env.MONITOR_PORT || '4747'}/api/events`;

interface PostToolUseInput {
  tool_name: string;
  tool_input: Record<string, unknown>;
  tool_result?: unknown;
  duration_ms?: number;
  [key: string]: unknown;
}

interface ToolEvent {
  timestamp: string;
  sessionId: string;
  tool: string;
  duration_ms?: number;
  file_path?: string;
  command?: string;
  context?: string; // Additional context about the operation
  success: boolean;
}

function getCurrentSessionId(): string {
  const currentFile = join(SESSIONS_DIR, '.current');
  try {
    if (existsSync(currentFile)) {
      return readFileSync(currentFile, 'utf-8').trim();
    }
  } catch {
    // Ignore errors
  }
  return 'unknown';
}

function extractFilePath(toolInput: Record<string, unknown>): string | undefined {
  // Handle Read, Write, Edit tools
  if (toolInput.file_path && typeof toolInput.file_path === 'string') {
    return toolInput.file_path;
  }
  // Handle Glob tool
  if (toolInput.pattern && typeof toolInput.pattern === 'string') {
    return `glob:${toolInput.pattern}`;
  }
  return undefined;
}

function extractCommand(toolInput: Record<string, unknown>): string | undefined {
  // Handle Bash tool - truncate to first 100 chars
  if (toolInput.command && typeof toolInput.command === 'string') {
    const cmd = toolInput.command;
    return cmd.length > 100 ? cmd.slice(0, 100) + '...' : cmd;
  }
  return undefined;
}

function extractContext(toolName: string, toolInput: Record<string, unknown>): string | undefined {
  try {
    switch (toolName) {
      case 'Edit':
        // Show what's being changed
        if (toolInput.old_string && typeof toolInput.old_string === 'string') {
          const snippet = toolInput.old_string.slice(0, 80);
          const preview = snippet.includes('\n') ? snippet.split('\n')[0] : snippet;
          return `Replacing: ${preview}${toolInput.old_string.length > 80 ? '...' : ''}`;
        }
        break;

      case 'Write':
        // Show content size
        if (toolInput.content && typeof toolInput.content === 'string') {
          const lines = toolInput.content.split('\n').length;
          const chars = toolInput.content.length;
          return `${lines} lines, ${chars} chars`;
        }
        break;

      case 'Read':
        // Show if limited read
        if (toolInput.limit || toolInput.offset) {
          const limit = toolInput.limit || 'all';
          const offset = toolInput.offset || 0;
          return `Lines ${offset}-${offset + (typeof limit === 'number' ? limit : 0)}`;
        }
        break;

      case 'Grep':
        // Show search pattern
        if (toolInput.pattern && typeof toolInput.pattern === 'string') {
          return `Pattern: ${toolInput.pattern.slice(0, 60)}`;
        }
        break;

      case 'Glob':
        // Already handled in file_path as "glob:pattern"
        if (toolInput.path && typeof toolInput.path === 'string') {
          return `In: ${toolInput.path}`;
        }
        break;

      case 'Task':
        // Show task description
        if (toolInput.description && typeof toolInput.description === 'string') {
          return toolInput.description.slice(0, 80);
        }
        break;

      case 'Bash':
        // Show description if provided
        if (toolInput.description && typeof toolInput.description === 'string') {
          return toolInput.description.slice(0, 80);
        }
        break;

      case 'TodoWrite':
        // Show todo count and status
        if (toolInput.todos && Array.isArray(toolInput.todos)) {
          const count = toolInput.todos.length;
          const statuses = toolInput.todos.reduce((acc: Record<string, number>, todo: any) => {
            const status = todo.status || 'unknown';
            acc[status] = (acc[status] || 0) + 1;
            return acc;
          }, {});
          const summary = Object.entries(statuses)
            .map(([status, count]) => `${count} ${status}`)
            .join(', ');
          return `${count} todos: ${summary}`;
        }
        break;

      case 'WebSearch':
        // Show search query
        if (toolInput.query && typeof toolInput.query === 'string') {
          return `Query: "${toolInput.query.slice(0, 60)}${toolInput.query.length > 60 ? '...' : ''}"`;
        }
        break;

      case 'WebFetch':
        // Show URL
        if (toolInput.url && typeof toolInput.url === 'string') {
          return `URL: ${toolInput.url.slice(0, 60)}${toolInput.url.length > 60 ? '...' : ''}`;
        }
        break;

      case 'AskUserQuestion':
        // Show question count
        if (toolInput.questions && Array.isArray(toolInput.questions)) {
          const count = toolInput.questions.length;
          return `${count} question${count !== 1 ? 's' : ''}`;
        }
        break;
    }
  } catch {
    // Ignore extraction errors
  }
  return undefined;
}

async function main() {
  try {
    // Read input from stdin
    const input = await Bun.stdin.text();
    if (!input.trim()) process.exit(0);

    const data = JSON.parse(input) as PostToolUseInput;

    // Build event
    const event: ToolEvent = {
      timestamp: new Date().toISOString(),
      sessionId: getCurrentSessionId(),
      tool: data.tool_name,
      duration_ms: data.duration_ms,
      file_path: extractFilePath(data.tool_input),
      command: extractCommand(data.tool_input),
      context: extractContext(data.tool_name, data.tool_input),
      success: true, // PostToolUse only fires on success
    };

    // Send to monitor server (fire-and-forget)
    await fetch(MONITOR_SERVER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
      signal: AbortSignal.timeout(500), // 500ms timeout
    }).catch(() => {
      // Silent failure - server not running is okay
    });

    // IMPORTANT: Always produce output (even if minimal) to avoid empty text blocks
    // This prevents API errors from empty content blocks when hook output is aggregated
    // Comment format allows hooks to output without adding visible content to user
    console.log('<!-- observe: event captured -->');

    process.exit(0);
  } catch (err) {
    // Fire and forget - don't block Claude on errors
    // Still output minimal content to avoid empty text blocks
    console.log('<!-- observe: skipped -->');
    process.exit(0);
  }
}

main();
