#!/usr/bin/env bun
/**
 * Coverage Analyzer - Gap Analysis Tool
 *
 * Analyzes compliance coverage across security standards without generating a test plan.
 * Shows total requirements, covered requirements, coverage %, and gaps.
 *
 * Usage:
 *   bun run coverage-analyzer.ts --standards pci-dss,hipaa --domain web-api
 *   bun run coverage-analyzer.ts --standards aiuc-1 --output coverage-report.md
 *   bun run coverage-analyzer.ts --standards owasp-top-10 --verbose
 */

import { StandardSelector, SelectionResult } from './standard-selector';
import { writeFileSync } from 'fs';
import { parse as parseYaml } from 'yaml';
import { readFileSync } from 'fs';
import { join } from 'path';

interface CoverageAnalysis {
  standard: string;
  total_requirements: number;
  covered_requirements: number;
  coverage_percent: number;
  covered_details: Array<{
    requirement: string;
    title: string;
    prompt_count: number;
    prompts: string[];
  }>;
  gaps: Array<{
    requirement: string;
    title: string;
    description: string;
  }>;
}

interface DeduplicationAnalysis {
  total_unique_prompts: number;
  shared_prompts: number;
  standard_breakdown: Record<string, number>;
  standard_only: Record<string, number>;
}

class CoverageAnalyzer {
  private standardSelector: StandardSelector;
  private verbose: boolean = false;

  constructor(verbose: boolean = false) {
    this.standardSelector = new StandardSelector();
    this.verbose = verbose;
  }

  /**
   * Analyze coverage for given standards
   */
  async analyze(
    standards: string[],
    domain?: string
  ): Promise<{
    analyses: CoverageAnalysis[];
    deduplication: DeduplicationAnalysis;
    result: SelectionResult;
  }> {
    if (this.verbose) {
      console.log(`\n🔍 Analyzing coverage for: ${standards.join(', ')}`);
      if (domain) {
        console.log(`   Domain filter: ${domain}`);
      }
    }

    // Get prompts via standard-selector
    const result = this.standardSelector.selectPrompts({
      standards,
      domain,
    });

    if (this.verbose) {
      console.log(`   Found ${result.prompts.length} prompts\n`);
    }

    // Analyze each standard
    const analyses: CoverageAnalysis[] = [];
    for (const standardId of standards) {
      const analysis = this.analyzeStandard(standardId, result);
      analyses.push(analysis);
    }

    // Analyze deduplication
    const deduplication = this.analyzeDeduplication(standards, result);

    return { analyses, deduplication, result };
  }

  /**
   * Analyze single standard
   */
  private analyzeStandard(standardId: string, result: SelectionResult): CoverageAnalysis {
    const standardMapping = this.loadStandardMapping(standardId);

    if (!standardMapping) {
      throw new Error(`Unknown standard: ${standardId}`);
    }

    const testableRequirements = standardMapping.requirements.filter((r: any) => r.testable);
    const totalRequirements = testableRequirements.length;

    // Map requirements to prompts
    const requirementMap = new Map<
      string,
      {
        requirement: string;
        title: string;
        description: string;
        prompts: string[];
      }
    >();

    for (const req of testableRequirements) {
      requirementMap.set(req.requirement, {
        requirement: req.requirement,
        title: req.title,
        description: req.description,
        prompts: [],
      });
    }

    // Count prompts per requirement
    for (const prompt of result.prompts) {
      if (prompt.standards && prompt.standards[standardId]) {
        for (const reqId of prompt.standards[standardId]) {
          const req = requirementMap.get(reqId);
          if (req) {
            req.prompts.push(prompt.id);
          }
        }
      }
    }

    // Build covered and gaps lists
    const covered_details: CoverageAnalysis['covered_details'] = [];
    const gaps: CoverageAnalysis['gaps'] = [];

    for (const [reqId, req] of requirementMap.entries()) {
      if (req.prompts.length > 0) {
        covered_details.push({
          requirement: req.requirement,
          title: req.title,
          prompt_count: req.prompts.length,
          prompts: req.prompts,
        });
      } else {
        gaps.push({
          requirement: req.requirement,
          title: req.title,
          description: req.description,
        });
      }
    }

    // Sort by prompt count (descending)
    covered_details.sort((a, b) => b.prompt_count - a.prompt_count);

    const covered_requirements = covered_details.length;
    const coverage_percent =
      totalRequirements > 0 ? Math.round((covered_requirements / totalRequirements) * 100) : 0;

    return {
      standard: standardId,
      total_requirements: totalRequirements,
      covered_requirements,
      coverage_percent,
      covered_details,
      gaps,
    };
  }

