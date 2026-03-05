#!/usr/bin/env bun
/**
 * Framework Dependency Checker
 *
 * Comprehensive check for all optional framework features:
 * - PDF extraction (pdfjs-dist)
 * - PDF splitting (pdf-lib)
 * - PDF generation from markdown (puppeteer)
 * - Word document export (docx-templates)
 * - System dependencies for Chrome-based tools
 */

import { execSync } from 'child_process';

interface DependencyInfo {
  name: string;
  package: string;
  category: 'pdf' | 'export' | 'system';
  optional: boolean;
  command?: string; // npm/bun command to check or install
  systemPackages?: Array<{ lib: string; pkg: string }>;
}

const dependencies: DependencyInfo[] = [
  // PDF Tools
  {
    name: 'PDF Extraction',
    package: 'pdfjs-dist',
    category: 'pdf',
    optional: true,
    command: 'bun add pdfjs-dist',
  },
  {
    name: 'PDF Manipulation',
    package: 'pdf-lib',
    category: 'pdf',
    optional: true,
    command: 'bun add pdf-lib',
  },

  // Export Tools
  {
    name: 'PDF Export (Markdown→PDF)',
    package: 'puppeteer',
    category: 'export',
    optional: true,
    command: 'bun add puppeteer',
  },
  {
    name: 'Word Export',
    package: 'docx-templates',
    category: 'export',
    optional: true,
    command: 'bun add docx-templates',
  },

  // System Dependencies for Puppeteer
  {
    name: 'Chrome/Puppeteer Libraries',
    package: 'system-libs',
    category: 'system',
    optional: true,
    systemPackages: [
      { lib: 'libssl.so.3', pkg: 'libssl3' },
      { lib: 'libnss3.so', pkg: 'libnss3' },
      { lib: 'libatk-1.0.so.0', pkg: 'libatk1.0-0' },
      { lib: 'libatk-bridge-2.0.so.0', pkg: 'libatk-bridge2.0-0' },
      { lib: 'libcups.so.2', pkg: 'libcups2' },
      { lib: 'libdrm.so.2', pkg: 'libdrm2' },
      { lib: 'libxkbcommon.so.0', pkg: 'libxkbcommon0' },
      { lib: 'libXcomposite.so.1', pkg: 'libxcomposite1' },
      { lib: 'libXdamage.so.1', pkg: 'libxdamage1' },
      { lib: 'libXfixes.so.3', pkg: 'libxfixes3' },
      { lib: 'libXrandr.so.2', pkg: 'libxrandr2' },
      { lib: 'libgbm.so.1', pkg: 'libgbm1' },
      { lib: 'libasound.so.2', pkg: 'libasound2' },
    ],
  },
];

interface CheckResult {
  installed: DependencyInfo[];
  missing: DependencyInfo[];
}

/**
 * Check if a package is installed in node_modules
 */
