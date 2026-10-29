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

Use Node 24 for the Node tests' native TypeScript support. The root npm lock is the only active dependency graph; all dependencies resolve from the public npm registry. Installation does not require lifecycle scripts, private repository credentials or talk-local dependencies. The build never installs packages.

```bash
npm run verify
npm run preview
```

`npm run verify` runs the Lighthouse baseline check, static build and complete test suite. `npm run build` checks both talk graphs, builds the catalogue and the bilingual talk's independent Vite entry, and emits/validates five physical HTML entries plus `dist/site-manifest.json`. `npm test` requires that build and Chromium (system or Playwright-installed); it runs unit, full-build failure, static-only browser and representative accessibility checks. Test tooling is development-only. Reports/captures go to ignored `test-reports/` and `test-results/`.

### Ordinary static hosting

```bash
npm run serve:static
```

Open `http://127.0.0.1:4173`. This server serves only `dist/`, supports directory indexes and returns 404 for missing files; there is **no SPA fallback**. Publish the whole `dist/` directory to a domain-root static host with directory indexes. Subpath hosting is not supported by this change. `npm run preview` is convenient for review, but the tests use the strict static server.

### Cloudflare Workers

The catalogue is deployed as a static-assets Worker, not Pages. `wrangler.jsonc` declares the Worker and serves the already verified `dist/` directory; Wrangler does not need to detect Vite or rewrite the build configuration. In Workers Builds, use `npm ci --ignore-scripts` for the install command, `npm run build` for the build command, and `npm run deploy` for the deploy command. The deploy command requires no extra build, so strict static verification runs once before upload. Missing paths remain 404s.

Supported entries: `/`, `/software-engineering-2_0/`, `/soft-and-hard-guardrails/`, and `/decks/<published-slug>/` for both talks. Canonical and legacy entries show the same full experience, not a presentation iframe. The software-engineering talk defaults to Spanish; its cover switches between ES and EN without leaving the page. Share an English scene with `?lang=en#scene=<stable-id>`. Absent/unknown scene fragments select the cover. Old undocumented Slidev numeric subroutes are not supported.

### Reading and presenting

The bilingual keynote uses ArrowRight/PageDown and ArrowLeft/PageUp, or horizontal touch swipes, without visible navigation controls. Navigation stops at the ends. Space and Up/Down keep their scrolling behavior; links, buttons, editable fields, media and ARIA widgets keep their own keys. Only the current scene is mounted. A focused descendant removed by scene navigation transfers focus to the new heading. Long content scrolls normally; code has a labelled scroll region. A translucent lower-left HUD shows elapsed time, slide number and progress; the EN/ES selector appears only on the cover. Interactive diagrams reveal details on hover, focus or tap. Reduced motion disables scene animation. Use the browser's fullscreen shortcut (F11) when presenting. The other English talk retains its own system/dark/light appearance and controls.

The closing video is externally hosted on YouTube and needs a connection; it has a named player, source link and persistent contextual fallback. No media fetch is required to build. The bilingual page publishes the ten original owner-approved assets, including links to source diagrams and a stoppable GIF demo with static steps. The GIF does not start with reduced motion enabled. See each talk's coverage map for the exact migration baseline and asset decisions.

### Delivery status and verification

The owner [accepted the first delivery and authorized integration](https://github.com/juangcarmona/presentations/pull/38#issuecomment-6404327905) of both talks. PR #38 is merged. [Issue #53](https://github.com/juangcarmona/presentations/issues/53) supersedes conflicting visual-only constraints in #39 and restores the Spanish talk as an independent presentation. This redesign still requires owner visual/content acceptance of its desktop preview. Automated checks do not replace that decision or manual accessibility review.

Continuous integration performs a fresh locked public install, the full build and Chromium tests, and retains revision-bound static/browser artifacts. Failure fixtures verify that invalid talk source and missing assets stop verification. Slidev-oriented documents are not the active authoring path for these talks.

## Tooling

Editable React scenes and talk-specific CSS live under each talk's `deck/`. Use the root npm workflow above for both talks. The Spanish talk owns its HTML entry, renderer, styles and intermediate `deck/dist/`; the root build assembles that independent output into the Worker distribution. The catalogue imports only its metadata and links, and future talks need not share its renderer or theme. Speaker notes live in talk-local `content/speaker-notes.md` and are never imported or copied into `dist/`. Vite's public directory copying and distributed source maps are disabled. Local assets must be explicitly imported so missing files fail the complete build. PDF/PowerPoint/Slidev export commands are retired; export parity is not part of this migration.

Browser checks use system Chromium when available. Otherwise install the matching browser with `npm exec --no -- playwright install chromium` before `npm test`; the static build needs no browser.
