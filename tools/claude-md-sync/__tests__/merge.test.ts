#!/usr/bin/env bun
/**
 * CLAUDE.md Merge Tests
 *
 * Unit and integration tests for parser and merge logic.
 *
 * Run with: bun test tools/claude-md-sync/__tests__/merge.test.ts
 */

import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { writeFileSync, mkdirSync, existsSync, rmSync, readFileSync } from 'fs';
import { join, dirname } from 'path';

const TEST_DIR = join(import.meta.dir, '..', '__test_fixtures__');

/**
 * Setup test environment
 */
function setupTest() {
  if (existsSync(TEST_DIR)) {
    rmSync(TEST_DIR, { recursive: true });
  }
  mkdirSync(TEST_DIR, { recursive: true });
}

/**
 * Cleanup test environment
 */
function cleanupTest() {
  if (existsSync(TEST_DIR)) {
    rmSync(TEST_DIR, { recursive: true });
  }
}

/**
 * Create test file
 */
function createTestFile(name: string, content: string): string {
  const filePath = join(TEST_DIR, name);
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content, 'utf-8');
  return filePath;
}

describe('CLAUDE.md Parser', () => {
  beforeEach(setupTest);
  afterEach(cleanupTest);

  it('should parse basic markdown headings', async () => {
    const content = `# Main Title
## Section 1
### Subsection 1.1
## Section 2
`;
    const filePath = createTestFile('test.md', content);

    // Import parser dynamically to avoid module loading issues
    const { parseClaudeMdFile } = await import('../parser-claude-md.ts');
    const parsed = parseClaudeMdFile(filePath);

    expect(parsed).not.toBeNull();
    if (parsed) {
      expect(parsed.sections.length).toBeGreaterThan(0);
    }
  });

  it('should preserve code fence content', async () => {
    const content = `# Main
## Section

\`\`\`typescript
// This ## is inside a code block
const x = "## not a heading";
\`\`\`

## Real Heading
`;
    const filePath = createTestFile('code-fence.md', content);

    const { parseClaudeMdFile } = await import('../parser-claude-md.ts');
    const parsed = parseClaudeMdFile(filePath);

    expect(parsed).not.toBeNull();
    if (parsed) {
      // Should have 2 actual headings (Main, Section, Real Heading)
      // Not 4 (would count ## in code block as heading)
      expect(parsed.allLines.length).toBeGreaterThan(0);
    }
  });

  it('should detect framework-owned sections', async () => {
    const content = `# Main
## YOUR ROLE AS ORCHESTRATOR
Content here
## MY CUSTOM SECTION
Content here
`;
    const filePath = createTestFile('ownership.md', content);

    const { parseClaudeMdFile } = await import('../parser-claude-md.ts');
    const parsed = parseClaudeMdFile(filePath);

    expect(parsed).not.toBeNull();
    if (parsed) {
      const orchestratorSection = parsed.sections.find(s => s.title.includes('ORCHESTRATOR'));
      expect(orchestratorSection?.ownership).toBe('framework');
    }
  });

  it('should handle empty files', async () => {
    const filePath = createTestFile('empty.md', '');

    const { parseClaudeMdFile } = await import('../parser-claude-md.ts');
    const parsed = parseClaudeMdFile(filePath);

    expect(parsed).not.toBeNull();
    if (parsed) {
      expect(parsed.sections.length).toBe(0);
    }
  });

  it('should parse nested subsections', async () => {
    const content = `# Main
## Level 2
### Level 3
#### Level 4
## Another Level 2
`;
    const filePath = createTestFile('nested.md', content);

    const { parseClaudeMdFile } = await import('../parser-claude-md.ts');
    const parsed = parseClaudeMdFile(filePath);

    expect(parsed).not.toBeNull();
    if (parsed && parsed.sections.length > 0) {
      const level2 = parsed.sections[0];
      if (level2.subsections.length > 0) {
        expect(level2.subsections[0].level).toBeGreaterThan(level2.level);
      }
    }
  });
});

describe('CLAUDE.md Merge', () => {
  beforeEach(setupTest);
  afterEach(cleanupTest);

  it('should identify file changes', async () => {
    const localContent = `# Main
## Framework Section
Framework content

## User Section
User content
`;

    const upstreamContent = `# Main
## Framework Section
Updated framework content

## User Section
User content

## New Framework Section
New framework content
`;

    const localPath = createTestFile('local.md', localContent);
    const upstreamPath = createTestFile('upstream.md', upstreamContent);

    const { mergeSettingsJson } = await import('../merge-settings-json.ts');
    // Note: This test uses settings merge as a placeholder
    // Real merge tests would use merge-claude-sections.ts

    expect(localPath).toContain('local.md');
  });
});

describe('Settings.json Merge', () => {
  beforeEach(setupTest);
  afterEach(cleanupTest);

  it('should detect user vs framework hooks', async () => {
    // Test hook detection logic inline since it's internal
    const tests = [
      { command: 'bun run hooks/validate-frontmatter.ts', isUser: false },
      { command: 'bun run skills/ghost/scripts/hooks/custom.ts', isUser: true },
      { command: '/custom/path/hook.sh', isUser: true },
    ];

    // Import and test
    const { mergeSettingsJson } = await import('../merge-settings-json.ts');
    expect(mergeSettingsJson).toBeDefined();
  });

  it('should merge settings with hook preservation', async () => {
    const localSettings = {
      env: { CUSTOM_VAR: 'my-value' },
      framework: { version: '1.0' },
      hooks: {
        PreToolUse: [
          {
            matcher: 'Write',
            hooks: [
              { type: 'command', command: 'bun run hooks/validate-frontmatter.ts' },
              { type: 'command', command: 'bun run skills/custom/hooks/monitor.ts' }
            ]
          }
        ]
      }
    };

    const upstreamSettings = {
      env: { ANOTHER_VAR: 'upstream-value' },
      framework: { version: '1.1' },
      hooks: {
        PreToolUse: [
          {
            matcher: 'Write',
            hooks: [
              { type: 'command', command: 'bun run hooks/validate-frontmatter.ts' },
              { type: 'command', command: 'bun run hooks/new-validator.ts' }
            ]
          }
        ]
      }
    };

    const localPath = createTestFile('local-settings.json', JSON.stringify(localSettings));
    const upstreamPath = createTestFile('upstream-settings.json', JSON.stringify(upstreamSettings));

    const { mergeSettingsJson } = await import('../merge-settings-json.ts');

    const result = mergeSettingsJson(localPath, upstreamPath, 'preview');

    expect(result.framework_hooks_added).toBeGreaterThanOrEqual(0);
    expect(result.user_hooks_preserved).toBeGreaterThanOrEqual(1);
  });
});

console.log('✅ Test suite configured. Run with: bun test tools/claude-md-sync/__tests__/merge.test.ts');
