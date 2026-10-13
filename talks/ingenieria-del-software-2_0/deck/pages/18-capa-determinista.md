---
layout: default
---

<div class="plain-section-label">Desarrollo · capa determinista</div>

# El agente es probabilista. El framework, determinista.

<div class="mt-5 flex items-center gap-1 text-xs">
  <div class="flex-1 rounded-md border-2 border-[#FBC740] bg-[#FFF8E6] px-2 py-2 text-center"><div class="font-bold">Ticket</div><div class="text-[#6B7280]">Ready-For-Dev</div></div>
  <span class="text-[#6B7280]">→</span>
  <div class="flex-1 rounded-md border-2 border-[#6B7280] bg-white px-2 py-2 text-center"><div class="text-[10px] font-semibold tracking-wider text-[#6B7280]">SCRIPT</div><div class="font-bold">Validar ticket</div></div>
  <span class="text-[#6B7280]">→</span>
  <div class="flex-1 rounded-md border-2 border-[#2F69FF] bg-[#E6EDFF] px-2 py-2 text-center"><div class="text-[10px] font-semibold tracking-wider text-[#2F69FF]">AGENTE · LLM</div><div class="font-bold">Dev Agent</div></div>
  <span class="text-[#6B7280]">→</span>
  <div class="flex-1 rounded-md border-2 border-[#6B7280] bg-white px-2 py-2 text-center"><div class="text-[10px] font-semibold tracking-wider text-[#6B7280]">SCRIPT</div><div class="font-bold">Validar entrega</div></div>
  <span class="text-[#6B7280]">→</span>
  <div class="flex-1 rounded-md border-2 border-[#2F69FF] bg-[#E6EDFF] px-2 py-2 text-center"><div class="text-[10px] font-semibold tracking-wider text-[#2F69FF]">AGENTE · LLM</div><div class="font-bold">Reviewer Agent</div></div>
  <span class="text-[#6B7280]">→</span>
  <div class="flex-1 rounded-md border-2 border-[#6B7280] bg-white px-2 py-2 text-center"><div class="text-[10px] font-semibold tracking-wider text-[#6B7280]">SCRIPT</div><div class="font-bold">Aplicar veredicto</div></div>
</div>

<div class="mt-3 grid grid-cols-3 gap-2 text-xs">
  <div class="rounded-md border-2 border-[#3ABAAF] bg-[#EAF7F6] px-3 py-2"><b>Aceptado</b> → pre-push + CI</div>
  <div class="rounded-md border-2 border-dashed border-[#D9A21B] bg-[#FFF8E6] px-3 py-2"><b>Cambios solicitados</b> → vuelve a Dev si contador &lt; máx.</div>
  <div class="rounded-md border-2 border-[#F33859] bg-[#FDECEF] px-3 py-2"><b>Rechazado · Blocked</b> → refinement o una persona</div>
</div>

<div v-click class="mt-5 grid grid-cols-4 gap-2 text-xs">
  <div class="rounded-md border border-[#DDE1EA] bg-white px-3 py-2"><div class="text-sm font-bold">Entradas y salidas</div><div class="text-[#6B7280]">con esquema validado</div></div>
  <div class="rounded-md border border-[#DDE1EA] bg-white px-3 py-2"><div class="text-sm font-bold">Rutas por código</div><div class="text-[#6B7280]">el framework evalúa la condición</div></div>
  <div class="rounded-md border border-[#DDE1EA] bg-white px-3 py-2"><div class="text-sm font-bold">Límites de bucle</div><div class="text-[#6B7280]">iteraciones máximas y contador</div></div>
  <div class="rounded-md border border-[#DDE1EA] bg-white px-3 py-2"><div class="text-sm font-bold">Puntos humanos</div><div class="text-[#6B7280]">gates explícitos de decisión</div></div>
</div>

<!--
El hook del harness era un guardarraíl duro sobre un comando. Esto es lo mismo aplicado a todo el flujo de implementación. El framework orquesta con código y esquemas; el LLM no decide el camino. Los scripts validan el ticket, validan la estructura y las evidencias de la entrega y aplican el veredicto del revisor. Los agentes solo hacen lo que es probabilista: implementar y auditar criterios. Si el revisor pide cambios, el flujo vuelve a Dev con el resultado de la revisión, pero con un techo duro: un contador compartido por ticket. Agotado, el ticket queda Blocked y vuelve a refinement o a una persona. Ejemplo de herramienta: Microsoft Conductor. Madurez: el framework está implementado; el contador, a medias. Frase de cierre: el workflow y sus controles son deterministas; lo que genera el agente, no. El código fija qué entra, qué sale y cuándo parar.
-->
