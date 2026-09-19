# Presentation Style Reference

Colors, typography, margins, and branding rules.
Used by the `pptx-editor` skill and the `reader` command.

> **This file is the secondary reference.** For layout choices and composition rules see [composition.md](composition.md).
> Only load this file when using PptxGenJS (Workflow B) or when style details are needed.

---

## 1. Background and Composition

### Background
- Primary background: **White (#FFFFFF)**.
- Alternative background for covers or dividers: **Dark Navy (#151618)**.
- Do not use backgrounds outside the official palette.

### Margins
- Minimum margin of **0.5 inches** on all sides.
- Reserve the left side for the blue decorative bar (**0.06 inches**).

### Content area
- Approximate content area: **9" x 4.6"**.
- Never place content below **Y = 5.1"**.

---

## 2. Logo and Branding

### Logo position
- Place the corporate logo in:
  - Covers → position defined by the layout.
  - Internal slides → bottom-right corner.
  - Footer → next to the page number.

### Logo rules
- Use only the official logo.
- Do not distort.
- Do not recolor.
- Do not add shadows or effects.
- Maintain clear space around the logo equal to the height of the letter "p".

### Tagline
Text:
> From Thought to Value

Format:
- Font: Outfit
- Style: Italic
- On the cover, place the white corporate lockup in the top-right corner.
- The tagline must appear below the logo, right-aligned, in white, with enough breathing room and without overlapping the main title block.

### Cover structure
- Full-bleed dark background with abstract/technological visual in blues and purples.
- **Lockup** (logo + "From Thought to Value" in Outfit Italic) — top-right corner, white.
- **Title** (`[Presentation Title]`) — lower-left, very large, white, high visual weight. Max 25 characters.
- **Client** (`[Client]`) — below title, white, smaller.
- **Date** (`[Date]`) — below client, least visual weight.
- Do not use boxes, cards, or bands on the cover.

---

## 3. Colors

### Primary
| Name | Hex | Use when |
|------|-----|----------|
| Dark Navy | `#151618` | Dark backgrounds, headers, page number box |
| Primary Blue | `#2F69FF` | CTAs, highlights, accents, section labels |
| Blue Mid | `#536DFE` | Secondary buttons, hover states |
| Blue Light | `#8C9EFF` | Tags, badges, soft highlights |

### Neutrals
| Name | Hex | Use when |
|------|-----|----------|
| White | `#FFFFFF` | Slide background |
| Off White | `#F2F3F7` | Card body background |
| Text Dark | `#0D0E0F` | Body text, titles |
| Text Medium | `#6B7280` | Captions, secondary text |

### Accents
| Hex | Use when |
|-----|----------|
| `#FBC740` | Warning, highlight |
| `#F33859` | Error, critical |
| `#9747FF` | Purple accent |
| `#3ABAAF` | Teal accent |

### Functional colors
| Hex | Use when |
|-----|----------|
| `#3D5AFE` | Footer logo background rectangle |
| `#D0D5DD` | Card body border |

> Do not introduce colors outside this palette.

**PptxGenJS note**: omit the `#` prefix when passing hex values — `"2F69FF"` not `"#2F69FF"` (the `#` corrupts the file).

---

## 4. Typography

### Font family
**Open Sans** for all text. **Exception**: the tagline "From Thought to Value" uses **Outfit Italic**. Do not substitute fonts.

### Hierarchy

| Level | Font | Size |
|-------|------|------|
| H1 | Open Sans Bold | 36 pt |
| H2 | Open Sans Bold | 28 pt |
| H3 | Open Sans Bold | 20 pt |
| Body | Open Sans Regular | 14 pt |
| Caption | Open Sans | 10 pt |

### Slide title styles

**Style 1 — simple section label**: single line in uppercase, Primary Blue (`#2F69FF`), wide tracking, small/medium size. Place in the top-left, acts as a subtle header.
*Visual reference: "SCOPE OF POV"*

**Style 2 — label + main title**: section label in uppercase, Primary Blue, wide tracking; below it a large main title in Text Dark (`#0D0E0F`), bold, left-aligned.
*Visual reference: "CAPABILITIES" + "Six key capabilities that define the solution"*

- Use **Style 2** when the slide has dense or narrative content.
- Use **Style 1** when the slide acts as a transition, thematic block, or light header.

---

## 5. Layout Dimensions

### Columns
| Layout | Column width | Gutter |
|--------|-------------|--------|
| 2 columns | 4.2" | 0.3" |
| 3 columns | 2.8" | 0.3" |

### Vertical spacing
```
Section label
  |
  v  0.35"
Title
  |
  v  0.2"
Subtitle
  |
  v  0.4"
Content
```

### Cards
- No rounded corners.
- No shadows.

### Page number / footer
The template's `slideMaster1.xml` disables native PowerPoint footers (`<p:hf sldNum="0" hdr="0" ftr="0" dt="0"/>`). Instead, each content slide has a **manual footer group** in the bottom-right corner with three elements:

1. **Logo background rectangle** — `#3D5AFE`, ~0.33" × 0.33", positioned behind the logo.
2. **Page number box** — `#151618` background, white text 12pt, centered, ~0.33" × 0.33".
3. **Plain Concepts logo image** — sits on top of the blue rectangle.

Approximate positions (in EMU / inches):
- Group origin: ~(8.04", 5.23")
- Page number: ~0.33" × 0.33" dark navy box
- Logo rect: ~0.66" × 0.25" blue rect with logo overlay

**33 of 42 template slides** have this footer group. Slides that lack it are the blank/generated slides (8, 9, 10, 11, 12, 20, 22, 24, 26). When cloning a template slide, the footer comes with it. When creating a new slide via PptxGenJS, you must add the footer manually (see `addSlideChrome` in Section 6).

---

## 6. PptxGenJS Brand Components

Only needed for Workflow B (PptxGenJS from scratch). Prefer Workflow A (template clone).

### Brand Card Component

```javascript
// ponytail: factory keeps addCard DRY; no class needed for 3-4 cards
function addCard(slide, { x, y, w, headerText, bodyLines, headerColor = "2F69FF" }) {
  const HEADER_H = 0.55;
  const BODY_H   = 1.8;
  const BODY_PAD = 0.15;

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
```

### Slide Chrome (left bar + footer)

```javascript
function addSlideChrome(slide, pageNum, logoBase64) {
  slide.addShape(slide.prs.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.06, h: 5.625,
    fill: { color: "2F69FF" }, line: { color: "2F69FF" },
  });

  slide.addShape(slide.prs.shapes.RECTANGLE, {
    x: 9.4, y: 5.2, w: 0.4, h: 0.35,
    fill: { color: "151618" }, line: { color: "151618" },
  });
  slide.addText(String(pageNum), {
    x: 9.4, y: 5.2, w: 0.4, h: 0.35,
    fontSize: 10, bold: true, color: "FFFFFF",
    align: "center", valign: "middle", margin: 0,
  });

  if (logoBase64) {
    slide.addImage({ data: logoBase64, x: 8.9, y: 5.18, w: 0.45, h: 0.38 });
  }
}
```

---

## 7. QA Checklist

### Content check
```bash
uv run --no-project --with "markitdown[pptx]" python -m markitdown output.pptx
uv run --no-project --with "markitdown[pptx]" python -m markitdown output.pptx | grep -iE "lorem|ipsum|xxxx|placeholder|tbd|todo"
```
Any match = fix before delivery.

### Visual check
```bash
soffice --headless --convert-to pdf output.pptx
pdftoppm -jpeg -r 150 output.pdf slide
```

Inspect each `slide-NN.jpg` for:
- Colors outside the approved palette
- Fonts other than Open Sans
- Text overflowing boxes or slide edges
- Overlapping elements
- Content placed below Y = 5.1"
- Missing logo or page number
- Leftover placeholder text

---

## 8. Common Mistakes

| Mistake | Fix |
|---------|-----|
| Colors outside the palette | Use only the 8 approved colors + 4 accents |
| Substituting Open Sans | Open Sans only; Outfit Italic for tagline/lockup only |
| Rounded corners on cards | No rounded corners, no shadows |
| Content below Y = 5.1" | Respect the content area boundary |
| Logo distorted or recolored | Use official logo asset as-is |
| `#` prefix in PptxGenJS colors | `"2F69FF"` not `"#2F69FF"` — corrupts file |
| Reusing a PptxGenJS shadow/fill object | PptxGenJS mutates objects — use a factory function |
