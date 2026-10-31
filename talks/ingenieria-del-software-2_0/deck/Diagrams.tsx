import { useState } from 'react'

type Localized = [es: string, en: string]
type Node = { id: string; x: number; y: number; label: Localized; detail: Localized; bullets?: [Localized, Localized]; accent?: boolean; tone?: string; human?: boolean; badge?: Localized }
type DiagramSpec = { name: Localized; caption: Localized; nodes: Node[]; edges: [number, number][]; edgeLabels?: { x: number; y: number; label: Localized }[] }

const diagrams: Record<string, DiagramSpec> = {
  'prepare-repo-for-ai': {
    name: ['Un repositorio preparado para trabajar con IA', 'A repository ready to work with AI'],
    caption: ['El contexto vive en el repo. Cada capacidad se activa cuando toca.', 'Context lives in the repo. Each capability activates when needed.'],
    nodes: [
      { id: 'repo', x: 50, y: 70, label: ['REPO', 'REPO'], detail: ['Código y conocimiento versionados en el mismo sistema.', 'Versioned code and knowledge in one system.'], bullets: [['Contexto junto al código', 'Context next to code'], ['Cambios revisables', 'Reviewable changes']], accent: true, tone: 'blue' },
      { id: 'instructions', x: 14, y: 26, label: ['Instrucciones', 'Instructions'], detail: ['Un mapa breve que orienta al agente sin volcarle todo el repositorio.', 'A short map that orients the agent without dumping the whole repository.'], bullets: [['AGENTS.md y reglas locales', 'AGENTS.md and local rules'], ['Siempre disponible', 'Always available']], tone: 'violet' },
      { id: 'skills', x: 38, y: 26, label: ['Skills', 'Skills'], detail: ['Conocimiento especializado que se carga cuando la tarea lo necesita.', 'Specialised knowledge loaded when the task needs it.'], bullets: [['Menos contexto inicial', 'Less initial context'], ['Capacidades reutilizables', 'Reusable capabilities']], tone: 'teal' },
      { id: 'agents', x: 62, y: 26, label: ['Agentes', 'Agents'], detail: ['Un agente reúne instrucciones, skills y un objetivo; puede seguir un workflow. No es una persona.', 'An agent combines instructions, skills and a goal; it may follow a workflow. It is not a person.'], bullets: [['Contexto y capacidades', 'Context and capabilities'], ['Objetivo y flujo', 'Goal and workflow']], tone: 'amber' },
      { id: 'commands', x: 86, y: 26, label: ['Comandos', 'Commands'], detail: ['Pasos repetibles que alguien dispara para refinar, implementar o revisar.', 'Repeatable steps someone triggers to refine, implement or review.'], bullets: [['Menos ritual manual', 'Less manual ritual'], ['Ejecución consistente', 'Consistent execution']], tone: 'pink' },
    ],
    edges: [[1, 0], [2, 0], [3, 0], [4, 0]],
  },
  'two-sources-of-truth': {
    name: ['Dos fuentes de verdad complementarias', 'Two complementary sources of truth'],
    caption: ['El qué y el cómo alimentan la entrega; no se sustituyen entre sí.', 'The what and the how inform delivery; neither replaces the other.'],
    nodes: [
      { id: 'product', x: 20, y: 28, label: ['WHAT · Producto', 'WHAT · Product'], detail: ['¿Qué queremos construir y para quién? Product Definition as Code (PDaC).', 'What do we build, and for whom? Product Definition as Code (PDaC).'], bullets: [['Definición aceptada y versionada', 'Accepted, versioned definition'], ['Cambios trazables y verificables', 'Traceable, verifiable changes']], accent: true, tone: 'teal' },
      { id: 'architecture', x: 20, y: 71, label: ['HOW · Arquitectura', 'HOW · Architecture'], detail: ['¿Cómo lo construimos? Documentación de arquitectura.', 'How do we build it? Architecture documentation.'], bullets: [['arc42: contexto y bloques', 'arc42: context and building blocks'], ['ADRs: decisiones y restricciones', 'ADRs: decisions and constraints']], accent: true, tone: 'violet' },
      { id: 'delivery', x: 78, y: 49, label: ['DELIVERY · Entrega', 'DELIVERY'], detail: ['Spec-Driven Development (SDD): de la intención al cambio entregable.', 'Spec-Driven Development (SDD): from intent to a deliverable change.'], bullets: [['Spec-Driven Delivery', 'Spec-Driven Delivery'], ['Specs, código y pruebas', 'Specs, code and tests']], tone: 'blue' },
    ],
    edges: [[0, 2], [1, 2]],
  },
  'product-decides': {
    name: ['Autoridad del producto y aprendizaje de la entrega', 'Product authority and delivery learning'],
    caption: ['La autoridad baja. La evidencia vuelve como propuesta.', 'Authority flows down. Evidence returns as a proposal.'],
    nodes: [
      { id: 'thinking', x: 14, y: 37, label: ['Product thinking', 'Product thinking'], detail: ['Investigación, evidencia y juicio de producto.', 'Research, evidence and product judgment.'] },
      { id: 'human', x: 39, y: 37, label: ['Aceptación humana', 'Human acceptance'], detail: ['Una persona acepta o rechaza el cambio de producto.', 'A person accepts or rejects the product change.'], accent: true },
      { id: 'definition', x: 64, y: 37, label: ['Definición aceptada', 'Accepted definition'], detail: ['Ficheros legibles, IDs estables y relaciones tipadas conservan la autoridad.', 'Readable files, stable IDs and typed links retain authority.'], accent: true },
      { id: 'delivery', x: 88, y: 37, label: ['Entrega', 'Delivery'], detail: ['Specs, arquitectura, backlog y agentes citan la definición.', 'Specs, architecture, backlog and agents cite the definition.'] },
      { id: 'evidence', x: 64, y: 76, label: ['Evidencia ↩', 'Evidence ↩'], detail: ['La entrega devuelve evidencia y Product Changes propuestos; no reescribe la autoridad.', 'Delivery returns evidence and proposed Product Changes; it does not rewrite authority.'] },
    ],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 1]],
  },
  'product-definition-model': {
    name: ['Modelo de definición de producto', 'Product definition model'],
    caption: ['Diez tipos de artefacto. Una definición conectada y verificable.', 'Ten artifact kinds. One connected, verifiable definition.'],
    nodes: [
      { id: 'actors', x: 10, y: 20, label: ['Actores · ACT', 'Actors · ACT'], detail: ['Personas y sistemas externos que participan en la experiencia; un usuario puede ser un actor.', 'People and external systems taking part in the experience; a user may be an actor.'], tone: 'violet' },
      { id: 'journeys', x: 30, y: 20, label: ['Journeys · JRN', 'Journeys · JRN'], detail: ['Experiencias completas que conectan objetivos, actores y casos de uso.', 'End-to-end experiences connecting goals, actors and use cases.'], tone: 'cyan' },
      { id: 'usecases', x: 50, y: 20, label: ['Casos de uso · UC', 'Use cases · UC'], detail: ['Cada caso describe un objetivo y se relaciona con reglas, dominio y requisitos.', 'Each use case describes a goal and links rules, domain and requirements.'], accent: true, tone: 'teal' },
      { id: 'rules', x: 70, y: 20, label: ['Reglas · BR', 'Rules · BR'], detail: ['Reglas de negocio que gobiernan el comportamiento del caso de uso; no son instrucciones técnicas.', 'Business rules governing use-case behaviour; they are not technical instructions.'], tone: 'amber' },
      { id: 'terms', x: 10, y: 50, label: ['Términos · TERM', 'Terms · TERM'], detail: ['Vocabulario compartido del dominio: cada término tiene significado y contexto.', 'Shared domain vocabulary: each term has meaning and context.'], tone: 'green' },
      { id: 'bounded', x: 30, y: 50, label: ['Contextos · BC', 'Contexts · BC'], detail: ['Bounded contexts delimitan dónde rige un modelo del dominio.', 'Bounded contexts define where a domain model applies.'], tone: 'green' },
      { id: 'functional', x: 50, y: 50, label: ['Funcionales · FR', 'Functional · FR'], detail: ['Obligaciones funcionales derivadas de los casos de uso.', 'Functional obligations derived from use cases.'], tone: 'orange' },
      { id: 'quality', x: 70, y: 50, label: ['Calidad · QR', 'Quality · QR'], detail: ['Atributos de calidad verificables para el producto.', 'Verifiable quality attributes for the product.'], tone: 'orange' },
      { id: 'constraints', x: 90, y: 50, label: ['Límites · CON', 'Constraints · CON'], detail: ['Restricciones que debe respetar la solución; no llevan scenario-ref.', 'Constraints the solution must respect; they do not carry scenario-ref.'], tone: 'orange' },
      { id: 'behaviour', x: 70, y: 80, label: ['Given / When / Then', 'Given / When / Then'], detail: ['SB-* estructura escenarios verificables referenciados por requisitos funcionales o de calidad.', 'SB-* structures verifiable scenarios referenced by functional or quality requirements.'], accent: true, tone: 'pink' },
    ],
    edges: [[0, 1], [1, 2], [2, 3], [2, 5], [2, 6], [2, 7], [2, 8], [4, 5], [6, 9], [7, 9]],
  },
  'from-proposal-to-accepted-product': {
    name: ['De propuesta a producto aceptado', 'From proposal to accepted product'],
    caption: ['Apply materializa. Merge acepta.', 'Apply materialises. Merge accepts.'],
    nodes: [
      { id: 'baseline', x: 12, y: 26, label: ['Baseline aceptada', 'Accepted baseline'], detail: ['La definición vigente del producto: el punto de partida con autoridad.', 'The current product definition: the authoritative starting point.'], tone: 'teal' },
      { id: 'proposal', x: 37, y: 26, label: ['Product Change', 'Product Change'], detail: ['La IA puede preparar una propuesta semántica; aún no cambia la definición aceptada.', 'AI can prepare a semantic proposal; it does not yet change the accepted definition.'], tone: 'violet', badge: ['Propuesta · AI-powered', 'Proposal · AI-powered'] },
      { id: 'validation', x: 63, y: 26, label: ['Validación', 'Validation'], detail: ['El overlay valida el estado propuesto y sus relaciones antes de materializarlo.', 'The overlay validates the proposed state and its relationships before materialisation.'], tone: 'teal' },
      { id: 'approval', x: 88, y: 26, label: ['Aprobación', 'Approval'], detail: ['Una persona revisa y autoriza la propuesta antes de ejecutar apply.', 'A person reviews and approves the proposal before apply runs.'], accent: true, tone: 'amber', human: true },
      { id: 'apply', x: 88, y: 70, label: ['Apply', 'Apply'], detail: ['Materializa el cambio en una rama candidata; todavía no crea una nueva baseline aceptada.', 'Materialises the change on a candidate branch; it does not yet create a new accepted baseline.'], tone: 'blue' },
      { id: 'review', x: 63, y: 70, label: ['PR · revisión', 'PR · review'], detail: ['El pull request reúne el diff, las pruebas y las evidencias para revisar el estado candidato.', 'The pull request brings together the diff, tests and evidence for review of the candidate state.'], tone: 'cyan', badge: ['Tests · evidencia', 'Tests · evidence'] },
      { id: 'acceptance', x: 37, y: 70, label: ['Merge acepta', 'Merge accepts'], detail: ['Una persona acepta el PR después de revisar el cambio y su evidencia.', 'A person accepts the PR after reviewing the change and its evidence.'], accent: true, tone: 'amber', human: true },
      { id: 'next-baseline', x: 12, y: 70, label: ['Nueva baseline', 'New baseline'], detail: ['El producto incorpora el cambio aceptado y queda listo para el siguiente ciclo.', 'The product incorporates the accepted change and is ready for the next cycle.'], tone: 'teal' },
    ],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0]],
  },
  'agentic-flow-end-to-end': {
    name: ['Ciclo de vida agéntico', 'Agentic lifecycle'],
    caption: ['Proponer, implementar y verificar son pasos distintos. La persona acepta el cambio y su evidencia.', 'Proposing, implementing and verifying are distinct steps. A person accepts the change and its evidence.'],
    nodes: [
      { id: 'backlog', x: 12, y: 29, label: ['Backlog', 'Backlog'], detail: ['Una necesidad concreta entra como trabajo pendiente.', 'A concrete need enters as work to be done.'], tone: 'violet' },
      { id: 'refine', x: 37, y: 29, label: ['Refine', 'Refine'], detail: ['Se aclara alcance, criterio de aceptación y fuentes de verdad.', 'Scope, acceptance criteria and sources of truth become clear.'], tone: 'cyan' },
      { id: 'propose', x: 62, y: 29, label: ['Propose', 'Propose'], detail: ['El plan se propone y una persona lo acepta antes de implementar.', 'A plan is proposed and a person accepts it before implementation.'], accent: true, tone: 'amber', human: true },
      { id: 'implement', x: 87, y: 29, label: ['Implement', 'Implement'], detail: ['Se produce el diff y se vincula con el criterio aceptado.', 'The diff is produced and linked to the accepted criterion.'], tone: 'blue' },
      { id: 'tests', x: 87, y: 72, label: ['Tests · CI', 'Tests · CI'], detail: ['Tests y comprobaciones automáticas generan resultados reproducibles.', 'Tests and automated checks produce reproducible results.'], tone: 'teal' },
      { id: 'review', x: 62, y: 72, label: ['Review · evidencia', 'Review · evidence'], detail: ['Una persona revisa diff, resultados y riesgos antes de aceptar.', 'A person reviews the diff, results and risks before acceptance.'], accent: true, tone: 'amber', human: true },
      { id: 'integrate', x: 37, y: 72, label: ['Integrate', 'Integrate'], detail: ['Solo el cambio aceptado se integra y queda listo para desplegar.', 'Only the accepted change is integrated and ready to deploy.'], tone: 'green' },
      { id: 'learn', x: 12, y: 72, label: ['Aprendizaje ↩', 'Learning ↩'], detail: ['Resultados y problemas vuelven al backlog como información nueva.', 'Results and issues return to the backlog as new information.'], tone: 'pink' },
    ],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0]],
  },
  'controlled-deployment': {
    name: ['Del candidato a producción', 'From candidate to production'],
    caption: ['El merge no es el final: cada entorno exige señales, una decisión y una salida segura.', 'Merge is not the end: each environment needs signals, a decision and a safe exit.'],
    nodes: [
      { id: 'artifact', x: 13, y: 45, label: ['Artefacto', 'Artifact'], detail: ['Construcción versionada y reproducible; no se recompila a escondidas entre entornos.', 'A versioned, reproducible build; no hidden rebuild between environments.'], tone: 'violet' },
      { id: 'development', x: 37, y: 45, label: ['Desarrollo', 'Development'], detail: ['Despliegue y comprobaciones tempranas de configuración e integración.', 'Deploy and check configuration and integration early.'], tone: 'blue' },
      { id: 'staging', x: 62, y: 45, label: ['Preproducción', 'Staging'], detail: ['Ensayo de la versión candidata en condiciones cercanas a producción; se evalúa la evidencia.', 'Rehearse the candidate near production conditions; assess the evidence.'], tone: 'cyan' },
      { id: 'production', x: 87, y: 45, label: ['Producción', 'Production'], detail: ['Una persona autoriza cuando procede; se observa el resultado y existe plan de reversión.', 'A person authorises when appropriate; observe the result and have a rollback plan.'], tone: 'green', human: true },
    ],
    edges: [[0, 1], [1, 2], [2, 3]],
    edgeLabels: [{ x: 50, y: 35, label: ['gates', 'gates'] }, { x: 75, y: 35, label: ['decisión', 'decision'] }],
  },
  'operate-learn-decide-again': {
    name: ['Producción devuelve aprendizaje', 'Production returns learning'],
    caption: ['Mantener no es parchear sin rumbo: observar, decidir, cambiar y volver a validar.', 'Maintenance is not aimless patching: observe, decide, change and validate again.'],
    nodes: [
      { id: 'signals', x: 18, y: 38, label: ['Señales', 'Signals'], detail: ['Incidentes, uso real, rendimiento, seguridad y feedback muestran qué está pasando.', 'Incidents, real usage, performance, security and feedback show what is happening.'], tone: 'cyan' },
      { id: 'triage', x: 43, y: 38, label: ['Triage humano', 'Human triage'], detail: ['Una persona distingue un fallo, deuda técnica y una necesidad nueva; decide prioridad.', 'A person distinguishes failure, technical debt and a new need; decides priority.'], tone: 'amber', human: true },
      { id: 'change', x: 70, y: 38, label: ['Cambio propuesto', 'Proposed change'], detail: ['La propuesta vuelve a intención y arquitectura si altera producto o sistema.', 'The proposal returns to intent and architecture if it changes the product or system.'], tone: 'violet' },
      { id: 'verify', x: 70, y: 73, label: ['Verificar', 'Verify'], detail: ['Tests, review y evidencias confirman la corrección antes de volver a desplegar.', 'Tests, review and evidence confirm the correction before redeployment.'], tone: 'teal' },
    ],
    edges: [[0, 1], [1, 2], [2, 3], [3, 0]],
  },
  'what-still-depends-on-us': {
    name: ['Lo que sigue siendo responsabilidad humana', 'What remains a human responsibility'],
    caption: ['La IA acelera. Nosotros respondemos por el resultado.', 'AI accelerates. We own the outcome.'],
    nodes: [
      { id: 'decision', x: 50, y: 49, label: ['Juicio humano', 'Human judgment'], detail: ['El agente propone; una persona decide y responde por lo entregado.', 'The agent proposes; a person decides and owns what ships.'], accent: true },
      { id: 'intent', x: 50, y: 14, label: ['Intención', 'Intent'], detail: ['Decidir qué producto queremos y para quién.', 'Decide what product we want and for whom.'], tone: 'teal' },
      { id: 'architecture', x: 78, y: 25, label: ['Arquitectura', 'Architecture'], detail: ['Elegir límites, responsabilidades y compromisos técnicos.', 'Choose boundaries, responsibilities and technical trade-offs.'], tone: 'violet' },
      { id: 'guardrails', x: 85, y: 53, label: ['Guardarraíles', 'Guardrails'], detail: ['Decidir qué reglas guían y cuáles bloquean.', 'Decide which rules guide and which block.'], tone: 'pink' },
      { id: 'code', x: 68, y: 79, label: ['Código', 'Code'], detail: ['Revisar si la implementación expresa la decisión aceptada.', 'Review whether the implementation expresses the accepted decision.'], tone: 'green' },
      { id: 'evidence', x: 32, y: 79, label: ['Evidencia', 'Evidence'], detail: ['Juzgar si tests, review y resultados prueban lo suficiente.', 'Judge whether tests, review and results prove enough.'], tone: 'blue' },
      { id: 'delivery', x: 15, y: 53, label: ['Entrega', 'Delivery'], detail: ['Autorizar el despliegue cuando proceda y responder de su impacto.', 'Authorise deployment when appropriate and own its impact.'], tone: 'orange' },
      { id: 'maintenance', x: 22, y: 25, label: ['Mantenimiento', 'Maintenance'], detail: ['Priorizar señales de producción y decidir el siguiente cambio.', 'Prioritise production signals and decide the next change.'], tone: 'cyan' },
    ],
    edges: [[1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0]],
  },
}

