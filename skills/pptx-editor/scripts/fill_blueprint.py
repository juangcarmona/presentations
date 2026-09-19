#!/usr/bin/env python3
"""Fill a blueprint slide with content (deterministic, no LLM).

A blueprint is a brand-correct slide XML with ___SLOT_NAME___ markers, produced
one-time by setup/build_blueprints.py. This module fills it:

  - scalar slot -> set the marker run's text
  - list slot   -> clone the template paragraph (keeps bullet pPr/rPr) per item
  - empty group -> prune all its shapes by id (a card with no content disappears)

Returns the filled slide XML as a string. Reused by compose.py.
"""

import json
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

A = "{http://schemas.openxmlformats.org/drawingml/2006/main}"
P = "{http://schemas.openxmlformats.org/presentationml/2006/main}"

# content keys that are directives, not slot values, and must be ignored when
# checking capacity (see capacity_warnings / compose split support).
_RESERVED_KEYS = {"__blueprint__", "__continued__", "__shell__", "__component__"}


def capacity_warnings(meta: dict, content: dict) -> list[str]:
    """Return warnings for content that won't fit the blueprint's slots.

    The dangerous case is a fixed-count group layout (e.g. icon-list-split has 4
    ROW groups): content keys for non-existent slots (ROW5_LABEL…) are silently
    dropped by fill_blueprint. Surfacing them prevents losing information without
    splitting the slide. List slots are not flagged here (they clone per item and
    only risk *visual* overflow, caught at render/QA time).
    """
    slot_names = {s["name"] for s in meta.get("slots", [])}
    table_names = {t["name"] for t in meta.get("tables", [])}
    known = slot_names | table_names | _RESERVED_KEYS
    orphans = [k for k in content if k not in known]
    warnings = []
    if orphans:
        warnings.append(
            f"blueprint '{meta.get('layout')}' has no slot for {sorted(orphans)} "
            f"— content dropped. Split the slide or pick a higher-capacity layout."
        )
    return warnings


def _register_namespaces(raw_xml: str) -> None:
    for prefix, uri in re.findall(r'xmlns:(\w+)="([^"]+)"', raw_xml):
        ET.register_namespace(prefix, uri)
    ET.register_namespace("a", "http://schemas.openxmlformats.org/drawingml/2006/main")
    ET.register_namespace("r", "http://schemas.openxmlformats.org/officeDocument/2006/relationships")
    ET.register_namespace("p", "http://schemas.openxmlformats.org/presentationml/2006/main")


def _marker(name: str) -> str:
    return f"___SLOT_{name}___"


def _find_marker_para(tx: ET.Element, marker: str):
    """Return the <a:p> in txBody whose text contains marker, else None."""
    for p in tx.findall(f"{A}p"):
        for t in p.findall(f"{A}r/{A}t"):
            if t.text and marker in t.text:
                return p
    return None


def _set_para_text(p: ET.Element, value: str) -> None:
    """Set the first run's <a:t> in a paragraph to value (replaces marker)."""
    t = p.find(f"{A}r/{A}t")
    if t is not None:
        t.text = value


def fill_blueprint(blueprint_dir, content: dict) -> str:
    """Fill blueprint at blueprint_dir with content dict {slot_name: value}.

    Scalars expect a string; lists expect a list of strings. Missing/empty
    controlling slots prune their group. Returns filled XML as a string.
    """
    blueprint_dir = Path(blueprint_dir)
    meta = json.loads((blueprint_dir / "slots.json").read_text(encoding="utf-8"))
    for w in capacity_warnings(meta, content):
        print(f"  WARN {w}", file=sys.stderr)
    raw = (blueprint_dir / "blueprint.xml").read_text(encoding="utf-8")
    _register_namespaces(raw)
    root = ET.fromstring(raw)
    sp_tree = root.find(f"{P}cSld/{P}spTree")

    # id -> top-level shape. Covers every shape kind (sp/pic/graphicFrame/
    # cxnSp/grpSp) so group pruning can drop grouped pictures and connectors,
    # not just <p:sp> (e.g. benefits-icons columns carry an icon <p:pic>).
    _NV_PARENTS = (
        f"{P}nvSpPr",
        f"{P}nvPicPr",
        f"{P}nvGraphicFramePr",
        f"{P}nvCxnSpPr",
        f"{P}nvGrpSpPr",
    )
    id2sp = {}
    for child in list(sp_tree):
        cnv = None
        for nv in _NV_PARENTS:
            node = child.find(f"{nv}/{P}cNvPr")
            if node is not None:
                cnv = node
                break
        if cnv is not None and cnv.get("id"):
            id2sp[int(cnv.get("id"))] = child

    # 1) prune empty groups
    pruned_slots = set()
    for gname, info in meta.get("groups", {}).items():
        control = info.get("control_slot")
        val = content.get(control) if control else None
        if not val:
            for sid in info["ids"]:
                sp = id2sp.pop(sid, None)
                if sp is not None:
                    sp_tree.remove(sp)
            for s in meta["slots"]:
                if s.get("group") == gname:
                    pruned_slots.add(s["name"])

    # 2) fill remaining slots
    for slot in meta["slots"]:
        name = slot["name"]
        if name in pruned_slots:
            continue
        marker = _marker(name)
        # locate the shape/paragraph holding this marker
        target_p, target_tx = None, None
        for sp in sp_tree.findall(f"{P}sp"):
            tx = sp.find(f"{P}txBody")
            if tx is None:
                continue
            p = _find_marker_para(tx, marker)
            if p is not None:
                target_p, target_tx = p, tx
                break
        if target_p is None:
            continue

        value = content.get(name)

        if slot["kind"] == "list":
            items = value if isinstance(value, list) else ([value] if value else [])
            idx = list(target_tx).index(target_p)
            target_tx.remove(target_p)
            for i, item in enumerate(items):
                clone = _clone(target_p)
                _set_para_text(clone, str(item))
                target_tx.insert(idx + i, clone)
        else:
            _set_para_text(target_p, str(value) if value else "")

    # 3) fill tables (row-template cloned per data row)
    for table in meta.get("tables", []):
        _fill_table(root, table, content.get(table["name"]))

    return ET.tostring(root, encoding="unicode")


