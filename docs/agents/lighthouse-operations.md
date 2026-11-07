# Lighthouse workflow operation

Read this before changing Lighthouse workflows or enabling automation.

## Installed baseline

Project dependencies remain `@juangcarmona/lighthouse@0.11.6` and `@juangcarmona/lighthouse-sdlc@0.15.2`; `package-lock.json` records that dependency graph. The separately installed worker workflows use the SDLC `0.21.0` templates at immutable Lighthouse commit `9b11266f965013d55e733a3e06b7a5a32b842074`, compiled with `gh aw` v0.93.2. The installed stages remain triage, refine, propose, implement, integrate, review and apply-review. This worker update adds local runner telemetry and preserves the adopter's automation switches. Use `npm run lighthouse:verify` to check the project baseline. Update worker workflows with the selected SDLC package's `src/install-workflows.mjs` and compile their locks with the pinned `gh aw` CLI. See the pinned package's `telemetry.md` for the metadata, replay and optional export contract.

The router and lifecycle workers are installed, but GitHub Actions automation is gated by the repository variable `LIGHTHOUSE_AUTOMATION_ENABLED`. It must remain `false` until an owner confirms the runtime, provider credentials, workflow permissions, and triggers are ready. The installed completion workflow also allows refinement to continue automatically into implementation when the gate is enabled.

## Credentials and runtime

- The router and publisher use the workflow-scoped `GITHUB_TOKEN` with permissions declared in each job. Repository-wide workflow permissions remain read-only, and Actions approval of pull requests is disabled. Before enabling automation, an owner must verify whether Actions is allowed to create pull requests; this adoption does not enable that capability. A separate personal access token or GitHub App token is not part of this setup.
- Stage workers require a Linux runner labelled `lighthouse-workflow`, Docker, and the runner environment variable `LIGHTHOUSE_ENGINE_CONFIG` pointing to an operator-managed OpenCode engine configuration.
- Provider authentication belongs in that operator-managed engine configuration and its runtime environment. Store provider credentials in the host's approved secret store and inject them into the engine; never commit credentials or print them in logs.
- GitHub repository secrets were empty when this adoption was prepared. The exact provider key name depends on the operator's engine configuration and selected provider; configure it on the runner, not in repository source.
- The runner must be dedicated to trusted repository workflows because its Docker access is privileged host access. Review the workflow permissions and runner isolation before enabling automation.

The repository variable is intentionally set to `false` while credentials and runtime configuration remain unverified. An owner can enable it after completing the setup above and reviewing the Actions settings. No model provider, key value, or runner-host configuration is recorded here.

## Issue recovery

The issue-specific policy in `.lighthouse/implement.json` restores the immutable checkpoint for #53, then requires the normal independent checks and the issue’s owner visual/content acceptance. The checkpoint supplies source to verify; it grants no approval. Review or remove that override before requesting another implementation of #53 after its source has changed.
