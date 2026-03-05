#!/usr/bin/env bun

/**
 * Compliance Framework Ingestion Script (Reusable Engine)
 *
 * Ingests GitHub repositories containing compliance frameworks (NIST, CIS, FedRAMP, etc.)
 * into skill-specific reference directories for LLM context loading.
 *
 * Uses shared ingestion engine from tools/ingestion/
 *
 * Usage:
 *   bun run tools/standards/ingest-frameworks.ts --framework nist-oscal
 *   bun run tools/standards/ingest-frameworks.ts --list
 *   bun run tools/standards/ingest-frameworks.ts --all
 */

import { loadIngestionConfig, getConfigPath } from "@/tools/ingestion/config-loader";
import { createIngestionCLI } from "@/tools/ingestion/framework-ingester";

const config = loadIngestionConfig(getConfigPath("compliance"));
const cli = createIngestionCLI(config, "tools/standards/ingest-frameworks.ts");

cli();
