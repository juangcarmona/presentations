#!/usr/bin/env python3
"""Normalize a blueprint's chrome to the 2026 master's.

Blueprints sourced from a non-master deck (e.g. `agentes`) carry that deck's
own chrome: a different footer logo and, often, no blue left bar. This script
grafts the canonical master chrome so every blueprint matches:

  - the blue left bar  (<p:sp>, full-height #3D5AFE rectangle at x=0)
  - the footer group   (<p:grpSp>: Plain Concepts logo + live slidenum field)

The canonical chrome is read from the master-sourced `three-col-cards`
blueprint (the donor). The target's own footer group is removed, the left bar
is added, the donor logo media + relationship are copied in, and any media left
orphaned by the swap is pruned from media/ and the .rels.

Idempotent: running twice yields the same result (old master-style footer is
treated as the existing footer and replaced).

Usage:
    python normalize_chrome.py <layout> [<layout> ...]
"""

import re
import shutil
import sys
import xml.etree.ElementTree as ET
from copy import deepcopy
from pathlib import Path

A = "{http://schemas.openxmlformats.org/drawingml/2006/main}"
P = "{http://schemas.openxmlformats.org/presentationml/2006/main}"
R = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"
EMU = 914400

SCRIPT_DIR = Path(__file__).resolve().parent
RESOURCES = SCRIPT_DIR.parent.parent / "resources"
BLUEPRINTS = RESOURCES / "blueprints"
DONOR = BLUEPRINTS / "three-col-cards"  # canonical master chrome


# Canonical Office namespace prefixes. Registered before serializing so that
# grafted donor content (e.g. the footer's a14 elements) never serializes a
# namespace as a reserved `nsN` prefix, which would later break re-parsing.
CANONICAL_NS = {
    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
    "p": "http://schemas.openxmlformats.org/presentationml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
    "a14": "http://schemas.microsoft.com/office/drawing/2010/main",
    "a16": "http://schemas.microsoft.com/office/drawing/2014/main",
    "p14": "http://schemas.microsoft.com/office/powerpoint/2010/main",
    "p15": "http://schemas.microsoft.com/office/powerpoint/2012/main",
    "asvg": "http://schemas.microsoft.com/office/drawing/2016/SVG/main",
    "mc": "http://schemas.openxmlformats.org/markup-compatibility/2006",
    "dgm": "http://schemas.openxmlformats.org/drawingml/2006/diagram",
    "pic": "http://schemas.openxmlformats.org/drawingml/2006/picture",
    "c": "http://schemas.openxmlformats.org/drawingml/2006/chart",
}


def _register(raw: str) -> None:
    for prefix, uri in CANONICAL_NS.items():
        ET.register_namespace(prefix, uri)
    for prefix, uri in re.findall(r'xmlns:(\w+)="([^"]+)"', raw):
        if not re.match(r"ns\d+$", prefix):
            ET.register_namespace(prefix, uri)


def _cnvpr(shape):
    for pre in ("nvSpPr", "nvPicPr", "nvGraphicFramePr", "nvGrpSpPr", "nvCxnSpPr"):
        n = shape.find(f"{P}{pre}/{P}cNvPr")
        if n is not None:
            return n
    return None


def _is_left_bar(sp) -> bool:
    """Narrow, full-height blue rectangle anchored at x≈0."""
    xfrm = sp.find(f"{P}spPr/{A}xfrm")
    if xfrm is None:
        return False
    off, ext = xfrm.find(f"{A}off"), xfrm.find(f"{A}ext")
    fill = sp.find(f"{P}spPr/{A}solidFill/{A}srgbClr")
    if off is None or ext is None or fill is None:
        return False
    try:
        x = int(off.get("x"))
        cx, cy = int(ext.get("cx")), int(ext.get("cy"))
    except (TypeError, ValueError):
        return False
    return x < 0.1 * EMU and cx < 0.2 * EMU and cy > 3 * EMU


