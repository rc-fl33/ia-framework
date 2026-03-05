# File Permissions System

The monitor dashboard uses a pattern-based permission system to control which files can be viewed and edited through the web interface.

## Security Model

**Defense in depth:**
1. Path validation (blocks path traversal attacks)
2. Path canonicalization (resolves symlinks and `..` references)
3. Blocked paths check (`.env`, `.git`)
4. Pattern-based allowed paths check

## Allowed Directories

These framework directories are accessible through the dashboard:

**Read & Write:**
- `sessions/` - Session metadata
- `plans/` - Design documents
- `skills/` - Skill implementations
- `agents/` - Agent definitions
- `commands/` - Command definitions
- `docs/` - Documentation
- `tools/` - Framework utilities
- `hooks/` - Git hooks and validation
- `private/` - Private documentation

## Root-Level Files (Automatic)

**Pattern-based access** - No code changes needed when adding new files:

**Readable:**
- Any `.md` file at framework root (SECURITY.md, README.md, CLAUDE.md, etc.)
- Any `.pdf` file at framework root
- Any `.docx` file at framework root
- Any `.txt` file at framework root

**Writable (export targets):**
- Any `.pdf` file at framework root
- Any `.docx` file at framework root

**Why this matters:** When you add a new markdown file to the framework root (like `CONTRIBUTING.md`), it's automatically visible in the monitor dashboard without requiring code changes.

## Blocked Paths

Always blocked regardless of patterns:
- `.env` - Credentials
- `.git/` - Git internals

## Adding New File Types

To allow a new file extension at the framework root:

**Edit:** `tools/monitor/scripts/types.ts`

```typescript
export const ALLOWED_ROOT_FILE_EXTENSIONS = {
  read: ['.md', '.pdf', '.docx', '.txt', '.json'], // Add .json
  write: ['.pdf', '.docx'],
};
```

**Restart monitor:** `/monitor-start` (auto-restarts if already running)

## Adding New Directories

To allow access to a new framework directory:

**Edit:** `tools/monitor/scripts/types.ts`

```typescript
export const ALLOWED_READ_DIRECTORIES = [
  'sessions',
  'plans',
  // ... existing dirs
  'new-directory', // Add new directory
];
```

## Implementation

Located in: `tools/monitor/scripts/`

**Files:**
- `types.ts` - Permission configuration and pattern matching
- `server.ts` - Permission enforcement in API handlers

**Function:** `isPathPatternAllowed(path, mode)` - Pattern-based permission check

## Testing

```bash
# Test API access to root file
curl "http://localhost:4747/api/file?path=SECURITY.md"

# Test API access to directory file
curl "http://localhost:4747/api/file?path=docs/README.md"

# Test blocked path (should fail)
curl "http://localhost:4747/api/file?path=.env"
```

## Security Notes

1. **Localhost only** - Server binds to 127.0.0.1 (not 0.0.0.0)
2. **CORS restricted** - Only accepts requests from localhost origin
3. **Path canonicalization** - Prevents `../` traversal attacks
4. **WebSocket origin validation** - Only localhost connections allowed

---

**Version:** 1.0
**Last Updated:** 2026-01-23
**Framework:** Intelligence Adjacent (IA)
