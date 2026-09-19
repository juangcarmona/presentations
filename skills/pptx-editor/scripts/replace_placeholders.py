#!/usr/bin/env python3
"""Replace [Placeholder] brackets in unpacked PPTX slide XMLs.

Handles:
  - Single-run placeholders: <a:t>[Presentation Title] (25)</a:t>
  - Fragmented placeholders: <a:t>[</a:t>...<a:t>contexto</a:t>...<a:t>]</a:t>
  - Length hints: strips (N) suffix like (25)

Strategy: regex on raw XML for single-run (fast, namespace-safe),
ET with namespace preservation for fragmented (greedy merge first).
"""

import json
import re
import sys
from pathlib import Path


def _strip_len_hint(text):
    """Remove (N) length hints like '[Title] (25)' → '[Title]'."""
    return re.sub(r'\s*\(\d+\)', '', text)


def replace_placeholders_in_xml(xml_path, replacements):
    """Replace placeholders in a single slide XML file.

    Args:
        xml_path: Path to slide XML
        replacements: dict of {"[Placeholder]": "replacement value"}

    Returns:
        True if any replacement was made
    """
    with open(xml_path, encoding="utf-8") as f:
        text = f.read()

    any_replaced = False

    # Pass 1: regex on raw XML for single-run placeholders (preserves namespaces perfectly)
    for placeholder, value in replacements.items():
        # Match <a:t>...[Placeholder]...</a:t> with optional (N) after placeholder
        pat = re.compile(
            r'(<a:t>[^<]*?)' + re.escape(placeholder) + r'(\s*\(\d+\))?([^<]*?</a:t>)',
            re.DOTALL
        )
        m = pat.search(text)
        if m:
            text = pat.sub(r'\g<1>' + value + r'\g<3>', text)
            any_replaced = True

    if any_replaced:
        with open(xml_path, "w", encoding="utf-8") as f:
            f.write(text)
        return True

    # Pass 2: ET-based merge for fragmented runs, then replace
    import xml.etree.ElementTree as ET

    tree = ET.parse(xml_path)
    root = tree.getroot()
    ns_a = "{http://schemas.openxmlformats.org/drawingml/2006/main}"

    # Greedy merge: if a run opens [ without ], keep merging until ] found
    for p in root.findall(f".//{ns_a}p"):
        runs = p.findall(f"{ns_a}r")
        i = 0
        while i < len(runs):
            t = runs[i].find(f"{ns_a}t")
            if t is None or t.text is None:
                i += 1
                continue
            if "[" in t.text and "]" not in t.text:
                j = i + 1
                while j < len(runs):
                    t_next = runs[j].find(f"{ns_a}t")
                    if t_next is None or t_next.text is None:
                        j += 1
                        continue
                    t.text += t_next.text
                    if t_next.get("{http://www.w3.org/XML/1998/namespace}space"):
                        t.set("{http://www.w3.org/XML/1998/namespace}space", "preserve")
                    p.remove(runs[j])
                    runs.pop(j)
                    if "]" in t_next.text:
                        break
            i += 1

    # Now replace in merged runs
    for t in root.findall(f".//{ns_a}r/{ns_a}t"):
        if t.text is None:
            continue
        cleaned = _strip_len_hint(t.text)
        for placeholder, value in replacements.items():
            if placeholder in cleaned:
                t.text = t.text.replace(placeholder, value)
                t.text = _strip_len_hint(t.text)
                if t.text != t.text.strip():
                    t.set("{http://www.w3.org/XML/1998/namespace}space", "preserve")
                any_replaced = True

    if any_replaced:
        # Register ALL namespaces from original XML to avoid ns0: prefixes
        with open(xml_path, encoding="utf-8") as f:
            raw = f.read()
        for prefix, uri in re.findall(r'xmlns:(\w+)="([^"]+)"', raw):
            ET.register_namespace(prefix, uri)
        ET.register_namespace("a", "http://schemas.openxmlformats.org/drawingml/2006/main")
        ET.register_namespace("r", "http://schemas.openxmlformats.org/officeDocument/2006/relationships")
        ET.register_namespace("p", "http://schemas.openxmlformats.org/presentationml/2006/main")
        tree.write(xml_path, xml_declaration=True, encoding="UTF-8")

    return any_replaced


def main():
    if len(sys.argv) != 3:
        print(f"Usage: {sys.argv[0]} <unpacked_dir> <mappings.json>")
        sys.exit(1)

    unpacked_dir = Path(sys.argv[1])
    mappings_file = Path(sys.argv[2])

    if not unpacked_dir.is_dir():
        print(f"Error: {unpacked_dir} is not a directory")
        sys.exit(1)

    if not mappings_file.is_file():
        print(f"Error: {mappings_file} not found")
        sys.exit(1)

    with open(mappings_file, encoding="utf-8") as f:
        mappings = json.load(f)

    slides_dir = unpacked_dir / "ppt" / "slides"
    if not slides_dir.is_dir():
        print(f"Error: {slides_dir} not found")
        sys.exit(1)

    total = 0
    for slide_num, replacements in mappings.items():
        slide_file = slides_dir / f"slide{slide_num}.xml"
        if not slide_file.is_file():
            print(f"  Warning: {slide_file} not found, skipping")
            continue
        if replace_placeholders_in_xml(str(slide_file), replacements):
            total += 1
            print(f"  slide{slide_num}.xml: replaced")

    print(f"Done. Modified {total} slides.")


if __name__ == "__main__":
    main()
