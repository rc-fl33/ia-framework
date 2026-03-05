#!/usr/bin/env python3
"""
Framework Update Tool - Intelligent updates with conflict detection

Updates the IA Framework while preserving user customizations.
Uses staged updates with conflict detection and merge options.

Usage:
    python framework-update.py           # Interactive update
    python framework-update.py --check   # Preview only
    python framework-update.py --force   # Accept all upstream
"""

import argparse
import os
import shutil
import subprocess
import sys
import yaml
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Tuple

# Add tools to path for framework_paths import
sys.path.insert(0, str(Path(__file__).parent.parent))
from framework_paths import FRAMEWORK_DIR


# =============================================================================
# CONFIGURATION
# =============================================================================

UPSTREAM_REPO = "https://github.com/notchrisgroves/ia-framework.git"
STAGING_DIR = FRAMEWORK_DIR / ".framework-staging"
BACKUP_DIR = FRAMEWORK_DIR / ".framework-backup"
MANIFEST_PATH = FRAMEWORK_DIR / ".framework-manifest.yaml"

# Files that are NEVER overwritten
PROTECTED_PATTERNS = [
    ".env",
    ".env.*",
    "!.env.example",  # Exception: example can be updated
    "sessions/**",
    "plans/**",
    "output/**",
    "input/**",
    "blog/posts/**",
    ".framework-staging/**",
    ".framework-backup/**",
]

# Files that should always be updated (framework core)
CORE_FILES = [
    "CLAUDE.md",
    "settings.json",
    ".framework-manifest.yaml",
    "tools/framework_paths.py",
]


# =============================================================================
# UTILITY FUNCTIONS
# =============================================================================

def run_git(args: List[str], cwd: Optional[Path] = None) -> Tuple[bool, str]:
    """Run a git command and return (success, output)."""
    try:
        result = subprocess.run(
            ["git"] + args,
            cwd=cwd or FRAMEWORK_DIR,
            capture_output=True,
            text=True,
            timeout=60
        )
        return result.returncode == 0, result.stdout + result.stderr
    except subprocess.TimeoutExpired:
        return False, "Git command timed out"
    except Exception as e:
        return False, str(e)


def get_current_version() -> Tuple[str, str]:
    """Get current version (tag/branch) and commit hash."""
    success, output = run_git(["rev-parse", "--short", "HEAD"])
    commit = output.strip() if success else "unknown"

    success, output = run_git(["describe", "--tags", "--always"])
    version = output.strip() if success else commit

    return version, commit


def get_local_changes() -> Dict[str, str]:
    """
    Get locally modified files.

    Returns:
        Dict mapping file path to status (M=modified, A=added, D=deleted, ?=untracked)
    """
    changes = {}

    # Tracked file changes
    success, output = run_git(["status", "--porcelain"])
    if success:
        for line in output.strip().split("\n"):
            if line:
                status = line[:2].strip()
                filepath = line[3:].strip()
                if status:
                    changes[filepath] = status[0] if status else "?"

    return changes


def is_protected(filepath: str) -> bool:
    """Check if a file is protected from updates."""
    from fnmatch import fnmatch

    for pattern in PROTECTED_PATTERNS:
        if pattern.startswith("!"):
            # Exception pattern
            if fnmatch(filepath, pattern[1:]):
                return False
        elif fnmatch(filepath, pattern):
            return True
    return False


def remove_readonly(func, path, exc):
    """Handle read-only files on Windows (used by shutil.rmtree)."""
    import stat
    import errno
    excvalue = exc[1]
    if func in (os.rmdir, os.remove, os.unlink) and excvalue.errno == errno.EACCES:
        os.chmod(path, stat.S_IWRITE)
        func(path)
    else:
        raise excvalue


def fetch_upstream() -> bool:
    """Fetch latest upstream to staging directory."""
    print("\nFetching latest framework...")

    # Clean staging directory
    if STAGING_DIR.exists():
        shutil.rmtree(STAGING_DIR, onerror=remove_readonly)

    # Clone to staging
    success, output = run_git([
        "clone",
        "--depth", "1",
        UPSTREAM_REPO,
        str(STAGING_DIR)
    ], cwd=FRAMEWORK_DIR.parent)

    if not success:
        print(f"  [ERROR] Failed to fetch upstream: {output}")
        return False

    print("  [OK] Fetched to staging directory")
    return True


