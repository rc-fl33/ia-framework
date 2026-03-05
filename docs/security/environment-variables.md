# Environment Variables Documentation

**Status:** Production
**Last Updated:** 2026-02-14
**Framework:** ▲ Intelligence Adjacent (IA)

## Overview

Environment variables configure API clients, VPS connections, and framework behavior. All credentials are stored in `.env` and validated on startup using centralized schemas.

## File Location

**Production credentials**: `.env` (framework root)
**Template/examples**: `.env.example`

```bash
# Framework root
~/ia-framework/
├── .env              # Production credentials (NEVER commit)
├── .env.example      # Template with placeholders (safe to commit)
└── .env.structure.yaml  # Documentation of required variables
```

## Security Requirements

1. **Never commit `.env`** - Production credentials must never be in version control
2. **Use `.env.example`** - Commit template files with placeholder values only
3. **Validate on startup** - Use `env-validator.ts` to fail fast on misconfiguration
4. **No hardcoded keys** - All API keys loaded from environment only

## Environment Variable Validation

The framework provides centralized validation via `tools/utils/env-validator.ts`:

```typescript
import { validateEnv, requireEnv, EnvValidationSchemas } from '@/tools/utils/env-validator';

// Option 1: Validate and exit on failure (recommended for required APIs)
requireEnv(EnvValidationSchemas.openrouter, 'OpenRouter');

// Option 2: Check configuration without exiting (for optional APIs)
const result = validateEnv(EnvValidationSchemas.ghost);
if (!result.success) {
  console.log('Ghost not configured:', result.errors);
}

// Option 3: Get validated environment variables with types
const config = getValidatedEnv(EnvValidationSchemas.vpsOvhcloud);
if (config) {
  const { OVHCLOUD_VPS_HOST, OVHCLOUD_VPS_USER } = config;
}
```

## Core Environment Variables

### Framework Configuration

```bash
# Framework root directory (auto-detected if not set)
IA_FRAMEWORK_ROOT=/path/to/ia-framework

# User timezone (IANA format)
USER_TIMEZONE=America/Chicago
```

### AI/ML APIs

#### OpenRouter (Required)

Multi-model AI access for QA, chat, and completion requests.

```bash
# Get from: https://openrouter.ai/keys
OPENROUTER_API_KEY=[insert key]
```

**Validation:**
```typescript
requireEnv(EnvValidationSchemas.openrouter, 'OpenRouter');
```

#### Context7 (Optional)

Library/framework documentation to prevent hallucinated code.

```bash
# Get from: https://context7.com
CONTEXT7_API_KEY=[insert key]
```

**Validation:**
```typescript
const hasContext7 = hasEnvConfigured(EnvValidationSchemas.context7);
```

### Version Control

#### GitHub (Optional)

Repository operations for git-push, git-public, git-pull skills.

```bash
# Personal Access Token with scopes: repo, workflow
GITHUB_TOKEN=[insert token]
```

**Validation:**
```typescript
const result = validateEnv(EnvValidationSchemas.github);
```

### VPS Configuration

#### OVHCloud VPS (Optional)

Remote command execution and security testing.

```bash
OVHCLOUD_VPS_HOST=[insert host]
OVHCLOUD_VPS_USER=root
OVHCLOUD_VPS_PORT=2222
OVHCLOUD_VPS_SSH_KEY=~/.ssh/id_rsa
```

**Validation:**
```typescript
const config = getValidatedEnv(EnvValidationSchemas.vpsOvhcloud);
if (config) {
  // VPS configured and validated
  const { OVHCLOUD_VPS_HOST, OVHCLOUD_VPS_USER } = config;
}
```

#### Hostinger VPS (Optional)

Bug bounty scrapers and n8n workflows.

```bash
HOSTINGER_VPS_HOST=[insert IP]
HOSTINGER_VPS_USER=root
HOSTINGER_VPS_PORT=22
HOSTINGER_VPS_SSH_KEY=~/.ssh/id_ed25519
```

**Validation:**
```typescript
requireEnv(EnvValidationSchemas.vpsHostinger, 'Hostinger VPS');
```

### Content Management

#### Ghost (Optional)

Blog platform for /write and /newsletter skills.

