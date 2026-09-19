#!/usr/bin/env python3
"""Shared shell composition — used by BOTH compose.py (proposal) and
compose_free.py (freestyle), so the shell+component path is DRY.

A shell (resources/shells/{name}) is a brand slide with chrome + SECTION/TITLE
and empty regions; components (resources/components/{name}) are mounted into the
regions by mount.py. `write_shell_slide` fills the shell, mounts each region's
component, writes the slide XML, copies the shell's rels/media, and appends any
component media relationships. It does NOT register the slide (sldId/rels/Content
Types) — that stays with each caller, because proposal mode reuses an existing
template slide while freestyle inserts a fresh one.

This module depends only on mount/fill_blueprint (no import of compose*), so both
composers can import from it without a cycle.
"""

import json
import re
import shutil
import xml.etree.ElementTree as ET
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parent
import sys
sys.path.insert(0, str(SCRIPTS))
from fill_blueprint import fill_blueprint
from mount import mount_component, max_shape_id

RESOURCES = SCRIPTS.parent / "resources"
SHELLS = RESOURCES / "shells"
COMPONENTS = RESOURCES / "components"
P = "{http://schemas.openxmlformats.org/presentationml/2006/main}"


def _copy_blueprint_assets(bp_dir: Path, working: Path, slide_name: str) -> None:
    """Copy a blueprint's (or shell's) rels and media into the deck for slide_name."""
    rels = working / "ppt" / "slides" / "_rels"
    rels.mkdir(parents=True, exist_ok=True)
    bp_rels = bp_dir / "blueprint.xml.rels"
    if bp_rels.exists():
        (rels / f"{slide_name}.rels").write_text(
            bp_rels.read_text(encoding="utf-8"), encoding="utf-8"
        )
    media_dir = bp_dir / "media"
    if media_dir.is_dir():
        dst_media = working / "ppt" / "media"
        dst_media.mkdir(parents=True, exist_ok=True)
        for m in media_dir.iterdir():
            dst = dst_media / m.name
            if not dst.exists():
                shutil.copy2(m, dst)


def write_shell_slide(working: Path, slide_name: str, shell_name: str, block: dict) -> bool:
    """Fill a shell's SECTION/TITLE, mount each region's component, write the slide.

    Writes ppt/slides/{slide_name} + its .rels (+ media). Does NOT register the
    slide — the caller does (freestyle inserts a new sldId; proposal reuses the
    existing template slide). Returns True on success.

    block shape:
        { "SECTION": "...", "TITLE": "...", "__shell__": "halves",
          "left":  {"__component__": "card", "CARD_HEADER": "...", ...},
          "right": {"__component__": "stat-stack", "STAT1_VALUE": "...", ...} }
    """
    shell_dir = SHELLS / shell_name
    if not shell_dir.exists():
        print(f"  WARN {slide_name}: shell '{shell_name}' not built — skipped")
        return False
    meta = json.loads((shell_dir / "slots.json").read_text(encoding="utf-8"))
    scalar_names = {s["name"] for s in meta.get("slots", [])}
    shell_scalars = {k: v for k, v in block.items() if k in scalar_names}
    root = ET.fromstring(fill_blueprint(shell_dir, shell_scalars))

    spt = root.find(f"{P}cSld/{P}spTree")
    id_base = max_shape_id(spt) + 1
    # allocate component rIds clear of the shell's own rels (footer logo, layout)
    shell_rels = shell_dir / "blueprint.xml.rels"
    shell_rids = ([int(n) for n in re.findall(r'Id="rId(\d+)"', shell_rels.read_text(encoding="utf-8"))]
                  if shell_rels.exists() else [])
    rid_base = (max(shell_rids) + 1) if shell_rids else 1
    mounted, rel_entries = [], []
    for region in meta.get("regions", []):
        rblock = block.get(region["name"])
        if not isinstance(rblock, dict):
            continue
        comp = rblock.get("__component__")
        if not comp:
            continue
        accepts = region.get("accepts")
        if accepts and comp not in accepts:
            print(f"  WARN {slide_name}: component '{comp}' not allowed in "
                  f"region '{region['name']}' of shell '{shell_name}'")
            continue
        comp_dir = COMPONENTS / comp
        if not comp_dir.exists():
            print(f"  WARN {slide_name}: component '{comp}' not built — region skipped")
            continue
        id_base, rid_base, entries = mount_component(
            root, region, comp_dir, rblock, id_base, working, rid_base)
        rel_entries += entries
        mounted.append(f"{region['name']}={comp}")

    (working / "ppt" / "slides" / slide_name).write_text(
        ET.tostring(root, encoding="unicode"), encoding="utf-8")
    _copy_blueprint_assets(shell_dir, working, slide_name)
    if rel_entries:  # add the mounted components' media rels to the slide's .rels
        rels_file = working / "ppt" / "slides" / "_rels" / f"{slide_name}.rels"
        text = rels_file.read_text(encoding="utf-8")
        add = "".join(f'<Relationship Id="{rid}" Type="{t}" Target="{tg}"/>'
                      for rid, t, tg in rel_entries)
        rels_file.write_text(text.replace("</Relationships>", f"{add}</Relationships>"),
                             encoding="utf-8")
    print(f"  {slide_name}: shell '{shell_name}' [{', '.join(mounted) or 'no regions'}]")
    return True
