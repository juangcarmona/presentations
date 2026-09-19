#!/usr/bin/env python3
"""Build slide-plan.json from the template manifest + context digest (no LLM).

Determines the exact ordered list of slides to produce, reusing the proven
inclusion logic in compose_pptx.resolve_included_slides. For each generated
slide it attaches its blueprint (= layout_hint) and the digest context_keys the
content step should read.

Usage:
    python plan.py <manifest.json> <context-digest.json> <out slide-plan.json>

The digest supplies collab + flags:
    { "collab": "fixed_price",
      "flags": { "has_discovery": true, "phased": true, "is_brownfield": false } }
"""

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from compose_pptx import load_manifest, resolve_included_slides, resolve_team_slides
from layout_alternates import options_for_section, dedup_consecutive, built_shells

# section -> digest fields the content step needs for that generated slide
CONTEXT_KEYS = {
    "our-solution": ["objectives", "epics"],
    "indicative-scope": ["epics", "phases"],
    "out-of-scope": ["epics", "objectives"],
    "risks": ["risks"],
    "prerequisites": ["risks", "prerequisites"],
    "current-state": ["objectives", "technologies"],
    "technology-solution": ["technologies", "epics"],
    "phases": ["phases", "team"],
    "capacity-plan": ["team", "phases"],
    "prerequisites-and-dependencies": ["risks", "prerequisites"],
}

# Fixed, non-authored boilerplate injected verbatim into specific generated
# slides regardless of digest content or which blueprint alternate is chosen
# for that section (see layout_alternates.BY_SECTION — "risks" has 4 possible
# blueprints, all of which carry a DISCLAIMER slot for this purpose). Never
# sourced from the LLM content step; plan.py resolves the language-appropriate
# string deterministically and the content step must copy it through as-is.
FIXED_SLOT_TEXT = {
    "risks": {
        "DISCLAIMER": {
            "es": (
                "Los compromisos presentados se basan en la disponibilidad de la información, "
                "los accesos, las validaciones y las decisiones requeridas por el cliente. "
                "Demoras en estos elementos podrán afectar al ritmo de ejecución y generar "
                "esfuerzos adicionales no contemplados inicialmente."
            ),
            "en": (
                "The commitments presented are based on the availability of information, access, "
                "validations and decisions required from the client. Delays in these elements may "
                "affect the pace of execution and generate additional effort not initially "
                "contemplated."
            ),
        },
    },
}

# section slug -> human-readable label (for the outline review grouping)
SECTION_LABELS = {
    "context": "Context",
    "approach": "Approach",
    "our-solution": "Our Solution",
    "indicative-scope": "Indicative Scope",
    "out-of-scope": "Out of Scope",
    "risks": "Risks & Uncertainties",
    "prerequisites": "Prerequisites",
    "technical-proposal": "Technical Proposal",
    "current-state": "Current State",
    "technology-solution": "Technology Solution",
    "plan-and-team": "Plan & Team",
    "capacity-plan": "Capacity Plan",
    "phases": "Phases",
    "prerequisites-and-dependencies": "Prerequisites & Dependencies",
    "budget": "Budget",
    "references": "References",
}


