# Implementation retrospective

## What went well

- Continuing the immutable seed preserved the substantial talk-local migration and unrelated installed skills.
- Locked public installation, typechecking and complete static build worked without a talk-local installer.
- Source inspection identified a concrete privacy-check gap; a failing regression preceded the short/escaped-note fix.
- A sequential pre-fix browser assertion confirmed focus loss at the final boundary; focused first/last tests for both talks pass after transferring focus to the enabled navigation peer.
- Physical HTML entries and a strict no-rewrite server make route behavior directly testable.

## What failed

- A two-minute tool timeout was too short for every-scene accessibility checks across three appearances.
- Cancellation left a preview server alive; the next run correctly refused an occupied port. Stopping only that known leftover restored a fresh run without weakening server isolation.
- An optional capture attempted to borrow the test server after the suite had stopped it; owning a dedicated server lifecycle fixed that capture run.
- An extra concurrent browser check could not launch. Its launch failure was initially misread as a failed product assertion; the public update was corrected, then a sequential check established the actual red result before verification of the fix.
- Seed coverage assertions alone cannot independently establish full prose/media or note-extraction parity.
- Build-failure logs originally went into Playwright's resettable output directory and disappeared before packaging. Receipts now use `test-reports/build-failures/`, outside that lifecycle.

## Start doing

- Budget longer command limits for the full browser matrix while keeping long output in artifact logs.
- Add short and escaped author-note sentinels whenever distribution auditing changes.
- Give independent test phases separate report directories and check retained receipts after the entire test chain, not just after each phase.
- Read the specific failure before describing its cause; serialize extra browser checks with the full browser suite.
- Distinguish implementation, local verification, clean host checks and owner acceptance in task records.

## Stop doing

- Do not treat screenshots, title/code fixtures or a seeded checkbox as proof of full content acceptance.
- Do not interpret a tool timeout or stale preview process as a failed product assertion.
- Do not apply forced dependency upgrades merely because installation reports low-severity advisories.

## Evidenced recurring patterns

- Two attempts were affected by one timeout: interruption followed by a leftover-server conflict (`tests.log`, `tests-stale-preview.log`). Treat command lifecycle cleanup as part of test orchestration.
- The two coverage maps shared Spanish-only asset-review prose, including in the English map. The English section was made talk-specific; shared generated documentation needs content-aware review.
- No broader historical pattern is claimed from this single continuation.

## Final result

All required local commands pass: 6 unit tests, 3 controlled-failure assertions and 15 browser tests. The static preview and captures are retained. Completion remains blocked on full manual/content review, explicit owner acceptance and a clean CI receipt; the workflow change remains a separate maintainer-authored follow-up.
