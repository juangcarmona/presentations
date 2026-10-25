## What went well
- The root public dependency graph and clean full-build workflow address the standalone-delivery intent. Physical entries and strict-static browser journeys test deployability, not merely development-server behavior (package.json; verify-catalog.yml; tests/browser/experiences.spec.mjs:13-35).
- The host records a merge and a successful required post-merge check at e6bec81; later owner acceptance explicitly bounds visual expectations. Coverage maps disclose replacements and verification limits.

## What went wrong
- A scene-animation contrast defect escaped local checks and appeared in clean CI (PR #38 body); midpoint regressions now cover both themes. This is one issue, not evidence of recurring failures across deliveries.
- Current handoff guidance retains superseded CI and acceptance statements (R3). Final labels and the referenced permanent report cannot be inspected from the supplied closure evidence (R5). Full manual accessibility verification remains unestablished, not failed (R4). No new runtime defect was established.

## Start doing
- Reconcile current guidance with dated acceptance and final CI receipts, preserving incomplete manual checks separately. Owner: repository documentation maintainer.
- Supply separately identified final issue/PR labels and the bounded permanent integration record to review. Owner: review host/maintainer.

## Stop doing
- Treating settled screenshots, fixture fingerprints or green CI as proof of full narrative equivalence or a manual accessibility audit.
- Leaving completed maintainer handoffs presented as current outstanding work. Do not infer recurrence, timing savings or cost from retries.

## Improvement candidates
1. **Transition-state regression discipline — implementation/test maintainer.** Observed failure: opacity contrast missed locally, recorded in PR #38. Smallest guard: retain the deterministic midpoint light/dark axe tests already present at tests/browser/experiences.spec.mjs:214-232. Regression proof should first reproduce the reported failure on the historical pre-fix revision, then pass on the correction under the same browser/settings; this review inspected the tests but did not replay that comparison. Any expansion needs its own reviewed change.
2. **Closure evidence completeness — review host maintainer.** Observed gap: completion.labels cannot establish both final label states and docs/process is absent while a permanent report is linked. Smallest guard: require item-scoped label receipts, their convention and the bounded report content before review can pass. Reproduce using this input and verify it remains blocked; then provide complete receipts and confirm only these blockers clear. Review and regression proof are required before adopting a guard.
3. **Handoff reconciliation — repository documentation maintainer.** Observed drift: README.md:82/review-guide:31 contradict the delivered CI; talk READMEs/tasks.md retain pending acceptance after the later owner record. Smallest guard: a review checklist comparing changed guidance against dated completion receipts, without automatically checking off manual tasks. Reproduce by comparing these exact statements with verify-catalog.yml and comment 6404327905; review a narrowly scoped correction and confirm current/historical statements are distinguished while audit limitations remain. No policy or provider guidance changes are authorized here.