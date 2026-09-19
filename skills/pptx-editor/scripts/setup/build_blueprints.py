#!/usr/bin/env python3
"""Build blueprint slides from catalogued source slides (one-time).

For each layout in blueprint_specs.json:
  1. Copy the source slide XML (already brand-correct: left bar, footer, chrome).
  2. Replace each mapped shape's editable text with a ___SLOT_NAME___ marker,
     collapsing fragmented runs into a single run (preserving the first run's rPr).
     - kind=scalar: single line. Runs collapsed to one marker run.
     - kind=list:   bullet array. Keep the first <a:p> as the per-item template
       (its pPr/buChar preserved), collapse it to one marker run, drop siblings.
  3. Emit slots.json describing slots (name/kind/group) and prunable groups.
  4. Copy the slide rels + any referenced media (self-contained blueprint).

compose.py later fills the markers (simple string replace for scalars, paragraph
cloning for lists) and prunes empty groups by shape id.

Usage:
    python build_blueprints.py [layout_hint ...]   # omit args = all in spec
"""

import json
import re
import shutil
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

A = "{http://schemas.openxmlformats.org/drawingml/2006/main}"
P = "{http://schemas.openxmlformats.org/presentationml/2006/main}"
R = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"

# repo paths
SCRIPT_DIR = Path(__file__).resolve().parent
RESOURCES = SCRIPT_DIR.parent.parent / "resources"
SPEC_FILE = SCRIPT_DIR / "blueprint_specs.json"
OUT_ROOT = RESOURCES / "blueprints"

SOURCE_DIRS = {
    "master": RESOURCES / "2026_ProposalsAI_Master_Template"
    / "2026_ProposalsAI_Master_Template-unpacked",
    "proposal-example": RESOURCES / "proposal-example" / "proposal-example-unpacked",
    "agentes": RESOURCES / "agentes-proposal-example" / "agentes-proposal-example-unpacked",
    "sermes": RESOURCES / "sermes-example" / "Sermes_CRO_Business_Process_Summary-unpacked",
    "offerings": RESOURCES / "master-brand-template" / "2026_Offerings_Master_Template-unpacked",
}

# Blueprints are injected into the master deck, so their geometry must be at the
# master's canvas scale. A source slide from a deck with a larger canvas (e.g.
# agentes is 13.33"x7.5" vs the master's 10"x5.62") is scaled down to fit.
TARGET_SOURCE = "master"


def slide_size(source: str) -> tuple[int, int]:
    """(cx, cy) in EMU of a source deck's slides, from its presentation.xml."""
    pres = (SOURCE_DIRS[source] / "ppt" / "presentation.xml").read_text(encoding="utf-8")
    m = re.search(r'<p:sldSz cx="(\d+)" cy="(\d+)"', pres)
    if not m:
        raise SystemExit(f"  ERROR: no sldSz in {source}/presentation.xml")
    return int(m.group(1)), int(m.group(2))


def scale_tree(root: ET.Element, factor: float) -> None:
    """Scale all DrawingML geometry, font sizes and table dims by `factor`.

    Keeps the blueprint visually identical but at the target canvas scale.
    """
    if abs(factor - 1.0) < 1e-6:
        return

    def _scale_attr(el, attr, minimum=1):
        v = el.get(attr)
        if v is not None and v.lstrip("-").isdigit():
            el.set(attr, str(max(minimum, round(int(v) * factor))))

    for el in root.iter():
        tag = el.tag.split("}")[-1]
        if tag in ("off", "ext", "chOff", "chExt"):
            _scale_attr(el, "x")
            _scale_attr(el, "y")
            _scale_attr(el, "cx")
            _scale_attr(el, "cy")
        elif tag in ("rPr", "defRPr", "endParaRPr"):
            _scale_attr(el, "sz", minimum=100)  # font size, 1/100 pt
        elif tag == "gridCol":
            _scale_attr(el, "w")
        elif tag == "tr":
            _scale_attr(el, "h")
        elif tag == "bodyPr":
            for ins in ("lIns", "tIns", "rIns", "bIns"):
                _scale_attr(el, ins, minimum=0)
        elif tag == "spcPts":  # line/paragraph spacing in 1/100 pt
            _scale_attr(el, "val", minimum=100)


