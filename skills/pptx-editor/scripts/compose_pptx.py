#!/usr/bin/env python3
"""Compose a PPTX from template manifest + decision rules.

Mechanically builds the base PPTX by:
  1. Copying the template
  2. Removing slides excluded by decision_rules / conditionals
  3. Replacing placeholders via replace_placeholders.py
  4. Inserting blank slides at "generated" positions (for LLM to fill later)
  5. Writing compose_manifest.json with the generated slide list

The LLM then only needs to create the ~9 generated slides.

Usage:
    python compose_pptx.py <manifest.json> <template_dir> <output_dir> \
        --collab <fixed_price|tm_scope|capacity> \
        [--has-discovery] [--phased] [--is-brownfield] \
        --placeholders <placeholders.json>

    python compose_pptx.py \
        resources/2026_ProposalsAI_Master_Template/2026_ProposalsAI_Master_Template-manifest.json \
        resources/2026_ProposalsAI_Master_Template/ \
        working/ \
        --collab fixed_price \
        --has-discovery \
        --placeholders placeholders.json

placeholders.json format:
    {
        "1": {"[Presentation Title]": "My Project", "[Client]": "Acme", "[Date]": "Jun 2026"},
        "5": {"[Enter the client project context here]": "Actual context..."},
        "6": {"[Requirements summary]": "...", ...},
        "14": {"[Phase 1]": "Discovery", ...},
        "21": {"[Technology 1]": "Azure", ...},
        "25": {"[Profile name 1]": "Tech Lead", ...}
    }
"""

import json
import re
import shutil
import sys
from pathlib import Path

# Reuse helpers from add_slide
sys.path.insert(0, str(Path(__file__).parent))
from add_slide import _next_slide_name, _next_rid, _next_slide_id, _register


def load_manifest(manifest_path: Path) -> dict:
    with open(manifest_path, encoding="utf-8") as f:
        return json.load(f)


def resolve_team_slides(manifest: dict, collab: str, delivery: str,
                        tech_lead_global: bool) -> set[int]:
    """Select the team-composition/roles slides for the given team model.

    Plain team -> the plain slides; hybrid (and capacity, always hybrid) ->
    the base hybrid slide plus the roles variant chosen by tech_lead_global.
    Returns the subset of `team_slides` that should be kept.
    """
    rules = manifest.get("team_rules", {})
    # capacity is delivered as a hybrid team
    effective = "hybrid" if collab == "capacity" else delivery
    if effective == "hybrid":
        hybrid = rules.get("hybrid", {})
        sel = set(hybrid.get("base", []))
        variant = "with_tech_lead" if tech_lead_global else "without_tech_lead"
        sel.update(hybrid.get(variant, []))
        return sel
    return set(rules.get("plain_team", []))


def resolve_included_slides(manifest: dict, collab: str,
                            has_discovery: bool, phased: bool,
                            is_brownfield: bool,
                            delivery: str = "plain_team",
                            tech_lead_global: bool = True) -> list[int]:
    """Determine which template slide numbers to include."""
    all_nums = [s["num"] for s in manifest["slides"]]
    rules = manifest["decision_rules"].get(collab, {})

    # Start with slides NOT in any omit list
    omit = set(rules.get("omit_slides", []))
    include_explicit = set(rules.get("include_slides", []))
    extra = set(rules.get("extra_include", []))

    # Conditional slides
    conditionals = manifest.get("conditional_slides", {})
    cond_include = set()
    if has_discovery and "has_discovery" in conditionals:
        cond_include.update(conditionals["has_discovery"]["include"])
    if phased and "phased" in conditionals:
        cond_include.update(conditionals["phased"]["include"])
    if is_brownfield and "is_brownfield" in conditionals:
        cond_include.update(conditionals["is_brownfield"]["include"])

    # Team-composition/roles slides: keep only the variants for this team model.
    team_all = set(manifest.get("team_slides", []))
    team_keep = resolve_team_slides(manifest, collab, delivery, tech_lead_global)

    # Slides whose presence is controlled by a conditional flag: any slide listed
    # in conditional_slides is included only when its flag is active (i.e. it ends
    # up in cond_include). Drives 13/14/15 (discovery/sprint 0, gated by
    # has_discovery only) and 20 (estado actual, gated by is_brownfield)
    # from the manifest instead of fragile note-text parsing.
    conditional_controlled = set()
    for group in conditionals.values():
        conditional_controlled.update(group.get("include", []))

    # Build final list: all slides that are NOT omitted
    # (generated slides are kept even if in omit — omit means "don't include this content")
    included = []
    for slide in manifest["slides"]:
        num = slide["num"]
        action = slide["action"]

        # Skip explicitly omitted slides
        if num in omit and action != "generated":
            continue
        # Generated slides in omit list are excluded entirely
        if num in omit and action == "generated":
            continue

        # Team-variant slides: include only the ones selected for this team model.
        if num in team_all and num not in team_keep:
            continue

        # Flag-controlled slides: include only when their condition is active.
        if num in conditional_controlled and num not in cond_include:
            continue

        # Conditional slides: include only if condition is met
        note = slide.get("note", "")
        is_conditional = any(kw in note for kw in ["Only if", "Optional", "Only capacity"])
        if is_conditional:
            # Check if this slide's condition is met
            if num in cond_include:
                included.append(num)
                continue
            # Check collab-specific rules
            if "Only capacity" in note and collab != "capacity":
                continue
            if "Only fixed_price" in note and collab != "fixed_price":
                continue
            if "Only tm_scope" in note and collab != "tm_scope":
                continue
            if "Only if there is" in note and not has_discovery:
                continue
            if "Optional" in note and not is_brownfield:
                continue

        included.append(num)

    # Ensure explicitly included slides are present
    included = list(dict.fromkeys(included + list(include_explicit | extra | cond_include)))
    # Sort by original template order
    included.sort(key=lambda n: all_nums.index(n) if n in all_nums else 999)
    return included


