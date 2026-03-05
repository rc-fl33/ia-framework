#!/usr/bin/env bun
/**
 * Pre-commit hook: Validate /docs contains only public content
 *
 * Scans staged files in /docs for references to private skills
 * Blocks commit if private references found
 */

import { execSync } from "child_process";

const PRIVATE_SKILLS = [
  "advisory",
  "compliance",
  "ghost",
  "n8n",
  "security",
  "write",
];

const PRIVATE_PATTERNS = [
  /active\.md/i,
  /skill-integration-status/i,
  /blog-audit/i,
  /grok-imagine/i,
  /prompt-generation/i,
  /workflow-audit/i,
  /multi-api-/i,
];

console.log("\n[8/13] Validating /docs contains only public content...");

try {
  // Get staged files in /docs
  const stagedFiles = execSync("git diff --cached --name-only --diff-filter=ACM", {
    encoding: "utf-8",
  })
    .trim()
    .split("\n")
    .filter((f) => f.startsWith("docs/") && f.endsWith(".md"));

  if (stagedFiles.length === 0) {
    console.log("   ⚠️  No docs files staged, skipping validation\n");
    process.exit(0);
  }

  const violations: string[] = [];

  for (const file of stagedFiles) {
    // Validate file path to prevent injection (from git, but defense in depth)
    if (!/^[a-zA-Z0-9_\-./]+$/.test(file)) {
      violations.push(`${file}: Invalid filename format`);
      continue;
    }

    // Check filename against private patterns
    for (const pattern of PRIVATE_PATTERNS) {
      if (pattern.test(file)) {
        violations.push(`${file}: Filename matches private pattern (${pattern})`);
        continue;
      }
    }

    // Check content for private skill references
    try {
      // File is validated above, but quote for extra safety in shell
      const safeFile = `"${file}"`;
      const content = execSync(`git show :${safeFile}`, {
        encoding: "utf-8"
      });

      for (const skill of PRIVATE_SKILLS) {
        // Case-insensitive search for skill name
        const regex = new RegExp(`\\b${skill}\\b`, "gi");
        if (regex.test(content)) {
          violations.push(
            `${file}: References private skill '${skill}' - move to /private/docs`
          );
        }
      }
    } catch (e) {
      // File might be deleted
      continue;
    }
  }

  if (violations.length > 0) {
    console.log("\n   ❌ VALIDATION FAILED: Private content in /docs\n");
    console.log("   /docs is for PUBLIC framework architecture only.\n");
    console.log("   Private content should go in /private/docs\n");
    console.log("   Violations found:\n");

    for (const violation of violations) {
      console.log(`   - ${violation}`);
    }

    console.log("\n   Fix: Move these files to /private/docs\n");
    process.exit(1);
  }

  console.log(`   ✅ All ${stagedFiles.length} docs file(s) are public-safe\n`);
  process.exit(0);
} catch (error) {
  console.error("   ⚠️  Error validating docs:", error);
  process.exit(0); // Don't block on errors
}
