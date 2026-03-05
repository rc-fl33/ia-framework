#!/usr/bin/env bun
/**
 * Compliance Framework Manifest Generator
 *
 * Generates manifest.yaml files for framework resources to enable:
 * - Resource discovery by agents/workflows
 * - Skill-to-resource routing
 * - Version/currency tracking
 * - Industry-based filtering
 *
 * Usage:
 *   bun run tools/standards/generate-manifest.ts [--all] [--framework <name>]
 *
 * Examples:
 *   bun run tools/standards/generate-manifest.ts --all
 *   bun run tools/standards/generate-manifest.ts --framework nist-800-53
 */

import { readdir, readFile, writeFile, stat } from 'fs/promises';
import { existsSync } from 'fs';
import { join, basename, dirname } from 'path';
import * as yaml from 'yaml';

// Paths relative to this script
const SCRIPT_DIR = dirname(import.meta.path).replace('file://', '');
const SKILL_ROOT = join(SCRIPT_DIR, '..');
const FRAMEWORKS_DIR = join(SKILL_ROOT, 'frameworks');
const MAPPINGS_DIR = join(SKILL_ROOT, 'mappings');

interface ManifestData {
  name: string;
  type: string;
  version?: string;
  provider: string;
  skills: string[];
  pages?: number;
  chunks?: number;
  industries?: string[];
  phases?: string[];  // NIST CSF phases this resource supports
  source_url?: string;
  published?: string;
}

interface FrameworkConfig {
  display_name: string;
  provider: string;
  type: string;
  version?: string;
  skills: string[];
  industries: string[];
  phases: string[];  // Which NIST CSF phases it maps to
  source_url?: string;
}

