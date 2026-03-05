#!/usr/bin/env bun
/**
 * Language Detection Script
 *
 * Detects programming languages in a codebase using:
 * 1. Package files (most reliable)
 * 2. File extension counts (statistical)
 * 3. Shebang lines (script files)
 *
 * Supports polyglot projects (multiple languages)
 *
 * Usage:
 *   bun run skills/advisory/scripts/detect-language.ts /path/to/code
 *   bun run skills/advisory/scripts/detect-language.ts /path/to/code --json
 */

import { readdirSync, statSync, readFileSync, existsSync } from 'fs';
import { join, extname, basename } from 'path';

interface LanguageDetection {
  language: string;
  confidence: 'high' | 'medium' | 'low';
  evidence: {
    packageFiles?: string[];
    fileCount?: number;
    shebangCount?: number;
  };
  frameworks?: string[];
}

interface DetectionResult {
  primary: LanguageDetection;
  secondary: LanguageDetection[];
  polyglot: boolean;
  totalFiles: number;
  scanPath: string;
}

// Language detection rules
const PACKAGE_FILE_RULES: Record<string, { language: string; frameworks?: string[] }> = {
  'package.json': { language: 'javascript', frameworks: [] },
  'package-lock.json': { language: 'javascript' },
  'yarn.lock': { language: 'javascript' },
  'pnpm-lock.yaml': { language: 'javascript' },
  'bun.lockb': { language: 'javascript' },

  'pom.xml': { language: 'java', frameworks: [] },
  'build.gradle': { language: 'java', frameworks: [] },
  'build.gradle.kts': { language: 'java', frameworks: [] },

  'requirements.txt': { language: 'python', frameworks: [] },
  'pyproject.toml': { language: 'python', frameworks: [] },
  'Pipfile': { language: 'python', frameworks: [] },
  'setup.py': { language: 'python', frameworks: [] },
  'poetry.lock': { language: 'python' },

  'Cargo.toml': { language: 'rust', frameworks: [] },
  'Cargo.lock': { language: 'rust' },

  'composer.json': { language: 'php', frameworks: [] },
  'composer.lock': { language: 'php' },

  'Gemfile': { language: 'ruby', frameworks: [] },
  'Gemfile.lock': { language: 'ruby' },

  'go.mod': { language: 'go', frameworks: [] },
  'go.sum': { language: 'go' },

  '*.csproj': { language: 'csharp' },
  '*.sln': { language: 'csharp' },

  'mix.exs': { language: 'elixir', frameworks: [] },

  '*.cabal': { language: 'haskell' },
  'stack.yaml': { language: 'haskell' },
};

const EXTENSION_RULES: Record<string, string> = {
  '.js': 'javascript',
  '.mjs': 'javascript',
  '.cjs': 'javascript',
  '.jsx': 'javascript',
  '.ts': 'typescript',
  '.tsx': 'typescript',

  '.java': 'java',

  '.py': 'python',
  '.pyw': 'python',

  '.rs': 'rust',

  '.php': 'php',

  '.rb': 'ruby',

  '.go': 'go',

  '.cs': 'csharp',

  '.ex': 'elixir',
  '.exs': 'elixir',

  '.hs': 'haskell',
  '.lhs': 'haskell',

  '.kt': 'kotlin',
  '.kts': 'kotlin',

  '.swift': 'swift',

  '.c': 'c',
  '.h': 'c',

  '.cpp': 'cpp',
  '.cc': 'cpp',
  '.cxx': 'cpp',
  '.hpp': 'cpp',
};

const SHEBANG_RULES: Record<string, string> = {
  '/usr/bin/python': 'python',
  '/usr/bin/env python': 'python',
  '/usr/bin/node': 'javascript',
  '/usr/bin/env node': 'javascript',
  '/usr/bin/ruby': 'ruby',
  '/usr/bin/env ruby': 'ruby',
  '/bin/bash': 'bash',
  '/bin/sh': 'bash',
};

