#!/usr/bin/env python3
"""Hand-authored blueprints built ON the master design (source = manual).

Some layouts only exist as bespoke, group-heavy slides in other decks
(proposal-example) that cannot be auto-extracted cleanly. Per the "regla de
oro", those decks are visual reference only — the blueprint is authored fresh
on the master design.

This generator clones the already-correct chrome and card templates from the
`capability-grid` blueprint (blue left bar, accent tick, footer logo + slidenum,
10" canvas, slideLayout1, master palette/fonts) and lays out new content with
computed geometry. No raw-XML hand editing, so the output is on-brand by
construction.

Builds: numbered-pipeline, framework-pillars, summary-cards.

Usage:
    python build_manual_blueprints.py [layout ...]   # omit = all
"""

import json
import re
import shutil
import sys
import xml.etree.ElementTree as ET
from copy import deepcopy
from pathlib import Path

A = "{http://schemas.openxmlformats.org/drawingml/2006/main}"
P = "{http://schemas.openxmlformats.org/presentationml/2006/main}"
EMU = 914400

SCRIPT_DIR = Path(__file__).resolve().parent
RESOURCES = SCRIPT_DIR.parent.parent / "resources"
BLUEPRINTS = RESOURCES / "blueprints"
DONOR = BLUEPRINTS / "capability-grid"  # chrome + card-template donor

BLUE = "3D5AFE"
NAVY = "1A1A2E"
OFFWHITE = "F2F3F5"


def _register(raw: str) -> None:
    for prefix, uri in re.findall(r'xmlns:(\w+)="([^"]+)"', raw):
        if not re.match(r"ns\d+$", prefix):
            ET.register_namespace(prefix, uri)


def _emu(v):
    return str(int(round(v * EMU)))


def _set_xfrm(sp, x, y, w, h):
    xf = sp.find(f"{P}spPr/{A}xfrm")
    off, ext = xf.find(f"{A}off"), xf.find(f"{A}ext")
    off.set("x", _emu(x)); off.set("y", _emu(y))
    ext.set("cx", _emu(w)); ext.set("cy", _emu(h))


def _set_text(sp, s):
    """Set the shape's first run text, dropping extra runs/paragraphs."""
    tx = sp.find(f"{P}txBody")
    paras = tx.findall(f"{A}p")
    for extra in paras[1:]:
        tx.remove(extra)
    runs = paras[0].findall(f"{A}r")
    t = runs[0].find(f"{A}t")
    if t is None:
        t = ET.SubElement(runs[0], f"{A}t")
    t.text = s
    t.attrib.pop("{http://www.w3.org/XML/1998/namespace}space", None)
    for r in runs[1:]:
        paras[0].remove(r)


def _set_fill(sp, hexcolor):
    clr = sp.find(f"{P}spPr/{A}solidFill/{A}srgbClr")
    if clr is not None:
        clr.set("val", hexcolor)


def _find_marker(spt, marker):
    for sp in spt.findall(f"{P}sp"):
        for t in sp.iter(f"{A}t"):
            if t.text and marker in t.text:
                return sp
    return None


def _find_fill_geom(spt, geom, fill, near_y=None):
    best = None
    for sp in spt.findall(f"{P}sp"):
        g = sp.find(f"{P}spPr/{A}prstGeom")
        c = sp.find(f"{P}spPr/{A}solidFill/{A}srgbClr")
        if g is None or g.get("prst") != geom or c is None or c.get("val") != fill:
            continue
        return sp
    return best


def _load_templates():
    raw = (DONOR / "blueprint.xml").read_text(encoding="utf-8")
    _register(raw)
    root = ET.fromstring(raw)
    spt = root.find(f"{P}cSld/{P}spTree")
    # chrome
    leftbar = next(sp for sp in spt.findall(f"{P}sp")
                   if (sp.find(f"{P}spPr/{A}solidFill/{A}srgbClr") is not None
                       and sp.find(f"{P}spPr/{A}solidFill/{A}srgbClr").get("val") == BLUE
                       and _ext_cy(sp) > 3 * EMU))
    accent = next(sp for sp in spt.findall(f"{P}sp")
                  if (sp.find(f"{P}spPr/{A}solidFill/{A}srgbClr") is not None
                      and sp.find(f"{P}spPr/{A}solidFill/{A}srgbClr").get("val") == BLUE
                      and 0 < _ext_cy(sp) < 0.1 * EMU))
    footer = next(g for g in spt.findall(f"{P}grpSp")
                  if "slidenum" in ET.tostring(g, encoding="unicode"))
    section = _find_marker(spt, "___SLOT_SECTION___")
    title = _find_marker(spt, "___SLOT_TITLE___")
    badge_bg = _find_fill_geom(spt, "roundRect", OFFWHITE)        # card bg
    badge = _find_fill_geom(spt, "roundRect", BLUE)               # number badge
    badgenum = _find_marker_text(spt, "1")                        # the "1"
    header = _find_marker(spt, "___SLOT_CARD1_HEADER___")
    body = _find_marker(spt, "___SLOT_CARD1_BODY___")
    return {
        "leftbar": leftbar, "accent": accent, "footer": footer,
        "section": section, "title": title, "card_bg": badge_bg,
        "badge": badge, "badgenum": badgenum, "header": header, "body": body,
        "raw": raw,
    }


