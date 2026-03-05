#!/usr/bin/env python3
"""
Update Reference Documentation

Scans skills and commands, updates local catalogs, regenerates blog reference,
and publishes to Ghost.

Usage:
    python tools/docs/update-reference.py [--scan-only] [--no-publish]

Options:
    --scan-only     Only scan and report, don't update files
    --no-publish    Update files but don't publish to Ghost
"""

import os
import re
import sys
import io
import json
import yaml
import subprocess
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional, Tuple

# Ensure UTF-8 output on Windows
if sys.stdout.encoding != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
if sys.stderr.encoding != 'utf-8':
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# Framework root
FRAMEWORK_ROOT = Path(__file__).parent.parent.parent

# Paths
SKILLS_DIR = FRAMEWORK_ROOT / "skills"
COMMANDS_DIR = FRAMEWORK_ROOT / "commands"
COMMANDS_CATALOG = FRAMEWORK_ROOT / "library" / "catalogs" / "COMMANDS.md"
BLOG_REFERENCE = FRAMEWORK_ROOT / "blog" / "pages" / "ia-framework-reference" / "draft.md"
BLOG_METADATA = FRAMEWORK_ROOT / "blog" / "pages" / "ia-framework-reference" / "metadata.json"


def extract_frontmatter(file_path: Path) -> Optional[Dict]:
    """Extract YAML frontmatter from a markdown file."""
    try:
        content = file_path.read_text(encoding='utf-8')
        if not content.startswith('---'):
            return None

        # Find end of frontmatter
        end_match = re.search(r'\n---\s*\n', content[3:])
        if not end_match:
            return None

        frontmatter_yaml = content[3:end_match.start() + 3]
        return yaml.safe_load(frontmatter_yaml)
    except Exception as e:
        print(f"  Warning: Could not parse {file_path.name}: {e}", file=sys.stderr)
        return None


def scan_skills() -> List[Dict]:
    """Scan all skills and extract metadata."""
    skills = []

    for skill_dir in sorted(SKILLS_DIR.iterdir()):
        if not skill_dir.is_dir():
            continue

        skill_file = skill_dir / "SKILL.md"
        if not skill_file.exists():
            continue

        frontmatter = extract_frontmatter(skill_file)
        if frontmatter and 'name' in frontmatter:
            skills.append({
                'name': frontmatter['name'],
                'description': frontmatter.get('description', ''),
                'path': str(skill_dir.relative_to(FRAMEWORK_ROOT))
            })

    return skills


def scan_commands() -> List[Dict]:
    """Scan all commands and extract metadata."""
    commands = []

    for cmd_file in sorted(COMMANDS_DIR.glob("*.md")):
        if cmd_file.name == "README.md":
            continue

        frontmatter = extract_frontmatter(cmd_file)
        if frontmatter and 'name' in frontmatter:
            commands.append({
                'name': frontmatter['name'],
                'description': frontmatter.get('description', ''),
                'agent': frontmatter.get('agent', 'Base Claude'),
                'skill': frontmatter.get('skill', 'N/A'),
                'path': str(cmd_file.relative_to(FRAMEWORK_ROOT))
            })

    return commands


def parse_existing_commands_catalog() -> Tuple[str, str, str]:
    """Parse COMMANDS.md and extract header, table section, and footer."""
    content = COMMANDS_CATALOG.read_text(encoding='utf-8')

    # Find the Command Reference Matrix section
    matrix_start = content.find("## Command Reference Matrix")
    if matrix_start == -1:
        return content, "", ""

    # Find the next section after the table
    next_section = re.search(r'\n## (?!Command Reference Matrix)', content[matrix_start:])
    if next_section:
        matrix_end = matrix_start + next_section.start()
    else:
        matrix_end = len(content)

    header = content[:matrix_start]
    footer = content[matrix_end:]

    return header, content[matrix_start:matrix_end], footer