// Framework detection rules (based on package file contents)
const FRAMEWORK_DETECTION: Record<string, (content: string) => string[]> = {
  javascript: (content: string) => {
    const frameworks: string[] = [];
    try {
      const pkg = JSON.parse(content);
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };

      if (deps.react) frameworks.push('React');
      if (deps.vue) frameworks.push('Vue');
      if (deps['@angular/core']) frameworks.push('Angular');
      if (deps.express) frameworks.push('Express');
      if (deps.next) frameworks.push('Next.js');
      if (deps.svelte) frameworks.push('Svelte');
      if (deps.nestjs) frameworks.push('NestJS');
    } catch {}
    return frameworks;
  },

  python: (content: string) => {
    const frameworks: string[] = [];
    if (content.includes('django')) frameworks.push('Django');
    if (content.includes('flask')) frameworks.push('Flask');
    if (content.includes('fastapi')) frameworks.push('FastAPI');
    if (content.includes('tornado')) frameworks.push('Tornado');
    return frameworks;
  },

  java: (content: string) => {
    const frameworks: string[] = [];
    if (content.includes('spring-boot')) frameworks.push('Spring Boot');
    if (content.includes('spring-security')) frameworks.push('Spring Security');
    if (content.includes('jakarta.ee')) frameworks.push('Jakarta EE');
    if (content.includes('quarkus')) frameworks.push('Quarkus');
    if (content.includes('micronaut')) frameworks.push('Micronaut');
    return frameworks;
  },

  rust: (content: string) => {
    const frameworks: string[] = [];
    if (content.includes('actix-web')) frameworks.push('Actix-web');
    if (content.includes('rocket')) frameworks.push('Rocket');
    if (content.includes('axum')) frameworks.push('Axum');
    if (content.includes('tokio')) frameworks.push('Tokio');
    return frameworks;
  },

  php: (content: string) => {
    const frameworks: string[] = [];
    if (content.includes('laravel')) frameworks.push('Laravel');
    if (content.includes('symfony')) frameworks.push('Symfony');
    if (content.includes('codeigniter')) frameworks.push('CodeIgniter');
    return frameworks;
  },

  ruby: (content: string) => {
    const frameworks: string[] = [];
    if (content.includes('rails')) frameworks.push('Rails');
    if (content.includes('sinatra')) frameworks.push('Sinatra');
    if (content.includes('hanami')) frameworks.push('Hanami');
    return frameworks;
  },

  go: (content: string) => {
    const frameworks: string[] = [];
    if (content.includes('gin-gonic/gin')) frameworks.push('Gin');
    if (content.includes('labstack/echo')) frameworks.push('Echo');
    if (content.includes('gofiber/fiber')) frameworks.push('Fiber');
    return frameworks;
  },
};

class LanguageDetector {
  private scanPath: string;
  private maxDepth: number;
  private excludeDirs = new Set(['node_modules', '.git', 'vendor', 'dist', 'build', '.next', '__pycache__', 'target']);

  private packageFileDetections = new Map<string, Set<string>>();
  private extensionCounts = new Map<string, number>();
  private shebangCounts = new Map<string, number>();

  constructor(scanPath: string, maxDepth: number = 5) {
    this.scanPath = scanPath;
    this.maxDepth = maxDepth;
  }

  detect(): DetectionResult {
    this.scan(this.scanPath, 0);

    const detections = this.buildDetections();
    const sorted = detections.sort((a, b) => this.scoreDetection(b) - this.scoreDetection(a));

    const [primary, ...secondary] = sorted;

    return {
      primary,
      secondary: secondary.filter(d => this.scoreDetection(d) > 10), // Only meaningful secondaries
      polyglot: sorted.length > 1 && this.scoreDetection(sorted[1]) > 20,
      totalFiles: Array.from(this.extensionCounts.values()).reduce((a, b) => a + b, 0),
      scanPath: this.scanPath,
    };
  }

  private scan(dir: string, depth: number) {
    if (depth > this.maxDepth) return;

    try {
      const entries = readdirSync(dir);

      for (const entry of entries) {
        const fullPath = join(dir, entry);

        if (this.excludeDirs.has(entry)) continue;

        try {
          const stat = statSync(fullPath);

          if (stat.isDirectory()) {
            this.scan(fullPath, depth + 1);
          } else if (stat.isFile()) {
            this.analyzeFile(fullPath);
          }
        } catch {
          // Permission denied or file disappeared
          continue;
        }
      }
    } catch {
      // Directory not accessible
      return;
    }
  }

  private analyzeFile(filePath: string) {
    const filename = basename(filePath);
    const ext = extname(filePath);

    // Check package files
    for (const [pkgFile, rule] of Object.entries(PACKAGE_FILE_RULES)) {
      if (pkgFile.includes('*')) {
        // Wildcard pattern
        const pattern = pkgFile.replace('*', '');
        if (filename.includes(pattern)) {
          this.addPackageFileDetection(rule.language, filePath);
        }
      } else if (filename === pkgFile) {
        this.addPackageFileDetection(rule.language, filePath);
      }
    }

    // Count extensions
    if (EXTENSION_RULES[ext]) {
      const lang = EXTENSION_RULES[ext];
      this.extensionCounts.set(lang, (this.extensionCounts.get(lang) || 0) + 1);
    }

    // Check shebang (first 50 chars of file)
    if (ext === '' || ext === '.sh') {
      try {
        const content = readFileSync(filePath, 'utf-8').substring(0, 100);
        if (content.startsWith('#!')) {
          const shebang = content.split('\n')[0];
          for (const [pattern, lang] of Object.entries(SHEBANG_RULES)) {
            if (shebang.includes(pattern)) {
              this.shebangCounts.set(lang, (this.shebangCounts.get(lang) || 0) + 1);
            }
          }
        }
      } catch {
        // File not readable
      }
    }
  }

  private addPackageFileDetection(language: string, filePath: string) {
    if (!this.packageFileDetections.has(language)) {
      this.packageFileDetections.set(language, new Set());
    }
    this.packageFileDetections.get(language)!.add(filePath);
  }

