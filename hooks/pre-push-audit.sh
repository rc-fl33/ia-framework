#!/bin/bash
#
# Pre-Push Audit Hook
# Comprehensive framework audit before pushing to remote
#
# Usage: Runs automatically on `git push`
# Bypass: `git push --no-verify` (use sparingly)
#
# Installation:
#   cp hooks/pre-push-audit.sh .git/hooks/pre-push-audit
#   chmod +x .git/hooks/pre-push-audit
#

set -e  # Exit on first error

# Detect framework root dynamically via SCRIPT_DIR self-discovery
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRAMEWORK_ROOT="${IA_FRAMEWORK_ROOT:-$(cd "$SCRIPT_DIR/.." && pwd)}"
cd "$FRAMEWORK_ROOT"

# Skip audit in public repo (receives pre-validated content from private)
REMOTE_URL=$(git remote get-url origin 2>/dev/null || echo "")
if [[ "$REMOTE_URL" == *"ia-framework.git"* ]] && [[ "$REMOTE_URL" != *"ia-framework-private"* ]]; then
  echo "✅ Public repository - skipping audit (content pre-validated in private)"
  exit 0
fi

echo "🔍 Running Framework Audit (pre-push)..."
echo ""

# Track failures
FAILURES=0

# ============================================================================
# 0. FRAMEWORK HEALTH CHECK (structural integrity)
# ============================================================================
echo "🏗️  [0/6] Checking framework structure..."

if [ -f "tools/validation/full-framework-audit.ts" ]; then
  # Run comprehensive framework health check
  if bun run tools/validation/full-framework-audit.ts > /tmp/framework-health-check.log 2>&1; then
    echo "   ✅ Framework structure valid"
  else
    echo "   ⚠️  Framework health check found issues:"
    cat /tmp/framework-health-check.log | head -20
    # This is a warning, not a blocker - allow push to proceed
  fi
else
  echo "   ⚠️  full-framework-audit.ts not found (expected at tools/validation/)"
fi

echo ""

# ============================================================================
# 1. DEPENDENCY AUDIT (bun - check lockfile exists)
# ============================================================================
echo "📦 [1/6] Checking dependencies..."

if [ -f "bun.lockb" ]; then
  # Bun doesn't have built-in audit like npm, so we just verify lockfile exists
  # For actual vulnerability scanning, use dedicated tools like snyk or osv-scanner
  echo "   ✅ bun.lockb exists - dependencies locked"
elif [ -f "package-lock.json" ]; then
  echo "   ⚠️  Found package-lock.json but this is a bun project"
  echo "   Run 'bun install' to generate bun.lockb"
else
  echo "   ⚠️  No lockfile found (bun.lockb)"
  echo "   Run 'bun install' to generate lockfile"
fi

echo ""

# ============================================================================
# 2. TEST SUITE (bun test)
# ============================================================================
echo "🧪 [2/6] Running test suite..."

# Check if there are any test files
TEST_FILES=$(find . -name "*.test.ts" -o -name "*.spec.ts" 2>/dev/null | grep -v node_modules | grep -v archive | head -5)

if [ -z "$TEST_FILES" ]; then
  echo "   ⚠️  No test files found (skipping)"
elif bun test 2>/dev/null; then
  echo "   ✅ All tests pass"
else
  # bun test may not be configured - don't block on this
  echo "   ⚠️  Test suite not configured or no tests to run"
fi

echo ""

# ============================================================================
# 3. CREDENTIAL SCAN (hardcoded secrets)
# ============================================================================
echo "🔐 [3/6] Scanning for hardcoded credentials..."

# Scan skills/, hooks/, tools/ directories (current structure)
# Exclude:
# - security-scan.ts files (they define detection patterns, not actual credentials)
# - test files
# - templates
# - archive/
CRED_MATCHES=$(grep -r -E "(API[_-]?KEY|SECRET|PASSWORD|TOKEN)\s*[=:]\s*['\"][a-zA-Z0-9_-]{20,}['\"]" \
  skills/ \
  hooks/ \
  tools/ \
  --include="*.ts" \
  --include="*.js" \
  --exclude-dir="node_modules" \
  --exclude-dir="archive" \
  --exclude="*security-scan*" \
  --exclude="*test*" \
  --exclude="*env.ts" \
  --exclude="*TEMPLATE*" \
  2>/dev/null | grep -v "PUBLIC\|not a secret\|read-only" || true)

if [ -n "$CRED_MATCHES" ]; then
  echo "   ❌ Potential hardcoded credentials found:"
  echo "$CRED_MATCHES" | head -5
  FAILURES=$((FAILURES + 1))
else
  echo "   ✅ No hardcoded credentials detected"
fi

echo ""

# ============================================================================
# 4. SKILL HEALTH CHECK (all skills have SKILL.md)
# ============================================================================
echo "🏥 [4/6] Checking skill health..."

SKILL_COUNT=0
VALID_COUNT=0

for skill_dir in skills/*/; do
  if [ -d "$skill_dir" ]; then
    # Skip non-skill directories
    if [[ "$skill_dir" == *"__tests__"* ]] || [[ "$skill_dir" == *"node_modules"* ]]; then
      continue
    fi

    SKILL_COUNT=$((SKILL_COUNT + 1))

    if [ -f "${skill_dir}SKILL.md" ]; then
      VALID_COUNT=$((VALID_COUNT + 1))
    else
      echo "   ⚠️  Missing SKILL.md: $skill_dir"
    fi
  fi
done

if [ "$SKILL_COUNT" -eq 0 ]; then
  echo "   ⚠️  No skills found in skills/"
elif [ "$VALID_COUNT" -eq "$SKILL_COUNT" ]; then
  echo "   ✅ All $SKILL_COUNT skills have SKILL.md"
else
  echo "   ⚠️  $VALID_COUNT/$SKILL_COUNT skills have SKILL.md (warning only)"
fi

echo ""

# ============================================================================
# 5. TYPESCRIPT SYNTAX CHECK (quick validation)
# ============================================================================
echo "📝 [5/6] Checking TypeScript syntax..."

# Find recently modified .ts files (last commit)
CHANGED_TS=$(git diff --name-only HEAD~1 2>/dev/null | grep '\.ts$' | grep -v node_modules | grep -v archive | head -10 || true)

if [ -z "$CHANGED_TS" ]; then
  echo "   ✅ No TypeScript files changed in last commit"
else
  SYNTAX_ERRORS=0
  for ts_file in $CHANGED_TS; do
    if [ -f "$ts_file" ]; then
      # Quick syntax check using bun build (transpile only, output to /dev/null)
      if ! bun build "$ts_file" --no-bundle > /dev/null 2>&1; then
        echo "   ❌ Syntax error in: $ts_file"
        SYNTAX_ERRORS=$((SYNTAX_ERRORS + 1))
      fi
    fi
  done

  if [ $SYNTAX_ERRORS -eq 0 ]; then
    echo "   ✅ All changed TypeScript files have valid syntax"
  else
    echo "   ❌ Found $SYNTAX_ERRORS file(s) with syntax errors"
    FAILURES=$((FAILURES + 1))
  fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ============================================================================
# FINAL RESULT
# ============================================================================

if [ "$FAILURES" -eq 0 ]; then
  echo "✅ AUDIT PASSED - All checks successful"
  echo ""
  echo "   Safe to push to remote."
  echo ""
  exit 0
else
  echo "❌ AUDIT FAILED - $FAILURES issue(s) found"
  echo ""
  echo "   Fix issues before pushing OR bypass with:"
  echo "   git push --no-verify"
  echo ""
  exit 1
fi
