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

Raw HTML is forbidden where the application contract requires a design-system component.
CI rejects the change unless an explicit exception is declared.
