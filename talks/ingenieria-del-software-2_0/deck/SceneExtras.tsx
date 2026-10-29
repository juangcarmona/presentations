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
    ['Intent', 'What should exist, and for whom?'],
    ['Architecture', 'How does it fit together?'],
    ['Code', 'The system we actually build.'],
    ['Guardrails', 'Guidance and checks keep change within bounds.'],
    ['Delivery', 'Make the change available.'],
    ['Evidence', 'Test and review what actually works.'],
    ['Maintenance', 'Keep the system useful as needs change.'],
  ] : [
    ['Intención', '¿Qué queremos construir y para quién?'],
    ['Arquitectura', '¿Cómo encaja todo?'],
    ['Código', 'El sistema que realmente construimos.'],
    ['Guardarraíles', 'Guías y controles mantienen el cambio dentro de límites.'],
    ['Entrega', 'Ponemos el cambio a disposición.'],
    ['Evidencia', 'Probamos y revisamos lo que funciona.'],
    ['Mantenimiento', 'Mantenemos el sistema útil cuando cambian las necesidades.'],
  ]
  const positions = [[15, 31], [43, 23], [75, 31], [82, 61], [57, 77], [26, 76], [12, 58]]
  return <section className="journey-map" aria-label={en ? 'Interconnected software engineering disciplines' : 'Disciplinas interconectadas de ingeniería del software'} onPointerMove={event => {
    if (event.pointerType !== 'mouse' || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const box = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - box.left) / box.width
    const y = (event.clientY - box.top) / box.height
    event.currentTarget.style.setProperty('--spot-x', `${x * 100}%`)
    event.currentTarget.style.setProperty('--spot-y', `${y * 100}%`)
  }} onPointerLeave={event => {
    setActive(null)
    event.currentTarget.style.removeProperty('--spot-x')
    event.currentTarget.style.removeProperty('--spot-y')
  }}>
    <div className="journey-core"><span>SOFTWARE ENGINEERING <b>2.0</b></span></div>
    <svg className="journey-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M15 31 L43 23 L75 31 L82 61 L57 77 L26 76 L12 58 Z" /><path d="M15 31 L75 31 M43 23 L57 77 M75 31 L26 76 M82 61 L12 58 M15 31 L57 77" /></svg>
    {stages.map(([label], i) => <button key={label} type="button" className="journey-node" data-active={active === i} style={{ left: `${positions[i][0]}%`, top: `${positions[i][1]}%`, animationDelay: `${i * 90}ms` }} aria-pressed={active === i} aria-label={`${label}. ${stages[i][1]}`} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setActive(i)}><span aria-hidden="true">◆</span>{label}</button>)}
    <p className="journey-insight" aria-live="polite">{active === null ? (en ? 'Everything is connected.' : 'Todo está interconectado.') : stages[active][1]}</p>
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
  const [framework, setFramework] = useState<number | null>(null)
  const en = language === 'en'
  const frameworks = [
    { name: 'OpenSpec', image: openspec, href: 'https://github.com/Fission-AI/OpenSpec/blob/main/docs/workflows.md', description: en ? 'A change proposal carries planning artifacts; apply it, then sync and archive the result.' : 'Una propuesta reúne los artefactos del cambio; se aplica y después se sincroniza y archiva.', flow: ['Explore?', 'Propose', 'Apply', 'Sync?', 'Archive'] },
    { name: 'GitHub Spec Kit', image: specKit, href: 'https://github.com/github/spec-kit/blob/main/docs/quickstart.md', description: en ? 'A project constitution guides feature specs, plans and tasks; converge checks the result.' : 'Una constitución de proyecto guía las specs, los planes y las tareas; converge comprueba el resultado.', flow: ['Constitution¹', 'Specify', 'Plan', 'Tasks', 'Implement', 'Converge'] },
    { name: 'Kiro', image: kiro, href: 'https://kiro.dev/docs/specs/feature-specs/', description: en ? 'Feature Specs review requirements, technical design and tasks before executing them. Design-first is also available.' : 'Las Feature Specs revisan requisitos, diseño técnico y tareas antes de ejecutarlas. También existe el flujo que empieza por diseño.', flow: ['Requirements', 'Design', 'Tasks', 'Execute'] },
  ]
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
    {framework === null ? <section className="sdd-flow" aria-label={en ? 'Spec-driven development flow' : 'Flujo de desarrollo guiado por especificaciones'}>
      <p className="sdd-definition">{en ? 'Describe the intended change before coding; use the spec to guide planning, implementation and review.' : 'Describe el cambio antes de programar; la spec guía la planificación, la implementación y la revisión.'}</p>
      <p className="section-label">{en ? 'A GENERAL WAY TO WORK' : 'UNA FORMA GENERAL DE TRABAJAR'}</p>
      <div className="sdd-steps">{steps.map(([icon, label], index) => <button type="button" className="sdd-step" data-active={active === index} key={label} aria-pressed={active === index} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={() => setActive(index)}><span className="sdd-icon" aria-hidden="true">{icon}</span><small>{String(index + 1).padStart(2, '0')}</small><strong>{label}</strong></button>)}</div>
      <p className="sdd-message" aria-live="polite"><span>{String(active + 1).padStart(2, '0')} / 04</span>{steps[active][2]}</p>
    </section> : <section className="sdd-framework-detail" id="sdd-framework-detail" aria-label={frameworks[framework].name}>
      <div className="sdd-framework-head"><img src={frameworks[framework].image} alt="" /><span className="section-label">{en ? 'FRAMEWORK WORKFLOW' : 'FLUJO DEL FRAMEWORK'}</span><h2>{frameworks[framework].name}</h2></div>
      <p>{frameworks[framework].description}</p>
      <ol aria-label={en ? 'Framework workflow' : 'Flujo del framework'}>{frameworks[framework].flow.map(step => <li key={step}>{step}</li>)}</ol>
      <a href={frameworks[framework].href} target="_blank" rel="noopener noreferrer">{en ? 'Official workflow ↗' : 'Flujo oficial ↗'}</a><small>{framework === 1 ? (en ? '¹ Once per project' : '¹ Una vez por proyecto') : framework === 0 ? (en ? '? Optional' : '? Opcional') : ''}</small>
    </section>}
    <section className="sdd-tools" aria-label={en ? 'Three SDD frameworks' : 'Tres frameworks SDD'}>
      <p className="section-label">{en ? 'THREE FRAMEWORKS · THREE WORKFLOWS' : 'TRES FRAMEWORKS · TRES FLUJOS'}</p>
      <div className="sdd-tool-grid">
        {frameworks.map((item, index) => <button key={item.name} type="button" aria-expanded={framework === index} aria-controls={framework === index ? 'sdd-framework-detail' : undefined} onClick={() => setFramework(framework === index ? null : index)}><img src={item.image} alt="" /><strong>{item.name}</strong><span aria-hidden="true">{framework === index ? '−' : '+'}</span></button>)}
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
  return <div className="case-wrap">{specs && <p className="case-subtitle">{en ? 'Each spec describes a change, not the product.' : 'Cada spec describe un cambio, no el producto.'}</p>}<div className="case-layout">
    <div className="terminal" role="region" aria-label={en ? 'Console showing conflicting definitions' : 'Consola con definiciones divergentes'} tabIndex={0}>
      <div className="terminal-top"><span></span><span></span><span></span><b>bash</b></div>
      <div className="terminal-body"><p><span>user@home</span>:~$ {command}</p>{lines.map(line => <p key={line}>{line}</p>)}<p><span>user@home</span>:~$ <i aria-hidden="true">▍</i></p></div>
    </div>
    <div className="case-story">{specs ? <><p className="section-label">{en ? 'A REAL CASE' : 'UN CASO REAL'}</p><h2>{en ? '160 specs. Three truths.' : '160 specs. Tres verdades.'}</h2><p>{en ? 'The same rule differed across teams: VAT, runtime schema and even a security gap.' : 'La misma regla divergía entre equipos: IVA, esquema en runtime y hasta un agujero de seguridad.'}</p><blockquote>{en ? '“Forbidden and mandatory” in the same file.' : '«Prohibido y obligatorio» en el mismo fichero.'}</blockquote><a href="https://jgcarmona.com/en/i-tried-to-prove-pdac-wrong/">{en ? 'Read the case ↗' : 'Leer el caso ↗'}</a></> : <><p className="section-label">{en ? 'THE DECISION' : 'LA DECISIÓN'}</p><h2>{en ? 'Which one wins?' : '¿Cuál manda?'}</h2><p>{en ? 'Three consumers calculate net sales differently. Define the KPI once, with a stable ID; code and reports cite it.' : 'Tres consumidores calculan las ventas netas de forma diferente. Define el KPI una vez, con ID estable; código e informes lo citan.'}</p></>}</div>
  </div></div>
}

