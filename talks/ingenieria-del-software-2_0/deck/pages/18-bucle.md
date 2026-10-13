---
layout: default
---

<div class="plain-section-label">Ejercicio · el bucle de cada cambio</div>

# plan → test → implement → review → verify → remember → improve

<div class="mt-6 grid grid-cols-4 gap-2 text-sm">
  <div class="rounded-md border border-[#DDE1EA] border-t-4 border-t-[#2F69FF] bg-white px-3 py-2"><div class="text-base font-bold">plan</div><div class="text-[#6B7280]">Product Change y una spec por elemento</div></div>
  <div class="rounded-md border border-[#DDE1EA] border-t-4 border-t-[#5585FF] bg-white px-3 py-2"><div class="text-base font-bold">test</div><div class="text-[#6B7280]">Escenarios de 13 y 15 días, en rojo</div></div>
  <div class="rounded-md border border-[#DDE1EA] border-t-4 border-t-[#3ABAAF] bg-white px-3 py-2"><div class="text-base font-bold">implement</div><div class="text-[#6B7280]">Billing, dentro de los guardarraíles</div></div>
  <div class="rounded-md border border-[#DDE1EA] border-t-4 border-t-[#FBC740] bg-white px-3 py-2"><div class="text-base font-bold">review</div><div class="text-[#6B7280]">Auditor fuera de contexto y una persona</div></div>
  <div class="rounded-md border border-[#DDE1EA] border-t-4 border-t-[#F33859] bg-white px-3 py-2"><div class="text-base font-bold">verify</div><div class="text-[#6B7280]">Evidencia en el PR contra la intención</div></div>
  <div class="rounded-md border border-[#DDE1EA] border-t-4 border-t-[#333333] bg-white px-3 py-2"><div class="text-base font-bold">remember</div><div class="text-[#6B7280]">Prompt de soporte y memoria, al día</div></div>
  <div class="rounded-md border border-[#DDE1EA] border-t-4 border-t-[#333333] bg-white px-3 py-2"><div class="text-base font-bold">improve</div><div class="text-[#6B7280]">La verificación de citas, obligatoria en CI</div></div>
  <div class="flex items-center rounded-md bg-[#2F69FF] px-3 py-2 font-semibold text-white">Los dos últimos hacen que el sistema aprenda.</div>
</div>

<!--
El bucle que recorre cada cambio. Es el que propone ECC (github.com/affaan-m/ECC), un trabajo muy potente de optimización de harnesses con memoria, instincts y aprendizaje continuo. Encaja con toda la charla: plan es SDD apoyado en PDaC; test son los escenarios derivados de las reglas, en rojo antes de implementar; implement ocurre dentro de los guardarraíles; review combina un auditor fuera del contexto del autor y una persona; verify es la evidencia contra la intención. Remember e improve son los que solemos saltarnos: lo aprendido vuelve a instrucciones y memoria, y una regla blanda pasa a ser dura. Este es el bucle de cada cambio; por fuera está el bucle de producto de PDaC.
-->
