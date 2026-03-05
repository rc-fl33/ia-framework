# pdf-extract

Python CLI tool for extracting structured content from ISO standard PDFs.

Produces per-framework `{framework}-extracted.json` and `controls-draft.yaml`
stubs consumed by compliance documentation workflows.

## Dependencies

```bash
pip install pdfplumber pymupdf click
```

Or use requirements.txt:

```bash
pip install -r tools/pdf-extract/requirements.txt
```

## Usage

Single PDF:

```bash
python tools/pdf-extract/extract.py \
  --pdf "standards/frameworks/iso/42001/docs/ISO_IEC 42001_2023(en).pdf" \
  --framework iso-42001 \
  --output standards/frameworks/iso/42001/docs/extracted/
```

Multiple PDFs merged (ISO 27001 split files):

```bash
python tools/pdf-extract/extract.py \
  --pdf "standards/frameworks/iso/27001/docs/ISO-27001-InfoSec/001-010.pdf" \
  --pdf "standards/frameworks/iso/27001/docs/ISO-27001-InfoSec/011-020.pdf" \
  --pdf "standards/frameworks/iso/27001/docs/ISO-27001-InfoSec/021-026.pdf" \
  --framework iso-27001 \
  --output standards/frameworks/iso/27001/docs/extracted/ \
  --merge
```

README fallback (no PDF available):

```bash
python tools/pdf-extract/extract.py \
  --readme standards/frameworks/iso/24028/docs/README.md \
  --framework iso-24028 \
  --output standards/frameworks/iso/24028/docs/extracted/
```

Skip image extraction for faster runs:

```bash
python tools/pdf-extract/extract.py --pdf file.pdf --framework iso-9001 \
  --output path/to/extracted/ --skip-images
```

## Output Structure

```
extracted/
├── {framework}-extracted.json   Structured sections, tables, image refs
├── controls-draft.yaml          Stub controls for compliance documentation
└── images/                      Extracted figures (>5000 px area)
```

## Supported Frameworks

| Flag | Standard |
|------|---------|
| iso-42001 | ISO/IEC 42001:2023 AI Management System |
| iso-27001 | ISO/IEC 27001:2022 Information Security |
| iso-9001 | ISO 9001:2015 Quality Management |
| iso-13485 | ISO 13485:2016 Medical Devices |
| iso-19011 | ISO/IEC 19011:2011 Audit Guidelines |
| iso-42005 | ISO/IEC 42005:2025 AI Risk Assessment |
| iso-42006 | ISO/IEC 42006:2025 AI Requirements Body |
| iso-24028 | ISO/IEC 24028:2020 AI Trustworthiness (README fallback) |
