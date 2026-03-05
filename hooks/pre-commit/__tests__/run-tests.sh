#!/bin/bash
# Test runner for validator unit tests

echo "========================================="
echo "Running Validator Unit Tests"
echo "========================================="
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEST_FILES=(
  "01-validate-frontmatter.test.ts"
  "02-validate-cross-refs.test.ts"
  "03-validate-paths.test.ts"
)

TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

for test_file in "${TEST_FILES[@]}"; do
  echo "Running: $test_file"
  echo "-----------------------------------------"

  if bun run "$SCRIPT_DIR/$test_file"; then
    ((PASSED_TESTS++))
  else
    ((FAILED_TESTS++))
  fi

  ((TOTAL_TESTS++))
  echo ""
done

echo "========================================="
echo "Test Suite Summary"
echo "========================================="
echo "Total test suites: $TOTAL_TESTS"
echo "Passed: $PASSED_TESTS"
echo "Failed: $FAILED_TESTS"
echo ""

if [ $FAILED_TESTS -gt 0 ]; then
  echo "❌ Some tests failed"
  exit 1
else
  echo "✅ All test suites passed!"
  exit 0
fi
