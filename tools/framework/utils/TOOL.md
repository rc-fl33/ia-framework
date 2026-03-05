---
name: utils
type: library
classification: public
description: Framework utility library - path resolution, env validation, VPS config, error sanitization, audit logging, prompt rendering
version: 1.0.0
last_updated: 2026-02-14
env_required: false
env_keys: []
commands: []
related_tools:
  - tools/sessions
  - tools/generators
  - tools/validation
---

# Framework Utilities

**Type:** Library
**Classification:** 🌍 PUBLIC
**Status:** ✅ Production Ready

---

## Classification

**PUBLIC** - Core framework utility library.

**Why Public:**
- Standard utility functions (path resolution, validation, config loading)
- No proprietary logic - common programming patterns
- Useful for all framework users and external tools
- Well-tested and documented

---

## Purpose

Collection of framework utilities providing centralized path resolution, environment validation, VPS configuration, error sanitization, audit logging, and prompt rendering. All framework tools and skills use these utilities for consistency.

**Core Capabilities:**
- **Path resolution**: Memoized framework root resolution (~95% I/O reduction)
- **Environment validation**: Zod-based schema validation for API clients
- **VPS config resolution**: Multi-provider SSH credential loading
- **Error sanitization**: Remove sensitive data from error messages
- **Audit logging**: Structured audit trail for compliance
- **Prompt rendering**: Template-based prompt generation
- **QA integration**: Quality assurance model calls
- **Dependency checking**: Validate runtime dependencies

**Use Cases:**
- **Framework tools**: Consistent path handling across all tools
- **API clients**: Validate environment before initialization
- **VPS access**: SSH credential resolution for deployment
- **Security**: Sanitize errors before logging/display
- **Compliance**: Audit trail for regulated environments

---

## Usage

### Path Resolution

**Get framework root (memoized):**
```typescript
import { resolveFrameworkRoot } from '@/tools/utils/path-resolution';

const root = resolveFrameworkRoot();
// First call: ~10ms (filesystem I/O)
// Subsequent calls: ~0.01ms (cached)

console.log(`Framework: ${root}`);
```

**Resolve skill directory:**
```typescript
import { resolveSkillDir } from '@/tools/utils/path-resolution';

const skillPath = resolveSkillDir('write');
// Returns: /path/to/framework/skills/write
```

**Resolve .env file:**
```typescript
import { resolveEnvPath } from '@/tools/utils/path-resolution';

const envPath = resolveEnvPath();
// Returns: /path/to/framework/.env
```

**Check path resolution performance:**
```bash
bun tools/utils/benchmark-path-resolution.ts

# Output:
# Benchmarking Path Resolution (10,000 calls)
# ────────────────────────────────────────────
# First call:        9.83ms
# Cached calls avg:  0.012ms
# Speedup:           ~818x faster
```

---

### Environment Validation

**Validate OpenRouter API key:**
```typescript
import { validateEnv, EnvValidationSchemas } from '@/tools/utils/env-validator';

const result = validateEnv(EnvValidationSchemas.openrouter);

if (!result.success) {
  console.error('OpenRouter misconfigured:', result.errors);
  process.exit(1);
}

console.log('✅ OpenRouter configured correctly');
```

**Validate Twingate credentials:**
```typescript
const result = validateEnv(EnvValidationSchemas.twingate);

if (!result.success) {
  result.errors?.forEach(err => console.error(`  - ${err}`));
  process.exit(1);
}
```

**Available schemas:**
- `openrouter` - OpenRouter API key
- `twingate` - Twingate network + API key
- `simplefin` - SimpleFIN access URL
- `nvd` - NIST NVD API key (optional)
- `ghost` - Ghost CMS admin key + URL
- `vps` - VPS SSH credentials

---

### VPS Configuration

**Auto-resolve VPS config (tries all providers):**
```typescript
import { resolveVPSConfig } from '@/tools/utils/vps-config';

const config = resolveVPSConfig();

console.log(`Host: ${config.host}`);
console.log(`User: ${config.user}`);
console.log(`Port: ${config.port}`);
console.log(`SSH Key: ${config.sshKeyPath}`);
console.log(`Provider: ${config.resolvedFrom}`);
```

**Provider-specific resolution:**
```typescript
import { resolveVPSConfigByProvider } from '@/tools/utils/vps-config';

// OVHcloud (security testing VPS)
const ovh = resolveVPSConfigByProvider('ovhcloud');

// Hostinger (bounty target scrapers)
const hostinger = resolveVPSConfigByProvider('hostinger');

// Custom provider (any prefix in .env)
const custom = resolveVPSConfigByProvider('linode');
```

