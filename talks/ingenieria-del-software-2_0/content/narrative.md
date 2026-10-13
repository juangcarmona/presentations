# Narrativa

## Hilo conductor

Una tienda online y una regla: «Las devoluciones se aceptan en los 30 días siguientes a la entrega» (`BR-REFUND-001`). La regla aparece en todos los anillos y al final se cambia a 14 días.

## Anillos

De dentro a fuera. El mapa se muestra una vez al principio; después, la etiqueta de sección de cada diapositiva indica el anillo.

1. Código, repositorio y guardarraíles
2. Especificación (SDD)
3. Producto (PDaC)
4. Validación
5. Evidencia
6. Operación

Los guardarraíles no son un anillo: aparecen donde hacen falta (junto al código, en CI sobre las citas de producto, en los tests y en operación).

## Bloques y tiempos (60 min)

| Bloque | Diapositivas | Minutos |
| --- | --- | --- |
| Apertura: el cuello de botella se mueve, mapa y ejemplo | 1–4 | 5 |
| Anillo 1: repo preparado para agentes, arc42, instrucciones | 5–7 | 9 |
| Guardarraíles: blandos y duros, harness y capa determinista | 8–10 | 9 |
| Anillos 2 y 3: SDD, divergencia y PDaC | 11–13 | 9 |
| Anillo 4: tests como guardarraíles, la pirámide | 14–15 | 6 |
| Anillos 5 y 6: evidencia y operación | 16–17 | 5 |
| Ejercicio: 30 → 14 días y el bucle de cada cambio | 18–19 | 7 |
| Big picture: cinco etapas, dos KB, un contrato | 20 | 4 |
| Cierre y preguntas | 21–22 | 6 |

## Ideas que deben quedar

- Si construir cuesta casi nada, el cuello de botella se mueve al resto del ciclo.
- `src/` para el código, `docs/` para el conocimiento (arquitectura con arc42 y ADRs, producto con PDaC, diseño). Cada decisión, en un solo sitio.
- Una instrucción es una petición, no una garantía. La cooperación del agente no es evidencia.
- Una spec describe un cambio; la regla pertenece al producto. Se define una vez y se cita.
- Los tests son guardarraíles conectados con la intención; el escenario es intocable para el agente.
- La evidencia da fundamento a la revisión humana; no la sustituye.
- Producción propone cambios de producto; no los impone.
- El agente es probabilista; el framework, determinista: el código fija qué entra, qué sale y cuándo parar.
- Cinco etapas, dos bases de conocimiento (negocio = docs/product, técnica = docs/architecture) y un contrato: el ticket.
- plan → test → implement → review → verify → remember → improve: los dos últimos hacen que el sistema aprenda.
