import { useState } from 'react'
import openspec from './openspec-icon.png'
import specKit from './spec-kit-logo.webp'
import kiro from './kiro-logo.png'

export const sddImages = [openspec, specKit, kiro]

type Language = 'es' | 'en'

export function JourneyMap({ language }: { language: Language }) {
  const [active, setActive] = useState<number | null>(null)
  const en = language === 'en'
  const stages = en ? [
    ['Code', 'A repository that tells the agent where truth lives.'],
    ['Guardrails', 'Guidance and checks shape what the agent can do.'],
    ['Intent', 'Product definition says what should exist.'],
    ['Architecture', 'Technical decisions say how it fits together.'],
    ['Delivery', 'Specs and agents turn decisions into software.'],
    ['Evidence', 'Tests and review tell us whether it works.'],
  ] : [
    ['Código', 'Un repositorio que muestra dónde vive la verdad.'],
    ['Guardarraíles', 'Guías y controles acotan lo que puede hacer la IA.'],
    ['Intención', 'La definición de producto dice qué construir.'],
    ['Arquitectura', 'Las decisiones técnicas explican cómo encaja.'],
    ['Entrega', 'Specs y agentes convierten decisiones en software.'],
    ['Evidencia', 'Tests y revisión indican si funciona.'],
  ]
  const positions = [[13, 26], [35, 12], [77, 24], [84, 72], [50, 95], [15, 73]]
  return <section className="journey-map" aria-label={en ? 'From code and intent to evidence' : 'Del código y la intención a la evidencia'} onPointerMove={event => {
    if (event.pointerType !== 'mouse' || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const box = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - box.left) / box.width
    const y = (event.clientY - box.top) / box.height
    event.currentTarget.style.setProperty('--spot-x', `${x * 100}%`)
    event.currentTarget.style.setProperty('--spot-y', `${y * 100}%`)
    const core = event.currentTarget.querySelector<HTMLElement>('.journey-core')
    if (core) core.style.transform = `translate(${(x - .5) * 22}px, ${(y - .5) * 22}px)`
  }} onPointerLeave={event => {
    setActive(null)
    event.currentTarget.style.removeProperty('--spot-x')
    event.currentTarget.style.removeProperty('--spot-y')
    const core = event.currentTarget.querySelector<HTMLElement>('.journey-core')
    if (core) core.style.transform = ''
  }}>
    <svg className="journey-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M13 26 L35 12 L77 24 L84 72 L50 95 L15 73 Z" /><path d="M13 26 L50 49 M35 12 L50 49 M77 24 L50 49 M84 72 L50 49 M50 95 L50 49 M15 73 L50 49" /></svg>
    <div className="journey-core"><span>SOFTWARE<br />ENGINEERING <b>2.0</b></span><p>{active === null ? (en ? 'Intent → software → evidence' : 'Intención → software → evidencia') : stages[active][1]}</p></div>
    {stages.map(([label], i) => <button key={label} type="button" className="journey-node" data-active={active === i} style={{ left: `${positions[i][0]}%`, top: `${positions[i][1]}%`, animationDelay: `${i * 90}ms` }} aria-pressed={active === i} aria-label={`${label}. ${stages[i][1]}`} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setActive(i)}><span aria-hidden="true">◆</span>{label}</button>)}
  </section>
}

