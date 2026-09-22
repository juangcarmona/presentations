# Presentations

This repository contains the research, narrative source, editable decks, and review material for technical conference talks and presentations.

## Repository structure

- [`talks/`](talks/) contains one self-contained directory per presentation.
- [`.agents/skills/`](.agents/skills/) contains reusable research, writing, deck-building, and review capabilities. Third-party skill provenance is recorded in [`skills-lock.json`](skills-lock.json).
- [`.agents/commands/`](.agents/commands/) contains repository workflows that compose those skills.
- [`docs/agents/`](docs/agents/) contains shared presentation conventions loaded only when relevant.
- [`AGENTS.md`](AGENTS.md) is the canonical entry point for agent instructions. `CLAUDE.md` imports it rather than maintaining a second copy.

## Talk organization

Each talk lives at `talks/<talk-slug>/` and explains its own source material and build commands in its README. A talk adds only the directories it needs:

- `research/` for citations, source material, and derived notes;
- `content/` for briefs, fragments, narrative, or speaker notes that are independent of a deck format;
- `assets/` for presentation-owned images or media when the deck tool does not prescribe another location;
- `deck/` for editable presentation source and tool configuration.

Generated exports and dependency directories are ignored. Editable source and cited research remain canonical.

## Workflows

The repository workflows cover the useful lifecycle operations:

- [`new-talk`](.agents/commands/new-talk.md)
- [`research-talk`](.agents/commands/research-talk.md)
- [`plan-talk`](.agents/commands/plan-talk.md)
- [`build-deck`](.agents/commands/build-deck.md)
- [`review-talk`](.agents/commands/review-talk.md)

These are plain Markdown definitions so an agent harness can expose them using its own command mechanism.

## Current talks

- [Soft & Hard Guardrails](talks/soft-and-hard-guardrails/README.md) — a Slidev talk using the Plain Concepts Chapters theme.

## Tooling

Deck tooling is local to each talk or reusable skill. Run a talk from its `deck/` directory using the commands in that talk's README.
