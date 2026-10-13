---
layout: default
---

<div class="plain-section-label">Big picture</div>

# Cinco etapas, dos bases de conocimiento, un contrato

<div class="mt-3 grid grid-cols-5 gap-2 text-[11px] leading-tight">
  <div class="overflow-hidden rounded-md border border-[#DDE1EA] bg-white">
    <div class="bg-[#1F2937] py-1 text-center text-xs font-bold text-white">1 · Discovery</div>
    <div class="flex flex-col gap-1 p-1.5">
      <div class="flex justify-between rounded border border-[#2F69FF] bg-[#E6EDFF] px-1.5 py-1">Grill-Me Agent <b class="text-[#23877E]">I</b></div>
      <div class="flex justify-between rounded border border-[#2F69FF] bg-[#E6EDFF] px-1.5 py-1">Business Reviewer <b class="text-[#B07D00]">P</b></div>
      <div class="rounded border border-[#A855F7] bg-[#F5EDFF] px-1.5 py-1 text-center">PM/PO + stakeholders aprueban</div>
      <div class="rounded border border-[#FBC740] bg-[#FFF8E6] px-1.5 py-1 text-center">Doc. de negocio · Decision Record</div>
    </div>
  </div>
  <div class="overflow-hidden rounded-md border border-[#DDE1EA] bg-white">
    <div class="bg-[#1F2937] py-1 text-center text-xs font-bold text-white">2 · Refinement</div>
    <div class="flex flex-col gap-1 p-1.5">
      <div class="flex justify-between rounded border border-[#2F69FF] bg-[#E6EDFF] px-1.5 py-1">PO Agent <b class="text-[#23877E]">I</b></div>
      <div class="flex justify-between rounded border border-[#2F69FF] bg-[#E6EDFF] px-1.5 py-1">DRA <b class="text-[#6B7280]">D</b></div>
      <div class="rounded border border-[#A855F7] bg-[#F5EDFF] px-1.5 py-1 text-center">PM/PO + devs resuelven dudas</div>
      <div class="rounded border border-[#FBC740] bg-[#FFF8E6] px-1.5 py-1 text-center">Ticket listo + escenarios congelados</div>
    </div>
  </div>
  <div class="overflow-hidden rounded-md border border-[#DDE1EA] bg-white">
    <div class="bg-[#1F2937] py-1 text-center text-xs font-bold text-white">3 · Implementation</div>
    <div class="flex flex-col gap-1 p-1.5">
      <div class="flex justify-between rounded border border-[#2F69FF] bg-[#E6EDFF] px-1.5 py-1">Dev Agent <b class="text-[#23877E]">I</b></div>
      <div class="flex justify-between rounded border border-[#2F69FF] bg-[#E6EDFF] px-1.5 py-1">Reviewer Agent <b class="text-[#23877E]">I</b></div>
      <div class="rounded border border-[#A855F7] bg-[#F5EDFF] px-1.5 py-1 text-center">Devs reciben escalados</div>
      <div class="rounded border border-[#FBC740] bg-[#FFF8E6] px-1.5 py-1 text-center">Entrega + resultado de la revisión</div>
    </div>
  </div>
  <div class="overflow-hidden rounded-md border border-[#DDE1EA] bg-white">
    <div class="bg-[#1F2937] py-1 text-center text-xs font-bold text-white">4 · Verificación</div>
    <div class="flex flex-col gap-1 p-1.5">
      <div class="flex justify-between rounded border border-[#2F69FF] bg-[#E6EDFF] px-1.5 py-1">Pre-push hooks <b class="text-[#6B7280]">D</b></div>
      <div class="flex justify-between rounded border border-[#2F69FF] bg-[#E6EDFF] px-1.5 py-1">CI: gates + Reviewer <b class="text-[#6B7280]">D</b></div>
      <div class="rounded border border-[#A855F7] bg-[#F5EDFF] px-1.5 py-1 text-center">Devs aceptan la PR</div>
      <div class="rounded border border-[#FBC740] bg-[#FFF8E6] px-1.5 py-1 text-center">PR aceptada → Done</div>
    </div>
  </div>
  <div class="overflow-hidden rounded-md border border-[#DDE1EA] bg-white">
    <div class="bg-[#1F2937] py-1 text-center text-xs font-bold text-white">5 · Docs</div>
    <div class="flex flex-col gap-1 p-1.5">
      <div class="flex justify-between rounded border border-[#2F69FF] bg-[#E6EDFF] px-1.5 py-1">Docs Writer <b class="text-[#6B7280]">D</b></div>
      <div class="flex justify-between rounded border border-[#2F69FF] bg-[#E6EDFF] px-1.5 py-1">Docs Reviewer <b class="text-[#6B7280]">D</b></div>
      <div class="rounded border border-[#A855F7] bg-[#F5EDFF] px-1.5 py-1 text-center">Devs aceptan la PR de docs</div>
      <div class="rounded border border-[#FBC740] bg-[#FFF8E6] px-1.5 py-1 text-center">Documentación sincronizada</div>
    </div>
  </div>
