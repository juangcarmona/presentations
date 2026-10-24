# Investigación: Platform como referencia para el repositorio de presentaciones

Fecha de investigación: 2026-10-24

## Resumen ejecutivo

La referencia no es solo una web bonita: es una experiencia de producto que convierte una forma de trabajar en un sistema navegable, demostrable y adoptable. La idea más transferible al repositorio de presentaciones es crear una **fundación visible** alrededor del trabajo existente: una portada que explique el método, un catálogo de talks con estado real, una navegación por fases y una capa de evidencia que muestre qué está listo y por qué.

La recomendación es avanzar por capas, empezando por una vista estática y de solo lectura generada desde las fuentes actuales. No conviene empezar por una aplicación completa, autenticación, backend o un componente compartido genérico. Primero hay que hacer explícito el modelo de una presentación y probar que la navegación ayuda a preparar, revisar y reutilizar talks.

## Alcance y limitaciones

La URL solicitada, [`https://platform.ckgrafico.com/`](https://platform.ckgrafico.com/), no pudo abrirse desde los navegadores disponibles ni resolvió DNS desde el entorno de investigación. Por tanto, no atribuyo observaciones directas a ese host.

La referencia verificable utilizada es el conjunto de páginas primarias accesibles de Platform Foundations en [`platform.plainconcepts.com`](https://platform.plainconcepts.com/). La portada y sus páginas enlazadas presentan el mismo tipo de experiencia que se quería estudiar: método, navegación documental, catálogo visual, tokens, componentes, adopción y métricas. Esta relación de referencia debe confirmarse antes de tratar ambos dominios como equivalentes.

## Observaciones verificables

### 1. La portada vende un método, no una colección de páginas

La portada define Platform como una manera de construir software: una apariencia compartida, convenciones comunes y agentes dentro de guardarraíles. Después presenta cuatro pilares —Foundations, agent-harness, agentic-workflows y project-health— y los conecta con un ejemplo visual de aplicación interna: tarjetas de métricas, actividad reciente, estados y tabla de aplicaciones. ([Portada](https://platform.plainconcepts.com/))

La consecuencia de experiencia es importante: el visitante entiende primero qué sistema está viendo y después puede entrar en el detalle. El sitio funciona a la vez como manifiesto, documentación, showcase y puerta de adopción.

### 2. La arquitectura de información sigue el trabajo del lector

La navegación agrupa el contenido en cinco áreas estables: `How we work`, `Domains`, `Library`, `Reference` y `Project`. En la referencia de arquitectura se ve además la separación entre repositorio de fundación, paquetes de tokens/componentes, aplicación de docs y documentación para agentes. ([Arquitectura](https://platform.plainconcepts.com/docs/reference/architecture))

Esto evita que todo se convierta en una lista plana de documentos. Hay una entrada conceptual, áreas de práctica, biblioteca reutilizable, referencia técnica y reglas de evolución.

### 3. El flujo está expresado como fases y permisos

El proceso tiene tres fases: `Discovery`, `Foundations` y `Maintenance mode`. Cada fase cambia quién puede iniciar el trabajo y qué produce: decisión de producto, software y guardarraíles, o cambios pequeños enviados continuamente. Las fases se solapan, pero una capacidad solo llega a mantenimiento después de construir sus guardarraíles. ([Las tres fases](https://platform.plainconcepts.com/docs/how-we-work))

En `Maintenance mode`, la experiencia concreta es un pipeline: entrada, triage, refinamiento, implementación, verificación, pull request y merge. El acceso determina la puerta de entrada; los usuarios con menos permisos pasan por triage. El sistema distingue cambios de producto —experiencia, contenido, reglas y fórmulas— de decisiones técnicas que deben seguir siendo de ingeniería. ([Maintenance mode](https://platform.plainconcepts.com/docs/how-we-work/maintenance))

### 4. La autonomía se presenta como consecuencia de la fundación

La página de `Foundations` no presenta la IA como el producto principal. El entregable central son restricciones que fallan el build: límites de arquitectura, disciplina de especificaciones, calidad de tests, trazabilidad y checkpoints humanos para áreas sensibles. También declara una escalera de determinismo: dejar que reglas, clasificadores y pasos precomputados hagan todo lo posible antes de pedir juicio al modelo. ([Foundations](https://platform.plainconcepts.com/docs/how-we-work/foundations))

La interfaz refuerza esa tesis: cada capacidad tiene un alcance explícito, estados de salida y un punto claro de hand-off. No depende de una promesa genérica de autonomía.

### 5. La adopción tiene un camino ordenado y también una ruta brownfield

La página de adopción propone una secuencia para un proyecto nuevo: instalar el tema, instalar el harness, instalar los workflows y registrar el proyecto en métricas. Para un proyecto existente recomienda adopción incremental: tema primero, componentes al tocar cada pantalla, arquitectura para el código nuevo y automatización cuando el repositorio pueda soportarla. ([Adopt in your project](https://platform.plainconcepts.com/docs/adopt))

Esto reduce el riesgo de que “parecerse a Platform” signifique reescribirlo todo. La experiencia ofrece un primer paso pequeño y una ruta de madurez.

### 6. La consistencia visual procede de tokens y reglas, no de una mega-biblioteca

El diseño se describe como calmado, denso en información y orientado a herramientas internas. Usa una tipografía única, un azul de marca, neutros fríos y colores funcionales para estados. Las reglas observables incluyen tokens semánticos, contraste WCAG 2.2 AA, foco visible, estados de carga/vacío/éxito/error, responsive y ausencia de sombras; la elevación se expresa como borde más superficie. ([Design guidelines](https://platform.plainconcepts.com/docs/reference/design))

La arquitectura insiste en compartir tokens, convenciones, documentación y showcase, pero mantener los componentes específicos en cada aplicación. Se usan componentes de shadcn/ui directamente y se promueve compartir algo solo cuando la misma necesidad aparece en más de una aplicación. ([Principles](https://platform.plainconcepts.com/docs/principles), [Components](https://platform.plainconcepts.com/docs/components))

### 7. La prueba de calidad está dentro de la experiencia

Project Health organiza la lectura en cuatro áreas: Engineering, Delivery, Agentic y Roadmap. La vista inicial prioriza si existen los guardarraíles que hacen segura la autonomía, antes que la velocidad de entrega. ([Measuring with Health](https://platform.plainconcepts.com/docs/health))

La métrica se trata con cautela: se rechazan muestras pequeñas, los datos incompletos se etiquetan como parciales, los números que no pueden conocerse no se inventan y la atención humana tiene una vista separada. ([Analytics with DORA](https://platform.plainconcepts.com/docs/analytics))

Para una plataforma de presentaciones, esto sugiere mostrar evidencia de preparación —fuentes, narrativa, build, render y revisión— en vez de una puntuación decorativa.

## Estructura y flujo observado

```text
Portada / método
  ├── Cómo trabajamos: fases, límites y flujo
  ├── Dominios: frontend, backend, AI x SDLC
  ├── Biblioteca: tokens y componentes
  ├── Referencia: arquitectura, diseño y agentes
  └── Proyecto: principios, contribución y releases

Adopción
  └── tema → harness → workflows → métricas

Cambio elegible
  └── intake → triage → refine → implement → verify → PR → merge

Medición
  └── engineering → delivery → agentic → roadmap
```

El patrón de producto es: **orientar → demostrar → adoptar → operar → medir**. La documentación no está separada de la operación; explica los límites del sistema y enlaza con artefactos que los hacen comprobables.

## Cómo trasladarlo al repositorio de presentaciones

### Modelo de producto propuesto

La unidad principal no debería ser un fichero Slidev, sino un **talk como producto** con varias vistas:

| Vista | Pregunta que responde | Fuente actual probable |
| --- | --- | --- |
| Catálogo | ¿Qué talks existen y en qué estado están? | `talks/*/README.md` |
| Discovery | ¿Qué problema, audiencia y tesis tiene? | `content/`, brief y narrativa |
| Research | ¿Qué evidencia sostiene la charla? | `research/` |
| Build | ¿Dónde está la fuente editable y cómo se ejecuta? | `deck/` y README |
| Review | ¿Qué se ha comprobado y qué falta? | revisión, render y notas |
| Delivery | ¿Qué versión se presentó, cuándo y dónde? | metadatos de la edición |

Esto conserva el modelo canónico del repositorio —cada talk autocontenido, investigación separada, fuente editable y artefactos generados ignorados— y añade una superficie común para recorrerlo. ([Convenciones del repositorio](../agents/presentations.md))

### Experiencia objetivo

1. **Portada:** explicar que el repositorio es una fábrica de talks, no una carpeta de diapositivas; mostrar los talks, sus fases y la evidencia disponible.
2. **Vista de catálogo:** tarjetas o tabla densa con título, audiencia, formato, próxima edición, estado de research/narrativa/deck/QA y enlaces a la fuente.
3. **Vista del talk:** una navegación lateral estable: idea, fuentes, narrativa, deck, revisión y entregas.
4. **Vista de fase:** explicar qué significa `Discovery`, `Foundations` y `Delivery/Maintenance` en el contexto de una presentación.
5. **Evidencia:** enseñar citas, comandos de build, fecha del último render y resultado de QA; los huecos deben aparecer como “no verificado”, no como verde por defecto.

### Traducción de fases

- `Discovery`: audiencia, problema, tesis, abstract, investigación y decisiones narrativas.
- `Foundations`: estructura de la charla, fuente editable, assets, comandos reproducibles, notas del ponente y guardarraíles de legibilidad/citas.
- `Delivery/Maintenance`: adaptar un talk a otra audiencia o evento, corregir una diapositiva, incorporar feedback y conservar el historial de ediciones.

La separación es útil porque evita tratar una nueva charla como un cambio aislado de slides. La unidad de trabajo sería una capacidad narrativa o una edición de la charla, con límites y evidencia propios.

### Primera adopción razonable

La primera versión debería ser una superficie estática, generada desde el repositorio, con un solo talk piloto y enlaces profundos a las fuentes existentes. No requiere backend ni una base de datos: el repo ya contiene el material canónico. La siguiente capa podría añadir un manifiesto mínimo por talk y una comprobación determinista de cobertura: README, research, narrativa, deck, build y revisión.

El criterio de éxito inicial no sería “tener una plataforma”, sino que alguien pueda responder en menos de un minuto: qué talks hay, cuál está listo, qué falta y dónde se verifica cada afirmación.

## Inferencias y propuestas — separadas de los hechos

Estas conclusiones son inferencias a partir de las páginas observadas y de la estructura actual del repositorio; no son funcionalidades observadas en Platform ni decisiones ya aprobadas:

1. **Sí podemos movernos hacia algo así**, porque ya tenemos las piezas de fundación: talks autocontenidos, research, contenido independiente del renderer, deck editable, skills y comandos. La oportunidad está más en hacer visible el sistema que en sustituir el flujo actual.
2. El equivalente más valioso no sería copiar la estética, sino copiar el patrón: una fundación pequeña, una navegación por fases, un catálogo como prueba y una adopción incremental.
3. El dashboard debe ser principalmente un mecanismo de honestidad operativa. Un estado `ready` solo debería aparecer con evidencia verificable; `unknown`, `blocked` o `needs-review` son estados útiles, no fallos de diseño.
4. La estética adecuada para este repositorio sería información densa y calmada —tokens, bordes, estados, tipografía legible— con el carácter visual de las presentaciones reservado para cada talk. Una plataforma de talks no debería imponer una única dirección artística a todas las charlas.
5. Antes de construir una UI hay tres decisiones de producto que siguen abiertas: si la plataforma será privada o pública, si servirá solo al flujo personal o a varios autores, y si su unidad de publicación será el talk, la edición/evento o una serie de talks. No conviene inferirlas del diseño de referencia.

## Fuentes primarias consultadas

- [Platform Foundations — portada](https://platform.plainconcepts.com/)
- [The three phases](https://platform.plainconcepts.com/docs/how-we-work)
- [Discovery](https://platform.plainconcepts.com/docs/how-we-work/discovery)
- [Foundations](https://platform.plainconcepts.com/docs/how-we-work/foundations)
- [Maintenance mode](https://platform.plainconcepts.com/docs/how-we-work/maintenance)
- [Adopt in your project](https://platform.plainconcepts.com/docs/adopt)
- [Frontend](https://platform.plainconcepts.com/docs/frontend)
- [Architecture](https://platform.plainconcepts.com/docs/reference/architecture)
- [Design guidelines](https://platform.plainconcepts.com/docs/reference/design)
- [AI agents](https://platform.plainconcepts.com/docs/reference/agents)
- [Principles](https://platform.plainconcepts.com/docs/principles)
- [Components](https://platform.plainconcepts.com/docs/components)
- [Measuring with Health](https://platform.plainconcepts.com/docs/health)
- [Analytics with DORA](https://platform.plainconcepts.com/docs/analytics)
- [`@plainconceptsplatform/ui-theme` en npm](https://www.npmjs.com/package/%40plainconceptsplatform/ui-theme)
