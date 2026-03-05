#!/usr/bin/env bun
/**
 * n8n Update Checker
 *
 * Checks if n8n needs updating. If --update flag is passed and update
 * is available, runs /root/docker-sync.sh on Hostinger.
 *
 * Usage:
 *   bun run skills/n8n/scripts/check-update.ts          # Check only
 *   bun run skills/n8n/scripts/check-update.ts --update # Check and update if needed
 */

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

const ENV_PATH = path.join(process.env.IA_FRAMEWORK_ROOT || path.join(import.meta.dir, '..', '..'), ".env");

interface HostingerConfig {
  host: string;
  user: string;
  sshKey: string;
  sshPort: string;
}

function loadConfig(): HostingerConfig {
  const envContent = fs.readFileSync(ENV_PATH, "utf-8");
  const vars: Record<string, string> = {};

  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const eqIndex = trimmed.indexOf("=");
      if (eqIndex > 0) {
        vars[trimmed.substring(0, eqIndex).trim()] = trimmed.substring(eqIndex + 1).trim();
      }
    }
  });

  return {
    host: vars["HOSTINGER_HOST"] || "",
    user: vars["HOSTINGER_USER"] || "",
    sshKey: vars["HOSTINGER_SSH_KEY"] || "",
    sshPort: vars["HOSTINGER_SSH_PORT"] || "22",
  };
}

function ssh(config: HostingerConfig, command: string, timeout = 30000): string {
  const cmd = `ssh -i ${config.sshKey} -p ${config.sshPort} -o ConnectTimeout=10 ${config.user}@${config.host} "${command}"`;
  return execSync(cmd, { encoding: "utf-8", timeout }).trim();
}

async function getLatestVersion(): Promise<string> {
  const res = await fetch("https://api.github.com/repos/n8n-io/n8n/releases/latest");
  const data = await res.json();
  return data.tag_name?.replace(/^n8n@/, "") || "unknown";
}

async function main() {
  const doUpdate = process.argv.includes("--update");
  const config = loadConfig();

  console.log("n8n Update Check\n");

  const currentVersion = ssh(config, "docker exec n8n n8n --version");
  const latestVersion = await getLatestVersion();

  console.log(`Current: ${currentVersion}`);
  console.log(`Latest:  ${latestVersion}`);

  if (currentVersion === latestVersion) {
    console.log("\n✅ Up to date");
    return;
  }

  console.log("\n🔄 Update available!");

  if (doUpdate) {
    console.log("\nRunning /root/docker-sync.sh...\n");
    const output = ssh(config, "sudo /root/docker-sync.sh", 120000);
    console.log(output);

    const newVersion = ssh(config, "docker exec n8n n8n --version");
    console.log(`\n✅ Updated to: ${newVersion}`);
  } else {
    console.log("\nRun with --update to apply");
  }
}

main().catch((e) => {
  console.error("Error:", e.message);
  process.exit(1);
});
