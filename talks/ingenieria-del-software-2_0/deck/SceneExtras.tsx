import { useState } from 'react'
import openspec from './openspec-icon.png'
import specKit from './spec-kit-logo.webp'
import kiro from './kiro-logo.png'

export const sddImages = [openspec, specKit, kiro]

type Language = 'es' | 'en'

export function RepoStructure({ language }: { language: Language }) {
  const en = language === 'en'
  return <div className="repo-layout">
    <div className="repo-tree" role="img" aria-label={en ? 'Repository: context, code and knowledge' : 'Repositorio: contexto, código y conocimiento'}>
      <span className="tree-head">project/</span>
      <span>├─ <b>AGENTS.md</b> <em>context</em></span>
      <span>├─ <b>src/</b> <em>code</em></span>
      <span>├─ <b>tests/</b> <em>proof</em></span>
      <span>└─ <b>docs/</b> <em>knowledge</em></span>
      <span className="tree-child">├─ product/</span>
      <span className="tree-child">└─ architecture/</span>
    </div>
    <div className="repo-reasons">
      <section><span>01 / {en ? 'CONTEXT' : 'CONTEXTO'}</span><h2>AGENTS.md</h2><p>{en ? 'A short map for the assistant: where to find the rules. Not a dump of the whole repository.' : 'Un mapa breve para el asistente: dónde encontrar las reglas. No un volcado de todo el repositorio.'}</p></section>
      <section><span>02 / {en ? 'CODE' : 'CÓDIGO'}</span><h2>src/ + tests/</h2><p>{en ? 'Implementation and executable proof stay separate so a change can be checked.' : 'Implementación y pruebas ejecutables separadas para poder comprobar cada cambio.'}</p></section>
      <section><span>03 / {en ? 'KNOWLEDGE' : 'CONOCIMIENTO'}</span><h2>docs/</h2><p>{en ? 'Product says what; architecture explains how. Both are versioned next to the code.' : 'Producto dice qué; arquitectura explica cómo. Ambos versionados junto al código.'}</p></section>
    </div>
  </div>
}

export function SddOverview({ language }: { language: Language }) {
  const en = language === 'en'
  const steps = en ? [['✎', 'Specify'], ['▦', 'Plan'], ['☷', 'Tasks'], ['⟨/⟩', 'Implement']] : [['✎', 'Especificar'], ['▦', 'Planificar'], ['☷', 'Tareas'], ['⟨/⟩', 'Implementar']]
  return <div className="sdd-layout">
    <section className="sdd-flow" aria-label={en ? 'Spec-driven development flow' : 'Flujo de desarrollo guiado por especificaciones'}>
      <p className="section-label">{en ? 'THE FLOW' : 'EL FLUJO'}</p>
      <div className="sdd-steps">{steps.map(([icon, label], index) => <div className="sdd-step" key={label}><span className="sdd-icon" aria-hidden="true">{icon}</span><small>{String(index + 1).padStart(2, '0')}</small><strong>{label}</strong></div>)}</div>
      <p className="sdd-message">{en ? 'Write the intent before generating code.' : 'Escribe la intención antes de generar código.'}</p>
    </section>
    <section className="sdd-tools" aria-label={en ? 'Three examples of SDD tools' : 'Tres ejemplos de herramientas SDD'}>
      <p className="section-label">{en ? 'THREE IMPLEMENTATIONS' : 'TRES PROPUESTAS'}</p>
      <div className="sdd-tool-grid">
        <a href="https://github.com/Fission-AI/OpenSpec"><img src={openspec} alt="" /><strong>OpenSpec</strong><span>{en ? 'Living specs and proposed changes' : 'Specs vivas y cambios propuestos'}</span></a>
        <a href="https://github.com/github/spec-kit"><img src={specKit} alt="" /><strong>GitHub Spec Kit</strong><span>{en ? 'Constitution, spec, plan and tasks' : 'Constitución, spec, plan y tareas'}</span></a>
        <a href="https://kiro.dev/"><img src={kiro} alt="" /><strong>Kiro</strong><span>{en ? 'Requirements and design in the IDE' : 'Requisitos y diseño en el IDE'}</span></a>
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