def remove_slides(unpacked: Path, keep_nums: list[int]) -> None:
    """Remove slides NOT in keep_nums from the unpacked directory."""
    slides_dir = unpacked / "ppt" / "slides"
    rels_dir = slides_dir / "_rels"

    # Find existing slide numbers
    existing = {}
    for f in slides_dir.glob("slide*.xml"):
        m = re.match(r"slide(\d+)\.xml", f.name)
        if m:
            existing[int(m.group(1))] = f.name

    # Template slide numbers map to actual XML slide numbers
    # In a fresh copy, template slide N = slideN.xml
    to_remove = set(existing.keys()) - set(keep_nums)

    for num in to_remove:
        name = existing[num]
        (slides_dir / name).unlink(missing_ok=True)
        (rels_dir / f"{name}.rels").unlink(missing_ok=True)

    # Remove from presentation.xml
    pres_path = unpacked / "ppt" / "presentation.xml"
    if pres_path.exists():
        pres_text = pres_path.read_text(encoding="utf-8")
        # Remove <p:sldId> entries for removed slides
        # We need to find rId mapping first
        rels_path = unpacked / "ppt" / "_rels" / "presentation.xml.rels"
        rels = {}
        if rels_path.exists():
            for m in re.finditer(r'Id="(rId\d+)"[^>]*Target="slides/slide(\d+)\.xml"', rels_path.read_text(encoding="utf-8")):
                rels[int(m.group(2))] = m.group(1)

        for num in to_remove:
            rid = rels.get(num)
            if rid:
                pres_text = re.sub(
                    rf'\s*<p:sldId[^>]*r:id="{rid}"[^>]*/>\s*',
                    "\n", pres_text
                )
                # Remove from rels
                rels_text = rels_path.read_text(encoding="utf-8")
                rels_text = re.sub(
                    rf'\s*<Relationship[^>]*Id="{rid}"[^>]*/>\s*',
                    "\n", rels_text
                )
                rels_path.write_text(rels_text, encoding="utf-8")

        # Remove from Content_Types.xml
        ct_path = unpacked / "[Content_Types].xml"
        if ct_path.exists():
            ct_text = ct_path.read_text(encoding="utf-8")
            for num in to_remove:
                ct_text = re.sub(
                    rf'\s*<Override[^>]*PartName="/ppt/slides/slide{num}\.xml"[^>]*/>\s*',
                    "\n", ct_text
                )
            ct_path.write_text(ct_text, encoding="utf-8")

        pres_path.write_text(pres_text, encoding="utf-8")

    print(f"Removed {len(to_remove)} slides, kept {len(keep_nums)}")