EMU_PER_INCH = 914400


def apply_geometry(sp_tree: ET.Element, geometry: dict) -> int:
    """Override shape geometry from a spec `geometry` map.

    Keys are cNvPr ids (as strings); values carry any of x/y/w/h in INCHES.
    Lets a spec re-flow a source slide's layout (e.g. widen value boxes to full
    width and spread rows vertically) without editing the source deck. Applied
    on the master canvas, before any canvas scaling.
    """
    id2el = build_full_id_map(sp_tree)
    n = 0
    for sid, box in geometry.items():
        el = id2el.get(int(sid))
        if el is None:
            raise SystemExit(f"  ERROR: geometry id {sid} not found")
        xfrm = el.find(f".//{A}xfrm")
        if xfrm is None:
            raise SystemExit(f"  ERROR: geometry id {sid} has no xfrm")
        off = xfrm.find(f"{A}off")
        ext = xfrm.find(f"{A}ext")
        if "x" in box:
            off.set("x", str(round(box["x"] * EMU_PER_INCH)))
        if "y" in box:
            off.set("y", str(round(box["y"] * EMU_PER_INCH)))
        if "w" in box:
            ext.set("cx", str(round(box["w"] * EMU_PER_INCH)))
        if "h" in box:
            ext.set("cy", str(round(box["h"] * EMU_PER_INCH)))
        n += 1
    return n


def _theme_colors(source: str) -> dict:
    """Map theme color slot -> hex from a source deck's theme1.xml clrScheme.

    Returns keys for both the raw slots (dk1, lt1, accent1…) and the slide-facing
    aliases resolved through the master's clrMap (tx1→dk1, bg1→lt1, etc.).
    """
    raw = (SOURCE_DIRS[source] / "ppt" / "theme" / "theme1.xml").read_text(encoding="utf-8")
    root = ET.fromstring(raw)
    scheme = root.find(f"{A}themeElements/{A}clrScheme")
    slot = {}
    for c in scheme:
        tag = c.tag.split("}")[-1]
        srgb = c.find(f"{A}srgbClr")
        sysc = c.find(f"{A}sysClr")
        if srgb is not None:
            slot[tag] = srgb.get("val")
        elif sysc is not None and sysc.get("lastClr"):
            slot[tag] = sysc.get("lastClr")
    # slide-facing aliases (standard identity clrMap: tx1↔dk1, bg1↔lt1, …)
    alias = {"tx1": "dk1", "tx2": "dk2", "bg1": "lt1", "bg2": "lt2"}
    out = dict(slot)
    for a, s in alias.items():
        if s in slot:
            out[a] = slot[s]
    return out


def flatten_scheme_colors(root: ET.Element, source: str) -> int:
    """Resolve <a:schemeClr val="X"> to explicit <a:srgbClr val="HEX"> via the
    source deck's theme, so an injected blueprint renders identically regardless
    of the destination deck's theme. Children (lumMod/lumOff/alpha) are kept.
    Returns the number of substitutions made.
    """
    colors = _theme_colors(source)
    n = 0
    for el in root.iter(f"{A}schemeClr"):
        v = el.get("val")
        hexv = colors.get(v)
        if hexv:
            el.tag = f"{A}srgbClr"
            el.set("val", hexv)
            n += 1
    return n


# Palette-alignment recolor applied automatically to the offerings source: its
# theme blues/text are 1-2 digits off the canonical master palette. Per-spec
# `recolor` (decorative accents → blue/navy) is merged on top and wins.
OFFERINGS_BASE_RECOLOR = {
    "3C5AFD": "3D5AFE", "526DFD": "536DFE", "8B9DFE": "8C9EFF",
    "141617": "151618", "0D0D0F": "0D0E0F", "FEFFFF": "FFFFFF",
}


