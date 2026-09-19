#!/usr/bin/env python3
"""List slide rId mappings from an unpacked PPTX directory.

Useful for diagnosing the relationship between slide files and their rIds
in presentation.xml — handy when reordering, duplicating, or troubleshooting.

Usage:
    python scripts/list_rids.py <unpacked_dir>

Example:
    python scripts/list_rids.py working-unpacked/
"""

import re
import sys
from pathlib import Path


def main() -> None:
    if len(sys.argv) != 2:
        sys.exit("Usage: python list_rids.py <unpacked_dir>")

    root = Path(sys.argv[1])
    rels_path = root / "ppt" / "_rels" / "presentation.xml.rels"

    if not rels_path.exists():
        sys.exit(f"Error: {rels_path} not found. Is this a valid unpacked PPTX?")

    rels = rels_path.read_text(encoding="utf-8")
    pattern = re.compile(r'Id="(rId\d+)"[^>]*Target="slides/(slide\d+\.xml)"')

    results = []
    for m in pattern.finditer(rels):
        rid = m.group(1)
        name = m.group(2)
        num = int(re.search(r"\d+", name).group())
        results.append((num, name, rid))

    results.sort()

    if not results:
        print("No slide relationships found.")
        return

    print(f"{'Slide file':<20} {'rId':<10}")
    print("-" * 30)
    for _, name, rid in results:
        print(f"{name:<20} {rid:<10}")


if __name__ == "__main__":
    main()
