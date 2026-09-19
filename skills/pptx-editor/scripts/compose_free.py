#!/usr/bin/env python3
"""Build a freestyle deck from slide-plan.json + content-blocks.json (no LLM).

Unlike compose.py (proposal mode, which prunes the 42-slide master template),
the freestyle mode has NO fixed template structure: every slide is generated
from a blueprint. So we start from the master *-unpacked* (for its
slideLayouts / slideMaster / theme / media — which the blueprints' rels point
at), strip ALL of its slides, and insert one fresh slide per planned blueprint.

No cover, no section dividers, no closing slide — only the content slides the
plan asks for, in order.

Reuses the proven helpers from compose.py / add_slide.py (DRY): the
slide-insertion machinery is exactly the one compose._write_generated uses for
its overflow-split siblings.

slide-plan.json shape (from plan-free), every slide generated:
    { "mode": "free",
      "slides": [ { "n": 1, "type": "generated", "blueprint": "three-col-cards" }, ... ] }

content-blocks.json shape (from content), keyed by slide number:
    { "generated": { "1": {"SECTION": "...", "TITLE": "...", "CARD1_HEADER": "..."}, "2": {...} } }

Usage:
    python compose_free.py <slide-plan.json> <content-blocks.json> <template_dir> <output_dir> [--pack]
"""

import json
import shutil
import sys
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPTS))
from compose_pptx import remove_slides
from compose import _fill_one, BLUEPRINTS
from add_slide import _next_slide_name, _next_slide_id, _register
from clean import clean
from compose_shell import write_shell_slide


def _append_sldid(working: Path, new_id: int, new_rid: str) -> None:
    """Append a <p:sldId> for new_rid at the end of <p:sldIdLst>."""
    pres_path = working / "ppt" / "presentation.xml"
    text = pres_path.read_text(encoding="utf-8")
    new_elem = f'<p:sldId id="{new_id}" r:id="{new_rid}"/>'
    text = text.replace("</p:sldIdLst>", f"{new_elem}</p:sldIdLst>")
    pres_path.write_text(text, encoding="utf-8")


def compose_free(plan: dict, content: dict, template_dir: Path, output_dir: Path) -> Path:
    generated = content.get("generated", {})

    # locate template unpacked (master) — its layouts/master/theme/media back the blueprints
    name = template_dir.name
    unpacked_src = template_dir / f"{name}-unpacked"
    if not unpacked_src.exists():
        cand = list(template_dir.glob("*-unpacked"))
        if not cand:
            sys.exit(f"Error: no *-unpacked dir in {template_dir}")
        unpacked_src = cand[0]

    working = output_dir / "working-unpacked"
    if working.exists():
        shutil.rmtree(working)
    shutil.copytree(unpacked_src, working)

    # 1) strip ALL template slides — keep only the deck skeleton
    remove_slides(working, [])

    # 2) insert one fresh slide per planned blueprint, in order
    slides_dir = working / "ppt" / "slides"
    for entry in plan["slides"]:
        num = entry["n"]
        if entry.get("type") != "generated":
            continue
        blueprint = entry.get("blueprint", "")
        block = generated.get(str(num), {}) or {}
        slide_name = _next_slide_name(slides_dir)

        # a block may target a shell (region composition) or a single blueprint
        if isinstance(block, dict) and block.get("__shell__"):
            if not write_shell_slide(working, slide_name, block["__shell__"], block):
                continue
        else:
            # a block may override its layout via "__blueprint__"
            bp_name = block.get("__blueprint__") if isinstance(block, dict) else None
            bp_name = bp_name or blueprint
            bp_dir = BLUEPRINTS / bp_name
            if not bp_dir.exists():
                print(f"  WARN slide n={num}: blueprint '{bp_name}' not built — skipped")
                continue
            _fill_one(working, slide_name, bp_dir, block)
            print(f"  {slide_name}: filled blueprint '{bp_dir.name}' (plan n={num})")

        new_rid = _register(working, slide_name)
        new_id = _next_slide_id(working)
        _append_sldid(working, new_id, new_rid)

    # 3) clean orphans
    clean(working)

    placed = len(list(slides_dir.glob("slide*.xml")))
    print(f"\nComposed freestyle working-unpacked: {placed} slides")
    return working


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    do_pack = "--pack" in sys.argv
    if len(args) != 4:
        sys.exit(f"Usage: {sys.argv[0]} <slide-plan.json> <content-blocks.json> <template_dir> <output_dir> [--pack]")

    plan = json.loads(Path(args[0]).read_text(encoding="utf-8"))
    content = json.loads(Path(args[1]).read_text(encoding="utf-8"))
    template_dir = Path(args[2])
    output_dir = Path(args[3])

    working = compose_free(plan, content, template_dir, output_dir)

    if do_pack:
        from pack import pack
        out_pptx = output_dir / "presentation.pptx"
        pack(working, out_pptx)
        print(f"Packed {out_pptx}")


if __name__ == "__main__":
    main()
