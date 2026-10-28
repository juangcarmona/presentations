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
| Escenario, controles y estilos del keynote | [`deck/Presentation.tsx`](deck/Presentation.tsx), [`deck/keynote.css`](deck/keynote.css) |
| Visuales originales y alternativas semánticas | [`deck/Visuals.tsx`](deck/Visuals.tsx), [`deck/public/`](deck/public/) |
| Notas del ponente, incluida portada, extraídas literalmente | [`content/speaker-notes.md`](content/speaker-notes.md) |
| Cobertura de cada fuente original y decisiones de recursos | [`content/coverage.md`](content/coverage.md) |
| Charla relacionada | [`../soft-and-hard-guardrails/`](../soft-and-hard-guardrails/) |

Las notas no se importan, no se copian y no se publican en los bundles. La sintaxis del renderer anterior se conserva en el historial, no como una segunda fuente narrativa activa. Los diez recursos originales de `deck/public/` se publican sin modificar: el propietario confirmó su reutilización pública en la issue #53 (comentario 6472863966).

## Construir y presentar

Desde la raíz, sigue el [contrato de instalación bloqueada, build completo, tests y vista previa](../../README.md#public-catalogue). Abre `/software-engineering-2_0/` o la entrada compatible `/decks/software-engineering-2_0/`. Ejemplo de enlace directo: `#scene=11-modelo`.

Anterior/Siguiente, ArrowRight/PageDown y ArrowLeft/PageUp recorren las escenas sin volver al principio; los controles interactivos conservan sus teclas. Las escenas largas permiten scroll, los ejemplos tienen regiones de scroll etiquetadas y solo la escena actual participa en el orden de lectura. Este keynote tiene identidad oscura propia y respeta movimiento reducido. «Pantalla completa» entra en el modo del navegador; «Salir de pantalla completa» o Esc sale. Si el navegador lo rechaza, se puede seguir presentando. El mapa, las fuentes y el enlace de vuelta al catálogo siguen disponibles sin cabecera ni pie del catálogo.

Los diagramas originales de PDaC y agentic-sdlc permiten abrir la imagen a tamaño completo; «Descripción y conceptos del diagrama» conserva la explicación semántica. La demo GIF se inicia solo con «Reproducir demo animada» y se puede detener; sus pasos estáticos mantienen BR-REFUND-001, el cambio de regla y las citas stale. La portada, las marcas y el retrato original están restaurados. La escena final de vídeo conserva «Planos de la Estrella de la Muerte», su enlace y contexto: el reproductor externo requiere conexión; el build no descarga medios externos.

`deck/index.html`, `main.tsx` y `vite.config.ts` constituyen una entrada independiente. El build raíz la genera en `dist/software-engineering-2_0/` con sus propios assets, y crea la entrada compatible sin iframe. El catálogo solo enlaza metadatos. No importa estilos del catálogo ni impone su renderer a otras charlas.

No hay instalación local del deck, Slidev ni tema privado. PDF/PowerPoint y los antiguos comandos `pnpm export` no tienen paridad garantizada. `dist/`, capturas y reportes son artefactos generados. La issue #53 sustituye las restricciones visuales incompatibles de #39. La aceptación de la entrega anterior en #38 no acepta este rediseño: se requiere revisión visual y de contenido del propietario sobre las capturas de escritorio y la vista previa.

## Ideas aparcadas
