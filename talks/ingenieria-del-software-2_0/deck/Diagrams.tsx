import { useState } from 'react'

type Localized = [es: string, en: string]
type Node = { id: string; x: number; y: number; label: Localized; detail: Localized; accent?: boolean }
type DiagramSpec = { name: Localized; caption: Localized; nodes: Node[]; edges: [number, number][] }

const diagrams: Record<string, DiagramSpec> = {
  '03-repo': {
    name: ['Un repositorio preparado para trabajar con IA', 'A repository ready to work with AI'],
    caption: ['El contexto vive en el repo. Cada capacidad se activa cuando toca.', 'Context lives in the repo. Each capability activates when needed.'],
    nodes: [
      { id: 'repo', x: 50, y: 70, label: ['REPO', 'REPO'], detail: ['Código y conocimiento versionados en el mismo sistema.', 'Versioned code and knowledge in one system.'], accent: true },
      { id: 'instructions', x: 14, y: 26, label: ['Instrucciones', 'Instructions'], detail: ['AGENTS.md es un mapa breve de contexto que siempre está disponible.', 'AGENTS.md is a short context map that is always available.'] },
      { id: 'skills', x: 38, y: 26, label: ['Skills', 'Skills'], detail: ['Capacidades cargadas solo cuando la tarea las necesita.', 'Capabilities loaded only when the task needs them.'] },
      { id: 'agents', x: 62, y: 26, label: ['Agentes', 'Agents'], detail: ['Trabajo delegado con su propio contexto, aislado del principal.', 'Delegated work with its own context, isolated from the main one.'] },
      { id: 'commands', x: 86, y: 26, label: ['Comandos', 'Commands'], detail: ['Flujos repetibles: refinar, implementar y revisar.', 'Repeatable flows: refine, implement and review.'] },
    ],
    edges: [[1, 0], [2, 0], [3, 0], [4, 0]],
  },
  '04-guardarrailes': {
    name: ['Guardarraíles blandos y duros', 'Soft and hard guardrails'],
    caption: ['Un consejo se puede ignorar. Un bloqueo detiene la entrega.', 'Advice can be ignored. A gate stops delivery.'],
    nodes: [
      { id: 'intent', x: 10, y: 49, label: ['Intención', 'Intent'], detail: ['Una regla o decisión que debe guiar el trabajo.', 'A rule or decision meant to guide the work.'] },
      { id: 'soft', x: 39, y: 25, label: ['Guía', 'Guidance'], detail: ['AGENTS.md, skills, ADRs y checklists orientan al agente; no bloquean.', 'AGENTS.md, skills, ADRs and checklists guide the agent; they do not block.'] },
      { id: 'hard', x: 39, y: 73, label: ['Guardarraíl', 'Gate'], detail: ['Analizadores, tests, hooks y CI obligatoria verifican la regla.', 'Analyzers, tests, hooks and required CI enforce the rule.'], accent: true },
      { id: 'choice', x: 83, y: 25, label: ['Puede seguir', 'May proceed'], detail: ['La recomendación puede incumplirse; la revisión humana sigue siendo necesaria.', 'The recommendation can be ignored; human review is still needed.'] },
      { id: 'stop', x: 83, y: 73, label: ['Se detiene', 'Stops'], detail: ['Una violación impide avanzar hasta que se resuelva.', 'A violation blocks progress until it is resolved.'], accent: true },
    ],
    edges: [[0, 1], [0, 2], [1, 3], [2, 4]],
  },
  '08-dimensiones': {
    name: ['Dos fuentes de verdad complementarias', 'Two complementary sources of truth'],
    caption: ['El producto define qué. La arquitectura explica cómo.', 'Product defines what. Architecture explains how.'],
    nodes: [
      { id: 'product', x: 24, y: 24, label: ['Producto · QUÉ', 'Product · WHAT'], detail: ['docs/product/: reglas, journeys, casos de uso y comportamiento.', 'docs/product/: rules, journeys, use cases and behaviour.'], accent: true },
      { id: 'architecture', x: 76, y: 24, label: ['Arquitectura · CÓMO', 'Architecture · HOW'], detail: ['docs/architecture/: contexto, bloques, ADRs y requisitos de calidad.', 'docs/architecture/: context, building blocks, ADRs and quality requirements.'], accent: true },
      { id: 'pdac', x: 24, y: 70, label: ['PDaC / ProductShape', 'PDaC / ProductShape'], detail: ['La definición aceptada conserva la intención de producto.', 'The accepted definition retains product intent.'] },
      { id: 'arc42', x: 76, y: 70, label: ['arc42 / ADRs', 'arc42 / ADRs'], detail: ['Decisiones y vistas describen los límites técnicos.', 'Decisions and views describe technical boundaries.'] },
      { id: 'delivery', x: 50, y: 49, label: ['Entrega', 'Delivery'], detail: ['La implementación debe satisfacer ambas fuentes de verdad.', 'Implementation must satisfy both sources of truth.'] },
    ],
    edges: [[0, 2], [1, 3], [0, 4], [1, 4]],
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
    caption: ['Una definición conectada hace visible el impacto de cada cambio.', 'A connected definition makes the impact of every change visible.'],
    nodes: [
      { id: 'actors', x: 12, y: 34, label: ['Actores', 'Actors'], detail: ['ACT-* participa en un journey.', 'ACT-* participates in a journey.'] },
      { id: 'journeys', x: 32, y: 34, label: ['Journeys', 'Journeys'], detail: ['JRN-* describe una experiencia de principio a fin.', 'JRN-* describes an end-to-end experience.'] },
      { id: 'usecases', x: 52, y: 34, label: ['Casos de uso', 'Use cases'], detail: ['UC-* materializa el journey y enlaza reglas y dominio.', 'UC-* realises the journey and links rules and domain.'], accent: true },
      { id: 'rules', x: 73, y: 15, label: ['Reglas', 'Rules'], detail: ['BR-* gobierna el comportamiento del producto.', 'BR-* governs product behaviour.'] },
      { id: 'domain', x: 73, y: 53, label: ['Dominio', 'Domain'], detail: ['TERM-* y BC-* dan vocabulario y límites.', 'TERM-* and BC-* provide vocabulary and boundaries.'] },
      { id: 'requirements', x: 92, y: 34, label: ['Requisitos', 'Requirements'], detail: ['FR-*, QR-* y CON-* expresan obligaciones.', 'FR-*, QR-* express obligations.'] },
      { id: 'behaviour', x: 73, y: 80, label: ['Given / When / Then', 'Given / When / Then'], detail: ['SB-* convierte el requisito en escenarios verificables.', 'SB-* turns a requirement into verifiable scenarios.'], accent: true },
    ],
    edges: [[0, 1], [1, 2], [2, 3], [2, 4], [2, 5], [5, 6]],
  },
  '14-citas': {
    name: ['Citas y deriva', 'Citations and drift'],
    caption: ['Detectar deriva no es reescribir: el consumidor decide.', 'Detecting drift is not rewriting: the consumer decides.'],
    nodes: [
      { id: 'intent', x: 13, y: 29, label: ['Intención', 'Intent'], detail: ['UC-CHECKOUT-001 es el artefacto de producto aceptado.', 'UC-CHECKOUT-001 is the accepted product artifact.'], accent: true },
      { id: 'spec', x: 38, y: 29, label: ['Spec citada', 'Cited spec'], detail: ['La especificación cita la versión aceptada de la regla.', 'The specification cites the accepted version of the rule.'] },
      { id: 'code', x: 63, y: 29, label: ['Código', 'Code'], detail: ['La implementación satisface la especificación revisada.', 'Implementation satisfies the reviewed specification.'] },
      { id: 'evidence', x: 88, y: 29, label: ['Evidencia', 'Evidence'], detail: ['Tests y entrega aportan pruebas verificables.', 'Tests and delivery produce verifiable proof.'] },
      { id: 'current', x: 13, y: 75, label: ['current', 'current'], detail: ['La cita coincide con el artefacto aceptado.', 'The citation matches the accepted artifact.'] },
      { id: 'stale', x: 38, y: 75, label: ['stale', 'stale'], detail: ['Cambió el artefacto citado: la spec necesita revisión humana.', 'The cited artifact changed: the spec needs human review.'], accent: true },
      { id: 'unresolved', x: 63, y: 75, label: ['unresolved', 'unresolved'], detail: ['No se puede resolver la referencia.', 'The reference cannot be resolved.'] },
      { id: 'tampered', x: 88, y: 75, label: ['tampered', 'tampered'], detail: ['El bloque embebido no coincide con el texto canónico.', 'The embedded block differs from canonical text.'] },
    ],
    edges: [[0, 1], [1, 2], [2, 3], [0, 4], [0, 5], [0, 6], [0, 7]],
  },
  '15-workflow': {
    name: ['De cambio propuesto a nueva baseline', 'From proposed change to new baseline'],
    caption: ['Apply materializa. Merge acepta.', 'Apply materialises. Merge accepts.'],
    nodes: [
      { id: 'baseline', x: 11, y: 27, label: ['Baseline', 'Baseline'], detail: ['Definición de producto ya aceptada.', 'Already accepted product definition.'] },
      { id: 'change', x: 33, y: 27, label: ['Product Change', 'Product Change'], detail: ['Delta semántico propuesto, todavía sin autoridad.', 'Proposed semantic delta, not yet authoritative.'] },
      { id: 'validate', x: 55, y: 27, label: ['Validar', 'Validate'], detail: ['El overlay comprueba la propuesta antes de aplicarla.', 'The overlay checks the proposal before application.'] },
      { id: 'approval', x: 78, y: 27, label: ['Aprobación humana', 'Human approval'], detail: ['Una persona autoriza materializar el cambio.', 'A person authorises materialising the change.'], accent: true },
      { id: 'apply', x: 78, y: 73, label: ['Apply', 'Apply'], detail: ['Apply materializa un estado candidato en una rama.', 'Apply materialises a candidate state on a branch.'] },
      { id: 'pr', x: 55, y: 73, label: ['Pull request', 'Pull request'], detail: ['Revisión Git del estado candidato y su evidencia.', 'Git review of the candidate state and its evidence.'] },
      { id: 'accept', x: 33, y: 73, label: ['Merge acepta', 'Merge accepts'], detail: ['La aceptación humana del PR crea la nueva baseline.', 'Human acceptance of the PR creates the new baseline.'], accent: true },
    ],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0]],
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
  const selected = spec.nodes.find(node => node.id === active)
  return <section className="diagram-stage" aria-label={spec.name[locale]}>
    <svg className="diagram-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <defs><marker id={`arrow-${id}`} markerWidth="4" markerHeight="4" refX="3" refY="2" orient="auto"><path d="M0 0 L4 2 L0 4" fill="#366bff" /></marker></defs>
      {spec.edges.map(([from, to]) => <line key={`${from}-${to}`} x1={spec.nodes[from].x} y1={spec.nodes[from].y} x2={spec.nodes[to].x} y2={spec.nodes[to].y} markerEnd={`url(#arrow-${id})`} />)}
    </svg>
    {spec.nodes.map(node => <button key={node.id} className={`diagram-node${node.accent ? ' diagram-node-accent' : ''}`} type="button" style={{ left: `${node.x}%`, top: `${node.y}%` }} aria-label={`${node.label[locale]}. ${node.detail[locale]}`} aria-pressed={active === node.id} onMouseEnter={() => setActive(node.id)} onMouseLeave={event => { if (document.activeElement !== event.currentTarget) setActive(null) }} onFocus={() => setActive(node.id)} onBlur={() => setActive(null)} onClick={() => setActive(node.id)}>{node.label[locale]}</button>)}
    <div className={`diagram-detail${selected ? ' diagram-detail-active' : ''}`} role="status" aria-live="polite">{selected ? <><strong>{selected.label[locale]}</strong><span>{selected.detail[locale]}</span></> : <span>{spec.caption[locale]}</span>}</div>
    <p className="diagram-hint">{language === 'en' ? 'Hover, focus or tap a node' : 'Pasa el cursor, enfoca o toca un nodo'}{original && <> · <a href={original} target="_blank" rel="noreferrer">{language === 'en' ? 'Original diagram ↗' : 'Diagrama original ↗'}</a></>}</p>
  </section>
}