export function RepoStructure({ language }: { language: Language }) {
  const [active, setActive] = useState(0)
  const en = language === 'en'
  const files = [
    { path: 'AGENTS.md', name: 'AGENTS.md', branch: '├─', tone: 'violet', detail: [ 'Mapa breve: dónde están las reglas y qué leer antes de cambiar código.', 'A short map: where the rules live and what to read before changing code.' ], hints: ['Contexto siempre disponible', 'Always-available context'] },
    { path: 'CLAUDE.md', name: 'CLAUDE.md', branch: '├─', tone: 'violet', detail: ['Entrada para asistentes que usan este nombre; puede remitir al mapa común.', 'Entry point for assistants using this name; it can point to the shared map.'], hints: ['Evita duplicar reglas', 'Avoid duplicated rules'] },
    { path: '.github/', name: '.github/', branch: '├─', tone: 'cyan', detail: ['Instrucciones específicas para archivos o zonas del repositorio.', 'Instructions scoped to files or areas of the repository.'], hints: ['instructions/*.instructions.md', 'instructions/*.instructions.md'] },
    { path: '.github/instructions/', name: 'instructions/', branch: '│  └─', tone: 'cyan', detail: ['Reglas que se aplican solo cuando se trabaja en rutas concretas.', 'Rules applied only when working in matching paths.'], hints: ['Contexto por ámbito', 'Scoped context'] },
    { path: '.agents/', name: '.agents/', branch: '├─', tone: 'teal', detail: ['Capacidades reutilizables para tareas concretas.', 'Reusable capabilities for specific tasks.'], hints: ['Se cargan cuando hacen falta', 'Loaded when needed'] },
    { path: '.agents/skills/', name: 'skills/', branch: '│  └─', tone: 'teal', detail: ['Cada skill encapsula instrucciones, recursos y, si procede, scripts.', 'Each skill bundles instructions, resources and scripts when needed.'], hints: ['Una tarea, una capacidad', 'One task, one capability'] },
    { path: 'src/', name: 'src/', branch: '├─', tone: 'blue', detail: ['Código de producción: el comportamiento que entregamos.', 'Production code: the behaviour we deliver.'], hints: ['Implementación', 'Implementation'] },
    { path: 'tests/', name: 'tests/', branch: '├─', tone: 'green', detail: ['Pruebas ejecutables: comprueban el comportamiento sin confundirlo con la implementación.', 'Executable tests: check behaviour without confusing it with implementation.'], hints: ['Evidencia separada', 'Separate evidence'] },
    { path: 'docs/', name: 'docs/', branch: '└─', tone: 'amber', detail: ['Conocimiento duradero, versionado junto al código.', 'Durable knowledge versioned alongside the code.'], hints: ['Producto · arquitectura · diseño', 'Product · architecture · design'] },
    { path: 'docs/product/', name: 'product/', branch: '   ├─', tone: 'amber', detail: ['Qué queremos construir: actores, casos de uso, reglas y comportamiento.', 'What we want to build: actors, use cases, rules and behaviour.'], hints: ['El QUÉ', 'The WHAT'] },
    { path: 'docs/architecture/', name: 'architecture/', branch: '   ├─', tone: 'orange', detail: ['Cómo encaja: contexto, bloques, decisiones y atributos de calidad.', 'How it fits: context, building blocks, decisions and quality attributes.'], hints: ['El CÓMO', 'The HOW'] },
    { path: 'docs/design/', name: 'design/', branch: '   └─', tone: 'pink', detail: ['Experiencia de uso, interfaces y sistema visual.', 'User experience, interfaces and visual system.'], hints: ['La EXPERIENCIA', 'The EXPERIENCE'] },
  ] as const
  const selected = files[active]
  return <div className="repo-layout">
    <div className="repo-tree" aria-label={en ? 'Example repository tree' : 'Árbol de un repositorio de ejemplo'}>
      <span className="tree-head">project/</span>
      {files.map((file, i) => <button key={file.path} type="button" className="repo-entry" data-tone={file.tone} aria-pressed={active === i} aria-label={`${file.path}. ${file.detail[en ? 1 : 0]}`} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setActive(i)}><span aria-hidden="true">{file.branch}</span>{file.name}</button>)}
    </div>
    <div className="repo-inspector" data-tone={selected.tone} aria-live="polite">
      <span className="section-label">{en ? 'IN THE REPOSITORY' : 'EN EL REPOSITORIO'}</span>
      <h2>{selected.path}</h2>
      <p>{selected.detail[en ? 1 : 0]}</p>
      <span className="repo-hint">{selected.hints[en ? 1 : 0]}</span>
    </div>
  </div>
}

