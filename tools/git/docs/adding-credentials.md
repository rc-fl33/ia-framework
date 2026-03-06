# Credential Setup - Git

**Purpose:** Instructions for configuring GitHub API credentials for git push/pull operations

**Security:** All credentials MUST be stored in `.env` files ONLY - never hardcoded in code

---

## Quick Start

1. Generate GitHub personal access token at https://github.com/settings/tokens
2. Add to root `.env` file: `GITHUB_TOKEN=[insert your token here]`
3. Configure repository paths in `.env`
4. Validate with: `bun run tools/git/scripts/setup.ts validate`

---

## Service Integration: GitHub

**Used by:** This skill uses GitHub API for push/pull operations to private and public repositories.

**Setup Steps:**

1. **Generate Personal Access Token:**
   - Go to https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"
   - Set expiration (recommend 90 days for security)
   - Select scopes:
     - `repo` (full control of private repositories)
     - `workflow` (if pushing to workflows)
   - Generate and copy token (shown only once)

2. **Configure Repository Paths:**
   ```bash
   # GitHub authentication
   GITHUB_TOKEN=[insert your github token here]

   # Private repository configuration
   GIT_PUSH_REPO_PATH=~/ia-framework
   GIT_PUSH_REMOTE=origin
   GIT_PUSH_BRANCH=main

   # Public repository configuration (optional)
   GIT_PUBLIC_REPO_PATH=/home/groves/ia-framework-public
   GIT_PUBLIC_REMOTE=origin
   GIT_PUBLIC_BRANCH=main
   ```

3. **Verification:**
   ```bash
   bun run tools/git/scripts/setup.ts validate
   ```

**Required ENV Keys:**
- `GITHUB_TOKEN` - Personal access token for GitHub API authentication
- `GIT_PUSH_REPO_PATH` - Path to your private repository
- `GIT_PUSH_REMOTE` - Git remote name (typically `origin`)
- `GIT_PUSH_BRANCH` - Branch to push to (typically `main`)

**Optional ENV Keys:**
- `GIT_PUBLIC_REPO_PATH` - Path to public repository (for `/git-public` command)
- `GIT_PUBLIC_REMOTE` - Public repository remote name
- `GIT_PUBLIC_BRANCH` - Public repository branch

**Documentation:** https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token

---

## Validation

After adding credentials, validate setup:

```bash
# Test credential loading and GitHub connection
bun run tools/git/scripts/setup.ts validate

# Expected output:
# ✅ GITHUB_TOKEN loaded
# ✅ Connected to GitHub
# ✅ Repository paths configured
# ✅ Credentials valid
```

---

## Security Best Practices

1. **Never commit .env files** - Already in .gitignore
2. **Use token expiration** - Set 90-day expiration and rotate regularly
3. **Minimum scopes** - Only enable `repo` and `workflow` scopes
4. **Rotate if exposed** - Generate new token immediately if compromised
5. **SSH vs HTTPS** - This skill uses HTTPS + token; SSH keys are separate
6. **Rate limits** - GitHub API has 5000 requests/hour when authenticated
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
   - Format: `GITHUB_TOKEN=[insert token]`

3. **Test token validity:**
   ```bash
   curl -H "Authorization: Bearer $GITHUB_TOKEN" https://api.github.com/user
   ```

### Permission Errors

```bash
# Invalid token
❌ 401 Unauthorized - Token invalid or expired

# Insufficient scopes
❌ 403 Forbidden - Token missing required scopes (add 'repo')

# Rate limiting
❌ 403 API rate limit exceeded - Wait or use authenticated requests
```

### Repository Path Issues

```bash
# Path doesn't exist
❌ Repository path not found - Check GIT_PUSH_REPO_PATH

# Not a git repository
❌ Not a git repository - Initialize with 'git init' first

# Wrong remote
❌ Remote not found - Verify GIT_PUSH_REMOTE matches 'git remote -v'
```

---

## Related Documentation

- `.env.example` - Template with all available keys
- `tools/git/README.md` - Skill overview and setup
- `../../docs/standards/credential-handling-enforcement.md` - Framework security policies
- `../../private/docs/env-setup.md` - Specific service integration examples (private)

---

**Framework:** Intelligence Adjacent (IA)
**Last Updated:** 2026-02-03
