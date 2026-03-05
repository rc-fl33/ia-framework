"""
text_extractor.py - Extract text and tables from PDF using pdfplumber.

Handles ISO standard PDF formatting:
- Clause/section detection via numbering patterns
- Header/footer filtering
- Table extraction with fallback to text
"""

import re
from typing import Optional
import pdfplumber

# Patterns for ISO clause/section detection
CLAUSE_PATTERNS = [
    # Top-level numbered clauses: "4 ", "4 Context..."
    re.compile(r'^(\d{1,2})\s+[A-Z]'),
    # Sub-clauses: "4.1 ", "4.1.1 ", "A.2.2 "
    re.compile(r'^(\d{1,2}(?:\.\d{1,2}){1,3})\s+'),
    # Annex clauses: "A.1 ", "A.2.2 "
    re.compile(r'^([A-Z]\.\d{1,2}(?:\.\d{1,2})*)\s+'),
    # Annex headers: "Annex A", "Annex B (normative)"
    re.compile(r'^(Annex\s+[A-Z])'),
]

# Patterns to identify page headers/footers to skip
NOISE_PATTERNS = [
    re.compile(r'ISO(/IEC)?\s+\d{4,5}', re.IGNORECASE),
    re.compile(r'©\s*(ISO|IEC|Copyright)', re.IGNORECASE),
    re.compile(r'^\s*\d+\s*$'),  # lone page numbers
    re.compile(r'All rights reserved', re.IGNORECASE),
    re.compile(r'International Organization for Standardization', re.IGNORECASE),
    re.compile(r'^\s*–\s*\d+\s*–\s*$'),  # ISO page number style: – 12 –
    re.compile(r'^\s*www\.iso\.org\s*$', re.IGNORECASE),
    re.compile(r'^\s*Licensed to\b', re.IGNORECASE),
    re.compile(r'^\s*Preview\s*$', re.IGNORECASE),
]


def is_noise_line(line: str) -> bool:
    """Return True if line is a page header, footer, or copyright noise."""
    stripped = line.strip()
    if not stripped:
        return True
    for pattern in NOISE_PATTERNS:
        if pattern.search(stripped):
            return True
    return False


def detect_clause_id(line: str) -> Optional[str]:
    """
    Return the clause/section ID from the beginning of a line, or None.
    Examples: "4.1 Context" -> "4.1", "A.2.2 AI policy" -> "A.2.2"
    """
    stripped = line.strip()
    for pattern in CLAUSE_PATTERNS:
        m = pattern.match(stripped)
        if m:
            return m.group(1)
    return None


def extract_section_title(line: str, clause_id: str) -> str:
    """Extract the title portion after the clause ID."""
    stripped = line.strip()
    # Remove clause_id prefix and clean up
    after = stripped[len(clause_id):].strip()
    # Strip TOC dot leaders and trailing page numbers: "Title .......12" -> "Title"
    after = re.sub(r'[\s.]{3,}\d+\s*$', '', after)
    # Strip trailing page numbers without dot leaders: "Title 12" (short trailing int)
    after = re.sub(r'\s+\d{1,3}\s*$', '', after)
    # Collapse whitespace
    after = re.sub(r'\s+', ' ', after).strip()
    return after if after else stripped


