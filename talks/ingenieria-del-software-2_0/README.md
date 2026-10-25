# Ingeniería del Software 2.0

Diseñar, construir y validar productos con IA. Sesión de 60 minutos para desarrolladores, en español; pensada para repetirse en varios eventos.

Primera edición: Albacete Power BI & Fabric User Group, 14 de octubre de 2026, 19:15, Cervecería La Nena (Albacete). Para otra edición, edita la portada en `deck/experience.tsx`.

## Idea de la charla

Un repaso del ciclo de vida del software con mecanismos para domar a la IA en cada fase: código, guardarraíles blandos y duros, SDD, dos fuentes de verdad (PDaC/ProductShape y arc42), desarrollo agéntico, validación y una vista global. Se conserva el ejemplo de Power BI y Fabric de esta edición.

## Mapa de fuentes

| Qué | Dónde |
| --- | --- |
| Abstract, Sessionize y anuncios | [`content/abstract.md`](content/abstract.md) |
| Narrativa y tiempos | [`content/narrative.md`](content/narrative.md) |
| Fuentes externas | [`research/sources.md`](research/sources.md) |
| Las 24 escenas editables | [`deck/experience.tsx`](deck/experience.tsx) |
| Estilos y diagramas DOM originales | [`deck/scenes.css`](deck/scenes.css) |
| Notas del ponente, incluida portada, extraídas literalmente | [`content/speaker-notes.md`](content/speaker-notes.md) |
| Cobertura de cada fuente original y decisiones de recursos | [`content/coverage.md`](content/coverage.md) |
| Charla relacionada | [`../soft-and-hard-guardrails/`](../soft-and-hard-guardrails/) |

Las notas no se importan, no se copian y no se publican en los bundles. La sintaxis del renderer anterior se conserva en el historial, no como una segunda fuente narrativa activa. Los recursos originales de `deck/public/` se conservan archivados, fuera del build: el sitio no necesita imágenes del tema ni derechos inferidos de fuentes externas.

## Construir y presentar

Desde la raíz, sigue el [contrato de instalación bloqueada, build completo, tests y vista previa](../../README.md#public-catalogue). Abre `/software-engineering-2_0/` o la entrada compatible `/decks/software-engineering-2_0/`. Ejemplo de enlace directo: `#scene=11-modelo`.

Anterior/Siguiente, ArrowRight/PageDown y ArrowLeft/PageUp recorren las escenas sin volver al principio; los controles interactivos conservan sus teclas. Las escenas largas permiten scroll, los ejemplos tienen regiones de scroll etiquetadas y solo la escena actual participa en el orden de lectura. Se admiten apariencias sistema/clara/oscura y movimiento reducido. El catálogo, mapa y fuentes siguen disponibles.

Los diagramas de PDaC y agentic-sdlc se representan como DOM semántico original, con citas y pasos legibles. La demo GIF pasa a pasos estáticos y mantiene el ejemplo BR-REFUND-001, cambio de regla y citas stale. La foto usa un fallback intencional de iniciales y nombre. La escena final de vídeo conserva «Planos de la Estrella de la Muerte», su enlace y contexto: el reproductor externo requiere conexión; el build no descarga medios externos.

No hay instalación local del deck, Slidev ni tema privado. PDF/PowerPoint y los antiguos comandos `pnpm export` no tienen paridad garantizada. `dist/`, capturas y reportes son artefactos generados. La aceptación visual/de contenido por el propietario sigue pendiente, incluidos los diagramas equivalentes.

## Ideas aparcadas

Existe una versión larga tipo master class (unas 60 diapositivas) como artefacto en claude.ai. Se decidió no portarla.
