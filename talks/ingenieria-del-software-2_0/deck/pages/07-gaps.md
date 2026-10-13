---
layout: default
---

<div class="plain-section-label">Gaps de SDD</div>

# Cada spec describe un cambio, no el producto

```bash
$ grep -rn -i "refund" openspec/specs
billing:   Refunds are issued for purchases made in the last 30 days.
checkout:  Customers can request a refund within 30 days of delivery.
support:   If the order is less than a month old, offer a refund.
```

<div v-click class="mt-5 rounded-lg border-l-4 border-[#F33859] bg-white px-6 py-4">
  <div class="text-xs font-semibold uppercase tracking-widest text-[#F33859]">Caso real · 160 specs con OpenSpec</div>
  <div class="mt-1 text-lg font-bold">«Forbidden and mandatory, same file, same day, both marked MUST.»</div>
  <div class="mt-1 text-sm text-[#6B7280]">Dos modelos del mismo IVA, el esquema equivocado en runtime y un agujero de seguridad · <a href="https://jgcarmona.com/en/i-tried-to-prove-pdac-wrong/">jgcarmona.com/en/i-tried-to-prove-pdac-wrong</a></div>
</div>

<!--
El grep es el ejemplo de pdac.dev: tres specs, tres redacciones, dos significados. 30 días desde la compra no es lo mismo que 30 días desde la entrega. El caso real es de mi artículo "I Tried to Prove PDaC Wrong": un proyecto open source con 160 specs y 273 cambios archivados en OpenSpec que acabó con dos modelos distintos de la misma declaración de IVA holandesa. La spec oficial prohibía un servicio y, unas 380 líneas más abajo en el mismo fichero, lo exigía; ambas reglas marcadas como MUST. Resultado: el esquema equivocado en runtime, integraciones rotas y un agujero que permitía crear una declaración en los libros de otra empresa. Por qué: demasiadas specs y ningún sitio con la verdad del producto; cada cambio se comprobaba contra sí mismo, no contra el producto; y la validación comprueba forma, no significado. ¿Cuál es la fuente de verdad?
-->
