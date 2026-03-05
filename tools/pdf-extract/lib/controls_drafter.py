"""
controls_drafter.py - Generate controls-draft.yaml from extracted sections.

Identifies ISO clauses and annex controls, producing stub YAML that
downstream agents will flesh out into full compliance documentation.
"""

import re
from datetime import date
from typing import Optional


ANNEX_CONTROL_PATTERN = re.compile(r'^[A-Z]\.\d')


def classify_control(section: dict) -> str:
    """Return 'annex_control', 'clause', or 'subclause'."""
    sid = section.get("id", "")
    if sid.upper().startswith("ANNEX"):
        return "annex"
    if ANNEX_CONTROL_PATTERN.match(sid):
        return "annex_control"
    if '.' in sid:
        return "subclause"
    return "clause"


def get_annex_letter(section_id: str) -> Optional[str]:
    """Extract annex letter: 'A.2.2' -> 'A'"""
    if ANNEX_CONTROL_PATTERN.match(section_id):
        return section_id[0]
    return None


def truncate_content(text: str, max_chars: int = 500) -> str:
    """Truncate content for the draft YAML to keep it readable."""
    if not text:
        return ""
    text = text.strip()
    if len(text) <= max_chars:
        return text
    return text[:max_chars].rsplit(' ', 1)[0] + "..."


def flatten_sections(sections: list) -> list:
    """Flatten nested sections into a single ordered list."""
    flat = []

    def _flatten(sec_list, depth=0):
        for sec in sec_list:
            flat.append((depth, sec))
            _flatten(sec.get("subsections", []), depth + 1)

    _flatten(sections)
    return flat


def build_controls_draft(
    sections: list,
    framework: str,
    version: str,
    source_pdf: str,
    extraction_date: Optional[str] = None,
) -> dict:
    """
    Build the controls-draft data structure from extracted sections.

    Returns a dict ready for YAML serialization.
    """
    if extraction_date is None:
        extraction_date = date.today().isoformat()

    controls = []
    flat = flatten_sections(sections)

    for depth, sec in flat:
        sid = sec.get("id", "")
        title = sec.get("title", "")
        content = truncate_content(sec.get("content", ""))
        ctrl_type = classify_control(sec)
        annex_letter = get_annex_letter(sid)

        control = {
            "id": sid,
            "title": title,
            "type": ctrl_type,
            "clause_ref": sid,
            "status": "draft",
            "content": content,
        }

        if annex_letter:
            control["annex"] = annex_letter

        controls.append(control)

    return {
        "framework": framework,
        "version": version,
        "status": "draft",
        "source": f"auto-extracted from {source_pdf}",
        "extraction_date": extraction_date,
        "controls": controls,
    }


def serialize_controls_yaml(data: dict) -> str:
    """
    Serialize controls draft to YAML string without requiring PyYAML.
    Uses manual formatting for clean output.
    """
    lines = []
    lines.append(f"framework: {data['framework']}")
    lines.append(f'version: "{data["version"]}"')
    lines.append(f"status: {data['status']}")
    lines.append(f'source: "{data["source"]}"')
    lines.append(f'extraction_date: "{data["extraction_date"]}"')
    lines.append("controls:")

    for ctrl in data.get("controls", []):
        lines.append(f"  - id: \"{_escape_yaml(ctrl.get('id', ''))}\"")
        lines.append(f"    title: \"{_escape_yaml(ctrl.get('title', ''))}\"")
        lines.append(f"    type: {ctrl.get('type', 'clause')}")
        lines.append(f"    clause_ref: \"{_escape_yaml(ctrl.get('clause_ref', ''))}\"")
        if ctrl.get("annex"):
            lines.append(f"    annex: \"{ctrl['annex']}\"")
        lines.append(f"    status: {ctrl.get('status', 'draft')}")

        content = ctrl.get("content", "")
        if content:
            # Use block scalar for multi-line content
            lines.append("    content: |")
            for cline in content.split('\n'):
                lines.append(f"      {cline}")
        else:
            lines.append('    content: ""')

    return '\n'.join(lines) + '\n'


def _escape_yaml(text: str) -> str:
    """Escape double quotes in YAML string values."""
    return str(text).replace('"', '\\"').replace('\n', ' ').strip()


def generate_from_readme(
    readme_path: str,
    framework: str,
    version: str,
    extraction_date: Optional[str] = None,
) -> dict:
    """
    Generate a minimal controls-draft from a README.md when no PDF is available.
    Extracts bullet points and headings as stub controls.
    """
    if extraction_date is None:
        extraction_date = date.today().isoformat()

    controls = []
    try:
        with open(readme_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        content = f"Error reading README: {e}"

    # Extract headings and bullet points as stub controls
    lines = content.split('\n')
    ctrl_idx = 1

    for line in lines:
        stripped = line.strip()
        if stripped.startswith('#'):
            # Heading
            title = stripped.lstrip('#').strip()
            if title and title.lower() not in ('readme', framework.lower()):
                controls.append({
                    "id": f"readme-{ctrl_idx:02d}",
                    "title": title,
                    "type": "clause",
                    "clause_ref": f"readme-{ctrl_idx:02d}",
                    "status": "draft",
                    "content": "",
                })
                ctrl_idx += 1
        elif stripped.startswith('-') or stripped.startswith('*'):
            # Bullet point — include as a note
            note = stripped.lstrip('-*').strip()
            if note and len(note) > 10:
                controls.append({
                    "id": f"note-{ctrl_idx:02d}",
                    "title": note[:80],
                    "type": "note",
                    "clause_ref": f"note-{ctrl_idx:02d}",
                    "status": "draft",
                    "content": note,
                })
                ctrl_idx += 1

    return {
        "framework": framework,
        "version": version,
        "status": "draft",
        "source": f"auto-extracted from README.md (no PDF available)",
        "extraction_date": extraction_date,
        "note": "No PDF available for this standard. Controls are stubs derived from README.",
        "controls": controls,
    }
