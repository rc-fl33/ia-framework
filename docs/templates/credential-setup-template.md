# Credential Setup - [Skill Name]

**Purpose:** Instructions for obtaining and configuring credentials for external service integrations

**Security:** All credentials MUST be stored in `.env` files ONLY - never hardcoded in code

---

## Quick Start

1. Copy `.env.example` to `.env` in skill directory (or use root `.env`)
2. Follow service-specific setup instructions below
3. Validate with: `bun run skills/[skill-name]/scripts/health-check.ts`

---

## Service Integration: [Service Name]

**Used by:** [Brief description of how this skill uses the service]

**Setup Steps:**

1. **Create Account:**
   - Go to [service URL]
   - Sign up for account ([free tier / paid / trial info])

2. **Generate API Key:**
   - Navigate to [path in service UI]
   - Create new API key/token
   - Copy the key (note: shown only once)

3. **Add to .env:**
   ```bash
   [SERVICE]_API_KEY=[insert your API key here]
   [SERVICE]_BASE_URL=[insert service URL here]
   ```

4. **Additional Configuration:**
   - [Any service-specific setup steps]
   - [Connection testing instructions]

**Required ENV Keys:**
- `[SERVICE]_API_KEY` - [Description of what this key does]
- `[SERVICE]_BASE_URL` - [Description - optional if not needed]

**Optional ENV Keys:**
- `[SERVICE]_OPTION` - [Description of optional configuration]

**Documentation:** [link to official service API docs]

---

## Multiple Service Integrations

If this skill integrates with multiple services, repeat the above pattern for each:

### Service Integration: [Second Service Name]

[Follow same structure as above]

---

## Validation

After adding credentials, validate setup:

```bash
# Test credential loading
bun run skills/[skill-name]/scripts/health-check.ts

# Or test specific service connection
bun run skills/[skill-name]/scripts/test-[service]-connection.ts
```

**Expected Output:**
```
✅ [SERVICE]_API_KEY loaded
✅ Connected to [Service Name]
✅ Credentials valid
```

---

## Security Best Practices

1. **Never commit .env files** - Already in .gitignore
2. **Use .env.example** as template with placeholder values only
3. **Rotate credentials** if exposed or compromised
4. **Use test/sandbox mode** during development
5. **Backup .env securely** - encrypted, offline storage only

---

## Placeholder Format

**IMPORTANT:** When creating `.env.example` files:

```bash
# ✅ CORRECT - Use placeholder format
[SERVICE]_API_KEY=[insert your API key here]

# ❌ INCORRECT - Don't use dots/ellipsis (triggers credential scanner)
[SERVICE]_API_KEY=...
[SERVICE]_API_KEY=[insert key]
```

---

## Credential Storage Patterns

**Framework Pattern:**
```
.env                           # Root credentials (shared across skills)
skills/[skill-name]/.env       # Skill-specific credentials (if isolated)
```

**Loading Priority:**
1. Skill-specific `.env` (if exists)
2. Root `.env`
3. System environment variables

**When to use skill-specific .env:**
- Skill requires unique credentials not shared with other skills
- Testing isolated credential loading
- Skill deployed independently

**When to use root .env:**
- Credentials shared across multiple skills
- Simplifies credential management
- Default pattern for most skills

---

## Troubleshooting

### Credentials Not Loading

1. **Check .env file exists:**
   ```bash
   ls -la .env
   ls -la skills/[skill-name]/.env
   ```

2. **Validate env var format:**
   - No spaces around `=`
   - No quotes around values (unless value contains spaces)
   - One variable per line

3. **Check loading priority:**
   - Skill-specific `.env` overrides root `.env`
   - System env vars override both

### Permission Errors

```bash
# Invalid credentials
❌ 401 Unauthorized - Check API key is correct

# Expired credentials
❌ 403 Forbidden - Regenerate API key

# Rate limiting
❌ 429 Too Many Requests - Wait or upgrade plan
```

---

## Related Documentation

- `.env.example` - Template with all available keys
- `skills/[skill-name]/README.md` - Skill overview and setup
- `docs/standards/credential-handling-enforcement.md` - Framework security policies
- `private/docs/env-setup.md` - Specific service integration examples (private)

---

## Template Usage

**For Skill Authors:**

1. Copy this template to `skills/[your-skill]/docs/adding-credentials.md`
2. Replace all `[placeholders]` with your specific service details
3. Remove sections not applicable to your skill
4. Keep the structure and security patterns intact

**Validation:**

Your credential doc will be validated against this template by:
- `tools/validation/validate-skill-credential-docs.ts` (automated)
- Pre-commit hooks (credential scanning)
- Framework health checks

---

**Framework:** Intelligence Adjacent (IA)
**Last Updated:** 2026-02-03
