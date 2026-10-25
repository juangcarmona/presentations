# Presentation repository model

Read this document when creating or reorganizing a talk, choosing a deck format, or deciding where presentation files belong.

## Talk boundary

Every presentation lives at `talks/<talk-slug>/`. Its README defines the talk, identifies the current source material, and gives the commands needed to work on its deck.

A talk adds only the directories it needs:

| Location | Responsibility |
| --- | --- |
| `README.md` | Talk identity, status, source map, and talk-specific usage |
| `research/` | Citations, source material, experiments, and clearly labelled derived notes |
| `content/` | Briefs, fragments, narrative, abstracts, submissions, and speaker notes independent of a renderer |
| `assets/` | Talk-owned images, diagrams, audio, or video when the renderer does not prescribe a public-assets directory |
| `deck/` | Editable presentation source, renderer configuration, and talk-local build tooling |

Do not create empty directories in anticipation of future work. Add them when the talk has material for them.

## Deck formats

The two current talks use explicit React scenes in talk-local `deck/experience.tsx` and local CSS. The root registry lazily loads those exports; the root npm lock is the only active install contract. Use the [root build and navigation contract](../../README.md#public-catalogue). Installed Slidev skills and historical command definitions remain preserved but are not the active path for these talks.

Keep stable scene IDs, ordered titles and language in the experience export. Shared `src/Experience.tsx` owns navigation/focus; talk components own content. A new source unit must have a coverage row. Keep author-only notes under `content/`, keyed by scene ID, and never import/glob them into runtime modules. Keep code and essential diagrams readable as DOM with labelled overflow when needed. Local assets must be explicit imports; `public/` is not copied automatically.

Choose a format because the deliverable requires it.

## Sources of truth

| Information | Canonical owner |
| --- | --- |
| Repository instructions | `AGENTS.md` |
| Claude compatibility | `CLAUDE.md`, importing `AGENTS.md` |
| Reusable capability instructions | `.agents/skills/<skill>/` |
| Installed skill provenance | `skills-lock.json` |
| Repository workflows | `.agents/commands/` |
| Shared presentation conventions | `docs/agents/` |
| Talk definition and local usage | `talks/<talk-slug>/README.md` |
| Talk research and citations | `talks/<talk-slug>/research/` |
| Renderer-independent narrative | `talks/<talk-slug>/content/` |
| Editable deck source | `talks/<talk-slug>/deck/` |
| Generated presentations and renders | Ignored output directories beside the deck source |

References are preferable to copied explanations. A workflow points to a skill for method and to this document for repository placement; a talk README records only facts specific to that talk.

## Generated artifacts

The root build writes the complete static site and manifest to `dist/`. Browser captures/reports go to `test-results/` and `test-reports/`. The historical PowerPoint engine uses `working/` and `_outputs/`; these are not active web build inputs. Generated output, dependencies and caches remain ignored. Current migration does not promise PDF/PowerPoint export parity.

Generated files are validation and delivery artifacts, not narrative sources. Version one only when the repository intentionally needs a fixed deliverable and its talk README says why.
