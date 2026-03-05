#!/usr/bin/env bun
/**
 * Pre-Commit Hook: Routing Gate Validation
 *
 * Validates routing gates in CLAUDE.md, agents, and skills
 * Ensures gates maintain required structure
 *
 * Exit codes: 0 = pass, 1 = fail
 */

import { spawnSync } from "child_process";
import { join } from "path";
import { existsSync } from "fs";

const FRAMEWORK_ROOT = join(import.meta.dir, "..", "..");
const VALIDATOR_SCRIPT = join(
  FRAMEWORK_ROOT,
  "tools",
  "validation",
  "validate-routing-gates.ts"
);

function getStagedRoutingGateFiles(): string[] {
  // Get staged files that should contain routing gates
  try {
    const result = spawnSync(
      "git",
      ["diff", "--cached", "--name-only", "--diff-filter=ACM"],
      {
        encoding: "utf-8",
        timeout: 5000,
      }
    );

    if (!result.stdout || result.stdout.trim().length === 0) {
      return [];
    }

    const allStaged = result.stdout.trim().split("\n");
    const routingGateFiles: string[] = [];

    for (const filePath of allStaged) {
      if (!filePath) {
        continue;
      }

      // Check if file should have a routing gate
      if (
        filePath === "CLAUDE.md" ||
        (filePath.startsWith("agents/") && filePath.endsWith(".md")) ||
        (filePath.startsWith("skills/") && filePath.endsWith("/SKILL.md"))
      ) {
        routingGateFiles.push(filePath);
      }
    }

    return routingGateFiles;
  } catch (err) {
    return [];
  }
}

function main() {
  console.error("🔍 Validating routing gates...");

  // Get staged files with routing gates
  const stagedFiles = getStagedRoutingGateFiles();

  if (stagedFiles.length === 0) {
    console.error("✅ No routing gate files modified, skipping validation");
    process.exit(0);
  }

  console.error(`   Found ${stagedFiles.length} file(s) to validate`);

  if (!existsSync(VALIDATOR_SCRIPT)) {
    console.error(`⚠️  Validator script not found: ${VALIDATOR_SCRIPT} - skipping`);
    process.exit(0);
  }

  // Run validator on each file
  let allValid = true;
  const failedFiles: string[] = [];

  for (const file of stagedFiles) {
    const result = spawnSync("bun", ["run", VALIDATOR_SCRIPT, "--file", file], {
      encoding: "utf-8",
      timeout: 10000,
    });

    if (result.status !== 0) {
      allValid = false;
      failedFiles.push(file);

      // Print validation errors
      if (result.stdout) {
        console.error(result.stdout);
      }
      if (result.stderr) {
        console.error(result.stderr);
      }
    }
  }

  if (allValid) {
    console.error("✅ All routing gates valid!");
    process.exit(0);
  } else {
    console.error("");
    console.error("❌ ROUTING GATE VALIDATION FAILED!");
    console.error("");
    console.error("⚠️  Commit BLOCKED due to invalid routing gates");
    console.error("");
    console.error(`Failed files (${failedFiles.length}):`);
    failedFiles.forEach((file) => {
      console.error(`  - ${file}`);
    });
    console.error("");
    console.error("Why routing gates matter:");
    console.error("  - Prevent incorrect agent/skill routing");
    console.error("  - Increase compliance through visual + linguistic force");
    console.error("  - Reduce clarification loops and user friction");
    console.error("");
    console.error("To fix:");
    console.error(
      "  1. Run: bun run tools/validation/validate-routing-gates.ts --all"
    );
    console.error(
      "  2. Review errors and regenerate gates if needed:"
    );
    console.error(
      "     bun run tools/framework/generators/routing-gate-generator.ts --type <type> --target <file>"
    );
    console.error("  3. Or manually fix gates to match validation rules:");
    console.error(
      "     docs/guides/validation-rules/routing-gate-rules.json"
    );
    console.error("");
    process.exit(1);
  }
}

main();