def compare_files() -> Dict[str, Dict]:
    """
    Compare local files with upstream.

    Returns:
        Dict with categories: safe_updates, conflicts, preserved, unchanged
    """
    result = {
        "safe_updates": [],      # Can apply automatically
        "conflicts": [],          # Need user decision
        "preserved": [],          # User files, never touch
        "unchanged": [],          # No changes needed
        "new_upstream": [],       # New files from upstream
    }

    local_changes = get_local_changes()

    # Walk through staging (upstream files)
    for upstream_file in STAGING_DIR.rglob("*"):
        if upstream_file.is_dir():
            continue
        if ".git" in upstream_file.parts:
            continue

        rel_path = upstream_file.relative_to(STAGING_DIR)
        local_file = FRAMEWORK_DIR / rel_path
        rel_str = str(rel_path).replace("\\", "/")

        # Skip protected files
        if is_protected(rel_str):
            if local_file.exists():
                result["preserved"].append({
                    "path": rel_str,
                    "reason": "Protected file"
                })
            continue

        # Check if file exists locally
        if not local_file.exists():
            result["new_upstream"].append({
                "path": rel_str,
                "action": "New file from upstream"
            })
            continue

        # Compare contents
        try:
            upstream_content = upstream_file.read_bytes()
            local_content = local_file.read_bytes()

            if upstream_content == local_content:
                result["unchanged"].append(rel_str)
                continue

            # Files differ - check if locally modified
            if rel_str in local_changes:
                result["conflicts"].append({
                    "path": rel_str,
                    "local_status": local_changes[rel_str],
                    "reason": "Modified locally and upstream"
                })
            else:
                result["safe_updates"].append({
                    "path": rel_str,
                    "reason": "Upstream change, no local modifications"
                })
        except Exception as e:
            print(f"  [WARN] Error comparing {rel_str}: {e}")

    return result


def create_backup() -> Optional[Path]:
    """Create backup of current installation."""
    timestamp = datetime.now().strftime("%Y-%m-%d-%H%M%S")
    backup_path = BACKUP_DIR / timestamp

    print(f"\nCreating backup at {backup_path}...")

    try:
        backup_path.mkdir(parents=True, exist_ok=True)

        # Copy only files that will be modified
        # For now, just note the backup location
        with open(backup_path / "backup-info.txt", "w") as f:
            f.write(f"Backup created: {timestamp}\n")
            f.write(f"Framework dir: {FRAMEWORK_DIR}\n")
            version, commit = get_current_version()
            f.write(f"Version: {version} ({commit})\n")

        print(f"  [OK] Backup location noted")
        return backup_path
    except Exception as e:
        print(f"  [ERROR] Backup failed: {e}")
        return None


def merge_settings_json(local_settings: Path, upstream_settings: Path) -> bool:
    """
    Intelligently merge settings.json files.
    Preserves user hooks, adds framework hooks, merges env vars.
    """
    try:
        import subprocess

        # Call the TypeScript merge tool
        result = subprocess.run([
            "bun",
            str(FRAMEWORK_DIR / "tools/framework-update/merge-settings-json.ts"),
            "apply",
            str(local_settings),
            str(upstream_settings)
        ], capture_output=True, text=True, timeout=30)

        if result.returncode == 0:
            print("  [OK] settings.json merged (user hooks preserved)")
            return True
        else:
            print(f"  [WARN] settings.json merge had issues: {result.stderr}")
            return False
    except Exception as e:
        print(f"  [ERROR] Failed to merge settings.json: {e}")
        return False


