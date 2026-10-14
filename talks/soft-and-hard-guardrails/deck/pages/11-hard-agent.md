---
layout: default
section: Hard guardrails
---

# 4 · Agent harness: the agent is refused

<div class="mt-6 flex flex-col gap-2 max-w-3xl">

<div v-click class="flex items-start gap-4 rounded-xl border border-gray-200 bg-white px-5 py-3 shadow-sm">
  <span class="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#F33859]"></span>
  <div>
    <div class="text-base font-bold text-[#333333]">Freshness</div>
    <div class="text-sm text-[#6B7280]">A verification result only applies to the exact tree that was verified. <code class="ml-1 text-xs">verify-freshness</code></div>
  </div>
</div>

<div v-click class="flex items-start gap-4 rounded-xl border border-gray-200 bg-white px-5 py-3 shadow-sm">
  <span class="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#FBC740]"></span>
  <div>
    <div class="text-base font-bold text-[#333333]">Verdict integrity</div>
    <div class="text-sm text-[#6B7280]">The agent cannot transform a failing command into an apparently successful one. <code class="ml-1 text-xs">no-piped-verdicts</code></div>
  </div>
</div>

<div v-click class="flex items-start gap-4 rounded-xl border border-gray-200 bg-white px-5 py-3 shadow-sm">
  <span class="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#F33859]"></span>
  <div>
    <div class="text-base font-bold text-[#333333]">WIP limit</div>
    <div class="text-sm text-[#6B7280]">The agent cannot start more work when the agreed limit is reached. <code class="ml-1 text-xs">wip-cap</code></div>
  </div>
</div>

<div v-click class="flex items-start gap-4 rounded-xl border border-gray-200 bg-white px-5 py-3 shadow-sm">
  <span class="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#FBC740]"></span>
  <div>
    <div class="text-base font-bold text-[#333333]">Integration gate</div>
    <div class="text-sm text-[#6B7280]">The agent cannot integrate work that has not reached the required state. <code class="ml-1 text-xs">sync-refusal</code></div>
  </div>
</div>

</div>
