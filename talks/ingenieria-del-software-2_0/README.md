# Ingeniería del Software 2.0

Diseñar, construir y validar productos con IA. Sesión de 60 minutos para desarrolladores, en español; pensada para repetirse en varios eventos.

## Estado

Primera versión del deck en Slidev, portada desde un borrador de 20 diapositivas hecho con Claude. Pendiente de ensayo y de una revisión del render con `presentation-qa`.

## Idea de la charla

Un recorrido de dentro a fuera por el ciclo de vida del software con agentes, con un único ejemplo: la regla de devoluciones de una tienda online (`BR-REFUND-001`, el ejemplo de [pdac.dev](https://pdac.dev/)). Cada bloque abre un anillo más: código y repositorio → especificación (SDD) → producto (PDaC) → validación → evidencia → operación. Los guardarraíles aparecen donde hacen falta. El cierre cambia la regla de 30 a 14 días y recorre el bucle plan → test → implement → review → verify → remember → improve.

## Mapa de fuentes

| Qué | Dónde |
| --- | --- |
| Abstract enviado a la convocatoria | [`content/abstract.md`](content/abstract.md) |
| Narrativa, anillos y tiempos | [`content/narrative.md`](content/narrative.md) |
| Fuentes externas y qué se usa de cada una | [`research/sources.md`](research/sources.md) |
| Deck (fuente editable) | [`deck/slides.md`](deck/slides.md) y [`deck/pages/`](deck/pages/) |
| Notas del ponente | Comentario HTML al final de cada página de `deck/pages/` |
| Charla relacionada | [`../soft-and-hard-guardrails/`](../soft-and-hard-guardrails/) |

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
- Etiqueta de sección con `<div class="plain-section-label">` indicando el anillo.
- En pantalla, unas 25 palabras como máximo; el resto va a las notas.

## Ideas aparcadas

Existe una versión larga tipo master class (unas 60 diapositivas) como artefacto en claude.ai. Se decidió no portarla.