def apply_update(comparison: Dict, force: bool = False) -> bool:
    """Apply the update based on comparison results."""
    print("\nApplying updates...")

    applied = 0
    skipped = 0
    errors = 0

    # Special handling for settings.json if it's a safe update
    settings_merged = False
    for item in comparison["safe_updates"]:
        if item["path"] == "settings.json":
            src = STAGING_DIR / item["path"]
            dst = FRAMEWORK_DIR / item["path"]
            if src.exists() and dst.exists():
                # Perform intelligent merge
                if merge_settings_json(dst, src):
                    applied += 1
                    settings_merged = True
                    comparison["safe_updates"].remove(item)
                    break
            else:
                # Normal copy if one doesn't exist
                try:
                    dst.parent.mkdir(parents=True, exist_ok=True)
                    shutil.copy2(src, dst)
                    applied += 1
                    print(f"  [OK] {item['path']}")
                    settings_merged = True
                    comparison["safe_updates"].remove(item)
                    break
                except Exception as e:
                    errors += 1
                    print(f"  [ERROR] {item['path']}: {e}")

    # Apply safe updates
    for item in comparison["safe_updates"]:
        src = STAGING_DIR / item["path"]
        dst = FRAMEWORK_DIR / item["path"]
        try:
            dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, dst)
            applied += 1
            print(f"  [OK] {item['path']}")
        except Exception as e:
            errors += 1
            print(f"  [ERROR] {item['path']}: {e}")

    # Apply new files from upstream
    for item in comparison["new_upstream"]:
        src = STAGING_DIR / item["path"]
        dst = FRAMEWORK_DIR / item["path"]
        try:
            dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, dst)
            applied += 1
            print(f"  [NEW] {item['path']}")
        except Exception as e:
            errors += 1
            print(f"  [ERROR] {item['path']}: {e}")

    # Handle conflicts
    for item in comparison["conflicts"]:
        if force:
            src = STAGING_DIR / item["path"]
            dst = FRAMEWORK_DIR / item["path"]
            try:
                shutil.copy2(src, dst)
                applied += 1
                print(f"  [FORCE] {item['path']}")
            except Exception as e:
                errors += 1
                print(f"  [ERROR] {item['path']}: {e}")
        else:
            skipped += 1
            print(f"  [SKIP] {item['path']} (conflict - keeping yours)")

    print(f"\nUpdate Summary:")
    print(f"  Applied: {applied}")
    print(f"  Skipped: {skipped}")
    print(f"  Errors: {errors}")
    print(f"  Preserved: {len(comparison['preserved'])}")

    return errors == 0


def cleanup_staging():
    """Remove staging directory."""
    if STAGING_DIR.exists():
        shutil.rmtree(STAGING_DIR, onerror=remove_readonly)


def load_manifest() -> Optional[Dict]:
    """Load and parse .framework-manifest.yaml."""
    if not MANIFEST_PATH.exists():
        return None

    try:
        with open(MANIFEST_PATH, "r") as f:
            return yaml.safe_load(f)
    except Exception as e:
        print(f"  [WARN] Failed to load manifest: {e}")
        return None


def get_severity_summary() -> Dict[str, int]:
    """Get update severity counts from manifest."""
    manifest = load_manifest()
    if not manifest or "updates" not in manifest:
        return {"critical": 0, "standard": 0, "optional": 0}

    updates = manifest["updates"]
    return {
        "critical": updates.get("critical_available", 0),
        "standard": updates.get("standard_available", 0),
        "optional": updates.get("optional_available", 0)
    }


def generate_release_notes() -> Optional[str]:
    """Generate release notes using TypeScript tool."""
    try:
        import subprocess

        result = subprocess.run([
            "bun",
            str(FRAMEWORK_DIR / "tools/framework-update/generate-release-notes.ts")
        ], capture_output=True, text=True, timeout=10)

        if result.returncode == 0:
            return result.stdout
        else:
            return None
    except Exception as e:
        print(f"  [WARN] Could not generate release notes: {e}")
        return None


def print_severity_report(severity: Dict[str, int]):
    """Print severity-based update report."""
    print("\n" + "=" * 70)
    print("IA FRAMEWORK - UPDATE CHECK")
    print("=" * 70)

    if severity["critical"] > 0:
        print(f"\n🔴 [CRITICAL] {severity['critical']} security update(s) available:")
        print("   ⚠️  Security fixes and breaking changes")
        print("   ACTION: Update immediately")

    if severity["standard"] > 0:
        print(f"\n🟡 [STANDARD] {severity['standard']} feature update(s) available:")
        print("   • Features, improvements, and bug fixes")
        print("   ACTION: Recommended")

    if severity["optional"] > 0:
        print(f"\n🟢 [OPTIONAL] {severity['optional']} enhancement(s) available:")
        print("   • Nice-to-have improvements")
        print("   ACTION: At your convenience")

    total = severity["critical"] + severity["standard"] + severity["optional"]
    if total == 0:
        print("\n✅ Framework is up to date!")

    print("\n" + "=" * 70)