def _is_accent(sp) -> bool:
    """Small blue tick above the section label (short, narrow, near the top)."""
    xfrm = sp.find(f"{P}spPr/{A}xfrm")
    fill = sp.find(f"{P}spPr/{A}solidFill/{A}srgbClr")
    if xfrm is None or fill is None or fill.get("val") != "3D5AFE":
        return False
    off, ext = xfrm.find(f"{A}off"), xfrm.find(f"{A}ext")
    if off is None or ext is None:
        return False
    try:
        y = int(off.get("y"))
        cx, cy = int(ext.get("cx")), int(ext.get("cy"))
    except (TypeError, ValueError):
        return False
    return cy < 0.1 * EMU and cx < 1 * EMU and y < 1.5 * EMU


def _section_off(spt):
    """(x, y) EMU of the shape carrying the SECTION slot marker, or None."""
    for sp in spt.findall(f"{P}sp"):
        txt = "".join(t.text or "" for t in sp.findall(f"{P}txBody/{A}p/{A}r/{A}t"))
        if "___SLOT_SECTION___" in txt:
            off = sp.find(f"{P}spPr/{A}xfrm/{A}off")
            if off is not None:
                return int(off.get("x")), int(off.get("y"))
    return None


def _has_slidenum(el) -> bool:
    return "slidenum" in ET.tostring(el, encoding="unicode")


def _load_donor():
    """Return (left_bar, accent, accent_delta, footer, logo_filename, logo_rid).

    `accent_delta` is the (dx, dy) EMU offset of the accent tick relative to the
    donor's section label, so it can be re-anchored to each target's section.
    """
    raw = (DONOR / "blueprint.xml").read_text(encoding="utf-8")
    root = ET.fromstring(raw)
    spt = root.find(f"{P}cSld/{P}spTree")
    left_bar = next((deepcopy(sp) for sp in spt.findall(f"{P}sp") if _is_left_bar(sp)), None)
    accent_sp = next((sp for sp in spt.findall(f"{P}sp") if _is_accent(sp)), None)
    footer = next((deepcopy(g) for g in spt.findall(f"{P}grpSp") if _has_slidenum(g)), None)
    if left_bar is None or footer is None or accent_sp is None:
        sys.exit("ERROR: could not find left bar, accent or footer in donor three-col-cards")
    a_off = accent_sp.find(f"{P}spPr/{A}xfrm/{A}off")
    s_off = _section_off(spt)
    accent_delta = (int(a_off.get("x")) - s_off[0], int(a_off.get("y")) - s_off[1])
    accent = deepcopy(accent_sp)
    embeds = re.findall(r'r:embed="([^"]+)"', ET.tostring(footer, encoding="unicode"))
    logo_rid = embeds[0] if embeds else None
    rels = (DONOR / "blueprint.xml.rels").read_text(encoding="utf-8")
    logo_file = None
    if logo_rid:
        m = re.search(rf'Id="{logo_rid}"[^>]*Target="\.\./media/([^"]+)"', rels)
        logo_file = m.group(1) if m else None
    return left_bar, accent, accent_delta, footer, logo_file, logo_rid


def _load_donor_header():
    """Return the donor's canonical header geometry+style as
    {'SECTION': (off, ext, rpr), 'TITLE': (off, ext, rpr)} (deep-copied).

    Used to graft the master header pattern (small spaced section label above a
    big title) onto blueprints whose source deck uses a different header
    treatment (e.g. a number badge + icon circle)."""
    raw = (DONOR / "blueprint.xml").read_text(encoding="utf-8")
    spt = ET.fromstring(raw).find(f"{P}cSld/{P}spTree")
    out = {}
    for sp in spt.findall(f"{P}sp"):
        txt = "".join(t.text or "" for t in sp.findall(f"{P}txBody/{A}p/{A}r/{A}t"))
        which = "SECTION" if "___SLOT_SECTION___" in txt else "TITLE" if "___SLOT_TITLE___" in txt else None
        if not which:
            continue
        off = sp.find(f"{P}spPr/{A}xfrm/{A}off")
        ext = sp.find(f"{P}spPr/{A}xfrm/{A}ext")
        rpr = sp.find(f"{P}txBody/{A}p/{A}r/{A}rPr")
        ppr = sp.find(f"{P}txBody/{A}p/{A}pPr")
        out[which] = (deepcopy(off), deepcopy(ext), deepcopy(rpr), deepcopy(ppr))
    return out


