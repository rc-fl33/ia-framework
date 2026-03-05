# Path Traversal Validation

**Status:** Production
**Last Updated:** 2026-02-14
**Framework:** ▲ Intelligence Adjacent (IA)

## Overview

Path traversal validation prevents malicious file access by validating paths before file operations. The framework provides centralized validation through `validatePath()` in `tools/utils/path-resolution.ts`.

## Security Threats

Path traversal attacks attempt to access files outside authorized directories using:

1. **Relative paths with `..`**: `../../../etc/passwd`
2. **Symlink attacks**: Symlink points to sensitive file outside framework
3. **Windows device names**: `CON`, `PRN`, `AUX`, `NUL`, `COM1-9`, `LPT1-9`
4. **Absolute paths**: `/etc/passwd`, `C:\Windows\System32\config\SAM`

## Validation Function

```typescript
import { validatePath } from '@/tools/utils/path-resolution';

const result = validatePath(filePath);
if (!result.valid) {
  console.error(`Path validation failed: ${result.error}`);
  process.exit(2);
}
```

## Validation Steps

The `validatePath()` function performs comprehensive security checks:

### 1. Resolve to Absolute Path

Converts relative paths to absolute paths:
```
Input:  "./file.txt"
Output: "/home/user/.claude/file.txt"
```

### 2. Check Windows Device Names

Blocks Windows reserved device names in ALL path components:
```typescript
// Blocked paths:
/home/user/CON/file.txt     // CON in path
/home/user/file.txt/PRN     // PRN in path
C:\temp\AUX.txt             // AUX as filename
```

### 3. Resolve Symlinks

Resolves symlinks to their real targets:
```
Input:  ~/.claude/data/link.txt (symlink → /etc/passwd)
Resolved: /etc/passwd
Result: BLOCKED (outside framework)
```

### 4. Check for Traversal Sequences

After symlink resolution, blocks any paths with `..`:
```
Input: ~/ia-framework/data/../../../etc/passwd
Result: BLOCKED (contains ..)
```

### 5. Validate Within Framework

Ensures resolved path is within framework root:
```
Framework: /home/user/ia-framework
Path:      /home/user/ia-framework/data/file.txt  ✓ ALLOWED
Path:      /etc/passwd                             ✗ BLOCKED
```

## Usage Patterns

### Hook Integration

Security hooks should validate paths before file operations:

```typescript
import { validatePath } from '../tools/utils/path-resolution';
import { logSecurityEvent, extractFilePattern } from '../tools/utils/audit-trail';

const pathValidation = validatePath(filePath);
if (!pathValidation.valid) {
  const attackType = pathValidation.error?.includes('symlink')
    ? 'symlink_attack_blocked'
    : pathValidation.error?.includes('device')
    ? 'device_access_blocked'
    : 'path_traversal_blocked';

  logSecurityEvent({
    event_type: attackType,
    tool_name: 'Read',
    severity: 'critical',
    reason: pathValidation.error || 'Path validation failed',
    context: {
      file_pattern: extractFilePattern(filePath),
      original_path: filePath
    }
  });

  console.log('<system-reminder>');
  console.log('🛡️  PATH SECURITY VIOLATION');
  console.log('');
  console.log(`Original Path: ${filePath}`);
  console.log(`Security Issue: ${pathValidation.error}`);
  console.log('');
  console.log('This prevents attacks via:');
  console.log('- Symlinks pointing to sensitive files');
  console.log('- Path traversal (../) sequences');
  console.log('- Windows device names (CON, PRN, AUX, etc.)');
  console.log('</system-reminder>');

  process.exit(2);
}
```

### Script Validation

Skills and scripts should validate user-provided paths:

```typescript
import { validatePath } from '@/tools/utils/path-resolution';

async function processFile(userProvidedPath: string) {
  // Validate before any file operations
  const validation = validatePath(userProvidedPath);

  if (!validation.valid) {
    console.error(`❌ Invalid path: ${validation.error}`);
    process.exit(1);
  }

  // Safe to proceed with validated path
  const safePath = validation.resolvedPath!;
  const content = readFileSync(safePath, 'utf-8');
  // ... process file
}
```

### Advisory Skill Pattern

The advisory skill handles external documentation paths:

```typescript
import { validatePath, resolveFrameworkRoot } from '@/tools/utils/path-resolution';
import { join } from 'path';

async function loadAdvisoryDoc(docName: string) {
  // Construct path within framework
  const frameworkRoot = resolveFrameworkRoot();
  const docsDir = join(frameworkRoot, 'private', 'docs', 'advisory');
  const fullPath = join(docsDir, docName);

  // Validate constructed path
  const validation = validatePath(fullPath);
  if (!validation.valid) {
    throw new Error(`Invalid doc path: ${validation.error}`);
  }

  // Read validated path
  return readFileSync(validation.resolvedPath!, 'utf-8');
}
```

## Attack Prevention Examples

### Example 1: Path Traversal via `..`

```typescript
// Attack attempt
const maliciousPath = '../../../etc/passwd';

const result = validatePath(maliciousPath);
// Result: { valid: false, error: 'Path resolves outside framework directory' }
```

### Example 2: Symlink Attack

```bash
# Attacker creates symlink
ln -s /etc/passwd ~/.claude/data/link.txt
```

```typescript
// Validation detects symlink target
const result = validatePath('~/.claude/data/link.txt');
// Result: { valid: false, error: 'Path resolves outside framework directory' }
// Resolved to: /etc/passwd (outside framework)
```

### Example 3: Windows Device Name

```typescript
// Attack attempt
const devicePath = 'data/CON/file.txt';

const result = validatePath(devicePath);
// Result: { valid: false, error: 'Path contains Windows device name: CON' }
```

### Example 4: Absolute Path

```typescript
// Attack attempt
const absolutePath = '/etc/passwd';

const result = validatePath(absolutePath);
// Result: { valid: false, error: 'Path resolves outside framework directory' }
```

## Testing

Validate path security with test cases:

```typescript
import { describe, it, expect } from 'bun:test';
import { validatePath } from '../path-resolution';

describe('Path Traversal Validation', () => {
  it('blocks path traversal with ..', () => {
    const result = validatePath('../../../etc/passwd');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('outside framework');
  });

  it('blocks Windows device names', () => {
    const result = validatePath('data/CON/file.txt');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('device name');
  });

  it('allows valid framework paths', () => {
    const result = validatePath('data/file.txt');
    expect(result.valid).toBe(true);
  });
});
```

## Best Practices

1. **Validate Early**: Validate paths as soon as they enter your code (at boundaries)
2. **Use Validated Path**: Use `result.resolvedPath` for file operations, not the original input
3. **Log Security Events**: Always log validation failures for security monitoring
4. **Fail Closed**: Block operations on validation failure (exit code 2)
5. **Clear Messages**: Provide actionable error messages for legitimate failures
6. **Construct Safely**: Build paths using `join()` instead of string concatenation

## References

- **Path Resolution Utility**: `tools/utils/path-resolution.ts`
- **Credential Guardian Hook**: `hooks/credential-guardian.ts` (reference implementation)
- **File Guardian Hook**: `hooks/file-guardian.ts` (Write tool validation)
- **OWASP Path Traversal**: https://owasp.org/www-community/attacks/Path_Traversal

## Related Documentation

- **Error Sanitization**: `docs/M-3-ERROR-SANITIZATION-SUMMARY.md`
- **Security Audit Trail**: `tools/utils/audit-trail.ts`
- **File Location Standards**: `docs/standards/file-location-standards.md`
