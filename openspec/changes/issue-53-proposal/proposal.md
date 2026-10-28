# Proposal

## Why

The catalogue currently surrounds a simplified version of the talk. Issue #53 requires a standalone keynote that preserves the original narrative and owner-approved visual material rather than a synopsis.

## What Changes

- Build Ingeniería del Software 2.0 as a talk-owned, viewport-filling presentation at its existing stable URLs, without catalogue chrome or an embedding iframe.
- Restore all ten approved assets, including the opt-in animated demo, alongside the existing 24-part narrative and examples. Preserve author notes outside public output.
- Add deliberate transitions, keyboard navigation, browser fullscreen controls and reduced-motion behavior.
- Assemble independent talk output into the existing static Worker distribution; leave the other talk's visual design unchanged.
- Supply desktop preview evidence for required owner visual/content acceptance; passing checks do not constitute acceptance.

## Capabilities

### New Capabilities

- `standalone-presentations`: independent talk entry, preserved narrative/media, accessible presentation controls and static delivery.

### Modified Capabilities

None. The initial inventory command found no existing OpenSpec root or capability inventory.

## Impact

Talk-local source, renderer, styles and build configuration; catalogue metadata/routing; static assembly and asset validation; browser and delivery tests; presentation documentation. No backend, subdomain, deployment credential or new production dependency.
