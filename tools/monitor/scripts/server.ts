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
import { exportToHtml, exportToQuartoPdf } from './export-pdf';
import { exportToDocx } from './export-docx';
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

  fetch(req, server) {
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
      return handleAPI(req, url);
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
function handleAPI(req: Request, url: URL): Response {
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

    // POST /api/export-docx
    if (path === '/api/export-docx' && req.method === 'POST') {
      return handleDocxExport(req, headers);
    }

    // POST /api/download-pdf (returns binary for browser Save As)
    if (path === '/api/download-pdf' && req.method === 'POST') {
      return handlePdfDownload(req);
    }

    // POST /api/download-html (returns branded HTML for browser Save As)
    if (path === '/api/download-html' && req.method === 'POST') {
      return handleHtmlDownload(req);
    }

    // POST /api/download-docx (returns binary for browser Save As)
    if (path === '/api/download-docx' && req.method === 'POST') {
      return handleDocxDownload(req);
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
 * Handle Word (DOCX) export request
 */
async function handleDocxExport(req: Request, headers: Record<string, string>): Promise<Response> {
  try {
    const body = await req.json() as { path: string };
    const filePath = body.path;

    if (!filePath || !isMarkdownFile(filePath)) {
      return new Response(JSON.stringify({ error: 'Invalid file path - must be a markdown file (.md or .qmd)' }), {
        status: 400,
        headers,
      });
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

    // Export to DOCX
    const result = await exportToDocx({
      filePath,
      claudeDir: config.claudeDir,
    });

    if (result.success) {
      return new Response(JSON.stringify({
        success: true,
        docxPath: result.docxPath,
        message: `Word document exported to ${result.docxPath}`,
      }), { headers });
    } else {
      return new Response(JSON.stringify({
        success: false,
        error: result.error,
      }), {
        status: 500,
        headers,
      });
    }
  } catch (err) {
    console.error('DOCX export error:', err);
    return new Response(JSON.stringify({ error: 'Failed to export Word document' }), {
      status: 500,
      headers,
    });
  }
}

/**
 * Handle PDF download request — streams binary to browser for Save As
 */
async function handlePdfDownload(req: Request): Promise<Response> {
  try {
    const body = await req.json() as { path: string };
    const filePath = body.path;

    if (!filePath || !isMarkdownFile(filePath)) {
      return new Response(JSON.stringify({ error: 'Invalid file path - must be a markdown file (.md or .qmd)' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!isPathAllowedRead(filePath)) {
      return new Response(JSON.stringify({ error: 'Path not allowed' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const result = await exportToQuartoPdf({ filePath, claudeDir: config.claudeDir, returnBuffer: true });

    if (!result.success || !result.buffer) {
      return new Response(JSON.stringify({ error: result.error || 'Export failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const filename = getBaseFilename(filePath.split('/').pop()!) + '.pdf';
    return new Response(result.buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error('PDF download error:', err);
    return new Response(JSON.stringify({ error: 'Failed to generate PDF' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * Detect skill type from file path
 * Returns: 'code-review' | 'sec-review' | 'pentest' | 'advisory' | 'test-plan' | null
 */
function detectSkillFromPath(filePath: string): string | null {
  const path = filePath.toLowerCase();
  if (path.includes('/output/code-review/')) return 'code-review';
  if (path.includes('/output/sec-review/')) return 'sec-review';
  if (path.includes('/output/pentest/')) return 'pentest';
  if (path.includes('/output/advisory/')) return 'advisory';
  if (path.includes('/output/test-plan/')) return 'test-plan';
  if (path.includes('/output/gap-analysis/')) return 'gap-analysis';
  if (path.includes('/output/vuln-scan/')) return 'vuln-scan';
  if (path.includes('/output/seg-test/')) return 'seg-test';
  if (path.includes('/output/risk-assess/')) return 'risk-assess';
  if (path.includes('/output/incident/')) return 'incident';
  return null;
}

/**
 * Check if path is a finding directory (contains finding.md or FINDING-XXX.md)
 */
function isFindingDirectory(filePath: string): { isFinding: boolean; findingDir: string } {
  // Check for finding.md in directory
  if (filePath.includes('/findings/')) {
    const parts = filePath.split('/findings/');
    if (parts[1]) {
      const findingId = parts[1].split('/')[0];
      if (findingId && (findingId.startsWith('F') || findingId.startsWith('FINDING'))) {
        const findingDir = join(dirname(filePath), 'findings', findingId);
        if (existsSync(join(findingDir, 'finding.md')) || existsSync(join(findingDir, 'FINDING-001.md'))) {
          return { isFinding: true, findingDir };
        }
      }
    }
  }
  return { isFinding: false, findingDir: '' };
}

/**
 * Handle HTML download request — streams branded HTML to browser for Save As
 * Routes to skill-specific bridge script for findings
 */
async function handleHtmlDownload(req: Request): Promise<Response> {
  try {
    const body = await req.json() as { path: string };
    const filePath = body.path;

    if (!filePath) {
      return new Response(JSON.stringify({ error: 'Invalid file path' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!isPathAllowedRead(filePath)) {
      return new Response(JSON.stringify({ error: 'Path not allowed' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const claudeDir = config.claudeDir;
    const skill = detectSkillFromPath(filePath);
    const { isFinding, findingDir } = isFindingDirectory(filePath);

    // If in a findings directory with a skill, use the skill-specific bridge
    // OR if it's a report file from a skill that has a bridge script
    const reportSkills = ['code-review', 'sec-review', 'pentest', 'advisory', 'test-plan', 'risk-assess', 'gap-analysis', 'seg-test', 'vuln-scan', 'incident'];
    const isReportFile = filePath.includes('/output/') && (
      filePath.endsWith('/FULL-REPORT.md') ||
      filePath.endsWith('/EXECUTIVE-SUMMARY.md') ||
      filePath.endsWith('/TEST-PLAN.md') ||
      filePath.endsWith('/INCIDENT-REPORT.md')
    );

    if (skill && (isFinding || (isReportFile && reportSkills.includes(skill)))) {
      console.log(`[HTML Export] Using ${skill} bridge for: ${isFinding ? findingDir : outDir}`);

      const bridgeScripts: Record<string, string> = {
        'code-review': 'skills/code-review/scripts/markdown-bridge.ts',
        'sec-review': 'skills/sec-review/scripts/markdown-bridge.ts',
        'pentest': 'skills/pentest/scripts/markdown-bridge.ts',
        'advisory': 'skills/advisory/scripts/markdown-bridge.ts',
        'test-plan': 'skills/test-plan/scripts/markdown-bridge.ts',
        'risk-assess': 'skills/risk-assess/scripts/markdown-bridge.ts',
        'gap-analysis': 'skills/gap-analysis/scripts/markdown-bridge.ts',
        'seg-test': 'skills/seg-test/scripts/markdown-bridge.ts',
        'vuln-scan': 'skills/vuln-scan/scripts/markdown-bridge.ts',
        'incident': 'skills/incident/scripts/markdown-bridge.ts',
      };

      const bridgeScript = bridgeScripts[skill];
      if (!bridgeScript) {
        return new Response(JSON.stringify({ error: `No bridge script for skill: ${skill}` }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // For non-finding report files, run the bridge on the output directory
      const targetDir = isFinding ? findingDir : outDir;

      // Run the bridge script
      const args = isFinding
        ? ['--finding', targetDir]
        : ['--output-dir', targetDir];

      const result = spawnSync('bun', [
        'run',
        join(claudeDir, bridgeScript),
        ...args,
      ], {
        cwd: claudeDir,
        stdio: 'pipe',
      });

      if (result.status !== 0) {
        const errorMsg = result.stderr?.toString() || result.stdout?.toString() || 'Bridge script failed';
        console.error(`[HTML Export] Bridge error: ${errorMsg}`);
        // Fall back to generic export
      } else {
        // Check for generated HTML file
        const htmlFile = isFinding
          ? join(targetDir, 'finding-report.html')
          : join(targetDir, `${skill}-report.html`);
        if (existsSync(htmlFile)) {
          const buffer = readFileSync(htmlFile);
          const filename = basename(htmlFile);
          return new Response(buffer, {
            headers: {
              'Content-Type': 'text/html',
              'Content-Disposition': `attachment; filename="${filename}"`,
            },
          });
        }
      }
    }

    // Fall back to generic export for non-finding files or if bridge failed
    if (!isMarkdownFile(filePath)) {
      return new Response(JSON.stringify({ error: 'Invalid file path - must be a markdown file (.md or .qmd)' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const result = await exportToHtml({ filePath, claudeDir, returnBuffer: true });

    if (!result.success || !result.buffer) {
      return new Response(JSON.stringify({ error: result.error || 'Export failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const filename = getBaseFilename(filePath.split('/').pop()!) + '.html';
    return new Response(result.buffer, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error('HTML download error:', err);
    return new Response(JSON.stringify({ error: 'Failed to generate HTML' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * Handle DOCX download request — streams binary to browser for Save As
 */
async function handleDocxDownload(req: Request): Promise<Response> {
  try {
    const body = await req.json() as { path: string };
    const filePath = body.path;

    if (!filePath || !isMarkdownFile(filePath)) {
      return new Response(JSON.stringify({ error: 'Invalid file path - must be a markdown file (.md or .qmd)' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!isPathAllowedRead(filePath)) {
      return new Response(JSON.stringify({ error: 'Path not allowed' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const result = await exportToDocx({ filePath, claudeDir: config.claudeDir, returnBuffer: true });

    if (!result.success || !result.buffer) {
      return new Response(JSON.stringify({ error: result.error || 'Export failed' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const filename = getBaseFilename(filePath.split('/').pop()!) + '.docx';
    return new Response(result.buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error('DOCX download error:', err);
    return new Response(JSON.stringify({ error: 'Failed to generate Word document' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
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
