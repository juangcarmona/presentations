## What went well
- The host records PR #42 merged and catalogue verification successful at the exact integrated revision (job 121333552121). The five changed guides keep first-delivery acceptance separate from outstanding manual evidence.
- Explicit dispatch and protected report publication are adopted in .lighthouse/github.json and the operator guide; review does not grant merge or deployment authority.

## What went wrong
- The earlier issue-18 review exposed stale delivery-status documentation (host work-item account, run 40244453359); PR #42 reconciles the inspected statements.
- This snapshot still has a pending current-stage verification check, job 121334390062. This is missing verification, not an observed failed check or proven implementation defect. Historical manual/content evidence also remains incomplete, outside this pilot's completion criteria.
- No new source defect was established. Recurrence across work items, root cause of the pending snapshot and cost/timing impacts are unknown; this single attempt does not establish recurrence.

## Start doing
- Repository maintainer: compare acceptance links, CI revision and open task notes across root/operator/talk guides when recording a delivery decision (evidence: README.md:80-82 and tasks.md:44-49).
- Trusted host: supply terminal current-stage verification evidence before declaring completion; retain pending as pending meanwhile (job 121334390062).

## Stop doing
- Do not treat green catalogue CI as manual/content acceptance, or a pending check as failed. Keep first-version acceptance and remaining requirements distinct, as tasks.md:49 now does.

## Improvement candidates
- **Delivery-status consistency review** — Owner: repository maintainer; observed failure: historically stale status across guides, reported by issue #40 and corrected in PR #42. Smallest guard: a reviewer checklist linking the canonical acceptance decision, revision-bound CI and still-open task evidence. Reproduction: review pre-#42 guide versions against the PR #38 acceptance record and CI evidence, then confirm the checklist detects stale status; repeat against the corrected five documents without checking off unperformed tasks. This candidate needs separate review and regression proof; no automated policy change is proposed here.
- **Terminal-evidence snapshot handling** — Owner: Lighthouse completion maintainer; observation: current-stage prepare verification is pending in this snapshot despite successful merged-revision catalogue CI. Smallest candidate guard: explicitly distinguish in-flight current-stage observations from unrelated skipped jobs and from failed checks before completion. Reproduction: fixture this supplied pending observation and require blocked, substitute an authenticated terminal success and reassess, and separately cover failure and unrelated skipped-job cases. Whether snapshot timing is a provider bug remains unknown; investigate in a separately authorized review before changing provider guidance or guards.