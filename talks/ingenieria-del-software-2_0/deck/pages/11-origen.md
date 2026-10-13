---
layout: table
section: De dónde viene PDaC
density: compact
---

# No inventa nada: junta disciplinas que ya existen

| Mecanismo | Viene de |
|---|---|
| Ficheros versionados y legibles | Git, Markdown, Docs as Code, Requirements as Code |
| Metadatos y validación | YAML front matter, JSON Schema, quality gates en CI |
| IDs estables y enlaces tipados | Ingeniería de requisitos, trazabilidad |
| Vocabulario de producto | Casos de uso, journeys, reglas de negocio, DDD |
| Baselines y Product Changes | Gestión de configuración, control de cambios, PRs |
| Citas y detección de obsoletos | Trazabilidad, suspect links, huellas SHA-256 |
| Grafos e informes de impacto | Grafos dirigidos, análisis de impacto |
| Contexto acotado para agentes | Context engineering, harness, human-in-the-loop |

<!--
Del artículo "Where Product Definition as Code comes from" en pdac.dev. PDaC no reclama inventar nada: es un mapa de atribución de dónde viene cada mecanismo. Vecinos que mantienen su propia autoridad: ADRs, C4, arc42, OpenSpec, Spec Kit, Kiro, Gherkin. Prior art: Doorstop, StrictDoc, Sphinx-Needs, DOORS Next, Jama, Polarion, OpenFastTrace… Frase del artículo: "LLMs are industrialising specification drift". Y sus límites, dichos en voz alta: la validación estructural prueba estructura, no valor para el cliente ni corrección de la implementación. Aquí van los logos de pdac.dev (ver public/pdac/).
-->