def recolor_tree(root: ET.Element, mapping: dict) -> int:
    """Remap <a:srgbClr val="..."> colors per `mapping` (case-insensitive).

    Used to normalize a non-master source's off-palette colors to the master
    palette (the *golden rule*: the source contributes layout, the master the
    visual identity). Returns the number of substitutions made.
    """
    if not mapping:
        return 0
    norm = {k.upper(): v.upper() for k, v in mapping.items()}
    n = 0
    for el in root.iter(f"{A}srgbClr"):
        v = el.get("val")
        if v and v.upper() in norm:
            el.set("val", norm[v.upper()])
            n += 1
    return n


def register_namespaces(raw_xml: str) -> None:
    """Register every xmlns:prefix found in the raw XML to avoid ns0: output."""
    for prefix, uri in re.findall(r'xmlns:(\w+)="([^"]+)"', raw_xml):
        ET.register_namespace(prefix, uri)
    # defaults in case they were only declared on the root
    ET.register_namespace("a", "http://schemas.openxmlformats.org/drawingml/2006/main")
    ET.register_namespace("r", "http://schemas.openxmlformats.org/officeDocument/2006/relationships")
    ET.register_namespace("p", "http://schemas.openxmlformats.org/presentationml/2006/main")


def collapse_paragraph_to_marker(p: ET.Element, marker: str) -> None:
    """Collapse all runs in a paragraph into a single run carrying `marker`.

    Preserves the first run's <a:rPr>. Drops extra runs and any <a:fld>.
    """
    runs = p.findall(f"{A}r")
    flds = p.findall(f"{A}fld")
    if not runs:
        return
    first = runs[0]
    t = first.find(f"{A}t")
    if t is None:
        t = ET.SubElement(first, f"{A}t")
    t.text = marker
    # strip xml:space (marker carries no significant whitespace)
    t.attrib.pop("{http://www.w3.org/XML/1998/namespace}space", None)
    for r in runs[1:]:
        p.remove(r)
    for fld in flds:
        p.remove(fld)


def build_id_map(sp_tree: ET.Element) -> dict:
    """Map cNvPr id -> top-level <p:sp> element (excludes group children)."""
    id2sp = {}
    for sp in sp_tree.findall(f"{P}sp"):
        cnv = sp.find(f"{P}nvSpPr/{P}cNvPr")
        if cnv is not None and cnv.get("id"):
            id2sp[int(cnv.get("id"))] = sp
    return id2sp


def build_full_id_map(sp_tree: ET.Element) -> dict:
    """Map cNvPr id -> top-level shape of ANY kind (sp, pic, grpSp,
    graphicFrame, cxnSp). Used by `drop`, so a spec can remove decorations
    that aren't <p:sp> (e.g. an icon <p:pic>)."""
    id2el = {}
    for tag, pre in (
        ("sp", "nvSpPr"), ("pic", "nvPicPr"), ("grpSp", "nvGrpSpPr"),
        ("graphicFrame", "nvGraphicFramePr"), ("cxnSp", "nvCxnSpPr"),
    ):
        for el in sp_tree.findall(f"{P}{tag}"):
            cnv = el.find(f"{P}{pre}/{P}cNvPr")
            if cnv is not None and cnv.get("id"):
                id2el[int(cnv.get("id"))] = el
    return id2el


def apply_spec(root: ET.Element, spec: dict) -> list:
    """Transform shapes per spec; return ordered slot descriptors."""
    sp_tree = root.find(f"{P}cSld/{P}spTree")
    id2sp = build_id_map(sp_tree)
    slots = []

    for entry in spec["shapes"]:
        sid = entry["id"]
        marker = f"___SLOT_{entry['slot']}___"
        sp = id2sp.get(sid)
        if sp is None:
            raise SystemExit(f"  ERROR: shape id {sid} not found in {spec['slide']}")
        tx = sp.find(f"{P}txBody")
        if tx is None:
            raise SystemExit(f"  ERROR: shape id {sid} has no txBody")
        paras = tx.findall(f"{A}p")
        if not paras:
            raise SystemExit(f"  ERROR: shape id {sid} has no paragraph")

        if entry["kind"] == "list":
            # keep first paragraph as per-item template, drop the rest
            for extra in paras[1:]:
                tx.remove(extra)
            collapse_paragraph_to_marker(paras[0], marker)
        else:
            collapse_paragraph_to_marker(paras[0], marker)
            # drop trailing paragraphs (multi-line scalars collapse to one line)
            for extra in paras[1:]:
                tx.remove(extra)

        slot = {"name": entry["slot"], "kind": entry["kind"]}
        if "group" in entry:
            slot["group"] = entry["group"]
        slots.append(slot)

    return slots


