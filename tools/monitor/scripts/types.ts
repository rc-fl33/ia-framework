/**
 * Observability Skill - Type Definitions
 */

import { dirname, resolve, join } from 'path';

// Tool event captured by hooks
export interface ToolEvent {
  timestamp: string;
  sessionId: string;
  tool: string;
  duration_ms?: number;
  file_path?: string;
  command?: string;
  context?: string; // Additional context about the operation
  success: boolean;
  agent?: string;
}

// Session state from sessions/*.yaml
export interface SessionState {
  id: string;
  claudeSessionId?: string;
  date: string;
  startedAt: string;
  lastActivityAt: string;
  status: 'active' | 'completed';
  cwd: string;
  filesRead: string[];
  filesModified: string[];
  gitCommits: string[];
  toolCalls: Record<string, number>;
}

// WebSocket message types
export type WSMessageType =
  | 'event'           // New tool event
  | 'file_change'     // File modified
  | 'session_update'  // Session state changed
  | 'connected';      // Initial connection

export interface WSMessage {
  type: WSMessageType;
  payload: unknown;
  timestamp: string;
}

// File types
export type FileType = 'markdown' | 'mermaid' | 'text' | 'code' | 'json' | 'pdf' | 'image' | 'binary' | 'unknown';

// File tree node
export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  fileType?: FileType;
  children?: FileNode[];
  modified?: string;
  size?: number;
}

// API response types
export interface HealthResponse {
  status: 'ok' | 'error';
  version: string;
  uptime_ms: number;
}

export interface EventsResponse {
  events: ToolEvent[];
  total: number;
  since?: string;
}

export interface FileResponse {
  path: string;
  content: string;
  modified: string;
  size: number;
  fileType: FileType;
  mimeType: string;
}

export interface WriteFileRequest {
  path: string;
  content: string;
  expectedModified?: string; // For conflict detection
}

export interface WriteFileResponse {
  success: boolean;
  path: string;
  modified: string;
  conflict?: boolean;
}

// Allowed directory paths for file operations
export const ALLOWED_READ_DIRECTORIES = [
  'sessions',
  'plans',
  'skills',
  'agents',
  'commands',
  'docs',
  'tools',
  'hooks',
  'library',
  'methodologies',
  'private',
  'logs',
  'standards',
];

export const ALLOWED_WRITE_DIRECTORIES = [
  'sessions',
  'plans',
  'skills',
  'agents',
  'commands',
  'docs',
  'tools',
  'hooks',
  'library',
  'methodologies',
  'private',
  'standards',
];

// Allowed file patterns at framework root (no subdirectories)
// Pattern: Files matching these extensions at root are automatically allowed
export const ALLOWED_ROOT_FILE_EXTENSIONS = {
  read: [
    '.md', '.qmd', '.mmd', '.mermaid', '.pdf', '.docx', '.txt',  // Documentation & diagrams
    '.json', '.yaml', '.yml', '.toml',                   // Configuration
    '.lock', '.gitignore', '.gitattributes',              // Development
  ],
  write: ['.pdf', '.docx', '.mmd', '.mermaid'], // Allow writing diagrams and generated files
};

// Allowed specific filenames at root (files without extensions)
export const ALLOWED_ROOT_FILENAMES = {
  read: ['LICENSE', 'CODEOWNERS', 'Makefile', 'Dockerfile', 'Procfile'],
  write: [] as string[], // No specific filenames allowed for write
};

// Only block truly sensitive paths
export const BLOCKED_PATHS = [
  '.env',
  '.git',
];

/**
 * Check if a path matches allowed patterns
 * Returns true if path is within allowed directories OR matches root file patterns
 */