def display_release_notes():
    """Generate and display release notes."""
    print("\n📝 Generating release notes...")
    notes = generate_release_notes()

    if notes:
        print(notes)
    else:
        print("  [INFO] Could not generate detailed release notes")
        print("         Run: bun tools/framework-update/generate-release-notes.ts")


# =============================================================================
# MAIN WORKFLOW
# =============================================================================

def print_report(comparison: Dict):
    """Print a user-friendly update report."""
    print("\n" + "=" * 60)
    print("FRAMEWORK UPDATE REPORT")
    print("=" * 60)

    version, commit = get_current_version()
    print(f"\nCurrent Version: {version} ({commit})")

    print(f"\nSafe Updates: {len(comparison['safe_updates'])} files")
    for item in comparison["safe_updates"][:5]:
        print(f"  • {item['path']}")
    if len(comparison["safe_updates"]) > 5:
        print(f"  ... and {len(comparison['safe_updates']) - 5} more")

    print(f"\nNew from Upstream: {len(comparison['new_upstream'])} files")
    for item in comparison["new_upstream"][:5]:
        print(f"  + {item['path']}")
    if len(comparison["new_upstream"]) > 5:
        print(f"  ... and {len(comparison['new_upstream']) - 5} more")

    if comparison["conflicts"]:
        print(f"\nConflicts: {len(comparison['conflicts'])} files")
        for item in comparison["conflicts"]:
            print(f"  ! {item['path']} ({item['reason']})")

    print(f"\nPreserved (your files): {len(comparison['preserved'])} files")
    print(f"Unchanged: {len(comparison['unchanged'])} files")

    print("\n" + "=" * 60)


def main():
    parser = argparse.ArgumentParser(
        description="Update IA Framework with conflict detection"
    )
    parser.add_argument(
        "--check",
        action="store_true",
        help="Preview changes without applying"
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Accept all upstream changes (overwrite conflicts)"
    )
    args = parser.parse_args()

    print("IA Framework Update Tool")
    print("=" * 40)

    # Check if we're in a git repo
    if not (FRAMEWORK_DIR / ".git").exists():
        print("[ERROR] Framework directory is not a git repository")
        print(f"  Location: {FRAMEWORK_DIR}")
        sys.exit(1)

    # Show severity summary first
    severity = get_severity_summary()
    print_severity_report(severity)

    # Show detailed release notes
    display_release_notes()

    # If only checking, show update check output
    if args.check:
        print("\n[CHECK MODE] To apply these updates, run:")
        print("  claude /framework-update")
        return

    # Fetch upstream
    if not fetch_upstream():
        sys.exit(1)

    try:
        # Compare files
        print("\nAnalyzing differences...")
        comparison = compare_files()

        # Print report
        print_report(comparison)

        # Check for critical updates requiring confirmation
        if severity["critical"] > 0:
            print("\n" + "!" * 70)
            print("⚠️  CRITICAL UPDATES DETECTED")
            print("!" * 70)
            print(f"\n{severity['critical']} critical update(s) require immediate action.")
            print("These include security fixes and breaking changes.")
            print("\nRecommended: Apply critical + standard updates")
            print("Conservative: Apply critical only")
            print("Skip: Don't update now (not recommended)\n")

            response = input("Apply critical + standard updates? [y/N]: ")
            if response.lower() != "y":
                print("\nUpdate cancelled - critical updates were not applied")
                print("This is not recommended for security reasons")
                return

        # Confirm if there are conflicts and not forcing
        if comparison["conflicts"] and not args.force:
            print("\nConflicts detected. Options:")
            print("  1. Run with --force to accept all upstream changes")
            print("  2. Manually resolve conflicts")
            print("  3. Keep your current files (do nothing)")

            response = input("\nProceed with safe updates only? [y/N]: ")
            if response.lower() != "y":
                print("\nUpdate cancelled")
                return

        # Create backup
        create_backup()

        # Apply updates
        success = apply_update(comparison, force=args.force)

        if success:
            print("\n[OK] Framework update complete!")
        else:
            print("\n[WARN] Update completed with errors")

    finally:
        # Cleanup
        cleanup_staging()


if __name__ == "__main__":
    main()
