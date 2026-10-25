# SoFa refinement pilot

The repository participates in the maintainer-authorized Lighthouse/SoFa pilot. `juangcarmona` owns intake, product decisions and merge approval. The first host adapter supports triage and refinement; later implementation and integration require their own reviewable evidence.

## Product and delivery authority

The catalogue source, talk sources and owner-authored issue define the scope of a small catalogue correction. `lighthouse.json` currently declares no ProductShape or ArcShape integration. For this pilot, that issue is the product-intent record; a separate Product Change is not required for an additive accessibility correction that preserves existing catalogue behavior. Broader product or talk-content changes need a separate owner decision. Record this bounded adoption exception in triage instead of claiming those tools are installed.

Use the supervised route. Propose labels only if they already exist in the repository; an empty label proposal is valid when none applies. The owner remains `juangcarmona`; assessment confidence and unavailable evidence must be explicit. Triage completes when the change is classified with a route, owner, scope, risks and next decision. Implementation/browser checks belong to the later implementation stage, not to triage completion.

For this catalogue story, the outer stage-result evidence and blocker arrays describe completion of the requested stage. Preserve future typecheck, build, keyboard and visual checks under `output.laterAcceptanceChecks`, with their unperformed status; do not list them as unavailable current-stage checks. If evidence needed to classify the issue is unavailable, retain that blocker and return `blocked`. A `passed` result requires empty `missingEvidence`, `unavailableChecks` and `pendingReview` arrays and only resolved outer evidence. Never turn an unperformed check into a passing check.

SoFa verifies the source commit and workflow identity before execution and again before publication. Cite those request identities as host-supplied provenance; the read-only stage engine does not independently verify them through git or GitHub. Independent verification by the engine is not a refinement requirement.

## Gate decisions

Create an issue describing the desired catalogue behavior, then add `refine`. Only the registered owner can request this direct engineering entry. SoFa verifies the label event, actor, workflow and policy; refinement needs no triage predecessor or copied run hash. Host evidence records this direct authorization. It authorizes refinement only; implementation and merge retain their own gates.

The original issue remains intact. The agent publishes a refined story or a precise question as an issue comment, with a run identity, source revision and result digest. `ready` means the refinement passed; `needs-info` means the report needs an answer or decision. Answer by updating the issue body, then add `refine` again. For an execution failure, inspect the Actions receipt before removing and readding `refine`.

While SoFa holds the reservation, the issue carries `agent-working`. To take over, add `human-working` and wait until `agent-working` disappears before editing. SoFa refuses new work and stops active work when it sees the human reservation. Remove `human-working` before requesting refinement again. These labels coordinate participants; GitHub still allows manual edits, and changed issue content invalidates the agent's publication.

The compatible schema-1 `/lh:refine <triage-run-id>` command remains available for an existing passing triage result. New issues do not automatically start triage. Unrelated labels and comments do not launch agents. Automatic reply continuation, implementation and integration are not enabled in this slice.

The opt-in workflow runs on the dedicated `lighthouse-host` runner and delegates one stage to SoFa. SoFa verifies the workflow run, source commit, pinned package and host policy. The runner receives no GitHub publication token or Docker socket. Results stop for a human decision and retain the published comment URL and result digest.

## Pilot acceptance

Record the issue, source commit, Actions run, SoFa run identity, validated stage result and published receipt. Refinement needs its matching owner label event or schema-1 decision. A product delivery additionally needs a reviewed PR, application checks and browser evidence for the behavior. A successful provider request or infrastructure check alone is not a delivered feature.
