---
name: anydoc
description: Convert office documents (Word, PowerPoint, Excel, OpenDocument, RTF, EPUB, CSV, PDF) to GitHub-Flavored Markdown. Use when a task needs the contents of an office document, spreadsheet, presentation, ebook, or PDF you cannot read directly.
---

# Convert documents to Markdown with anydoc

anydoc is a Rust library with a zero-install CLI that converts office documents to clean GitHub-Flavored Markdown. One consistent output no matter which format goes in; conversion is local and fast (under 5 ms median).

## CLI (no install)

```bash
npx -y @firecrawl/anydoc <file>              # Markdown to stdout
npx -y @firecrawl/anydoc <file> -o out.md    # write to a file
npx -y @firecrawl/anydoc - --format csv < f  # read stdin
```

Needs Node 20+. For a permanent command: `npm install -g @firecrawl/anydoc`.

## Rules

1. **Format detection is content-based.** anydoc reads the format from the file bytes, not the extension, so mislabeled files still convert. Pass `--format <name>` only when detection cannot work: CSV from stdin, or a missing or wrong extension.
2. **Write large documents to a file** with `-o` and read the parts you need, instead of streaming everything into context.
3. **Exit codes:** 0 success, 1 the document could not be converted, 2 usage error, 3 pages of a PDF need OCR. Failures print one `anydoc: <message>` line to stderr. The CLI never prompts.
4. **Scanned PDFs need OCR**, which anydoc does not do locally. Exit 3 names the pages. Rerun with `--ocr hosted` to send the document to Firecrawl Parse. No signup needed; pass `--api-key <key>` or set `FIRECRAWL_API_KEY` for higher limits. Only documents that need OCR leave the machine.
5. **Inside a Node, Python, or Rust codebase**, prefer the library over shelling out: `@firecrawl/anydoc` on npm, `firecrawl-anydoc` on PyPI, `anydoc` on crates.io. Each exposes the same `to_markdown` / `toMarkdown` API.

## Supported formats

| Family | Extensions |
| --- | --- |
| Word | `.doc`, `.docx`, `.docm` |
| PowerPoint | `.ppt`, `.pps`, `.pot`, `.pptx`, `.pptm`, `.ppsx`, `.ppsm` |
| Excel | `.xls`, `.xlsx`, `.xlsm`, `.xlsb` |
| OpenDocument | `.odt`, `.ods`, `.odp` |
| Rich Text | `.rtf` |
| EPUB | `.epub` |
| CSV | `.csv` |
| PDF | `.pdf` |

## Errors

A conversion fails only when no complete Markdown could come out. Handle each variant:

| Error | Meaning | Action |
| --- | --- | --- |
| `Unsupported` | Unknown or unconvertible format | Check the format; skip the file |
| `NeedsOcr` | Scanned or image-only PDF pages | Rerun with `--ocr hosted` |
| `Malformed` | Structurally unusable file | Skip or obtain a clean copy |
| `Encrypted` | Password-protected | Provide credentials or skip |
| `ResourceLimit` | Exceeded a safety limit | Split the document if possible |
| `MissingPart` | Required part absent | Skip; the file is incomplete |
| `Io` | File could not be read | Check the path and permissions |

## Library quick reference

**Node.js:**

```js
import { toMarkdown, toMarkdownBytes } from '@firecrawl/anydoc';

await toMarkdown('report.docx');                    // from a path
await toMarkdownBytes(bytes);                       // from bytes
await toMarkdownBytes(bytes, 'csv');                // name the format
await toMarkdown('scan.pdf', { ocr: 'hosted' });    // scanned PDF
```

**Python:**

```python
import anydoc

anydoc.to_markdown("report.docx")                   # from a path
anydoc.to_markdown_bytes(data)                      # from bytes
anydoc.to_markdown_bytes(data, "csv")               # name the format
anydoc.to_markdown("scan.pdf", ocr="hosted")        # scanned PDF
```
