# Author-only speaker notes

Extracted verbatim from the original source; never imported into the site.

## cover

Presentarme rápido: más de veinte años desarrollando software, los últimos con agentes. Prometer el recorrido: código, tendencias, documentación, desarrollo, validación y una vista global. Es una charla de proceso; las herramientas son ejemplos reales.

## 02-recorrido

El "2.0" no viene de sustituir la ingeniería de software por IA, sino de aprovechar este momento. Durante años hemos dejado de hacer muchas cosas por falta de tiempo: definir bien, diseñar bien, validar bien. Ahora que desarrollar ya no consume todo aquel esfuerzo, podemos revisar qué hacemos, qué podemos hacer mejor y qué sigue dependiendo completamente de nosotros. Vamos a recorrer el ciclo de vida y, en cada fase, ver mecanismos para domar a la IA.

## 03-repo

Qué necesita el proyecto para trabajar con agentes y qué necesitan los agentes para adaptarse al proyecto. Lo mismo que una persona nueva en el equipo, pero el agente llega nuevo cada mañana. Instrucciones: AGENTS.md es el estándar de facto (Claude Code lo importa desde CLAUDE.md con @AGENTS.md; Copilot, Codex y OpenCode lo leen; cada uno con su dialecto para lo demás, revisar antes de cada edición). Skills: el detalle que solo hace falta a veces. Agentes: subagentes con contexto aislado. Comandos: flujos que se disparan. Todo esto se puede versionar y distribuir como paquetes o plugins (APM, marketplaces, lockfiles de skills). Problemas de hoy: contexto inflado, instrucciones obsoletas y, sobre todo, que el agente conozca una regla y aun así la incumpla. Eso nos lleva a los guardarraíles.

## 04-guardarrailes

Guardarraíles: restricciones que mantienen los cambios dentro de límites aceptables. Los blandos guían: la regla existe, pero nada impide ignorarla. [clic] Los duros bloquean: la herramienta se niega a continuar. Cuatro superficies para los duros: build, commit, CI y la nueva, el harness del agente, que intercepta lo que el agente intenta hacer. Ejemplo real: el agente encadena dotnet test con tail; en una tubería el código de salida es el de tail, y un test rojo informa verde. El hook lo bloquea antes de ejecutarlo. La cooperación del agente no es evidencia. Algunos blandos merecen volverse duros: cuando una regla importa lo suficiente, se hace ejecutable. Veremos más guardarraíles duros en el resto de la charla: citas de producto en CI y los tests. Más detalle: mi charla de guardarraíles blandos y duros.

## 05-estructura

src como raíz del código, docs como raíz de la documentación: producto, arquitectura y diseño. AGENTS.md dice dónde mirar; no lo explica todo. CLAUDE.md tiene una sola línea que importa AGENTS.md. Una regla, un sitio, y todo lo demás apunta. Ejemplo real: el repositorio donde preparo esta charla funciona así. Las dos ramas de docs, producto y arquitectura, van a ser nuestras dos fuentes de verdad.

## 06-sdd

La tendencia del momento. En lugar de pedir código con un prompt suelto, describimos qué queremos y por qué, planificamos el cómo, lo partimos en tareas y el agente implementa. Aporta intención explícita, diseño revisado antes del diff y contexto acotado por cambio. Cuesta: varios documentos por cambio, ceremonia en cambios pequeños y cada herramienta con su estructura. Revisar las descripciones de cada herramienta antes de la charla, cambian rápido. Y tiene un hueco importante, que vemos ahora.

## 07-gaps

El grep es el ejemplo de pdac.dev: tres specs, tres redacciones, dos significados. 30 días desde la compra no es lo mismo que 30 días desde la entrega. El caso real es de mi artículo "I Tried to Prove PDaC Wrong": un proyecto open source con 160 specs y 273 cambios archivados en OpenSpec que acabó con dos modelos distintos de la misma declaración de IVA holandesa. La spec oficial prohibía un servicio y, unas 380 líneas más abajo en el mismo fichero, lo exigía; ambas reglas marcadas como MUST. Resultado: el esquema equivocado en runtime, integraciones rotas y un agujero que permitía crear una declaración en los libros de otra empresa. Por qué: demasiadas specs y ningún sitio con la verdad del producto; cada cambio se comprobaba contra sí mismo, no contra el producto; y la validación comprueba forma, no significado. ¿Cuál es la fuente de verdad?

## 08-dimensiones

La documentación tiene dimensiones distintas. [clic] La de producto dice qué queremos y por qué: es la intención. [clic] La técnica dice cómo lo construimos y qué decisiones hemos tomado. Durante años ninguna de las dos se mantenía: se escribía al principio y moría. Con agentes, las dos vuelven a ser fuentes de verdad, porque es lo que leen antes de tocar nada. Y si no están al día, el agente trabaja sobre mentiras.

## 09-intencion

