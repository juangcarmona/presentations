---
layout: comparison
section: Validación
beforeTitle: Antes
afterTitle: Con IA
---

# La pirámide cambia de forma

::before::

<div class="flex flex-col items-center gap-1 text-sm text-white">
  <div class="flex h-9 w-[25%] items-center justify-center rounded bg-[#F33859] font-bold">E2E</div>
  <div class="flex h-9 w-[60%] items-center justify-center rounded bg-[#5585FF]">Integración</div>
  <div class="flex h-9 w-[95%] items-center justify-center rounded bg-[#333333]">Unitarios</div>
  <div class="mt-2 text-[#6B7280]">e2e caros de crear y mantener</div>
</div>

::after::

<div class="flex flex-col items-center gap-1 text-sm text-white">
  <div class="flex h-9 w-[80%] items-center justify-center rounded bg-[#2F69FF] font-bold">E2E desde la intención</div>
  <div class="flex h-9 w-[68%] items-center justify-center rounded bg-[#5585FF]">Integración</div>
  <div class="flex h-9 w-[95%] items-center justify-center rounded bg-[#333333]">Unitarios</div>
  <div class="mt-2 text-[#6B7280]">producto y arquitectura como fuente de verdad</div>
</div>

<!--
Problema clásico: mantener los tests actualizados. La pirámide existía por economía: los e2e eran caros de escribir y, sobre todo, de mantener. Si un agente los genera desde los escenarios de producto y los repara cuando cambia la UI, contra la intención y no contra el selector de ayer, la economía cambia y la forma también. Si producto y arquitectura se mantienen al día y son nuestra fuente de verdad, mantener los e2e deja de ser tan costoso. Siguen siendo más lentos y los unitarios siguen siendo la base. El riesgo: un agente que repara tests puede debilitar la aserción. Guardarraíl duro: la reparación puede cambiar cómo se ejecuta el test, nunca el escenario; cambiar el escenario es un cambio de producto que revisa una persona.
-->
