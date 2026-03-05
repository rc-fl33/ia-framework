/**
 * Active Work Limiter Hook
 *
 * PostToolUse hook that monitors active-tracker.md to enforce max 10 items.
 * Warns when trying to exceed capacity and suggests completing work first.
 *
 * Trigger: PostToolUse on Write/Edit for active-tracker.md
 * Action: Parse table, count items, warn if > 10
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface PostToolUseInput {
  tool_name: string;
  tool_input: {
    file_path?: string;
    content?: string;
    new_string?: string;
    [key: string]: unknown;
  };
}

// Use IA_FRAMEWORK_ROOT env var if set, otherwise self-discover from script location
const FRAMEWORK_PATH = process.env.IA_FRAMEWORK_ROOT || join(import.meta.dir, '..');
const ACTIVE_TRACKER_PATH = join(FRAMEWORK_PATH, 'private', 'docs', 'active-tracker.md');
const MAX_ITEMS = 10;

async function main() {
  const input = await Bun.stdin.text();

  try {
    const data: PostToolUseInput = JSON.parse(input);

    // Only process Write/Edit tool calls
    if (data.tool_name !== 'Write' && data.tool_name !== 'Edit') {
      process.exit(0);
    }

    const filePath = data.tool_input?.file_path;
    if (!filePath) {
      process.exit(0);
    }

    // Only check if modifying active-tracker.md
    if (!filePath.endsWith('active-tracker.md')) {
      process.exit(0);
    }

    // Read the file content (it should exist after the tool executed)
    if (!existsSync(filePath)) {
      process.exit(0);
    }

    const content = readFileSync(filePath, 'utf-8');
    const itemCount = countActiveItems(content);

    if (itemCount > MAX_ITEMS) {
      console.log('<system-reminder>');
      console.log('⚠️  ACTIVE WORK LIMIT EXCEEDED');
      console.log('');
      console.log(`Current items: ${itemCount}/${MAX_ITEMS}`);
      console.log('');
      console.log('Active tracker is at capacity. Before adding new work:');
      console.log('1. Complete and delete finished items');
      console.log('2. Change status to "blocked" for stalled work');
      console.log('3. Consider if new work can wait');
      console.log('');
      console.log('This limit exists to maintain focus and prevent work sprawl.');
      console.log('</system-reminder>');
    } else {
      // IMPORTANT: Always produce output to avoid empty text blocks in API calls
      // Empty output causes: "messages: text content blocks must be non-empty" error
      console.log('<!-- active-work-limiter: OK -->');
    }

    process.exit(0);

  } catch (error) {
    // FAIL CLOSED: Log error and block operation with soft fail
    const err = error as Error;
    console.error('❌ HOOK ERROR - active-work-limiter.ts');
    console.error(`Error: ${err.message}`);
    console.error(`Stack: ${err.stack}`);

    // Exit code 1 = soft block with warning (allows override)
    process.exit(1);
  }
}

function countActiveItems(content: string): number {
  // Parse the markdown table in the "## Current Work" section
  const lines = content.split('\n');

  let inTable = false;
  let itemCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Start counting when we hit the table header
    if (line.startsWith('| Item |')) {
      inTable = true;
      continue;
    }

    // Skip the separator line
    if (inTable && line.startsWith('|---')) {
      continue;
    }

    // Count table rows until we hit a non-table line
    if (inTable) {
      if (line.startsWith('|') && !line.startsWith('|---')) {
        // Parse the row to check status
        const cells = line.split('|').map(c => c.trim()).filter(c => c);

        if (cells.length >= 2) {
          const status = cells[1].toLowerCase();

          // Count items that are NOT completed or cancelled
          // Completed items should be deleted per the rules
          // So we count: in-progress, pending, blocked
          if (!status.includes('✅') && !status.includes('❌')) {
            itemCount++;
          }
        }
      } else {
        // End of table
        break;
      }
    }
  }

  return itemCount;
}

main();
