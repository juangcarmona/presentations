# Workspace de presentaciones

## Decisiones iniciales

1. Slidev es el camino rápido para decks narrativos y demos técnicas.
2. PowerPoint editable se mantiene como camino separado para entregables que necesiten compatibilidad con el formato `.pptx`.
3. La skill original de Plain Concepts se versiona como referencia local, pero el flujo propio se divide por responsabilidad para evitar cargar todo el motor en cada tarea.
4. El tema Slidev se mantiene como repositorio externo en `C:\dev\plainconceptschapters\projects-brand-slidev-theme`; este repo guarda los decks y las decisiones de uso, no una copia duplicada del tema.

## Skills

| Skill | Responsabilidad |
| --- | --- |
| `presentation-brief` | Convertir una idea o material fuente en una narrativa y plan de slides |
| `slidev-deck` | Crear, editar, ejecutar y exportar decks Slidev con el tema Plain Concepts |
| `pptx-deck` | Orquestar decks `.pptx` editables y derivar al motor versionado |
| `presentation-qa` | Revisar contenido, render, legibilidad y consistencia visual |

