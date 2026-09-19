# Presentation Composition Guide

How to choose layouts, structure slides, and avoid visual defects.
Used by `pptx-editor` and `content`.

> **This file is the primary design reference.** It tells you WHAT layout to use for WHAT content.
> For colors, fonts, and margins see [style.md](style.md).

---

## 1. Content → Layout Mapping

> **Executable mirror:** the per-section and per-`kind` choices below are encoded as ordered
> `[primary, ...alternates]` lists in `../scripts/layout_alternates.py` (`BY_SECTION` / `BY_KIND`).
> `plan.py` (proposal) and `plan-free` (free) read that table to emit each slide's
> `blueprint_options`; `outline` then picks the final fit from those options and enforces
> layout variety. **Keep this guide and `layout_alternates.py` in sync** when adding a blueprint.

When generating slides for proposal sections, match content type to layout:

| Content type | `layout_hint` | Source slide | Structure |
|---|---|---|---|
| 3-4 parallel points / pillars / benefits | `three-col-cards` | Master #5 | Blue header box + off-white bordered body per column |
| 3-4 benefits/outcomes with icons | `benefits-icons` | Agentes #16 | 4 columns: icon + header + prose; empty columns prune (incl. icon) |
| Process / phased steps with details | `phase-detail-left-right` | Master #6 | Phase title left, activity list right |
| Phase with dark block + numbered steps | `phase-dark-left` | Master #7 | Dark left block, numbered steps right |
| General two-column content + callout | `two-col-text-callout` | Master #8 | Text left, highlighted callout box right |
| Icon + label pairs with descriptions | `icon-list-split` | Master #9 | Up to 4 full-width stacked blocks: bold label over a wrapped description, spread vertically. Keep each value ≤2–3 lines; for >3 dense items split the slide. (For a list + highlighted callout sidebar use `two-col-text-callout`.) |
| Architecture diagram + tech stack | `arch-diagram-tech` | Master #14 | Diagram area left, technology list right |
| Numbered advantages + callout | `numbered-list-callout` | Master #20 | Numbered items left, blue callout right |
| Two teams or roles side-by-side | `team-dual-col` | Master #21 | Two columns with role cards |
| Client + PC hybrid team | `hybrid-team` | Master #22 | Split client/PC with interaction lines |
| Stats / KPIs + summary panel | `value-stats-cta` | Sermes #5 | Up to 3 big-number stat cards (STATn + label + desc) over a full-width highlight panel; cards & panel prune |
| Client roles vs PC roles | `roles-two-col` | Master #24 or #26 | Two-column role comparison |
| Tiered levels (project/tactical/exec) | `comms-tiered` | Master #27 | 3 tiered horizontal levels |
| Investment total + milestone breakdown | `budget-summary` | Master #29 | Total figure + milestone cards |
| Rate table by profile | `pricing-table` | Master #31 | Profile × rate table |
| Generic requirements / dependencies table | `data-table` | Agentes #10 | Blue-header 2-col table (Type/Description); fill ROWS, header overridable |
| Pricing options A / B / C | `three-options` | Master #32 | Three option cards with pricing |
| 6-tile icon + service name grid | `services-grid` | Master #33 | 2×3 grid of icon + label |
| 5-6 numbered capabilities / features | `capability-grid` | Agentes #8 | 3×2 grid of numbered cards (badge + header + prose); empty cards prune |
| Executive summary cards | `summary-cards` | Manual (ref Example) | Light panel with 2×3 grid of accent-bar + title + prose cells; cells prune |
| Before/after or problem/solution | `two-col-contrast` | Example #4 | Dark header left (e.g. TODAY), blue header right (e.g. WITH THE SOLUTION) |
| Framework pillars | `framework-pillars` | Manual (ref Example) | Central hub box + ▼ connector + row of 4 supporting pillar cards; pillars prune |
| Sequential / numbered process steps | `numbered-pipeline` | Manual (ref Example) | Horizontal row of 5 numbered step cards (badge + header + prose); steps prune |
| Pain points vs opportunities / pros vs cons | `pros-cons-split` | Sermes #22 | Two columns: up to 5 red numbered pain cards left, up to 5 green opportunity cards right; cards prune. Only layout with semantic red/green contrast |
| Layered / banded architecture | `layered-architecture` | Sermes #7 | Stack of up to 6 full-width horizontal layer bands (navy→blue→light ramp) + 2 optional column heads on band 2; bands prune |
| Maturity staircase | `maturity-staircase` | Example #18 (deferred) | Ascending step levels showing progression |

**Thumbnail reference**: see `../resources/2026_ProposalsAI_Master_Template/2026_ProposalsAI_Master_Template-thumbnails-*.jpg` (Master).

> **Note**: The master template has 30+ layout masters; not all are catalogued here. When generating new slides, prefer a catalogued layout.

---

## 2. Hard Rules

Violating any of these = defect that must be fixed before delivery.

### Layout variety

1. **No two consecutive slides may use the same layout.** Check the preceding slide's layout and pick a different one.
2. **Every non-cover, non-divider slide must contain ≥1 non-text visual element**: filled shape, icon, chart, diagram, or image. Text-only slides are a defect.
3. **Cards: no rounded corners, no shadows.** Blue filled header + off-white bordered body. Always.