export function OriginsMap({ language }: { language: Language }) {
  const [active, setActive] = useState(0)
  const en = language === 'en'
  const sources = en ? [
    ['Git · Markdown · Schema', 'Versioned files', 'BR-REFUND-001.md has a readable diff; YAML metadata is checked in CI.'],
    ['Requirements · DDD', 'Identity and meaning', 'BR-REFUND-001 keeps its ID and governs UC-REFUND, even if the file moves.'],
    ['Configuration management', 'Accepted change', 'CHG-REFUND-002 proposes 30 → 14 days; a human-reviewed merge establishes the next baseline.'],
    ['Traceability · graphs', 'Impact, not guesses', 'Citations in specs and tests become stale; the impact graph scopes agent context.'],
  ] : [
    ['Git · Markdown · Schema', 'Ficheros versionados', 'BR-REFUND-001.md tiene un diff legible; CI valida sus metadatos YAML.'],
    ['Requisitos · DDD', 'Identidad y significado', 'BR-REFUND-001 conserva su ID y gobierna UC-REFUND aunque cambie de ruta.'],
    ['Gestión de configuración', 'Cambio aceptado', 'CHG-REFUND-002 propone 30 → 14 días; el merge revisado por una persona establece la nueva baseline.'],
    ['Trazabilidad · grafos', 'Impacto, no conjeturas', 'Las citas en specs y tests quedan obsoletas; el grafo acota el contexto del agente.'],
  ]
  return <div className="origins-map">
    <div className="origins-sources" aria-label={en ? 'Engineering disciplines' : 'Disciplinas de ingeniería'}>{sources.map(([source, label], i) => <button key={source} type="button" className="origins-source" data-active={active === i} aria-pressed={active === i} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setActive(i)}><span>{String(i + 1).padStart(2, '0')} / {source}</span><strong>{label}</strong></button>)}</div>
    <div className="origins-result" aria-live="polite"><span className="section-label">{en ? 'ASSEMBLED AROUND ONE RULE' : 'REUNIDO EN UNA SOLA REGLA'}</span><strong>BR-REFUND-001</strong><p>{sources[active][2]}</p><a href="https://pdac.dev/articles/what-product-definition-as-code-puts-together/" target="_blank" rel="noopener noreferrer">{en ? 'Read the lineage ↗' : 'Leer el origen ↗'}</a></div>
  </div>
}

