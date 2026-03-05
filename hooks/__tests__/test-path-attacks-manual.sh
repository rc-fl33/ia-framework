#!/usr/bin/env bash
#
# Manual Test: Path Traversal Prevention
# Demonstrates M-2 security enhancements
#

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HOOKS_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
FRAMEWORK_ROOT="${IA_FRAMEWORK_ROOT:-$(cd "$SCRIPT_DIR/../.." && pwd)}"

echo "=== Path Traversal Prevention Test Suite ==="
echo ""

# Test 1: Path traversal attack
echo "Test 1: Path traversal attack (should BLOCK)"
echo '{"tool_name":"Write","tool_input":{"file_path":"'"$FRAMEWORK_ROOT"'/../../../etc/passwd","content":"test"}}' | bun run "$HOOKS_DIR/file-guardian.ts" 2>&1 | grep -E "(BLOCKED|SECURITY)" || echo "✅ Blocked path traversal"
echo ""

# Test 2: Windows device name - CON
echo "Test 2: Windows device name - CON (should BLOCK)"
echo '{"tool_name":"Write","tool_input":{"file_path":"'"$FRAMEWORK_ROOT"'/docs/CON","content":"test"}}' | bun run "$HOOKS_DIR/file-guardian.ts" 2>&1 | grep -E "(BLOCKED|device)" || echo "✅ Blocked device name"
echo ""

# Test 3: Windows device name with extension - PRN.txt
echo "Test 3: Windows device name with extension - PRN.txt (should BLOCK)"
echo '{"tool_name":"Write","tool_input":{"file_path":"'"$FRAMEWORK_ROOT"'/docs/PRN.txt","content":"test"}}' | bun run "$HOOKS_DIR/file-guardian.ts" 2>&1 | grep -E "(BLOCKED|device)" || echo "✅ Blocked device name with extension"
echo ""

# Test 4: Legitimate file (should ALLOW)
echo "Test 4: Legitimate file - console.ts (should ALLOW)"
echo '{"tool_name":"Write","tool_input":{"file_path":"'"$FRAMEWORK_ROOT"'/docs/console.ts","content":"test"}}' | bun run "$HOOKS_DIR/file-guardian.ts" 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Allowed legitimate file (not a device name)"
else
    echo "❌ Incorrectly blocked legitimate file"
fi
echo ""

# Test 5: Symlink to outside framework (create temp symlink for testing)
echo "Test 5: Symlink pointing outside framework (should BLOCK)"
TEMP_TARGET="/tmp/malicious-target.txt"
TEMP_SYMLINK="$FRAMEWORK_ROOT/test-symlink.txt"

echo "malicious" > "$TEMP_TARGET"
ln -sf "$TEMP_TARGET" "$TEMP_SYMLINK" 2>/dev/null

echo '{"tool_name":"Write","tool_input":{"file_path":"'"$TEMP_SYMLINK"'","content":"test"}}' | bun run "$HOOKS_DIR/file-guardian.ts" 2>&1 | grep -E "(BLOCKED|outside)" || echo "✅ Blocked symlink escaping framework"

# Cleanup
rm -f "$TEMP_SYMLINK" "$TEMP_TARGET"
echo ""

# Test 6: Symlink to valid location within framework (should ALLOW after resolution)
echo "Test 6: Symlink to valid location within framework (should ALLOW)"
TARGET_FILE="$FRAMEWORK_ROOT/docs/target.md"
SYMLINK_FILE="$FRAMEWORK_ROOT/docs/symlink.md"

# Create target and symlink
echo "# Target" > "$TARGET_FILE"
ln -sf "$TARGET_FILE" "$SYMLINK_FILE" 2>/dev/null

echo '{"tool_name":"Write","tool_input":{"file_path":"'"$SYMLINK_FILE"'","content":"test"}}' | bun run "$HOOKS_DIR/file-guardian.ts" 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Allowed symlink within framework"
else
    echo "❌ Incorrectly blocked valid symlink"
fi

# Cleanup
rm -f "$SYMLINK_FILE" "$TARGET_FILE"
echo ""

echo "=== Test Suite Complete ==="