def main():
    if len(sys.argv) != 4:
        sys.exit(f"Usage: {sys.argv[0]} <manifest.json> <context-digest.json> <out.json>")

    manifest = load_manifest(Path(sys.argv[1]))
    digest = json.loads(Path(sys.argv[2]).read_text(encoding="utf-8"))
    out_path = Path(sys.argv[3])

    collab = digest.get("collab", "fixed_price")
    delivery = digest.get("delivery", "plain_team")
    language = digest.get("language", "es")
    flags = digest.get("flags", {})
    has_discovery = bool(flags.get("has_discovery"))
    phased = bool(flags.get("phased"))
    # is_brownfield gates slide 20 (current state). Accept the old key
    # has_comparison as a fallback for digests written before the rename.
    is_brownfield = bool(flags.get("is_brownfield", flags.get("has_comparison")))
    # default: hybrid teams keep a global tech lead (slide 31) unless told otherwise
    tech_lead_global = bool(flags.get("tech_lead_global", True))

    included = resolve_included_slides(
        manifest, collab, has_discovery, phased, is_brownfield,
        delivery=delivery, tech_lead_global=tech_lead_global,
    )
    included_set = set(included)

    by_num = {s["num"]: s for s in manifest["slides"]}
    # built shells offered to every generated slide (outline may author a shell
    # when the content has two heterogeneous facets). Empty if none built.
    shells = built_shells()
    slides = []
    generated_count = 0
    # running divider section, so content slides inherit the group they sit under.
    current_group = ""
    for num in included:
        s = by_num[num]
        action = s["action"]
        section = s.get("section", "")
        entry = {
            "n": num,
            "type": action,
            "file": f"slide{num}.xml",
        }
        # dividers define the top-level groups used to batch the outline review.
        if action == "copy-as-is" and section:
            current_group = section
        # carry the slide's own section (+ readable label) when it has one.
        if section:
            entry["section"] = section
            entry["section_label"] = SECTION_LABELS.get(section, section)
        # tag content slides with the divider group they belong to.
        if action in ("generated", "placeholder") and current_group:
            entry["group"] = current_group
            entry["group_label"] = SECTION_LABELS.get(current_group, current_group)
        if action == "generated":
            primary = s.get("layout_hint", "")
            entry["blueprint"] = primary
            # built [primary, ...alternates] for this section; ensure the manifest
            # primary leads even if it isn't first in the alternates table.
            opts = options_for_section(section)
            if primary and primary not in opts:
                opts = [primary] + opts
            elif primary and opts and opts[0] != primary:
                opts = [primary] + [o for o in opts if o != primary]
            entry["blueprint_options"] = opts
            entry["context_keys"] = CONTEXT_KEYS.get(section, [])
            if shells:
                entry["shell_options"] = shells
            fixed = FIXED_SLOT_TEXT.get(section)
            if fixed:
                entry["fixed_content"] = {
                    slot: variants.get(language, variants.get("es", ""))
                    for slot, variants in fixed.items()
                }
            generated_count += 1
        elif action == "placeholder":
            entry["placeholders"] = s.get("placeholders", [])
        slides.append(entry)

    # Deterministic layout-variety pass: no two consecutive slides may share a
    # blueprint. Build the full effective-layout sequence (generated slides are
    # swappable via their options; copy-as-is/placeholder use their fixed
    # layout_hint and only count for adjacency), then write swaps back.
    seq = []
    for entry, num in zip(slides, included):
        if entry["type"] == "generated":
            seq.append({"layout": entry["blueprint"], "options": entry.get("blueprint_options", [])})
        else:
            seq.append({"layout": by_num[num].get("layout_hint", ""), "options": []})
    dedup_consecutive(seq)
    for entry, item in zip(slides, seq):
        if entry["type"] == "generated":
            entry["blueprint"] = item["layout"]

    plan = {
        "collab": collab,
        "delivery": delivery,
        "language": language,
        "flags": {
            "has_discovery": has_discovery,
            "phased": phased,
            "is_brownfield": is_brownfield,
            "tech_lead_global": tech_lead_global,
        },
        "included_slides": included,
        "generated_count": generated_count,
        "slides": slides,
    }
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(plan, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Wrote {out_path}: {len(slides)} slides, {generated_count} generated")
    # surface which blueprints are required
    needed = sorted({e["blueprint"] for e in slides if e["type"] == "generated" and e.get("blueprint")})
    print(f"Blueprints required: {needed}")
    # surface team-slide selection (depends on delivery + tech_lead_global)
    team = sorted(resolve_team_slides(manifest, collab, delivery, tech_lead_global))
    print(f"Team model: collab={collab}, delivery={delivery}, tech_lead_global={tech_lead_global} -> team slides {team}")


if __name__ == "__main__":
    main()
