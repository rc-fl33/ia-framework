#!/usr/bin/env bun
/**
 * Observability Skill - Main Server
 *
 * HTTP + WebSocket server for real-time monitoring dashboard.
 */

import { existsSync, readFileSync, writeFileSync, readdirSync, statSync, mkdirSync } from 'fs';
import { join, dirname, relative, extname, resolve, basename } from 'path';
import { spawnSync } from 'child_process';
import {
  DEFAULT_CONFIG,
  BLOCKED_PATHS,
  isPathPatternAllowed,
  detectFileType,
  getFileIcon,
  type ServerConfig,
  type SessionState,
  type FileNode,
  type HealthResponse,
  type EventsResponse,
  type FileResponse,
  type WriteFileRequest,
  type WriteFileResponse,
  type WSMessage,
} from './types';
import { EventStore } from './events';
import { FileWatcher } from './watcher';
import { validatePath } from '@/tools/framework/security/input-validation';

const startTime = Date.now();
const config: ServerConfig = DEFAULT_CONFIG;
const eventStore = new EventStore(config);
const fileWatcher = new FileWatcher(config);

// WebSocket clients
const wsClients = new Set<{ send: (data: string) => void }>();

// Load events from disk on startup
eventStore.loadFromDisk(1);

// MIME types for static files
const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.ts': 'application/typescript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

/**
 * Check if a path is allowed for reading
 * SECURITY: Prevents path traversal attacks using canonicalization
 */