// Framework-specific configuration
const FRAMEWORK_CONFIG: Record<string, FrameworkConfig> = {
  'nist-csf': {
    display_name: 'NIST Cybersecurity Framework',
    provider: 'nist',
    type: 'framework',
    version: '2.0',
    skills: ['compliance', 'risk-assessment'],
    industries: ['all'],
    phases: ['GOVERN', 'IDENTIFY', 'PROTECT', 'DETECT', 'RESPOND', 'RECOVER'],
    source_url: 'https://www.nist.gov/cyberframework'
  },
  'nist-800-53': {
    display_name: 'NIST SP 800-53 Security Controls',
    provider: 'nist',
    type: 'controls',
    version: 'Rev 5',
    skills: ['compliance', 'hardening'],
    industries: ['government', 'defense', 'all'],
    phases: ['PROTECT', 'DETECT'],
    source_url: 'https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final'
  },
  'pci-dss': {
    display_name: 'PCI Data Security Standard',
    provider: 'pci-ssc',
    type: 'standard',
    version: '4.0.1',
    skills: ['compliance', 'pentest'],
    industries: ['retail', 'financial', 'ecommerce'],
    phases: ['PROTECT', 'DETECT', 'RESPOND'],
    source_url: 'https://www.pcisecuritystandards.org/'
  },
  'hipaa': {
    display_name: 'HIPAA Security Rule',
    provider: 'hhs',
    type: 'regulation',
    version: '45 CFR 164',
    skills: ['compliance', 'risk-assessment'],
    industries: ['healthcare'],
    phases: ['GOVERN', 'PROTECT', 'DETECT'],
    source_url: 'https://www.hhs.gov/hipaa/'
  },
  'cis-controls': {
    display_name: 'CIS Critical Security Controls',
    provider: 'cis',
    type: 'controls',
    version: '8.1',
    skills: ['compliance', 'hardening'],
    industries: ['all'],
    phases: ['PROTECT', 'DETECT'],
    source_url: 'https://www.cisecurity.org/controls'
  },
  'ffiec': {
    display_name: 'FFIEC IT Examination Handbook',
    provider: 'ffiec',
    type: 'framework',
    skills: ['compliance'],
    industries: ['financial', 'banking'],
    phases: ['GOVERN', 'IDENTIFY', 'PROTECT', 'DETECT', 'RESPOND', 'RECOVER'],
    source_url: 'https://ithandbook.ffiec.gov/'
  },
  'iso-27001': {
    display_name: 'ISO 27001 Information Security',
    provider: 'iso',
    type: 'standard',
    version: '2022',
    skills: ['compliance'],
    industries: ['all'],
    phases: ['GOVERN', 'PROTECT'],
    source_url: 'https://www.iso.org/standard/27001'
  },
  'iso-13485': {
    display_name: 'ISO 13485 Medical Devices',
    provider: 'iso',
    type: 'standard',
    version: '2016',
    skills: ['compliance'],
    industries: ['healthcare', 'manufacturing'],
    phases: ['GOVERN', 'IDENTIFY'],
    source_url: 'https://www.iso.org/standard/59752.html'
  },
  'iso-42001': {
    display_name: 'ISO 42001 AI Management',
    provider: 'iso',
    type: 'standard',
    version: '2023',
    skills: ['compliance'],
    industries: ['technology', 'all'],
    phases: ['GOVERN', 'IDENTIFY'],
    source_url: 'https://www.iso.org/standard/81230.html'
  },
  'iso-9001': {
    display_name: 'ISO 9001 Quality Management',
    provider: 'iso',
    type: 'standard',
    version: '2015',
    skills: ['compliance'],
    industries: ['manufacturing', 'all'],
    phases: ['GOVERN'],
    source_url: 'https://www.iso.org/standard/62085.html'
  },
  'gdpr': {
    display_name: 'General Data Protection Regulation',
    provider: 'eu',
    type: 'regulation',
    version: '2016/679',
    skills: ['compliance', 'legal'],
    industries: ['eu_operations', 'all'],
    phases: ['GOVERN', 'PROTECT'],
    source_url: 'https://gdpr.eu/'
  },
  'dsa': {
    display_name: 'Digital Services Act',
    provider: 'eu',
    type: 'regulation',
    version: '2022/2065',
    skills: ['compliance', 'legal'],
    industries: ['technology', 'eu_operations'],
    phases: ['GOVERN'],
    source_url: 'https://digital-strategy.ec.europa.eu/en/policies/digital-services-act-package'
  },
  'soc2': {
    display_name: 'SOC 2 Trust Services Criteria',
    provider: 'aicpa',
    type: 'framework',
    version: 'Type II',
    skills: ['compliance'],
    industries: ['technology', 'saas'],
    phases: ['GOVERN', 'PROTECT', 'DETECT'],
    source_url: 'https://www.aicpa.org/soc2'
  },
  'aiuc-1': {
    display_name: 'AIUC-1 AI Unified Controls',
    provider: 'aiuc',
    type: 'standard',
    version: '1.0',
    skills: ['compliance', 'security'],
    industries: ['technology', 'ai_ml', 'all'],
    phases: ['GOVERN', 'IDENTIFY', 'PROTECT', 'DETECT', 'RESPOND'],
    source_url: 'https://www.aiuc-1.com/'
  },
};

async function countPdfPages(referenceDir: string): Promise<{ pages: number; chunks: number }> {
  /**
   * Count PDF chunks in reference directory
   */
  let chunks = 0;
  let pages = 0;

  try {
    const entries = await readdir(referenceDir, { recursive: true });
    for (const entry of entries) {
      if (entry.endsWith('.pdf') && entry.includes('_pages_')) {
        chunks++;
        // Extract page range from filename like "doc_pages_001-010.pdf"
        const match = entry.match(/_pages_(\d+)-(\d+)\.pdf$/);
        if (match) {
          const end = parseInt(match[2], 10);
          if (end > pages) pages = end;
        }
      }
    }
  } catch (e) {
    // Directory might not exist or be empty
  }

  return { pages, chunks };
}