def _find_slot_sp(spt, slot: str):
    """Top-level <p:sp> whose text carries ___SLOT_{slot}___, or None."""
    for sp in spt.findall(f"{P}sp"):
        txt = "".join(t.text or "" for t in sp.findall(f"{P}txBody/{A}p/{A}r/{A}t"))
        if f"___SLOT_{slot}___" in txt:
            return sp
    return None


def _normalize_header(spt, drop_ids: list) -> None:
    """Drop source header decorations and restyle SECTION/TITLE to the master.

    `drop_ids` are the source cNvPr ids of the badge/icon/circle decorations to
    remove (sp *and* pic). SECTION and TITLE slot shapes are then repositioned
    and re-styled to the donor's canonical header geometry, keeping their slot
    markers. Run before chrome grafting so the accent re-anchors to the new
    SECTION position.
    """
    drop = {str(i) for i in drop_ids}
    for tag in (f"{P}sp", f"{P}pic"):
        for el in list(spt.findall(tag)):
            cnv = _cnvpr(el)
            if cnv is not None and cnv.get("id") in drop:
                spt.remove(el)

    donor = _load_donor_header()
    for slot in ("SECTION", "TITLE"):
        sp = _find_slot_sp(spt, slot)
        if sp is None or slot not in donor:
            continue
        off, ext, rpr, ppr = donor[slot]
        xfrm = sp.find(f"{P}spPr/{A}xfrm")
        if xfrm is not None:
            for tag, donor_el in ((f"{A}off", off), (f"{A}ext", ext)):
                cur = xfrm.find(tag)
                if cur is not None and donor_el is not None:
                    cur.attrib.update(donor_el.attrib)
        para = sp.find(f"{P}txBody/{A}p")
        if para is None:
            continue
        # paragraph props (alignment etc.): the source may center its text
        # inside a badge — replace with the donor's left-aligned pPr
        cur_ppr = para.find(f"{A}pPr")
        if cur_ppr is not None:
            para.remove(cur_ppr)
        if ppr is not None:
            para.insert(0, deepcopy(ppr))
        run = para.find(f"{A}r")
        if run is not None and rpr is not None:
            old = run.find(f"{A}rPr")
            if old is not None:
                run.remove(old)
            run.insert(0, deepcopy(rpr))


def _max_shape_id(spt) -> int:
    ids = [int(c.get("id")) for c in spt.iter(f"{P}cNvPr") if c.get("id")]
    return max(ids) if ids else 0


def _renumber(el, start: int) -> int:
    """Assign fresh sequential cNvPr ids to el and its descendants."""
    nxt = start
    for cnv in el.iter(f"{P}cNvPr"):
        cnv.set("id", str(nxt))
        nxt += 1
    return nxt


def _next_rid(rels_text: str) -> str:
    used = [int(n) for n in re.findall(r'Id="rId(\d+)"', rels_text)]
    return f"rId{(max(used) + 1) if used else 1}"