export function SddOverview({ language }: { language: Language }) {
  const [active, setActive] = useState(0)
  const en = language === 'en'
  const steps = en ? [
    ['✎', 'Specify', 'Capture the intended outcome, constraints and examples.'],
    ['◇', 'Plan', 'Choose an approach and make the trade-offs explicit.'],
    ['☷', 'Tasks', 'Split the plan into reviewable, testable work.'],
    ['⟨/⟩', 'Implement', 'Change code, run checks and return evidence.'],
  ] : [
    ['✎', 'Especificar', 'Captura el resultado, los límites y ejemplos concretos.'],
    ['◇', 'Planificar', 'Elige una solución y haz visibles los compromisos.'],
    ['☷', 'Tareas', 'Divide el plan en trabajo revisable y verificable.'],
    ['⟨/⟩', 'Implementar', 'Cambia código, ejecuta pruebas y devuelve evidencia.'],
  ]
  return <div className="sdd-layout">
    <section className="sdd-flow" aria-label={en ? 'Spec-driven development flow' : 'Flujo de desarrollo guiado por especificaciones'}>
      <p className="section-label">{en ? 'INTENT BECOMES SOFTWARE' : 'DE LA INTENCIÓN AL SOFTWARE'}</p>
      <div className="sdd-steps">{steps.map(([icon, label], index) => <button type="button" className="sdd-step" data-active={active === index} key={label} aria-pressed={active === index} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={() => setActive(index)}><span className="sdd-icon" aria-hidden="true">{icon}</span><small>{String(index + 1).padStart(2, '0')}</small><strong>{label}</strong></button>)}</div>
      <p className="sdd-message" aria-live="polite"><span>{String(active + 1).padStart(2, '0')} / 04</span>{steps[active][2]}</p>
    </section>
    <section className="sdd-tools" aria-label={en ? 'Three examples of SDD tools' : 'Tres ejemplos de herramientas SDD'}>
      <p className="section-label">{en ? 'EXAMPLES' : 'EJEMPLOS'}</p>
      <div className="sdd-tool-grid">
        <a href="https://github.com/Fission-AI/OpenSpec" target="_blank" rel="noopener noreferrer"><img src={openspec} alt="" /><strong>OpenSpec ↗</strong></a>
        <a href="https://github.com/github/spec-kit" target="_blank" rel="noopener noreferrer"><img src={specKit} alt="" /><strong>GitHub Spec Kit ↗</strong></a>
        <a href="https://kiro.dev/" target="_blank" rel="noopener noreferrer"><img src={kiro} alt="" /><strong>Kiro ↗</strong></a>
      </div>
    </section>
  </div>
}

export function TerminalCase({ language, variant }: { language: Language; variant: 'specs' | 'metric' }) {
  const en = language === 'en'
  const specs = variant === 'specs'
  const command = specs ? 'grep -rn -i "refund" openspec/specs' : `rg "${en ? 'net_sales' : 'ventas_netas'}" .`
  const lines = specs ? [
    'billing:  30 days from purchase',
    'checkout: 30 days from delivery',
    'support:  less than a month',
  ] : en ? ['finance: gross - refunds - discounts', 'sales:   gross - discounts', 'close:   sum(invoiced) # no credits'] : ['finanzas: bruto - devoluciones - descuentos', 'comercial: bruto - descuentos', 'cierre:    sum(facturado) # sin abonos']
  return <div className="case-layout">
    <div className="terminal" role="region" aria-label={en ? 'Console showing conflicting definitions' : 'Consola con definiciones divergentes'} tabIndex={0}>
      <div className="terminal-top"><span></span><span></span><span></span><b>bash</b></div>
      <div className="terminal-body"><p><span>user@home</span>:~$ {command}</p>{lines.map(line => <p key={line}>{line}</p>)}<p><span>user@home</span>:~$ <i aria-hidden="true">▍</i></p></div>
    </div>
    <div className="case-story">{specs ? <><p className="section-label">{en ? 'A REAL CASE' : 'UN CASO REAL'}</p><h2>{en ? '160 specs. Three truths.' : '160 specs. Tres verdades.'}</h2><p>{en ? 'The same rule differed across teams: VAT, runtime schema and even a security gap.' : 'La misma regla divergía entre equipos: IVA, esquema en runtime y hasta un agujero de seguridad.'}</p><blockquote>{en ? '“Forbidden and mandatory” in the same file.' : '«Prohibido y obligatorio» en el mismo fichero.'}</blockquote><a href="https://jgcarmona.com/en/i-tried-to-prove-pdac-wrong/">{en ? 'Read the case ↗' : 'Leer el caso ↗'}</a></> : <><p className="section-label">{en ? 'THE DECISION' : 'LA DECISIÓN'}</p><h2>{en ? 'Which one wins?' : '¿Cuál manda?'}</h2><p>{en ? 'Three consumers calculate net sales differently. Define the KPI once, with a stable ID; code and reports cite it.' : 'Tres consumidores calculan las ventas netas de forma diferente. Define el KPI una vez, con ID estable; código e informes lo citan.'}</p></>}</div>
  </div>
}