def insert_blank_slides(unpacked: Path, positions: list[dict]) -> None:
    """Ensure blank slides exist at generated positions.

    The template already has blank slides at these positions (slides 8-12, 20, 22, 24, 26).
    We just replace their XML with the base slide template which has proper chrome
    (left bar, section label, title slot, footer).

    positions: list of {"template_num": N, "section": "...", "layout_hint": "..."}
    """
    base_slide = Path(__file__).resolve().parent.parent / "resources" / "base" / "base-unpacked" / "ppt" / "slides" / "slide1.xml"
    if not base_slide.exists():
        print("Warning: base slide not found, skipping blank slide insertion")
        return

    slides_dir = unpacked / "ppt" / "slides"
    rels_dir = slides_dir / "_rels"
    rels_dir.mkdir(exist_ok=True)

    # ponytail: image8.png is the PC logo used by footer across the template
    FOOTER_LOGO = "image8.png"

    for pos in positions:
        num = pos["template_num"]
        target = slides_dir / f"slide{num}.xml"
        if target.exists():
            # Replace the blank template slide with our base slide (has chrome)
            shutil.copy2(base_slide, target)

            # Fix rels: base slide XML has r:embed="rId3" pointing to footer logo image.
            # The original template slide rels may or may not have an image ref.
            # We need: rId3 -> image8.png (PC logo footer) + rId1 -> slideLayout
            src_rels = rels_dir / f"slide{num}.xml.rels"
            if src_rels.exists():
                rels_text = src_rels.read_text(encoding="utf-8")
                has_image = "image" in rels_text
                has_notes = "notesSlide" in rels_text

                if has_image:
                    # Fix existing image ref to point to correct PC logo
                    rels_text = re.sub(
                        r'Target="../media/image\d+\.png"',
                        f'Target="../media/{FOOTER_LOGO}"',
                        rels_text, count=1
                    )
                else:
                    # Add image relationship — base slide XML uses rId3 for the footer logo
                    img_rel = (
                        f'  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/{FOOTER_LOGO}"/>\n'
                    )
                    rels_text = rels_text.replace("</Relationships>", img_rel + "</Relationships>")

                if has_notes:
                    # Remove stale notesSlide ref
                    rels_text = re.sub(
                        r'\s*<Relationship[^>]*notesSlide[^>]*/>\s*',
                        "\n", rels_text
                    )

                src_rels.write_text(rels_text, encoding="utf-8")
            else:
                # Create basic rels: slideLayout + footer logo image
                rels_xml = (
                    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
                    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">\n'
                    '  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>\n'
                    f'  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/{FOOTER_LOGO}"/>\n'
                    '</Relationships>'
                )
                src_rels.write_text(rels_xml, encoding="utf-8")

            pos["slide_file"] = f"slide{num}.xml"
            print(f"  Replaced slide{num}.xml with base chrome (section: {pos['section']})")
        else:
            # Slide was removed (e.g., by decision_rules) — insert new slide
            existing_nums = [
                int(m.group(1))
                for f in slides_dir.glob("slide*.xml")
                if (m := re.match(r"slide(\d+)\.xml", f.name))
            ]
            next_num = max(existing_nums) + 1 if existing_nums else 1
            dest_name = f"slide{next_num}.xml"
            shutil.copy2(base_slide, slides_dir / dest_name)

            # Register and insert
            rid = _register(unpacked, dest_name)
            next_id = _next_slide_id(unpacked)
            new_entry = f'<p:sldId id="{next_id}" r:id="{rid}"/>'

            pres_path = unpacked / "ppt" / "presentation.xml"
            pres_text = pres_path.read_text(encoding="utf-8")
            # Append at end of sldIdLst
            pres_text = pres_text.replace("</p:sldIdLst>", f"  {new_entry}\n  </p:sldIdLst>")
            pres_path.write_text(pres_text, encoding="utf-8")

            pos["slide_file"] = dest_name
            print(f"  Inserted {dest_name} (section: {pos['section']})")


