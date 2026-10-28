# Proposal

## Why

The catalogue currently surrounds a simplified rendering of the talk and excludes its original visuals. Issue #53 restores a standalone keynote without reducing the recoverable original narrative; it supersedes conflicting visual-only constraints in #39.

## What Changes

- Open talks without catalogue chrome or a presentation iframe.
- Give Ingeniería del Software 2.0 a viewport-filling, animated, talk-owned entry and build, preserving all 24 original units, examples, links and author notes.
- Publish the ten original assets, publicly reusable per the owner's confirmation in issue comment 6472863966.
- Add browser fullscreen controls, stable scene navigation, motion reduction and readable media alternatives.
- Retain static Worker deployment and canonical/legacy URLs; supply desktop review captures without claiming owner acceptance.

## Capabilities

### New Capabilities

- `standalone-presentations`: Independent talk delivery, complete content and accessible presentation controls.

### Modified Capabilities

None. OpenSpec inventory reports no existing specifications.

## Impact

Catalogue routing, Spanish talk source/styles/build, static output validation, browser tests and usage documentation. No backend, subdomain, presentation framework or production dependency is added. The English talk retains its renderer and content.
