# Proposal

## Why

The full publishing path builds both talks through Slidev and a GitHub-hosted theme, while CI verifies only the catalog. Issue [18](https://github.com/juangcarmona/presentations/issues/18) requests independently buildable, static web experiences that preserve the talks and can be reviewed before migration completion.

## What Changes

- Replace Slidev rendering for Ingeniería del Software 2.0 (Spanish) and Soft & Hard Guardrails (English) with original scenes and keyboard-safe web navigation.
- Retain substantive narrative, examples, citations, media meaning and editable author notes; maintain a source-to-scene coverage map.
- Integrate complete experiences with the catalog and emit physical static entry points for canonical and existing `/decks/<slug>/` URLs.
- Use restrained, original typography and DOM/SVG storytelling inspired by the recorded keynote research, not its code or assets.
- **BREAKING**: retire the two talks' Slidev/pnpm authoring and export commands in favor of the documented root npm workflow. PDF/PowerPoint parity is not included; public entry URLs remain supported.
- Make a credential-free locked install and full build the clean CI contract. Provide complete built previews and record explicit owner visual/content acceptance before declaring migration complete.

## Capabilities

### New Capabilities

- `standalone-talks`: content-preserving, accessible scene navigation and rendered acceptance for the two talks.
- `static-site-delivery`: independent full builds, static URL compatibility, clean CI and author build instructions.

### Modified Capabilities

None. `/workspace/openspec` is absent at the supplied checkout; there are no existing capability specifications or active change artifacts to modify. The supplied OpenSpec 1.15.0 instructions are used without installing or invoking the provider in the engine.

## Impact

Affected areas: `src/App.tsx`, talk metadata, new shared scene navigation, talk-local `deck/` sources and assets, `scripts/build-decks.mjs`, root manifests/lockfile, Vite build configuration, `verify-catalog.yml`, talk READMEs and active authoring conventions. The output remains static files; no backend, authentication, CMS or presentation framework is introduced. Installed third-party skills and their provenance remain unchanged.

Product intent is issue 18 and the [verified owner answer](https://github.com/juangcarmona/presentations/issues/18#issuecomment-6395473323), recognized by `docs/engineering/repository-refinement.md`. The passed refinement supplies AC1–AC8; design and tasks trace all eight. ProductShape/ArcShape are not installed product authorities here; this proposal does not waive the separate publication requirements in `LIGHTHOUSE.md`.

**Gate: planned.** This is a candidate for owner review, not approval to implement, publish or merge. No fresh builds, rendered parity checks or visual acceptance have occurred in this proposal run.
