#!/usr/bin/env python3
"""Compose working-unpacked from slide-plan.json + content-blocks.json (no LLM).

For each planned slide:
  - copy-as-is   -> untouched
  - placeholder  -> replace [brackets] from content["placeholders"][n]
  - generated    -> fill the blueprint with content["generated"][n], write the
                    slide XML + its rels, copy blueprint media into the deck

Reuses: compose_pptx.remove_slides, replace_placeholders.replace_placeholders_in_xml,
fill_blueprint.fill_blueprint, clean.clean.

content-blocks.json shape:
    {
      "placeholders": { "1": {"[Presentation Title]": "...", "[Client]": "..."}, "5": {...} },
      "generated":    { "8": {"SECTION": "...", "TITLE": "...", "CARD1_HEADER": "..."}, "24": {...} }
    }

Usage:
    python compose.py <slide-plan.json> <content-blocks.json> <template_dir> <output_dir> [--pack]
"""

import json
import re
import shutil
import sys
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPTS))
from compose_pptx import remove_slides
from replace_placeholders import replace_placeholders_in_xml
from fill_blueprint import fill_blueprint
from clean import clean
from add_slide import _next_slide_name, _next_slide_id, _register
from compose_shell import _copy_blueprint_assets, write_shell_slide

RESOURCES = SCRIPTS.parent / "resources"
BLUEPRINTS = RESOURCES / "blueprints"


def _slide_rid(working: Path, slide_name: str) -> str | None:
    """Find the relationship id pointing at slide_name in presentation.xml.rels."""
    rels_path = working / "ppt" / "_rels" / "presentation.xml.rels"
    for m in re.finditer(r'Id="(rId\d+)"[^>]*Target="slides/([^"]+)"',
                         rels_path.read_text(encoding="utf-8")):
        if m.group(2) == slide_name:
            return m.group(1)
    return None


def _insert_sldid_after(working: Path, anchor_rid: str, new_id: int, new_rid: str) -> None:
    """Insert <p:sldId> for new_rid right after the sldId referencing anchor_rid."""
    pres_path = working / "ppt" / "presentation.xml"
    text = pres_path.read_text(encoding="utf-8")
    new_elem = f'<p:sldId id="{new_id}" r:id="{new_rid}"/>'
    anchor = re.search(rf'<p:sldId[^>]*r:id="{anchor_rid}"[^>]*/>', text)
    if anchor:
        text = text[:anchor.end()] + new_elem + text[anchor.end():]
    else:  # fall back: append before </p:sldIdLst>
        text = text.replace("</p:sldIdLst>", f"{new_elem}</p:sldIdLst>")
    pres_path.write_text(text, encoding="utf-8")


def _fill_one(working: Path, slide_name: str, bp_dir: Path, block: dict) -> None:
    """Fill a single blueprint into slide_name (XML + rels + media)."""
    xml = fill_blueprint(bp_dir, block or {})
    (working / "ppt" / "slides" / slide_name).write_text(xml, encoding="utf-8")
    _copy_blueprint_assets(bp_dir, working, slide_name)


def _write_generated(working: Path, num: int, blueprint: str, content) -> bool:
    """Fill a generated slide. `content` may be a dict (single slide) or a list
    of dicts (the section overflowed its layout and is split across sibling
    slides inserted right after slide{num}). A block may carry "__blueprint__"
    to override the planned layout for that slide."""
    blocks = content if isinstance(content, list) else [content or {}]
    blocks = [b for b in blocks if b] or [{}]

    # a shell block composes components into regions, replacing this template
    # slide's content (the slide{num}.xml already exists — kept by remove_slides).
    # Shells don't split, so only the primary block is used.
    if isinstance(blocks[0], dict) and blocks[0].get("__shell__"):
        return write_shell_slide(working, f"slide{num}.xml",
                                 blocks[0]["__shell__"], blocks[0])

    def _bp_for(block: dict) -> Path | None:
        name = (block.get("__blueprint__") if isinstance(block, dict) else None) or blueprint
        bp_dir = BLUEPRINTS / name
        if not bp_dir.exists():
            print(f"  WARN slide{num}: blueprint '{name}' not built yet — left as-is")
            return None
        return bp_dir

    # primary block fills slide{num}
    primary_bp = _bp_for(blocks[0])
    if primary_bp is None:
        return False
    _fill_one(working, f"slide{num}.xml", primary_bp, blocks[0])
    print(f"  slide{num}: filled blueprint '{primary_bp.name}'")

    # extra blocks become sibling slides inserted right after the previous one
    slides_dir = working / "ppt" / "slides"
    anchor_name = f"slide{num}.xml"
    for block in blocks[1:]:
        bp_dir = _bp_for(block)
        if bp_dir is None:
            continue
        new_name = _next_slide_name(slides_dir)
        _fill_one(working, new_name, bp_dir, block)
        new_rid = _register(working, new_name)
        new_id = _next_slide_id(working)
        anchor_rid = _slide_rid(working, anchor_name)
        if anchor_rid:
            _insert_sldid_after(working, anchor_rid, new_id, new_rid)
        print(f"  {new_name}: split continuation of slide{num} ('{bp_dir.name}')")
        anchor_name = new_name
    return True


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    do_pack = "--pack" in sys.argv
    if len(args) != 4:
        sys.exit(f"Usage: {sys.argv[0]} <slide-plan.json> <content-blocks.json> <template_dir> <output_dir> [--pack]")

    plan = json.loads(Path(args[0]).read_text(encoding="utf-8"))
    content = json.loads(Path(args[1]).read_text(encoding="utf-8"))
    template_dir = Path(args[2])
    output_dir = Path(args[3])

    placeholders = content.get("placeholders", {})
    generated = content.get("generated", {})

    # locate template unpacked
    name = template_dir.name
    unpacked_src = template_dir / f"{name}-unpacked"
    if not unpacked_src.exists():
        # fall back: any *-unpacked dir
        cand = list(template_dir.glob("*-unpacked"))
        if not cand:
            sys.exit(f"Error: no *-unpacked dir in {template_dir}")
        unpacked_src = cand[0]

    working = output_dir / "working-unpacked"
    if working.exists():
        shutil.rmtree(working)
    shutil.copytree(unpacked_src, working)

    # 1) keep only planned slides
    remove_slides(working, plan["included_slides"])

    # 2) apply per-slide content
    for entry in plan["slides"]:
        num = entry["n"]
        slide_file = working / "ppt" / "slides" / f"slide{num}.xml"
        if entry["type"] == "placeholder":
            repl = placeholders.get(str(num))
            if repl and slide_file.exists():
                replace_placeholders_in_xml(str(slide_file), repl)
                print(f"  slide{num}: placeholders replaced")
        elif entry["type"] == "generated":
            _write_generated(working, num, entry.get("blueprint", ""), generated.get(str(num), {}))

    # 3) clean orphans
    clean(working)

    print(f"\nComposed working-unpacked: {len(plan['slides'])} slides "
          f"({plan['generated_count']} generated)")

    if do_pack:
        from pack import pack
        out_pptx = output_dir / "presentation.pptx"
        pack(working, out_pptx)
        print(f"Packed {out_pptx}")


if __name__ == "__main__":
    main()
