---
layout: default
section: Soft guardrails
---

# Examples of soft guardrails

<div class="mt-6 flex flex-col gap-2 max-w-3xl">

<div v-click class="flex items-start gap-4 rounded-xl border border-gray-200 bg-white px-5 py-3 shadow-sm">
  <span class="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#2F69FF]"></span>
  <div>
    <div class="text-base font-bold text-[#333333]">Repository instructions</div>
    <div class="text-sm text-[#6B7280]"><code>CONTRIBUTING.md</code>, <code>AGENTS.md</code>, <code>CLAUDE.md</code>, <code>.github/copilot-instructions.md</code> — tell humans or agents how work should be done.</div>
  </div>
</div>

<div v-click class="flex items-start gap-4 rounded-xl border border-gray-200 bg-white px-5 py-3 shadow-sm">
  <span class="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#3ABAAF]"></span>
  <div>
    <div class="text-base font-bold text-[#333333]">Architecture &amp; product docs</div>
    <div class="text-sm text-[#6B7280]">ADRs, RFCs, architecture docs, product specs — record decisions and boundaries, but do not enforce them.</div>
  </div>
</div>

<div v-click class="flex items-start gap-4 rounded-xl border border-gray-200 bg-white px-5 py-3 shadow-sm">
  <span class="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#2F69FF]"></span>
  <div>
    <div class="text-base font-bold text-[#333333]">Warning-level rules</div>
    <div class="text-sm text-[#6B7280]">Surface violations without stopping execution.</div>
  </div>
</div>

<div v-click class="flex items-start gap-4 rounded-xl border border-gray-200 bg-white px-5 py-3 shadow-sm">
  <span class="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#3ABAAF]"></span>
  <div>
    <div class="text-base font-bold text-[#333333]">Prompts, skills &amp; agent conventions</div>
    <div class="text-sm text-[#6B7280]">Tell an agent what it should do, but depend on the agent following them.</div>
  </div>
</div>

<div v-click class="flex items-start gap-4 rounded-xl border border-gray-200 bg-white px-5 py-3 shadow-sm">
  <span class="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#2F69FF]"></span>
  <div>
    <div class="text-base font-bold text-[#333333]">Review checklists</div>
    <div class="text-sm text-[#6B7280]">Require a human to notice and act.</div>
  </div>
</div>

</div>
