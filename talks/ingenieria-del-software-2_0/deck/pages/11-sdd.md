---
layout: default
---

<div class="plain-section-label">Anillo 2 · Especificación</div>

# SDD funciona… hasta que las specs divergen

<div class="mt-4 flex items-center gap-2 text-sm font-semibold">
  <span class="rounded-full bg-[#E6EDFF] px-4 py-1 text-[#2F69FF]">Especificar</span><span class="text-[#2F69FF]">→</span>
  <span class="rounded-full bg-[#E6EDFF] px-4 py-1 text-[#2F69FF]">Planificar</span><span class="text-[#2F69FF]">→</span>
  <span class="rounded-full bg-[#E6EDFF] px-4 py-1 text-[#2F69FF]">Tareas</span><span class="text-[#2F69FF]">→</span>
  <span class="rounded-full bg-[#2F69FF] px-4 py-1 text-white">Implementar</span>
</div>

```bash
$ grep -rn -i "refund" openspec/specs
billing:   Refunds are issued for purchases made in the last 30 days.
checkout:  Customers can request a refund within 30 days of delivery.
support:   If the order is less than a month old, offer a refund.
```

<p v-click class="mt-4 text-xl font-bold">Tres specs, dos significados. <span class="text-[#2F69FF]">¿Cuál es la fuente de verdad?</span></p>

<!--
SDD (GitHub Spec Kit, Kiro, OpenSpec…) mejora mucho el prompt suelto: intención explícita, diseño revisado antes del diff, contexto acotado. El coste: cada spec describe un cambio, y como el cambio depende de reglas de negocio, las reglas se copian de spec en spec. Y lo que se copia, diverge. Este grep es el ejemplo de la portada de pdac.dev: 30 días desde la compra no es lo mismo que 30 días desde la entrega, y «un mes» no es ninguna de las dos. Pausa en la pregunta.
-->