function isPathAllowedRead(path: string): boolean {
  // Pre-validation: Check for obvious path traversal patterns
  const pathValidation = validatePath(path, true); // allowAbsolute=true since we handle it below
  if (!pathValidation.valid) {
    console.warn(`[SECURITY] Path validation failed: ${pathValidation.error}`);
    return false;
  }

  const normalized = path.replace(/^\//, '');

  // Resolve to absolute path and canonicalize (resolves .. and symlinks)
  const fullPath = join(config.claudeDir, normalized);
  const resolvedPath = resolve(fullPath);

  // SECURITY: Ensure resolved path is still within claudeDir
  if (!resolvedPath.startsWith(resolve(config.claudeDir))) {
    console.warn(`[SECURITY] Path traversal attempt blocked: ${path} -> ${resolvedPath}`);
    return false;
  }

  // Check blocked paths (after canonicalization)
  for (const blocked of BLOCKED_PATHS) {
    const blockedPath = resolve(config.claudeDir, blocked);
    if (resolvedPath === blockedPath || resolvedPath.startsWith(blockedPath + '/')) {
      console.warn(`[SECURITY] Blocked path access attempt: ${path} -> ${resolvedPath}`);
      return false;
    }
  }

  // Check pattern-based allowed paths (after canonicalization)
  const relativePath = relative(resolve(config.claudeDir), resolvedPath);
  if (isPathPatternAllowed(relativePath, 'read')) {
    return true;
  }

  console.warn(`[SECURITY] Unauthorized path access attempt: ${path} -> ${resolvedPath}`);
  return false;
}

/**
 * Check if a path is allowed for writing
 * SECURITY: Prevents path traversal attacks using canonicalization
 */
function isPathAllowedWrite(path: string): boolean {
  // Pre-validation: Check for obvious path traversal patterns
  const pathValidation = validatePath(path, true); // allowAbsolute=true since we handle it below
  if (!pathValidation.valid) {
    console.warn(`[SECURITY] Path validation failed (write): ${pathValidation.error}`);
    return false;
  }

  const normalized = path.replace(/^\//, '');

  // Resolve to absolute path and canonicalize (resolves .. and symlinks)
  const fullPath = join(config.claudeDir, normalized);
  const resolvedPath = resolve(fullPath);

  // SECURITY: Ensure resolved path is still within claudeDir
  if (!resolvedPath.startsWith(resolve(config.claudeDir))) {
    console.warn(`[SECURITY] Path traversal write attempt blocked: ${path} -> ${resolvedPath}`);
    return false;
  }

  // Check blocked paths (after canonicalization)
  for (const blocked of BLOCKED_PATHS) {
    const blockedPath = resolve(config.claudeDir, blocked);
    if (resolvedPath === blockedPath || resolvedPath.startsWith(blockedPath + '/')) {
      console.warn(`[SECURITY] Blocked path write attempt: ${path} -> ${resolvedPath}`);
      return false;
    }
  }

  // Check pattern-based allowed paths (after canonicalization)
  const relativePath = relative(resolve(config.claudeDir), resolvedPath);
  if (isPathPatternAllowed(relativePath, 'write')) {
    return true;
  }

  console.warn(`[SECURITY] Unauthorized path write attempt: ${path} -> ${resolvedPath}`);
  return false;
}

/**
 * Check if a file path is a supported markdown file (.md or .qmd)
 */
function isMarkdownFile(path: string): boolean {
  return path.endsWith('.md') || path.endsWith('.qmd');
}

/**
 * Get the base filename without extension
 */
function getBaseFilename(path: string): string {
  return path.replace(/\.(md|qmd)$/, '');
}

/**
 * Get current session state
 */
function getSessionState(): SessionState | null {
  const currentFile = join(config.claudeDir, 'sessions', '.current');
  if (!existsSync(currentFile)) return null;

  try {
    const sessionId = readFileSync(currentFile, 'utf-8').trim();
    const sessionFile = join(config.claudeDir, 'sessions', `${sessionId}.yaml`);

    if (!existsSync(sessionFile)) return null;

    // Simple YAML parsing
    const content = readFileSync(sessionFile, 'utf-8');
    const state: Partial<SessionState> = { id: sessionId };

    for (const line of content.split('\n')) {
      const match = line.match(/^(\w+):\s*(.+)$/);
      if (match) {
        const [, key, value] = match;
        if (key === 'status' || key === 'date' || key === 'cwd') {
          (state as Record<string, string>)[key] = value.replace(/^["']|["']$/g, '');
        } else if (key === 'startedAt' || key === 'lastActivityAt') {
          (state as Record<string, string>)[key] = value.replace(/^["']|["']$/g, '');
        }
      }
    }

    return state as SessionState;
  } catch (err) {
    console.error('Failed to read session:', err);
    return null;
  }
}

/**
 * Build file tree for a directory
 */
function buildFileTree(dirPath: string, relativePath: string = ''): FileNode[] {
  const nodes: FileNode[] = [];

  try {
    const entries = readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      // Skip hidden files and node_modules
      if (entry.name.startsWith('.') || entry.name === 'node_modules') {
        continue;
      }

      const fullPath = join(dirPath, entry.name);
      const entryRelPath = relativePath ? `${relativePath}/${entry.name}` : entry.name;

      if (entry.isDirectory()) {
        nodes.push({
          name: entry.name,
          path: entryRelPath,
          type: 'directory',
          children: buildFileTree(fullPath, entryRelPath),
        });
      } else {
        try {
          const stats = statSync(fullPath);
          const { fileType } = detectFileType(entry.name);
          nodes.push({
            name: entry.name,
            path: entryRelPath,
            type: 'file',
            fileType,
            modified: stats.mtime.toISOString(),
            size: stats.size,
          });
        } catch (err) {
          // Skip broken symlinks or inaccessible files
          console.warn(`Skipping inaccessible file: ${fullPath}`);
        }
      }
    }
  } catch (err) {
    console.error(`Failed to read directory ${dirPath}:`, err);
  }

  return nodes.sort((a, b) => {
    // Directories first, then alphabetical
    if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

/**
 * Broadcast message to all WebSocket clients
 */
function broadcast(message: WSMessage): void {
  const data = JSON.stringify(message);
  for (const client of wsClients) {
    try {
      client.send(data);
    } catch (err) {
      console.error('WebSocket send error:', err);
      wsClients.delete(client);
    }
  }
}

// Set up file watcher callbacks
fileWatcher.onEvent((event) => {
  if (event.type === 'session_change') {
    broadcast({
      type: 'session_update',
      payload: getSessionState(),
      timestamp: new Date().toISOString(),
    });
  } else {
    broadcast({
      type: 'file_change',
      payload: { path: event.path, modified: event.modified },
      timestamp: new Date().toISOString(),
    });
  }
});

// Start file watchers
fileWatcher.startAll();

// Start server
const server = Bun.serve({
  port: config.port,
  hostname: config.host,

  async fetch(req, server) {
    const url = new URL(req.url);
    const path = url.pathname;

    // WebSocket upgrade
    if (path === '/stream') {
      // SECURITY: Validate origin for WebSocket connections
      const origin = req.headers.get('origin');
      const allowedOrigins = [
        `http://localhost:${config.port}`,
        `http://127.0.0.1:${config.port}`,
      ];

      if (origin && !allowedOrigins.includes(origin)) {
        console.warn(`[SECURITY] WebSocket connection rejected from origin: ${origin}`);
        return new Response('Forbidden', { status: 403 });
      }

      const upgraded = server.upgrade(req);
      if (!upgraded) {
        return new Response('WebSocket upgrade failed', { status: 400 });
      }
      return undefined;
    }

    // API routes
    if (path.startsWith('/api/')) {
      return await handleAPI(req, url);
    }

    // Static files (client)
    return handleStatic(path);
  },

  websocket: {
    open(ws) {
      wsClients.add(ws);
      ws.send(JSON.stringify({
        type: 'connected',
        payload: { session: getSessionState(), events: eventStore.getRecentEvents(50), root: config.claudeDir },
        timestamp: new Date().toISOString(),
      }));
    },
    message(ws, message) {
      try {
        const data = typeof message === 'string' ? JSON.parse(message) : message;
        // Reserved for future WebSocket message handling
      } catch (err) {
        console.error('WebSocket message error:', err);
      }
    },
    close(ws) {
      wsClients.delete(ws);
    },
  },
});

/**
 * Handle API requests
 */
async function handleAPI(req: Request, url: URL): Promise<Response> {
  const path = url.pathname;

  // CORS headers - SECURITY: Restrict to localhost only
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': `http://localhost:${config.port}`,
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  try {
    // GET /api/health
    if (path === '/api/health' && req.method === 'GET') {
      const response: HealthResponse = {
        status: 'ok',
        version: '1.0.0',
        uptime_ms: Date.now() - startTime,
      };
      return new Response(JSON.stringify(response), { headers });
    }

    // GET /api/session
    if (path === '/api/session' && req.method === 'GET') {
      const session = getSessionState();
      return new Response(JSON.stringify(session), { headers });
    }

    // GET /api/events
    if (path === '/api/events' && req.method === 'GET') {
      const since = url.searchParams.get('since');
      const limit = parseInt(url.searchParams.get('limit') || '100');

      const events = since
        ? eventStore.getEventsSince(since)
        : eventStore.getRecentEvents(limit);

      const response: EventsResponse = {
        events,
        total: eventStore.count,
        since: since || undefined,
      };
      return new Response(JSON.stringify(response), { headers });
    }

    // POST /api/events - Receive events from hook
    if (path === '/api/events' && req.method === 'POST') {
      return handleEventPost(req, headers);
    }

    // GET /api/files
    if (path === '/api/files' && req.method === 'GET') {
      const dirPath = url.searchParams.get('path') || '';

      if (!isPathAllowedRead(dirPath)) {
        return new Response(JSON.stringify({ error: 'Path not allowed' }), {
          status: 403,
          headers,
        });
      }

      const fullPath = join(config.claudeDir, dirPath);
      if (!existsSync(fullPath)) {
        return new Response(JSON.stringify({ error: 'Path not found' }), {
          status: 404,
          headers,
        });
      }

      const tree = buildFileTree(fullPath, dirPath);
      return new Response(JSON.stringify(tree), { headers });
    }

    // GET /api/file
    if (path === '/api/file' && req.method === 'GET') {
      const claudeRoot = resolve(config.claudeDir);
      let filePath = url.searchParams.get('path') || '';
      // Normalize absolute paths within framework root to relative
      if (filePath.startsWith(claudeRoot + '/')) {
        filePath = filePath.slice(claudeRoot.length + 1);
      }

      if (!isPathAllowedRead(filePath)) {
        return new Response(JSON.stringify({ error: 'Path not allowed' }), {
          status: 403,
          headers,
        });
      }

      const fullPath = join(config.claudeDir, filePath);
      if (!existsSync(fullPath)) {
        return new Response(JSON.stringify({ error: 'File not found' }), {
          status: 404,
          headers,
        });
      }

      const stats = statSync(fullPath);
      const { fileType, mimeType } = detectFileType(filePath);

      // For PDF and images, return binary data directly
      if (fileType === 'pdf' || fileType === 'image') {
        const content = readFileSync(fullPath);
        return new Response(content, {
          headers: {
            'Content-Type': mimeType,
            'Content-Length': stats.size.toString(),
          },
        });
      }

      // For binary files (video, audio, archives), return metadata only — never read content
      if (fileType === 'binary') {
        const response: FileResponse = {
          path: filePath,
          content: `[Binary file — ${(stats.size / 1024).toFixed(1)} KB, cannot display]`,
          modified: stats.mtime.toISOString(),
          size: stats.size,
          fileType,
          mimeType,
        };
        return new Response(JSON.stringify(response), { headers });
      }

      // For text-based files, return JSON with content
      const content = readFileSync(fullPath, 'utf-8');

      const response: FileResponse = {
        path: filePath,
        content,
        modified: stats.mtime.toISOString(),
        size: stats.size,
        fileType,
        mimeType,
      };
      return new Response(JSON.stringify(response), { headers });
    }

    // POST /api/file
    if (path === '/api/file' && req.method === 'POST') {
      return handleFileWrite(req, headers);
    }

    // DELETE /api/file
    if (path === '/api/file' && req.method === 'DELETE') {
      return handleFileDelete(req, url, headers);
    }

    // DELETE /api/directory
    if (path === '/api/directory' && req.method === 'DELETE') {
      return handleDirectoryDelete(req, url, headers);
    }

    // GET /api/studio/engagements — list private/output/**/* dirs with engagement.yaml
    // Structure: private/output/{skill}/{engagement}/ or private/output/{engagement}/
    if (path === '/api/studio/engagements' && req.method === 'GET') {
      const outputDir = join(config.claudeDir, 'private/output');
      const engagements: { path: string; name: string; skill: string; modified: string }[] = [];
      if (existsSync(outputDir)) {
        try {
          for (const entry of readdirSync(outputDir)) {
            const entryPath = join(outputDir, entry);
            if (!statSync(entryPath).isDirectory()) continue;
            // Check direct child first (flat layout)
            if (existsSync(join(entryPath, 'engagement.yaml'))) {
              const stat = statSync(entryPath);
              engagements.push({ path: entry, name: entry, skill: '', modified: stat.mtime.toISOString() });
              continue;
            }
            // Walk one level deeper (skill/engagement layout)
            for (const sub of readdirSync(entryPath)) {
              const subPath = join(entryPath, sub);
              if (!statSync(subPath).isDirectory()) continue;
              if (existsSync(join(subPath, 'engagement.yaml'))) {
                const stat = statSync(subPath);
                engagements.push({
                  path: `${entry}/${sub}`,
                  name: sub,
                  skill: entry,
                  modified: stat.mtime.toISOString(),
                });
              }
            }
          }
        } catch { /* ignore */ }
      }
      engagements.sort((a, b) => b.modified.localeCompare(a.modified));
      return new Response(JSON.stringify({ engagements }), { headers });
    }

    // GET /api/studio/sections — list sections for an engagement (or single file content)
    if (path === '/api/studio/sections' && req.method === 'GET') {
      const engPath = url.searchParams.get('eng');
      const file = url.searchParams.get('file');
      if (!engPath) {
        return new Response(JSON.stringify({ error: 'Missing eng' }), { status: 400, headers });
      }
      const engDir = join(config.claudeDir, 'private/output', engPath);

      // If file param: return single file content
      if (file) {
        const filePath = join(engDir, file);
        const resolved = resolve(filePath);
        if (!resolved.startsWith(resolve(config.claudeDir))) {
          return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
        }
        const content = existsSync(resolved) ? readFileSync(resolved, 'utf-8') : '';
        return new Response(JSON.stringify({ content }), { headers });
      }

      // List _sections/*.qmd files
      const sectDir = join(engDir, '_sections');
      const sections: { name: string; file: string; excerpt: string }[] = [];
      if (existsSync(sectDir)) {
        for (const f of readdirSync(sectDir).filter(
          f => f.endsWith('.qmd') && f.startsWith('_')
        )) {
          const content = readFileSync(join(sectDir, f), 'utf-8');
          sections.push({
            name: f.replace(/^_/, '').replace(/\.qmd$/, '').replace(/-/g, ' '),
            file: `_sections/${f}`,
            excerpt: content.slice(0, 100).replace(/\n/g, ' '),
          });
        }
      }
      return new Response(JSON.stringify({ sections }), { headers });
    }

    // POST /api/studio/sections/reorder — save section order (advisory)
    if (path === '/api/studio/sections/reorder' && req.method === 'POST') {
      return new Response(JSON.stringify({ ok: true }), { headers });
    }

    // POST /api/studio/sections/write — write a section file
    if (path === '/api/studio/sections/write' && req.method === 'POST') {
      const { engagement, file, content } =
        (await req.json()) as { engagement: string; file: string; content: string };
      if (!engagement || !file) {
        return new Response(JSON.stringify({ error: 'Missing params' }), { status: 400, headers });
      }
      const filePath = join(config.claudeDir, 'private/output', engagement, file);
      const resolved = resolve(filePath);
      if (!resolved.startsWith(resolve(config.claudeDir) + '/')) {
        return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers });
      }
      mkdirSync(dirname(resolved), { recursive: true });
      writeFileSync(resolved, content, 'utf-8');
      return new Response(JSON.stringify({ ok: true }), { headers });
    }

    // POST /api/studio/render — spawn report generator
    if (path === '/api/studio/render' && req.method === 'POST') {
      const { engagement, format = 'html', draft = true } =
        (await req.json()) as { engagement: string; format?: string; draft?: boolean };
      if (!engagement) {
        return new Response(JSON.stringify({ error: 'Missing engagement' }), { status: 400, headers });
      }
      const engYaml = join(config.claudeDir, 'private/output', engagement, 'engagement.yaml');
      if (!existsSync(engYaml)) {
        return new Response(
          JSON.stringify({ error: 'engagement.yaml not found' }), { status: 404, headers }
        );
      }
      const assembler = join(config.claudeDir, 'skills/sec-review/scripts/assemble-report.ts');
      const draftArg = draft ? '--draft' : '--no-draft';
      const result = spawnSync('bun', [assembler, '--engagement', engYaml, '--render', draftArg], {
        cwd: config.claudeDir,
        encoding: 'utf-8',
        timeout: 120000,
      });
      if (result.status !== 0) {
        return new Response(
          JSON.stringify({ ok: false, error: result.stderr }), { status: 500, headers }
        );
      }
      const previewUrl = `/api/studio/preview?eng=${encodeURIComponent(engagement)}`;
      return new Response(JSON.stringify({ ok: true, previewUrl }), { headers });
    }

    // GET /api/studio/preview — serve last rendered HTML
    if (path === '/api/studio/preview' && req.method === 'GET') {
      const engPath = url.searchParams.get('eng');
      if (!engPath) return new Response('Missing eng', { status: 400 });
      const engDir = join(config.claudeDir, 'private/output', engPath);
      let htmlFile: string | null = null;
      if (existsSync(engDir)) {
        for (const f of readdirSync(engDir)) {
          if (f.endsWith('.html') && !f.includes('finding-report')) { htmlFile = f; break; }
        }
      }
      if (!htmlFile) {
        return new Response(
          '<html><body style="font-family:sans-serif;padding:2rem;color:#888">' +
          '<p>No rendered report found. Click Render to generate.</p></body></html>',
          { headers: { 'Content-Type': 'text/html' } }
        );
      }
      const content = readFileSync(join(engDir, htmlFile));
      return new Response(content, { headers: { 'Content-Type': 'text/html' } });
    }

    // 404 for unknown API routes
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers,
    });
  } catch (err) {
    console.error('API error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers,
    });
  }
}

/**
 * Handle event POST request from hook
 */
async function handleEventPost(req: Request, headers: Record<string, string>): Promise<Response> {
  try {
    const event = (await req.json()) as ToolEvent;

    // Validate required fields
    if (!event.timestamp || !event.tool) {
      return new Response(JSON.stringify({ error: 'Invalid event - missing timestamp or tool' }), {
        status: 400,
        headers,
      });
    }

    // Add to in-memory buffer
    eventStore.addEvent(event);

    // Broadcast immediately to WebSocket clients
    broadcast({
      type: 'event',
      payload: event,
      timestamp: new Date().toISOString(),
    });

    return new Response(JSON.stringify({ success: true }), { headers });
  } catch (err) {
    console.error('Event POST error:', err);
    return new Response(JSON.stringify({ error: 'Failed to process event' }), {
      status: 500,
      headers,
    });
  }
}

/**
 * Handle file write request
 */
async function handleFileWrite(req: Request, headers: Record<string, string>): Promise<Response> {
  try {
    const body = (await req.json()) as WriteFileRequest;
    const { path: filePath, content, expectedModified } = body;

    if (!isPathAllowedWrite(filePath)) {
      return new Response(JSON.stringify({ error: 'Path not allowed for writing' }), {
        status: 403,
        headers,
      });
    }

    const fullPath = join(config.claudeDir, filePath);

    // Check for conflict
    if (expectedModified && existsSync(fullPath)) {
      const stats = statSync(fullPath);
      if (stats.mtime.toISOString() !== expectedModified) {
        const response: WriteFileResponse = {
          success: false,
          path: filePath,
          modified: stats.mtime.toISOString(),
          conflict: true,
        };
        return new Response(JSON.stringify(response), { status: 409, headers });
      }
    }

    // Ensure directory exists
    const dir = dirname(fullPath);
    if (!existsSync(dir)) {
      const { mkdirSync } = await import('fs');
      mkdirSync(dir, { recursive: true });
    }

    // Write file
    writeFileSync(fullPath, content, 'utf-8');
    const stats = statSync(fullPath);

    const response: WriteFileResponse = {
      success: true,
      path: filePath,
      modified: stats.mtime.toISOString(),
    };
    return new Response(JSON.stringify(response), { headers });
  } catch (err) {
    console.error('File write error:', err);
    return new Response(JSON.stringify({ error: 'Failed to write file' }), {
      status: 500,
      headers,
    });
  }
}

/**
 * Handle file delete request
 */
async function handleFileDelete(req: Request, url: URL, headers: Record<string, string>): Promise<Response> {
  try {
    const filePath = url.searchParams.get('path') || '';

    if (!isPathAllowedWrite(filePath)) {
      return new Response(JSON.stringify({ error: 'Path not allowed for deletion' }), {
        status: 403,
        headers,
      });
    }

    const fullPath = join(config.claudeDir, filePath);
    if (!existsSync(fullPath)) {
      return new Response(JSON.stringify({ error: 'File not found' }), {
        status: 404,
        headers,
      });
    }

    // Delete the file
    const { unlinkSync } = await import('fs');
    unlinkSync(fullPath);

    return new Response(JSON.stringify({
      success: true,
      path: filePath,
      message: 'File deleted successfully',
    }), { headers });
  } catch (err) {
    console.error('File delete error:', err);
    return new Response(JSON.stringify({ error: 'Failed to delete file' }), {
      status: 500,
      headers,
    });
  }
}

/**
 * Handle directory delete request
 */
async function handleDirectoryDelete(req: Request, url: URL, headers: Record<string, string>): Promise<Response> {
  try {
    const dirPath = url.searchParams.get('path') || '';

    if (!isPathAllowedWrite(dirPath)) {
      return new Response(JSON.stringify({ error: 'Path not allowed for deletion' }), {
        status: 403,
        headers,
      });
    }

    const fullPath = join(config.claudeDir, dirPath);
    if (!existsSync(fullPath)) {
      return new Response(JSON.stringify({ error: 'Directory not found' }), {
        status: 404,
        headers,
      });
    }

    const stats = statSync(fullPath);
    if (!stats.isDirectory()) {
      return new Response(JSON.stringify({ error: 'Path is not a directory' }), {
        status: 400,
        headers,
      });
    }

    // Delete the directory recursively
    const { rmSync } = await import('fs');
    rmSync(fullPath, { recursive: true, force: true });

    return new Response(JSON.stringify({
      success: true,
      path: dirPath,
      message: 'Directory deleted successfully',
    }), { headers });
  } catch (err) {
    console.error('Directory delete error:', err);
    return new Response(JSON.stringify({ error: 'Failed to delete directory' }), {
      status: 500,
      headers,
    });
  }
}
/**
 * Handle static file requests (client files)
 */
function handleStatic(path: string): Response {
  // Default to index.html
  if (path === '/') {
    path = '/index.html';
  }

  const clientDir = join(dirname(import.meta.path), '..', 'client');
  const filePath = join(clientDir, path);

  if (!existsSync(filePath)) {
    // Try index.html for SPA routing
    const indexPath = join(clientDir, 'index.html');
    if (existsSync(indexPath)) {
      const content = readFileSync(indexPath, 'utf-8');
      return new Response(content, {
        headers: { 'Content-Type': 'text/html' },
      });
    }
    return new Response('Not found', { status: 404 });
  }

  const ext = extname(filePath);
  const mimeType = MIME_TYPES[ext] || 'application/octet-stream';
  const content = readFileSync(filePath);

  return new Response(content, {
    headers: {
      'Content-Type': mimeType,
      'Cache-Control': 'no-store',
    },
  });
}

console.log(`
╔══════════════════════════════════════════════════════════╗
║         IA Framework Observability Server                ║
╠══════════════════════════════════════════════════════════╣
║  Dashboard:  http://localhost:${config.port}                      ║
║  API:        http://localhost:${config.port}/api/health           ║
║  WebSocket:  ws://localhost:${config.port}/stream                 ║
╠══════════════════════════════════════════════════════════╣
║  Press Ctrl+C to stop                                    ║
╚══════════════════════════════════════════════════════════╝
`);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down...');
  fileWatcher.stopAll();
  server.stop();
  process.exit(0);
});

process.on('SIGTERM', () => {
  fileWatcher.stopAll();
  server.stop();
  process.exit(0);
});
