# Presentations

This repository hosts the public talks catalogue and the Soft & Hard Guardrails talk. Software Engineering 2.0 has its own repository and site.

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
- [Ingeniería del Software 2.0](https://github.com/juangcarmona/talk-se2) — independent bilingual talk, intended for [se2.jgcarmona.com](https://se2.jgcarmona.com/).

## Public catalogue

The root application is a small React/Vite catalogue. It links to the independent Software Engineering 2.0 site and builds the local guardrails experience.

```bash
npm ci --ignore-scripts
npm run dev
```

Use Node 24 for the Node tests' native TypeScript support. The root npm lock is the only active dependency graph; all dependencies resolve from the public npm registry. Installation does not require lifecycle scripts, private repository credentials or talk-local dependencies. The build never installs packages.

```bash
npm run verify
npm run preview
```

`npm run verify` runs the Lighthouse baseline check, static build and test suite. `npm run build` builds the catalogue and guardrails experience, then emits/validates five physical HTML entries plus `dist/site-manifest.json`. Two entries redirect old Software Engineering 2.0 URLs to its new domain, preserving query and hash. `npm test` requires that build and Chromium (system or Playwright-installed). Test tooling is development-only.

### Ordinary static hosting

```bash
npm run serve:static
```

Open `http://127.0.0.1:4173`. This server serves only `dist/`, supports directory indexes and returns 404 for missing files; there is **no SPA fallback**. Publish the whole `dist/` directory to a domain-root static host with directory indexes. Subpath hosting is not supported by this change. `npm run preview` is convenient for review, but the tests use the strict static server.

### Cloudflare Workers

The catalogue is deployed as a static-assets Worker, not Pages. `wrangler.jsonc` declares the Worker and serves the already verified `dist/` directory; Wrangler does not need to detect Vite or rewrite the build configuration. In Workers Builds, use `npm ci --ignore-scripts` for the install command, `npm run build` for the build command, and `npm run deploy` for the deploy command. The deploy command requires no extra build, so strict static verification runs once before upload. Missing paths remain 404s.

Supported entries: `/`, `/soft-and-hard-guardrails/`, and `/decks/soft-and-hard-guardrails/`. `/software-engineering-2_0/` and `/decks/software-engineering-2_0/` are compatibility redirects to `https://se2.jgcarmona.com/`. Deploy the new site and verify its domain before merging the catalogue change.

### Reading and presenting

See the [talk-se2 repository](https://github.com/juangcarmona/talk-se2) for the bilingual keynote's source and presentation instructions. The local guardrails talk retains its own system/dark/light appearance and controls.

The local guardrails talk's video is externally hosted on YouTube and needs a connection. No media fetch is required to build. Its coverage map records the migration baseline.

### Delivery status and verification

The owner [accepted the first delivery and authorized integration](https://github.com/juangcarmona/presentations/pull/38#issuecomment-6404327905) of both talks. PR #38 is merged. [Issue #53](https://github.com/juangcarmona/presentations/issues/53) supersedes conflicting visual-only constraints in #39 and restores the Spanish talk as an independent presentation. This redesign still requires owner visual/content acceptance of its desktop preview. Automated checks do not replace that decision or manual accessibility review.

Continuous integration performs a fresh locked public install, the full build and Chromium tests, and retains revision-bound static/browser artifacts. Failure fixtures verify that invalid talk source and missing assets stop verification. Slidev-oriented documents are not the active authoring path for these talks.

## Tooling

Editable React scenes and talk-specific CSS for guardrails live under `talks/soft-and-hard-guardrails/deck/`. The catalogue keeps only metadata and an external link for Software Engineering 2.0. Speaker notes remain outside `dist/`; Vite's public directory copying and distributed source maps are disabled. Each site is built and deployed independently.

Browser checks use system Chromium when available. Otherwise install the matching browser with `npm exec --no -- playwright install chromium` before `npm test`; the static build needs no browser.