  private buildDetections(): LanguageDetection[] {
    const languages = new Set<string>();

    // Collect all detected languages
    this.packageFileDetections.forEach((_, lang) => languages.add(lang));
    this.extensionCounts.forEach((_, lang) => languages.add(lang));
    this.shebangCounts.forEach((_, lang) => languages.add(lang));

    const detections: LanguageDetection[] = [];

    for (const lang of languages) {
      const detection: LanguageDetection = {
        language: lang,
        confidence: this.calculateConfidence(lang),
        evidence: {},
      };

      // Add package file evidence
      const pkgFiles = this.packageFileDetections.get(lang);
      if (pkgFiles && pkgFiles.size > 0) {
        detection.evidence.packageFiles = Array.from(pkgFiles).map(p => basename(p));

        // Detect frameworks
        detection.frameworks = this.detectFrameworks(lang, pkgFiles);
      }

      // Add extension count evidence
      const extCount = this.extensionCounts.get(lang);
      if (extCount) {
        detection.evidence.fileCount = extCount;
      }

      // Add shebang count evidence
      const shebangCount = this.shebangCounts.get(lang);
      if (shebangCount) {
        detection.evidence.shebangCount = shebangCount;
      }

      detections.push(detection);
    }

    return detections;
  }

  private detectFrameworks(language: string, packageFiles: Set<string>): string[] {
    const detector = FRAMEWORK_DETECTION[language];
    if (!detector) return [];

    const frameworks = new Set<string>();

    for (const pkgFile of packageFiles) {
      try {
        const content = readFileSync(pkgFile, 'utf-8');
        const detected = detector(content);
        detected.forEach(f => frameworks.add(f));
      } catch {
        // File not readable
      }
    }

    return Array.from(frameworks);
  }

  private calculateConfidence(language: string): 'high' | 'medium' | 'low' {
    const score = this.scoreDetection({ language } as LanguageDetection);

    if (score >= 100) return 'high';
    if (score >= 30) return 'medium';
    return 'low';
  }

  private scoreDetection(detection: LanguageDetection | { language: string }): number {
    const lang = detection.language;
    let score = 0;

    // Package files are most reliable (100 points each)
    const pkgFiles = this.packageFileDetections.get(lang);
    if (pkgFiles) {
      score += pkgFiles.size * 100;
    }

    // File count (1 point per file, max 50)
    const extCount = this.extensionCounts.get(lang) || 0;
    score += Math.min(extCount, 50);

    // Shebang lines (5 points each)
    const shebangCount = this.shebangCounts.get(lang) || 0;
    score += shebangCount * 5;

    return score;
  }
}

// CLI execution
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Language Detection Script

Usage:
  bun run detect-language.ts <path> [options]

Options:
  --json          Output JSON instead of human-readable format
  --help, -h      Show this help message

Examples:
  bun run detect-language.ts ~/projects/my-app
  bun run detect-language.ts ~/projects/my-app --json
    `);
    process.exit(0);
  }

  const scanPath = args[0];
  const jsonOutput = args.includes('--json');

  if (!existsSync(scanPath)) {
    console.error(`Error: Path does not exist: ${scanPath}`);
    process.exit(1);
  }

  const detector = new LanguageDetector(scanPath);
  const result = detector.detect();

  if (jsonOutput) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log('Language Detection Results');
    console.log('='.repeat(50));
    console.log(`Scan Path: ${result.scanPath}`);
    console.log(`Total Files: ${result.totalFiles}`);
    console.log(`Polyglot: ${result.polyglot ? 'YES' : 'NO'}`);
    console.log();

    console.log('Primary Language:');
    console.log(`  ${result.primary.language.toUpperCase()} (${result.primary.confidence} confidence)`);
    if (result.primary.frameworks && result.primary.frameworks.length > 0) {
      console.log(`  Frameworks: ${result.primary.frameworks.join(', ')}`);
    }
    console.log('  Evidence:');
    if (result.primary.evidence.packageFiles) {
      console.log(`    - Package files: ${result.primary.evidence.packageFiles.join(', ')}`);
    }
    if (result.primary.evidence.fileCount) {
      console.log(`    - Source files: ${result.primary.evidence.fileCount}`);
    }
    if (result.primary.evidence.shebangCount) {
      console.log(`    - Shebang scripts: ${result.primary.evidence.shebangCount}`);
    }

    if (result.secondary.length > 0) {
      console.log();
      console.log('Secondary Languages:');
      for (const lang of result.secondary) {
        console.log(`  ${lang.language.toUpperCase()} (${lang.confidence} confidence)`);
        if (lang.frameworks && lang.frameworks.length > 0) {
          console.log(`    Frameworks: ${lang.frameworks.join(', ')}`);
        }
        if (lang.evidence.fileCount) {
          console.log(`    Files: ${lang.evidence.fileCount}`);
        }
      }
    }
  }
}

// Run if executed directly
if (import.meta.main) {
  main().catch(console.error);
}

export { LanguageDetector, type DetectionResult, type LanguageDetection };
