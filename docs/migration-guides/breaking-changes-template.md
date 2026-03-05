---
title: Breaking Changes Migration Template
status: reference
severity: template
type: reference
---

# Breaking Changes Migration Template

Use this template when documenting breaking changes for framework updates.

---

## What Changed

**Brief description of what's different in this release.**

### Before (Old Behavior)
```
Old usage, command, or configuration
```

### After (New Behavior)
```
New usage, command, or configuration
```

## Why This Changed

**Explanation of the rationale:**
- Improved performance
- Better security
- Cleaner API
- Standards alignment

## Impact Assessment

- **Severity**: Breaking | Deprecated | Minor
- **Affected**: [List specific tools/skills/hooks]
- **Migration Effort**: Quick | Standard | Complex
- **Rollback**: Possible | Not recommended | N/A

## Step-by-Step Migration

### 1. Understand the Change
```
Explanation of what developers need to understand
```

### 2. Update Your Code
```bash
# Before
old_command arg1 arg2

# After
new_command arg1 arg2
```

### 3. Test Changes
```bash
# Run tests to verify
bun test your_test_file.ts
```

### 4. Deploy
```bash
# Deploy to production
git commit -m "update: migrate to new API"
git push
```

## Common Issues

### Issue: [Symptom]
**Cause:** What causes this issue
**Solution:** How to fix it

```bash
# Example resolution
command to fix
```

### Issue: [Symptom 2]
**Cause:** Root cause
**Solution:** Resolution steps

## Workarounds (if needed)

If you need to delay updating:

```typescript
// Temporary workaround
// Use old method but mark as deprecated
function oldWay() {
  console.warn('Deprecated: Use newWay() instead');
  return newWay();
}
```

**Note:** Workarounds are temporary. Plan to upgrade as soon as feasible.

## Full Migration Checklist

- [ ] Read breaking change description above
- [ ] Update code using old pattern
- [ ] Run test suite locally
- [ ] Test in staging environment
- [ ] Deploy to production
- [ ] Monitor for issues
- [ ] Mark old code as removed

## Need Help?

**Resources:**
- Full documentation: [link]
- Code examples: [link]
- Issue tracker: [link]

**Contact:**
- Open an issue on GitHub
- Post in discussions
- Email framework team

## Timeline

- **Available in:** Version X.Y.Z
- **Old version deprecated:** Version X.Y.Z
- **Old version removed:** Version X+1.0.0
- **Planned removal date:** [Date]

## Related Changes

- Related breaking change 1: [link]
- Related breaking change 2: [link]
- Related feature: [link]

---

## FAQ

**Q: How long will the old way work?**
A: Until version X+1.0.0 (approximately [date])

**Q: Will there be warnings?**
A: Yes, console warnings will appear when using deprecated patterns

**Q: Can I skip this update?**
A: You can for now, but recommend updating for compatibility

---

**Version:** X.Y.Z
**Release Date:** [Date]
**Estimated Migration Time:** [Time]
**Difficulty:** [Easy | Moderate | Complex]