**Discover configured providers:**
```typescript
import { discoverProviders } from '@/tools/utils/vps-config';

const providers = discoverProviders();
console.log(`Configured: ${providers.join(', ')}`);
// Example output: ovhcloud, hostinger
```

---

### Error Sanitization

**Remove sensitive data from errors:**
```typescript
import { sanitizeError } from '@/tools/utils/error-sanitizer';

const error = new Error('Failed to connect to https://user:password@api.com');
const safe = sanitizeError(error);

console.log(safe.message);
// Output: Failed to connect to https://***:***@api.com
```

**Sanitize log messages:**
```typescript
import { sanitizeLogMessage } from '@/tools/utils/error-sanitizer';

const log = 'API key: [leaked-credential], token: [leaked-credential]';
const safe = sanitizeLogMessage(log);

console.log(safe);
// Output: API key: ***REDACTED***, token: ***REDACTED***
```

**Patterns sanitized:**
- API keys (sk_, pk_, tk_, ghp_, etc.)
- Passwords in URLs
- Bearer tokens
- SSH keys
- Email addresses (optionally)

---

### Audit Logging

**Log security event:**
```typescript
import { auditLog } from '@/tools/utils/audit-trail';

auditLog({
  event: 'ssh_access',
  user: 'admin',
  resource: 'production-vps',
  action: 'connect',
  result: 'success',
  metadata: {
    ip: '192.168.1.1',
    duration_ms: 1234
  }
});

// Writes to: logs/audit/YYYY-MM-DD.jsonl
```

**Query audit logs:**
```typescript
import { queryAuditLogs } from '@/tools/utils/audit-trail';

const events = queryAuditLogs({
  startDate: '2026-02-01',
  endDate: '2026-02-14',
  user: 'admin',
  event: 'ssh_access'
});

console.log(`Found ${events.length} SSH access events`);
```

---

### Prompt Rendering

**Render template with variables:**
```typescript
import { renderPrompt } from '@/tools/utils/prompt-renderer';

const template = `
You are testing {{target}} for {{vulnerability_type}}.
Scope: {{scope}}
Tools: {{tools}}
`;

const prompt = renderPrompt(template, {
  target: 'example.com',
  vulnerability_type: 'XSS',
  scope: 'web application',
  tools: 'Burp Suite, OWASP ZAP'
});

console.log(prompt);
```

**Load and render from file:**
```typescript
import { loadAndRenderPrompt } from '@/tools/utils/prompt-renderer';

const prompt = loadAndRenderPrompt(
  'skills/pentest/prompts/web-api/xss-testing.md',
  { target: 'example.com' }
);
```

---

### Dependency Checking

**Check runtime dependencies:**
```bash
bun tools/framework/utils/check-dependencies.ts

# Output:
# ✅ bun: 1.0.25 (required: >=1.0.0)
# ✅ git: 2.39.0 (required: >=2.30.0)
# ✅ docker: 24.0.6 (required: >=20.0.0)
# ⚠️  typescript: 4.9.5 (recommended: >=5.0.0)
# ❌ openssl: not found (required: >=1.1.1)
```

---

## Configuration

### Environment Variables

**Path Resolution:**
```bash
IA_FRAMEWORK_ROOT=/path/to/framework  # Override auto-detection
```

**VPS Providers** (auto-discovered):
```bash
# OVHcloud VPS (security testing)
OVHCLOUD_VPS_HOST=192.168.1.10
OVHCLOUD_VPS_USER=root
OVHCLOUD_VPS_PORT=22
OVHCLOUD_VPS_SSH_KEY=/path/to/ovh-key

# Hostinger VPS (bounty scrapers)
HOSTINGER_VPS_HOST=srv945980.hstgr.cloud
HOSTINGER_VPS_USER=root
HOSTINGER_VPS_PORT=22
HOSTINGER_VPS_SSH_KEY=/path/to/hostinger-key

# Custom provider (any prefix works)
LINODE_VPS_HOST=192.168.1.20
LINODE_VPS_USER=admin
LINODE_VPS_PORT=2222
LINODE_VPS_SSH_KEY=/path/to/linode-key
```

**Audit Logging:**
```bash
AUDIT_LOG_DIR=/path/to/logs/audit  # Override default (logs/audit/)
```

---

## API Reference

### Path Resolution

#### `resolveFrameworkRoot(): string`

Get framework root directory (memoized).

**Returns:** Absolute path to framework root

**Performance:** 0.01ms (cached), 10ms (first call)

---

#### `resolveSkillDir(skillName: string): string`

Get skill directory path.

**Parameters:**
- `skillName` - Skill name (e.g., "write", "security")

**Returns:** Absolute path to skill directory

---

#### `resolveEnvPath(): string`

