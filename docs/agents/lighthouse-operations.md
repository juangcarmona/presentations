# Lighthouse workflow operation

Read this before changing Lighthouse workflows or enabling automation.

## Installed baseline

This adoption pins `@juangcarmona/lighthouse@0.11.6` and `@juangcarmona/lighthouse-sdlc@0.15.2`; `package-lock.json` records the full dependency graph. The installed workflow sources point to Lighthouse commit `983c4797b50c9ee3b575f2525097382e52daabf8` and were compiled with `gh aw` v0.93.2. The installed stages are triage, refine, propose, implement, integrate, review, and apply-review. This reviewed source pin includes the validation-workspace branch fix; the selected npm packages remain CLI 0.11.6 and SDLC 0.15.2 until the next package release. Use `npm run lighthouse:verify` to check the installed baseline. Install or upgrade workflows with the pinned SDLC package's `src/install-workflows.mjs` and compile their generated locks with the repository's pinned `gh aw` CLI.

The router and lifecycle workers are installed, but GitHub Actions automation is gated by the repository variable `LIGHTHOUSE_AUTOMATION_ENABLED`. It must remain `false` until an owner confirms the runtime, provider credentials, workflow permissions, and triggers are ready. The installed completion workflow also allows refinement to continue automatically into implementation when the gate is enabled.

## Credentials and runtime

- The router and publisher use the workflow-scoped `GITHUB_TOKEN` with permissions declared in each job. Repository-wide workflow permissions remain read-only, and Actions approval of pull requests is disabled. Before enabling automation, an owner must verify whether Actions is allowed to create pull requests; this adoption does not enable that capability. A separate personal access token or GitHub App token is not part of this setup.
- Stage workers require a Linux runner labelled `lighthouse-workflow`, Docker, and the runner environment variable `LIGHTHOUSE_ENGINE_CONFIG` pointing to an operator-managed OpenCode engine configuration.
- Provider authentication belongs in that operator-managed engine configuration and its runtime environment. Store provider credentials in the host's approved secret store and inject them into the engine; never commit credentials or print them in logs.
- GitHub repository secrets were empty when this adoption was prepared. The exact provider key name depends on the operator's engine configuration and selected provider; configure it on the runner, not in repository source.
- The runner must be dedicated to trusted repository workflows because its Docker access is privileged host access. Review the workflow permissions and runner isolation before enabling automation.

The repository variable is intentionally set to `false` while credentials and runtime configuration remain unverified. An owner can enable it after completing the setup above and reviewing the Actions settings. No model provider, key value, or runner-host configuration is recorded here.
