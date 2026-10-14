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

Slidev is the current path for narrative and technical-demo decks. Keep its entry point and page sources together under the talk's `deck/` directory. The package manifest is the canonical theme dependency; a local theme checkout may be inspected during development but is not part of this repository contract.

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

Slidev writes generated sites to `dist/` and may export PDFs from the deck directory. The PowerPoint engine writes working state to `working/` and presentations to `_outputs/`. These paths, plus dependencies and caches, are ignored repository-wide.

Generated files are validation and delivery artifacts, not narrative sources. Version one only when the repository intentionally needs a fixed deliverable and its talk README says why.
