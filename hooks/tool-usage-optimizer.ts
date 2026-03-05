/**
 * Tool Usage Optimizer Hook
 *
 * PostToolUse hook that analyzes tool usage patterns and suggests better alternatives.
 * Helps agents learn optimal tool usage for common tasks.
 *
 * Trigger: PostToolUse on Bash tool
 * Action: Parse command, detect anti-patterns, suggest better tools
 */

interface PostToolUseInput {
  tool_name: string;
  tool_input: {
    command?: string;
    [key: string]: unknown;
  };
}

interface OptimizationSuggestion {
  pattern: string;
  betterTool: string;
  reason: string;
  example: string;
}

async function main() {
  const input = await Bun.stdin.text();

  try {
    const data: PostToolUseInput = JSON.parse(input);

    // Only process Bash tool calls
    if (data.tool_name !== 'Bash') {
      process.exit(0);
    }

    const command = data.tool_input?.command;
    if (!command) {
      process.exit(0);
    }

    // Analyze command for optimization opportunities
    const suggestion = analyzeCommand(command);

    if (suggestion) {
      console.log('<system-reminder>');
      console.log('💡 TOOL USAGE OPTIMIZATION');
      console.log('');
      console.log(`Pattern detected: ${suggestion.pattern}`);
      console.log(`Better tool: ${suggestion.betterTool}`);
      console.log(`Reason: ${suggestion.reason}`);
      console.log('');
      console.log(`Example: ${suggestion.example}`);
      console.log('</system-reminder>');
    } else {
      // IMPORTANT: Always produce output to avoid empty text blocks in API calls
      // Empty output causes: "messages: text content blocks must be non-empty" error
      console.log('<!-- tool-usage-optimizer: no suggestions -->');
    }

    process.exit(0);

  } catch (err) {
    // Don't block on hook errors
    console.error('Tool usage optimizer error:', (err as Error).message);
    process.exit(0);
  }
}

function analyzeCommand(command: string): OptimizationSuggestion | null {
  const cmd = command.trim();

  // Pattern 1: cat for reading files
  if (/^cat\s+[^|>]+$/.test(cmd) && !cmd.includes('<<')) {
    return {
      pattern: 'Using cat to read files',
      betterTool: 'Read',
      reason: 'Read tool provides better formatting, line numbers, and pagination for large files',
      example: 'Read({ file_path: "/path/to/file.txt" })'
    };
  }

  // Pattern 2: grep for searching
  if (/^grep\s+-/.test(cmd) || /^rg\s+/.test(cmd)) {
    return {
      pattern: 'Using grep/rg via Bash',
      betterTool: 'Grep',
      reason: 'Grep tool is optimized with better output formatting and result limiting',
      example: 'Grep({ pattern: "search", path: ".", output_mode: "content" })'
    };
  }

  // Pattern 3: find for file discovery
  if (/^find\s+/.test(cmd) && !cmd.includes('-exec')) {
    return {
      pattern: 'Using find to locate files',
      betterTool: 'Glob',
      reason: 'Glob tool is faster and provides sorted results by modification time',
      example: 'Glob({ pattern: "**/*.ts" })'
    };
  }

  // Pattern 4: echo to write files
  if (/echo.*>/.test(cmd) && !cmd.includes('>>')) {
    return {
      pattern: 'Using echo to write files',
      betterTool: 'Write',
      reason: 'Write tool provides atomic writes and better error handling',
      example: 'Write({ file_path: "/path/file.txt", content: "..." })'
    };
  }

  // Pattern 5: sed/awk for file editing
  if (/^sed\s+/.test(cmd) || /^awk\s+/.test(cmd)) {
    return {
      pattern: 'Using sed/awk to edit files',
      betterTool: 'Edit',
      reason: 'Edit tool provides exact string replacement with validation',
      example: 'Edit({ file_path: "file.txt", old_string: "old", new_string: "new" })'
    };
  }

  // Pattern 6: head/tail for partial file reading
  if (/^head\s+/.test(cmd) || /^tail\s+/.test(cmd)) {
    return {
      pattern: 'Using head/tail to read file portions',
      betterTool: 'Read',
      reason: 'Read tool supports offset and limit parameters for partial reads',
      example: 'Read({ file_path: "file.txt", offset: 0, limit: 10 })'
    };
  }

  // Pattern 7: ls with wildcards for file matching
  if (/^ls\s+.*\*/.test(cmd)) {
    return {
      pattern: 'Using ls with wildcards',
      betterTool: 'Glob',
      reason: 'Glob tool provides pattern matching across directories',
      example: 'Glob({ pattern: "**/*.js" })'
    };
  }

  // Pattern 8: echo for user communication
  if (/^echo\s+".*"/.test(cmd) && !cmd.includes('>')) {
    return {
      pattern: 'Using echo to communicate with user',
      betterTool: 'Direct text output',
      reason: 'Output text directly in your response instead of using Bash echo',
      example: 'Just write the message in your response text'
    };
  }

  // Pattern 9: Multiple chained commands that could be parallel
  if ((cmd.match(/&&/g) || []).length >= 2 && !cmd.includes('cd ')) {
    const commands = cmd.split('&&').map(c => c.trim());
    const allIndependent = commands.every(c =>
      !c.startsWith('cd ') &&
      !c.includes('git commit') &&
      !c.includes('git push')
    );

    if (allIndependent) {
      return {
        pattern: 'Chaining independent commands with &&',
        betterTool: 'Parallel Bash calls',
        reason: 'Independent commands can run in parallel for better performance',
        example: 'Use multiple Bash tool calls in a single message instead of chaining'
      };
    }
  }

  return null;
}

main();
