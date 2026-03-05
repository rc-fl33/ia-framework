---
audience: advanced
category: security
---


# Credential Protection System

**Multi-layer defense against credential exposure to AI systems.**

---

## Overview

The IA Framework implements a defense-in-depth approach to prevent credentials from being exposed to AI systems, whether accidentally or intentionally.

## Four Security Layers

### Layer 0: Declarative Deny Rules (settings.json)

**Location:** `~/.claude/settings.json` → `permissions.deny`

The first line of defense — declarative rules that fire BEFORE any hooks run. These block Read/Edit access to sensitive paths at the tool permission level.

**Source:** [Trail of Bits claude-code-config](https://github.com/trailofbits/claude-code-config) (adapted)

**Destructive command blocks:**
- `rm -rf *`, `rm -fr *` (recursive force delete)
- `sudo *` (all privileged execution)
- `mkfs *`, `dd *` (disk operations)
- `curl *|bash*`, `wget *|bash*` (pipe-to-shell attacks)
- `git push --force*`, `git push *--force*` (force push)
- `git reset --hard*` (destructive git reset)
- `chmod -R 777 /` (permission stripping)

**Credential path blocks (Read + Edit):**
- **SSH:** `~/.ssh/**`
- **Cloud credentials:** `~/.aws/**`, `~/.azure/**`, `~/.kube/**`
- **Encryption:** `~/.gnupg/**`
- **Container credentials:** `~/.docker/config.json`
- **Package manager tokens:** `~/.npmrc`, `~/.npm/**`, `~/.pypirc`, `~/.gem/credentials`, `~/.cargo/credentials*`
- **Git credentials:** `~/.config/gh/**`, `~/.git-credentials`, `~/.netrc`
- **Shell config:** `~/.bashrc`, `~/.zshrc` (Edit only)
- **Keychains & crypto wallets:** `~/Library/Keychains/**`, MetaMask, Electrum, Exodus, Phantom, Solflare

**Why this layer exists:** Deny rules are evaluated before hooks even execute. If a hook has a bug or fails to load, deny rules still protect. This provides defense-in-depth alongside credential-guardian.ts (Layer 2).

**Added:** 2026-02-13

### Layer 1: AI Instructions (CLAUDE.md)

**Location:** `~/.claude/CLAUDE.md` → Credential Security section

The AI is explicitly instructed to:
- Never read credential files
- Actively refuse requests to access credentials
- Suggest secure alternatives
- Report security concerns if user persists

**Protected file patterns:**
- `.env`, `.env.*`
- `*credentials*.json`
- `*-cookies.json`
- `*-api-key*`
- `*.pem`, `*.key`
- `id_rsa*`, SSH keys
- And more...

### Layer 2: Technical Control (PreToolUse Hook)

**Location:** `hooks/credential-guardian.ts`

**How it works:**
1. Intercepts all Read tool calls before execution
2. Checks file path against credential file patterns
3. Blocks access with exit code 2 if pattern matches
4. Provides clear error message and alternatives

**Registration:** `settings.json` → `PreToolUse.Read` matcher

**Pattern matching:**
- Case-insensitive regex matching
- Covers environment files, API keys, tokens, SSH keys, certificates
- Fails open on hook errors (doesn't block normal operation if hook crashes)

### Layer 3: Pre-commit Enforcement

**Location:** `hooks/pre-commit/*`

**Protection:**
- Scans code for hardcoded credentials before commits
- Blocks commits containing credential violations
- NO OVERRIDE option (hard security boundary)
- Enforces `.env`-only credential loading

---

## Testing

### Test Blocked Patterns

```bash
# Should block with exit code 2:
echo '{"tool_name":"Read","tool_input":{"file_path":"/path/to/.env"}}' | bun run hooks/credential-guardian.ts
echo '{"tool_name":"Read","tool_input":{"file_path":"/path/to/credentials.json"}}' | bun run hooks/credential-guardian.ts
echo '{"tool_name":"Read","tool_input":{"file_path":"/path/to/api-key.txt"}}' | bun run hooks/credential-guardian.ts
echo '{"tool_name":"Read","tool_input":{"file_path":"/path/to/.x-cookies.json"}}' | bun run hooks/credential-guardian.ts
echo '{"tool_name":"Read","tool_input":{"file_path":"/home/user/.ssh/id_rsa"}}' | bun run hooks/credential-guardian.ts
```

### Test Normal Files

```bash
# Should allow with exit code 0:
echo '{"tool_name":"Read","tool_input":{"file_path":"/path/to/README.md"}}' | bun run hooks/credential-guardian.ts
echo '{"tool_name":"Read","tool_input":{"file_path":"/path/to/script.ts"}}' | bun run hooks/credential-guardian.ts
```

---

## Protected File Patterns

### Environment Files
- `.env`
- `.env.local`, `.env.production`, etc.

### Credential Files
- `credentials.json`
- `*-credentials.json`

### API Keys & Tokens
- `api-key.txt`, `apikey.json`
- `access-token.txt`, `auth-token.json`
- `*.token`

### Authentication Cookies
- `*-cookies.json`
- `.x-cookies.json`, etc.

### SSH & Certificate Files
- `.pem`, `.key` files
- `id_rsa`, `id_ed25519`
- `.p12`, `.pfx`

### Cloud Provider Credentials
- `.aws/credentials`
- `.gcp/credentials`
- `.azure/credentials`

### Database Credentials
- `database.yml`, `database.json`

### Service Accounts
- `service-account*.json`

### OAuth & API Configs
- `oauth*.json`
- `api-config*.json`

---

## When Hook Blocks Access

**You'll see:**

```
🛡️  CREDENTIAL GUARDIAN: ACCESS BLOCKED

File: /path/to/.env

REASON: This file contains credentials and cannot be read for security.

SECURITY POLICY:
- Credential files must never be exposed to AI systems
- This is a hard security boundary enforced by the framework
- Layer 1: AI instructions prohibit credential access
- Layer 2: This hook (credential-guardian.ts) blocks Read tool
- Layer 3: Pre-commit hooks prevent credential commits

ALTERNATIVES:
- Review code that USES the credential file instead
- Verify script loads .env correctly by reading the loader code
- Check environment variable usage patterns in application code
- Validate credential configuration without exposing values
```

**What to do:**
1. Review the code that **uses** the credential file instead
2. Check environment variable loading patterns
3. Verify configuration without exposing actual values

---

## Extending Protection

### Add New Patterns

Edit `hooks/credential-guardian.ts`:

```typescript
const CREDENTIAL_PATTERNS = [
  // Add your pattern here
  /my-secret-file\.txt$/i,
  /\/secrets\//i,  // Block entire /secrets/ directory
];
```

### False Positives

If a legitimate file is blocked:

1. Verify it doesn't actually contain credentials
2. If safe, update pattern to be more specific
3. Document the exception in credential-guardian.ts

**Example:**
```typescript
// Don't block token-efficiency.md (blog post about token optimization)
if (filePath.includes('token-efficiency.md')) {
  process.exit(0);  // Allow
}
```

---

## Design Principles

1. **Defense in Depth**: Multiple layers protect against different attack vectors
2. **Fail Secure**: Hook errors don't expose credentials (fail open for availability, but AI layer still protects)
3. **Clear Communication**: Error messages explain WHY and offer alternatives
4. **Pattern-Based**: Regex patterns catch variations and edge cases
5. **Maintainable**: Single source of truth for credential patterns

---

## Security Considerations

### Why Four Layers?

- **Layer 0 (Deny Rules)**: Hard permission boundary, fires before hooks, catches hook failures
- **Layer 1 (AI)**: Prevents accidental exposure, educates users
- **Layer 2 (Hook)**: Technical control with pattern matching, can't be bypassed by prompt manipulation
- **Layer 3 (Git)**: Prevents credentials from entering version control

### Attack Scenarios Prevented

1. **User accidentally requests .env**: Blocked by Layer 0 + 1 + 2
2. **Prompt injection attempts to read credentials**: Blocked by Layer 0 + 2
3. **AI error/confusion**: Blocked by Layer 0 + 2
4. **Hardcoded credentials in code**: Blocked by Layer 3
5. **Renamed credential files**: Caught by pattern matching (Layer 2)
6. **Hook failure/bug**: Still blocked by Layer 0 deny rules
7. **Destructive commands (rm -rf, mkfs, dd)**: Blocked by Layer 0 deny rules + bash-command-validator hook
8. **Pipe-to-shell attacks (curl|bash)**: Blocked by Layer 0 deny rules
9. **Force push / hard reset**: Blocked by Layer 0 deny rules
10. **Privilege escalation (sudo)**: Blocked by Layer 0 deny rules

---

## Implementation Timeline

- **2026-02-01**: Multi-layer credential protection implemented
- **Layer 1**: CLAUDE.md instructions added
- **Layer 2**: credential-guardian.ts hook created and registered
- **Layer 3**: Already existed (pre-commit hooks)
- **2026-02-13**: Security hardening audit
- **Layer 0**: Declarative deny rules added to settings.json (based on Trail of Bits claude-code-config)
- **bash-command-validator.ts**: Wired into PreToolUse Bash hooks (was dormant)
- **enforce-package-manager.ts**: Bun enforcement added
- **anti-rationalization.ts**: Stop hook added to prevent incomplete work

---

**Version:** 2.0.0
**Last Updated:** 2026-02-13
**Security Level:** Defense in Depth (4 layers)
