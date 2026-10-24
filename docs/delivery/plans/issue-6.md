# Issue 6: keyboard skip link

Status: proposed; awaiting the owner's planned decision. This proposal implements the scope and six acceptance criteria in [the published refinement](https://github.com/juangcarmona/presentations/issues/6#issuecomment-6387924060). [The owner approved ready](https://github.com/juangcarmona/presentations/issues/6#issuecomment-6388284670) and authorized this proposal on 2026-10-24.

## Authority and execution record

- Product intent: [issue #6](https://github.com/juangcarmona/presentations/issues/6) and its refinement under [the bounded pilot exception](../../engineering/sofa-pilot.md).
- Reviewed source: `f92952632d8c4852ae984e147bec82076bd2169e`.
- Refinement run: `797feb06169c10945b0fc47d79834e46a46bce263a3d1311e21d8fff5bea177d`.
- Refinement result SHA-256: `c3ea295a92b8b75d7aab31830cf39de754a28b59d8d9867e5abbf3f9be45a619`.

This is an operator-assisted proposal prepared through the active Codex session. The deployed SoFa adapter supports triage/refine only; no SoFa proposal execution or host-validated proposal result is claimed. OpenSpec is not installed in this consumer. This repository-owned plan records the design for review without claiming an OpenSpec installation or validation. Automated proposal publication remains separate factory work.

## Solution

In the shared `Layout` in `src/App.tsx`, render a native anchor with `className="skip-link"`, `href="#contenido"` and text `Skip to content` immediately before `SiteHeader`. Reuse the existing `main` element and id. Give `main` `tabIndex={-1}` and a React ref so it can receive programmatic focus without becoming an extra sequential Tab stop.

On normal link activation, focus that main element through the ref while retaining the anchor's native fragment navigation. Verify that this combination moves both focus and viewport as required; an observed browser failure must be resolved before acceptance. Keep the event handling local to `Layout`. No global key listener, positive tabindex, routing change or additional runtime dependency is needed.

Reuse the `.skip-link` recipe in `src/styles.css` and the existing semantic theme tokens. Change CSS only where the acceptance matrix reveals clipping, insufficient contrast or a missing focus indicator. Preserve reduced-motion behavior. The shared layout also covers not-found pages; exercise that branch without changing its content.

The component and stylesheet changes do not alter persistence, APIs, data, authentication, deployment or system boundaries. No architecture documentation impact or new ADR is needed for this local interaction. ProductShape and ArcShape adoption remain outside the approved scope.

## Trade-offs

A fragment-only anchor leaves actual main focus and the next Tab dependent on browser behavior. Explicit main focus makes the intended target testable. Making main permanently sequentially focusable would introduce an unnecessary Tab stop. A custom button or global keyboard shortcut would lose the native link destination or expand the interaction beyond the requested behavior.

The existing hidden/focused CSS is the starting point. Browser evidence determines whether it needs adjustment; this proposal does not assert that its contrast or narrow-screen appearance already passes.

## Ordered implementation tasks

1. Capture the current catalogue and one registered talk-detail page at desktop and 320 CSS-pixel widths in both themes. Record routes, exact viewport sizes and browser/version. Use these as the unchanged-layout baseline.
2. Add the link, main ref and bounded activation behavior in `Layout`. Verify initial Tab, Enter-to-main and subsequent Tab before broadening checks.
3. Run the acceptance matrix below and make only the CSS corrections it requires. Preserve existing navigation, deck links, theme behavior and talk sources.
4. Run typecheck and the full build, retain actual results, and attach browser evidence to this PR. Review the diff against AC1-AC6 and document any remaining failure.
5. Request implementation review at the current PR head. Integration requires a separate owner decision after the evidence passes.

## Verification and Definition of Done

| Criteria | Required evidence |
| --- | --- |
| AC1 | From a fresh load, first Tab focuses the native `Skip to content` link before the header; its destination is `#contenido`. |
| AC2 | Focused and unfocused screenshots show full visibility, readable text, a visible focus indicator, no clipping and no unfocused layout shift. Measure the relevant contrast against the design contract. |
| AC3 | After Enter, `document.activeElement` is `main#contenido`. Next Tab reaches `Explore talks` in the catalogue or `Open full screen` on talk detail. Continue through representative content and the iframe, and repeat activation after moving away. |
| AC4 | Perform AC1-AC3 in all eight combinations: catalogue/talk detail, dark/light, desktop/320px. Include reduced-motion and not-found smoke checks. Record actual browser coverage. |
| AC5 | Compare the unfocused pages with baseline and exercise header links, theme toggle, source/full-screen links and embedded deck access. Review the diff for unrelated changes. |
| AC6 | `npm run typecheck` and `npm run build` pass at the implementation revision. The latter includes both deck builds and Vite. Keep command results and browser evidence in or linked from the PR. |

Use a real browser for focus and layout assertions. A source-text check or mocked DOM cannot prove these criteria. No new unit-test framework is proposed for this small interaction; any reusable browser check should assert observable behavior and preserve screenshots and focus traces.

The current `verify-catalog.yml` runs typecheck and a Vite-only build. Its green status does not establish the full-deck build criterion. Run the complete command separately and retain its result. Lighthouse foundation checks and the configured PR checks must also pass. No branch-protection requirement is inferred from the presence of a workflow.

Done requires complete AC1-AC6 evidence, the approved focused diff, no unresolved relevant check or review, preserved talks and deck sources, and an explicit account of browser coverage and other limitations. Typecheck, full build and browser acceptance have not run for an implementation because this branch contains the proposal only.

## Next decision

The owner reviews this plan in the draft PR and explicitly approves the planned gate against its current commit before implementation. Continue on this branch and PR after that approval. The ready decision authorizes proposing; it does not approve this plan, implementation, deployment or merge. Automated continuation through SoFa requires its later-stage adapter and publication contract; this document does not enable them.
