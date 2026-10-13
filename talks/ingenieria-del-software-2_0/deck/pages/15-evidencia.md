---
layout: default
---

<div class="plain-section-label">Anillo 5 · Evidencia</div>

# Qué se comprobó, contra qué, con qué resultado

<div class="mt-6 grid grid-cols-[3fr_2fr] items-center gap-6">
  <div class="rounded-lg border border-[#DDE1EA] bg-white px-6 py-5 text-sm shadow-sm">
    <div class="flex items-center gap-3">
      <span class="rounded-full bg-[#2F69FF] px-3 py-0.5 text-xs font-bold text-white">PR del agente</span>
      <span class="text-base font-bold">Ventana de devolución</span>
    </div>
    <hr class="my-3 border-[#E5E7EB]">
    <div class="flex flex-col gap-2">
      <div><b>Regla</b> · BR-REFUND-001, versión aceptada</div>
      <div><b>Citas</b> · ninguna stale</div>
      <div><b>Escenarios</b> · en verde, en este commit</div>
    </div>
  </div>
  <div class="flex flex-col gap-2">
    <div class="flex aspect-video items-center justify-center rounded-lg bg-[#222222] text-4xl text-[#FBC740]">▶</div>
    <div class="text-sm text-[#6B7280]">Vídeo del flujo en preproducción</div>
  </div>
</div>

<p v-click class="mt-6 text-lg">La evidencia da fundamento a la revisión humana. <strong>No la sustituye.</strong></p>

<!--
Un check verde no basta. El PR agéntico trae su evidencia: qué regla lo justifica y en qué versión, que no quedan citas desactualizadas, que los escenarios pasan en este commit exacto (la evidencia de otro commit no vale, como vimos con el harness) y un vídeo del flujo ejecutado en preproducción, generado al correr los e2e. Lo mismo sirve para un informe o una demo a negocio. Quien revisa ve el comportamiento, no solo el diff; pero la decisión de aceptar sigue siendo de una persona.
-->
