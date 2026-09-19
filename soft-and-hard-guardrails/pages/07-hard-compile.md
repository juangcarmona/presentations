---
layout: default
section: Hard guardrails
---

# 1 · Compile-time: the code won't build

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
<td class="px-6 py-3 text-sm text-[#333333]">Roslyn analyzers <code>ARCH001–003</code></td>
<td class="px-6 py-3 text-sm text-[#333333]">Module &amp; layer isolation</td>
<td class="px-6 py-3 text-sm text-[#333333]">The build fails the moment code crosses a boundary</td>
</tr>
<tr class="border-b border-gray-100">
<td class="px-6 py-3 text-sm text-[#333333]"><code>Directory.Build.props</code></td>
<td class="px-6 py-3 text-sm text-[#333333]">Analyzers auto-attached to every project</td>
<td class="px-6 py-3 text-sm text-[#333333]">A new module is covered with zero opt-in</td>
</tr>
<tr class="border-b border-gray-100">
<td class="px-6 py-3 text-sm text-[#333333]">MSBuild reference guard</td>
<td class="px-6 py-3 text-sm text-[#333333]"><code>ArchVerifyModuleReferences</code></td>
<td class="px-6 py-3 text-sm text-[#333333]">An illegal <code>.csproj</code> reference is rejected before any type from it is used</td>
</tr>
<tr class="border-b border-gray-100">
<td class="px-6 py-3 text-sm text-[#333333]"><code>.editorconfig</code></td>
<td class="px-6 py-3 text-sm text-[#333333]">Diagnostics pinned to <code>error</code></td>
<td class="px-6 py-3 text-sm text-[#333333]">Every suppression must carry an inline rationale</td>
</tr>
<tr class="border-b border-gray-100">
<td class="px-6 py-3 text-sm text-[#333333]"><code>tsconfig.json</code> / <code>mypy.ini</code></td>
<td class="px-6 py-3 text-sm text-[#333333]"><code>"strict": true</code></td>
<td class="px-6 py-3 text-sm text-[#333333]">A type error stops the build, not just the editor</td>
</tr>
<tr>
<td class="px-6 py-3 text-sm text-[#333333]"><code>import-linter</code> / NetArchTest</td>
<td class="px-6 py-3 text-sm text-[#333333]">Forbidden dependency rules</td>
<td class="px-6 py-3 text-sm text-[#333333]">Architecture violations fail the test run, not just the review</td>
</tr>
</tbody>
</table>
</div>
