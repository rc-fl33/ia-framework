/**
 * Generic Framework Ingestion Engine
 *
 * Reusable ingestion system for GitHub repositories containing frameworks,
 * standards, or educational resources. Supports multiple skills with
 * configuration-driven framework definitions.
 *
 * Usage:
 *   const ingester = new FrameworkIngester(config);
 *   await ingester.ingestFramework(frameworkKey);
 *   await ingester.ingestAll();
 */

import { execFileSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { FrameworkEntry, IngestionConfig } from "./types";

export class FrameworkIngester {
  private config: IngestionConfig;
  private itemType: string;

  constructor(config: IngestionConfig) {
    this.config = config;
    this.itemType = config.itemType === "framework" ? "Framework" : "Resource";
  }

  /**
   * Ingest a single framework/resource
   */
  async ingestFramework(key: string): Promise<void> {
    const entry = this.config.frameworks[key];
    if (!entry) {
      throw new Error(`Unknown ${this.config.itemType} "${key}"`);
    }

    console.log(`\nIngesting ${entry.name}...`);
    console.log(`Repository: ${entry.repo}`);
    console.log(`Output: ${entry.outputDir}`);

    try {
      // Create output directory
      const outputPath = path.join(
        process.cwd(),
        this.config.skillPath,
        entry.outputDir
      );
      if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
      }

      // Run gitingest
      const outputFile = path.join(outputPath, `${key}.txt`);
      console.log(`Running gitingest...`);

      execFileSync('gitingest', [entry.repo, '-o', outputFile], {
        stdio: "inherit",
      });

      // Create metadata
      const metadata = this.buildMetadata(entry, key);

      fs.writeFileSync(
        path.join(outputPath, "metadata.json"),
        JSON.stringify(metadata, null, 2)
      );

      console.log(`✓ Successfully ingested ${entry.name}`);
      console.log(`  Output: ${outputFile}`);
      console.log(`  Metadata: ${path.join(outputPath, "metadata.json")}`);
    } catch (error) {
      console.error(`✗ Failed to ingest ${entry.name}:`, error);
      process.exit(1);
    }
  }

  /**
   * Ingest all frameworks/resources
   */
  async ingestAll(): Promise<void> {
    for (const [key] of Object.entries(this.config.frameworks)) {
      await this.ingestFramework(key);
    }
  }

  /**
   * List all available frameworks/resources
   */
  listAll(): void {
    console.log(`Available ${this.config.itemType}s:`);
    Object.entries(this.config.frameworks).forEach(([key, entry]) => {
      console.log(`\n${key}`);
      console.log(`  Name: ${entry.name}`);
      console.log(`  Repository: ${entry.repo}`);
      console.log(`  Output: ${entry.outputDir}`);
      console.log(`  Description: ${entry.description}`);
      console.log(`  Category: ${entry.category}`);
    });
  }

  /**
   * Get available framework keys
   */
  getKeys(): string[] {
    return Object.keys(this.config.frameworks);
  }

  /**
   * Display help message
   */
  showHelp(scriptName: string, itemName: string = "framework"): void {
    const plural = itemName + "s";
    const flag =
      itemName === "resource"
        ? `--${itemName}`
        : `--${itemName}`;
    console.log(`${this.config.skillName} ${this.itemType} Ingestion Script`);
    console.log("\nUsage:");
    console.log(
      `  bun run ${scriptName} --list`
    );
    console.log(
      `  bun run ${scriptName} ${flag} <name>`
    );
    console.log(
      `  bun run ${scriptName} --all`
    );
    console.log(`\nAvailable ${plural}:`);
    Object.entries(this.config.frameworks).forEach(([key, entry]) => {
      console.log(`  ${key}: ${entry.name} (${entry.category})`);
    });
  }

  /**
   * Build metadata object for ingested framework
   */
  private buildMetadata(entry: FrameworkEntry, key: string): Record<string, string> {
    const metadataKey = this.config.itemType.toLowerCase();
    return {
      [metadataKey]: entry.name,
      category: entry.category,
      repository: entry.repo,
      outputFile: `${key}.txt`,
      ingested_at: new Date().toISOString(),
      description: entry.description,
      gitingest_cli: "gitingest",
    };
  }
}

/**
 * CLI entry point factory
 * Returns a handler function for typical command-line argument parsing
 */
export function createIngestionCLI(
  config: IngestionConfig,
  scriptName: string,
  itemName: string = "framework"
) {
  return async () => {
    const ingester = new FrameworkIngester(config);
    const args = process.argv.slice(2);
    const command = args[0];

    if (!command || command === "--help") {
      ingester.showHelp(scriptName, itemName);
      return;
    }

    if (command === "--list") {
      ingester.listAll();
      return;
    }

    if (command === "--all") {
      await ingester.ingestAll();
      return;
    }

    if (command === `--${itemName}` || command === "--framework") {
      const itemKey = args[1];
      if (!itemKey || !config.frameworks[itemKey]) {
        console.error(
          `Error: Unknown ${itemName} "${itemKey}"`
        );
        console.error(`Available: ${ingester.getKeys().join(", ")}`);
        process.exit(1);
      }
      await ingester.ingestFramework(itemKey);
      return;
    }

    if (command === "--resource") {
      const resourceKey = args[1];
      if (!resourceKey || !config.frameworks[resourceKey]) {
        console.error(`Error: Unknown resource "${resourceKey}"`);
        console.error(`Available: ${ingester.getKeys().join(", ")}`);
        process.exit(1);
      }
      await ingester.ingestFramework(resourceKey);
      return;
    }

    console.error(`Error: Unknown command "${command}"`);
    process.exit(1);
  };
}
