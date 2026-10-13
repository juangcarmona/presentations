---
layout: default
---

<div class="plain-section-label">ProductShape</div>

# Definida una vez, citada por todos

<div class="mt-4 grid grid-cols-2 gap-6">
<div>

```yaml
# docs/product/rules/BR-REFUND-001.md
id: BR-REFUND-001
type: business-rule
status: active

## Rule
Refunds are accepted within
30 days of delivery.
```

</div>
<div class="flex flex-col gap-4">

```bash
$ prodshape citations verify
stale  BR-REFUND-001
  openspec/specs/billing/spec.md:4
```

<div class="rounded-lg bg-[#2F69FF] px-5 py-4 text-center text-white">
  <div class="text-xs font-semibold uppercase tracking-widest opacity-80">Demo en vivo</div>
  <div class="text-xl font-bold">Snapshot de DomusMind</div>
</div>

</div>
</div>

<!--
ProductShape es la implementación de referencia de PDaC. La regla vive una vez, con un id estable; specs, tickets, prompts y docs la citan. Markdown es la fuente de verdad y el grafo se deriva. Si la regla cambia, cada cita pasa a stale y nunca se reescribe sola: PDaC detecta, cada consumidor decide. En CI es un guardarraíl duro sobre el conocimiento de producto. Demo: abrir el snapshot generado en DomusMind.
-->
