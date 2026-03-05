/**
 * Shared type definitions for framework and resource ingestion
 */

export interface FrameworkEntry {
  name: string;
  repo: string;
  outputDir: string;
  description: string;
  category: string;
}

export interface IngestionConfig {
  skillName: string;
  skillPath: string;
  frameworks: Record<string, FrameworkEntry>;
  itemType: "framework" | "resource";
}

export interface IngestionMetadata {
  [key: string]: string | number;
}
