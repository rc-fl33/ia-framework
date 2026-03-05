# Credential Setup - Write

**Purpose:** Instructions for configuring OpenRouter API credentials for AI-assisted content writing

**Security:** All credentials MUST be stored in `.env` files ONLY - never hardcoded in code

---

## Quick Start

1. Create OpenRouter account at https://openrouter.ai
2. Generate API key from dashboard
3. Add to root `.env` file: `OPENROUTER_API_KEY=[insert your key here]`
4. Validate with: `/write-setup` (or directly: `bun run skills/write/scripts/setup.ts validate`)

---

## Service Integration: OpenRouter

**Used by:** This skill uses OpenRouter API for AI model access (content generation, research assistance, optional image generation).

**Setup Steps:**

1. **Create Account:**
   - Go to https://openrouter.ai
   - Sign up or log in with existing account
   - Navigate to API Keys section in dashboard

2. **Generate API Key:**
   - Click "Create API Key"
   - Set name (e.g., "IA Framework - Write Skill")
   - Copy key immediately (shown only once)
   - Note: Keys start with `sk-or-v1-`

3. **Configure Credential:**
   ```bash
   # Write Skill - Content creation with AI assistance
   OPENROUTER_API_KEY=[insert your openrouter api key here]
   ```

4. **Verification:** Run `/write-setup` or directly:
   ```bash
   bun run skills/write/scripts/setup.ts validate
   ```

**Required ENV Keys:**
- `OPENROUTER_API_KEY` - API key for OpenRouter AI model access

**Documentation:** https://openrouter.ai/docs

---

## Validation

After adding credentials, validate setup using the `/write-setup` slash command.

Or run the underlying script directly:

```bash
# Test credential loading and OpenRouter connection
bun run skills/write/scripts/setup.ts validate

# Expected output:
# ✅ OPENROUTER_API_KEY loaded
# ✅ Connected to OpenRouter API
# ✅ Credentials valid
```

---

## Security Best Practices

1. **Never commit .env files** - Already in .gitignore
2. **Key format verification** - OpenRouter keys start with `sk-or-v1-`
3. **Monitor usage** - Check dashboard for unexpected API calls
4. **Rotate if exposed** - Generate new key immediately if compromised
5. **Rate limits** - Monitor API quota in OpenRouter dashboard
6. **Minimum permissions** - Use standard API key (no admin privileges needed)
7. **Backup .env securely** - encrypted, offline storage only

---

## Troubleshooting

### Credentials Not Loading

1. **Check .env file exists:**
   ```bash
   ls -la .env
   ```

2. **Validate env var format:**
   - No spaces around `=`
   - No quotes around values
   - Format: `OPENROUTER_API_KEY=[insert key]`

3. **Test key validity:**
   ```bash
   curl -H "Authorization: Bearer $OPENROUTER_API_KEY" https://openrouter.ai/api/v1/auth/key
   ```

### Permission Errors

```bash
# Invalid key
❌ 401 Unauthorized - Key invalid or expired

# Insufficient credits
❌ 402 Payment Required - Add credits to OpenRouter account

# Rate limiting
❌ 429 Too Many Requests - Wait before retrying
```

### API Connection Issues

```bash
# Network connectivity
❌ Connection timeout - Check internet connection

# Invalid API endpoint
❌ 404 Not Found - Verify OpenRouter API endpoint URL

# Service outage
❌ 503 Service Unavailable - Check OpenRouter status page
```

---

## Related Documentation

- `.env.example` - Template with all available keys
- `skills/write/README.md` - Skill overview and setup
- `../../docs/standards/credential-handling-enforcement.md` - Framework security policies
- `../../private/docs/env-setup.md` - Specific service integration examples (private)

---

**Framework:** Intelligence Adjacent (IA)
**Last Updated:** 2026-02-03
