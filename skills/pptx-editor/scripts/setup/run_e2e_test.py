#!/usr/bin/env python3
"""Deterministic, self-contained E2E regression test for the blueprint pipeline.

Runs the Python half of the proposal pipeline (plan -> compose -> pack -> qa)
and asserts a clean QA. Use it after changing scripts, blueprints, or the
manifest to catch regressions.

It is SELF-CONTAINED (like run_e2e_test_free.py / run_e2e_test_shell.py): it
writes a minimal reference digest inline, runs the real plan.py to produce the
slide plan, then AUTO-AUTHORS content for whatever slides the plan emits by
reading each blueprint's slots.json (every scalar/list slot, group, and table
gets a deterministic value) plus each placeholder slide's [bracket] tokens. So
the test follows the manifest automatically — no hand-maintained fixtures that
drift when the manifest or a blueprint changes.

It does NOT exercise the two LLM steps (digest, content) — the digest is the
inline reference and the content is synthesised mechanically; the point is to
prove plan/compose/qa stay green, not to judge wording.

Usage:
    python scripts/setup/run_e2e_test.py
Exit codes: 0 = pass, 1 = fail.
"""

import json
import subprocess
import sys
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parent.parent          # .../pptx-editor/scripts
SKILL = SCRIPTS.parent                                     # .../pptx-editor
REPO = SCRIPTS.parents[4]                                  # repo root
TEMPLATE_DIR = SKILL / "resources" / "2026_ProposalsAI_Master_Template"
MANIFEST = TEMPLATE_DIR / "2026_ProposalsAI_Master_Template-manifest.json"
BLUEPRINTS = SKILL / "resources" / "blueprints"
OUT = REPO / "working" / "e2e-test"

# Minimal reference digest. The five decision fields (collab, delivery, the
# flags) pin which fixed slides ship, so the plan is deterministic.
DIGEST = {
    "client": "ACME Corp",
    "project": "Smart Management Portal",
    "language": "en",
    "collab": "fixed_price",
    "delivery": "plain_team",
    "flags": {"has_discovery": False, "phased": False,
              "is_brownfield": False, "tech_lead_global": True},
    "objectives": ["Reduce onboarding by 40%", "Integrate with SAP"],
    "epics": [{"name": "Authentication", "features": ["SSO", "2FA", "RBAC"]}],
    "risks": [{"title": "SAP dependency", "impact": "high", "mitigation": "week-1 workshop"}],
    "prerequisites": ["Environment access", "Dedicated Product Owner"],
    "technologies": ["Azure", "React", "Node.js"],
    "phases": [{"name": "Build", "duration": "8 weeks"}],
    "team": [{"role": "Senior Dev", "count": 2}],
    "budget_total": 84000,
}


def run(args, **kw):
    """Run one of our own scripts via sys.executable (no shell, no external binaries)."""
    print("  $", " ".join(str(a) for a in args))
    return subprocess.run([sys.executable, *map(str, args)], shell=False, **kw)


def _author_generated(entry: dict) -> dict:
    """Synthesise a clean content block for a generated slide from its
    blueprint's slots.json — fill every scalar/list slot, group and table so no
    ___SLOT___ marker survives."""
    bp = entry["blueprint"]
    slots = json.loads((BLUEPRINTS / bp / "slots.json").read_text(encoding="utf-8"))
    label = entry.get("section_label") or entry.get("group_label") or "Section"
    block: dict = {}
    for s in slots["slots"]:
        name, kind = s["name"], s["kind"]
        if name == "SECTION":
            block[name] = label.upper()
        elif name == "PHASE_LABEL":
            block[name] = "PHASE 1"
        elif name == "TITLE":
            block[name] = f"{label}: key points"
        elif kind == "list":
            block[name] = [f"{name} point A", f"{name} point B"]
        else:
            block[name] = f"{name} text"
    for t in slots.get("tables", []):
        cols = t["cols"]
        block[t["name"]] = {
            "header": [""] + [f"Stage {i}" for i in range(1, cols)],
            "rows": [["Tech Lead"] + ["1"] * (cols - 1),
                     ["Senior Dev"] + ["2"] * (cols - 1)],
            "footer": ["Total"] + ["10"] * (cols - 1),
        }
    return block


def _author_content(plan: dict) -> dict:
    content: dict = {"placeholders": {}, "generated": {}}
    for s in plan["slides"]:
        n, t = str(s["n"]), s.get("type")
        if t == "generated":
            content["generated"][n] = _author_generated(s)
        elif t == "placeholder":
            content["placeholders"][n] = {
                tok: f"{tok.strip('[]')} value" for tok in s.get("placeholders", [])
            }
    return content


def main() -> int:
    if not MANIFEST.exists():
        print(f"FAIL — missing manifest: {MANIFEST}")
        return 1

    OUT.mkdir(parents=True, exist_ok=True)
    digest = OUT / "context-digest.json"
    plan = OUT / "slide-plan.json"
    content = OUT / "content-blocks.json"
    digest.write_text(json.dumps(DIGEST, ensure_ascii=False, indent=2), encoding="utf-8")

    print("[1/4] plan.py")
    r = run([SCRIPTS / "plan.py", MANIFEST, digest, plan])
    if r.returncode != 0:
        print("FAIL — plan.py")
        return 1

    print("[2/4] auto-author content from the plan + each blueprint's slots.json")
    plan_data = json.loads(plan.read_text(encoding="utf-8"))
    missing_bp = [s["blueprint"] for s in plan_data["slides"]
                  if s.get("type") == "generated"
                  and not (BLUEPRINTS / s["blueprint"]).is_dir()]
    if missing_bp:
        print(f"FAIL — plan requires unbuilt blueprint(s): {sorted(set(missing_bp))}")
        return 1
    content.write_text(json.dumps(_author_content(plan_data), ensure_ascii=False, indent=2),
                       encoding="utf-8")
    gen = sum(1 for s in plan_data["slides"] if s.get("type") == "generated")
    print(f"  ok — authored {gen} generated + "
          f"{sum(1 for s in plan_data['slides'] if s.get('type') == 'placeholder')} "
          f"placeholder slides")

    print("[3/4] compose.py --pack")
    r = run([SCRIPTS / "compose.py", plan, content, TEMPLATE_DIR, OUT, "--pack"])
    if r.returncode != 0:
        print("FAIL — compose.py")
        return 1

    print("[4/4] qa.py + structure")
    pptx = OUT / "presentation.pptx"
    r = run([SCRIPTS / "qa.py", pptx])
    if r.returncode != 0:
        print("FAIL — qa.py reported issues")
        return 1
    from pptx import Presentation
    n_slides = len(Presentation(str(pptx)).slides)
    expected = len(plan_data["slides"])
    if n_slides != expected:
        print(f"FAIL — expected {expected} slides, deck has {n_slides}")
        return 1
    print(f"  ok — {n_slides} slides ({gen} generated via blueprints), QA clean")

    print(f"\nPASS — E2E clean. Output: {pptx}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
