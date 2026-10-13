---
layout: default
---

<div class="plain-section-label">Anillo 6 · Operación</div>

# Producción propone cambios. No los impone.

<div class="mt-6 flex items-stretch gap-2 text-sm font-semibold">
  <div class="flex-1 rounded-md border border-[#DDE1EA] border-t-4 border-t-[#F33859] bg-white px-3 py-3">Señal en producción</div>
  <div class="self-center text-[#6B7280]">→</div>
  <div class="flex-1 rounded-md border border-[#DDE1EA] border-t-4 border-t-[#FBC740] bg-white px-3 py-3">Pregunta de producto</div>
  <div class="self-center text-[#6B7280]">→</div>
  <div class="flex-1 rounded-md border border-[#DDE1EA] border-t-4 border-t-[#5585FF] bg-white px-3 py-3">Product Change propuesto</div>
  <div class="self-center text-[#6B7280]">→</div>
  <div class="flex-1 rounded-md border border-[#DDE1EA] border-t-4 border-t-[#2F69FF] bg-white px-3 py-3">Revisión humana</div>
</div>

<div v-click class="mt-8 rounded-lg border-l-4 border-[#FBC740] bg-white px-6 py-4 text-lg">
  Soporte acumula quejas: devoluciones rechazadas el día 31 con entregas que llegaron tarde. <b>¿Bug, o la regla no dice lo que queríamos?</b>
</div>

<!--
Operación no es solo que el sistema esté arriba: es donde el producto se encuentra con la realidad. Uso real, errores, soporte y métricas de negocio. En el ejemplo aparece una pregunta que la regla no resolvía: ¿qué fecha de entrega cuenta, la del transportista o la confirmación del cliente? No es un ticket de bug, es una pregunta de producto. Los agentes de operación ayudan con triage, diagnóstico con runbooks como skills y propuestas por PR, pero con los mismos guardarraíles: solo lectura por defecto y cualquier cambio por PR, checks y evidencia. Mismo bucle que PDaC-0.
-->