```bash
# Admin API key for content creation
GHOST_ADMIN_API_KEY=[insert admin key]

# Content API key for read operations
GHOST_CONTENT_API_KEY=[insert content key]

# Ghost API URL
GHOST_API_URL=[insert Ghost URL]
```

**Validation:**
```typescript
const result = validateEnv(EnvValidationSchemas.ghost);
if (!result.success) {
  console.error('Ghost configuration invalid');
  process.exit(1);
}
```

### Social Media

#### Twitter/X (Optional)

Automated blog post sharing.

```bash
TWITTER_API_KEY=[insert key]
TWITTER_API_SECRET=[insert secret]
TWITTER_ACCESS_TOKEN=[insert token]
TWITTER_ACCESS_TOKEN_SECRET=[insert token secret]
TWITTER_BEARER_TOKEN=[insert bearer token]
```

**Validation:**
```typescript
const hasTwitter = hasEnvConfigured(EnvValidationSchemas.twitter);
```

### Security Research

#### HackerOne (Optional)

Bug bounty platform integration.

```bash
HACKERONE_USERNAME=[insert username]
HACKERONE_API_TOKEN=[insert token]
HACKERONE_EMAIL=[insert email]
```

**Validation:**
```typescript
const config = getValidatedEnv(EnvValidationSchemas.hackerone);
```

#### NVD (Optional)

National Vulnerability Database for CVE lookups.

```bash
# Optional - increases rate limit from 5 to 50 requests per 30 seconds
NVD_API_KEY=[insert key]
```

**Validation:**
```typescript
const result = validateEnv(EnvValidationSchemas.nvd);
```

### Workflow Automation

#### n8n (Optional)

Workflow automation platform.

```bash
N8N_API=[insert API key]
N8N_INSTANCE_URL=[insert n8n URL]
```

**Validation:**
```typescript
requireEnv(EnvValidationSchemas.n8n, 'n8n');
```

### Network Access

#### Twingate (Optional)

Zero-trust network access for remote VPS.

```bash
TWINGATE_NETWORK_NAME=[insert network name]
TWINGATE_API_KEY=[insert key]
```

**Validation:**
```typescript
const result = validateEnv(EnvValidationSchemas.twingate);
```

## Validation Patterns

### Common Validation Patterns

The `env-validator.ts` defines reusable patterns:

```typescript
// API key (20-200 characters)
Patterns.apiKey: z.string().min(20).max(200)

// Short API key (10-200 characters)
Patterns.apiKeyShort: z.string().min(10).max(200)

// URL (http or https)
Patterns.url: z.string().url()

// SSH key path
Patterns.sshKeyPath: z.string().min(1)

// Port number (1-65535)
Patterns.port: z.string().regex(/^\d+$/)

// Email
Patterns.email: z.string().email()

// Timezone (IANA format)
Patterns.timezone: z.string().regex(/^[A-Z][a-zA-Z]*\/[A-Z][a-zA-Z_]*$/)
```

### Creating Custom Schemas

Add new schemas to `EnvValidationSchemas` in `env-validator.ts`:

```typescript
export const EnvValidationSchemas = {
  // ... existing schemas

  myNewApi: z.object({
    MY_API_KEY: Patterns.apiKey
      .describe('My API key - Get from https://example.com'),
    MY_API_URL: Patterns.url
      .describe('My API base URL')
  })
};
```

## Usage in API Clients

### Client Constructor Pattern

```typescript
import { requireEnv, EnvValidationSchemas } from '@/tools/utils/env-validator';

export class MyApiClient {
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    // Validate environment on construction
    requireEnv(EnvValidationSchemas.myNewApi, 'My API');

    // Load validated variables
    this.apiKey = process.env.MY_API_KEY!;
    this.apiUrl = process.env.MY_API_URL!;
  }

  async callApi() {
    const response = await fetch(this.apiUrl, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });
    return response.json();
  }
}
```

### Script Pattern

```typescript
#!/usr/bin/env bun
import { config } from 'dotenv';
import { resolve } from 'path';
import { requireEnv, EnvValidationSchemas } from '@/tools/utils/env-validator';

// Load .env
config({ path: resolve(import.meta.dir, '../../../.env') });

// Validate required environment variables
requireEnv(EnvValidationSchemas.ghost, 'Ghost API');

// Safe to use variables
const { GHOST_ADMIN_API_KEY, GHOST_API_URL } = process.env;

async function main() {
  // Use validated variables
  console.log(`Connecting to ${GHOST_API_URL}...`);
}

main();
```

