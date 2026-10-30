# Narrativa

Un repaso del ciclo de vida del software con mecanismos para domar a la IA en cada fase. Los guardarraíles se presentan una vez, junto a la preparación del repo, y reaparecen donde actúan (citas en CI, tests).

## Recorrido publicado

Intención → arquitectura → guardarraíles → código → evidencia → entrega → mantenimiento. La escena 2 presenta el mapa; cada escena de desarrollo muestra su etapa en la esquina superior derecha. El cierre vuelve al mapa y a la responsabilidad humana en las siete etapas.

## Bloques y tiempos (60 min)

| Bloque | Diapositivas | Minutos |
| --- | --- | --- |
| Portada y recorrido | 1–2 | 3 |
| Intención: dos fuentes, deriva, PDaC, autoridad, modelo y demo | 3–9 | 15 |
| Arquitectura: arc42 | 10 | 4 |
| Guardarraíles | 11 | 4 |
| Código: repo, estructura, SDD y sus tres implementaciones, ejemplo | 12–18 | 13 |
| Evidencia: comportamiento, tests, review | 19–21 | 7 |
| Entrega: ciclo agéntico y despliegue entre entornos | 22–23 | 5 |
| Mantenimiento: señales y vuelta a la decisión de producto | 24–25 | 5 |
| Cierre: vista global, responsabilidad humana y preguntas | 26–28 | 4 |

## Ideas que deben quedar

- Un repo preparado para agentes: instrucciones, skills, agentes y comandos; `src/` para el código, `docs/` para el conocimiento.
- Una instrucción es una petición, no una garantía: lo que importa se hace cumplir.
- SDD describe cambios; sin una fuente de verdad del producto, las specs divergen (caso real del IVA holandés).
- La intención vuelve a ser fuente de verdad y se gestiona con IA de forma determinista: autoridad en una dirección, aprendizaje en las dos.
- La documentación técnica (arc42) es la segunda fuente de verdad.
- Si producto y arquitectura están al día, mantener los e2e deja de ser caro y la pirámide cambia de forma.
- Un cambio pasa por tests, evidencias y review antes del despliegue; producción devuelve señales que pueden cambiar la intención.
- La IA cambia cómo ejercemos la profesión, no de quién es la responsabilidad.
