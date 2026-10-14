---
layout: default
---

<div class="plain-section-label">Guardarraíles</div>

# Dos tipos de guardarraíles

<div class="mt-8 flex max-w-5xl gap-6">

<div class="flex-1 rounded-2xl border-2 p-8" style="border-color:#2F69FF33; background:#2F69FF0d">
  <p class="text-xs font-bold uppercase tracking-widest" style="color:#2F69FF">Blandos</p>
  <h3 class="mt-3 text-2xl font-bold text-[#333333]">Guían</h3>
  <p class="mt-3 text-base text-[#6B7280] leading-relaxed">La regla existe, pero nada impide ignorarla.</p>
  <div class="mt-6 flex flex-wrap gap-2">
    <span class="rounded-full px-3 py-1 text-xs font-semibold" style="background:#2F69FF1a; color:#2F69FF">AGENTS.md / CLAUDE.md</span>
    <span class="rounded-full px-3 py-1 text-xs font-semibold" style="background:#2F69FF1a; color:#2F69FF">Skills</span>
    <span class="rounded-full px-3 py-1 text-xs font-semibold" style="background:#2F69FF1a; color:#2F69FF">ADRs y docs</span>
    <span class="rounded-full px-3 py-1 text-xs font-semibold" style="background:#2F69FF1a; color:#2F69FF">Reglas en warning</span>
    <span class="rounded-full px-3 py-1 text-xs font-semibold" style="background:#2F69FF1a; color:#2F69FF">Checklists</span>
  </div>
</div>

<div v-click class="flex-1 rounded-2xl border-2 p-8" style="border-color:#F3385933; background:#F338590d">
  <p class="text-xs font-bold uppercase tracking-widest" style="color:#F33859">Duros</p>
  <h3 class="mt-3 text-2xl font-bold text-[#333333]">Bloquean</h3>
  <p class="mt-3 text-base text-[#6B7280] leading-relaxed">La herramienta se niega a continuar si se rompe la regla.</p>
  <div class="mt-6 flex flex-wrap gap-2">
    <span class="rounded-full px-3 py-1 text-xs font-semibold" style="background:#F338591a; color:#F33859">Analizadores</span>
    <span class="rounded-full px-3 py-1 text-xs font-semibold" style="background:#F338591a; color:#F33859">Tests de arquitectura</span>
    <span class="rounded-full px-3 py-1 text-xs font-semibold" style="background:#F338591a; color:#F33859">Hooks de commit</span>
    <span class="rounded-full px-3 py-1 text-xs font-semibold" style="background:#F338591a; color:#F33859">CI obligatoria</span>
    <span class="rounded-full px-3 py-1 text-xs font-semibold" style="background:#F338591a; color:#F33859">Hooks del harness</span>
    <span class="rounded-full px-3 py-1 text-xs font-semibold" style="background:#F338591a; color:#F33859">Citas de producto en CI</span>
  </div>
</div>

</div>

<!--
Guardarraíles: restricciones que mantienen los cambios dentro de límites aceptables. Los blandos guían: la regla existe, pero nada impide ignorarla. [clic] Los duros bloquean: la herramienta se niega a continuar. Cuatro superficies para los duros: build, commit, CI y la nueva, el harness del agente, que intercepta lo que el agente intenta hacer. Ejemplo real: el agente encadena dotnet test con tail; en una tubería el código de salida es el de tail, y un test rojo informa verde. El hook lo bloquea antes de ejecutarlo. La cooperación del agente no es evidencia. Algunos blandos merecen volverse duros: cuando una regla importa lo suficiente, se hace ejecutable. Veremos más guardarraíles duros en el resto de la charla: citas de producto en CI y los tests. Más detalle: mi charla de guardarraíles blandos y duros.
-->
