#!/usr/bin/env python3
"""Mount a filled component into a shell region (deterministic, no LLM).

A shell (resources/shells/{name}) is a brand-correct slide with chrome +
SECTION/TITLE and empty regions. A component (resources/components/{name}) is a
chrome-less mini-slide whose shapes live at origin (0,0), sized to a region.

`mount_component` fills the component with the existing fill_blueprint (which
never touches geometry), renumbers its shape ids so they don't collide with the
shell's, translates every top-level shape by the region origin, and appends the
shapes into the shell's spTree. Translation is pure offset — no scaling — because
components are authored at exactly their region size (see _pieces.BOX_W/BOX_H).

A top-level shape's <a:off> is absolute (slide origin); shapes nested inside a
<p:grpSp> are relative to the group's chOff, so offsetting only the group's own
<a:off> moves the whole group — no recursion into group children is needed.
"""

import json
import re
import shutil
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPTS))
from fill_blueprint import fill_blueprint

A = "{http://schemas.openxmlformats.org/drawingml/2006/main}"
P = "{http://schemas.openxmlformats.org/presentationml/2006/main}"
R = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"
EMU = 914400

_SCAFFOLD = ("nvGrpSpPr", "grpSpPr")
_REL_ATTRS = (f"{R}embed", f"{R}link")
_REL_RE = re.compile(r'<Relationship\s+Id="(rId\d+)"\s+Type="([^"]+)"\s+Target="([^"]+)"')


def _emu(inches: float) -> int:
    return int(round(inches * EMU))


def _top_off(child: ET.Element):
    """Return the top-level <a:off> for a shape, by shape kind, or None."""
    tag = child.tag.split("}")[-1]
    if tag == "graphicFrame":
        xf = child.find(f"{P}xfrm")
    elif tag == "grpSp":
        xf = child.find(f"{P}grpSpPr/{A}xfrm")
    else:  # sp, pic, cxnSp
        xf = child.find(f"{P}spPr/{A}xfrm")
    return xf.find(f"{A}off") if xf is not None else None


def _translate(child: ET.Element, dx: int, dy: int) -> None:
    off = _top_off(child)
    if off is None:
        return
    off.set("x", str(int(off.get("x", "0")) + dx))
    off.set("y", str(int(off.get("y", "0")) + dy))


def _renumber(child: ET.Element, start: int) -> int:
    """Reassign every cNvPr id in the subtree from `start`. Returns next free id."""
    nid = start
    for cnv in child.iter(f"{P}cNvPr"):
        cnv.set("id", str(nid))
        nid += 1
    return nid


def max_shape_id(spt: ET.Element) -> int:
    ids = [int(c.get("id")) for c in spt.iter(f"{P}cNvPr") if c.get("id", "").isdigit()]
    return max(ids) if ids else 1


def _remap_component_rels(cspt, component_dir, working, rid_base):
    """Remap a component's media relationships into the shell slide.

    A component may carry a blueprint.xml.rels (e.g. an icon <p:pic r:embed>).
    Its rIds would collide with the shell slide's, so allocate fresh rIds from
    `rid_base`, rewrite the shapes' r:embed/r:link, copy the referenced media into
    the deck, and return (next rid_base, [(rid, type, target), ...]) for the
    caller to append to the slide's .rels. No-op when the component has no rels.
    """
    rels_path = Path(component_dir) / "blueprint.xml.rels"
    if not rels_path.exists():
        return rid_base, []
    comp_rels = {m.group(1): (m.group(2), m.group(3))
                 for m in _REL_RE.finditer(rels_path.read_text(encoding="utf-8"))}
    if not comp_rels:
        return rid_base, []

    used = {el.get(a) for el in cspt.iter() for a in _REL_ATTRS if el.get(a)}
    rid_map, entries = {}, []
    for old in sorted(used):
        if old not in comp_rels:
            continue
        new = f"rId{rid_base}"
        rid_base += 1
        rid_map[old] = new
        rtype, target = comp_rels[old]
        entries.append((new, rtype, target))
        if working is not None and "media/" in target:
            src = Path(component_dir) / "media" / Path(target).name
            dst = Path(working) / "ppt" / "media" / Path(target).name
            if src.exists() and not dst.exists():
                dst.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(src, dst)
    for el in cspt.iter():
        for a in _REL_ATTRS:
            if el.get(a) in rid_map:
                el.set(a, rid_map[el.get(a)])
    return rid_base, entries


def _capacity_warnings(component_dir: Path, block: dict) -> None:
    """WARN (don't fail) when region content exceeds a component's declared
    capacity — a card with too many bullets or a table with too many rows
    overflows its fixed box. Capacities live in the component's slots.json
    (`capacity: {slot: max}`). Cheap and deterministic; no render needed."""
    meta_path = Path(component_dir) / "slots.json"
    if not meta_path.exists():
        return
    cap = json.loads(meta_path.read_text(encoding="utf-8")).get("capacity", {})
    for slot, limit in cap.items():
        val = (block or {}).get(slot)
        n = (len(val.get("rows", [])) if isinstance(val, dict)
             else len(val) if isinstance(val, list) else 0)
        if n > limit:
            print(f"  WARN component '{Path(component_dir).name}': {slot} has {n} "
                  f"items but fits {limit} — content may overflow the region.",
                  file=sys.stderr)


def mount_component(shell_root: ET.Element, region: dict, component_dir: Path,
                    block: dict, id_base: int, working=None, rid_base: int = 1):
    """Fill `component_dir` with `block`, translate into `region`, append shapes
    to the shell. Returns (next_id, next_rid_base, rel_entries) — the rel_entries
    are media relationships the caller must add to the slide's .rels."""
    _capacity_warnings(component_dir, block)
    xml = fill_blueprint(component_dir, block or {})
    croot = ET.fromstring(xml)
    cspt = croot.find(f"{P}cSld/{P}spTree")
    shell_spt = shell_root.find(f"{P}cSld/{P}spTree")
    rid_base, rel_entries = _remap_component_rels(cspt, component_dir, working, rid_base)
    dx, dy = _emu(region["x"]), _emu(region["y"])
    for child in list(cspt):
        if child.tag.split("}")[-1] in _SCAFFOLD:
            continue
        id_base = _renumber(child, id_base)
        _translate(child, dx, dy)
        shell_spt.append(child)
    return id_base, rid_base, rel_entries