export function isPathPatternAllowed(path: string, mode: 'read' | 'write'): boolean {
  // Remove leading slash
  const normalized = path.replace(/^\//, '');

  // Allow listing root directory (empty path) for read mode
  if (normalized === '' && mode === 'read') {
    return true;
  }

  // Check if it's within allowed directories (check this FIRST before file patterns)
  const directories = mode === 'read' ? ALLOWED_READ_DIRECTORIES : ALLOWED_WRITE_DIRECTORIES;
  const isDirectory = directories.some(dir => normalized === dir || normalized.startsWith(dir + '/'));
  if (isDirectory) {
    return true;
  }

  // Check if it's a root-level file (no slashes in path)
  // Only check file patterns if it's NOT already matched as a directory
  if (!normalized.includes('/')) {
    const allowedExtensions = ALLOWED_ROOT_FILE_EXTENSIONS[mode];
    const allowedFilenames = ALLOWED_ROOT_FILENAMES[mode];

    // Check by extension
    const matchesExtension = allowedExtensions.some(ext => normalized.toLowerCase().endsWith(ext));
    // Check by exact filename
    const matchesFilename = allowedFilenames.some(name => normalized === name);

    return matchesExtension || matchesFilename;
  }

  return false;
}

// Server configuration
export interface ServerConfig {
  port: number;
  host: string;
  claudeDir: string;
  eventsDir: string;
  maxEvents: number;
  watchDebounceMs: number;
}

// Calculate tool directory relative to this file (scripts/types.ts -> tool root)
const SCRIPT_DIR = dirname(Bun.main || import.meta.path);
const TOOL_DIR = resolve(SCRIPT_DIR, '..');

/**
 * Resolve the framework root directory
 * Priority:
 * 1. IA_FRAMEWORK_ROOT environment variable
 * 2. Self-discover from script location via import.meta.dir
 */
function resolveFrameworkRoot(): string {
  // Check environment variable
  if (process.env.IA_FRAMEWORK_ROOT) {
    return process.env.IA_FRAMEWORK_ROOT;
  }

  // Fall back to self-discovery from script location (scripts/types.ts -> tools/monitor/scripts -> repo root)
  return resolve(import.meta.dir, '..', '..', '..');
}

// Events stored outside any git repo to prevent accidental credential exposure
const MONITOR_DATA_DIR = process.env.IA_MONITOR_DATA_DIR
  || join(process.env.HOME!, '.local', 'share', 'ia-monitor');

export const DEFAULT_CONFIG: ServerConfig = {
  port: parseInt(process.env.MONITOR_PORT || '') || 4747,
  host: '127.0.0.1',  // SECURITY: Localhost only - prevents network exposure
  claudeDir: resolveFrameworkRoot(),  // Framework root (resolved dynamically)
  eventsDir: join(MONITOR_DATA_DIR, 'events'),
  maxEvents: 1000,
  watchDebounceMs: 100,
};

// File type detection
export function detectFileType(filePath: string): { fileType: FileType; mimeType: string } {
  const ext = filePath.toLowerCase().split('.').pop() || '';

  // Markdown
  if (ext === 'md' || ext === 'markdown' || ext === 'qmd') {
    return { fileType: 'markdown', mimeType: 'text/markdown' };
  }

  // Mermaid diagrams
  if (ext === 'mmd' || ext === 'mermaid') {
    return { fileType: 'mermaid', mimeType: 'text/plain' };
  }

  // Code/structured formats
  if (['json', 'jsonl'].includes(ext)) {
    return { fileType: 'json', mimeType: 'application/json' };
  }

  if (['yaml', 'yml'].includes(ext)) {
    return { fileType: 'text', mimeType: 'text/yaml' };
  }

  if (['js', 'ts', 'jsx', 'tsx', 'py', 'rb', 'go', 'rs', 'java', 'c', 'cpp', 'h', 'hpp', 'cs', 'php', 'sh', 'bash', 'zsh'].includes(ext)) {
    return { fileType: 'code', mimeType: 'text/plain' };
  }

  // Plain text
  if (['txt', 'log', 'env', 'conf', 'config', 'ini', 'cfg'].includes(ext)) {
    return { fileType: 'text', mimeType: 'text/plain' };
  }

  // PDF
  if (ext === 'pdf') {
    return { fileType: 'pdf', mimeType: 'application/pdf' };
  }

  // Images
  if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico'].includes(ext)) {
    return { fileType: 'image', mimeType: `image/${ext === 'jpg' ? 'jpeg' : ext === 'svg' ? 'svg+xml' : ext}` };
  }

  // Video / audio / binary — never try to read as text
  if (['mp4', 'webm', 'avi', 'mov', 'mkv', 'mp3', 'wav', 'ogg', 'flac', 'm4a',
    'zip', 'tar', 'gz', 'bz2', '7z', 'exe', 'bin', 'wasm'].includes(ext)) {
    return { fileType: 'binary', mimeType: 'application/octet-stream' };
  }

  // Default to text
  return { fileType: 'unknown', mimeType: 'text/plain' };
}

// File type icons for UI
export function getFileIcon(fileType: FileType): string {
  switch (fileType) {
    case 'markdown': return '📝';
    case 'mermaid': return '🔷';
    case 'code': return '💻';
    case 'json': return '📊';
    case 'text': return '📄';
    case 'pdf': return '📋';
    case 'image': return '🖼️';
    case 'binary': return '📦';
    default: return '📄';
  }
}
