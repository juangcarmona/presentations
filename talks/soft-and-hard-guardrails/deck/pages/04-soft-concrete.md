---
layout: default
section: Soft guardrails
---

# Soft guardrails in practice

<div class="mt-8 overflow-hidden rounded-2xl border border-gray-200 shadow-lg max-w-4xl">
<table class="w-full border-collapse text-left">
<thead>
<tr style="background:#2F69FF">
<th class="px-6 py-3 text-xs font-bold uppercase tracking-widest text-white">Where</th>
<th class="px-6 py-3 text-xs font-bold uppercase tracking-widest text-white">Rule</th>
</tr>
</thead>
<tbody>
<tr class="border-b border-gray-100">
<td class="px-6 py-4 text-sm text-[#333333]"><code>AGENTS.md</code> / <code>CLAUDE.md</code></td>
<td class="px-6 py-4 text-sm text-[#333333]">"Use the repository service; never access the DB directly"</td>
</tr>
<tr class="border-b border-gray-100">
<td class="px-6 py-4 text-sm text-[#333333]">ADR / architecture docs</td>
<td class="px-6 py-4 text-sm text-[#333333]">"Modules communicate through contracts"</td>
</tr>
<tr class="border-b border-gray-100">
<td class="px-6 py-4 text-sm text-[#333333]">Linter configuration</td>
<td class="px-6 py-4 text-sm text-[#333333]">Rule configured as <code>WARN</code></td>
</tr>
<tr class="border-b border-gray-100">
<td class="px-6 py-4 text-sm text-[#333333]">Product / engineering docs</td>
<td class="px-6 py-4 text-sm text-[#333333]">"Every endpoint requires authorization"</td>
</tr>
<tr>
<td class="px-6 py-4 text-sm text-[#333333]">PR checklist</td>
<td class="px-6 py-4 text-sm text-[#333333]">"Add tests for changed behavior"</td>
</tr>
</tbody>
</table>
</div>

<div class="mt-6 text-center">
  <p class="text-lg font-medium text-[#6B7280]">All of these rules may be perfectly documented.<br>None of them guarantees compliance.</p>
</div>
