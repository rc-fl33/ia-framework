#!/usr/bin/env ts-node
/**
 * Standard-Based Prompt Selector
 *
 * Maps security standards to applicable test prompts using standard-mappings.yaml.
 * Enables standard-based routing (e.g., "PCI DSS pentest" → correct prompt selection).
 *
 * Usage:
 *   npx ts-node standard-selector.ts --standard pci-dss --domain web-api
 *   npx ts-node standard-selector.ts --standards pci-dss,hipaa,soc2 --domain cloud
 *
 * Phase 1 Implementation:
 *   - Uses CURRENT domain-based paths (prompts/web-api/injection/sql-injection.md)
 *   - In Phase 4, paths will change to technique-based (prompts/techniques/injection/sql-injection/)
 */

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { minimatch } from 'minimatch';

interface StandardMapping {
  standard: string;
  version: string;
  description: string;
  requirements: Array<{
    requirement: string;
    title: string;
    description: string;
    techniques: string[];
    testable: boolean;
    priority: string;
  }>;
}

interface StandardMappings {
  [standardId: string]: StandardMapping;
}

interface PromptMetadata {
  id: string;
  title: string;
  technique: string;
  category: string;
  domain: string[];
  standards?: Record<string, string[]>;
  filepath: string;
}

interface SelectionRequest {
  standards: string[];
  domain?: string;
  requirements?: string[];
}

interface SelectionResult {
  prompts: PromptMetadata[];
  coverage: CoverageReport;
  deduplication: DeduplicationReport;
}

interface CoverageReport {
  [standardId: string]: {
    total_requirements: number;
    covered_requirements: number;
    coverage_percent: number;
    gaps: string[];
  };
}

interface DeduplicationReport {
  total_unique_prompts: number;
  shared_prompts: number;
  standard_breakdown: Record<string, number>;
}

class StandardSelector {
  private standardsDir: string;
  private promptsDir: string;
  private standardMappings: StandardMappings = {};

  constructor() {
    const skillRoot = path.join(__dirname, '..');
    this.standardsDir = path.join(skillRoot, 'standards');
    this.promptsDir = path.join(skillRoot, 'prompts', 'techniques');
  }

  /**
   * Load standard-mappings.yaml
   */
  private loadStandardMappings(): void {
    const mappingsPath = path.join(this.standardsDir, 'standard-mappings.yaml');

    if (!fs.existsSync(mappingsPath)) {
      throw new Error(`standard-mappings.yaml not found at ${mappingsPath}`);
    }

    const content = fs.readFileSync(mappingsPath, 'utf-8');
    this.standardMappings = yaml.load(content) as StandardMappings;
  }

  /**
   * Find all prompts matching technique patterns
   */
  private findMatchingPrompts(
    techniques: string[],
    domain?: string
  ): PromptMetadata[] {
    const prompts: PromptMetadata[] = [];
    const seenPaths = new Set<string>();

    // Recursively find all .md files
    const allPrompts = this.findAllPromptFiles(this.promptsDir);

    for (const filepath of allPrompts) {
      // Skip templates and shared
      if (filepath.includes('TEMPLATE.md') || filepath.includes('/shared/')) {
        continue;
      }

      // Get relative path for pattern matching
      const relativePath = path.relative(this.promptsDir, filepath);

      // Check if matches any technique pattern
      const matchesPattern = techniques.some((pattern) => {
        // Use pattern directly - it's already a valid glob pattern
        const match = minimatch(relativePath, pattern);
        if (match && process.env.DEBUG_SELECTOR) {
          console.log(`    MATCH: ${relativePath} <-- ${pattern}`);
        }
        return match;
      });

      if (matchesPattern && !seenPaths.has(filepath)) {
        seenPaths.add(filepath);
        const metadata = this.extractPromptMetadata(filepath);
        if (metadata) {
          // Phase 4: Domain filter now checks applicable_domains in frontmatter
          if (domain) {
            const domains = Array.isArray(metadata.domain) ? metadata.domain : [metadata.domain];
            if (!domains.includes(domain)) {
              continue;
            }
          }
          prompts.push(metadata);
        }
      }
    }

    return prompts;
  }

