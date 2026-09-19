# PptxGenJS Reference

API guide for creating presentations programmatically with
[PptxGenJS](https://gitbrent.github.io/PptxGenJS/).

Install: `npm install -g pptxgenjs`

---

## Setup

```javascript
const pptxgen = require("pptxgenjs");

const prs = new pptxgen();
prs.layout = "LAYOUT_16x9";   // LAYOUT_16x9 | LAYOUT_16x10 | LAYOUT_4x3 | LAYOUT_WIDE
prs.title  = "My Presentation";
prs.author = "Plain Concepts";

const slide = prs.addSlide();
await prs.writeFile({ fileName: "output.pptx" });
```

### Slide dimensions (inches)

| Layout | Width | Height |
|--------|-------|--------|
| `LAYOUT_16x9` (default) | 10 | 5.625 |
| `LAYOUT_16x10` | 10 | 6.25 |
| `LAYOUT_4x3` | 10 | 7.5 |
| `LAYOUT_WIDE` | 13.3 | 7.5 |

---

## Colors

**Never use `#` in hex colors** — it corrupts the output file.

```javascript
color: "FF0000"       // ✅
color: "#FF0000"      // ❌ corrupts file
```

**Never encode opacity in an 8-character hex string** — use the `opacity` property:

```javascript
shadow: { color: "00000020", ... }                   // ❌ corrupts file
shadow: { color: "000000", opacity: 0.12, ... }      // ✅
```

---

## Text

```javascript
// Simple text box
slide.addText("Hello", {
  x: 1, y: 1, w: 8, h: 1,
  fontSize: 24, fontFace: "Calibri",
  color: "1E2D40", bold: true,
  align: "center", valign: "middle",
});

// Multi-line via array
slide.addText([
  { text: "Line 1", options: { breakLine: true } },
  { text: "Line 2", options: { breakLine: true } },
  { text: "Line 3" },
], { x: 1, y: 1, w: 8, h: 2, fontSize: 16 });

// Rich inline formatting
slide.addText([
  { text: "Bold ",   options: { bold: true } },
  { text: "Italic ", options: { italic: true } },
  { text: "Normal" },
], { x: 1, y: 3, w: 8, h: 1 });

// Letter spacing
slide.addText("SPACED", { x: 1, y: 1, w: 4, h: 0.6, charSpacing: 6 });

// Remove internal padding (for precise alignment with shapes)
slide.addText("Title", { x: 0.4, y: 0.3, w: 9, h: 0.7, margin: 0 });
```

---

## Bullets

```javascript
// ✅ Correct — use bullet: true
slide.addText([
  { text: "First item",  options: { bullet: true, breakLine: true } },
  { text: "Second item", options: { bullet: true, breakLine: true } },
  { text: "Third item",  options: { bullet: true } },
], { x: 0.5, y: 1, w: 9, h: 3 });

// ❌ Wrong — unicode symbols create double bullets
slide.addText("• First item", { ... });

// Sub-items
{ text: "Detail", options: { bullet: true, indentLevel: 1, breakLine: true } }

// Numbered list
{ text: "Step one", options: { bullet: { type: "number" }, breakLine: true } }
```

---

## Shapes

```javascript
// Rectangle
slide.addShape(prs.shapes.RECTANGLE, {
  x: 0.5, y: 0.5, w: 2, h: 3,
  fill: { color: "1E2D40" },
  line: { color: "000000", width: 1 },
});

// Ellipse / circle
slide.addShape(prs.shapes.OVAL, {
  x: 3, y: 1, w: 1.5, h: 1.5,
  fill: { color: "4A9ECA" },
});

// Horizontal rule (line)
slide.addShape(prs.shapes.LINE, {
  x: 0.4, y: 5.2, w: 9.2, h: 0,
  line: { color: "DDDDDD", width: 1 },
});

// Rounded rectangle — do NOT pair with rectangular accent overlays
slide.addShape(prs.shapes.ROUNDED_RECTANGLE, {
  x: 1, y: 1, w: 3, h: 1.5,
  fill: { color: "FFFFFF" },
  rectRadius: 0.1,
});

// Transparency
slide.addShape(prs.shapes.RECTANGLE, {
  x: 1, y: 1, w: 3, h: 2,
  fill: { color: "4A9ECA", transparency: 40 },
});

// Shadow — always use a factory function to avoid object mutation
const mkShadow = () => ({
  type: "outer", color: "000000", opacity: 0.15,
  blur: 6, offset: 3, angle: 135,
});
slide.addShape(prs.shapes.RECTANGLE, { x: 1, y: 1, w: 3, h: 2,
  fill: { color: "FFFFFF" }, shadow: mkShadow() });
slide.addShape(prs.shapes.RECTANGLE, { x: 5, y: 1, w: 3, h: 2,
  fill: { color: "FFFFFF" }, shadow: mkShadow() });
```

### Shadow properties

| Property | Values | Notes |
|----------|--------|-------|
| `type` | `"outer"` \| `"inner"` | |
| `color` | 6-char hex, no `#` | |
| `opacity` | 0.0 – 1.0 | Never encode in color |
| `blur` | 0 – 100 pt | |
| `offset` | ≥ 0 pt | Negative values corrupt the file |
| `angle` | 0 – 359° | 135 = bottom-right; 270 = upward |

---

## Images

```javascript
// From file path
slide.addImage({ path: "assets/photo.jpg", x: 5, y: 0.5, w: 4.5, h: 4.5 });

// From URL
slide.addImage({ path: "https://example.com/img.png", x: 1, y: 1, w: 4, h: 3 });

// From base64 (fastest — no file I/O)
slide.addImage({ data: "image/png;base64,iVBOR…", x: 1, y: 1, w: 4, h: 3 });

// Preserve aspect ratio
const origW = 1920, origH = 1080, targetH = 3.5;
const calcW  = targetH * (origW / origH);
slide.addImage({ path: "wide.jpg", x: (10 - calcW) / 2, y: 1, w: calcW, h: targetH });

// Circular crop
slide.addImage({ path: "portrait.jpg", x: 1, y: 1, w: 2, h: 2, rounding: true });
```

---

## Icons (react-icons + sharp)

```javascript
const React          = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp          = require("sharp");
const { FaCheckCircle } = require("react-icons/fa");

async function iconBase64(IconComp, hexColor, sizePx = 256) {
  const svg = ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComp, { color: `#${hexColor}`, size: String(sizePx) })
  );
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

