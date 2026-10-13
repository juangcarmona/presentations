---
layout: default
---

<div class="plain-section-label">Validación</div>

# Del comportamiento estructurado al test

<div class="mt-4 grid grid-cols-[3fr_2fr] items-center gap-6">
<div>

```gherkin
@BR-REFUND-001
Feature: Ventana de devolución

  Scenario: Dentro de plazo
    Given un pedido entregado hace 29 días
    When el cliente pide la devolución
    Then se acepta

  Scenario: Fuera de plazo
    Given un pedido entregado hace 31 días
    Then se rechaza
```

</div>
<div class="flex flex-col gap-2 text-sm font-semibold">
  <div class="rounded-md bg-[#333333] px-4 py-2 text-white">Structured behaviour (PDaC)</div>
  <div class="rounded-md border border-[#DDE1EA] bg-white px-4 py-2">Criterios Given / When / Then en el backlog</div>
  <div class="rounded-md border border-[#DDE1EA] bg-white px-4 py-2">Gherkin etiquetado con la regla</div>
  <div class="rounded-md border border-[#DDE1EA] bg-white px-4 py-2">Tests e2e ejecutables</div>
  <div class="rounded-md bg-[#2F69FF] px-4 py-2 text-white">Evidencia</div>
</div>
</div>

<!--
Volvemos a PDaC. El comportamiento estructurado de la definición de producto, con sus Given/When/Then, se convierte en criterios de aceptación al crear el backlog. De ahí generamos Gherkin etiquetado con la regla y tests e2e ejecutables. Los valores frontera, 29 y 31, salen de la regla, no de la imaginación del agente. Si la regla cambia, sabemos exactamente qué escenarios revisar. PDaC deriva escenarios trazables; ejecutarlos y juzgarlos es cosa del pipeline. La evidencia (qué se comprobó, contra qué decisión, con qué resultado, en qué commit, incluso un vídeo del flujo en preproducción) viaja con el PR y da fundamento a la revisión humana; no la sustituye.
-->
