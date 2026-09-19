#!/usr/bin/env python3
"""Shared blueprint-alternates table + deterministic helpers (no LLM).

Single source of truth for *which blueprints may serve which content*, used by
both planners:

  - proposal mode  (`plan.py`)        -> keyed by section slug   (BY_SECTION)
  - free mode      (`plan-free`) -> keyed by topic `kind` (BY_KIND)

Each entry is an ordered list `[primary, ...alternates]`. The *primary* (index 0)
mirrors the manifest `layout_hint` for proposal sections, so behaviour is
unchanged unless an alternate is actively chosen. The alternates are the
"X or Y" choices documented in `composition.md` (sections 1 and 4); keep the two
in sync — this module is the executable mirror of that guide.

Responsibilities here are purely deterministic (zero tokens):
  - `built_only(options)`   -> drop any blueprint without a built directory
                               (e.g. the deferred gantt-timeline / about-us-stats)
  - `dedup_consecutive(seq)`-> enforce the hard rule "no two consecutive slides
                               may use the same layout" by swapping a swappable
                               slide to its first non-conflicting alternate.

Fit-by-content (choosing *which* alternate best matches the drafted blocks) is
done later by the LLM in `outline`, picking from `blueprint_options`.
"""

from pathlib import Path

# plugin/skills/pptx-editor/resources/blueprints  (parents[1] == pptx-editor, mirroring compose.py)
BLUEPRINTS_DIR = Path(__file__).resolve().parents[1] / "resources" / "blueprints"
SHELLS_DIR = Path(__file__).resolve().parents[1] / "resources" / "shells"
COMPONENTS_DIR = Path(__file__).resolve().parents[1] / "resources" / "components"

# --- Proposal sections -> [primary, ...alternates] -------------------------
# primary (index 0) == manifest layout_hint for that generated slide.
BY_SECTION = {
    "our-solution":                  ["icon-list-split", "three-col-cards", "benefits-icons"],
    "indicative-scope":              ["three-col-cards", "capability-grid", "summary-cards"],
    "out-of-scope":                  ["two-col-text-callout", "numbered-list-callout", "icon-list-split"],
    "risks":                         ["icon-list-split", "numbered-list-callout", "pros-cons-split", "risk-table"],
    "prerequisites":                 ["numbered-list-callout", "icon-list-split", "three-col-cards"],
    "current-state":                 ["two-col-contrast", "before-after", "paradigm-shift"],
    "technology-solution":           ["icon-list-split", "capability-grid", "layered-architecture", "arch-diagram-tech"],
    "phases":                        ["phase-dark-left", "phase-detail-left-right", "numbered-pipeline", "milestone-timeline"],
    # table blueprint: matrix data shape, no drop-in alternate
    "capacity-plan":                 ["capacity-table"],
    "prerequisites-and-dependencies": ["icon-list-split", "numbered-list-callout", "data-table", "three-col-cards"],
}

# --- Free-mode topic kind -> [primary, ...alternates] ----------------------
# migrated from the table in plan-free.md (Step 2).
BY_KIND = {
    "parallel":     ["three-col-cards", "benefits-icons", "summary-cards"],
    "process":      ["phase-detail-left-right", "phase-dark-left", "numbered-pipeline"],
    "contrast":     ["two-col-contrast", "before-after", "pros-cons-split"],
    "list":         ["icon-list-split", "numbered-list-callout"],
    "architecture": ["arch-diagram-tech", "layered-architecture"],
    "tiered":       ["comms-tiered"],
    "grid":         ["services-grid", "capability-grid"],
    "table":        ["data-table", "capacity-table"],
    "generic":      ["two-col-text-callout", "numbered-list-callout", "summary-cards"],
}

# --- Free-mode "composite" topics -> a shell (region composition) -----------
# A `composite` topic doesn't map to a single fixed blueprint: it maps to a
# *shell* whose regions are filled by independent *components* (see
# resources/shells + resources/components; compose_free._write_shell mounts them).
# This is the expressivity escape hatch for slides the fixed catalogue can't
# express (e.g. metrics + a bullet card side by side).
SHELL_BY_KIND = {
    "composite": "halves",
}


def is_built(name, blueprints_dir=BLUEPRINTS_DIR):
    """True if `name` has a built blueprint directory."""
    return bool(name) and (Path(blueprints_dir) / name).is_dir()


def built_only(options, blueprints_dir=BLUEPRINTS_DIR):
    """Filter `options` to blueprints that are actually built, order preserved,
    de-duplicated. Deferred/unbuilt layouts are silently dropped."""
    seen, out = set(), []
    for name in options or []:
        if name in seen:
            continue
        seen.add(name)
        if is_built(name, blueprints_dir):
            out.append(name)
    return out


def options_for_section(section, blueprints_dir=BLUEPRINTS_DIR):
    """Built `[primary, ...alternates]` for a proposal section (empty if unknown)."""
    return built_only(BY_SECTION.get(section, []), blueprints_dir)


def options_for_kind(kind, blueprints_dir=BLUEPRINTS_DIR):
    """Built `[primary, ...alternates]` for a free-mode topic kind."""
    return built_only(BY_KIND.get(kind, BY_KIND["generic"]), blueprints_dir)


def is_shell_built(name, shells_dir=SHELLS_DIR):
    """True if `name` has a built shell directory (with a slots.json)."""
    return bool(name) and (Path(shells_dir) / name / "slots.json").is_file()


def shell_for_kind(kind, shells_dir=SHELLS_DIR):
    """Built shell name for a free-mode topic kind, or None if not a shell kind
    (or the shell isn't built yet — caller should fall back to a blueprint)."""
    name = SHELL_BY_KIND.get(kind)
    return name if is_shell_built(name, shells_dir) else None


def built_shells(shells_dir=SHELLS_DIR):
    """All built shell names (each dir with a slots.json), sorted. Empty if none.

    Used by plan.py to offer `shell_options` on every generated proposal slide —
    outline may author a slide as a shell when its content has two
    heterogeneous facets (mirror of `built_only` for blueprints)."""
    if not Path(shells_dir).is_dir():
        return []
    return sorted(d.name for d in Path(shells_dir).iterdir()
                  if (d / "slots.json").is_file())


def dedup_consecutive(seq):
    """Enforce 'no two consecutive slides share a layout' deterministically.

    `seq` is the *full ordered* slide sequence, one dict per slide with:
        {"layout": <current blueprint or "">, "options": [<built alternates>]}
    Fixed slides (copy-as-is / placeholder / table) carry an empty `options`
    list and are never changed — they still count for adjacency.

    For each swappable slide whose layout equals the previous slide's, swap to
    the first alternate that differs from both neighbours (falling back to one
    that merely differs from the previous). Mutates `seq` in place and returns it.
    """
    for i in range(1, len(seq)):
        cur = seq[i]
        opts = cur.get("options") or []
        if not opts:
            continue
        prev = seq[i - 1].get("layout") or ""
        nxt = seq[i + 1].get("layout") if i + 1 < len(seq) else None
        if not prev or cur.get("layout") != prev:
            continue
        # prefer an alternate clear of both neighbours
        choice = next((o for o in opts if o != prev and o != nxt), None)
        if choice is None:
            choice = next((o for o in opts if o != prev), None)
        if choice is not None:
            cur["layout"] = choice
    return seq
