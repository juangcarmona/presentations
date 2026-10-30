import { useState } from 'react'

type Localized = [es: string, en: string]
type Node = { id: string; x: number; y: number; label: Localized; detail: Localized; bullets?: [Localized, Localized]; accent?: boolean; tone?: string; human?: boolean; badge?: Localized }
type DiagramSpec = { name: Localized; caption: Localized; nodes: Node[]; edges: [number, number][]; edgeLabels?: { x: number; y: number; label: Localized }[] }

const diagrams: Record<string, DiagramSpec> = {
  '03-repo': {
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
  '08-dimensiones': {
    name: ['Dos fuentes de verdad complementarias', 'Two complementary sources of truth'],
    caption: ['Producto y arquitectura aportan dos decisiones distintas a la entrega.', 'Product and architecture bring two distinct decisions into delivery.'],
    nodes: [
      { id: 'product', x: 20, y: 28, label: ['WHAT · Producto', 'WHAT · Product'], detail: ['¿Qué queremos construir? PDaC conserva la definición aceptada; ProductShape permite explorarla y verificarla.', 'What do we want to build? PDaC preserves the accepted definition; ProductShape helps explore and verify it.'], bullets: [['Reglas y casos de uso', 'Rules and use cases'], ['Journeys y comportamiento', 'Journeys and behaviour']], accent: true, tone: 'teal' },
      { id: 'architecture', x: 20, y: 71, label: ['HOW · Arquitectura', 'HOW · Architecture'], detail: ['¿Cómo lo construiremos? arc42 organiza la documentación; ArcShape ayuda a verla y navegarla.', 'How will we build it? arc42 structures documentation; ArcShape helps view and navigate it.'], bullets: [['Contexto y bloques', 'Context and building blocks'], ['ADRs y calidad', 'ADRs and quality']], accent: true, tone: 'violet' },
      { id: 'delivery', x: 78, y: 49, label: ['DELIVERY · Entrega', 'DELIVERY'], detail: ['El desarrollo cita la definición de producto y respeta las decisiones de arquitectura.', 'Delivery cites the product definition and follows architecture decisions.'], bullets: [['Specs y código', 'Specs and code'], ['Tests y evidencia', 'Tests and evidence']], tone: 'blue' },
    ],
    edges: [[0, 2], [1, 2]],
  },
  '10-autoridad': {
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
  '11-modelo': {
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
  '15-workflow': {
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
  '17-flujo-agentico': {
    name: ['Ciclo de vida agéntico', 'Agentic lifecycle'],
    caption: ['Cada fase deja evidencia y un punto de decisión.', 'Every stage leaves evidence and a decision point.'],
    nodes: [
      { id: 'backlog', x: 11, y: 31, label: ['Backlog', 'Backlog'], detail: ['El trabajo entra como necesidad, no como código.', 'Work enters as a need, not as code.'] },
      { id: 'refine', x: 30, y: 31, label: ['Refine', 'Refine'], detail: ['Un agente verifica que la tarea esté lista.', 'An agent verifies that the task is ready.'] },
      { id: 'propose', x: 49, y: 31, label: ['Propose', 'Propose'], detail: ['Una persona verifica y acepta el plan.', 'A person verifies and accepts the plan.'], accent: true },
      { id: 'implement', x: 68, y: 31, label: ['Implement', 'Implement'], detail: ['CI y una persona verifican la implementación.', 'CI and a person verify the implementation.'], accent: true },
      { id: 'integrate', x: 88, y: 31, label: ['Integrate', 'Integrate'], detail: ['El cambio aprobado se integra.', 'The approved change is integrated.'] },
      { id: 'review', x: 49, y: 75, label: ['Review ↩', 'Review ↩'], detail: ['La evidencia vuelve al backlog como aprendizaje.', 'Evidence returns to the backlog as learning.'] },
    ],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]],
  },
  '21-vista-global': {
    name: ['La ingeniería alrededor de una decisión humana', 'Engineering around human judgment'],
    caption: ['La IA acelera el trabajo. La decisión sigue siendo nuestra.', 'AI accelerates the work. The decision remains ours.'],
    nodes: [
      { id: 'human', x: 50, y: 49, label: ['Una persona decide', 'A person decides'], detail: ['Producto, arquitectura, guardarraíles y evidencia requieren juicio humano.', 'Product, architecture, guardrails and evidence require human judgment.'], accent: true },
      { id: 'code', x: 15, y: 22, label: ['Código', 'Code'], detail: ['Convenciones, skills, agentes y comandos preparan el repositorio.', 'Conventions, skills, agents and commands prepare the repository.'] },
      { id: 'product', x: 50, y: 15, label: ['Producto', 'Product'], detail: ['La definición aceptada conserva la autoridad sobre el qué.', 'The accepted definition retains authority over what to build.'] },
      { id: 'architecture', x: 85, y: 22, label: ['Arquitectura', 'Architecture'], detail: ['arc42 y ADRs explican el cómo y sus límites.', 'arc42 and ADRs explain how and its boundaries.'] },
      { id: 'delivery', x: 85, y: 75, label: ['Desarrollo', 'Delivery'], detail: ['El flujo agéntico produce un PR revisable.', 'The agentic flow produces a reviewable PR.'] },
      { id: 'validation', x: 50, y: 82, label: ['Validación', 'Validation'], detail: ['Escenarios Given / When / Then se convierten en tests.', 'Given / When / Then scenarios become tests.'] },
      { id: 'evidence', x: 15, y: 75, label: ['Evidencia', 'Evidence'], detail: ['Tests y citas verificadas sostienen la aceptación.', 'Tests and verified citations support acceptance.'] },
    ],
    edges: [[1, 0], [2, 0], [3, 0], [0, 4], [4, 5], [5, 6], [6, 0]],
    edgeLabels: [
      { x: 28, y: 37, label: ['contexto', 'context'] },
      { x: 50, y: 31, label: ['define', 'defines'] },
      { x: 71, y: 37, label: ['limita', 'constrains'] },
      { x: 71, y: 62, label: ['autoriza', 'approves'] },
      { x: 67, y: 81, label: ['prueba', 'tests'] },
      { x: 32, y: 81, label: ['devuelve', 'returns'] },
      { x: 28, y: 62, label: ['informa', 'informs'] },
    ],
  },
  '22-nosotros': {
    name: ['Lo que sigue siendo responsabilidad humana', 'What remains a human responsibility'],
    caption: ['La IA acelera. Nosotros respondemos por el resultado.', 'AI accelerates. We own the outcome.'],
    nodes: [
      { id: 'decision', x: 50, y: 49, label: ['Juicio humano', 'Human judgment'], detail: ['El agente propone; una persona decide y responde por lo entregado.', 'The agent proposes; a person decides and owns what ships.'], accent: true },
      { id: 'product', x: 20, y: 24, label: ['Producto', 'Product'], detail: ['Decidir qué producto queremos.', 'Decide which product we want.'] },
      { id: 'definition', x: 50, y: 16, label: ['Definición', 'Definition'], detail: ['Aceptar o rechazar cada cambio de definición.', 'Accept or reject every definition change.'] },
      { id: 'guardrails', x: 80, y: 24, label: ['Guardarraíles', 'Guardrails'], detail: ['Elegir qué reglas merecen ser duras.', 'Choose which rules deserve hard enforcement.'] },
      { id: 'evidence', x: 25, y: 78, label: ['Evidencia', 'Evidence'], detail: ['Juzgar las pruebas, no solo mirarlas.', 'Judge the proof, not just glance at it.'] },
      { id: 'responsibility', x: 75, y: 78, label: ['Responsabilidad', 'Responsibility'], detail: ['Responder de lo que se entrega.', 'Own what we ship.'] },
    ],
    edges: [[1, 0], [2, 0], [3, 0], [4, 0], [5, 0]],
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
    {spec.nodes.map(node => <button key={node.id} className={`diagram-node${node.accent ? ' diagram-node-accent' : ''}`} data-tone={node.tone} type="button" style={{ left: `${node.x}%`, top: `${node.y}%` }} aria-label={`${node.label[locale]}. ${node.detail[locale]}`} aria-pressed={active === node.id} onMouseEnter={() => setActive(node.id)} onMouseLeave={event => { if (document.activeElement !== event.currentTarget) setActive(null) }} onFocus={() => setActive(node.id)} onBlur={() => setActive(null)} onClick={() => setActive(active === node.id ? null : node.id)}>{node.human && <svg className="human-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7" r="3" /><path d="M5 21v-3a7 7 0 0 1 14 0v3" /></svg>}{node.label[locale]}{node.badge && <small className="diagram-badge">{node.badge[locale]}</small>}{active === node.id && <span className={`node-popover${id === '08-dimensiones' ? node.id === 'delivery' ? ' node-popover-side-left' : ' node-popover-side' : `${node.y > 60 ? ' node-popover-above' : ''}${node.x < 20 ? ' node-popover-left' : ''}${node.x > 80 ? ' node-popover-right' : ''}`}`} role="tooltip">{node.detail[locale]}{node.bullets && <span className="popover-bullets">• {node.bullets[0][locale]}<br />• {node.bullets[1][locale]}</span>}</span>}</button>)}
    <p className="diagram-caption">{spec.caption[locale]}</p>
    {original && <p className="diagram-hint"><a href={original} target="_blank" rel="noreferrer">{language === 'en' ? 'Original diagram ↗' : 'Diagrama original ↗'}</a></p>}
  </section>
}
