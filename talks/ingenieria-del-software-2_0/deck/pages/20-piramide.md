---
layout: default
---

<div class="plain-section-label">Validación</div>

# La pirámide cambia de forma

<div class="mt-6 grid grid-cols-2 gap-8">
  <div class="flex flex-col items-center gap-1 rounded-lg border border-[#DDE1EA] bg-white px-4 py-5 text-sm text-white">
    <div class="mb-2 text-xs font-bold uppercase tracking-widest text-[#6B7280]">Antes</div>
    <div class="flex h-10 w-[25%] items-center justify-center rounded bg-[#F33859] font-bold">E2E</div>
    <div class="flex h-10 w-[60%] items-center justify-center rounded bg-[#5585FF]">Integración</div>
    <div class="flex h-10 w-[95%] items-center justify-center rounded bg-[#333333]">Unitarios</div>
    <div class="mt-3 text-[#6B7280]">Pocos e2e: caros de crear y de mantener</div>
  </div>
  <div v-click class="flex flex-col items-center gap-1 rounded-lg border-2 border-[#2F69FF] bg-white px-4 py-5 text-sm text-white">
    <div class="mb-2 text-xs font-bold uppercase tracking-widest text-[#2F69FF]">Ahora</div>
    <div class="flex h-10 w-[80%] items-center justify-center rounded bg-[#2F69FF] font-bold">E2E desde la intención</div>
    <div class="flex h-10 w-[68%] items-center justify-center rounded bg-[#5585FF]">Integración</div>
    <div class="flex h-10 w-[95%] items-center justify-center rounded bg-[#333333]">Unitarios</div>
    <div class="mt-3 text-[#6B7280]">Producto y arquitectura como fuente de verdad</div>
  </div>
</div>

<!--
Primero la pirámide de siempre. Problema clásico: mantener los tests actualizados; la pirámide existía por economía, los e2e eran caros de escribir y sobre todo de mantener. [clic] Ahora: si producto y arquitectura se mantienen al día y son nuestra fuente de verdad, un agente genera los e2e desde los escenarios y los repara cuando cambia la UI, contra la intención y no contra el selector de ayer. Mantenerlos deja de ser tan costoso y la forma cambia. Siguen siendo más lentos y los unitarios siguen siendo la base. Riesgo: un agente que repara tests puede debilitar la aserción; la reparación puede cambiar cómo se ejecuta el test, nunca el escenario.
-->