  /**
   * Load standard mapping from YAML
   */
  private loadStandardMapping(standardId: string): any {
    const standardsDir = join(__dirname, '..', 'standards');
    const mappingsPath = join(standardsDir, 'standard-mappings.yaml');

    try {
      const content = readFileSync(mappingsPath, 'utf-8');
      const mappings = parseYaml(content) as any;
      return mappings[standardId];
    } catch (error) {
      console.error(`Error loading standard mapping for ${standardId}:`, error);
      return null;
    }
  }

  /**
   * Analyze deduplication across standards
   */
  private analyzeDeduplication(
    standards: string[],
    result: SelectionResult
  ): DeduplicationAnalysis {
    const standardCounts: Record<string, number> = {};
    const standardOnly: Record<string, number> = {};
    let sharedCount = 0;

    // Initialize counts
    for (const std of standards) {
      standardCounts[std] = 0;
      standardOnly[std] = 0;
    }

    // Count prompts per standard
    for (const prompt of result.prompts) {
      if (!prompt.standards) continue;

      const applicableStandards = standards.filter((s) => prompt.standards![s]);

      if (applicableStandards.length > 1) {
        sharedCount++;
      } else if (applicableStandards.length === 1) {
        standardOnly[applicableStandards[0]]++;
      }

      applicableStandards.forEach((std) => {
        standardCounts[std]++;
      });
    }

    return {
      total_unique_prompts: result.prompts.length,
      shared_prompts: sharedCount,
      standard_breakdown: standardCounts,
      standard_only: standardOnly,
    };
  }

  /**
   * Generate markdown report
   */
  generateMarkdownReport(
    standards: string[],
    analyses: CoverageAnalysis[],
    deduplication: DeduplicationAnalysis
  ): string {
    const standardNames = standards.map((s) => s.toUpperCase()).join(' + ');

    let report = `# Coverage Analysis: ${standardNames}\n\n`;
    report += `**Generated**: ${new Date().toISOString().split('T')[0]}\n\n`;
    report += `---\n\n`;

    // Summary table
    report += `## Summary\n\n`;
    report += `| Standard | Total Requirements | Covered | Coverage % | Gaps |\n`;
    report += `|----------|-------------------|---------|------------|------|\n`;

    for (const analysis of analyses) {
      report += `| ${analysis.standard.toUpperCase()} | ${analysis.total_requirements} | ${analysis.covered_requirements} | ${analysis.coverage_percent}% | ${analysis.gaps.length} |\n`;
    }

    report += `\n---\n\n`;

    // Per-standard detailed analysis
    for (const analysis of analyses) {
      report += `## ${analysis.standard.toUpperCase()}\n\n`;

      // Covered requirements
      report += `### Covered Requirements (${analysis.covered_requirements})\n\n`;

      if (analysis.covered_details.length > 0) {
        report += `| Requirement | Title | Prompts |\n`;
        report += `|-------------|-------|----------|\n`;

        for (const req of analysis.covered_details) {
          report += `| ${req.requirement} | ${req.title} | ${req.prompt_count} |\n`;
        }

        report += `\n`;
      } else {
        report += `_No covered requirements_\n\n`;
      }

      // Gaps
      report += `### Coverage Gaps (${analysis.gaps.length})\n\n`;

      if (analysis.gaps.length > 0) {
        report += `| Requirement | Title | Description |\n`;
        report += `|-------------|-------|-------------|\n`;

        for (const gap of analysis.gaps) {
          const description = gap.description.length > 60 ? gap.description.substring(0, 57) + '...' : gap.description;
          report += `| ${gap.requirement} | ${gap.title} | ${description} |\n`;
        }

        report += `\n`;
      } else {
        report += `_No gaps - 100% coverage!_\n\n`;
      }

      report += `---\n\n`;
    }

    // Deduplication analysis
    if (standards.length > 1) {
      report += `## Deduplication Analysis\n\n`;
      report += `- **Total unique prompts**: ${deduplication.total_unique_prompts}\n`;
      report += `- **Shared prompts** (satisfy multiple standards): ${deduplication.shared_prompts}\n\n`;

      report += `### Breakdown by Standard\n\n`;
      report += `| Standard | Total Prompts | Unique to Standard |\n`;
      report += `|----------|---------------|--------------------|\n`;

      for (const std of standards) {
        const total = deduplication.standard_breakdown[std] || 0;
        const unique = deduplication.standard_only[std] || 0;
        report += `| ${std.toUpperCase()} | ${total} | ${unique} |\n`;
      }

      report += `\n`;
    }

    report += `---\n\n`;
    report += `## Recommendations\n\n`;

    // Generate recommendations
    for (const analysis of analyses) {
      if (analysis.coverage_percent < 50) {
        report += `- ⚠️  **${analysis.standard.toUpperCase()}**: Coverage is below 50%. Consider expanding prompt library to cover ${analysis.gaps.length} missing requirements.\n`;
      } else if (analysis.coverage_percent < 80) {
        report += `- ℹ️  **${analysis.standard.toUpperCase()}**: Good coverage (${analysis.coverage_percent}%). Focus on ${analysis.gaps.length} remaining gaps for complete coverage.\n`;
      } else if (analysis.coverage_percent < 100) {
        report += `- ✅ **${analysis.standard.toUpperCase()}**: Excellent coverage (${analysis.coverage_percent}%). Only ${analysis.gaps.length} gaps remaining.\n`;
      } else {
        report += `- 🎉 **${analysis.standard.toUpperCase()}**: Perfect 100% coverage!\n`;
      }
    }

    if (standards.length > 1 && deduplication.shared_prompts > 0) {
      const dedupePercent = Math.round(
        (deduplication.shared_prompts / deduplication.total_unique_prompts) * 100
      );
      report += `\n- 💡 **Efficiency**: ${dedupePercent}% of prompts satisfy multiple standards, reducing total test time.\n`;
    }

    return report;
  }

