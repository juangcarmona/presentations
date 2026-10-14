---
layout: default
section: Hard guardrails
---

# Four enforcement surfaces

<div class="mt-8 flex items-stretch gap-2 max-w-5xl">

<div v-click class="flex-1 rounded-2xl border-2 p-5" style="border-color:#F3385933; background:#F338590d">
  <p class="text-xs font-bold uppercase tracking-widest" style="color:#F33859">1 · BUILD</p>
  <h3 class="mt-2 text-lg font-bold text-[#333333]">The build is rejected</h3>
  <p class="mt-2 text-xs text-[#6B7280] leading-relaxed">Roslyn analyzers, MSBuild reference guards, strict types, import-linter</p>
</div>

<span v-click class="self-center text-xl" style="color:#9aa0a6">→</span>

<div v-click class="flex-1 rounded-2xl border-2 p-5" style="border-color:#F3385933; background:#F338590d">
  <p class="text-xs font-bold uppercase tracking-widest" style="color:#F33859">2 · COMMIT</p>
  <h3 class="mt-2 text-lg font-bold text-[#333333]">The local change is rejected</h3>
  <p class="mt-2 text-xs text-[#6B7280] leading-relaxed">Husky pre-commit, commitlint, secret scanning</p>
</div>

<span v-click class="self-center text-xl" style="color:#9aa0a6">→</span>

<div v-click class="flex-1 rounded-2xl border-2 p-5" style="border-color:#F3385933; background:#F338590d">
  <p class="text-xs font-bold uppercase tracking-widest" style="color:#F33859">3 · CI / MERGE</p>
  <h3 class="mt-2 text-lg font-bold text-[#333333]">The change cannot land</h3>
  <p class="mt-2 text-xs text-[#6B7280] leading-relaxed">Required checks, adoption gates, drift validation, coverage floors</p>
</div>

<span v-click class="self-center text-xl" style="color:#9aa0a6">→</span>

<div v-click class="flex-1 rounded-2xl border-2 p-5" style="border-color:#F33859; background:#F338591a">
  <p class="text-xs font-bold uppercase tracking-widest" style="color:#F33859">4 · AGENT HARNESS</p>
  <h3 class="mt-2 text-lg font-bold text-[#333333]">The agent is refused</h3>
  <p class="mt-2 text-xs text-[#6B7280] leading-relaxed">Push gates, verdict checks, WIP caps, refusal logic in slash commands</p>
</div>

</div>

<div v-click class="mt-8 max-w-5xl rounded-xl border border-gray-200 bg-white px-6 py-4 shadow-sm">
  <p class="text-base text-[#333333]">Stages 1–3 guard the <span class="font-bold">code</span>. Stage 4 guards the <span class="font-bold">agent</span> — it verifies verdicts and process, not syntax. It's the category that only exists once agents write your code.</p>
</div>
