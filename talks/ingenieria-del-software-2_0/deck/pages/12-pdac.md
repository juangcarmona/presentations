---
layout: default
---

<div class="plain-section-label">Anillo 3 · Producto</div>

# Product Definition as Code

<div class="mt-6 grid grid-cols-[5fr_1.4fr_6fr] items-center gap-3 text-sm">
  <div class="overflow-hidden rounded-lg border-2 border-[#333333] bg-white">
    <div class="bg-[#333333] px-4 py-2 text-center font-bold tracking-widest text-white">DEFINICIÓN ACEPTADA</div>
    <div class="px-4 py-6 text-center">
      <div class="text-base">versionada · relacionada · revisable</div>
      <div class="mt-1 text-[#6B7280]">qué significa el producto</div>
    </div>
  </div>
  <div class="text-center font-semibold">citada por<br><span class="text-2xl">→</span></div>
  <div class="grid grid-cols-2 gap-2">
    <div class="rounded-md border-2 border-[#2F69FF] bg-white py-2 text-center">Specs SDD</div>
    <div class="rounded-md border-2 border-[#2F69FF] bg-white py-2 text-center">Agentes</div>
    <div class="rounded-md border-2 border-[#2F69FF] bg-white py-2 text-center">Personas</div>
    <div class="rounded-md border-2 border-[#2F69FF] bg-white py-2 text-center">Backlog</div>
    <div class="col-span-2 rounded-md border-2 border-[#2F69FF] bg-white py-2 text-center">Código y tests</div>
  </div>
</div>

<div v-click class="mt-6 rounded-md border-2 border-dashed border-[#2F69FF] px-4 py-2 text-center text-sm font-semibold text-[#2F69FF]">
  ← la evidencia de entrega propone nuevos cambios de producto
</div>

<!--
El mapa de un minuto de PDaC (pdac.dev, diagrama PDaC-0). A la izquierda, la definición de producto aceptada: Markdown versionado, con relaciones explícitas, revisable en un PR. A la derecha, todo lo que la consume la cita en lugar de copiarla. La flecha de vuelta: lo que aprendemos al construir no cambia la definición por su cuenta, la propone como Product Change. Autoridad en una dirección, aprendizaje en las dos. PDaC es una propuesta metodológica abierta, no un producto.
-->
