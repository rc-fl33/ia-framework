/**
 * Prompt Renderer - Lightweight Template Engine for IA Framework
 *
 * Mustache-like interpolation, conditionals, includes, and iteration.
 * Self-contained: uses only `fs` and `path`. No framework imports.
 *
 * Usage:
 *   const renderer = new PromptRenderer({ basePath: './prompts' });
 *   const output = renderer.render('Hello {{name}}!', { name: 'World' });
 *
 * CLI:
 *   bun run prompt-renderer.ts --template file.md --var name=World --session session.json
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname, resolve } from 'path';

export interface PromptRendererOptions {
  /** Base path for resolving include directives */
  basePath?: string;
  /** Maximum depth for nested includes (default: 3) */
  maxIncludeDepth?: number;
}

export type VariableValue = string | number | boolean | Record<string, unknown> | VariableValue[] | null | undefined;
export type Variables = Record<string, VariableValue>;

const HTML_ESCAPE: Record<string, string> = {
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
};

function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (ch) => HTML_ESCAPE[ch]);
}

function resolveVar(name: string, vars: Variables): VariableValue {
  const result = name.split('.').reduce((ctx: VariableValue | Record<string, VariableValue>, key: string) => {
    if (ctx && typeof ctx === 'object' && !Array.isArray(ctx)) {
      return (ctx as Record<string, VariableValue>)[key];
    }
    return undefined;
  }, vars);
  return result as VariableValue;
}

/**
 * Prompt template engine. Supports {{var}}, {{{raw}}}, {{#if}}, {{#unless}},
 * {{#if_eq}}, {{#each}}, {{> include}}, and built-in date/timestamp variables.
 */
export class PromptRenderer {
  private basePath: string;
  private maxIncludeDepth: number;

  constructor(options: PromptRendererOptions = {}) {
    this.basePath = options.basePath ?? process.cwd();
    this.maxIncludeDepth = options.maxIncludeDepth ?? 3;
  }

  /** Render a template string with the given variables. */
  render(template: string, variables: Variables = {}): string {
    const vars = { ...this.builtins(), ...variables };
    return this.process(template, vars, this.basePath, 0);
  }

  /** Read a file and render it as a template. */
  renderFile(filePath: string, variables: Variables = {}): string {
    const absPath = resolve(this.basePath, filePath);
    const content = readFileSync(absPath, 'utf-8');
    const vars = { ...this.builtins(), ...variables };
    return this.process(content, vars, dirname(absPath), 0);
  }

  /** Load variables from a session JSON file. */
  loadVariablesFromSession(sessionJsonPath: string): Variables {
    if (!existsSync(sessionJsonPath)) return {};
    const raw = JSON.parse(readFileSync(sessionJsonPath, 'utf-8'));
    return { ...raw, phase: raw.phase ?? raw.current_phase ?? '' };
  }

