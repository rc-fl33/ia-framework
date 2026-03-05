---
title: Credential Security Update Migration Template
status: reference
severity: template
type: reference
---

# Credential Security Update Migration Template

Use this template for security updates involving credential handling.

---

## Security Alert 🔒

**Severity:** CRITICAL
**Type:** Security Fix
**Action Required:** Update immediately

## What Was Fixed

**Description of the security vulnerability and how it's fixed.**

### Vulnerability Details
- **Affected Component:** [Component name]
- **Risk Level:** [Critical | High | Medium]
- **Exposure Window:** [When vulnerability was possible]
- **Attack Vector:** [How it could be exploited]

### The Fix
- **Fixed in Version:** X.Y.Z
- **Patch Date:** [Date]
- **Time to Apply:** < 5 minutes

## Potential Impact

**If you haven't updated:**
- [ ] Credentials may be exposed in [location]
- [ ] Unauthorized access possible to [service]
- [ ] Logs may contain sensitive data
- [ ] Multi-instance systems at higher risk

## Immediate Actions Required

### 1. Update Framework Immediately
```bash
claude /framework-update
# Select "Apply critical + standard updates"
# Do NOT skip this security update
```

### 2. Audit Logs (If Needed)
```bash
# Check if credentials were exposed
grep -i "password\|token\|key" ~/.claude/logs/* 2>/dev/null | head -20

# If found, review and clean up
# Do NOT commit these files to git
```

### 3. Credential Rotation (If Needed)

**Check manifest for guidance:**
```bash
grep "credentials_to_rotate" .framework-manifest.yaml
```

**If credentials were exposed:**
```bash
# 1. Change credentials in the exposed service
#    (e.g., GitHub tokens, API keys)
# 2. Update .env file with new credentials
# 3. Verify framework-update has new protection

# Example (use placeholder and replace before using):
export NEW_GITHUB_TOKEN='[insert key]'
```

### 4. Verify Fix Applied
```bash
# Confirm hook is updated
ls -la hooks/pre-commit/credential-guardian.ts
bun hooks/pre-commit/credential-guardian.ts --version

# Check framework integrity
bun tools/validation/full-framework-audit.ts
```

## Prevention Going Forward

**What's now protected:**
- Credential-guardian hook prevents accidental credential reads
- Pre-commit hooks block credential files from git
- Session files use secure path resolution
- Environment variables stay in .env (never logged)

**Best practices:**
1. Never commit credentials to git
2. Always use .env for secrets
3. Review .env.example for required variables
4. Use credential rotation regularly

## Rollback (Not Recommended)

If you encounter issues:

```bash
# This removes the security fix - NOT RECOMMENDED
bun tools/claude-md-sync/rollback.ts 0

# You should instead:
# 1. Report the issue
# 2. Seek help (don't rollback)
# 3. Apply the fix with help from team
```

## Audit Results

**After applying this update:**
```bash
# Verify credential guardian is working
echo '{"tool_name":"Read","tool_input":{"file_path":".env"}}' | \
  bun hooks/credential-guardian.ts

# Should block or warn about .env access
```

## Questions & Support

**Is my account compromised?**
- Review git history: `git log --follow -- <credential_file>`
- Check if file was ever committed: `git log --all --source --full-history -- .env`
- Rotate credentials immediately if exposed

**How do I know if credentials leaked?**
- Check framework logs for credential mentions
- Review session files for sensitive data
- Monitor services for unusual activity

**What if I have multiple IA instances?**
- Apply this update to ALL instances
- Rotate credentials across all instances
- Set IA_FRAMEWORK_ROOT explicitly to avoid conflicts

## Related Security Updates

- [Previous security fix 1](link)
- [Previous security fix 2](link)
- [Credential handling docs](link)

## Timeline

- **Vulnerability Discovered:** [Date]
- **Fix Released:** [Date]
- **Current Status:** [Active/Monitoring/Resolved]
- **Sunset Date:** N/A (permanent security measure)

## Compliance Notes

- Fixes SOC 2 compliance issue: [Item]
- Aligns with OWASP: [Recommendation]
- ISO 27001 requirement: [Control]

---

## Checklist

- [ ] Read security alert above
- [ ] Run `claude /framework-update`
- [ ] Apply critical security updates
- [ ] Audit logs if needed
- [ ] Rotate credentials if exposed
- [ ] Verify fix applied
- [ ] Run health check

---

**Severity:** CRITICAL - APPLY IMMEDIATELY
**Security Impact:** High
**User Action Required:** YES
**Time to Apply:** < 5 minutes
