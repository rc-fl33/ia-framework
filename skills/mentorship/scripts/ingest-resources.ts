#!/usr/bin/env bun

/**
 * Mentorship & Learning Resources Ingestion Script (Reusable Engine)
 *
 * Ingests GitHub repositories containing learning resources, certification guides,
 * and educational frameworks into skill-specific reference directories.
 *
 * Uses shared ingestion engine from tools/ingestion/
 *
 * Usage:
 *   bun run skills/mentorship/scripts/ingest-resources.ts --resource oscp-prep
 *   bun run skills/mentorship/scripts/ingest-resources.ts --list
 *   bun run skills/mentorship/scripts/ingest-resources.ts --all
 */

import { loadIngestionConfig, getConfigPath } from "@/tools/ingestion/config-loader";
import { createIngestionCLI } from "@/tools/ingestion/framework-ingester";

const config = loadIngestionConfig(getConfigPath("mentorship"));
const cli = createIngestionCLI(config, "skills/mentorship/scripts/ingest-resources.ts", "resource");

cli();