  /** Parse SCOPE.md YAML front matter (key: value pairs between --- fences). */
  loadVariablesFromScope(scopeMdPath: string): Variables {
    if (!existsSync(scopeMdPath)) return {};
    const content = readFileSync(scopeMdPath, 'utf-8');
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) return {};
    const vars: Variables = {};
    for (const line of match[1].split('\n')) {
      const kv = line.match(/^(\w[\w.-]*)\s*:\s*(.+)$/);
      if (kv) vars[kv[1]] = kv[2].replace(/^["']|["']$/g, '').trim();
    }
    return vars;
  }

  private builtins(): Variables {
    const now = new Date();
    return { date: now.toISOString().slice(0, 10), timestamp: now.toISOString() };
  }

  /** Core template processing engine */
  private process(tpl: string, vars: Variables, dir: string, depth: number): string {
    let out = tpl;

    // 1. Include directives: {{> path/to/file.md}}
    if (depth < this.maxIncludeDepth) {
      out = out.replace(/\{\{>\s*(.+?)\s*\}\}/g, (_, file: string) => {
        const incPath = resolve(dir, file);
        if (!existsSync(incPath)) return `[include not found: ${file}]`;
        const content = readFileSync(incPath, 'utf-8');
        return this.process(content, vars, dirname(incPath), depth + 1);
      });
    } else {
      out = out.replace(/\{\{>\s*(.+?)\s*\}\}/g, '[max include depth reached]');
    }

    // 2. {{#each items}}...{{/each}}
    out = out.replace(
      /\{\{#each\s+(\w[\w.]*)\}\}([\s\S]*?)\{\{\/each\}\}/g,
      (_, key: string, body: string) => {
        const arr = resolveVar(key, vars);
        if (!Array.isArray(arr)) return '';
        return arr.map((item, i) => {
          let rendered = body.replace(/\{\{this\}\}/g, String(item));
          rendered = rendered.replace(/\{\{@index\}\}/g, String(i));
          return this.process(rendered, { ...vars, this: item, '@index': i }, dir, depth);
        }).join('');
      }
    );

    // 3. {{#if_eq var "value"}}...{{/if_eq}}
    out = out.replace(
      /\{\{#if_eq\s+(\w[\w.]*)\s+"([^"]*)"\}\}([\s\S]*?)\{\{\/if_eq\}\}/g,
      (_, key: string, val: string, body: string) => {
        return String(resolveVar(key, vars)) === val
          ? this.process(body, vars, dir, depth)
          : '';
      }
    );

    // 4. {{#if cond}}...{{/if}}
    out = out.replace(
      /\{\{#if\s+(\w[\w.]*)\}\}([\s\S]*?)\{\{\/if\}\}/g,
      (_, key: string, body: string) => {
        const val = resolveVar(key, vars);
        return val && (!Array.isArray(val) || val.length > 0)
          ? this.process(body, vars, dir, depth)
          : '';
      }
    );

    // 5. {{#unless cond}}...{{/unless}}
    out = out.replace(
      /\{\{#unless\s+(\w[\w.]*)\}\}([\s\S]*?)\{\{\/unless\}\}/g,
      (_, key: string, body: string) => {
        const val = resolveVar(key, vars);
        return !val || (Array.isArray(val) && val.length === 0)
          ? this.process(body, vars, dir, depth)
          : '';
      }
    );

    // 6. Unescaped interpolation: {{{variable}}}
    out = out.replace(/\{\{\{(\w[\w.]*)\}\}\}/g, (_, key: string) => {
      const val = resolveVar(key, vars);
      return val != null ? String(val) : '';
    });

    // 7. Escaped interpolation: {{variable}}
    out = out.replace(/\{\{(\w[\w.]*)\}\}/g, (_, key: string) => {
      const val = resolveVar(key, vars);
      return val != null ? escapeHtml(String(val)) : '';
    });

    return out;
  }
}

/** Merge variable sources: 1. explicit  2. session  3. scope  4. IA_* env vars */
export function mergeVariableSources(
  explicit: Variables,
  session: Variables,
  scope: Variables
): Variables {
  const envVars: Variables = {};
  for (const [k, v] of Object.entries(process.env)) {
    if (k.startsWith('IA_') && v !== undefined) {
      envVars[k.slice(3).toLowerCase()] = v;
    }
  }
  return { ...envVars, ...scope, ...session, ...explicit };
}

// --------------- CLI Entry Point ---------------
if (import.meta.path === Bun.main || process.argv[1]?.endsWith('prompt-renderer.ts')) {
  const args = process.argv.slice(2);
  const flags: Variables = {};
  let templatePath = '';
  let sessionPath = '';
  let scopePath = '';

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--template': case '-t': templatePath = args[++i] ?? ''; break;
      case '--session': case '-s': sessionPath = args[++i] ?? ''; break;
      case '--scope':              scopePath = args[++i] ?? ''; break;
      case '--var': case '-v': {
        const [k, ...rest] = (args[++i] ?? '').split('=');
        if (k) flags[k] = rest.join('=');
        break;
      }
      default:
        if (args[i].startsWith('--var=')) {
          const [k, ...rest] = args[i].slice(6).split('=');
          if (k) flags[k] = rest.join('=');
        }
    }
  }

  if (!templatePath) {
    console.error('Usage: prompt-renderer --template <file> [--session <file>] [--scope <file>] [--var k=v ...]');
    process.exit(1);
  }

  const renderer = new PromptRenderer({ basePath: dirname(resolve(templatePath)) });
  const session = sessionPath ? renderer.loadVariablesFromSession(resolve(sessionPath)) : {};
  const scope = scopePath ? renderer.loadVariablesFromScope(resolve(scopePath)) : {};
  const merged = mergeVariableSources(flags, session, scope);

  console.log(renderer.renderFile(resolve(templatePath), merged));
}
