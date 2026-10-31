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
  'agentic-flow-end-to-end': {
    name: ['Ciclo de vida agéntico', 'Agentic lifecycle'],
    caption: ['Apply materializa; una persona acepta el cambio en el merge. Producción devuelve aprendizaje al backlog.', 'Apply materialises; a person accepts the change at merge. Production feeds learning back into the backlog.'],
    nodes: [
      { id: 'backlog', x: 10, y: 29, label: ['Backlog', 'Backlog'], detail: ['Una necesidad o señal de producción entra como trabajo pendiente.', 'A need or production signal enters as work to be done.'], tone: 'violet' },
      { id: 'refine', x: 30, y: 29, label: ['Refine', 'Refine'], detail: ['Se aclaran alcance, criterio de aceptación y fuentes de verdad.', 'Scope, acceptance criteria and sources of truth become clear.'], tone: 'cyan' },
      { id: 'propose', x: 50, y: 29, label: ['Propose', 'Propose'], detail: ['Se propone un plan; una persona lo aprueba antes de implementar. Aprobar el plan no equivale a aceptar el resultado.', 'A plan is proposed; a person approves it before implementation. Plan approval is not acceptance of the result.'], accent: true, tone: 'amber', human: true },
      { id: 'implement', x: 70, y: 29, label: ['Implement', 'Implement'], detail: ['Se produce el diff y se vincula con el criterio aceptado.', 'The diff is produced and linked to the accepted criterion.'], tone: 'green' },
      { id: 'tests', x: 90, y: 29, label: ['Tests · CI', 'Tests · CI'], detail: ['Tests y comprobaciones automáticas generan evidencia reproducible.', 'Tests and automated checks produce reproducible evidence.'], tone: 'teal' },
      { id: 'review', x: 88, y: 72, label: ['Review', 'Review'], detail: ['Una persona revisa diff, evidencias y riesgos antes de aceptar el cambio.', 'A person reviews the diff, evidence and risks before accepting the change.'], accent: true, tone: 'amber', human: true },
      { id: 'integrate', x: 63, y: 72, label: ['Integrate · merge', 'Integrate · merge'], detail: ['Merge acepta el cambio revisado. En PDaC, apply solo materializa una propuesta: la baseline de producto avanza al aceptar el PR.', 'Merge accepts the reviewed change. In PDaC, apply only materialises a proposal: the product baseline advances when the PR is accepted.'], tone: 'blue' },
      { id: 'deploy', x: 38, y: 72, label: ['Desplegar · operar', 'Deploy · operate'], detail: ['El cambio aceptado pasa por entornos con gates, observación y plan de reversión.', 'The accepted change moves through environments with gates, observation and a rollback plan.'], tone: 'blue' },
      { id: 'learn', x: 13, y: 72, label: ['Aprender ↩', 'Learn ↩'], detail: ['Las señales reales vuelven al backlog y, si hace falta, a intención o arquitectura.', 'Real-world signals return to the backlog and, if needed, to intent or architecture.'], tone: 'orange' },
    ],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 0]],
  },
  'controlled-deployment': {
    name: ['Del candidato a producción', 'From candidate to production'],
    caption: ['El mismo artefacto avanza por gates. Producción exige autorización, observación y reversión posible.', 'The same artifact passes through gates. Production requires authorisation, observation and a rollback path.'],
    nodes: [
      { id: 'artifact', x: 13, y: 45, label: ['Artefacto', 'Artifact'], detail: ['Construcción versionada y reproducible; no se recompila entre entornos.', 'A versioned, reproducible build; no rebuild between environments.'], tone: 'violet', badge: ['Mismo artefacto', 'Same artifact'] },
      { id: 'development', x: 37, y: 45, label: ['Desarrollo', 'Development'], detail: ['Despliegue y comprobaciones tempranas de configuración e integración.', 'Deploy and check configuration and integration early.'], tone: 'blue', badge: ['Smoke tests', 'Smoke tests'] },
      { id: 'staging', x: 62, y: 45, label: ['Preproducción', 'Staging'], detail: ['Ensayo de la versión candidata en condiciones cercanas a producción; se evalúa la evidencia.', 'Rehearse the candidate near production conditions; assess the evidence.'], tone: 'cyan', badge: ['Evidencia', 'Evidence'] },
      { id: 'production', x: 87, y: 45, label: ['Producción', 'Production'], detail: ['Una persona autoriza cuando procede; se observa el resultado y existe plan de reversión.', 'A person authorises when appropriate; observe the result and have a rollback plan.'], tone: 'green', human: true, badge: ['Rollback listo', 'Rollback ready'] },
    ],
    edges: [[0, 1], [1, 2], [2, 3]],
    edgeLabels: [{ x: 25, y: 35, label: ['promover', 'promote'] }, { x: 50, y: 35, label: ['gate', 'gate'] }, { x: 75, y: 35, label: ['autorizar', 'authorise'] }],
  },
  'operate-learn-decide-again': {
    name: ['Producción devuelve aprendizaje', 'Production returns learning'],
    caption: ['Las señales no dictan el backlog: una persona decide qué cambia y dónde vuelve a empezar el ciclo.', 'Signals do not dictate the backlog: a person decides what changes and where the cycle starts again.'],
    nodes: [
      { id: 'signals', x: 18, y: 38, label: ['Señales', 'Signals'], detail: ['Incidentes, uso real, rendimiento, seguridad y feedback muestran qué está pasando.', 'Incidents, real usage, performance, security and feedback show what is happening.'], tone: 'orange', badge: ['Uso · fallos · feedback', 'Usage · incidents · feedback'] },
      { id: 'triage', x: 43, y: 38, label: ['Triage humano', 'Human triage'], detail: ['Una persona distingue un fallo, deuda técnica y una necesidad nueva; decide prioridad.', 'A person distinguishes failure, technical debt and a new need; decides priority.'], tone: 'amber', human: true },
      { id: 'decision', x: 70, y: 38, label: ['Decisión', 'Decision'], detail: ['Se decide si corregir un fallo, abordar deuda técnica o proponer un Product Change.', 'Decide whether to fix a defect, address technical debt or propose a Product Change.'], tone: 'violet', badge: ['Fallo · deuda · producto', 'Defect · debt · product'] },
      { id: 'next', x: 70, y: 73, label: ['Backlog / Intención', 'Backlog / Intent'], detail: ['La decisión entra en el siguiente ciclo; vuelve a definición de producto o arquitectura si cambia sus fuentes de verdad.', 'The decision enters the next cycle; return to product definition or architecture if it changes their sources of truth.'], tone: 'teal' },
    ],
    edges: [[0, 1], [1, 2], [2, 3], [3, 0]],
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
