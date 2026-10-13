# Narrativa

Un repaso del ciclo de vida del software con mecanismos para domar a la IA en cada fase. Los guardarraíles se presentan una vez, junto a la preparación del repo, y reaparecen donde actúan (citas en CI, capa determinista, tests).

## Bloques y tiempos (60 min)

| Bloque | Diapositivas | Minutos |
| --- | --- | --- |
| Portada y recorrido | 1–2 | 3 |
| Código: preparar el repo, guardarraíles, estructura | 3–5 | 10 |
| Tendencias: SDD | 6 | 3 |
| Documentación: dos fuentes de verdad, gaps de SDD | 7–8 | 7 |
| Producto: la intención, PDaC, origen, ProductShape + demo | 9–12 | 13 |
| Técnica: arc42 | 13 | 3 |
| Desarrollo: flujo agéntico, capa determinista | 14–15 | 7 |
| Validación: de structured behaviour a e2e, la pirámide | 16–17 | 6 |
| Vista global, lo que depende de nosotros, vídeos, preguntas | 18–21 | 8 |

## Ideas que deben quedar

- Un repo preparado para agentes: instrucciones, skills, agentes y comandos; `src/` para el código, `docs/` para el conocimiento.
- Una instrucción es una petición, no una garantía: lo que importa se hace cumplir.
- SDD describe cambios; sin una fuente de verdad del producto, las specs divergen (caso real del IVA holandés).
- La intención vuelve a ser fuente de verdad y se gestiona con IA de forma determinista: autoridad en una dirección, aprendizaje en las dos.
- La documentación técnica (arc42) es la segunda fuente de verdad.
- El agente es probabilista; el framework, determinista.
- Si producto y arquitectura están al día, mantener los e2e deja de ser caro y la pirámide cambia de forma.
- La IA cambia cómo ejercemos la profesión, no de quién es la responsabilidad.
