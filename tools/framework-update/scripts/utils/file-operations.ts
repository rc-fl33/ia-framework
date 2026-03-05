import { join, dirname } from 'path';
import { existsSync, mkdirSync, rmSync, readdirSync, statSync, readFileSync, writeFileSync, copyFileSync } from 'fs';

/**
 * Check if a file exists.
 */
export async function fileExists(path: string): Promise<boolean> {
  return existsSync(path);
}

/**
 * Check if path is a directory.
 */
export async function isDirectory(path: string): Promise<boolean> {
  try {
    return statSync(path).isDirectory();
  } catch {
    return false;
  }
}

/**
 * Check if path is a file.
 */
export async function isFile(path: string): Promise<boolean> {
  try {
    return statSync(path).isFile();
  } catch {
    return false;
  }
}

/**
 * Read file contents.
 */
export async function readFile(path: string): Promise<string> {
  return readFileSync(path, 'utf-8');
}

/**
 * Read file as buffer.
 */
export async function readFileBuffer(path: string): Promise<ArrayBuffer> {
  const buffer = readFileSync(path);
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
}

/**
 * Write file contents.
 * Creates parent directories if needed.
 */
export async function writeFile(path: string, contents: string): Promise<void> {
  const dir = dirname(path);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(path, contents, 'utf-8');
}

/**
 * Copy file from src to dst.
 * Creates parent directories if needed.
 */
export async function copyFile(src: string, dst: string): Promise<void> {
  const dir = dirname(dst);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  copyFileSync(src, dst);
}

/**
 * Remove file or directory recursively.
 */
export async function remove(path: string): Promise<void> {
  try {
    if (existsSync(path)) {
      rmSync(path, { recursive: true, force: true });
    }
  } catch {
    // Ignore if doesn't exist
  }
}

/**
 * Create directory recursively.
 */
export async function mkdir(path: string): Promise<void> {
  try {
    if (!existsSync(path)) {
      mkdirSync(path, { recursive: true });
    }
  } catch (error) {
    console.error(`Failed to create directory ${path}: ${error}`);
  }
}

/**
 * Copy directory recursively.
 */
export async function copyDir(src: string, dst: string): Promise<void> {
  const srcStat = statSync(src);
  if (srcStat.isDirectory()) {
    if (!existsSync(dst)) {
      mkdirSync(dst, { recursive: true });
    }
    for (const entry of readdirSync(src)) {
      await copyDir(join(src, entry), join(dst, entry));
    }
  } else {
    const dir = dirname(dst);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    copyFileSync(src, dst);
  }
}

/**
 * List files in directory (not recursive).
 */
export async function listDir(path: string): Promise<string[]> {
  try {
    const entries = readdirSync(path, { withFileTypes: true });
    return entries.map(e => e.name);
  } catch {
    return [];
  }
}

/**
 * Compare two files byte-by-byte.
 * Returns true if identical.
 */
export async function filesEqual(file1: string, file2: string): Promise<boolean> {
  try {
    const buf1 = await readFileBuffer(file1);
    const buf2 = await readFileBuffer(file2);

    if (buf1.byteLength !== buf2.byteLength) {
      return false;
    }

    const view1 = new Uint8Array(buf1);
    const view2 = new Uint8Array(buf2);

    for (let i = 0; i < view1.length; i++) {
      if (view1[i] !== view2[i]) {
        return false;
      }
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Check if file is JSON (valid syntax).
 * Useful for validating settings.json after merge.
 */
export async function isValidJson(path: string): Promise<boolean> {
  try {
    const content = await readFile(path);
    JSON.parse(content);
    return true;
  } catch {
    return false;
  }
}

/**
 * Recursively list all files in directory.
 */
export async function* walkDir(dir: string): AsyncGenerator<string, void, unknown> {
  let entries: any[];
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    // Skip git and internal framework dirs
    if (entry.name.startsWith('.') && entry.name !== '.env' && entry.name !== '.env.example') {
      continue;
    }

    if (entry.isDirectory()) {
      yield* walkDir(fullPath);
    } else {
      yield fullPath;
    }
  }
}

/**
 * Get relative path from base.
 */
export function getRelativePath(basePath: string, fullPath: string): string {
  if (fullPath.startsWith(basePath)) {
    return fullPath.slice(basePath.length).replace(/^\//, '');
  }
  return fullPath;
}

/**
 * Check if filename looks like it's binary.
 * Used to avoid binary file diffs.
 */
export function isBinaryFile(filepath: string): boolean {
  const binaryExtensions = [
    '.png', '.jpg', '.jpeg', '.gif', '.ico',
    '.zip', '.tar', '.gz', '.rar',
    '.pdf', '.doc', '.docx', '.xls', '.xlsx',
    '.mp3', '.mp4', '.avi', '.mov',
    '.bin', '.o', '.a', '.so', '.dylib',
    '.wasm'
  ];

  const lower = filepath.toLowerCase();
  return binaryExtensions.some(ext => lower.endsWith(ext));
}
