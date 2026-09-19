---
layout: default
section: Hard guardrails
---

# 4 · Agent harness: the agent is refused

<div class="mt-6 flex flex-col gap-2 max-w-3xl">

<div v-click class="flex items-start gap-4 rounded-xl border border-gray-200 bg-white px-5 py-3 shadow-sm">
  <span class="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#F33859]"></span>
  <div>
    <div class="text-base font-bold text-[#333333]">verify-freshness</div>
    <div class="text-sm text-[#6B7280]">A verify-like-CI verdict is bound to a fingerprint of the tree it verified — <code>git push</code> of any other tree is denied.</div>
  </div>
</div>

<div v-click class="flex items-start gap-4 rounded-xl border border-gray-200 bg-white px-5 py-3 shadow-sm">
  <span class="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#FBC740]"></span>
  <div>
    <div class="text-base font-bold text-[#333333]">no-piped-verdicts</div>
    <div class="text-sm text-[#6B7280]">Piping a test runner into another command is denied — the pipe substitutes the last command's exit code for the runner's verdict.</div>
  </div>
</div>

<div v-click class="flex items-start gap-4 rounded-xl border border-gray-200 bg-white px-5 py-3 shadow-sm">
  <span class="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#F33859]"></span>
  <div>
    <div class="text-base font-bold text-[#333333]">WIP cap</div>
    <div class="text-sm text-[#6B7280]">A hard JQL guard: max 4 tickets in progress. Pickup is refused — and the tickets blocking it are named.</div>
  </div>
</div>

<div v-click class="flex items-start gap-4 rounded-xl border border-gray-200 bg-white px-5 py-3 shadow-sm">
  <span class="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#FBC740]"></span>
  <div>
    <div class="text-base font-bold text-[#333333]">sync refusal</div>
    <div class="text-sm text-[#6B7280]">Draft or non-green PRs are refused. Greenness is checked <i>before</i> the <code>[skip ci]</code> close-out commit — its empty check rollup is never trusted as evidence.</div>
  </div>
</div>

</div>