// Usage
const icon = await iconBase64(FaCheckCircle, "4A9ECA", 256);
slide.addImage({ data: icon, x: 0.5, y: 1, w: 0.5, h: 0.5 });
```

Install: `npm install -g react-icons react react-dom sharp`

---

## Brand Card Component (Plain Concepts)

A card = blue-filled header box + off-white bordered body box. No rounded corners, no shadows.

```javascript
// ponytail: factory keeps addCard DRY; no class needed for 3-4 cards
function addCard(slide, { x, y, w, headerText, bodyLines, headerColor = "2F69FF" }) {
  const HEADER_H = 0.55;
  const BODY_H   = 1.8;
  const BODY_PAD = 0.15;

  // Header box: filled, white bold text
  slide.addShape(slide.prs.shapes.RECTANGLE, {
    x, y, w, h: HEADER_H,
    fill: { color: headerColor },
    line: { color: headerColor },
  });
  slide.addText(headerText, {
    x, y, w, h: HEADER_H,
    fontSize: 13, bold: true, color: "FFFFFF",
    align: "center", valign: "middle", margin: 0,
    fontFace: "Open Sans",
  });

  // Body box: off-white fill, thin border
  slide.addShape(slide.prs.shapes.RECTANGLE, {
    x, y: y + HEADER_H, w, h: BODY_H,
    fill: { color: "F2F3F7" },
    line: { color: "D0D5DD", width: 0.75 },
  });
  slide.addText(
    bodyLines.map((t, i) => ({ text: t, options: { bullet: true, breakLine: i < bodyLines.length - 1 } })),
    {
      x: x + BODY_PAD, y: y + HEADER_H + BODY_PAD,
      w: w - BODY_PAD * 2, h: BODY_H - BODY_PAD * 2,
      fontSize: 12, color: "0D0E0F", valign: "top",
      fontFace: "Open Sans",
    }
  );
}

