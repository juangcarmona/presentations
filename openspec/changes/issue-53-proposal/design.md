# Design

## Context

See proposal.md for motivation. The root React app currently imports both scene datasets and wraps them in catalogue layout. The ten approved assets are already tracked but excluded from distribution. The historical baseline is not in this checkout; its public revision-bound Markdown is readable. Existing content maps 24 source units and preserves notes separately.

## Goals / Non-Goals

**Goals:** independent HTML/JS/CSS output owned by the Spanish talk, original media as primary visual material, readable examples, stable fragments and controls usable without fullscreen permission.

**Non-Goals:** rebuilding the English talk, adopting a mandatory renderer for future talks, reproducing a private Slidev theme, exporting PDF, or accepting the design on the owner's behalf.

## Decisions

1. Build the Spanish talk using its own Vite entry/configuration, into its own ignored `deck/dist/`. Assemble that output at both existing public paths. A shared React shell or iframe would preserve the coupling the issue rejects; a return to a private theme would add unnecessary dependencies. Future entries can supply independently built output without sharing this visual identity.
2. Keep the existing full 24-scene narrative and exact code examples, verified against the revision-bound original Markdown. Restore original diagrams as primary figures with accessible descriptions and optional supporting text. Keep the original author notes untouched and out of bundles. Do not publish the old renderer configuration as a second active source.
3. Give this talk its own cinematic dark canvas, large typography, contrasting diagram panels, staged card entrances and a compact presentation control strip. Preserve stable `#scene=` IDs, history and focus recovery. Allow scrolling at small sizes/zoom rather than shrinking text to illegibility.
4. Fullscreen is explicitly user-triggered, with enter/exit labels updated by `fullscreenchange`; rejection leaves normal viewport presentation usable. Reduced motion disables transitions. The GIF is opt-in with a stop control and readable static steps, never auto-started.
5. Validate physical route indexes, emitted asset edges, exact approved asset copies, catalogue separation, navigation, motion and fullscreen in Chromium. Retain desktop previews and coverage evidence. Owner visual/content acceptance remains an explicit incomplete task.

## Risks / Trade-offs

- [Large diagrams and GIF] → Keep originals, fit diagrams to viewport, offer full-size links; load animated demo only on request.
- [Source comparison mistaken for acceptance] → Record comparison separately from the required owner preview decision.
- [Two build entries drift] → Root build orchestrates both and verifies complete static output; dependency lock remains shared.
- [Fullscreen permission varies] → Catch errors and provide an accessible message without breaking navigation.

## Migration Plan

Build the catalogue and independent talk, assemble both stable talk URLs and publish the same static `dist/` through the unchanged Worker configuration. Rollback is the previous full static build, not a partial asset replacement. Deliver as reviewable code pending owner acceptance.
