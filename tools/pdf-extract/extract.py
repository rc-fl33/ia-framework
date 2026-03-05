#!/usr/bin/env python3
"""
extract.py - ISO PDF extraction CLI.

Extracts structured content from ISO standard PDFs, producing:
  - {framework}-extracted.json  Structured sections, tables, images
  - controls-draft.yaml         Stub controls for downstream compliance work

Usage:
  python tools/pdf-extract/extract.py --pdf path/to/file.pdf \
      --framework iso-42001 --output path/to/extracted/

For merging multiple PDFs (e.g., ISO 27001 split across files):
  python tools/pdf-extract/extract.py --pdf a.pdf b.pdf \
      --framework iso-27001 --output path/to/extracted/ --merge
"""

import sys
import os

# Ensure lib/ is importable regardless of cwd
_SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, _SCRIPT_DIR)

import json
import click
from datetime import date

from lib.text_extractor import (
    extract_text_from_pdf,
    parse_sections,
    process_tables,
)
from lib.image_extractor import (
    extract_images_from_pdf,
    assign_images_to_sections,
)
from lib.controls_drafter import (
    build_controls_draft,
    serialize_controls_yaml,
    generate_from_readme,
)

FRAMEWORK_META = {
    "iso-42001": {"name": "ISO/IEC 42001:2023", "version": "2023"},
    "iso-27001": {"name": "ISO/IEC 27001:2022", "version": "2022"},
    "iso-9001": {"name": "ISO 9001:2015", "version": "2015"},
    "iso-13485": {"name": "ISO 13485:2016", "version": "2016"},
    "iso-19011": {"name": "ISO/IEC 19011:2011", "version": "2011"},
    "iso-42005": {"name": "ISO/IEC 42005:2025", "version": "2025"},
    "iso-42006": {"name": "ISO/IEC 42006:2025", "version": "2025"},
    "iso-24028": {"name": "ISO/IEC 24028:2020", "version": "2020"},
}


def process_single_pdf(pdf_path: str, output_dir: str) -> dict:
    """
    Extract content from one PDF. Returns the extraction result dict
    (sections, tables, images, total_pages).
    """
    pdf_name = os.path.basename(pdf_path)
    click.echo(f"  Extracting: {pdf_name}")

    result = extract_text_from_pdf(pdf_path)

    if result.get("error"):
        click.echo(f"  WARNING: pdfplumber error: {result['error']}", err=True)
        return {
            "source_pdf": pdf_name,
            "total_pages": 0,
            "sections": [],
            "tables": [],
            "images": [],
            "error": result["error"],
        }

    click.echo(f"  Pages: {result['total_pages']}")

    sections = parse_sections(result["pages"])
    click.echo(f"  Sections detected: {_count_sections(sections)}")

    structured_tables = process_tables(result["tables"], sections)
    click.echo(f"  Tables found: {len(structured_tables)}")

    images = extract_images_from_pdf(pdf_path, output_dir)
    real_images = [img for img in images if "error" not in img]
    click.echo(f"  Images extracted: {len(real_images)}")

    assign_images_to_sections(real_images, sections)

    # Attach tables to top-level sections by index
    for i, tbl in enumerate(structured_tables):
        if sections:
            sections[min(i, len(sections) - 1)]["tables"].append(tbl)

    return {
        "source_pdf": pdf_name,
        "total_pages": result["total_pages"],
        "sections": sections,
        "tables": structured_tables,
        "images": real_images,
    }


def merge_extractions(extractions: list, framework_name: str) -> dict:
    """
    Merge multiple per-PDF extraction results into one unified extraction.
    """
    all_sections = []
    all_tables = []
    all_images = []
    total_pages = 0
    source_pdfs = []

    for ext in extractions:
        all_sections.extend(ext.get("sections", []))
        all_tables.extend(ext.get("tables", []))
        all_images.extend(ext.get("images", []))
        total_pages += ext.get("total_pages", 0)
        source_pdfs.append(ext.get("source_pdf", ""))

    return {
        "framework": framework_name,
        "source_pdf": "; ".join(source_pdfs),
        "extraction_date": date.today().isoformat(),
        "total_pages": total_pages,
        "sections": all_sections,
        "tables": all_tables,
        "images": all_images,
    }


def _count_sections(sections: list) -> int:
    """Count total sections including subsections recursively."""
    count = len(sections)
    for sec in sections:
        count += _count_sections(sec.get("subsections", []))
    return count