### Slide structure

4. **Section label**: uppercase, Primary Blue (`2F69FF`), top-left, wide tracking. Acts as subtle header.
5. **Content area**: 9" × 4.6". Nothing below Y = 5.1".
6. **Left accent bar**: 0.06" blue rectangle on every internal slide (except covers and dark dividers).
7. **Footer**: logo + page number in dark navy box, bottom-right, every non-cover slide.
8. **Agenda progress slides**: Insert an agenda/TOC slide at the start of each major section to orient the reader. Highlight the current section (use accent color or bold). Clone the TOC slide from the template and highlight the current section.

### Typography on slides

8. **Section label style** — Use Style 1 (simple uppercase label) for transition/thematic slides. Use Style 2 (label + large main title) for content-heavy slides.
9. **Body text**: left-aligned, never centered (only titles centered).
10. **Bold** all headers, subheadings, and inline labels (e.g., "Status:", "Description:").

### When cloning from template

11. **Edit only `<a:t>` text nodes.** Never remove or restyle background rectangles, fills, or decorative shapes — they ARE the layout.
12. **Template slots ≠ source items.** If template has 4 card slots but content has 3, delete the 4th card's entire group (image + text boxes), not just the text.

---

## 3. Anti-Patterns

These are instant signals of AI-generated slides. Avoid them.

| Anti-pattern | Why it's wrong | What to do instead |
|---|---|---|
| Accent line under title | Hallmark of AI-generated decks | Use whitespace or background color for separation |
| Centered body text / bullet lists | Looks amateur, hard to read | Left-align paragraphs and lists |
| Same layout on 2+ consecutive slides | Monotonous, looks templated | Alternate between cards, columns, diagrams, tables |
| Text-only slides (just bullets) | Forgettable, no visual hierarchy | Add shapes, icons, or restructure as cards |
| Generic blue `#4472C4` | Not brand color | Always use Primary Blue `#2F69FF` |
| Rounded corners on cards | Breaks brand consistency | Sharp corners only |
| Decorative shadows on cards | Not in brand system | Flat design only |
| Content below Y = 5.1" | Overflows slide | Trim content or split into 2 slides |
| Missing page number | Inconsistent | Footer chrome on every non-cover slide |
| Missing left accent bar | Breaks visual consistency | Add 0.06" blue bar on internal slides |

---

## 4. Section → Layout Defaults

For `proposal` sections, these are the default layout assignments unless content demands
otherwise. The **primary** matches the manifest `layout_hint`; the full ordered
`[primary, ...alternates]` per section lives in `../scripts/layout_alternates.py` `BY_SECTION` and is
what `outline` chooses the fit from:

| Section (slug) | Default layout | Why |
|---|---|---|
| Our Solution (`our-solution`) | `three-col-cards` or `icon-list-split` | Parallel capabilities or solution pillars |
| Indicative Scope (`indicative-scope`) | `three-col-cards` | One card per epic/feature group |
| Out of Scope (`out-of-scope`) | `two-col-text-callout` | Short list + callout with implications |
| Risks & Uncertainties (`risks`) | `icon-list-split`, `numbered-list-callout`, or `pros-cons-split` | Risk items with descriptions; pros/cons if structured as advantages/disadvantages |
| Prerequisites (`prerequisites`) | `icon-list-split` | Prerequisites with icons |
| Current State (`current-state`, optional) | `two-col-contrast` | Before/after comparison |
| Technology Solution (`technology-solution`) | `arch-diagram-tech` | Diagram + tech stack |
| Team (`plan-and-team`) | `team-dual-col` or `hybrid-team` | Depends on delivery model. Roles come from the reasoned capacity plan (`04-capacity-plan`), which derives the **minimum effective set** of roles from responsibilities/risks — do not assume a fixed set (no default Engineering Manager / Product Owner / Tech Lead). Map each `teamComposition` role, allocation, and justification into the slot values. |
| Budget (`budget`) | `budget-summary` or `pricing-table` | Depends on collaboration type |

---

## 5. Decision Rules by Collaboration Type

These rules determine which slides to include/omit based on the collaboration model:

| `collaboration_type` | Scope section | Risks section | Team layout | Pricing layout | CTA |
|---|---|---|---|---|---|
| `fixed_price` | included | included | `team-dual-col` (auto) | `budget-summary` + milestones | included |
| `tm_scope` | included | included | `team-dual-col` or `hybrid-team` | `pricing-table` by work package | included |
| `capacity` | omit | omit | `hybrid-team` | `pricing-table` by role | omit |

### Conditional slides

- `comparison-before-after` (`two-col-contrast`) → only if initial technical state confirmed
- `methodology-5-phases` + `phase-detail` → only if `phased = true`
- `quarterly-roadmap` instead of `execution-timeline` → only if `capacity`
- `phase-detail` for Discovery → only if `has_discovery = true`, as first phase
- `governance-model` (`comms-tiered`) → only if `capacity`