export default function Diagram({ id, language, original }: { id: string; language: 'es' | 'en'; original?: string }) {
  const [active, setActive] = useState<string | null>(null)
  const spec = diagrams[id]
  const locale = language === 'en' ? 1 : 0
  return <section className="diagram-stage" aria-label={spec.name[locale]}>
    <svg className="diagram-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <defs><marker id={`arrow-${id}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6" fill="#4da3ff" /></marker></defs>
      {spec.edges.map(([from, to]) => {
        const a = spec.nodes[from], b = spec.nodes[to]
        const fraction = Math.min(8 / Math.hypot(a.x - b.x, a.y - b.y), .35)
        return <line key={`${from}-${to}`} x1={a.x} y1={a.y} x2={b.x + (a.x - b.x) * fraction} y2={b.y + (a.y - b.y) * fraction} markerEnd={`url(#arrow-${id})`} />
      })}
    </svg>
    {spec.edgeLabels?.map(({ x, y, label }) => <span className="edge-label" key={`${x}-${y}`} style={{ left: `${x}%`, top: `${y}%` }} aria-hidden="true">{label[locale]}</span>)}
    {spec.nodes.map(node => <button key={node.id} className={`diagram-node${node.accent ? ' diagram-node-accent' : ''}`} data-tone={node.tone} type="button" style={{ left: `${node.x}%`, top: `${node.y}%` }} aria-label={`${node.label[locale]}. ${node.detail[locale]}`} aria-pressed={active === node.id} onMouseEnter={() => setActive(node.id)} onMouseLeave={event => { if (document.activeElement !== event.currentTarget) setActive(null) }} onFocus={() => setActive(node.id)} onBlur={() => setActive(null)} onClick={() => setActive(active === node.id ? null : node.id)}>{node.human && <svg className="human-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7" r="3" /><path d="M5 21v-3a7 7 0 0 1 14 0v3" /></svg>}{node.label[locale]}{node.badge && <small className="diagram-badge">{node.badge[locale]}</small>}{active === node.id && <span className={`node-popover${id === 'two-sources-of-truth' ? node.id === 'delivery' ? ' node-popover-side-left' : ' node-popover-side' : `${node.y > 60 ? ' node-popover-above' : ''}${node.x < 20 ? ' node-popover-left' : ''}${node.x > 80 ? ' node-popover-right' : ''}`}`} role="tooltip">{node.detail[locale]}{node.bullets && <span className="popover-bullets">• {node.bullets[0][locale]}<br />• {node.bullets[1][locale]}</span>}</span>}</button>)}
    <p className="diagram-caption">{spec.caption[locale]}</p>
    {original && <p className="diagram-hint"><a href={original} target="_blank" rel="noreferrer">{language === 'en' ? 'Original diagram ↗' : 'Diagrama original ↗'}</a></p>}
  </section>
}
