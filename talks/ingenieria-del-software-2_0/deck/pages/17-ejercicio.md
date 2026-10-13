---
layout: default
---

<div class="plain-section-label">Ejercicio</div>

# Cambiamos la regla: 30 → 14 días

<div class="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-4 text-sm">
  <div class="flex flex-col gap-2">
    <div class="rounded-md border border-[#DDE1EA] bg-white px-3 py-2">Solicitar devolución</div>
    <div class="rounded-md border border-[#DDE1EA] bg-white px-3 py-2">Calcular plazo</div>
    <div class="rounded-md border border-[#DDE1EA] bg-white px-3 py-2">Escenarios @BR-REFUND-001</div>
  </div>
  <div class="flex flex-col items-center gap-1 rounded-lg bg-[#2F69FF] px-6 py-5 text-white">
    <div class="text-base font-bold">BR-REFUND-001</div>
    <div class="text-xs opacity-85">modificada</div>
  </div>
  <div class="flex flex-col gap-2">
    <div class="rounded-md border-2 border-dashed border-[#F33859] bg-white px-3 py-2">billing/spec · stale</div>
    <div class="rounded-md border-2 border-dashed border-[#F33859] bg-white px-3 py-2">checkout/spec · stale</div>
    <div class="rounded-md border-2 border-dashed border-[#F33859] bg-white px-3 py-2">Prompt de soporte · stale</div>
  </div>
</div>

<div v-click class="mt-8 rounded-lg border-l-4 border-[#FBC740] bg-white px-6 py-4 text-lg">
  <b>Decisión humana primero:</b> ¿aplica a los pedidos ya entregados?
</div>

<!--
Ejercicio teórico. Negocio quiere reducir la ventana a 14 días. El cambio empieza como Product Change en la definición, se revisa en un PR por producto, negocio y legal, y todavía no hemos tocado código. PDaC recorre las relaciones declaradas: a la izquierda, artefactos de producto relacionados que revisar; a la derecha, lo que citaba la regla y queda stale: las specs del grep y el prompt del agente de soporte. Nada se reescribe solo. De ahí sale un backlog priorizado: primero la decisión humana, después los escenarios (definen qué es terminado), luego el código, las specs, los textos y las instrucciones del agente.
-->
