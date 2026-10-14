---
layout: console
---

# A failing test that looks green

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

The agent is not allowed to run verification in a way that can hide the original exit code.