def normalize(layout: str, header_drop: list | None = None) -> None:
    bp = BLUEPRINTS / layout
    xml_path = bp / "blueprint.xml"
    rels_path = bp / "blueprint.xml.rels"
    raw = xml_path.read_text(encoding="utf-8")
    _register(raw)
    root = ET.fromstring(raw)
    spt = root.find(f"{P}cSld/{P}spTree")

    # 0) normalize the header (drop source badge/icon, restyle SECTION/TITLE to
    # the master) before chrome grafting so the accent anchors to the new SECTION
    if header_drop:
        _normalize_header(spt, header_drop)

    left_bar, accent, accent_delta, footer, donor_logo, _donor_rid = _load_donor()

    # 1) remove the target's existing footer group(s), old left bar and old accent
    for g in list(spt.findall(f"{P}grpSp")):
        if _has_slidenum(g):
            spt.remove(g)
    for sp in list(spt.findall(f"{P}sp")):
        if _is_left_bar(sp) or _is_accent(sp):
            spt.remove(sp)

    # re-anchor the accent tick to this blueprint's section label
    sec = _section_off(spt)
    if sec is not None:
        a_off = accent.find(f"{P}spPr/{A}xfrm/{A}off")
        a_off.set("x", str(sec[0] + accent_delta[0]))
        a_off.set("y", str(sec[1] + accent_delta[1]))

    # 2) renumber donor chrome to ids that can't collide with the target
    base = _max_shape_id(spt) + 1
    base = _renumber(left_bar, base)
    base = _renumber(accent, base)
    base = _renumber(footer, base)

    # 3) point the footer's logo at a fresh relationship in this blueprint
    rels_text = rels_path.read_text(encoding="utf-8")
    new_rid = _next_rid(rels_text)
    footer_xml = ET.tostring(footer, encoding="unicode")
    footer_xml = re.sub(r'r:embed="[^"]+"', f'r:embed="{new_rid}"', footer_xml, count=1)
    footer = ET.fromstring(
        f'<root xmlns:a="{A[1:-1]}" xmlns:p="{P[1:-1]}" xmlns:r="{R[1:-1]}">{footer_xml}</root>'
    )[0]

    # 4) insert left bar first (z-order: behind content), accent + footer on top
    grp_pr = spt.find(f"{P}grpSpPr")
    insert_at = list(spt).index(grp_pr) + 1 if grp_pr is not None else 0
    spt.insert(insert_at, left_bar)
    spt.append(accent)
    spt.append(footer)

    # 5) copy the donor logo into this blueprint's media + add the relationship
    (bp / "media").mkdir(exist_ok=True)
    shutil.copy2(DONOR / "media" / donor_logo, bp / "media" / donor_logo)
    rel = (
        f'  <Relationship Id="{new_rid}" '
        f'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" '
        f'Target="../media/{donor_logo}"/>\n'
    )
    rels_text = rels_text.replace("</Relationships>", rel + "</Relationships>")

    # point the slide at a master slideLayout that exists in the master package.
    # The source deck's own layout (e.g. agentes slideLayout9) is absent once the
    # blueprint is injected into the master, which makes PowerPoint "repair" the
    # file. slideLayout1 is what the master-sourced blueprints use.
    rels_text = re.sub(
        r'Target="\.\./slideLayouts/slideLayout\d+\.xml"',
        'Target="../slideLayouts/slideLayout1.xml"',
        rels_text,
    )

    # 6) write XML, then prune media/rels left orphaned by the footer swap
    xml_path.write_text(ET.tostring(root, encoding="unicode"), encoding="utf-8")
    _prune_orphans(bp, rels_path, rels_text)
    print(f"  OK {layout}: left bar + master footer ({donor_logo}, {new_rid}) + slideLayout1")


def _prune_orphans(bp: Path, rels_path: Path, rels_text: str) -> None:
    """Drop image relationships (and media files) no longer referenced in XML."""
    body = (bp / "blueprint.xml").read_text(encoding="utf-8")
    used = set(re.findall(r'r:embed="([^"]+)"', body)) | set(re.findall(r'r:link="([^"]+)"', body))
    kept, dropped_targets = [], []
    for rel in re.findall(r"<Relationship\b[^>]*/>", rels_text):
        rid = re.search(r'Id="([^"]+)"', rel).group(1)
        is_image = "/image" in rel
        if is_image and rid not in used:
            t = re.search(r'Target="\.\./media/([^"]+)"', rel)
            if t:
                dropped_targets.append(t.group(1))
            continue
        kept.append(rel)
    header = '<?xml version="1.0" encoding="utf-8"?>\n'
    header += '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">\n'
    rels_path.write_text(header + "\n".join("  " + r for r in kept) + "\n</Relationships>", encoding="utf-8")
    # delete media files no longer referenced by any kept relationship
    still = set(re.findall(r'Target="\.\./media/([^"]+)"', "\n".join(kept)))
    for name in dropped_targets:
        if name not in still:
            f = bp / "media" / name
            if f.exists():
                f.unlink()


def main():
    layouts = sys.argv[1:]
    if not layouts:
        sys.exit("Usage: python normalize_chrome.py <layout> [<layout> ...]")
    for layout in layouts:
        if not (BLUEPRINTS / layout).is_dir():
            print(f"  SKIP {layout}: no blueprint dir")
            continue
        normalize(layout)


if __name__ == "__main__":
    main()
