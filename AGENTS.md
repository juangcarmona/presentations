# Presentations repository

The root app publishes the public talk catalogue and standalone talk routes. Talk content, source, and assets belong to their talk directory.

## Context map

- Before changing a talk, read `talks/<talk-slug>/README.md` and `docs/agents/presentations.md`.
- Use `research` for factual research and keep its sources under the target talk's `research/` directory.
- Use `anydoc` when a task needs the contents of an office document converted to Markdown.
- Use `writing-fragments` to explore raw material, then `writing-shape` or `writing-beats` to shape a narrative. Use `presentation-brief` when a stable idea needs an ordered scene plan.
- Use `presentation-qa` to review a rendered talk experience. The current talks use React scenes; choose the format documented by the talk rather than assuming a renderer.
- Use `writing-for-agents` when editing repository instructions, skills, or workflows.
- Use the generated `lighthouse-init` skill when initializing a Lighthouse baseline; preview its plan and review it before applying.
- Read `LIGHTHOUSE.md` for the generated repository baseline. When configuring Lighthouse delivery, credentials, or workflows, read `docs/agents/lighthouse-operations.md` and the installed SDLC guide before making changes.

## Repository boundaries

- Keep reusable skills under `.agents/skills/`; `skills-lock.json` records provenance and content hashes for locked third-party skills.
- Keep shared presentation conventions in `docs/agents/` and talk-specific research, narrative, assets, and editable source in `talks/<talk-slug>/`.
- The root application owns the public catalogue and its routes. Preserve the talk experiences, public images, static build, and Cloudflare Worker configuration when changing repository tooling.
- Treat editable talk source as canonical. Keep generated exports, caches, and dependencies out of version control unless a talk README identifies an intentional deliverable.
- Use the repository's existing npm scripts for build and verification. Keep one canonical home for each policy and link to it instead of duplicating it.
