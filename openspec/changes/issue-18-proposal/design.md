# Design

## Context

See `proposal.md` for motivation and the two capability specs for behavior. The root React/Vite app registers two talks through `src/talks.ts`; pathname dispatch renders catalog detail pages containing `/decks/<slug>/` iframes. `scripts/build-decks.mjs` invokes talk-local pnpm/Slidev builds and can reuse installed dependencies. Both talk manifests reference the same GitHub theme. CI currently runs cached root installation and `vite build`, not the full root build.

Canonical sequences are the cover plus 23 referenced Spanish pages and the cover plus 14 English pages. These entry lists establish the baseline, not completed parity: every page, citation, note and asset must still be inventoried. Sample sources contain HTML layouts, code, diagram images, notes and a Slidev YouTube component. `AGENTS.md` requires talk-local editable material and preservation of installed skills.

`docs/engineering/repository-refinement.md` recognizes issue 18 and its verified owner answer as product intent. The pinned provider instructions govern artifacts, not product approval. No existing `openspec/` tree exists in the checkout.

## Goals / Non-Goals

**Goals:** a bounded two-talk implementation, one public locked dependency graph, predictable static routing, inspectable DOM content, safe scene navigation and reviewable parity evidence.

**Non-Goals:** a generalized presentation engine, a Markdown-to-Slidev compatibility layer, autoplay/timeline editor, WebGL, backend, new talks, editorial expansion, offline external video or PDF/PowerPoint parity. No changes to deployment authorities or installed third-party skill contents.

## Decisions

### 1. Talk-local explicit scenes, minimal shared shell

Keep editable material under each `talks/<source-directory>/deck/`. Replace active Slidev entry/pages with explicit React scene modules and an ordered scene manifest containing stable scene ID, title, language and renderable content. Talk-specific components and styles remain local. Root `src/` owns only shared shell, navigation and catalog integration; each talk's `web.ts` remains the canonical public identity and links to its experience export. Root app lazily loads talk-local modules; the build still resolves and checks both talk graphs.

Extract author-only comments/notes into talk-local Markdown under `content/` before conversion, keyed by stable scene ID. These files are not imported, globbed or copied into public output. Do not keep a second active narrative source: convert the baseline pages with a recorded coverage map, preserve research and use version history for retired renderer syntax. Notes retain all author material, including the Spanish cover note. Public scene descriptions must be written deliberately, not sourced automatically from notes.

Alternative: generic Markdown renderer minimizes initial edits but requires interpreting Slidev layouts/components and stripping notes safely. Explicit scenes provide direct control for only two talks and make dependencies and publication boundaries clearer, at the cost of React literacy for authors. Root-only scene content would break talk ownership.

### 2. Original DOM/SVG storytelling without an animation engine

Use semantic DOM text, code and native controls; use original CSS/SVG geometry for diagrams and restrained spatial motifs. Follow `docs/design/DESIGN.md` semantic tokens, spacing and typography; use the existing font stack, not reference fonts. Candidate direction: large topic headings, small monospace annotations, signal-blue accents and a calm dark canvas with equally readable light/system appearances. Preserve original languages and narrative order while permitting scene splits with coverage links. No fixed slide-height clipping: active scenes can vertically scroll.

Use short opacity/transform transitions with the existing motion token; reduced motion cuts immediately and disables decoration. Essential diagrams include meaningful alternatives and never rely on graphics acceleration. Large code/diagrams get bounded labelled scroll regions or readable equivalents.

Alternative: Three.js/GSAP could reproduce spatial spectacle but adds payload, rights, fallback and test obligations without an identified content need. A scrolling essay alone is simpler but does not preserve the required presenter progression. The recorded `CKGrafico/platform-slides` research informs composition only; copy none of its code, shaders, fonts, images or assets. This direction is proposed, not visually approved.

### 3. Stable fragments and conservative keyboard handling