def process_table(root: ET.Element, table_spec: dict) -> dict:
    """Prepare the first <a:tbl> as a row-template table.

    Keeps `header_rows` verbatim, clears the first data row (the per-row
    template), and removes the remaining data rows. Returns table metadata.
    """
    tbl = next(iter(root.iter(f"{A}tbl")), None)
    if tbl is None:
        raise SystemExit(f"  ERROR: spec has 'table' but no <a:tbl> in slide")
    header_rows = table_spec.get("header_rows", 1)
    rows = tbl.findall(f"{A}tr")
    if len(rows) <= header_rows:
        raise SystemExit("  ERROR: table has no data row to use as template")

    template = rows[header_rows]
    cells = template.findall(f"{A}tc")
    # clear the template row's cell text (filled per data row by fill_blueprint)
    for tc in cells:
        for t in tc.findall(f"{A}txBody/{A}p/{A}r/{A}t"):
            t.text = ""
    # drop extra data rows, keep header(s) + single template row
    for extra in rows[header_rows + 1:]:
        tbl.remove(extra)

    return {"name": table_spec["slot"], "header_rows": header_rows, "cols": len(cells)}


def copy_media(src_dir: Path, rels_text: str, out_dir: Path) -> list:
    """Copy media referenced by the slide rels into out_dir/media. Returns names."""
    names = []
    for target in re.findall(r'Target="\.\./media/([^"]+)"', rels_text):
        src = src_dir / "ppt" / "media" / target
        if src.exists():
            (out_dir / "media").mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, out_dir / "media" / target)
            names.append(target)
    return names