## .env.example Template

```bash
# ===================================================================
# IA Framework Environment Variables
# ===================================================================
# Copy this file to .env and fill in your credentials
# NEVER commit .env to version control
# ===================================================================

# -------------------------------------------------------------------
# REQUIRED - AI/ML APIs
# -------------------------------------------------------------------

# OpenRouter - Multi-model AI access
# Get from: https://openrouter.ai/keys
OPENROUTER_API_KEY=[insert key]

# -------------------------------------------------------------------
# OPTIONAL - Additional APIs
# -------------------------------------------------------------------

# Context7 - Library/framework documentation
# Get from: https://context7.com
# CONTEXT7_API_KEY=[insert key]

# GitHub - Repository operations
# Personal Access Token with scopes: repo, workflow
# GITHUB_TOKEN=[insert token]

# -------------------------------------------------------------------
# OPTIONAL - VPS Configuration
# -------------------------------------------------------------------

# OVHCloud VPS
# OVHCLOUD_VPS_HOST=[insert host]
# OVHCLOUD_VPS_USER=root
# OVHCLOUD_VPS_PORT=2222
# OVHCLOUD_VPS_SSH_KEY=~/.ssh/id_rsa

# Hostinger VPS
# HOSTINGER_VPS_HOST=[insert IP]
# HOSTINGER_VPS_USER=root
# HOSTINGER_VPS_PORT=22
# HOSTINGER_VPS_SSH_KEY=~/.ssh/id_ed25519

# -------------------------------------------------------------------
# OPTIONAL - Content Management
# -------------------------------------------------------------------

# Ghost Blog Platform
# GHOST_ADMIN_API_KEY=[insert admin key]
# GHOST_CONTENT_API_KEY=[insert content key]
# GHOST_API_URL=[insert Ghost URL]

# -------------------------------------------------------------------
# OPTIONAL - Framework Configuration
# -------------------------------------------------------------------

# Framework root directory (auto-detected if not set)
# IA_FRAMEWORK_ROOT=/path/to/ia-framework

# User timezone (IANA format, e.g., America/Chicago)
# USER_TIMEZONE=America/Chicago
```

## Security Best Practices

1. **Use `.env.example` for templates** - Never include real credentials
2. **Validate on startup** - Fail fast with clear error messages
3. **Use typed getters** - `getValidatedEnv()` provides type safety
4. **Optional vs Required** - Use `requireEnv()` for required APIs, `hasEnvConfigured()` for optional
5. **Path resolution** - Use `resolve()` from framework root for consistent `.env` loading
6. **No default values** - Don't use default API keys - always require explicit configuration

## Troubleshooting

### Missing Environment Variables

```
❌ OpenRouter Configuration Error

Missing or invalid environment variables:

  • OPENROUTER_API_KEY: Required

Please update your .env file and try again.
See .env.example for required configuration.
```

**Solution:** Add the missing variable to `.env`:
```bash
OPENROUTER_API_KEY=[insert key]
```

### Invalid Format

```
❌ VPS Configuration Error

Missing or invalid environment variables:

  • OVHCLOUD_VPS_PORT: Port must be between 1 and 65535

Please update your .env file and try again.
```

**Solution:** Fix the port format:
```bash
OVHCLOUD_VPS_PORT=2222
```

### .env Not Found

If scripts can't find `.env`, check the path resolution:

```typescript
import { resolve } from 'path';
import { config } from 'dotenv';

// Correct: Resolve from script location to framework root
config({ path: resolve(import.meta.dir, '../../../.env') });

// Incorrect: Relative to cwd (may fail depending on where script is run)
config({ path: './.env' });
```

## References

- **Environment Validator**: `tools/utils/env-validator.ts`
- **Environment Structure**: `.env.structure.yaml`
- **Credential Handling**: `docs/standards/credential-handling-enforcement.md`
- **VPS Configuration**: `tools/utils/vps-config.ts`

## Related Documentation

- **Path Traversal Validation**: `docs/security/path-traversal-validation.md`
- **Error Sanitization**: `docs/M-3-ERROR-SANITIZATION-SUMMARY.md`
- **Security Audit Trail**: `tools/utils/audit-trail.ts`
