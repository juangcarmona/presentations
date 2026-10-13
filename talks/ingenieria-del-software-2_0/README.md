# Ingeniería del Software 2.0

Diseñar, construir y validar productos con IA. Sesión de 60 minutos para desarrolladores, en español; pensada para repetirse en varios eventos.

## Estado

Primera edición: Albacete Power BI & Fabric User Group, 14 de octubre de 2026, 19:15, Cervecería La Nena (Albacete). Para otra edición, cambia `date` en la portada (`deck/slides.md`).

Pendiente: copiar `deck/public/lifecycle-overview.svg` (agent-toolkit) y los logos de pdac.dev en `deck/public/pdac/`, y poner el enlace del vídeo en `deck/pages/20-videos.md`.

## Idea de la charla

Un repaso del ciclo de vida del software con mecanismos para domar a la IA en cada fase: código (repos preparados, guardarraíles blandos y duros, estructura), tendencias (SDD), documentación como dos fuentes de verdad (producto con PDaC/ProductShape y técnica con arc42), desarrollo con un flujo agéntico y una capa determinista, validación (de structured behaviour a e2e, la pirámide que cambia) y una vista global.

## Mapa de fuentes

| Qué | Dónde |
| --- | --- |
| Abstract enviado a la convocatoria | [`content/abstract.md`](content/abstract.md) |
| Narrativa, anillos y tiempos | [`content/narrative.md`](content/narrative.md) |
| Fuentes externas y qué se usa de cada una | [`research/sources.md`](research/sources.md) |
| Deck (fuente editable) | [`deck/slides.md`](deck/slides.md) y [`deck/pages/`](deck/pages/) |
| Notas del ponente | Comentario HTML al final de cada página de `deck/pages/` |
| Charla relacionada | [`../soft-and-hard-guardrails/`](../soft-and-hard-guardrails/) |
| Abstract en inglés (Sessionize) y anuncios | [`content/abstract.md`](content/abstract.md) |

El `.pptx` exportado del borrador vive en `deck/_outputs/`, que el repositorio ignora: es un artefacto generado, no la fuente.

## Usar el deck

```bash
cd talks/ingenieria-del-software-2_0/deck
pnpm install --frozen-lockfile
pnpm dev      # vista previa
pnpm build    # comprobación determinista
pnpm export   # PDF
```

`pnpm-lock.yaml` está versionado y parte del de `soft-and-hard-guardrails`: con `@slidev/cli@latest`, una resolución limpia trae `markdown-it@15`, que rompe `@comark/markdown-it` (`ERR_PACKAGE_PATH_NOT_EXPORTED: ./lib/token.mjs`). No borres el lockfile; usa `pnpm install --frozen-lockfile`.

`public/bg-cover-1.jpg` es la imagen de portada del tema `chapter-plain` (la exige el layout `main-cover-1`).

## Convenciones de este deck

- Una diapositiva por fichero en `deck/pages/`, numerada en orden.
- Layouts del tema siempre que encajen (`main-cover-1`, `statement`, `console`, `comparison`, `list`, `end`); el resto, `default` con HTML y utilidades UnoCSS en la propia página.
- Etiqueta de sección con `<div class="plain-section-label">` indicando el bloque.
- En pantalla, unas 25 palabras como máximo; el resto va a las notas.

## Ideas aparcadas

Existe una versión larga tipo master class (unas 60 diapositivas) como artefacto en claude.ai. Se decidió no portarla.
