---
layout: console
---

# A red test, reported green

```bash
$ dotnet test | tail -5
✘ blocked by hooks/no-piped-verdicts.mjs — command not executed

  `dotnet test` output is piped into `tail`.
  In a pipeline, the exit code is the LAST command's —
  tail's, not the runner's. A red test reports green.

  Compliant shapes:
    set -o pipefail           # pipeline returns the first failure
    dotnet test > result.log  # the verdict comes from the runner itself
```

The command never runs. The repo wires hook scripts into the agent's harness — the wrapper around its shell — so every command is inspected before execution. A pipe launders the verdict: it substitutes the last command's exit code for the test runner's. This exact shape reported a red suite as green three times before the hook existed — so the hook now denies the shape itself, not just the incident.