Use `#scene=<stable-id>` for addressable scene state. Manifest order determines previous/next; `hashchange` handles history/back and direct loads. Invalid fragments select the first scene. Do not promise compatibility with undocumented Slidev numeric subroutes; the required existing deck entry URLs remain functional. Preserve first/last boundaries without wrapping. Label controls and show textual position; document ArrowRight/PageDown and ArrowLeft/PageUp. Do not bind Space or arrow up/down, preserving normal scrolling.

Ignore prevented, composing, repeated or modifier-key events and all events originating in interactive/editable elements or their descendants, including links, buttons, form controls, media, embedded content and interactive ARIA roles. Embedded players retain their own events. Only intercept the four documented keys from noninteractive scene surfaces; prevent browser default only when handling those keys. Use native button activation for focused controls.

Only the active scene participates in reading/tab order; persistent controls remain mounted. Preserve focus on navigation controls; if changing scene removes a focused descendant, move focus to the new scene heading. Provide a polite position/title announcement and restore the scene scroll origin without animated scrolling. Set document title and language from the active talk. Return-to-catalog is always visible.

Alternative: a continuous animation playhead adds intermediate states and synchronization complexity. Scene IDs provide sufficient storytelling control with simpler keyboard, history and accessibility tests.

### 4. Real static entry files, one site build

Keep `/` as catalog and make `/<slug>/` the full talk experience, with overview/source links accessible in the shell rather than an embedded deck. Preserve `/decks/<slug>/` by rendering the same experience at that pathname, not by requiring redirects or an application server. The two published slugs remain `software-engineering-2_0` and `soft-and-hard-guardrails`.

Replace `build:decks` and its installer script with one root pipeline: `npm run build` runs typechecking, Vite, then a static-entry/manifest check. After Vite emits the root HTML and hashed assets, a Node script generates talk and legacy `index.html` files from that emitted shell, with escaped title/language metadata and the same root-relative asset URLs. Dispatch both canonical and legacy paths through the same registered talk. Emit `dist/site-manifest.json` listing expected entries and required assets; reject missing outputs and unknown registry mappings. Local assets are imported or explicitly registered so build-time checks detect missing files, not merely broken browser strings. Disable distributed source maps and copy only allowlisted public assets.

The documented target is a domain-root static host with directory indexes and no SPA fallback. Verify with a plain file server, not Vite preview alone. Physical entry files avoid the current pathname-router direct-load ambiguity. Preview uses `npm run preview`; static-host validation is separate. Subpath deployments are not claimed; any later need requires consistent base-path work.

Alternative: catch-all SPA rewrites are fewer files but depend on host configuration; meta redirects complicate fragment preservation. Separate per-talk builds duplicate tooling and invite partial output.

### 5. One locked install and a cold full-build job

Use the root npm manifest/lockfile as the active install contract and public pinned dependencies. Remove both retired deck manifests and pnpm locks only after confirming no remaining active consumer and preserving content/notes; remove required Slidev/theme imports and installation commands. Installed Slidev skills and historical research stay intact. The new build never installs packages. Keep Node 22 as the current CI major; document a compatible Node 22 release and lock exact direct package resolutions.

Retain the existing `npm ci --ignore-scripts` installation policy and verify it works for the selected public tooling; do not silently weaken script restrictions to fix tooling. Add public, pinned browser/accessibility test tooling such as Playwright and axe as development dependencies, not presentation runtimes.

Update `verify-catalog.yml` to perform a fresh `npm ci --ignore-scripts`, typecheck/tests and `npm run build`, removing setup-node cache restoration. Use ephemeral CI state, no restored node_modules/package cache and no private dependency credentials. Public browser downloads are permitted for testing. Retain logs, output manifest and built review artifact with revision metadata. Add a controlled invalid-talk fixture check proving full-build failure propagation. Keep Lighthouse verification separate. No deployment step is added.

Alternative: per-talk dependency installs retain drift and the current hidden local-state path. Cache-assisted CI can remain useful elsewhere but cannot serve as the cold-build evidence.

### 6. Coverage and asset review are migration prerequisites

