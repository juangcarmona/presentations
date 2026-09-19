---
name: pptx-editor
description: "Versioned Plain Concepts PPTX engine for building and editing editable PowerPoint decks with template-based XML workflows and deterministic blueprints. Use through the repository's pptx-deck workflow, not as the user-facing presentation router."
allowed-tools: Bash, Read, Write
# Bash: invokes soffice, pdftoppm, markitdown via subprocess (LibreOffice/markitdown conversion pipeline)
metadata:
  plugin: pc-presales
  author: "Plain Concepts; local fork maintained in presentations"
---

# PPTX Editor

Generate an editable **PowerPoint (.pptx)** using the 2026 Plain Concepts master template.

**Input:** `type`, `language`, `title`, `audience`, `date` — passed by the `pptx-editor` agent.  
**Optional input:** `context_dir` — absolute path to an `_ai-proposal/` directory detected by the agent.

**Output:** `_outputs/presentation.pptx`

- **Proposal pipeline (blueprints)**: digest → plan → content → compose — **the preferred path**, see Workflow C
- **Composition & layout**: see [composition.md](guides/composition.md) — **primary reference**
- **Style (colors, fonts)**: see [style.md](guides/style.md)

---

## Workflow C — Proposal blueprint pipeline (preferred)

For commercial proposals, the LLM **never edits slide XML**. It only writes two JSON files;
Python does the rest deterministically. Orchestrated by the `proposal` command.

```
digest    -> working/context-digest.json   (LLM: reads _ai-proposal/ once)
plan.py           -> working/slide-plan.json        (Python: manifest + digest)
content   -> working/content-blocks.json    (LLM: flat JSON, no XML)
compose.py --pack -> _outputs/presentation.pptx     (Python: fill blueprints + placeholders)
```

**Blueprints** are brand-correct slides with `___SLOT_NAME___` markers, built one-time from
catalogued source slides:

```bash
# one-time (regenerate only when adding/fixing a layout):
uv run --no-project python scripts/setup/inspect_slide.py master slide13.xml   # dump shape ids -> author spec
uv run --no-project python scripts/setup/build_blueprints.py [layout_hint ...] # -> resources/blueprints/{layout}/
```

Each blueprint dir has `blueprint.xml` (markers), `blueprint.xml.rels`, `media/`, and
`slots.json` (slot names/kinds + prunable groups). `fill_blueprint.py` fills them: scalar
slots -> string; list slots -> one bullet `<a:p>` per array item; a group whose control slot
is empty is pruned (a 3rd card with no content disappears cleanly).

> Source-slide mapping lives in `scripts/setup/blueprint_specs.json` — the **source of truth**.
> Do NOT trust the manifest's `layout_catalogue` slide numbers (stale vs current presentation.xml).

To regenerate only content: re-run from `content`. To tweak one slide: hand-edit
`working/content-blocks.json` and re-run `compose.py`.

---

## Pre-requisites

All input files live in the bundled **`resources/`** folder — no external reference directory needed.
The markdown content, unpacked XML tree, and thumbnails are **already pre-computed**; do **not** re-run markitdown or thumbnail generation.

Available templates inside `resources/`:

```
resources/{stem}/{stem}.pptx              ← source template
resources/{stem}/{stem}-unpacked/         ← XML tree ready to inspect
resources/{stem}/{stem}-thumbnails-*.jpg  ← visual layout overview
resources/{stem}/{stem}.md                ← markitdown content (pre-computed)
resources/{stem}/{stem}-manifest.json     ← slide manifest with placeholders & decision rules
```

---

## Visual QA (any output)

`qa.py` only catches leftover markers/placeholders. For visual defects, render to images
(`soffice --headless --convert-to pdf` → `pdftoppm -jpeg -r 150`) and **delegate the
inspection to a subagent** — you've been staring at the code and will see what you expect,
not what's there. Fresh eyes catch more.

Prompt for the QA subagent:

> Visually inspect these slides. Assume there are issues — find them.
> Look for: overlapping elements, text cut off at edges, elements below Y=5.1", uneven or missing margins (< 0.5"), same layout on consecutive slides, slides with zero visual elements (shape/icon/chart), missing logo, missing page number, text-only slides where cards or visual structure should appear, anti-patterns from guides/composition.md.
> For each slide, list every issue found, including minor ones.

**Assume there are problems.** The first render is almost never correct. Do not declare the
output done until you have completed at least one fix → re-render → re-inspect cycle.

---

## Scripts reference

Full per-script command table → [scripts.md](guides/scripts.md). All scripts run via
`uv run --no-project` (isolated interpreter, never the global Python).

---

## Common pitfalls

Low-level slide-XML gotchas (multi-item paragraphs, `<p:txBody>` element order, split-run
placeholder fragmentation, orphaned visuals) → [xml-pitfalls.md](guides/xml-pitfalls.md).
The blueprint pipeline (Workflow C) avoids most of them by filling deterministic slots.

---

## Dependencies

Python packages are **never installed globally**. Every script invocation uses
`uv run --no-project`, which runs in an isolated uv-managed interpreter, and adds
`--with <package>` only where third-party packages are needed:

- **Composition pipeline** (`compose.py`, `compose_free.py`, `plan.py`, `qa.py`, …) — standard library only, no `--with`.
- **Reader / template prep** — `--with "markitdown[pptx]" --with python-pptx --with Pillow` (see the `reader` command).
- **E2E tests** — `--with python-pptx --with Pillow` (see [scripts.md](guides/scripts.md)).

System-wide tools (not Python packages): `soffice` (LibreOffice) and `pdftoppm` (poppler)
for visual QA; `pptxgenjs` (`npm install -g pptxgenjs`) only for from-scratch PptxGenJS authoring.
