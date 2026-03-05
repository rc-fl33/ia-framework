#!/usr/bin/env bun
/**
 * Framework Dependency Setup
 * Run this script to install required external dependencies.
 * 
 * Usage: bun setup/install-dependencies.ts
 */

import { spawnSync } from "child_process";
import { existsSync } from "fs";
import { mkdir, chmod } from "fs/prompts";
import { resolve, dirname } from "path";

const QUARTO_VERSION = "1.8.27";
const QUARTO_URL = `https://github.com/quarto-dev/quarto-cli/releases/download/v${QUARTO_VERSION}/quarto-${QUARTO_VERSION}-linux-amd64.tar.gz`;
const QUARTO_INSTALL_PATH = "/opt/quarto";

const TYPST_DIR = "/opt/quarto/bin/tools/x86_64";

interface Dependency {
  name: string;
  check: () => boolean;
  install: () => boolean;
}

const dependencies: Dependency[] = [
  {
    name: "Quarto CLI",
    check: () => existsSync("/opt/quarto/bin/quarto"),
    install: () => installQuarto(),
  },
];

function log(message: string): void {
  console.log(`[setup] ${message}`);
}

function error(message: string): void {
  console.error(`[ERROR] ${message}`);
}

function success(message: string): void {
  console.log(`[OK] ${message}`);
}

function runCommand(cmd: string, args: string[], opts: { cwd?: string; silent?: boolean } = {}): number {
  const result = spawnSync(cmd, args, {
    cwd: opts.cwd,
    stdio: opts.silent ? "pipe" : "inherit",
  });
  return result.status ?? 1;
}

function installQuarto(): boolean {
  log(`Installing Quarto ${QUARTO_VERSION}...`);
  
  const tempTar = `/tmp/quarto-${QUARTO_VERSION}-linux-amd64.tar.gz`;
  
  log("Downloading Quarto...");
  const downloadResult = spawnSync("curl", ["-L", "-o", tempTar, QUARTO_URL], {
    stdio: "inherit",
  });
  
  if (downloadResult.status !== 0) {
    error("Failed to download Quarto");
    return false;
  }
  
  log("Extracting to /opt...");
  const extractResult = runCommand("sudo", ["tar", "-xzf", tempTar, "-C", "/opt"]);
  
  if (extractResult !== 0) {
    error("Failed to extract Quarto");
    return false;
  }
  
  const extractedDir = `/opt/quarto-${QUARTO_VERSION}`;
  if (existsSync(extractedDir)) {
    log("Renaming to quarto...");
    runCommand("sudo", ["mv", extractedDir, QUARTO_INSTALL_PATH]);
  }
  
  log("Making quarto executable...");
  runCommand("sudo", ["chmod", "+x", `${QUARTO_INSTALL_PATH}/bin/quarto`]);
  
  spawnSync("rm", ["-f", tempTar]);
  
  if (existsSync("/opt/quarto/bin/quarto")) {
    const versionResult = spawnSync("/opt/quarto/bin/quarto", ["--version"], {
      stdio: "pipe",
    });
    if (versionResult.status === 0) {
      success(`Quarto installed: ${versionResult.stdout.toString().trim()}`);
      return true;
    }
  }
  
  error("Quarto installation verification failed");
  return false;
}

function checkDependency(dep: Dependency): { installed: boolean; needsInstall: boolean } {
  const installed = dep.check();
  return {
    installed,
    needsInstall: !installed,
  };
}

async function main(): Promise<void> {
  console.log("\n=== Framework Dependency Setup ===\n");
  
  const toInstall: string[] = [];
  
  for (const dep of dependencies) {
    const { installed, needsInstall } = checkDependency(dep);
    
    if (installed) {
      success(`${dep.name} is already installed`);
    } else {
      log(`${dep.name} not found - will install`);
      toInstall.push(dep.name);
    }
  }
  
  if (toInstall.length === 0) {
    console.log("\nAll dependencies satisfied!\n");
    return;
  }
  
  console.log(`\nWill install: ${toInstall.join(", ")}\n`);
  
  let allSuccess = true;
  
  for (const dep of dependencies) {
    const { needsInstall } = checkDependency(dep);
    
    if (needsInstall) {
      const success_ = dep.install();
      if (!success_) {
        error(`${dep.name} installation failed`);
        allSuccess = false;
      }
    }
  }
  
  if (allSuccess) {
    console.log("\n=== Setup Complete ===\n");
    console.log("You can now use Quarto-based tools.\n");
  } else {
    console.log("\n=== Setup Incomplete ===\n");
    console.log("Some dependencies failed to install. Please review errors above.\n");
    process.exit(1);
  }
}

main().catch((err) => {
  error(`Setup failed: ${err}`);
  process.exit(1);
});