Each talk gets a coverage map recording source entry/page, scene IDs, visible text/examples, citations, diagram/media meaning, note destination, asset origin and deviations/owner decision links. Inspect referenced content/research rather than treating extracts as canonical. Resolve uncertain theme imagery by original equivalent visuals; audit all other local images and branding. Never infer reuse rights from public availability. Preserve citations even if a diagram is redrawn. Replace the YouTube component with a named embed/link, contextual fallback and unrestricted scene navigation; no build-time external fetch. Missing portrait/media cases need a readable intentional fallback, not a broken image.

Alternative: screenshots alone cannot establish content or note coverage and may conceal missing sources. They supplement, not replace, the coverage map and rendered review.

## Interfaces and Data Effects

Public interfaces are existing catalog/talk/deck URLs, stable scene fragments and documented navigation. No API, database or authenticated state is added. Build manifest and review evidence are generated artifacts, not canonical content. Do not persist navigation or introduce analytics. Root registration maps public slugs to talk-local scene exports; dependency/build errors fail the complete pipeline. Author notes remain in repository source but not distributed bundles.

## Risks / Trade-offs

- [Manual conversion changes meaning] → Baseline coverage maps, preserved code/citations and explicit owner decisions on substantive deviations.
- [Theme asset rights uncertain] → Audit origins before migration, redraw originally where uncertain and retain narrative equivalence.
- [Only active scenes are mounted] → Explicit focus/announcement rules, whole-sequence browser and assistive-technology review.
- [HTML shell copies hide routing mistakes] → Test all five URLs with no rewrite server, reload valid/invalid fragments and request every manifest asset.
- [Notes leak through imports or asset copies] → Separate unimported note files, allowlisted output copying, output-wide note checks and no published source maps.
- [Animation or dense diagrams harm reading] → DOM-first content, scrollable scenes, AA checks, narrow layouts and motion-off evidence.
- [Root lock contains other problematic resolutions] → Audit the whole active graph; public credential-free installation is a completion condition, not an assumption already proven.
- [Generated authority contract still blocks deployment] → This change builds artifacts only; maintainers must satisfy existing publication authorities separately without weakening guardrails.

## Migration Plan

1. After separate implementation authorization, inventory the original sources/notes/assets and establish review maps.
2. Build the shared shell and static path tests with fixtures; then migrate English and Spanish talks independently with tests and documentation in each slice.
3. Cut over the registry/build pipeline together, remove retired active renderer dependencies and reconcile authoring conventions. Do not publish a mixed partial migration.
4. Run clean full-build and static-only integration checks, provide both complete previews and captures, resolve owner corrections and record explicit acceptance.
5. Deployment/merge is a later authorized action. For a later deployment rollback, restore the previous known-good static release as a whole through the normal approved process; do not reintroduce a private dependency as a build fix. Keep source history and review evidence for comparison.

## Validation and Visual Evidence Plan

Unit tests cover scene order, boundaries, fragment recovery, ignored targets/modifiers and registry validation. Browser tests cover every entry/reload, keyboard catalog journey, history, focus after scene changes, failed media and required asset loads. Accessibility checks cover every scene, with manual reading-order, keyboard and contrast checks in light/dark/system, 320 CSS pixels, desktop zoom and reduced motion. No WebGL fallback test is needed because none is introduced; nevertheless essential rendering must be usable without acceleration.

Capture catalog integration and both complete experiences as a built artifact or preview tied to revision/build command. Include representative cover, diagram, dense code, final/boundary, narrow and motion-off states; video or paired-state evidence demonstrates transitions and keyboard operation. Automated assertions establish no animation under reduced motion. Owner reviews the actual complete experiences against coverage maps; reference captures are not acceptance evidence.

**Definition of Done:** AC1–AC8 have evidence, all tracked tasks are complete, clean build/static/browser/accessibility checks pass, no unresolved parity deviations remain, and the owner explicitly accepts rendered content/visuals. Strict OpenSpec validation and proposal acceptance precede implementation authorization; completion does not itself authorize deployment or merge.

No unresolved product decision blocks this proposal. Final artwork acceptance and any content deviation are explicit later owner decisions, not implied approval of this design.
