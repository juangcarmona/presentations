# Standalone talk review guide

The migration implements the approved issue-18 design using existing Lighthouse semantic tokens and font stacks. It does not copy code, shaders, fonts or images from `CKGrafico/platform-slides`; the [recorded research](../research/standalone-keynote-reference.md) informs composition only. Scenes use a large title, monospace position annotations, signal-blue structural lines, normal-flow content and short opacity/transform transitions. All substantive content is DOM; graphics acceleration is unnecessary.

## Asset/dependency decisions

| Original input | Treatment | Meaning retained |
| --- | --- | --- |
| Theme `bg-cover-1.jpg` | Archived, never imported/copied | Original typography and intent → system → evidence motif replace decorative cover imagery |
| PDaC authority/model/citations/workflow PNGs | Archived, original semantic DOM flows with source citations | Direction of authority/learning, named relationships, IDs, four citation states, human-controlled drift and apply/merge boundary |
| PDaC demo GIF | Archived; static DOM steps | Three divergent refund specs, one BR-REFUND-001 rule, change detection and stale citations; no looping animation |
| PDaC logo / ProductShape branding PNG | Archived; readable text identity | PDaC/ProductShape naming and methodological/implementation relationship |
| Lifecycle SVG | Archived; original DOM ordered sequence | Backlog → refine → propose → implement → integrate → review, gates and verifier roles, feedback loop |
| `juan.jpg` | No dependency on portrait availability | Named initials fallback, role and all contact links |
| Slidev YouTube component | Native named iframe, descriptive external link, persistent context | Death Star plans as technical-documentation analogy; connection required for external playback |
| English HTML concept decks | Retained research, not copied into runtime | Canonical 15-scene talk and all three code examples remain the migration baseline |

No rights are inferred from public availability. None of the archived binary assets is needed by the site. `publicDir: false` and explicit source imports form the output allowlist. New assets must be imported; missing imports fail Vite. Author notes live only under talk-local `content/`, and distributed source maps are disabled. Coverage maps list source hashes and note destinations; tests hold public scene/code expectations only, never author notes.

Active deck manifests, pnpm locks, renderer syntax and `build-decks.mjs` are retired. Root React/Vite remains the app/tooling stack, not a replacement packaged presentation framework. Public locked Playwright/axe dependencies are test tooling. The dependency audit covers the entire root lock, not installed skills or historical research. Existing Lighthouse tooling is preserved.

## Owner review checklist (not accepted)

1. Build/serve using the root README, and review every scene in both talks against their talk-local coverage maps and original-source history.
2. Check prose, definitions, examples, links, event date/context and full speaker notes. Review the DOM diagram equivalents and static replacement for the GIF; flag any substantive deviation rather than treating automated checks as parity acceptance.
3. Use keyboard-only catalog entry, all four shortcuts, native navigation buttons, browser history and catalog return. Confirm reading order and visible focus, including first/last boundaries and focus recovery.
4. Review light/dark/system, 320px, desktop zoom and reduced motion. Long scenes must remain fully readable; code/table scroll regions must not overflow the page.
5. Test the video with and without a connection; contextual fallback and onward navigation must remain useful. Confirm the intentional portrait fallback is acceptable.
6. Record juangcarmona's explicit content/visual acceptance or corrections against this complete artifact and both coverage maps. A screenshot or clean test suite is not that acceptance.

Automated every-scene axe checks supplement, not replace, manual assistive-technology, reading-order and rendered owner review. Full clean CI and workflow changes remain a separate maintainer follow-up; publication/merge gates are unchanged.