def _set_cell_text(tc: ET.Element, value: str) -> None:
    """Set the first run's <a:t> in a table cell; create a run if missing."""
    p = tc.find(f"{A}txBody/{A}p")
    if p is None:
        return
    t = p.find(f"{A}r/{A}t")
    if t is None:
        # build a minimal run, reusing the paragraph's endParaRPr as the run's
        # rPr so an empty template cell fills at the SAME font as populated
        # cells (otherwise the new run has no rPr and inherits the table
        # style default size — the cause of mixed font sizes in cloned rows).
        r = ET.Element(f"{A}r")
        epr = p.find(f"{A}endParaRPr")
        if epr is not None:
            rpr = _clone(epr)
            rpr.tag = f"{A}rPr"
            r.append(rpr)
        t = ET.SubElement(r, f"{A}t")
        # paragraph child order is pPr?, r*, endParaRPr? — insert before endParaRPr
        if epr is not None:
            p.insert(list(p).index(epr), r)
        else:
            p.append(r)
    t.text = value


def _fill_row_cells(row: ET.Element, values) -> None:
    """Overwrite a row's cell texts in place (keeps the row's styling)."""
    for c, tc in enumerate(row.findall(f"{A}tc")):
        if c < len(values):
            _set_cell_text(tc, str(values[c]))


def _fill_table(root: ET.Element, table: dict, data) -> None:
    """Fill the first <a:tbl>.

    `data` may be either:
      - a list of rows  -> cloned from the body template row (legacy, pricing-table)
      - a dict {header?, rows, footer?} -> also overwrite the header row's cells
        and a trailing footer row (kept verbatim styling). Use `header_rows` and
        `footer_rows` in the table spec to mark which rows are fixed chrome.
    """
    tbl = next(iter(root.iter(f"{A}tbl")), None)
    if tbl is None:
        return
    header_rows = table.get("header_rows", 1)
    footer_rows = table.get("footer_rows", 0)
    rows = tbl.findall(f"{A}tr")
    if len(rows) <= header_rows + footer_rows:
        return

    if isinstance(data, dict):
        header_vals = data.get("header")
        body = data.get("rows", [])
        footer_vals = data.get("footer")
    else:
        header_vals, body, footer_vals = None, (data or []), None

    # header / footer rows: overwrite cells in place so their styling survives
    if header_vals and header_rows:
        _fill_row_cells(rows[header_rows - 1], header_vals)
    if footer_vals and footer_rows:
        _fill_row_cells(rows[-1], footer_vals)

    # body: clone the first non-header row per data row (footer rows stay last)
    template = rows[header_rows]
    idx = list(tbl).index(template)
    tbl.remove(template)
    for i, row in enumerate(body if isinstance(body, list) else []):
        clone = _clone(template)
        _fill_row_cells(clone, [row[c] if c < len(row) else "" for c in range(len(clone.findall(f"{A}tc")))])
        tbl.insert(idx + i, clone)


def _clone(elem: ET.Element) -> ET.Element:
    """Deep-copy an Element (ET has no public clone)."""
    import copy

    return copy.deepcopy(elem)


if __name__ == "__main__":
    import sys

    bp, content_json = sys.argv[1], sys.argv[2]
    content = json.loads(Path(content_json).read_text(encoding="utf-8"))
    out = fill_blueprint(bp, content)
    if len(sys.argv) > 3:
        Path(sys.argv[3]).write_text(out, encoding="utf-8")
    else:
        sys.stdout.buffer.write(out.encode("utf-8"))
