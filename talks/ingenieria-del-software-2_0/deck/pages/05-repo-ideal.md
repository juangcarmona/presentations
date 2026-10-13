---
layout: console
title: "~/tienda"
---

# Un repo preparado para agentes

```text
├── AGENTS.md            # mapa de contexto
├── CLAUDE.md            # @AGENTS.md
├── .agents/skills/      # capacidades bajo demanda
├── src/                 # todo el código
├── tests/               # unit · e2e
└── docs/                # todo el conocimiento
    ├── architecture/    # arc42 + ADRs
    ├── product/         # PDaC: reglas, journeys, escenarios
    └── design/          # UX y UI
```

<!--
Anillo 1 · Repositorio. Lo que necesita un agente es lo mismo que una persona nueva en el equipo: orientarse, saber ejecutar, saber qué respetar y saber cuándo ha terminado. La diferencia es que el agente llega nuevo cada mañana. src para el código, docs para el conocimiento, cada decisión en un solo sitio. AGENTS.md es un mapa de contexto corto: dice dónde mirar, no lo explica todo. CLAUDE.md tiene una sola línea que importa AGENTS.md. Las skills guardan el detalle que solo hace falta a veces. Ejemplo real: el repositorio donde preparo esta charla funciona exactamente así.
-->
