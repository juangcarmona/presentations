# Soft & Hard Guardrails

A Slidev presentation about guidance that influences development and enforcement that mechanically blocks unsafe outcomes.

## Sources

- [`research/concepts/`](research/concepts/) contains the two original HTML concept decks used as visual and content references.
- [`research/extracts/`](research/extracts/) contains text derived from those HTML files during development. The extracts are preserved as working research, not as the canonical deck source.
- [`deck/slides.md`](deck/slides.md) and [`deck/pages/`](deck/pages/) are the maintained presentation source.

The unused `13-takeaway.md` was an exact duplicate of the referenced `14-takeaway.md` and has been removed.

## Run locally

```bash
cd talks/soft-and-hard-guardrails/deck
pnpm install
pnpm dev
```

Open the local URL printed by Slidev.

## Build or export

```bash
pnpm build
pnpm export
```

`dist/`, exported PDFs, Slidev caches, and `node_modules/` are generated and ignored. The deck uses the published `slidev-theme-chapter-plain` dependency declared in [`deck/package.json`](deck/package.json).
