# Presentations

This repository contains the research, narrative source, editable decks, and review material for technical conference talks and presentations.

## Talks and source

- [`talks/`](talks/) contains one self-contained directory per presentation.

## Talk organization

Each talk lives at `talks/<talk-slug>/` and explains its own source material and build commands in its README. A talk adds only the directories it needs:

- `research/` for citations, source material, and derived notes;
- `content/` for briefs, fragments, narrative, or speaker notes that are independent of a deck format;
- `assets/` for presentation-owned images or media when the deck tool does not prescribe another location;
- `deck/` for editable presentation source and tool configuration.

Generated exports and dependency directories are ignored. Editable source and cited research remain canonical.

## Current talks

- The public catalogue is built from this repository and is intended for [`talks.jgcarmona.com`](https://talks.jgcarmona.com/).
- [Soft & Hard Guardrails](talks/soft-and-hard-guardrails/README.md) — a standalone English web experience about guidance and enforcement.
- [Ingeniería del Software 2.0](talks/ingenieria-del-software-2_0/README.md) — a talk about building and validating software with AI.

## Public catalogue

The root application is a small React/Vite catalogue. It is deliberately separate from each talk: the talk directories remain the canonical source, while the catalogue provides the public index and links back to the editable material.

```bash
npm ci --ignore-scripts
npm run dev
```

Use Node 22.18+ for native TypeScript support in the Node tests (Node 24 is also supported). The root npm lock is the only active dependency graph; all dependencies resolve from the public npm registry. Installation does not require lifecycle scripts, private repository credentials or talk-local dependencies. The build never installs packages.

```bash
npm run verify
npm run preview
```

`npm run verify` runs the Lighthouse baseline check, static build and complete test suite. `npm run build` checks both talk graphs, builds Vite and emits/validates five physical HTML entries plus `dist/site-manifest.json`. `npm test` requires that build and Chromium at `/usr/bin/chromium` (configured explicitly in `playwright.config.mjs`); it runs unit, full-build failure, static-only browser and every-scene accessibility checks. Test tooling is development-only. Reports/captures go to ignored `test-reports/` and `test-results/`.

### Ordinary static hosting

```bash
npm run serve:static
```

Open `http://127.0.0.1:4173`. This server serves only `dist/`, supports directory indexes and returns 404 for missing files; there is **no SPA fallback**. Publish the whole `dist/` directory to a domain-root static host with directory indexes. Subpath hosting is not supported by this change. `npm run preview` is convenient for review, but the tests use the strict static server.

### Cloudflare Workers

The catalogue is deployed as a static-assets Worker, not Pages. `wrangler.jsonc` declares the Worker and serves the already verified `dist/` directory; Wrangler does not need to detect Vite or rewrite the build configuration. In Workers Builds, use `npm ci --ignore-scripts` for the install command, `npm run build` for the build command, and `npm run deploy` for the deploy command. The deploy command requires no extra build, so strict static verification runs once before upload. Missing paths remain 404s.

Supported entries: `/`, `/software-engineering-2_0/`, `/soft-and-hard-guardrails/`, and `/decks/<published-slug>/` for both talks. Canonical and legacy entries show the same full experience, not a presentation iframe. Deep links use `#scene=<stable-id>`; absent/unknown scene fragments select the cover. Old undocumented Slidev numeric subroutes are not supported.

### Reading and presenting

Use Previous/Next or ArrowRight/PageDown and ArrowLeft/PageUp on noninteractive surfaces. Navigation stops at the ends. Space and Up/Down keep their scrolling behavior; links, buttons, editable fields, media and ARIA widgets keep their own keys. Only the current scene is mounted. Controls retain focus; when the focused navigation button becomes disabled at a boundary, focus moves to the other enabled navigation button. A focused descendant removed by scene navigation transfers focus to the new heading. Long content scrolls normally; code/tables have labelled scroll regions. Appearance cycles through system/dark/light, and reduced motion disables scene animation. Overview, source and catalog links remain available.

The Spanish closing video is externally hosted on YouTube and needs a connection; it has a named player, source link and persistent contextual fallback. No media fetch is required to build. Diagrams use original DOM equivalents rather than copying the keynote reference or theme artwork. See each talk's coverage map for the exact migration baseline and asset decisions.

### Delivery status and verification

The owner [accepted the first delivery and authorized integration](https://github.com/juangcarmona/presentations/pull/38#issuecomment-6404327905) of both talks. PR #38 is merged; visual polish is tracked in [#39](https://github.com/juangcarmona/presentations/issues/39). Automated checks do not replace manual accessibility and original-source review.

Continuous integration performs a fresh locked public install, the full build and Chromium tests, and retains revision-bound static/browser artifacts. Failure fixtures verify that invalid talk source and missing assets stop verification. Slidev-oriented documents are not the active authoring path for these talks.

## Tooling

Editable React scenes and talk-specific CSS live under each talk's `deck/`. Use the root npm workflow above for both talks. Speaker notes live in talk-local `content/speaker-notes.md` and are never imported or copied into `dist/`. Vite's public directory copying and distributed source maps are disabled. Local assets must be explicitly imported so missing files fail the complete build. Archived source assets under talk directories are not distributed. PDF/PowerPoint/Slidev export commands are retired; export parity is not part of this migration.

Browser checks use system Chromium when available. Otherwise install the matching browser with `npm exec --no -- playwright install chromium` before `npm test`; the static build needs no browser.
