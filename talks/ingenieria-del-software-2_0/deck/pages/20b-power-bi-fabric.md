---
layout: default
---

<div class="plain-section-label">Power BI y Fabric</div>

# ¿Y si trabajas con Power BI y Fabric?

```bash
$ grep -rn "Ventas netas" .
finanzas.tmdl:   measure 'Ventas netas' = [Bruto] - [Devoluciones] - [Descuentos]
comercial.tmdl:  measure 'Ventas netas' = [Bruto] - [Descuentos]
cierre.ipynb:    ventas_netas = facturado.sum()   # sin abonos
```

<div v-click class="mt-5 grid grid-cols-3 gap-3 text-sm">
  <div class="rounded-md border border-[#DDE1EA] border-t-4 border-t-[#2F69FF] bg-white px-4 py-3">
    <div class="text-base font-bold">Contexto</div>
    <div class="text-[#6B7280]">Modelo en PBIP/TMDL en Git, <code>AGENTS.md</code> con vuestras convenciones y Skills for Fabric</div>
  </div>
  <div class="rounded-md border border-[#DDE1EA] border-t-4 border-t-[#3ABAAF] bg-white px-4 py-3">
    <div class="text-base font-bold">Herramientas</div>
    <div class="text-[#6B7280]">Power BI Modeling MCP: el agente lee el modelo y valida DAX. Solo lectura por defecto</div>
  </div>
  <div class="rounded-md border border-[#DDE1EA] border-t-4 border-t-[#FBC740] bg-white px-4 py-3">
    <div class="text-base font-bold">Fuente de verdad</div>
    <div class="text-[#6B7280]">Cada KPI definido una vez, con ID estable, y citado por medidas, notebooks e informes</div>
  </div>
</div>

<!--
Para esta sala. El grep de devoluciones, en vuestro idioma: tres "ventas netas", tres definiciones. ¿A quién no le ha pasado que dos cuadros de mando no cuadran? (Ejemplo ilustrativo, no de un cliente real.)
Contexto: si el modelo semántico se guarda como Power BI Project (PBIP/TMDL) en Git, es texto, y un agente lo trabaja como código. Un AGENTS.md con vuestras convenciones (nombres, dónde van las medidas, qué tabla es la de hechos) y las Skills for Fabric de Microsoft, open source, que se instalan como plugin en Claude Code y Copilot CLI y que Codex u OpenCode leen vía AGENTS.md.
Herramientas: el Power BI Modeling MCP Server de Microsoft (en preview) deja a un agente crear y modificar tablas, medidas, relaciones y RLS, y ejecutar y validar DAX, contra Power BI Desktop, Fabric o PBIP. Guardarraíles duros: arrancarlo en --readonly, mantener la confirmación del primer cambio y cambiar el modelo solo por PR. Avisos: backup del modelo antes de usarlo; los metadatos y resultados de consultas llegan al proveedor del LLM; no pinta páginas de informe. Microsoft recomienda VS Code con Copilot y dice que funciona con otros clientes MCP.
Fuente de verdad: PDaC aplicado a métricas. "Cliente activo" o "Ventas netas" con un ID estable; si negocio cambia la definición, todo lo que la citaba queda stale. Y tests Given/When/Then sobre datos: dado el cierre de marzo, cuando refresco, las ventas netas cuadran con contabilidad.
-->