async function generateManifest(frameworkName: string): Promise<boolean> {
  const frameworkDir = join(FRAMEWORKS_DIR, frameworkName);

  if (!existsSync(frameworkDir)) {
    console.log(`  ❌ Framework directory not found: ${frameworkName}`);
    return false;
  }

  const config = FRAMEWORK_CONFIG[frameworkName];
  if (!config) {
    console.log(`  ⚠️  No config for ${frameworkName}, using defaults`);
  }

  // Check for reference directory
  const referenceDir = join(frameworkDir, 'reference');
  const { pages, chunks } = await countPdfPages(referenceDir);

  // Build manifest
  const manifest: ManifestData = {
    name: config?.display_name || frameworkName,
    type: config?.type || 'framework',
    version: config?.version,
    provider: config?.provider || 'unknown',
    skills: config?.skills || ['compliance'],
    industries: config?.industries || ['all'],
    phases: config?.phases || [],
    source_url: config?.source_url,
    published: new Date().toISOString().split('T')[0]
  };

  if (pages > 0) manifest.pages = pages;
  if (chunks > 0) manifest.chunks = chunks;

  // Remove undefined values
  const cleanManifest = Object.fromEntries(
    Object.entries(manifest).filter(([_, v]) => v !== undefined)
  );

  // Write manifest
  const manifestPath = join(frameworkDir, 'manifest.yaml');
  const yamlContent = yaml.stringify(cleanManifest);
  await writeFile(manifestPath, yamlContent);

  console.log(`  ✅ Created: ${frameworkName}/manifest.yaml`);
  if (pages > 0) {
    console.log(`     Pages: ${pages}, Chunks: ${chunks}`);
  }

  return true;
}

async function findFrameworksWithoutManifest(): Promise<string[]> {
  const missing: string[] = [];

  try {
    const entries = await readdir(FRAMEWORKS_DIR);
    for (const entry of entries) {
      const frameworkPath = join(FRAMEWORKS_DIR, entry);
      const stats = await stat(frameworkPath);

      if (stats.isDirectory() && entry !== 'mappings') {
        const manifestPath = join(frameworkPath, 'manifest.yaml');
        if (!existsSync(manifestPath)) {
          missing.push(entry);
        }
      }
    }
  } catch (e) {
    console.error(`Error scanning frameworks: ${e}`);
  }

  return missing;
}

async function listAllFrameworks(): Promise<void> {
  console.log('\n📋 Framework Manifest Status\n');

  try {
    const entries = await readdir(FRAMEWORKS_DIR);
    for (const entry of entries) {
      const frameworkPath = join(FRAMEWORKS_DIR, entry);
      const stats = await stat(frameworkPath);

      if (stats.isDirectory() && entry !== 'mappings') {
        const manifestPath = join(frameworkPath, 'manifest.yaml');
        const hasManifest = existsSync(manifestPath);
        const status = hasManifest ? '✅' : '❌';
        console.log(`  ${status} ${entry}`);
      }
    }
  } catch (e) {
    console.error(`Error listing frameworks: ${e}`);
  }
}

async function main() {
  const args = process.argv.slice(2);

  console.log('Compliance Framework Manifest Generator');
  console.log('=======================================\n');

  // Parse arguments
  const generateAll = args.includes('--all');
  const listOnly = args.includes('--list');
  let specificFramework: string | null = null;

  const frameworkIdx = args.indexOf('--framework');
  if (frameworkIdx !== -1 && args[frameworkIdx + 1]) {
    specificFramework = args[frameworkIdx + 1];
  }

  // List mode
  if (listOnly || args.length === 0) {
    await listAllFrameworks();

    const missing = await findFrameworksWithoutManifest();
    if (missing.length > 0) {
      console.log(`\n⚠️  ${missing.length} frameworks missing manifests:`);
      missing.forEach(f => console.log(`   - ${f}`));
      console.log('\nRun with --all to generate missing manifests');
    }
    return;
  }

  // Generate specific framework
  if (specificFramework) {
    console.log(`Generating manifest for: ${specificFramework}\n`);
    await generateManifest(specificFramework);
    return;
  }

  // Generate all missing
  if (generateAll) {
    const missing = await findFrameworksWithoutManifest();

    if (missing.length === 0) {
      console.log('✅ All frameworks have manifests');
      return;
    }

    console.log(`Generating ${missing.length} missing manifests...\n`);

    let success = 0;
    for (const framework of missing) {
      const result = await generateManifest(framework);
      if (result) success++;
    }

    console.log(`\n✅ Generated ${success}/${missing.length} manifests`);
  }
}

main().catch(console.error);
