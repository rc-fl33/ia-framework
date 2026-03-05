/**
 * Patterns for files that should NEVER be overwritten.
 * Format: glob patterns with optional ! prefix for exceptions.
 */
export const PROTECTED_PATTERNS = [
  '.env',
  '.env.*',
  '!.env.example',  // Exception: example files can be updated
  'private/**',
  'sessions/**',
  'plans/**',
  'output/**',
  'input/**',
  'blog/posts/**',
  '.framework-staging/**',
  '.framework-backup/**'
];

/**
 * Simple glob pattern matching.
 * Supports * and ** wildcards.
 */
function globMatch(pattern: string, str: string): boolean {
  // Convert glob pattern to regex
  const regexPattern = pattern
    .replace(/\./g, '\\.')
    .replace(/\*\*/g, '§§§')  // Temporary marker for **
    .replace(/\*/g, '[^/]*')  // * matches anything except /
    .replace(/§§§/g, '.*');   // ** matches everything including /

  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(str);
}

/**
 * Check if a file path matches protected patterns.
 * Supports exclusion patterns (starting with !).
 *
 * @param filepath - File path to check (relative to framework root)
 * @param patterns - Protected patterns (defaults to PROTECTED_PATTERNS)
 * @returns true if file is protected (should not be overwritten)
 */
export function isProtected(
  filepath: string,
  patterns: string[] = PROTECTED_PATTERNS
): boolean {
  for (const pattern of patterns) {
    if (pattern.startsWith('!')) {
      // Exclusion pattern: if matches, return false (NOT protected)
      const excludePattern = pattern.slice(1);
      if (globMatch(excludePattern, filepath)) {
        return false;
      }
    } else if (globMatch(pattern, filepath)) {
      // Match found in protection pattern
      return true;
    }
  }
  return false;
}

/**
 * Core framework files that should always be updated.
 * These are considered "framework infrastructure" vs "user customizations".
 */
export const CORE_FILES = [
  'CLAUDE.md',
  'settings.json',
  '.framework-manifest.yaml',
  'tools/framework_paths.py',
];

/**
 * Check if a file is core framework infrastructure.
 * These files are safe to update even if locally modified,
 * though we still warn about it.
 */
export function isCorefile(filepath: string): boolean {
  return CORE_FILES.includes(filepath);
}
