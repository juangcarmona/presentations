# Final pilot retrospective

## What went well

Repository-owned Actions ran OpenCode, exposed public progress and delivered a real implementation PR without SoFa. Independent host checks repeated installation, build and browser verification. Both talks now compile using the public root lockfile, and the owner could review screenshots from a phone.

Recovering an immutable seed preserved completed work after an interrupted run. Head-bound CI and the owner's explicit acceptance preceded the merge. Default-branch verification then passed.

## What went wrong

The first execution stopped at the engine log-line bound. A later execution lost its transport after resource errors; its definitive transport cause was not established. Recovery initially rejected generated output. These failures required host repairs and operator intervention.

During the successful continuation, a short command timeout left a test server alive, concurrent browser checks exceeded available resources, and Playwright removed logs kept in its disposable output directory. The agent preserved these findings in its original retrospective.

Clean GitHub CI caught low text contrast during opacity animation that slower local checks had missed. The maintainer removed text transparency and added deterministic midpoint regressions in both themes. The final seventeen browser cases passed locally and in GitHub.

## Start doing

- Check observable intermediate animation states, not only settled screenshots.
- Give test phases separate evidence directories and manage their server/process lifecycles explicitly.
- Keep progress concise in Actions and provide a directly browsable mobile gallery alongside downloadable artifacts.
- Bind acceptance, integration and evidence references to actual revisions; preserve reports before artifact expiry.

## Stop doing

- Treating local green tests as sufficient evidence for a different CI environment.
- Recreating a substantial implementation when an authenticated, conflict-checked recovery candidate exists.
- Describing a command timeout or resource failure as a product assertion failure without inspecting the diagnostic.
- Keeping obsolete SoFa execution plans alongside the accepted observer boundary.

## Pattern and next improvement

Interrupted execution and cleanup affected several attempts of this one issue. That supports a concrete lifecycle-cleanup improvement, but does not establish recurrence across independent tickets. Browser timing also exposed a measurable gap between local and CI verification.

The next reusable delivery slice is explicit integration and post-integration reporting: verify the owner-approved PR head and required checks, use GitHub's merge policy, record the actual merge result, and publish bounded immutable evidence through repository-owned workflows. SoFa reads those records. Automated publication, concurrency recovery and approval invalidation still need implementation and real acceptance evidence; this assisted report does not satisfy them.
