#!/usr/bin/env bun

/**
 * Security Framework Ingestion Script (Reusable Engine)
 *
 * Ingests GitHub repositories containing security frameworks (OWASP, MITRE ATT&CK, etc.)
 * into skill-specific reference directories for LLM context loading.
 *
 * Uses shared ingestion engine from tools/ingestion/
 *
 * Usage:
 *   bun run tools/bug-bounty/ingest-frameworks.ts --framework owasp-top10
 *   bun run tools/bug-bounty/ingest-frameworks.ts --list
 *   bun run tools/bug-bounty/ingest-frameworks.ts --all
 */

import { loadIngestionConfig, getConfigPath } from "@/tools/ingestion/config-loader";
import { createIngestionCLI } from "@/tools/ingestion/framework-ingester";

const config = loadIngestionConfig(getConfigPath("security"));
const cli = createIngestionCLI(config, "tools/bug-bounty/ingest-frameworks.ts");

cli();