def extract_text_from_pdf(pdf_path: str) -> dict:
    """
    Extract text and tables from a PDF file using pdfplumber.

    Returns a dict with:
      pages: list of {page_num, text, raw_lines}
      all_text: concatenated clean text
      tables: list of raw table dicts {page, headers, rows}
      total_pages: int
    """
    pages_data = []
    all_tables = []

    try:
        with pdfplumber.open(pdf_path) as pdf:
            total_pages = len(pdf.pages)

            for page in pdf.pages:
                page_num = page.page_number

                # Extract tables from this page
                try:
                    tables = page.extract_tables()
                    if tables:
                        for tbl in tables:
                            if tbl and len(tbl) > 1:
                                all_tables.append({
                                    "page": page_num,
                                    "raw": tbl,
                                })
                except Exception:
                    pass

                # Extract text
                try:
                    raw_text = page.extract_text(x_tolerance=3, y_tolerance=3) or ""
                except Exception:
                    raw_text = ""

                raw_lines = raw_text.split('\n')
                clean_lines = [ln for ln in raw_lines if not is_noise_line(ln)]
                clean_text = '\n'.join(clean_lines)

                pages_data.append({
                    "page_num": page_num,
                    "text": clean_text,
                    "raw_lines": clean_lines,
                })

    except Exception as e:
        return {
            "pages": [],
            "all_text": "",
            "tables": [],
            "total_pages": 0,
            "error": str(e),
        }

    all_text = '\n'.join(p["text"] for p in pages_data)

    return {
        "pages": pages_data,
        "all_text": all_text,
        "tables": all_tables,
        "total_pages": total_pages,
    }


def parse_sections(pages_data: list) -> list:
    """
    Parse extracted page text into a hierarchical section structure.

    Each section has:
      id, title, type, content, subsections, tables, images (filled later)
    """
    # Flatten all lines with page tracking
    line_records = []
    for page in pages_data:
        for line in page["raw_lines"]:
            line_records.append({"line": line, "page": page["page_num"]})

    sections = []
    section_stack = []  # stack of (depth, section_dict)

    def depth_of(clause_id: str) -> int:
        """Return nesting depth: "4"->1, "4.1"->2, "4.1.1"->3, "A.2"->2"""
        if clause_id.startswith('Annex'):
            return 1
        parts = clause_id.replace('A.', '').replace('B.', '').split('.')
        return len(parts)

    def section_type(clause_id: str) -> str:
        if clause_id.upper().startswith('ANNEX'):
            return 'annex'
        elif '.' in clause_id:
            return 'subclause'
        else:
            return 'clause'

    content_buffer = []
    current_section = None

    def flush_content():
        if current_section is not None and content_buffer:
            text = '\n'.join(content_buffer).strip()
            current_section['content'] = text
        content_buffer.clear()

    for record in line_records:
        line = record["line"]
        clause_id = detect_clause_id(line)

        if clause_id:
            flush_content()
            title = extract_section_title(line, clause_id)
            depth = depth_of(clause_id)

            new_section = {
                "id": clause_id,
                "title": title,
                "type": section_type(clause_id),
                "content": "",
                "subsections": [],
                "tables": [],
                "images": [],
            }
            current_section = new_section

            # Trim stack to current depth
            while section_stack and section_stack[-1][0] >= depth:
                section_stack.pop()

            if section_stack:
                # Attach as child of parent
                parent = section_stack[-1][1]
                parent["subsections"].append(new_section)
            else:
                # Top-level section
                sections.append(new_section)

            section_stack.append((depth, new_section))
        else:
            stripped = line.strip()
            if stripped and current_section is not None:
                content_buffer.append(stripped)

    flush_content()
    return sections


def process_tables(raw_tables: list, sections: list) -> list:
    """
    Convert raw pdfplumber table data into structured dicts and
    attach them to the relevant sections.

    Returns list of all structured tables (also mutates sections in-place).
    """
    structured = []
    for i, tbl in enumerate(raw_tables):
        raw = tbl["raw"]
        if not raw or len(raw) == 0:
            continue

        # First non-empty row is headers
        headers = [str(c or '').strip() for c in raw[0]]
        rows = []
        for row in raw[1:]:
            cleaned = [str(c or '').strip() for c in row]
            if any(cleaned):
                rows.append(cleaned)

        table_id = f"T-{i+1:03d}"
        table_dict = {
            "id": table_id,
            "page": tbl["page"],
            "caption": "",
            "headers": headers,
            "rows": rows,
        }
        structured.append(table_dict)

    return structured
