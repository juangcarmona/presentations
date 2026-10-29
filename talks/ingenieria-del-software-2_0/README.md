# Ingeniería del Software 2.0

Diseñar, construir y validar productos con IA. Sesión de 60 minutos para desarrolladores, disponible en español e inglés y pensada para repetirse en varios eventos.

Primera edición: Albacete Power BI & Fabric User Group, 14 de octubre de 2026, 19:15, Cervecería La Nena (Albacete). Para otra edición, edita la portada en `deck/experience.tsx` y `deck/experience-en.tsx`.

## Idea de la charla

Un repaso del ciclo de vida del software con mecanismos para domar a la IA en cada fase: código, guardarraíles blandos y duros, SDD, dos fuentes de verdad (PDaC/ProductShape y arc42), desarrollo agéntico, validación y una vista global. Se conserva el ejemplo de Power BI y Fabric de esta edición.

## Mapa de fuentes

| Qué | Dónde |
| --- | --- |
| Abstract, Sessionize y anuncios | [`content/abstract.md`](content/abstract.md) |
| Narrativa y tiempos | [`content/narrative.md`](content/narrative.md) |
| Fuentes externas | [`research/sources.md`](research/sources.md) |
| Las 24 escenas editables en ES y EN | [`deck/experience.tsx`](deck/experience.tsx), [`deck/experience-en.tsx`](deck/experience-en.tsx) |
| Presentador y estilo independiente | [`deck/Presentation.tsx`](deck/Presentation.tsx), [`deck/keynote.css`](deck/keynote.css) |
| Entrada y build propios | [`deck/index.html`](deck/index.html), [`deck/vite.config.ts`](deck/vite.config.ts) |
| Notas del ponente, incluida portada, extraídas literalmente | [`content/speaker-notes.md`](content/speaker-notes.md) |
| Cobertura de cada fuente original y decisiones de recursos | [`content/coverage.md`](content/coverage.md) |
| Charla relacionada | [`../soft-and-hard-guardrails/`](../soft-and-hard-guardrails/) |

Las notas no se importan, no se copian y no se publican en los bundles. La sintaxis del renderer anterior se conserva en el historial, no como una segunda fuente narrativa activa. Los diez recursos originales de `deck/public/` se publican sin modificar: el propietario autorizó su reutilización pública en la issue #53. No se infieren derechos sobre otros recursos.

## Construir y presentar

Desde la raíz, sigue el [contrato de instalación bloqueada, build completo, tests y vista previa](../../README.md#public-catalogue). Abre `/software-engineering-2_0/` en español o `/en/software-engineering-2_0/` en inglés. La entrada compatible `/decks/software-engineering-2_0/` sigue en español. Ejemplo de enlace directo: `#scene=11-modelo`.

La charla abre directamente, sin marco del catálogo, iframe ni controles de navegación visibles. ArrowRight/PageDown avanzan y ArrowLeft/PageUp retroceden sin volver al principio; en pantalla táctil se puede deslizar horizontalmente. Las teclas de los elementos interactivos se conservan. Las escenas largas permiten scroll, los ejemplos tienen regiones de scroll etiquetadas y solo la escena actual participa en el orden de lectura. La URL mantiene el identificador de escena para recargar o compartir. La pantalla completa nativa del navegador sigue disponible mediante F11.

Los diagramas originales de PDaC y agentic-sdlc son visuales principales con enlaces para ampliarlos y texto complementario accesible. La demo GIF conserva los pasos estáticos BR-REFUND-001, cambio de regla y citas stale; se anima al entrar salvo si está activada la preferencia de movimiento reducido, y puede detenerse. El movimiento reducido desactiva transiciones. La portada y el retrato usan los originales. La escena final de vídeo conserva «Planos de la Estrella de la Muerte», su enlace y contexto: el reproductor externo requiere conexión; el build no descarga medios externos.

No hay instalación local del deck, Slidev ni tema privado. El build raíz construye primero el catálogo y después este deck en `deck/dist/`; ensambla su salida en tres URL del Worker estático. El catálogo solo importa los metadatos de `web.ts`, no este renderer. PDF/PowerPoint y los antiguos comandos `pnpm export` no tienen paridad garantizada. `dist/`, capturas y reportes son artefactos generados. Esta nueva entrega requiere aceptación visual y de contenido del propietario.

## Ideas aparcadas
