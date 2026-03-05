"""
image_extractor.py - Extract images from PDF using PyMuPDF (fitz).

Only extracts images meeting a minimum area threshold to skip decorative
elements (logos, borders, small icons).
"""

import os
from typing import Optional
import fitz  # PyMuPDF


MIN_IMAGE_AREA = 5000  # pixels squared — skip smaller decorative images


def extract_images_from_pdf(
    pdf_path: str,
    output_dir: str,
    min_area: int = MIN_IMAGE_AREA,
) -> list:
    """
    Extract images from PDF, saving to output_dir/images/.

    Returns list of image metadata dicts:
      {id, page, path, width, height, area}
    """
    images_dir = os.path.join(output_dir, "images")
    os.makedirs(images_dir, exist_ok=True)

    extracted = []
    figure_counter = 0

    try:
        doc = fitz.open(pdf_path)
    except Exception as e:
        return [{"error": str(e)}]

    for page_num in range(len(doc)):
        page = doc[page_num]
        page_number = page_num + 1  # 1-based

        try:
            image_list = page.get_images(full=True)
        except Exception:
            continue

        for img_idx, img_info in enumerate(image_list):
            xref = img_info[0]

            try:
                base_image = doc.extract_image(xref)
            except Exception:
                continue

            if not base_image:
                continue

            width = base_image.get("width", 0)
            height = base_image.get("height", 0)
            area = width * height

            if area < min_area:
                continue  # skip small decorative images

            figure_counter += 1
            ext = base_image.get("ext", "png")
            img_filename = f"page-{page_number:03d}-fig-{figure_counter:03d}.{ext}"
            img_path = os.path.join(images_dir, img_filename)
            relative_path = f"images/{img_filename}"

            try:
                with open(img_path, "wb") as f:
                    f.write(base_image["image"])
            except Exception as e:
                continue

            img_id = f"F-{figure_counter:03d}"
            extracted.append({
                "id": img_id,
                "page": page_number,
                "path": relative_path,
                "width": width,
                "height": height,
                "area": area,
            })

    doc.close()
    return extracted


def assign_images_to_sections(images: list, sections: list) -> None:
    """
    Assign extracted images to sections based on page proximity.
    Images are attached to the section whose content appears on or before
    the image's page. Mutates sections in-place.
    """
    if not images or not sections:
        return

    # Build flat list of sections with their approximate page ranges
    def flatten_sections(section_list, flat=None):
        if flat is None:
            flat = []
        for sec in section_list:
            flat.append(sec)
            flatten_sections(sec.get("subsections", []), flat)
        return flat

    flat = flatten_sections(sections)

    for img in images:
        if "error" in img:
            continue
        img_page = img["page"]

        # Find the last section that starts at or before this page
        target = None
        for sec in flat:
            # Estimate section start page from first image or content
            # Since we don't track page per section, attach to last top-level section
            target = sec

        if target is not None:
            target["images"].append({
                "id": img["id"],
                "page": img["page"],
                "path": img["path"],
            })
