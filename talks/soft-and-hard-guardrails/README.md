# Soft & Hard Guardrails

A standalone English talk about guidance that influences development and enforcement that mechanically blocks unsafe outcomes. 2026 · DevEx Chapter Roundtable.

## Canonical sources

- [`deck/experience.tsx`](deck/experience.tsx): all 15 ordered explicit React scenes; stable IDs are part of the public URL contract.
- [`deck/scenes.css`](deck/scenes.css): original talk-local visual motifs.
- [`content/speaker-notes.md`](content/speaker-notes.md): author-only notes index. The original English source contained no speaker notes; each source unit is explicitly accounted for.
- [`content/coverage.md`](content/coverage.md): cover plus every original page, code/citation/media coverage and original-source fingerprints.
- [`research/concepts/`](research/concepts/): original HTML concept decks. [`research/extracts/`](research/extracts/) is derived research, not the maintained presentation.

The unused `13-takeaway.md` was previously removed as an exact duplicate. The canonical final scene remains `14-takeaway`.

## Build and review

From the repository root, follow the [locked install, full build, browser checks and preview contract](../../README.md#public-catalogue). Open `/soft-and-hard-guardrails/`; the legacy `/decks/soft-and-hard-guardrails/` also works with directory indexes and no rewrite server. For a code example, use `#scene=08-console-compile`.

Previous/Next, ArrowRight/PageDown and ArrowLeft/PageUp progress without wrapping; interactive controls retain their native keys. Scenes scroll vertically, code/tables use labelled bounded overflow, and system/light/dark plus reduced-motion preferences are supported. See the root guide for focus and static-host details.

Edit JSX, not retired Slidev Markdown. One root public dependency graph builds both talks; there is no talk-local install, private theme or presentation framework. Author notes are not runtime imports. `dist/`, screenshots and reports are generated artifacts. Old Slidev PDF/PowerPoint exports are not supported. Original concept material is preserved as research.

The owner accepted the first delivery in PR #38; visual polish is tracked in #39. See the [delivery status and verification limits](../../README.md#delivery-status-and-verification). Automated tests do not replace the remaining manual checks.
