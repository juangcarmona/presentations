#!/usr/bin/env python3
"""QA check for a packed PPTX output (no external dependencies).

Reads the .pptx as a ZIP and scans each slide's <a:t> text for:
  - leftover blueprint markers (___SLOT_...___)
  - residual [bracket] placeholders
  - known leftover patterns ("se genera", lorem/ipsum, tbd, …)

Brackets that are intentional manual-insert spots (e.g. an architecture diagram
image the pipeline can't auto-generate) are reported separately as "manual
steps" and do not fail QA.

Usage:
    python scripts/qa.py <output.pptx>

Exit codes:
    0  — clean
    1  — issues found (or file not found)
"""

import re
import sys
import zipfile
from pathlib import Path

LEFTOVER_PATTERNS = [
    "se genera",
    "lorem",
    "ipsum",
    "xxxx",
    "tbd",
]

SLIDE_RE = re.compile(r"ppt/slides/slide(\d+)\.xml$")
TEXT_RE = re.compile(r"<a:t>(.*?)</a:t>", re.DOTALL)
BRACKET_RE = re.compile(r"\[[^\]\n]{1,160}\]")
# shape ids must be unique within a slide; the shell/component mount engine
# (mount.py) renumbers mounted shapes, so a duplicate here flags a mount bug
# (or a malformed blueprint). Universally a corruption — never a false positive.
CNVPR_ID_RE = re.compile(r'<p:cNvPr[^>]*\bid="(\d+)"')

# Bracket placeholders that are *intentional* manual-insert spots (e.g. an
# architecture diagram image that the pipeline can't auto-generate). These are
# reported as required manual steps, not as QA failures.
MANUAL_INSERT_RE = re.compile(r"diagrama|insertar|diagram|\binsert\b|imagen|screenshot", re.I)


def slide_texts(zf: zipfile.ZipFile, name: str) -> str:
    xml = zf.read(name).decode("utf-8", errors="replace")
    parts = TEXT_RE.findall(xml)
    # unescape the few entities we care about for pattern matching
    text = " ".join(parts)
    return (
        text.replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">")
    )


def main() -> None:
    if len(sys.argv) != 2:
        sys.exit("Usage: python qa.py <output.pptx>")

    pptx_path = Path(sys.argv[1])
    if not pptx_path.exists():
        sys.exit(f"Error: {pptx_path} not found.")

    issues = []
    manual_steps = []
    n_slides = 0
    with zipfile.ZipFile(pptx_path) as zf:
        slide_names = sorted(
            (n for n in zf.namelist() if SLIDE_RE.search(n)),
            key=lambda n: int(SLIDE_RE.search(n).group(1)),
        )
        for name in slide_names:
            n_slides += 1
            num = SLIDE_RE.search(name).group(1)
            raw = zf.read(name).decode("utf-8", errors="replace")
            ids = CNVPR_ID_RE.findall(raw)
            dup_ids = sorted({i for i in ids if ids.count(i) > 1}, key=int)
            if dup_ids:
                issues.append(f"slide{num}: duplicate shape ids {dup_ids} (mount/blueprint bug)")
            text = slide_texts(zf, name)
            low = text.lower()

            if "___SLOT_" in text:
                markers = sorted(set(re.findall(r"___SLOT_[A-Z0-9_]+___", text)))
                issues.append(f"slide{num}: unfilled markers {markers}")
            for b in sorted(set(BRACKET_RE.findall(text))):
                if MANUAL_INSERT_RE.search(b):
                    manual_steps.append(f"slide{num}: insert manually {b}")
                else:
                    issues.append(f"slide{num}: residual placeholder {b}")
            for pat in LEFTOVER_PATTERNS:
                if pat in low:
                    issues.append(f"slide{num}: leftover text '{pat}'")

    if manual_steps:
        print(f"MANUAL STEPS REQUIRED — {len(manual_steps)} intentional insert(s) to complete by hand:")
        for m in manual_steps:
            print(f"  - {m}")

    if issues:
        print(f"FAIL — {len(issues)} issue(s) across {n_slides} slides:")
        for i in issues:
            print(f"  - {i}")
        sys.exit(1)
    print(f"OK — {n_slides} slides, no markers/placeholders/leftovers found.")


if __name__ == "__main__":
    main()
