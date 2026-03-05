# PDF Export Workflow

## Overview

Export markdown files to PDF directly from the monitoring dashboard.

## Components

### 1. Export Script
**File:** `scripts/export-pdf.ts`
- Converts markdown to styled HTML using `marked` library
- Uses Puppeteer to render HTML and generate PDF
- Saves PDF in same directory as source markdown file

### 2. Server API
**Endpoint:** `POST /api/export-pdf`
- Validates file path (must be .md file)
- Checks file permissions
- Calls export script
- Returns PDF path or error

### 3. UI Components
**Button:** "PDF" button in editor toolbar
- Only visible when a markdown file is open
- Shows loading state during export
- Displays success/error message

## Usage

1. Open a markdown file in the dashboard
2. Click the "PDF" button in the toolbar
3. Wait for export to complete (3-5 seconds)
4. PDF is saved in the same directory as the markdown file

## Technical Details

### Dependencies
- `marked`: Markdown to HTML conversion
- `puppeteer`: Headless browser for PDF generation

### PDF Styling
- A4 format with 2cm margins
- Professional typography (system fonts)
- Syntax-highlighted code blocks
- Proper page breaks for headings
- Clickable links with URLs printed

### File Paths
- Input: `tools/monitor/sessions/example.md`
- Output: `tools/monitor/sessions/example.pdf`

## CLI Usage

```bash
# Export from command line
bun run scripts/export-pdf.ts sessions/example.md
```

## Error Handling

- Invalid file path: 400 Bad Request
- Non-markdown file: 400 Bad Request
- Permission denied: 403 Forbidden
- File not found: 404 Not Found
- Export failure: 500 Internal Server Error

## Future Enhancements

- Batch export (multiple files)
- Custom PDF templates
- Page header/footer options
- Table of contents generation
- Export other formats (DOCX, HTML)
