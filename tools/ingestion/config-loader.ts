/**
 * Configuration loader for framework ingestion
 * Loads YAML configuration files and converts them to IngestionConfig objects
 */

import * as fs from "fs";
import * as path from "path";
import * as YAML from "yaml";
import { IngestionConfig } from "./types";

export function loadIngestionConfig(configPath: string): IngestionConfig {
  if (!fs.existsSync(configPath)) {
    throw new Error(`Configuration file not found: ${configPath}`);
  }

  const content = fs.readFileSync(configPath, "utf-8");
  const config = YAML.parse(content) as IngestionConfig;

  if (!config.skillName || !config.skillPath || !config.frameworks) {
    throw new Error(
      `Invalid configuration file. Required fields: skillName, skillPath, frameworks`
    );
  }

  return config;
}

export function getConfigPath(
  skillName: "security" | "compliance" | "mentorship"
): string {
  const configMap = {
    security: "security-frameworks.yaml",
    compliance: "compliance-frameworks.yaml",
    mentorship: "learning-resources.yaml",
  };

  const filename = configMap[skillName];
  const configDir = path.join(__dirname, "config");
  return path.join(configDir, filename);
}