Momento clave, ir despacio. Pregunta a la sala: ¿cuándo fue la última vez que alguien actualizó el documento de requisitos después del primer sprint? La intención, el qué, es lo que define el backlog, y siempre la hemos dejado morir. Ahora la podemos mantener viva: la IA nos ayuda a redactar y a detectar impacto, pero los identificadores, las citas, la validación y el impacto los calcula código, y los cambios los acepta una persona. Eso es Product Definition as Code.

## 10-autoridad

La definición de producto aceptada está en medio. Arriba, el pensamiento de producto: investigación, evidencia y criterio; lo que sale de ahí entra en la definición solo con aceptación humana. Abajo, la entrega: specs, arquitectura, backlog y agentes, que la citan en lugar de copiarla. Y de vuelta, en naranja, la entrega devuelve evidencia y Product Changes propuestos, pero decide una persona. One-way authority, two-way learning. Markdown legible, IDs estables y relaciones tipadas. PDaC es una propuesta metodológica abierta, no un producto.

## 11-modelo

PDaC-2. Actores que participan en journeys, que se realizan en casos de uso, gobernados por reglas de negocio como BR-REFUND-001, con su dominio (términos y bounded contexts). Los casos de uso generan obligaciones: requisitos funcionales, de calidad y restricciones. Los requisitos referencian comportamiento estructurado con Given/When/Then: de ahí saldrán los tests. Fuera de la definición: los Product Changes la afectan, las vistas derivadas se proyectan desde ella (snapshot, impacto, estado de citas) y los consumidores de la entrega la citan. No hace falta usarlo todo desde el primer día: muchos equipos empiezan por reglas y escenarios.

## 12-origen

Del artículo "Where Product Definition as Code comes from" (pdac.dev). PDaC no inventa nada: junta disciplinas que ya existen. Ficheros versionados: Git, Markdown, Docs as Code. Metadatos y validación: YAML, JSON Schema, quality gates. IDs estables y enlaces: ingeniería de requisitos y trazabilidad. Vocabulario: casos de uso, journeys, reglas de negocio, DDD. Baselines y Product Changes: gestión de configuración, control de cambios, PRs. Citas: trazabilidad, suspect links, huellas SHA-256. Grafos: análisis de impacto. Contexto acotado: context engineering y human-in-the-loop. Frase: "LLMs are industrialising specification drift". Y sus límites: la validación estructural prueba estructura, no valor ni corrección.

## 13-productshape

El GIF es el ejemplo de pdac.dev: las tres specs que hablan de devoluciones con tres redacciones, la regla BR-REFUND-001 definida una vez con un ID estable, y prodshape citations verify marcando como stale cada spec que la citaba cuando la regla cambia. ProductShape es la implementación de referencia de PDaC. Markdown es la fuente de verdad; el grafo se deriva. En CI es un guardarraíl duro sobre el conocimiento de producto. Después, salir a la demo: abrir el snapshot generado en DomusMind.

## 14-citas

PDaC-5. Un artefacto de producto es citado por una spec SDD, que se implementa y produce evidencia. Cada cita tiene un estado: current, stale (el artefacto cambió y la spec necesita revisión), unresolved (no se puede resolver) y tampered (el bloque incrustado no coincide con el texto canónico en el digest registrado). Cuando el caso de uso cambia, la cita pasa a stale y una persona revisa la spec. Nunca hay reescritura automática, y PDaC no prescribe la implementación.

## 15-workflow

Así gestionamos la intención con IA de forma determinista. Partimos de una baseline aceptada. El cambio se registra como Product Change, un registro semántico que un agente puede redactar. Se valida como overlay sobre el estado propuesto, una persona lo aprueba y se aplica en una rama de trabajo. Después, el flujo de siempre: pull request, revisión en Git y aceptación humana con el merge, que crea la nueva baseline. Apply materialises, merge accepts. El agente puede redactar o cuestionar decisiones, pero no aceptarlas.

## 16-arc42

arc42 da una estructura conocida de doce bloques a docs/architecture. Para un agente, los que más rinden son el contexto y alcance (qué hay dentro y fuera del sistema), la estrategia de solución, los bloques de construcción, los conceptos transversales y las decisiones, idealmente como ADRs, uno por fichero. Los requisitos de calidad y el glosario son el puente con PDaC: los requisitos de calidad y los términos de dominio viven en la definición de producto y la arquitectura los cita. No hace falta rellenar los doce desde el primer día: empezad por contexto, bloques y decisiones.

## 17-flujo-agentico

Publi: mi plugin agentic-sdlc. adopt descubre las herramientas que ya usa el proyecto y escribe su ciclo en docs/engineering-lifecycle.md. Etapas: refine, propose, implement, integrate y review, con puertas Ready (la verifica un agente), Planned (una persona) y Done (CI y juicio por rol). El done-gate-auditor revisa el diff fuera del contexto de quien lo escribió. El proyecto es dueño de su configuración tras la adopción. Lo estoy llevando hacia el bucle completo plan, test, implement, review, verify, remember, improve, con ECC como referencia. Hay otros; lo importante es el recorrido.