// 3-column cards usage (9" content area, 0.3" gutters)
const CARD_W = 2.8, GAP = 0.3, LEFT = 0.5, TOP = 1.6;
addCard(slide, { x: LEFT,              y: TOP, w: CARD_W, headerText: "Column A", bodyLines: ["Point 1", "Point 2"] });
addCard(slide, { x: LEFT + CARD_W + GAP, y: TOP, w: CARD_W, headerText: "Column B", bodyLines: ["Point 1", "Point 2"] });
addCard(slide, { x: LEFT + (CARD_W + GAP)*2, y: TOP, w: CARD_W, headerText: "Column C", bodyLines: ["Point 1", "Point 2"] });

// 2-column contrast (before/after) — use a dark or accent header for the "after" card
addCard(slide, { x: 0.5, y: TOP, w: 4.2, headerText: "TODAY — BEFORE", bodyLines: ["Pain 1", "Pain 2"], headerColor: "151618" });
addCard(slide, { x: 5.0, y: TOP, w: 4.2, headerText: "WITH THE SOLUTION", bodyLines: ["Benefit 1", "Benefit 2"], headerColor: "2F69FF" });
```

### Brand slide chrome (left bar + footer with logo)

When using Workflow B (PptxGenJS from scratch) you must add these elements manually to every non-cover slide:

```javascript
function addSlideChrome(slide, pageNum, logoBase64) {
  // Left blue accent bar
  slide.addShape(slide.prs.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.06, h: 5.625,
    fill: { color: "2F69FF" }, line: { color: "2F69FF" },
  });

  // Page number box (bottom-right)
  slide.addShape(slide.prs.shapes.RECTANGLE, {
    x: 9.4, y: 5.2, w: 0.4, h: 0.35,
    fill: { color: "151618" }, line: { color: "151618" },
  });
  slide.addText(String(pageNum), {
    x: 9.4, y: 5.2, w: 0.4, h: 0.35,
    fontSize: 10, bold: true, color: "FFFFFF",
    align: "center", valign: "middle", margin: 0,
  });

  // Corporate logo (load as base64 from the master template's ppt/media/)
  if (logoBase64) {
    slide.addImage({ data: logoBase64, x: 8.9, y: 5.18, w: 0.45, h: 0.38 });
  }
}
```

> **Prefer Workflow A (template clone) over Workflow B.** Only use PptxGenJS + these recipes when no template slide matches the required layout.

---

## Slide Background

```javascript
slide.background = { color: "1E2D40" };          // solid
slide.background = { path: "assets/bg.jpg" };    // image file
slide.background = { data: "image/png;base64,…" }; // base64
```

---

## Tables

```javascript
// Basic
slide.addTable([
  ["Header A", "Header B", "Header C"],
  ["Row 1",    "Value",    "Value"],
  ["Row 2",    "Value",    "Value"],
], { x: 0.5, y: 1, w: 9, h: 3, border: { pt: 1, color: "CCCCCC" } });