  /**
   * Print report to console
   */
  printReport(
    standards: string[],
    analyses: CoverageAnalysis[],
    deduplication: DeduplicationAnalysis
  ): void {
    const report = this.generateMarkdownReport(standards, analyses, deduplication);
    console.log(report);
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help')) {
    console.log(`
Usage:
  bun run coverage-analyzer.ts --standards <standards> [options]

Options:
  --standards <ids>      Comma-separated standard IDs (required)
                        Examples: pci-dss, owasp-top-10, aiuc-1, hipaa, soc2
  --domain <domain>      Filter by domain (optional)
                        Examples: web-api, ai-llm, mobile, cloud, web3
  --output <file>        Write report to markdown file (optional)
  --verbose              Show detailed progress (optional)
  --help                 Show this help

Examples:
  bun run coverage-analyzer.ts --standards pci-dss,hipaa
  bun run coverage-analyzer.ts --standards owasp-top-10 --domain web-api
  bun run coverage-analyzer.ts --standards aiuc-1 --output aiuc-coverage.md
  bun run coverage-analyzer.ts --standards pci-dss,owasp-top-10,soc2 --verbose
    `);
    process.exit(0);
  }

  const standardsArg = args.find((arg, i) => args[i - 1] === '--standards');
  const domainArg = args.find((arg, i) => args[i - 1] === '--domain');
  const outputArg = args.find((arg, i) => args[i - 1] === '--output');
  const verbose = args.includes('--verbose');

  if (!standardsArg) {
    console.error('Error: --standards is required');
    process.exit(1);
  }

  const standards = standardsArg.split(',').map((s) => s.trim());

  const analyzer = new CoverageAnalyzer(verbose);

  try {
    const { analyses, deduplication } = await analyzer.analyze(standards, domainArg);

    if (outputArg) {
      const report = analyzer.generateMarkdownReport(standards, analyses, deduplication);
      writeFileSync(outputArg, report, 'utf-8');
      console.log(`\n✅ Coverage report written to: ${outputArg}\n`);
    } else {
      analyzer.printReport(standards, analyses, deduplication);
    }
  } catch (error: any) {
    console.error(`\n❌ Error: ${error.message}\n`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { CoverageAnalyzer, CoverageAnalysis, DeduplicationAnalysis };
