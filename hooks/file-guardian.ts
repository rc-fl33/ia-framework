/**
 * File Guardian Hook
 *
 * PreToolUse hook that validates file creation before Write tool executes.
 * Enforces file locations, naming conventions, and prevents duplicates.
 *
 * Trigger: PreToolUse on Write tool
 * Action: Validate file path, warn or block on violations
 */

import { existsSync, readdirSync, readFileSync } from 'fs';
import { join, dirname, basename, extname } from 'path';
import { parse as parseYaml } from 'yaml';
import { FileGuardianInputSchema } from './schemas';
import {
  logSecurityEvent,
  extractFilePattern
} from '@/tools/framework/utils/audit-trail';
import {
  validatePath,
  resolveFrameworkRoot
} from '@/tools/framework/utils/path-resolution';
import {
  sanitizeFilePath,
  sanitizeErrorMessage,
  logInternalError,
  formatSecurityError,
  formatValidationError
} from '@/tools/framework/utils/error-sanitizer';

interface PreToolUseInput {
  tool_name: string;
  tool_input: {
    file_path?: string;
    content?: string;
    [key: string]: unknown;
  };
}

interface ValidationResult {
  action: 'allow' | 'warn' | 'block';
  message?: string;
  suggestion?: string;
}

interface LocationRule {
  purpose: string;
  naming?: {
    pattern?: string;
    convention?: string;
  };
  allowed_files?: string[];
  blocked_patterns?: string[];
  auto_generated?: boolean;
  manual_creation?: string;
}

interface FileRegistry {
  version: string;
  root: LocationRule;
  docs: LocationRule;
  foundation: LocationRule;
  modules: LocationRule;
  hooks: LocationRule;
  sessions: LocationRule;
  plans: LocationRule;
  [key: string]: unknown;
}

// Get framework root via centralized path resolution
const FRAMEWORK_PATH = resolveFrameworkRoot();

async function main() {
  const input = await Bun.stdin.text();

  try {
    const data: PreToolUseInput = JSON.parse(input);

    // Validate input schema with Zod
    const validation = FileGuardianInputSchema.safeParse(data);
    if (!validation.success) {
      // Log validation failure
      logSecurityEvent({
        event_type: 'validation_error',
        tool_name: 'Write',
        reason: 'Input schema validation failed',
        severity: 'medium',
        context: {
          errors: validation.error?.errors?.map(e => ({
            path: e.path.join('.'),
            message: e.message
          })) || []
        }
      });

      console.log('<system-reminder>');
      console.log('FILE GUARDIAN: VALIDATION ERROR');
      console.log('');
      console.log('Invalid input format - malformed tool call detected');
      console.log('');
      if (validation.error?.errors) {
        console.log(formatValidationError(validation.error.errors.map(e => ({
          path: e.path,
          message: e.message
        }))));
      } else {
        console.log('Unable to parse validation errors');
      }
      console.log('');
      console.log('SECURITY POLICY: Fail-closed on validation errors to prevent bypass');
      console.log('</system-reminder>');
      process.exit(2); // Fail-closed on validation error
    }

    // Only process Write tool calls
    if (validation.data.tool_name !== 'Write') {
      process.exit(0);
    }

    const filePath = validation.data.tool_input.file_path;
    if (!filePath) {
      process.exit(0);
    }

    // Validate the file creation
    const content = validation.data.tool_input.content || '';
    const result = validateFileCreation(filePath, content);

    if (result.action === 'block') {
      // Log file creation block
      logSecurityEvent({
        event_type: 'file_creation_blocked',
        tool_name: 'Write',
        reason: result.message || 'File creation blocked',
        severity: 'high',
        context: {
          file_pattern: extractFilePattern(filePath),
          suggestion: result.suggestion
        }
      });

      console.log(formatSecurityError({
        title: 'FILE GUARDIAN: BLOCKED',
        filePath: filePath,
        reason: result.message || 'File creation blocked',
        suggestion: result.suggestion
      }));
      // Exit code 2 = hard block (cannot proceed)
      process.exit(2);
    }

    if (result.action === 'warn') {
      // Log file creation warning
      logSecurityEvent({
        event_type: 'file_creation_warning',
        tool_name: 'Write',
        reason: result.message || 'File creation warning',
        severity: 'low',
        context: {
          file_pattern: extractFilePattern(filePath),
          suggestion: result.suggestion
        }
      });

      console.log('<system-reminder>');
      console.log('FILE GUARDIAN: WARNING');
      console.log('');
      console.log(`File: ${sanitizeFilePath(filePath)}`);
      console.log(`Warning: ${result.message}`);
      if (result.suggestion) {
        console.log(`Suggestion: ${result.suggestion}`);
      }
      console.log('');
      console.log('Proceeding with file creation...');
      console.log('</system-reminder>');
    }

    // Allow the operation
    process.exit(0);

  } catch (err) {
    const error = err as Error;

    // Log full details internally (with stack trace)
    logInternalError(error, { hook: 'file-guardian', phase: 'validation' });

    // Log fail-closed error to audit trail
    logSecurityEvent({
      event_type: 'fail_closed_error',
      tool_name: 'Write',
      reason: `Unexpected error: ${sanitizeErrorMessage(error)}`,
      severity: 'critical',
      context: {
        error_name: error.name
      }
    });

    // Fail-closed on hook errors to prevent security bypass
    console.log('<system-reminder>');
    console.log('FILE GUARDIAN: CRITICAL ERROR');
    console.log('');
    console.log(`Error: ${sanitizeErrorMessage(error)}`);
    console.log('');
    console.log('SECURITY POLICY: Fail-closed on unexpected errors to prevent bypass');
    console.log('This may indicate malformed input or an attack attempt.');
    console.log('</system-reminder>');
    process.exit(2); // Fail-closed on any error
  }
}