// Custom header row
const rows = [
  [
    { text: "Product",  options: { fill: { color: "1E2D40" }, color: "FFFFFF", bold: true } },
    { text: "Revenue",  options: { fill: { color: "1E2D40" }, color: "FFFFFF", bold: true } },
    { text: "Growth",   options: { fill: { color: "1E2D40" }, color: "FFFFFF", bold: true } },
  ],
  ["Product A", "€4.2M", "+18 %"],
  ["Product B", "€2.8M", "+9 %"],
];
slide.addTable(rows, {
  x: 0.5, y: 1.5, w: 9, h: 2.5,
  colW: [4, 2.5, 2.5], rowH: [0.55, 0.65, 0.65],
  border: { pt: 1, color: "E0E0E0" },
  fontSize: 14, align: "center", valign: "middle",
});
```

---

## Charts

```javascript
// Bar chart (vertical)
slide.addChart(prs.charts.BAR, [{
  name: "Revenue", labels: ["Q1", "Q2", "Q3", "Q4"], values: [4200, 5100, 6300, 7000],
}], {
  x: 0.5, y: 0.8, w: 9, h: 4,
  barDir: "col",
  chartColors: ["4A9ECA"],
  showTitle: true, title: "Quarterly Revenue",
  showLegend: false,
  showCatAxisTitle: true, catAxisTitle: "Quarter",
  showValAxisTitle: true, valAxisTitle: "Revenue (€k)",
  valAxisMinVal: 0, valAxisMaxVal: 8000, valAxisMajorUnit: 2000,
  catAxisLabelRotate: 0,
  chartArea: { fill: { color: "FFFFFF" }, roundedCorners: false },
  catGridLine: { style: "none" },
  valGridLine: { color: "E8E8E8", size: 0.5 },
  dataLabelColor: "1E2D40", dataLabelPosition: "outEnd",
});

// Line chart
slide.addChart(prs.charts.LINE, [{
  name: "Users", labels: ["Jan", "Feb", "Mar", "Apr"], values: [1200, 1800, 2400, 3100],
}], {
  x: 0.5, y: 0.8, w: 9, h: 4,
  lineSize: 3, lineSmooth: true,
  chartColors: ["4A9ECA"],
  showCatAxisTitle: true, catAxisTitle: "Month",
  showValAxisTitle: true, valAxisTitle: "Active users",
});

// Pie chart (single series, all categories together)
slide.addChart(prs.charts.PIE, [{
  name: "Share",
  labels: ["Segment A", "Segment B", "Segment C"],
  values: [42, 35, 23],
}], {
  x: 2, y: 0.8, w: 6, h: 4.2,
  chartColors: ["1E2D40", "4A9ECA", "8CC63F"],
  showPercent: true, showLegend: true, legendPos: "b",
});

// Multi-series
slide.addChart(prs.charts.LINE, [
  { name: "Plan",   labels: ["Q1","Q2","Q3","Q4"], values: [100, 110, 120, 130] },
  { name: "Actual", labels: ["Q1","Q2","Q3","Q4"], values: [95,  115, 118, 140] },
], {
  x: 0.5, y: 0.8, w: 9, h: 4,
  chartColors: ["BBBBBB", "4A9ECA"],
  showLegend: true, legendPos: "b",
  showCatAxisTitle: true, catAxisTitle: "Quarter",
  showValAxisTitle: true, valAxisTitle: "Index",
});
```

---

## Slide Masters

```javascript
prs.defineSlideMaster({
  title: "DARK_TITLE",
  background: { color: "1E2D40" },
  objects: [{
    placeholder: {
      options: { name: "heading", type: "title", x: 1, y: 2, w: 8, h: 1.5 },
    },
  }],
});

const slide = prs.addSlide({ masterName: "DARK_TITLE" });
slide.addText("Section Title", { placeholder: "heading", fontSize: 40, color: "FFFFFF" });
```

---

## Common Pitfalls

| Problem | Cause | Fix |
|---------|-------|-----|
| File won't open | `#` in color string | Remove `#` from all colors |
| Shadow looks wrong | 8-char opacity-encoded color | Use `opacity` property separately |
| Double bullets | Unicode `•` in text string | Use `bullet: true` option |
| Text items merged on one line | Missing `breakLine: true` | Add `breakLine: true` to each array item except last |
| Huge gaps between bullets | `lineSpacing` combined with `bullet` | Use `paraSpaceAfter` instead |
| Second shape shadow wrong | Shared options object mutated by PptxGenJS | Use factory function `() => ({ ... })` |
| Rounded corner accent bar misaligned | `ROUNDED_RECTANGLE` + rect overlay | Use `RECTANGLE` for both |