Get .env file path.

**Returns:** Absolute path to .env file

---

#### `getHomeDirectory(): string`

Get user home directory (cross-platform).

**Returns:** Home directory path

---

### Environment Validation

#### `validateEnv(schema: ZodSchema): EnvValidationResult`

Validate environment variables against schema.

**Parameters:**
- `schema` - Zod schema from `EnvValidationSchemas`

**Returns:**
```typescript
interface EnvValidationResult {
  success: boolean;
  errors?: string[];
  data?: Record<string, string>;
}
```

---

### VPS Configuration

#### `resolveVPSConfig(): VPSConfig`

Auto-resolve VPS configuration (tries all providers).

**Returns:**
```typescript
interface VPSConfig {
  host: string;
  user: string;
  port: string;
  sshKeyPath: string;
  resolvedFrom: string;  // Provider name
}
```

**Throws:** Error if no VPS configured

---

#### `resolveVPSConfigByProvider(provider: string): VPSConfig`

Resolve VPS config for specific provider.

**Parameters:**
- `provider` - Provider name (lowercase, e.g., "ovhcloud", "hostinger")

**Returns:** VPSConfig for that provider

**Throws:** Error if provider not configured

---

### Error Sanitization

#### `sanitizeError(error: Error): Error`

Remove sensitive data from error object.

**Parameters:**
- `error` - Error object

**Returns:** Sanitized error (new instance)

---

#### `sanitizeLogMessage(message: string): string`

Remove sensitive data from log message.

**Parameters:**
- `message` - Log message string

**Returns:** Sanitized message

---

### Audit Logging

#### `auditLog(event: AuditEvent): void`

Write audit log entry.

**Parameters:**
```typescript
interface AuditEvent {
  event: string;
  user: string;
  resource: string;
  action: string;
  result: 'success' | 'failure';
  metadata?: Record<string, unknown>;
}
```

---

#### `queryAuditLogs(filter: AuditFilter): AuditEvent[]`

Query audit logs with filters.

**Parameters:**
```typescript
interface AuditFilter {
  startDate?: string;
  endDate?: string;
  user?: string;
  event?: string;
  resource?: string;
}
```

**Returns:** Array of matching audit events

---

### Prompt Rendering

#### `renderPrompt(template: string, vars: Record<string, string>): string`

Render template with variables.

**Parameters:**
- `template` - Template string with {{placeholders}}
- `vars` - Variable values

**Returns:** Rendered prompt

---

## Architecture

### Path Resolution Caching

**Memoization strategy:**
```
First call to resolveFrameworkRoot():
   ↓
Check IA_FRAMEWORK_ROOT env var (cached at module load)
   ├─ If set → use it
   └─ If not set:
      ↓
   Check ~/.claude/CLAUDE.md symlink
      ├─ If exists → resolve realpath → get dirname
      └─ If not exists → use ~/.claude
   ↓
Cache result in module-level variable
   ↓
Return cached value on all subsequent calls
```

**Performance impact:**
- **Before memoization:** 10ms per call × 1000 calls = 10 seconds
- **After memoization:** 10ms (first) + 0.01ms × 999 = ~10ms total
- **Speedup:** ~1000x for repeated calls

### VPS Provider Discovery

**Auto-discovery algorithm:**
```
Scan process.env for keys matching *_VPS_HOST
   ↓
Extract prefix (everything before _VPS_HOST)
   ├─ OVHCLOUD_VPS_HOST → "ovhcloud"
   ├─ HOSTINGER_VPS_HOST → "hostinger"
   └─ CUSTOM_VPS_HOST → "custom"
   ↓
For each provider:
   Build key lookup:
      ├─ {PREFIX}_VPS_HOST
      ├─ {PREFIX}_VPS_USER
      ├─ {PREFIX}_VPS_PORT
      └─ {PREFIX}_VPS_SSH_KEY
   ↓
Return first provider with all 4 keys present
```

**No code changes needed to add providers** - just add keys to .env

### Error Sanitization Patterns

**Regex patterns for sensitive data:**
```typescript
const SENSITIVE_PATTERNS = [
  /sk_[a-zA-Z0-9_-]+/g,        // Stripe keys
  /pk_[a-zA-Z0-9_-]+/g,        // Public keys
  /tk_[a-zA-Z0-9_-]+/g,        // Twingate keys
  /ghp_[a-zA-Z0-9]+/g,         // GitHub personal tokens
  /:\/\/[^:]+:[^@]+@/g,        // Passwords in URLs
  /Bearer [a-zA-Z0-9._-]+/g,   // Bearer tokens
  /-----BEGIN.*KEY-----[\s\S]+?-----END.*KEY-----/g  // SSH keys
];
```

