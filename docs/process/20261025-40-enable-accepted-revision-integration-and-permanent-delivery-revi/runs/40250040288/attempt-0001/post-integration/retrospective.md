## What went well
- The protected integration record binds explicit owner authorization to accepted head `f41a00c6…` and actual merge `3b08109b…`; merged-revision catalogue check `github-check:121333552121` passed. Assessment, merge and verification remain separate facts.
- PR #42 reconciles five guidance files while retaining unchecked manual/content-equivalence tasks (`tasks.md:44-49`). No unresolved source defect was established in this pilot.

## What went wrong
- The historical #18 review exposed stale delivery-status guidance (work-item account of run 40244453359); the correction required the bounded #40 documentation pilot. This is an established documentation defect, not a runtime defect.
- Post-merge CI was unavailable when integration receipt `integration:40247701742:1` was written. Later run 40247989681 resolves availability; no failed check or automation defect is demonstrated. Recurrence across work items and any time/cost impact are unknown; retries do not establish recurrence.

## Start doing
- Repository maintainer: compare delivery-status statements with accepted revision, merge receipt and later CI when closing a delivery; preserve historical unknowns instead of rewriting them as passes.

## Stop doing
- Do not use a green orchestration job, owner acceptance, or a passed assessment as a substitute for a merge receipt or unperformed manual verification. The current evidence distinguishes these correctly; no additional failure of this kind is asserted.

## Improvement candidates
- **Status-consistency review checklist — owner: repository maintainer.** Observed failure: historical stale status statements, identified by run 40244453359 and corrected in PR #42. Smallest useful guard: a closure checklist covering root/operator/talk guidance and OpenSpec status against acceptance and CI receipts. Reproduce before correction by reviewing the pre-PR #42 versions against the same retained acceptance/CI evidence and recording the mismatches; then apply the checklist to PR #42 and confirm those mismatches disappear while manual tasks remain unchecked. This proposed guard needs separate review and before/after regression proof; it was not implemented here.
- **No additional automation or provider-policy guard proposed.** The historical missing-check observation is resolved, not proof of a defect. Retain that distinction and let juangcarmona own the remaining #18 manual evidence and #39 visual work without opening new work from this stage.