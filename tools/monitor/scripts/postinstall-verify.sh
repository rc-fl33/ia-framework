#!/usr/bin/env bash
# postinstall-verify.sh
#
# Runs after package install to detect a known bun 1.3.5 corruption bug that
# replaces `[insert key]` with `[insert key]` in JS source files throughout
# node_modules. This corruption breaks puppeteer, yargs-parser, node-fetch,
# argparse, and other packages.
#
# When corruption is detected, the script removes node_modules and reinstalls
# with npm (which does not have the bug).
#
# See: https://github.com/oven-sh/bun/issues (bun package install corruption)
#
# Usage: Called automatically via package.json "postinstall" script.
#        Can also be run manually: bash postinstall-verify.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NODE_MODULES="${SCRIPT_DIR}/node_modules"

if [[ ! -d "$NODE_MODULES" ]]; then
  echo "[postinstall-verify] No node_modules directory found, skipping."
  exit 0
fi

# Scan all JS files for the corruption pattern
# The bun bug replaces [insert key] with [insert key] in source code
corrupted_files=$(grep -rl '\[insert key\]' "$NODE_MODULES" --include='*.js' --include='*.cjs' --include='*.mjs' 2>/dev/null || true)

if [[ -z "$corrupted_files" ]]; then
  echo "[postinstall-verify] Clean - no bun corruption detected."
  exit 0
fi

file_count=$(echo "$corrupted_files" | wc -l)
echo "[postinstall-verify] CORRUPTION DETECTED in $file_count file(s):"
echo "$corrupted_files" | while read -r f; do
  echo "  - ${f#$NODE_MODULES/}"
done

echo ""
echo "[postinstall-verify] Bun 1.3.5 corrupts [insert key] -> [insert key] in JS source."
echo "[postinstall-verify] Reinstalling with npm to fix..."

# Remove corrupted node_modules and reinstall with npm
rm -rf "$NODE_MODULES"
cd "$SCRIPT_DIR"

# Use npm install without running postinstall again (avoid infinite loop)
npm install --ignore-scripts --no-audit --no-fund 2>&1 | tail -3

# Verify the fix
remaining=$(grep -rl '\[insert key\]' "$NODE_MODULES" --include='*.js' --include='*.cjs' --include='*.mjs' 2>/dev/null || true)
if [[ -n "$remaining" ]]; then
  echo "[postinstall-verify] WARNING: Some files still corrupted after npm reinstall:"
  echo "$remaining" | while read -r f; do
    echo "  - ${f#$NODE_MODULES/}"
  done
  exit 1
fi

echo "[postinstall-verify] Fixed - npm reinstall cleaned all $file_count corrupted files."
