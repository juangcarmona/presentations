#!/usr/bin/env python3
"""Shared scaffolding for authoring shells and components on the master design.

Both `build_shells.py` and `build_components.py` author brand-correct slide XML
fresh on the master, cloning real template shapes (chrome, card header/body,
title/section) from the `three-col-cards` blueprint — the canonical master-sourced
donor also used by normalize_chrome. No raw-XML hand editing, so output is
on-brand by construction.

A *shell* is a slide with chrome + SECTION/TITLE and empty content regions.
A *component* is a chrome-less mini-slide whose shapes live at origin (0,0),
sized to a region; `mount.py` translates them into a shell region at compose time.
"""

import json
import re
import shutil
import xml.etree.ElementTree as ET
from copy import deepcopy
from pathlib import Path

A = "{http://schemas.openxmlformats.org/drawingml/2006/main}"
P = "{http://schemas.openxmlformats.org/presentationml/2006/main}"
EMU = 914400

BLUE = "3D5AFE"
NAVY = "1A1A2E"
OFFWHITE = "F2F3F7"

SCRIPT_DIR = Path(__file__).resolve().parent
RESOURCES = SCRIPT_DIR.parent.parent / "resources"
BLUEPRINTS = RESOURCES / "blueprints"
SHELLS = RESOURCES / "shells"
COMPONENTS = RESOURCES / "components"
DONOR = BLUEPRINTS / "three-col-cards"  # chrome + card/title/section templates


def _register_ns(raw: str) -> None:
    for prefix, uri in re.findall(r'xmlns:(\w+)="([^"]+)"', raw):
        if not re.match(r"ns\d+$", prefix):
            ET.register_namespace(prefix, uri)


def emu(v) -> str:
    return str(int(round(v * EMU)))


def set_xfrm(sp, x, y, w, h) -> None:
    xf = sp.find(f"{P}spPr/{A}xfrm")
    off, ext = xf.find(f"{A}off"), xf.find(f"{A}ext")
    off.set("x", emu(x)); off.set("y", emu(y))
    ext.set("cx", emu(w)); ext.set("cy", emu(h))


def set_text(sp, s) -> None:
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


def set_run_color(sp, hexcolor) -> None:
    for clr in sp.findall(f"{P}txBody/{A}p/{A}r/{A}rPr/{A}solidFill/{A}srgbClr"):
        clr.set("val", hexcolor)


def set_run_sz(sp, sz) -> None:
    for rpr in sp.findall(f"{P}txBody/{A}p/{A}r/{A}rPr"):
        rpr.set("sz", str(sz))


def _by_id(spt, sid):
    for sp in spt:
        cnv = sp.find(f"{P}nvSpPr/{P}cNvPr")
        if cnv is None:
            cnv = sp.find(f"{P}nvGrpSpPr/{P}cNvPr")
        if cnv is not None and cnv.get("id") == str(sid):
            return sp
    return None


def load_donor() -> dict:
    """Return cloned template shapes from three-col-cards keyed by role.

    Template ids (see three-col-cards/blueprint.xml):
      2 leftbar, 3 accent, 4 SECTION, 5 TITLE, 6 card-header-bg,
      7 card-header-text, 8 card-body-bg, 9 card-body-text, 22 footer group.
    """
    raw = (DONOR / "blueprint.xml").read_text(encoding="utf-8")
    _register_ns(raw)
    root = ET.fromstring(raw)
    spt = root.find(f"{P}cSld/{P}spTree")
    roles = {
        "leftbar": 2, "accent": 3, "section": 4, "title": 5,
        "hdr_bg": 6, "hdr_txt": 7, "body_bg": 8, "body_txt": 9, "footer": 22,
    }
    tpl = {name: deepcopy(_by_id(spt, sid)) for name, sid in roles.items()}
    missing = [n for n, v in tpl.items() if v is None]
    if missing:
        raise RuntimeError(f"donor {DONOR.name} missing template shapes: {missing}")
    tpl["raw"] = raw
    # spTree scaffold children (nvGrpSpPr + grpSpPr) every slide needs to be valid
    tpl["scaffold"] = [deepcopy(c) for c in spt
                       if c.tag.split("}")[-1] in ("nvGrpSpPr", "grpSpPr")]
    return tpl


