---
layout: default
section: Hard guardrails
---

# 1 · Build-time: the build fails

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
<td class="px-6 py-3 text-sm text-[#333333]">Compiler / type checker</td>
<td class="px-6 py-3 text-sm text-[#333333]"><code>tsconfig.json</code> <code>"strict": true</code>, <code>mypy --strict</code>, C# compiler errors</td>
<td class="px-6 py-3 text-sm text-[#333333]">A type error stops the build, not just the editor</td>
</tr>
<tr class="border-b border-gray-100">
<td class="px-6 py-3 text-sm text-[#333333]">Roslyn analyzers as errors</td>
<td class="px-6 py-3 text-sm text-[#333333]">Module &amp; layer isolation rules pinned to <code>error</code></td>
<td class="px-6 py-3 text-sm text-[#333333]">The build fails the moment code crosses a boundary</td>
</tr>
<tr class="border-b border-gray-100">
<td class="px-6 py-3 text-sm text-[#333333]">MSBuild reference guard</td>
<td class="px-6 py-3 text-sm text-[#333333]"><code>ArchVerifyModuleReferences</code></td>
<td class="px-6 py-3 text-sm text-[#333333]">An illegal <code>.csproj</code> reference is rejected before any type from it is used</td>
</tr>
<tr>
<td class="px-6 py-3 text-sm text-[#333333]">Architecture tests</td>
<td class="px-6 py-3 text-sm text-[#333333]"><code>import-linter</code>, NetArchTest, dependency rules</td>
<td class="px-6 py-3 text-sm text-[#333333]">Architecture violations fail the build, not just the review</td>
</tr>
</tbody>
</table>
</div>
