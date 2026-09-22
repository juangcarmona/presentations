---
layout: default
---

# Two kinds of guardrails

<div class="mt-8 flex gap-6 max-w-5xl">

<div class="flex-1 rounded-2xl border-2 p-8" style="border-color:#2F69FF33; background:#2F69FF0d">
  <p class="text-xs font-bold uppercase tracking-widest" style="color:#2F69FF">Soft</p>
  <h3 class="mt-3 text-2xl font-bold text-[#333333]">Guides behavior</h3>
  <p class="mt-3 text-base text-[#6B7280] leading-relaxed">The rule exists, but nothing mechanically prevents you from ignoring it.</p>
  <div class="mt-6 flex flex-wrap gap-2">
    <span class="rounded-full px-3 py-1 text-xs font-semibold" style="background:#2F69FF1a; color:#2F69FF">Warnings</span>
    <span class="rounded-full px-3 py-1 text-xs font-semibold" style="background:#2F69FF1a; color:#2F69FF">Docs</span>
    <span class="rounded-full px-3 py-1 text-xs font-semibold" style="background:#2F69FF1a; color:#2F69FF">ADRs</span>
    <span class="rounded-full px-3 py-1 text-xs font-semibold" style="background:#2F69FF1a; color:#2F69FF">Agent instructions</span>
    <span class="rounded-full px-3 py-1 text-xs font-semibold" style="background:#2F69FF1a; color:#2F69FF">Checklists</span>
  </div>
</div>

<div class="flex-1 rounded-2xl border-2 p-8" style="border-color:#F3385933; background:#F338590d">
  <p class="text-xs font-bold uppercase tracking-widest" style="color:#F33859">Hard</p>
  <h3 class="mt-3 text-2xl font-bold text-[#333333]">Blocks violations</h3>
  <p class="mt-3 text-base text-[#6B7280] leading-relaxed">The tool refuses to continue when the rule is broken.</p>
  <div class="mt-6 flex flex-wrap gap-2">
    <span class="rounded-full px-3 py-1 text-xs font-semibold" style="background:#F338591a; color:#F33859">Compiler</span>
    <span class="rounded-full px-3 py-1 text-xs font-semibold" style="background:#F338591a; color:#F33859">Analyzers</span>
    <span class="rounded-full px-3 py-1 text-xs font-semibold" style="background:#F338591a; color:#F33859">Hooks</span>
    <span class="rounded-full px-3 py-1 text-xs font-semibold" style="background:#F338591a; color:#F33859">CI checks</span>
    <span class="rounded-full px-3 py-1 text-xs font-semibold" style="background:#F338591a; color:#F33859">Harness policies</span>
  </div>
</div>

</div>