class PieceBuilder:
    """Authors a slide spTree by cloning donor templates and placing them."""

    def __init__(self, tpl: dict):
        self.tpl = tpl
        self.spt = ET.Element(f"{P}spTree")
        for c in tpl["scaffold"]:
            self.spt.append(deepcopy(c))
        self._id = 1000
        self.slots = []
        self.groups = {}

    def nid(self) -> int:
        self._id += 1
        return self._id

    def add(self, role, x, y, w, h, *, fill=None, text=None, marker=None,
            kind="scalar", sz=None, color=None, group=None) -> int:
        sp = deepcopy(self.tpl[role])
        cnv = sp.find(f"{P}nvSpPr/{P}cNvPr")
        sid = self.nid()
        cnv.set("id", str(sid)); cnv.set("name", f"gen{sid}")
        set_xfrm(sp, x, y, w, h)
        if fill is not None:
            clr = sp.find(f"{P}spPr/{A}solidFill/{A}srgbClr")
            if clr is not None:
                clr.set("val", fill)
        if marker is not None:
            set_text(sp, f"___SLOT_{marker}___")
            self.slots.append({"name": marker, "kind": kind,
                               **({"group": group} if group else {})})
        elif text is not None:
            set_text(sp, text)
        if sz is not None:
            set_run_sz(sp, sz)
        if color is not None:
            set_run_color(sp, color)
        if group is not None:
            self.groups.setdefault(group, []).append(sid)
        self.spt.append(sp)
        return sid

    def add_chrome(self) -> None:
        """Append leftbar, accent, SECTION, TITLE slots and the footer group."""
        self.spt.append(deepcopy(self.tpl["leftbar"]))
        self.spt.append(deepcopy(self.tpl["accent"]))
        self.spt.append(deepcopy(self.tpl["section"]))
        self.spt.append(deepcopy(self.tpl["title"]))
        self.spt.append(deepcopy(self.tpl["footer"]))
        self.slots.append({"name": "SECTION", "kind": "scalar"})
        self.slots.append({"name": "TITLE", "kind": "scalar"})

    def _groups_meta(self) -> dict:
        meta = {}
        for gname, ids in self.groups.items():
            ctrl = next((s["name"] for s in self.slots if s.get("group") == gname), None)
            meta[gname] = {"ids": ids, "control_slot": ctrl}
        return meta

    def build_slide_root(self) -> ET.Element:
        root = ET.fromstring(self.tpl["raw"])
        cs = root.find(f"{P}cSld")
        cs.remove(cs.find(f"{P}spTree"))
        cs.append(self.spt)
        return root

    def write(self, out_dir: Path, meta_extra: dict, *, copy_chrome_assets: bool) -> dict:
        out_dir.mkdir(parents=True, exist_ok=True)
        root = self.build_slide_root()
        (out_dir / "blueprint.xml").write_text(
            ET.tostring(root, encoding="unicode"), encoding="utf-8")
        media = []
        if copy_chrome_assets:
            (out_dir / "media").mkdir(exist_ok=True)
            for m in (DONOR / "media").iterdir():
                shutil.copy2(m, out_dir / "media" / m.name)
                media.append(m.name)
            shutil.copy2(DONOR / "blueprint.xml.rels", out_dir / "blueprint.xml.rels")
        meta = {
            "source": "manual",
            "slide": "(generated)",
            "media": media,
            "slots": self.slots,
            "groups": self._groups_meta(),
            "tables": [],
            **meta_extra,
        }
        (out_dir / "slots.json").write_text(
            json.dumps(meta, indent=2, ensure_ascii=False), encoding="utf-8")
        return meta
