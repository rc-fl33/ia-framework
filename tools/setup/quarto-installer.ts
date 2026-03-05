#!/usr/bin/env bun
/**
 * Quarto Installer
 *
 * Installs Quarto CLI to /opt/quarto for framework tools.
 *
 * Usage:
 *   bun tools/setup/quarto-installer.ts
 *   bun tools/setup/quarto-installer.ts --check  # Just check, don't install
 */

import { existsSync, mkdirSync, rmSync } from "fs";
import { spawnSync } from "child_process";
import { resolve, dirname } from "path";

const QUARTO_VERSION = "1.8.27";
const QUARTO_URL = `https://github.com/quarto-dev/quarto-cli/releases/download/v${QUARTO_VERSION}/quarto-${QUARTO_VERSION}-linux-amd64.tar.gz`;
const QUARTO_INSTALL_PATH = "/opt/quarto";
const QUARTO_BIN = `${QUARTO_INSTALL_PATH}/bin/quarto`;

interface InstallResult {
  success: boolean;
  installed: boolean;
  version: string | null;
  message: string;
}

function log(message: string): void {
  console.log(`[quarto-installer] ${message}`);
}

function error(message: string): void {
  console.error(`[ERROR] ${message}`);
}

function runCommand(cmd: string, args: string[], opts: { cwd?: string; silent?: boolean } = {}): number {
  const result = spawnSync(cmd, args, {
    cwd: opts.cwd,
    stdio: opts.silent ? "pipe" : "inherit",
  });
  return result.status ?? 1;
}

function isQuartoInstalled(): boolean {
  return existsSync(QUARTO_BIN);
}

function getQuartoVersion(): string | null {
  if (!isQuartoInstalled()) return null;
  
  try {
    const result = spawnSync(QUARTO_BIN, ["--version"], {
      stdio: "pipe",
      encoding: "utf-8",
    });
    if (result.status === 0) {
      return result.stdout.toString().trim().split("\n")[0]?.replace("Quarto ", "") || null;
    }
  } catch {
    // Ignore
  }
  return null;
}

async function installQuarto(): Promise<InstallResult> {
  if (isQuartoInstalled()) {
    const version = getQuartoVersion();
    return {
      success: true,
      installed: false,
      version,
      message: `Quarto already installed: ${version}`,
    };
  }

  log(`Installing Quarto ${QUARTO_VERSION}...`);
  
  const tempTar = `/tmp/quarto-${QUARTO_VERSION}-linux-amd64.tar.gz`;
  
  try {
    log("Downloading Quarto...");
    const curlResult = spawnSync("curl", ["-L", "-o", tempTar, QUARTO_URL], {
      stdio: "inherit",
    });
    
    if (curlResult.status !== 0) {
      return {
        success: false,
        installed: false,
        version: null,
        message: "Failed to download Quarto",
      };
    }
    
    log("Extracting to /opt...");
    
    // Ensure /opt exists
    if (!existsSync("/opt")) {
      mkdirSync("/opt", { recursive: true });
    }
    
    const extractResult = runCommand("tar", ["-xzf", tempTar, "-C", "/opt"]);
    
    if (extractResult !== 0) {
      return {
        success: false,
        installed: false,
        version: null,
        message: "Failed to extract Quarto",
      };
    }
    
    // Rename to standard path
    const extractedDir = `/opt/quarto-${QUARTO_VERSION}`;
    if (existsSync(extractedDir) && !existsSync(QUARTO_INSTALL_PATH)) {
      log("Renaming to quarto...");
      runCommand("mv", [extractedDir, QUARTO_INSTALL_PATH]);
    }
    
    // Make executable
    log("Making quarto executable...");
    runCommand("chmod", ["+x", QUARTO_BIN]);
    
    // Cleanup temp file
    try {
      rmSync(tempTar, { force: true });
    } catch {
      // Ignore cleanup errors
    }
    
    // Verify
    const version = getQuartoVersion();
    if (version) {
      log(`Quarto installed successfully: ${version}`);
      return {
        success: true,
        installed: true,
        version,
        message: `Quarto ${version} installed successfully`,
      };
    }
    
    return {
      success: false,
      installed: false,
      version: null,
      message: "Quarto installation verification failed",
    };
    
  } catch (err) {
    return {
      success: false,
      installed: false,
      version: null,
      message: `Installation error: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const checkOnly = args.includes("--check");
  
  console.log("");
  log(`Version: ${QUARTO_VERSION}`);
  log(`Install path: ${QUARTO_INSTALL_PATH}`);
  console.log("");
  
  if (checkOnly) {
    if (isQuartoInstalled()) {
      const version = getQuartoVersion();
      console.log(`✓ Quarto installed: ${version}`);
      process.exit(0);
    } else {
      console.log("✗ Quarto not installed");
      process.exit(1);
    }
  }
  
  const result = await installQuarto();
  
  console.log("");
  if (result.success) {
    console.log(`[OK] ${result.message}`);
    process.exit(0);
  } else {
    error(result.message);
    process.exit(1);
  }
}

main().catch((err) => {
  error(`Setup failed: ${err}`);
  process.exit(1);
});
