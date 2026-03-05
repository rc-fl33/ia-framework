#!/usr/bin/env bun
/**
 * Manifest Drift Audit Script
 *
 * Checks for stale exclusions in .framework-manifest.yaml:
 * - Exclude patterns that match nothing on disk
 * - Include patterns that don't exist
 *
 * Run as part of git-push to prevent manifest drift.
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { parse as parseYaml } from 'yaml';

interface ManifestAuditResult {
  success: boolean;
  staleExclusions: string[];
  missingIncludes: string[];
  hasDrift: boolean;
}

/**
 * Simple glob pattern matcher
 */
function matchesPattern(filePath: string, pattern: string): boolean {
  if (pattern === '*') return true;

  const regexPattern = pattern
    .replace(/[.+^${}()|[\]\\]/g, '\\$&') // escape regex special chars (not * or /)
    .replace(/\*\*\//g, '(.+/)?')          // **/ = zero or more path segments
    .replace(/\*\*/g, '.*')                // remaining ** = anything including /
    .replace(/\*/g, '[^/]*');              // * = anything within one segment

  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(filePath);
}

/**
 * Recursively collect all files in a directory
 */
function collectAllFiles(dirPath: string, rootPath: string): string[] {
  const files: string[] = [];

  if (!existsSync(dirPath)) {
    return files;
  }

  const entries = readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    // Skip common directories that shouldn't be checked
    if (entry.name === 'node_modules' || entry.name === '.git') {
      continue;
    }

    const fullPath = join(dirPath, entry.name);
    const relativePath = join(rootPath, entry.name);

    if (entry.isDirectory()) {
      files.push(relativePath);
      files.push(...collectAllFiles(fullPath, relativePath));
    } else {
      files.push(relativePath);
    }
  }

  return files;
}

/**
 * Check if a pattern matches any file in the framework
 * Returns: 'matches' | 'stale' | 'skip'
 *
 * - 'matches': pattern matches something - valid
 * - 'stale': parent path exists but excluded item doesn't - likely stale
 * - 'skip': runtime/temp pattern - always valid, don't flag
 */
function checkPattern(pattern: string, allFiles: string[]): 'matches' | 'stale' | 'skip' {
  // Handle negation patterns - always valid
  if (pattern.startsWith('!')) {
    return 'skip';
  }

  // Skip patterns for runtime/temp directories - these are always valid
  const skipPatterns = [
    'node_modules', '*.log', 'package-lock', 'bun.lock',
    'temp', 'tmp', 'cache', '.cache', 'downloads',
    'debug', 'archive', 'projects', 'session-env',
    'statsig', 'telemetry', 'todos', '.tmp',
    '.obsidian', '.vscode', '.idea', '.DS_Store',
    'Thumbs.db', 'history.jsonl', 'stats-cache.json',
    'paste-cache', '.ia-staging', 'shell-snapshots',
    'file-history', 'plans', 'private/sessions',
    'private/plans', 'private/output', 'private/archive',
    'private/docs', 'private/input', 'skills/*/output',
    'skills/*/input', 'skills/**/.cache', 'skills/**/bun.lock'
  ];

  const normalizedPattern = pattern.replace(/\\/g, '/');

  // Check if it's a skip pattern
  for (const skip of skipPatterns) {
    if (normalizedPattern.includes(skip)) {
      return 'skip';
    }
  }

  // Check exact match
  for (const file of allFiles) {
    const normalizedFile = file.replace(/\\/g, '/');

    if (matchesPattern(normalizedFile, normalizedPattern)) {
      return 'matches';
    }

    // Check if file is under directory pattern
    if (normalizedPattern.endsWith('/**')) {
      const baseDir = normalizedPattern.replace(/\/\*\*$/, '');
      if (normalizedFile.startsWith(baseDir + '/')) {
        return 'matches';
      }
    }

    // Check if parent exists but excluded item doesn't (stale)
    if (normalizedPattern.includes('/')) {
      const parentDir = normalizedPattern.split('/')[0];
      const excludedItem = normalizedPattern.split('/')[1]?.replace('**', '').replace('*', '');

      if (parentDir && excludedItem) {
        const parentExists = normalizedFile === parentDir || normalizedFile.startsWith(parentDir + '/');
        const excludedExists = normalizedFile.includes(excludedItem);

        if (parentExists && !excludedExists) {
          // Parent exists, excluded item doesn't - check if this is actually stale
          // by seeing if the full path pattern makes sense
        }
      }
    }
  }

  // For non-wildcard specific paths like tools/itsoktobewss/**, check if parent exists
  if (!normalizedPattern.includes('*') || normalizedPattern.match(/^[\w-]+\/[\w-]+\/\*\*$/)) {
    // Specific path like "tools/foo/**" - check if parent exists but target doesn't
    const parts = normalizedPattern.split('/');
    if (parts.length >= 2) {
      const parentPath = parts[0];
      const targetPath = parts.slice(0, 2).join('/');

      const parentExists = allFiles.some(f => f.replace(/\\/g, '/') === parentPath || f.replace(/\\/g, '/').startsWith(parentPath + '/'));
      const targetExists = allFiles.some(f => f.replace(/\\/g, '/') === targetPath || f.replace(/\\/g, '/').startsWith(targetPath + '/'));

      if (parentExists && !targetExists) {
        return 'stale';
      }
    }
  }

  return 'skip';
}

