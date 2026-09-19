#!/usr/bin/env python3
"""Add a slide to an unpacked PPTX directory.

Supports two operations:
  - Duplicate an existing slide (copies XML + relationships)
  - Create a blank slide from a layout template

After running, insert the printed <p:sldId> element into
ppt/presentation.xml at the desired position inside <p:sldIdLst>.

Usage:
    python add_slide.py <unpacked_dir> <source>

Where <source> is one of:
    slideN.xml        -- duplicate an existing slide (e.g. slide3.xml)
    slideLayoutN.xml  -- create a blank slide from that layout

To list available layouts:
    ls <unpacked_dir>/ppt/slideLayouts/

Examples:
    python add_slide.py working-unpacked/ slide2.xml
    python add_slide.py working-unpacked/ slideLayout4.xml
"""

import re
import shutil
import sys
from pathlib import Path

# -- OOXML constants -----------------------------------------------------------
_CT_SLIDE = (
    "application/vnd.openxmlformats-officedocument"
    ".presentationml.slide+xml"
)
_RT_SLIDE = (
    "http://schemas.openxmlformats.org/officeDocument"
    "/2006/relationships/slide"
)
_RT_LAYOUT = (
    "http://schemas.openxmlformats.org/officeDocument"
    "/2006/relationships/slideLayout"
)
_BLANK_SLIDE = """\
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
       xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
       xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld>
    <p:spTree>
      <p:nvGrpSpPr>
        <p:cNvPr id="1" name=""/>
        <p:cNvGrpSpPr/>
        <p:nvPr/>
      </p:nvGrpSpPr>
      <p:grpSpPr>
        <a:xfrm>
          <a:off x="0" y="0"/>
          <a:ext cx="0" cy="0"/>
          <a:chOff x="0" y="0"/>
          <a:chExt cx="0" cy="0"/>
        </a:xfrm>
      </p:grpSpPr>
    </p:spTree>
  </p:cSld>
  <p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>
</p:sld>"""


# -- helpers -------------------------------------------------------------------

def _next_slide_name(slides_dir: Path) -> str:
    nums = [
        int(m.group(1))
        for f in slides_dir.glob("slide*.xml")
        if (m := re.match(r"slide(\d+)\.xml", f.name))
    ]
    return f"slide{max(nums) + 1 if nums else 1}.xml"


def _next_rid(rels_path: Path) -> str:
    text = rels_path.read_text(encoding="utf-8")
    nums = [int(n) for n in re.findall(r'Id="rId(\d+)"', text)]
    return f"rId{max(nums) + 1 if nums else 1}"


def _next_slide_id(root: Path) -> int:
    text = (root / "ppt" / "presentation.xml").read_text(encoding="utf-8")
    ids  = [int(n) for n in re.findall(r'<p:sldId[^>]+id="(\d+)"', text)]
    return max(ids) + 1 if ids else 256


def _register(root: Path, slide_name: str) -> str:
    """Add slide to Content_Types.xml and presentation.xml.rels.
    Returns the new relationship ID."""
    # -- Content_Types.xml --
    ct_path = root / "[Content_Types].xml"
    ct_text = ct_path.read_text(encoding="utf-8")
    part    = f"/ppt/slides/{slide_name}"
    if part not in ct_text:
        entry   = f'<Override PartName="{part}" ContentType="{_CT_SLIDE}"/>'
        ct_text = ct_text.replace("</Types>", f"  {entry}\n</Types>")
        ct_path.write_text(ct_text, encoding="utf-8")

    # -- presentation.xml.rels --
    rels_path = root / "ppt" / "_rels" / "presentation.xml.rels"
    rid       = _next_rid(rels_path)
    rels_text = rels_path.read_text(encoding="utf-8")
    rel       = (
        f'<Relationship Id="{rid}" Type="{_RT_SLIDE}" '
        f'Target="slides/{slide_name}"/>'
    )
    rels_text = rels_text.replace("</Relationships>",
                                  f"  {rel}\n</Relationships>")
    rels_path.write_text(rels_text, encoding="utf-8")
    return rid


# -- operations ----------------------------------------------------------------

def duplicate_slide(root: Path, source_name: str) -> None:
    """Copy an existing slide, strip its notes reference, register it."""
    slides_dir = root / "ppt" / "slides"
    rels_dir   = slides_dir / "_rels"

    source = slides_dir / source_name
    if not source.exists():
        sys.exit(f"Error: {source} not found")

    dest_name = _next_slide_name(slides_dir)
    shutil.copy2(source, slides_dir / dest_name)

    src_rels  = rels_dir / f"{source_name}.rels"
    dest_rels = rels_dir / f"{dest_name}.rels"
    if src_rels.exists():
        content = src_rels.read_text(encoding="utf-8")
        # Remove notes-slide relationships -- each slide must have its own
        content = re.sub(
            r'\s*<Relationship[^>]*notesSlide[^>]*/>\s*', "\n", content
        )
        dest_rels.write_text(content, encoding="utf-8")

    rid     = _register(root, dest_name)
    next_id = _next_slide_id(root)

    print(f"Created {dest_name}  (copy of {source_name})")
    print(f'Add to <p:sldIdLst>:  <p:sldId id="{next_id}" r:id="{rid}"/>')


def create_from_layout(root: Path, layout_name: str) -> None:
    """Create a blank slide that resources the given layout."""
    slides_dir  = root / "ppt" / "slides"
    rels_dir    = slides_dir / "_rels"
    layouts_dir = root / "ppt" / "slideLayouts"

    if not (layouts_dir / layout_name).exists():
        sys.exit(f"Error: layout not found: {layouts_dir / layout_name}")

    dest_name = _next_slide_name(slides_dir)
    (slides_dir / dest_name).write_text(_BLANK_SLIDE, encoding="utf-8")

    rels_dir.mkdir(exist_ok=True)
    rels_xml = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">\n'
        f'  <Relationship Id="rId1" Type="{_RT_LAYOUT}" '
        f'Target="../slideLayouts/{layout_name}"/>\n'
        "</Relationships>"
    )
    (rels_dir / f"{dest_name}.rels").write_text(rels_xml, encoding="utf-8")

    rid     = _register(root, dest_name)
    next_id = _next_slide_id(root)

    print(f"Created {dest_name}  (from {layout_name})")
    print(f'Add to <p:sldIdLst>:  <p:sldId id="{next_id}" r:id="{rid}"/>')


# -- CLI -----------------------------------------------------------------------

def main() -> None:
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(1)

    root   = Path(sys.argv[1])
    source = sys.argv[2]

    if not root.is_dir():
        sys.exit(f"Error: {root} is not a directory")

    if source.startswith("slideLayout") and source.endswith(".xml"):
        create_from_layout(root, source)
    elif source.endswith(".xml"):
        duplicate_slide(root, source)
    else:
        sys.exit(
            f"Error: source must be 'slideN.xml' or 'slideLayoutN.xml', got: {source}"
        )


if __name__ == "__main__":
    main()
