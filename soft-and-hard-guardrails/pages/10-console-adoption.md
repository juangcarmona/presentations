---
layout: console
---

# A `<button>` the design system never saw

```js
// scripts/check-adoption.mjs — pnpm check:adoption
// per-app contracts: form app → ui-*, admin app → ds-*
const RAW_NATIVE = ['button', 'select', 'input[type=date]'];

for (const node of templateNodes) {
  if (RAW_NATIVE.includes(node.tag) && !node.line.includes('adoption-allow')) {
    violations.push(`${node.file}:${node.line}  <${node.tag}> instead of ${app.prefix}-*`);
  }
}

if (violations.length) process.exit(1); // wired into build.frontend.yml
```

An app template uses a raw `<button>` where its app is contracted to use the design-system component. The build fails. The substitute list is per app, not global, and exceptions are declared inline — an `adoption-allow` comment next to the code itself, where reviewers see it.