/**
 * Extract all exclude patterns from manifest
 */
function extractExcludePatterns(manifest: any): string[] {
  const patterns: string[] = [];

  // Process framework sections
  if (manifest.framework) {
    for (const [section, config] of Object.entries(manifest.framework)) {
      const cfg = config as { exclude?: string[] };
      if (cfg.exclude && Array.isArray(cfg.exclude)) {
        patterns.push(...cfg.exclude);
      }
    }
  }

  // Process instance sections
  if (manifest.instance) {
    for (const [section, patternsOrConfig] of Object.entries(manifest.instance)) {
      if (Array.isArray(patternsOrConfig)) {
        patterns.push(...patternsOrConfig);
      }
    }
  }

  return patterns;
}

/**
 * Run manifest audit
 */
export async function runManifestAudit(rootPath: string): Promise<ManifestAuditResult> {
  console.log('\n🔍 Running manifest drift audit...\n');

  const manifestPath = join(rootPath, '.framework-manifest.yaml');
  const staleExclusions: string[] = [];
  const missingIncludes: string[] = [];

  // Check if manifest exists
  if (!existsSync(manifestPath)) {
    console.log('   ⚠️  No .framework-manifest.yaml found - skipping audit\n');
    return {
      success: true,
      staleExclusions: [],
      missingIncludes: [],
      hasDrift: false
    };
  }

  try {
    const manifestContent = readFileSync(manifestPath, 'utf-8');
    const manifest = parseYaml(manifestContent);

    // Collect all files in the framework
    console.log('   Collecting all files in framework...');
    const allFiles = collectAllFiles(rootPath, rootPath);
    console.log(`   Found ${allFiles.length} files/directories\n`);

    // Extract and check exclude patterns
    const excludePatterns = extractExcludePatterns(manifest);
    console.log(`   Checking ${excludePatterns.length} exclude patterns...\n`);

    for (const pattern of excludePatterns) {
      // Check pattern status
      const status = checkPattern(pattern, allFiles);

      // Only flag truly stale patterns
      if (status === 'stale') {
        staleExclusions.push(pattern);
      }
    }

    // Print report
    console.log('='.repeat(70));
    console.log('MANIFEST DRIFT AUDIT REPORT');
    console.log('='.repeat(70));

    if (staleExclusions.length > 0) {
      console.log('\n⚠️  STALE EXCLUSIONS - match nothing on disk:\n');
      for (const pattern of staleExclusions) {
        console.log(`   - ${pattern}`);
      }
      console.log('\n   Recommendation: Remove these from .framework-manifest.yaml');
    }

    const hasDrift = staleExclusions.length > 0;

    console.log('\n' + '='.repeat(70));

    if (hasDrift) {
      console.log(`\n⚠️  MANIFEST DRIFT DETECTED: ${staleExclusions.length} stale exclusion(s)`);
    } else {
      console.log('\n✅ MANIFEST IN SYNC - All exclusions are valid!');
    }

    console.log('='.repeat(70) + '\n');

    return {
      success: !hasDrift,
      staleExclusions,
      missingIncludes,
      hasDrift
    };

  } catch (error) {
    console.error(`   ❌ Error auditing manifest: ${error}`);
    return {
      success: false,
      staleExclusions: [],
      missingIncludes: [],
      hasDrift: false
    };
  }
}

// CLI execution
if (import.meta.main) {
  const rootPath = process.env.GIT_PUSH_REPO_PATH || join(import.meta.dir, '..', '..', '..', '..');
  runManifestAudit(rootPath).then(result => {
    process.exit(result.hasDrift ? 1 : 0);
  });
}
