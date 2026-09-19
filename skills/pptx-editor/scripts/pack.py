#!/usr/bin/env python3
"""Repack an unpacked PPTX directory into a .pptx file.

Condenses XML whitespace (removes blank text nodes outside text elements)
before zipping, producing a compact and valid Office file.
The _index.json inventory file is excluded from the output.

Usage:
    python pack.py <unpacked_dir> <output.pptx> [--original <template.pptx>]

If --original is provided, files present in the original .pptx but missing
from the unpacked directory are carried over — this prevents broken output
when the unpack/repack cycle drops files (fonts, custom properties, etc.).

Examples:
    python pack.py working-unpacked/ output.pptx
    python pack.py working-unpacked/ output.pptx --original template.pptx
"""

import shutil
import sys
import tempfile
import zipfile
from pathlib import Path
from xml.dom import minidom

# Element tag names (local name only) whose text content must not be touched.
_PRESERVE_TAGS = frozenset({"t"})  # <a:t>, <w:t> etc.


# -- public API ----------------------------------------------------------------

def pack(src_dir: Path, out_file: Path, original: Path | None = None) -> None:
    """Repack *src_dir* into *out_file*.

    If *original* is provided, files from the original .pptx that are not
    in *src_dir* are merged in (preserves fonts, custom props, etc.).

    Raises ValueError for bad arguments.
    """
    src_dir  = Path(src_dir)
    out_file = Path(out_file)

    if not src_dir.is_dir():
        raise ValueError(f"Not a directory: {src_dir}")
    if out_file.suffix.lower() != ".pptx":
        raise ValueError(f"Output must end in .pptx, got: {out_file}")
    if original is not None:
        original = Path(original)
        if not original.is_file():
            raise ValueError(f"Original not found: {original}")

    out_file.parent.mkdir(parents=True, exist_ok=True)

    with tempfile.TemporaryDirectory() as tmp:
        staging = Path(tmp) / "staged"
        shutil.copytree(src_dir, staging)

        for pattern in ("*.xml", "*.rels"):
            for f in staging.rglob(pattern):
                _condense(f)

        _ensure_content_types(staging)

        # Collect files from staging
        staged_files: set[str] = set()
        with zipfile.ZipFile(out_file, "w", zipfile.ZIP_DEFLATED) as zf:
            for f in sorted(staging.rglob("*")):
                if f.is_file() and f.name != "_index.json":
                    arc = str(f.relative_to(staging))
                    staged_files.add(arc)
                    zf.write(f, arc)

            # Merge missing files from original
            if original is not None:
                with zipfile.ZipFile(original, "r") as orig_zf:
                    for info in orig_zf.infolist():
                        if info.filename not in staged_files and not info.is_dir():
                            zf.writestr(info, orig_zf.read(info.filename))


# -- content types -------------------------------------------------------------

# Extension -> MIME for media a blueprint may introduce that the base template
# never had (e.g. SVG icons). PowerPoint forces "repair" if a part's extension
# has no Default in [Content_Types].xml and no per-part Override.
_MIME_BY_EXT = {
    "png": "image/png",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "gif": "image/gif",
    "bmp": "image/bmp",
    "tif": "image/tiff",
    "tiff": "image/tiff",
    "svg": "image/svg+xml",
    "emf": "image/x-emf",
    "wmf": "image/x-wmf",
    "mp4": "video/mp4",
    "m4a": "audio/mp4",
    "wav": "audio/wav",
}


def _ensure_content_types(staging: Path) -> None:
    """Add a Default <Content_Types> entry for every media extension present.

    Leaves the file untouched if every extension is already declared.
    """
    ct_path = staging / "[Content_Types].xml"
    if not ct_path.is_file():
        return
    text = ct_path.read_text(encoding="utf-8")
    import re

    declared = {e.lower() for e in re.findall(r'Default Extension="([^"]+)"', text)}
    present = {
        f.suffix.lstrip(".").lower()
        for f in staging.rglob("*")
        if f.is_file() and f.suffix
    }
    missing = [e for e in sorted(present) if e not in declared and e in _MIME_BY_EXT]
    if not missing:
        return
    inserts = "".join(
        f'<Default Extension="{e}" ContentType="{_MIME_BY_EXT[e]}"/>' for e in missing
    )
    text = text.replace("</Types>", inserts + "</Types>", 1)
    ct_path.write_text(text, encoding="utf-8")


# -- XML condensing ------------------------------------------------------------

def _condense(path: Path) -> None:
    """Remove decorative whitespace from *path* in place.

    Text nodes that are children of elements whose local name is in
    _PRESERVE_TAGS are left untouched.
    """
    try:
        dom = minidom.parse(str(path))
    except Exception:
        return  # unparseable -- leave file as-is

    _strip_blank_nodes(dom)
    path.write_bytes(dom.toxml(encoding="UTF-8"))


def _strip_blank_nodes(node) -> None:
    """Recursively remove blank text nodes and XML comments."""
    tag = getattr(node, "tagName", "")
    local = tag.split(":")[-1] if ":" in tag else tag

    if local in _PRESERVE_TAGS:
        return  # don't touch children of text-bearing elements

    to_remove = [
        child for child in node.childNodes
        if (child.nodeType == child.TEXT_NODE and
            (not child.nodeValue or child.nodeValue.strip() == ""))
        or child.nodeType == child.COMMENT_NODE
    ]
    for n in to_remove:
        node.removeChild(n)

    for child in node.childNodes:
        if child.nodeType == child.ELEMENT_NODE:
            _strip_blank_nodes(child)


# -- CLI -----------------------------------------------------------------------

def main() -> None:
    import argparse

    ap = argparse.ArgumentParser(description="Repack an unpacked PPTX directory into a .pptx file.")
    ap.add_argument("src_dir", type=Path, help="Unpacked PPTX directory")
    ap.add_argument("out_file", type=Path, help="Output .pptx file path")
    ap.add_argument("--original", type=Path, default=None,
                    help="Original template .pptx — files missing from unpacked dir are carried over")
    args = ap.parse_args()

    try:
        pack(args.src_dir, args.out_file, args.original)
        print(f"Packed {args.src_dir}/  ->  {args.out_file}")
        if args.original:
            print(f"  (merged missing files from {args.original})")
    except ValueError as exc:
        sys.exit(f"Error: {exc}")


if __name__ == "__main__":
    main()
