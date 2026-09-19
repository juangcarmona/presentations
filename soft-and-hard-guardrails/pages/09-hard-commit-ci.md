---
layout: default
section: Hard guardrails
---

# 2 · Commit & 3 · CI: the change won't exist, won't land

<div class="mt-6 overflow-hidden rounded-2xl border border-gray-200 shadow-lg max-w-5xl">
<table class="w-full border-collapse text-left">
<thead>
<tr style="background:#F33859">
<th class="px-6 py-3 text-xs font-bold uppercase tracking-widest text-white">Where</th>
<th class="px-6 py-3 text-xs font-bold uppercase tracking-widest text-white">Rule</th>
<th class="px-6 py-3 text-xs font-bold uppercase tracking-widest text-white">Effect</th>
</tr>
</thead>
<tbody>
<tr class="border-b border-gray-100">
<td class="px-6 py-3 text-sm text-[#333333]">Husky <code>pre-commit</code></td>
<td class="px-6 py-3 text-sm text-[#333333]">CSharpier + lint-staged on staged files</td>
<td class="px-6 py-3 text-sm text-[#333333]">A non-zero exit blocks the commit</td>
</tr>
<tr class="border-b border-gray-100">
<td class="px-6 py-3 text-sm text-[#333333]"><code>commit-msg</code></td>
<td class="px-6 py-3 text-sm text-[#333333]">commitlint validates every message</td>
<td class="px-6 py-3 text-sm text-[#333333]">A malformed commit never exists</td>
</tr>
<tr class="border-b border-gray-100">
<td class="px-6 py-3 text-sm text-[#333333]"><code>check-adoption.mjs</code></td>
<td class="px-6 py-3 text-sm text-[#333333]">Raw native control instead of the contracted DS component</td>
<td class="px-6 py-3 text-sm text-[#333333]">The frontend build fails; exceptions declared inline</td>
</tr>
<tr class="border-b border-gray-100">
<td class="px-6 py-3 text-sm text-[#333333]"><code>validate-design-system.sh --check</code></td>
<td class="px-6 py-3 text-sm text-[#333333]">Token drift, literal values in skill files</td>
<td class="px-6 py-3 text-sm text-[#333333]">CI fails even when the leak is only in a markdown file</td>
</tr>
<tr class="border-b border-gray-100">
<td class="px-6 py-3 text-sm text-[#333333]"><code>archive-spec.yml</code></td>
<td class="px-6 py-3 text-sm text-[#333333]">Multiple active changes found on merge</td>
<td class="px-6 py-3 text-sm text-[#333333]">Exits 1 rather than guessing which to archive</td>
</tr>
<tr>
<td class="px-6 py-3 text-sm text-[#333333]">Branch protection</td>
<td class="px-6 py-3 text-sm text-[#333333]">Required status checks</td>
<td class="px-6 py-3 text-sm text-[#333333]">The PR literally cannot merge until they're green</td>
</tr>
</tbody>
</table>
</div>
