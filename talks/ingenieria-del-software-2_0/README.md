# Ingeniería del Software 2.0

Diseñar, construir y validar productos con IA. Sesión de 60 minutos para desarrolladores, disponible en español e inglés y pensada para repetirse en varios eventos.

La portada no lleva datos de un evento concreto: la misma página sirve para futuras ediciones.

## Idea de la charla

Un repaso del ciclo de vida del software con mecanismos para domar a la IA en cada fase: código, guardarraíles blandos y duros, SDD, dos fuentes de verdad (PDaC/ProductShape y arc42), desarrollo agéntico, validación y una vista global.

## Mapa de fuentes

| Qué | Dónde |
| --- | --- |
| Abstract, Sessionize y anuncios | [`content/abstract.md`](content/abstract.md) |
| Narrativa y tiempos | [`content/narrative.md`](content/narrative.md) |
| Fuentes externas | [`research/sources.md`](research/sources.md) |
| Las 24 escenas editables en ES y EN | [`deck/experience.tsx`](deck/experience.tsx), [`deck/experience-en.tsx`](deck/experience-en.tsx) |
| Presentador y estilo independiente | [`deck/Presentation.tsx`](deck/Presentation.tsx), [`deck/keynote.css`](deck/keynote.css) |
| Diagramas interactivos propios | [`deck/Diagrams.tsx`](deck/Diagrams.tsx) |
| Escenas de repositorio, SDD, consola y arc42 | [`deck/SceneExtras.tsx`](deck/SceneExtras.tsx) |
| Entrada y build propios | [`deck/index.html`](deck/index.html), [`deck/vite.config.ts`](deck/vite.config.ts) |
| Notas del ponente, incluida portada, extraídas literalmente | [`content/speaker-notes.md`](content/speaker-notes.md) |
| Cobertura de cada fuente original y decisiones de recursos | [`content/coverage.md`](content/coverage.md) |
| Charla relacionada | [`../soft-and-hard-guardrails/`](../soft-and-hard-guardrails/) |

Las notas no se importan, no se copian y no se publican en los bundles. La sintaxis del renderer anterior se conserva en el historial, no como una segunda fuente narrativa activa. Los diez recursos originales de `deck/public/` se publican sin modificar: el propietario autorizó su reutilización pública en la issue #53. La escena SDD añade logos de sus respectivos proyectos, obtenidos de sus sitios o repositorios oficiales: [OpenSpec](https://github.com/Fission-AI/OpenSpec), [Spec Kit](https://github.com/github/spec-kit) y [Kiro](https://github.com/kirodotdev). Se usan solo para identificar esas herramientas; no son recursos propios.

## Construir y presentar

Desde la raíz, sigue el [contrato de instalación bloqueada, build completo, tests y vista previa](../../README.md#public-catalogue). Abre `/software-engineering-2_0/` y cambia ES/EN en la portada; el idioma se conserva al navegar y recargar. La entrada compatible `/decks/software-engineering-2_0/` muestra la misma página. Ejemplo de enlace directo en inglés: `?lang=en#scene=11-modelo`.

La charla abre directamente, sin marco del catálogo, iframe ni controles de navegación persistentes. ArrowRight/PageDown avanzan y ArrowLeft/PageUp retroceden sin volver al principio; también se puede hacer clic en la mitad derecha o izquierda de la escena sin interferir con botones y enlaces. Los guardarraíles aparecen en tres pasos: definición, blandos y duros en paralelo; la pirámide de tests conserva sus dos pasos. En pantalla táctil se puede deslizar horizontalmente. El selector de idioma solo aparece en la portada. El número de escena está arriba a la derecha; el cronómetro, abajo a la derecha, aparece tras el primer minuto en formato HH:mm. No hay barra de carga. Las imágenes estáticas que aparecen en la charla se precargan al entrar; el GIF animado sigue siendo opcional y los diagramas originales se cargan al abrir sus enlaces. Las teclas de los elementos interactivos se conservan. Las escenas largas permiten scroll, los ejemplos tienen regiones de scroll etiquetadas y solo la escena actual participa en el orden de lectura. La URL mantiene idioma e identificador de escena para recargar o compartir. La pantalla completa nativa del navegador sigue disponible mediante F11.

Los diagramas principales son construcciones interactivas propias; sus nodos muestran explicaciones al pasar el ratón, enfocar o tocar. La escena 2 responde al movimiento del cursor; la 3 usa detalles breves sin repetir títulos; la 5 permite explorar un árbol de repositorio; la 6 destaca los pasos de SDD. La escena 11 sigue los tipos de artefacto descritos por [PDaC](https://pdac.dev/diagrams/). La 12 agrupa prácticas existentes en cuatro familias interactivas. La 16 dispone las doce secciones de arc42 en dos columnas, con un panel que hereda el color de cada sección. El GIF de la 13 se reproduce al entrar salvo con movimiento reducido, que exige activarlo; no ofrece una falsa pausa. La portada y el retrato usan los originales. El vídeo final conserva su enlace y contexto; el reproductor externo requiere conexión y el build no descarga medios externos.

No hay instalación local del deck, Slidev ni tema privado. El build raíz construye primero el catálogo y después este deck en `deck/dist/`; ensambla su salida en la URL canónica y la compatible del Worker estático. El catálogo solo importa los metadatos de `web.ts`, no este renderer. PDF/PowerPoint y los antiguos comandos `pnpm export` no tienen paridad garantizada. `dist/`, capturas y reportes son artefactos generados. Esta nueva entrega requiere aceptación visual y de contenido del propietario.

## Ideas aparcadas
