---
layout: default
---

<div class="plain-section-label">Código</div>

# Estructura ideal

<div class="mt-6 grid grid-cols-[3fr_2fr] items-center gap-8">
<div class="rounded-xl bg-[#222222] px-7 py-5 font-mono text-sm leading-7 text-[#E8E8E8] shadow-lg">
  <div>├── AGENTS.md <span class="text-[#9AA3AF]">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# mapa de contexto</span></div>
  <div>├── CLAUDE.md <span class="text-[#9AA3AF]">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# @AGENTS.md</span></div>
  <div>├── .agents/skills/ <span class="text-[#9AA3AF]">&nbsp;&nbsp;&nbsp;# capacidades</span></div>
  <div>├── <span class="text-[#FBC740]">src/</span> <span class="text-[#9AA3AF]">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# todo el código</span></div>
  <div>├── tests/ <span class="text-[#9AA3AF]">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# unit · e2e</span></div>
  <div>└── <span class="text-[#FBC740]">docs/</span> <span class="text-[#9AA3AF]">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# todo el conocimiento</span></div>
  <div>&nbsp;&nbsp;&nbsp;&nbsp;├── product/ <span class="text-[#9AA3AF]">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# el QUÉ · PDaC</span></div>
  <div>&nbsp;&nbsp;&nbsp;&nbsp;├── architecture/ <span class="text-[#9AA3AF]">&nbsp;# el CÓMO · arc42</span></div>
  <div>&nbsp;&nbsp;&nbsp;&nbsp;└── design/ <span class="text-[#9AA3AF]">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# UX y UI</span></div>
</div>
<div class="flex flex-col gap-5 text-lg">
  <div><strong>src/</strong> para el código.</div>
  <div><strong>docs/</strong> para el conocimiento.</div>
  <div>Cada decisión, en un solo sitio.</div>
</div>
</div>

<!--
src como raíz del código, docs como raíz de la documentación: producto, arquitectura y diseño. AGENTS.md dice dónde mirar; no lo explica todo. CLAUDE.md tiene una sola línea que importa AGENTS.md. Una regla, un sitio, y todo lo demás apunta. Ejemplo real: el repositorio donde preparo esta charla funciona así. Las dos ramas de docs, producto y arquitectura, van a ser nuestras dos fuentes de verdad.
-->
