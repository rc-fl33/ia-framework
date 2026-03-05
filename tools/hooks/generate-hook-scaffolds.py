#!/usr/bin/env python3
"""
Generate hook scaffolds from Jinja2 template and JSON manifest.

This tool creates properly structured hook skeletons based on configuration,
reducing token usage and ensuring consistency across all hooks.

Usage:
  python generate-hook-scaffolds.py [--output-dir hooks/pre-commit]
"""

import json
import sys
from pathlib import Path
from typing import Dict, Any

try:
    from jinja2 import Environment, FileSystemLoader, Template
except ImportError:
    print("ERROR: Jinja2 not installed. Run: pip install jinja2", file=sys.stderr)
    sys.exit(1)


def load_manifest(manifest_path: Path) -> Dict[str, Any]:
    """Load hook configuration from JSON manifest."""
    try:
        with open(manifest_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"ERROR: Cannot load manifest: {e}", file=sys.stderr)
        sys.exit(1)


def load_template(template_path: Path):
    """Load Jinja2 template and environment."""
    try:
        # Create environment
        env = Environment()
        env.filters['repr'] = repr

        with open(template_path, 'r', encoding='utf-8') as f:
            template_content = f.read()

        return env.from_string(template_content)
    except Exception as e:
        print(f"ERROR: Cannot load template: {e}", file=sys.stderr)
        sys.exit(1)


def generate_scaffold(hook_config: Dict[str, Any], template: Template) -> str:
    """Generate scaffold from config using template."""
    try:
        return template.render(**hook_config)
    except Exception as e:
        print(f"ERROR: Template rendering failed: {e}", file=sys.stderr)
        sys.exit(1)


def validate_scaffold(scaffold_code: str, hook_name: str) -> bool:
    """Basic validation of generated scaffold."""
    issues = []

    # Check Python syntax
    try:
        compile(scaffold_code, f"{hook_name}.py", 'exec')
    except SyntaxError as e:
        issues.append(f"Syntax error: {e}")

    # Check required elements
    required_elements = [
        ("#!/usr/bin/env python3", "Shebang"),
        ('"""', "Docstring"),
        ("if __name__", "Main guard"),
        ("def main():", "Main function"),
        ("sys.exit(", "Exit code"),
    ]

    for element, name in required_elements:
        if element not in scaffold_code:
            issues.append(f"Missing {name}: {element}")

    if issues:
        print(f"  [WARN] {hook_name}:", file=sys.stderr)
        for issue in issues:
            print(f"    - {issue}", file=sys.stderr)
        return False

    return True


def write_scaffold(output_path: Path, scaffold_code: str, hook_name: str) -> bool:
    """Write scaffold to file."""
    try:
        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(scaffold_code)
        output_path.chmod(0o755)  # Make executable
        print(f"  [OK] Generated: {output_path}", file=sys.stderr)
        return True
    except Exception as e:
        print(f"  [ERROR] Cannot write {output_path}: {e}", file=sys.stderr)
        return False


def main():
    """Generate all hook scaffolds from manifest."""
    manifest_path = Path("hooks/config/hooks-manifest.json")
    template_path = Path("hooks/templates/hook-scaffold.jinja2")
    output_dir = Path("hooks/pre-commit")

    print("Generating Hook Scaffolds...", file=sys.stderr)
    print("", file=sys.stderr)

    # Load manifest and template
    if not manifest_path.exists():
        print(f"ERROR: Manifest not found: {manifest_path}", file=sys.stderr)
        sys.exit(1)

    if not template_path.exists():
        print(f"ERROR: Template not found: {template_path}", file=sys.stderr)
        sys.exit(1)

    manifest = load_manifest(manifest_path)
    template = load_template(template_path)

    # Generate scaffolds
    total = 0
    success = 0

    for hook_id, hook_config in manifest.items():
        if not hook_config.get("enabled", True):
            print(f"  [SKIP] {hook_id} (disabled)", file=sys.stderr)
            continue

        total += 1
        print(f"Generating {hook_id}...", file=sys.stderr)

        # Generate scaffold
        scaffold = generate_scaffold(hook_config, template)

        # Validate
        is_valid = validate_scaffold(scaffold, hook_id)

        # Write file
        hook_file = output_dir / f"{hook_id}.py"
        if write_scaffold(hook_file, scaffold, hook_id):
            success += 1
        else:
            print(f"  [ERROR] Failed to write {hook_file}", file=sys.stderr)

        print("", file=sys.stderr)

    # Summary
    print("=" * 80, file=sys.stderr)
    print(f"Generated {success}/{total} hook scaffolds", file=sys.stderr)
    print("=" * 80, file=sys.stderr)
    print("", file=sys.stderr)

    if success == total:
        print("[OK] All scaffolds generated successfully", file=sys.stderr)
        print("", file=sys.stderr)
        print("Next steps:", file=sys.stderr)
        print("  1. Review generated files in hooks/pre-commit/", file=sys.stderr)
        print("  2. Replace IMPLEMENTATION_PLACEHOLDER sections with logic", file=sys.stderr)
        print("  3. Replace MAIN_LOGIC_PLACEHOLDER sections with validation code", file=sys.stderr)
        print("  4. Use context piping to feed AI the scaffolds for implementation", file=sys.stderr)
        print("", file=sys.stderr)
        sys.exit(0)
    else:
        print(f"[ERROR] {total - success} scaffolds failed", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
