# Narrativa

Un repaso del ciclo de vida del software con mecanismos para domar a la IA en cada fase. Los guardarraíles se presentan una vez, junto a la preparación del repo, y reaparecen donde actúan (citas en CI, tests).

## Bloques y tiempos (60 min)

| Bloque | Diapositivas | Minutos |
| --- | --- | --- |
| Portada y recorrido | 1–2 | 2 |
| Código: preparar el repo, guardarraíles, estructura | 3–5 | 9 |
| Tendencias: SDD | 6 | 3 |
| Documentación: dos fuentes de verdad, gaps de SDD | 7–8 | 6 |
| Producto: intención, autoridad, modelo, origen, ProductShape + demo, citas, workflow | 9–15 | 17 |
| Técnica: arc42 | 16 | 4 |
| Desarrollo: flujo agéntico (agent-toolkit) | 17 | 5 |
| Validación: de structured behaviour a e2e, la pirámide | 18–19 | 6 |
| Vista global, lo que depende de nosotros, vídeo, ponente y preguntas | 20–23 | 8 |

## Ideas que deben quedar

- Un repo preparado para agentes: instrucciones, skills, agentes y comandos; `src/` para el código, `docs/` para el conocimiento.
- Una instrucción es una petición, no una garantía: lo que importa se hace cumplir.
- SDD describe cambios; sin una fuente de verdad del producto, las specs divergen (caso real del IVA holandés).
- La intención vuelve a ser fuente de verdad y se gestiona con IA de forma determinista: autoridad en una dirección, aprendizaje en las dos.
- La documentación técnica (arc42) es la segunda fuente de verdad.
- Si producto y arquitectura están al día, mantener los e2e deja de ser caro y la pirámide cambia de forma.
- La IA cambia cómo ejercemos la profesión, no de quién es la responsabilidad.
