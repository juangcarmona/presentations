#!/usr/bin/env python3
"""Remove unreferenced files from an unpacked PPTX directory.

Scans every .rels file to collect the set of referenced paths, then
deletes files in resource directories (media, charts, diagrams,
notesSlides, embeddings) that nothing points to.  Also removes slides
that are absent from <p:sldIdLst> and updates [Content_Types].xml.

Usage:
    python clean.py <unpacked_dir>

Examples:
    python clean.py working-unpacked/
"""

import re
import sys
from pathlib import Path


# -- public API ----------------------------------------------------------------

def clean(root: Path) -> list[str]:
    """Clean *root* in place.  Returns a sorted list of deleted paths."""
    root = Path(root)
    if not root.is_dir():
        raise ValueError(f"Not a directory: {root}")

    deleted: list[str] = []
    deleted += _purge_orphaned_slides(root)
    deleted += _purge_unreferenced_resources(root)

    if deleted:
        _patch_content_types(root, deleted)

    return sorted(deleted)


# -- orphaned slides -----------------------------------------------------------

def _active_slide_names(root: Path) -> set[str]:
    """Return slide filenames that appear in <p:sldIdLst>."""
    pres_path = root / "ppt" / "presentation.xml"
    rels_path = root / "ppt" / "_rels" / "presentation.xml.rels"

    if not pres_path.exists() or not rels_path.exists():
        return set()

    rels_text = rels_path.read_text(encoding="utf-8")
    # Build rId -> filename map for slide relationships
    rid_to_name = {
        m.group(1): m.group(2).split("/")[-1]
        for m in re.finditer(
            r'Id="(rId\d+)"[^>]*Target="slides/([^"]+)"', rels_text
        )
    }

    pres_text = pres_path.read_text(encoding="utf-8")
    active_rids = set(re.findall(r'<p:sldId[^>]+r:id="([^"]+)"', pres_text))

    return {rid_to_name[r] for r in active_rids if r in rid_to_name}


def _purge_orphaned_slides(root: Path) -> list[str]:
    slides_dir = root / "ppt" / "slides"
    rels_dir   = slides_dir / "_rels"
    if not slides_dir.exists():
        return []

    keep    = _active_slide_names(root)
    deleted = []
    removed_slide_names: set[str] = set()

    for slide in sorted(slides_dir.glob("slide*.xml")):
        if slide.name not in keep:
            slide.unlink()
            deleted.append(str(slide.relative_to(root)))
            removed_slide_names.add(slide.name)
            rels = rels_dir / f"{slide.name}.rels"
            if rels.exists():
                rels.unlink()
                deleted.append(str(rels.relative_to(root)))

    if removed_slide_names:
        deleted += _purge_presentation_rels(root, removed_slide_names)
        deleted += _purge_notes_rels(root, removed_slide_names)

    return deleted


def _purge_presentation_rels(root: Path, removed_slide_names: set[str]) -> list[str]:
    """Remove rId entries from presentation.xml.rels for deleted slides."""
    rels_path = root / "ppt" / "_rels" / "presentation.xml.rels"
    if not rels_path.exists():
        return []

    text = rels_path.read_text(encoding="utf-8")
    new_text = re.sub(
        r'\s*<Relationship[^>]+Target="slides/(' + "|".join(re.escape(n) for n in removed_slide_names) + r')"[^/]*/>\n?',
        "",
        text,
    )
    if new_text != text:
        rels_path.write_text(new_text, encoding="utf-8")
    return []


def _purge_notes_rels(root: Path, removed_slide_names: set[str]) -> list[str]:
    """Delete notesSlide .rels and XML files that reference deleted slides."""
    notes_rels_dir = root / "ppt" / "notesSlides" / "_rels"
    notes_dir      = root / "ppt" / "notesSlides"
    if not notes_rels_dir.exists():
        return []

    deleted = []
    for rels_file in sorted(notes_rels_dir.glob("*.rels")):
        content = rels_file.read_text(encoding="utf-8", errors="replace")
        if any(slide in content for slide in removed_slide_names):
            rels_file.unlink()
            deleted.append(str(rels_file.relative_to(root)))
            notes_xml = notes_dir / rels_file.stem  # e.g. notesSlide14.xml
            if notes_xml.exists():
                notes_xml.unlink()
                deleted.append(str(notes_xml.relative_to(root)))

    return deleted


# -- unreferenced resources ----------------------------------------------------

def _collect_referenced_paths(root: Path) -> set[Path]:
    """Walk all .rels files and resolve every Target to an absolute path."""
    referenced: set[Path] = set()

    for rels_file in root.rglob("*.rels"):
        text = rels_file.read_text(encoding="utf-8", errors="replace")
        for target in re.findall(r'Target="([^"#]+)"', text):
            if target.startswith(("http://", "https://")):
                continue
            try:
                resolved = (rels_file.parent.parent / target).resolve()
                referenced.add(resolved)
            except Exception:
                pass

    return referenced


_RESOURCE_DIRS = [
    "ppt/media",
    "ppt/charts",
    "ppt/diagrams",
    "ppt/notesSlides",
    "ppt/embeddings",
    "ppt/ink",
]


def _purge_unreferenced_resources(root: Path) -> list[str]:
    referenced = _collect_referenced_paths(root)
    deleted: list[str] = []

    for rel_dir in _RESOURCE_DIRS:
        dir_path = root / rel_dir
        if not dir_path.exists():
            continue
        for f in sorted(dir_path.glob("*")):
            if f.is_file() and f.resolve() not in referenced:
                f.unlink()
                deleted.append(str(f.relative_to(root)))

    return deleted


# -- Content_Types.xml ---------------------------------------------------------

def _patch_content_types(root: Path, deleted: list[str]) -> None:
    """Remove <Override> entries for every deleted file."""
    ct_path = root / "[Content_Types].xml"
    if not ct_path.exists():
        return

    text = ct_path.read_text(encoding="utf-8")
    for rel_path in deleted:
        part = "/" + rel_path.replace("\\", "/")
        text = re.sub(
            rf'\s*<Override[^>]+PartName="{re.escape(part)}"[^/]*/>', "", text
        )
    ct_path.write_text(text, encoding="utf-8")


# -- CLI -----------------------------------------------------------------------

def main() -> None:
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(1)

    root = Path(sys.argv[1])
    try:
        deleted = clean(root)
    except ValueError as exc:
        sys.exit(f"Error: {exc}")

    if deleted:
        print(f"Removed {len(deleted)} unreferenced file(s):")
        for f in deleted:
            print(f"  {f}")
    else:
        print("Nothing to clean.")


if __name__ == "__main__":
    main()
