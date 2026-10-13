---
layout: comparison
section: Guardarraíles
beforeTitle: Blandos · guían
afterTitle: Duros · bloquean
---

# Una instrucción es una petición, no una garantía

::before::

- AGENTS.md y skills
- ADRs y documentación
- Reglas en warning
- Checklists de revisión

::after::

- Build: analizadores, tests de arquitectura
- Commit: hooks, secretos
- CI: checks obligatorios
- **Harness del agente**

<!--
Resumen de mi charla de guardarraíles (talks/soft-and-hard-guardrails). Los blandos pueden estar perfectamente documentados y ninguno garantiza que se cumplan. Los duros forman parte del camino de ejecución. Hay cuatro superficies: build, commit, CI y la nueva, el harness del agente, que intercepta lo que el agente intenta hacer, ejecuta una política y permite o rechaza. Las tres primeras protegen el código; la cuarta protege el proceso del agente y solo existe cuando los agentes escriben tu código. Algunos blandos merecen volverse duros: "solo Billing calcula plazos de devolución" empieza en AGENTS.md y acaba como test de arquitectura.
-->
