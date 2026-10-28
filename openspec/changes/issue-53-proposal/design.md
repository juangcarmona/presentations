# Design

## Context

See proposal.md for motivation. Root Vite currently builds one application for every entry, and App wraps every route in Layout. Ten original assets already exist under the Spanish deck but are excluded from distribution. The historical commit is absent locally; all 24 original Markdown units were recovered from its public revision-bound source for comparison. Existing notes remain private build inputs, never runtime imports.

## Goals / Non-Goals

**Goals:** independently built Spanish keynote, stable hash navigation, complete original content/media, static hosting, usable motion and fullscreen controls.

**Non-Goals:** renderer migration for the English talk, new hosting infrastructure, automatic visual approval, retired export parity.

## Decisions

1. Build the Spanish talk with a talk-local Vite entry/config into `dist/software-engineering-2_0/`, including its own assets. Copy its HTML for the legacy `/decks/software-engineering-2_0/` entry. Shared catalogue metadata contains links, not Spanish scene imports. A development-only route adapter supports root `npm run dev`. This is smaller than restoring the private Slidev theme and permits future independent renderers.
2. Retain the existing 24 semantic scenes and exact code examples after comparing original Markdown, restore all original diagrams, branding, GIF, cover and portrait. Supplemental semantic explanations remain available with diagrams. Preserve author notes and coverage provenance rather than overwriting them with inferred content.
3. Use a dark, high-contrast stage with oversized typography, blue/cyan accents, staggered transforms and distinct cover/diagram/code/comparison layouts. Do not shrink dense originals into unreadable thumbnails: allow scroll and full-size image links. This trades single-screen density for legibility where needed.
4. Keep existing keyboard/focus contracts, hash/history behavior and native interactive keys. Fullscreen is explicit and handles rejection; Escape remains browser-owned. Reduced motion disables entrance effects and does not load the animated GIF until explicitly requested.
5. Validate only expected public media extensions, all local asset edges and the exact ten source/output hashes; retain the note-distribution audit. Run the existing full verify command plus strict OpenSpec validation and targeted browser checks. Owner desktop visual/content acceptance is required even when automation passes.

## Risks / Trade-offs

- Dense source visuals → contain rather than crop, provide full-size links and semantic descriptions.
- Animated GIF ignores CSS motion preferences → default static explanation under reduced motion; explicit play control otherwise.
- Browser fullscreen unavailable/rejected → visible nonfatal feedback; viewport presentation remains usable.
- Restyling is subjective → retain desktop captures and request owner acceptance; do not mark redesign complete.
- Dependency installation may stall → retain terminal receipts, retry with bounded fetch timeouts and report unavailable checks honestly.

## Migration Plan

Build catalogue, then the Spanish entry, then physical aliases and manifest. Deploy the same verified `dist/` with the unchanged Worker configuration. Rollback is the prior static build. No data migration.