  /**
   * Recursively find all .md files
   */
  private findAllPromptFiles(dir: string): string[] {
    const files: string[] = [];

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        files.push(...this.findAllPromptFiles(fullPath));
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        files.push(fullPath);
      }
    }

    return files;
  }

  /**
   * Extract prompt metadata from frontmatter
   */
  private extractPromptMetadata(filepath: string): PromptMetadata | null {
    try {
      const content = fs.readFileSync(filepath, 'utf-8');

      // Parse YAML frontmatter
      const match = content.match(/^---\n([\s\S]*?)\n---/);
      if (!match) {
        console.warn(`No frontmatter in ${filepath}`);
        return null;
      }

      const frontmatter = yaml.load(match[1]) as any;

      // Phase 4: Use applicable_domains from frontmatter (technique-based structure)
      let domains = frontmatter.applicable_domains || frontmatter.domain || [];
      if (!Array.isArray(domains)) {
        domains = [domains];
      }

      return {
        id: frontmatter.id || path.basename(filepath, '.md'),
        title: frontmatter.title || frontmatter.technique || 'Untitled',
        technique: frontmatter.technique || 'unknown',
        category: frontmatter.category || 'unknown',
        domain: domains,
        standards: frontmatter.standards || {},
        filepath: filepath,
      };
    } catch (error) {
      console.error(`Error parsing ${filepath}:`, error);
      return null;
    }
  }

  /**
   * Generate coverage report for standards
   */
  private generateCoverageReport(
    standards: string[],
    prompts: PromptMetadata[]
  ): CoverageReport {
    const report: CoverageReport = {};

    for (const standardId of standards) {
      const mapping = this.standardMappings[standardId];
      if (!mapping) {
        console.warn(`No mapping found for standard: ${standardId}`);
        continue;
      }

      const testableRequirements = mapping.requirements.filter((r) => r.testable);
      const totalRequirements = testableRequirements.length;

      // Find which requirements are covered by selected prompts
      const coveredRequirements = new Set<string>();

      for (const prompt of prompts) {
        if (prompt.standards && prompt.standards[standardId]) {
          prompt.standards[standardId].forEach((req) => coveredRequirements.add(req));
        }
      }

      // Identify gaps
      const gaps = testableRequirements
        .filter((r) => !coveredRequirements.has(r.requirement))
        .map((r) => `${r.requirement}: ${r.title}`);

      report[standardId] = {
        total_requirements: totalRequirements,
        covered_requirements: coveredRequirements.size,
        coverage_percent:
          totalRequirements > 0
            ? Math.round((coveredRequirements.size / totalRequirements) * 100)
            : 0,
        gaps: gaps,
      };
    }

    return report;
  }

  /**
   * Analyze deduplication across standards
   */
  private analyzeDeduplication(
    standards: string[],
    prompts: PromptMetadata[]
  ): DeduplicationReport {
    const standardCounts: Record<string, number> = {};
    let sharedCount = 0;

    for (const prompt of prompts) {
      if (!prompt.standards) continue;

      const applicableStandards = standards.filter((s) => prompt.standards![s]);

      if (applicableStandards.length > 1) {
        sharedCount++;
      }

      applicableStandards.forEach((std) => {
        standardCounts[std] = (standardCounts[std] || 0) + 1;
      });
    }

    return {
      total_unique_prompts: prompts.length,
      shared_prompts: sharedCount,
      standard_breakdown: standardCounts,
    };
  }

  /**
   * Main selection logic
   */
  selectPrompts(request: SelectionRequest): SelectionResult {
    this.loadStandardMappings();

    const allTechniques = new Set<string>();

    // Collect all technique patterns from requested standards
    for (const standardId of request.standards) {
      const mapping = this.standardMappings[standardId];
      if (!mapping) {
        throw new Error(`Unknown standard: ${standardId}`);
      }

      // Filter by specific requirements if requested
      const requirements = request.requirements
        ? mapping.requirements.filter((r) => request.requirements!.includes(r.requirement))
        : mapping.requirements;

      // Collect all technique patterns
      requirements.forEach((req) => {
        req.techniques.forEach((tech) => {
          allTechniques.add(tech);
          if (process.env.DEBUG_SELECTOR) {
            console.log(`  [${standardId}] ${req.requirement}: ${tech}`);
          }
        });
      });
    }

    // Find matching prompts
    const prompts = this.findMatchingPrompts(Array.from(allTechniques), request.domain);

    // Generate reports
    const coverage = this.generateCoverageReport(request.standards, prompts);
    const deduplication = this.analyzeDeduplication(request.standards, prompts);

    return {
      prompts,
      coverage,
      deduplication,
    };
  }

  /**
   * Pretty-print results
   */
  printResults(result: SelectionResult): void {
    console.log('\n=== STANDARD-BASED PROMPT SELECTION ===\n');

    // Coverage report
    console.log('COVERAGE REPORT:');
    for (const [standardId, report] of Object.entries(result.coverage)) {
      console.log(`\n${standardId.toUpperCase()}:`);
      console.log(
        `  Coverage: ${report.covered_requirements}/${report.total_requirements} (${report.coverage_percent}%)`
      );
      if (report.gaps.length > 0) {
        console.log(`  Gaps: ${report.gaps.length}`);
        report.gaps.slice(0, 3).forEach((gap) => console.log(`    - ${gap}`));
        if (report.gaps.length > 3) {
          console.log(`    ... and ${report.gaps.length - 3} more`);
        }
      }
    }

    // Deduplication
    console.log('\nDEDUPLICATION:');
    console.log(`  Total unique prompts: ${result.deduplication.total_unique_prompts}`);
    console.log(`  Shared across standards: ${result.deduplication.shared_prompts}`);
    console.log('  Breakdown:');
    for (const [std, count] of Object.entries(result.deduplication.standard_breakdown)) {
      console.log(`    ${std}: ${count} prompts`);
    }

    // Sample prompts
    console.log('\nSAMPLE PROMPTS:');
    result.prompts.slice(0, 5).forEach((p) => {
      console.log(`  - ${p.id}: ${p.title} [${p.category}]`);
    });
    if (result.prompts.length > 5) {
      console.log(`  ... and ${result.prompts.length - 5} more`);
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help')) {
    console.log(`
Usage:
  npx ts-node standard-selector.ts --standard <standard-id> [options]
  npx ts-node standard-selector.ts --standards <standard1,standard2> [options]

Options:
  --standard <id>        Single standard (pci-dss, owasp-top-10, aiuc-1, etc.)
  --standards <ids>      Multiple standards (comma-separated)
  --domain <domain>      Filter by domain (web-api, ai-llm, etc.)
  --requirements <reqs>  Specific requirements (comma-separated)
  --help                 Show this help

Examples:
  npx ts-node standard-selector.ts --standard pci-dss --domain web-api
  npx ts-node standard-selector.ts --standards pci-dss,hipaa,soc2 --domain cloud
  npx ts-node standard-selector.ts --standard aiuc-1
    `);
    process.exit(0);
  }

  const standardArg = args.find((arg, i) => args[i - 1] === '--standard');
  const standardsArg = args.find((arg, i) => args[i - 1] === '--standards');
  const domainArg = args.find((arg, i) => args[i - 1] === '--domain');
  const requirementsArg = args.find((arg, i) => args[i - 1] === '--requirements');

  const standards = standardsArg
    ? standardsArg.split(',')
    : standardArg
    ? [standardArg]
    : [];

  if (standards.length === 0) {
    console.error('Error: --standard or --standards is required');
    process.exit(1);
  }

  const request: SelectionRequest = {
    standards,
    domain: domainArg,
    requirements: requirementsArg ? requirementsArg.split(',') : undefined,
  };

  const selector = new StandardSelector();
  const result = await selector.selectPrompts(request);
  selector.printResults(result);
}

if (require.main === module) {
  main().catch((error: Error) => {
    console.error('Error:', error.message);
    process.exit(1);
  });
}

export { StandardSelector, SelectionRequest, SelectionResult };