function isPackageInstalled(packageName: string): boolean {
  try {
    require.resolve(packageName);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if system libraries are installed
 */
function checkSystemLibraries(): string[] {
  const missing: string[] = [];

  try {
    const ldcacheOutput = execSync('ldconfig -p', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    const sysLibsDep = dependencies.find(d => d.package === 'system-libs');
    if (sysLibsDep?.systemPackages) {
      for (const { lib, pkg } of sysLibsDep.systemPackages) {
        if (!ldcacheOutput.includes(lib)) {
          missing.push(pkg);
        }
      }
    }
  } catch {
    // ldconfig not available - assume all missing (safe fallback)
    const sysLibsDep = dependencies.find(d => d.package === 'system-libs');
    if (sysLibsDep?.systemPackages) {
      missing.push(...sysLibsDep.systemPackages.map(s => s.pkg));
    }
  }

  return missing;
}

/**
 * Check all dependencies and return organized results
 */
export function checkDependencies(): CheckResult {
  const installed: DependencyInfo[] = [];
  const missing: DependencyInfo[] = [];

  for (const dep of dependencies) {
    if (dep.package === 'system-libs') {
      const missingLibs = checkSystemLibraries();
      if (missingLibs.length === 0) {
        installed.push(dep);
      } else {
        missing.push(dep);
      }
    } else {
      if (isPackageInstalled(dep.package)) {
        installed.push(dep);
      } else {
        missing.push(dep);
      }
    }
  }

  return { installed, missing };
}

/**
 * Print a formatted dependency report
 */
export function printReport(): void {
  const { installed, missing } = checkDependencies();

  console.log('\n' + '='.repeat(70));
  console.log('  FRAMEWORK DEPENDENCY CHECK');
  console.log('='.repeat(70));

  if (installed.length > 0) {
    console.log('\n✅ INSTALLED DEPENDENCIES\n');
    for (const dep of installed) {
      console.log(`  ✓ ${dep.name}`);
      console.log(`    Package: ${dep.package}`);
      if (dep.package !== 'system-libs') {
        console.log(`    Tools: /pdf-extract, /export-pdf, /pdf-split`);
      }
      console.log();
    }
  }

  if (missing.length > 0) {
    console.log('\n⚠️  MISSING OPTIONAL DEPENDENCIES\n');
    for (const dep of missing) {
      console.log(`  ✗ ${dep.name} (OPTIONAL)`);
      console.log(`    Package: ${dep.package}`);
      console.log(`    Tools: /pdf-extract, /export-pdf, /pdf-split`);

      if (dep.package === 'system-libs') {
        console.log(`    Required for: PDF generation from markdown, monitor dashboard`);
        console.log(`    Install with:\n`);
        console.log(`      sudo apt-get update && sudo apt-get install -y \\\n`);
        const packages = dependencies.find(d => d.package === 'system-libs')?.systemPackages;
        if (packages) {
          const pkgNames = packages.map(p => p.pkg);
          console.log(`        ${pkgNames.slice(0, 4).join(' \\\n        ')}`);
          if (pkgNames.length > 4) {
            console.log(`        ${pkgNames.slice(4).join(' \\\n        ')}`);
          }
        }
      } else {
        console.log(`    Install with: ${dep.command}`);
        console.log(`    Why: ${getToolDescription(dep.package)}`);
      }
      console.log();
    }

    console.log('RECOMMENDATION:');
    console.log('  All of these are optional. Install only what you need:\n');
    for (const dep of missing) {
      if (dep.package !== 'system-libs' && dep.command) {
        console.log(`  ${dep.command}`);
      }
    }

    const sysLibsMissing = missing.find(d => d.package === 'system-libs');
    if (sysLibsMissing) {
      console.log(
        '\n  For Chrome/Puppeteer support (PDF generation, monitor dashboard):'
      );
      console.log('  sudo apt-get update && sudo apt-get install -y \\');
      console.log('    libssl3 libnss3 libatk1.0-0 libatk-bridge2.0-0 \\');
      console.log('    libcups2 libdrm2 libxkbcommon0 libxcomposite1 \\');
      console.log('    libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2');
    }
  } else {
    console.log('\n✅ ALL OPTIONAL DEPENDENCIES INSTALLED!\n');
    console.log('  You can use:\n');
    console.log('  ✓ /pdf-extract  - Extract text from PDFs');
    console.log('  ✓ /export-pdf   - Convert markdown to PDF');
    console.log('  ✓ /pdf-split    - Split large PDFs');
    console.log('  ✓ /monitor      - Monitoring dashboard');
  }

  console.log('\n' + '='.repeat(70));
  console.log();
}

/**
 * Get description of what each tool does
 */
function getToolDescription(pkg: string): string {
  const descriptions: Record<string, string> = {
    'pdfjs-dist': 'Extract text from PDFs with structure preservation',
    'pdf-lib': 'Split and manipulate PDF files',
    puppeteer: 'Convert markdown documents to PDF format',
    'docx-templates': 'Export documents to Word format (DOCX)',
  };
  return descriptions[pkg] || 'Export and manipulation tools';
}

// CLI Usage
if (import.meta.main) {
  const command = process.argv[2];

  switch (command) {
    case 'json':
      console.log(JSON.stringify(checkDependencies(), null, 2));
      break;
    case 'missing':
      const { missing } = checkDependencies();
      if (missing.length > 0) {
        console.log('Missing dependencies:');
        missing.forEach(d => console.log(`  - ${d.package}`));
        process.exit(1);
      }
      break;
    default:
      printReport();
  }
}
