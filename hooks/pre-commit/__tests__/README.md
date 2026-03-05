# Validator Unit Tests

Unit tests for pre-commit validators using test fixtures and isolated validation logic.

## Test Structure

```
__tests__/
├── fixtures/               # Test fixtures
│   ├── frontmatter/       # Frontmatter validation fixtures
│   ├── cross-refs/        # Cross-reference validation fixtures
│   └── paths/             # Path validation fixtures
├── 01-validate-frontmatter.test.ts
├── 02-validate-cross-refs.test.ts
├── 03-validate-paths.test.ts
├── run-tests.sh           # Test runner
└── README.md              # This file
```

## Running Tests

### Run All Tests

```bash
./hooks/pre-commit/__tests__/run-tests.sh
```

### Run Individual Tests

```bash
bun run hooks/pre-commit/__tests__/01-validate-frontmatter.test.ts
bun run hooks/pre-commit/__tests__/02-validate-cross-refs.test.ts
bun run hooks/pre-commit/__tests__/03-validate-paths.test.ts
```

## Test Coverage

### 01-validate-frontmatter.test.ts

Tests YAML frontmatter schema validation:

- ✓ Valid skill frontmatter
- ✓ Invalid skill (missing required field)
- ✓ Invalid skill (wrong type)
- ✓ File without frontmatter
- ✓ Valid blog post frontmatter

### 02-validate-cross-refs.test.ts

Tests cross-reference validation between CLAUDE.md and skills:

- ✓ CLAUDE.md references existing skills
- ✓ Public skills are documented
- ✓ Private skills are not required in CLAUDE.md
- ✓ Classification field is parsed correctly
- ✓ Full validation passes for valid setup

### 03-validate-paths.test.ts

Tests file path reference validation:

- ✓ Path extraction from markdown
- ✓ Valid paths are recognized
- ✓ Invalid paths are detected
- ✓ Absolute paths are flagged
- ✓ URLs and examples are skipped

## Test Fixtures

### Frontmatter Fixtures

- `valid-skill.md`: Complete valid skill frontmatter
- `invalid-skill-missing-name.md`: Missing required field
- `invalid-skill-wrong-type.md`: Wrong field type
- `no-frontmatter.md`: No frontmatter
- `valid-blog-post.md`: Valid blog post frontmatter

### Cross-Refs Fixtures

- `CLAUDE.md`: Sample documentation
- `skills/test-skill-1/`: Public skill (should be documented)
- `skills/test-skill-2/`: Public skill (should be documented)
- `skills/test-skill-private/`: Private skill (should not be documented)

### Path Fixtures

- `valid-paths.md`: Valid relative paths
- `invalid-paths.md`: Non-existent paths
- `absolute-path.md`: Absolute path references

## Exit Codes

- `0`: All tests passed
- `1`: One or more tests failed

## Adding New Tests

1. Create test file: `NN-test-name.test.ts`
2. Add fixtures in `fixtures/` directory
3. Add test file to `run-tests.sh`
4. Document in this README

## Test Framework

Tests use a simple custom test framework with:

- `test(name, fn)`: Define a test case
- `assert(condition, message)`: Assert conditions
- Automatic result collection and reporting
- Exit codes for CI integration

## Integration with Pre-Commit

These unit tests validate the core logic of validators independently. The validators themselves are integration-tested through the pre-commit hook when committing changes.

## Continuous Validation

Run tests before committing validator changes:

```bash
./hooks/pre-commit/__tests__/run-tests.sh && git commit
```