function validateFileCreation(filePath: string, content: string = ''): ValidationResult {
  // 0. SECURITY CHECK: Path traversal, symlink attacks, device names
  const pathValidation = validatePath(filePath);
  if (!pathValidation.valid) {
    // Log security violation
    const eventType = pathValidation.error?.includes('symlink') ? 'symlink_attack_blocked' :
                      pathValidation.error?.includes('device') ? 'device_access_blocked' :
                      'path_traversal_blocked';

    logSecurityEvent({
      event_type: eventType,
      tool_name: 'Write',
      reason: pathValidation.error || 'Path validation failed',
      severity: 'critical',
      context: {
        file_pattern: extractFilePattern(filePath),
        original_path: filePath
      }
    });

    return {
      action: 'block',
      message: `SECURITY: ${pathValidation.error}`,
      suggestion: 'Use only paths within the framework directory'
    };
  }

  // 1. CHECK: Does file already exist?
  if (existsSync(filePath)) {
    return {
      action: 'warn',
      message: `File already exists: ${basename(filePath)}`,
      suggestion: 'Use Edit tool to modify existing file, or choose a different name'
    };
  }

  // 2. CHECK: Similar file exists? (fuzzy match)
  const dirPath = dirname(filePath);
  const fileName = basename(filePath);

  if (existsSync(dirPath)) {
    const similar = findSimilarFiles(dirPath, fileName);
    if (similar.length > 0) {
      return {
        action: 'warn',
        message: `Similar files exist: ${similar.join(', ')}`,
        suggestion: 'Did you mean to edit one of these files?'
      };
    }
  }

  // 3. CHECK: Is this within the framework directory?
  if (!filePath.startsWith(FRAMEWORK_PATH)) {
    // Outside framework - allow without further checks
    return { action: 'allow' };
  }

  // 4. Get relative path within framework
  const relativePath = filePath.slice(FRAMEWORK_PATH.length + 1);
  const topDir = relativePath.split('/')[0];

  // 5. CHECK: Location-specific rules
  const registry = loadRegistry();
  // Note: Continue checks even if registry doesn't exist - use fallback defaults

  // Check root directory rules
  if (!relativePath.includes('/') || topDir === '') {
    // File in root
    const ext = extname(fileName);

    // PHASE 2: Enforce file-location-standards.md rules for root
    if (ext === '.md') {
      // Markdown files should be in docs/ unless they're GitHub special files or framework entry points
      const allowedRootMd = [
        'README.md',           // GitHub repository description
        'CLAUDE.md',           // Framework entry point
        'CHANGELOG.md',        // GitHub recognizes for releases
        'SECURITY.md',         // GitHub security tab
        'CONTRIBUTING.md',     // GitHub contribution guidelines
        'INSTALL.md',          // Installation instructions
        'CODE_OF_CONDUCT.md',  // GitHub community standards
        'SUPPORT.md'           // GitHub support resources
      ];
      if (!allowedRootMd.includes(fileName)) {
        return {
          action: 'warn',
          message: `Markdown files should not be in root directory`,
          suggestion: `Move to docs/ (public framework) or private/docs/ (private work). Allowed root .md files: README, CLAUDE, CHANGELOG, SECURITY, CONTRIBUTING, INSTALL`
        };
      }
    }

    const allowed = registry?.root?.allowed_files || ['package.json', '.gitignore', 'tsconfig.json', 'bun.lockb'];
    if (!allowed.includes(fileName) && ext !== '.md') {
      return {
        action: 'warn',
        message: `Root directory should only contain entry points and config files`,
        suggestion: `Consider placing this file in docs/ or the appropriate module directory`
      };
    }
  }

  // PHASE 2: Check docs/ vs private/docs/ (public vs private content)
  if (topDir === 'docs' && content) {
    // Scan content for private skill references
    const privateSkills = ['ghost', 'security', 'compliance', 'advisory', 'n8n',
                          'write', 'bounty-targets',
                          'consulting', 'ehs-proposals', 'x-engagement'];

    const hasPrivateContent = privateSkills.some(skill =>
      content.toLowerCase().includes(skill) ||
      content.includes(`skills/${skill}`) ||
      fileName.toLowerCase().includes(skill)
    );

    // Check for blog/content planning keywords
    const blogKeywords = ['blog', 'ghost', 'newsletter', 'tweet', 'x algorithm', 'engagement'];
    const hasBlogContent = blogKeywords.some(keyword =>
      content.toLowerCase().includes(keyword) ||
      fileName.toLowerCase().includes(keyword)
    );

    // Check for project tracking patterns
    const trackingPatterns = ['active work', 'in-progress', 'blocker', 'next action', 'status:'];
    const hasTracking = trackingPatterns.some(pattern =>
      content.toLowerCase().includes(pattern)
    );

    if (hasPrivateContent || hasBlogContent || hasTracking) {
      return {
        action: 'warn',
        message: `This content appears to be private work and should not be in /docs (public)`,
        suggestion: `Move to private/docs/ instead. /docs syncs to public repo, private/docs/ does not.`
      };
    }
  }

  // PHASE 2: Check scratchpad usage
  if (topDir === 'scratchpad' && content) {
    // Detect permanent content patterns
    const permanentPatterns = [
      'gap analysis', 'audit', 'roadmap', 'architecture',
      'implementation plan', 'design document', 'standards',
      'best practices', 'migration', 'deployment'
    ];

    const isPermanent = permanentPatterns.some(pattern =>
      fileName.toLowerCase().includes(pattern) ||
      content.toLowerCase().includes(`# ${pattern}`)
    );

    if (isPermanent) {
      return {
        action: 'warn',
        message: `This appears to be permanent documentation in scratchpad/ (temporary)`,
        suggestion: `Permanent docs belong in docs/ (public) or private/docs/ (private). Scratchpad is for temporary exploration.`
      };
    }
  }

  // Check sessions/ - allow manual creation (needed for context/memory)
  if (topDir === 'sessions') {
    // Sessions are important for context - allow all writes
  }

  // Check hooks/ naming convention
  if (topDir === 'hooks') {
    const ext = extname(fileName);
    if (ext === '.ts' && !isLowerKebab(fileName.replace('.ts', ''))) {
      return {
        action: 'warn',
        message: `hooks/ files should use lowercase-kebab naming`,
        suggestion: `Consider renaming to ${toKebabCase(fileName)}`
      };
    }
    if (ext === '.js') {
      return {
        action: 'warn',
        message: `JavaScript files in hooks/ - use TypeScript instead`,
        suggestion: `Rename to ${fileName.replace('.js', '.ts')}`
      };
    }
  }

  // Check foundation/ and modules/ structure
  if (topDir === 'foundation' || topDir === 'modules') {
    const parts = relativePath.split('/');
    if (parts.length >= 2) {
      const moduleDir = parts[1];
      // Check module directory naming
      if (!isLowerKebab(moduleDir) && moduleDir !== 'lib' && moduleDir !== 'engine') {
        return {
          action: 'warn',
          message: `Module directories should use lowercase-kebab naming`,
          suggestion: `Consider renaming ${moduleDir} to ${toKebabCase(moduleDir)}`
        };
      }
    }
  }

  return { action: 'allow' };
}