</div>

<div class="mt-2 grid grid-cols-5 gap-2 text-[11px]">
  <div class="col-span-2 rounded-md border-2 border-[#FBC740] bg-[#FFF8E6] px-2 py-1"><b>KB de negocio</b> <span class="text-[#6B7280]">· docs/product · Discovery la escribe, el DRA la lee, la aprueba una persona</span></div>
  <div class="col-span-3 rounded-md border-2 border-[#FBC740] bg-[#FFF8E6] px-2 py-1"><b>KB técnica</b> <span class="text-[#6B7280]">· docs/architecture · Dev y Reviewer la leen, Docs la actualiza vía PR, la aprueba una persona</span></div>
</div>

<div class="mt-2 flex items-center gap-1.5 rounded-md border-2 border-[#8B5E3C] bg-[#FBF5EF] px-3 py-1.5 text-[11px]">
  <b class="mr-2">Ticket = contrato</b>
  <span class="rounded border border-[#333333] bg-white px-2 py-0.5 font-semibold">Backlog</span>→
  <span class="rounded border border-[#333333] bg-white px-2 py-0.5 font-semibold">Ready-For-Dev</span>→
  <span class="rounded border border-[#333333] bg-white px-2 py-0.5 font-semibold">In-Progress</span>→
  <span class="rounded border border-[#333333] bg-white px-2 py-0.5 font-semibold">Accepted</span>→
  <span class="rounded border border-[#333333] bg-white px-2 py-0.5 font-semibold">Done</span>
  <span class="ml-2 text-[#6B7280]">Excepciones: Blocked · Change-Requested · Rejected · Ticket-Invalid</span>
</div>

<div class="mt-1.5 text-[10px] text-[#6B7280]">Agente (azul) · Humano decide (morado) · Artefacto (ámbar) · Madurez: <b class="text-[#23877E]">I</b> implementado · <b class="text-[#B07D00]">P</b> parcial · <b>D</b> diseño</div>

<!--
Cómo lo articulo hoy. Macro-flujo: cinco etapas, cada una con su micro-flujo de agentes bajo el framework determinista que acabamos de ver, una decisión humana explícita y un artefacto de salida. Dos bases de conocimiento: la de negocio, que es docs/product con PDaC, la escribe Discovery y la aprueba una persona; la técnica, docs/architecture con arc42 y ADRs, la leen Dev y Reviewer y la actualiza la etapa Docs vía PR. Aquí viven remember e improve del bucle anterior: lo aprendido vuelve a las KB, siempre a través de una PR que aprueba una persona. Y un contrato: el ticket. Su estado dice en qué punto del ciclo está el trabajo, con excepciones explícitas. Bucles acotados: Verificación devuelve a Implementation con cambios solicitados; si se agota el contador, Blocked y vuelve a Refinement o a una persona. Ser honesto con la madurez: Discovery, Refinement e Implementation tienen piezas implementadas; Verificación y Docs están en diseño.
-->