def main():
    import argparse
    parser = argparse.ArgumentParser(description="Compose PPTX from template manifest")
    parser.add_argument("manifest", help="Path to manifest.json")
    parser.add_argument("template_dir", help="Path to template directory (contains .pptx)")
    parser.add_argument("output_dir", help="Output directory for composed PPTX")
    parser.add_argument("--collab", required=True, choices=["fixed_price", "tm_scope", "capacity"])
    parser.add_argument("--delivery", choices=["plain_team", "hybrid"], default="plain_team",
                        help="Team model (capacity is always treated as hybrid)")
    parser.add_argument("--tech-lead-global", dest="tech_lead_global", action="store_true", default=True,
                        help="Hybrid teams: Plain holds a global tech lead (slide 31). Default.")
    parser.add_argument("--no-tech-lead-global", dest="tech_lead_global", action="store_false",
                        help="Hybrid teams: no global tech lead / low leadership (slide 32).")
    parser.add_argument("--has-discovery", action="store_true")
    parser.add_argument("--phased", action="store_true")
    parser.add_argument("--is-brownfield", dest="is_brownfield", action="store_true",
                        help="Brownfield: pre-existing system whose current state is shown (slide 20).")
    parser.add_argument("--placeholders", help="Path to placeholders JSON file")
    args = parser.parse_args()

    manifest_path = Path(args.manifest)
    template_dir = Path(args.template_dir)
    output_dir = Path(args.output_dir)

    manifest = load_manifest(manifest_path)

    # Find template PPTX
    template_name = manifest["template"]
    pptx_path = template_dir / f"{template_name}.pptx"
    unpacked_src = template_dir / f"{template_name}-unpacked"

    if not pptx_path.exists() and not unpacked_src.exists():
        sys.exit(f"Error: neither {pptx_path} nor {unpacked_src} found")

    # Ensure unpacked source exists
    if not unpacked_src.exists():
        sys.path.insert(0, str(Path(__file__).parent / "reader"))
        from unpack import unpack
        unpack(pptx_path, unpacked_src)

    # Step 1: Resolve which slides to include
    included = resolve_included_slides(
        manifest, args.collab,
        args.has_discovery, args.phased, args.is_brownfield,
        delivery=args.delivery, tech_lead_global=args.tech_lead_global
    )
    print(f"Included slides: {included}")

    # Step 2: Copy template to output
    unpacked_dst = output_dir / "working-unpacked"
    if unpacked_dst.exists():
        shutil.rmtree(unpacked_dst)

    if unpacked_src.exists():
        shutil.copytree(unpacked_src, unpacked_dst)
    else:
        # Unpack from PPTX
        sys.path.insert(0, str(Path(__file__).parent / "reader"))
        from unpack import unpack
        unpack(pptx_path, unpacked_dst)

    # Step 3: Remove excluded slides
    remove_slides(unpacked_dst, included)

    # Step 4: Replace placeholders
    if args.placeholders:
        from replace_placeholders import replace_placeholders_in_xml
        with open(args.placeholders, encoding="utf-8") as f:
            mappings = json.load(f)

        slides_dir = unpacked_dst / "ppt" / "slides"
        for slide_num, replacements in mappings.items():
            slide_file = slides_dir / f"slide{slide_num}.xml"
            if slide_file.exists():
                replace_placeholders_in_xml(str(slide_file), replacements)
                print(f"  Replaced placeholders in slide{slide_num}.xml")

    # Step 5: Replace blank "generated" slides with base chrome slide
    generated = []
    for slide in manifest["slides"]:
        if slide["num"] in included and slide["action"] == "generated":
            generated.append({
                "template_num": slide["num"],
                "section": slide.get("section", ""),
                "layout_hint": slide.get("layout_hint", ""),
                "type": slide.get("type", "content"),
            })

    if generated:
        print(f"\nPreparing {len(generated)} generated slides with base chrome:")
        insert_blank_slides(unpacked_dst, generated)

    # Step 6: Write compose_manifest.json
    compose_manifest = {
        "template": template_name,
        "collaboration_type": args.collab,
        "delivery_model": args.delivery,
        "tech_lead_global": args.tech_lead_global,
        "has_discovery": args.has_discovery,
        "phased": args.phased,
        "is_brownfield": args.is_brownfield,
        "included_template_slides": included,
        "generated_slides": generated,
        "decision_rules_applied": manifest["decision_rules"].get(args.collab, {}),
    }
    manifest_out = output_dir / "compose_manifest.json"
    with open(manifest_out, "w", encoding="utf-8") as f:
        json.dump(compose_manifest, f, indent=2, ensure_ascii=False)
    print(f"\nWrote {manifest_out}")

    # Step 7: Pack
    from pack import pack
    out_pptx = output_dir / "working.pptx"
    # ponytail: no --original merge; compose copies from full unpacked template
    # so all files (fonts, props) are already present. --original would duplicate slides.
    pack(unpacked_dst, out_pptx)
    print(f"Packed {out_pptx}")

    print(f"\nOK: Composed PPTX: {len(included)} template slides + {len(generated)} generated slots")
    print(f"  Next: run pptx-editor to create the {len(generated)} generated slides")


if __name__ == "__main__":
    main()
