# Shells + components — atomic composition (freestyle mode)

A composition path for slides the **fixed blueprint catalogue can't express**
(e.g. *metrics + a table* on the same slide). Instead of a layout-frozen slide,
a **shell** defines regions and **components** are mounted inside them.

> **Available in both modes.** Freestyle (`compose_free.py`) via `kind:"composite"` topics, and **proposal**
> (`compose.py`) — `plan.py` offers `shell_options` on every generated slide and the outline picks a shell by fit.
> The compositor is shared: `compose_shell.write_shell_slide` (no slide registration; each caller registers).
> In proposal mode the shell **overwrites** the existing template slide; in freestyle a new one is inserted.

## Model

- **Shell** (`shells/{name}/`) — a brand slide with **chrome** (blue bar, accent, footer logo+slidenum)
  + `SECTION`/`TITLE` slots, and one or more **regions** with a fixed, pre-validated bbox. The region areas
  are empty. `blueprint.xml` + `blueprint.xml.rels` + `media/` + `slots.json` (with `regions`).
- **Component** (`components/{name}/`) — a chrome-less mini-blueprint, with its shapes at **origin (0,0)**
  authored to the **exact size of a region** (4.3"×3.25" for `halves`). `blueprint.xml` + `slots.json`
  (+ `blueprint.xml.rels` + `media/` only if it has images).

Golden rule (same as blueprints): **everything is authored on the master design**. Shells and components
clone real `three-col-cards` templates (chrome, card header, bulleted body, title/section), so they come out
on-brand by construction.

## Current catalogue

| Type | Name | Description |
|---|---|---|
| shell | `halves` | 2 side-by-side regions (`left`/`right`), bbox 4.3"×3.25" from y=1.75" (nothing below Y=5.1"). `accepts`: card, stat-stack, mini-table. |
| component | `card` | Titled card: blue header + off-white bulleted body. Slots `CARD_HEADER` (scalar) + `CARD_BODY` (list). |
| component | `stat-stack` | Up to 3 metrics (big number + label), prunable groups. `STAT{1..3}_VALUE` / `STAT{1..3}_LABEL`. |
| component | `mini-table` | Compact 2-col table (clones the `data-table` `graphicFrame`). Table slot `TABLE` (`{header, rows}`). |

## The mount engine (`scripts/mount.py`)

`mount_component()` is **deterministic** and reuses `fill_blueprint` (which **never** touches geometry):

1. Fills the component with `fill_blueprint(component_dir, region_block)` (markers resolved).
2. **Renumbers** every `cNvPr id` from a base above the shell's max (avoids collisions).
3. **Translates** each *top-level* shape by adding the region origin to its `<a:off>`
   (`sp`/`pic`/`cxnSp` → `spPr/a:xfrm/off`; `grpSp` → `grpSpPr/a:xfrm/off`; `graphicFrame` → `p:xfrm/off`).
   A `grpSp`'s children are relative to its `chOff` → moving the group's `off` is enough (no recursion).
4. **Merges media/rels**: if the component carries `blueprint.xml.rels`, it assigns new rIds free of the
   shell's, rewrites `r:embed`/`r:link`, copies the media into the deck, and returns the relationships for the slide's `.rels`.
5. `append`s the shapes to the shell's `spTree`.

Translation is **pure, no scaling** — because the component is authored to the region's exact size. That's the
decision that eliminates the #1 source of off-brand spacing.

## JSON contract (what the LLM writes)

`content-blocks.json`, a shell slide entry:

```json
"3": {
  "SECTION": "IMPACT AND STACK",
  "TITLE": "Measurable impact and stack",
  "__shell__": "halves",
  "left":  { "__component__": "stat-stack", "STAT1_VALUE": "-55%", "STAT1_LABEL": "CODING TIME", "...": "..." },
  "right": { "__component__": "card", "CARD_HEADER": "Stack", "CARD_BODY": ["...", "..."] }
}
```

`compose_free._write_shell` detects `__shell__`, fills `SECTION`/`TITLE`, mounts each region
(only components in the region's `accepts`; otherwise warn + skip) and packs.

## Build (one-time)

```bash
uv run --no-project python plugin/skills/pptx-editor/scripts/setup/build_components.py   # card, stat-stack, mini-table
uv run --no-project python plugin/skills/pptx-editor/scripts/setup/build_shells.py       # halves
```

Shared helpers in `setup/_pieces.py` (donor = `three-col-cards`; `PieceBuilder`, `load_donor`).

### Adding a component
1. Add a `build_*` in `build_components.py` (clone templates with `PieceBuilder.add`, geometry in inches,
   origin 0,0, width = region). Return `(builder, meta_extra)` with `component_box` (+ `tables` if it carries
   a table; + `capacity: {slot: max}` to bound lists/rows — `mount_component` emits a WARN if exceeded).
2. Register it in `BUILDERS` and in the `accepts` of the shell(s) (`build_shells.py`).
3. Document its slots in the table above.

### Adding a shell
1. Add a `build_*` in `build_shells.py`: `b.add_chrome()` + define `regions` (bbox in inches, `accepts`).
   **Nothing below Y=5.1"**: `y + h ≤ 5.0`.
2. Register it in `SHELL_BY_KIND` (`layout_alternates.py`) if you want a `kind` to pick it automatically.

## QA

`qa.py` validates that no `___SLOT_` markers or `[brackets]` remain, **and** that there are no duplicate
`cNvPr id`s per slide (the only corruption the mount could introduce).

## Gotcha — `build_manual_blueprints.py` donor

`build_manual_blueprints.py` (the `manual` blueprints: numbered-pipeline, framework-pillars, summary-cards)
uses `capability-grid` as a donor, but its `_load_templates()` looks for `___SLOT_CARD1_HEADER___` markers the
donor **no longer has** (it was re-extracted natively with `CAP*` markers) ⇒ that lookup is broken against the
current donor. That's why shells/components use **`three-col-cards`** as the donor. Fixing `build_manual_blueprints`
is a separate pending task.
