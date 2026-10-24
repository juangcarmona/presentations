# Supervised SoFa pilot

The repository participates in the maintainer-authorized Lighthouse/SoFa pilot. `juangcarmona` owns intake, product decisions and merge approval. The first host adapter supports triage and refinement; later implementation and integration require their own reviewable evidence.

## Product and delivery authority

The catalogue source, talk sources and owner-authored issue define the scope of a small catalogue correction. `lighthouse.json` currently declares no ProductShape or ArcShape integration. For this pilot, that issue is the product-intent record; a separate Product Change is not required for an additive accessibility correction that preserves existing catalogue behavior. Broader product or talk-content changes need a separate owner decision. Record this bounded adoption exception in triage instead of claiming those tools are installed.

Use the supervised route. Propose labels only if they already exist in the repository; an empty label proposal is valid when none applies. The owner remains `juangcarmona`; assessment confidence and unavailable evidence must be explicit. Triage completes when the change is classified with a route, owner, scope, risks and next decision. Implementation/browser checks belong to the later implementation stage, not to triage completion.

## Gate decisions

The host accepts an exact `/lh:refine <triage-run-id>` comment from the owner after a passing triage report. That authorizes refinement of the recorded input. It does not authorize implementation or merge. A blocked report requires resolution of its stated blocker and a fresh authorized request.

The opt-in workflow runs on the dedicated `lighthouse-host` runner and delegates one stage to SoFa. SoFa verifies the workflow run, source commit, pinned package and host policy. The runner receives no GitHub publication token or Docker socket. Results stop for a human decision and retain the published comment URL and result digest.

## Pilot acceptance

Record the issue, source commit, Actions run, SoFa run identity, validated stage result and published receipt. Refinement needs its matching owner decision. A product delivery additionally needs a reviewed PR, application checks and browser evidence for the behavior. A successful provider request or infrastructure check alone is not a delivered feature.