def _ext_cy(sp):
    e = sp.find(f"{P}spPr/{A}xfrm/{A}ext")
    return int(e.get("cy")) if e is not None else 0


def _find_marker_text(spt, exact):
    for sp in spt.findall(f"{P}sp"):
        runs = sp.findall(f"{P}txBody/{A}p/{A}r/{A}t")
        if runs and runs[0].text == exact:
            return sp
    return None


class Builder:
    def __init__(self, tpl):
        self.tpl = tpl
        self.spt = ET.Element(f"{P}spTree")
        # spTree needs nvGrpSpPr + grpSpPr to be valid; copy from donor
        donor_root = ET.fromstring(tpl["raw"])
        donor_spt = donor_root.find(f"{P}cSld/{P}spTree")
        for child in donor_spt:
            tag = child.tag.split("}")[-1]
            if tag in ("nvGrpSpPr", "grpSpPr"):
                self.spt.append(deepcopy(child))
        self._id = 1000
        self.slots = []
        self.groups = {}
        # chrome carries over untouched
        for key in ("leftbar", "accent", "footer"):
            self.spt.append(deepcopy(tpl[key]))
        # section + title are slots (markers already present in the templates)
        self.spt.append(deepcopy(tpl["section"]))
        self.spt.append(deepcopy(tpl["title"]))
        self.slots.append({"name": "SECTION", "kind": "scalar"})
        self.slots.append({"name": "TITLE", "kind": "scalar"})

    def nid(self):
        self._id += 1
        return self._id

    def _add(self, template_key, x, y, w, h, *, fill=None, text=None,
             marker=None, sz=None, group=None, color=None):
        sp = deepcopy(self.tpl[template_key])
        cnv = sp.find(f"{P}nvSpPr/{P}cNvPr")
        sid = self.nid()
        cnv.set("id", str(sid))
        cnv.set("name", f"gen{sid}")
        _set_xfrm(sp, x, y, w, h)
        if fill is not None:
            _set_fill(sp, fill)
        if marker is not None:
            _set_text(sp, marker)
            self.slots.append({"name": marker.replace("___SLOT_", "").replace("___", ""),
                               "kind": "scalar", **({"group": group} if group else {})})
        elif text is not None:
            _set_text(sp, text)
        if sz is not None:
            for rpr in sp.findall(f"{P}txBody/{A}p/{A}r/{A}rPr"):
                rpr.set("sz", str(sz))
        if color is not None:
            for clr in sp.findall(f"{P}txBody/{A}p/{A}r/{A}rPr/{A}solidFill/{A}srgbClr"):
                clr.set("val", color)
        if group is not None:
            self.groups.setdefault(group, []).append(sid)
        self.spt.append(sp)
        return sid

    def slot_name(self, raw_marker):
        return raw_marker.replace("___SLOT_", "").replace("___", "")

    def write(self, layout, intro=None):
        root = ET.fromstring(self.tpl["raw"])
        cs = root.find(f"{P}cSld")
        cs.remove(cs.find(f"{P}spTree"))
        cs.append(self.spt)
        out = BLUEPRINTS / layout
        out.mkdir(parents=True, exist_ok=True)
        (out / "media").mkdir(exist_ok=True)
        for m in (DONOR / "media").iterdir():
            shutil.copy2(m, out / "media" / m.name)
        shutil.copy2(DONOR / "blueprint.xml.rels", out / "blueprint.xml.rels")
        (out / "blueprint.xml").write_text(ET.tostring(root, encoding="unicode"), encoding="utf-8")
        # control_slot = first scalar slot of each group
        groups_meta = {}
        for gname, ids in self.groups.items():
            ctrl = next((s["name"] for s in self.slots
                         if s.get("group") == gname), None)
            groups_meta[gname] = {"ids": ids, "control_slot": ctrl}
        meta = {
            "layout": layout, "source": "manual", "slide": "(generated)",
            "media": [m.name for m in (out / "media").iterdir()],
            "slots": self.slots, "groups": groups_meta, "tables": [],
        }
        (out / "slots.json").write_text(json.dumps(meta, indent=2, ensure_ascii=False), encoding="utf-8")
        print(f"  OK {layout}: {len(self.slots)} slots, {len(groups_meta)} groups -> {out}")


