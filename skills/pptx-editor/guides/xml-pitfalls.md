# Common XML pitfalls

Low-level slide-XML gotchas when hand-editing unpacked slides. These apply to template-based
editing; the blueprint pipeline (Workflow C) avoids most of them by filling deterministic slots.

## When template has more items than your content

Remove excess elements entirely (images, shapes, text boxes), do not just clear text.
Check for orphaned visuals after clearing text content.

## Multi-item content

Create separate `<a:p>` elements for each item — never concatenate into one string.

```xml
<!-- ✅ Correct: separate paragraphs -->
<a:p>
  <a:pPr algn="l"><a:lnSpc><a:spcPts val="3600"/></a:lnSpc></a:pPr>
  <a:r><a:rPr b="1" sz="1800"/><a:t>Point 1</a:t></a:r>
</a:p>
<a:p>
  <a:pPr algn="l"><a:lnSpc><a:spcPts val="3600"/></a:lnSpc></a:pPr>
  <a:r><a:rPr sz="1800"/><a:t>Supporting detail for point 1.</a:t></a:r>
</a:p>
```

## Element ordering in `<p:txBody>`

Required order: `<a:bodyPr>` → `<a:lstStyle>` → `<a:p>` (one or more).

## Split runs — placeholder fragmentation

When a placeholder like `[Technology N]` is typed or pasted in PowerPoint, it may be
split across multiple `<a:r>` runs inside the same `<a:p>` paragraph:

```xml
<!-- ❌ Fragmented — a direct string replace will silently fail -->
<a:r><a:t>[Technolog</a:t></a:r>
<a:r><a:t>y 1]</a:t></a:r>
```

**Detect** fragmentation by reading the raw slide XML before editing. If the placeholder
text is split across runs, **merge the runs first** (keep the `<a:rPr>` of the first run,
concatenate the `<a:t>` content, delete the rest), then do the replacement:

```xml
<!-- ✅ After merging -->
<a:r><a:rPr .../><a:t>[Technology 1]</a:t></a:r>
```

Alternatively, use `python-pptx` for that slide — it operates on the logical paragraph
model and is immune to run fragmentation.
