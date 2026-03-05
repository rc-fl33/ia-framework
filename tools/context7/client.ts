#!/usr/bin/env bun
/**
 * Context7 API Client - Framework Wrapper
 *
 * Official SDK: @upstash/context7-sdk
 * Documentation: https://context7.com/docs/sdks/ts/getting-started
 *
 * Features:
 * - Search for libraries by name
 * - Retrieve up-to-date documentation with LLM ranking
 * - JSON or plain text output formats
 * - Automatic API key loading from .env
 */

import { Context7, Context7Error } from '@upstash/context7-sdk';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env from framework root
config({ path: resolve(import.meta.dir, '../../../.env') });

/**
 * Search for libraries by name with LLM-powered relevance ranking
 *
 * @param query - User's question for relevance ranking (e.g., "I need to build a UI with components")
 * @param libraryName - Library identifier (e.g., "react", "next.js")
 * @returns Array of matching libraries with IDs like "/facebook/react"
 */
export async function searchLibrary(query: string, libraryName: string) {
  try {
    const client = new Context7();
    const libraries = await client.searchLibrary(query, libraryName);
    return libraries;
  } catch (error) {
    if (error instanceof Context7Error) {
      throw new Error(`Context7 API error: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Get documentation context for a specific library
 *
 * @param query - Question about the library (e.g., "How do I use hooks?")
 * @param libraryId - Library ID from searchLibrary (e.g., "/facebook/react")
 * @param options - Output format and filtering options
 * @returns Documentation snippets with title, content, and metadata
 */
export async function getContext(
  query: string,
  libraryId: string,
  options?: {
    type?: 'json' | 'txt';  // Default: json
    topic?: string;         // Optional topic filter
    tokens?: number;        // Maximum tokens to return
  }
) {
  try {
    const client = new Context7();
    const context = await client.getContext(query, libraryId, options);
    return context;
  } catch (error) {
    if (error instanceof Context7Error) {
      throw new Error(`Context7 API error: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Search and get documentation in one call (convenience method)
 *
 * @param query - Question about the library
 * @param libraryName - Library name to search
 * @param options - Output format and filtering options
 * @returns Documentation context from the best matching library
 */
export async function searchAndGetContext(
  query: string,
  libraryName: string,
  options?: {
    type?: 'json' | 'txt';
    topic?: string;
    tokens?: number;
  }
) {
  // First, search for the library
  const libraries = await searchLibrary(query, libraryName);

  if (!libraries || libraries.length === 0) {
    throw new Error(`No libraries found matching: ${libraryName}`);
  }

  // Use the first (best) match
  const libraryId = libraries[0].id;

  // Get documentation context
  return getContext(query, libraryId, options);
}

// CLI usage
if (import.meta.main) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage:');
    console.error('  bun client.ts search <query> <library-name>');
    console.error('  bun client.ts get <query> <library-id> [--type txt|json] [--tokens N]');
    console.error('  bun client.ts quick <query> <library-name> [--type txt|json]');
    console.error('\nExamples:');
    console.error('  bun client.ts search "UI components" react');
    console.error('  bun client.ts get "How do I use hooks?" /facebook/react --type txt');
    console.error('  bun client.ts quick "authentication setup" next.js');
    process.exit(1);
  }

  const command = args[0];

  try {
    if (command === 'search') {
      const query = args[1];
      const libraryName = args[2];
      const results = await searchLibrary(query, libraryName);

      console.log(`Found ${results.length} libraries:\n`);
      results.forEach((lib: any, idx: number) => {
        console.log(`${idx + 1}. ${lib.title || lib.id} (${lib.id})`);
        console.log(`   ${lib.description || 'No description'}`);
        if (lib.trustScore !== undefined) {
          console.log(`   Trust Score: ${lib.trustScore}/10 | Benchmark: ${lib.benchmarkScore}/100`);
        }
        if (lib.stars !== undefined) {
          console.log(`   Stars: ${lib.stars.toLocaleString()}`);
        }
        console.log();
      });

    } else if (command === 'get') {
      const query = args[1];
      const libraryId = args[2];
      const typeArg = args.find(arg => arg.startsWith('--type='))?.split('=')[1] as 'json' | 'txt' | undefined;
      const tokensArg = args.find(arg => arg.startsWith('--tokens='))?.split('=')[1];

      const options = {
        ...(typeArg && { type: typeArg }),
        ...(tokensArg && { tokens: parseInt(tokensArg) })
      };

      const context = await getContext(query, libraryId, options);

      if (typeArg === 'txt') {
        console.log(context);
      } else {
        console.log(JSON.stringify(context, null, 2));
      }

    } else if (command === 'quick') {
      const query = args[1];
      const libraryName = args[2];
      const typeArg = args.find(arg => arg.startsWith('--type='))?.split('=')[1] as 'json' | 'txt' | undefined;

      const context = await searchAndGetContext(query, libraryName, {
        ...(typeArg && { type: typeArg })
      });

      if (typeArg === 'txt') {
        console.log(context);
      } else {
        console.log(JSON.stringify(context, null, 2));
      }

    } else {
      console.error(`Unknown command: ${command}`);
      process.exit(1);
    }

  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : error}`);
    process.exit(1);
  }
}
