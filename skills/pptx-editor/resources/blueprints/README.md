# Blueprints — status

Generated one-time by `scripts/setup/build_blueprints.py` from `scripts/setup/blueprint_specs.json`
(the **source of truth** for the layout→slide mapping; the manifest's `layout_catalogue` is stale).

Each blueprint: `blueprint.xml` (with `___SLOT_NAME___`), `blueprint.xml.rels`, `media/`, `slots.json`.
They're filled with `scripts/fill_blueprint.py` (used by `compose.py`): scalars = string;
lists = one `<a:p>` per item; prunable groups (an empty card/column disappears); **tables** = a template
row cloned per data item.

## ✅ Built and visually validated (24 — master/agentes/sermes/manual sources)

> 22 more in the "`offerings` source" section below. Total catalogue: **46 blueprints**.

| layout_hint | source | type | # slots |
|---|---|---|---|
| **data-table** | agentes slide10 | generic **table** (Type/Description, overridable header, cloned row) | 2 + table ROWS |
| **benefits-icons** | agentes slide16 | 4 benefit columns (SVG icon + ellipse + header + body); empty column pruned **with its icon** | 10 (4 prunable groups) |
| **numbered-pipeline** | manual (ref proposal-example) | horizontal row of 5 numbered step cards | 12 (5 prunable groups) |
| **framework-pillars** | manual (ref proposal-example) | central hub + ▼ + row of 4 pillars | 11 (4 prunable groups) |
| **summary-cards** | manual (ref proposal-example) | light panel with a 2×3 grid (bar + title + prose) | 14 (6 prunable groups) |
| three-col-cards | master slide13 | cards | 8 |
| phase-dark-left | master slide15 | scalars+groups | 16 |
| two-col-text-callout | master slide16 | scalars+lists | 8 |
| icon-list-split | master slide17 | scalars+groups | 11 |
| phase-detail-left-right | master slide14 | scalars+groups | 16 |
| arch-diagram-tech | master slide21 | scalars+list | 6 |
| numbered-list-callout | master slide27 | scalars+groups | 10 |
| roles-two-col | master slide30 | scalars+lists | 9 |
| comms-tiered | master slide33 | scalars+groups | 11 |
| three-options | master slide38 | scalars+lists+groups | 15 |
| services-grid | master slide39 | scalars+groups | 14 |
| team-dual-col | master slide28 | scalars+groups | 16 |
| hybrid-team | master slide29 | scalars+groups | 16 |
| budget-summary | master slide35 | scalars+groups | 12 |
| **pricing-table** | master slide37 | **table** (cloned row) | 2 + table RATES |
| **two-col-contrast** | manual (from three-col-cards) | TODAY/SOLUTION cards | 6 |
| **capacity-table** | manual (from master slide25) | roles×sprint-stage **table** (header+body+footer) | 2 + table CAPACITY |
| **pros-cons-split** | sermes slide22 | 2 columns: 5 pain cards (red) left + 5 opportunity (green) right; prunable cards; header normalized to master | 14 (10 groups) |
| **value-stats-cta** | sermes slide5 | 3 stat cards (big number + label + desc) + summary panel; prunable cards/panel; header normalized to master | 14 (4 groups) |

## ✅ `offerings` source (2026_Offerings_Master_Template) — extracted 2026-06

20 new archetypes + 2 native re-extractions (capability-grid, layered-architecture) from the
native 2026 master. See "`offerings` source" below for the gotchas (schemeClr/recolor/chrome).

| layout_hint | slide | type | # slots |
|---|---|---|---|
| **maturity-staircase** | slide22 | ascending 5-step staircase (card+badge+tag+name) + base bar; prunable steps | 14 (5 groups) |
| **statement** | slide13 | SECTION + large STATEMENT + SUPPORTING | 3 |
| **quote** | slide33 | full-bleed navy: QUOTE + ATTRIB | 2 |
| **references** | slide56 | SECTION+TITLE + SOURCES + 4 prunable refs | 7 (4 groups) |
| **kpi-row-4** | slide15 | 4 KPI cards (VALUE+LABEL+DESC+SOURCE) + INSIGHT bar; prunable cards | 20 (4 groups) |
| **logo-wall** | slide47 | 2×3 grid of logo placeholders + prunable label | 8 (6 groups) |
| **team-photos** | slide40 | 4 members (photo placeholder + NAME+ROLE+BIO); prunable | 18 (4 groups) |
| **data-insights** | slide37 | chart placeholder + 3 prunable insights (TITLE+DESC) | 9 (3 groups) |
| **objectives-grid** | slide17 | context panel (STATEMENT+POINTS+header) + 2×2 blue objective cards 01-04 | 12 (4 groups) |
| **matrix-2x2** | slide32 | 4 quadrants (TITLE+DESC) + X/Y axes | 12 (4 groups) |
| **case-study** | slide48 | 3 columns (Challenge/Solution/Results) + 3 KPI cards; prunable | 14 (6 groups) |
| **risk-table** | slide42 | 4 risk rows (H/M/L badge + TITLE+MITIGATION+OWNER+TIMELINE); prunable | 22 (4 groups) |
| **next-steps** | slide41 | 4 action rows (1-4 badge + TITLE+DESC+OWNER+DATE); prunable | 18 (4 groups) |
| **paradigm-shift** | slide20 | left 3 numbered steps + right 3 areas (HEADER+POINTS); prunable | 12 (6 groups) |
| **dual-row** | slide18 | 2 rows of 3 cards (blue top / light bottom); prunable | 14 (6 groups) |
| **before-after** | slide39 | light BEFORE panel vs blue AFTER, HEADER + 4 prunable points | 12 (8 groups) |
| **agenda-3panel** | slide11 | divider: Agenda + image strip + dark panel with 4 prunable items | 6 (4 groups) |
| **milestone-timeline** | slide55 | horizontal timeline, 4 alternating milestones (MONTH+TITLE+DESC); prunable | 14 (4 groups) |
| **impact-numbers** | slide44 | hero stat (VALUE+LABEL+SUB+DESC) + 3 prunable metrics | 14 (3 groups) |
| **quarterly-roadmap** | slide54 | 4 quarters × 3 cards (status badge + TITLE+DESC + progress); prunable | 26 (12 groups) |
| capability-grid | slide38 | **native re-extraction** (was agentes): 6 numbered cards 3×2 | 14 (6 groups) |
| layered-architecture | slide49 | **native re-extraction** (was sermes): 5 stacked layer bands | 7 (5 groups) |

## ⏳ Deferred (2)

| layout_hint | reason |
|---|---|
| gantt-timeline (offerings slide52/53) | weeks/phases are fixed geometry (not data-driven), like the discarded `swimlane-timeline`: the content doesn't control the schedule ⇒ it misleads more than it helps |
| about-us-stats (offerings slide30) | slide of fixed Plain Concepts credentials (numbers+labels in 2-paragraph shapes); a poor candidate for a parametric blueprint |

Neither is referenced by any `generated` slide of the template — they are aspirational layouts from
`composition.md`. To add them: clean authoring with `build_manual_blueprints.py` (see below) or by hand.

## `manual` clean-authored blueprints (`build_manual_blueprints.py`)

`numbered-pipeline`, `framework-pillars` and `summary-cards` are **clean-authored on the master**:
the `proposal-example` slides that inspired these layouts are bespoke and group-heavy (content inside
`grpSp`, duplicates, strays off-canvas, off-palette color strips), so they **can't** be auto-extracted.
Per the *golden rule* (see `CLAUDE.md`), `proposal-example` is **visual reference only**; the blueprint is
generated with `scripts/setup/build_manual_blueprints.py`, which clones the already-correct chrome of
`capability-grid` (blue bar, accent, footer logo + slidenum, 10" canvas, `slideLayout1`, master
palette/typography) and draws the content with computed geometry. They come out on-brand by construction.
`two-col-contrast` and `capacity-table` are also `manual` (their own builders).

### Pruning groups with images/connectors
`fill_blueprint` maps by id **all** top-level shapes (`sp`, `pic`, `graphicFrame`, `cxnSp`, `grpSp`),
not just `<p:sp>`, so a prunable group can include its `<p:pic>` icon or a connector and is removed
entirely when the `control_slot` is emptied. `benefits-icons` uses this to prune columns with their icon.
(Note: pruning leaves the icon's relationship/media as an orphan in the .rels; `compose` cleans orphans
when packing.)

## `agentes` source (new 2026 blueprints)

`data-table`, `capability-grid` and `benefits-icons` are extracted from `resources/agentes-proposal-example/`
(a real deck, slides 1-18 with the 2026 master palette: `3D5AFE` / `1A1A2E` / `F2F3F7`). Slides 19-24 of
that deck use a different palette (teal `3ABAAF`, purple `B551F2`, blue `326FFF`) and are **discarded** for
not being brand-consistent. The `agentes` source is registered in `inspect_slide.py` and `build_blueprints.py`.

**Canvas scaling (important):** the `agentes` deck is 13.33"×7.5" and the master (where the blueprints are
injected) is 10"×5.62". `build_blueprints` automatically scales the geometry, font sizes and table
dimensions by `master_cx / source_cx` (= 0.75 for agentes) so the blueprint fits the master canvas. For
sources from the master itself the factor is 1.0 (no change). Without this scaling the agentes blueprints
overflowed to the right/bottom.

**Chrome normalization (important):** each deck carries its own chrome (side bar, footer/logo). So that
blueprints from non-master sources follow the 2026 master format, `build_blueprints` runs
`normalize_chrome.py` automatically when `source != master`:

- **grafts the blue side bar** (`<p:sp>` `#3D5AFE` at x=0, full height), which the agentes deck lacked;
- **replaces the source deck's footer** with the master's canonical footer group (Plain Concepts logo
  `image8.png` + live `slidenum` field), taken from the donor blueprint `three-col-cards`;
- copies the master logo to `media/`, adds the relationship in the `.rels`, and **prunes orphaned media**
  (the agentes `</>` logo disappears; the `benefits-icons` SVG icons are kept).

It's idempotent and reproducible: rebuilding from the spec leaves the chrome correct. This way the three
agentes blueprints (including `data-table`, which had no footer at source) show the **same** bar and footer
as the 17 from the master. `normalize_chrome` registers the canonical set of Office namespaces before
serializing so it doesn't leak reserved `nsN` prefixes.

## `sermes` source (new 2026 blueprints)

`pros-cons-split`, `value-stats-cta` and `layered-architecture` are extracted from `resources/sermes-example/`
(a real consulting deck, same 13.33"×7.5" canvas as `agentes` ⇒ scale factor 0.75, already supported).
They contribute **new structural archetypes** that didn't exist: pain/opportunity contrast, big-number
metrics, and layered architecture. The deck already uses the master blue `3D5AFE` and navy, but has
off-palette semantic colors (red `C0392B`, teal `0E9F9A`, green `1E8E5A`, orange, draft yellow) that are
normalized via `recolor` (see below). Like every `source != master` source, they go through
`normalize_chrome` (blue bar + master footer, and `header_normalize` for the card-type layouts).

> **`swimlane-timeline` discarded.** It was extracted from sermes slide3 (an AS-IS→TO-BE timeline by lanes)
> but its task bars and week labels are fixed geometry (not data-driven): the content controls neither the
> temporal position nor the number of weeks, so as a reusable blueprint it misleads more than it helps.
> Removed from the catalogue. Reviving it would require a fill with dynamic bar positioning.

### `recolor` field in the spec (palette normalization)

`build_blueprints` applies an optional remap `"recolor": {"SRChex": "DSThex", …}` (case-insensitive, over
all `<a:srgbClr>`) **before** slotting/scaling. It's the mechanism that implements the *golden rule* for
color: the source contributes the layout, the master contributes the identity. Decisions made:

- **`pros-cons-split`** — *bounded accent exception*: the red (`C0392B`/`FCEEEE`, pain) and green
  (`1E8E5A`/`EAF7F0`, opportunity) are **deliberately kept** because the contrast is semantic; only the navy
  (`0F1729`→`1A1A2E`) is normalized.
- **`value-stats-cta`** — green→navy, navy→`1A1A2E`, the panel's green tint→off-white `F2F3F7`; the neutral
  gray of the 3rd stat is kept.
- **`layered-architecture`** — the monochrome blue *ramp* (`3D5AFE`/`536DFE`/`8C9EFF`) is kept as layer
  differentiation; navy and the light band are normalized.

> The sermes footers are **flat text shapes** (not a `grpSp` with `slidenum`), so `normalize_chrome` doesn't
> detect them: they must be listed in the spec's `drop` so they don't duplicate the grafted master footer.

### `header_normalize` field in the spec (header normalization)

Some decks have their own header (e.g. sermes puts the section number in a rounded **badge** + a **circle
with an icon** next to the title) that clashes with the master pattern (accent tick + small spaced label +
large title). `"header_normalize": [ids…]` (processed by `normalize_chrome` **before** grafting the chrome,
post-scale) does two things:

1. **removes** by id the header decoration shapes (badge, circle, icon `pic` — and any listed shape, e.g. a
   `LEAD`/subtitle that doesn't fit the dense layout). Unlike `build_blueprints`'s `drop` (only `<p:sp>`),
   here `<p:pic>` is also deleted;
2. **repositions and restyles** the `SECTION` and `TITLE` slots to the canonical geometry and `rPr`/`pPr`
   of the `three-col-cards` donor (off/ext, font, size, color, left alignment), preserving the marker.

`pros-cons-split` and `value-stats-cta` use it (`[2, 4, 5, 7]`: badge, circle, icon and LEAD). This makes
their header **indistinguishable** from the master blueprints'. `layered-architecture` doesn't need it (its
header was already master style).

## `offerings` source (2026_Offerings_Master_Template)

The deck `resources/master-brand-template/2026_Offerings_Master_Template.pptx` (58 slides, a layout library
+ native style guide) is the native 2026 brand master. **Same canvas as the proposals master (10"×5.62"
⇒ factor 1.0, no rescaling)** and native palette, so it's the ideal source of new archetypes. Project
decision: it's **normalized to the current chrome** (blue bar + footer), the offerings chrome (logo
top-right, no bar) is not adopted. That's why `source="offerings"` (≠ master) triggers `normalize_chrome`
like any foreign source.

Gotchas resolved in `build_blueprints.py`:

- **Numbering**: the content of `slideN.xml` == the **markdown** numbering (markitdown), **not** the
  thumbnails' (different internal order). Pick files by the `.md` / XML inspection, never by the thumbnail.
- **`flatten_scheme_colors` (mandatory)**: the offerings slides use `schemeClr` (tx1/bg1/accent4…) which,
  when injected, resolve against the **target** theme (the proposals master uses the default Office theme:
  accent4=yellow, accent6=green) ⇒ mis-render. They are flattened to `srgbClr` via the offerings theme
  **before** the recolor, only for `source != master`. Without this, navy/blue text and accents come out
  wrong.
- **`OFFERINGS_BASE_RECOLOR`**: aligns the offerings theme blues/text to the master
  (`3C5AFD→3D5AFE`, `526DFD→536DFE`, `8B9DFE→8C9EFF`, `141617→151618`, `0D0D0F→0D0E0F`, `FEFFFF→FFFFFF`).
  The per-spec `recolor` is merged on top (wins) to tame decorative accents to blue/navy/off-white
  (e.g. yellow `FBC640`→`F2F3F7`/navy, purple `9746FE`→blue/gray).
- **`drop` per spec**: each offerings slide carries the Plain Concepts logo top-right (`<p:pic>`) + a page
  number placeholder; they must be `drop`ped (normalize only auto-removes the bar/accent/footer with
  `slidenum`). Some slides also carry a loose number literal (e.g. `21`, `26`) → drop.
- Step badges/numbers (1-6, H/M/L, Q1-Q4, In Progress/Planned/Completed) are left as fixed literals
  (they appear in the "leftover (un-slotted)" warning — expected, as in `capability-grid`).

## Manual `DISCLAIMER` slot patch (risks legal text)

`icon-list-split`, `numbered-list-callout`, `pros-cons-split` and `risk-table` — the 4 blueprints
`layout_alternates.py` allows for the `risks` section — each carry a **hand-patched** extra scalar
slot, `DISCLAIMER`: a small italic gray footnote line (id `9001`, no `group`, so an empty value just
renders as an invisible blank textbox on the other sections that reuse these same blueprints, e.g.
`our-solution`, `out-of-scope`, `prerequisites`). It sits in each blueprint's own available
whitespace, above the footer badge (position/size tuned per layout: tightest on `pros-cons-split`,
which has the least spare vertical room).

`plan.py` injects the fixed bilingual legal text into this slot deterministically
(`FIXED_SLOT_TEXT["risks"]["DISCLAIMER"]`) for every risks slide, regardless of which of the 4
blueprints the fit/dedup logic ends up choosing — see `2026_ProposalsAI_Master_Template-manifest.json`
slide 11's note. **This patch is manual and not reproducible by `build_blueprints.py`** — if any of
these 4 blueprints are ever regenerated from their spec, the `DISCLAIMER` `<p:sp>` (marker
`___SLOT_DISCLAIMER___`) and its `slots.json` entry must be re-added by hand.

## Slot types (slots.json)

- `scalar` — one line (header, label, title).
- `list` — array of strings → one `<a:p>` bullet per item.
- prunable group — `groups: {name: {ids, control_slot}}`; if the control_slot is empty, all its shapes are removed.
- `tables: [{name, header_rows, cols}]` — the header is kept verbatim; the content supplies
  `{name: [[cell, cell, …], …]}` and the template row is cloned per data item.

## Layouts with `manual` source
`two-col-contrast` is not regenerated by `build_blueprints.py` (it skips it). It was built by adapting
`three-col-cards/blueprint.xml` (2 cards, left header dark navy, right header blue).

`capacity-table` is also not regenerated by `build_blueprints.py`. It was built from the master's
`slide25.xml`: `SECTION` and `INTRO` were slotted, and the table was reduced to 3 rows (stage header +
1 role template row + a totals row). The fill accepts `{header, rows, footer}` (see
`fill_blueprint._fill_table`): `header_rows`/`footer_rows` mark the fixed rows and the middle row is
cloned per role.
