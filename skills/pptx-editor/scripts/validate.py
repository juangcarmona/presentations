#!/usr/bin/env python3
"""Validate an unpacked PPTX directory before packing.

Checks:
1. presentation.xml exists and has valid <p:sldIdLst>
2. Every slide referenced in sldIdLst has a corresponding .xml file
3. Every slide .xml file in ppt/slides/ is referenced in sldIdLst (orphan check)
4. Content_Types.xml references all slide parts
5. No leftover [Placeholder] brackets in text content

Usage:
    python validate.py <unpacked_dir>
"""

import re
import sys
from pathlib import Path


def check_presentation_xml(unpacked_dir: Path) -> list[str]:
    """Check presentation.xml structure."""
    issues = []
    pres_xml = unpacked_dir / "ppt" / "presentation.xml"
    if not pres_xml.is_file():
        issues.append("CRITICAL: ppt/presentation.xml not found")
        return issues

    content = pres_xml.read_text(encoding="utf-8")
    if "<p:sldIdLst" not in content:
        issues.append("CRITICAL: <p:sldIdLst> not found in presentation.xml")
    else:
        sld_ids = re.findall(r'<p:sldId[^>]*r:id="([^"]+)"', content)
        if not sld_ids:
            issues.append("WARNING: <p:sldIdLst> is empty — no slides")

    return issues


def check_slide_references(unpacked_dir: Path) -> list[str]:
    """Check that all referenced slides exist and no orphans."""
    issues = []
    slides_dir = unpacked_dir / "ppt" / "slides"
    pres_xml = unpacked_dir / "ppt" / "presentation.xml"

    if not pres_xml.is_file() or not slides_dir.is_dir():
        return issues

    # Get referenced rIds from presentation.xml
    pres_content = pres_xml.read_text(encoding="utf-8")
    sld_rids = re.findall(r'<p:sldId[^>]*r:id="([^"]+)"', pres_content)

    # Get rId → slide file mapping from presentation.xml.rels
    rels_file = unpacked_dir / "ppt" / "_rels" / "presentation.xml.rels"
    rid_to_file = {}
    if rels_file.is_file():
        rels_content = rels_file.read_text(encoding="utf-8")
        for match in re.finditer(r'Id="([^"]+)"[^>]*Target="([^"]+)"', rels_content):
            rid_to_file[match.group(1)] = match.group(2)

    # Check referenced slides exist
    referenced_files = set()
    for rid in sld_rids:
        target = rid_to_file.get(rid, "")
        if not target:
            issues.append(f"WARNING: rId '{rid}' referenced but not found in .rels")
            continue
        slide_path = unpacked_dir / "ppt" / target
        if not slide_path.is_file():
            issues.append(f"CRITICAL: Referenced slide '{target}' not found (rId={rid})")
        else:
            referenced_files.add(slide_path.name)

    # Check for orphan slide files
    if slides_dir.is_dir():
        for slide_file in slides_dir.glob("slide*.xml"):
            if slide_file.name not in referenced_files:
                issues.append(f"WARNING: Orphan slide file '{slide_file.name}' not referenced in presentation.xml")

    return issues


def check_content_types(unpacked_dir: Path) -> list[str]:
    """Check Content_Types.xml references."""
    issues = []
    ct_file = unpacked_dir / "[Content_Types].xml"
    if not ct_file.is_file():
        issues.append("CRITICAL: [Content_Types].xml not found")
        return issues

    slides_dir = unpacked_dir / "ppt" / "slides"
    if not slides_dir.is_dir():
        return issues

    ct_content = ct_file.read_text(encoding="utf-8")

    for slide_file in sorted(slides_dir.glob("slide*.xml")):
        part_name = f"/ppt/slides/{slide_file.name}"
        if part_name not in ct_content:
            issues.append(f"WARNING: '{slide_file.name}' not referenced in [Content_Types].xml")

    return issues


def check_leftover_placeholders(unpacked_dir: Path) -> list[str]:
    """Check for unreplaced [Placeholder] brackets."""
    issues = []
    slides_dir = unpacked_dir / "ppt" / "slides"
    if not slides_dir.is_dir():
        return issues

    for slide_file in sorted(slides_dir.glob("slide*.xml")):
        content = slide_file.read_text(encoding="utf-8")
        # Extract text content from <a:t> elements
        texts = re.findall(r"<a:t[^>]*>([^<]*)</a:t>", content)
        for text in texts:
            if re.search(r"\[[^\]]+\]", text):
                # Ignore known non-placeholder brackets
                if text.strip() not in ("[]",):
                    issues.append(f"WARNING: Leftover placeholder in {slide_file.name}: {text.strip()[:60]}")

    return issues


def main():
    if len(sys.argv) != 2:
        print(f"Usage: {sys.argv[0]} <unpacked_dir>")
        sys.exit(1)

    unpacked_dir = Path(sys.argv[1])
    if not unpacked_dir.is_dir():
        print(f"Error: {unpacked_dir} is not a directory")
        sys.exit(1)

    all_issues = []
    all_issues.extend(check_presentation_xml(unpacked_dir))
    all_issues.extend(check_slide_references(unpacked_dir))
    all_issues.extend(check_content_types(unpacked_dir))
    all_issues.extend(check_leftover_placeholders(unpacked_dir))

    critical = [i for i in all_issues if i.startswith("CRITICAL")]
    warnings = [i for i in all_issues if i.startswith("WARNING")]

    if all_issues:
        print("Validation issues found:\n")
        for issue in critical:
            print(f"  {issue}")
        for issue in warnings:
            print(f"  {issue}")
        print(f"\n{len(critical)} critical, {len(warnings)} warnings")
        if critical:
            sys.exit(1)
    else:
        print("Validation passed. No issues found.")


if __name__ == "__main__":
    main()
