# Narrativa

Un recorrido por las siete etapas de la ingeniería del software con IA, desde la intención hasta el mantenimiento. Los guardarraíles se explican una vez y reaparecen cuando actúan.

## Recorrido publicado

Intención → arquitectura → guardarraíles → código → evidencia → entrega → mantenimiento. El mapa abre el recorrido; cada diapositiva de desarrollo muestra su etapa en la esquina superior derecha. El cierre recoge la responsabilidad humana en las siete etapas. Los enlaces públicos usan identificadores semánticos, sin numeración; los fragmentos antiguos siguen resolviendo.

## Bloques y tiempos (60 min)

| Bloque | Diapositivas | Minutos |
| --- | --- | --- |
| Portada y recorrido | 1–2 | 3 |
| Intención: dos fuentes, PDaC, autoridad, modelo y demo | 3–8 | 13 |
| Arquitectura: arc42 | 9 | 4 |
| Guardarraíles | 10 | 4 |
| Código: repo, estructura, SDD, tres implementaciones y límites de las specs | 11–17 | 14 |
| Evidencia: de pirámide a reloj de arena y un test trazable | 18–19 | 6 |
| Entrega: flujo agéntico con review y despliegue entre entornos | 20–21 | 6 |
| Mantenimiento: señales y vuelta a la decisión de producto | 22–23 | 6 |
| Cierre: responsabilidad humana y preguntas | 24–25 | 4 |

## Ideas que deben quedar

- Un repo preparado para agentes: instrucciones, skills, agentes y comandos; `src/` para el código, `docs/` para el conocimiento.
- Una instrucción es una petición, no una garantía: lo que importa se hace cumplir.
- SDD describe cambios; sin una fuente de verdad del producto, las specs divergen (caso real del IVA holandés).
- La intención vuelve a ser fuente de verdad y se gestiona con IA de forma determinista: autoridad en una dirección, aprendizaje en las dos.
- La documentación técnica (arc42) es la segunda fuente de verdad.
- Con una intención viva, la IA ayuda a generar y mantener e2e; los tests unitarios siguen siendo la base de un reloj de arena.
- Un cambio pasa por tests, evidencias y review antes del despliegue; producción devuelve señales que pueden cambiar la intención.
- La IA cambia cómo ejercemos la profesión, no de quién es la responsabilidad.