**Replacement:** `***REDACTED***` or `***:***` for URL passwords

---

## Scripts

### Benchmark Path Resolution

```bash
bun tools/utils/benchmark-path-resolution.ts

# Tests memoization effectiveness with 10,000 calls
```

### Check Dependencies

```bash
bun tools/framework/utils/check-dependencies.ts

# Verifies all required runtime dependencies
```

### Test Memoization

```bash
bun tools/utils/test-memoization-effectiveness.ts

# Measures cache hit rate and performance gain
```

---

## Dependencies

### Runtime

**External:**
- `zod` - Schema validation

**Internal:** None (standalone utilities)

### Framework Integration

**Used By:**
- All framework tools
- All skills
- All hooks
- All API clients

---

## Consumers

> Which skills, hooks, tools, and workflows USE this tool.

**Hooks:**
- `hooks/pre-commit/07-*` — uses validateEnv for credential checks
- `hooks/pre-commit/12-*` — uses path-resolution utilities
- `hooks/session-end.ts` — uses path-resolution and error-sanitizer
- `hooks/session-start.ts` — uses path-resolution and audit-trail
- `hooks/tool-tracker.ts` — uses path-resolution

**Skills:**
- `skills/ghost/scripts/utilities/` (6 files) — uses path-resolution, vps-config, prompt-renderer
- `tools/pentest/` — uses vps-config and error-sanitizer

**Tools:**
- `tools/git/scripts/` (3 files) — uses path-resolution and env-validator
- `tools/manifest/sync-manifest.ts` — uses path-resolution
- `tools/validation/` — uses env-validator and path-resolution
- `tools/generators/` — uses path-resolution and prompt-renderer

**File Structure:**
```
tools/utils/
├── path-resolution.ts         # Memoized path utilities
├── env-validator.ts           # Environment validation
├── vps-config.ts              # VPS credential resolution
├── error-sanitizer.ts         # Error sanitization
├── audit-trail.ts             # Audit logging
├── prompt-renderer.ts         # Template rendering
├── qa-model.ts                # QA integration
├── check-dependencies.ts      # Dependency checking
├── benchmark-path-resolution.ts
├── test-memoization-effectiveness.ts
├── __tests__/
│   ├── env-validator.test.ts
│   └── shell-escape.test.ts
└── TOOL.md                    # This file
```

---

## Troubleshooting

### "Framework root not found"

**Cause:** Neither IA_FRAMEWORK_ROOT nor ~/.claude/CLAUDE.md symlink exists

**Fix:**
```bash
# Option 1: Set environment variable
export IA_FRAMEWORK_ROOT=/path/to/framework

# Option 2: Create symlink
ln -s /path/to/framework/CLAUDE.md ~/.claude/CLAUDE.md
```

### "VPS configuration not found"

**Cause:** No VPS_* keys in .env

**Fix:**
```bash
# Add to .env
echo 'HOSTINGER_VPS_HOST=your-host' >> .env
echo 'HOSTINGER_VPS_USER=root' >> .env
echo 'HOSTINGER_VPS_PORT=22' >> .env
echo 'HOSTINGER_VPS_SSH_KEY=/path/to/key' >> .env
```

### "Environment validation failed"

**Cause:** Missing or malformed environment variables

**Debug:**
```typescript
const result = validateEnv(EnvValidationSchemas.openrouter);

if (!result.success) {
  console.error('Validation errors:');
  result.errors?.forEach(err => console.error(`  - ${err}`));
}
```

### "SSH key not found"

**Cause:** VPS_SSH_KEY path doesn't exist

**Fix:**
```bash
# Check key path
echo $HOSTINGER_VPS_SSH_KEY

# Verify file exists
ls -la $HOSTINGER_VPS_SSH_KEY

# Fix path in .env if wrong
```

---

## Related Tools

- **tools/sessions** - Uses path resolution
- **tools/generators** - Uses prompt rendering
- **tools/validation** - Uses env validation
- **tools/api/** - All API clients use env validation

---

## Version History

### 1.0.0 (2026-01-28)
- ✅ Memoized path resolution (~95% I/O reduction)
- ✅ Environment validation with Zod schemas
- ✅ VPS config resolver with auto-discovery
- ✅ Error sanitization for security
- ✅ Audit logging infrastructure
- ✅ Prompt rendering utilities
- ✅ QA model integration
- ✅ Dependency checking
- ✅ Comprehensive test coverage

---

## References

- **Zod Documentation:** https://zod.dev
- **SSH Key Formats:** https://www.ssh.com/academy/ssh/keygen
- **IANA Timezones:** https://www.iana.org/time-zones
- **Audit Logging Standards:** NIST SP 800-92
