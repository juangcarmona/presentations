# Presentations repository

This repository develops technical talks from research through editable deck source and review.

## Repository model

- Presentations live in `talks/<talk-slug>/`. Read the talk's `README.md` before changing it.
- Reusable capabilities live in `.agents/skills/`; `skills-lock.json` records installed third-party provenance.
- Repository operations live in `.agents/commands/` and orchestrate skills without restating them.
- Shared presentation knowledge lives in `docs/agents/`.

## Context map

- For repository refinement, read `docs/engineering/repository-refinement.md` for issue authority, owner-answer continuation and human gates. GitHub workflows own execution; SoFa is an optional observer.

- Read `docs/agents/presentations.md` when creating or reorganizing a talk, choosing a deck format, or deciding where source and generated files belong.
- Use `research` when gathering factual material; store its output under the target talk's `research/` directory.
- Use `anydoc` when a task needs the contents of an office document (Word, PowerPoint, Excel, PDF, etc.) converted to Markdown.
- Use `writing-fragments` to explore raw ideas, then `writing-shape` or `writing-beats` to form a narrative. Use `presentation-brief` to turn stable material into a slide plan.
- Use `slidev-deck` when building a Slidev deck, then `presentation-qa` when reviewing a render.
- Use `writing-for-agents` when editing `AGENTS.md`, `CLAUDE.md`, a skill, a workflow, or an agent-facing document.

## Invariants

- Keep each rule or fact in one canonical location and point to it from other contexts.
- Keep talk-specific research, narrative, assets, configuration, and deck source inside that talk.
- Treat editable source as canonical. Keep generated exports, caches, and dependencies ignored unless a deliverable is intentionally versioned.
- Preserve installed skills and `skills-lock.json`; change third-party skill contents only as an explicit skill update.