## 19-validacion

Volvemos a PDaC. El comportamiento estructurado de la definición de producto, con sus Given/When/Then, se convierte en criterios de aceptación al crear el backlog. De ahí generamos Gherkin etiquetado con la regla y tests e2e ejecutables. Los valores frontera, 29 y 31, salen de la regla, no de la imaginación del agente. Si la regla cambia, sabemos exactamente qué escenarios revisar. PDaC deriva escenarios trazables; ejecutarlos y juzgarlos es cosa del pipeline. La evidencia (qué se comprobó, contra qué decisión, con qué resultado, en qué commit, incluso un vídeo del flujo en preproducción) viaja con el PR y da fundamento a la revisión humana; no la sustituye.

## 20-piramide

Primero la pirámide de siempre. Problema clásico: mantener los tests actualizados; la pirámide existía por economía, los e2e eran caros de escribir y sobre todo de mantener. [clic] Ahora: si producto y arquitectura se mantienen al día y son nuestra fuente de verdad, un agente genera los e2e desde los escenarios y los repara cuando cambia la UI, contra la intención y no contra el selector de ayer. Mantenerlos deja de ser tan costoso y la forma cambia. Siguen siendo más lentos y los unitarios siguen siendo la base. Riesgo: un agente que repara tests puede debilitar la aserción; la reparación puede cambiar cómo se ejecuta el test, nunca el escenario.

## 20b-power-bi-fabric

Para esta sala. El grep de devoluciones, en vuestro idioma: tres "ventas netas", tres definiciones. ¿A quién no le ha pasado que dos cuadros de mando no cuadran? (Ejemplo ilustrativo, no de un cliente real.)
Contexto: si el modelo semántico se guarda como Power BI Project (PBIP/TMDL) en Git, es texto, y un agente lo trabaja como código. Un AGENTS.md con vuestras convenciones (nombres, dónde van las medidas, qué tabla es la de hechos) y las Skills for Fabric de Microsoft, open source, que se instalan como plugin en Claude Code y Copilot CLI y que Codex u OpenCode leen vía AGENTS.md.
Herramientas: el Power BI Modeling MCP Server de Microsoft (en preview) deja a un agente crear y modificar tablas, medidas, relaciones y RLS, y ejecutar y validar DAX, contra Power BI Desktop, Fabric o PBIP. Guardarraíles duros: arrancarlo en --readonly, mantener la confirmación del primer cambio y cambiar el modelo solo por PR. Avisos: backup del modelo antes de usarlo; los metadatos y resultados de consultas llegan al proveedor del LLM; no pinta páginas de informe. Microsoft recomienda VS Code con Copilot y dice que funciona con otros clientes MCP.
Fuente de verdad: PDaC aplicado a métricas. "Cliente activo" o "Ventas netas" con un ID estable; si negocio cambia la definición, todo lo que la citaba queda stale. Y tests Given/When/Then sobre datos: dado el cierre de marzo, cuando refresco, las ventas netas cuadran con contabilidad.

## 21-vista-global

Resumen en tres clics.
Primero, la línea: código preparado para agentes, producto con PDaC y ProductShape, arquitectura con arc42 y ADRs, desarrollo con un flujo agéntico, validación desde los escenarios hasta los e2e, y evidencia que viaja con el PR. En cada fase la IA hace lo que antes recortábamos.
[clic] Debajo de cada caja, lo que decide una persona: las convenciones, los cambios de producto, las decisiones de arquitectura, la revisión, los escenarios y la aceptación final.
[clic] La banda de guardarraíles duros cruza todo el recorrido: lo que importa lo hace cumplir el código, no el prompt.
[clic] Y todo se apoya en dos fuentes de verdad: el QUÉ en docs/product y el CÓMO en docs/architecture. La evidencia no cambia el producto por su cuenta: vuelve como Product Change propuesto. Autoridad en una dirección, aprendizaje en las dos.

## 22-nosotros

La IA cambia cómo ejercemos la profesión, no de quién es la responsabilidad. Decidir qué producto queremos, aceptar o rechazar cada cambio de definición, elegir qué reglas merecen ser duras, juzgar la evidencia y responder de lo que se entrega sigue siendo nuestro.

## 23-videos

Cierre con humor y con mensaje: la Alianza Rebelde pudo con la Estrella de la Muerte porque tenía los planos. La documentación técnica es eso: lo que permite entender un sistema, y encontrar su punto débil, sin haberlo construido. Necesita conexión a internet en la sala.

## 24-fin

Gracias. Más de veinte años desarrollando software; autor de Product Definition as Code y de agent-toolkit. Abrir preguntas y dejar esta diapositiva puesta para que quien quiera apunte los enlaces.
