## What went well
- The bounded PR changed only five documentation files; their status statements preserve #18's incomplete manual/content checks. Owner: repository maintainer. Evidence: changed-path list, root/talk delivery paragraphs and tasks.md:44–49.
- Authenticated catalogue CI passed both accepted head and actual merged revision; verify-catalog.yml:3–7 supports explicit dispatch. Owner: repository automation maintainer.

## What went wrong
- Supplied evidence does not connect the bot merge to the historical owner-authorized integration run or identify the permanently retained prior #40 report. The earlier publisher job is green, not a receipt of report contents. This is an evidence gap, not proof of a workflow/source failure. Owner: operator/trusted publisher maintainer.
- Generated LIGHTHOUSE.md:18,24 conflicts with its own adoption status and the manifest/operator guide. This is a guidance defect; no runtime enforcement defect was established. Owner: Lighthouse documentation maintainer.
- No talk-runtime defect was established. Recurrence across work items is unknown; multiple runs of this issue do not establish recurrence.

## Start doing
- Attach accepted-head/owner-dispatch integration receipts and pinned report identities to completion context. Owner: trusted publisher maintainer. First recover existing receipts for #40; do not rerun merges to manufacture proof.
- Review generated authority wording against explicit null integrations. Owner: Lighthouse documentation maintainer with repository maintainer.

## Stop doing
- Stop treating a green publisher job or skipped integration job as proof of accepted behavior, and stop treating first-version acceptance as evidence that unfinished manual checks ran. Owners: reviewers and maintainers. Evidence: earlier review run observations and tasks.md:49.

## Improvement candidates
1. Receipt continuity: observed failure is missing acceptance provenance in this review context, not proven loss of reports. Evidence: completion contains bot merge/post-merge success and earlier publication success but no pinned #40 report or historical integration receipt. Owner: trusted publisher maintainer. Smallest useful guard: expose existing bounded integration/publication receipts, binding issue, PR, accepted head, owner authorization, merged revision and report commit/path. Reproduce with this context: the merge/CI are known but those acceptance facts cannot be resolved; regression fixtures should reject missing/mismatched receipts and accept authentic matching ones, without requiring the current report to pre-exist. Proposal requires its own review and regression proof; no guard changed here.
2. Authority projection: observed failure is contradictory generated guidance for unadopted integrations. Evidence: LIGHTHOUSE.md:10–11,18,24; lighthouse.json:16–19; repository-refinement.md:5. Owner: Lighthouse generator/documentation maintainer. Smallest useful guard: review conditional wording in the generated projection. Reproduce by rendering a profile with null ProductShape/ArcShape; regression proof should show coherent unadopted wording and preserve adopted-profile validation requirements. Separate provider review is required; do not hand-edit managed output or weaken policy.