function findSimilarFiles(dirPath: string, newFile: string): string[] {
  try {
    const existing = readdirSync(dirPath);
    const newLower = normalize(newFile);

    return existing.filter(f => {
      const existingLower = normalize(f);
      // Same name different case
      if (newLower === existingLower && newFile !== f) {
        return true;
      }
      // Levenshtein distance < 3
      if (levenshtein(newLower, existingLower) < 3 && newLower !== existingLower) {
        return true;
      }
      return false;
    });
  } catch {
    return [];
  }
}

function normalize(name: string): string {
  return name.toLowerCase().replace(/[-_]/g, '').replace(/\.[^.]+$/, '');
}

function isAllCaps(name: string): boolean {
  return /^[A-Z][A-Z0-9-]*$/.test(name);
}

function isLowerKebab(name: string): boolean {
  return /^[a-z][a-z0-9-]*$/.test(name);
}

function toKebabCase(name: string): string {
  return name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase();
}

function levenshtein(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

function loadRegistry(): FileRegistry | null {
  try {
    const registryPath = join(FRAMEWORK_PATH, 'foundation', 'lib', 'file-registry.yaml');
    if (!existsSync(registryPath)) {
      return null;
    }
    const content = readFileSync(registryPath, 'utf-8');
    return parseYaml(content) as FileRegistry;
  } catch {
    return null;
  }
}

main();