def generate_commands_table(commands: List[Dict]) -> str:
    """Generate the Command Reference Matrix markdown table."""
    lines = [
        "## Command Reference Matrix",
        "",
        "| Command | Description | Agent | Skill | Structure | Output Location |",
        "|---------|-------------|-------|-------|-----------|-----------------|"
    ]

    # Group commands by category for better organization
    for cmd in commands:
        name = f"`/{cmd['name']}`"
        desc = cmd['description']
        agent = cmd['agent'] if cmd['agent'] != 'Base Claude' else 'Base Claude'
        skill = cmd['skill'] if cmd['skill'] != 'N/A' else 'N/A'

        # Infer structure and output location from command patterns
        structure = "Single file"
        output = "Direct response"

        # Customize based on known patterns
        if cmd['name'] in ['pentest']:
            structure = "5-phase prompt chain"
            output = "`output/engagements/pentests/`"
        elif cmd['name'] in ['code-review']:
            structure = "3-phase prompt chain"
            output = "`output/engagements/code-reviews/`"
        elif cmd['name'] in ['write']:
            structure = "5-phase prompt chain"
            output = "`blog/posts/`"
        elif cmd['name'] in ['risk-assessment']:
            structure = "3-phase prompt chain"
            output = "`output/engagements/risk-assessments/`"
        elif cmd['name'].startswith('ir-'):
            structure = "Single file + metadata"
            output = "`output/engagements/incident-response/`"
        elif cmd['name'] in ['vuln-scan', 'segmentation-test']:
            structure = "Single file + metadata"
            output = f"`output/engagements/{cmd['name'].replace('-', '_')}s/`"
        elif cmd['name'] in ['arch-review', 'threat-intel', 'dependency-audit', 'secure-config', 'benchmark-gen']:
            structure = "Single file + metadata"
            output = "`output/engagements/`"
        elif cmd['name'] in ['job-analysis', 'clifton', 'mentorship']:
            structure = "Single file + metadata"
            output = "`output/career/`"
        elif cmd['name'] in ['training']:
            structure = "Single file"
            output = "`output/fitness/`"
        elif cmd['name'] in ['git-sync', 'public-sync', 'framework-update', 'update-reference']:
            structure = "Utility"
            output = "N/A"
        elif cmd['name'] in ['ingest-repo']:
            structure = "Single file"
            output = "`resources/repositories/`"
        elif cmd['name'] in ['newsletter']:
            structure = "Single file"
            output = "`blog/newsletters/`"
        elif cmd['name'] in ['diagram', 'generate-image']:
            structure = "Single file"
            output = "Specified path"

        lines.append(f"| {name} | {desc} | {agent} | {skill} | {structure} | {output} |")

    lines.append("")
    return "\n".join(lines)


def update_commands_catalog(commands: List[Dict], dry_run: bool = False) -> bool:
    """Update COMMANDS.md with current command inventory."""
    header, _, footer = parse_existing_commands_catalog()

    # Generate new table
    new_table = generate_commands_table(commands)

    # Combine
    new_content = header + new_table + footer

    if dry_run:
        print("\n[DRY RUN] Would update COMMANDS.md")
        return True

    # Backup original
    backup_path = COMMANDS_CATALOG.with_suffix('.md.bak')
    COMMANDS_CATALOG.rename(backup_path)

    # Write new content
    COMMANDS_CATALOG.write_text(new_content, encoding='utf-8')

    # Remove backup on success
    backup_path.unlink()

    return True


def find_missing_in_blog(skills: List[Dict], commands: List[Dict]) -> Tuple[List[str], List[str]]:
    """Find skills and commands missing from blog reference."""
    content = BLOG_REFERENCE.read_text(encoding='utf-8')

    missing_skills = []
    missing_commands = []

    for skill in skills:
        # Check if skill is mentioned in Skills Reference section
        if f"#### {skill['name']}" not in content:
            missing_skills.append(skill['name'])

    for cmd in commands:
        # Check if command is mentioned in Commands Reference section
        if f"`/{cmd['name']}`" not in content and f"/{cmd['name']}" not in content:
            missing_commands.append(cmd['name'])

    return missing_skills, missing_commands


