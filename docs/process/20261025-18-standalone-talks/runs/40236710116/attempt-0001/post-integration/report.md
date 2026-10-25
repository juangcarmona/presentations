# Issue 18: integration report

The owner accepted the first standalone-talk implementation after reviewing its mobile gallery. [PR #38](https://github.com/juangcarmona/presentations/pull/38) merged into `main` as `e6bec81d63be4ec80a89bdbe862567edc381d676`. Visual refinement is deferred to [issue #39](https://github.com/juangcarmona/presentations/issues/39).

This record was published after integration by the operator's Codex session. The implementation workflow used OpenCode and independently checked its candidate; the merge and this permanent publication were assisted. This is evidence of the pilot, not proof of an automated integration or retrospective publisher.

## Revisions, authority and checks

- Approved implementation head: `e02ddd1ad3761499a80c55abc0d45ba74b122a7b`.
- [Owner acceptance](https://github.com/juangcarmona/presentations/pull/38#issuecomment-6404327905) records the decision against that head. The owner accepted the content and first visual approach, with visual polish deferred.
- [Final PR CI](https://github.com/juangcarmona/presentations/actions/runs/40239580036) passed on merge candidate `e6c4f24e29e6cda5c85ddf40b557d9982190bc35`: public locked installation, complete static build, six unit tests, three controlled build-failure checks and seventeen browser cases. The Lighthouse foundation check also passed.
- [Default-branch CI](https://github.com/juangcarmona/presentations/actions/runs/40240736956) passed on the actual merge commit; the default-branch Lighthouse foundation check passed separately.
- [OpenCode execution](https://github.com/juangcarmona/presentations/actions/runs/40236710116) produced the draft PR and its report. Its independent host commands passed. The maintainer subsequently completed the CI workflow and repaired transient animation contrast before acceptance.

## What is retained

The 54 screenshots in this bundle come from final CI artifact `12616292138`, named `standalone-talks-e6c4f24e29e6cda5c85ddf40b557d9982190bc35`. Their file hashes are recorded in `evidence-record.json`. They cover desktop scenes, narrow/reduced-motion views, keyboard boundaries and animation contrast. Browser evidence covers all five physical static routes and all 39 scenes across supported appearances.

[The original agent retrospective](agent-retrospective.md) is preserved verbatim. It predates the maintainer's contrast repair and final CI, and therefore mentions fifteen browser tests and then-pending checks. [The final retrospective](retrospective.md) records the later outcome without rewriting that earlier account.

The Actions artifacts also contain the built site and detailed test reports, with 30-day retention. This permanent bundle retains the small reviewed reports and screenshots, not raw transcripts, credentials, traces or videos. Source remains reproducible from the merged revision. No complete recording of either failed execution is claimed.

## Limits and deferred work

The pilot required runtime repairs and an immutable seed to recover an interrupted implementation. It was not fully unattended. Automated contrast and accessibility checks, representative rendered inspection and the owner's acceptance do not constitute a comprehensive manual assistive-technology audit. Further content/visual refinements and their accessibility checks belong to issue #39.

The site supports domain-root static hosting. External video playback needs connectivity; subpath hosting and PDF/PowerPoint exports were not delivered. No production deployment or DNS change was performed. The local mobile gallery is a convenience preview, not the permanent evidence address.

## Publication

This bundle uses UTC and the first publication date, 2026-10-25. The repository's `process/retrospectives` branch was checked for active deletion and non-fast-forward protection with no bypass actors before publication. Publication is a normal descendant commit; the application branch is untouched. Corrections must create a new bundle and preserve this one.
