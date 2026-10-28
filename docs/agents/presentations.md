# Presentation repository model

Read this when creating or reorganizing a talk, choosing its format, or deciding where presentation files belong.

## Talk boundary

Each talk lives in `talks/<talk-slug>/`. Read its `README.md` first; it defines the talk's content, current source, asset locations, and commands.

Talks add only the directories they need:

| Location | Responsibility |
| --- | --- |
| `README.md` | Talk identity, source map, status, and talk-specific usage |
| `research/` | Citations, source material, experiments, and clearly labelled derived notes |
| `content/` | Briefs, fragments, narrative, abstracts, submissions, and speaker notes independent of a renderer |
| `assets/` | Talk-owned images and media when the active format does not prescribe another public-assets directory |
| `deck/` | Editable presentation source, renderer configuration, and talk-local build tooling |

## Current delivery

The root React/Vite app builds the public catalogue and standalone talk routes. Current talk scenes and CSS live under each talk's `deck/`; root `src/` owns catalogue and shared routing code. Follow the talk README when changing its source. New talks may choose another format when the deliverable requires it, with their source and commands kept inside the talk boundary.

Editable source is canonical. Keep generated renders, exports, caches, and dependencies ignored unless a talk README explains why a fixed deliverable is versioned. The public build and Cloudflare Worker configuration are repository-owned delivery surfaces; preserve them when changing authoring tools.

## Sources of truth

| Information | Canonical owner |
| --- | --- |
| Repository agent instructions | `AGENTS.md` |
| Claude compatibility | `CLAUDE.md`, importing `AGENTS.md` |
| Reusable capabilities | `.agents/skills/<skill>/` |
| Locked third-party skill provenance | `skills-lock.json` |
| Shared presentation conventions | `docs/agents/` |
| Talk definition and local usage | `talks/<talk-slug>/README.md` |
| Talk research and citations | `talks/<talk-slug>/research/` |
| Renderer-independent narrative | `talks/<talk-slug>/content/` |
| Editable presentation source | `talks/<talk-slug>/deck/` |

Point from workflows and skills to these locations instead of copying their rules.