def build_layout(layout: str, spec: dict) -> None:
    src_dir = SOURCE_DIRS[spec["source"]]
    slide_file = spec["slide"]
    slide_path = src_dir / "ppt" / "slides" / slide_file
    rels_path = src_dir / "ppt" / "slides" / "_rels" / f"{slide_file}.rels"

    if not slide_path.exists():
        raise SystemExit(f"  ERROR: source slide not found: {slide_path}")

    raw = slide_path.read_text(encoding="utf-8")
    register_namespaces(raw)
    root = ET.fromstring(raw)

    # flatten theme-relative colors to explicit hex so the blueprint is
    # theme-independent once injected into the master deck (whose theme differs).
    if spec["source"] != TARGET_SOURCE:
        n_flat = flatten_scheme_colors(root, spec["source"])
        if n_flat:
            print(f"  flattened {layout}: {n_flat} schemeClr -> srgbClr ({spec['source']} theme)")

    # normalize off-palette source colors to the master palette before slotting.
    # For offerings, merge the base palette-alignment map (spec recolor wins).
    recolor = dict(spec.get("recolor", {}))
    if spec["source"] == "offerings":
        recolor = {**OFFERINGS_BASE_RECOLOR, **recolor}
    n_recolor = recolor_tree(root, recolor)
    if n_recolor:
        print(f"  recolored {layout}: {n_recolor} color(s) -> master palette")

    slots = apply_spec(root, spec)

    # drop top-level shapes entirely (e.g. a baked-in literal page number; the
    # live slidenum field lives in the footer group, so the literal is a dup).
    drop_ids = spec.get("drop", [])
    if drop_ids:
        sp_tree = root.find(f"{P}cSld/{P}spTree")
        id2el = build_full_id_map(sp_tree)
        for sid in drop_ids:
            el = id2el.get(sid)
            if el is None:
                raise SystemExit(f"  ERROR: drop id {sid} not found in {spec['slide']}")
            sp_tree.remove(el)

    # re-flow shape geometry (positions/sizes in inches) if the spec asks for it
    geometry = spec.get("geometry")
    if geometry:
        sp_tree = root.find(f"{P}cSld/{P}spTree")
        n_geo = apply_geometry(sp_tree, geometry)
        print(f"  re-flowed {layout}: {n_geo} shape(s) repositioned")

    tables = []
    if "table" in spec:
        tables.append(process_table(root, spec["table"]))

    # scale geometry/fonts to the master canvas if the source deck is larger
    src_cx, _ = slide_size(spec["source"])
    tgt_cx, _ = slide_size(TARGET_SOURCE)
    factor = tgt_cx / src_cx
    if abs(factor - 1.0) > 1e-6:
        scale_tree(root, factor)
        print(f"  scaled {layout} by {factor:.4f} (source {spec['source']} -> master canvas)")

    out_dir = OUT_ROOT / layout
    out_dir.mkdir(parents=True, exist_ok=True)

    # write blueprint.xml
    tree = ET.ElementTree(root)
    tree.write(out_dir / "blueprint.xml", xml_declaration=True, encoding="UTF-8")

    # copy rels + media. Drop notesSlide rels (notes carry the source slide's
    # **Full replacement** markers and must not leak into the output deck).
    media = []
    if rels_path.exists():
        rels_text = rels_path.read_text(encoding="utf-8")
        rels_text = re.sub(
            r"\s*<Relationship[^>]*notesSlide[^>]*/>", "", rels_text
        )
        (out_dir / "blueprint.xml.rels").write_text(rels_text, encoding="utf-8")
        media = copy_media(src_dir, rels_text, out_dir)

    # build groups with control_slot (first scalar slot in the group)
    groups = {}
    for gname, ids in spec.get("groups", {}).items():
        control = next(
            (s["name"] for s in slots if s.get("group") == gname and s["kind"] == "scalar"),
            None,
        )
        groups[gname] = {"ids": ids, "control_slot": control}

    slots_meta = {
        "layout": layout,
        "source": spec["source"],
        "slide": slide_file,
        "media": media,
        "slots": slots,
        "groups": groups,
        "tables": tables,
    }
    (out_dir / "slots.json").write_text(
        json.dumps(slots_meta, indent=2, ensure_ascii=False), encoding="utf-8"
    )

    # warn about leftover editable text in top-level shapes (un-slotted = spec gap)
    sp_tree = root.find(f"{P}cSld/{P}spTree")
    leftover = []
    for sp in sp_tree.findall(f"{P}sp"):
        for t in sp.findall(f"{P}txBody/{A}p/{A}r/{A}t"):
            if t.text and "___SLOT_" not in t.text and t.text.strip():
                leftover.append(t.text.strip()[:40])
    warn = f"  !! leftover text (un-slotted): {leftover}" if leftover else ""

    tinfo = f", {len(tables)} table" if tables else ""
    print(f"  OK {layout}: {len(slots)} slots, {len(groups)} groups, {len(media)} media{tinfo} -> {out_dir}")
    if warn:
        print(warn)

    # graft the master chrome (blue left bar + footer logo/page number) onto
    # blueprints sourced from another deck, so every layout matches the 2026
    # master chrome regardless of its source slide's own chrome.
    if spec["source"] != TARGET_SOURCE:
        import normalize_chrome

        normalize_chrome.normalize(layout, header_drop=spec.get("header_normalize"))


def main():
    specs = json.loads(SPEC_FILE.read_text(encoding="utf-8"))
    specs = {k: v for k, v in specs.items() if not k.startswith("_")}

    wanted = sys.argv[1:] or list(specs.keys())
    for layout in wanted:
        if layout not in specs:
            print(f"  SKIP {layout}: no spec")
            continue
        if specs[layout].get("source") == "manual":
            print(f"  SKIP {layout}: source=manual (hand-authored, not built from a source slide)")
            continue
        build_layout(layout, specs[layout])


if __name__ == "__main__":
    main()
