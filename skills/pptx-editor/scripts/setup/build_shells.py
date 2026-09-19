#!/usr/bin/env python3
"""Author shells on the master design (source = manual).

A shell is a brand-correct slide with chrome (blue bar, accent tick, footer
logo + slidenum) + SECTION/TITLE slots, and one or more empty *regions* where
`mount.py` places filled components at compose time. The region geometry is
fixed and pre-validated; only the components that mount into it vary.

Emits resources/shells/{name}/{blueprint.xml, blueprint.xml.rels, media/, slots.json}.
The slots.json carries a `regions` array (bbox in inches + an `accepts` allowlist).

Usage:
    python build_shells.py [name ...]   # omit = all
"""

import sys

from _pieces import SHELLS, PieceBuilder, load_donor

ACCEPTS = ["card", "stat-stack", "mini-table"]


def build_halves(tpl):
    """Two side-by-side regions below the title band (nothing below Y=5.1")."""
    b = PieceBuilder(tpl)
    b.add_chrome()  # leftbar, accent, SECTION, TITLE, footer
    regions = [
        {"name": "left",  "x": 0.5, "y": 1.75, "w": 4.3, "h": 3.25, "accepts": ACCEPTS},
        {"name": "right", "x": 5.2, "y": 1.75, "w": 4.3, "h": 3.25, "accepts": ACCEPTS},
    ]
    return b, {"shell": "halves", "regions": regions}


BUILDERS = {
    "halves": build_halves,
}


def main():
    tpl = load_donor()
    wanted = sys.argv[1:] or list(BUILDERS)
    for name in wanted:
        if name not in BUILDERS:
            print(f"  SKIP {name}: no builder")
            continue
        b, extra = BUILDERS[name](tpl)
        meta = b.write(SHELLS / name, extra, copy_chrome_assets=True)
        print(f"  OK shell {name}: {len(meta['slots'])} slots, "
              f"{len(meta['regions'])} regions -> {SHELLS / name}")


if __name__ == "__main__":
    main()
