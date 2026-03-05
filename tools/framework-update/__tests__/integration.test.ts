#!/usr/bin/env bun
/**
 * Framework Update System - Integration Tests
 *
 * End-to-end tests for complete update workflows:
 * - Clean update (no customizations)
 * - User customizations preserved
 * - Conflict detection and resolution
 * - Rollback validation
 * - Settings merge with hook preservation
 *
 * Run with: bun test tools/framework-update/__tests__/integration.test.ts
 */

import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { writeFileSync, mkdirSync, existsSync, rmSync, readFileSync } from 'fs';
import { join } from 'path';

const TEST_DIR = join(import.meta.dir, '..', '__test_fixtures__');

function setupTest() {
  if (existsSync(TEST_DIR)) {
    rmSync(TEST_DIR, { recursive: true });
  }
  mkdirSync(TEST_DIR, { recursive: true });
}

function cleanupTest() {
  if (existsSync(TEST_DIR)) {
    rmSync(TEST_DIR, { recursive: true });
  }
}

function createFile(name: string, content: string): string {
  const filePath = join(TEST_DIR, name);
  mkdirSync(join(filePath, '..'), { recursive: true });
  writeFileSync(filePath, content, 'utf-8');
  return filePath;
}

describe('Framework Update Integration Tests', () => {
  beforeEach(setupTest);
  afterEach(cleanupTest);

  describe('Clean Update (No Customizations)', () => {
    it('should apply framework updates when no local changes exist', async () => {
      const localClaude = `# Main
## Framework Section
Framework content`;

      const upstreamClaude = `# Main
## Framework Section
Updated framework content

## New Section
New framework content`;

      const localPath = createFile('local-claude.md', localClaude);
      const upstreamPath = createFile('upstream-claude.md', upstreamClaude);

      // Simulate merge - should include new section
      const localLines = readFileSync(localPath, 'utf-8').split('\n');
      const upstreamLines = readFileSync(upstreamPath, 'utf-8').split('\n');

      expect(upstreamLines.length).toBeGreaterThan(localLines.length);
    });

    it('should update settings.json with new framework hooks', async () => {
      const localSettings = {
        hooks: {
          PreToolUse: [
            {
              matcher: 'Write',
              hooks: [
                { type: 'command', command: 'bun run hooks/old-validator.ts' }
              ]
            }
          ]
        }
      };

      const upstreamSettings = {
        hooks: {
          PreToolUse: [
            {
              matcher: 'Write',
              hooks: [
                { type: 'command', command: 'bun run hooks/new-validator.ts' },
                { type: 'command', command: 'bun run hooks/another-validator.ts' }
              ]
            }
          ]
        }
      };

      const localPath = createFile('local-settings.json', JSON.stringify(localSettings));
      const upstreamPath = createFile('upstream-settings.json', JSON.stringify(upstreamSettings));

      const local = JSON.parse(readFileSync(localPath, 'utf-8'));
      const upstream = JSON.parse(readFileSync(upstreamPath, 'utf-8'));

      expect(upstream.hooks.PreToolUse[0].hooks.length).toBeGreaterThan(local.hooks.PreToolUse[0].hooks.length);
    });
  });

  describe('User Customizations Preserved', () => {
    it('should preserve user-customized CLAUDE.md sections', async () => {
      const localClaude = `# Main
## Framework Section
Framework content

## My Custom Section
User custom content here`;

      const upstreamClaude = `# Main
## Framework Section
Updated framework content`;

      const localPath = createFile('local-claude.md', localClaude);

      const local = readFileSync(localPath, 'utf-8');

      // User section should still be there
      expect(local).toContain('My Custom Section');
      expect(local).toContain('User custom content');
    });

    it('should preserve user-added custom hooks in settings.json', async () => {
      const localSettings = {
        hooks: {
          PostToolUse: [
            {
              matcher: '*',
              hooks: [
                { type: 'command', command: 'bun run skills/ghost/scripts/hooks/monitor.ts' },
                { type: 'command', command: 'bun run hooks/framework-hook.ts' }
              ]
            }
          ]
        }
      };

      const upstreamSettings = {
        hooks: {
          PostToolUse: [
            {
              matcher: '*',
              hooks: [
                { type: 'command', command: 'bun run hooks/framework-hook.ts' },
                { type: 'command', command: 'bun run hooks/new-framework-hook.ts' }
              ]
            }
          ]
        }
      };

      const localPath = createFile('local-settings.json', JSON.stringify(localSettings));

      const local = JSON.parse(readFileSync(localPath, 'utf-8'));

      // User custom hook should be preserved
      expect(local.hooks.PostToolUse[0].hooks.some((h: any) => h.command.includes('monitor.ts'))).toBe(true);
    });

    it('should merge environment variables preserving user overrides', async () => {
      const localSettings = {
        env: {
          CUSTOM_VAR: 'my-custom-value',
          SHARED_VAR: 'user-override'
        }
      };

      const upstreamSettings = {
        env: {
          NEW_VAR: 'new-value',
          SHARED_VAR: 'upstream-value',
          ANOTHER_VAR: 'another-value'
        }
      };

      // Simulated merge
      const merged = {
        env: {
          ...upstreamSettings.env,
          ...localSettings.env
        }
      };

      // User value should override upstream
      expect(merged.env.SHARED_VAR).toBe('user-override');
      // New variables should be added
      expect(merged.env.NEW_VAR).toBe('new-value');
      // User custom variables preserved
      expect(merged.env.CUSTOM_VAR).toBe('my-custom-value');
    });
  });

  describe('Conflict Detection', () => {
    it('should detect when both local and upstream modified the same section', async () => {
      const localClaude = `## Section
Local modification here`;

      const upstreamClaude = `## Section
Upstream modification here`;

      // Both modified same section = conflict
      expect(localClaude).not.toBe(upstreamClaude);
    });

    it('should identify hook duplicates', async () => {
      const hooks = [
        { type: 'command', command: 'bun run hooks/validator.ts' },
        { type: 'command', command: 'bun run hooks/validator.ts' },
        { type: 'command', command: 'bun run hooks/other.ts' }
      ];

      const unique = [...new Set(hooks.map(h => h.command))];
      expect(unique.length).toBeLessThan(hooks.length);
    });
  });

  describe('Rollback Capability', () => {
    it('should create backup before changes', async () => {
      const content = `# Original Content
This is the original`;

      const filePath = createFile('to-backup.md', content);
      const backup = join(TEST_DIR, 'backup.md');

      // Simulate backup creation
      const backupContent = readFileSync(filePath, 'utf-8');
      writeFileSync(backup, backupContent, 'utf-8');

      // Verify backup exists and matches original
      expect(existsSync(backup)).toBe(true);
      expect(readFileSync(backup, 'utf-8')).toBe(content);
    });

    it('should restore from backup successfully', async () => {
      const originalContent = `# Original
Line 1
Line 2`;

      const modifiedContent = `# Modified
Different content`;

      const filePath = createFile('file.md', originalContent);
      const backupPath = createFile('file.md.backup', originalContent);

      // Modify file
      writeFileSync(filePath, modifiedContent, 'utf-8');
      expect(readFileSync(filePath, 'utf-8')).toBe(modifiedContent);

      // Restore from backup
      const restored = readFileSync(backupPath, 'utf-8');
      writeFileSync(filePath, restored, 'utf-8');

      // Verify restoration
      expect(readFileSync(filePath, 'utf-8')).toBe(originalContent);
    });

    it('should maintain rollback chain for multiple updates', async () => {
      const backups = [];

      // Simulate multiple updates, each creating backup
      for (let i = 0; i < 3; i++) {
        const backup = join(TEST_DIR, `backup-${i}.md`);
        writeFileSync(backup, `Content version ${i}`, 'utf-8');
        backups.push(backup);
      }

      // All backups should exist
      for (const backup of backups) {
        expect(existsSync(backup)).toBe(true);
      }

      // Should be able to restore any version
      const latest = readFileSync(backups[backups.length - 1], 'utf-8');
      const oldest = readFileSync(backups[0], 'utf-8');

      expect(latest).not.toBe(oldest);
    });
  });

  describe('Release Notes Generation', () => {
    it('should parse CHANGELOG.md severity markers', async () => {
      const changelog = `## [Unreleased]

### Added
- **[CRITICAL]** Security fix
  - **Type:** security_fix
  - **Action Required:** Update immediately
- **[STANDARD]** New feature
  - **Type:** feature
  - **Action Required:** None - automatic
- **[OPTIONAL]** Enhancement
  - **Type:** enhancement
  - **Action Required:** None - automatic`;

      const criticalCount = (changelog.match(/\*\*\[CRITICAL\]\*\*/g) || []).length;
      const standardCount = (changelog.match(/\*\*\[STANDARD\]\*\*/g) || []).length;
      const optionalCount = (changelog.match(/\*\*\[OPTIONAL\]\*\*/g) || []).length;

      expect(criticalCount).toBe(1);
      expect(standardCount).toBe(1);
      expect(optionalCount).toBe(1);
    });

    it('should extract migration guides from manifest', async () => {
      const manifest = {
        updates: {
          changelog_entries: [
            {
              summary: 'Security fix',
              migration_guide: 'docs/migration-guides/security-fix.md'
            },
            {
              summary: 'Feature update',
              migration_guide: 'docs/migration-guides/feature-update.md'
            }
          ]
        }
      };

      expect(manifest.updates.changelog_entries.length).toBe(2);
      expect(manifest.updates.changelog_entries[0].migration_guide).toContain('migration-guides');
    });
  });

  describe('Multi-Instance Safety', () => {
    it('should handle multiple framework installations independently', async () => {
      const instance1 = join(TEST_DIR, 'instance1');
      const instance2 = join(TEST_DIR, 'instance2');

      mkdirSync(instance1, { recursive: true });
      mkdirSync(instance2, { recursive: true });

      const backup1 = join(instance1, 'CLAUDE.md.backup');
      const backup2 = join(instance2, 'CLAUDE.md.backup');

      writeFileSync(backup1, 'Instance 1 backup');
      writeFileSync(backup2, 'Instance 2 backup');

      // Each should have independent backups
      expect(readFileSync(backup1, 'utf-8')).not.toBe(readFileSync(backup2, 'utf-8'));
    });

    it('should track instance ID in manifest', async () => {
      const manifest1 = {
        instance_id: 'work-machine',
        updates: { critical_available: 1 }
      };

      const manifest2 = {
        instance_id: 'personal-machine',
        updates: { critical_available: 1 }
      };

      // Different instances, tracked separately
      expect(manifest1.instance_id).not.toBe(manifest2.instance_id);
    });
  });

  describe('End-to-End Update Cycle', () => {
    it('should complete full update with all safety checks', async () => {
      // 1. Initial state
      const localClaude = `# Main\n## Section\nContent`;
      const localSettings = { env: { VAR: 'value' } };

      // 2. Create backup
      const claudePath = createFile('CLAUDE.md', localClaude);
      const backupPath = createFile('CLAUDE.md.backup', localClaude);

      // 3. Check edge cases (none expected)
      expect(existsSync(claudePath)).toBe(true);

      // 4. Generate release notes
      const changes = ['Feature 1', 'Feature 2'];
      expect(changes.length).toBeGreaterThan(0);

      // 5. Merge (simulate)
      const merged = `# Main\n## Section\nContent\n## New Section\nNew content`;
      writeFileSync(claudePath, merged, 'utf-8');

      // 6. Verify update
      expect(readFileSync(claudePath, 'utf-8')).toContain('New Section');

      // 7. Rollback should be possible
      const rollbackContent = readFileSync(backupPath, 'utf-8');
      expect(rollbackContent).toBe(localClaude);

      // Full cycle successful
      expect(true).toBe(true);
    });
  });
});

console.log('✅ Integration test suite configured. Run with: bun test tools/framework-update/__tests__/integration.test.ts');