@click.command()
@click.option(
    "--pdf", "pdf_paths", multiple=True, required=False,
    help="Path(s) to PDF file(s) to process.",
)
@click.option(
    "--readme", "readme_path", default=None,
    help="Path to README.md when no PDF is available.",
)
@click.option(
    "--framework", required=True,
    help="Framework identifier, e.g. iso-42001",
)
@click.option(
    "--output", "output_dir", required=True,
    help="Output directory for extracted files.",
)
@click.option(
    "--merge", is_flag=True, default=False,
    help="Merge multiple PDFs into one extraction.",
)
@click.option(
    "--skip-images", is_flag=True, default=False,
    help="Skip image extraction (faster for text-only use).",
)
def main(pdf_paths, readme_path, framework, output_dir, merge, skip_images):
    """
    Extract structured content from ISO standard PDFs.

    Produces {framework}-extracted.json and controls-draft.yaml in OUTPUT_DIR.
    """
    os.makedirs(output_dir, exist_ok=True)

    meta = FRAMEWORK_META.get(framework, {
        "name": framework.upper(),
        "version": "unknown",
    })
    framework_name = meta["name"]
    framework_version = meta["version"]

    extraction_date = date.today().isoformat()

    # --- README-only path (no PDF) ---
    if readme_path and not pdf_paths:
        click.echo(f"Framework: {framework_name}")
        click.echo(f"Source: README.md (no PDF available)")
        click.echo(f"Output: {output_dir}")

        controls_data = generate_from_readme(
            readme_path=readme_path,
            framework=framework,
            version=framework_version,
            extraction_date=extraction_date,
        )

        # Minimal JSON extraction
        extraction = {
            "framework": framework_name,
            "source_pdf": "N/A - see README.md",
            "extraction_date": extraction_date,
            "total_pages": 0,
            "sections": [],
            "tables": [],
            "images": [],
            "note": controls_data.get("note", ""),
        }

        json_path = os.path.join(output_dir, f"{framework}-extracted.json")
        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(extraction, f, indent=2, ensure_ascii=False)
        click.echo(f"Wrote: {json_path}")

        yaml_path = os.path.join(output_dir, "controls-draft.yaml")
        with open(yaml_path, "w", encoding="utf-8") as f:
            f.write(serialize_controls_yaml(controls_data))
        click.echo(f"Wrote: {yaml_path}")

        click.echo("Done.")
        return

    # --- PDF extraction path ---
    if not pdf_paths:
        click.echo("ERROR: Provide --pdf or --readme", err=True)
        sys.exit(1)

    # Validate all PDFs exist
    for pdf_path in pdf_paths:
        if not os.path.isfile(pdf_path):
            click.echo(f"ERROR: PDF not found: {pdf_path}", err=True)
            sys.exit(1)

    click.echo(f"Framework: {framework_name}")
    click.echo(f"PDFs: {len(pdf_paths)}")
    click.echo(f"Output: {output_dir}")

    extractions = []
    for pdf_path in pdf_paths:
        if skip_images:
            # Monkey-patch to skip image extraction
            ext = process_single_pdf_no_images(pdf_path, output_dir)
        else:
            ext = process_single_pdf(pdf_path, output_dir)
        extractions.append(ext)

    if merge or len(pdf_paths) > 1:
        final_extraction = merge_extractions(extractions, framework_name)
    else:
        ext = extractions[0]
        final_extraction = {
            "framework": framework_name,
            "source_pdf": ext["source_pdf"],
            "extraction_date": extraction_date,
            "total_pages": ext["total_pages"],
            "sections": ext["sections"],
            "tables": ext["tables"],
            "images": ext["images"],
        }

    # Write JSON
    json_path = os.path.join(output_dir, f"{framework}-extracted.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(final_extraction, f, indent=2, ensure_ascii=False)
    click.echo(f"Wrote: {json_path}")

    # Build and write controls-draft.yaml
    source_pdf_label = final_extraction.get("source_pdf", "unknown")
    controls_data = build_controls_draft(
        sections=final_extraction["sections"],
        framework=framework,
        version=framework_version,
        source_pdf=source_pdf_label,
        extraction_date=extraction_date,
    )

    yaml_path = os.path.join(output_dir, "controls-draft.yaml")
    with open(yaml_path, "w", encoding="utf-8") as f:
        f.write(serialize_controls_yaml(controls_data))
    click.echo(f"Wrote: {yaml_path}")

    total_controls = len(controls_data["controls"])
    click.echo(f"Controls drafted: {total_controls}")
    click.echo("Done.")


def process_single_pdf_no_images(pdf_path: str, output_dir: str) -> dict:
    """Variant of process_single_pdf that skips image extraction."""
    pdf_name = os.path.basename(pdf_path)
    click.echo(f"  Extracting: {pdf_name}")

    result = extract_text_from_pdf(pdf_path)

    if result.get("error"):
        click.echo(f"  WARNING: pdfplumber error: {result['error']}", err=True)
        return {
            "source_pdf": pdf_name,
            "total_pages": 0,
            "sections": [],
            "tables": [],
            "images": [],
        }

    sections = parse_sections(result["pages"])
    structured_tables = process_tables(result["tables"], sections)

    return {
        "source_pdf": pdf_name,
        "total_pages": result["total_pages"],
        "sections": sections,
        "tables": structured_tables,
        "images": [],
    }


if __name__ == "__main__":
    main()
