#!/usr/bin/env bun
/**
 * Migration Script: Rename "Deep Dive" intro posts to "Overview"
 *
 * This script:
 * 1. Updates Ghost post titles via Admin API
 * 2. Updates local draft.md frontmatter
 * 3. Updates local metadata.json
 *
 * Run: bun run tools/migration/rename-deep-dive-to-overview.ts
 */

import { promises as fs } from 'fs';
import { join, resolve } from 'path';
import { updatePost } from '../../skills/ghost/scripts/ghost-admin';
import { config } from 'dotenv';

// Load environment
const envPath = resolve(process.cwd(), '.env');
config({ path: envPath });

const BLOG_ROOT = resolve(process.cwd(), 'blog', 'posts');

// Posts to rename: old title -> new title
const RENAMES = [
  {
    slug: '2025-12-20-agent-architecture-deep-dive',
    ghostId: '694768096da91c000197ee6f',
    oldTitle: 'Agent Architecture Deep Dive: Thin Wrappers That Route to Expertise',
    newTitle: 'Agent Architecture Overview: Thin Wrappers That Route to Expertise',
  },
  {
    slug: '2025-12-20-skills-system-deep-dive',
    ghostId: '694768066da91c000197ee60',
    oldTitle: 'Skills System Deep Dive: How Intelligence Adjacent Organizes Expertise',
    newTitle: 'Skills System Overview: How Intelligence Adjacent Organizes Expertise',
  },
  {
    slug: '2025-12-20-slash-commands-deep-dive',
    ghostId: '694768046da91c000197ee53',
    oldTitle: 'Slash Commands Deep Dive: Template-Driven Workflows That Scale',
    newTitle: 'Slash Commands Overview: Template-Driven Workflows That Scale',
  },
  {
    slug: '2025-12-20-vps-server-tools-deep-dive',
    ghostId: '6947680b6da91c000197ee7e',
    oldTitle: 'VPS Server Tools Deep Dive: Token-Efficient Security Infrastructure',
    newTitle: 'VPS Server Tools Overview: Token-Efficient Security Infrastructure',
  },
];

async function updateLocalFiles(slug: string, oldTitle: string, newTitle: string): Promise<void> {
  const postDir = join(BLOG_ROOT, slug);

  // Update draft.md frontmatter
  const draftPath = join(postDir, 'draft.md');
  let draftContent = await fs.readFile(draftPath, 'utf-8');
  draftContent = draftContent.replace(
    `title: "${oldTitle}"`,
    `title: "${newTitle}"`
  );
  // Also handle single quotes
  draftContent = draftContent.replace(
    `title: '${oldTitle}'`,
    `title: '${newTitle}'`
  );
  await fs.writeFile(draftPath, draftContent, 'utf-8');
  console.log(`  [OK] Updated draft.md`);

  // Update metadata.json
  const metadataPath = join(postDir, 'metadata.json');
  const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf-8'));
  metadata.title = newTitle;
  metadata.updated_at = new Date().toISOString();
  metadata.migration_note = `Renamed from "Deep Dive" to "Overview" on ${new Date().toISOString().split('T')[0]}`;
  await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8');
  console.log(`  [OK] Updated metadata.json`);
}

async function main() {
  console.log('\n=== Renaming Deep Dive Intro Posts to Overview ===\n');

  let successCount = 0;
  let failCount = 0;

  for (const post of RENAMES) {
    console.log(`\nProcessing: ${post.slug}`);
    console.log(`  Old: ${post.oldTitle}`);
    console.log(`  New: ${post.newTitle}`);

    try {
      // Step 1: Update Ghost
      console.log(`  Updating Ghost...`);
      const result = await updatePost(post.ghostId, { title: post.newTitle });

      if (!result.success) {
        console.log(`  [FAIL] Ghost update failed: ${result.error}`);
        failCount++;
        continue;
      }
      console.log(`  [OK] Ghost updated`);

      // Step 2: Update local files
      await updateLocalFiles(post.slug, post.oldTitle, post.newTitle);

      successCount++;
      console.log(`  [OK] Complete`);

    } catch (error: any) {
      console.log(`  [FAIL] Error: ${error.message}`);
      failCount++;
    }
  }

  console.log('\n=== Summary ===');
  console.log(`Success: ${successCount}`);
  console.log(`Failed: ${failCount}`);

  if (failCount > 0) {
    console.log('\nSome posts failed to update. Check errors above.');
    process.exit(1);
  }

  console.log('\n[OK] All posts renamed successfully!');
  console.log('\nNext steps:');
  console.log('1. Run: bun run skills/ghost/scripts/blog-workflow.ts refresh');
  console.log('2. Verify posts in Ghost Admin');
}

main();