const arcSections = [
  ['Introducción y objetivos', 'Introduction and goals', 'Objetivos de negocio, calidad y alcance.', 'Business goals, quality goals and scope.'],
  ['Restricciones', 'Constraints', 'Límites técnicos, organizativos y de proceso.', 'Technical, organisational and process limits.'],
  ['Contexto y alcance', 'Context and scope', 'Personas, sistemas vecinos y fronteras.', 'People, neighbouring systems and boundaries.'],
  ['Estrategia de solución', 'Solution strategy', 'Decisiones fundamentales que orientan el diseño.', 'Fundamental decisions guiding the design.'],
  ['Bloques de construcción', 'Building blocks', 'Componentes estáticos y responsabilidades.', 'Static components and responsibilities.'],
  ['Vista de ejecución', 'Runtime view', 'Interacciones y secuencias en tiempo de ejecución.', 'Runtime interactions and sequences.'],
  ['Vista de despliegue', 'Deployment view', 'Infraestructura, nodos y distribución.', 'Infrastructure, nodes and deployment.'],
  ['Conceptos transversales', 'Crosscutting concepts', 'Patrones compartidos: seguridad, datos, errores.', 'Shared patterns: security, data and errors.'],
  ['Decisiones', 'Decisions', 'ADRs: opciones, consecuencias y por qué.', 'ADRs: options, consequences and rationale.'],
  ['Requisitos de calidad', 'Quality requirements', 'Escenarios y atributos verificables.', 'Scenarios and verifiable attributes.'],
  ['Riesgos y deuda técnica', 'Risks and debt', 'Incógnitas, compromisos y trabajo pendiente.', 'Unknowns, compromises and pending work.'],
  ['Glosario', 'Glossary', 'Términos que evitan malentendidos.', 'Terms that prevent misunderstandings.'],
] as const

export function Arc42Overview({ language }: { language: Language }) {
  const [active, setActive] = useState<number | null>(null)
  const en = language === 'en'
  return <div className="arc-overview">
    <p className="section-label">arc42 · {en ? '12 SECTIONS' : '12 SECCIONES'}</p>
    <div className="arc-grid">{arcSections.map((section, i) => <button key={i} type="button" className="arc-item" data-family={i < 3 || i === 9 ? 'intent' : i < 7 ? 'structure' : i < 10 ? 'decision' : 'reference'} aria-label={`${i + 1}. ${section[en ? 1 : 0]}. ${section[en ? 3 : 2]}`} aria-pressed={active === i} onMouseEnter={() => setActive(i)} onMouseLeave={event => { if (document.activeElement !== event.currentTarget) setActive(null) }} onFocus={() => setActive(i)} onBlur={() => setActive(null)} onClick={() => setActive(active === i ? null : i)}><span>{String(i + 1).padStart(2, '0')}</span><strong>{section[en ? 1 : 0]}</strong>{active === i && <span className={`node-popover${i >= 6 ? ' arc-popover-left' : ''}`} role="tooltip"><strong>{section[en ? 1 : 0]}</strong>{section[en ? 3 : 2]}</span>}</button>)}</div>
    <p className="arc-footer">{en ? 'A shared map for humans and agents.' : 'Un mapa compartido para personas y agentes.'} <a href="https://arc42.org/">arc42 ↗</a></p>
  </div>
}
