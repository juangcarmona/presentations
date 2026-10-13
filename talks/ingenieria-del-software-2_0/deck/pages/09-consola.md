---
layout: console
title: "~/tienda"
---

# Un test que falla y parece verde

```bash
$ dotnet test | tail -5
[bloqueado] hooks/no-piped-verdicts.mjs
  El código de salida es el de tail, no el del runner.
  Un test rojo informa verde.
  Usa: set -o pipefail · dotnet test > result.log
```

<!--
Guardarraíles · harness. Ejemplo real. El agente no miente a propósito: encadena comandos como lo haría cualquiera. Pero en una tubería el código de salida es el del último comando, el de tail, y un test rojo informa verde. Un hook del harness intercepta el comando antes de ejecutarlo y explica la forma correcta. Frase para cerrar: la cooperación del agente no es evidencia. Y otra de la charla de guardarraíles: una comprobación que nunca puede fallar no protege nada.
-->