const arcSections = [
  ['Introducción y objetivos', 'Introduction and goals', 'Requisitos fundamentales, objetivos de calidad y alcance del sistema.', 'Fundamental requirements, quality goals and system scope.'],
  ['Restricciones', 'Constraints', 'Límites técnicos, organizativos y regulatorios que condicionan el diseño.', 'Technical, organisational and regulatory limits that shape the design.'],
  ['Contexto y alcance', 'Context and scope', 'Frontera del sistema, actores externos e interfaces con otros sistemas.', 'System boundary, external actors and interfaces with neighbouring systems.'],
  ['Estrategia de solución', 'Solution strategy', 'Ideas esenciales y enfoques elegidos para satisfacer los objetivos.', 'Core ideas and approaches chosen to meet the goals.'],
  ['Bloques de construcción', 'Building blocks', 'Estructura estática, responsabilidades y descomposición en módulos.', 'Static structure, responsibilities and decomposition into modules.'],
  ['Vista de ejecución', 'Runtime view', 'Escenarios importantes: cómo colaboran los bloques en tiempo de ejecución.', 'Important scenarios: how building blocks collaborate at runtime.'],
  ['Vista de despliegue', 'Deployment view', 'Dónde se ejecuta: infraestructura, nodos y distribución del software.', 'Where it runs: infrastructure, nodes and software deployment.'],
  ['Conceptos transversales', 'Crosscutting concepts', 'Patrones y decisiones compartidas: seguridad, datos, errores y operaciones.', 'Shared patterns and decisions: security, data, errors and operations.'],
  ['Decisiones', 'Decisions', 'Decisiones importantes, alternativas consideradas y sus consecuencias.', 'Important decisions, alternatives considered and their consequences.'],
  ['Requisitos de calidad', 'Quality requirements', 'Atributos de calidad expresados mediante escenarios verificables.', 'Quality attributes expressed through verifiable scenarios.'],
  ['Riesgos y deuda técnica', 'Risks and debt', 'Problemas conocidos, incertidumbres y compromisos todavía pendientes.', 'Known problems, uncertainties and outstanding compromises.'],
  ['Glosario', 'Glossary', 'Términos específicos que el equipo debe entender de la misma manera.', 'Specific terms the team must understand in the same way.'],
] as const

export function Arc42Overview({ language }: { language: Language }) {
  const [active, setActive] = useState<number | null>(null)
  const en = language === 'en'
  return <div className="arc-overview"><div className="arc-layout">
    <div className="arc-grid" aria-label={en ? 'The twelve arc42 sections' : 'Las doce secciones de arc42'}>{arcSections.map((section, i) => <button key={i} type="button" className="arc-item" data-family={i < 3 || i === 9 ? 'intent' : i < 7 ? 'structure' : i < 10 ? 'decision' : 'reference'} aria-label={`${i + 1}. ${section[en ? 1 : 0]}. ${section[en ? 3 : 2]}`} aria-pressed={active === i} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setActive(i)}><span>{String(i + 1).padStart(2, '0')}</span><strong>{section[en ? 1 : 0]}</strong></button>)}</div>
    <aside className="arc-detail" aria-live="polite"><span className="section-label">arc42 / {active === null ? '01–12' : String(active + 1).padStart(2, '0')}</span><p>{active === null ? (en ? 'Twelve sections. Focus one to see what belongs there.' : 'Doce secciones. Selecciona una para ver qué documenta.') : arcSections[active][en ? 3 : 2]}</p><a href="https://arc42.org/overview/" target="_blank" rel="noopener noreferrer">{en ? 'Explore arc42 ↗' : 'Explorar arc42 ↗'}</a></aside>
  </div></div>
}
