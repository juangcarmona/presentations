---
layout: comparison
section: Guardarraíles
beforeTitle: Blandos · guían
afterTitle: Duros · bloquean
beforeColor: "#5585ff"
afterColor: "#2f69ff"
---

# Una instrucción es una petición, no una garantía

::before::

- `AGENTS.md`, `CLAUDE.md` y skills
- ADRs y documentación de arquitectura
- Reglas configuradas como warning
- Checklists de revisión

::after::

- Analizadores y tests de arquitectura que rompen el build
- Hooks de commit y checks obligatorios en CI
- Hooks del harness: `dotnet test | tail` bloqueado
- Citas de producto verificadas en CI

<!--
Guardarraíles: restricciones que mantienen los cambios dentro de límites aceptables. Los blandos guían: la regla existe, pero nada impide ignorarla. Los duros bloquean: la herramienta se niega a continuar. Cuatro superficies para los duros: build, commit, CI y la nueva, el harness del agente, que intercepta lo que el agente intenta hacer. Ejemplo real: el agente encadena dotnet test con tail; en una tubería el código de salida es el de tail, y un test rojo informa verde. El hook lo bloquea antes de ejecutarlo. La cooperación del agente no es evidencia. Algunos blandos merecen volverse duros: cuando una regla importa lo suficiente, se hace ejecutable. Veremos más guardarraíles duros en el resto de la charla: citas de producto en CI, la capa determinista y los tests. Más detalle: mi charla de guardarraíles blandos y duros.
-->
