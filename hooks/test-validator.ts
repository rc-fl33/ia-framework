/**
 * Test Validator Hook (PreToolUse)
 * Enforces that modules have test files before completion
 *
 * Detects:
 * - Git commit of module changes without test file
 * - Module marked as complete without tests passing
 *
 * Exit codes:
 *   0 = Allow
 *   1 = Soft block (warning)
 *   2 = Hard block (cannot proceed)
 */

import { existsSync, readdirSync, statSync } from "fs";
import { join, basename, dirname } from "path";

interface PreToolUseInput {
  tool_name: string;
  tool_input: Record<string, unknown>;
  session_id?: string;
}

// Use IA_FRAMEWORK_ROOT env var if set, otherwise self-discover from script location
const FRAMEWORK_PATH = process.env.IA_FRAMEWORK_ROOT || join(import.meta.dir, "..");

// Module locations to check
const MODULE_PATHS = [
  join(FRAMEWORK_PATH, "foundation"),
  join(FRAMEWORK_PATH, "modules"),
];

async function main() {
  try {
    const input = await Bun.stdin.text();
    const data: PreToolUseInput = JSON.parse(input);

    const result = await validateTests(data);

    if (result.block) {
      console.log("<system-reminder>");
      console.log("⚠️ TEST VALIDATION WARNING");
      console.log("");
      console.log(result.message);
      console.log("");
      if (result.modules && result.modules.length > 0) {
        console.log("Modules missing tests:");
        for (const mod of result.modules) {
          console.log(`  - ${mod.name}: Missing ${mod.testPath}`);
        }
        console.log("");
      }
      console.log("Action required:");
      console.log(
        "  1. Create test file: __tests__/{module-name}.test.ts"
      );
      console.log("  2. Add smoke tests and error path tests");
      console.log("  3. Run: npm test -- --testPathPattern={module-name}");
      console.log("");
      console.log("See docs/STANDARDS.md Section 7 (Testing Standards) for requirements.");
      console.log("</system-reminder>");

      if (result.level === "hard") {
        process.exit(2);
      } else {
        process.exit(1);
      }
    }

    process.exit(0);
  } catch (err) {
    // Fail open on errors
    process.exit(0);
  }
}

interface ValidationResult {
  block: boolean;
  level?: "soft" | "hard";
  message?: string;
  modules?: { name: string; testPath: string }[];
}

async function validateTests(data: PreToolUseInput): Promise<ValidationResult> {
  const toolName = data.tool_name;

  // Only check on git commit operations
  if (toolName !== "Bash") {
    return { block: false };
  }

  const command =
    typeof data.tool_input.command === "string" ? data.tool_input.command : "";

  // Check if this is a git commit
  if (!command.match(/git\s+commit/)) {
    return { block: false };
  }

  // Find modules without tests
  const modulesWithoutTests = findModulesWithoutTests();

  if (modulesWithoutTests.length > 0) {
    return {
      block: true,
      level: "soft",
      message: `${modulesWithoutTests.length} module(s) missing required test files. Tests are MANDATORY per STANDARDS.md Section 7.`,
      modules: modulesWithoutTests,
    };
  }

  return { block: false };
}

interface ModuleMissingTests {
  name: string;
  testPath: string;
}

function findModulesWithoutTests(): ModuleMissingTests[] {
  const missing: ModuleMissingTests[] = [];

  for (const basePath of MODULE_PATHS) {
    if (!existsSync(basePath)) continue;

    const entries = readdirSync(basePath);
    for (const entry of entries) {
      const modulePath = join(basePath, entry);
      const stat = statSync(modulePath);

      if (!stat.isDirectory()) continue;

      // Skip non-module directories
      if (entry.startsWith(".") || entry === "__tests__" || entry === "lib") {
        continue;
      }

      // Check if this is a module (has module.yaml or scripts/index.ts)
      const hasModuleYaml = existsSync(join(modulePath, "module.yaml"));
      const hasScriptsIndex = existsSync(join(modulePath, "scripts", "index.ts"));

      if (!hasModuleYaml && !hasScriptsIndex) continue;

      // Check for test file
      const testDir = join(modulePath, "__tests__");
      const expectedTestFile = join(testDir, `${entry}.test.ts`);

      // Also check for any test file in the __tests__ directory
      let hasAnyTest = false;
      if (existsSync(testDir)) {
        const testFiles = readdirSync(testDir);
        hasAnyTest = testFiles.some((f) => f.endsWith(".test.ts"));
      }

      if (!hasAnyTest) {
        // Determine relative path for display
        const relPath = modulePath.replace(FRAMEWORK_PATH, "~/.claude");
        missing.push({
          name: entry,
          testPath: `${relPath}/__tests__/${entry}.test.ts`,
        });
      }
    }
  }

  return missing;
}

// Export for testing
export { validateTests, findModulesWithoutTests };

main();
