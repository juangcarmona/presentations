---
layout: default
---

<div class="plain-section-label">Anillo 3 · docs/product</div>

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
<div>

```bash
$ prodshape citations verify
stale  BR-REFUND-001
  openspec/specs/billing/spec.md:4
```

<p class="mt-4 text-lg">En CI, el conocimiento de producto obsoleto <strong>deja de ser invisible.</strong></p>

</div>
</div>

<!--
El segundo y tercer acto del ejemplo de pdac.dev. La regla vive una vez, en docs/product, con un id estable; specs, tickets, prompts y docs la citan. Markdown es la fuente de verdad y el grafo de artefactos se deriva. Cuando la regla cambia, cada cita pasa a stale (los estados son current, stale, unresolved y tampered) y nunca se reescribe sola: PDaC detecta, cada consumidor decide. ProductShape es la implementación de referencia. En CI es un guardarraíl duro, pero sobre el conocimiento de producto: el mismo concepto que junto al código, un anillo más afuera.
-->
