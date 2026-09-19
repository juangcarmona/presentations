#!/usr/bin/env python3
"""Unpack a PPTX file into an editable directory tree.

Extracts the ZIP archive, pretty-prints all XML and .rels files,
escapes Unicode punctuation characters as XML entities, and writes
a _index.json inventory summary.

Usage:
    python unpack.py <input.pptx> <output_dir>

Examples:
    python unpack.py resources/template.pptx resources/template-unpacked/

The output directory must not already exist (or must be empty).
"""

import json
import sys
import zipfile
from pathlib import Path
from xml.dom import minidom

# Unicode punctuation that must survive XML round-trips as named entities.
# Claude's Edit tool converts these to ASCII, so we pre-escape them.
_ENTITY_MAP: dict[str, str] = {
    "\u201c": "&#x201C;",  # "  left double quotation mark
    "\u201d": "&#x201D;",  # "  right double quotation mark
    "\u2018": "&#x2018;",  # '  left single quotation mark
    "\u2019": "&#x2019;",  # '  right single quotation mark
    "\u2013": "&#x2013;",  # -  en dash
    "\u2014": "&#x2014;",  # --  em dash
    "\u2026": "&#x2026;",  # ...  ellipsis
}


# -- public API ----------------------------------------------------------------

def unpack(src: Path, dst: Path) -> dict:
    """Extract *src* to *dst*, pretty-print XML, escape punctuation.

    Returns the inventory dict that is also written to dst/_index.json.
    Raises ValueError for invalid inputs, RuntimeError for extraction errors.
    """
    src = Path(src)
    dst = Path(dst)

    if not src.is_file() or src.suffix.lower() != ".pptx":
        raise ValueError(f"Expected a .pptx file, got: {src}")

    if dst.exists() and _dir_has_content(dst):
        raise ValueError(
            f"Output directory already exists and is non-empty: {dst}\n"
            "Delete it first or pick a different output path."
        )

    dst.mkdir(parents=True, exist_ok=True)

    try:
        with zipfile.ZipFile(src, "r") as zf:
            zf.extractall(dst)
    except zipfile.BadZipFile as exc:
        raise RuntimeError(f"Not a valid Office file: {src}") from exc

    xml_paths = sorted(dst.rglob("*.xml")) + sorted(dst.rglob("*.rels"))
    for p in xml_paths:
        _pretty_print_xml(p)
        _escape_punctuation(p)

    index = _build_index(src, dst)
    (dst / "_index.json").write_text(
        json.dumps(index, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )

    return index


# -- XML helpers ---------------------------------------------------------------

def _pretty_print_xml(path: Path) -> None:
    """Rewrite *path* with indented XML.  Silently skips unparseable files."""
    try:
        raw = path.read_bytes()
        dom = minidom.parseString(raw)
        path.write_bytes(dom.toprettyxml(indent="  ", encoding="utf-8"))
    except Exception:
        pass  # leave malformed XML unchanged


def _escape_punctuation(path: Path) -> None:
    """Replace Unicode punctuation with XML character entities."""
    try:
        text = path.read_text(encoding="utf-8")
        for char, entity in _ENTITY_MAP.items():
            text = text.replace(char, entity)
        path.write_text(text, encoding="utf-8")
    except Exception:
        pass


# -- inventory -----------------------------------------------------------------

def _build_index(src: Path, dst: Path) -> dict:
    """Build a summary of the unpacked presentation structure."""
    def _names(directory: Path, pattern: str) -> list[str]:
        return sorted(f.name for f in directory.glob(pattern)) if directory.exists() else []

    slides_dir  = dst / "ppt" / "slides"
    layouts_dir = dst / "ppt" / "slideLayouts"
    media_dir   = dst / "ppt" / "media"
    notes_dir   = dst / "ppt" / "notesSlides"

    slides  = _names(slides_dir,  "slide*.xml")
    layouts = _names(layouts_dir, "slideLayout*.xml")
    media   = _names(media_dir,   "*")
    notes   = _names(notes_dir,   "notesSlide*.xml")

    return {
        "source":       src.name,
        "unpacked_to":  str(dst),
        "slide_count":  len(slides),
        "slides":       slides,
        "layout_count": len(layouts),
        "layouts":      layouts,
        "media_count":  len(media),
        "media":        media,
        "notes_count":  len(notes),
    }


def _dir_has_content(path: Path) -> bool:
    return any(path.iterdir())


# -- CLI -----------------------------------------------------------------------

def main() -> None:
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(1)

    src = Path(sys.argv[1])
    dst = Path(sys.argv[2])

    try:
        index = unpack(src, dst)
    except (ValueError, RuntimeError) as exc:
        sys.exit(f"Error: {exc}")

    print(
        f"Unpacked {src.name}  ->  {dst}/\n"
        f"  {index['slide_count']} slides, "
        f"{index['layout_count']} layouts, "
        f"{index['media_count']} media files\n"
        f"  Inventory written to {dst}/_index.json"
    )


if __name__ == "__main__":
    main()