def publish_to_ghost() -> bool:
    """Publish blog reference page to Ghost."""
    try:
        # Read metadata to get page ID
        metadata = json.loads(BLOG_METADATA.read_text(encoding='utf-8'))
        page_id = metadata.get('ghost', {}).get('id')

        if not page_id:
            print("  Error: No Ghost page ID in metadata.json", file=sys.stderr)
            return False

        # Use bun to run the ghost-admin script
        result = subprocess.run(
            ['bun', 'run', 'skills/writer/scripts/ghost-admin.ts', 'update-page',
             '--id', page_id,
             '--file', str(BLOG_REFERENCE)],
            cwd=FRAMEWORK_ROOT,
            capture_output=True,
            text=True
        )

        if result.returncode != 0:
            print(f"  Error: Ghost publish failed: {result.stderr}", file=sys.stderr)
            return False

        print(f"  Published to Ghost: {metadata.get('ghost', {}).get('url', 'unknown')}")
        return True

    except Exception as e:
        print(f"  Error publishing to Ghost: {e}", file=sys.stderr)
        return False


def main():
    import argparse

    parser = argparse.ArgumentParser(description='Update framework reference documentation')
    parser.add_argument('--scan-only', action='store_true', help='Only scan and report')
    parser.add_argument('--no-publish', action='store_true', help='Update files but skip Ghost publish')
    args = parser.parse_args()

    print("=" * 60)
    print("Framework Reference Update")
    print("=" * 60)
    print()

    # Phase 1: Scan
    print("Phase 1: Scanning framework components...")
    skills = scan_skills()
    commands = scan_commands()
    print(f"  Skills: {len(skills)} found")
    print(f"  Commands: {len(commands)} found")
    print()

    if args.scan_only:
        print("Skills:")
        for s in skills:
            print(f"  - {s['name']}: {s['description'][:50]}...")
        print()
        print("Commands:")
        for c in commands:
            print(f"  - /{c['name']}: {c['description'][:50]}...")
        return

    # Phase 2: Update COMMANDS.md
    print("Phase 2: Updating library/catalogs/COMMANDS.md...")
    if update_commands_catalog(commands):
        print(f"  Updated with {len(commands)} commands")
    print()

    # Phase 3: Check blog reference
    print("Phase 3: Checking blog reference...")
    missing_skills, missing_commands = find_missing_in_blog(skills, commands)

    if missing_skills or missing_commands:
        print("  Missing from blog reference:")
        for s in missing_skills:
            print(f"    - Skill: {s}")
        for c in missing_commands:
            print(f"    - Command: /{c}")
        print()
        print("  Action: Manual update required for blog/pages/ia-framework-reference/draft.md")
    else:
        print("  Blog reference is current")
    print()

    # Phase 4: Publish to Ghost
    if not args.no_publish and not missing_skills and not missing_commands:
        print("Phase 4: Publishing to Ghost...")
        if publish_to_ghost():
            print("  Success!")
        else:
            print("  Publish skipped (see errors above)")
    elif args.no_publish:
        print("Phase 4: Skipping Ghost publish (--no-publish)")
    else:
        print("Phase 4: Skipping Ghost publish (blog reference needs manual update first)")

    print()
    print("=" * 60)
    print("Reference update complete")
    print("=" * 60)

    # Update the Last Updated date in COMMANDS.md
    content = COMMANDS_CATALOG.read_text(encoding='utf-8')
    today = datetime.now().strftime('%Y-%m-%d')
    content = re.sub(r'\*\*Last Updated:\*\* \d{4}-\d{2}-\d{2}', f'**Last Updated:** {today}', content)
    COMMANDS_CATALOG.write_text(content, encoding='utf-8')


if __name__ == "__main__":
    main()
