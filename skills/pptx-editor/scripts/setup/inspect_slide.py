#!/usr/bin/env python3
"""Dump top-level shapes of a slide for authoring blueprint specs.

Lists each <p:sp> with its cNvPr id/name, position/size (inches), and joined
text preview. Use this to map shape id -> slot without reading the full XML.

Usage:
    python inspect_slide.py <source> <slideN.xml>
        source = master | proposal-example | <path-to-unpacked-dir>
"""

import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

A = "{http://schemas.openxmlformats.org/drawingml/2006/main}"
P = "{http://schemas.openxmlformats.org/presentationml/2006/main}"
EMU = 914400

RESOURCES = Path(__file__).resolve().parent.parent.parent / "resources"
SOURCES = {
    "master": RESOURCES / "2026_ProposalsAI_Master_Template" / "2026_ProposalsAI_Master_Template-unpacked",
    "proposal-example": RESOURCES / "proposal-example" / "proposal-example-unpacked",
    "agentes": RESOURCES / "agentes-proposal-example" / "agentes-proposal-example-unpacked",
    "sermes": RESOURCES / "sermes-example" / "Sermes_CRO_Business_Process_Summary-unpacked",
    "offerings": RESOURCES / "master-brand-template" / "2026_Offerings_Master_Template-unpacked",
}


def main():
    source, slide = sys.argv[1], sys.argv[2]
    base = SOURCES.get(source, Path(source))
    raw = (base / "ppt" / "slides" / slide).read_text(encoding="utf-8")
    root = ET.fromstring(raw)
    sp_tree = root.find(f"{P}cSld/{P}spTree")

    def emu_in(v):
        try:
            return round(int(v) / EMU, 2)
        except (TypeError, ValueError):
            return "?"

    for sp in sp_tree.findall(f"{P}sp"):
        cnv = sp.find(f"{P}nvSpPr/{P}cNvPr")
        sid = cnv.get("id") if cnv is not None else "?"
        name = cnv.get("name") if cnv is not None else "?"
        xfrm = sp.find(f"{P}spPr/{A}xfrm")
        off = xfrm.find(f"{A}off") if xfrm is not None else None
        ext = xfrm.find(f"{A}ext") if xfrm is not None else None
        pos = ""
        if off is not None and ext is not None:
            pos = f"@({emu_in(off.get('x'))},{emu_in(off.get('y'))}) {emu_in(ext.get('cx'))}x{emu_in(ext.get('cy'))}in"
        # fill color hint
        fill = sp.find(f"{P}spPr/{A}solidFill/{A}srgbClr")
        fillc = f" fill=#{fill.get('val')}" if fill is not None else ""
        # geometry
        geom = sp.find(f"{P}spPr/{A}prstGeom")
        g = f" {geom.get('prst')}" if geom is not None else ""
        # text
        texts = [t.text for t in sp.findall(f"{P}txBody/{A}p/{A}r/{A}t") if t.text]
        npara = len(sp.findall(f"{P}txBody/{A}p"))
        preview = " | ".join(texts)[:70].replace("\n", " ")
        print(f"id={sid:>3} {name:<22}{g}{fillc} {pos}  paras={npara}")
        if preview:
            print(f"        text: {preview}")

    # group shapes (footer etc.)
    for g in sp_tree.findall(f"{P}grpSp"):
        cnv = g.find(f"{P}nvGrpSpPr/{P}cNvPr")
        sid = cnv.get("id") if cnv is not None else "?"
        name = cnv.get("name") if cnv is not None else "?"
        print(f"GRP id={sid:>3} {name}  (group, e.g. footer — leave untouched)")


if __name__ == "__main__":
    main()