# ---------------------------------------------------------------- layouts ----

def build_numbered_pipeline(tpl):
    """One horizontal row of 5 numbered step cards."""
    b = Builder(tpl)
    n = 5
    x0, gap = 0.6, 0.18
    w = (8.8 - (n - 1) * gap) / n
    y, h = 1.9, 2.6
    for i in range(1, n + 1):
        x = x0 + (i - 1) * (w + gap)
        g = f"step{i}"
        b._add("card_bg", x, y, w, h, fill=OFFWHITE, group=g)
        b._add("badge", x + w / 2 - 0.24, y + 0.22, 0.48, 0.48, fill=BLUE, group=g)
        b._add("badgenum", x + w / 2 - 0.24, y + 0.22, 0.48, 0.48, text=str(i), sz=1300, group=g)
        b._add("header", x + 0.12, y + 0.85, w - 0.24, 0.55, marker=f"___SLOT_STEP{i}_HEADER___", sz=1050, group=g)
        b._add("body", x + 0.12, y + 1.45, w - 0.24, 1.0, marker=f"___SLOT_STEP{i}_BODY___", sz=850, group=g)
    b.write("numbered-pipeline")


def build_framework_pillars(tpl):
    """Central hub box + ▼ connector + a row of 4 supporting pillar cards."""
    b = Builder(tpl)
    # central hub (white centered text on blue) — badgenum template is white+centered
    b._add("badge", 3.3, 1.75, 3.4, 0.7, fill=BLUE)
    b._add("badgenum", 3.3, 1.9, 3.4, 0.42, marker="___SLOT_HUB___", sz=1400)
    # connector
    b._add("body", 4.7, 2.55, 0.6, 0.3, text="▼", sz=1400)
    # pillars
    n = 4
    x0, gap = 0.6, 0.23
    w = (8.8 - (n - 1) * gap) / n
    y, h = 3.15, 1.5
    for i in range(1, n + 1):
        x = x0 + (i - 1) * (w + gap)
        g = f"pillar{i}"
        b._add("card_bg", x, y, w, h, fill=OFFWHITE, group=g)
        b._add("badge", x, y, w, 0.09, fill=BLUE, group=g)        # top accent strip
        b._add("header", x + 0.15, y + 0.22, w - 0.3, 0.5, marker=f"___SLOT_PILLAR{i}_HEADER___", sz=1050, group=g)
        b._add("body", x + 0.15, y + 0.72, w - 0.3, 0.65, marker=f"___SLOT_PILLAR{i}_BODY___", sz=850, group=g)
    b.write("framework-pillars")


def build_summary_cards(tpl):
    """Light panel with a 2x3 grid of summary cells (accent bar + title + text)."""
    b = Builder(tpl)
    # container panel
    b._add("card_bg", 0.6, 1.45, 8.8, 3.45, fill="F0F1F5")
    cols = [1.0, 5.2]
    rows = [1.75, 2.85, 3.95]
    cw, ch = 3.9, 1.0
    i = 0
    for ry in rows:
        for cx in cols:
            i += 1
            g = f"card{i}"
            b._add("badge", cx, ry, 0.16, 0.45, fill=BLUE, group=g)   # accent bar
            b._add("header", cx + 0.3, ry, cw - 0.3, 0.35, marker=f"___SLOT_CARD{i}_HEADER___", sz=1100, group=g)
            b._add("body", cx + 0.3, ry + 0.4, cw - 0.3, 0.6, marker=f"___SLOT_CARD{i}_BODY___", sz=850, group=g)
    b.write("summary-cards")


BUILDERS = {
    "numbered-pipeline": build_numbered_pipeline,
    "framework-pillars": build_framework_pillars,
    "summary-cards": build_summary_cards,
}


def main():
    tpl = _load_templates()
    wanted = sys.argv[1:] or list(BUILDERS)
    for layout in wanted:
        if layout not in BUILDERS:
            print(f"  SKIP {layout}: no builder")
            continue
        BUILDERS[layout](tpl)


if __name__ == "__main__":
    main()
