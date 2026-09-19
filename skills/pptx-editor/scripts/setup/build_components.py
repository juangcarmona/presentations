#!/usr/bin/env python3
"""Author chrome-less components on the master design (source = manual).

A component is a mini-blueprint whose shapes live at origin (0,0), sized to a
shell region (default 4.3" wide). At compose time, `mount.py` fills it with
`fill_blueprint` and translates its shapes into a shell region.

Components reference no media and need no rels (the footer logo lives in the
shell). Emits resources/components/{name}/{blueprint.xml, slots.json}.

Usage:
    python build_components.py [name ...]   # omit = all
"""

import copy
import re
import sys
import xml.etree.ElementTree as ET

from _pieces import (A, P, EMU, BLUEPRINTS, COMPONENTS, BLUE, NAVY, OFFWHITE,
                     PieceBuilder, emu, load_donor)

# Canonical authoring box for a half-width region (see shells/halves regions).
BOX_W = 4.3
BOX_H = 3.25


def _load_graphicframe(blueprint_name):
    """Deep-copy the first <p:graphicFrame> (a table) from a built blueprint."""
    raw = (BLUEPRINTS / blueprint_name / "blueprint.xml").read_text(encoding="utf-8")
    for pre, uri in re.findall(r'xmlns:(\w+)="([^"]+)"', raw):
        if not re.match(r"ns\d+$", pre):
            ET.register_namespace(pre, uri)
    root = ET.fromstring(raw)
    return copy.deepcopy(root.find(f"{P}cSld/{P}spTree/{P}graphicFrame"))


def build_card(tpl):
    """A single titled card: blue header bar + off-white body with bullets."""
    b = PieceBuilder(tpl)
    w = BOX_W
    b.add("hdr_bg", 0, 0, w, 0.55, fill=BLUE)
    b.add("hdr_txt", 0, 0, w, 0.55, marker="CARD_HEADER", sz=1300)
    b.add("body_bg", 0, 0.65, w, BOX_H - 0.65, fill=OFFWHITE)
    b.add("body_txt", 0.22, 0.82, w - 0.44, BOX_H - 0.95,
          marker="CARD_BODY", kind="list", sz=1050)
    return b, {"component_box": {"w": BOX_W, "h": BOX_H},
               "capacity": {"CARD_BODY": 5}}


def build_stat_stack(tpl):
    """Up to three stacked stats: big number + caption. Empty stats prune."""
    b = PieceBuilder(tpl)
    w = BOX_W
    block_h = 1.05
    for i in range(1, 4):
        y = (i - 1) * block_h
        g = f"stat{i}"
        b.add("title", 0, y, w, 0.72, marker=f"STAT{i}_VALUE",
              sz=3600, color=BLUE, group=g)
        b.add("section", 0, y + 0.74, w, 0.3, marker=f"STAT{i}_LABEL",
              color=NAVY, group=g)
    return b, {"component_box": {"w": BOX_W, "h": BOX_H}}


def build_mini_table(tpl):
    """A compact 2-col table sized to a region (clones data-table's graphicFrame).

    Exercises the graphicFrame translation path in mount.py (`p:xfrm`). The table
    is filled by name via fill_blueprint's `_fill_table` (header row kept, body
    template row cloned per data row)."""
    b = PieceBuilder(tpl)
    gf = _load_graphicframe("data-table")
    # reposition to origin and resize to the region width
    xf = gf.find(f"{P}xfrm")
    off, ext = xf.find(f"{A}off"), xf.find(f"{A}ext")
    off.set("x", "0"); off.set("y", "0")
    ext.set("cx", emu(BOX_W)); ext.set("cy", emu(2.6))
    total = int(round(BOX_W * EMU))
    cols = gf.findall(f"{A}graphic/{A}graphicData/{A}tbl/{A}tblGrid/{A}gridCol")
    cols[0].set("w", str(int(total * 0.34)))
    cols[1].set("w", str(total - int(total * 0.34)))
    # drop p14 modId metadata (its namespace isn't on the component slide wrapper)
    nvpr = gf.find(f"{P}nvGraphicFramePr/{P}nvPr")
    extlst = nvpr.find(f"{P}extLst") if nvpr is not None else None
    if extlst is not None:
        nvpr.remove(extlst)
    cnv = gf.find(f"{P}nvGraphicFramePr/{P}cNvPr")
    sid = b.nid()
    cnv.set("id", str(sid)); cnv.set("name", f"gen{sid}")
    b.spt.append(gf)
    return b, {"component_box": {"w": BOX_W, "h": BOX_H},
               "tables": [{"name": "TABLE", "header_rows": 1, "cols": 2}],
               "capacity": {"TABLE": 6}}


BUILDERS = {
    "card": build_card,
    "stat-stack": build_stat_stack,
    "mini-table": build_mini_table,
}


def main():
    tpl = load_donor()
    wanted = sys.argv[1:] or list(BUILDERS)
    for name in wanted:
        if name not in BUILDERS:
            print(f"  SKIP {name}: no builder")
            continue
        b, extra = BUILDERS[name](tpl)
        meta = b.write(COMPONENTS / name, {"component": name, **extra},
                       copy_chrome_assets=False)
        print(f"  OK component {name}: {len(meta['slots'])} slots, "
              f"{len(meta['groups'])} groups -> {COMPONENTS / name}")


if __name__ == "__main__":
    main()
