---
layout: default
---

<div class="plain-section-label">Anillo 4 · Validación</div>

# Los tests también son guardarraíles

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
  <div class="rounded-md bg-[#333333] px-4 py-2 text-white">Regla de negocio</div>
  <div class="rounded-md border border-[#DDE1EA] bg-white px-4 py-2">Given · When · Then</div>
  <div class="rounded-md border border-[#DDE1EA] bg-white px-4 py-2">Gherkin etiquetado</div>
  <div class="rounded-md border border-[#DDE1EA] bg-white px-4 py-2">Test ejecutable</div>
  <div class="rounded-md bg-[#2F69FF] px-4 py-2 text-white">Evidencia</div>
</div>
</div>

<!--
Del producto a la validación (PDaC-8). Las reglas de negocio generan obligaciones de verificación; el comportamiento estructurado con Given/When/Then se convierte en Gherkin y de ahí en tests ejecutables. La etiqueta enlaza test y regla, y los valores frontera, 29 y 31, salen de la definición, no de la imaginación del agente. Si la regla cambia, sabemos exactamente qué escenarios revisar. Frontera: PDaC deriva escenarios trazables; ejecutarlos y juzgarlos es cosa de vuestro pipeline. Y no solo comportamiento: arquitectura (NetArchTest, ArchUnit), seguridad y calidad también son guardarraíles; cada test debería poder decir qué decisión protege.
-->
